import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, X, MessageSquare, ShieldCheck } from 'lucide-react';
import './DocAnalyzerModal.css';
import { DocAnalyzerAPI } from '../../../../api';

const DocAnalyzerModal = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [step, setStep] = useState('upload'); // 'upload' | 'processing' | 'summary' | 'embedding'
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [summaryData, setSummaryData] = useState(''); // Store real summary
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('upload');
      setProgress(0);
      setFileName('');
      setSummaryData('');
      setErrorMsg('');
    }
  }, [isOpen]);

  const summaryEndRef = useRef(null);

  // 1. FILE UPLOAD HANDLER (API INTEGRATED)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStep('processing');
    setErrorMsg('');
    
    // Start Fake Progress Animation (Visual feedback while waiting for server)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress > 85) {
        currentProgress = 85; // Stall at 85% until API responds
      }
      setProgress(currentProgress);
    }, 300);

    try {
      // ACTUAL API CALL
      const data = await DocAnalyzerAPI.uploadAndSummarize(file);
      
      // Success
      clearInterval(interval);
      setProgress(100);
      setSummaryData(data.answer); // Store the summary from backend

      // Slight delay to show 100% checkmark
      setTimeout(() => {
        setStep('summary');
      }, 600);

    } catch (error) {
      clearInterval(interval);
      console.error("Upload failed:", error);
      setErrorMsg("Failed to upload/analyze document. Please try again.");
      setStep('upload'); // Reset to upload step
    }
  };

  // 2. EMBEDDING HANDLER (API INTEGRATED)
  const handleStartQnA = async () => {
    setStep('embedding');

    try {
      // ACTUAL API CALL
      await DocAnalyzerAPI.generateEmbeddings();

      // Notify parent to switch to chat
      if (onAnalysisComplete) {
          onAnalysisComplete({
              fileName: fileName,
              summary: summaryData
          });
      }
    } catch (error) {
      console.error("Embedding failed:", error);
      alert("Failed to prepare knowledge base. Please try again.");
      setStep('summary'); // Revert state so user can try again
    }
  };

  if (!isOpen) return null;

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (step) {
      case 'upload':
        return (
          <>
             {/* Title Scrolled inside body */}
            <div className="dam-scroll-title">
                <ShieldCheck size={28} className="text-gray-800" />
                Doc Analyzer
            </div>
            <p className="dam-scroll-subtitle">
                Upload your contract, agreement, or court judgment to get an instant AI-powered summary and legal risk analysis.
            </p>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="dam-dropzone">
                <label className="cursor-pointer block w-full">
                <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleFileUpload}
                />
                <div className="flex justify-center mb-6">
                    <div className="p-5 bg-white shadow-sm border border-gray-100 rounded-full">
                    <UploadCloud size={48} className="text-gray-400" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Click to upload your document
                </h3>
                <p className="text-gray-400 text-sm">
                    PDF only (Max 10MB)
                </p>
                </label>
            </div>
          </>
        );

      case 'processing':
        return (
          <div className="dam-progress-wrapper">
             <div className="dam-scroll-title mb-8">
                Analyzing Document...
            </div>

            <div className="dam-progress-container">
                {progress < 100 ? (
                    <div className="dam-spinner-large"></div>
                ) : (
                    <CheckCircle size={56} className="text-green-600 mx-auto mb-6" />
                )}
                
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                {progress === 100 ? "Analysis Complete!" : "Reading content..."}
                </h3>
                
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                {progress === 100 
                    ? "Generating legal insights..." 
                    : "Extracting clauses, checking compliance, and flagging risks..."}
                </p>

                <div className="dam-progress-track">
                <div 
                    className="dam-progress-fill" 
                    style={{ width: `${progress}%` }}
                ></div>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-mono">{Math.round(progress)}%</p>
            </div>
          </div>
        );

      case 'summary':
      case 'embedding':
        return (
          <div className={`dam-summary-container ${step === 'embedding' ? 'opacity-50 pointer-events-none' : ''}`}>
             
             <div className="dam-scroll-title">
                Document Analysis
            </div>
            
            <div className="dam-file-badge">
                <FileText size={16} />
                <span>{fileName}</span>
                <span className="text-green-600 ml-2 text-xs uppercase font-bold tracking-wider border-l border-gray-300 pl-2">Verified</span>
            </div>

            <div className="dam-summary-content">
              {/* Display Real Summary Data */}
              {summaryData}
            </div>
            
            <div ref={summaryEndRef}></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dam-overlay">
      <div className="dam-content">
        
        {onClose && (
            <button onClick={onClose} className="dam-close-btn-floating" title="Close">
                <X size={20} />
            </button>
        )}

        <div className="dam-body">
          {renderContent()}
        </div>

        {(step === 'summary' || step === 'embedding') && (
          <div className="dam-footer">
            <button 
              onClick={onClose}
              disabled={step === 'embedding'}
              className="dam-btn-secondary"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleStartQnA}
              disabled={step === 'embedding'}
              className="dam-btn-primary"
            >
              {step === 'embedding' ? (
                <>
                  <div className="dam-spinner"></div>
                  Preparing...
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  Start QnA
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DocAnalyzerModal;