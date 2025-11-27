export const ndaConfig = {
  id: 'nda',
  title: 'Non-Disclosure Agreement (NDA)',
  subtitle: 'Protect confidential information and trade secrets.',
  apiEndpoint: '/docs/nda_generator',
  downloadEndpoint: '/docs/nda_download',
  initialState: {
    execution_date: '',
    place_of_execution: '',
    disclosing_party_name: '',
    disclosing_party_address: '',
    receiving_party_name: '',
    receiving_party_address: '',
    purpose_of_disclosure: '',
    confidentiality_duration_years: '',
    jurisdiction_city: ''
  },
  tabs: [{ id: 'general', label: 'Agreement Details' }],
  sections: {
    parties: {
      tab: 'general',
      title: 'Parties',
      type: 'form',
      fields: [
        { name: 'disclosing_party_name', label: 'Disclosing Party Name', required: true, span: 'half' },
        { name: 'disclosing_party_address', label: 'Disclosing Party Address', required: true, span: 'half' },
        { name: 'receiving_party_name', label: 'Receiving Party Name', required: true, span: 'half' },
        { name: 'receiving_party_address', label: 'Receiving Party Address', required: true, span: 'half' },
      ]
    },
    terms: {
      tab: 'general',
      title: 'Terms',
      type: 'form',
      fields: [
        { name: 'purpose_of_disclosure', label: 'Purpose of Disclosure', placeholder: 'e.g., Evaluating a potential partnership...', type: 'textarea', required: true },
        { name: 'confidentiality_duration_years', label: 'Duration (Years)', type: 'number', required: true, span: 'half' },
        { name: 'jurisdiction_city', label: 'Jurisdiction City', required: true, span: 'half' },
        { name: 'execution_date', label: 'Date of Execution', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
      ]
    }
  }
};