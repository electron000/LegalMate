import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ScanLine, PenSquare, Briefcase, Bot, Users } from 'lucide-react';
import './PlatformHighlights.css';

const getSafeId = (str) => {
  return str ? str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'default';
};

const TSGoToIcon = ({ onClick, uniqueId }) => {
    const maskId = `mask_combined_${uniqueId}`;
    const clipId = `clip_combined_${uniqueId}`;

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 40 40" 
            fill="none" 
            className="ts-go-to-icon" 
            onClick={onClick} 
        >
            <g clipPath={`url(#${clipId})`}>
                <path d="M19.9092 39.9371C30.5962 39.9371 39.2598 31.2146 39.2598 20.4549C39.2598 9.69515 30.5962 0.972656 19.9092 0.972656C9.22215 0.972656 0.558594 9.69515 0.558594 20.4549C0.558594 31.2146 9.22215 39.9371 19.9092 39.9371Z" />
                
                <mask id={maskId} style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="13" y="14" width="14" height="13">
                    <path d="M26.2219 26.8105H13.5947V14.0974H26.2219V26.8105Z" fill="white"/>
                </mask>
                
                <g mask={`url(#${maskId})`}>
                    <path d="M14.4717 25.9299C14.8232 26.2839 15.3932 26.2839 15.7447 25.9299L25.9468 15.6585C26.2984 15.3045 26.2984 14.7307 25.9468 14.3768C25.5953 14.0228 25.0253 14.0228 24.6737 14.3768L14.4717 24.6482C14.1201 25.0021 14.1201 25.576 14.4717 25.9299Z" fill="white"/>
                    <path d="M25.3098 26.7987C25.8069 26.7987 26.2099 26.3929 26.2099 25.8924V15.0167C26.2099 14.5161 25.8069 14.1104 25.3098 14.1104H14.5075C14.0104 14.5161 13.6074 14.0104 13.6074 15.0167C13.6074 15.5173 14.0104 15.923 14.5075 15.923H24.4096V25.8924C24.4096 26.3929 24.8125 26.7987 25.3098 26.7987Z" fill="white"/>
                </g>
            </g>
            <defs>
                <clipPath id={clipId}>
                    <rect width="40" height="40" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
};

const FeatureListItem = ({ title, description, icon, onClick }) => {
    const uniqueId = getSafeId(title);
    return (
        <div 
            className="feature-list-item" 
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="feature-icon-wrapper">
                {React.createElement(icon, { 
                    size: window.innerWidth < 768 ? 18 : 22,
                    'aria-hidden': true 
                })}
            </div>
            <div className="feature-text-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <TSGoToIcon uniqueId={uniqueId} />
        </div>
    );
};

const PlatformHighlights = () => {
    const navigate = useNavigate();

    const allFeatures = [
        {
            title: "AI-Powered Legal Research",
            description: "Instantly find relevant case laws and legal precedents.",
            icon: Scale,
            onClick: () => navigate('/legal-research'),
        },
        {
            title: "Intelligent Document Analysis",
            description: "Get AI insights, summaries, and risk assessments.",
            icon: ScanLine,
            onClick: () => navigate('/doc-analyzer'),
        },
        {
            title: "Automated Document Drafting",
            description: "Generate drafts for notices, affidavits, and agreements.",
            icon: PenSquare,
            onClick: () => navigate('/tools'),
        },
        {
            title: "Case Management Suite",
            description: "Organize case files, track deadlines, and manage clients.",
            icon: Briefcase,
            onClick: () => navigate('/case-management'),
        },
        {
            title: "24/7 AI Legal Assistant",
            description: "Get instant guidance on legal rights and procedures.",
            icon: Bot,
            onClick: () => navigate('/legalmate-ai'),
        },
        {
            title: "Verified Lawyer Network",
            description: "Connect with experienced legal professionals locally.",
            icon: Users,
            onClick: () => navigate('#'),
        },
    ];

    return (
        <div className="combined-sections-wrapper">
            <h2 className="combined-sections-main-title">
                Platform Highlights
            </h2>
            
            <div className="combined-sections-container">
                <div className="feature-list">
                    {allFeatures.map((feature, index) => (
                        <FeatureListItem
                            key={`feature-${index}`}
                            {...feature}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlatformHighlights;