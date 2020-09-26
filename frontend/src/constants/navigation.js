export default {
	items: [
		{
			name: 'Dashboard',
			url: '/admin/dashboard',
			icon: 'icon-speedometer',
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
				},
				{
					name: 'Journals',
					url: '/admin/accountant/journal',
					icon: 'fa fa-diamond',
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
				},
				// {
				//   name: 'Upload Statement',
				//   url: '/admin/banking/upload-statement',
				//   icon: 'fa fa-upload',
				// }
			],
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
				},
				{
					name: 'Income Receipts',
					url: '/admin/income/receipt',
					icon: 'fa fa-file-o',
				},
			],
		},
		{
			name: 'Expense',
			url: '/admin/expense',
			icon: 'fas fa-receipt',
			children: [
				{
					name: 'Supplier Invoices',
					url: '/admin/expense/supplier-invoice',
					icon: 'far fa-address-card',
				},
				{
					name: 'Expenses',
					url: '/admin/expense/expense',
					icon: 'fab fa-stack-exchange',
				},
				{
					name: 'Purchase receipts',
					url: '/admin/expense/purchase',
					icon: 'fas fa-money-check',
				},
			],
		},
		{
			name: 'Taxes',
			url: '/admin/taxes',
			icon: 'fas fa-chart-line',
			children: [
				{
					name: 'VAT Transactions',
					url: '/admin/taxes/vat-transactions',
					icon: 'fas fa-exchange-alt',
				},
				// {
				// 	name: 'VAT Filings',
				// 	url: '/admin/taxes/reports-filing',
				// 	icon: 'fas fa-file-text',
				// },
			],
		},
		{
			name: 'Report',
			url: '/admin/report',
			icon: 'fas fa-chart-bar',
			children: [
				// {
				// 	name: 'Transactions',
				// 	url: '/admin/report/transactions',
				// 	icon: 'fas fa-exchange-alt',
				// },
				{
					name: 'Financial',
					url: '/admin/report/financial',
					icon: 'fas fa-usd',
				},
				{
					name: 'Detailed General Ledger',
					url: '/admin/report/detailed-general-ledger',
					icon: 'fas fa-file-text',
				},
			],
		},
		{
			name: 'Master',
			url: '/admin/master',
			icon: 'fas fa-database',
			children: [
				{
					name: 'Chart of Accounts',
					url: '/admin/master/chart-account',
					icon: 'fas fa-area-chart',
				},
				{
					name: 'Contact',
					url: '/admin/master/contact',
					icon: 'fas fa-id-card-alt',
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
				},
				{
					name: 'Product Category',
					url: '/admin/master/product-category',
					icon: 'fas fa-money',
				},
				// {
				//   name: 'Currencies',
				//   url: '/admin/master/currency',
				//   icon: 'fas fa-money',
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
