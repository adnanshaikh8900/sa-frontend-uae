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
//import { selectOptionsFactory } from 'utils';
const mapStateToProps = (state) => {
	return {
		customer_invoice_list: state.bank_account.customer_invoice_list,
		vendor_invoice_list: state.bank_account.vendor_invoice_list,
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
		console.log(bankId);
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
							date: res.data.date ? res.data.date : '',
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
						console.log(this.state.initValue.customerId);
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
							this.getTransactionCategoryList(id.value);
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
		this.setValue(null);
		this.props.transactionsActions
			.getTransactionCategoryListForExplain(type)
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
			id: option.value,
		};
		this.props.transactionsActions.getVendorInvoiceList(data);
	};

	handleSubmit = (data, resetForm) => {
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
			transactionId,
		} = data;
		console.log(data);
		if (
			(invoiceIdList && coaCategoryId === 2) ||
			(invoiceIdList && coaCategoryId === 10)
		) {
			var result = invoiceIdList.map((o) => ({
				id: o.value,
				remainingInvoiceAmount: 0,
				type: o.type,
			}));
		}
		console.log(result);
		let formData = new FormData();
		formData.append('transactionId', transactionId ? transactionId : '');
		formData.append('bankId ', bankId ? bankId : '');
		formData.append('date', date ? moment(date).format('DD/MM/YYYY') : '');
		formData.append('description', description ? description : '');
		formData.append('amount', amount ? amount : '');
		formData.append('coaCategoryId', coaCategoryId ? coaCategoryId : '');
		if (transactionCategoryId) {
			formData.append(
				'transactionCategoryId',
				transactionCategoryId ? transactionCategoryId : '',
			);
		}
		if (
			(customerId && coaCategoryId === 10) ||
			(customerId && coaCategoryId === 2)
		) {
			formData.append('customerId', customerId ? customerId : '');
		}
		if (vendorId && coaCategoryId === 10) {
			formData.append('vendorId', vendorId ? vendorId : '');
		}
		if (vendorId && coaCategoryId === 10) {
			formData.append('vatId', vatId ? vatId.value : '');
		}
		if (employeeId) {
			formData.append('employeeId', employeeId ? employeeId.value : '');
		}
		if (
			(invoiceIdList && coaCategoryId === 2) ||
			(invoiceIdList && coaCategoryId === 10)
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
		const { customer_invoice_list, vendor_invoice_list } = this.props;
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
													<span className="ml-2">Explain {this.state.id}</span>
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
														coaCategoryId: Yup.string().required(
															'Transaction Type is Required',
														),
														customerId: Yup.string().required(
															'Customer is Required',
														),
														// vendorId: Yup.string().required(
														// 	'Customer is Required',
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
																					: []
																			}
																			value={
																				chartOfAccountCategoryList[0] &&
																				chartOfAccountCategoryList[0].options.find(
																					(option) =>
																						option.value ===
																						+props.values.coaCategoryId,
																				)
																			}
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange('coaCategoryId')(
																						option.value,
																					);
																				} else {
																					props.handleChange('coaCategoryId')(
																						'',
																					);
																				}
																				this.getTransactionCategoryList(
																					option.value,
																				);
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

															<Row>
																{transactionCategoryList.dataList &&
																	props.values.coaCategoryId === 2 && (
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
																					value={
																						transactionCategoryList.dataList &&
																						transactionCategoryList.dataList[0].options.find(
																							(option) =>
																								option.value ===
																								+props.values.customerId,
																						)
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
																	props.values.coaCategoryId === 2 &&
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
																					value={
																						customer_invoice_list.data &&
																						customer_invoice_list.data.find(
																							(option) =>
																								option.value ===
																								+props.values.invoiceIdList,
																						)
																					}
																					// onChange={(option) => {
																					// 	if (option && option.value) {
																					// 		props.handleChange(
																					// 			'invoiceIdList',
																					// 		)(option);
																					// 	} else {
																					// 		props.handleChange(
																					// 			'invoiceIdList',
																					// 		)('');
																					// 	}
																					// }}
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
																{transactionCategoryList.categoriesList &&
																	props.values.coaCategoryId === 10 && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="vatId">Vat</Label>
																				<Select
																					options={
																						transactionCategoryList.dataList
																							? transactionCategoryList
																									.dataList[0].options
																							: []
																					}
																					value={
																						transactionCategoryList.dataList
																							? transactionCategoryList.dataList[0].options.find(
																									(option) =>
																										option.value ===
																										+props.values.vatId,
																							  )
																							: []
																					}
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
																{transactionCategoryList.categoriesList &&
																	props.values.coaCategoryId !== 2 && (
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
																					// value={
																					// 	transactionCategoryList.categoriesList
																					// 		? transactionCategoryList.categoriesList
																					// 				.find(
																					// 					(item) =>
																					// 						item.label ===
																					// 						props.values
																					// 							.transactionCategoryLabel,
																					// 				)
																					// 				.options.find(
																					// 					(item) =>
																					// 						item.value ===
																					// 						+props.values
																					// 							.transactionCategoryId,
																					// 				)
																					// 		: ''
																					// }
																					// value={
																					// 	transactionCategoryList.categoriesList
																					// 		? props.values
																					// 				.transactionCategoryId
																					// 		: ''
																					// }
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
																	{props.values.coaCategoryId === 10 && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="customerId">
																					Customer
																				</Label>
																				<Select
																					options={
																						transactionCategoryList.dataList
																							? transactionCategoryList
																									.dataList[1].options
																							: []
																					}
																					value={
																						transactionCategoryList.dataList &&
																						transactionCategoryList.dataList[1].options.find(
																							(option) =>
																								option.value ===
																								+props.values.customerId,
																						)
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
																	{props.values.coaCategoryId === 12 && (
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
																	{props.values.coaCategoryId === 10 && (
																		<Col lg={4}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="vendorId">Vendor</Label>
																				<Select
																					options={
																						transactionCategoryList.dataList
																							? transactionCategoryList
																									.dataList[2].options
																							: []
																					}
																					value={
																						transactionCategoryList.dataList &&
																						transactionCategoryList.dataList[2].options.find(
																							(option) =>
																								option.value ===
																								+props.values.vendorId,
																						)
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
																							option,
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
																	)}
																	{transactionCategoryList.dataList &&
																		props.values.coaCategoryId === 10 &&
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
																						value={
																							vendor_invoice_list.data &&
																							vendor_invoice_list.data.find(
																								(option) =>
																									option.value ===
																									+props.values.invoiceIdList,
																							)
																						}
																						// onChange={(option) => {
																						// 	if (option && option.value) {
																						// 		props.handleChange(
																						// 			'invoiceIdList',
																						// 		)(option);
																						// 	} else {
																						// 		props.handleChange(
																						// 			'invoiceIdList',
																						// 		)('');
																						// 	}
																						// }}
																						onChange={(option) => {
																							props.handleChange(
																								'invoiceIdList',
																							)(option);
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
