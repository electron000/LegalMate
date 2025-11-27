export const employmentConfig = {
  id: 'employment',
  title: 'Employment Contract',
  subtitle: 'Define job terms, salary, and non-compete clauses.',
  apiEndpoint: '/docs/employment_generator',
  downloadEndpoint: '/docs/employment_download',
  initialState: {
    execution_date: '',
    place_of_execution: '',
    employer_name: '',
    employer_address: '',
    employee_name: '',
    employee_address: '',
    designation: '',
    start_date: '',
    probation_period_months: '',
    salary_amount: '',
    notice_period_days: ''
  },
  tabs: [{ id: 'general', label: 'Contract Details' }],
  sections: {
    parties: {
      tab: 'general',
      title: 'Parties',
      type: 'form',
      fields: [
        { name: 'employer_name', label: 'Employer Name', required: true, span: 'half' },
        { name: 'employer_address', label: 'Employer Address', required: true, span: 'half' },
        { name: 'employee_name', label: 'Employee Name', required: true, span: 'half' },
        { name: 'employee_address', label: 'Employee Address', required: true, span: 'half' },
      ]
    },
    terms: {
      tab: 'general',
      title: 'Job Terms',
      type: 'form',
      fields: [
        { name: 'designation', label: 'Job Title/Designation', required: true, span: 'half' },
        { name: 'salary_amount', label: 'Monthly Salary (₹)', type: 'number', required: true, span: 'half' },
        { name: 'start_date', label: 'Joining Date', type: 'date', required: true, span: 'half' },
        { name: 'probation_period_months', label: 'Probation Period (Months)', type: 'number', required: true, span: 'half' },
        { name: 'notice_period_days', label: 'Notice Period (Days)', type: 'number', required: true, span: 'half' },
        { name: 'execution_date', label: 'Execution Date', type: 'date', required: true, span: 'half' },
        { name: 'place_of_execution', label: 'Place of Execution', required: true, span: 'full' },
      ]
    }
  }
};