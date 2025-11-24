export const aConfig = {
  id: 'affidavit',
  title: 'General Affidavit',
  subtitle: 'A sworn written statement for legal purposes.',
  apiEndpoint: '/docs/affidavit_generator',
  downloadEndpoint: '/docs/affidavit_download',
  initialState: { affiant: '', statement: '' },
  tabs: [{ id: 'main', label: 'Statement' }],
  sections: {
    main: {
      tab: 'main',
      title: 'Affidavit Details',
      type: 'form',
      fields: [
        { name: 'affiant', label: 'Affiant Name', required: true, span: 'full' },
        { name: 'statement', label: 'Sworn Statement', type: 'textarea', required: true },
      ]
    }
  }
};