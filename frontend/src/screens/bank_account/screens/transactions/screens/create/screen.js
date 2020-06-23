import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { CommonActions } from 'services/global';

import moment from 'moment';

import * as transactionCreateActions from './actions';
import * as transactionActions from '../../actions';

import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import { selectOptionsFactory, selectCurrencyFactory } from 'utils';
const mapStateToProps = (state) => {
	return {
		transaction_category_list: state.bank_account.transaction_category_list,
		transaction_type_list: state.bank_account.transaction_type_list,
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
		transactionActions: bindActionCreators(transactionActions, dispatch),
		transactionCreateActions: bindActionCreators(
			transactionCreateActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class CreateBankTransaction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			createMore: false,
			fileName: '',
			initValue: {
				transactionId: '',
				bankAccountId: '',
				transactionDate: '',
				description: '',
				transactionAmount: '',
				coaCategoryId: '',
				transactionCategoryId: '',
				projectId: '',
				reference: '',
				attachementDescription: '',
				attachment: '',
				customerId: '',
				invoiceIdList: '',
				vatId: '',
				vendorId: '',
				employeeId: '',
			},
			transactionCategoryList: [],
			totalAmount: '',
			categoriesList: [
				{
					label: 'Money Spent',
					options: [
						{
							value: 11,
							label: 'Transfered To',
						},
						{
							value: 12,
							label: 'Money Paid To User',
						},
						{
							value: 13,
							label: 'Purchase Of Capital Asset',
						},
						{
							value: 14,
							label: 'Money Spent Others"',
						},
						{
							value: 10,
							label: 'Create Expense',
						},
						// {
						// 	value: 100,
						// 	label: 'Supplier Invoice',
						// },
					],
				},
				{
					label: 'Money Received',
					options: [
						// {
						// 	value: 2,
						// 	label: 'Sales',
						// },
						{
							value: 3,
							label: 'Transfered From',
						},
						{
							value: 4,
							label: 'Refund Received',
						},
						{
							value: 5,
							label: 'Interest Received',
						},
						{
							value: 6,
							label: 'Money Received From User',
						},
						{
							value: 7,
							label: 'Disposal Of Capital Asset',
						},
						{
							value: 8,
							label: 'Money Received Others',
						},
					],
				},
			],
			cat_label: '',
			id: '',
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
		this.initializeData();
	};

	initializeData = () => {
		console.log(this.props.location.state.bankAccountId);
		if (this.props.location.state && this.props.location.state.bankAccountId) {
			this.setState(
				{
					id: this.props.location.state.bankAccountId,
				},
				() => {
					console.log(this.state.id);
				},
			);
			// this.props.transactionActions.getTransactionCategoryList();
			// this.props.transactionActions.getTransactionTypeList();
			// this.props.transactionActions.getProjectList();
		}
	};

	handleFileChange = (e, props) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		if (file) {
			reader.onloadend = () => {};
			reader.readAsDataURL(file);
			props.setFieldValue('attachment', file, true);
		}
	};

	handleSubmit = (data, resetForm) => {
		let bankAccountId =
			this.props.location.state && this.props.location.state.bankAccountId
				? this.props.location.state.bankAccountId
				: '';
		const {
			transactionDate,
			description,
			transactionAmount,
			coaCategoryId,
			transactionCategoryId,
			invoiceIdList,
			reference,
			customerId,
			vatId,
			vendorId,
			employeeId,
			expenseCategory,
			currencyCode,
			userId,
		} = data;
		if (
			invoiceIdList &&
			coaCategoryId.value &&
			coaCategoryId.label === 'Sales'
		) {
			var result = invoiceIdList.map((o) => ({
				invoiceId: o.value,
				remainingInvoiceAmount: 0,
			}));
			console.log(result);
		}
		let formData = new FormData();
		formData.append('bankId ', bankAccountId ? bankAccountId : '');
		formData.append(
			'date',
			transactionDate ? moment(transactionDate).format('DD/MM/YYYY') : '',
		);
		formData.append('description', description ? description : '');
		formData.append('amount', transactionAmount ? transactionAmount : '');
		formData.append('coaCategoryId', coaCategoryId ? coaCategoryId.value : '');
		if (transactionCategoryId) {
			formData.append(
				'transactionCategoryId',
				transactionCategoryId ? transactionCategoryId.value : '',
			);
		}
		if (expenseCategory && coaCategoryId.label === 'Create Expense') {
			formData.append(
				'expenseCategory',
				expenseCategory ? expenseCategory.value : '',
			);
		}
		if (
			(vatId && coaCategoryId.value === 10) ||
			(vatId && coaCategoryId.label === 'Create Expense')
		) {
			formData.append('vatId', vatId ? vatId.value : '');
		}
		if (userId && coaCategoryId.label === 'Create Expense') {
			formData.append('userId', userId ? userId.value : '');
		}
		if (currencyCode && coaCategoryId.label === 'Create Expense') {
			formData.append('currencyCode', currencyCode ? currencyCode : '');
		}
		if (
			(customerId &&
				coaCategoryId.value &&
				coaCategoryId.label === 'Expenses') ||
			(customerId && coaCategoryId.value && coaCategoryId.label === 'Sales')
		) {
			formData.append('customerId', customerId ? customerId.value : '');
		}
		if (vendorId && coaCategoryId.value && coaCategoryId.label === 'Expenses') {
			formData.append('vendorId', vendorId ? vendorId.value : '');
		}
		if (vendorId && coaCategoryId.value && coaCategoryId.label === 'Expenses') {
			formData.append('vatId', vatId ? vatId.value : '');
		}
		if (employeeId) {
			formData.append('employeeId', employeeId ? employeeId.value : '');
		}
		if (
			invoiceIdList &&
			coaCategoryId.value &&
			coaCategoryId.label === 'Sales'
		) {
			formData.append(
				'invoiceIdListStr',
				invoiceIdList ? JSON.stringify(result) : '',
			);
		}
		formData.append('reference', reference ? reference : '');
		if (this.uploadFile.files[0]) {
			formData.append('attachmentFile', this.uploadFile.files[0]);
		}
		this.props.transactionCreateActions
			.createTransaction(formData)
			.then((res) => {
				if (res.status === 200) {
					resetForm();
					this.props.commonActions.tostifyAlert(
						'success',
						'New Transaction Created Successfully.',
					);
					if (this.state.createMore) {
						this.setState({
							createMore: false,
						});
					} else {
						this.props.history.push('/admin/banking/bank-account/transaction', {
							bankAccountId,
						});
					}
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	setValue = (value) => {
		this.setState({
			transactionCategoryList: [],
		});
		// this.setState(
		//   (prevState) => ({
		//     ...prevState,
		//     transactionCategoryList: [],
		//   }),
		//   () => {},
		// );
	};

	totalAmount(option) {
		console.log(option);
		if (option) {
			const amount = option.reduce(
				(totalAmount, invoice) => totalAmount + invoice.label,
				0,
			);
			this.setState({ totalAmount: amount }, () => {});
		} else {
			this.setState({ totalAmount: 0 }, () => {});
		}
	}

	getExpensesCategoriesList = () => {
		this.props.transactionActions.getExpensesCategoriesList();
		this.props.transactionActions.getCurrencyList();
		this.props.transactionActions.getUserForDropdown();
		this.props.transactionActions.getVatList();
		try {
			this.props.transactionCreateActions
				.getTransactionCategoryListForExplain(12)
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								transactionCategoryList: res.data,
							},
							() => {},
						);
					}
				});
		} catch (err) {
			console.log(err);
		}
	};
	getVendorList = () => {
		this.props.transactionActions.getVendorList();
	};
	getSuggestionInvoicesFotCust = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
		};
		this.props.transactionActions.getCustomerInvoiceList(data);
	};
	getSuggestionInvoicesFotVend = (option, amount) => {
		const data = {
			amount: amount,
			id: option,
		};
		this.props.transactionActions.getVendorInvoiceList(data);
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

	getTransactionCategoryList = (type) => {
		function getParentLabel(array, id, parentId) {
			return array.some(
				(o) =>
					o.label === id ||
					(o.options &&
						(parentId = getParentLabel(o.options, id, o.label)) !== null),
			)
				? parentId
				: null;
		}
		this.setState({
			cat_label: getParentLabel(this.state.categoriesList, type.label),
		});
		this.setValue(null);
		try {
			this.props.transactionCreateActions
				.getTransactionCategoryListForExplain(type.value)
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								transactionCategoryList: res.data,
							},
							() => {},
						);
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	getInvoices = (option, amount) => {
		const data = {
			amount: amount,
			id: option.value,
			type: this.state.cat_label === 'Money Received' ? 'CUSTOMER' : 'SUPLLIER',
		};
		this.props.transactionActions.getCustomerInvoiceList(data);
	};

	render() {
		const {
			initValue,
			id,
			transactionCategoryList,
			categoriesList,
		} = this.state;
		const {
			customer_invoice_list,
			vendor_invoice_list,
			expense_categories_list,
			user_list,
			currency_list,
			vendor_list,
			vat_list,
		} = this.props;
		console.log(customer_invoice_list);
		return (
			<div className="create-bank-transaction-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="icon-doc" />
												<span className="ml-2">Create Bank Transaction</span>
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
													transactionDate: Yup.date().required(
														'Transaction Date is Required',
													),
													transactionAmount: Yup.string().required(
														'Transaction Amount is Required',
													),
													coaCategoryId: Yup.string().required(
														'Transaction Type is Required',
													),
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
																	<Label htmlFor="coaCategoryId">
																		<span className="text-danger">*</span>
																		Transaction Type
																	</Label>
																	<Select
																		options={categoriesList}
																		value={props.values.coaCategoryId}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('coaCategoryId')(
																					option,
																				);
																			} else {
																				props.handleChange('coaCategoryId')('');
																			}
																			if (
																				option.label !== 'Create Expense' &&
																				option.label !== 'Supplier Invoice'
																			) {
																				this.getTransactionCategoryList(option);
																			}
																			if (option.label === 'Create Expense') {
																				this.getExpensesCategoriesList();
																			}
																			if (option.label === 'Supplier Invoice') {
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
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">*</span>
																		Transaction Date
																	</Label>
																	<DatePicker
																		autoComplete="off"
																		id="transactionDate"
																		name="transactionDate"
																		placeholderText="Transaction Date"
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd/MM/yyyy"
																		dropdownMode="select"
																		value={props.values.transactionDate}
																		selected={props.values.transactionDate}
																		onChange={(value) => {
																			props.handleChange('transactionDate')(
																				value,
																			);
																		}}
																		className={`form-control ${
																			props.errors.transactionDate &&
																			props.touched.transactionDate
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.transactionDate &&
																		props.touched.transactionDate && (
																			<div className="invalid-feedback">
																				{props.errors.transactionDate}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="transactionAmount">
																		<span className="text-danger">*</span>
																		Amount
																	</Label>
																	<Input
																		type="text"
																		id="transactionAmount"
																		name="transactionAmount"
																		placeholder="Amount"
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('transactionAmount')(
																					option,
																				);
																			}
																		}}
																		value={props.values.transactionAmount}
																		className={
																			props.errors.transactionAmount &&
																			props.touched.transactionAmount
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.transactionAmount &&
																		props.touched.transactionAmount && (
																			<div className="invalid-feedback">
																				{props.errors.transactionAmount}
																			</div>
																		)}
																</FormGroup>
															</Col>
															{props.values.coaCategoryId &&
																props.values.coaCategoryId.label ===
																	'Create Expense' && (
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="transactionCategoryId">
																				Transaction Category
																			</Label>
																			<Select
																				className="select-default-width"
																				options={
																					transactionCategoryList
																						? transactionCategoryList.categoriesList
																						: []
																				}
																				// value={
																				//   transactionCategoryList
																				//     ? props.values.transactionCategoryId
																				//     : ''
																				// }
																				id="transactionCategoryId"
																				onChange={(option) => {
																					if (option && option.value) {
																						props.handleChange(
																							'transactionCategoryId',
																						)(option);
																					} else {
																						props.handleChange(
																							'transactionCategoryId',
																						)('');
																					}
																				}}
																			/>
																		</FormGroup>
																	</Col>
																)}
														</Row>
														<hr />
														{props.values.coaCategoryId &&
															props.values.coaCategoryId.label ===
																'Create Expense' && (
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
																					props.handleChange('expenseCategory')(
																						option,
																					);
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
																			'Create Expense' && (
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
																								props.handleChange('vatId')('');
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
																			'Create Expense' && (
																			<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="userId">Users</Label>
																					<Select
																						options={user_list ? user_list : []}
																						value={props.values.userId}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange('userId')(
																									option,
																								);
																							} else {
																								props.handleChange('userId')(
																									'',
																								);
																							}
																						}}
																						placeholder="Select Type"
																						id="userId"
																						name="userId"
																						className={
																							props.errors.userId &&
																							props.touched.userId
																								? 'is-invalid'
																								: ''
																						}
																					/>
																				</FormGroup>
																			</Col>
																		)}
																	{props.values.coaCategoryId &&
																		props.values.coaCategoryId.label ===
																			'Create Expense' && (
																			<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="currencyCode">
																						<span className="text-danger">
																							*
																						</span>
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
															props.values.transactionAmount &&
															props.values.coaCategoryId.label ===
																'Supplier Invoice' && (
																<Row>
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="vendorId">
																				<span className="text-danger">*</span>
																				Vendor
																			</Label>
																			<Select
																				options={vendor_list ? vendor_list : []}
																				// value={
																				// 	props.values.vendorId
																				// 		? transactionCategoryList.dataList[2].options.find(
																				// 				(option) =>
																				// 					option.value ===
																				// 					+props.values.vendorId,
																				// 		  )
																				// 		: ''
																				// }
																				onChange={(option) => {
																					if (option && option.value) {
																						props.handleChange('vendorId')(
																							option.value,
																						);
																					} else {
																						props.handleChange('vendorId')('');
																					}
																					this.getSuggestionInvoicesFotVend(
																						option.value,
																						props.values.transactionAmount,
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
																			<Col lg={3}>
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
																					{this.state.initValue.invoiceIdList &&
																						this.state.initValue.invoiceIdList.reduce(
																							(totalAmount, invoice) =>
																								totalAmount + invoice.amount,
																							0,
																						) > this.state.initValue.amount && (
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
														{transactionCategoryList.categoriesList &&
															props.values.coaCategoryId.label !==
																'Create Expense' &&
															props.values.coaCategoryId.label !==
																'Supplier Invoice' &&
															props.values.coaCategoryId.label !== 'Sales' && (
																<Row>
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="transactionCategoryId">
																				Category
																			</Label>
																			<Select
																				className="select-default-width"
																				options={
																					transactionCategoryList
																						? transactionCategoryList.categoriesList
																						: []
																				}
																				// value={
																				//   transactionCategoryList
																				//     ? props.values.transactionCategoryId
																				//     : ''
																				// }
																				id="transactionCategoryId"
																				onChange={(option) => {
																					if (option && option.value) {
																						props.handleChange(
																							'transactionCategoryId',
																						)(option);
																					} else {
																						props.handleChange(
																							'transactionCategoryId',
																						)('');
																					}
																				}}
																			/>
																		</FormGroup>
																	</Col>
																</Row>
															)}
														{transactionCategoryList.dataList && (
															<Row>
																{props.values.coaCategoryId.value === 6 && (
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="employeeId">User</Label>
																			<Select
																				className="select-default-width"
																				options={
																					transactionCategoryList.dataList[0]
																						? transactionCategoryList
																								.dataList[0].options
																						: []
																				}
																				id="employeeId"
																				value={props.values.employeeId}
																				onChange={(option) => {
																					props.handleChange('employeeId')(
																						option,
																					);
																				}}
																			/>
																		</FormGroup>
																	</Col>
																)}
																{props.values.coaCategoryId.value === 12 && (
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="employeeId">User</Label>
																			<Select
																				className="select-default-width"
																				options={
																					transactionCategoryList.dataList[0]
																						? transactionCategoryList
																								.dataList[0].options
																						: []
																				}
																				id="employeeId"
																				value={props.values.employeeId}
																				onChange={(option) => {
																					props.handleChange('employeeId')(
																						option,
																					);
																				}}
																			/>
																		</FormGroup>
																	</Col>
																)}

																{props.values.transactionAmount &&
																	props.values.coaCategoryId.label ===
																		'Sales' && (
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="customerId">
																					Customer
																				</Label>
																				<Select
																					className="select-default-width"
																					options={
																						transactionCategoryList.dataList[1]
																							? transactionCategoryList
																									.dataList[0].options
																							: []
																					}
																					id="customerId"
																					value={props.values.customerId}
																					onChange={(option) => {
																						props.handleChange('customerId')(
																							option,
																						);
																						this.getInvoices(
																							option,
																							props.values.transactionAmount,
																						);
																					}}
																				/>
																			</FormGroup>
																		</Col>
																	)}
																{props.values.coaCategoryId.value === 2 && (
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="invoiceIdList">
																				Invoice
																			</Label>
																			<Select
																				isMulti
																				className="select-default-width"
																				options={
																					customer_invoice_list &&
																					customer_invoice_list.data
																						? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								customer_invoice_list.data,
																								'Invoice',
																						  )
																						: []
																				}
																				// options={
																				// 	invoice_list ? invoice_list.data : []
																				// }
																				id="invoiceIdList"
																				onChange={(option) => {
																					props.handleChange('invoiceIdList')(
																						option,
																					);
																					this.totalAmount(option);
																				}}
																			/>
																		</FormGroup>
																	</Col>
																)}
															</Row>
														)}

														{/* {initValue.chartOfAccountCategoryId.label ==
                              'Sales' && <div className="col-md-6">ss</div>} */}
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
																			props.handleChange('description')(option)
																		}
																		value={props.values.description}
																	/>
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={8}>
																<Row>
																	<Col lg={6}>
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
															<Col lg={4}>
																<Row>
																	<Col lg={12}>
																		<FormGroup className="mb-3">
																			<Field
																				name="attachment"
																				render={({ field, form }) => (
																					<div>
																						<Label>Attachment</Label> <br />
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
																								this.handleFileChange(e, props);
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
															</Col>
														</Row>
														<Row>
															<Col lg={12} className="mt-5">
																<FormGroup className="text-right">
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		onClick={() => {
																			this.setState(
																				{ createMore: false },
																				() => {
																					props.handleSubmit();
																				},
																			);
																		}}
																	>
																		<i className="fa fa-dot-circle-o"></i>{' '}
																		Create
																	</Button>
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		onClick={() => {
																			this.setState(
																				{ createMore: true },
																				() => {
																					props.handleSubmit();
																				},
																			);
																		}}
																	>
																		<i className="fa fa-repeat"></i> Create and
																		More
																	</Button>
																	<Button
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push(
																				'/admin/banking/bank-account/transaction',
																				{ bankAccountId: id },
																			);
																		}}
																	>
																		<i className="fa fa-ban"></i> Cancel
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
)(CreateBankTransaction);
