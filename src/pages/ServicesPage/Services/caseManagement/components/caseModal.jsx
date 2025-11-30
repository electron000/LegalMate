import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

// FIX: Remove 'initialData = {}' default value to prevent reference changes on re-renders
const CaseModal = ({ isOpen, onClose, onSubmit, mode, initialData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Only update state if modal opens or mode/initialData actually changes
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, mode, initialData]); // initialData is now stable if undefined

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // --- STRICTLY REMOVE SPECIAL CHARACTERS FROM CASE NUMBER ---
    if (name === 'case_number') {
      // Regex: Replaces anything that is NOT (^) a letter (a-z, A-Z) or number (0-9) with an empty string
      finalValue = value.replace(/[^a-zA-Z0-9]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'CLIENT': return 'Register New Client';
      case 'CASE': return 'Add New Case';
      case 'HEARING': return 'Schedule Hearing';
      default: return 'Modal';
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-[var(--primary-black)]">{getModalTitle()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* CLIENT FIELDS */}
          {mode === 'CLIENT' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  name="name" 
                  placeholder="e.g. Arun" 
                  className="input-field w-full" 
                  value={formData.name || ''}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input 
                  name="contact" 
                  placeholder="e.g. 9876543210" 
                  className="input-field w-full" 
                  value={formData.contact || ''}
                  onChange={handleChange}
                  required 
                />
              </div>
            </>
          )}

          {/* CASE FIELDS */}
          {mode === 'CASE' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Title</label>
                <input 
                  name="title" 
                  placeholder="e.g. Property Dispute vs State" 
                  className="input-field w-full" 
                  value={formData.title || ''}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
                {/* Updated placeholder to reflect no special chars */}
                <input 
                  name="case_number" 
                  placeholder="e.g. HC2023505" 
                  className="input-field w-full" 
                  value={formData.case_number || ''}
                  onChange={handleChange}
                  required 
                />
                <p className="text-xs text-gray-400 mt-1">Only letters and numbers allowed.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Court Name</label>
                <input 
                  name="court_name" 
                  placeholder="e.g. High Court of Delhi" 
                  className="input-field w-full" 
                  value={formData.court_name || ''}
                  onChange={handleChange}
                  required 
                />
              </div>
            </>
          )}

          {/* HEARING FIELDS */}
          {mode === 'HEARING' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="hearing_date" 
                  className="input-field w-full" 
                  value={formData.hearing_date || ''} 
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Update</label>
                <div className="relative">
                  <select 
                    name="status" 
                    className="input-field w-full appearance-none" 
                    value={formData.status || 'ONGOING'} 
                    onChange={handleChange}
                    required 
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="ADJOURNED">Adjourned</option>
                    <option value="JUDGMENT">Judgment Reserved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  className="input-field w-full resize-none"
                  placeholder="Enter hearing details..."
                  value={formData.description || ''}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4 mt-2">
             <button type="button" onClick={onClose} className="btn-secondary-base w-full">Cancel</button>
             <button type="submit" className="btn-primary-base w-full shadow-lg">
                {mode === 'HEARING' ? 'Schedule' : 'Save'}
             </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CaseModal;