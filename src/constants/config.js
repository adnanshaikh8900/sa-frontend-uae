export default {
 //API_ROOT_URL: 'https://dev-api.app.simpleaccounts.io',
    // API_ROOT_URL: 'https://k8s-api.dev.simplevat.com',
   // API_ROOT_URL: 'http://localhost:8080',
    //  API_ROOT_URL: 'http://192.168.2.105:8080',

     API_ROOT_URL: window._env_.SIMPLEVAT_HOST,
    FRONTEND_RELEASE: window._env_.SIMPLEVAT_RELEASE,
  
  
  DASHBOARD:false,
  INCOME_MODULE:true,
  EXPENSE_MODULE:true,
  BANKING_MODULE:true,
  ACCOUNTANT_MODULE:true,
  REPORTS_MODULE:false,
  MASTER_MODULE:true,
  INVENTORY_MODULE:false,
  PAYROLL_MODULE:true,

  EXPENSE_EXPENSES:false,
  EXPENSE_SI:true,
  EXPENSE_PR:true,
  EXPENSE_RFQ:false,
  EXPENSE_PO:false,
  EXPENSE_GRN:false,

  INCOME_CI:true,
  INCOME_IR:true,
  INCOME_Q:true,
  INCOME_TCN:false,

  BANKING_BA:true,

  ACCOUNTANT_OB:true,
  ACCOUNTANT_JOURNALS:true,

  MASTER_COA:false,
  MASTER_CONTACT:true,
  MASTER_PRODUCTS:true,
  MASTER_PC:true,
  MASTER_VAT:true,
  MASTER_CR:true,
  MASTER_EMPLOYEE:false,

  PAYROLL_PR:false,
  PAYROLL_PC:false,

  ADD_ROLES:false,
  ADD_CURRENCY:true,

  SETTING_THEME:false,
  SETTING_IMPORT:false
};