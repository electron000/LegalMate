export const partnershipConfig = {
  id: 'partnership',
  title: 'General Partnership Agreement',
  subtitle: 'Establish business formation and profit sharing.',
  apiEndpoint: '/docs/partnership_generator',
  downloadEndpoint: '/docs/partnership_download',
  initialState: {
    execution_date: '',
    place_of_execution: '',
    firm_name: '',
    firm_address: '',
    business_activity: '',
    start_date: '',
    partners: []
  },
  tabs: [{ id: 'general', label: 'Firm Details' }, { id: 'partners', label: 'Partners' }],
  sections: {
    info: {
      tab: 'general',
      title: 'Firm Information',
      type: 'form',
      fields: [
        { name: 'firm_name', label: 'Partnership Firm Name', required: true, span: 'half' },
        { name: 'firm_address', label: 'Firm Address', required: true, span: 'half' },
        { name: 'business_activity', label: 'Business Activity', placeholder: 'e.g., Retail trading of garments', required: true, span: 'full' },
        { name: 'start_date', label: 'Business Start Date', type: 'date', required: true, span: 'half' },
        { name: 'execution_date', label: 'Agreement Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'full' },
      ]
    },
    partnersList: {
      tab: 'partners',
      title: 'Partners Details',
      type: 'dynamicList',
      listName: 'partners',
      itemTitle: 'Partner',
      newItem: { name: '', address: '', capital_contribution: '', profit_share_percentage: '' },
      fields: [
        { name: 'name', label: 'Partner Name', required: true, span: 'half' },
        { name: 'address', label: 'Address', required: true, span: 'half' },
        { name: 'capital_contribution', label: 'Capital Contribution (₹)', type: 'number', required: true, span: 'half' },
        { name: 'profit_share_percentage', label: 'Profit Share (%)', type: 'number', required: true, span: 'half' }
      ]
    }
  }
};