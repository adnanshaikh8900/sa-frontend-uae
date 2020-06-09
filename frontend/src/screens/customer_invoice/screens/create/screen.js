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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as CustomerInvoiceCreateActions from './actions';
import * as CustomerInvoiceActions from '../../actions';

import { CustomerModal } from '../../sections';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';

const mapStateToProps = (state) => {
	return {
		currency_list: state.customer_invoice.currency_list,
		vat_list: state.customer_invoice.vat_list,
		product_list: state.customer_invoice.product_list,
		customer_list: state.customer_invoice.customer_list,
		country_list: state.customer_invoice.country_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		customerInvoiceActions: bindActionCreators(
			CustomerInvoiceActions,
			dispatch,
		),
		customerInvoiceCreateActions: bindActionCreators(
			CustomerInvoiceCreateActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class CreateCustomerInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			discountOptions: [
				{ value: 'FIXED', label: 'Fixed' },
				{ value: 'PERCENTAGE', label: 'Percentage' },
			],
			disabledDate: true,
			data: [
				{
					id: 0,
					description: '',
					quantity: '',
					unitPrice: '',
					vatCategoryId: '',
					subTotal: 0,
					productId: '',
				},
			],
			idCount: 0,
			initValue: {
				receiptAttachmentDescription: '',
				receiptNumber: '',
				contact_po_number: '',
				currency: '',
				invoiceDueDate: '',
				invoiceDate: new Date(),
				contactId: '',
				project: '',
				term: '',
				lineItemsString: [
					{
						id: 0,
						description: '',
						quantity: '',
						unitPrice: '',
						vatCategoryId: '',
						productId: '',
						subTotal: 0,
					},
				],
				invoice_number: '',
				total_net: 0,
				invoiceVATAmount: 0,
				totalAmount: 0,
				notes: '',
				discount: 0,
				discountPercentage: '',
				discountType: { value: 'FIXED', label: 'Fixed' },
			},
			currentData: {},
			contactType: 2,
			openCustomerModal: false,
			selectedContact: '',
			createMore: false,
			fileName: '',
			term: '',
			selectedType: { value: 'FIXED', label: 'Fixed' },
			discountPercentage: '',
			discountAmount: 0,
		};

		this.formRef = React.createRef();

		this.file_size = 1024000;
		this.supported_format = [
			'',
			'text/plain',
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];

		this.termList = [
			{ label: 'Net 7', value: 'NET_7' },
			{ label: 'Net 10', value: 'NET_10' },
			{ label: 'Net 30', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
		this.regEx = /^[0-9\b]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
	}

	// renderActions (cell, row) {
	//   return (
	//     <Button
	//       size="sm"
	//       color="primary"
	//       className="btn-brand icon"
	//     >
	//       <i className="fas fa-trash"></i>
	//     </Button>
	//   )
	// }

	renderProductName = (cell, row) => {
		return (
			<div className="d-flex align-items-center">
				<Input type="hidden" className="mr-1"></Input>
			</div>
		);
	};

	renderDescription = (cell, row, props) => {
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.description`}
				render={({ field, form }) => (
					<Input
						type="text"
						value={row['description'] !== '' ? row['description'] : ''}
						onChange={(e) => {
							this.selectItem(e, row, 'description', form, field);
						}}
						placeholder="Description"
						className={`form-control ${
							props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].description &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].description
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	};

	renderQuantity = (cell, row, props) => {
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.quantity`}
				render={({ field, form }) => (
					<Input
						type="text"
						value={row['quantity'] !== 0 ? row['quantity'] : 0}
						onChange={(e) => {
							if (e.target.value === '' || this.regEx.test(e.target.value)) {
								this.selectItem(e, row, 'quantity', form, field, props);
							}
						}}
						placeholder="Quantity"
						className={`form-control  ${
							props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].quantity
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	};

	renderUnitPrice = (cell, row, props) => {
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.unitPrice`}
				render={({ field, form }) => (
					<Input
						type="text"
						value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
						onChange={(e) => {
							if (e.target.value === '' || this.regEx.test(e.target.value)) {
								this.selectItem(e, row, 'unitPrice', form, field, props);
							}
						}}
						placeholder="Unit Price"
						className={`form-control ${
							props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].unitPrice &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].unitPrice
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	};

	renderSubTotal = (cell, row) => {
		return <label className="mb-0">{row.subTotal}</label>;
	};

	setDate = (props, value) => {
		const { term } = this.state;
		const val = term.value.split('_');
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
		const values = value
			? value
			: moment(props.values.invoiceDate, 'DD/MM/YYYY').toDate();
		if (temp && values) {
			const date = moment(values)
				.add(temp - 1, 'days')
				.format('DD/MM/YYYY');
			props.setFieldValue('invoiceDueDate', date, true);
		}
	};

	componentDidMount = () => {
		this.getInitialData();
	};

	getInitialData = () => {
		this.getInvoiceNo();
		this.props.customerInvoiceActions.getCustomerList(this.state.contactType);
		this.props.customerInvoiceActions.getCurrencyList();
		this.props.customerInvoiceActions.getCountryList();
		this.props.customerInvoiceActions.getVatList();
		this.props.customerInvoiceActions.getProductList();
	};

	addRow = () => {
		const data = [...this.state.data];
		this.setState(
			{
				data: data.concat({
					id: this.state.idCount + 1,
					description: '',
					quantity: '',
					unitPrice: '',
					vatCategoryId: '',
					productId: '',
					subTotal: 0,
				}),
				idCount: this.state.idCount + 1,
			},
			() => {
				this.formRef.current.setFieldValue(
					'lineItemsString',
					this.state.data,
					true,
				);
				this.formRef.current.setFieldTouched(
					`lineItemsString[${this.state.data.length - 1}]`,
					false,
					true,
				);
			},
		);
	};

	selectItem = (e, row, name, form, field, props) => {
		e.preventDefault();
		let data = this.state.data;
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj[`${name}`] = e.target.value;
				idx = index;
			}
			return obj;
		});
		if (
			name === 'unitPrice' ||
			name === 'vatCategoryId' ||
			name === 'quantity'
		) {
			form.setFieldValue(
				field.name,
				this.state.data[parseInt(idx, 10)][`${name}`],
				true,
			);
			this.updateAmount(data, props);
		} else {
			this.setState({ data }, () => {
				form.setFieldValue(
					field.name,
					this.state.data[parseInt(idx, 10)][`${name}`],
					true,
				);
			});
		}
	};

	renderVat = (cell, row, props) => {
		const { vat_list } = this.props;
		let vatList = vat_list.length
			? [{ id: '', vat: 'Select Vat' }, ...vat_list]
			: vat_list;
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.vatCategoryId`}
				render={({ field, form }) => (
					<Input
						type="select"
						onChange={(e) => {
							this.selectItem(e, row, 'vatCategoryId', form, field, props);
							// this.formRef.current.props.handleChange(field.name)(e.value)
						}}
						value={row.vatCategoryId}
						className={`form-control ${
							props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].vatCategoryId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].vatCategoryId
								? 'is-invalid'
								: ''
						}`}
					>
						{vatList
							? vatList.map((obj) => {
									// obj.name = obj.name === 'default' ? '0' : obj.name
									return (
										<option value={obj.id} key={obj.id}>
											{obj.vat}
										</option>
									);
							  })
							: ''}
					</Input>
				)}
			/>
		);
	};
	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.data;
		const result = product_list.find(
			(item) => item.id === parseInt(e.target.value),
		);
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj['unitPrice'] = result.unitPrice;
				obj['vatCategoryId'] = result.vatCategoryId;
				obj['description'] = result.description;
				idx = index;
			}
			return obj;
		});
		form.setFieldValue(
			`lineItemsString.${idx}.vatCategoryId`,
			result.vatCategoryId,
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.unitPrice`,
			result.unitPrice,
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.description`,
			result.description,
			true,
		);
	};

	renderProduct = (cell, row, props) => {
		const { product_list } = this.props;
		let productList = product_list.length
			? [{ id: '', name: 'Select Product' }, ...product_list]
			: product_list;
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
		if (productList.length > 0) {
			return (
				<Field
					name={`lineItemsString.${idx}.productId`}
					render={({ field, form }) => (
						<Input
							type="select"
							onChange={(e) => {
								this.selectItem(e, row, 'productId', form, field, props);
								this.prductValue(e, row, 'productId', form, field, props);
								// this.formRef.current.props.handleChange(field.name)(e.value)
							}}
							value={row.productId}
							className={`form-control ${
								props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)].productId &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)].productId
									? 'is-invalid'
									: ''
							}`}
						>
							{productList
								? productList.map((obj) => {
										// obj.name = obj.name === 'default' ? '0' : obj.name
										return (
											<option value={obj.id} key={obj.id}>
												{obj.name}
											</option>
										);
								  })
								: ''}
						</Input>
					)}
				/>
			);
		} else {
			return (
				<div
					className={`addProduct ${
						props.errors.lineItemsString && props.touched.lineItemsString
							? 'is-invalid'
							: ''
					}`}
					onClick={() => {
						this.props.history.push('/admin/master/product');
					}}
				>
					Please add product
				</div>
			);
		}
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

	updateAmount = (data, props) => {
		const { vat_list } = this.props;
		const { discountPercentage, discountAmount } = this.state;
		let total_net = 0;
		let total = 0;
		let total_vat = 0;
		data.map((obj) => {
			const index =
				obj.vatCategoryId !== ''
					? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
					: '';
			const vat = index !== '' ? vat_list[`${index}`].vat : 0;
			// let val = (((+obj.unitPrice) * vat) / 100)
			let val = (+obj.unitPrice * vat * obj.quantity) / 100;
			obj.subTotal =
				obj.unitPrice && obj.vatCategoryId
					? +obj.unitPrice * obj.quantity + val
					: 0;
			total_net = +(total_net + +obj.unitPrice * obj.quantity);
			total_vat = +(total_vat + val);
			total = total_vat + total_net;
			return obj;
		});

		const discount =
			props.values.discountType.value === 'PERCENTAGE'
				? +((total_net * discountPercentage) / 100).toFixed(2)
				: discountAmount;
		this.setState(
			{
				initValue: {
					...this.state.initValue,
					...{
						total_net,
						invoiceVATAmount: total_vat,
						discount: total_net > discount ? discount : 0,
						totalAmount: total_net > discount ? total - discount : total,
					},
				},
			},
			() => {
				console.log(this.state.data);
				if (props.values.discountType.value === 'PERCENTAGE') {
					this.formRef.current.setFieldValue('discount', discount);
				}
			},
		);
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

	handleSubmit = (data, resetForm) => {
		const {
			receiptAttachmentDescription,
			receiptNumber,
			contact_po_number,
			currency,
			invoiceDueDate,
			invoiceDate,
			contactId,
			project,
			invoice_number,
			discount,
			discountType,
			discountPercentage,
			notes,
		} = data;
		console.log(data);
		console.log(
			moment(moment(invoiceDate).format('DD/MM/YYYY'), 'DD/MM/YYYY').toDate(),
		);
		const { term } = this.state;
		const formData = new FormData();
		formData.append(
			'referenceNumber',
			invoice_number !== null ? invoice_number : '',
		);
		formData.append(
			'invoiceDueDate',
			invoiceDueDate ? moment(invoiceDueDate, 'DD/MM/YYYY').toDate() : null,
		);
		formData.append(
			'invoiceDate',
			invoiceDate
				? moment(
						moment(invoiceDate).format('DD/MM/YYYY'),
						'DD/MM/YYYY',
				  ).toDate()
				: null,
		);
		formData.append(
			'receiptNumber',
			receiptNumber !== null ? receiptNumber : '',
		);
		formData.append(
			'contactPoNumber',
			contact_po_number !== null ? contact_po_number : '',
		);
		formData.append(
			'receiptAttachmentDescription',
			receiptAttachmentDescription !== null ? receiptAttachmentDescription : '',
		);
		formData.append('notes', notes !== null ? notes : '');
		formData.append('type', 2);
		formData.append('lineItemsString', JSON.stringify(this.state.data));
		formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
		formData.append('totalAmount', this.state.initValue.totalAmount);
		formData.append('discount', discount);
		if (discountType && discountType.value) {
			formData.append('discountType', discountType.value);
		}
		if (term && term.value) {
			formData.append('term', term.value);
		}
		if (discountType.value === 'PERCENTAGE') {
			formData.append('discountPercentage', discountPercentage);
		}
		if (contactId && contactId.value) {
			formData.append('contactId', contactId.value);
		}
		if (currency !== null && currency.value) {
			formData.append('currencyCode', currency.value);
		}
		if (project !== null && project.value) {
			formData.append('projectId', project.value);
		}
		if (this.uploadFile && this.uploadFile.files && this.uploadFile.files[0]) {
			formData.append('attachmentFile', this.uploadFile.files[0]);
		}
		//console.log(this.state.data);
		this.props.customerInvoiceCreateActions
			.createInvoice(formData)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'New Invoice Created Successfully.',
				);
				if (this.state.createMore) {
					this.setState(
						{
							createMore: false,
							selectedContact: '',
							term: '',
							data: [
								{
									id: 0,
									description: '',
									quantity: '',
									unitPrice: '',
									vatCategoryId: '',
									subTotal: 0,
									productId: '',
								},
							],
							initValue: {
								...this.state.initValue,
								...{
									total_net: 0,
									invoiceVATAmount: 0,
									totalAmount: 0,
									discountType: '',
									discount: 0,
									discountPercentage: '',
								},
							},
						},
						() => {
							resetForm(this.state.initValue);
							this.getInvoiceNo();
							this.formRef.current.setFieldValue(
								'lineItemsString',
								this.state.data,
								false,
							);
						},
					);
				} else {
					this.props.history.push('/admin/revenue/customer-invoice');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	openCustomerModal = (props) => {
		this.setState({ openCustomerModal: true });
	};

	openInvoicePreviewModal = (props) => {
		this.setState({ openInvoicePreviewModal: true });
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
		this.formRef.current.setFieldValue('contactId', option, true);
	};

	closeCustomerModal = (res) => {
		if (res) {
			this.props.customerInvoiceActions.getCustomerList(this.state.contactType);
		}
		this.setState({ openCustomerModal: false });
	};

	closeInvoicePreviewModal = (res) => {
		this.setState({ openInvoicePreviewModal: false });
	};

	getInvoiceNo = () => {
		this.props.customerInvoiceCreateActions.getInvoiceNo().then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
						...this.state.initValue,
						...{ invoice_number: res.data },
					},
				});
				this.formRef.current.setFieldValue('invoice_number', res.data, true);
			}
		});
	};

	render() {
		const { data, discountOptions, initValue } = this.state;
		const { currency_list, customer_list } = this.props;
		return (
			<div className="create-customer-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-address-book" />
												<span className="ml-2">Create Invoice</span>
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
													invoice_number: Yup.string().required(
														'Invoice Number is Required',
													),
													contactId: Yup.string().required(
														'Customer is Required',
													),
													term: Yup.string().required('Term is Required'),
													currency: Yup.string().required(
														'Currency is Required',
													),
													invoiceDate: Yup.string().required(
														'Invoice Date is Required',
													),
													// invoiceDueDate: Yup.string()
													// 	.required('Invoice Due Date is Required'),
													lineItemsString: Yup.array()
														.required(
															'Atleast one invoice sub detail is mandatory',
														)
														.of(
															Yup.object().shape({
																description: Yup.string().required(
																	'Value is Required',
																),
																quantity: Yup.string()
																	.required('Value is Required')
																	.test(
																		'quantity',
																		'Quantity Should be Greater than 1',
																		(value) => {
																			if (value > 0) {
																				return true;
																			} else {
																				return false;
																			}
																		},
																	),
																unitPrice: Yup.string()
																	.required('Value is Required')
																	.test(
																		'Unit Price',
																		'Unit Price Should be Greater than 1',
																		(value) => {
																			if (value > 0) {
																				return true;
																			} else {
																				return false;
																			}
																		},
																	),
																vatCategoryId: Yup.string().required(
																	'Value is Required',
																),
																productId: Yup.string().required(
																	'Product is Required',
																),
															}),
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
																		this.supported_format.includes(value.type))
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
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="invoice_number">
																		<span className="text-danger">*</span>
																		Invoice Number
																	</Label>
																	<Input
																		type="text"
																		id="invoice_number"
																		name="invoice_number"
																		placeholder="Invoice Number"
																		value={props.values.invoice_number}
																		onChange={(value) => {
																			props.handleChange('invoice_number')(
																				value,
																			);
																		}}
																		className={
																			props.errors.invoice_number &&
																			props.touched.invoice_number
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.invoice_number &&
																		props.touched.invoice_number && (
																			<div className="invalid-feedback">
																				{props.errors.invoice_number}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="contactId">
																		<span className="text-danger">*</span>
																		Customer Name
																	</Label>
																	<Select
																		id="contactId"
																		name="contactId"
																		options={
																			customer_list
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						customer_list,
																						'Customer',
																				  )
																				: []
																		}
																		value={props.values.contactId}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('contactId')(option);
																			} else {
																				props.handleChange('contactId')('');
																			}
																		}}
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
																<Button
																	type="button"
																	color="primary"
																	className="btn-square mr-3 mb-3"
																	onClick={(e, props) => {
																		this.openCustomerModal(props);
																	}}
																>
																	<i className="fa fa-plus"></i> Add a Customer
																</Button>
															</Col>
														</Row>
														<hr />
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="term">
																		<span className="text-danger">*</span>Terms{' '}
																		<i className="fa fa-question-circle"></i>
																	</Label>
																	<Select
																		options={
																			this.termList
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						this.termList,
																						'Terms',
																				  )
																				: []
																		}
																		id="term"
																		name="term"
																		value={this.state.term}
																		onChange={(option) => {
																			props.handleChange('term')(option);
																			if (option.value === '') {
																				this.setState({
																					term: option,
																				});
																				props.setFieldValue(
																					'invoiceDueDate',
																					'',
																				);
																			} else {
																				this.setState(
																					{
																						term: option,
																					},
																					() => {
																						this.setDate(props, '');
																					},
																				);
																			}
																		}}
																		className={`${
																			props.errors.term && props.touched.term
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.term && props.touched.term && (
																		<div className="invalid-feedback">
																			{props.errors.term}
																		</div>
																	)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">*</span>
																		Invoice Date
																	</Label>
																	<DatePicker
																		id="invoiceDate"
																		name="invoiceDate"
																		placeholderText="Invoice Date"
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd/MM/yyyy"
																		dropdownMode="select"
																		value={props.values.invoiceDate}
																		selected={props.values.invoiceDate}
																		onChange={(value) => {
																			props.handleChange('invoiceDate')(value);
																			this.setDate(props, value);
																		}}
																		className={`form-control ${
																			props.errors.invoiceDate &&
																			props.touched.invoiceDate
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.invoiceDate &&
																		props.touched.invoiceDate && (
																			<div className="invalid-feedback">
																				{props.errors.invoiceDate}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="due_date">
																		Invoice Due Date
																	</Label>
																	<div>
																		<DatePicker
																			className="form-control"
																			id="invoiceDueDate"
																			name="invoiceDueDate"
																			placeholderText="Invoice Due Date"
																			showMonthDropdown
																			showYearDropdown
																			disabled
																			dateFormat="dd/MM/yyyy"
																			dropdownMode="select"
																			value={props.values.invoiceDueDate}
																			onChange={(value) => {
																				props.handleChange('invoiceDueDate')(
																					value,
																				);
																			}}
																			// className={`form-control ${props.errors.invoiceDueDate && props.touched.invoiceDueDate ? "is-invalid" : ""}`}
																		/>
																		{/* {props.errors.invoiceDueDate && props.touched.invoiceDueDate && (
																			<div className="invalid-feedback">{props.errors.invoiceDueDate}</div>
																		)} */}
																	</div>
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="currency">
																		<span className="text-danger">*</span>
																		Currency
																	</Label>
																	<Select
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
																		id="currency"
																		name="currency"
																		value={props.values.currency}
																		onChange={(option) =>
																			props.handleChange('currency')(option)
																		}
																		className={`${
																			props.errors.currency &&
																			props.touched.currency
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.currency &&
																		props.touched.currency && (
																			<div className="invalid-feedback">
																				{props.errors.currency}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="contact_po_number">
																		Contact PO Number
																	</Label>
																	<Input
																		type="text"
																		id="contact_po_number"
																		name="contact_po_number"
																		value={props.values.contact_po_number}
																		placeholder="Contact PO Number"
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExBoth.test(option.target.value)
																			) {
																				props.handleChange('contact_po_number')(
																					option,
																				);
																			}
																		}}
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
																				Reciept Number
																			</Label>
																			<Input
																				type="text"
																				id="receiptNumber"
																				name="receiptNumber"
																				placeholder="Reciept Number"
																				onChange={(option) => {
																					if (
																						option.target.value === '' ||
																						this.regExBoth.test(
																							option.target.value,
																						)
																					) {
																						props.handleChange('receiptNumber')(
																							option,
																						);
																					}
																				}}
																				value={props.values.receiptNumber}
																			/>
																		</FormGroup>
																	</Col>
																</Row>
																<Row>
																	<Col lg={12}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="receiptAttachmentDescription">
																				Attachment Description
																			</Label>
																			<Input
																				type="textarea"
																				name="receiptAttachmentDescription"
																				id="receiptAttachmentDescription"
																				rows="5"
																				placeholder="1024 characters..."
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
																								this.handleFileChange(e, props);
																							}}
																						/>
																						{this.state.fileName}
																					</div>
																				)}
																			/>
																			{props.errors.attachmentFile &&
																				props.touched.attachmentFile && (
																					<div className="invalid-file">
																						{props.errors.attachmentFile}
																					</div>
																				)}
																		</FormGroup>
																	</Col>
																</Row>
															</Col>
														</Row>

														<hr />
														<Row>
															<Col lg={12} className="mb-3">
																<Button
																	color="primary"
																	className={`btn-square mr-3 ${
																		this.checkedRow() ? `disabled-cursor` : ``
																	} `}
																	onClick={this.addRow}
																	title={
																		this.checkedRow()
																			? `Please add detail to add more`
																			: ''
																	}
																	disabled={this.checkedRow() ? true : false}
																>
																	<i className="fa fa-plus"></i> Add More
																</Button>
															</Col>
														</Row>
														<Row>
															{props.errors.lineItemsString &&
																typeof props.errors.lineItemsString ===
																	'string' && (
																	<div
																		className={
																			props.errors.lineItemsString
																				? 'is-invalid'
																				: ''
																		}
																	>
																		<div className="invalid-feedback">
																			{props.errors.lineItemsString}
																		</div>
																	</div>
																)}
															<Col lg={12}>
																<BootstrapTable
																	options={this.options}
																	data={data}
																	version="4"
																	hover
																	keyField="id"
																	className="invoice-create-table"
																>
																	<TableHeaderColumn
																		width="55"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderActions(cell, rows, props)
																		}
																	></TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="product"
																		dataFormat={(cell, rows) =>
																			this.renderProduct(cell, rows, props)
																		}
																	>
																		Product
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="description"
																		dataFormat={(cell, rows) =>
																			this.renderDescription(cell, rows, props)
																		}
																	>
																		Description
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="quantity"
																		dataFormat={(cell, rows) =>
																			this.renderQuantity(cell, rows, props)
																		}
																	>
																		Quantity
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="unitPrice"
																		dataFormat={(cell, rows) =>
																			this.renderUnitPrice(cell, rows, props)
																		}
																	>
																		Unit Price (All)
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="vat"
																		dataFormat={(cell, rows) =>
																			this.renderVat(cell, rows, props)
																		}
																	>
																		Vat (%)
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="sub_total"
																		dataFormat={this.renderSubTotal}
																		className="text-right"
																		columnClassName="text-right"
																	>
																		Sub Total (All)
																	</TableHeaderColumn>
																</BootstrapTable>
															</Col>
														</Row>
														{this.state.data.length > 0 ? (
															<Row>
																<Col lg={8}>
																	<FormGroup className="py-2">
																		<Label htmlFor="notes">Notes</Label>
																		<Input
																			type="textarea"
																			name="notes"
																			id="notes"
																			rows="6"
																			placeholder="notes..."
																			onChange={(option) =>
																				props.handleChange('notes')(option)
																			}
																			value={props.values.notes}
																		/>
																	</FormGroup>
																</Col>
																<Col lg={4}>
																	<div className="">
																		<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<FormGroup>
																						<Label htmlFor="discountType">
																							Discount Type
																						</Label>
																						<Select
																							className="select-default-width"
																							options={discountOptions}
																							id="discountType"
																							name="discountType"
																							value={props.values.discountType}
																							onChange={(item) => {
																								props.handleChange(
																									'discountType',
																								)(item);
																								props.handleChange(
																									'discountPercentage',
																								)('');
																								props.setFieldValue(
																									'discount',
																									0,
																								);
																								this.setState(
																									{
																										discountPercentage: '',
																										discountAmount: 0,
																									},
																									() => {
																										this.updateAmount(
																											this.state.data,
																											props,
																										);
																									},
																								);
																							}}
																						/>
																					</FormGroup>
																				</Col>
																				{props.values.discountType.value ===
																				'PERCENTAGE' ? (
																					<Col lg={6}>
																						<FormGroup>
																							<Label htmlFor="discountPercentage">
																								Percentage
																							</Label>
																							<Input
																								id="discountPercentage"
																								name="discountPercentage"
																								placeholder="Discount Percentage"
																								type="text"
																								value={
																									props.values
																										.discountPercentage
																								}
																								onChange={(e) => {
																									if (
																										e.target.value === '' ||
																										this.regEx.test(
																											e.target.value,
																										)
																									) {
																										props.handleChange(
																											'discountPercentage',
																										)(e);
																										this.setState(
																											{
																												discountPercentage:
																													e.target.value,
																											},
																											() => {
																												this.updateAmount(
																													this.state.data,
																													props,
																												);
																											},
																										);
																									}
																								}}
																							/>
																						</FormGroup>
																					</Col>
																				) : null}
																			</Row>
																			<Row>
																				<Col lg={6} className="mt-4">
																					<FormGroup>
																						<Label htmlFor="discount">
																							Discount Amount
																						</Label>
																						<Input
																							id="discount"
																							name="discount"
																							type="text"
																							disabled={
																								props.values.discountType &&
																								props.values.discountType
																									.value === 'Percentage'
																									? true
																									: false
																							}
																							placeholder="Discount Amounts"
																							value={props.values.discount}
																							onChange={(option) => {
																								if (
																									option.target.value === '' ||
																									this.regEx.test(
																										option.target.value,
																									)
																								) {
																									props.handleChange(
																										'discount',
																									)(option);
																									this.setState(
																										{
																											discountAmount: +option
																												.target.value,
																										},
																										() => {
																											this.updateAmount(
																												this.state.data,
																												props,
																											);
																										},
																									);
																								}
																							}}
																						/>
																					</FormGroup>
																				</Col>
																			</Row>
																		</div>
																		<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																						Total Net
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
																						{initValue.total_net.toFixed(2)}
																					</label>
																				</Col>
																			</Row>
																		</div>
																		<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																						Total Vat
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
																						{initValue.invoiceVATAmount.toFixed(
																							2,
																						)}
																					</label>
																				</Col>
																			</Row>
																		</div>
																		<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																						Discount
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
																						{this.state.initValue.discount.toFixed(
																							2,
																						)}
																					</label>
																				</Col>
																			</Row>
																		</div>
																		<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																						Total
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
																						{initValue.totalAmount.toFixed(2)}
																					</label>
																				</Col>
																			</Row>
																		</div>
																	</div>
																</Col>
															</Row>
														) : null}
														<Row>
															<Col
																lg={12}
																className="mt-5 d-flex flex-wrap align-items-center justify-content-between"
															>
																<FormGroup className="text-right w-100">
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
																				{
																					createMore: true,
																				},
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
																				'/admin/revenue/customer-invoice',
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
				<CustomerModal
					openCustomerModal={this.state.openCustomerModal}
					closeCustomerModal={(e) => {
						this.closeCustomerModal(e);
					}}
					getCurrentUser={(e) => this.getCurrentUser(e)}
					createCustomer={this.props.customerInvoiceActions.createCustomer}
					currency_list={this.props.currency_list}
					country_list={this.props.country_list}
					getStateList={this.props.customerInvoiceActions.getStateList}
				/>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateCustomerInvoice);
