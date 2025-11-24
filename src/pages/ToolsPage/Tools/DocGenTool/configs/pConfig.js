export const partnershipConfig = {
  id: 'partnership',
  title: 'General Partnership Agreement',
  subtitle: 'Establish business formation and profit sharing.',
  apiEndpoint: '/docs/partnership_generator',
  downloadEndpoint: '/docs/partnership_download',
  initialState: { partnership_name: '', partners: [] },
  tabs: [{ id: 'general', label: 'General' }],
  sections: {
    info: {
      tab: 'general',
      title: 'Partnership Info',
      type: 'form',
      fields: [{ name: 'partnership_name', label: 'Partnership Name', required: true }]
    },
    partners: {
      tab: 'general',
      title: 'Partners',
      type: 'dynamicList',
      listName: 'partners',
      itemTitle: 'Partner',
      newItem: { name: '', contribution: '' },
      fields: [
        { name: 'name', label: 'Partner Name', required: true },
        { name: 'contribution', label: 'Capital Contribution', type: 'number' }
      ]
    }
  }
};