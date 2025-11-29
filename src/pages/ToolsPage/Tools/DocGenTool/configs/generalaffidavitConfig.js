export const aConfig = {
  id: 'affidavit',
  title: 'General Affidavit',
  subtitle: 'A sworn written statement for legal purposes.',
  apiEndpoint: '/docs/affidavit_generator',
  downloadEndpoint: '/docs/affidavit_download',
  outputType: 'preview', 
  initialState: {
    place_of_execution: '',
    verification_date: '',
    deponent_name: '',
    deponent_father_name: '',
    deponent_age: '',
    deponent_address: '',
    deponent_id_type: '',   // NEW
    deponent_id_number: '', // NEW
    statement_paragraphs: []
  },
  tabs: [{ id: 'main', label: 'Details' }],
  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. DEPONENT DETAILS (All Mandatory)                                    */
    /* ---------------------------------------------------------------------- */
    deponent: {
      tab: 'main',
      title: 'Deponent Details',
      type: 'form',
      fields: [
        { name: 'deponent_name', label: 'Full Name', required: true, span: 'half' },
        { name: 'deponent_father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'deponent_age', label: 'Age', type: 'number', required: true, span: 'half' },
        { name: 'deponent_address', label: 'Address', required: true, span: 'half' },
        
        // NEW OPTIONAL FIELDS
        { name: 'deponent_id_type', label: 'ID Proof Type (Optional)', placeholder: 'e.g. Aadhaar / PAN', required: false, span: 'half' },
        { name: 'deponent_id_number', label: 'ID Number (Optional)', required: false, span: 'half' },

        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
        { name: 'verification_date', label: 'Verification Date', type: 'date', required: true, span: 'half' },
      ]
    },
    /* ---------------------------------------------------------------------- */
    /* 2. STATEMENTS (Fixed for Strict Validation & Simple String List)       */
    /* ---------------------------------------------------------------------- */
    statements: {
      tab: 'main',
      title: 'Sworn Statements',
      type: 'dynamicList',
      listName: 'statement_paragraphs',
      itemTitle: 'Paragraph',
      required: true, // Strict: Must have at least one paragraph
      
      // 1. Flag for DocForm to flatten this list on submit
      isSimpleStringList: true,
      
      // 2. Use Object for React UI stability
      newItem: { paragraph: '' },
      
      fields: [
        // 3. Name matches the key in newItem
        { name: 'paragraph', label: 'Statement Paragraph', type: 'textarea', required: true }
      ]
    }
  }
};