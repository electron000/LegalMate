import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCaseByNumber, getHearingsByCaseId, getNotesByCaseId, addNote, addHearing, deleteCase } from '../../../../api';
import CaseModal from './components/caseModal';
import { 
  Plus, Gavel, Calendar, Trash2, Clock, 
  CheckCircle2, AlertCircle, Send, FileText, ArrowLeft,
  AlertTriangle 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import './CaseDetails.css';

const CaseDetails = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  
  // Modal States
  const [isHearingModalOpen, setIsHearingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [caseInfo, setCaseInfo] = useState(null);
  const [hearings, setHearings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const notesContainerRef = useRef(null);

  // Prevent scrolling when any modal is open
  useEffect(() => {
    if (isHearingModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isHearingModalOpen, isDeleteModalOpen]);

  const loadCaseData = useCallback(async () => {
    try {
      const cInfo = await getCaseByNumber(caseNumber);
      if (!cInfo) throw new Error("Case not found");
      setCaseInfo(cInfo);

      const [hData, nData] = await Promise.all([
        getHearingsByCaseId(cInfo.id),
        getNotesByCaseId(cInfo.id)
      ]);

      const sortedHearings = (hData || []).sort((a, b) => new Date(a.hearing_date) - new Date(b.hearing_date));
      setHearings(sortedHearings);
      setNotes(nData || []);
    } catch (error) {
      console.error("Error loading case details:", error);
    } finally {
      setLoading(false);
    }
  }, [caseNumber]);

  useEffect(() => {
    loadCaseData();
  }, [loadCaseData]); 

  useEffect(() => {
    if (notesContainerRef.current) {
      const { scrollHeight, clientHeight } = notesContainerRef.current;
      notesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'auto' 
      });
    }
  }, [notes]);

  const validHearings = useMemo(() => {
    if (!caseInfo || !hearings) return [];
    return hearings.filter(h => h.case_id === caseInfo.id);
  }, [hearings, caseInfo]);

  const handleNoteSubmit = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const content = e.target.value.trim();
      if (!content) return;

      try {
        await addNote({ case_id: caseInfo.id, content: content });
        e.target.value = '';
        const updatedNotes = await getNotesByCaseId(caseInfo.id);
        setNotes(updatedNotes);
      } catch (error) {
        console.error("Failed to add note", error);
      }
    }
  };

  const handleHearingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addHearing({
        case_id: caseInfo.id,
        hearing_date: formData.get('hearing_date'),
        status: formData.get('status'),
        description: formData.get('description'),
        result: "Pending",
      });
      await loadCaseData();
      setIsHearingModalOpen(false);
    } catch (error) {
      console.error("Failed to add hearing", error);
    }
  };

  const confirmDeleteCase = async () => {
    try {
      await deleteCase(caseInfo.id);
      navigate('/case-management/clients');
    } catch (error) {
      alert("Failed to delete case: " + error.message);
      setIsDeleteModalOpen(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-default';
    
    switch (status.toLowerCase()) {
      case 'open': 
      case 'scheduled': return 'status-badge-lg open';
      case 'closed': return 'status-badge-lg closed';
      case 'completed': return 'status-badge-lg completed';
      case 'pending': return 'status-badge-lg pending';
      case 'ongoing': return 'status-badge-lg ongoing';
      case 'judgment': return 'status-badge-lg judgment';
      case 'cancelled':
      case 'adjourned': return 'status-badge-lg cancelled';
      default: return 'status-badge-lg pending';
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center h-full text-gray-500"> <Loader2 className="spinner" size={20} />Loading Case Files...</div>;
  if (!caseInfo) return <div className="p-8 text-red-500 font-bold">Case not found.</div>;

  return (
    <div className="case-details-container">
      <div className="nav-bar">
        <button 
          onClick={() => navigate('/case-management/clients')}
          className="back-btn"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="delete-case-btn"
          title="Delete Case"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
      <div className="case-header-card">
        <div className="header-left">
          <div className="header-status-row">
             <span className={getStatusClass(caseInfo.status)}>
              {caseInfo.status}
            </span>
            <span className="case-number-sub-mobile">#{caseInfo.case_number}</span>
          </div>
         
          <div className="case-info-group">
            <h1 className="case-title-main">{caseInfo.title}</h1>
            <span className="case-number-sub-desktop">#{caseInfo.case_number}</span>
          </div>
        </div>
        <div className="header-middle">
          <Gavel size={14} />
          <span className="court-name" title={caseInfo.court_name}>
            {caseInfo.court_name}
          </span>
        </div>
        <div className="header-right">
          <span className="next-hearing-label">Next Hearing:</span>
          <div className="next-hearing-date">
            <Calendar size={15} />
            <span className="font-mono">
              {caseInfo.next_hearing_date 
                ? format(parseISO(caseInfo.next_hearing_date), 'MMM dd, yyyy') 
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className="details-grid">
        <div className="panel-card timeline-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Clock size={18} className="text-gray-600"/> Case Timeline
            </h3>
            <button 
               onClick={() => setIsHearingModalOpen(true)}
               className="schedule-btn"
             >
               <Plus size={16}/> Schedule
             </button>
          </div>
          
          <div className="panel-content">
            <div className="timeline-wrapper">
              {validHearings.length === 0 && (
                <div className="empty-timeline">
                  <div className="empty-icon">
                    <Calendar size={24} className="text-gray-400"/>
                  </div>
                  <p className="text-gray-500 font-medium">No hearings.</p>
                  <p className="text-sm text-gray-400">Schedule one to start tracking.</p>
                </div>
              )}

              {validHearings.map((hearing, idx) => (
                <div key={hearing.id} className="timeline-item">
                  <div className={`timeline-dot ${idx === 0 ? 'latest' : 'past'}`}></div>

                  <div className="timeline-date-row">
                    <span className={`timeline-date ${idx === 0 ? 'text-gray-600' : 'text-gray-500'}`}>
                      {format(parseISO(hearing.hearing_date), 'MMM dd, yyyy')}
                    </span>
                    {idx === 0 && <span className="latest-badge">Latest</span>}
                  </div>

                  <div className="timeline-card">
                    <p className="hearing-desc">{hearing.description}</p>
                    <div className="hearing-footer">
                      <div className="status-chip">
                        {hearing.status === 'CLOSED' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                        {hearing.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: NOTES */}
        <div className="panel-card notes-panel">
           <div className="panel-header">
             <h3 className="panel-title">
               <FileText size={18} className="text-gray-500"/> Internal Notes
             </h3>
          </div>
          
          <div ref={notesContainerRef} className="notes-container">
            {notes.length === 0 && (
              <div className="empty-notes">
                <FileText size={32} />
                <p className="text-sm">No notes added yet.</p>
              </div>
            )}
            
            {notes.map((note) => (
              <div key={note.id} className="note-item">
                <div className="note-bubble">
                  <p className="note-text">{note.content}</p>
                </div>
                <span className="note-time">
                  {note.created_at ? format(parseISO(note.created_at), 'MMM dd, HH:mm') : 'Just now'}
                </span>
              </div>
            ))}
          </div>

          <div className="notes-input-area">
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="Type a note..." 
                className="note-input"
                onKeyDown={handleNoteSubmit}
              />
              <button className="send-btn">
                <Send size={14} />
              </button>
            </div>
            <p className="input-hint">Press Enter to save note</p>
          </div>
        </div>
      </div>

      <CaseModal 
        isOpen={isHearingModalOpen} 
        onClose={() => setIsHearingModalOpen(false)} 
        onSubmit={handleHearingSubmit}
        mode="HEARING"
      />

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={32} />
              </div>
              <h2 className="delete-modal-title">Delete Case?</h2>
              <p className="delete-modal-desc">
                Are you sure you want to delete <strong>{caseInfo.title}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="btn-modal-cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={confirmDeleteCase}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;