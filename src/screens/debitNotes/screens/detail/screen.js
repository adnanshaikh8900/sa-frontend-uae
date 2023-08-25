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
	UncontrolledTooltip
} from 'reactstrap';
import { Checkbox } from '@material-ui/core';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as CreditNotesDetailActions from './actions';
import * as ProductActions from '../../../product/actions';
import * as CreditNotesActions from '../../actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';

import { Loader, ConfirmDeleteModal, Currency } from 'components';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';
import API_ROOT_URL from '../../../../constants/config';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import Switch from "react-switch";


const mapStateToProps = (state) => {
	return {
		project_list: state.customer_invoice.project_list,
		contact_list: state.customer_invoice.contact_list,
		currency_list: state.customer_invoice.currency_list,
		vat_list: state.customer_invoice.vat_list,
		product_list: state.customer_invoice.product_list,
		excise_list: state.customer_invoice.excise_list,
		customer_list: state.customer_invoice.customer_list,
		country_list: state.customer_invoice.country_list,
		universal_currency_list: state.common.universal_currency_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
		creditNotesActions: bindActionCreators(
			CreditNotesActions,
			dispatch,
		),
		creditNotesDetailActions: bindActionCreators(
			CreditNotesDetailActions,
			dispatch,
		),
		productActions: bindActionCreators(ProductActions, dispatch),
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
class DetailDebitNote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dialog: false,
			disabled: false,
			disabled1: false,
			discountOptions: [
				{ value: 'FIXED', label: '₹' },
				{ value: 'PERCENTAGE', label: '%' },
			],
			discount_option: '',
			data: [],
			current_customer_id: null,
			initValue: {
				total_excise: 0,
				CESS_totalAmount: 0,
				CGST_totalAmount: 0,
				SGST_totalAmount: 0,
				IGST_totalAmount: 0,
				totalTaxAmount: 0
			},
			contactType: 2,
			openCustomerModal: false,
			openProductModal: false,
			selectedContact: '',
			term: '',
			placeOfSupplyId: '',
			selectedType: '',
			discountPercentage: '',
			discountAmount: 0,
			fileName: '',
			basecurrency: [],
			customer_currency: '',
			showInvoiceNumber: false
		};

		// this.options = {
		//   paginationPosition: 'top'
		// }
		this.reasonList = [
			{ label: 'Cancellation of Sales', value: '1' },
			{ label: 'Expiry or damage', value: '2' },
			{ label: 'Customer’s dissatisfaction', value: '3' },
			{ label: 'Product unsatisfactory', value: '4' },
			{ label: 'Sales Return', value: '5' },
			{ label: 'Service Unsatisfactory', value: '6' },
			{ label: 'Post Sales Discount', value: '7' },
			{ label: 'Change in the Quantity', value: '8' },
			{ label: 'Correction in Invoice', value: '9' },
			{ label: 'Refund', value: '10' },
			{ label: 'Wrong products dispatched to the customer.', value: '11' },
			{ label: 'Others', value: '12' },
		];
		this.formRef = React.createRef();
		this.termList = [
			{ label: 'Net 7 Days', value: 'NET_7' },
			{ label: 'Net 10 Days', value: 'NET_10' },
			{ label: 'Net 30 Days', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
		this.placelist = [
			{ label: 'Abu Dhabi', value: '1' },
			{ label: 'Dubai', value: '2' },
			{ label: 'Sharjah', value: '3' },
			{ label: 'Ajman', value: '4' },
			{ label: 'Umm Al Quwain', value: '5' },
			{ label: 'Ras al-Khaimah', value: '6' },
			{ label: 'Fujairah', value: '7' },
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
	salesCategory = () => {
		try {
			this.props.productActions
				.getTransactionCategoryListForSalesProduct('2')
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								salesCategory: res.data,
							},
							() => {
								console.log(this.state.salesCategory);
							},
						);
					}
				});
		} catch (err) {
			console.log(err);
		}
	};


	initializeData = () => {

		if (this.props.location.state && this.props.location.state.id) {
			//INV number
			this.props.creditNotesActions
				.getInvoicesForCNById(this.props.location.state.id)
				.then((res) => {

					if (res.status === 200) {
						if (res.data.length && res.data.length != 0)
							this.setState(
								{
									invoiceNumber: res.data[0].invoiceNumber,
									showInvoiceNumber: true
								},
								() => { },
							);
					}
				})
			//CN details
			this.props.creditNotesDetailActions
				.getCreditNoteById(this.props.location.state.id,
					this.props.location.state.isCNWithoutProduct ? this.props.location.state.isCNWithoutProduct : false)
				.then((res) => {
					if (res.status === 200) {
						this.getCompanyCurrency();
						// this.props.creditNotesActions.getVatList();
						this.props.creditNotesActions.getCustomerList(
							this.state.contactType,
						).then((res1) => {
							if (res1.status === 200) {
								this.setState({ customer_list: res1.data });

								this.getTaxTreatment(res.data.contactId ? res.data.contactId : '');
							}
						});
						// this.props.creditNotesActions.getExciseList();
						this.props.currencyConvertActions.getCurrencyConversionList();
						this.props.creditNotesActions.getCountryList();
						// this.props.creditNotesActions.getProductList();
						this.getProductListByPlaceOfSupplyId(res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '', undefined)

						this.setState(
							{
								current_customer_id: this.props.location.state.id,
								initValue: {
									receiptAttachmentDescription: res.data
										.receiptAttachmentDescription
										? res.data.receiptAttachmentDescription
										: '',
									receiptNumber: res.data.receiptNumber
										? res.data.receiptNumber
										: '',
									contact_po_number: res.data.contactPoNumber
										? res.data.contactPoNumber
										: '',

									currency: res.data.currencyCode ? res.data.currencyCode : '',
									exchangeRate: res.data.exchangeRate ? res.data.exchangeRate : '',
									currencyName: res.data.currencyName ? res.data.currencyName : '',
									// invoiceDueDate: res.data.invoiceDueDate
									// 	? moment(res.data.invoiceDueDate).format('DD-MM-YYYY')
									// 	: '',
									invoiceDate: res.data.creditNoteDate
										? moment(res.data.creditNoteDate).format('DD-MM-YYYY')
										: '',
									contactId: res.data.contactId ? res.data.contactId : '',
									project: res.data.projectId ? res.data.projectId : '',
									creditNoteNumber: res.data.creditNoteNumber
										? res.data.creditNoteNumber
										: '',
									total_net: 0,
									invoiceVATAmount: res.data.totalVatAmount
										? res.data.totalVatAmount
										: 0,
									totalAmount: res.data.totalAmount ? res.data.totalAmount : 0,
									creditAmount: res.data.totalAmount ? res.data.totalAmount : 0,
									notes: res.data.notes ? res.data.notes : '',
									lineItemsString: res.data.lineItemModelList
										? res.data.lineItemModelList
										: [],
									discount: res.data.discount ? res.data.discount : 0,
									discountPercentage: res.data.discountPercentage
										? res.data.discountPercentage
										: '',
									discountType: res.data.discountType
										? res.data.discountType
										: '',
									term: res.data.term ? res.data.term : '',
									placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
									fileName: res.data.fileName ? res.data.fileName : '',
									filePath: res.data.filePath ? res.data.filePath : '',
									total_excise: res.data.totalExciseTaxAmount ? res.data.totalExciseTaxAmount : 0,
									CESS_totalAmount: res.data.totalCess ? res.data.totalCess : 0,
									IGST_totalAmount: res.data.totalIgst ? res.data.totalIgst : 0,
									CGST_totalAmount: res.data.totalCgst ? res.data.totalCgst : 0,
									SGST_totalAmount: res.data.totalSgst ? res.data.totalSgst : 0,
									total_net: res.data.subTotal ? res.data.subTotal : 0,
									totalTaxAmount: res.data.totalTaxAmount ? res.data.totalTaxAmount : 0,
									reason: res.data.reason,
								},

								// customer_taxTreatment_des : res.data.taxTreatment ? res.data.taxTreatment : '',
								checked: res.data.exciseType ? res.data.exciseType : res.data.exciseType,
								discountAmount: res.data.discount ? res.data.discount : 0,
								total_excise: res.data.totalExciseTaxAmount ? res.data.totalExciseTaxAmount : 0,
								discountPercentage: res.data.discountPercentage
									? res.data.discountPercentage
									: '',
								data: res.data.lineItemModelList
									? res.data.lineItemModelList
									: [],
								selectedContact: res.data.contactId ? res.data.contactId : '',
								term: res.data.term ? res.data.term : '',
								placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
								loading: false,
								shippingCharges: res.data.shippingCharges ? res.data.shippingCharges : 0
							},
							() => {
								if (this.state.data.length > 0) {
									this.updateAmount(this.state.data);
									const { data } = this.state;
									const idCount =
										data.length > 0
											? Math.max.apply(
												Math,
												data.map((item) => {
													return item.id;
												}),
											)
											: 0;
									this.setState({
										idCount,
									});
								} else {
									this.setState({
										idCount: 0,
									});
								}
							},
						);
						this.getCurrency(res.data.contactId)
					}
				});
		} else {
			this.props.history.push('/admin/expense/debit-notes');
		}
	};

	calTotalNet = (data) => {
		let total_net = 0;
		data.map((obj) => {
			if (obj.isExciseTaxExclusive === false) {

				total_net = +(total_net + +obj.unitPrice * obj.quantity);

			} else {

				total_net = +(total_net + +(obj.unitPrice + obj.exciseAmount) * obj.quantity);

			}
			return obj;

		});
		total_net = total_net - this.state.discountAmount
		this.setState({
			initValue: Object.assign(this.state.initValue, { total_net }),
		});
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
						disabled
						type="text"
						maxLength="250"
						value={row['description'] !== '' ? row['description'] : ''}
						onChange={(e) => {
							this.selectItem(e.target.value, row, 'description', form, field);
						}}
						placeholder={strings.Description}
						className={`form-control 
            ${props.errors.lineItemsString &&
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

	renderExcise = (cell, row, props) => {
		const { excise_list } = this.props;
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.exciseTaxId`}
				render={({ field, form }) => (
					<Select
						styles={customStyles}
						isDisabled
						options={
							excise_list
								? selectOptionsFactory.renderOptions(
									'name',
									'id',
									excise_list,
									'Excise',
								)
								: []
						}
						value={

							excise_list &&
							selectOptionsFactory
								.renderOptions('name', 'id', excise_list, 'Excise')
								.find((option) => option.value === +row.exciseTaxId)
						}
						id="exciseTaxId"
						placeholder={strings.Select + strings.Vat}
						onChange={(e) => {

							this.selectItem(
								e.value,
								row,
								'exciseTaxId',
								form,
								field,
								props,
							);

							this.updateAmount(
								this.state.data,
								props,
							);
						}}
						className={`${props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)].exciseTaxId &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)].exciseTaxId
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
					<div>
						<Input
							type="text"
							min="0"
							maxLength="10"
							value={row['quantity'] !== 0 ? row['quantity'] : 0}
							onChange={(e) => {
								if (e.target.value === '' || this.regDecimal.test(e.target.value)) {
									this.selectItem(
										e.target.value,
										row,
										'quantity',
										form,
										field,
										props,
									);
								}
							}}
							placeholder={strings.Quantity}
							className={`form-control 
           						${props.errors.lineItemsString &&
									props.errors.lineItemsString[parseInt(idx, 10)] &&
									props.errors.lineItemsString[parseInt(idx, 10)]
										.quantity &&
									Object.keys(props.touched).length > 0 &&
									props.touched.lineItemsString &&
									props.touched.lineItemsString[parseInt(idx, 10)] &&
									props.touched.lineItemsString[parseInt(idx, 10)]
										.quantity
									? 'is-invalid'
									: ''
								}`}
						/>
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].quantity && (
								<div className="invalid-feedback">
									{props.errors.lineItemsString[parseInt(idx, 10)].quantity}
								</div>
							)}
					</div>
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
						disabled
						value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
						onChange={(e) => {
							if (
								e.target.value === '' ||
								this.regDecimal.test(e.target.value)
							) {
								this.selectItem(
									e.target.value,
									row,
									'unitPrice',
									form,
									field,
									props,
								);
							}
						}}
						placeholder={strings.UnitPrice}
						className={`form-control 
                       ${props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)]
									.unitPrice &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)]
									.unitPrice
								? 'is-invalid'
								: ''
							}`}
					/>
				)}
			/>
		);
	};

	renderSubTotal = (cell, row, extraData) => {
		// return row.subTotal ? (
		// 	<Currency
		// 		value={row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	''
		// );
		return row.subTotal === 0 ? this.state.customer_currency_symbol + " " + row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.customer_currency_symbol + " " + row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	};

	renderVatAmount = (cell, row, extraData) => {
		// return row.subTotal === 0 ? (
		// 	<Currency
		// 		value={row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	<Currency
		// 		value={row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// );
		return row.vatAmount === 0 ? this.state.customer_currency_symbol + " " + row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.customer_currency_symbol + " " + row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	};

	addRow = () => {
		const data = [...this.state.data];
		this.setState(
			{
				data: data.concat({
					id: this.state.idCount + 1,
					description: '',
					quantity: 1,
					unitPrice: '',
					// vatCategoryId: '',
					subTotal: 0,
					productId: '',
					discountType: 'FIXED',
					// exciseTaxId:'',
					// vatAmount:0,
					discount: 0,
				}),
				idCount: this.state.idCount + 1,
			},
			() => {
				this.formRef.current.setFieldValue(
					'lineItemsString',
					this.state.data,
					true,
				);
			},
		);
	};

	selectItem = (e, row, name, form, field, props) => {
		//e.preventDefault();
		let data = this.state.data;
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj[`${name}`] = e;
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
					<Select
						isDisabled
						styles={customStyles}
						options={
							vat_list
								? selectOptionsFactory.renderOptions(
									'name',
									'id',
									vat_list,
									'Vat',
								)
								: []
						}
						value={
							vat_list &&
							selectOptionsFactory
								.renderOptions('name', 'id', vat_list, 'Vat')
								.find((option) => option.value === +row.vatCategoryId)
						}
						id="vatCategoryId"
						placeholder={strings.Select + strings.Vat}
						onChange={(e) => {
							this.selectItem(
								e.value,
								row,
								'vatCategoryId',
								form,
								field,
								props,
							);
						}}
						className={`${props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)].vatCategoryId &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)].vatCategoryId
								? 'is-invalid'
								: ''
							}`}
					/>
				)}
			/>
		);
	};

	renderDiscount = (cell, row, props) => {
		const { discountOptions } = this.state;
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.discountType`}
				render={({ field, form }) => (
					<div>
						<div class="input-group">
							<Input
								type="text"
								min="0"
								maxLength="14,2"
								value={row['discount'] !== 0 ? row['discount'] : 0}
								onChange={(e) => {
									if (e.target.value === '' || this.regDecimal.test(e.target.value)) {
										this.selectItem(
											e.target.value,
											row,
											'discount',
											form,
											field,
											props,
										);
									}

									this.updateAmount(
										this.state.data,
										props,
									);

								}}
								placeholder={strings.discount}
								className={`form-control 
		   								${props.errors.lineItemsString &&
										props.errors.lineItemsString[parseInt(idx, 10)] &&
										props.errors.lineItemsString[parseInt(idx, 10)].discount &&
										Object.keys(props.touched).length > 0 &&
										props.touched.lineItemsString &&
										props.touched.lineItemsString[parseInt(idx, 10)] &&
										props.touched.lineItemsString[parseInt(idx, 10)].discount
										? 'is-invalid'
										: ''
									}`}
							/>
							<div class="dropdown open input-group-append">

								<div style={{ width: '100px' }}>
									<Select


										options={discountOptions}
										id="discountType"
										name="discountType"
										value={
											discountOptions &&
											selectOptionsFactory
												.renderOptions('label', 'value', discountOptions, 'discount')
												.find((option) => option.value == row.discountType)
										}
										onChange={(e) => {
											this.selectItem(
												e.value,
												row,
												'discountType',
												form,
												field,
												props,
											);
											this.updateAmount(
												this.state.data,
												props,
											);
										}}
									/>
								</div>
							</div>
						</div>
					</div>

				)}

			/>
		);
	}


	discountType = (row) => {


		return this.state.discountOptions &&
			selectOptionsFactory
				.renderOptions('label', 'value', this.state.discountOptions, 'discount')
				.find((option) => option.value === +row.discountType)
	}

	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.data;
		const result = product_list.find((item) => item.id === parseInt(e));
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj['unitPrice'] = parseInt(result.unitPrice);
				// obj['vatCategoryId'] = result.vatCategoryId;
				obj['description'] = result.description;
				// obj['exciseTaxId'] = result.exciseTaxId;
				// obj['isExciseTaxExclusive'] = result.isExciseTaxExclusive;
				idx = index;
			}
			return obj;
		});
		// form.setFieldValue(
		// 	`lineItemsString.${idx}.vatCategoryId`,
		// 	result.vatCategoryId,
		// 	true,
		// );
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
		// form.setFieldValue(
		// 	`lineItemsString.${idx}.exciseTaxId`,
		// 	result.exciseTaxId,
		// 	true,
		// );
		this.updateAmount(data, props);
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

		return (
			<Field
				name={`lineItemsString.${idx}.productId`}
				render={({ field, form }) => (
					<Select
						styles={customStyles}
						isDisabled
						options={
							product_list
								? selectOptionsFactory.renderOptions(
									'name',
									'id',
									product_list,
									'Product',
								)
								: []
						}
						value={
							product_list &&
							selectOptionsFactory
								.renderOptions('name', 'id', product_list, 'Product')
								.find((option) => option.value === +row.productId)
						}
						id="productId"
						onChange={(e) => {
							if (e && e.label !== 'Select Product') {
								this.selectItem(e.value, row, 'productId', form, field, props);
								this.prductValue(e.value, row, 'productId', form, field, props);
							}
						}}
						className={`${props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)].productId &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)].productId
								? 'is-invalid'
								: ''
							}`}
					/>
				)}
			/>
		);
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

		//Initialization
		const { vat_list, excise_list } = this.props;
		const { discountPercentage, discountAmount } = this.state;
		let total_net = 0; let total_cess = 0; let total_cgst = 0; let total_sgst = 0; let total_igst = 0; let total_tax = 0;
		let total = 0; let net_value = 0; let discount = 0;

		//Mapping each row
		data.map((obj) => {

			//Temp data 
			let percentageArray = []
			let igstPercentage = 0, cgstPercentage = 0, sgstPercentage = 0, cessPercentage = 0
			obj.unitPrice = obj.unitPrice && obj.unitPrice != "" ? obj.unitPrice : 0;
			obj.discount = obj.discount && obj.discount != "" ? obj.discount : 0;
			obj.quantity = obj.quantity && obj.quantity != "" ? obj.quantity : 1;
			obj.taxPercentage = obj.taxPercentage && obj.taxPercentage != "" ? obj.taxPercentage : "0";

			// Discount Amount Calculation
			if (obj.discountType === 'PERCENTAGE') {
				let discountAmount = (parseFloat(obj.unitPrice) * parseFloat(obj.quantity)) * (parseFloat(obj.discount) / 100);
				discount += discountAmount;
				net_value = (parseFloat(obj.unitPrice) * parseFloat(obj.quantity)) - discountAmount;
			}
			else {
				net_value = (parseFloat(obj.unitPrice) * parseFloat(obj.quantity)) - parseFloat(obj.discount);
				discount += parseFloat(obj.discount);
			}


			// Tax-slab-Percentages calculation
			if (this.state.product_list) {
				const result = this.state.product_list.find((item) => item.id === parseInt(obj.productId));
				if (result) {
					obj.taxPercentage = result.interStateTaxSlab ? result.interStateTaxSlab.taxPercentage :
						result.intraStateTaxSlab ? result.intraStateTaxSlab.taxPercentage : "0";
					obj.taxSlab = result.interStateTaxSlab ? result.interStateTaxSlab.interStateTaxSlab :
						result.intraStateTaxSlab ? result.intraStateTaxSlab.intraStateTaxSlab : "N/A";
				}
			}
			if (this.state.igstEnabled == true) {
				if (obj.taxPercentage.includes("+")) {
					percentageArray = obj.taxPercentage.split("+")
					igstPercentage = parseFloat(percentageArray[0])

					if (percentageArray[1])
						cessPercentage = parseFloat(percentageArray[1])

				}
				else {
					igstPercentage = parseFloat(obj.taxPercentage)
				}

				obj.igst = (igstPercentage / 100) * net_value;
				obj.cgst = 0
				obj.sgst = 0

				if (cessPercentage != 0)
					obj.cess = (cessPercentage / 100) * net_value;
				else
					obj.cess = 0
				// obj.cess=((parseInt(obj.taxPercentage)/2)/100) * net_value;

			} else {
				if (obj.taxPercentage.includes("+")) {
					//percentage
					percentageArray = obj.taxPercentage.split("+")
					sgstPercentage = parseFloat(percentageArray[0]) / 2
					cgstPercentage = parseFloat(percentageArray[0]) / 2

					if (percentageArray[1]) cessPercentage = parseFloat(percentageArray[1])
				}
				else {
					sgstPercentage = parseFloat(obj.taxPercentage) / 2
					cgstPercentage = parseFloat(obj.taxPercentage) / 2
					cessPercentage = 0

				}

				obj.cgst = (cgstPercentage / 100) * net_value;
				obj.sgst = (sgstPercentage / 100) * net_value;
				obj.igst = 0
				if (cessPercentage != 0) obj.cess = (cessPercentage / 100) * net_value;
				else obj.cess = 0
			}


			// Total calculated amounts 
			total_net += parseFloat(net_value);
			obj.subTotal = net_value ? parseFloat(net_value) : 0;
			total_igst += parseFloat(obj.igst)
			total_cgst += parseFloat(obj.cgst)
			total_sgst += parseFloat(obj.sgst)
			total_cess += parseFloat(obj.cess)


			return obj;
		});

		total_tax = this.state.igstEnabled == true ? total_cess + total_igst : total_cess + total_cgst + total_sgst

		// State Settings
		this.setState(
			{
				data,
				initValue: {
					...this.state.initValue,
					...{
						total_net: total_net,
						totalTaxAmount: total_tax,
						// discount:  discount ? discount : 0,
						totalAmount: total_net + total_tax,
						discount: discount,
						CESS_totalAmount: total_cess,
						CGST_totalAmount: total_cgst,
						SGST_totalAmount: total_sgst,
						IGST_totalAmount: total_igst,
					},

				},
			},

		);
	};



	setDate = (props, value) => {
		const { term } = this.state;
		const val = term.split('_');
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
		const values = value
			? value
			: moment(props.values.invoiceDate, 'DD-MM-YYYY').toDate();
		if (temp && values) {
			const date = moment(values)
				.add(temp - 1, 'days')
				.format('DD-MM-YYYY');
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

	handleSubmit = (data) => {

		this.setState({ disabled: true });
		const { current_customer_id, term } = this.state;
		const {
			receiptAttachmentDescription,
			receiptNumber,
			contact_po_number,
			currency,
			invoiceDate,
			contactId,
			creditNoteNumber,
			notes,
			creditAmount,
			discount,
			discountType,
			discountPercentage,
			reason
			// vatCategoryId
		} = data;

		let formData = new FormData();
		formData.append('type', 11);
		formData.append('creditNoteId', current_customer_id);
		formData.append(
			'creditNoteNumber',
			creditNoteNumber !== null ? creditNoteNumber : '',
		);
		formData.append(
			'creditNoteDate',
			typeof invoiceDate === 'string'
				? moment(invoiceDate, 'DD-MM-YYYY').toDate()
				: invoiceDate,
		);
		if (reason)
			formData.append('reason', reason.label ? reason.label : reason);
		// formData.append('vatCategoryId', 2);
		formData.append('exchangeRate', this.state.initValue.exchangeRate);

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


		formData.append('isCNWithoutProduct', this.props.location.state.isCNWithoutProduct == true ? true : false);
		if (this.props.location.state.isCNWithoutProduct == true)
			formData.append('totalAmount', creditAmount);
		else {
			formData.append('lineItemsString', JSON.stringify(this.state.data));
			formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
			formData.append('totalAmount', this.state.initValue.totalAmount + this.state.shippingCharges);
			formData.append('totalExciseAmount', this.state.initValue.total_excise);
			formData.append('discount', this.state.initValue.discount);
		}

		if (contactId) {
			formData.append('contactId', contactId);
		}
		if (currency && currency.value) {
			formData.append('currencyCode', currency.value);
		}
		if (this.state.igstEnabled == true)
			formData.append('totalIgst', this.state.initValue.IGST_totalAmount);
		else {
			formData.append('totalCgst', this.state.initValue.CGST_totalAmount);
			formData.append('totalSgst', this.state.initValue.SGST_totalAmount);
		}
		formData.append('totalCess', this.state.initValue.CESS_totalAmount);

		formData.append('subTotal', this.state.initValue.total_net);
		formData.append('discount', this.state.initValue.discount);
		formData.append('shippingCharges', this.state.shippingCharges);
		this.props.creditNotesDetailActions
			.createCreditNote(formData)
			.then((res) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'success',
					'Debit Note Updated Successfully'
				);
				this.props.history.push('/admin/expense/debit-notes');
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Debit Note Updated Unsuccessfully'

				);
			});
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

	getCurrentProduct = () => {
		this.props.creditNotesActions.getProductList().then((res) => {
			this.setState(
				{
					data: [
						{
							id: 0,
							description: res.data[0].description,
							quantity: 1,
							unitPrice: res.data[0].unitPrice,
							discountType: res.data[0].discountType,
							subTotal: res.data[0].unitPrice,
							productId: res.data[0].id,
						},
					],
				},
				() => {
					const values = {
						values: this.state.initValue,
					};
					this.updateAmount(this.state.data, values);
				},
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.unitPrice`,
				res.data[0].unitPrice,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.quantity`,
				1,
				true,
			);
			// this.formRef.current.setFieldValue(
			// 	`lineItemsString.${0}.vatCategoryId`,
			// 	res.data[0].vatCategoryId,
			// 	true,
			// );
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.productId`,
				res.data[0].id,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.discountType`,
				res.data[0].id,
				true,
			);
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

	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
	};

	deleteCN = () => {
		const message1 =
			<text>
				<b>Delete Tax Debit Note?</b>
			</text>
		const message = 'This Tax Debit Note  will be deleted permanently and cannot be recovered. ';
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
		this.setState({ disabled1: true });
		const { current_customer_id } = this.state;
		if (this.props.location.state.isCNWithoutProduct != true) {
			this.props.creditNotesDetailActions
			.deleteCN(current_customer_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Debit Note Deleted Successfully'
					);
					this.props.history.push('/admin/expense/debit-notes');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					'Debit Note Deleted Unsuccessfully'
				);
			});
		}
		else {
			this.props.creditNotesDetailActions
			.deleteCN(current_customer_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Debit Note Deleted Successfully'
					);
					this.props.history.push('/admin/expense/debit-notes');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Debit Note Deleted Unsuccessfully'
				);
			});
		}
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	getCurrency = (opt) => {
		let customer_currencyCode = 0;
		let customer_item_currency = ''
		this.props.customer_list.map(item => {
			if (item.label.contactId == opt) {
				this.setState({
					customer_currency: item.label.currency.currencyCode,
					customer_currency_des: item.label.currency.currencyName,
					customer_currency_symbol: item.label.currency.currencyIsoCode,
				});

				customer_currencyCode = item.label.currency.currencyCode;
				customer_item_currency = item.label.currency
			}
		})

		return customer_currencyCode;
	}
	getTaxTreatment = (opt) => {

		let customer_taxTreatmentId = 0;
		let customer_item_taxTreatment = ''
		this.state.customer_list.map(item => {
			if (item.label.contactId == opt) {

				this.setState({
					customer_taxTreatment: item.label.gstTreatment.id,
					customer_taxTreatment_des: item.label.gstTreatment.gstTreatment,
					// customer_currency_symbol: item.label.currency.currencyIsoCode,
				});

				customer_taxTreatmentId = item.label.gstTreatment.id;
				customer_item_taxTreatment = item.label.currency
			}
		})

		return customer_taxTreatmentId;
	}
	render() {
		strings.setLanguage(this.state.language);
		const { data, discountOptions, initValue, loading, dialog } = this.state;

		const { project_list, currency_list, currency_convert_list, customer_list, universal_currency_list, vat_list } = this.props;

		let tmpCustomer_list = []

		customer_list.map(item => {
			let obj = { label: item.label.contactName, value: item.value }
			tmpCustomer_list.push(obj)
		})

		return (
			loading == true ? <Loader /> :
				<div>
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
														<span className="ml-2">Update Debit Note</span>
													</div>
												</Col>
											</Row>
										</CardHeader>
										<CardBody>
											{dialog}
											{loading ? (
												<Loader />
											) : (
												<Row>
													<Col lg={12}>
														<Formik
															initialValues={this.state.initValue}
															ref={this.formRef}
															onSubmit={(values, { resetForm }) => {
																this.handleSubmit(values);
															}}

														>
															{(props) => (
																<Form onSubmit={props.handleSubmit}>
																	<Row>
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="creditNoteNumber">
																					<span className="text-danger">* </span>
																					Debit Note Number
																				</Label>
																				<Input
																					type="text"
																					id="creditNoteNumber"
																					name="creditNoteNumber"
																					placeholder=""
																					disabled
																					value={props.values.creditNoteNumber}
																					onChange={(value) => {
																						props.handleChange('creditNoteNumber')(
																							value,
																						);
																					}}
																					className={
																						props.errors.creditNoteNumber &&
																							props.touched.creditNoteNumber
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.creditNoteNumber &&
																					props.touched.creditNoteNumber && (
																						<div className="invalid-feedback">
																							{props.errors.creditNoteNumber}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																		{/* <Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="reason">
																					<span className="text-danger">* </span>
																					Reason for issuing the credit note
																				</Label>
																				<Select
																					id="reason"
																					name="reason"
																					placeholder="Select Reason"
																					options={
																						this.reasonList
																							? selectOptionsFactory.renderOptions(
																									'label',
																									'value',
																									this.reasonList,
																									'Reason',
																									
																							)
																							: []
																					}
																					value={
																						this.reasonList &&
																						selectOptionsFactory.renderOptions(
																											'label',
																											'value',
																											this.reasonList,
																											'Place of Supply',
																									).find(
																																(option) =>
																													option.label ==props.values.reason,
																											)
																									}
																					// value={this.state.reasonList}
																					className={
																						props.errors.reason &&
																						props.touched.reason
																							? 'is-invalid'
																							: ''
																					}
																					onChange={(option) =>
																						props.handleChange('reason')(
																							option,
																						)
																					}
																				/>
																				{props.errors.reason &&
																					props.touched.reason && (
																						<div className="invalid-feedback">
																							{props.errors.reason}
																						</div>
																					)}
																			</FormGroup>
																		</Col> */}
																	</Row>
																	<Row>
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="project">
																					<span className="text-danger">* </span>
																					{strings.InvoiceNumber}
																				</Label>
																				<Input
																					disabled
																					id="invoiceNumber"
																					name="invoiceNumber"
																					value={this.state.invoiceNumber}
																				/>
																			</FormGroup>
																		</Col>
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="contactId">
																					<span className="text-danger">* </span>
																					{strings.CustomerName}
																				</Label>
																				<Select
																					styles={customStyles}
																					id="contactId"
																					name="contactId"
																					isDisabled={true}
																					options={
																						tmpCustomer_list
																							? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								tmpCustomer_list,
																								'Customer',
																							)
																							: []
																					}
																					value={
																						tmpCustomer_list &&
																						tmpCustomer_list.find(
																							(option) =>
																								option.value ===
																								+props.values.contactId,
																						)
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																							this.setExchange(this.getCurrency(option.value));
																							props.handleChange('contactId')(
																								option.value,
																							);
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
																		</Col>
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="taxTreatmentid">
																					Tax Treatment
																				</Label>
																				<Input
																					disabled
																					styles={customStyles}
																					id="taxTreatmentid"
																					name="taxTreatmentid"
																					value={
																						this.state.customer_taxTreatment_des}
																					className={
																						props.errors.taxTreatmentid &&
																							props.touched.taxTreatmentid
																							? 'is-invalid'
																							: ''
																					}
																					onChange={(option) => {
																						props.handleChange('taxTreatmentid')(option);

																					}}

																				/>
																				{props.errors.taxTreatmentid &&
																					props.touched.taxTreatmentid && (
																						<div className="invalid-feedback">
																							{props.errors.taxTreatmentid}
																						</div>
																					)}
																			</FormGroup>
																		</Col>

																	</Row>
																	<hr />
																	<Row>

																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="date">
																					<span className="text-danger">* </span>
																					Debit Note Date
																				</Label>
																				<DatePicker
																					id="invoiceDate"
																					name="invoiceDate"
																					placeholderText={strings.InvoiceDate}
																					showMonthDropdown
																					showYearDropdown
																					dateFormat="dd-MM-yyyy"
																					dropdownMode="select"
																					value={props.values.invoiceDate}
																					onChange={(value) => {
																						props.handleChange('invoiceDate')(
																							moment(value).format('DD-MM-YYYY'),
																						);
																						this.setDate(props, value);
																					}}
																					className={`form-control ${props.errors.invoiceDate &&
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

																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="currencyCode">
																					<span className="text-danger">* </span>
																					{strings.Currency}
																				</Label>
																				<Select
																					isDisabled={true}
																					styles={customStyles}
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
																					id="currencyCode"
																					name="currencyCode"
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
																									(this.state.currency ? +this.state.currency : +props.values.currency),
																							)
																					}
																					onChange={(option) =>
																						props.handleChange('currencyCode')(
																							option.value,
																						)
																					}
																					className={`${props.errors.currencyCode &&
																							props.touched.currency
																							? 'is-invalid'
																							: ''
																						}`}
																				/>
																				{props.errors.currencyCode &&
																					props.touched.currencyCode && (
																						<div className="invalid-feedback">
																							{props.errors.currencyCode}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																		{this.props.location.state.isCNWithoutProduct == true && (<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="creditAmount"><span className="text-danger">* </span>
																					Debit Amount
																				</Label>
																				<Input
																					type="text"
																					id="creditAmount"
																					name="creditAmount"
																					placeholder={strings.Enter + " Debit Amount"}
																					value={props.values.creditAmount}
																					// onBlur={props.handleBlur('currencyCode')}
																					onChange={(value) => {
																						props.handleChange('creditAmount')(
																							value,
																						);
																					}}
																					className={
																						props.errors.creditAmount &&
																							props.touched.creditAmount
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.creditAmount &&
																					(
																						<div className="invalid-feedback">
																							{props.errors.creditAmount}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																		)}

																	</Row>
																	<hr />

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
																					width="3%"
																					dataAlign="center"
																					dataFormat={(cell, rows) =>
																						this.renderActions(cell, rows, props)
																					}
																				></TableHeaderColumn>
																				<TableHeaderColumn
																					width="16%"
																					dataField="product"
																					dataFormat={(cell, rows) =>
																						this.renderProduct(cell, rows, props)
																					}
																				>
																					{strings.PRODUCT}
																				</TableHeaderColumn>

																				<TableHeaderColumn
																					dataField="description"
																					dataFormat={(cell, rows) =>
																						this.renderDescription(
																							cell,
																							rows,
																							props,
																						)
																					}
																				>
																					{strings.DESCRIPTION}
																				</TableHeaderColumn>
																				<TableHeaderColumn
																					dataField="quantity"
																					width="5%"
																					dataFormat={(cell, rows) =>
																						this.renderQuantity(cell, rows, props)
																					}
																				>
																					{strings.QUANTITY}
																				</TableHeaderColumn>
																				<TableHeaderColumn
																					dataField="unitPrice"
																					dataFormat={(cell, rows) =>
																						this.renderUnitPrice(cell, rows, props)
																					}
																				>
																					{strings.UNITPRICE}
																				</TableHeaderColumn>

																				<TableHeaderColumn
																					width="12%"
																					dataField="discount"
																					dataFormat={(cell, rows) =>
																						this.renderDiscount(cell, rows, props)
																					}
																				>
																					Discount Type
																				</TableHeaderColumn>

																				<TableHeaderColumn
																					// width="10%"
																					dataField="taxSlab"
																					dataFormat={(cell, rows) =>
																						this.renderTaxType(cell, rows, props)
																					}
																				>
																					Tax Type
																				</TableHeaderColumn>
																				{this.state.igstEnabled == true && (<TableHeaderColumn
																					// width="10%"
																					dataField="igst"
																					dataFormat={(cell, rows) =>
																						this.renderAmount(cell, rows, props)
																					}
																				>
																					IGST %
																				</TableHeaderColumn>)}
																				{this.state.igstEnabled == false && (<TableHeaderColumn
																					// width="10%"
																					dataField="cgst"
																					dataFormat={(cell, rows) =>
																						this.renderAmount(cell, rows, props)
																					}
																				>
																					CGST %
																				</TableHeaderColumn>)}
																				{this.state.igstEnabled == false && (<TableHeaderColumn
																					// width="10%"
																					dataField="sgst"
																					dataFormat={(cell, rows) =>
																						this.renderAmount(cell, rows, props)
																					}
																				>
																					SGST %
																				</TableHeaderColumn>)}
																				<TableHeaderColumn
																					// width="10%"
																					dataField="cess"
																					dataFormat={(cell, rows) =>
																						this.renderAmount(cell, rows, props)
																					}
																				>
																					CESS %
																				</TableHeaderColumn>

																				<TableHeaderColumn
																					dataField="sub_total"
																					dataFormat={this.renderSubTotal}
																					className="text-right"
																					columnClassName="text-right"
																					formatExtraData={universal_currency_list}
																				>
																					{strings.SUBTOTAL}
																				</TableHeaderColumn>
																			</BootstrapTable>
																		</Col>
																	</Row>

																	{data.length > 0 && (
																		<Row>
																			<Col lg={8}>
																				<FormGroup className="py-2">
																					<Label htmlFor="notes">{strings.Notes}</Label>
																					<Input
																						type="textarea"
																						maxLength="250"
																						name="notes"
																						id="notes"
																						rows="6"
																						placeholder={strings.Notes}
																						onChange={(option) =>
																							props.handleChange('notes')(option)
																						}
																						value={props.values.notes}
																					/>
																				</FormGroup>
																				<Row>
																					<Col lg={6}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="receiptNumber">
																								{strings.ReceiptNumber}
																							</Label>
																							<Input
																								type="text"
																								maxLength="100"
																								id="receiptNumber"
																								name="receiptNumber"
																								value={props.values.receiptNumber}
																								placeholder={strings.ReceiptNumber}
																								onChange={(value) => {
																									props.handleChange('receiptNumber')(value);

																								}}
																								className={props.errors.receiptNumber && props.touched.receiptNumber ? "is-invalid" : " "}
																							/>
																							{props.errors.receiptNumber && props.touched.receiptNumber && (
																								<div className="invalid-feedback">{props.errors.receiptNumber}</div>
																							)}

																						</FormGroup>
																					</Col>

																				</Row>
																				<FormGroup className="mb-3">
																					<Label htmlFor="receiptAttachmentDescription">
																						{strings.AttachmentDescription}
																					</Label>
																					<Input
																						type="textarea"
																						maxLength="250"
																						name="receiptAttachmentDescription"
																						id="receiptAttachmentDescription"
																						rows="5"
																						placeholder={strings.ReceiptAttachmentDescription}
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

																			<Col lg={4}>
																				<div className="">

																					{this.renderTotalValue(props, strings.SubTotal, initValue.total_net)}
																					{this.renderTotalValue(props, strings.Discount, initValue.discount)}

																					{this.state.igstEnabled == true && this.renderTotalValue(props, "Total IGST", initValue.IGST_totalAmount)}
																					{this.state.igstEnabled == false && this.renderTotalValue(props, "Total CGST", initValue.CGST_totalAmount)}
																					{this.state.igstEnabled == false && this.renderTotalValue(props, "Total SGST", initValue.SGST_totalAmount)}
																					{this.renderTotalValue(props, "Total CESS", initValue.CESS_totalAmount)}
																					{this.renderTotalValue(props, "Total Tax", initValue.totalTaxAmount)}
																					<div className="total-item p-2">
																						<Row><Col lg={6}><h5 className="mb-0 text-right">Shipping Charges</h5></Col>
																							<Col lg={6} className="text-right">
																								<Input disabled type='number' value={this.state.shippingCharges} onChange={(opt) => { this.setState({ shippingCharges: opt.target.value }) }} style={{ textAlign: "right" }} />
																							</Col>
																						</Row>
																					</div>
																					<Checkbox disabled value={this.state.roundofActive} onChange={(option) => { this.setState({ roundofActive: !this.state.roundofActive }) }} />Auto Round-of
																					{this.renderTotalValue(props, strings.Total, this.state.roundofActive == false ? parseFloat(initValue.totalAmount) + parseFloat(this.state.shippingCharges) : Math.round(parseFloat(initValue.totalAmount) + parseFloat(this.state.shippingCharges)))}
																				</div>
																			</Col>
																		</Row>
																	)}
																	<Row>
																		<Col
																			lg={12}
																			className="mt-5 d-flex flex-wrap align-items-center justify-content-between"
																		>
																			<FormGroup>
																				<Button
																					type="button"
																					color="danger"
																					className="btn-square"
																					disabled1={this.state.disabled1}
																					onClick={this.deleteCN}
																				>
																					<i className="fa fa-trash"></i> {' '} {this.state.disabled1
																						? 'Deleting...'
																						: strings.Delete}
																				</Button>
																			</FormGroup>
																			<FormGroup className="text-right">
																				<Button
																					type="submit"
																					color="primary"
																					className="btn-square mr-3"
																					disabled={this.state.disabled}
																				>
																					<i className="fa fa-dot-circle-o"></i>{this.state.disabled
																						? 'Updating...'
																						: strings.Update}

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
																					<i className="fa fa-ban"></i> {strings.Cancel}
																				</Button>
																			</FormGroup>
																		</Col>
																	</Row>
																</Form>
															)}
														</Formik>
													</Col>
												</Row>
											)}
										</CardBody>
									</Card>
								</Col>
							</Row>
						</div>
						
					</div>
				</div>
		);
	}
	//
	renderTotalValue = (props, label, value) => {

		return (
			<div className="total-item p-2">
				<Row>
					<Col lg={6}>
						<h5 className="mb-0 text-right">
							{label}
						</h5>
					</Col>
					<Col lg={6} className="text-right">
						<label className="mb-0">

							{this.state.supplier_currency_symbol}&nbsp;
							{value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</label>
					</Col>
				</Row>
			</div>
		)
	}//
	renderTaxType = (cell, row, props) => {
		const { vat_list } = this.props;
		let vatList = vat_list.length
			? [{ id: '', vat: 'Select Tax' }, ...vat_list]
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
				name={`lineItemsString.${idx}.taxSlab`}
				render={({ field, form }) => (

					<Input
						disabled
						value={row.taxSlab}
						title={row.taxSlab}
					/>
				)}
			/>
		);
	};
	renderAmount = (cell, row, extraData) => {

		let value = cell && cell != 0 ? cell : 0
		return value === 0 ? this.state.customer_currency_symbol + " " + value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : this.state.customer_currency_symbol + " " + value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};//
	renderHsnSacCode = (cell, row, props) => {
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.hsnOrSac`}
				render={({ field, form }) => (
					<Input
						type="text"
						maxLength="250"
						value={row['hsnOrSac'] !== '' ? row['hsnOrSac'] : ''}
						onChange={(e) => {
							this.selectItem(e.target.value, row, 'hsnOrSac', form, field);
						}}
						placeholder="HSN / SAC"
						className={`form-control ${props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)].hsnOrSac &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)].hsnOrSac
								? 'is-invalid'
								: ''
							}`}
					/>
				)}
			/>
		);
	};//
	getProductListByPlaceOfSupplyId = (id, props) => {
		this.props.creditNotesActions.getProductListById(id).then((res) => {
			if (res.status == 200) {
				this.setState({ product_list: res.data })
				this.updateAmount(this.state.data, props);
			}
		});

		//
		this.props.commonActions.getCompanyDetails().then((res) => {
			if (res.status == 200) {

				if (res.data.companyStateCode == id)
					this.setState({
						igstEnabled: false,
						companyStateCode: res.data.companyStateCode
					})
				else
					this.setState({
						igstEnabled: true,
						companyStateCode: res.data.companyStateCode
					})
			}
		})
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DetailDebitNote);