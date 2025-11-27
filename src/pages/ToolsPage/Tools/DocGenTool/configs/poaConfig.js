export const poaConfig = {
  id: 'poa',
  title: 'Power of Attorney (PoA)',
  subtitle: 'Authorize an agent to act on your behalf.',
  apiEndpoint: '/docs/poa_generator',
  downloadEndpoint: '/docs/poa_download',
  initialState: {
    execution_date: '',
    place_of_execution: '',
    principal_name: '',
    principal_age: '',
    principal_father_name: '',
    principal_address: '',
    attorney_name: '',
    attorney_age: '',
    attorney_father_name: '',
    attorney_address: '',
    purpose_of_poa: '',
    specific_powers: []
  },
  tabs: [{ id: 'parties', label: 'Parties' }, { id: 'powers', label: 'Powers' }],
  sections: {
    principal: {
      tab: 'parties',
      title: 'Principal (You)',
      type: 'form',
      fields: [
        { name: 'principal_name', label: 'Full Name', required: true, span: 'half' },
        { name: 'principal_father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'principal_age', label: 'Age', type: 'number', required: true, span: 'half' },
        { name: 'principal_address', label: 'Address', required: true, span: 'half' },
      ]
    },
    attorney: {
      tab: 'parties',
      title: 'Attorney (Agent)',
      type: 'form',
      fields: [
        { name: 'attorney_name', label: 'Full Name', required: true, span: 'half' },
        { name: 'attorney_father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'attorney_age', label: 'Age', type: 'number', required: true, span: 'half' },
        { name: 'attorney_address', label: 'Address', required: true, span: 'half' },
      ]
    },
    details: {
      tab: 'powers',
      title: 'PoA Details',
      type: 'form',
      fields: [
        { name: 'purpose_of_poa', label: 'Purpose of PoA', placeholder: 'e.g., Managing property while abroad', type: 'textarea', required: true },
        { name: 'execution_date', label: 'Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place', required: true, span: 'half' },
      ]
    },
    powersList: {
      tab: 'powers',
      title: 'Specific Powers',
      type: 'dynamicList',
      listName: 'specific_powers',
      itemTitle: 'Power',
      isSimpleStringList: true, // Special flag for list of strings
      newItem: '',
      fields: [
        { name: '', label: 'Power Description', placeholder: 'e.g., To sign lease agreements...', required: true }
      ]
    }
  }
};