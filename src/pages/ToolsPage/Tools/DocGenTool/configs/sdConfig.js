export const sdConfig = {
  id: 'sd',
  title: 'Sale Deed',
  subtitle: 'Draft a deed for the sale of property.',
  // Phase 1: Generate Text
  apiEndpoint: '/docs/sd_generator',
  // Phase 2: Download DOCX
  downloadEndpoint: '/docs/sd_download',
  outputType: 'preview', 
  initialState: {
    execution_date: '',
    place_of_execution: '',
    vendor: { name: '', parent_name: '', address: '' },
    vendee: { name: '', parent_name: '', address: '' },
    property_address: '',
    property_boundaries: { north: '', south: '', east: '', west: '' },
    total_consideration: '',
    payment_details: [{ amount: '', mode: '', details: '' }],
    vendor_acquisition_method: '',
  },
  tabs: [
    { id: 'parties', label: 'Parties' },
    { id: 'property', label: 'Property Details' },
    { id: 'consideration', label: 'Consideration' },
  ],
  sections: {
    vendor: {
      tab: 'parties',
      title: 'Vendor (Seller) Details',
      type: 'form',
      fields: [
        { name: 'vendor.name', label: 'Full Name', required: true, span: 'half' },
        { name: 'vendor.parent_name', label: "Parent's Name", required: true, span: 'half' },
        { name: 'vendor.address', label: 'Full Address', required: true, type: 'textarea' },
      ],
    },
    vendee: {
      tab: 'parties',
      title: 'Vendee (Buyer) Details',
      type: 'form',
      fields: [
        { name: 'vendee.name', label: 'Full Name', required: true, span: 'half' },
        { name: 'vendee.parent_name', label: "Parent's Name", required: true, span: 'half' },
        { name: 'vendee.address', label: 'Full Address', required: true, type: 'textarea' },
      ],
    },
    propertyAddress: {
      tab: 'property',
      title: 'Property Address',
      type: 'form',
      fields: [
        { name: 'property_address', label: 'Full Address of the Property being sold', required: true, type: 'textarea' },
      ],
    },
    propertyBoundaries: {
      tab: 'property',
      title: 'Property Boundaries',
      type: 'form',
      fields: [
        { name: 'property_boundaries.north', label: 'North', required: true, span: 'half' },
        { name: 'property_boundaries.south', label: 'South', required: true, span: 'half' },
        { name: 'property_boundaries.east', label: 'East', required: true, span: 'half' },
        { name: 'property_boundaries.west', label: 'West', required: true, span: 'half' },
      ],
    },
    consideration: {
      tab: 'consideration',
      title: 'Execution & Consideration Details',
      type: 'form',
      fields: [
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', placeholder: 'City', required: true, span: 'half' },
        { name: 'total_consideration', label: 'Total Sale Consideration (₹)', type: 'number', required: true },
        { name: 'vendor_acquisition_method', label: 'How Vendor Acquired Property', placeholder: 'e.g., By a previous sale deed dated 01-01-2010', required: true, type: 'textarea' },
      ],
    },
    payments: {
      tab: 'consideration',
      title: 'Payment Details',
      type: 'dynamicList',
      listName: 'payment_details',
      itemTitle: 'Payment',
      required: true,
      newItem: { amount: '', mode: '', details: '' },
      fields: [
        { name: 'amount', label: 'Amount (₹)', placeholder: 'Amount (₹)', type: 'number', required: true },
        { name: 'mode', label: 'Mode of Payment', placeholder: 'e.g., Cheque, RTGS', required: true },
        { name: 'details', label: 'Details', placeholder: 'e.g., Cheque No. 123456...', type: 'textarea', required: true },
      ],
    },
  },
};