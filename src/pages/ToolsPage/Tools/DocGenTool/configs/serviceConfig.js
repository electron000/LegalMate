export const saConfig = {
  id: 'service',
  title: 'Service Agreement',
  subtitle: 'Define payment terms, deliverables, and liability.',
  apiEndpoint: '/docs/service_generator',
  downloadEndpoint: '/docs/service_download',
  initialState: {
    execution_date: '',
    place_of_execution: '',
    client_name: '',
    client_address: '',
    service_provider_name: '',
    service_provider_address: '',
    services_description: '',
    payment_terms: '',
    termination_notice_days: '',
    jurisdiction_city: '' // NEW: Essential for Indian contracts
  },
  tabs: [{ id: 'main', label: 'Agreement' }],
  sections: {
    parties: {
      tab: 'main',
      title: 'Parties',
      type: 'form',
      fields: [
        { name: 'client_name', label: 'Client Name', required: true, span: 'half' },
        { name: 'client_address', label: 'Client Address', required: true, span: 'half' },
        { name: 'service_provider_name', label: 'Provider Name', required: true, span: 'half' },
        { name: 'service_provider_address', label: 'Provider Address', required: true, span: 'half' },
      ]
    },
    details: {
      tab: 'main',
      title: 'Terms & Jurisdiction',
      type: 'form',
      fields: [
        { name: 'services_description', label: 'Scope of Services', type: 'textarea', required: true },
        { name: 'payment_terms', label: 'Payment Terms', placeholder: 'e.g., Rs. 50,000 advance...', type: 'textarea', required: true },
        { name: 'termination_notice_days', label: 'Termination Notice (Days)', type: 'number', required: true, span: 'half' },
        { name: 'jurisdiction_city', label: 'Jurisdiction City (e.g. Delhi)', required: true, span: 'half' },
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
      ]
    }
  }
};