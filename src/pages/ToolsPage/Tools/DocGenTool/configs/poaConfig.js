export const poaConfig = {
  id: 'poa',
  title: 'Power of Attorney (PoA)',
  subtitle: 'Authorize an agent to act on your behalf.',
  apiEndpoint: '/docs/poa_generator',
  downloadEndpoint: '/docs/poa_download',
  initialState: { principal: '', agent: '', powers: '' },
  tabs: [{ id: 'parties', label: 'Parties' }],
  sections: {
    main: {
      tab: 'parties',
      title: 'Parties',
      type: 'form',
      fields: [
        { name: 'principal', label: 'Principal (You)', required: true, span: 'half' },
        { name: 'agent', label: 'Agent', required: true, span: 'half' },
        { name: 'powers', label: 'Powers Granted', placeholder: 'Describe what the agent can do...', type: 'textarea', required: true },
      ]
    }
  }
};