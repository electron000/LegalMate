export const contractConfig = {
  id: 'contract',
  title: 'Contractor Offer & NDA',
  subtitle: 'Offer letter - Non-Disclosure and Terms.',
  apiEndpoint: '/docs/contract_generator',
  downloadEndpoint: '/docs/contract_download',
  outputType: 'preview', 
  initialState: {
    // Header & Parties
    date_of_issue: '',
    company_name: '',
    company_llp_id: '',
    company_address: '',
    company_rep_name: '',
    company_rep_designation: '',
    company_email: '',
    company_website: '',
    
    // Candidate
    candidate_name: '',
    candidate_address: '',
    
    // Role Details
    position_title: '',
    start_date: '',
    contract_duration_text: '', // e.g. "3 months, remote"
    compensation_amount: '',
    
    // Dynamic List for Duties
    responsibilities: [],
    
    // Legal Terms
    probation_period_text: '', // e.g. "Month 1"
    notice_period_days: '',
    non_compete_years: '',
    confidentiality_years: '',
    jurisdiction_city: ''
  },
  tabs: [
    { id: 'parties', label: 'Parties & Role' },
    { id: 'duties', label: 'Responsibilities' },
    { id: 'legal', label: 'Legal Terms' },
  ],
  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. PARTIES (Company & Candidate)                                       */
    /* ---------------------------------------------------------------------- */
    company: {
      tab: 'parties',
      title: 'Company Details',
      type: 'form',
      fields: [
        { name: 'company_name', label: 'Company Name', placeholder: 'e.g. expLocal LLP', required: true, span: 'half' },
        { name: 'company_llp_id', label: 'LLP/Reg ID', placeholder: 'e.g. ACR-1561', required: true, span: 'half' },
        { name: 'company_rep_name', label: 'Signatory Name', placeholder: 'e.g. Khumujam Jenish Singh', required: true, span: 'half' },
        { name: 'company_rep_designation', label: 'Signatory Designation', placeholder: 'e.g. Founder', required: true, span: 'half' },
        { name: 'company_email', label: 'Company Email', placeholder: 'contact@company.com', required: true, span: 'half' },
        { name: 'company_website', label: 'Company Website', placeholder: 'www.company.com', required: true, span: 'half' },
        { name: 'company_address', label: 'Company Address', required: true, type: 'textarea' },
        { name: 'date_of_issue', label: 'Date of Issue', type: 'date', required: true, span: 'half' },
      ]
    },
    candidate: {
      tab: 'parties',
      title: 'Candidate Details',
      type: 'form',
      fields: [
        { name: 'candidate_name', label: 'Candidate Full Name', required: true, span: 'half' },
        { name: 'candidate_address', label: 'Candidate Address', required: true, type: 'textarea' },
      ]
    },
    
    /* ---------------------------------------------------------------------- */
    /* 2. ROLE DETAILS                                                        */
    /* ---------------------------------------------------------------------- */
    role: {
      tab: 'parties',
      title: 'Role & Compensation',
      type: 'form',
      fields: [
        { name: 'position_title', label: 'Position Title', placeholder: 'e.g. Front-end React Developer', required: true, span: 'half' },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true, span: 'half' },
        { name: 'contract_duration_text', label: 'Duration Details', placeholder: 'e.g., 3 months, remote', required: true, span: 'half' },
        { name: 'compensation_amount', label: 'Monthly Compensation (₹)', type: 'number', required: true, span: 'half' },
      ]
    },

    /* ---------------------------------------------------------------------- */
    /* 3. RESPONSIBILITIES (Dynamic List)                                     */
    /* ---------------------------------------------------------------------- */
    duties: {
      tab: 'duties',
      title: 'Key Responsibilities',
      type: 'dynamicList',
      listName: 'responsibilities',
      itemTitle: 'Duty',
      required: true,
      
      // IMPORTANT: Flattens list for the API
      isSimpleStringList: true, 
      newItem: { text: '' }, 
      
      fields: [
        { name: 'text', label: 'Description', placeholder: 'e.g. Deliver 5 responsive screens per week', required: true, type: 'textarea' }
      ]
    },

    /* ---------------------------------------------------------------------- */
    /* 4. LEGAL TERMS (NDA, Termination, etc.)                                */
    /* ---------------------------------------------------------------------- */
    legal: {
      tab: 'legal',
      title: 'Legal & Termination Terms',
      type: 'form',
      fields: [
        { name: 'probation_period_text', label: 'Probation Period Description', placeholder: 'e.g. Month 1 serves as a strict probationary period', required: true, type: 'textarea' },
        { name: 'notice_period_days', label: 'Notice Period (Days)', type: 'number', placeholder: 'e.g. 7', required: true, span: 'half' },
        { name: 'non_compete_years', label: 'Non-Compete Duration (Years)', type: 'number', placeholder: 'e.g. 3', required: true, span: 'half' },
        { name: 'confidentiality_years', label: 'Confidentiality Duration (Years)', type: 'number', placeholder: 'e.g. 4', required: true, span: 'half' },
        { name: 'jurisdiction_city', label: 'Legal Jurisdiction City', placeholder: 'e.g. Bangalore', required: true, span: 'half' },
      ]
    }
  }
};