import {
	Dashboard,
	DashboardTwo,
	// Account Screens
	Journal,
	CreateJournal,
	DetailJournal,
	OpeningBalance,
	CreateOpeningBalance,
	DetailOpeningBalance,

	// Bank Screens
	BankAccount,
	CreateBankAccount,
	DetailBankAccount,
	BankTransactions,
	CreateBankTransaction,
	DetailBankTransaction,
	ReconcileTransaction,
	ImportBankStatement,
	ImportTransaction,

	// Customer Screens
	CustomerInvoice,
	CreateCustomerInvoice,
	DetailCustomerInvoice,
	ViewCustomerInvoice,
	RecordCustomerPayment,
	//CreditNotes
	CreditNotes,
	CreateCreditNote,
	DetailCreditNote,
	ViewCreditNote,
	// Receipt Screens
	Receipt,
	CreateReceipt,
	DetailReceipt,
	PayrollRun,

	// SupplierInvoice Screens
	SupplierInvoice,
	CreateSupplierInvoice,
	DetailSupplierInvoice,
	ViewInvoice,
	RecordSupplierPayment,

	//Request For Quotation
	CreateRequestForQuotation,
	ViewRequestForQuotation,
	DetailRequestForQuotation,
	RequestForQuotation,

	//Purchase Order
	PurchaseOrder,
	CreatePurchaseOrder,
	DetailPurchaseOrder,
	ViewPurchaseOrder,

	//Goods Received Notes
	GoodsReceivedNote,
	CreateGoodsReceivedNote,
	DetailGoodsReceivedNote,
	ViewGoodsReceivedNote,

	//Quotation
	Quotation,
	CreateQuotation,
	DetailQuotation,
	ViewQuotation,

	// Expense Screens
	Expense,
	CreateExpense,
	DetailExpense,
	Payment,
	CreatePayment,
	DetailPayment,

	// Vat Screens
	VatTransactions,
	ReportsFiling,

	// Report Screens
	TransactionsReport,
	FinancialReport,
	ProfitAndLossReport,
	BalanceSheet,
	HorizontalBalanceSheet,
	TrailBalances,
	VatReturnsReport,
	DetailedGeneralLedgerReport,
	SalesByCustomer,
	SalesByProduct,
	PurchaseByitem,
	PurchaseByVendor,
	ReceivableInvoiceDetailsReport,
	ReceivableInvoiceSummary,
	PayablesInvoiceDetailsReport,
	PayablesInvoiceSummary,
	PayrollSummaryReport,
	VatReports,
	VatPaymentRecord,
	RecordTaxClaim,
	RecordVatPayment,
	ARAgingReport,


	// Master Screens
	ChartAccount,
	CreateChartAccount,
	DetailChartAccount,
	Contact,
	CreateContact,
	DetailContact,
	ViewEmployee,
	Product,
	CreateProduct,
	DetailProduct,
	InventoryEdit,
	InventoryHistory,
	Project,
	CreateProject,
	DetailProject,
	VatCode,
	CreateVatCode,
	DetailVatCode,
	CurrencyConvert,
	CreateCurrencyConvert,
	DetailCurrencyConvert,
	// Product Screens
	ProductCategory,
	CreateProductCategory,
	DetailProductCategory,

	// Currency Screens
	Currency,
	CreateCurrency,
	DetailCurrency,

	// User Screens
	User,
	CreateUser,
	DetailUser,
	Organization,

	// Profile Screens
	Profile,
	GeneralSettings,
	// TransactionCategory,
	// CreateTransactionCategory,
	// DetailTransactionCategory,
	UsersRoles,
	CreateRole,
	UpdateRole,
	Notification,
	DataBackup,
	Help,
	Faq,
	ViewExpense,

	Inventory,
	Template,
	PayrollEmployee,
	CreatePayrollEmployee,
	EmployeeFinancial,
	DetailSalaryRole,
	SalaryRoles,
	CreateSalaryRoles,
	UpdateEmployeePersonal,
	UpdateEmployeeBank,

	SalaryTemplate,
	CreateSalaryTemplate,
	SalaryStucture,
	CreateSalaryStucture,
	UnderConstruction,
	CreateDesignation,
	Designation,
	DetailSalaryStructure,
	DetailSalaryTemplate,
	DetailDesignation,
	ApplyToInvoice,
	Refund,
	UpdateEmployeeEmployment,
	UpdateSalaryComponent,
	PayrollConfigurations,
	CreditNoteDetailsReport,
	ExpenseDetailsReport,
	ExpenseByCategory,
	InvoiceDetails,
	Import,
	CreatePayroll,

	PayrollApproverScreen,
	UpdatePayroll,
	Migrate,
	MigrateHistory,
	SOAReport,
	FtaAuditReport,
	GenerateAuditFile,
	ViewFtaAuditReport,
	ExciseTaxAuditReport,
	ViewFtaExciseAuditReport,
	SubReports,
	NotesSettings
} from 'screens';

const adminRoutes = [
	{
		path: '/admin/dashboard',
		name: 'Dashboard',
		component: Dashboard.screen,
	},

	{
		path: '/admin/dashboard-two',
		name: 'DashboardTwo',
		component: DashboardTwo,
	},
	{
		path: '/admin/accountant/journal/create',
		name: 'Add Journal',
		component: CreateJournal.screen,
	},
	{
		path: '/admin/accountant/journal/detail',
		name: 'Update Journal',
		component: DetailJournal.screen,
	},
	{
		path: '/admin/accountant/journal',
		name: 'Journals',
		component: Journal.screen,
	},
	{
		path: '/admin/accountant/opening-balance',
		name: 'Opening Balances',
		component: OpeningBalance.screen,
	},
	{
		path: '/admin/accountant/opening-balance/create',
		name: 'Add Opening Balance',
		component: CreateOpeningBalance.screen,
	},
	{
		path: '/admin/accountant/opening-balance/detail',
		name: 'Update Opening Balance',
		component: DetailOpeningBalance.screen,
	},
	{

		path: '/admin/Inventory',
		name: 'Inventory Summary',
		component: Inventory.screen,
	},
	{
		path: '/admin/settings/template',
		name: 'Mail Themes',
		component: Template.screen,
	},
	{
		redirect: true,
		path: '/admin/accountant',
		pathTo: '/admin/accountant/opening-balance',
		name: 'Accountant',
	},

	{
		path: '/admin/banking/bank-account/transaction/create',
		name: 'Add Transaction',
		component: CreateBankTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction/detail',
		name: 'Update Transaction',
		component: DetailBankTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction/reconcile',
		name: 'View Reconcile',
		component: ReconcileTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction',
		name: 'View Transaction',
		component: BankTransactions.screen,
	},
	{
		path: '/admin/banking/bank-account/create',
		name: 'Add Bank Account',
		component: CreateBankAccount.screen,
	},
	{
		path: '/admin/banking/bank-account/detail',
		name: 'Update Bank Account',
		component: DetailBankAccount.screen,
	},
	{
		path: '/admin/banking/bank-account',
		name: 'View Bank Account',
		component: BankAccount.screen,
	},
	{
		path: '/admin/banking/upload-statement/transaction',
		name: 'Add Bank Statement',
		component: ImportTransaction.screen,
	},
	{
		path: '/admin/banking/upload-statement',
		name: 'Add Bank Statement',
		component: ImportBankStatement.screen,
	},
	{
		redirect: true,
		path: '/admin/banking',
		pathTo: '/admin/banking/bank-account',
		name: 'Banking',
	},
	{
		path: '/admin/income/quotation/create',
		name: 'Add Quotation',
		component: CreateQuotation.screen,
	},
	{
		path: '/admin/income/quotation/view',
		name: 'View Quotation',
		component: ViewQuotation.screen,
	},
	{
		path: '/admin/income/quotation/detail',
		name: 'Update Quotation',
		component: DetailQuotation.screen,
	},
	{
		path: '/admin/income/quotation',
		name: 'Quotation',
		component: Quotation.screen,
	},

	{
		path: '/admin/income/customer-invoice/create',
		name: 'Add Customer Invoice',
		component: CreateCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/view',
		name: 'View Customer Invoice',
		component: ViewCustomerInvoice.screen,
	},

	{
		path: '/admin/income/customer-invoice/detail',
		name: 'Update Customer Invoice',
		component: DetailCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/record-payment',
		name: 'Record Customer Payment',
		component: RecordCustomerPayment.screen,
	},
	{
		path: '/admin/income/customer-invoice',
		name: 'Customer Invoices',
		component: CustomerInvoice.screen,
	},
	{
		path: '/admin/income/receipt/create',
		name: 'Create Reciept',
		component: CreateReceipt.screen,
	},
	{
		path: '/admin/income/receipt/detail',
		name: 'Detail',
		component: DetailReceipt.screen,
	},
	{
		path: '/admin/income/receipt',
		name: 'Customer Receipts',
		component: Receipt.screen,
	},
	//
	{
		path: '/admin/income/credit-notes',
		name: 'Credit Notes',
		component: CreditNotes.screen,
	},
	{
		path: '/admin/income/credit-notes/create',
		name: 'Add Credit Notes',
		component: CreateCreditNote.screen,
	},
	{
		path: '/admin/income/credit-notes/view',
		name: 'View Credit Notes',
		component: ViewCreditNote.screen,
	},

	{
		path: '/admin/income/credit-notes/detail',
		name: 'Update Credit Notes',
		component: DetailCreditNote.screen,
	},
	{
		path: '/admin/income/credit-notes/applyToInvoice',
		name: 'Apply To Invoice',
		component: ApplyToInvoice.screen,
	},

	{
		path: '/admin/income/credit-notes/refund',
		name: 'Refund',
		component: Refund.screen,
	},
	{
		redirect: true,
		path: '/admin/income',
		pathTo: '/admin/income/customer-invoice',
		name: 'Income',
	},

	{
		path: '/admin/expense/request-for-quotation/create',
		name: 'Add Request For Quotation',
		component: CreateRequestForQuotation.screen,
	},
	{
		path: '/admin/expense/request-for-quotation/view',
		name: 'View Request For Quotation',
		component: ViewRequestForQuotation.screen,
	},
	{
		path: '/admin/expense/request-for-quotation/detail',
		name: 'Update Request For Quotation',
		component: DetailRequestForQuotation.screen,
	},
	{
		path: '/admin/expense/request-for-quotation',
		name: 'Quotation',
		component: RequestForQuotation.screen,
	},
	{
		path: '/admin/expense/purchase-order/create',
		name: 'Add Purchase Order',
		component: CreatePurchaseOrder.screen,
	},
	{
		path: '/admin/expense/purchase-order/view',
		name: 'View Purchase Order',
		component: ViewPurchaseOrder.screen,
	},
	{
		path: '/admin/expense/purchase-order/detail',
		name: 'Update Purchase Order',
		component: DetailPurchaseOrder.screen,
	},
	{
		path: '/admin/expense/purchase-order',
		name: 'Purchase Order',
		component: PurchaseOrder.screen,
	},
	{
		path: '/admin/expense/goods-received-note/create',
		name: 'Add Goods Receive Notes',
		component: CreateGoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/goods-received-note/view',
		name: 'View Goods Receive Notes',
		component: ViewGoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/goods-received-note/detail',
		name: 'Update Goods Receive Notes',
		component: DetailGoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/goods-received-note',
		name: 'Goods Receive Notes',
		component: GoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/create',
		name: 'Add Supplier Invoice',
		component: CreateSupplierInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/view',
		name: 'View Supplier Invoice',
		component: ViewInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/detail',
		name: 'Update Supplier Invoice',
		component: DetailSupplierInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/record-payment',
		name: 'Record Supplier Payment',
		component: RecordSupplierPayment.screen,
	},
	{
		path: '/admin/expense/supplier-invoice',
		name: 'Supplier Invoices',
		component: SupplierInvoice.screen,
	},
	{
		path: '/admin/expense/expense/create',
		name: 'Add Expense',
		component: CreateExpense.screen,
	},
	{
		path: '/admin/expense/expense/detail',
		name: 'Update Expense',
		component: DetailExpense.screen,
	},
	{
		path: '/admin/expense/expense',
		name: 'Expenses',
		component: Expense.screen,
	},
	{
		path: '/admin/expense/expense/view',
		name: 'View Expense',
		component: ViewExpense.screen,
	},
	{
		path: '/admin/expense/payment/create',
		name: 'Create Purchase Reciept',
		component: CreatePayment.screen,
	},
	{
		path: '/admin/expense/payment/detail',
		name: 'Update Supplier Receipt',
		component: DetailPayment.screen,
	},
	{
		path: '/admin/expense/purchase',
		name: 'Supplier Receipts',
		component: Payment.screen,
	},
	{
		redirect: true,
		path: '/admin/expense',
		pathTo: '/admin/expense/expense',
		name: 'Expense',
	},
	{
		path: '/admin/master/employee/viewEmployee',
		name: 'Overview Employee',
		component: ViewEmployee.screen,
	},
	{
		path: '/admin/master/employee/updateEmployeePersonal',
		name: 'Update Employee',
		component: UpdateEmployeePersonal.screen,
	},
	{
		path: '/admin/master/employee/updateEmployeeBank',
		name: 'Update Employee',
		component: UpdateEmployeeBank.screen,
	},
	{
		path: '/admin/master/employee/updateEmployeeEmployement',
		name: 'Update Employee',
		component: UpdateEmployeeEmployment.screen,
	},
	{
		path: '/admin/master/employee/updateSalaryComponent',
		name: 'Update Employee',
		component: UpdateSalaryComponent.screen,
	},
	{
		path: '/admin/master/employee/create',
		name: 'Add Employee',
		component: CreatePayrollEmployee.screen,
	},
	{
		path: '/admin/master/employee',
		name: 'Employee',
		component: PayrollEmployee.screen,
	},
	
	{
		path: '/admin/payroll/payrollrun/updatePayroll',
		name: 'Update Payroll',
		component: UpdatePayroll.screen,
	},
	{
		path: '/admin/payroll/payrollrun/createPayrollList',
		name: 'Generate Payroll',
		component: CreatePayroll.screen,
	},
	{
		path: '/admin/payroll/payrollApproverScreen',
		name: 'Approve Payroll',
		component: PayrollApproverScreen.screen,
	},
	{
		path: '/admin/payroll/config/createSalaryRoles',
		name: 'Create Salary Role',
		component: CreateSalaryRoles.screen,
	},
	{
		path: '/admin/payroll/config/detailSalaryRoles',
		name: 'Update Salary Role',
		component: DetailSalaryRole.screen,
	},
	{
		path: '/admin/payroll/config/detailSalaryStructure',
		name: 'Update Salary Structure',
		component: DetailSalaryStructure.screen,
	},
	{
		path: '/admin/payroll/salaryTemplate/detail',
		name: 'Update Salary Template',
		component: DetailSalaryTemplate.screen,
	},
	

	{
		path: '/admin/payroll/salaryTemplate/create',
		name: 'Create Salary Template',
		component: CreateSalaryTemplate.screen,
	},
	{
		path: '/admin/payroll/salaryTemplate',
		name: 'View Salary Template',
		component: SalaryTemplate.screen,
	},
	{
		path: '/admin/payroll/config/createSalaryStructure',
		name: 'Create Salary Structure',
		component: CreateSalaryStucture.screen,
	},
	{
		path: '/admin/payroll/salaryStructure',
		name: 'View Salary Structure',
		component: SalaryStucture.screen,
	},
	{
		path: '/admin/payroll/config/createEmployeeDesignation',
		name: 'Create Employee Designation',
		component: CreateDesignation.screen,
	},
	{
		path: '/admin/payroll/config/detailEmployeeDesignation',
		name: 'Update Employee Designation',
		component: DetailDesignation.screen,
	},
	{
		path: '/admin/payroll/employeeDesignation',
		name: 'View Employee Designation',
		component: Designation.screen,
	},
	{
		path: '/admin/payroll/config',
		name: 'Payroll Config',
		component: PayrollConfigurations.screen,
	},
	{
		path: '/admin/payroll/payrollrun',
		name: 'Payroll Run',
		component: PayrollRun.screen,
	},
	{
		redirect: true,
		path: '/admin/payroll',
		pathTo: '/admin/payroll/payrollrun',
		name: 'Payroll',
	},


	{
		path: '/admin/taxes/reports-filing',
		name: 'Reports Filing',
		component: ReportsFiling.screen,
	},
	// {
	// 	redirect: true,
	// 	path: '/admin/taxes',
	// 	pathTo: '/admin/taxes/vat-transactions',
	// 	name: 'Taxes',
	// },
	{
		path: '/admin/report/vat-transactions',
		name: 'Vat Transactions',
		component: VatTransactions.screen,
	},
	{
		path: '/admin/report/transactions',
		name: 'Transactions',
		component: TransactionsReport.screen,
	},
	{
		path: '/admin/report/reports-page',
		name: 'Financial',
		component: FinancialReport.screen,
	},
	{
		path: '/admin/report/profitandloss',
		name: 'Profit And Loss',
		component: ProfitAndLossReport.screen,
	},
	{
		path: '/admin/report/balancesheet',
		name: 'Balance Sheet',
		component: BalanceSheet.screen,
	},
	{
		path: '/admin/report/horizontalbalancesheet',
		name: 'Horizontal Balance Sheet',
		component: HorizontalBalanceSheet.screen,
	},
	{
		path: '/admin/report/trailbalances',
		name: 'Trial Balance',
		component: TrailBalances.screen,
	},
	{
		path: '/admin/report/ftaAuditReports',
		name: 'FTA Reports',
		component: FtaAuditReport.screen,
	},
	{
		path: '/admin/report/ftaAuditReports/generateftaAuditReport',
		name: 'Generate FTA Report',
		component: GenerateAuditFile.screen,
	},
	{
		path: '/admin/report/ftaAuditReports/view',
		name: 'View FTA Report',
		component: ViewFtaAuditReport.screen,
	},
	{

		path: '/admin/report/exciseTaxAuditReports',
		name: 'Excise Tax Audit Reports',
		component: ExciseTaxAuditReport.screen,
	},
	{
		path: '/admin/report/exciseTaxAuditReports/generateexcisetaxAuditReport',
		name: 'Generate FTA Report',
		component: GenerateAuditFile.screen,
	},
	{
		path: '/admin/report/exciseTaxAuditReports/view',
		name: 'View FTA Report',
		component: ViewFtaExciseAuditReport.screen,
	},
	{
		path: '/admin/report/vatreports/view',
		name: 'View Vat Report',
		component: VatReturnsReport.screen,
	},
	{
		path: '/admin/report/vatreports',
		name: 'Vat Reports',
		component: VatReports.screen,
	},

	{
		path: '/admin/report/vatreports/vatpaymentrecordhistory',
		name: 'Vat Payment History',
		component: VatPaymentRecord.screen,
	},
	{
		path: '/admin/report/vatreports/vatreturnsubreports',
		name: 'Vat Payment History',
		component: SubReports.screen,
	 },
	{
		path: '/admin/report/vatreports/recordclaimtax',
		name: 'Record Tax Claim',
		component: RecordTaxClaim.screen,
	},
	{
		path: '/admin/report/vatreports/recordtaxpayment',
		name: 'Record Tax Payment',
		component: RecordVatPayment.screen,
	},
	{
		path: '/admin/report/arAgingReport',
		name: 'Aged Receivable Summary',
		component: ARAgingReport.screen,
	},
	{
		path: '/admin/report/salesbycustomer',
		name: 'Sales By Customer',
		component: SalesByCustomer.screen,
	},
	{
		path: '/admin/report/salesbyproduct',
		name: 'Sales By Product',
		component: SalesByProduct.screen,
	},
	{
		path: '/admin/report/purchasebyvendor',
		name: 'Purchase By Vendor',
		component: PurchaseByVendor.screen,
	},
	{
		path: '/admin/report/purchasebyitem',
		name: 'Purchase By Product',
		component: PurchaseByitem.screen,
	},
	{
		path: '/admin/report/detailed-general-ledger',
		name: 'Detailed General Ledger',
		component: DetailedGeneralLedgerReport.screen,
	},
	{
		path: '/admin/report/receivable-invoice-details',
		name: 'Receivable Invoice Detail',
		component: ReceivableInvoiceDetailsReport.screen,
	},
	{
		path: '/admin/report/credit-note-details',
		name: 'Credit Notes Details',
		component: CreditNoteDetailsReport.screen,
	},
	{
		path: '/admin/report/invoice-details',
		name: 'Invoice Details',
		component: InvoiceDetails.screen,
	},
	{
		path: '/admin/report/receivable-invoice-summary',
		name: 'Receivable Invoice Summary',
		component: ReceivableInvoiceSummary.screen,
	},
	{
		path: '/admin/report/payable-invoice-details',
		name: 'Payable Invoice Detail',
		component: PayablesInvoiceDetailsReport.screen,
	},
	{
		path: '/admin/report/payable-invoice-summary',
		name: 'Payable Invoice Summary',
		component: PayablesInvoiceSummary.screen,
	},
	{
		path: '/admin/report/payroll-summary',
		name: 'Payroll Summary Report',
		component: PayrollSummaryReport.screen,
	},
	{
		path: '/admin/report/statementOfAccount',
		name: 'Statement Of Account',
		component: SOAReport.screen,
	},
	{
		path: '/admin/report/expense-details',
		name: 'Expense Details',
		component: ExpenseDetailsReport.screen,
	},
	{
		path: '/admin/report/expense-by-category',
		name: 'Expense By Category Details',
		component: ExpenseByCategory.screen,
	},
	{
		redirect: true,
		path: '/admin/report',
		pathTo: '/admin/report/reports-page',
		name: 'Report',
	},

	{
		path: '/admin/master/chart-account/create',
		name: 'Add Chart Of Accounts',
		component: CreateChartAccount.screen,
	},
	{
		path: '/admin/master/chart-account/detail',
		name: 'Update Chart Of Accounts',
		component: DetailChartAccount.screen,
	},
	{
		path: '/admin/master/chart-account',
		name: 'Chart Of Accounts',
		component: ChartAccount.screen,
	},
	{
		path: '/admin/master/contact/create',
		name: 'Add Contact',
		component: CreateContact.screen,
	},
	{
		path: '/admin/master/contact/detail',
		name: 'Update Contact',
		component: DetailContact.screen,
	},
	{
		path: '/admin/master/contact',
		name: 'Contact',
		component: Contact.screen,
	},
	// {
	// 	path: '/admin/master/employee/create',
	// 	name: 'Create',
	// 	component: CreateEmployee.screen,
	// },
	// {
	// 	path: '/admin/master/employee/detail',
	// 	name: 'Detail',
	// 	component: DetailEmployee.screen,
	// },
	// {
	// 	path: '/admin/master/employee',
	// 	name: 'Employee',
	// 	component: Employee.screen,
	// },
	{
		path: '/admin/master/product/create',
		name: 'Add Product',
		component: CreateProduct.screen,
	},
	{
		path: '/admin/master/product/detail',
		name: 'Update Product',
		component: DetailProduct.screen,
	},
	{
		path: '/admin/master/product/detail/inventoryedit',
		name: 'Update Inventory',
		component: InventoryEdit.screen,
	},
	{
		path: '/admin/master/product/detail/inventoryhistory',
		name: 'Inventory History',
		component: InventoryHistory.screen,
	},
	{
		path: '/admin/master/product',
		name: 'Product',
		component: Product.screen,
	},
	{
		path: '/admin/master/project/create',
		name: 'Create',
		component: CreateProject.screen,
	},
	{
		path: '/admin/master/project/detail',
		name: 'Detail',
		component: DetailProject.screen,
	},
	{
		path: '/admin/master/project',
		name: 'Project',
		component: Project.screen,
	},
	{
		path: '/admin/master/currencyConvert/create',
		name: 'Add Currency Conversion',
		component: CreateCurrencyConvert.screen,
	},
	{
		path: '/admin/master/currencyConvert/detail',
		name: 'Update Currency Conversion',
		component: DetailCurrencyConvert.screen,
	},
	{
		path: '/admin/master/currencyConvert',
		name: 'Currency Conversion',
		component: CurrencyConvert.screen,
	},
	{
		path: '/admin/master/vat-category/create',
		name: 'Add Vat Category',
		component: CreateVatCode.screen,
	},
	{
		path: '/admin/master/vat-category/detail',
		name: 'Update Vat Category',
		component: DetailVatCode.screen,
	},
	{
		path: '/admin/master/vat-category',
		name: 'Vat Category',
		component: VatCode.screen,
	},
	{
		path: '/admin/master/product-category/create',
		name: 'Add Product Category',
		component: CreateProductCategory.screen,
	},
	{
		path: '/admin/master/product-category/detail',
		name: 'Update Product Category',
		component: DetailProductCategory.screen,
	},
	{
		path: '/admin/master/product-category',
		name: 'Product Category',
		component: ProductCategory.screen,
	},
	{
		path: '/admin/master/currency/create',
		name: 'Create',
		component: CreateCurrency.screen,
	},
	{
		path: '/admin/master/currency/detail',
		name: 'Detail',
		component: DetailCurrency.screen,
	},
	{
		path: '/admin/master/currency',
		name: 'Currencies',
		component: Currency.screen,
	},
	{
		redirect: true,
		path: '/admin/master',
		pathTo: '/admin/master/chart-account',
		name: 'Master',
	},

	{
		path: '/admin/settings/user/create',
		name: 'Add User',
		component: CreateUser.screen,
	},
	{
		path: '/admin/settings/user/detail',
		name: 'Update User',
		component: DetailUser.screen,
	},
	{
		path: '/admin/settings/user',
		name: 'View User',
		component: User.screen,
	},
	{
		path: '/admin/settings/notesSettings',
		name: 'Save Note Settings',
		component: NotesSettings.screen,
	},
	{
    		path: '/admin/settings/import',
    		name: 'Migration',
    		component: Import.screen,
    },
	{
		path: '/admin/settings/migrate',
		name: 'Migration',
		component: Migrate.screen,
	},
	{
		path: '/admin/settings/migrateHistory',
		name: 'Migration',
		component: MigrateHistory.screen,
	},
	{
		path: '/admin/settings/organization',
		name: 'Organization',
		component: Organization.screen,
	},

	{
		path: '/admin/settings/general',
		name: 'Save General Setting',
		component: GeneralSettings.screen,
	},
	// {
	//   path: '/admin/settings/transaction-category/create',
	//   name: 'Create',
	//   component: CreateTransactionCategory.screen
	// },
	// {
	//   path: '/admin/settings/transaction-category/detail',
	//   name: 'Detail',
	//   component: DetailTransactionCategory.screen
	// },
	// {
	//   path: '/admin/settings/transaction-category',
	//   name: 'Transaction Category',
	//   component: TransactionCategory.screen
	// },
	{
		path: '/admin/settings/user-role/create',
		name: 'Add Role',
		component: CreateRole.screen,
	},
	{
		path: '/admin/settings/user-role/update',
		name: 'Update Role',
		component: UpdateRole.screen,
	},
	{
		path: '/admin/settings/user-role',
		name: 'View Role',
		component: UsersRoles.screen,
	},
	{
		path: '/admin/settings/notification',
		name: 'Notifications',
		component: Notification.screen,
	},
	{
		path: '/admin/settings/data-backup',
		name: 'Data Backup',
		component: DataBackup.screen,
	},
	{
		path: '/admin/settings/help/Faq',
		name: 'Faq',
		component: Faq.screen,
	},
	{
		path: '/admin/settings/help',
		name: 'Help',
		component: Help.screen,
	},
	{
		redirect: true,
		path: '/admin/settings',
		pathTo: '/admin/settings/user',
		name: 'Settings',
	},

	{
		path: '/admin/profile',
		name: 'Update Profile',
		component: Profile.screen,
	},

	{
		redirect: true,
		path: '/admin',
		pathTo: '/admin/dashboard',
		name: 'Admin',
	},
];

export default adminRoutes;
