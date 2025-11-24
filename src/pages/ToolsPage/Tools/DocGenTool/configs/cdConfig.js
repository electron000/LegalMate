export const ceaseDesistConfig = {
  id: 'cease_desist',
  title: 'Cease and Desist Letter',
  subtitle: 'Issue a formal demand to stop infringing activity.',
  apiEndpoint: '/docs/cease_desist_generator',
  downloadEndpoint: '/docs/cease_desist_download',
  initialState: { sender: '', recipient: '', infringing_activity: '' },
  tabs: [{ id: 'main', label: 'Notice Details' }],
  sections: {
    main: {
      tab: 'main',
      title: 'Letter Details',
      type: 'form',
      fields: [
        { name: 'sender', label: 'Sender Name', required: true, span: 'half' },
        { name: 'recipient', label: 'Recipient Name', required: true, span: 'half' },
        { name: 'infringing_activity', label: 'Description of Activity to Stop', type: 'textarea', required: true },
      ]
    }
  }
};