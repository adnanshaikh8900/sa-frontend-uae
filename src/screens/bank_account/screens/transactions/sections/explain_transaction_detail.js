import React from 'react';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as TransactionsActions from '../actions';
import * as transactionDetailActions from '../screens/detail/actions';
import * as CurrencyConvertActions from '../../../../currencyConvert/actions';
import * as detailBankAccountActions from './../../detail/actions';
import { CommonActions } from 'services/global';
import './style.scss';
import { Loader, ConfirmDeleteModal } from 'components';
import moment from 'moment';
import { selectOptionsFactory, selectCurrencyFactory } from 'utils';
import { data } from '../../../../Language/index'
import LocalizedStrings from 'react-localization';
import Switch from "react-switch";
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Checkbox } from '@material-ui/core';
const mapStateToProps = (state) => {
	return {
		expense_list: state.bank_account.expense_list,
		expense_categories_list: state.expense.expense_categories_list,
		user_list: state.bank_account.user_list,
		currency_list: state.bank_account.currency_list,
		vendor_list: state.bank_account.vendor_list,
		vat_list: state.bank_account.vat_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
		UnPaidPayrolls_List: state.bank_account.UnPaidPayrolls_List
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		transactionsActions: bindActionCreators(TransactionsActions, dispatch),
		transactionDetailActions: bindActionCreators(
			transactionDetailActions,
			dispatch,
		),
		detailBankAccountActions: bindActionCreators(
			detailBankAccountActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
	};
};
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		},
	}),
};

let strings = new LocalizedStrings(data);
class ExplainTrasactionDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			createMore: false,
			loading: false,
			fileName: '',
			initValue: {},
			view: false,
			chartOfAccountCategoryList: [],
			transactionCategoryList: [],
			id: '',
			dialog: true,
			totalAmount: '',
			unexplainValue: [],
			creationMode: '',
			unexplainCust: [],
			customer_invoice_list_state: [],
			supplier_invoice_list_state: [],
			moneyCategoryList: [],
			count: 0,
			payrollListIds: '',
			expenseType: true,
			showMore: false,
			res: [],   
			isReverseChargeEnabled:false,
			exclusiveVat:false
		};

		this.file_size = 1024000;
		this.supported_format = [
			'image/png',
			'image/jpeg',
			'text/plain',
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;

		this.formRef = React.createRef();
	}
	componentDidMount = () => {

		if (this.props.selectedData) {
			this.props.transactionDetailActions.getUnPaidPayrollsList();
			this.initializeData();
		}
	};

	initializeData = () => {
		const { selectedData, data } = this.props;
		const { bankId } = this.props;


		this.setState({ loading: true, id: selectedData.id });
		this.getCompanyCurrency();
		this.props.currencyConvertActions.getCurrencyConversionList().then((response) => {
			this.setState({
				initValue: {
					...this.state.initValue,
					...{
						currency: response.data
							? parseInt(response.data[0].currencyCode)
							: '',
					},
				},
			});

		});
		this.props.detailBankAccountActions
			.getBankAccountByID(bankId)
			.then((res) => {
					
					
				this.setState({
					bankCurrency: res,
				});
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.props.history.push('/admin/banking/bank-account');
			});

		this.getChartOfAccountCategoryList(selectedData.debitCreditFlag);


		this.getData()


	};

	getData = () => {
		
		const { selectedData, data, bankId } = this.props;
		if (data) {
			const res = { data: data }

			this.setState(
				{
					loading: false,
					creationMode: this.props.creationMode,
					initValue: {
						bankId: bankId,
						contactName:res.data.contactName?res.data.contactName:'',
						amount: res.data.amount ? res.data.amount : 0,
						dueAmount: res.data.dueAmount ? res.data.dueAmount : '',
						date: res.data.date1
							? res.data.date1
							: '',
						description: res.data.description ? res.data.description : '',
						transactionCategoryId: res.data.transactionCategoryId
							? parseInt(res.data.transactionCategoryId)
							: '',
						transactionId: selectedData.id,
						vatId: res.data.vatId ? res.data.vatId : '',
						vendorId: res.data.vendorId ? res.data.vendorId : '',
						customerId: res.data.customerId ? res.data.customerId : '',
						employeeId: res.data.employeeId ? res.data.employeeId : '',
						explinationStatusEnum: res.data.explinationStatusEnum,
						isReverseChargeEnabled:res.data.isReverseChargeEnabled? res.data?.isReverseChargeEnabled:false,
						exclusiveVat:res.data.exclusiveVat || false,
						reference: res.data.reference ? res.data.reference : '',
						exchangeRate: res.data.exchangeRate ? res.data.exchangeRate : '',
						//currencyName: res.data.currencyName ? res.data.currencyName : '',
						coaCategoryId: res.data.coaCategoryId
							? parseInt(res.data.coaCategoryId)
							: '',
							invoiceIdList: (res.data.explainParamList && res.data.explainedInvoiceList)
							? res.data.explainParamList.map((i,inc)=>{return {...i,...res.data.explainedInvoiceList[inc],pp:res.data.explainedInvoiceList[inc].partiallyPaid}})
							: [],
						transactionCategoryLabel: res.data.transactionCategoryLabel
							? res.data.transactionCategoryLabel
							: '',
						invoiceError: '',
						expenseCategory: res.data.expenseCategory,
						currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
						payrollListIds: res.data.payrollDropdownList ? res.data.payrollDropdownList : [],
						expenseType: res.data.expenseType ? true : false,
						explanationId: res.data.explanationId ? res.data.explanationId : '',
					},
					unexplainValue: {
						bankId: bankId,
						amount: res.data.amount ? res.data.amount : 0,
						date: res.data.date1
							? res.data.date1
							: '',
						description: res.data.description ? res.data.description : '',
						transactionCategoryId: res.data.transactionCategoryId
							? parseInt(res.data.transactionCategoryId)
							: '',
						transactionId: selectedData.id,
						explanationId: res.data.explanationId ? res.data.explanationId : '',
						vatId: res.data.vatId ? res.data.vatId : '',
						vendorId: res.data.vendorId ? res.data.vendorId : '',
						customerId: res.data.customerId ? res.data.customerId : '',
						
						explinationStatusEnum: res.data.explinationStatusEnum,
						reference: res.data.reference ? res.data.reference : '',
						coaCategoryId: res.data.coaCategoryId
							? res.data.coaCategoryId
							: '',
						explainParamList: res.data.explainParamList
							? res.data.explainParamList
							: [],
						transactionCategoryLabel: res.data.transactionCategoryLabel
							? res.data.transactionCategoryLabel
							: '',
						invoiceError: '',
						expenseCategory: res.data.expenseCategory
							? parseInt(res.data.expenseCategory)
							: '',
						currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
					},
					transactionId: selectedData.id,
					date: res.data.date1
						? res.data.date1
						: '',
					amount: res.data.amount ?res.data.amount ? res.data.amount
					+(res.data.explainedInvoiceList?.[0].exchangeGainOrLossAmount ||0 )
					: 0:0,
					currencySymbol: res.data.curruncySymbol ? res.data.curruncySymbol : '',
					expenseType: res.data.expenseType ? true : false,
					transactionCategoryLabel: res.data.transactionCategoryLabel,
					transactionCategoryId: res.data.transactionCategoryId,
					currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
					explanationId: res.data.explanationId ? res.data.explanationId : '',
				},
				() => {

					if (selectedData.debitCreditFlag === 'D') {
						this.getCurrency(this.state.initValue.vendorId)
						this.setCurrency(this.state.currencyCode)
					} else {
						this.getCurrency(this.state.initValue.customerId)
						this.setCurrency(this.state.currencyCode)
					}
					if (

						this.state.initValue.coaCategoryId === 10 &&
						Object.keys(this.state.initValue.invoiceIdList).length !== 0
					) {
						this.setState(
							{
								initValue: {
									...this.state.initValue,
									...{
										coaCategoryId: 100,
									},
								},
							},
							() => { },
						);

					}
					if (res.data.customerId) {
						this.getInvoiceCurrency(
							res.data.customerId,
							res.data.amount,

						)
						this.getCustomerExplainedInvoiceList(
							res.data.customerId,
							res.data.amount,

						);

					}
					if (res.data.vendorId) {
						this.getVendorInvoiceCurrency(
							res.data.vendorId,
							res.data.amount,
						)
						this.getVendorExplainedInvoiceList(
							res.data.vendorId,
							res.data.amount,
						);
					}
				}

			)
			this.formRef.current.setFieldValue('amount', res.data.amount ? res.data.amount
			+(res.data.explainedInvoiceList?.[0].exchangeGainOrLossAmount ||0 )
			: 0, true);
			this.formRef.current.setFieldValue('date', res.data.date1, true);
			this.formRef.current.setFieldValue('coaCategoryId', res.data.coaCategoryId ?res.data.coaCategoryId : '', true);
			this.formRef.current.setFieldValue('expenseCategory', res.data.transactionCategoryId, true);
			this.formRef.current.setFieldValue('vatId', res.data.vatId ? res.data.vatId : '', true);
			this.formRef.current.setFieldValue('vendorId', res.data.vendorId ? res.data.vendorId : '', true);
			this.formRef.current.setFieldValue('invoiceIdList', (res.data.explainParamList && res.data.explainedInvoiceList)
			? res.data.explainParamList.map((i,inc)=>{return {...i,...res.data.explainedInvoiceList[inc],pp:res.data.explainedInvoiceList[inc].partiallyPaid}})
			: [], true);
			this.formRef.current.setFieldValue('customerId', res.data.customerId ? res.data.customerId : '', true);
			this.formRef.current.setFieldValue('exchangeRate', res.data.exchangeRate, true);
			this.formRef.current.setFieldValue('payrollListIds', res.data.payrollListIds, true);
			this.formRef.current.setFieldValue('employeeId', res.data.employeeId ? res.data.employeeId : '', true);
			this.formRef.current.setFieldValue('expenseType', res.data.expenseType, true)
			this.formRef.current.setFieldValue('description', res.data.description, true)
			this.formRef.current.setFieldValue('reference', res.data.reference, true)
			this.formRef.current.setFieldValue('isReverseChargeEnabled',res.data.isReverseChargeEnabled,false)
			this.formRef.current.setFieldValue('exclusiveVat',res.data.exclusiveVat,false)	
		}
	};

	getChartOfAccountCategoryList = (type) => {
		this.setState({ loading: true });

		this.props.transactionsActions.getChartOfCategoryList(type).then((res) => {
			if (res.status === 200) {
			
				this.setState(
					{
						chartOfAccountCategoryList: res.data,
						loading: false,
					},
					() => {

						if (
							this.props.selectedData.explinationStatusEnum === 'FULL' ||
							this.props.selectedData.explinationStatusEnum === 'RECONCILED' ||
							this.props.selectedData.explinationStatusEnum === 'PARTIAL'
						) {
							const id = this.state.chartOfAccountCategoryList[0].options.find(
								(option) => option.value === this.state.initValue.coaCategoryId,
							);

							if (id != null) {
								this.getTransactionCategoryList(id);
							}
						}
						if (this.state.initValue.expenseCategory) {
							this.props.transactionsActions.getExpensesCategoriesList();
							this.props.transactionsActions.getVatList();
						}
					},
				);
			}
		});
	};
	setValue = (value) => {
		
		this.setState((prevState) => {
		
			return {
			...prevState,
			transactionCategoryList: [],
		}});
	};
	getCompanyCurrency = () => {

		this.props.currencyConvertActions
			.getCompanyCurrency()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ basecurrency: res.data });
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({ loading: false });
			});
	};
	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
	};

	setCurrency = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});
		if (result[0] && result[0].currencyIsoCode) {
			
			this.formRef.current.setFieldValue('curreancyname', result[0].currencyIsoCode, true);
		}
	};


	getTransactionCategoryList = (type) => {
	
		this.formRef.current.setFieldValue('coaCategoryId', type, true);
		this.setValue(null);
		if (type && type.value && type.value === 100) {
			this.getVendorList();
		} else {
			this.props.transactionsActions
				.getTransactionCategoryListForExplain(
					type.value,
					this.state.initValue.bankId,
				)
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								transactionCategoryList: res.data,
							},
							() => {
								//console.log(this.state.transactionCategoryList);
							},
						);
					}
				});
		}
	};
	getSuggestionInvoicesFotCust = (option, amount, invoice_list) => {

		const data = {
			amount: amount,
			id: option,
			currency: this.state.custInvoiceCurrency && invoice_list != null ? this.state.custInvoiceCurrency : 0,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions.getCustomerInvoiceList(data).then((res) => {
			this.setState({
				customer_invoice_list_state: res.data,
			});
		});
		if (invoice_list === null) {
			this.formRef.current.setFieldValue('curreancyname', "", true);
			this.formRef.current.setFieldValue('exchangeRate', "", true);
			this.formRef.current.setFieldValue('currencyCode', "", true);
		}
	};

	getCustomerExplainedInvoiceList = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
			currency: this.state.custInvoiceCurrency ? this.state.custInvoiceCurrency : 0,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions
			.getCustomerExplainedInvoiceList(data)
			.then((res) => {
				this.setState({
					customer_invoice_list_state: res.data,
				});
				this.getSuggestionInvoicesFotCust(option, amount, 0)
			});
	};

	getVendorExplainedInvoiceList = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
			currency: this.state.invoiceCurrency,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions
			.getVendorExplainedInvoiceList(data)
			.then((res) => {
				this.setState({
					supplier_invoice_list_state: res.data,
				});
				this.getSuggestionInvoicesFotVend(option, amount, 0)
			});
	};

	getSuggestionInvoicesFotVend = (option, amount, invoice_list) => {
		const data = {
			amount: amount,
			id: option,
			currency: this.state.invoiceCurrency && invoice_list != null ? this.state.invoiceCurrency : 0,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions.getVendorInvoiceList(data).then((res) => {
			this.setState({
				supplier_invoice_list_state: res.data,
			});
		});
		if (invoice_list === null) {

			this.formRef.current.setFieldValue('curreancyname', "", true);
			this.formRef.current.setFieldValue('exchangeRate', "", true);
			this.formRef.current.setFieldValue('currencyCode', "", true);
		}
	};
	getInvoiceCurrency = (opt, props) => {

		const {
			customer_invoice_list_state,
		} = this.state;
		customer_invoice_list_state.map(item => {
			if (item.value === opt.value) {
				this.setState({
					custInvoiceCurrency: item.currencyCode
				}, () => {
					this.getSuggestionInvoicesFotCust(
						opt && opt.value,
						props
					);
					this.formRef.current.setFieldValue('currencyCode', this.state.custInvoiceCurrency, true);
					this.setCurrency(this.state.custInvoiceCurrency);
					this.setExchange(this.state.custInvoiceCurrency);
				})
			}
		})

	}
	getVendorInvoiceCurrency = (opt, props) => {

		const {
			supplier_invoice_list_state,
		} = this.state;
		supplier_invoice_list_state.map(item => {
			if (item.value === opt.value) {
				this.setState({
					invoiceCurrency: item.currencyCode
				}, () => {
					this.getSuggestionInvoicesFotVend(
						props.values.vendorId.value,
						this.state.initValue.amount,
						0
					);

					// this.formRef.current.setFieldValue('currencyCode', this.getCurrency(props.values.vendorId.value), true);
					// this.setExchange( this.getCurrency(option.value) );
					this.formRef.current.setFieldValue('currencyCode', this.state.invoiceCurrency, true);
					this.setCurrency(this.state.invoiceCurrency);
					this.setExchange(this.state.invoiceCurrency);
				})
			}
		})


	}
	getUserList = () => {
		this.props.transactionsActions.getUserForDropdown();
	};

	getMoneyPaidToUserlist = (option) => {
		try {
			this.props.transactionsActions.getMoneyCategoryList(option.value)
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								moneyCategoryList: res.data,
							},
							() => { },
						);
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	getExpensesCategoriesList = () => {
		this.props.transactionsActions.getExpensesCategoriesList();
		this.props.currencyConvertActions.getCurrencyConversionList().then((response) => {
			this.setState({
				initValue: {
					...this.state.initValue,
					...{
						currency: response.data
							? parseInt(response.data[0].currencyCode)
							: '',
					},
				},
			});
			// this.formRef.current.setFieldValue(
			// 	'currency',
			// 	response.data[0].currencyCode,
			// 	true,
			// );
		});
		// this.props.transactionsActions.getUserForDropdown();
		this.props.transactionsActions.getVatList();
	};

	getVendorList = () => {
		
		this.props.transactionsActions.getVendorList(this.state.initValue.bankId);
	};

	handleSubmit = (data, resetForm) => {
		// if (
		// 	data.invoiceIdList &&
		// 	data.invoiceIdList.reduce(
		// 		(totalAmount, invoice) => totalAmount + invoice.amount,
		// 		0,
		// 	) > data.amount
		// ) {
		// 	return false;
		// } 
		// else {

		const {
			bankId,
			date,
			reference,
			description,
			amount,
			dueAmount,
			coaCategoryId,
			// transactionCategoryId,
			vendorId,
			employeeId,
			exchangeRate,
			invoiceIdList,
			customerId,
			vatId,
			currencyCode,
			// userId,
			transactionId,
			expenseCategory,
			payrollListIds,
		} = data;

		const expenseType = this.state.selectedStatus;

		if (
			(invoiceIdList && coaCategoryId.label === 'Sales') ||
			(invoiceIdList && coaCategoryId.label === 'Supplier Invoice')
		) {
			var result = invoiceIdList.map((o) => ({
				id: o.value,
				remainingInvoiceAmount: 0,
				type: o.type,
			}));
		}

		if (
			payrollListIds &&
			expenseCategory &&
			expenseCategory === 34
		) {
			var result1 = payrollListIds.map((o) => ({
				payrollId: o.value,
			}));
			console.log(result1);
		}
		let id;
		if (coaCategoryId && coaCategoryId.value === 100) {
			id = 10;
		} else {
			id = coaCategoryId.value;
		}
		let formData = new FormData();
		formData.append('expenseType', this.state.expenseType);
		formData.append('transactionId', this.state.transactionId ? this.state.transactionId : '');
		formData.append('explanationId', this.state.explanationId ? this.state.explanationId : '')
		formData.append('bankId ', this.props.bankId ? this.props.bankId : '');
		formData.append(
			'date',
			this.state.date
				? moment(this.state.date)
				: date,
		);
		if(exchangeRate != null){
			formData.append(
				'exchangeRate',
				exchangeRate ? exchangeRate : 1,
			);
		}
		
		formData.append('description', description ? description : '');
		formData.append('amount', amount ? amount : '');
		formData.append('dueAmount', dueAmount ? dueAmount : 0);
		formData.append('coaCategoryId', coaCategoryId ? id : '');
		if (this.state.transactionCategoryId) {
			formData.append(
				'transactionCategoryId',
				this.state.transactionCategoryId && this.state.transactionCategoryId.value !== undefined ? this.state.transactionCategoryId.value : this.state.transactionCategoryId,
			);
		}
		if (customerId && coaCategoryId.value === 2) {
			formData.append('customerId', customerId ? customerId : '');
		}
		if (vendorId && coaCategoryId.label === 'Supplier Invoice') {
			formData.append('vendorId', vendorId.value ? vendorId.value : vendorId);
		}
		// if (
		// 	currencyCode &&
		// 	(coaCategoryId.label === 'Expense' ||
		// 		coaCategoryId.label === 'Admin Expense' ||
		// 		coaCategoryId.label === 'Other Expense' ||
		// 		coaCategoryId.label === 'Cost Of Goods Sold'

		// 	)
		// ) {
		// 	formData.append('currencyCode', currencyCode.value);
		// }

		// if (
		// 	currencyCode &&
		// 	(
		// 		coaCategoryId.label === 'Supplier Invoice' ||
		// 		coaCategoryId.label === 'Sales')
		// ) {
		// 	formData.append('currencyCode', currencyCode );
		// }
		if (
			currencyCode && currencyCode.value

		) {
			formData.append('currencyCode', currencyCode.value);
		} else {
			if (currencyCode) {
				formData.append('currencyCode', currencyCode);
			}
		}

		if (
			expenseCategory &&
			(coaCategoryId.label === 'Expense' ||
				coaCategoryId.label === 'Admin Expense' ||
				coaCategoryId.label === 'Other Expense' ||
				coaCategoryId.label === 'Cost Of Goods Sold')
		) {
			formData.append(
				'expenseCategory',
				expenseCategory ? expenseCategory : '',
			);
		}
		if (
			(vatId && coaCategoryId.value === 10) ||
			(vatId && coaCategoryId.label === 'Expense')
		) {
			formData.append('vatId', vatId ? vatId : '');
		}

		if (employeeId !== null) {
			formData.append('employeeId', employeeId ? employeeId.value : '');
		} else if (employeeId !== null) {
			formData.append('employeeId', employeeId ? employeeId : '');
		}
		if (
			(invoiceIdList && coaCategoryId.label === 'Sales') ||
			(invoiceIdList && coaCategoryId.label === 'Supplier Invoice')
		) {
			formData.append(
				'explainParamListStr',
				invoiceIdList ? JSON.stringify(result) : '',
			);
		}
		formData.append(
			"explainedInvoiceListString",
			invoiceIdList ?JSON.stringify(invoiceIdList.map((i)=>{
	
			 return {
			  invoiceId:i.value,
			  invoiceAmount:i.amount,
			  convertedInvoiceAmount:i.convertedInvoiceAmount,
			  explainedAmount:i.explainedAmount,
			  exchangeRate:i.exchangeRate,
			  partiallyPaid:i.pp,
			  nonConvertedInvoiceAmount:i.explainedAmount/i.exchangeRate,
          	convertedToBaseCurrencyAmount:i.convertedToBaseCurrencyAmount,
			 } })) : []
		  );
		
		  formData.append(
			"exchangeGainOrLossId",this.setexcessorshortamount().data<0?103:this.setexcessorshortamount().data>0?79:0
		  );
		  formData.append(
			"exchangeGainOrLoss",this.setexcessorshortamount().data
		  );

		formData.append('reference', reference ? reference : '');
		if (this.uploadFile && this.uploadFile.files && this.uploadFile?.files?.[0]) {
			formData.append('attachment', this.uploadFile?.files?.[0]);
		}
		if (
			payrollListIds &&
			expenseCategory &&
			expenseCategory === 34
		) {

			formData.append(
				'payrollListIds',
				payrollListIds ? JSON.stringify(result1) : '',
			);
		}
		this.props.transactionDetailActions
			.updateTransaction(formData)
			.then((res) => {
				if (res.status === 200) {
					//esetForm();
					this.props.commonActions.tostifyAlert(
						'success',
						'Transaction Detail Explained Successfully.',
					);
					this.props.closeExplainTransactionModal(this.state.id);
					this.props.getbankdetails()
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
		
	};
	handleFileChange = (e, props) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		if (file) {
			reader.onloadend = () => { };
			reader.readAsDataURL(file);
			props.setFieldValue('attachmentFile', file, true);
		}
	};

	closeTransaction = (id) => {
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={() => this.removeTransaction(id)}
					cancelHandler={this.removeDialog}
					message="This Transaction will be deleted and cannot be reversed "
				/>
			),
		});
	};


	payrollList = (option) => {
		this.setState({
			initValue: {
				...this.state.initValue,
				...{
					payrollListIds: option,
				},
			},
		});
		this.formRef.current.setFieldValue('payrollListIds', option, true);
	};
	getPayrollList = (UnPaidPayrolls_List, props) => {
		return (<Col lg={3}>
			<FormGroup className="mb-3">
				<Label htmlFor="payrollListIds">
					Payolls
				</Label>
				<Select
					styles={customStyles}
					isMulti
					value={props.values.payrollListIds}
					className="select-default-width"
					options={
						UnPaidPayrolls_List &&
							UnPaidPayrolls_List
							? UnPaidPayrolls_List
							: []
					}
					id="payrollListIds"
					onChange={(option) => {
						props.handleChange('payrollListIds')(
							option,
						);
						this.payrollList(option);
					}} />
			</FormGroup>
		</Col>);
	}

	UnexplainTransaction = (id) => {
		
		let formData = new FormData();
		for (var key in this.state.unexplainValue) {
			formData.append(key, this.state.unexplainValue[key]);
			formData.set('date', moment(this.state.unexplainValue['date']));
			console.log(this.state.unexplainValue['explainParamList'])
			formData.set('explainParamListStr', JSON.stringify(this.state.unexplainValue['explainParamList']));
			if (
				Object.keys(this.state.unexplainValue['invoiceIdList'] || {}).length > 0
			) {
				formData.delete('invoiceIdList');
				formData.set(
					'explainParamListStr',
					JSON.stringify(this.state.unexplainValue['invoiceIdList']),
				);
			} else {
				formData.delete('invoiceIdList');
			}
		}
		formData.delete('explainParamList')
		this.props.transactionDetailActions
			.UnexplainTransaction(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Transaction Detail Updated Successfully.',
					);
					this.props.closeExplainTransactionModal(this.state.id);
					this.props.getbankdetails()
				}
			})
			.catch((err) => {
				
				console.log(err);
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	invoiceIdList = (option) => {
		this.setState(
			{
				initValue: {
					...this.state.initValue,
					...{
						invoiceIdList: option,
					},
				},
			},
			() => { },
		);
		this.formRef.current.setFieldValue('invoiceIdList', option, true);
	};
	setexcessorshortamount = () => {
		const totalexpainedamount = this.formRef.current.state.values?.invoiceIdList?.reduce(
		  (accu, curr, index) =>
			accu +
			(curr.explainedAmount)
		  ,
		  0
		)
	
		const totalconvetedamount = this.formRef.current.state.values?.invoiceIdList?.reduce(
		  (accu, curr, index) =>
			accu +
			(curr.convertedInvoiceAmount)
		  ,
		  0
		)
	
		const transactionAmount = this.formRef.current.state.values.amount
		const isppselected = this.formRef.current.state.values?.invoiceIdList?.reduce((a, c, i) => a + (c.pp ? 1 : 0), 0)
	
		let final = 0
		const totalshort = totalexpainedamount - totalconvetedamount
		if (isppselected > 0) {
		  final = 0
		} else if (totalshort < 0) {
		  final = totalshort
		} else if (totalshort >= 0) {
		  final = transactionAmount - totalconvetedamount
		}
		
		return {value:`${this.state.bankCurrency
			?.bankAccountCurrencyIsoCode
		  } ${final.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
		  }  `,data:final.toFixed(2)}
	
	  }
	  setcustomexchnage = (customerinvoice) => {


		let exchange;
		let convertor=this.state.bankCurrency.bankAccountCurrency===this.state.basecurrency.currencyCode
		?customerinvoice:this.state.bankCurrency.bankAccountCurrency
		let result = this.props.currency_convert_list.filter((obj) => {
		  return obj.currencyCode === convertor;
		});
		// this.state.invoiceCurrency
		// this.state.bankCurrency.bankAccountCurrency
		// this.state.basecurrency.currencyCode
		// if(this.state.bankCurrency.bankAccountCurrency=== this.state.invoiceCurrency )
		//  return this.formRef.current.setFieldValue('exchangeRate',1/result[0].exchangeRate, true);
	
		if (
			customerinvoice === this.state.bankCurrency.bankAccountCurrency
		  ) {
			exchange = 1;
			//this.formRef.current.setFieldValue('exchangeRate', 1, true);
		  } else {
			if(this.state.basecurrency.currencyCode===customerinvoice)
			exchange= 1/result[0].exchangeRate
			else exchange= result[0].exchangeRate
		  }
		  
		
	
		return exchange
	  }
	
	  
	  basecurrencyconvertor=(customerinvoice)=>{
		let exchange;
		if(this.state.bankCurrency.bankAccountCurrency!==this.state.basecurrency.currencyCode)
		{let result = this.props.currency_convert_list.filter((obj) => {
		  return obj.currencyCode === customerinvoice;
		});
		exchange= result[0].exchangeRate
	  } else {
		exchange= 1
	  }
		return exchange
	  }
	  
	
	  setexchnagedamount = (option, amount) => {
		
		if (option?.length > 0) {
		  const transactionAmount = amount || this.formRef.current.state.values.amount
		  const exchangerate = this.formRef.current.state.values?.exchangeRate
		  const invoicelist = [...option]
		  const total = invoicelist.reduce((accu, curr, index) => curr.amount * exchangerate[index])
		  let remainingcredit = transactionAmount
		  const finaldata = invoicelist?.map((i, ind) => {
			let localexe = 0
			if (i.exchnageRate === undefined) localexe = this.setcustomexchnage(i.currencyCode)
			else localexe = i.exchnageRate
			let finalcredit = 0
			let localremainamount = remainingcredit
			if (remainingcredit > 0) {
			  localremainamount = remainingcredit - (i.amount * localexe)
	
			  if (localremainamount >= 0) {
				finalcredit = (i.amount * localexe)
			  }
			  if (localremainamount < 0) {
				finalcredit = (i.amount * localexe) + localremainamount
			  }
			  remainingcredit = localremainamount
			}
			const basecurrency=this.basecurrencyconvertor(i.currencyCode)
			if(this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED")
			return {
			  ...i,
	
			  invoiceId: i.value,
			  invoiceAmount: i.amount,
			  convertedInvoiceAmount: i.amount * localexe,
			  explainedAmount: i.amount * localexe,
			  exchangeRate: localexe,
			  pp: false,
			  convertedToBaseCurrencyAmount:(i.amount * localexe)*basecurrency
			}
			else 
			return {
				...i,
	  
				invoiceId: i.value,
				invoiceAmount: (i.dueAmount)?.toFixed(2),
				convertedInvoiceAmount: (i.dueAmount * localexe)?.toFixed(2),
				explainedAmount: (i.dueAmount * localexe)?.toFixed(2),
				exchangeRate: localexe,
				pp: false,
				convertedToBaseCurrencyAmount:((i.dueAmount * localexe)*basecurrency)?.toFixed(2)
			  }
		  })
		   

		
		  this.formRef.current.setFieldValue('invoiceIdList', finaldata)
		  
		  
		  return finaldata
		}
		else {
		  this.formRef.current.setFieldValue('invoiceIdList', [])
		  return []
		}
	
	
	  }
	  onppclick = (value, indexofinvoce) => {
		
		const local2 = [...this.formRef.current.state.values.invoiceIdList]
		local2[indexofinvoce].pp = value
		let finaldata = [...(local2)]
	
		//how many are clicked
		const howManyAreClicked = finaldata.reduce((a, c, i) => a + (c.pp ? 1 : 0), 0)
		const transactionAmount = this.formRef.current.state.values.amount
		const total = finaldata.reduce((accu, curr, index) => accu + curr.convertedInvoiceAmount, 0)
		const shortAmount = transactionAmount - total
		let remainingcredit = transactionAmount
		let updatedfinaldata = []
		let temp=finaldata.reduce((a,c,i)=>c.convertedInvoiceAmount>=transactionAmount?a+1:a+0,0)
		let amountislessthanallinvoice= temp===finaldata.length

		let tempdata
		if(amountislessthanallinvoice) {
		if(value){
		  tempdata=finaldata.map((i)=>
		  {const basecurrency=this.basecurrencyconvertor(i.currencyCode)
			return {...i,pp:value,explainedAmount:transactionAmount/finaldata.length,
		  convertedToBaseCurrencyAmount:((transactionAmount/finaldata.length)*basecurrency)?.toFixed(2)
		}
		 })
		}
		else {
		  const temp=finaldata.map((i)=>{
			return {...i,pp:value}
		  })
		  tempdata=this.setexchnagedamount(temp)
		  
		}
		finaldata=[...tempdata]
		if(transactionAmount>0 && transactionAmount!=="")
		this.formRef.current.setFieldValue('invoiceIdList', finaldata)
	   } else {
		let currentshort=shortAmount
		finaldata.map((i, inx) => {
		  const local = { ...i }
				
		  if (i.pp) {
				let iio= local.convertedInvoiceAmount +(currentshort/howManyAreClicked)
				if(iio<0){
					local.explainedAmount= 0
					
				} else {
					local.explainedAmount=iio
				}
			}
			 else {
				local.explainedAmount=local.convertedInvoiceAmount?.toFixed(2)
			}	
			
			
		  
		  updatedfinaldata.push(local)
		})
		
		updatedfinaldata=updatedfinaldata.map((i)=>{
			const basecurrency=this.basecurrencyconvertor(i.currencyCode)
			return {...i,
			  convertedToBaseCurrencyAmount:(i.explainedAmount*basecurrency)?.toFixed(2)
			}
		  })
		this.formRef.current.setFieldValue('invoiceIdList', updatedfinaldata)
	  }
	}
	removeTransaction = (id) => {
		this.removeDialog();
		this.props.transactionsActions
			.deleteTransactionById(id)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'Transaction Deleted Successfully',
				);
				this.props.closeExplainTransactionModal(this.state.id);
				this.props.getbankdetails()
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : null,
				);
			});
	};


	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	getCurrency = (opt) => {
		let supplier_currencyCode = 0;

		this.props.vendor_list.map(item => {
			if (item.label.contactId == opt) {
				this.setState({
					supplier_currency: item.label.currency.currencyCode,
					supplier_currency_des: item.label.currency.currencyName
				});

				supplier_currencyCode = item.label.currency.currencyCode;
			}
		})

		console.log('supplier_currencyCode', supplier_currencyCode)

		if (supplier_currencyCode != 0) {
			return supplier_currencyCode;
		} else {
			return this.state.unexplainValue && this.state.unexplainValue.currencyCode ? this.state.unexplainValue.currencyCode : 0;
		}
	}

	handleFileChange = (e, props) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		if (file) {
			reader.onloadend = () => { };
			reader.readAsDataURL(file);
			props.setFieldValue('attachment', file, true);
		}
	};
	getValueForCategory = (option) => {

		if (option && option.label === 'Salaries and Employee Wages' && this.state.count === 0) {

			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Owners Drawing' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Dividend' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Owners Current Account' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Share Premium' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Employee Advance' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Employee Reimbursements' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Director Loan Account' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}
		if (option && option.label === 'Owners Equity' && this.state.count === 0
		) {
			this.getMoneyPaidToUserlist(option); this.setState({ count: 1 })
		}


		return option
	}

	render() {

		strings.setLanguage(this.state.language);
		const {
			initValue,
			loading,
			chartOfAccountCategoryList,
			transactionCategoryList,
			dialog,
			customer_invoice_list_state,
			supplier_invoice_list_state,
			moneyCategoryList,
		} = this.state;
		const {
			expense_categories_list,
			currency_list,
			vendor_list,
			vat_list,
			currency_convert_list,
			UnPaidPayrolls_List,
		} = this.props;

		let tmpSupplier_list = []

		vendor_list.map(item => {
			let obj = { label: item.label.contactName, value: item.value }
			tmpSupplier_list.push(obj)
		})

		let transactionCategoryValue = {
			label: 'Select Category'
		}


		if (this.state.transactionCategoryList && this.state.transactionCategoryList.categoriesList) {

			let allCategories = [];

			this.state.transactionCategoryList.categoriesList.forEach((cat) => {

				if (cat.options && Array.isArray(cat.options)) {
					cat.options.forEach((opt) => {

						allCategories.push(opt)

					})
				}
			});


			if (this.state.transactionCategoryId) {
				let labelObj = allCategories.find((ac) => {
					return ac.value == this.state.transactionCategoryId
				})

				if (labelObj) {
					transactionCategoryValue.label = labelObj.label
					transactionCategoryValue.value = labelObj.value
				}
			}
		}

		return (
			<div className="detail-bank-transaction-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							{dialog}
							{loading ? (
								<Loader />
							) : (
								<Card>
									<CardHeader>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="icon-doc" />
													<span className="ml-2">
													
														{
															this.props.selectedData.debitCreditFlag === 'D' ?
																strings.Explain + " " + strings.Transaction + " " + strings.For + " " + strings.WithdrawalAmount + " " + this.state.bankCurrency?.bankAccountCurrencyIsoCode + " " + this.state.amount :
																strings.Explain + " " + strings.Transaction + " " + strings.For + " " + strings.DepositAmount + " " + this.state.bankCurrency?.bankAccountCurrencyIsoCode + " " + this.state.amount
														}

													</span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<Row>
											<Col lg={12}>
												<Formik
													initialValues={this.state.initValue}
													ref={this.formRef}
													onSubmit={(values, { resetForm }) => {
														this.handleSubmit(values, resetForm);
													}}
													validate={(values) => {
														let errors = {};
														const totalexpaled=values?.invoiceIdList.reduce((a,c)=>a+c.explainedAmount,0)
													
														if ((values.coaCategoryId?.value === 2 || values.coaCategoryId?.value === 100)) {
															if (!values.vendorId?.value && values.coaCategoryId?.value === 100) {
															  errors.vendorId = "Please select the Vendor"
															} else if (!values.customerId && values.coaCategoryId?.value === 2) {
															  errors.customerId = "Please select the Customer"
								
															}
															if (values.invoiceIdList.length === 0) {
								
															  errors.invoiceIdList = "Please Select Invoice"
															}else {
															  let isExplainAmountZero=false
															  values.invoiceIdList.map((i)=>{
																  if(i.explainedAmount===0){
																	isExplainAmountZero=true 
																  }
															  })
															  if(isExplainAmountZero){
																errors.invoiceIdList="Expain Amount Cannot Be Zero"  
															  }
															}
											
															
														  values.invoiceIdList.map((ii)=>{
															if((this.state.bankCurrency.bankAccountCurrency!==this.state.basecurrency.currencyCode
															  && this.state.basecurrency.currencyCode!==ii.currencyCode) && this.state.bankCurrency.bankAccountCurrency!==ii.currencyCode)
															  
															  errors.invoiceIdList="Invoices created in another FCY cannot be processed by this foreign currency bank account."
															 
														  }
														  )
														  
										
														if( values.amount>totalexpaled &&
														  this.state?.bankCurrency?.bankAccountCurrency===values?.invoiceIdList?.[0]?.currencyCode)
													   {
														errors.amount=`The transaction amount cannot be greater than the invoice amount.`
													   
													  }
														  const isppselected=values?.invoiceIdList.reduce((a,c)=>c.pp?a+1:a+0,0)
                          if( values.amount<totalexpaled &&
                            this.state?.bankCurrency?.bankAccountCurrency===values?.invoiceIdList?.[0]?.currencyCode
                            && isppselected===0
                            )
                         		{
                          errors.amount=`The transaction amount is less than the invoice amount. To partially pay the invoice, please select the checkbox `
                         
                       			 }
														  }
								
														
														// if (
														// 	values.coaCategoryId.label !==
														// 	'Supplier Invoice' &&
														// 	values.coaCategoryId.label !== 'Sales' &&
														// 	values.coaCategoryId.label !== 'Expense' &&
														// 	!values.transactionCategoryId
														// ) {
														// 	errors.transactionCategoryId =
														// 		'Transaction Category is Required';
														// }
														if (
															(values.coaCategoryId.value === 12 ||
																values.coaCategoryId.value === 6) &&
															!values.employeeId
														) {
															errors.employeeId = 'User is Required'
														}
														return errors;
													}}
													validationSchema={Yup.object().shape({
														date: Yup.string().required(
															'Transaction Date is Required',
														),
														amount: Yup.string()
															.required('Transaction Amount is Required')
															.test(
																'amount',
																'Transaction Amount Must Be Greater Than 0',
																(value) => value > 0,
															),
														coaCategoryId: Yup.object().required(
															'Transaction Type is Required',
														),
														// employeeId: Yup.object().required(
														// 	'Employee Type is Required',
														// ),
														attachment: Yup.mixed()
															.test(
																'fileType',
																'*Unsupported File Format',
																(value) => {
																	value &&
																		this.setState({
																			fileName: value.name,
																		});
																	if (
																		!value ||
																		(value &&
																			this.supported_format.includes(
																				value.type,
																			)) ||
																		!value
																	) {
																		return true;
																	} else {
																		return false;
																	}
																},
															)
															.test(
																'fileSize',
																'*File Size is too large',
																(value) => {
																	if (
																		!value ||
																		(value && value.size <= this.file_size) ||
																		!value
																	) {
																		return true;
																	} else {
																		return false;
																	}
																},
															),
													})}
												>
													{(props) => (
														<Form onSubmit={props.handleSubmit}>
															{console.log(props, this.state)}

															<Row>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="chartOfAccountId">
																			<span className="text-danger">* </span>
																			{strings.TransactionType}
																		</Label>
																		
																			<Select
																				// styles={customStyles}
																				isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" ||this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																				options={
																					chartOfAccountCategoryList
																						? [{...chartOfAccountCategoryList[0],
																							options:chartOfAccountCategoryList[0]?.options?.filter((i)=>i.value!==6)}]
																						: ''
																				}
																				value={
																					chartOfAccountCategoryList[0] &&
																					chartOfAccountCategoryList[0].options.find(
																						(option) =>{
										
																						return	option.value === props.values.coaCategoryId.value 
																						}
																							)
																				}
																				onChange={(option) => {
																					if (option && option.value) {
																						props.handleChange('coaCategoryId')(
																							option,
																						);
																					} else {
																						props.handleChange('coaCategoryId')(
																							'',
																						);
																					}
																					if (
																						option.label !== 'Expense' &&
																						option.label !== 'Supplier Invoice'
																					) {
																						this.getTransactionCategoryList(
																							option,
																						);
																					}
																					if (option.label === 'Expense') {
																						this.getExpensesCategoriesList();
																					}
																					if (
																						option.label === 'Supplier Invoice'
																					) {
																						this.getVendorList();
																					}
																					this.formRef.current.setFieldValue(
																						'transactionCategoryLabel',
																						'',
																						true,
																					);
																				
																				}}
																				placeholder={strings.Select+strings.Type}
																				id="coaCategoryId"
																				name="coaCategoryId"
																				className={
																					props.errors.coaCategoryId &&
																						props.touched.coaCategoryId
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.coaCategoryId &&
																				props.touched.coaCategoryId && (
																					<div className="invalid-feedback">
																						{props.errors.coaCategoryId}
																					</div>
																				)}
																		</FormGroup>
																	</Col>
																	<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="date">
																						<span className="text-danger">* </span>
																					{strings.TransactionDate}
																				</Label>
																					<DatePicker
																						id="date"
																						name="date"
																						readOnly={
																							this.state.creationMode === 'MANUAL'
																								? false
																								: true
																						}
																						placeholderText={strings.TransactionDate}
																						showMonthDropdown
																						showYearDropdown
																						dateFormat="DD-MM-YYYY"
																						dropdownMode="select"
																						value={moment(props.values.date).format("DD-MM-YYYY")}
																						onChange={(value) =>
																							props.handleChange('date')(value)
																						}
																						className={`form-control ${props.errors.date &&
																								props.touched.date
																								? 'is-invalid'
																								: ''
																							}`}
																					/>
																					{props.errors.date &&
																						props.touched.date && (
																							<div className="invalid-feedback">
																								{props.errors.date}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="amount">
																				<span className="text-danger">* </span>
																			{strings.Amount}
																		</Label>
																		<Input
																			type="number"
																			min="0"
																			id="amount"
																			name="amount"
																			placeholder={strings.Amount}
																			readOnly={
																				this.state.creationMode === 'MANUAL'
																					? false
																					: true
																			}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regEx.test(option.target.value)
																				) {
																					props.handleChange('amount')(
																						option.target.value,
																					);
																				}
																				this.setexchnagedamount(props.values.invoiceIdList, option.target.value)
																			}}
																			value={props.values.amount}
																			className={
																				props.errors.amount &&
																					props.touched.amount
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.amount &&
																			props.touched.amount && (
																				<div className="invalid-feedback">
																					{props.errors.amount}
																				</div>
																			)}
																	</FormGroup>
																</Col>
															</Row>
															{/* {transactionCategoryList.dataList &&
																props.values.coaCategoryId === 10 && (
																	<Row>
																		<Col lg={12}>
																			<FormGroup check inline className="mb-3">
																				<div className="expense-option">
																					<Label
																						className="form-check-label"
																						check
																						htmlFor="producttypeone"
																					>
																						<Input
																							className="form-check-input"
																							type="radio"
																							id="producttypeone"
																							name="producttypeone"
																							value="EXPENSE"
																							onChange={(value) => {
																								const data = {
																									value: 'EXPENSE',
																									id: 10,
																								};
																								props.handleChange(
																									'expenseType',
																								)(data);
																								// this.getSuggestionExpenses(
																								// 	props.values.amount,
																								// );
																							}}
																							checked={
																								props.values.expenseType
																									.value === 'EXPENSE'
																							}
																						/>
																						Create Expense
																					</Label>
																					<Label
																						className="form-check-label"
																						check
																						htmlFor="producttypetwo"
																					>
																						<Input
																							className="form-check-input"
																							type="radio"
																							id="producttypetwo"
																							name="producttypetwo"
																							value="SUPPLIER"
																							onChange={(value) => {
																								const data = {
																									value: 'SUPPLIER',
																									id: 10,
																								};
																								props.handleChange(
																									'expenseType',
																								)(data);
																							}}
																							checked={
																								props.values.expenseType
																									.value === 'SUPPLIER'
																							}
																						/>
																						Explain Supplier Invoice
																					</Label>
																				</div>
																			</FormGroup>
																		</Col>
																	</Row>
																)} */}
															{props.values.coaCategoryId &&
																props.values.coaCategoryId.label ===
																'Expense' && (
																	<Row>
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="expenseCategory">
																					<span className="text-danger">* </span>
																					{strings.ExpenseCategory}
																				</Label>
																				<Select
																					styles={customStyles}
																					isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" ||this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																					options={
																						expense_categories_list
																							? selectOptionsFactory.renderOptions(
																								'transactionCategoryName',
																								'transactionCategoryId',
																								expense_categories_list,
																								'Expense Category',
																							)
																							: []
																					}
																					value={
																						expense_categories_list &&
																						selectOptionsFactory
																							.renderOptions(
																								'transactionCategoryName',
																								'transactionCategoryId',
																								expense_categories_list,
																								'Expense Category',
																							)
																							.find(
																								(option) =>
																									option.value ===
																									+props.values.expenseCategory,
																							)
																					}
																					// value={props.values.expenseCategory}
																					onChange={(option) => {
																						props.handleChange(
																							'expenseCategory',
																						)(option.value);
																					}}
																					id="expenseCategory"
																					name="expenseCategory"
																					className={
																						props.errors.expenseCategory &&
																							props.touched.expenseCategory
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.expenseCategory &&
																					props.touched.expenseCategory && (
																						<div className="invalid-feedback">
																							{props.errors.expenseCategory}
																						</div>
																					)}
																			</FormGroup>
																		</Col>

																		{props.values.expenseCategory && props.values.expenseCategory == 34 &&
																			(
																				this.getPayrollList(UnPaidPayrolls_List, props)
																			)}
																		{props.values.coaCategoryId &&
																			props.values.coaCategoryId.label ===
																			'Expense' && props.values.expenseCategory !== 34 && (
																				<Col lg={3}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="vatId">{strings.VAT}</Label>
																						<Select
																						isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" ||this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																							options={
																								vat_list
																									? selectOptionsFactory.renderOptions(
																										'name',
																										'id',
																										vat_list,
																										'Tax',
																									)
																									: []
																							}
																							value={
																								vat_list &&
																								selectOptionsFactory
																									.renderOptions(
																										'name',
																										'id',
																										vat_list,
																										'Tax',
																									)
																									.find(
																										(option) =>
																											option.value ===
																											props.values.vatId,
																									)
																							}
																							onChange={(option) => {
																								if (option && option.value) {
																									props.handleChange('vatId')(
																										option.value,
																									);
																								} else {
																									props.handleChange('vatId')(
																										'',
																									);
																								}
																							}}
																							placeholder={strings.Select + strings.Type}
																							id="vatId"
																							name="vatId"
																							className={
																								props.errors.vatId &&
																									props.touched.vatId
																									? 'is-invalid'
																									: ''
																							}
																						/>
																					</FormGroup>
																				</Col>
																			)}
																		<Col className='mb-3' lg={3}>
																			<Label htmlFor="inline-radio3"><span className="text-danger">* </span>{strings.ExpenseType}</Label>
																			<div style={{ display: "flex" }}>
																				{this.state.expenseType === false ?
																					<span style={{ color: "#0069d9" }} className='mr-4'><b>{strings.Claimable}</b></span> :
																					<span className='mr-4'>{strings.Claimable}</span>}

																				<Switch
																					checked={this.state.expenseType}
																					
																					onChange={(expenseType) => {
																						if(this.state.initValue.explinationStatusEnum !=='PARTIAL' && this.state.initValue.explinationStatusEnum!=="FULL" && this.state.initValue.explinationStatusEnum!== "RECONCILED")
																						{props.handleChange('expenseType')(expenseType);
																						this.setState({ expenseType, }, () => { },);
																					}
																					}}
																					onColor="#2064d8"
																					onHandleColor="#2693e6"
																					handleDiameter={25}
																					uncheckedIcon={false}
																					checkedIcon={false}
																					boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
																					activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
																					height={20}
																					width={48}
																					className="react-switch "
																				/>

																				{this.state.expenseType === true ?
																					<span style={{ color: "#0069d9" }} className='ml-4'><b>{strings.NonClaimable}</b></span>
																					: <span className='ml-4'>{strings.NonClaimable}</span>
																				}
																			</div>

																		</Col>

																	</Row>
																)}

{props.values.coaCategoryId &&
                              props.values.coaCategoryId.label ===
                              "Expense" && props.values?.vatId===1 && (
                                <Row>
                                  <Col lg={3}>
                                  </Col>
                                  {props.values.expenseCategory &&
                                    props.values.expenseCategory.value &&
                                    props.values.expenseCategory.value == 34 &&
                                    this.getPayrollList(
                                      UnPaidPayrolls_List,
                                      props
                                    )}
                                  {props.values.coaCategoryId &&
                                    props.values.coaCategoryId.label ===
                                    "Expense" &&
                                    props.values.expenseCategory &&
                                    props.values.expenseCategory.value !==
                                    34 && (
                                      <Col lg={3}>
                                         
                                    <div style={{ display: "flex" }}>
                                      {!this.state.exclusiveVat  ? (
                                        <span
                                          style={{ color: "#0069d9" }}
                                          className="mr-4"
                                        >
                                          <b>{strings.InclusiveVAT}</b>
                                        </span>
                                      ) : (
                                        <span className="mr-4">
                                          {strings.InclusiveVAT}
                                        </span>
                                      )}

                                      <Switch
                                        checked={this.state.exclusiveVat}
                                        onChange={(exclusiveVat) => {
											if(this.state.initValue.explinationStatusEnum !=='PARTIAL' && this.state.initValue.explinationStatusEnum!=="FULL" && this.state.initValue.explinationStatusEnum!== "RECONCILED"){
                                          props.handleChange("exclusiveVat")(
                                            exclusiveVat
                                          );
                                          this.setState(
                                            { exclusiveVat },
                                            () => { }
                                          );
										  }
                                          // if (this.state.expenseType == true)
                                          // 	this.setState({ expenseType: true })
                                        }}
                                        onColor="#2064d8"
                                        onHandleColor="#2693e6"
                                        handleDiameter={25}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={48}
                                        className="react-switch"
                                      />

                                      {this.state.exclusiveVat  ? (
                                        <span
                                          style={{ color: "#0069d9" }}
                                          className="ml-4"
                                        >
                                          <b>{strings.ExclusiveVAT}</b>
                                        </span>
                                      ) : (
                                        <span className="ml-4">
                                          {strings.ExclusiveVAT}
                                        </span>
                                      )}
                                    </div>
                                      </Col>
                                    )}
                                  <Col className="mb-6" lg={6}>
                                  
                                  </Col>
                                </Row>
                              )}

<Row>
													{props.values.coaCategoryId && props.values.coaCategoryId?.label ===
                            "Expense" && (<Col>
															
															<Checkbox
																id="isReverseChargeEnabled"
																disabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" ||this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																checked={this.state.isReverseChargeEnabled}
																onChange={(option)=>{
																		this.setState({isReverseChargeEnabled:!this.state.isReverseChargeEnabled,
                                      exclusiveVat:false})
																		// for resetting Vat

																		props.handleChange('vatId')('');
                                    props.handleChange('isReverseChargeEnabled')(!props.values.isReverseChargeEnabled);
																}}
															/>
															<Label>{strings.IsReverseCharge}</Label>
															</Col>)}
															</Row>

															{props.values.coaCategoryId &&
																props.values.coaCategoryId.label ===
																'Supplier Invoice' && (
																	<Row>
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="vendorId">
																					<span className="text-danger">* </span>
																					{strings.Vendor}
																				</Label>
																				<Select
																					styles={customStyles}
																					isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																					options={
																						tmpSupplier_list
																							? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								tmpSupplier_list,
																								'Supplier Name',
																							)
																							: []
																					}
																					onChange={(option) => {
																						if (option && option.value) {

																							props.handleChange('vendorId')(option);
																						} else {

																							props.handleChange('vendorId')('');
																						}
																						this.getSuggestionInvoicesFotVend(
																							option.value,
																							props.values.amount,

																						);
																						props.handleChange('invoiceIdList')([])
																					}}
																					value={
																						(this.state.initValue.explinationStatusEnum ==='PARTIAL' ||  this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED") ?
																						
																						{value:props.values.vendorId,label:this.state?.initValue?.contactName}
																						:
																						tmpSupplier_list &&
																						tmpSupplier_list.find(
																							(option) =>
																								option.value ===
																								+props.values.vendorId,
																						)

																					}
																					placeholder={strings.Select + strings.Type}
																					id="vendorId"
																					name="vendorId"
																					className={
																						props.errors.vendorId &&
																							props.touched.vendorId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																			</FormGroup>
																		</Col>
																		{props.values.coaCategoryId &&
																			props.values.coaCategoryId.label ===
																			'Supplier Invoice' &&
																			props.values.vendorId && (
																				<Col lg={4}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="invoiceIdList">
																							<span className="text-danger">
																								*
																							</span>
																							{strings.Invoice}
																						</Label>
																						<Select
																						isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																							styles={customStyles}
																							isMulti
																							options={
																								supplier_invoice_list_state
																									? supplier_invoice_list_state
																									: []
																							}
																							onChange={(option) => {
																								if (option === null) {
																									this.getSuggestionInvoicesFotVend(
																										props.values.vendorId.value,
																										props.values.amount,
																										option
																									);
																								}
																								props.handleChange(
																									'invoiceIdList',
																								)(option);
																								this.setexchnagedamount(option);
																								if (option != null) {
																									this.getVendorInvoiceCurrency(option[0], props);
																								}
																							}}
																							value={
																								supplier_invoice_list_state &&
																									props.values.invoiceIdList &&
																									supplier_invoice_list_state.find(
																										(option) =>
																											option.value ===
																											+props.values.invoiceIdList.map(
																												(item) => item.id,
																											),
																									)
																									? supplier_invoice_list_state.find(
																										(option) =>
																											option.value ===
																											+props.values.invoiceIdList.map(
																												(item) => item.id,
																											),
																									)
																									: props.values
																										.invoiceIdList
																							}
																							placeholder={strings.Select + strings.Type}
																							id="invoiceIdList"
																							name="invoiceIdList"
																							className={
																								props.errors.invoiceIdList &&
																									props.touched.invoiceIdList
																									? 'is-invalid'
																									: ''
																							}
																						/>
																						{props.errors.invoiceIdList &&
																							props.touched.invoiceIdList && (
																								<div className="invalid-feedback">
																									{props.errors.invoiceIdList}
																								</div>
																							)}
																						{/* {this.state.initValue
																							.invoiceIdList &&
																							this.state.initValue.invoiceIdList.reduce(
																								(totalAmount, invoice) => 
																									totalAmount + invoice.amount,
																								0,
																							) !== props.values.amount && (
																								<div
																									className={
																										this.state.initValue.invoiceIdList.reduce(
																											(totalAmount, invoice) =>
																												parseInt(
																													totalAmount +
																														invoice.amount,
																												),
																											0,
																										) !==
																										parseInt(
																											props.values.amount,
																										)
																											? 'is-invalid'
																											: ''
																									}
																								>
																									<div className="invalid-feedback">
																										Total Invoice Amount Is Not
																										Equal to the Transaction
																										Amount please create invoice
																									</div>
																								</div>
																							)} */}
																					</FormGroup>
																				</Col>
																			)}
																	</Row>
																)}
															<Row>
																{console.log(transactionCategoryList.dataList)}
																{transactionCategoryList.dataList &&
																	props.values.coaCategoryId.value === 2 && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="customerId">
																					<span className="text-danger">* </span>
																					{strings.Customer}
																				</Label>
																				<Select
																					styles={customStyles}
																					options={
																						transactionCategoryList.dataList[0]
																							? transactionCategoryList
																								.dataList[0].options
																							: []
																					}
																					isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' ||  this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange('customerId')(
																								option.value,
																							);
																						} else {
																							props.handleChange('customerId')(
																								'',
																							);
																						}
																						this.getSuggestionInvoicesFotCust(
																							option.value,
																							props.values.amount,
																						);
																					}}
																					value={
																						(this.state.initValue.explinationStatusEnum ==='PARTIAL' ||  this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED") ?
																						
																						{value:props.values.customerId,label:this.state?.initValue?.contactName}
																						:
																						transactionCategoryList
																							.dataList[0] &&
																						transactionCategoryList.dataList[0].options.find(
																							(option) =>
																								option.value ===
																								+props.values.customerId,
																						)
																					}
																					placeholder={strings.Select + strings.Type}
																					id="customerId"
																					name="customerId"
																					className={
																						props.errors.customerId &&
																							props.touched.customerId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.customerId &&
																					props.touched.customerId && (
																						<div className="invalid-feedback">
																							{props.errors.customerId}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																	)}
																{transactionCategoryList.dataList &&
																	props.values.coaCategoryId.value === 2 &&
																	props.values.customerId && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="invoiceIdList">
																					<span className="text-danger">* </span>
																					{strings.Invoice}
																				</Label>
																				<Select
																					styles={customStyles}
																					isDisabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED"}
																					isMulti
																					options={
																						customer_invoice_list_state
																							? customer_invoice_list_state
																							: []
																					}
																					onChange={(option) => {
																						if (option === null) {
																							this.getSuggestionInvoicesFotCust(
																								props.values.vendorId.value,
																								props.values.amount,
																								option
																							);
																						}
								
																						this.setexchnagedamount(option);

																						if (option != null) {
																							this.getInvoiceCurrency(option[0], props);
																						}
																					}}
																					value={

																						customer_invoice_list_state &&
																							props.values.invoiceIdList &&
																							customer_invoice_list_state.find(
																								(option) =>
																									option.value ===
																									+props.values.invoiceIdList.map(
																										(item) => item.id,
																									),
																							)
																							? customer_invoice_list_state.find(
																								(option) =>
																									option.value ===
																									+props.values.invoiceIdList.map(
																										(item) => item.id,
																									),
																							)
																							: props.values.invoiceIdList
																					}
																					placeholder={strings.Select + strings.Type}
																					id="invoiceIdList"
																					name="invoiceIdList"
																					className={
																						props.errors.invoiceIdList &&
																							props.touched.invoiceIdList
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.invoiceIdList &&
																					props.touched.invoiceIdList && (
																						<div className="invalid-feedback">
																							{props.errors.invoiceIdList}
																						</div>
																					)}
																				{/* { this.state.initValue.invoiceIdList &&
																					this.state.initValue.invoiceIdList.reduce(
																						(totalAmount, invoice) =>
																							parseInt(
																								totalAmount + invoice.amount,
																							),
																						0,
																					) !==
																						parseInt(props.values.amount) && (
																						<div
																							className={
																								this.state.initValue.invoiceIdList.reduce(
																									(totalAmount, invoice) =>
																										parseInt(
																											totalAmount +
																												invoice.amount,
																										),
																									0,
																								) !==
																								parseInt(props.values.amount)
																									? 'is-invalid'
																									: ''
																							}
																						>
																							<div className="invalid-feedback">
																								Total Invoice Amount Is Not
																								Equal to the Transaction Amount
																								please create invoice
																							</div>
																						</div>
																					)}  */}
																			</FormGroup>
																		</Col>
																	)}
																{props.values.coaCategoryId &&
																	props.values.coaCategoryId.label !==
																	'Expense' &&
																	props.values.coaCategoryId.label !==
																	'Supplier Invoice' &&
																	props.values.coaCategoryId.label !==
																	'Sales' && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="transactionCategoryId">
																					<span className="text-danger">* </span>
																					{strings.Category}
																				</Label>
																				<Select
																					styles={customStyles}
																					isDisabled={props.values.coaCategoryId.label ==='Transfered From' || props.values.coaCategoryId.label ==='Transfered To'}
																					options={
																						transactionCategoryList
																							? transactionCategoryList.categoriesList
																							: []
																					}
																					value={this.getValueForCategory(transactionCategoryValue)}
																					onChange={(option) => {

																						this.setState({
																							transactionCategoryId: option.value
																						})
																						if (option.label !== 'Salaries and Employee Wages' &&
																							option.label !== 'Owners Drawing' &&
																							option.label !== 'Dividend' &&
																							option.label !== 'Owners Current Account' &&
																							option.label !== 'Share Premium' &&
																							option.label !== 'Employee Advance' &&
																							option.label !== 'Employee Reimbursements' &&
																							option.label !== 'Director Loan Account' &&
																							option.label !== 'Owners Equity'
																						) { }

																						if (option.label === 'Salaries and Employee Wages'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Owners Drawing'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Dividend'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Owners Current Account'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Share Premium'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Employee Advance'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Employee Reimbursements'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Director Loan Account'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																						if (option.label === 'Owners Equity'
																						) {
																							this.getMoneyPaidToUserlist(option);
																						}
																					}}
																					// value={
																					// 	transactionCategoryList &&
																					// 		props.values
																					// 			.transactionCategoryLabel
																					// 		? transactionCategoryList.categoriesList
																					// 			.find(
																					// 				(item) =>
																					// 					item.label ===
																					// 					props.values
																					// 						.transactionCategoryLabel,
																					// 			)
																					// 			.options.find(
																					// 				(item) =>
																					// 					item.value ===
																					// 					+props.values
																					// 						.transactionCategoryId,
																					// 			)
																					// 		: console.log('')
																					// }


																					placeholder={strings.Select + strings.Category}
																					id="transactionCategoryId"
																					name="transactionCategoryId"
																					className={
																						!transactionCategoryValue.label
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{
																					!transactionCategoryValue.label ?
																						'' : (
																							<div className="invalid-feedback">
																								{
																									"Transaction Category is Required"
																								}
																							</div>
																						)}
																			</FormGroup>
																		</Col>
																	)}
																{transactionCategoryList.dataList &&
																	(props.values.coaCategoryId.value === 6 ||
																		props.values.coaCategoryId.value === 12)
																	&&
																	(
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<span className="text-danger">* </span>
																				<Label htmlFor="employeeId">User</Label>
																				<Select
																					styles={customStyles}
																					options={
																						moneyCategoryList ?
																							moneyCategoryList : []
																					}
																					value={
																						moneyCategoryList &&
																						moneyCategoryList.find(
																							(option) =>
																								option.value ===
																								+props.values.employeeId,
																						)
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange('employeeId')(
																								option,
																							);
																						} else {
																							props.handleChange('employeeId')(
																								'',
																							);
																						}
																					}}
																					placeholder={strings.Select + strings.User}
																					id="employeeId"
																					name="employeeId"
																					className={
																						props.errors.employeeId &&
																							props.touched.employeeId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																			</FormGroup>
																		</Col>
																	)}
															</Row>
															{/* {props.values.coaCategoryId &&
																	props.values.coaCategoryId.label ===
																	'Expense' &&  (
																		<Row style={{display: this.state.bankAccountCurrency === this.state.basecurrency.currencyCode ? 'none': ''}}>
																			<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="currencyCode"><span className="text-danger">* </span>
																						{strings.Currency}
																						</Label>
																					<Select
																						styles={customStyles}
																						id="currencyCode"
																						name="currencyCode"
																						options={
																							currency_convert_list
																								? selectCurrencyFactory.renderOptions(
																									'currencyName',
																									'currencyCode',
																									currency_convert_list,
																									'Currency',
																								)
																								: []
																						}
																						isDisabled={true}
																						value={
																							currency_convert_list &&
																							selectCurrencyFactory
																								.renderOptions(
																									'currencyName',
																									'currencyCode',
																									currency_convert_list,
																									'Currency',
																								)
																								.find(
																									(option) =>
																										option.value ===
																										+props.values.currencyCode,
																								)
																						}
																						onChange={(option) => {
																							props.handleChange('currencyCode')(option);
																							this.setExchange(option.value ? option.value : props.values.currencyCode);
																							this.setCurrency(option.value ? option.value : props.values.currencyCode)
																						}}
																						className={
																							props.errors.currencyCode &&
																								props.touched.currencyCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.currencyCode &&
																						props.touched.currencyCode && (
																							<div className="invalid-feedback">
																								{props.errors.currencyCode}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																		</Row>
																	)}
																{props.values.coaCategoryId &&
																	props.values.coaCategoryId.label ===
																	'Expense' && (
																		<Row  style={{display: props.values.exchangeRate === 1 ? 'none' : ''}}>
																			<Col lg={2}>
																				<Input
																					disabled
																					id="1"
																					name="1"
																					value={
																						1}

																				/>
																			</Col>
																			<Col lg={2}>
																				<FormGroup className="mb-3">
																					<div>
																						<Input
																							disabled
																							className="form-control"
																							id="curreancyname"
																							name="curreancyname"
																							value={props.values.curreancyname}
																							onChange={(value) => {
																								props.handleChange('curreancyname')(
																									value,
																								);
																							}}
																						/>
																					</div>
																				</FormGroup>
																			</Col>
																			<FormGroup className="mt-2"><label><b>=</b></label>	</FormGroup>
																			<Col lg={2}>
																				<FormGroup className="mb-3">
																					<div>
																						<Input
																							className="form-control"
																							id="exchangeRate"
																							name="exchangeRate"

																							value={props.values.exchangeRate}
																							onChange={(value) => {
																								props.handleChange('exchangeRate')(
																									value,
																								);
																							}}
																						/>
																					</div>
																				</FormGroup>
																			</Col>

																			<Col lg={2}>
																				<Input
																					disabled
																					id="currencyName"
																					name="currencyName"
																					value={
																						this.state.basecurrency.currencyName}

																				/>
																			</Col>
																		</Row>
																	)} */}
																	  {props.values.coaCategoryId &&
                              (props.values.coaCategoryId.label === "Sales" ||
                                props.values.coaCategoryId.label ===
                                "Supplier Invoice") && (
                                <>
                                  {props.values?.invoiceIdList.length > 0 &&
                                    <Row className="border-bottom mb-3" style={{display:'flex',justifyContent:'space-between'}}>
                                      <Col lg={1}>
                                        <span className="font-weight-bold"> Invoice</span>
                                      </Col>
                                      <Col lg={2}>
                                        <span className="font-weight-bold"> Invoice Date</span>
                                      </Col>
                                      <Col lg={2}>
                                        <span className="font-weight-bold">Invoice Amount</span>
                                      </Col>
									  { this.state?.bankCurrency?.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                      <Col lg={2}>
                                        <FormGroup className="mb-3">
                                          <div>
                                            <span className="font-weight-bold">Currency Rate</span>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                      }
                                       { this.state?.bankCurrency?.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                      <Col lg={2}>
                                        <FormGroup className="mb-3">
                                          <div>
                                            <span className="font-weight-bold">Amount</span>
                                          </div>
                                        </FormGroup>
                                      </Col>
  }
                                      <Col lg={1} >
                                        <FormGroup className="font-weight-bold " style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >

                                          <div>
                                            Partially Paid
                                          </div>
                                        </FormGroup>
                                      </Col>

                                      <Col lg={2}>
                                        <FormGroup className="font-weight-bold">
                                          <div>
                                            <span>Explained Amount</span>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  }
                                  {props.values?.invoiceIdList?.map(
                                    (i, invindex) => {
										
                                      return (
                                        <Row style={{display:'flex',justifyContent:'space-between'}}>
                                           <Col lg={1}>
                                            <span>{i.invoiceNumber}</span>
                                          </Col>
                                          <Col lg={2}>
                                            <Input
                                              disabled
                                              id="1"
                                              name="1"
                                              value={moment(i.invoiceDate).format('DD-MM-YYYY')}
                                            />
                                          </Col>
                                          <Col lg={2}>
                                            <Input
											style={{textAlign:'right'}}
                                              disabled
                                              id="1"
                                              name="1"
                                              value={`${props.values.curreancyname} ${i.convertedInvoiceAmount/i.exchangeRate} `}
                                            />
                                          </Col>
											
                                       { this.state?.bankCurrency?.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
									 <Col lg={2}>
                                            <FormGroup className="mb-3">
                                              <div>
                                                <Input
                                                  className="form-control"
                                                  id="exchangeRate"
												  style={{textAlign:'right'}}
												  disabled={this.state.initValue.explinationStatusEnum ==='PARTIAL' || this.state.initValue.explinationStatusEnum==="FULL" || this.state.initValue.explinationStatusEnum=== "RECONCILED"}

                                                  name="exchangeRate"
                                                  type="number"
                                                  value={
                                                    i.exchangeRate}
                                                  onChange={(value) => {
                                                    let local2 = [...props.values?.invoiceIdList]
                                                    local2[invindex].exchnageRate = value.target.value

                                                    this.setexchnagedamount(local2)
                                                  }}
                                                />
                                              </div>
                                            </FormGroup>
                                          </Col>
									}
                                            { this.state?.bankCurrency?.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                          <Col lg={2}>
                                            <FormGroup className="mb-3">
                                              <div>
                                                <Input
                                                  className="form-control"
                                                  id="exchangeRate"
												  style={{textAlign:'right'}}
                                                  name="exchangeRate"
                                                  disabled
                                                  value={`${this.state.bankCurrency
                                                    ?.bankAccountCurrencyIsoCode} ${i.convertedInvoiceAmount?.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `
                                                  }
                                                  onChange={(value) => {

                                                  }}
                                                />
                                              </div>
                                            </FormGroup>
                                          </Col>
									}
                                          <Col lg={1} >
                                            <FormGroup className="mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                              <div>
                                                <Input
                                                  disabled={props.values?.amount -
                                                    props.values?.invoiceIdList?.reduce(
                                                      (accu, curr, index) =>
                                                        accu +
                                                        (this.state.initValue.explinationStatusEnum !=='PARTIAL' && this.state.initValue.explinationStatusEnum!=="FULL"
														?curr.dueAmount:curr.amount)
														
														* curr.exchangeRate
                                                      ,
                                                      0
                                                    ) >= 0  }
                                                  type="checkbox"

                                                  checked={i.pp !== undefined ? i.pp : false}

                                                  onChange={(e) => {
												
													if(this.state.initValue.explinationStatusEnum !=='PARTIAL' && this.state.initValue.explinationStatusEnum!=="FULL")
                                                    this.onppclick(e.target.checked, invindex)
                                                  }}
                                                />
                                              </div>
                                            </FormGroup>
                                          </Col>

                                          <Col lg={2}>
                                            <FormGroup className="mb-3">
                                              <div>
                                                <Input
                                                  className="form-control"
                                                  id="exchangeRate"
												  style={{textAlign:'right'}}
                                                  name="exchangeRate"
                                                  disabled
                                                  value={`${this.state.bankCurrency
                                                    ?.bankAccountCurrencyIsoCode} ${i.explainedAmount?.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `

                                                  }
                                                  onChange={(value) => {

                                                  }}
                                                />
                                                {i.explainedAmount===0 && <div
                                                style={{color:'red',fontSize:'9px'}}
                                                >Expain Amount Cannot be Zero</div>}
                                              </div>
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )}



									{console.log(props.values?.invoiceIdList)}
                                  {props.values?.invoiceIdList?.length > 0 && (
                                    <>
                                      <Row
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        <Col lg={4}>
                                          <Input
                                            disabled
                                            id="total"
                                            name="total"
											style={{textAlign:'right'}}
                                            value={"Total Explained Amount ="}
                                          />
                                        </Col>
    
                                        <Col lg={2}>
                                          <Input
                                            disabled
                                            id="total"
                                            name="total"
											style={{textAlign:'right'}}
                                            value={`${this.state.bankCurrency
                                                ?.bankAccountCurrencyIsoCode
                                              } ${(props.values?.invoiceIdList?.reduce(
                                              (accu, curr, index) =>
                                                accu +
                                                curr.explainedAmount
                                              ,
                                              0
                                            )).toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                              }  `
                                            }
                                          />
                                        </Col>


                                      </Row>
                                      { ((this.setexcessorshortamount().data!== 0)
                                    && 
                                    this.state?.bankCurrency?.bankAccountCurrencyIsoCode!==props.values.curreancyname 
                                    ) && <Row
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        
                                         { <Col lg={5}>
                                        <Select
                                     options={[{label:'Currency Gain ',value:79},
                                        {label:'Currency Loss',value:103}    
                                      ]}
                                      isDisabled={true}
                                      value={this.setexcessorshortamount().data<0
                                      ?{label:'Currency Loss',value:103}:{label:'Currency Gain ',value:103}
                                      }
                                        />
                                        </Col>}

                                        <Col lg={3}>
                                          <Input
                                            disabled
                                            id="total"
                                            name="total"
                                            value={"Total Excess/Short Amount"}
                                          />
                                        </Col>
                                        <FormGroup className="mt-2">
                                          <label>
                                            <b>=</b>
                                          </label>{" "}
                                        </FormGroup>
                                        <Col lg={2}>
                                          <Input
                                            disabled
                                            id="total"
                                            name="total"
                                            value={this.setexcessorshortamount().value}
                                          />
                                        </Col>
                                      </Row>}
								
									
                                    </>
                                  )}
                                </>
                              )}
									
															{/* {props.values.coaCategoryId &&
																props.values.coaCategoryId.label ===
																'Sales' && (
																	<Row style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }}>
																		<Col lg={2}>
																			<Input
																				disabled
																				id="1"
																				name="1"
																				value={
																					1}

																			/>
																		</Col>
																		<Col lg={2}>
																			<FormGroup className="mb-3">
																				<div>
																					<Input
																						disabled
																						className="form-control"
																						id="curreancyname"
																						name="curreancyname"

																						value={props.values.curreancyname}
																						onChange={(value) => {
																							props.handleChange('curreancyname')(
																								value,
																							);
																						}}
																					/>
																				</div>
																			</FormGroup>
																		</Col>
																		
																		<Col lg={2}>
																			<FormGroup className="mb-3">
																				<div>
																					<Input
																						className="form-control"
																						id="exchangeRate"
																						name="exchangeRate"

																						value={props.values.exchangeRate}
																						onChange={(value) => {
																							props.handleChange('exchangeRate')(
																								value,
																							);
																						}}
																					/>
																				</div>
																			</FormGroup>
																		</Col>
																		<Col lg={2}>
																			<Input
																				disabled
																				id="currencyName"
																				name="currencyName"
																				value={
																					this.state.basecurrency?.currencyName}

																			/>
																		</Col>
																	</Row>
																)}
															
															{props.values.coaCategoryId &&
																props.values.coaCategoryId.label ===
																'Supplier Invoice' &&

																(
																	<Row style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }}>
																		<Col lg={2}>
																			<Input
																				disabled
																				id="1"
																				name="1"
																				value={
																					1}

																			/>
																		</Col>
																		<Col lg={2}>
																			<FormGroup className="mb-3">

																				<div>
																					<Input
																						disabled
																						className="form-control"
																						id="curreancyname"
																						name="curreancyname"
																						value={this.state.supplier_currency_des}
																						onChange={(value) => {
																							props.handleChange('curreancyname')(
																								value,
																							);
																						}}
																					/>
																				</div>
																			</FormGroup>
																		</Col>
																		<FormGroup className="mt-2"><label><b>=</b></label>	</FormGroup>
																		<Col lg={2}>
																			<FormGroup className="mb-3">

																				<div>
																					<Input
																						className="form-control"
																						id="exchangeRate"
																						name="exchangeRate"

																						value={props.values.exchangeRate}
																						onChange={(value) => {
																							props.handleChange('exchangeRate')(
																								value,
																							);
																						}}
																					/>
																				</div>
																			</FormGroup>
																		</Col>

																		<Col lg={2}>
																			<Input
																				disabled
																				id="currencyName"
																				name="currencyName"
																				value={
																					this.state.basecurrency?.currencyName}

																			/>
																		</Col>
																	</Row>
																)} */}
															<Row>
																{props.values.coaCategoryId === 12 ||
																	(props.values.coaCategoryId === 6 && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="employeeId">
																					{strings.User}
																				</Label>
																				<Select
																					styles={customStyles}
																					options={
																						transactionCategoryList.dataList
																							? transactionCategoryList
																								.dataList[0].options
																							: []
																					}
																					value={
																						transactionCategoryList.dataList &&
																						transactionCategoryList.dataList[0].options.find(
																							(option) =>
																								option.value ===
																								+props.values.employeeId,
																						)
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange(
																								'employeeId',
																							)(option);
																						} else {
																							props.handleChange(
																								'employeeId',
																							)('');
																						}
																					}}
																					placeholder={strings.Select + strings.Contact}
																					id="employeeId"
																					name="employeeId"
																					className={
																						props.errors.employeeId &&
																							props.touched.employeeId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																			</FormGroup>
																		</Col>
																	))}
															</Row>
															<Row className='mt-2 mb-2'>
																<Col>
																	{/* <Button onClick={()=>{
																			this.setState({showMore:!this.state.showMore})
																		}} >
																		{this.state.showMore==true ?
																		 (<><i class="fas fa-angle-double-up mr-1"/> Show Less</>)
																		 :
																		(<><i class="fas fa-angle-double-down mr-1"/> Show More</>)}
																		</Button> */}
																	<IconButton
																		style={{ fontSize: "14.1px", color: "#2064d8" }}
																		aria-label="delete"
																		size="medium"
																		onClick={() => this.setState({ showMore: !this.state.showMore })}
																	>
																		{this.state.showMore == true ?
																			(<><ArrowUpwardIcon fontSize="inherit" /> Show Less</>)
																			:
																			(<><ArrowDownwardIcon fontSize="inherit" /> Show More</>)}
																	</IconButton>

																</Col>
															</Row>
															{this.state.showMore == true && (
																<>
																	<Row>
																		<Col lg={8}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="description">
																					{strings.Description}
																				</Label>
																				<Input
																					type="textarea"
																					name="description"
																					id="description"
																					rows="6"
																					placeholder={strings.Description}
																					onChange={(option) => {

																						if (!option.target.value.includes("="))
																							props.handleChange('description')(
																								option,
																							)
																					}
																					}
																					value={props.values.description}
																				/>
																			</FormGroup>
																		</Col>
																	</Row>
																	<Row>
																		<Col lg={4}>
																			<Row>
																				<Col lg={12}>
																					<FormGroup className="mb-3 hideAttachment ">
																						<Field
																							name="attachment"
																							render={({ field, form }) => (
																								<div>
																									<Label>{strings.Attachment}</Label> <br />
																									<Button
																										color="primary"
																										onClick={() => {
																											document
																												.getElementById('fileInput')
																												.click();
																										}}
																										className="btn-square mr-3"
																									>
																										<i className="fa fa-upload"></i>{' '}
																										{strings.upload}
																									</Button>
																									<input
																										id="fileInput"
																										ref={(ref) => {
																											this.uploadFile = ref;
																										}}
																										type="file"
																										style={{ display: 'none' }}
																										onChange={(e) => {
																											this.handleFileChange(
																												e,
																												props,
																											);
																										}}
																									/>
																								</div>
																							)}
																						/>
																						{this.state.fileName && (
																							<div>
																								<i
																									className="fa fa-close"
																									onClick={() =>
																										this.setState({
																											fileName: '',
																										})
																									}
																								></i>{' '}
																								{this.state.fileName}
																							</div>
																						)}
																						{props.errors.attachment &&
																							props.touched.attachment && (
																								<div className="invalid-file">
																									{props.errors.attachment}
																								</div>
																							)}
																					</FormGroup>
																				</Col>
																			</Row>
																			<Row>

																			</Row>
																		</Col>
																	</Row>
																	<Row>
																		<Col lg={4}>
																			<Row>
																				<Col lg={12}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="reference">
																							{strings.ReferenceNumber}
																						</Label>
																						<Input
																							type="text"
																							maxLength="20"
																							id="reference"
																							name="reference"
																							placeholder={strings.ReceiptNumber}
																							onChange={(option) => {
																								if (
																									option.target.value === '' ||
																									this.regExBoth.test(
																										option.target.value,
																									)
																								) {
																									props.handleChange('reference')(
																										option,
																									);
																								}
																							}}
																							value={props.values.reference}
																						/>
																					</FormGroup>
																				</Col>
																			</Row>
																		</Col>
																	</Row>

																</>)
															}

															<Row>
																{this.state.initValue.explinationStatusEnum !==
																	'RECONCILED' && (

																		<Col lg={12} className="mt-5">
																			<FormGroup className="text-left">
																				{this.state.initValue.explinationStatusEnum !==
																					'FULL' && this.state.initValue.explinationStatusEnum !==
																					'PARTIAL' ? (
																					<div>
																						<Button
																							type="button"
																							color="primary"
																							className="btn-square mr-3"
																							onClick={props.handleSubmit}
																						>
																							<i className="fa fa-dot-circle-o"></i>{' '}
																							{strings.Explain}
																						</Button>

																						{this.state.initValue.explinationStatusEnum == + "NOT_EXPLAIN" || this.state.initValue.explinationStatusEnum !== null
																							? (<Button
																								color="secondary"
																								className="btn-square"
																								onClick={() =>
																									this.closeTransaction(
																										this.state.initValue.transactionId,
																									)
																								}
																							>
																								<i className="fa fa-ban"></i> {strings.Delete}
																							</Button>) : ''}
																					</div>
																				) : (
																					<div>
																						<Button
																							type="button"
																							color="primary"
																							className="btn-square mr-3"
																							onClick={() =>
																								this.UnexplainTransaction(
																									this.state.initValue.transactionId,
																								)
																							}
																						>
																							<i className="fa fa-dot-circle-o"></i>{' '}
																							{strings.Unexplain}
																						</Button>
																						{/* {this.state.initValue.explinationStatusEnum !== "PARTIAL"&&	this.state.initValue.explinationStatusEnum !== null
																						&&(
																								<Button
																									color="secondary"
																									className="btn-square"
																									onClick={props.handleSubmit}
																								>
																									<i className="fa fa-dot-circle-o"></i>{' '}
																						{strings.Update}
																					</Button>)} */}
																					</div>
																				)}
																			</FormGroup>
																		</Col>
																	)}
															</Row>
														</Form>
													)}
												</Formik>
											</Col>
										</Row>
									</CardBody>
								</Card>
							)}
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ExplainTrasactionDetail);
