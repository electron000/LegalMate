import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { DocGenService, downloadBlob } from '../../../../../api'; 
import './DocForm.css';
import { X, Save, Loader2, FileText, Download, RefreshCw, Plus, Trash2, AlertCircle } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* HELPER: Access Nested Object by String Path                                */
/* -------------------------------------------------------------------------- */
const getValueByPath = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/* -------------------------------------------------------------------------- */
/* INTERNAL FORM COMPONENTS (RenderField, FormField, etc. - UNCHANGED)        */
/* -------------------------------------------------------------------------- */
// ... [Keep FormField, TextareaField, SelectField, RenderField, DynamicListSection, FormSection exactly as they were] ...

const FormField = ({ control, name, label, type = 'text', required, placeholder, span }) => (
  <div className="tf-form-group" data-span={span || 'full'}>
    <label className={required ? 'tf-required' : ''}>{label}</label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required && 'This field is required.' }}
      render={({ field, fieldState: { error } }) => (
        <>
          <input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`tf-form-input ${error ? 'tf-input-error' : ''}`}
          />
          {error && <span className="tf-field-error">{error.message}</span>}
        </>
      )}
    />
  </div>
);

const TextareaField = ({ control, name, label, required, placeholder, span }) => (
  <div className="tf-form-group" data-span={span || 'full'}>
    <label className={required ? 'tf-required' : ''}>{label}</label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required && 'This field is required.' }}
      render={({ field, fieldState: { error } }) => (
        <>
          <textarea
            placeholder={placeholder}
            {...field}
            className={`tf-form-input ${error ? 'tf-input-error' : ''}`}
            rows={3}
          />
          {error && <span className="tf-field-error">{error.message}</span>}
        </>
      )}
    />
  </div>
);

const SelectField = ({ control, name, label, required, options, span }) => (
  <div className="tf-form-group" data-span={span || 'full'}>
    <label className={required ? 'tf-required' : ''}>{label}</label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required && 'This field is required.' }}
      render={({ field, fieldState: { error } }) => (
        <>
          <select {...field} className={`tf-form-input ${error ? 'tf-input-error' : ''}`}>
              <option value="" disabled>Select {label}</option>
            {options && options.map((opt, idx) => (
              <option key={`${opt.value}-${idx}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {error && <span className="tf-field-error">{error.message}</span>}
        </>
      )}
    />
  </div>
);

const RenderField = ({ control, fieldConfig, formData }) => {
  const props = { control, ...fieldConfig };

  if ((fieldConfig.type === 'select' || fieldConfig.type === 'radio') && fieldConfig.dynamicOptions && formData) {
    const sourceList = formData[fieldConfig.dynamicOptions] || [];
    if (Array.isArray(sourceList)) {
      props.options = [
        { label: `Select ${fieldConfig.label}...`, value: '' },
        ...sourceList
          .filter(item => item && item.name)
          .map(item => ({ label: item.name, value: item.name })),
      ];
    }
  }

  if (fieldConfig.type === 'radio') {
      return <SelectField {...props} />;
  }

  switch (fieldConfig.type) {
    case 'textarea':
      return <TextareaField {...props} />;
    case 'select':
      return <SelectField {...props} />;
    case 'number':
    case 'date':
    case 'text':
    default:
      return <FormField {...props} />;
  }
};

const DynamicListSection = ({ control, section, formData, listError }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.listName,
  });

  return (
    <div className={`tf-section ${listError ? 'tf-section-error' : ''}`}>
      <div className="tf-section-title">
        <h4>
          {section.title} {section.required && <span className="tf-required">*</span>}
        </h4>
        {listError && <span className="tf-list-error-msg"><AlertCircle size={14}/> {listError}</span>}
      </div>
      
      {fields.map((item, index) => (
        <div key={item.id} className="tf-dynamic-list-item">
          <button type="button" className="tf-remove-btn" onClick={() => remove(index)}>
            <Trash2 size={16} />
          </button>
          <div className="tf-dynamic-list-fields" style={{ gridTemplateColumns: `repeat(${section.fields.length}, 1fr)` }}>
            {section.fields.map(fieldConfig => {
              const fieldProps = {
                ...fieldConfig,
                name: `${section.listName}.${index}.${fieldConfig.name}`,
              };
              return <RenderField key={fieldProps.name} control={control} fieldConfig={fieldProps} formData={formData} />;
            })}
          </div>
        </div>
      ))}
      <button type="button" className="tf-btn-add" onClick={() => append(section.newItem)}>
        <Plus size={16} /> Add {section.itemTitle}
      </button>
    </div>
  );
};

const FormSection = ({ control, section, formData }) => (
  <div className="tf-section">
    <div className="tf-section-title">
      <h4>{section.title} {section.required && <span className="tf-required">*</span>}</h4>
    </div>
    <div className="tf-form-row" data-span={section.fields.some(f => f.span === 'third') ? 'third' : 'half'}>
      {section.fields.map(fieldConfig => (
        <RenderField key={fieldConfig.name} control={control} fieldConfig={fieldConfig} formData={formData} />
      ))}
    </div>
  </div>
);


/* -------------------------------------------------------------------------- */
/* MAIN DOCFORM COMPONENT                                                     */
/* -------------------------------------------------------------------------- */

const DocForm = ({ toolConfig }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [activeTab, setActiveTab] = useState(toolConfig.tabs[0].id);
  const [sectionErrors, setSectionErrors] = useState({}); 

  const isReviewing = !!documentText;
  const currentStep = isReviewing ? 2 : 1;

  const {
    control,
    handleSubmit,
    watch,
    trigger, 
  } = useForm({
    mode: 'onChange',
    defaultValues: toolConfig.initialState,
  });

  const allFormData = watch();

  const handleTabChange = async (targetTabId) => {
    if (isReviewing) {
      setActiveTab(targetTabId);
      return;
    }

    const currentSections = Object.values(toolConfig.sections).filter(s => s.tab === activeTab);
    
    let fieldsToValidate = [];
    let isListValid = true;
    let newSectionErrors = {};

    for (const section of currentSections) {
      if (section.condition && !section.condition(allFormData)) continue;

      if (section.type === 'form') {
        section.fields.forEach(field => {
          fieldsToValidate.push(field.name);
        });
      } else if (section.type === 'dynamicList') {
        const listData = getValueByPath(allFormData, section.listName) || [];
        
        if (section.required && listData.length === 0) {
          newSectionErrors[section.listName] = `Please add at least one ${section.itemTitle}.`;
          isListValid = false;
        } else {
          listData.forEach((_, index) => {
            section.fields.forEach(field => {
              fieldsToValidate.push(`${section.listName}.${index}.${field.name}`);
            });
          });
        }
      }
    }

    setSectionErrors(newSectionErrors);

    const result = await trigger(fieldsToValidate);

    if (result && isListValid) {
      setActiveTab(targetTabId);
      setError(''); 
    } else {
      setError('Please fill in all mandatory fields in this section before proceeding.');
    }
  };

  // --- NEW: TRANSFORM PAYLOAD LOGIC (FIXED FOR POA) ---
  const preparePayload = (rawData) => {
    // 1. Clone data to avoid mutating state
    const payload = JSON.parse(JSON.stringify(rawData));
    const extras = {};

    // 2. Iterate through all sections in config
    Object.values(toolConfig.sections).forEach(section => {
      
      // --- FIX: Handle Simple String Lists (like PoA Powers) ---
      if (section.type === 'dynamicList' && section.isSimpleStringList) {
        const listData = getValueByPath(payload, section.listName);
        
        if (Array.isArray(listData)) {
          // Convert [{description: "Value"}] -> ["Value"]
          // We take the value of the first key in the object
          const simpleList = listData.map(item => Object.values(item)[0]);
          
          // Update the payload with the simple string list
          // We must traverse the path (e.g., 'specific_powers') to set it correctly
          const pathParts = section.listName.split('.');
          let current = payload;
          for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
          }
          current[pathParts[pathParts.length - 1]] = simpleList;
        }
      }

      // --- Extras Logic (Separating Optional Fields) ---
      if (section.type === 'dynamicList') {
        const listData = getValueByPath(payload, section.listName);
        // If the whole list section is optional (no required: true), add to extras
        if (!section.required && listData && listData.length > 0) {
           extras[section.listName] = listData;
        }
      } else if (section.type === 'form') {
         // Check individual fields
         section.fields.forEach(field => {
            if (!field.required) {
               const val = getValueByPath(payload, field.name);
               if(val) {
                 extras[field.name] = val;
               }
            }
         });
      }
    });

    // 3. Attach extras to payload
    payload.extras = extras;
    return payload;
  };

  const onFormSubmit = async (data) => {
    // 1. Strict Validation Check (Triggers all fields)
    const isTotalValid = await trigger();
    
    // 2. Additional Custom Validation for Required Lists (e.g., Banks)
    let listValidationError = false;
    let newSectionErrors = {};
    
    Object.values(toolConfig.sections).forEach(section => {
       if (section.type === 'dynamicList' && section.required) {
          const listData = getValueByPath(data, section.listName);
          if (!listData || listData.length === 0) {
             listValidationError = true;
             newSectionErrors[section.listName] = `Missing required ${section.itemTitle}.`;
          }
       }
    });

    if(!isTotalValid || listValidationError) {
        setSectionErrors(prev => ({...prev, ...newSectionErrors}));
        setError('Please complete all mandatory sections (Agreement, Personal Details, Bank Details).');
        return;
    }

    setError('');
    setLoading(true);
    setDocumentText('');

    // 3. Prepare Payload (Separate Optional to Extras + Fix String Lists)
    const finalPayload = preparePayload(data);

    try {
      const text = await DocGenService.getPreview(toolConfig.apiEndpoint, finalPayload);
      setDocumentText(text);
    } catch (err) {
      console.error("Preview Generation Error:", err);
      setError(err.message || 'Failed to generate document preview.');
    } finally {
      setLoading(false);
    }
  };

  const onFormError = (errors) => {
    console.log("Validation Errors:", errors);
    setError('Please fill in all mandatory fields (marked with *).');
  };

  const handleClearPreview = () => {
    setDocumentText('');
    setError('');
  };

  const handleDownloadText = async () => {
    try {
      setLoading(true);
      const formData = watch();
      // Apply same payload transformation for download
      const finalPayload = preparePayload(formData);
      
      const blob = await DocGenService.getDownload(toolConfig.downloadEndpoint, finalPayload);
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
        // Bind onFormError to catch validation failures
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
      >
        {/* Left Sidebar / Navigation */}
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
                onClick={() => handleTabChange(tab.id)} 
                disabled={isReviewing}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Main Content */}
        <div className="tf-right-column">
          <div className="tf-content-container">
            {/* Stepper */}
            <div className="tf-stepper">
              <div className={`tf-step ${currentStep === 1 ? 'tf-active' : ''}`}>
                <span className="tf-step-number">1</span>
                <span className="tf-step-label">Fill & Generate</span>
              </div>
              <div className="tf-step-divider" />
              <div className={`tf-step ${currentStep === 2 ? 'tf-active' : ''}`}>
                <span className="tf-step-number">2</span>
                <span className="tf-step-label">Review & Download</span>
              </div>
            </div>

            {/* Form Actions Header */}
            <div className="tf-form-header">
              <h2 className="tf-form-title">
                {isReviewing ? 'Review & Download' : 'Fill & Generate'}
              </h2>
              <div className="tf-header-actions">
                <div className="tf-nav-controls">
                  <button
                    type="submit"
                    disabled={loading} 
                    className="tf-nav-btn tf-generate"
                    title={isReviewing ? 'REGENERATE' : 'GENERATE'}
                  >
                    {loading && !isReviewing ? (
                      <Loader2 size={20} className="tf-animate-spin tf-spin" />
                    ) : isReviewing ? (
                      <RefreshCw size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    {loading && !isReviewing ? 'Generating...' : (isReviewing ? 'REGENERATE' : 'GENERATE')}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="tf-error-message">{error}</div>}

            <div className="tf-form-content">
              {(loading || isReviewing) ? (
                /* Preview Mode */
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
                        className="tf-icon-btn tf-download-btn"
                        title="Download DOCX"
                        disabled={loading}
                      >
                        {loading ? <Loader2 size={18} className="tf-animate-spin tf-spin" /> : <Download size={18} />}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPreview}
                        className="tf-icon-btn"
                        title="Clear Preview & Edit"
                        disabled={loading}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {loading && (
                    <div className="tf-preview-loader" style={{ padding: '2rem', textAlign: 'center' }}>
                      <Loader2 size={32} className="tf-animate-spin tf-spin" style={{ margin: '0 auto 1rem' }} />
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
                /* Form Input Mode */
                <div className="tf-form-scroller">
                  {Object.values(toolConfig.sections)
                    .filter(section => section.tab === activeTab)
                    .filter(section => {
                      return !section.condition || section.condition(allFormData);
                    })
                    .map(section => {
                      const key = section.type === 'dynamicList' ? section.listName : section.title;
                      
                      if (section.type === 'dynamicList') {
                        return (
                          <DynamicListSection 
                            key={key} 
                            control={control} 
                            section={section} 
                            formData={allFormData}
                            listError={sectionErrors[section.listName]} 
                          />
                        );
                      }
                      return (
                        <FormSection 
                          key={key} 
                          control={control} 
                          section={section} 
                          formData={allFormData} 
                        />
                      );
                    })}
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