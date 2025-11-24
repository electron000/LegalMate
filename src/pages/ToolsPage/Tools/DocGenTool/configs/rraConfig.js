export const rraConfig = {
  id: 'residential_rent',
  title: 'Residential Rent Agreement',
  subtitle: 'Standard 11-month lease for residential property.',
  apiEndpoint: '/docs/rent_generator',
  downloadEndpoint: '/docs/rent_download',
  initialState: { landlord: '', tenant: '', address: '', rent: '' },
  tabs: [{ id: 'main', label: 'Lease Details' }],
  sections: {
    main: {
      tab: 'main',
      title: 'Lease Details',
      type: 'form',
      fields: [
        { name: 'landlord', label: 'Landlord Name', required: true, span: 'half' },
        { name: 'tenant', label: 'Tenant Name', required: true, span: 'half' },
        { name: 'rent', label: 'Monthly Rent', type: 'number', required: true, span: 'full' },
        { name: 'address', label: 'Property Address', type: 'textarea', required: true },
      ]
    }
  }
};