import { combineReducers } from 'redux';

import { AuthReducer, CommonReducer } from './global';

import {
	Dashboard,
	Journal,
	BankAccount,
	Employee,
	EmployeePayroll,
	Contact,
	Expense,
	GeneralSettings,
	CustomerInvoice,
	Receipt,
	SupplierInvoice,
	Product,
	Project,
	Payment,
	TransactionCategory,
	User,
	VatCode,
	Currency,
	CurrencyConvert,
	Help,
	Notification,
	Organization,
	UsersRoles,
	DataBackup,
	TransactionsReport,
	ChartAccount,
	ProductCategory,
	Profile,
	ImportTransaction,
	OpeningBalance,
	VatTransactions,
	Inventory,
	Quotation,
	RequestForQuotation,
	PurchaseOrder,
	GoodsReceivedNote,
	FinancialReport,
	SalaryRoles,
	SalaryStucture,
	SalaryTemplate,
} from 'screens';


const reducer = combineReducers({
	common: CommonReducer,
	auth: AuthReducer,

	dashboard: Dashboard.reducer,
	journal: Journal.reducer,
	bank_account: BankAccount.reducer,
	employee: Employee.reducer,
	employeePayroll: EmployeePayroll.reducer,
	contact: Contact.reducer,
	expense: Expense.reducer,
	settings: GeneralSettings.reducer,
	customer_invoice: CustomerInvoice.reducer,
	vat_transactions: VatTransactions.reducer,
	receipt: Receipt.reducer,
	supplier_invoice: SupplierInvoice.reducer,
	request_for_quotation: RequestForQuotation.reducer,
	purchase_order: PurchaseOrder.reducer,
	goods_received_note: GoodsReceivedNote .reducer,
	quotation: Quotation.reducer,
	product: Product.reducer,
	project: Project.reducer,
	payment: Payment.reducer,
	transaction: TransactionCategory.reducer,
	currencyConvert:CurrencyConvert.reducer,
	user: User.reducer,
	vat: VatCode.reducer,
	currency: Currency.reducer,
	help: Help.reducer,
	reports: FinancialReport.reducer,
	notification: Notification.reducer,
	organization: Organization.reducer,
	users_roles: UsersRoles.reducer,
	data_backup: DataBackup.reducer,
	transaction_data: TransactionsReport.reducer,
	chart_account: ChartAccount.reducer,
	product_category: ProductCategory.reducer,
	profile: Profile.reducer,
	import_transaction: ImportTransaction.reducer,
	opening_balance: OpeningBalance.reducer,
	inventory: Inventory.reducer,
	salaryRoles:SalaryRoles.reducer,
	salaryStructure :SalaryStucture.reducer,
	salarytemplate: SalaryTemplate.reducer,
});

export default reducer;
