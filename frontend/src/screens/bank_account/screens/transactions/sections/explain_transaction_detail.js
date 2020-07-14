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
import { CommonActions } from 'services/global';
import './style.scss';
import { Loader, ConfirmDeleteModal } from 'components';
import moment from 'moment';
import { selectOptionsFactory, selectCurrencyFactory } from 'utils';
const mapStateToProps = (state) => {
	return {
		customer_invoice_list: state.bank_account.customer_invoice_list,
		vendor_invoice_list: state.bank_account.vendor_invoice_list,
		expense_list: state.bank_account.expense_list,
		expense_categories_list: state.expense.expense_categories_list,
		user_list: state.bank_account.user_list,
		currency_list: state.bank_account.currency_list,
		vendor_list: state.bank_account.vendor_list,
		vat_list: state.bank_account.vat_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		transactionsActions: bindActionCreators(TransactionsActions, dispatch),
		transactionDetailActions: bindActionCreators(
			transactionDetailActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class ExplainTrasactionDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			createMore: false,
			loading: false,
			fileName: '',
			initValue: {},
			view: false,
			chartOfAccountCategoryList: [],
			transactionCategoryList: [],
			id: '',
			dialog: null,
			totalAmount: '',
		};

		this.file_size = 1024000;
		this.supported_format = [
			'',
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
			this.initializeData();
		}
	};

	initializeData = () => {
		const { selectedData } = this.props;
		const { bankId } = this.props;
		this.setState({ loading: true, id: selectedData.id });
		this.props.transactionDetailActions
			.getTransactionDetail(selectedData.id)
			.then((res) => {
				this.getChartOfAccountCategoryList(selectedData.debitCreditFlag);
				this.setState(
					{
						loading: false,
						initValue: {
							bankId: bankId,
							amount: res.data.amount ? res.data.amount : '',
							date: res.data.date
								? moment(res.data.date, 'DD/MM/YYYY').format('DD/MM/YYYY')
								: '',
							description: res.data.description ? res.data.description : '',
							transactionCategoryId: res.data.transactionCategoryId
								? res.data.transactionCategoryId
								: '',
							transactionId: selectedData.id,
							vatId: res.data.vatId ? res.data.vatId : '',
							vendorId: res.data.vatId ? res.data.vendorId : '',
							customerId: res.data.customerId ? res.data.customerId : '',
							explinationStatusEnum: res.data.explinationStatusEnum,
							reference: res.data.reference ? res.data.reference : '',
							coaCategoryId: res.data.coaCategoryId
								? res.data.coaCategoryId
								: '',
							invoiceIdList: res.data.invoiceIdList
								? res.data.invoiceIdList
								: '',
							transactionCategoryLabel: res.data.transactionCategoryLabel,
							invoiceError: '',
							expenseCategory: '',
							currencyCode: '',
						},
					},
					() => {
						if (this.state.initValue.customerId) {
							this.getSuggestionInvoicesFotCust(
								this.state.initValue.customerId,
								this.state.initValue.amount,
							);
						}
						if (this.state.initValue.vendorId) {
							this.getSuggestionInvoicesFotVend(
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
						//console.log(this.state.chartOfAccountCategoryList);
						if (this.props.selectedData.explinationStatusEnum === 'FULL') {
							const id = this.state.chartOfAccountCategoryList[0].options.find(
								(option) => option.value === this.state.initValue.coaCategoryId,
							);
							this.getTransactionCategoryList(id);
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

	getTransactionCategoryList = (type) => {
		this.formRef.current.setFieldValue('coaCategoryId', type, true);
		this.setValue(null);
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
	};
	getSuggestionInvoicesFotCust = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
		};
		this.props.transactionsActions.getCustomerInvoiceList(data);
	};
	getSuggestionInvoicesFotVend = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
		};
		this.props.transactionsActions.getVendorInvoiceList(data);
	};

	// getUserList = () => {
	// 	this.props.transactionsActions.getUserForDropdown();
	// };

	getExpensesCategoriesList = () => {
		this.props.transactionsActions.getExpensesCategoriesList();
		this.props.transactionsActions.getCurrencyList();
		this.props.transactionsActions.getUserForDropdown();
		this.props.transactionsActions.getVatList();
	};

	getVendorList = () => {
		this.props.transactionsActions.getVendorList();
	};

	handleSubmit = (data, resetForm) => {
		if (
			data.invoiceIdList &&
			data.invoiceIdList.reduce(
				(totalAmount, invoice) => totalAmount + invoice.amount,
				0,
			) > data.amount
		) {
			return false;
		} else {
			const {
				bankId,
				date,
				reference,
				description,
				amount,
				coaCategoryId,
				transactionCategoryId,
				vendorId,
				employeeId,
				invoiceIdList,
				customerId,
				vatId,
				currencyCode,
				userId,
				transactionId,
				expenseCategory,
			} = data;
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
			let id;
			if (coaCategoryId && coaCategoryId.value === 100) {
				id = 10;
			} else {
				id = coaCategoryId.value;
			}
			let formData = new FormData();
			formData.append('transactionId', transactionId ? transactionId : '');
			formData.append('bankId ', bankId ? bankId : '');
			formData.append(
				'date',
				typeof date === 'object' ? moment(date).format('DD/MM/YYYY') : date,
			);
			formData.append('description', description ? description : '');
			formData.append('amount', amount ? amount : '');
			formData.append('coaCategoryId', coaCategoryId ? id : '');
			if (transactionCategoryId) {
				formData.append(
					'transactionCategoryId',
					transactionCategoryId ? transactionCategoryId : '',
				);
			}
			if (customerId && coaCategoryId.value === 2) {
				formData.append('customerId', customerId ? customerId : '');
			}
			if (vendorId && coaCategoryId.label === 'Supplier Invoice') {
				formData.append('vendorId', vendorId ? vendorId : '');
			}
			if (currencyCode && coaCategoryId.label === 'Expense') {
				formData.append('currencyCode', currencyCode ? currencyCode : '');
			}
			if (expenseCategory && coaCategoryId.label === 'Expense') {
				formData.append(
					'expenseCategory',
					expenseCategory ? expenseCategory.value : '',
				);
			}
			if (
				(vatId && coaCategoryId.value === 10) ||
				(vatId && coaCategoryId.label === 'Expense')
			) {
				formData.append('vatId', vatId ? vatId.value : '');
			}
			if (employeeId) {
				formData.append('employeeId', employeeId ? employeeId.value : '');
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
			if (this.uploadFile.files[0]) {
				formData.append('attachment', this.uploadFile.files[0]);
			}
			this.props.transactionDetailActions
				.updateTransaction(formData)
				.then((res) => {
					if (res.status === 200) {
						resetForm();
						this.props.commonActions.tostifyAlert(
							'success',
							'Transaction Detail Updated Successfully.',
						);
						//this.props.closeExplainTransactionModal(this.state.id);
						//this.initializeData();
						// this.props.history.push('/admin/banking/bank-account/transaction', {
						//   bankId,
						// });
					}
				})
				.catch((err) => {
					console.log(err);
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
				});
		}
	};

	closeTransaction = (id) => {
		alert();
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					okHandler={() => this.removeTransaction(id)}
					cancelHandler={this.removeDialog}
				/>
			),
		});
	};
	invoiceIdList = (option) => {
		this.setState({
			initValue: {
				...this.state.initValue,
				...{
					invoiceIdList: option,
				},
			},
		});
		this.formRef.current.setFieldValue('invoiceIdList', option, true);
	};
	removeTransaction = (id) => {
		this.props.transactionsActions
			.deleteTransactionById(id)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'Transaction Deleted Successfully',
				);
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

	render() {
		const {
			initValue,
			loading,
			chartOfAccountCategoryList,
			transactionCategoryList,
		} = this.state;
		const {
			customer_invoice_list,
			vendor_invoice_list,
			expense_categories_list,
			currency_list,
			vendor_list,
			vat_list,
		} = this.props;
		return (
			<div className="detail-bank-transaction-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
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
														Explain Transaction {this.state.id}
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
													validationSchema={Yup.object().shape({
														date: Yup.string().required(
															'Transaction Date is Required',
														),
														amount: Yup.string().required(
															'Transaction Amount is Required',
														),
														coaCategoryId: Yup.object().required(
															'Transaction Type is Required',
														),
														invoiceIdList: Yup.string().when('coaCategoryId', {
															is: (item) =>
																item.label === 'Supplier Invoice' ||
																item.label === 'Sales',
															then: Yup.string().required(
																'Invoice Is Required',
															),
														}),
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
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="chartOfAccountId">
																			<span className="text-danger">*</span>
																			Transaction Type
																		</Label>
																		<Select
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
																			}}
																			placeholder="Select Type"
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
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="amount">
																			<span className="text-danger">*</span>
																			Amount
																		</Label>
																		<Input
																			type="text"
																			id="amount"
																			name="amount"
																			readOnly
																			placeholder="Amount"
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regEx.test(option.target.value)
																				) {
																					props.handleChange('amount')(option);
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
																					<span className="text-danger">*</span>
																					Expense Category
																				</Label>
																				<Select
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
																					// value={props.values.expenseCategory}
																					onChange={(option) => {
																						props.handleChange(
																							'expenseCategory',
																						)(option);
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
																		{props.values.coaCategoryId &&
																			props.values.coaCategoryId.label ===
																				'Expense' && (
																				<Col lg={3}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="vatId">Vat</Label>
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
																							// value={
																							// 	transactionCategoryList.dataList
																							// 		? transactionCategoryList.dataList[0].options.find(
																							// 				(option) =>
																							// 					option.value ===
																							// 					+props.values.vatId,
																							// 		  )
																							// 		: []
																							// }
																							onChange={(option) => {
																								if (option && option.value) {
																									props.handleChange('vatId')(
																										option,
																									);
																								} else {
																									props.handleChange('vatId')(
																										'',
																									);
																								}
																							}}
																							placeholder="Select Type"
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
																		{props.values.coaCategoryId &&
																			props.values.coaCategoryId.label ===
																				'Expense' && (
																				<Col lg={3}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="currencyCode">
																							Currency
																						</Label>
																						<Select
																							id="currencyCode"
																							name="currencyCode"
																							options={
																								currency_list
																									? selectCurrencyFactory.renderOptions(
																											'currencyName',
																											'currencyCode',
																											currency_list,
																											'Currency',
																									  )
																									: []
																							}
																							value={
																								currency_list &&
																								selectCurrencyFactory
																									.renderOptions(
																										'currencyName',
																										'currencyCode',
																										currency_list,
																										'Currency',
																									)
																									.find(
																										(option) =>
																											option.value ===
																											+props.values.currency,
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
																			)}
																	</Row>
																)}
															{props.values.coaCategoryId &&
																props.values.coaCategoryId.label ===
																	'Supplier Invoice' && (
																	<Row>
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="vendorId">
																					<span className="text-danger">*</span>
																					Vendor
																				</Label>
																				<Select
																					options={
																						vendor_list ? vendor_list : []
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange('vendorId')(
																								option.value,
																							);
																						} else {
																							props.handleChange('vendorId')(
																								'',
																							);
																						}
																						this.getSuggestionInvoicesFotVend(
																							option.value,
																							props.values.amount,
																						);
																					}}
																					placeholder="Select Type"
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
																							Invoice
																						</Label>
																						<Select
																							isMulti
																							options={
																								vendor_invoice_list
																									? vendor_invoice_list.data
																									: []
																							}
																							onChange={(option) => {
																								props.handleChange(
																									'invoiceIdList',
																								)(option);
																								this.invoiceIdList(option);
																							}}
																							placeholder="Select Type"
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
																						{this.state.initValue
																							.invoiceIdList &&
																							this.state.initValue.invoiceIdList.reduce(
																								(totalAmount, invoice) =>
																									totalAmount + invoice.amount,
																								0,
																							) >
																								this.state.initValue.amount && (
																								<div
																									className={
																										this.state.initValue.invoiceIdList.reduce(
																											(totalAmount, invoice) =>
																												totalAmount +
																												invoice.amount,
																											0,
																										) >
																										this.state.initValue.amount
																											? 'is-invalid'
																											: ''
																									}
																								>
																									<div className="invalid-feedback">
																										Total Invoice Amount Is More
																										Than The Transaction Amount
																									</div>
																								</div>
																							)}
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
																					<span className="text-danger">*</span>
																					Customer
																				</Label>
																				<Select
																					options={
																						transactionCategoryList.dataList[0]
																							? transactionCategoryList
																									.dataList[0].options
																							: []
																					}
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
																					placeholder="Select Type"
																					id="customerId"
																					name="customerId"
																					className={
																						props.errors.customerId &&
																						props.touched.customerId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																			</FormGroup>
																		</Col>
																	)}
																{transactionCategoryList.dataList &&
																	props.values.coaCategoryId.value === 2 &&
																	props.values.customerId && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="invoiceIdList">
																					Invoice
																				</Label>
																				<Select
																					isMulti
																					options={
																						customer_invoice_list
																							? customer_invoice_list.data
																							: []
																					}
																					onChange={(option) => {
																						props.handleChange('invoiceIdList')(
																							option,
																						);
																					}}
																					placeholder="Select Type"
																					id="invoiceIdList"
																					name="invoiceIdList"
																					className={
																						props.errors.invoiceIdList &&
																						props.touched.invoiceIdList
																							? 'is-invalid'
																							: ''
																					}
																				/>
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
																					Category
																				</Label>
																				<Select
																					options={
																						transactionCategoryList
																							? transactionCategoryList.categoriesList
																							: []
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange(
																								'transactionCategoryId',
																							)(option.value);
																						} else {
																							props.handleChange(
																								'transactionCategoryId',
																							)('');
																						}
																					}}
																					placeholder="Select Category"
																					id="transactionCategoryId"
																					name="transactionCategoryId"
																					className={
																						props.errors
																							.transactionCategoryId &&
																						props.touched.transactionCategoryId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																			</FormGroup>
																		</Col>
																	)}
																{props.values.coaCategoryId &&
																	props.values.coaCategoryId.value === 12 && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="employeeId">User</Label>
																				<Select
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
																							props.handleChange('employeeId')(
																								option,
																							);
																						} else {
																							props.handleChange('employeeId')(
																								'',
																							);
																						}
																					}}
																					placeholder="Select Type"
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
															<Row>
																<Col lg={8}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="description">
																			Description
																		</Label>
																		<Input
																			type="textarea"
																			name="description"
																			id="description"
																			rows="6"
																			placeholder="Description..."
																			onChange={(option) =>
																				props.handleChange('description')(
																					option,
																				)
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
																							<Label>Reciept Attachment</Label>{' '}
																							<br />
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
																								Upload
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
																							{this.state.fileName}
																						</div>
																					)}
																				/>
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
																		<Col lg={12}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="date">
																					<span className="text-danger">*</span>
																					Transaction Date
																				</Label>
																				<DatePicker
																					id="date"
																					name="date"
																					placeholderText="Transaction Date"
																					showMonthDropdown
																					showYearDropdown
																					dateFormat="dd/MM/yyyy"
																					dropdownMode="select"
																					value={
																						props.values.date
																							? moment(
																									props.values.date,
																									'DD/MM/YYYY',
																							  ).format('DD/MM/YYYY')
																							: ''
																					}
																					//selected={props.values.date}
																					onChange={(value) =>
																						props.handleChange('date')(value)
																					}
																					className={`form-control ${
																						props.errors.date &&
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
																	</Row>
																</Col>
															</Row>
															<Row>
																<Col lg={4}>
																	<Row>
																		<Col lg={12}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="reference">
																					Reference Number
																				</Label>
																				<Input
																					type="text"
																					id="reference"
																					name="reference"
																					placeholder="Reference Number"
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
															{transactionCategoryList.dataList && (
																<Row>
																	{props.values.coaCategoryId === 12 ||
																		(props.values.coaCategoryId === 6 && (
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="employeeId">
																						User
																					</Label>
																					<Select
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
																						placeholder="Select Type"
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
															)}

															<Row>
																<Col lg={12} className="mt-5">
																	<FormGroup className="text-left">
																		<Button
																			type="button"
																			color="primary"
																			className="btn-square mr-3"
																			onClick={props.handleSubmit}
																		>
																			<i className="fa fa-dot-circle-o"></i>{' '}
																			Explain
																		</Button>
																		<Button
																			color="secondary"
																			className="btn-square"
																			onClick={() =>
																				this.removeTransaction(
																					props.values.transactionId,
																				)
																			}
																		>
																			<i className="fa fa-ban"></i> Delete
																		</Button>
																	</FormGroup>
																</Col>
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
