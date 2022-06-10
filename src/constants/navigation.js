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
					path: 'Customer Invoices',
				},
				{
					name: strings.IncomeReceipts,
					url: '/admin/income/receipt',
					icon: 'fas fa-receipt',
					path: 'Customer Receipts',
				},
				{
					name: strings.Quotation,
					url: '/admin/income/quotation',
					icon: 'fas fa-box-open',
					path: 'Quotation',
				},
				{
					name: strings.CreditNotes,
					url: '/admin/income/credit-notes',
					icon: 'fas fa-donate',
					path: 'Credit Notes',
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
					path: 'Expenses',
				},
				{
					name: strings.SupplierInvoices,
					url: '/admin/expense/supplier-invoice',
					icon: 'far fa-address-card',
					path: 'Supplier Invoices',
				},
				{
					name: strings.Purchasereceipts,
					url: '/admin/expense/purchase',
					icon: 'fas fa-money-check',
					path: 'Supplier Receipts',
				},
				{
					name: strings.RFQ,
					url: '/admin/expense/request-for-quotation',
					icon: 'fas fa-shopping-basket',
					path: 'Request For Quotation',
				},
				{
					name: strings.PurchaseOrder,
					url: '/admin/expense/purchase-order',
					icon: 'fas fa-cash-register',
					path: 'Purchase Order',
				},
				{
					name: strings.GRN,
					url: '/admin/expense/goods-received-note',
					icon: 'fas fa-archive',
					path: 'Goods Receive Notes',
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
					path: 'Bank Accounts',
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
					path: 'Opening Balances',
				},

				{
					name: strings.Journals,
					url: '/admin/accountant/journal',
					icon: 'fas fa-gem',
					path: 'Journals',
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
			path: 'Reports',
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
			path: 'Chart Of Accounts',
			children: [
				{
					name: strings.ChartofAccounts,
					url: '/admin/master/chart-account',
					icon: 'fas fa-area-chart',
					path: 'Chart Of Accounts',
				},
				{
					name: strings.Contact,
					url: '/admin/master/contact',
					icon: 'fas fa-id-card-alt',
					path: 'Contact',
				},
				{
					name: strings.Employee,
					url: '/admin/master/employee',
					icon: 'fas fa-user-plus',
					path: 'Employee',
				},
				{
					name: strings.Product,
					url: '/admin/master/product',
					icon: 'fas fa-object-group',
					path: 'Product',
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
					path: 'Vat Category',
				},
				{
					name: strings.ProductCategory,
					url: '/admin/master/product-category',
					icon: 'fas fa-money',
					path: 'Product Category',
				},
				{
					name: strings.CurrencyRate,
					url: '/admin/master/currencyConvert',
					icon: 'fas fa-id-card-alt',
					path: 'Currency Conversion',
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
				{
					name: strings.PayrollRun,
					url: '/admin/payroll/payrollrun',
					icon: 'fas fa-money-check-alt',
					path: 'Payroll Run',
				},
				{
					name: strings.PayrollConfigurations,
					url: '/admin/payroll/config',
					icon: 'fas fa-cogs',
					path: 'Salary Role',
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
