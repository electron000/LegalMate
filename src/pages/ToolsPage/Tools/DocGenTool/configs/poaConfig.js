export const poaConfig = {
  id: 'poa',
  title: 'Power of Attorney (PoA)',
  subtitle: 'Authorize an agent to act on your behalf.',
  apiEndpoint: '/docs/poa_generator',
  downloadEndpoint: '/docs/poa_download',
  outputType: 'preview', 
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
    /* ---------------------------------------------------------------------- */
    /* 1. PRINCIPAL (All Mandatory)                                           */
    /* ---------------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------------- */
    /* 2. ATTORNEY (All Mandatory)                                            */
    /* ---------------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------------- */
    /* 3. DETAILS (All Mandatory)                                             */
    /* ---------------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------------- */
    /* 4. SPECIFIC POWERS (Mandatory List)                                    */
    /* ---------------------------------------------------------------------- */
    powersList: {
      tab: 'powers',
      title: 'Specific Powers',
      type: 'dynamicList',
      listName: 'specific_powers',
      itemTitle: 'Power',
      required: true,
      
      // 1. ADD THIS FLAG
      isSimpleStringList: true, 
      
      // 2. Ensure newItem is an object so React handles it correctly in the UI
      newItem: { description: '' }, 
      
      fields: [
        // 3. Ensure name matches the key in newItem
        { name: 'description', label: 'Power Description', placeholder: 'e.g., To sign lease agreements...', required: true, type: 'textarea' }
      ]
    }
  }
};