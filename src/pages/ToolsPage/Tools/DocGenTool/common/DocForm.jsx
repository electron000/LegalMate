import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DocGenService, downloadBlob } from '../../../../../api'; 
import DocFormRenderer from './DocFormRenderer';
import './DocForm.css';
import { X, Save, Loader2, FileText, Download, RefreshCw } from 'lucide-react';

const DocForm = ({ toolConfig }) => {
  const navigate = useNavigate();
  const handleClose = () => navigate('/tools');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [activeTab, setActiveTab] = useState(toolConfig.tabs[0].id);

  const isReviewing = !!documentText;
  const currentStep = isReviewing ? 2 : 1;

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: toolConfig.initialState,
  });

  const onFormSubmit = async (data) => {
    setError('');
    setLoading(true);
    setDocumentText('');

    try {
      const text = await DocGenService.getPreview(toolConfig.apiEndpoint, data);
      setDocumentText(text);
    } catch (err) {
      console.error("Preview Generation Error:", err);
      setError(err.message || 'Failed to generate document preview.');
    } finally {
      setLoading(false);
    }
  };

  const onFormError = () => {
    setError('Please fill in all required fields.');
  };

  const handleClearPreview = () => {
    setDocumentText('');
    setError('');
  };

  const handleDownloadText = async () => {
    try {
      setLoading(true);
      const formData = watch();
      const blob = await DocGenService.getDownload(toolConfig.downloadEndpoint, formData);
      downloadBlob(blob, `${toolConfig.title.replace(/ /g, '_')}.docx`);
    } catch (err) {
      console.error("Download Error:", err);
      setError('Failed to download document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tf-tool-form-page">
      <form
        className="tf-layout-container"
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
      >
        <div className="tf-left-column">
          <div className="tf-header">
            <h1 className="tf-title">{toolConfig.title}</h1>
            <p className="tf-subtitle">{toolConfig.subtitle}</p>
          </div>

          <nav className="tf-tab-navigation">
            {toolConfig.tabs.map(tab => (
              <button
                type="button"
                key={tab.id}
                className={`tf-tab-btn ${activeTab === tab.id ? 'tf-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                disabled={isReviewing}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="tf-right-column">
          <div className="tf-content-container">
            <div className="tf-stepper">
              <div className={`tf-step ${currentStep === 1 ? 'tf-active' : ''}`}>
                <span className="tf-step-number">1</span>
                <span className="tf-step-label">Fill Details & Generate</span>
              </div>
              <div className="tf-step-divider" />
              <div className={`tf-step ${currentStep === 2 ? 'tf-active' : ''}`}>
                <span className="tf-step-number">2</span>
                <span className="tf-step-label">Review & Download</span>
              </div>
            </div>

            <div className="tf-form-header">
              <h2 className="tf-form-title">
                {isReviewing ? 'Step 2: Review & Download' : 'Step 1: Fill Details & Generate'}
              </h2>
              <div className="tf-header-actions">
                <div className="tf-nav-controls">
                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="tf-nav-btn tf-generate"
                    title={isReviewing ? 'Regenerate Preview' : 'Generate Preview'}
                  >
                    {loading && !isReviewing ? (
                      <Loader2 size={20} className="tf-animate-spin" />
                    ) : isReviewing ? (
                      <RefreshCw size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    {loading && !isReviewing ? 'Generating...' : (isReviewing ? 'Regenerate' : 'Generate')}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="tf-nav-btn"
                    title="Back to Tools"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="tf-error-message">{error}</div>}

            <div className="tf-form-content">
              {(loading || isReviewing) ? (
                <div className="tf-preview-column">
                  <div className="tf-preview-header">
                    <h2 className="tf-preview-title">
                      <FileText size={18} style={{ marginRight: '0.5rem' }} />
                      Generated Document (Preview)
                    </h2>
                    <div className="tf-preview-actions">
                      <button
                        type="button"
                        onClick={handleDownloadText}
                        className="tf-nav-btn tf-download"
                        title="Download DOCX"
                        disabled={loading}
                      >
                        {loading ? <Loader2 size={18} className="tf-animate-spin" /> : <Download size={18} />}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPreview}
                        className="tf-nav-btn"
                        title="Clear Preview & Edit"
                        disabled={loading}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {loading && (
                    <div className="tf-preview-loader">
                      <Loader2 size={32} className="tf-animate-spin" />
                      <p>{isReviewing ? "Preparing download..." : "Generating preview..."}</p>
                    </div>
                  )}

                  {!loading && isReviewing && (
                    <pre className="tf-preview-content">
                      {documentText}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="tf-form-scroller">
                  <DocFormRenderer
                    control={control}
                    toolConfig={toolConfig}
                    activeTab={activeTab}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocForm;