export const saConfig = {
  id: 'service',
  title: 'Service Agreement',
  subtitle: 'Define payment terms and deliverables for services.',
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
    termination_notice_days: ''
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
      title: 'Service Terms',
      type: 'form',
      fields: [
        { name: 'services_description', label: 'Description of Services', type: 'textarea', required: true },
        { name: 'payment_terms', label: 'Payment Terms', placeholder: 'e.g., 50% advance, 50% on completion', type: 'textarea', required: true },
        { name: 'termination_notice_days', label: 'Termination Notice (Days)', type: 'number', required: true, span: 'full' },
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
      ]
    }
  }
};