export const aConfig = {
  id: 'affidavit',
  title: 'General Affidavit',
  subtitle: 'A sworn written statement for legal purposes.',
  apiEndpoint: '/docs/affidavit_generator',
  downloadEndpoint: '/docs/affidavit_download',
  initialState: {
    place_of_execution: '',
    verification_date: '',
    deponent_name: '',
    deponent_father_name: '',
    deponent_age: '',
    deponent_address: '',
    statement_paragraphs: []
  },
  tabs: [{ id: 'main', label: 'Details' }],
  sections: {
    deponent: {
      tab: 'main',
      title: 'Deponent Details',
      type: 'form',
      fields: [
        { name: 'deponent_name', label: 'Full Name', required: true, span: 'half' },
        { name: 'deponent_father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'deponent_age', label: 'Age', type: 'number', required: true, span: 'half' },
        { name: 'deponent_address', label: 'Address', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
        { name: 'verification_date', label: 'Verification Date', type: 'date', required: true, span: 'half' },
      ]
    },
    statements: {
      tab: 'main',
      title: 'Sworn Statements',
      type: 'dynamicList',
      listName: 'statement_paragraphs',
      itemTitle: 'Paragraph',
      isSimpleStringList: true,
      newItem: '',
      fields: [
        { name: '', label: 'Statement Paragraph', type: 'textarea', required: true }
      ]
    }
  }
};