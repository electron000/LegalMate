export const craConfig = {
  id: 'cra',
  title: 'Commercial Rental Agreement',
  subtitle: 'Define terms for your commercial property lease.',
  apiEndpoint: '/docs/cra_generator',      
  downloadEndpoint: '/docs/cra_download',  
  outputType: 'preview', 
  initialState: {
    execution_date: '',
    place_of_execution: '',
    landlord: { name: '', parent_name: '', address: '' },
    tenant: { tenant_type: 'individual', name: '', parent_name: '', address: '', organization_name: '', authorized_signatory: '', registration_number: '' },
    premises_address: '',
    premises_boundaries: { north: '', south: '', east: '', west: '' },
    start_date: '',
    end_date: '',
    rent_amount: '',
    rent_due_day: '',
    security_deposit_amount: '',
    security_deposit_refund_period_days: '',
    permitted_business_use: '',
    lock_in_period_months: '',
    notice_period_months: '',
  },
  tabs: [
    { id: 'parties', label: 'Parties' },
    { id: 'premises', label: 'Premises Details' },
    { id: 'terms', label: 'Rental Terms' },
  ],
  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. PARTIES (Landlord = Mandatory)                                      */
    /* ---------------------------------------------------------------------- */
    landlord: {
      tab: 'parties',
      title: 'Landlord Details',
      type: 'form',
      fields: [
        { name: 'landlord.name', label: 'Full Name', required: true, span: 'half' },
        { name: 'landlord.parent_name', label: "Parent's Name", required: true, span: 'half' },
        { name: 'landlord.address', label: 'Full Address', required: true, type: 'textarea' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 2. PARTIES (Tenant Type = Mandatory)                                   */
    /* ---------------------------------------------------------------------- */
    tenant: {
      tab: 'parties',
      title: 'Tenant Details',
      type: 'form',
      fields: [
        { name: 'tenant.tenant_type', label: 'Tenant Type', required: true, type: 'radio', options: [{ label: 'Individual', value: 'individual' }, { label: 'Organization', value: 'organization' }] },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 3. PARTIES (Individual Tenant = Mandatory if selected)                 */
    /* ---------------------------------------------------------------------- */
    tenantIndividual: {
      tab: 'parties',
      title: 'Individual Tenant',
      type: 'form',
      condition: (data) => data.tenant.tenant_type === 'individual',
      fields: [
        { name: 'tenant.name', label: 'Full Name', required: true, span: 'half' },
        { name: 'tenant.parent_name', label: "Parent's Name", required: true, span: 'half' },
        { name: 'tenant.address', label: 'Full Address', required: true, type: 'textarea' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 4. PARTIES (Org Tenant = Mandatory except Reg Number)                  */
    /* ---------------------------------------------------------------------- */
    tenantOrg: {
      tab: 'parties',
      title: 'Organization Tenant',
      type: 'form',
      condition: (data) => data.tenant.tenant_type === 'organization',
      fields: [
        { name: 'tenant.organization_name', label: 'Organization Name', required: true, span: 'half' },
        { name: 'tenant.authorized_signatory', label: 'Authorized Signatory', required: true, span: 'half' },
        // This is the ONLY optional field in the entire config
        { name: 'tenant.registration_number', label: 'CIN / Registration Number', span: 'full' }, 
        { name: 'tenant.address', label: 'Full Address', required: true, type: 'textarea' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 5. PREMISES (Mandatory)                                                */
    /* ---------------------------------------------------------------------- */
    premisesAddress: {
      tab: 'premises',
      title: 'Premises Address',
      type: 'form',
      fields: [
        { name: 'premises_address', label: 'Full Address of the Shop/Premises', required: true, type: 'textarea' },
      ],
    },
    premisesBoundaries: {
      tab: 'premises',
      title: 'Boundaries',
      type: 'form',
      fields: [
        { name: 'premises_boundaries.north', label: 'North', required: true, span: 'half' },
        { name: 'premises_boundaries.south', label: 'South', required: true, span: 'half' },
        { name: 'premises_boundaries.east', label: 'East', required: true, span: 'half' },
        { name: 'premises_boundaries.west', label: 'West', required: true, span: 'half' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 6. TERMS (Mandatory)                                                   */
    /* ---------------------------------------------------------------------- */
    terms: {
      tab: 'terms',
      title: 'Agreement & Rental Terms',
      type: 'form',
      fields: [
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', placeholder: 'City', required: true, span: 'half' },
        { name: 'start_date', label: 'Agreement Start Date', type: 'date', required: true, span: 'half' },
        { name: 'end_date', label: 'Agreement End Date', type: 'date', required: true, span: 'half' },
        { name: 'rent_amount', label: 'Monthly Rent (₹)', type: 'number', required: true, span: 'half' },
        { name: 'rent_due_day', label: 'Rent Due Day of Month', type: 'number', placeholder: 'e.g., 5', required: true, span: 'half' },
        { name: 'permitted_business_use', label: 'Permitted Business Use', placeholder: 'e.g., Retail clothing store', required: true },
      ],
    },
    clauses: {
      tab: 'terms',
      title: 'Security Deposit & Clauses',
      type: 'form',
      fields: [
        { name: 'security_deposit_amount', label: 'Security Deposit (₹)', type: 'number', required: true, span: 'half' },
        { name: 'security_deposit_refund_period_days', label: 'Deposit Refund Period (Days)', type: 'number', placeholder: 'e.g., 60', required: true, span: 'half' },
        { name: 'lock_in_period_months', label: 'Lock-in Period (Months)', type: 'number', placeholder: 'e.g., 6', required: true, span: 'half' },
        { name: 'notice_period_months', label: 'Notice Period (Months)', type: 'number', placeholder: 'e.g., 2', required: true, span: 'half' },
      ],
    },
  },
};