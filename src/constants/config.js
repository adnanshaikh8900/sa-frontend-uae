export default {
  // API_ROOT_URL:'https://devbox-api.app.simpleaccounts.io',
  //API_ROOT_URL: "https://dev-api.app.simpleaccounts.io",
  // API_ROOT_URL: 'https://k8s-api.dev.simplevat.com',
  // API_ROOT_URL: 'http://localhost:8080',
  // API_ROOT_URL: 'http://192.168.2.105:8080',
  // API_ROOT_URL: 'https://datainn-api.ae.simpleaccounts.io',
  API_ROOT_URL: window._env_.SIMPLEVAT_HOST,
  // FRONTEND_RELEASE: 'latest',
  FRONTEND_RELEASE: window._env_.SIMPLEVAT_RELEASE,

  DASHBOARD: false,
  INCOME_MODULE: true,
  EXPENSE_MODULE: true,
  BANKING_MODULE: true,
  ACCOUNTANT_MODULE: true,
  REPORTS_MODULE: true,
  MASTER_MODULE: true,
  INVENTORY_MODULE: false,
  PAYROLL_MODULE: true,

  EXPENSE_EXPENSES: true,
  EXPENSE_SI: true,
  EXPENSE_PR: true,
  EXPENSE_RFQ: false,
  EXPENSE_PO: false,
  EXPENSE_GRN: false,

  INCOME_CI: true,
  INCOME_IR: true,
  INCOME_Q: true,
  INCOME_TCN: false,

  BANKING_BA: true,

  ACCOUNTANT_OB: true,
  ACCOUNTANT_JOURNALS: true,

  MASTER_COA: true,
  MASTER_CONTACT: true,
  MASTER_PRODUCTS: true,
  MASTER_PC: true,
  MASTER_VAT: true,
  MASTER_CR: true,
  MASTER_EMPLOYEE: true,

  PAYROLL_PR: true,
  PAYROLL_PC: true,

  ADD_ROLES: true,
  ADD_CURRENCY: true,

  SETTING_THEME: false,
  SETTING_IMPORT: false,

  REPORTS_HEAD_FI: true,
  REPORTS_PAL: true,
  REPORTS_BS: true,
  REPORTS_HBS: true,
  REPORTS_TB: true,

  REPORTS_HEAD_SALES: false,
  REPORTS_SALESBYCUSTOMER: false,
  REPORTS_SALSEBYPRODUCT: false,

  REPORTS_HEAD_EXPENSE: true,
  REPORTS_EXPENSEDETAILS: true,
  REPORTS_EXPENSEBYCATEGORY: true,

  REPORTS_HEAD_RECEIVABLE: false,
  REPORTS_RECEIVABLEINVOICESUMMARY: false,
  REPORTS_RECEIVABLEINVOICEDETAILS: false,

  REPORTS_HEAD_PR: false,
  REPORTS_TAXCREDITNOTEDETAILS: false,

  REPORTS_HEAD_INVOICES: false,
  REPORTS_INVOICEDETAILS: false,

  REPORTS_ARAGINGREPORT: false,

  REPORT_DGL: true,

  REPORTS_HEAD_PURCHASE: false,
  REPORTS_PURCHASEBYVENDOR: false,
  REPORTS_PURCHASEBYPRODUCT: false,

  REPORTS_PAYABLE: false,
  REPORTS_PAYABLESINVOICESUMMARY: false,
  REPORTS_PAYABLEINVOICEDETAILS: false,

  REPORTS_PAYROLLSSUMMARY: true,

  REPORTS_HEAD_VAT: true,
  REPORTS_VAT_REPORTS: true,
  REPORTS_FTA_AUDIT: false,
  REPORTS_EXCISE_TAX: false,

  BASE_ROUTE: "/admin",
  SECONDARY_BASE_ROUTE: "/admin/income",
};
