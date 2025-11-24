export const legalNoticeDuesConfig = {
  id: 'legal_notice_dues',
  title: 'Legal Notice for Dues',
  subtitle: 'Formal demand for payment recovery.',
  apiEndpoint: '/docs/legal_notice_generator',
  downloadEndpoint: '/docs/legal_notice_download',
  initialState: { sender: '', recipient: '', amount: '', due_date: '' },
  tabs: [{ id: 'main', label: 'Notice Details' }],
  sections: {
    main: {
      tab: 'main',
      title: 'Payment Demand',
      type: 'form',
      fields: [
        { name: 'sender', label: 'Sender Name', required: true, span: 'half' },
        { name: 'recipient', label: 'Recipient Name', required: true, span: 'half' },
        { name: 'amount', label: 'Amount Due', type: 'number', required: true, span: 'half' },
        { name: 'due_date', label: 'Original Due Date', type: 'date', required: true, span: 'half' },
      ]
    }
  }
};