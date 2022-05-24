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
import {data}  from '../../../../Language/index'
import LocalizedStrings from 'react-localization';
import Switch from "react-switch";
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
const mapStateToProps = (state) => {
	return {
		expense_list: state.bank_account.expense_list,
		expense_categories_list: state.expense.expense_categories_list,
		user_list: state.bank_account.user_list,
		currency_list: state.bank_account.currency_list,
		vendor_list: state.bank_account.vendor_list,
		vat_list: state.bank_account.vat_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
		UnPaidPayrolls_List:state.bank_account.UnPaidPayrolls_List
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
			moneyCategoryList:[],
			count:0,
			payrollListIds:'',
			expenseType:true,
			showMore:false,
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
		const { selectedData } = this.props;
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
						bankAccountCurrency: res.bankAccountCurrency,
					});
				})
				.catch((err) => {
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
					this.props.history.push('/admin/banking/bank-account');
				});
		this.props.transactionDetailActions
			.getTransactionDetail(selectedData.id)
			.then((res) => {
				this.getChartOfAccountCategoryList(selectedData.debitCreditFlag);
				this.setState(
					{
						loading: false,
						creationMode: this.props.creationMode,
						initValue: {
							bankId: bankId,
							amount: res.data.amount ? res.data.amount : '',
							dueAmount:res.data.dueAmount ? res.data.dueAmount : '',
							date: res.data.date
								? res.data.date
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
							reference: res.data.reference ? res.data.reference : '',
							exchangeRate: res.data.exchangeRate ? res.data.exchangeRate : '',
							//currencyName: res.data.currencyName ? res.data.currencyName : '',
							coaCategoryId: res.data.coaCategoryId
								? parseInt(res.data.coaCategoryId)
								: '',
							explainParamList: res.data.explainParamList
								? res.data.explainParamList
								: [],
							transactionCategoryLabel: res.data.transactionCategoryLabel
								? res.data.transactionCategoryLabel
								: '',
							invoiceError: '',
							expenseCategory: res.data.expenseCategory,
							currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
							payrollListIds:res.data.payrollDropdownList?res.data.payrollDropdownList:[],
							expenseType: res.data.expenseType ? true : false,
						},
						unexplainValue: {
							bankId: bankId,
							amount: res.data.amount ? res.data.amount : '',
							date: res.data.date
								? res.data.date
								: '',
							description: res.data.description ? res.data.description : '',
							transactionCategoryId: res.data.transactionCategoryId
								? parseInt(res.data.transactionCategoryId)
								: '',
							transactionId: selectedData.id,
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
						date: res.data.date
								? res.data.date
								: '',
						amount: res.data.amount ? res.data.amount : '',
						currencySymbol:res.data.curruncySymbol?res.data.curruncySymbol: '',
						expenseType: res.data.expenseType ? true : false,
						transactionCategoryLabel:res.data.transactionCategoryLabel,
						transactionCategoryId:res.data.transactionCategoryId,
						currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
					},
					
					() => {
						
						if(selectedData.debitCreditFlag=== 'D'){
							this.getCurrency(this.state.initValue.vendorId)
							 this.setCurrency(this.state.currencyCode)
						}else{
							this.getCurrency(this.state.initValue.customerId)	
							this.setCurrency(this.state.currencyCode)
						}
						if (
							
							this.state.initValue.coaCategoryId === 10 &&
							Object.keys(this.state.initValue.explainParamList).length !== 0
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
						if (this.state.initValue.customerId) {
							this.getCustomerExplainedInvoiceList(
								this.state.initValue.customerId,
								this.state.initValue.amount,
							);
						}
						if (this.state.initValue.vendorId) {
							this.getVendorExplainedInvoiceList(
								this.state.initValue.vendorId,
								this.state.initValue.amount,
							);
						}
					},
				);
			})
			.catch((err) => {
				console.log(err);
			});
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
							this.props.selectedData.explinationStatusEnum === 'RECONCILED'||
							this.props.selectedData.explinationStatusEnum === 'PARTIAL'
						) {
							const id = this.state.chartOfAccountCategoryList[0].options.find(
								(option) => option.value === this.state.initValue.coaCategoryId,
							);
							this.getTransactionCategoryList(id);
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
		this.setState((prevState) => ({
			...prevState,
			transactionCategoryList: [],
		}));
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
		if(result[0] && result[0].currencyName){
		this.formRef.current.setFieldValue('curreancyname', result[0].currencyName, true);
	}
	};


	getTransactionCategoryList = (type) => {
		this.formRef.current.setFieldValue('coaCategoryId', type, true);
		this.setValue(null);
		if (type.value === 100) {
			this.getVendorList();
		} else {
			this.props.transactionsActions
				.getTransactionCategoryListForExplain(
					type.value ,
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
	getSuggestionInvoicesFotCust = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions.getCustomerInvoiceList(data).then((res) => {
			this.setState({
				customer_invoice_list_state: res.data,
			});
		});
	};

	getCustomerExplainedInvoiceList = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions
			.getCustomerExplainedInvoiceList(data)
			.then((res) => {
				this.setState({
					customer_invoice_list_state: res.data,
				});
				this.getSuggestionInvoicesFotCust(option,amount)
			});
	};

	getVendorExplainedInvoiceList = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions
			.getVendorExplainedInvoiceList(data)
			.then((res) => {
				this.setState({
					supplier_invoice_list_state: res.data,
				});
				this.getSuggestionInvoicesFotVend(option,amount)
			});
	};

	getSuggestionInvoicesFotVend = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
			bankId: this.props.bankId,
		};
		this.props.transactionsActions.getVendorInvoiceList(data).then((res) => {
			this.setState({
				supplier_invoice_list_state: res.data,
			});
		});
	};

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
							() => {},
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
		formData.append('expenseType',  this.state.expenseType);
		formData.append('transactionId', transactionId ? transactionId : '');
		formData.append('bankId ', bankId ? bankId : '');
		formData.append(
			'date',
			this.state.date
			? moment(this.state.date)
			: date,
		);
		formData.append(
			'exchangeRate',
			exchangeRate !== null ? exchangeRate : '',
		);
		formData.append('description', description ? description : '');
		formData.append('amount', amount ? amount : '');
		formData.append('dueAmount', dueAmount ? dueAmount : 0);
		formData.append('coaCategoryId', coaCategoryId ? id : '');
		if (this.state.transactionCategoryId ) {
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
		}else 
		{
			if(currencyCode){
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
		
		if (employeeId !== null && employeeId.value !== undefined) {
			formData.append('employeeId', employeeId ? employeeId.value : '');
		}else if(employeeId !== null){
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
		formData.append('reference', reference ? reference : '');
		if (this.uploadFile && this.uploadFile.files && this.uploadFile.files[0]) {
			formData.append('attachment', this.uploadFile.files[0]);
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
	 getPayrollList=(UnPaidPayrolls_List,props)=>{   
		return(<Col lg={3}>
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
				 }}/>
		   </FormGroup>
		</Col>);
	 }
	UnexplainTransaction = (id) => {
		let formData = new FormData();
		for (var key in this.state.unexplainValue) {
			formData.append(key, this.state.unexplainValue[key]);
			formData.set('date',moment(this.state.unexplainValue['date']));
			if (
				Object.keys(this.state.unexplainValue['explainParamList']).length > 0
			) {
				formData.delete('explainParamList');
				formData.set(
					'explainParamListStr',
					JSON.stringify(this.state.unexplainValue['explainParamList']),
				);
			} else {
				formData.delete('explainParamList');
			}
		}
		this.props.transactionDetailActions
			.UnexplainTransaction(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Transaction Detail Updated Successfully.',
					);
					this.props.closeExplainTransactionModal(this.state.id);
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
			if(item.label.contactId == opt) {
				this.setState({
					supplier_currency: item.label.currency.currencyCode,
					supplier_currency_des: item.label.currency.currencyName
				});

				supplier_currencyCode = item.label.currency.currencyCode;
			}
		})

		console.log('supplier_currencyCode' ,supplier_currencyCode)

		if(supplier_currencyCode !=0){
			return supplier_currencyCode;
		}else{
			return this.state.unexplainValue && this.state.unexplainValue.currencyCode ? this.state.unexplainValue.currencyCode :0;
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
 getValueForCategory=(option)=>{
	
	if (option && option.label === 'Salaries and Employee Wages' && this.state.count===0) {

		this.getMoneyPaidToUserlist(option);		this.setState({count:1})
	}
	if (option && option.label === 'Owners Drawing' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Dividend' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Owners Current Account' && this.state.count===0 
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Share Premium' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Employee Advance' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Employee Reimbursements' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Director Loan Account' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
																							}
																							if (option && option.label === 'Owners Equity' && this.state.count===0
																							) {
																								this.getMoneyPaidToUserlist(option);this.setState({count:1})
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
			let obj = {label: item.label.contactName, value: item.value}
			tmpSupplier_list.push(obj)
		})

		let transactionCategoryValue = {
			label:'Select Category'
		} 


		if(this.state.transactionCategoryList && this.state.transactionCategoryList.categoriesList) {

			let allCategories = [];

			this.state.transactionCategoryList.categoriesList.forEach((cat)=>{

				if(cat.options && Array.isArray(cat.options)) {
					cat.options.forEach((opt)=>{

						allCategories.push(opt)

					})
				}
			});


			if(this.state.transactionCategoryId) {
				let labelObj = allCategories.find((ac)=>{
					return ac.value == this.state.transactionCategoryId
				})

				if(labelObj) {
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
															 strings.Explain+" "+strings.Transaction+" "+strings.For+" "+strings.WithdrawalAmount+" "+this.state.currencySymbol+" "+this.state.amount :
															 strings.Explain+" "+strings.Transaction+" "+strings.For+" "+strings.DepositAmount+" "+this.state.currencySymbol+" "+this.state.amount
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
														initialValues={initValue}
														ref={this.formRef}
														onSubmit={(values, { resetForm }) => {
															this.handleSubmit(values, resetForm);
														}}
														validate={(values) => {
															let errors = {};
															if (
																(values.coaCategoryId.label ===
																	'Supplier Invoice' ||
																	values.coaCategoryId.label === 'Sales') &&
																!values.invoiceIdList
															) {
																errors.invoiceIdList = 'Invoice is  required';
															}
															if (
																values.coaCategoryId.label === 'Sales' &&
																!values.customerId
															) {
																errors.customerId = 'Customer is  required';
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
															if(
																(values.coaCategoryId.value === 12 ||
																values.coaCategoryId.value === 6) &&
																!values.employeeId
															){
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
																<Row>
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="chartOfAccountId">
																				<span className="text-danger">* </span>
																			     {strings.TransactionType}
																		</Label>
																			<Select
																				styles={customStyles}
																				options={
																					chartOfAccountCategoryList
																						? chartOfAccountCategoryList
																						: ''
																				}
																				value={
																					chartOfAccountCategoryList[0] &&
																					chartOfAccountCategoryList[0].options.find(
																						(option) =>
																							option.value ===
																							+props.values.coaCategoryId.value,
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
																					this.setValue(null);
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
																		
																			{props.values.expenseCategory  && props.values.expenseCategory==34 &&
																				(
																				this.getPayrollList(UnPaidPayrolls_List,props)
																				)}
																			{props.values.coaCategoryId &&
																				props.values.coaCategoryId.label ===
																				'Expense' &&  props.values.expenseCategory !==34 &&(
																					<Col lg={3}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="vatId">{strings.VAT}</Label>
																							<Select
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
																								placeholder={strings.Select+strings.Type}
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
															<div style={{display:"flex"}}>
																{this.state.expenseType === false ?
																	<span style={{ color: "#0069d9" }} className='mr-4'><b>{strings.Claimable}</b></span> :
																	<span className='mr-4'>{strings.Claimable}</span>}

																<Switch
																	checked={this.state.expenseType}
																	onChange={(expenseType) => {
																		props.handleChange('expenseType')(expenseType);
																		this.setState({ expenseType, }, () => { },);
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
																								this.formRef.current.setFieldValue('currencyCode', this.getCurrency(option.value), true);
																								this.setExchange( this.getCurrency(option.value) );
																								props.handleChange('vendorId')(option);
																							} else {
				
																								props.handleChange('vendorId')('');
																							}
																							this.getSuggestionInvoicesFotVend(
																								option.value,
																								props.values.amount,
																							);
																						}}
																						value={
																							tmpSupplier_list &&
																							tmpSupplier_list.find(
																								(option) =>
																									option.value ===
																									+props.values.vendorId,
																							)
																							
																						}
																						placeholder={strings.Select+strings.Type}
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
																								styles={customStyles}
																								isMulti
																								options={
																									supplier_invoice_list_state
																										? supplier_invoice_list_state
																										: []
																								}
																								onChange={(option) => {
																									props.handleChange(
																										'explainParamList',
																									)(option);
																									this.invoiceIdList(option);
																								}}
																								value={
																									supplier_invoice_list_state &&
																										props.values.explainParamList &&
																										supplier_invoice_list_state.find(
																											(option) =>
																												option.value ===
																												+props.values.explainParamList.map(
																													(item) => item.id,
																												),
																										)
																										? supplier_invoice_list_state.find(
																											(option) =>
																												option.value ===
																												+props.values.explainParamList.map(
																													(item) => item.id,
																												),
																										)
																										: props.values
																											.explainParamList
																								}
																								placeholder={strings.Select+strings.Type}
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
																						onChange={(option) => {
																							if (option && option.value) {
																								this.formRef.current.setFieldValue('currencyCode', this.getCurrency(option.value), true);
																								 
																								this.setExchange( this.getCurrency(option.value) );
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
																							transactionCategoryList
																								.dataList[0] &&
																							transactionCategoryList.dataList[0].options.find(
																								(option) =>
																									option.value ===
																									+props.values.customerId,
																							)
																						}
																						placeholder={strings.Select+strings.Type}
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
																						isMulti
																						options={
																							customer_invoice_list_state
																								? customer_invoice_list_state
																								:[]
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'explainParamList',
																							)(option);
																							this.invoiceIdList(option);
																						}}
																						value={
																							customer_invoice_list_state &&
																								props.values.explainParamList &&
																								customer_invoice_list_state.find(
																									(option) =>
																										option.value ===
																										+props.values.explainParamList.map(
																											(item) => item.id,
																										),
																								)
																								? customer_invoice_list_state.find(
																									(option) =>
																										option.value ===
																										+props.values.explainParamList.map(
																											(item) => item.id,
																										),
																								)
																								: props.values.explainParamList
																						}
																						placeholder={strings.Select+strings.Type}
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
																						options={
																							transactionCategoryList
																								? transactionCategoryList.categoriesList
																								: []
																						}
																						value={this.getValueForCategory(transactionCategoryValue)}
																						onChange={(option) => {
																						
																							this.setState({
																								transactionCategoryId:option.value
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
																							) {	}
																						
																							if ( option.label === 'Salaries and Employee Wages' 
																							) {
																								this.getMoneyPaidToUserlist(option);
																							}
																							if ( option.label === 'Owners Drawing' 
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
																							if ( option.label === 'Share Premium'
																							) {
																								this.getMoneyPaidToUserlist(option);
																							}
																							if ( option.label === 'Employee Advance'
																							) {
																								this.getMoneyPaidToUserlist(option);
																							}
																							if (option.label === 'Employee Reimbursements'
																							) {
																								this.getMoneyPaidToUserlist(option);
																							}
																							if ( option.label === 'Director Loan Account'
																							) {
																								this.getMoneyPaidToUserlist(option);
																							}
																							if ( option.label === 'Owners Equity' 
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
																					
																						
																						placeholder={strings.Select+strings.Category}
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
																					''	: (
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
																						placeholder={strings.Select+strings.User}
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
																{props.values.coaCategoryId &&
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
																	)}
																{props.values.coaCategoryId &&
																	props.values.coaCategoryId.label ===
																	'Sales' && 
																
																	(
																		<Row style={{display: this.state.bankAccountCurrency === this.state.basecurrency.currencyCode ? 'none': ''}}>
																			<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="currencyCode">
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
																							if (option && option.value) {
																								props.handleChange(
																									'currencyCode',
																								)(option.value);
																							} else {
																								props.handleChange(
																									'currencyCode',
																								)('');
																							}
																							this.setExchange(option.value);
																							this.setCurrency(option.value)
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
																	'Sales' && (
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
																	)}
																{props.values.coaCategoryId &&
																	props.values.coaCategoryId.label ===
																	'Supplier Invoice' &&
																	(
																		<Row style={{display: this.state.bankAccountCurrency === this.state.basecurrency.currencyCode ? 'none': ''}}>
																			<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="currencyCode">
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
																										 +this.state.supplier_currency,
																								)
																						}
																						isDisabled={true}
																						onChange={(option) => {
																							props.handleChange('currencyCode')(option);
																							this.setExchange(option.value);
																							this.setCurrency(option.value)
																						   }}
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
																	'Supplier Invoice' && 
																
																(
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
																					{/* <Label htmlFor="exchangeRate">
																		Exchange rate
																	</Label> */}
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
																					{/* <Label htmlFor="exchangeRate">
																		Exchange rate
																	</Label> */}
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
																	)}
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
																							placeholder={strings.Select+strings.Contact}
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
																	style={{    fontSize: "14.1px",color: "#2064d8"}}
																			aria-label="delete"
																			size="medium" 
																			onClick={()=>this.setState({showMore:!this.state.showMore})}
																	>
																		{this.state.showMore==true ?
																		 (<><ArrowUpwardIcon fontSize="inherit" /> Show Less</>)
																		 :
																		(<><ArrowDownwardIcon fontSize="inherit" /> Show More</>)}
																	</IconButton>
																	
																		</Col>
																	</Row>
														{this.state.showMore==true&&(
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
																				onChange={(option) =>{
																					
																					if(!option.target.value.includes("="))
																					props.handleChange('description')(
																						option,
																					)}
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
																				<FormGroup className="mb-3">
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
																	{props.values.explinationStatusEnum !==
																		'RECONCILED' && (
																			<Col lg={12} className="mt-5">
																				<FormGroup className="text-left">
																					{props.values.explinationStatusEnum !==
																						'FULL' && props.values.explinationStatusEnum !==
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
																						{props.values.explinationStatusEnum !== "PARTIAL"&&	(<Button
																									color="secondary"
																									className="btn-square"
																									onClick={() =>
																										this.closeTransaction(
																											props.values.transactionId,
																										)
																									}
																								>
																									<i className="fa fa-ban"></i> {strings.Delete}
																					</Button>)}
																							</div>
																						) : (
																							<div>
																								<Button
																									type="button"
																									color="primary"
																									className="btn-square mr-3"
																									onClick={() =>
																										this.UnexplainTransaction(
																											props.values.transactionId,
																										)
																									}
																								>
																									<i className="fa fa-dot-circle-o"></i>{' '}
																						          {strings.Unexplain}
																					</Button>
																								<Button
																									color="secondary"
																									className="btn-square"
																									onClick={props.handleSubmit}
																								>
																									<i className="fa fa-dot-circle-o"></i>{' '}
																						{strings.Update}
																					</Button>
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
