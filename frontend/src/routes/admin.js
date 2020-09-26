import {
	Dashboard,

	// Account Screens
	Journal,
	CreateJournal,
	DetailJournal,
	OpeningBalance,

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

	// Receipt Screens
	Receipt,
	CreateReceipt,
	DetailReceipt,

	// SupplierInvoice Screens
	SupplierInvoice,
	CreateSupplierInvoice,
	DetailSupplierInvoice,
	ViewInvoice,
	RecordSupplierPayment,

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
	DetailedGeneralLedgerReport,

	// Master Screens
	ChartAccount,
	CreateChartAccount,
	DetailChartAccount,
	Contact,
	CreateContact,
	DetailContact,
	Employee,
	CreateEmployee,
	DetailEmployee,
	Product,
	CreateProduct,
	DetailProduct,
	Project,
	CreateProject,
	DetailProject,
	VatCode,
	CreateVatCode,
	DetailVatCode,

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
	Notification,
	DataBackup,
	Help,
	Faq,
} from 'screens';

const adminRoutes = [
	{
		path: '/admin/dashboard',
		name: 'Dashboard',
		component: Dashboard.screen,
	},

	{
		path: '/admin/accountant/journal/create',
		name: 'Create',
		component: CreateJournal.screen,
	},
	{
		path: '/admin/accountant/journal/detail',
		name: 'Detail',
		component: DetailJournal.screen,
	},
	{
		path: '/admin/accountant/journal',
		name: 'Journals',
		component: Journal.screen,
	},
	{
		path: '/admin/accountant/opening-balance',
		name: 'Opening Balance',
		component: OpeningBalance.screen,
	},
	{
		redirect: true,
		path: '/admin/accountant',
		pathTo: '/admin/accountant/journal',
		name: 'Accountant',
	},

	{
		path: '/admin/banking/bank-account/transaction/create',
		name: 'Create',
		component: CreateBankTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction/detail',
		name: 'Detail',
		component: DetailBankTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction/reconcile',
		name: 'Reconcile',
		component: ReconcileTransaction.screen,
	},
	{
		path: '/admin/banking/bank-account/transaction',
		name: 'Transaction',
		component: BankTransactions.screen,
	},
	{
		path: '/admin/banking/bank-account/create',
		name: 'Create',
		component: CreateBankAccount.screen,
	},
	{
		path: '/admin/banking/bank-account/detail',
		name: 'Detail',
		component: DetailBankAccount.screen,
	},
	{
		path: '/admin/banking/bank-account',
		name: 'Bank Account',
		component: BankAccount.screen,
	},
	{
		path: '/admin/banking/upload-statement/transaction',
		name: 'Transaction',
		component: ImportTransaction.screen,
	},
	{
		path: '/admin/banking/upload-statement',
		name: 'Import Statement',
		component: ImportBankStatement.screen,
	},
	{
		redirect: true,
		path: '/admin/banking',
		pathTo: '/admin/banking/bank-account',
		name: 'Banking',
	},

	{
		path: '/admin/income/customer-invoice/create',
		name: 'Create',
		component: CreateCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/view',
		name: 'View',
		component: ViewCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/detail',
		name: 'Detail',
		component: DetailCustomerInvoice.screen,
	},
	{
		path: '/admin/income/customer-invoice/record-payment',
		name: 'Record Payment',
		component: RecordCustomerPayment.screen,
	},
	{
		path: '/admin/income/customer-invoice',
		name: 'Customer Invoice',
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
		name: 'Receipt',
		component: Receipt.screen,
	},
	{
		redirect: true,
		path: '/admin/income',
		pathTo: '/admin/income/customer-invoice',
		name: 'Income',
	},

	{
		path: '/admin/expense/supplier-invoice/create',
		name: 'Create',
		component: CreateSupplierInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/view',
		name: 'View Invoice',
		component: ViewInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/detail',
		name: 'Detail',
		component: DetailSupplierInvoice.screen,
	},
	{
		path: '/admin/expense/supplier-invoice/record-payment',
		name: 'Record Payment',
		component: RecordSupplierPayment.screen,
	},
	{
		path: '/admin/expense/supplier-invoice',
		name: 'Supplier Invoice',
		component: SupplierInvoice.screen,
	},
	{
		path: '/admin/expense/expense/create',
		name: 'Create',
		component: CreateExpense.screen,
	},
	{
		path: '/admin/expense/expense/detail',
		name: 'Detail',
		component: DetailExpense.screen,
	},
	{
		path: '/admin/expense/expense',
		name: 'Expense',
		component: Expense.screen,
	},
	{
		path: '/admin/expense/payment/create',
		name: 'Create',
		component: CreatePayment.screen,
	},
	{
		path: '/admin/expense/payment/detail',
		name: 'Detail',
		component: DetailPayment.screen,
	},
	{
		path: '/admin/expense/purchase',
		name: 'Prchase',
		component: Payment.screen,
	},
	{
		redirect: true,
		path: '/admin/expense',
		pathTo: '/admin/expense/expense',
		name: 'Expense',
	},

	{
		path: '/admin/taxes/vat-transactions',
		name: 'VAT Transactions',
		component: VatTransactions.screen,
	},
	{
		path: '/admin/taxes/reports-filing',
		name: 'Reports Filing',
		component: ReportsFiling.screen,
	},
	{
		redirect: true,
		path: '/admin/taxes',
		pathTo: '/admin/taxes/vat-transactions',
		name: 'Taxes',
	},

	{
		path: '/admin/report/transactions',
		name: 'Transactions',
		component: TransactionsReport.screen,
	},
	{
		path: '/admin/report/financial',
		name: 'Financial',
		component: FinancialReport.screen,
	},
	{
		path: '/admin/report/detailed-general-ledger',
		name: 'Detailed General Ledger',
		component: DetailedGeneralLedgerReport.screen,
	},
	{
		redirect: true,
		path: '/admin/report',
		pathTo: '/admin/report/transactions',
		name: 'Report',
	},

	{
		path: '/admin/master/chart-account/create',
		name: 'Create',
		component: CreateChartAccount.screen,
	},
	{
		path: '/admin/master/chart-account/detail',
		name: 'Detail',
		component: DetailChartAccount.screen,
	},
	{
		path: '/admin/master/chart-account',
		name: 'Chart of Accounts',
		component: ChartAccount.screen,
	},
	{
		path: '/admin/master/contact/create',
		name: 'Create',
		component: CreateContact.screen,
	},
	{
		path: '/admin/master/contact/detail',
		name: 'Detail',
		component: DetailContact.screen,
	},
	{
		path: '/admin/master/contact',
		name: 'Contact',
		component: Contact.screen,
	},
	{
		path: '/admin/master/employee/create',
		name: 'Create',
		component: CreateEmployee.screen,
	},
	{
		path: '/admin/master/employee/detail',
		name: 'Detail',
		component: DetailEmployee.screen,
	},
	{
		path: '/admin/master/employee',
		name: 'Employee',
		component: Employee.screen,
	},
	{
		path: '/admin/master/product/create',
		name: 'Create',
		component: CreateProduct.screen,
	},
	{
		path: '/admin/master/product/detail',
		name: 'Detail',
		component: DetailProduct.screen,
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
		path: '/admin/master/vat-category/create',
		name: 'Create',
		component: CreateVatCode.screen,
	},
	{
		path: '/admin/master/vat-category/detail',
		name: 'Detail',
		component: DetailVatCode.screen,
	},
	{
		path: '/admin/master/vat-category',
		name: 'Vat Category',
		component: VatCode.screen,
	},
	{
		path: '/admin/master/product-category/create',
		name: 'Create',
		component: CreateProductCategory.screen,
	},
	{
		path: '/admin/master/product-category/detail',
		name: 'Detail',
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
		name: 'Create',
		component: CreateUser.screen,
	},
	{
		path: '/admin/settings/user/detail',
		name: 'Detail',
		component: DetailUser.screen,
	},
	{
		path: '/admin/settings/user',
		name: 'User',
		component: User.screen,
	},
	{
		path: '/admin/settings/organization',
		name: 'Organization',
		component: Organization.screen,
	},

	{
		path: '/admin/settings/general',
		name: 'General Settings',
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
		path: '/admin/settings/user-role',
		name: 'Users & Roles',
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
		name: 'Profile',
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
