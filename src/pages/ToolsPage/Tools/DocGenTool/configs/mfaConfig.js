export const mfaConfig = {
  id: 'mfa',
  title: 'Marital Financial Agreement',
  subtitle: 'Define financial arrangements and asset division.',
  apiEndpoint: '/docs/mfa_generator',
  downloadEndpoint: '/docs/mfa_download',
  outputType: 'preview', 
  initialState: {
    execution_date: '',
    place_of_execution: '',
    marriage_date: '',
    partyOne: {
      personal: { name: '', father_name: '', mother_name: '', dob: '', gender: '', address: '' },
      employment: { occupation: '', employer: '', annual_income: '' },
      assets: { real_estate: [], bank_account: [], investment: [] },
      liabilities: { loans: [] },
    },
    partyTwo: {
      personal: { name: '', father_name: '', mother_name: '', dob: '', gender: '', address: '' },
      employment: { occupation: '', employer: '', annual_income: '' },
      assets: { real_estate: [], bank_account: [], investment: [] },
      liabilities: { loans: [] },
    },
  },
  tabs: [
    { id: 'agreement', label: 'Agreement Details' },
    // Bank details will now appear inside these tabs
    { id: 'party1', label: 'Party One Details' },
    { id: 'party2', label: 'Party Two Details' },
    // Financials now only contain assets/liabilities not related to banking
    { id: 'financials1', label: "Party One's Assets" },
    { id: 'financials2', label: "Party Two's Assets" },
  ],
  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. AGREEMENT (Mandatory)                                               */
    /* ---------------------------------------------------------------------- */
    agreement: {
      tab: 'agreement',
      title: 'Agreement Details',
      type: 'form',
      fields: [
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'third' },
        { name: 'place_of_execution', label: 'Place of Execution', placeholder: 'City', required: true, span: 'third' },
        { name: 'marriage_date', label: 'Marriage Date', type: 'date', required: true, span: 'third' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 2. PARTY ONE (Personal + Bank = Mandatory)                             */
    /* ---------------------------------------------------------------------- */
    partyOnePersonal: {
      tab: 'party1',
      title: 'Party One: Personal Details',
      type: 'form',
      fields: [
        { name: 'partyOne.personal.name', label: 'Full Name', required: true, span: 'half' },
        { name: 'partyOne.personal.dob', label: 'Date of Birth', type: 'date', required: true, span: 'half' },
        { name: 'partyOne.personal.father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'partyOne.personal.mother_name', label: "Mother's Name", required: true, span: 'half' },
        { name: 'partyOne.personal.gender', label: 'Gender', required: true, type: 'select', options: [{ label: 'Select...', value: '' }, { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }], span: 'half' },
        { name: 'partyOne.personal.address', label: 'Address', required: true, type: 'textarea', span: 'full' },
      ],
    },
    // MOVED HERE: Bank Details are now part of the Personal Tab validation flow
    partyOneBank: {
      tab: 'party1',
      title: 'Party One: Bank Accounts (Required)',
      type: 'dynamicList',
      listName: 'partyOne.assets.bank_account',
      itemTitle: 'Account',
      required: true, // STRICT: List cannot be empty
      newItem: { bank_name: '', account_number: '', balance: '' },
      fields: [
        { name: 'bank_name', label: 'Bank Name', placeholder: 'Bank Name', required: true },
        { name: 'account_number', label: 'Account Number', placeholder: 'Account Number', required: true },
        { name: 'balance', label: 'Balance (₹)', placeholder: 'Balance (₹)', type: 'number', required: true },
      ],
    },
    // Employment is mandatory per your request
    partyOneEmployment: {
      tab: 'party1',
      title: 'Party One: Employment',
      type: 'form',
      fields: [
        { name: 'partyOne.employment.occupation', label: 'Occupation', required: true, span: 'half' },
        { name: 'partyOne.employment.employer', label: 'Employer', required: true, span: 'half' },
        { name: 'partyOne.employment.annual_income', label: 'Annual Income (₹)', type: 'number', required: true },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 3. PARTY TWO (Personal + Bank = Mandatory)                             */
    /* ---------------------------------------------------------------------- */
    partyTwoPersonal: {
      tab: 'party2',
      title: 'Party Two: Personal Details',
      type: 'form',
      fields: [
        { name: 'partyTwo.personal.name', label: 'Full Name', required: true, span: 'half' },
        { name: 'partyTwo.personal.dob', label: 'Date of Birth', type: 'date', required: true, span: 'half' },
        { name: 'partyTwo.personal.father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'partyTwo.personal.mother_name', label: "Mother's Name", required: true, span: 'half' },
        { name: 'partyTwo.personal.gender', label: 'Gender', required: true, type: 'select', options: [{ label: 'Select...', value: '' }, { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }], span: 'half' },
        { name: 'partyTwo.personal.address', label: 'Address', required: true, type: 'textarea', span: 'full' },
      ],
    },
    // MOVED HERE
    partyTwoBank: {
      tab: 'party2',
      title: 'Party Two: Bank Accounts (Required)',
      type: 'dynamicList',
      listName: 'partyTwo.assets.bank_account',
      itemTitle: 'Account',
      required: true, // STRICT
      newItem: { bank_name: '', account_number: '', balance: '' },
      fields: [
        { name: 'bank_name', label: 'Bank Name', placeholder: 'Bank Name', required: true },
        { name: 'account_number', label: 'Account Number', placeholder: 'Account Number', required: true },
        { name: 'balance', label: 'Balance (₹)', placeholder: 'Balance (₹)', type: 'number', required: true },
      ],
    },
    partyTwoEmployment: {
      tab: 'party2',
      title: 'Party Two: Employment',
      type: 'form',
      fields: [
        { name: 'partyTwo.employment.occupation', label: 'Occupation', required: true, span: 'half' },
        { name: 'partyTwo.employment.employer', label: 'Employer', required: true, span: 'half' },
        { name: 'partyTwo.employment.annual_income', label: 'Annual Income (₹)', type: 'number', required: true },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* REMAINING TABS (Optional / Extra Assets)                               */
    /* Fields here are not marked 'required: true' so they are optional       */
    /* ---------------------------------------------------------------------- */
    partyOneRealEstate: {
      tab: 'financials1',
      title: 'Party One: Real Estate (Optional)',
      type: 'dynamicList',
      listName: 'partyOne.assets.real_estate',
      itemTitle: 'Property',
      newItem: { address: '', value: '', is_pre_marital: true },
      fields: [
        { name: 'address', label: 'Property Address', placeholder: 'Property Address' }, // No required: true
        { name: 'value', label: 'Value (₹)', placeholder: 'Value (₹)', type: 'number' },
        { name: 'is_pre_marital', label: 'Type', type: 'select', options: [{ label: 'Pre-Marital', value: true }, { label: 'Marital', value: false }] },
      ],
    },
    partyOneInvestments: {
      tab: 'financials1',
      title: 'Party One: Investments (Optional)',
      type: 'dynamicList',
      listName: 'partyOne.assets.investment',
      itemTitle: 'Investment',
      newItem: { type: '', company: '', value: '', is_pre_marital: true },
      fields: [
        { name: 'type', label: 'Type', placeholder: 'Investment Type' },
        { name: 'company', label: 'Company', placeholder: 'Company' },
        { name: 'value', label: 'Value (₹)', placeholder: 'Value (₹)', type: 'number' },
        { name: 'is_pre_marital', label: 'Type', type: 'select', options: [{ label: 'Pre-Marital', value: true }, { label: 'Marital', value: false }] },
      ],
    },
    partyOneLoans: {
      tab: 'financials1',
      title: 'Party One: Liabilities (Optional)',
      type: 'dynamicList',
      listName: 'partyOne.liabilities.loans',
      itemTitle: 'Loan',
      newItem: { type: '', amount: '', bank: '' },
      fields: [
        { name: 'type', label: 'Type', placeholder: 'Loan Type' },
        { name: 'amount', label: 'Amount (₹)', placeholder: 'Amount (₹)', type: 'number' },
        { name: 'bank', label: 'Bank/Lender', placeholder: 'Bank/Lender' },
      ],
    },
    
    // PARTY TWO EXTRAS
    partyTwoRealEstate: {
      tab: 'financials2',
      title: 'Party Two: Real Estate (Optional)',
      type: 'dynamicList',
      listName: 'partyTwo.assets.real_estate',
      itemTitle: 'Property',
      newItem: { address: '', value: '', is_pre_marital: true },
      fields: [
        { name: 'address', label: 'Property Address', placeholder: 'Property Address' },
        { name: 'value', label: 'Value (₹)', placeholder: 'Value (₹)', type: 'number' },
        { name: 'is_pre_marital', label: 'Type', type: 'select', options: [{ label: 'Pre-Marital', value: true }, { label: 'Marital', value: false }] },
      ],
    },
    partyTwoInvestments: {
      tab: 'financials2',
      title: 'Party Two: Investments (Optional)',
      type: 'dynamicList',
      listName: 'partyTwo.assets.investment',
      itemTitle: 'Investment',
      newItem: { type: '', company: '', value: '', is_pre_marital: true },
      fields: [
        { name: 'type', label: 'Type', placeholder: 'Investment Type' },
        { name: 'company', label: 'Company', placeholder: 'Company' },
        { name: 'value', label: 'Value (₹)', placeholder: 'Value (₹)', type: 'number' },
        { name: 'is_pre_marital', label: 'Type', type: 'select', options: [{ label: 'Pre-Marital', value: true }, { label: 'Marital', value: false }] },
      ],
    },
    partyTwoLoans: {
      tab: 'financials2',
      title: 'Party Two: Liabilities (Optional)',
      type: 'dynamicList',
      listName: 'partyTwo.liabilities.loans',
      itemTitle: 'Loan',
      newItem: { type: '', amount: '', bank: '' },
      fields: [
        { name: 'type', label: 'Type', placeholder: 'Loan Type' },
        { name: 'amount', label: 'Amount (₹)', placeholder: 'Amount (₹)', type: 'number' },
        { name: 'bank', label: 'Bank/Lender', placeholder: 'Bank/Lender' },
      ],
    },
  },
};