export const legalNoticeDuesConfig = {
  id: 'legal_notice_dues',
  title: 'Legal Notice for Dues',
  subtitle: 'Formal demand for payment recovery.',
  apiEndpoint: '/docs/legalnotice_generator',
  downloadEndpoint: '/docs/legalnotice_download',
  initialState: {
    date_of_notice: '',
    sender_name: '',
    sender_address: '',
    recipient_name: '',
    recipient_address: '',
    transaction_details: '',
    outstanding_amount: '',
    payment_deadline_days: ''
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
    details: {
      tab: 'main',
      title: 'Payment Details',
      type: 'form',
      fields: [
        { name: 'transaction_details', label: 'Transaction Details', type: 'textarea', placeholder: 'Describe the service/product provided...', required: true },
        { name: 'outstanding_amount', label: 'Outstanding Amount (₹)', type: 'number', required: true, span: 'half' },
        { name: 'payment_deadline_days', label: 'Payment Deadline (Days)', type: 'number', required: true, span: 'half' },
      ]
    }
  }
};