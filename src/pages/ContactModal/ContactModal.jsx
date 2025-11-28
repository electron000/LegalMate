import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, User, FileText, 
  MessageSquare, Send, CheckCircle2, X 
} from 'lucide-react';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [status, setStatus] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setStatus('');
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => {
        setStatus('');
        onClose(); // Auto close after success
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="modal-header">
          <h2>Get in Touch</h2>
          <p>Have a query? Send us a message.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {status === 'sent' ? (
            <div className="modal-success-state">
              <CheckCircle2 size={48} className="success-icon" />
              <h3>Message Sent!</h3>
              <p>We'll get back to you shortly.</p>
            </div>
          ) : (
            <>
              {/* Row 1: Name & Email */}
              <div className="modal-row">
                <div className="modal-input-group">
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input 
                      type="text" name="name" placeholder="Full Name" 
                      value={formData.name} onChange={handleChange} required 
                    />
                  </div>
                </div>
                <div className="modal-input-group">
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" name="email" placeholder="Email Address" 
                      value={formData.email} onChange={handleChange} required 
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone & Subject */}
              <div className="modal-row">
                <div className="modal-input-group">
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input 
                      type="tel" name="phone" placeholder="Phone (Optional)" 
                      value={formData.phone} onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="modal-input-group">
                  <div className="input-wrapper">
                    <FileText size={18} className="input-icon" />
                    <select name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="" disabled>Select Subject</option>
                      <option value="case-inquiry">Case Inquiry</option>
                      <option value="billing">Billing</option>
                      <option value="tech-support">Tech Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-input-group full-width">
                <div className="input-wrapper textarea-wrapper">
                  <MessageSquare size={18} className="input-icon top-aligned" />
                  <textarea 
                    name="message" rows={4} placeholder="How can we help?" 
                    value={formData.message} onChange={handleChange} required
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                className="modal-submit-btn" 
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
              </button>
            </>
          )}
        </form>

        {/* Footer Info */}
        {status !== 'sent' && (
          <div className="modal-footer-info">
            <a href="mailto:legalmate.ai@gmail.com"><Mail size={14} /> legalmate.ai@gmail.com</a>
            <span className="separator">•</span>
            <a href="tel:+916002239926"><Phone size={14} /> +91 6002239926</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;