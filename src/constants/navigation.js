export default {
	items: [
		{
			name: 'Dashboard',
			url: '/admin/dashboard',
			icon: 'icon-speedometer',
			path: 'Dashboard',
		},
		{
			name: 'Income',
			url: '/admin/income',
			icon: 'far fa-address-book',
			children: [
			
				{
					name: 'Customer Invoices',
					url: '/admin/income/customer-invoice',
					icon: 'far fa-address-card',
					path: 'ViewCustomerInvoice',
				},
				{
					name: 'Income Receipts',
					url: '/admin/income/receipt',
					icon: 'fa fa-file-o',
					path: 'CustomerReceipts',
				},
				{
					name: 'Quotation',
					url: '/admin/income/quotation',
					icon: 'fa fa-file-o',
					path: 'ViewQuotation',
				},
			],
		},
		{
			name: 'Expense',
			url: '/admin/expense',
			icon: 'fas fa-receipt',
			children: [
				{
					name: 'Expenses',
					url: '/admin/expense/expense',
					icon: 'fab fa-stack-exchange',
					path: 'ViewExpense',
				},
				{
					name: 'Supplier Invoices',
					url: '/admin/expense/supplier-invoice',
					icon: 'far fa-address-card',
					path: 'ViewSupplierInvoice',
				},
				{
					name: 'Purchase receipts',
					url: '/admin/expense/purchase',
					icon: 'fas fa-money-check',
					path: 'ViewSupplierReceipt',
				},
				{
					name: 'Request For Quotation',
					url: '/admin/expense/request-for-quotation',
					icon: 'fas fa-file-invoice',
					path: 'ViewRequestForQuotation',
				},
				{
					name: 'Purchase Order',
					url: '/admin/expense/purchase-order',
					icon: 'fas fa-file-invoice',
					path: 'ViewPurchaseOrder',
				},
				{
					name: 'Goods Received Note',
					url: '/admin/expense/goods-received-note',
					icon: 'fas fa-file-invoice',
					path: 'ViewGoodsReceiveNotes',
				},
				
			],
		},
		{
			name: 'Banking',
			url: '/admin/banking',
			icon: 'fas fa-file',
			children: [
				{
					name: 'Bank Account',
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
			name: 'Accountant',
			url: '/admin/accountant',
			icon: 'icon-user',
			children: [
				{
					name: 'Opening Balance',
					url: '/admin/accountant/opening-balance',
					icon: 'fas fa-balance-scale',
					path: 'ViewOpeningBalance',
				},
			
				{
					name: 'Journals',
					url: '/admin/accountant/journal',
					icon: 'fa fa-diamond',
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
			name: 'Report',
			url: '/admin/report',
			icon: 'fas fa-boxes',
			path: 'Financial',
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
		// 			url: '/admin/report/financial',
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
			name: 'Master',
			url: '/admin/master',
			icon: 'fas fa-database',
			path: 'ViewChartOfAccounts',
			children: [
				{
					name: 'Chart of Accounts',
					url: '/admin/master/chart-account',
					icon: 'fas fa-area-chart',
					path: 'ViewChartOfAccounts',
				},
				{
					name: 'Contact',
					url: '/admin/master/contact',
					icon: 'fas fa-id-card-alt',
					path: 'ViewContact',
				},
				// {
				// 	name: 'Employee',
				// 	url: '/admin/master/employee',
				// 	icon: 'fas fa-user-tie',
				// },
				{
					name: 'Product',
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
					name: 'VAT Category',
					url: '/admin/master/vat-category',
					icon: 'icon-briefcase',
					path: 'ViewVatCategory',
				},
				{
					name: 'Product Category',
					url: '/admin/master/product-category',
					icon: 'fas fa-money',
					path: 'ViewProductCategory',
				},
				{
					name: 'Currency Conversion',
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
			name: 'Inventory',
			url: '/admin/Inventory',
			icon: 'fas fa-boxes',
			path: 'Inventory',
		},
		{
			name: 'Template',
			url: '/admin/settings/template',
			icon: 'fas fa-boxes',
			path: 'Template',
		},

		{
			name: 'Payroll',
			url: '/admin/payroll',
			icon: 'icon-user',
			children: [
				{
					name: 'Employee',
					url: '/admin/payroll/employee',
					icon: 'fas fa-balance-scale',
					path: 'ViewEmployee',
				},
				{
					name: 'Employment',
					url: '/admin/payroll/employment',
					icon: 'fas fa-balance-scale',
					path: 'ViewEmployment',
				},
				{
					name: 'Financial Details',
					url: '/admin/payroll/financial',
					icon: 'fas fa-balance-scale',
					path: 'ViewEmployeeBankDetails',
				},
				{
					name: 'Salary Roles',
					url: '/admin/payroll/salaryRoles',
					icon: 'fas fa-balance-scale',
					path: 'ViewSalaryRole',
				},
				{
					name: 'Salary Templates',
					url: '/admin/payroll/salaryTemplate',
					icon: 'fas fa-balance-scale',
					path: 'ViewSalaryTemplate',
				},
				{
					name: 'Salary Structure',
					url: '/admin/payroll/salaryStructure',
					icon: 'fas fa-balance-scale',
					path: 'ViewSalaryStructure',
				},

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
