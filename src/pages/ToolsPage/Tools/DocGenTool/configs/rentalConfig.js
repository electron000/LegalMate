export const rentalConfig = {
  id: 'rental',
  title: 'Residential Rental Agreement',
  subtitle: 'standard residential rent agreement',
  apiEndpoint: '/docs/rental_generator',      
  downloadEndpoint: '/docs/rental_download',  
  outputType: 'preview', 
  
  initialState: {
    place_of_execution: '',
    execution_date: '',
    owner_name: '',
    owner_father: '',
    owner_address: '',
    tenant_name: '',
    tenant_father: '',
    tenant_address: '',
    premises_address: '',
    rent_amount: '',
    start_date: '',
    end_date: '',
    security_deposit_amount: '',
    security_amount_words: '',
    first_witness: '',
    second_witness: '',
  },

  tabs: [
    { id: 'parties', label: 'Landlord & Tenant' },
    { id: 'property', label: 'Property & Terms' },
    { id: 'witnesses', label: 'Witnesses' },
  ],

  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. PARTIES (Landlord & Tenant = All Mandatory)                         */
    /* ---------------------------------------------------------------------- */
    landlord: {
      tab: 'parties',
      title: 'Landlord (First Party) Details',
      type: 'form',
      fields: [
        { name: 'owner_name', label: 'Landlord Name', required: true, span: 'half' },
        { name: 'owner_father', label: "Landlord's Father's Name", required: true, span: 'half' },
        { name: 'owner_address', label: 'Landlord Residential Address', required: true, type: 'textarea' },
      ],
    },
    tenant: {
      tab: 'parties',
      title: 'Tenant (Second Party) Details',
      type: 'form',
      fields: [
        { name: 'tenant_name', label: 'Tenant Name', required: true, span: 'half' },
        { name: 'tenant_father', label: "Tenant's Father's Name", required: true, span: 'half' },
        { name: 'tenant_address', label: 'Tenant Permanent Address', required: true, type: 'textarea' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 2. PROPERTY & TERMS (All Mandatory)                                    */
    /* ---------------------------------------------------------------------- */
    premises: {
      tab: 'property',
      title: 'Rented Premises Details',
      type: 'form',
      fields: [
        { name: 'premises_address', label: 'Address of Property being Rented', required: true, type: 'textarea' },
        { name: 'place_of_execution', label: 'City/Place of Execution', placeholder: 'e.g., New Delhi', required: true, span: 'half' },
        { name: 'execution_date', label: 'Agreement Date', type: 'date', required: true, span: 'half' },
      ],
    },
    terms: {
      tab: 'property',
      title: 'Rental Terms',
      type: 'form',
      fields: [
        { name: 'start_date', label: 'Tenancy Start Date', type: 'date', required: true, span: 'half' },
        { name: 'end_date', label: 'Tenancy End Date (11 Months)', type: 'date', required: true, span: 'half' },
        { name: 'rent_amount', label: 'Monthly Rent (₹)', type: 'number', required: true, span: 'half' },
        { name: 'security_deposit_amount', label: 'Security Deposit Amount (₹)', type: 'number', required: true, span: 'half' },
        { name: 'security_amount_words', label: 'Security Deposit in Words', placeholder: 'e.g., Ten Thousand Only', required: true, span: 'full' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 3. WITNESSES (All Mandatory)                                           */
    /* ---------------------------------------------------------------------- */
    witnesses: {
      tab: 'witnesses',
      title: 'Witness Details',
      type: 'form',
      fields: [
        { name: 'first_witness', label: 'Witness 1 Name & Address', placeholder: 'Name, S/o Father Name, R/o Address', required: true, type: 'textarea' },
        { name: 'second_witness', label: 'Witness 2 Name & Address', placeholder: 'Name, S/o Father Name, R/o Address', required: true, type: 'textarea' },
      ],
    },
  },
};