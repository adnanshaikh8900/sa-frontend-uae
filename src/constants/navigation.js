import {data}  from '../screens/Language/index'
import LocalizedStrings from 'react-localization';
import { Dashboard } from '@material-ui/icons';
let strings = new LocalizedStrings(data);
// var language= window['localStorage'].getItem('language');

if(localStorage.getItem('language')==null)
	{
		strings.setLanguage('en');
}
else{
	strings.setLanguage(localStorage.getItem('language'));
}


export default {

	items: [
	

		{
			name: strings.Dashboard,
			url: '/admin/dashboard',
			icon: 'icon-speedometer',
			path: 'Dashboard',
		},
		{
			name: strings.Income,
			url: '/admin/income',
			icon: 'far fa-address-book',
			children: [
			
				{
					name: strings.CustomerInvoices,
					url: '/admin/income/customer-invoice',
					icon: 'far fa-address-card',
					path: 'ViewCustomerInvoice',
				},
				{
					name: strings.IncomeReceipts,
					url: '/admin/income/receipt',
					icon: 'fas fa-receipt',
					path: 'ViewCustomerReceipt',
				},
				{
					name: strings.Quotation,
					url: '/admin/income/quotation',
					icon: 'fas fa-box-open',
					path: 'ViewQuotation',
				},
				{
					name: strings.CreditNotes,
					url: '/admin/income/credit-notes',
					icon: 'fas fa-donate',
					path: 'ViewCreditNotes',
				},
			],
		},
		{
			name: strings.Expense,
			url: '/admin/expense',
			icon: 'fas fa-receipt',
			children: [
				{
					name: strings.Expenses,
					url: '/admin/expense/expense',
					icon: 'fab fa-stack-exchange',
					path: 'ViewExpense',
				},
				{
					name: strings.SupplierInvoices,
					url: '/admin/expense/supplier-invoice',
					icon: 'far fa-address-card',
					path: 'ViewSupplierInvoice',
				},
				{
					name: strings.Purchasereceipts,
					url: '/admin/expense/purchase',
					icon: 'fas fa-money-check',
					path: 'ViewSupplierReceipt',
				},
				{
					name: strings.RFQ,
					url: '/admin/expense/request-for-quotation',
					icon: 'fas fa-shopping-basket',
					path: 'ViewRequestForQuotation',
				},
				{
					name: strings.PurchaseOrder,
					url: '/admin/expense/purchase-order',
					icon: 'fas fa-cash-register',
					path: 'ViewPurchaseOrder',
				},
				{
					name: strings.GRN,
					url: '/admin/expense/goods-received-note',
					icon: 'fas fa-archive',
					path: 'ViewGoodsReceiveNotes',
				},
				
			],
		},
		{
			name: strings.Banking,
			url: '/admin/banking',
			icon: 'fas fa-university',
			children: [
				{
					name: strings.BankAccount,
					url: '/admin/banking/bank-account',
					icon: 'fas fa-university',
					path: 'ViewBankAccount',
				},
				// {
				//   name: 'Upload Statement',
				//   url: '/admin/banking/upload-statement',
				//   icon: 'fa fa-upload',
				// }
			],
		},
		
		{
			name: strings.Accountant,
			url: '/admin/accountant',
			icon: 'fas fa-user',
			children: [
				{
					name: strings.OpeningBalance,
					url: '/admin/accountant/opening-balance',
					icon: 'fas fa-balance-scale',
					path: 'ViewOpeningBalance',
				},
			
				{
					name: strings.Journals,
					url: '/admin/accountant/journal',
					icon: 'fas fa-gem',
					path: 'ViewJournal',
				},
		
			],
		},
	
		
		// {
		// 	name: 'Taxes',
		// 	url: '/admin/taxes',
		// 	icon: 'fas fa-chart-line',
		// 	children: [
		// 		{
		// 			name: 'VAT Transactions',
		// 			url: '/admin/taxes/vat-transactions',
		// 			icon: 'fas fa-exchange-alt',
		// 			path: 'vatTransactions',
		// 		},
		// 		// {
		// 		// 	name: 'VAT Filings',
		// 		// 	url: '/admin/taxes/reports-filing',
		// 		// 	icon: 'fas fa-file-text',
		// 		// },
		// 	],
		// },
		{
			name: strings.Report,
			url: '/admin/report',
			icon: 'fas fa-file-contract',
			path: 'ViewReports',
		},
		// {
		// 	name: 'Report',
		// 	url: '/admin/report',
		// 	icon: 'fas fa-chart-bar',
		// 	children: [
		// 		// {
		// 		// 	name: 'Transactions',
		// 		// 	url: '/admin/report/transactions',
		// 		// 	icon: 'fas fa-exchange-alt',
		// 		// },
		// 		{
		// 			name: 'Financial',
		// 			url: '/admin/report/reports-page',
		// 			icon: 'fas fa-usd',
		// 			path: 'Financial',
		// 		},
		// 		// {
		// 		// 	name: 'Detailed General Ledger',
		// 		// 	url: '/admin/report/detailed-general-ledger',
		// 		// 	icon: 'fas fa-file-text',
		// 		// 	path: 'DetailedGeneralLedger',
		// 		// },
		// 	],
		// },
		{
			name: strings.Master,
			url: '/admin/master',
			icon: 'fas fa-database',
			path: 'ViewChartOfAccounts',
			children: [
				{
					name: strings.ChartofAccounts,
					url: '/admin/master/chart-account',
					icon: 'fas fa-area-chart',
					path: 'ViewChartOfAccounts',
				},
				{
					name: strings.Contact,
					url: '/admin/master/contact',
					icon: 'fas fa-id-card-alt',
					path: 'ViewContact',
				},
				{
					name: strings.Employee,
					url: '/admin/master/employee',
					icon: 'fas fa-user-plus',
					path: 'ViewEmployee',
				},
				{
					name: strings.Product,
					url: '/admin/master/product',
					icon: 'fas fa-object-group',
					path: 'ViewProduct',
				},
				// {
				//   name: 'Project',
				//   url: '/admin/master/project',
				//   icon: 'fas fa-project-diagram',
				// },
				{
					name: strings.VATCategory,
					url: '/admin/master/vat-category',
					icon: 'fas fa-briefcase',
					path: 'ViewVatCategory',
				},
				{
					name: strings.ProductCategory,
					url: '/admin/master/product-category',
					icon: 'fas fa-money',
					path: 'ViewProductCategory',
				},
				{
					name: strings.CurrencyRate,
					url: '/admin/master/currencyConvert',
					icon: 'fas fa-id-card-alt',
					path: 'ViewCurrencyConversion',
				},
				// {
				//   name: 'Currencies',
				//   url: '/admin/master/currency',
				//   icon: 'fas fa-money',
				// },
			],
		},
		{
			name: strings.Inventory,
			url: '/admin/Inventory',
			icon: 'fas fa-warehouse',
			path: 'Inventory',
		},
		{
			name: strings.Template,
			url: '/admin/settings/template',
			icon: 'fas fa-boxes',
			path: 'Template',
		},

		{
			name: strings.Payroll,
			url: '/admin/payroll',
			icon: 'fas fa-users-cog',
			children: [
				// {
				// 	name: strings.Employee,
				// 	url: '/admin/payroll/employee',
				// 	icon: 'fas fa-user-plus',
				// 	path: 'ViewEmployee',
				// },
				{
					name: strings.PayrollRun,
					url: '/admin/payroll/payrollrun',
					icon: 'fas fa-money-check-alt',
					path: 'ViewPayroll',
				},
				{
					name: strings.PayrollConfigurations,
					url: '/admin/payroll/config',
					icon: 'fas fa-cogs',
					path: 'ViewSalaryRole',
				},
				// {
				// 	name: strings.SalaryRoles,
				// 	url: '/admin/payroll/salaryRoles',
				// 	icon: 'fas fa-user-tie',
				// 	path: 'ViewSalaryRole',
				// },
				// {
				// 	name: strings.SalaryTemplates,
				// 	url: '/admin/payroll/salaryTemplate',
				// 	icon: 'fas fa-chalkboard-teacher',
				// 	path: 'ViewSalaryTemplate',
				// },
				// {
				// 	name: strings.SalaryStructure,
				// 	url: '/admin/payroll/salaryStructure',
				// 	icon: 'fas fa-chalkboard-teacher',
				// 	path: 'ViewSalaryStructure',
				// },
				// {
				// 	name: strings.EmployeeDesignation,
				// 	url: '/admin/payroll/employeeDesignation',
				// 	icon: 'fas fa-id-card-alt',
				// 	path: 'ViewEmployeeDesignation',
				// },

				// {
				// 	name: 'Journals',
				// 	url: '/admin/accountant/journal',
				// 	icon: 'fa fa-diamond',
				// 	path: 'ViewJournal',
				// },
		
			],
		},
		// {
		//   name: 'Settings',
		//   url: '/admin/settings',
		//   icon: 'icon-settings',
		//   children: [
		//     {
		//       name: 'Users',
		//       url: '/admin/settings/user',
		//       icon: 'fas fa-users',
		//     },
		//     // {
		//     //   name: 'Organization',
		//     //   url: '/admin/settings/organization',
		//     //   icon: 'fas fa-sitemap',
		//     // }
		//   ]
		// }
	],
};
