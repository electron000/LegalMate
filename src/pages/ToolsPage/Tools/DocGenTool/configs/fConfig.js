export const freelancerConfig = {
  id: 'freelancer',
  title: 'Freelancer Agreement',
  subtitle: 'Contract for independent contractors and IP rights.',
  apiEndpoint: '/docs/freelancer_generator',
  downloadEndpoint: '/docs/freelancer_download',
  initialState: { client_name: '', freelancer_name: '', project_scope: '', fee: '' },
  tabs: [{ id: 'details', label: 'Project Details' }],
  sections: {
    details: {
      tab: 'details',
      title: 'Engagement Details',
      type: 'form',
      fields: [
        { name: 'client_name', label: 'Client Name', required: true, span: 'half' },
        { name: 'freelancer_name', label: 'Freelancer Name', required: true, span: 'half' },
        { name: 'fee', label: 'Project Fee', type: 'number', required: true, span: 'full' },
        { name: 'project_scope', label: 'Scope of Work', type: 'textarea', required: true },
      ]
    }
  }
};