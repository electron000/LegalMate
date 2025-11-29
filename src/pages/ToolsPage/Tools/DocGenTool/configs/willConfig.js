export const willConfig = {
  id: 'will',
  title: 'Last Will & Testament',
  subtitle: 'Draft your will to distribute your assets as you wish.',
  apiEndpoint: '/docs/will_generator',
  downloadEndpoint: '/docs/will_download',
  outputType: 'preview', 
  initialState: {
    testator_name: '',
    testator_father_name: '',
    testator_age: '',
    testator_address: '',
    executors: [],
    beneficiaries: [],
    bequests: [],
    residuary_beneficiary_name: '',
    guardian: { name: '', relationship: '', address: '' },
    execution_date: '',
    place_of_execution: '',
  },
  tabs: [
    { id: 'testator', label: 'Testator Details' },
    { id: 'executors', label: 'Executors' },
    { id: 'beneficiaries', label: 'Beneficiaries' },
    { id: 'bequests', label: 'Asset Bequests' },
    { id: 'final', label: 'Final Details' },
  ],
  sections: {
    /* ---------------------------------------------------------------------- */
    /* 1. TESTATOR (Mandatory)                                                */
    /* ---------------------------------------------------------------------- */
    testator: {
      tab: 'testator',
      title: 'Testator Details',
      type: 'form',
      fields: [
        { name: 'testator_name', label: 'Full Name', required: true, span: 'half' },
        { name: 'testator_father_name', label: "Father's Name", required: true, span: 'half' },
        { name: 'testator_age', label: 'Age', type: 'number', required: true, span: 'half' },
        { name: 'testator_address', label: 'Full Address', required: true, type: 'textarea' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 2. EXECUTORS (Mandatory List)                                          */
    /* ---------------------------------------------------------------------- */
    executors: {
      tab: 'executors',
      title: 'Executors',
      type: 'dynamicList',
      listName: 'executors',
      itemTitle: 'Executor',
      required: true, // User MUST add at least one executor
      newItem: { name: '', relationship: '', address: '' },
      fields: [
        { name: 'name', label: 'Full Name', placeholder: 'Full Name', required: true },
        { name: 'relationship', label: 'Relationship', placeholder: 'Relationship', required: true },
        { name: 'address', label: 'Address', placeholder: 'Address', required: true },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 3. BENEFICIARIES (Mandatory List)                                      */
    /* ---------------------------------------------------------------------- */
    beneficiaries: {
      tab: 'beneficiaries',
      title: 'Beneficiaries',
      type: 'dynamicList',
      listName: 'beneficiaries',
      itemTitle: 'Beneficiary',
      required: true, // User MUST add at least one beneficiary
      newItem: { name: '', relationship: '', address: '' },
      fields: [
        { name: 'name', label: 'Full Name', placeholder: 'Full Name', required: true },
        { name: 'relationship', label: 'Relationship', placeholder: 'Relationship', required: true },
        { name: 'address', label: 'Address', placeholder: 'Address', required: true },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 4. BEQUESTS (Mandatory List)                                           */
    /* ---------------------------------------------------------------------- */
    bequests: {
      tab: 'bequests',
      title: 'Asset Bequests',
      type: 'dynamicList',
      listName: 'bequests',
      itemTitle: 'Bequest',
      required: true, // User MUST add at least one asset bequest
      newItem: { asset_description: '', beneficiary_name: '' },
      fields: [
        { name: 'asset_description', label: 'Asset Description', placeholder: 'e.g., My apartment at 123 B, Sunlight Colony, Delhi', type: 'textarea', required: true },
        // This relies on the previous tab being filled. The RenderField component handles this.
        { name: 'beneficiary_name', label: 'Beneficiary', type: 'select', required: true, dynamicOptions: 'beneficiaries' }, 
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 5. FINAL DETAILS (Residuary = Mandatory)                               */
    /* ---------------------------------------------------------------------- */
    residuary: {
      tab: 'final',
      title: 'Residuary Estate',
      type: 'form',
      fields: [
        { name: 'residuary_beneficiary_name', label: 'Residuary Beneficiary', placeholder: 'Name of person to receive remaining assets', required: true },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 6. GUARDIAN (OPTIONAL)                                                 */
    /* Note: These fields lack 'required: true', so the form can be submitted */
    /* without them. They will be treated as 'extras' if filled.              */
    /* ---------------------------------------------------------------------- */
    guardian: {
      tab: 'final',
      title: 'Guardian for Minors (Optional)',
      type: 'form',
      fields: [
        { name: 'guardian.name', label: "Guardian's Name", span: 'half' },
        { name: 'guardian.relationship', label: 'Relationship', span: 'half' },
        { name: 'guardian.address', label: "Guardian's Address", type: 'textarea' },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* 7. EXECUTION (Mandatory)                                               */
    /* ---------------------------------------------------------------------- */
    execution: {
      tab: 'final',
      title: 'Execution Details',
      type: 'form',
      fields: [
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', placeholder: 'City', required: true, span: 'half' },
      ],
    },
  },
};