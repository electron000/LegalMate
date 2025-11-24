export const employmentConfig = {
  id: 'employment',
  title: 'Employment Contract',
  subtitle: 'Define job terms, salary, and non-compete clauses.',
  apiEndpoint: '/docs/employment_generator',
  downloadEndpoint: '/docs/employment_download',
  initialState: { employer: '', employee: '', position: '', salary: '', start_date: '' },
  tabs: [{ id: 'general', label: 'Contract Details' }],
  sections: {
    main: {
      tab: 'general',
      title: 'Employment Details',
      type: 'form',
      fields: [
        { name: 'employer', label: 'Employer Name', required: true, span: 'half' },
        { name: 'employee', label: 'Employee Name', required: true, span: 'half' },
        { name: 'position', label: 'Job Title', required: true, span: 'half' },
        { name: 'salary', label: 'Annual Salary', type: 'number', required: true, span: 'half' },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true, span: 'full' },
      ]
    }
  }
};