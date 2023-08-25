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
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as CustomerRecordPaymentActions from './actions';
import * as CnActions from '../../actions';

import { CustomerModal } from '../../sections';
import { Loader, ConfirmDeleteModal } from 'components';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';
import API_ROOT_URL from '../../../../constants/config';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		contact_list: state.customer_invoice.contact_list,
		customer_list: state.customer_invoice.customer_list,
		deposit_list: state.customer_invoice.deposit_list,
		pay_mode: state.customer_invoice.pay_mode,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		cnActions: bindActionCreators(
			CnActions,
			dispatch,
		),
		CustomerRecordPaymentActions: bindActionCreators(
			CustomerRecordPaymentActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
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
class RefundDebitNote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			dialog: false,
			discountOptions: [
				{ value: 'FIXED', label: '₹' },
				{ value: 'PERCENTAGE', label: '%' },
			],
			discount_option: '',
			data: [],
			current_customer_id: null,
			initValue: {
				receiptNo: '',
				receiptDate: new Date(),
				contactId: this.props.location.state.id.contactId,
				amount: this.props.location.state.id.dueAmount,
				payMode: '',
				notes: '',
				depositeTo: '',
				referenceCode: '',
				attachmentFile: '',
				invoiceData: '',
				paidInvoiceListStr: [],
			},
			amount: this.props.location.state.id.dueAmount,
			invoiceId: this.props.location.state.id.id,
			isCNWithoutProduct: this.props.location.state.id.isCNWithoutProduct,
			contactType: 2,
			openCustomerModal: false,
			selectedContact: '',
			term: '',
			selectedType: '',
			discountPercentage: '',
			discountAmount: 0,
			fileName: '',
			disabled: false,
			invoiceNumber: "-",
			showInvoiceNumber: false,
			loadingMsg: "Loading..."
		};

		// this.options = {
		//   paginationPosition: 'top'
		// }
		this.formRef = React.createRef();
		this.termList = [
			{ label: 'Net 7', value: 'NET_7' },
			{ label: 'Net 10', value: 'NET_10' },
			{ label: 'Net 30', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
		this.regEx = /^[0-9\b]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;

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
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		this.setState({
			initValue: {
				paidInvoiceListStr: [
					{
						id: this.props.location.state.id.id,
						date: moment(
							this.props.location.state.id.invoiceDate,
							'DD-MM-YYYY',
						).toDate(),
						dueDate: moment(
							this.props.location.state.id.invoiceDueDate,
							'DD-MM-YYYY',
						).toDate(),
						paidAmount: this.props.location.state.id.invoiceAmount,
						dueAmount: this.props.location.state.id.dueAmount,
						referenceNo: this.props.location.state.id.invoiceNumber,
						totalAount: this.props.location.state.id.invoiceAmount,
					},
				],
			},
		});
		Promise.all([
			this.props.cnActions.getDepositList(),
			this.props.cnActions.getPaymentMode(),
			this.props.cnActions.getCustomerList(this.state.contactType),
		]);
		this.getReceiptNo();
		//INV number
		this.props.cnActions
			.getInvoicesForCNById(this.props.location.state.id.id)
			.then((res) => {

				if (res.status === 200) {
					if (res.data.length && res.data.length != 0)
						this.setState(
							{
								invoiceData: res.data[0],
								invoiceNumber: res.data[0].invoiceNumber,
								showInvoiceNumber: true
							},
							() => { },
						);
				}
			})
	};

	getReceiptNo = () => {
		this.props.CustomerRecordPaymentActions.getReceiptNo(
			this.props.location.state.id.id,
		).then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
						...this.state.initValue,
						...{ receiptNo: res.data },
					},
				});
				this.formRef.current.setFieldValue('receiptNo', res.data, true);
			}
		});
	};

	deleteRow = (e, row, props) => {
		const id = row['id'];
		let newData = [];
		e.preventDefault();
		const data = this.state.data;
		newData = data.filter((obj) => obj.id !== id);
		props.setFieldValue('lineItemsString', newData, true);
		this.updateAmount(newData, props);
	};

	renderActions = (cell, rows, props) => {
		return (
			<Button
				size="sm"
				className="btn-twitter btn-brand icon"
				disabled={this.state.data.length === 1 ? true : false}
				onClick={(e) => {
					this.deleteRow(e, rows, props);
				}}
			>
				<i className="fas fa-trash"></i>
			</Button>
		);
	};

	checkedRow = () => {
		if (this.state.data.length > 0) {
			let length = this.state.data.length - 1;
			let temp = Object.values(this.state.data[`${length}`]).indexOf('');
			if (temp > -1) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
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
	showInvoiceNumber = () => {

		return (
			this.state.showInvoiceNumber && (
				<Col lg={4}>
					<FormGroup className="mb-3">
						<Label htmlFor="project">

							{strings.InvoiceNumber}
						</Label>
						<Input

							disabled
							id="invoiceNumber"
							name="invoiceNumber"
							value={this.state.invoiceNumber}
						/>
					</FormGroup>
				</Col>)
		)
	}
	handleSubmit = (data) => {
		this.setState({ disabled: true, loading: true, loadingMsg: "Refunding Payment..." });
		const { invoiceId } = this.state;
		const {
			receiptNo,
			receiptDate,
			contactId,
			amount,
			depositeTo,
			payMode,
			notes,
			referenceCode,
		} = data;

		let formData = new FormData();
		formData.append('type', "Debit Note");
		formData.append('isCNWithoutProduct', this.state.isCNWithoutProduct);
		formData.append('creditNoteId', this.props.location.state.id.id);
		formData.append('amountReceived', amount !== null ? amount : '');
		formData.append('notes', notes !== null ? notes : '');

		formData.append('depositTo', depositeTo !== null ? depositeTo.value : '');
		formData.append('payMode', payMode !== null ? payMode.value : '');
		if (contactId) {
			formData.append('contactId', contactId);
		}
		formData.append('invoiceId', this.state.invoiceData.invoiceId);

		formData.append(
			'paymentDate',
			typeof receiptDate === 'string'
				? moment(receiptDate, 'DD/MM/YYYY').toDate()
				: receiptDate,
		);

		this.props.CustomerRecordPaymentActions.recordPayment(formData)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'Debit Refund Successfully',
				);
				this.setState({ loading: false });
				this.props.history.push('/admin/expense/debit-notes');
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Debit Refund Unsuccessfully.',
				);
			});

		// else
		// {	formData.append('receiptNo', receiptNo !== null ? receiptNo : '');
		// 	formData.append(
		// 		'receiptDate',
		// 		typeof receiptDate === 'string'
		// 			? moment(receiptDate, 'DD-MM-YYYY').toDate()
		// 			: receiptDate,
		// 	);
		// 	formData.append(
		// 		'paidInvoiceListStr',
		// 		JSON.stringify(this.state.initValue.paidInvoiceListStr),
		// 	);
		// 	formData.append('amount', amount !== null ? amount : '');
		// 	formData.append('notes', notes !== null ? notes : '');
		// 	formData.append(
		// 		'referenceCode',
		// 		referenceCode !== null ? referenceCode : '',
		// 	);
		// 	formData.append('depositeTo', depositeTo !== null ? depositeTo.value : '');
		// 	formData.append('payMode', payMode !== null ? payMode.value : '');
		// 	if (contactId) {
		// 		formData.append('contactId', contactId);
		// 	}
		// 	if (this.uploadFile.files[0]) {
		// 		formData.append('attachmentFile', this.uploadFile.files[0]);
		// 	}
		// 	formData.append(
		// 		'invoiceNumber',
		// 		this.props.location.state.id.invoiceNumber?this.props.location.state.id.invoiceNumber :"Invoice-00000",
		// 	);
		// 	formData.append(
		// 		'invoiceAmount',
		// 		this.props.location.state.id.invoiceAmount ?this.props.location.state.id.invoiceAmount :"00000",
		// 	);
		// 	this.props.CustomerRecordPaymentActions.recordPayment(formData)
		// 		.then((res) => {
		// 			this.props.commonActions.tostifyAlert(
		// 				'success',
		// 				res.data ? res.data.message : 'Debit Refund Successfully',
		// 			);
		// 			this.props.history.push('/admin/expense/debit-notes');
		// 		})
		// 		.catch((err) => {
		// 			this.props.commonActions.tostifyAlert(
		// 				'error',
		// 				err && err.data ? err.data.message : 'Debit Refund Unsuccessfully.',
		// 			);
		// 		});
		// 	}//
	};

	openCustomerModal = (e) => {
		e.preventDefault();
		this.setState({ openCustomerModal: true });
	};

	getCurrentUser = (data) => {
		let option;
		if (data.label || data.value) {
			option = data;
		} else {
			option = {
				label: `${data.fullName}`,
				value: data.id,
			};
		}
		// this.setState({
		//   selectedContact: option
		// })
		this.formRef.current.setFieldValue('contactId', option.value, true);
	};

	closeCustomerModal = (res) => {
		if (res) {
			this.props.cnActions.getCustomerList(this.state.contactType);
		}
		this.setState({ openCustomerModal: false });
	};

	deleteInvoice = () => {
		const message1 =
			<text>
				<b>Delete Customer Invoice?</b>
			</text>
		const message = 'This Customer Invoice will be deleted permanently and cannot be recovered. ';
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={this.removeInvoice}
					cancelHandler={this.removeDialog}
					message={message}
					message1={message1}
				/>
			),
		});
	};

	removeInvoice = () => {
		const { current_customer_id } = this.state;
		this.props.customerInvoiceDetailActions
			.deleteInvoice(current_customer_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Invoice Deleted Successfully',
					);
					this.props.history.push('/admin/expense/debit-notes');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Invoice Deleted Unsuccessfully',
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	render() {
		strings.setLanguage(this.state.language);
		const { initValue, loading, dialog, loadingMsg } = this.state;
		const { pay_mode, customer_list, deposit_list } = this.props;

		let tmpcustomer_list = []

		customer_list.map(item => {
			let obj = { label: item.label.contactName, value: item.value }
			tmpcustomer_list.push(obj)
		})

		return (
			<div className="detail-customer-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-address-book" />
												<span className="ml-2">
													Refund For Debit Note
												</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									{dialog}

									<Row>
										<Col lg={12}>
											<Formik
												initialValues={initValue}
												ref={this.formRef}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmit(values);
												}}
												validationSchema={Yup.object().shape({
													depositeTo: Yup.string().required(
														'Deposit To is Required',
													),
													payMode: Yup.string().required(
														'Payment mode is Required',
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
												{(props) => loading == true ? <div className="m11"> <Loader loadingMsg={loadingMsg} /></div> :
													<Form onSubmit={props.handleSubmit}>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="contactId">
																		<span className="text-danger">* </span>
																		{strings.CustomerName}
																	</Label>
																	<Select
																		styles={customStyles}
																		id="contactId"
																		name="contactId"
																		isDisabled
																		value={
																			tmpcustomer_list &&
																			tmpcustomer_list.find(
																				(option) =>
																					option.value ===
																					+this.props.location.state.id
																						.contactId,
																			)
																		}
																		className={
																			props.errors.contactId &&
																				props.touched.contactId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.contactId &&
																		props.touched.contactId && (
																			<div className="invalid-feedback">
																				{props.errors.contactId}
																			</div>
																		)}
																</FormGroup>
															</Col>
															{
																this.state.isCNWithoutProduct != true &&
																(this.showInvoiceNumber())}
															{/* <Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="project">
																			<span className="text-danger">* </span>{' '}
																			Payment
																		</Label>
																		<Input
																			type="text"
																			id="receiptNo"
																			name="receiptNo"
																			placeholder=""
																			disabled
																			value={props.values.receiptNo}
																			onChange={(value) => {
																				props.handleChange('receiptNo')(value);
																			}}
																			className={
																				props.errors.receiptNo &&
																				props.touched.receiptNo
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.receiptNo &&
																			props.touched.receiptNo && (
																				<div className="invalid-feedback">
																					{props.errors.receiptNo}
																				</div>
																			)}
																	</FormGroup>
																</Col> */}
														</Row>
														<hr />
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="project">
																		<span className="text-danger">* </span>{' '}
																		{strings.AmountPaid}
																	</Label>
																	<Input
																		type="number"
																		max={this.state.amount}
																		id="amount"
																		name="amount"
																		value={props.values.amount}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regDecimal.test(option.target.value)
																			) {
																				props.handleChange('amount')(option);
																			}
																		}}
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
														<hr />
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">* </span>
																		{strings.PaymentDate}
																	</Label>
																	<DatePicker
																		id="receiptDate"
																		name="receiptDate"
																		placeholderText={strings.PaymentDate}
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd-MM-yyyy"
																		dropdownMode="select"
																		value={props.values.receiptDate}
																		selected={props.values.receiptDate}
																		onChange={(value) => {
																			props.handleChange('receiptDate')(
																				value,
																			);
																		}}
																		className={`form-control ${props.errors.receiptDate &&
																				props.touched.receiptDate
																				? 'is-invalid'
																				: ''
																			}`}
																	/>
																	{props.errors.receiptDate &&
																		props.touched.receiptDate && (
																			<div className="invalid-feedback">
																				{props.errors.receiptDate}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="payMode">
																		<span className="text-danger">* </span>{' '}
																		{strings.PaymentMode}
																	</Label>
																	<Select
																		styles={customStyles}
																		options={
																			pay_mode
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					pay_mode,
																					'Mode',
																				)
																				: []
																		}
																		value={props.values.payMode}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('payMode')(option);
																			} else {
																				props.handleChange('payMode')('');
																			}
																		}}
																		placeholder={strings.Select + strings.PaymentMode}
																		id="payMode"
																		name="payMode"
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
															</Col>{' '}
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="depositeTo">
																		<span className="text-danger">* </span>{' '}
																		{strings.DepositFrom}
																	</Label>
																	<Select
																		styles={customStyles}
																		options={deposit_list}
																		value={props.values.depositeFrom}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('depositeTo')(
																					option,
																				);
																			} else {
																				props.handleChange('depositeTo')('');
																			}
																		}}
																		placeholder={strings.Select + strings.DepositFrom}
																		id="depositeTo"
																		name="depositeTo"
																		className={
																			props.errors.depositeTo &&
																				props.touched.depositeTo
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.depositeTo &&
																		props.touched.depositeTo && (
																			<div className="invalid-feedback">
																				{props.errors.depositeTo}
																			</div>
																		)}
																</FormGroup>
															</Col>{' '}
														</Row>
														<hr />
														<Row>
															<Col lg={8}>
																<Row>
																	<Col lg={6}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="referenceCode">
																				{strings.ReceiptNumber}
																			</Label>
																			<Input
																				type="text"
																				id="referenceCode"
																				name="referenceCode"
																				placeholder={strings.Enter + strings.ReceiptNumber}
																				onChange={(option) => {
																					if (
																						option.target.value === '' ||
																						this.regExBoth.test(
																							option.target.value,
																						)
																					) {
																						props.handleChange(
																							'referenceCode',
																						)(option);
																					}
																				}}
																				value={props.values.referenceCode}
																			/>
																		</FormGroup>
																	</Col>
																</Row>
																<Row>
																	<Col lg={12}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="notes">{strings.Notes}</Label>
																			<Input
																				type="textarea"
																				name="notes"
																				id="notes"
																				rows="5"
																				placeholder={strings.Notes}
																				onChange={(option) =>
																					props.handleChange('notes')(option)
																				}
																				defaultValue={props.values.notes}
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
																						<Label>{strings.Attachment}</Label> <br />
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
																									download={
																										this.state.initValue
																											.fileName
																									}
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
																className="mt-5 d-flex flex-wrap align-items-center justify-content-between"
															>
																<FormGroup className="text-right w-100">
																	<Button
																		type="submit"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																	>
																		<i className="fa fa-dot-circle-o"></i>{' '}
																		{this.state.disabled
																			? 'Refunding...'
																			: strings.Refund}
																	</Button>
																	<Button
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push(
																				'/admin/expense/debit-notes',
																			);
																		}}
																	>
																		<i className="fa fa-ban"></i>  {strings.Cancel}
																	</Button>
																</FormGroup>
															</Col>
														</Row>
													</Form>
												}
											</Formik>
										</Col>
									</Row>

								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
				<CustomerModal
					openCustomerModal={this.state.openCustomerModal}
					closeCustomerModal={(e) => {
						this.closeCustomerModal(e);
					}}
					getCurrentUser={(e) => this.getCurrentUser(e)}
					createCustomer={this.props.cnActions.createCustomer}
					currency_list={this.props.currency_list}
					country_list={this.props.country_list}
					getStateList={this.props.cnActions.getStateList}
				/>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(RefundDebitNote);