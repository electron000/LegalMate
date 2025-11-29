export const freelancerConfig = {
  id: 'freelancer',
  title: 'Freelancer Agreement',
  subtitle: 'Contract for independent contractors and IP rights.',
  apiEndpoint: '/docs/freelancer_generator',
  downloadEndpoint: '/docs/freelancer_download',
  outputType: 'preview', 
  initialState: {
    execution_date: '',
    place_of_execution: '',
    client_name: '',
    client_address: '',
    freelancer_name: '',
    freelancer_address: '',
    scope_of_work: '',
    total_fee: '',
    deadline_date: '',
    termination_notice_days: '', // NEW
    jurisdiction_city: ''        // NEW
  },
  tabs: [{ id: 'details', label: 'Agreement Details' }],
  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. PARTIES (All Mandatory)                                             */
    /* ---------------------------------------------------------------------- */
    parties: {
      tab: 'details',
      title: 'Parties',
      type: 'form',
      fields: [
        { name: 'client_name', label: 'Client Name', required: true, span: 'half' },
        { name: 'client_address', label: 'Client Address', required: true, span: 'half' },
        { name: 'freelancer_name', label: 'Freelancer Name', required: true, span: 'half' },
        { name: 'freelancer_address', label: 'Freelancer Address', required: true, span: 'half' },
      ]
    },
    /* ---------------------------------------------------------------------- */
    /* 2. PROJECT DETAILS (All Mandatory)                                     */
    /* ---------------------------------------------------------------------- */
    project: {
      tab: 'details',
      title: 'Project Details',
      type: 'form',
      fields: [
        { name: 'scope_of_work', label: 'Scope of Work', type: 'textarea', required: true },
        { name: 'total_fee', label: 'Total Project Fee (₹)', type: 'number', required: true, span: 'half' },
        { name: 'total_fee_in_words', label: 'Total Fee (in Words)', required: true, span: 'half' },
        { name: 'deadline_date', label: 'Deadline Date', type: 'date', required: true, span: 'half' },
        
        // NEW FIELDS
        { name: 'termination_notice_days', label: 'Termination Notice (Days)', type: 'number', required: true, span: 'half' },
        { name: 'jurisdiction_city', label: 'Jurisdiction City', required: true, span: 'half' },

        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'half' },
      ]
    }
  }
};