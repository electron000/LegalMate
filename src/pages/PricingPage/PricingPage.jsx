import React, { useState, useEffect } from 'react';
import { Check, X, CreditCard, Smartphone, Wallet, Landmark, Lock, Loader2 } from 'lucide-react';
import './PricingPage.css';

const PricingPage = () => {
  // --- State Management from LegalMatePricing ---
  const [showCart, setShowCart] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    walletType: 'paytm',
    bankName: ''
  });

  const plans = [
    {
      name: "Monthly",
      price: 100,
      period: "/ month",
      features: [
        "AI-powered Legal Research",
        "Standard Document Templates",
        "Secure Document Storage (10GB)",
        "Basic Case Management",
        "Standard Email Support"
      ],
      featured: false
    },
    {
      name: "Half Yearly",
      price: 500,
      period: "/ 6 months",
      features: [
        "Everything in Monthly, plus:",
        "Advanced AI Contract Analysis",
        "Full-featured Case Management",
        "Secure Document Storage (50GB)",
        "Priority Email Support"
      ],
      featured: true
    },
    {
      name: "Annually",
      price: 1000,
      period: "/ year",
      features: [
        "Everything in Half Yearly, plus:",
        "Real-time Legal Consultation Chatbot",
        "E-signature Integration",
        "Unlimited Document Storage",
        "24/7 Phone & Chat Support"
      ],
      featured: false
    }
  ];

  // --- Logic Helpers ---

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowCart(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    setShowCart(false);
    document.body.style.overflow = '';
    // Optional: Reset form on close
    // setIsProcessing(false);
  };

  const calculateTotal = () => {
    if (!selectedPlan) return { subtotal: 0, gst: 0, total: 0 };
    const price = selectedPlan.price;
    const gst = price * 0.18; // 18% GST
    return {
      subtotal: price,
      gst: gst,
      total: price + gst
    };
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  // Formatter helpers
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  };

  const handleCardNumberChange = (e) => {
    setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }));
  };

  const handleExpiryChange = (e) => {
    setPaymentData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Dummy Timeout to simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Payment of ₹${totals.total.toFixed(2)} processed successfully via ${paymentMethod}!`);
      closeCart();
    }, 2000);
  };

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  const totals = calculateTotal();

  return (
    <div className="pricing-page-container">
      {/* --- Main Pricing Page Content --- */}
      <div className="pricing-header">
        <h1>Find the Right Plan for Your Needs</h1>
        <p>Start with a free trial. No credit card required.</p>
      </div>
      
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
            <div className="card-header">
              {plan.featured && <span className="popular-badge">Most Popular</span>}
              <h3>{plan.name}</h3>
              <div className="card-price">
                ₹{plan.price}<span className="period">{plan.period}</span>
              </div>
            </div>
            
            <ul className="feature-list">
              {plan.features.map((feature, fIndex) => (
                <li key={fIndex}>
                  <Check size={20} />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              className="cta-button"
              onClick={() => handlePlanSelect(plan)}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      {/* --- Cart Modal Overlay (Integrated from Uploaded File) --- */}
      {showCart && selectedPlan && (
        <div className="cart-overlay" onClick={closeCart}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal-header">
              <h2>Complete Your Purchase</h2>
              <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            <div className="cart-content">
              {/* Order Summary */}
              <div className="cart-section">
                <h3 className="cart-section-title">Order Summary</h3>
                <div className="selected-plan-summary">
                  <div className="summary-header">
                    <h4>{selectedPlan.name} Plan</h4>
                    <span className="price-tag">₹{selectedPlan.price}</span>
                  </div>
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>GST (18%)</span>
                      <span>₹{totals.gst.toFixed(2)}</span>
                    </div>
                    <div className="price-row total-row">
                      <span>Total Amount</span>
                      <span>₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="cart-section">
                <h3 className="cart-section-title">Payment Method</h3>
                <div className="payment-methods-grid">
                  {[
                    { id: 'card', icon: CreditCard, label: 'Card' },
                    { id: 'upi', icon: Smartphone, label: 'UPI' },
                    { id: 'wallet', icon: Wallet, label: 'Wallet' },
                    { id: 'netbanking', icon: Landmark, label: 'Net Banking' }
                  ].map((method) => (
                    <label 
                      key={method.id} 
                      className={`payment-option ${paymentMethod === method.id ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <method.icon size={20} />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Payment Form */}
                <form className="payment-form" onSubmit={handlePayment}>
                  {paymentMethod === 'card' && (
                    <div className="form-fields">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength="19"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Name on card"
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="form-row-split">
                        <div className="form-group">
                          <label>Expiry</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentData.expiryDate}
                            onChange={handleExpiryChange}
                            maxLength="5"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            maxLength="3"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="form-fields">
                      <div className="form-group">
                        <label>UPI ID</label>
                        <input
                          type="text"
                          name="upiId"
                          placeholder="username@bank"
                          value={paymentData.upiId}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* (Other payment methods simplified for brevity, logic remains same) */}
                  {(paymentMethod === 'wallet' || paymentMethod === 'netbanking') && (
                    <div className="form-fields">
                       <div className="form-group">
                        <label>Select Provider</label>
                        <select name="bankName" required>
                          <option value="">Choose provider</option>
                          <option value="1">Provider A</option>
                          <option value="2">Provider B</option>
                        </select>
                       </div>
                    </div>
                  )}

                  <div className="security-notice">
                    <Lock size={16} />
                    <span>Payments are secure and encrypted</span>
                  </div>

                  <button 
                    type="submit" 
                    className="payment-submit-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="spinner" size={20} />
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${totals.total.toFixed(2)}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;