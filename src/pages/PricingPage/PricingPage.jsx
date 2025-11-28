import React from 'react';
import { Check } from 'lucide-react';
import './PricingPage.css';

const PricingPage = () => {
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

  return (
    <div className="pricing-page-container">
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
                ${plan.price}<span className="period">{plan.period}</span>
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
            
            <button className="cta-button">Choose Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;