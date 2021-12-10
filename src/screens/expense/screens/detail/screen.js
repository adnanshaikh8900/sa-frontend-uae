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
	NavLink,
} from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { Loader, ConfirmDeleteModal } from 'components';
import { ViewExpenseDetails } from './sections';

import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import * as ExpenseDetailsAction from './actions';
import * as ExpenseActions from '../../actions';
import { CommonActions } from 'services/global';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';
import * as ExpenseCreateActions from '../create/actions';

import moment from 'moment';
import './style.scss';
import API_ROOT_URL from '../../../../constants/config';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		expense_detail: state.expense.expense_detail,
		currency_list: state.expense.currency_list,
		vat_list: state.expense.vat_list,
		expense_categories_list: state.expense.expense_categories_list,
		bank_list: state.expense.bank_list,
		pay_mode_list: state.expense.pay_mode_list,
		user_list: state.expense.user_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
		pay_to_list: state.expense.pay_to_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		expenseDetailActions: bindActionCreators(ExpenseDetailsAction, dispatch),
		expenseCreateActions: bindActionCreators(ExpenseCreateActions, dispatch),
		expenseActions: bindActionCreators(ExpenseActions, dispatch),
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
class DetailExpense extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			initValue: null,
			current_expense_id: null,
			fileName: '',
			payMode: '',
			view: false,
			basecurrency:[],
			disabled: false,
			disabled1:false,
			exclusiveVat:true,
		};

		this.file_size = 1024000;
		this.regEx = /^[0-9\b]+$/;
		this.regExAlpha = /^[a-zA-Z]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;

		this.supported_format = [
			'image/png',
			'image/jpeg',
			'text/plain',
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		if (this.props.location.state && this.props.location.state.expenseId) {
			this.props.expenseActions.getVatList();
			this.props.expenseDetailActions
				.getExpenseDetail(this.props.location.state.expenseId)
				.then((res) => {
					if (res.status === 200) {
						this.getCompanyCurrency();
						this.props.currencyConvertActions.getCurrencyConversionList();
						this.props.expenseActions.getExpenseCategoriesList();
						this.props.expenseActions.getBankList();
						this.props.expenseActions.getPaymentMode();
						this.props.expenseActions.getUserForDropdown();
						this.props.expenseCreateActions.getPaytoList();
						this.setState(
							{
								loading: false,
								current_expense_id: this.props.location.state.expenseId,
								initValue: {
									expenseNumber:res.data.expenseNumber,
									payee: res.data.payee,
									expenseDate: res.data.expenseDate ? res.data.expenseDate : '',
									currency: res.data.currencyCode ? res.data.currencyCode : '',
									currencyName:res.data.currencyName ? res.data.currencyName : '',
									expenseCategory: res.data.expenseCategory
										? res.data.expenseCategory
										: '',
									expenseAmount: res.data.expenseAmount,
									vatCategoryId: res.data.vatCategoryId
										? res.data.vatCategoryId
										: '',
									payMode: res.data.payMode ? res.data.payMode : '',
									bankAccountId: res.data.bankAccountId
										? res.data.bankAccountId
										: '',
									exclusiveVat:
										res.data.exclusiveVat && res.data.exclusiveVat != null ? res.data.exclusiveVat :'',
									exchangeRate:res.data.exchangeRate ? res.data.exchangeRate : '',
									expenseDescription: res.data.expenseDescription,
									receiptNumber: res.data.receiptNumber,
									attachmentFile: res.data.attachmentFile,
									receiptAttachmentDescription:
										res.data.receiptAttachmentDescription,
									fileName: res.data.fileName ? res.data.fileName : '',
									filePath: res.data.receiptAttachmentPath
										? res.data.receiptAttachmentPath
										: '',
								},
								selectedStatus: res.data.exclusiveVat ? true : false,
								view:
									this.props.location.state && this.props.location.state.view
										? true
										: false,
							},
							() => {
								if (
									this.props.location.state &&
									this.props.location.state.view
								) {
									this.setState({ loading: false });
								} else {
									this.setState({ loading: false });
								}
							},
						);
					}
				})
				.catch((err) => {
					this.setState({ loading: false });
				});
		} else {
			this.props.history.push('/admin/expense/expense');
		}
	};

	handleSubmit = (data, resetValue) => {
		this.setState({ disabled: true });
		const { current_expense_id } = this.state;
        const {
			expenseNumber,
			payee,
			expenseDate,
			currency,
			expenseCategory,
			expenseAmount,
			expenseDescription,
			exchangeRate,
			receiptNumber,
			receiptAttachmentDescription,
			vatCategoryId,
			payMode,
			bankAccountId,
		} = data;
		const exclusiveVat = this.state.selectedStatus;

		let formData = new FormData();
		formData.append('expenseNumber', expenseNumber);
		formData.append('expenseId', current_expense_id);
		formData.append('payee', payee ? payee.value : '');
		formData.append(
			'expenseDate',
			expenseDate !== null ? moment(expenseDate) : '',
		);
		formData.append('expenseDescription', expenseDescription);
		formData.append('receiptNumber', receiptNumber);
		formData.append(
			'receiptAttachmentDescription',
			receiptAttachmentDescription,
		);
		formData.append('expenseAmount', expenseAmount);
		if (payMode && payMode.value) {
			formData.append('payMode', payMode.value);
		}
		if (expenseCategory && expenseCategory.value) {
			formData.append('expenseCategory', expenseCategory.value);
		}
		if (exchangeRate && exchangeRate.value) {
			formData.append('exchangeRate', exchangeRate.value);
		}
		if (currency && currency.value) {
			formData.append('currencyCode', currency.value);
		}
		// if (vatCategoryId && vatCategoryId.value) {
		// 	formData.append('vatCategoryId', vatCategoryId.value);
		// }
		  
		if (vatCategoryId ) {
			formData.append('vatCategoryId',  vatCategoryId.value ? vatCategoryId.value :vatCategoryId);
			
			if(this.state.exclusiveVat !== undefined){
				formData.append('exclusiveVat', this.state.exclusiveVat );
			}
		}
		if (bankAccountId && bankAccountId.value && payMode === 'BANK') {
			formData.append('bankAccountId', bankAccountId.value);
		}
		if (this.uploadFile.files[0]) {
			formData.append('attachmentFile', this.uploadFile.files[0]);
		}
		this.props.expenseDetailActions
			.updateExpense(formData)
			.then((res) => {
				this.setState({ disabled: false });
				if (res.status === 200) {
					// resetValue({});
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Expense Updated Successfully'
					);
					this.props.history.push('/admin/expense/expense');
				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Expense Updated Unsuccessfully'
				);
			});
	};

	deleteExpense = () => {
		const message1 = (
			<text>
				<b>Delete Expense?</b>
			</text>
		);
		const message =
			'This Expense will be deleted permanently and cannot be recovered. ';
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={this.removeExpense}
					cancelHandler={this.removeDialog}
					message={message}
					message1={message1}
				/>
			),
		});
	};

	getCompanyCurrency = (basecurrency) => {
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
	removeExpense = () => {
		this.setState({ disabled1: true });
		const { current_expense_id } = this.state;
		this.props.expenseDetailActions
			.deleteExpense(current_expense_id)
			.then((res) => {
				if (res.status === 200) {
					// this.success('Chart Account Deleted Successfully');
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Expense Deleted Successfully'
					);
					this.props.history.push('/admin/expense/expense');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Expense Deleted Unsuccessfully'
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	editDetails = () => {
		this.setState({
			view: false,
		});
	};

	handleFileChange = (e, props) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		if (file) {
			reader.onloadend = () => {};
			reader.readAsDataURL(file);
			props.setFieldValue('attachmentFile', file, true);
		}
	};

	render() {
		strings.setLanguage(this.state.language);
		const {
			currency_list,
			user_list,
			bank_list,
			vat_list,
			expense_categories_list,
			pay_mode_list,
			pay_to_list,
			currency_convert_list,
		} = this.props;
		const { initValue, loading, dialog } = this.state;

		return (
			<div className="detail-expense-screen">
				<div className="animated fadeIn">
					{dialog}
					{loading ? (
						<Loader />
					) : this.state.view ? (
						<ViewExpenseDetails
							initialVals={initValue}
							editDetails={() => {
								this.editDetails();
							}}
						/>
					) : (
						<Row>
							<Col lg={12} className="mx-auto">
								<Card>
									<CardHeader>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="fab fa-stack-exchange" />
													<span className="ml-2">{strings.UpdateExpense} </span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<Row>
											<Col lg={12}>
												<Formik
													initialValues={initValue}
													onSubmit={(values, { resetForm }) => {
														this.handleSubmit(values);

														// this.setState({
														//   selectedCurrency: null,
														//   selectedProject: null,
														//   selectedBankAccount: null,
														//   selectedCustomer: null

														// })
													}}
													validate={(values) => {
														let errors = {};
														if (
															values.payMode.value === 'BANK' &&
															!values.bankAccountId
														) {
															errors.bankAccountId = 'Bank Account is Required';
														}
														return errors;
													}}
													validationSchema={Yup.object().shape({
														expenseNumber: Yup.string().required(
															'Expense number is required',
														),
														expenseCategory: Yup.string().required(
															'Expense Category is required',
														),
														expenseDate: Yup.date().required(
															'Expense Date is Required',
														),
														currency: Yup.string().required(
															'Currency is required',
														),
														payMode: Yup.string().required(
															'Pay Through is required',
														),
														expenseAmount: Yup.string()
															.required('Amount is Required')
															.matches(
																/^[0-9][0-9]*[.]?[0-9]{0,2}$$/,
																'Enter a Valid Amount',
															),
														attachmentFile: Yup.mixed()
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
																			))
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
																		(value && value.size <= this.file_size)
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
																		<Label htmlFor="expenseNumber">
																			<span className="text-danger">* </span>
																			Expense Number
																			{/* <i
																				id="ProductCodeTooltip"
																				className="fa fa-question-circle ml-1"
																			></i>
																			<UncontrolledTooltip
																				placement="right"
																				target="ProductCodeTooltip"
																			>
																				Product Code - Unique identifier code
																				for the product
																			</UncontrolledTooltip> */}
																		</Label>
																		<Input
																			type="text"
																			maxLength="70"
																			id="expenseNumber"
																			name="expenseNumber"
																			placeholder={strings.Enter+" Expense Number"}
																			disabled
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExBoth.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange('expenseNumber')(
																						option,
																					);
																				}
																				// this.expenseValidationCheck(
																				// 	option.target.value,
																				// );
																			}}
																			// onBlur={handleBlur}
																			value={props.values.expenseNumber}
																			className={
																				props.errors.expenseNumber &&
																				props.touched.expenseNumber
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.expenseNumber &&
																			props.touched.expenseNumber && (
																				<div className="invalid-feedback">
																					{props.errors.expenseNumber}
																				</div>
																			)}
																	</FormGroup>
																</Col>
														</Row>
															<Row>
																<Col lg={3}>
																	<FormGroup className="mb-3" >
																		<Label htmlFor="expenseCategoryId">
																			<span className="text-danger">* </span>
																			 {strings.ExpenseCategory}
																		</Label>
																		<Select
																			styles={customStyles}
																			id="expenseCategory"
																			name="expenseCategory"
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
																			className={
																				props.errors.expenseCategory &&
																				props.touched.expenseCategory
																					? 'is-invalid'
																					: ''
																			}
																			onChange={(option) =>
																				props.handleChange('expenseCategory')(
																					option,
																				)
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
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="payee">	<span className="text-danger">* </span>{strings.PaidBy}</Label>
																		<Select
																			styles={customStyles}
																			options={
																				pay_to_list
																					? selectOptionsFactory.renderOptions(
																							'label',
																							'value',
																							pay_to_list,
																							'Payee',
																					  )
																					: []
																			}
																			value={
																				pay_to_list &&
																				selectOptionsFactory
																					.renderOptions(
																						'label',
																						'value',
																						pay_to_list,
																						'Payee',
																					)
																					.find(
																						(option) =>
																							option.label ===
																							props.values.payee,
																					)
																			}
																			onChange={(option) => {
																				console.log(props.values.payee);
																				if (option && option.value) {
																					props.handleChange('payee')(option);
																				} else {
																					props.handleChange('payee')('');
																				}
																			}}
																			placeholder={strings.Select+strings.Payee}
																			id="payee"
																			name="payee"
																			className={
																				props.errors.payee &&
																				props.touched.payee
																					? 'is-invalid'
																					: ''
																			}
																		/>
																	</FormGroup>
																</Col>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="expense_date">
																			<span className="text-danger">* </span>
																			 {strings.ExpenseDate}
																		</Label>
																		<DatePicker
																			id="date"
																			name="expenseDate"
																			className={`form-control ${
																				props.errors.expenseDate &&
																				props.touched.expenseDate
																					? 'is-invalid'
																					: ''
																			}`}
																			placeholderText={strings.ExpenseDate}
																			value={moment(
																				props.values.expenseDate,
																			).format('DD/MM/YYYY')}
																			showMonthDropdown
																			showYearDropdown
																			dropdownMode="select"
																			dateFormat="dd/MM/yyyy"
																			// maxDate={new Date()}
																			onChange={(value) => {
																				props.handleChange('expenseDate')(
																					value,
																				);
																			}}
																		/>
																		{props.errors.expenseDate &&
																			props.touched.expenseDate && (
																				<div className="invalid-feedback">
																					{props.errors.expenseDate}
																				</div>
																			)}
																	</FormGroup>
																</Col>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="currency">
																			<span className="text-danger">* </span>
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
																							+props.values.currency,
																					)
																			}
																			onChange={(option) => {
																				props.handleChange('currency')(option);
																			   }}
																			className={
																				props.errors.currency &&
																				props.touched.currency
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.currency &&
																			props.touched.currency && (
																				<div className="invalid-feedback">
																					{props.errors.currency}
																				</div>
																			)}
																	</FormGroup>
																</Col>
															</Row>
															<Row>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="expenseAmount">
																			<span className="text-danger">* </span>
																			{strings.Amount}
																		</Label>
																		<Input
																			type="text"
																			// min="0"
																			name="expenseAmount"
																			id="expenseAmount"
																			rows="5"
																			className={
																				props.errors.expenseAmount &&
																				props.touched.expenseAmount
																					? 'is-invalid'
																					: ''
																			}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regDecimal.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange('expenseAmount')(
																						option,
																					);
																				}
																			}}
																			value={props.values.expenseAmount}
																		/>
																		{props.errors.expenseAmount &&
																			props.touched.expenseAmount && (
																				<div className="invalid-feedback">
																					{props.errors.expenseAmount}
																				</div>
																			)}
																	</FormGroup>
																</Col>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="vatCategoryId"><span className="text-danger">* </span>{strings.Tax}</Label>
																		<Select
																			styles={customStyles}
																			className="select-default-width"
																			id="vatCategoryId"
																			name="vatCategoryId"
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
																							+props.values.vatCategoryId,
																					)
																			}
																			onChange={(option) =>
																				props.handleChange('vatCategoryId')(
																					option,
																				)
																			}
																		/>
																	</FormGroup>
																</Col>
																
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="pay_through"><span className="text-danger">* </span>
																				 {strings.PayThrough}
																			</Label>
																			<Select
																				id="pay_through"
																				name="pay_through"
																				placeholder={strings.Select+strings.PayThrough}
																				options={
																					pay_mode_list
																						? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								pay_mode_list,
																								'',
																						  )
																						: []
																				}
																				value={
																					pay_mode_list &&
																					pay_mode_list.find(
																						(option) =>
																							option.value ===
																							props.values.payMode,
																					)
																				}
																				onChange={(option) => {
																					props.handleChange('payMode')(
																						option.value,
																					);
																					if (option && option.value) {
																						this.setState({
																							payMode: option.value,
																						});
																					} else {
																						this.setState({ payMode: '' });
																					}
																				}}
																				className={
																					props.errors.payMode &&
																					props.touched.payMode
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.payMode &&
																				props.touched.payMode && (
																					<div className="invalid-feedback">
																						{props.errors.payMode}
																					</div>
																				)}
																		</FormGroup>
																	</Col>
																{!props.values.payee &&
																	props.values.payMode === 'BANK' && (
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="bankAccountId">
																					Bank 
																				</Label>
																				<Select
																					id="bankAccountId"
																					name="bankAccountId"
																					options={
																						bank_list && bank_list.data
																							? selectOptionsFactory.renderOptions(
																									'name',
																									'bankAccountId',
																									bank_list.data,
																									'Bank',
																							  )
																							: []
																					}
																					value={
																						bank_list &&
																						bank_list.data &&
																						selectOptionsFactory
																							.renderOptions(
																								'name',
																								'bankAccountId',
																								bank_list.data,
																								'Bank',
																							)
																							.find(
																								(option) =>
																									option.value ===
																									+props.values.bankAccountId,
																							)
																					}
																					onChange={(option) =>
																						props.handleChange('bankAccountId')(
																							option,
																						)
																					}
																					className={
																						props.errors.bankAccountId &&
																						props.touched.bankAccountId
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.bankAccountId &&
																					props.touched.bankAccountId && (
																						<div className="invalid-feedback">
																							{props.errors.bankAccountId}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																	)}
															</Row>
															{props.values.vatCategoryId !=='' && props.values.vatCategoryId.label !=='Select Vat' &&
														(
															<Row>
																<Col></Col>
																	<Col >
																		<FormGroup className="mb-3">
																			
																			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																				
																				<FormGroup check inline>
																					<div className="custom-radio custom-control">
																						<input
																							className="custom-control-input"
																							type="radio"
																							id="inline-radio2"
																							name="active"
																							value={false}
																							checked={
																								!this.state.selectedStatus
																							}
																							onChange={(e) => {
																								if (
																									e.target.value === 'false'
																								) {
																									this.setState({
																										selectedStatus: false,
																										exclusiveVat: false
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio2"
																						>
																							Inclusive Vat
																							</label>
																					</div>
																				</FormGroup>
																				<FormGroup check inline>
																					<div className="custom-radio custom-control">
																						<input
																							className="custom-control-input"
																							type="radio"
																							id="inline-radio1"
																							name="active"
																							checked={
																								this.state.selectedStatus
																							}
																							value={true}
																							onChange={(e) => {
																								if (
																									e.target.value === 'true'
																								) {
																									
																									this.setState({
																										selectedStatus: true,
																										exclusiveVat: true
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio1"
																						>
																						Exclusive Vat	
																							</label>
																					</div>
																				</FormGroup>
																		</FormGroup>
																	</Col>
																	<Col></Col>
																	<Col></Col></Row>
														)
														}
															<hr />
															<Row style={{display: props.values.exchangeRate === 1 ? 'none' : ''}}>
																<Col>
																<Label htmlFor="currency">
																{strings.CurrencyExchangeRate}  
																	</Label>	
																</Col>
																</Row>
																<Row style={{display: props.values.exchangeRate === 1 ? 'none' : ''}}>
																<Col lg={1}>
																<Input
																		disabled
																				id="1"
																				name="1"
																				value=	{
																					1 }
																				
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
																	{/* <Label htmlFor="exchangeRate">
																		Exchange rate
																	</Label> */}
																	<div>
																		<Input
																			type="number"

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
																				value=	{
																					this.state.basecurrency.currencyName }
																				
																			/>
														</Col>
														</Row>
															<Row>
																<Col lg={8}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="expenseDescription">
																			 {strings.Description}
																		</Label>
																		<Input
																			type="textarea"
																			name="expenseDescription"
																			id="expenseDescription"
																			maxLength="255"
																			rows="5"
																			placeholder={strings.Expense+" "+strings.Description}
																			onChange={(option) =>
																				props.handleChange(
																					'expenseDescription',
																				)(option)
																			}
																			value={props.values.expenseDescription}
																		/>
																	</FormGroup>
																</Col>
															</Row>
															<hr />
															<Row>
																<Col lg={8}>
																	<Row>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="receiptNumber">
																					 {strings.ReceiptNumber}
																				</Label>
																				<Input
																					type="text"
																					id="receiptNumber"
																					name="receiptNumber"
																					maxLength="20"
																					placeholder={strings.Enter+strings.ReceiptNumber}
																					onChange={(option) =>
																						props.handleChange('receiptNumber')(
																							option,
																						)
																					}
																					value={props.values.receiptNumber}
																				/>
																			</FormGroup>
																		</Col>
																	</Row>
																	<Row>
																		<Col lg={12}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="receiptAttachmentDescription">
																					 {strings.AttachmentDescription}
																				</Label>
																				<Input
																					type="textarea"
																					name="receiptAttachmentDescription"
																					id="receiptAttachmentDescription"
																					maxLength='255'
																					rows="5"
																					placeholder={strings.Description}
																					onChange={(option) =>
																						props.handleChange(
																							'receiptAttachmentDescription',
																						)(option)
																					}
																					value={
																						props.values
																							.receiptAttachmentDescription
																					}
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
																					name="attachmentFile"
																					render={({ field, form }) => (
																						<div>
																							<Label>{strings.ReceiptAttachment}</Label>{' '}
																							<br />
																							<div className="file-upload-cont">
																								<Button
																									color="primary"
																									onClick={() => {
																										document
																											.getElementById(
																												'fileInput',
																											)
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
																								{this.state.fileName ? (
																									this.state.fileName
																								) : (
																									<NavLink
																										href={`${API_ROOT_URL.API_ROOT_URL}${initValue.filePath}`}
																										download
																										style={{
																											fontSize: '0.875rem',
																										}}
																										target="_blank"
																									>
																										{
																											this.state.initValue
																												.fileName
																										}
																									</NavLink>
																								)}
																							</div>
																						</div>
																					)}
																				/>
																				{props.errors.attachmentFile && (
																					<div className="invalid-file">
																						{props.errors.attachmentFile}
																					</div>
																				)}
																			</FormGroup>
																		</Col>
																	</Row>
																</Col>
															</Row>
															<Row>
																<Col
																	lg={12}
																	className="d-flex align-items-center justify-content-between flex-wrap mt-5"
																>
																	<FormGroup>
																		<Button
																			type="button"
																			name="button"
																			color="danger"
																			className="btn-square"
																			disabled1={this.state.disabled1}
																			onClick={this.deleteExpense}
																		>
																			<i className="fa fa-trash"></i>{' '}{this.state.disabled1
																			? 'Deleting...'
																			: strings.Delete }
																		</Button>
																	</FormGroup>
																	<FormGroup className="text-right">
																		<Button
																			type="submit"
																			name="submit"
																			color="primary"
																			className="btn-square mr-3"
																			disabled={this.state.disabled}
																		>
																			<i className="fa fa-dot-circle-o"></i>{' '}
																			{this.state.disabled
																				? 'Updating...'
																				: strings.Update}
																		</Button>
																		<Button
																			type="button"
																			name="button"
																			color="secondary"
																			className="btn-square"
																			onClick={() => {
																				this.props.history.push(
																					'/admin/expense/expense',
																				);
																			}}
																		>
																			<i className="fa fa-ban"></i>{this.state.disabled1
																			? 'Deleting...'
																			: strings.Cancel }
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
					)}
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailExpense);
