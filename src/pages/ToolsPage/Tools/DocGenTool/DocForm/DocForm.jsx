import React, { useState, useMemo, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { DocGenService, downloadBlob } from '../../../../../api'; 
import './DocForm.css';
import { X, Save, Loader2, FileText, Download, RefreshCw, Plus, Trash2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* HELPER: Access Nested Object by String Path                                */
/* -------------------------------------------------------------------------- */
const getValueByPath = (obj, path) => {
  if (!obj) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/* -------------------------------------------------------------------------- */
/* INTERNAL FORM COMPONENTS                                                   */
/* -------------------------------------------------------------------------- */

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
            value={field.value || ''} 
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
            value={field.value || ''}
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
          <select 
            {...field} 
            value={field.value || ''}
            className={`tf-form-input ${error ? 'tf-input-error' : ''}`}
          >
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

const DynamicListSection = ({ control, section, formData }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.listName,
  });

  return (
    <div className="tf-section">
      <div className="tf-section-title">
        <h4>
          {section.title} {section.required && <span className="tf-required">*</span>}
        </h4>
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

  const isReviewing = !!documentText;
  const currentStep = isReviewing ? 2 : 1;

  // Removed 'trigger' as it was unused
  const {
    control,
    handleSubmit,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: toolConfig.initialState,
  });

  const allFormData = watch();

  /* ------------------------------------------------------------------------ */
  /* NEW LOGIC: Check Validity of ALL fields (across all tabs)                */
  /* Wrapped in useCallback to satisfy linter                                 */
  /* ------------------------------------------------------------------------ */
  const checkFormValidity = useCallback((currentData) => {
    const sections = Object.values(toolConfig.sections);

    for (const section of sections) {
      // 1. Skip sections that are hidden due to conditions
      if (section.condition && !section.condition(currentData)) {
        continue; 
      }

      // 2. Handle Dynamic Lists
      if (section.type === 'dynamicList') {
        const listData = getValueByPath(currentData, section.listName);
        const list = Array.isArray(listData) ? listData : [];

        // Check A: Is the list itself required? (Must have > 0 items)
        if (section.required && list.length === 0) {
          return false;
        }

        // Check B: Are required fields INSIDE the list items filled?
        for (const item of list) {
          for (const field of section.fields) {
            if (field.required) {
               const val = item[field.name];
               if (val === undefined || val === null || val === '') {
                 return false;
               }
            }
          }
        }
      } 
      // 3. Handle Standard Forms
      else if (section.type === 'form') {
        for (const field of section.fields) {
          if (field.required) {
            const val = getValueByPath(currentData, field.name);
            if (val === undefined || val === null || val === '') {
              return false;
            }
          }
        }
      }
    }
    return true;
  }, [toolConfig]); // Dependency added here

  // Correct dependency array for useMemo
  const isFormValid = useMemo(() => checkFormValidity(allFormData), [allFormData, checkFormValidity]);


  /* ------------------------------------------------------------------------ */
  /* NAVIGATION                                                               */
  /* ------------------------------------------------------------------------ */
  const handleTabChange = (targetTabId) => {
    if (isReviewing) {
      setActiveTab(targetTabId); 
      return;
    }
    setActiveTab(targetTabId);
    setError(''); 
  };

  const preparePayload = (rawData) => {
    const payload = JSON.parse(JSON.stringify(rawData));
    const extras = {};

    Object.values(toolConfig.sections).forEach(section => {
      
      // Handle Simple String Lists
      if (section.type === 'dynamicList' && section.isSimpleStringList) {
        const listData = getValueByPath(payload, section.listName);
        if (Array.isArray(listData)) {
          const simpleList = listData.map(item => Object.values(item)[0]);
          const pathParts = section.listName.split('.');
          let current = payload;
          for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
          }
          current[pathParts[pathParts.length - 1]] = simpleList;
        }
      }

      // Handle Extras
      if (section.type === 'dynamicList') {
        const listData = getValueByPath(payload, section.listName);
        if (!section.required && listData && listData.length > 0) {
           extras[section.listName] = listData;
        }
      } else if (section.type === 'form') {
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

    payload.extras = extras;
    return payload;
  };

  const onFormSubmit = async (data) => {
    if (!checkFormValidity(data)) {
        setError('Please complete all mandatory fields (marked with *).');
        return;
    }

    setError('');
    setLoading(true);
    setDocumentText('');

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
                    disabled={loading || (!isReviewing && !isFormValid)} 
                    className="tf-nav-btn tf-generate"
                    title={(!isReviewing && !isFormValid) ? "Please fill all required fields to generate" : (isReviewing ? 'REGENERATE' : 'GENERATE')}
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
                      Preview
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