export const saConfig = {
  id: 'service',
  title: 'Service Agreement',
  subtitle: 'Define payment terms and deliverables for services.',
  apiEndpoint: '/docs/service_generator',
  downloadEndpoint: '/docs/service_download',
  initialState: { provider: '', client: '', service_description: '' },
  tabs: [{ id: 'main', label: 'Agreement' }],
  sections: {
    main: {
      tab: 'main',
      title: 'Service Details',
      type: 'form',
      fields: [
        { name: 'provider', label: 'Service Provider', required: true, span: 'half' },
        { name: 'client', label: 'Client Name', required: true, span: 'half' },
        { name: 'service_description', label: 'Description of Services', type: 'textarea', required: true },
      ]
    }
  }
};