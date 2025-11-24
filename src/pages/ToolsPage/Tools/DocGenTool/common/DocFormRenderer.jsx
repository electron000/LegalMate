import React from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const FormField = ({ control, name, label, type = 'text', required, placeholder, span }) => (
  <div className="tf-form-group" data-span={span || 'full'}>
    <label className={required ? 'tf-required' : ''}>{label}</label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required && 'This field is required.' }}
      render={({ field }) => (
        <input
          type={type}
          placeholder={placeholder}
          {...field}
          className="tf-form-input"
        />
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
      render={({ field }) => (
        <textarea
          placeholder={placeholder}
          {...field}
          className="tf-form-input"
          rows={3}
        />
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
      render={({ field }) => (
        <select {...field} className="tf-form-input">
          {options.map((opt, idx) => (
            <option key={`${opt.value}-${idx}`} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    />
  </div>
);

const RadioField = ({ control, name, label, required, options, span }) => (
  <div className="tf-form-group" data-span={span || 'full'}>
    <label className={required ? 'tf-required' : ''}>{label}</label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required && 'This field is required.' }}
      render={({ field }) => (
        <div className="tf-radio-group">
          {options.map(opt => (
            <label key={opt.value}>
              <input
                type="radio"
                name={name}
                onChange={() => field.onChange(opt.value)}
                checked={field.value === opt.value}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    />
  </div>
);

const RenderField = ({ control, fieldConfig, formData }) => {
  const props = { control, ...fieldConfig };

  if (fieldConfig.type === 'select' && fieldConfig.dynamicOptions && formData) {
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

  switch (fieldConfig.type) {
    case 'textarea':
      return <TextareaField {...props} />;
    case 'select':
      return <SelectField {...props} />;
    case 'radio':
      return <RadioField {...props} />;
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
        <h4>{section.title} {section.required && <span className="tf-required">*</span>}</h4>
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

const DocFormRenderer = ({ control, toolConfig, activeTab }) => {
  const allFormData = useWatch({ control });

  return (
    <>
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
    </>
  );
};

export default DocFormRenderer;