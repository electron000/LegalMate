export const ceaseDesistConfig = {
  id: 'cease_desist',
  title: 'Cease and Desist Letter',
  subtitle: 'Issue a formal demand to stop infringing activity.',
  apiEndpoint: '/docs/ceasedesist_generator',
  downloadEndpoint: '/docs/ceasedesist_download',
  initialState: {
    date_of_notice: '',
    sender_name: '',
    sender_address: '',
    recipient_name: '',
    recipient_address: '',
    infringing_activity: '',
    legal_rights_violated: '',
    demand_action: '',
    deadline_days: ''
  },
  tabs: [{ id: 'main', label: 'Notice Details' }],
  sections: {
    parties: {
      tab: 'main',
      title: 'Parties',
      type: 'form',
      fields: [
        { name: 'sender_name', label: 'Sender Name', required: true, span: 'half' },
        { name: 'sender_address', label: 'Sender Address', required: true, span: 'half' },
        { name: 'recipient_name', label: 'Recipient Name', required: true, span: 'half' },
        { name: 'recipient_address', label: 'Recipient Address', required: true, span: 'half' },
        { name: 'date_of_notice', label: 'Date of Notice', type: 'date', required: true, span: 'full' },
      ]
    },
    content: {
      tab: 'main',
      title: 'Infringement Details',
      type: 'form',
      fields: [
        { name: 'infringing_activity', label: 'Description of Activity', type: 'textarea', required: true },
        { name: 'legal_rights_violated', label: 'Legal Rights Violated', placeholder: 'e.g., Copyright, Trademark...', required: true, span: 'full' },
        { name: 'demand_action', label: 'Action Demanded', placeholder: 'e.g., Remove content immediately', required: true, span: 'half' },
        { name: 'deadline_days', label: 'Deadline (Days)', type: 'number', required: true, span: 'half' },
      ]
    }
  }
};