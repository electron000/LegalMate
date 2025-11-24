export const ncaConfig = {
  id: 'name_change',
  title: 'Affidavit for Name Change',
  subtitle: 'Prepare for gazette publication and notarization.',
  apiEndpoint: '/docs/name_change_generator',
  downloadEndpoint: '/docs/name_change_download',
  initialState: { old_name: '', new_name: '', reason: '' },
  tabs: [{ id: 'main', label: 'Details' }],
  sections: {
    main: {
      tab: 'main',
      title: 'Name Change Details',
      type: 'form',
      fields: [
        { name: 'old_name', label: 'Old Name', required: true, span: 'half' },
        { name: 'new_name', label: 'New Name', required: true, span: 'half' },
        { name: 'reason', label: 'Reason for Change', type: 'textarea', required: true },
      ]
    }
  }
};