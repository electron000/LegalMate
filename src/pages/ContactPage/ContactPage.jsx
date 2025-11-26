import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  User, 
  FileText, 
  MessageSquare, 
  CheckCircle2
} from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have a question or need assistance? Our team is here to help.
        </p>
      </div>

      <div className="contact-content-card">
        <div className="contact-info-section">
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="contact-info-title">General Inquiries</h3>
              <a href="mailto:legalmate.ai@gmail.com" className="contact-info-link">
                legalmate.ai@gmail.com
              </a>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="contact-info-title">Client Support</h3>
              <a href="tel:+916002239926" className="contact-info-link">
                +91 6002239926
              </a>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="contact-info-title">Headquarters</h3>
              <p className="contact-info-address">
             Sivasagar, Assam, 785640
              </p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2 className="form-title">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="form-input-wrapper">
                  <User className="field-icon" size={18} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input-field"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="form-input-wrapper">
                  <Mail className="field-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-field"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <div className="form-input-wrapper">
                  <Phone className="field-icon" size={18} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="input-field"
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <div className="form-input-wrapper">
                  <FileText className="field-icon" size={18} />
                  <select
                    id="subject"
                    name="subject"
                    className="input-field"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a topic...</option>
                    <option value="case-inquiry">Case Inquiry</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <div className="form-input-wrapper" style={{ alignItems: 'flex-start' }}>
                <MessageSquare className="field-icon" size={18} style={{ top: '1rem' }} />
                <textarea
                  id="message"
                  name="message"
                  className="input-field"
                  rows={6}
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={status === 'sending' || status === 'sent'}
            >
              {status === 'sending' ? (
                <>Sending...</>
              ) : status === 'sent' ? (
                <>Message Sent <CheckCircle2 size={18} /></>
              ) : (
                <>Submit Inquiry <Send size={18} /></>
              )}
            </button>

            {status === 'sent' && (
              <div className="success-message">
                 Thank you! We'll get back to you shortly.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;