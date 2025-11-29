export const ncaConfig = {
  id: 'name_change',
  title: 'Affidavit for Name Change',
  subtitle: 'Prepare for gazette publication and notarization.',
  apiEndpoint: '/docs/namechange_generator',
  downloadEndpoint: '/docs/namechange_download',
  initialState: {
    place_of_execution: '',
    verification_date: '',
    deponent_old_name: '',
    deponent_new_name: '',
    deponent_father_name: '',
    deponent_age: '',
    deponent_address: '',
    deponent_id_type: '',   // NEW
    deponent_id_number: '', // NEW
    reason_for_change: ''
  },
  tabs: [{ id: 'main', label: 'Details' }],
  sections: {
    details: {
      tab: 'main',
      title: 'Personal Details',
      type: 'form',
      fields: [
        { name: 'deponent_old_name', label: 'Old Name', required: true, span: 'half' },
        { name: 'deponent_new_name', label: 'New Name', required: true, span: 'half' },
        { name: 'deponent_father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'deponent_age', label: 'Age', type: 'number', required: true, span: 'half' },
        { name: 'deponent_address', label: 'Address', required: true, span: 'full' },
        
        // NEW ID FIELDS
        { name: 'deponent_id_type', label: 'ID Proof (e.g. Aadhaar)', required: false, span: 'half' },
        { name: 'deponent_id_number', label: 'ID Number', required: false, span: 'half' },

        { name: 'reason_for_change', label: 'Reason for Change', type: 'textarea', required: true },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
        { name: 'verification_date', label: 'Verification Date', type: 'date', required: true, span: 'half' },
      ]
    }
  }
};