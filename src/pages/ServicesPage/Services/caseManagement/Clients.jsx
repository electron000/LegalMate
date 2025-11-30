import React, { useState, useEffect, useCallback } from 'react';
import { getAllClients, addClient, addCase, getCasesByClientId, deleteClient } from '../../../../api';
import { Plus, ChevronDown, FolderPlus, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CaseModal from './components/caseModal';
import './Clients.css';

// Custom SVG Icon Component
const TSGoToIcon = ({ uniqueId, 'aria-label': ariaLabel }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    className="ts-go-to-icon"
    aria-label={ariaLabel}
  >
    <g clipPath={`url(#clip0_ts_icon_${uniqueId})`}>
      <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" />
      <mask id={`mask0_ts_icon_${uniqueId}`} style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
        <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
      </mask>
      <g mask={`url(#mask0_ts_icon_${uniqueId})`}>
        <path d="M14.4717 25.9299C14.8232 26.2839 15.3932 26.2839 15.7447 25.9299L25.9468 15.6585C26.2984 15.3045 26.2984 14.7307 25.9468 14.3768C25.5953 14.0228 25.0253 14.0228 24.6737 14.3768L14.4717 24.6482C14.1201 25.0021 14.1201 25.576 14.4717 25.9299Z" fill="white"/>
        <path d="M25.3098 26.7987C25.8069 26.7987 26.2099 26.3929 26.2099 25.8924V15.0167C26.2099 14.5161 25.8069 14.1104 25.3098 14.1104H14.5075C14.0104 14.5161 13.6074 14.0104 13.6074 15.0167C13.6074 15.5173 14.0104 15.923 14.5075 15.923H24.4096V25.8924C24.4096 26.3929 24.8125 26.7987 25.3098 26.7987Z" fill="white"/>
      </g>
    </g>
    <defs>
      <clipPath id={`clip0_ts_icon_${uniqueId}`}>
        <rect width="40" height="40" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add/Edit Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null, // 'CLIENT' or 'CASE'
    clientId: null 
  });

  // Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    client: null
  });

  // Prevent scroll for both modals
  useEffect(() => {
    if (modalConfig.isOpen || deleteModalState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [modalConfig.isOpen, deleteModalState.isOpen]);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllClients();
      setClients(data || []);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // --- Modal Handlers ---

  const closeModal = () => {
    setModalConfig({ isOpen: false, mode: null, clientId: null });
  };

  const openAddClientModal = () => {
    setModalConfig({ isOpen: true, mode: 'CLIENT', clientId: null });
  };

  const openAddCaseModal = (clientId) => {
    setModalConfig({ isOpen: true, mode: 'CASE', clientId: clientId });
  };

  const promptDeleteClient = (client) => {
    setDeleteModalState({ isOpen: true, client });
  };

  const closeDeleteModal = () => {
    setDeleteModalState({ isOpen: false, client: null });
  };

  // --- Submission Handlers ---

  const handleAddClient = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addClient({
        name: formData.get('name'),
        contact: formData.get('contact'),
      });
      await fetchClients();
      closeModal();
    } catch {
      alert("Error adding client");
    }
  };

  const handleAddCase = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addCase({
        title: formData.get('title'),
        case_number: formData.get('case_number'),
        court_name: formData.get('court_name'),
        status: "OPEN",
        client_id: modalConfig.clientId,
        next_hearing_date: null
      });
      closeModal();
    } catch {
      alert("Error adding case");
    }
  };

  const handleConfirmDelete = async () => {
    const clientToDelete = deleteModalState.client;
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete.id);
      setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
      closeDeleteModal();
    } catch (error) {
      alert("Failed to delete client: " + error.message);
      closeDeleteModal();
    }
  };

  const handleModalSubmit = (e) => {
    if (modalConfig.mode === 'CLIENT') {
      handleAddClient(e);
    } else if (modalConfig.mode === 'CASE') {
      handleAddCase(e);
    }
  };

  if (isLoading) return <div className="p-8">Loading Clients...</div>;

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="page-title">Client Directory</h1>
        
        <button 
          onClick={openAddClientModal}
          className="add-btn"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      <CaseModal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        mode={modalConfig.mode}
        onSubmit={handleModalSubmit}
      />

      <div className="clients-table-card">
        <div className="table-responsive">
          <table className="clients-table">
            <thead>
              <tr>
                <th className="w-20 text-center">SL.</th>
                <th>Client Name</th>
                <th>Client Phone No.</th>
                <th className="w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {clients.length > 0 ? (
                clients.map((client, index) => (
                  <ClientRow 
                    key={client.id} 
                    client={client} 
                    index={index} 
                    onRequestDelete={promptDeleteClient} 
                    onAddCase={() => openAddCaseModal(client.id)}
                    refreshTrigger={modalConfig.isOpen === false} 
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-text">No clients found in the directory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModalState.isOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="warning-icon-wrapper">
                <AlertTriangle size={32} />
              </div>
              <h2 className="delete-modal-title">Delete Client?</h2>
              <p className="delete-modal-desc">
                Are you sure you want to delete <strong>{deleteModalState.client?.name}</strong>? 
                <br />
                <span className="text-red-500 font-medium">Warning:</span> This will permanently delete all associated cases and data for this client.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="btn-modal-cancel"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-confirm"
                onClick={handleConfirmDelete}
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CLIENT ROW COMPONENT ---
const ClientRow = ({ client, index, onRequestDelete, onAddCase, refreshTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCases = useCallback(async () => {
    if (!client.id) return;
    try {
      setCasesLoading(true);
      const data = await getCasesByClientId(client.id);
      setCases(data || []);
    } catch (error) {
      console.error("Error fetching cases", error);
    } finally {
      setCasesLoading(false);
    }
  }, [client.id]);

  useEffect(() => {
    if (isOpen) {
      fetchCases();
    }
  }, [isOpen, fetchCases, refreshTrigger]);

  return (
    <React.Fragment>
      {/* Main Row */}
      <tr className={`client-row ${isOpen ? 'expanded' : ''}`}>
        <td className="text-center font-medium sl-cell" data-label="SL.">{index + 1}</td>
        <td className="client-name" data-label="Client Name">{client.name}</td>
        <td data-label="Phone No.">{client.contact}</td>
        <td className="text-center action-cell" data-label="Action">
          <div className="action-cell-content">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete(client);
              }}
              className="icon-btn delete"
              title="Delete Client"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`icon-btn expand ${isOpen ? 'rotated' : ''}`}
              title={isOpen ? "Collapse" : "Expand"}
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Row (Nested Table) */}
      {isOpen && (
        <tr className="bg-gray-50 expanded-container-row">
          <td colSpan="4" className="expanded-row-content">
            <div className="expanded-inner">
              <div className="cases-header">
                <h4 className="cases-title">
                  <FolderPlus size={16} /> <span className="cases-title-text">Cases for {client.name}</span>
                </h4>
                <button 
                  onClick={onAddCase}
                  className="new-case-btn"
                >
                  <Plus size={14} /> <span className="btn-text">New Case</span>
                </button>
              </div>

              {/* Nested Table for Cases */}
              <div className="nested-table-container">
                <table className="cases-table">
                  <thead>
                    <tr>
                      <th className="w-1/4">Case No.</th>
                      <th className="w-1/2">Case Name</th>
                      <th className="w-1/4">Status</th>
                      <th className="text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casesLoading ? (
                      <tr><td colSpan="4" className="loading-text">Loading cases...</td></tr>
                    ) : cases.length > 0 ? (
                      cases.map((c) => (
                        <tr 
                          key={c.id} 
                          onClick={() => navigate(`/case-management/case/${encodeURIComponent(c.case_number)}`)}
                          className="case-row group"
                        >
                          <td className="case-number" data-label="Case No.">{c.case_number}</td>
                          <td className="case-title" data-label="Case Name">{c.title}</td>
                          <td data-label="Status">
                            <span className={`case-status ${c.status ? c.status.toLowerCase() : 'pending'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="text-center" data-label="Action">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/case-management/case/${encodeURIComponent(c.case_number)}`);
                              }}
                              className="action-btn-custom" 
                              style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto'
                              }}
                              title="Go to Case"
                            >
                              <TSGoToIcon uniqueId={c.id} aria-label="Go to Case" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="empty-text">No cases found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default Clients;