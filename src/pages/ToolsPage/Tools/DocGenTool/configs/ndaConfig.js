export const ndaConfig = {
  id: 'nda',
  title: 'Non-Disclosure Agreement (NDA)',
  subtitle: 'Protect confidential information and trade secrets.',
  apiEndpoint: '/docs/nda_generator',
  downloadEndpoint: '/docs/nda_download',
  outputType: 'preview',
  initialState: {
    disclosing_party: { name: '', address: '' },
    receiving_party: { name: '', address: '' },
    execution_date: '',
    confidentiality_duration_years: '',
  },
  tabs: [{ id: 'details', label: 'Agreement Details' }],
  sections: {
    parties: {
      tab: 'details',
      title: 'Parties involved',
      type: 'form',
      fields: [
        { name: 'disclosing_party.name', label: 'Disclosing Party Name', required: true, span: 'half' },
        { name: 'receiving_party.name', label: 'Receiving Party Name', required: true, span: 'half' },
        { name: 'disclosing_party.address', label: 'Disclosing Party Address', type: 'textarea' },
        { name: 'receiving_party.address', label: 'Receiving Party Address', type: 'textarea' },
      ]
    },
    terms: {
      tab: 'details',
      title: 'Terms',
      type: 'form',
      fields: [
        { name: 'execution_date', label: 'Date', type: 'date', required: true, span: 'half' },
        { name: 'confidentiality_duration_years', label: 'Duration (Years)', type: 'number', required: true, span: 'half' },
      ]
    }
  }
};