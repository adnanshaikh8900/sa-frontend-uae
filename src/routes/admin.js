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
	ViewFtaExciseAuditReport,
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
		name: 'AddJournal',
		component: CreateJournal.screen,
	},
	{
		path: '/admin/accountant/journal/detail',
		name: 'UpdateJournal',
		component: DetailJournal.screen,
	},
	{
		path: '/admin/accountant/journal',
		name: 'Journals',
		component: Journal.screen,
	},
	{
		path: '/admin/accountant/opening-balance',
		name: 'OpeningBalances',
		component: OpeningBalance.screen,
	},
	{
		path: '/admin/accountant/opening-balance/create',
		name: 'AddOpeningBalance',
		component: CreateOpeningBalance.screen,
	},
	{
		path: '/admin/accountant/opening-balance/detail',
		name: 'UpdateOpeningBalance',
		component: DetailOpeningBalance.screen,
	},
	{

		path: '/admin/Inventory',
		name: 'InventorySummary',
		component: Inventory.screen,
	},
	{
		path: '/admin/settings/template',
		name: 'MailThemes',
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
		name: 'AddTransaction',
		component: CreateBankTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction/detail',
		name: 'UpdateTransaction',
		component: DetailBankTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction/reconcile',
		name: 'ViewReconcile',
		component: ReconcileTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction',
		name: 'ViewTransaction',
		component: BankTransactions.screen,
	},
	{
		path: '/admin/banking/bank-account/create',
		name: 'AddBankAccount',
		component: CreateBankAccount.screen,
	},
	{
		path: '/admin/banking/bank-account/detail',
		name: 'UpdateBankAccount',
		component: DetailBankAccount.screen,
	},
	{
		path: '/admin/banking/bank-account',
		name: 'ViewBankAccount',
		component: BankAccount.screen,
	},
	{
		path: '/admin/banking/upload-statement/transaction',
		name: 'AddBankStatement',
		component: ImportTransaction.screen,
	},
	{
		path: '/admin/banking/upload-statement',
		name: 'AddBankStatement',
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
		name: 'AddQuotation',
		component: CreateQuotation.screen,
	},
	{
		path: '/admin/income/quotation/view',
		name: 'ViewQuotation',
		component: ViewQuotation.screen,
	},
	{
		path: '/admin/income/quotation/detail',
		name: 'UpdateQuotation',
		component: DetailQuotation.screen,
	},
	{
		path: '/admin/income/quotation',
		name: 'Quotation',
		component: Quotation.screen,
	},

	{
		path: '/admin/income/customer-invoice/create',
		name: 'AddCustomerInvoice',
		component: CreateCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/view',
		name: 'ViewCustomerInvoice',
		component: ViewCustomerInvoice.screen,
	},

	{
		path: '/admin/income/customer-invoice/detail',
		name: 'UpdateCustomerInvoice',
		component: DetailCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/record-payment',
		name: 'RecordCustomerPayment',
		component: RecordCustomerPayment.screen,
	},
	{
		path: '/admin/income/customer-invoice',
		name: 'CustomerInvoices',
		component: CustomerInvoice.screen,
	},
	{
		path: '/admin/income/receipt/create',
		name: 'Create',
		component: CreateReceipt.screen,
	},
	{
		path: '/admin/income/receipt/detail',
		name: 'Detail',
		component: DetailReceipt.screen,
	},
	{
		path: '/admin/income/receipt',
		name: 'CustomerReceipts',
		component: Receipt.screen,
	},
	//
	{
		path: '/admin/income/credit-notes',
		name: 'CreditNotes',
		component: CreditNotes.screen,
	},
	{
		path: '/admin/income/credit-notes/create',
		name: 'CreditNotes',
		component: CreateCreditNote.screen,
	},
	{
		path: '/admin/income/credit-notes/view',
		name: 'ViewCreditNotes',
		component: ViewCreditNote.screen,
	},

	{
		path: '/admin/income/credit-notes/detail',
		name: 'UpdateCreditNotes',
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
		name: 'AddRequestForQuotation',
		component: CreateRequestForQuotation.screen,
	},
	{
		path: '/admin/expense/request-for-quotation/view',
		name: 'ViewRequestForQuotation',
		component: ViewRequestForQuotation.screen,
	},
	{
		path: '/admin/expense/request-for-quotation/detail',
		name: 'UpdateRequestForQuotation',
		component: DetailRequestForQuotation.screen,
	},
	{
		path: '/admin/expense/request-for-quotation',
		name: 'Quotation',
		component: RequestForQuotation.screen,
	},
	{
		path: '/admin/expense/purchase-order/create',
		name: 'AddPurchaseOrder',
		component: CreatePurchaseOrder.screen,
	},
	{
		path: '/admin/expense/purchase-order/view',
		name: 'ViewPurchaseOrder',
		component: ViewPurchaseOrder.screen,
	},
	{
		path: '/admin/expense/purchase-order/detail',
		name: 'UpdatePurchaseOrder',
		component: DetailPurchaseOrder.screen,
	},
	{
		path: '/admin/expense/purchase-order',
		name: 'PurchaseOrder',
		component: PurchaseOrder.screen,
	},
	{
		path: '/admin/expense/goods-received-note/create',
		name: 'AddGoodsReceiveNotes',
		component: CreateGoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/goods-received-note/view',
		name: 'ViewGoodsReceiveNotes',
		component: ViewGoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/goods-received-note/detail',
		name: 'UpdateGoodsReceiveNotes',
		component: DetailGoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/goods-received-note',
		name: 'GoodsReceiveNotes',
		component: GoodsReceivedNote.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/create',
		name: 'AddSupplierInvoice',
		component: CreateSupplierInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/view',
		name: 'ViewSupplierInvoice',
		component: ViewInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/detail',
		name: 'UpdateSupplierInvoice',
		component: DetailSupplierInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/record-payment',
		name: 'RecordSupplierPayment',
		component: RecordSupplierPayment.screen,
	},
	{
		path: '/admin/expense/supplier-invoice',
		name: 'SupplierInvoices',
		component: SupplierInvoice.screen,
	},
	{
		path: '/admin/expense/expense/create',
		name: 'AddExpense',
		component: CreateExpense.screen,
	},
	{
		path: '/admin/expense/expense/detail',
		name: 'UpdateExpense',
		component: DetailExpense.screen,
	},
	{
		path: '/admin/expense/expense',
		name: 'Expenses',
		component: Expense.screen,
	},
	{
		path: '/admin/expense/expense/view',
		name: 'ViewExpense',
		component: ViewExpense.screen,
	},
	{
		path: '/admin/expense/payment/create',
		name: 'AddSupplierReceipt',
		component: CreatePayment.screen,
	},
	{
		path: '/admin/expense/payment/detail',
		name: 'UpdateSupplierReceipt',
		component: DetailPayment.screen,
	},
	{
		path: '/admin/expense/purchase',
		name: 'SupplierReceipts',
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
		name: 'OverviewEmployee',
		component: ViewEmployee.screen,
	},
	{
		path: '/admin/master/employee/updateEmployeePersonal',
		name: 'UpdateEmployee',
		component: UpdateEmployeePersonal.screen,
	},
	{
		path: '/admin/master/employee/updateEmployeeBank',
		name: 'UpdateEmployee',
		component: UpdateEmployeeBank.screen,
	},
	{
		path: '/admin/master/employee/updateEmployeeEmployement',
		name: 'UpdateEmployee',
		component: UpdateEmployeeEmployment.screen,
	},
	{
		path: '/admin/payroll/employee/updateSalaryComponent',
		name: 'UpdateEmployee',
		component: UpdateSalaryComponent.screen,
	},
	{
		path: '/admin/master/employee/create',
		name: 'AddEmployee',
		component: CreatePayrollEmployee.screen,
	},
	{
		path: '/admin/master/employee',
		name: 'Employee',
		component: PayrollEmployee.screen,
	},
	{
		path: '/admin/payroll/payrollrun',
		name: 'PayrollRun',
		component: PayrollRun.screen,
	},
	{
		path: '/admin/payroll/payrollrun/updatePayroll',
		name: 'GeneratePayroll',
		component: UpdatePayroll.screen,
	},
	{
		path: '/admin/payroll/payrollrun/createPayrollList',
		name: 'GeneratePayroll',
		component: CreatePayroll.screen,
	},
	{
		path: '/admin/payroll/payrollApproverScreen',
		name: 'ApprovePayroll',
		component: PayrollApproverScreen.screen,
	},
	{
		path: '/admin/payroll/config/createSalaryRoles',
		name: 'CreateSalaryRole',
		component: CreateSalaryRoles.screen,
	},
	{
		path: '/admin/payroll/config/detailSalaryRoles',
		name: 'UpdateSalaryRole',
		component: DetailSalaryRole.screen,
	},
	{
		path: '/admin/payroll/config/detailSalaryStructure',
		name: 'UpdateSalaryStructure',
		component: DetailSalaryStructure.screen,
	},
	{
		path: '/admin/payroll/salaryTemplate/detail',
		name: 'UpdateSalaryTemplate',
		component: DetailSalaryTemplate.screen,
	},
	{
		path: '/admin/payroll/config',
		name: 'ViewSalaryRole',
		component: PayrollConfigurations.screen,
	},
	
	{
		path: '/admin/payroll/salaryTemplate/create',
		name: 'CreateSalaryTemplate',
		component: CreateSalaryTemplate.screen,
	},
	{
		path: '/admin/payroll/salaryTemplate',
		name: 'ViewSalaryTemplate',
		component: SalaryTemplate.screen,
	},
	{
		path: '/admin/payroll/config/createSalaryStructure',
		name: 'CreateSalaryStructure',
		component: CreateSalaryStucture.screen,
	},
	{
		path: '/admin/payroll/salaryStructure',
		name: 'ViewSalaryStructure',
		component: SalaryStucture.screen,
	},
	{
		path: '/admin/payroll/config/createEmployeeDesignation',
		name: 'CreateEmployeeDesignation',
		component: CreateDesignation.screen,
	},
	{
		path: '/admin/payroll/config/detailEmployeeDesignation',
		name: 'UpdateEmployeeDesignation',
		component: DetailDesignation.screen,
	},
	{
		path: '/admin/payroll/employeeDesignation',
		name: 'ViewEmployeeDesignation',
		component: Designation.screen,
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
		name: 'VatTransactions',
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
		name: 'ProfitAndLoss',
		component: ProfitAndLossReport.screen,
	},
	{
		path: '/admin/report/balancesheet',
		name: 'BalanceSheet',
		component: BalanceSheet.screen,
	},
	{
		path: '/admin/report/horizontalbalancesheet',
		name: 'HorizontalBalanceSheet',
		component: HorizontalBalanceSheet.screen,
	},
	{
		path: '/admin/report/trailbalances',
		name: 'TrialBalance',
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
		name: 'FTA Reports',
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
		name: 'Record Tax Payment',
		component: ARAgingReport.screen,
	},
	{
		path: '/admin/report/salesbycustomer',
		name: 'SalesByCustomer',
		component: SalesByCustomer.screen,
	},
	{
		path: '/admin/report/salesbyproduct',
		name: 'SalesByProduct',
		component: SalesByProduct.screen,
	},
	{
		path: '/admin/report/purchasebyvendor',
		name: 'PurchaseByVendor',
		component: PurchaseByVendor.screen,
	},
	{
		path: '/admin/report/purchasebyitem',
		name: 'PurchaseByProduct',
		component: PurchaseByitem.screen,
	},
	{
		path: '/admin/report/detailed-general-ledger',
		name: 'DetailedGeneralLedger',
		component: DetailedGeneralLedgerReport.screen,
	},
	{
		path: '/admin/report/receivable-invoice-details',
		name: 'ReceivableInvoiceDetail',
		component: ReceivableInvoiceDetailsReport.screen,
	},
	{
		path: '/admin/report/credit-note-details',
		name: 'CreditNotesDetails',
		component: CreditNoteDetailsReport.screen,
	},
	{
		path: '/admin/report/invoice-details',
		name: 'InvoiceDetails',
		component: InvoiceDetails.screen,
	},
	{
		path: '/admin/report/receivable-invoice-summary',
		name: 'ReceivableInvoiceSummary',
		component: ReceivableInvoiceSummary.screen,
	},
	{
		path: '/admin/report/payable-invoice-details',
		name: 'PayableInvoiceDetail',
		component: PayablesInvoiceDetailsReport.screen,
	},
	{
		path: '/admin/report/payable-invoice-summary',
		name: 'PayableInvoiceSummary',
		component: PayablesInvoiceSummary.screen,
	},
	{
		path: '/admin/report/payroll-summary',
		name: 'PayrollSummaryReport',
		component: PayrollSummaryReport.screen,
	},	
	{
		path: '/admin/report/statementOfAccount',
		name: 'StatementOfAccount',
		component: SOAReport.screen,
	},		
	{
		path: '/admin/report/expense-details',
		name: 'ExpenseDetails',
		component: ExpenseDetailsReport.screen,
	},
	{
		path: '/admin/report/expense-by-category',
		name: 'ExpenseByCategoryDetails',
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
		name: 'AddChartOfAccounts',
		component: CreateChartAccount.screen,
	},
	{
		path: '/admin/master/chart-account/detail',
		name: 'UpdateChartOfAccounts',
		component: DetailChartAccount.screen,
	},
	{
		path: '/admin/master/chart-account',
		name: 'ChartOfAccounts',
		component: ChartAccount.screen,
	},
	{
		path: '/admin/master/contact/create',
		name: 'AddContact',
		component: CreateContact.screen,
	},
	{
		path: '/admin/master/contact/detail',
		name: 'UpdateContact',
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
		name: 'AddProduct',
		component: CreateProduct.screen,
	},
	{
		path: '/admin/master/product/detail',
		name: 'UpdateProduct',
		component: DetailProduct.screen,
	},
	{
		path: '/admin/master/product/detail/inventoryedit',
		name: 'UpdateInventory',
		component: InventoryEdit.screen,
	},
	{
		path: '/admin/master/product/detail/inventoryhistory',
		name: 'InventoryHistory',
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
		name: 'AddCurrencyConversion',
		component: CreateCurrencyConvert.screen,
	},
	{
		path: '/admin/master/currencyConvert/detail',
		name: 'UpdateCurrencyConversion',
		component: DetailCurrencyConvert.screen,
	},
	{
		path: '/admin/master/currencyConvert',
		name: 'CurrencyConversion',
		component: CurrencyConvert.screen,
	},
	{
		path: '/admin/master/vat-category/create',
		name: 'AddVatCategory',
		component: CreateVatCode.screen,
	},
	{
		path: '/admin/master/vat-category/detail',
		name: 'UpdateVatCategory',
		component: DetailVatCode.screen,
	},
	{
		path: '/admin/master/vat-category',
		name: 'VatCategory',
		component: VatCode.screen,
	},
	{
		path: '/admin/master/product-category/create',
		name: 'AddProductCategory',
		component: CreateProductCategory.screen,
	},
	{
		path: '/admin/master/product-category/detail',
		name: 'UpdateProductCategory',
		component: DetailProductCategory.screen,
	},
	{
		path: '/admin/master/product-category',
		name: 'ProductCategory',
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
		name: 'AddUser',
		component: CreateUser.screen,
	},
	{
		path: '/admin/settings/user/detail',
		name: 'UpdateUser',
		component: DetailUser.screen,
	},
	{
		path: '/admin/settings/user',
		name: 'ViewUser',
		component: User.screen,
	},
	{
		path: '/admin/settings/notesSettings',
		name: 'SaveNoteSettings',
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
		name: 'SaveGeneralSetting',
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
		name: 'AddRole',
		component: CreateRole.screen,
	},
	{
		path: '/admin/settings/user-role/update',
		name: 'UpdateRole',
		component: UpdateRole.screen,
	},
	{
		path: '/admin/settings/user-role',
		name: 'ViewRole',
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
		name: 'UpdateProfile',
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
