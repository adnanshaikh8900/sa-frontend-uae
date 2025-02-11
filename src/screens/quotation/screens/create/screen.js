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
	UncontrolledTooltip,
} from 'reactstrap';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as SupplierInvoiceCreateActions from './actions';
import * as QuotationCreateAction from './actions'
import * as RequestForQuotationAction from '../../actions';
import * as SupplierInvoiceActions from '../../../supplier_invoice/actions'
import * as ProductActions from '../../../product/actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';
import * as CustomerInvoiceActions from '../../../customer_invoice/actions';
import { CustomerModal } from '../../../customer_invoice/sections/index';
import { ProductModal } from '../../../customer_invoice/sections';
import Switch from "react-switch";
import { LeavePage, Loader } from 'components';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { optionFactory, selectCurrencyFactory, selectOptionsFactory } from 'utils';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { TextField } from '@material-ui/core';
import './style.scss';
import moment from 'moment';
import { ReorderOutlined } from '@material-ui/icons';

const mapStateToProps = (state) => {
	return {
		contact_list: state.quotation.contact_list,
		currency_list: state.quotation.currency_list,
		vat_list: state.quotation.vat_list,
		product_list: state.quotation.product_list,
		supplier_list: state.quotation.supplier_list,
		excise_list: state.quotation.excise_list,
		country_list: state.quotation.country_list,
		product_category_list: state.product.product_category_list,
		universal_currency_list: state.common.universal_currency_list,
		currency_convert_list: state.common.currency_convert_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		requestForQuotationAction: bindActionCreators(
			RequestForQuotationAction,
			dispatch,
		),
		supplierInvoiceActions: bindActionCreators(
			SupplierInvoiceActions, dispatch,
		),
		customerInvoiceActions: bindActionCreators(
			CustomerInvoiceActions,
			dispatch,
		),
		ProductActions: bindActionCreators(ProductActions, dispatch),
		supplierInvoiceCreateActions: bindActionCreators(
			SupplierInvoiceCreateActions,
			dispatch,
		),
		quotationCreateAction: bindActionCreators(QuotationCreateAction, dispatch),
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
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

const invoiceimage = require('assets/images/invoice/invoice.png');
let strings = new LocalizedStrings(data);

class CreateQuotation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			supplier_currency_symbol: '',
			loading: false,
			discountOptions: [
				{ value: 'FIXED', label: 'Fixed' },
				{ value: 'PERCENTAGE', label: '%' },
			],
			discount_option: '',
			disabled: false,
			data: [
				{
					id: 0,
					description: '',
					quantity: 1,
					unitPrice: '',
					vatCategoryId: '',
					exciseTaxId: '',
					discountType: 'FIXED',
					exciseAmount: '',
					discount: 0,
					subTotal: 0,
					vatAmount: 0,
					productId: '',
					isExciseTaxExclusive: '',
					unitType: '',
					unitTypeId: '',
				},
			],
			discountEnabled: false,
			idCount: 0,
			checked: false,
			initValue: {
				total_excise: 0,
				contact_po_number: '',
				receiptNumber: '',
				currencyCode: 150,
				poApproveDate: new Date(),
				//quotaionExpiration: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				quotaionExpiration: new Date(),
				quotationdate: new Date(),
				customerId: '',
				placeOfSupplyId: '',
				project: '',
				exchangeRate: '',
				discount: 0,
				discountPercentage: 0,
				discountType: "FIXED",
				lineItemsString: [
					{
						id: 0,
						description: '',
						quantity: 1,
						unitPrice: '',
						vatCategoryId: '',
						subTotal: 0,
						productId: '',
						isExciseTaxExclusive: '',

					},
				],
				quotation_Number: '',
				total_net: 0,
				invoiceVATAmount: 0,
				term: '',
				totalAmount: 0,
				notes: '',

			},
			taxType: false,
			currentData: {},
			contactType: 2,
			fileName: '',
			openCustomerModal: false,
			openProductModal: false,
			openInvoiceNumberModel: false,
			selectedContact: '',
			createMore: false,
			prefix: '',
			// selectedType: { value: 'FIXED', label: 'Fixed' },
			discountPercentage: '',
			discountAmount: 0,
			purchaseCategory: [],
			income: true,
			exist: false,
			param: false,
			loadingMsg: "Loading...",
			disableLeavePage: false,
			isDesignatedZone: false,
			isRegisteredVat: false,
			quotationDateForVatValidation: new Date(),
			producttype: [],
			vat_list: [
				{
					"id": 1,
					"vat": 5,
					"name": "STANDARD RATED TAX (5%) "
				},
				{
					"id": 2,
					"vat": 0,
					"name": "ZERO RATED TAX (0%)"
				},
				{
					"id": 3,
					"vat": 0,
					"name": "EXEMPT"
				},
				{
					"id": 4,
					"vat": 0,
					"name": "OUT OF SCOPE"
				},
				{
					"id": 10,
					"vat": 0,
					"name": "N/A"
				}
			]
		};

		this.formRef = React.createRef();
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
		// this.options = {
		//   paginationPosition: 'top'
		// }
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
		this.regExInvNum = /[a-zA-Z0-9,-/ ]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
	}

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
						maxLength="2000"
						value={row['description'] !== '' ? row['description'] : ''}
						onChange={(e) => {
							this.selectItem(
								e.target.value,
								row,
								'description',
								form,
								field,
								props,
							);
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
						isDisabled={row.exciseTaxId === 0 || row.exciseTaxId === null}
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
								.find((option) => row.exciseTaxId ? option.value === +row.exciseTaxId : "Select Exise")
						}
						id="exciseTaxId"
						placeholder={strings.Select + strings.excise}
						onChange={(e) => {
							if (e.value === '') {
								props.setFieldValue(
									'exciseTaxId',
									'',
								);
							} else {
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
							}
						}
						}
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
						<div className="input-group">
							<Input
								type="text"
								min="0"
								maxLength="10"
								value={row['quantity'] !== 0 ? row['quantity'] : 0}
								onChange={(e) => {
									if (e.target.value === '' || this.regEx.test(e.target.value)) {
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
								className={`form-control w-50 
							${props.errors.lineItemsString &&
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
							{row['productId'] != '' ?
								<Input value={row['unitType']} disabled /> : ''}
						</div>
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].quantity && (
								<div className="invalid-feedback" style={{ display: "block", whiteSpace: "normal" }}>
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
					<>
						<Input
							type="text"
							min="0"
							maxLength="14,2"
							value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
							onChange={(e) => {
								if (e.target.value === '' || this.regDecimal.test(e.target.value)) {
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
									props.errors.lineItemsString[parseInt(idx, 10)].unitPrice &&
									Object.keys(props.touched).length > 0 &&
									props.touched.lineItemsString &&
									props.touched.lineItemsString[parseInt(idx, 10)] &&
									props.touched.lineItemsString[parseInt(idx, 10)].unitPrice
									? 'is-invalid'
									: ''
								}`}
						/>
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].unitPrice &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].unitPrice &&
							(
								<div className='invalid-feedback'>
									{props.errors.lineItemsString[parseInt(idx, 10)].unitPrice}
								</div>
							)}
					</>
				)}
			/>
		);
	};

	renderSubTotal = (cell, row, extraData) => {
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
		return row.subTotal === 0 ? this.state.supplier_currency_symbol + " " + row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : this.state.supplier_currency_symbol + " " + row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
		let value = row.vatAmount && row.vatAmount != 0 ? row.vatAmount : 0
		return value === 0 ? this.state.supplier_currency_symbol + " " + value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : this.state.supplier_currency_symbol + " " + value.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};

	getParentInvoiceDetails = (parentId) => {
		this.props.quotationCreateAction
			.getQuotationById(parentId)
			.then((res) => {
				if (res.status === 200) {
					this.getCompanyCurrency();
					this.purchaseCategory();
					this.setState(
						{
							parentId: parentId,
							initValue: {
								quotaionExpiration: res.data.quotaionExpiration
									? moment(res.data.quotaionExpiration).format('DD-MM-YYYY')
									: '',
								quotationdate: res.data.quotationdate
									? moment(res.data.quotationdate).format('DD-MM-YYYY')
									: '',
								quotationdate1: res.data.quotationdate
									? res.data.quotationdate
									: '',
								quotaionExpiration1: res.data.quotaionExpiration
									? res.data.quotaionExpiration
									: '',
								customerId: res.data.customerId
									? res.data.customerId
									: '',
								quotationNumber: res.data.quotationNumber
									? res.data.quotationNumber
									: '',
								receiptNumber: res.data.receiptNumber
									? res.data.receiptNumber
									: '',
								totalVatAmount: res.data.totalVatAmount
									? res.data.totalVatAmount
									: 0,
								totalAmount: res.data.totalAmount
									? res.data.totalAmount
									: 0,
								total_net: 0,
								exchangeRate: res.data.exchangeRate ? res.data.exchangeRate : 1,
								notes: res.data.notes
									? res.data.notes
									: '',
								invoiceVATAmount: res.data.totalVatAmount
									? res.data.totalVatAmount
									: 0,
								lineItemsString: res.data.poQuatationLineItemRequestModelList
									? res.data.poQuatationLineItemRequestModelList
									: [],
								placeOfSupplyId: res.data.placeOfSupplyId
									? res.data.placeOfSupplyId
									: '',
								total_excise: res.data.totalExciseAmount
									? res.data.totalExciseAmount
									: '',
								discount: res.data.discount
									? res.data.discount
									: 0,
								discountPercentage: res.data.discountPercentage
									? res.data.discountPercentage
									: 0,
								discountType: res.data.discountType
									? res.data.discountType
									: '',
								taxType: res.data.taxType
							},
							quotaionExpirationNotChanged: res.data.quotaionExpiration
								? moment(res.data.quotaionExpiration)
								: '',
							quotaionExpiration: res.data.quotaionExpiration
								? res.data.quotaionExpiration
								: '',
							customer_taxTreatment_des: res.data.taxtreatment ? res.data.taxtreatment : '',
							placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
							fileName: res.data.fileName ? res.data.fileName : '',
							filePath: res.data.filePath ? res.data.filePath : '',
							total_excise: res.data.totalExciseAmount ? res.data.totalExciseAmount : '',
							data: res.data.poQuatationLineItemRequestModelList
								? res.data.poQuatationLineItemRequestModelList
								: [],
							quotationDateForVatValidation: res.data.quotationdate
								? new Date(res.data.quotationdate)
								: new Date(),
							selectedContact: res.data.customerId ? res.data.customerId : '',
							customerId: res.data.customerId ? res.data.customerId : '',
							discountAmount: res.data.discount ? res.data.discount : 0,
							discountPercentage: res.data.discountPercentage
								? res.data.discountPercentage
								: 0,
							taxType: res.data.taxType,
							loading: false,
							discountEnabled: res.data.discount > 0 ? true : false,
						},
						() => {
							if (this.state.data.length > 0) {
								this.updateAmount(this.state.data);
								let tmpSupplier_list = []

								this.props.supplier_list.map(item => {
									let obj = { label: item.label.contactName, value: item.value }
									tmpSupplier_list.push(obj)
								})

								let customer = selectOptionsFactory.renderOptions(
									'label',
									'value',
									tmpSupplier_list,
									'Customer Name',
								).find((option) => option.value == res.data.customerId)
								this.formRef.current.setFieldValue('customerId', customer, true);
								this.formRef.current.setFieldValue('placeOfSupplyId', res.data.placeOfSupplyId, true);
								this.formRef.current.setFieldValue('exchangeRate', res.data.exchangeRate ? res.data.exchangeRate : 1, true);
								this.formRef.current.setFieldValue('receiptNumber', res.data.receiptNumber, true);
								// this.formRef.current.setFieldValue('attachmentDescription',  res.data.attachmentDescription, true);
								const { data } = this.state;
								const idCount =
									data.length > 0
										? Math.max.apply(
											Math,
											data.map((item) => {
												this.getProductType(item['productId'])
												return item.id;
											}),
										)
										: 0;
								this.setState({
									idCount,
								});
								this.addRow();
							} else {
								this.setState({
									idCount: 0,
								});
							}
						},
					);
					this.getCurrency(res.data.customerId)
				}
			});
	}

	componentDidMount = () => {
		this.props.requestForQuotationAction.getVatList();
		this.getInitialData();
		this.getCompanyType();
		if (this.props.location.state && this.props.location.state.contactData)
			this.getCurrentUser(this.props.location.state.contactData);
		if (this.props.location.state && this.props.location.state.parentId)
			this.getParentInvoiceDetails(this.props.location.state.parentId);
		this.getDefaultNotes()
	};

	getDefaultNotes = () => {
		this.props.commonActions.getNoteSettingsInfo().then((res) => {
			if (res.status === 200) {
				this.formRef.current.setFieldValue('notes', res.data.defaultTermsAndConditions, true);
				this.formRef.current.setFieldValue('footNote', res.data.defaultFootNotes, true);
			}
		})
	}

	getInitialData = () => {
		this.getInvoiceNo();
		this.props.requestForQuotationAction.getVatList().then((res) => {
			if (res.status == 200 && res.data)
				this.setState({ vat_list: res.data })
		});
		this.props.requestForQuotationAction.getSupplierList(this.state.contactType);
		this.props.requestForQuotationAction.getPoPrefix().then((response) => {
			this.setState({
				prefixData: response.data
			});
		});
		this.props.requestForQuotationAction.getExciseList();
		// this.props.requestForQuotationAction.getVatList();
		this.props.requestForQuotationAction.getCountryList();
		this.props.requestForQuotationAction.getProductList();
		this.props.ProductActions.getProductCategoryList();
		this.purchaseCategory();
		this.salesCategory();
		this.getCompanyCurrency();
	};

	salesCategory = () => {
		try {
			this.props.ProductActions.getTransactionCategoryListForSalesProduct(
				'2',
			).then((res) => {
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

	purchaseCategory = () => {
		try {
			this.props.ProductActions.getTransactionCategoryListForPurchaseProduct(
				'10',
			).then((res) => {
				if (res.status === 200) {
					this.setState(
						{
							purchaseCategory: res.data,
						},
						() => { },
					);
				}
			});
		} catch (err) {
			console.log(err);
		}
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
					vatCategoryId: '',
					subTotal: 0,
					exciseTaxId: '',
					discountType: 'FIXED',
					vatAmount: 0,
					discount: 0,
					productId: '',
					unitType: '',
					unitTypeId: '',
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
			name === 'quantity' ||
			name === 'exciseTaxId'
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
						<div className="input-group">
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
								placeholder={strings.Discount}
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
							<div className="dropdown open input-group-append">

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
	getCustomerShippingAddress = (cutomerID, taxID, props) => {
		if (taxID !== 5 && taxID !== 6 && taxID !== 7) {
			this.props.quotationCreateAction.getCustomerShippingAddressbyID(cutomerID).then((res) => {
				if (res.status === 200) {
					var PlaceofSupply = this.placelist &&
						selectOptionsFactory.renderOptions(
							'label',
							'value',
							this.placelist,
							'Place of Supply',).
							find((option) => option.label.toUpperCase() === res.data.shippingStateName.toUpperCase())
					if (PlaceofSupply) {
						props.handleChange('placeOfSupplyId')(PlaceofSupply,);
						this.setState({ placeOfSupplyId: PlaceofSupply });
						this.formRef.current.setFieldValue('placeOfSupplyId', PlaceofSupply.value, true);
					}
				}
			});
		}
	};
	getCompanyType = () => {
		this.props.quotationCreateAction
			.getCompanyById()
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						isDesignatedZone: res.data.isDesignatedZone,
						companyVATRegistrationDate: new Date(moment(res.data.vatRegistrationDate).format('MM DD YYYY')),
					});
					this.setState({
						isRegisteredVat: res.data.isRegisteredVat,
					});
				}
			})
			.catch((err) => {
				console.log(err, "Get Company Type Error");
			});
	};
	getProductType = (id) => {
		if (this.state.customer_taxTreatment_des) {
			const { product_list } = this.props;
			const product = product_list.find(obj => obj.id === id);
			if (product) {
				var { vat_list } = this.props;
				let pt = {};
				var vt = [];
				pt.id = product.id;
				pt.type = product.productType
				if (this.state.isRegisteredVat && (this.state.quotationDateForVatValidation > this.state.companyVATRegistrationDate)) {
					if (this.state.isDesignatedZone) {
						if (product.productType === "GOODS") {
							if (this.state.customer_taxTreatment_des === 'UAE VAT REGISTERED' || this.state.customer_taxTreatment_des === 'UAE VAT REGISTERED FREEZONE' || this.state.customer_taxTreatment_des === 'UAE NON-VAT REGISTERED FREEZONE' || this.state.customer_taxTreatment_des === 'GCC VAT REGISTERED' || this.state.customer_taxTreatment_des === 'GCC NON-VAT REGISTERED' || this.state.customer_taxTreatment_des === 'NON GCC') {
								vat_list.map(element => {
									if (element.name == 'OUT OF SCOPE') {
										vt.push(element);
									}
								});
							}
							if (this.state.customer_taxTreatment_des === 'UAE NON-VAT REGISTERED') {
								vt = vat_list;
							}
						}
						else if (product.productType === "SERVICE") {
							if (this.state.customer_taxTreatment_des === 'UAE VAT REGISTERED' || this.state.customer_taxTreatment_des === 'UAE NON-VAT REGISTERED' || this.state.customer_taxTreatment_des === 'UAE VAT REGISTERED FREEZONE' || this.state.customer_taxTreatment_des === 'UAE NON-VAT REGISTERED FREEZONE') {
								vt = vat_list;
							}
							if (this.state.customer_taxTreatment_des === 'GCC VAT REGISTERED' || this.state.customer_taxTreatment_des === 'GCC NON-VAT REGISTERED' || this.state.customer_taxTreatment_des === 'NON GCC') {
								vat_list.map(element => {
									if (element.name == 'ZERO RATED TAX (0%)') {
										vt.push(element);
									}
								});

							}
						}
					} else {
						if (this.state.customer_taxTreatment_des === 'UAE VAT REGISTERED' || this.state.customer_taxTreatment_des === 'UAE NON-VAT REGISTERED' || this.state.customer_taxTreatment_des === 'UAE VAT REGISTERED FREEZONE' || this.state.customer_taxTreatment_des === 'UAE NON-VAT REGISTERED FREEZONE') {
							vt = vat_list;
						}
						if (this.state.customer_taxTreatment_des === 'GCC VAT REGISTERED' || this.state.customer_taxTreatment_des === 'GCC NON-VAT REGISTERED' || this.state.customer_taxTreatment_des === 'NON GCC') {
							vat_list.map(element => {
								if (element.name == 'ZERO RATED TAX (0%)') {
									vt.push(element);
								}
							});
						}
					}
				} else {
					vt = [{
						"id": 10,
						"vat": 0,
						"name": "N/A"
					}];
				}
				pt.vat_list = vt;
				this.setState(prevState => ({
					producttype: [...prevState.producttype, pt]
				}));
				return pt;
			}

		}
	};
	resetVatId = (props) => {
		this.setState({
			producttype: [],
		}, () => {
			let newData = [];
			const { data, isRegisteredVat } = this.state;
			data.map((obj, index) => {
				if (isRegisteredVat)
					obj['vatCategoryId'] = '';
				else
					obj['vatCategoryId'] = 10;
				newData.push(obj);
				if (obj['productId'])
					this.getProductType(obj['productId'])
				return obj;
			})
			props.setFieldValue('lineItemsString', newData, true);
			this.updateAmount(newData, props);
		});
	};
	renderVat = (cell, row, props) => {
		//const { vat_list } = this.props;
		let vat_list = [];
		const product = this.state.producttype.find(element => element.id === row.productId);
		if (product) {
			vat_list = product.vat_list;
		}
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
		if (row.productId && row.vatCategoryId) {
			row.vatCategoryId = typeof (row.vatCategoryId) === 'string' ? parseInt(row.vatCategoryId) : row.vatCategoryId;
		}
		return (
			<Field
				name={`lineItemsString.${idx}.vatCategoryId`}
				render={({ field, form }) => (
					<>
						<Select
							options={
								vat_list
									? selectOptionsFactory.renderOptions(
										'name',
										'id',
										vat_list,
										'VAT',
									)
									: []
							}
							value={
								vat_list ?
									selectOptionsFactory
										.renderOptions('name', 'id', vat_list, 'VAT')
										.find((option) => option.value == row.vatCategoryId) : ""
							}
							id="vatCategoryId"
							placeholder={strings.Select + strings.VAT}
							// onChange={(e) => {
							// 	this.selectItem(
							// 		e.value,
							// 		row,
							// 		'vatCategoryId',
							// 		form,
							// 		field,
							// 		props,
							// 	);
							// }}
							onChange={(e) => {
								if (e.value === '') {
									props.setFieldValue(
										'vatCategoryId',
										'',
									);
								} else {
									this.selectItem(
										e.value,
										row,
										'vatCategoryId',
										form,
										field,
										props,
									);
									this.updateAmount(
										this.state.data,
										props,
									);
								}
							}
							}
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
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].vatCategoryId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].vatCategoryId &&
							(
								<div className='invalid-feedback'>
									{props.errors.lineItemsString[parseInt(idx, 10)].vatCategoryId}
								</div>
							)}
					</>
				)}
			/>
		);
	};

	exchangeRaterevalidate = (exc) => {
		let local = [...this.state.data]
		var { product_list } = this.props;

		let local2 = local.map((obj, index) => {

			const result = product_list.find((item) => item.id === obj.productId);
			return {
				...obj, unitPrice: result ?
					(parseFloat(result.unitPrice) * (1 / exc)).toFixed(2) : 0
			}

		});

		this.setState({ data: local2 }, () => {
			this.updateAmount(local2);
			if (this.checkedRow()) this.addRow()
		})
	}

	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.data;
		const result = product_list.find((item) => item.id === parseInt(e));
		let idx;
		const producttype = this.getProductType(parseInt(e));
		let exchangeRate = this.formRef.current?.state?.values?.exchangeRate > 0
			&& this.formRef.current?.state?.values?.exchangeRate !== "" ?
			this.formRef.current?.state?.values?.exchangeRate : 1
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj['unitPrice'] = (parseFloat(result.unitPrice) * (1 / exchangeRate)).toFixed(2);
				obj['description'] = result.description;
				obj['exciseTaxId'] = result.exciseTaxId;
				obj['discountType'] = result.discountType;
				obj['isExciseTaxExclusive'] = result.isExciseTaxExclusive;
				obj['unitType'] = result.unitType;
				obj['unitTypeId'] = result.unitTypeId;
				idx = index;
				if (this.state.isRegisteredVat) {
					if (producttype) {
						if (producttype.id === parseInt(e)) {
							obj['vatCategoryId'] = result.vatCategoryId;
						}
						else {
							obj['vatCategoryId'] = '';
						}
					}
				} else {
					obj['vatCategoryId'] = 10;
				}
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
			`lineItemsString.${idx}.exciseTaxId`,
			result.exciseTaxId,
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.description`,
			result.description,
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.discountType`,
			result.discountType,
			true,
		);
		this.getProductType(parseInt(e))
		this.updateAmount(data, props);
	};
	renderAddProduct = (cell, rows, props) => {
		return (
			<Button
				color="primary"
				className="btn-twitter btn-brand icon"
				onClick={(e, props) => {
					this.openProductModal(props);
				}}
			>
				<i className="fas fa-plus"></i>
			</Button>
		);
	};

	renderProduct = (cell, row, props) => {
		const { product_list } = this.props;
		// if(product_list.length>0){
		// 	if(product_list.length > this.state.producttype.length){
		// 		product_list.map(element => {
		// 			this.getProductType(element.id);
		// 		});
		// 	}
		// }
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
		// if (product_list.length > 0) {
		return (
			<Field
				name={`lineItemsString.${idx}.productId`}
				render={({ field, form }) => (
					<>
						<Select
							options={
								product_list
									? optionFactory.renderOptions(
										'name',
										'id',
										product_list,
										'Product',
									)
									: []
							}
							id="productId"
							placeholder={strings.Select + strings.Product}
							onChange={(e) => {
								if (e && e.label !== 'Select Product') {
									this.selectItem(e.value, row, 'productId', form, field, props);
									this.prductValue(e.value, row, 'productId', form, field, props);
									if (this.checkedRow()) {
										this.addRow();
									}
									// this.formRef.current.props.handleChange(field.name)(e.value)
								} else {
									form.setFieldValue(
										`lineItemsString.${idx}.productId`,
										e.value,
										true,
									);
									this.setState({
										data: [
											{
												id: 0,
												description: '',
												quantity: 1,
												unitPrice: '',
												vatCategoryId: '',
												subTotal: 0,
												productId: '',
											},
										],
									});
								}
							}}
							value={
								product_list && row.productId
									? selectOptionsFactory
										.renderOptions('name', 'id', product_list, 'Product')
										.find((option) => option.value === +row.productId)
									: []
							}
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
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].productId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].productId &&
							(
								<div className='invalid-feedback'>
									{props.errors.lineItemsString[parseInt(idx, 10)].productId}
								</div>
							)}
						{row['productId'] != '' ?
							<div className='mt-1'>
								<TextField
									type="textarea"
									inputProps={{ maxLength: 2000}}
									multiline
									minRows={1}
									maxRows={4}
									value={row['description'] !== '' && row['description'] !== null ? row['description'] : ''}
									onChange={(e) => {
										this.selectItem(e.target.value, row, 'description', form, field);
									}}
									placeholder={strings.Description}
									className={`textarea ${props.errors.lineItemsString &&
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
							</div> : ''}
					</>
				)}
			/>
		);
		// } else {
		// 	return (
		// 		<Button
		// 			type="button"
		// 			color="primary"
		// 			className="btn-square mr-3 mb-3"
		// 			onClick={(e, props) => {
		// 				this.openProductModal(props);
		// 			}}
		// 		>
		// 			<i className="fa fa-plus"></i> Add a Product
		// 		</Button>
		// 	);
		// }
	};

	// selectCategory = (options, row, name, form, field, props) => {
	// 	let data = this.state.data;
	// 	let idx;
	// 	data.map((obj, index) => {
	// 		if (obj.id === row.id) {
	// 			obj['transactiomCategoryId'] = options;
	// 			idx = index;
	// 		}
	// 		return obj;
	// 	});
	// 	console.log(data);
	// 	form.setFieldValue(
	// 		`lineItemsString.${idx}.transactiomCategoryId`,
	// 		options,
	// 		true,
	// 	);
	// };


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
		return rows['productId'] != '' ?
			<Button
				size="sm"
				className="btn-twitter btn-brand icon mt-1"
				disabled={this.state.data.length === 1 ? true : false}
				onClick={(e) => {
					this.deleteRow(e, rows, props);
				}}
			>
				<i className="fas fa-trash"></i>
			</Button> : ''
	};

	checkedRow = () => {
		if (this.state.data.length > 0) {
			let length = this.state.data.length - 1;
			let temp = this.state.data?.[length].productId !== "" ?
				this.state.data?.[length].productId : -2;
			if (temp > -1) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	// setDate = (props, value) => {
	// 	const { term } = this.state;
	// 	const val = term ? term.value.split('_') : '';
	// 	const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
	// 	const values = value
	// 		? value
	// 		: moment(props.values.invoiceDate, 'DD-MM-YYYY').toDate();
	// 	if (temp && values) {
	// 		const date = moment(values)
	// 			.add(temp - 1, 'days')
	// 			.format('DD-MM-YYYY');
	// 		props.setFieldValue('invoiceDueDate', date, true);
	// 	}
	// };

	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});
		if (result && result[0] && result[0].exchangeRate)
			this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
		this.exchangeRaterevalidate(result[0].exchangeRate)
	};

	setCurrency = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});

		this.formRef.current.setFieldValue('curreancyname', result[0].currencyName, true);
	};

	updateAmount = (data, props) => {
		const { vat_list, excise_list } = this.state;
		const { discountPercentage, discountAmount } = this.state;
		let total_net = 0;
		let total_excise = 0;
		let total = 0;
		let total_vat = 0;
		let net_value = 0;
		let discount_total = 0;
		data.map((obj) => {
			const index =
				obj.vatCategoryId !== ''
					? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
					: '';
			const vat = index !== '' && index >= 0 ? vat_list[`${index}`].vat : 0;
			//Excise calculation
			if (this.state.taxType === false) {
				if (obj.discountType === 'PERCENTAGE') {
					net_value =
						((+obj.unitPrice -
							(+((obj.unitPrice * obj.discount)) / 100)) * obj.quantity);
					var discount = (obj.unitPrice * obj.quantity) - net_value
					if (obj.exciseTaxId != 0) {
						if (obj.exciseTaxId === 1) {
							const value = +(net_value) / 2;
							net_value = parseFloat(net_value) + parseFloat(value);
							obj.exciseAmount = parseFloat(value);
						} else if (obj.exciseTaxId === 2) {
							const value = net_value;
							net_value = parseFloat(net_value) + parseFloat(value);
							obj.exciseAmount = parseFloat(value);
						}

					}
					else {
						obj.exciseAmount = 0
					}
					var vat_amount =
						vat === 0 ? 0 :
							((+net_value * vat) / 100);
				} else {
					net_value =
						((obj.unitPrice * obj.quantity) - obj.discount)
					var discount = (obj.unitPrice * obj.quantity) - net_value
					if (obj.exciseTaxId != 0) {
						if (obj.exciseTaxId === 1) {
							const value = +(net_value) / 2;
							net_value = parseFloat(net_value) + parseFloat(value);
							obj.exciseAmount = parseFloat(value);
						} else if (obj.exciseTaxId === 2) {
							const value = net_value;
							net_value = parseFloat(net_value) + parseFloat(value);
							obj.exciseAmount = parseFloat(value);
						}

					}
					else {
						obj.exciseAmount = 0
					}
					var vat_amount =
						vat === 0 ? 0 :
							((+net_value * vat) / 100);
				}

			}
			//Inclusive case
			else {
				if (obj.discountType === 'PERCENTAGE') {

					//net value after removing discount
					net_value =
						((+obj.unitPrice -
							(+((obj.unitPrice * obj.discount)) / 100)) * obj.quantity);

					//discount amount
					var discount = (obj.unitPrice * obj.quantity) - net_value

					//vat amount
					var vat_amount =
						vat === 0 ? 0 :
							(+net_value * (vat / (100 + vat) * 100)) / 100;

					//net value after removing vat for inclusive
					net_value = net_value - vat_amount

					//excise calculation
					if (obj.exciseTaxId != 0) {
						if (obj.exciseTaxId === 1) {
							const value = net_value / 3
							net_value = net_value
							obj.exciseAmount = parseFloat(value);
						}
						else if (obj.exciseTaxId === 2) {
							const value = net_value / 2
							obj.exciseAmount = parseFloat(value);
							net_value = net_value
						}

					}
					else {
						obj.exciseAmount = 0
					}
				}

				else // fixed discount
				{
					//net value after removing discount
					net_value =
						((obj.unitPrice * obj.quantity) - obj.discount)


					//discount amount
					var discount = (obj.unitPrice * obj.quantity) - net_value

					//vat amount
					var vat_amount =
						vat === 0 ? 0 :
							(+net_value * (vat / (100 + vat) * 100)) / 100;;

					//net value after removing vat for inclusive
					net_value = net_value - vat_amount

					//excise calculation
					if (obj.exciseTaxId != 0) {
						if (obj.exciseTaxId === 1) {
							const value = net_value / 3
							net_value = net_value
							obj.exciseAmount = parseFloat(value);
						}
						else if (obj.exciseTaxId === 2) {
							const value = net_value / 2
							obj.exciseAmount = parseFloat(value);
							net_value = net_value
						}

					}
					else {
						obj.exciseAmount = 0
					}
				}

			}


			obj.vatAmount = vat_amount
			obj.subTotal =
				net_value ? parseFloat(net_value) + parseFloat(vat_amount) : 0;
			discount_total = +discount_total + discount
			total_net = +(total_net + parseFloat(net_value));
			total_vat = +(total_vat + vat_amount);
			total_excise = +(total_excise + obj.exciseAmount)
			total = total_vat + total_net;
			return obj;
		});

		// const discount =
		// 	props.values.discountType.value === 'PERCENTAGE'
		// 		? +((total_net * discountPercentage) / 100)
		// 		: discountAmount;
		this.setState(
			{
				data,
				initValue: {
					...this.state.initValue,
					...{
						total_net: total_net - total_excise,
						invoiceVATAmount: total_vat,
						discount: discount_total ? discount_total : 0,
						totalAmount: total,
						total_excise: total_excise
					},

				},
			},

		);
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

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true, disableLeavePage: true });
		const {
			attachmentDescription,
			receiptNumber,
			quotaionExpiration,
			quotationdate,
			currency,
			customerId,
			quotation_Number,
			notes,
			placeOfSupplyId,
			discount,
			discountType,
			discountPercentage,
			quotationId,
			footNote,
			exchangeRate
		} = data;
		const { term } = this.state;

		let formData = new FormData();
		formData.append('taxType', this.state.taxType)
		formData.append('exchangeRate', exchangeRate !== null ? exchangeRate : '');
		formData.append('quotationNumber', quotation_Number !== null ? this.state.prefix + quotation_Number : '',);
		formData.append('quotaionExpiration', quotaionExpiration ? quotaionExpiration : '',);
		formData.append('quotationdate', quotationdate ? quotationdate : '',);
		formData.append('totalExciseAmount', this.state.initValue.total_excise);
		if (placeOfSupplyId) {
			formData.append('placeOfSupplyId', placeOfSupplyId.value ? placeOfSupplyId.value : placeOfSupplyId);
		};
		formData.append('exciseType', this.state.checked);
		formData.append('notes', notes ? notes : '');
		formData.append('receiptNumber', receiptNumber !== null ? receiptNumber : '');
		formData.append('attachmentDescription', attachmentDescription !== null ? attachmentDescription : '',);
		formData.append('type', 6);
		formData.append('lineItemsString', JSON.stringify(this.state.data));
		formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
		formData.append('totalAmount', this.state.initValue.totalAmount);
		formData.append('discount', this.state.initValue.discount);
		if (customerId && customerId.value) {
			formData.append('customerId', customerId.value);
		}
		formData.append('currencyCode', this.state.supplier_currency);
		if (this.state.quotationId != null || this.state.parentId != null) {
			formData.append('customerId', this.state.customerId);
		}
		if (placeOfSupplyId) {
			formData.append('placeOfSupplyId', placeOfSupplyId.value ? placeOfSupplyId.value : placeOfSupplyId);
		}
		if (this.uploadFile && this.uploadFile.files && this.uploadFile?.files?.[0]) {
			formData.append('attachmentFile', this.uploadFile?.files?.[0]);
		}
		this.setState({ loading: true, loadingMsg: "Creating Quotation..." });
		this.props.quotationCreateAction
			.createQuotation(formData)
			.then((res) => {
				this.setState({ disabled: false });
				// this.setState({ loading:false});
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'New Quotation Created Successfully.',
				);
				if (this.state.createMore) {
					this.setState(
						{
							createMore: false,
							selectedContact: '',
							term: '',
							disableLeavePage: false,
							quotationDateForVatValidation: new Date(),
							data: [
								{
									id: 0,
									description: '',
									quantity: 1,
									unitPrice: '',
									vatCategoryId: '',
									exciseTaxId: '',
									discountType: 'FIXED',
									exciseAmount: '',
									discount: 0,
									subTotal: 0,
									vatAmount: 0,
									productId: '',
									isExciseTaxExclusive: '',
									unitType: '',
									unitTypeId: ''
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
									total_excise: 0,
									discountPercentage: '',
								},

							},
							customer_taxTreatment_des: ''
						},
						() => {
							resetForm(this.state.initValue);
							this.setState({
								data: [
									{
										id: 0,
										description: '',
										quantity: 1,
										unitPrice: '',
										vatCategoryId: '',
										exciseTaxId: '',
										discountType: 'FIXED',
										exciseAmount: '',
										discount: 0,
										subTotal: 0,
										vatAmount: 0,
										productId: '',
										isExciseTaxExclusive: '',
										unitType: '',
										unitTypeId: ''
									},
								],
								customer_taxTreatment_des: '',
								loading: false
							})
							this.getInvoiceNo();
							if (this.formRef.current && this.state.data)
								this.formRef.current.setFieldValue(
									'lineItemsString',
									this.state.data,
									false,
								);
						},
					);
				} else {
					this.props.history.push('/admin/income/quotation');
					this.setState({ loading: false, });

				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'New Quotation Created Unsuccessfully',
				);
			});
	};
	openInvoiceNumberModel = (props) => {
		this.setState({ openInvoiceNumberModel: true });
	};

	openCustomerModal = (e) => {
		this.setState({ openCustomerModal: true });
	};

	openProductModal = (props) => {
		this.setState({ openProductModal: true });
	};


	checkAmount = (discount) => {
		const { initValue } = this.state;
		if (discount >= initValue.totalAmount) {
			this.setState({
				param: true
			});
		}
		else {
			this.setState({
				param: false
			});
		}

	}

	getCurrentUser = (data) => {
		let option;
		if (data.label || data.value) {
			option = data;
		} else {
			option = {
				label: `${data.organization !== "" ? data.organization : data.fullName}`,
				value: data.id,
			};
		}

		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === data.currencyCode;
		});

		this.setState({
			supplier_currency: data.currencyCode,
			customer_currency_des: result[0] && result[0].currencyName ? result[0].currencyName : "AED",
			supplier_currency_symbol: data.currencyIso ? data.currencyIso : "AED",
			customer_taxTreatment_des: data.taxTreatment ? data.taxTreatment : ""
		});

		this.formRef.current.setFieldValue('contactId', option, true);
		this.formRef.current.setFieldValue('customerId', option, true);
		if (result[0] && result[0].currencyCode)
			this.formRef.current.setFieldValue('currency', result[0].currencyCode, true);

		this.formRef.current.setFieldValue('taxTreatmentid', data.taxTreatmentId, true);

		if (result[0] && result[0].exchangeRate)
			this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
		
		if (data.taxTreatmentId !== 5 && data.taxTreatmentId !== 6 && data.taxTreatmentId !== 7) {
			this.props.quotationCreateAction.getCustomerShippingAddressbyID(data.id).then((res) => {
				if (res.status === 200) {
					var PlaceofSupply = this.placelist &&
						selectOptionsFactory.renderOptions(
							'label',
							'value',
							this.placelist,
							'Place of Supply',).
							find((option) => option.label.toUpperCase() === res.data.shippingStateName.toUpperCase())
					if (PlaceofSupply) {
						this.setState({ placeOfSupplyId: PlaceofSupply });
						this.formRef.current.setFieldValue('placeOfSupplyId', PlaceofSupply.value, true);
					}
				}
			});
		}
	};
	getCurrency = (opt) => {
		let supplier_currencyCode = 0;

		this.props.supplier_list.map(item => {
			if (item.label.contactId == opt) {
				this.setState({
					supplier_currency: item.label.currency.currencyCode,
					supplier_currency_des: item.label.currency.currencyName,
					supplier_currency_symbol: item.label.currency.currencyIsoCode
				});

				supplier_currencyCode = item.label.currency.currencyCode;
			}
		})

		return supplier_currencyCode;
	}
	closeCustomerModal = (res) => {
		if (res) {
			this.props.requestForQuotationAction.getSupplierList(this.state.contactType);
			this.getInvoiceNo();
		}
		this.setState({ openCustomerModal: false });
	};

	closeProductModal = (res) => {
		this.setState({ openProductModal: false });
	};
	closeInvoiceNumberModel = (res) => {
		this.setState({ openInvoiceNumberModel: false });
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
	getCurrentProduct = () => {
		this.props.requestForQuotationAction.getProductList().then((res) => {
			let newData = []
			const data = this.state.data;
			newData = data.filter((obj) => obj.productId !== "");
			// props.setFieldValue('lineItemsString', newData, true);
			// this.updateAmount(newData, props);
			this.setState(
				{
					data: newData.concat({

						id: this.state.idCount + 1,
						description: res.data[0].description,
						quantity: 1,
						discount: 0,
						unitPrice: res.data[0].unitPrice,
						vatCategoryId: res.data[0].vatCategoryId,
						exciseTaxId: res.data[0].exciseTaxId,
						subTotal: res.data[0].unitPrice,
						productId: res.data[0].id,
						discountType: res.data[0].discountType,
						unitType: res.data[0].unitType,
						unitTypeId: res.data[0].unitTypeId,
						vatAmount: res.data[0].vatAmount ? res.data[0].vatAmount : 0,
					}),
					idCount: this.state.idCount + 1,
				},
				() => {
					const values = {
						values: this.state.initValue,
					};
					this.updateAmount(this.state.data, values);
					this.addRow();
					this.getProductType(res.data[0].id);
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
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.discount`,
				1,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.discountType`,
				1,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.vatCategoryId`,
				res.data[0].vatCategoryId,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.productId`,
				res.data[0].id,
				true,
			);
		});
	};
	getCurrentNumber = (data) => {
		this.getInvoiceNo();
	};

	getInvoiceNo = () => {
		this.props.quotationCreateAction.getQuotationNo().then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
						...this.state.initValue,
						...{
							quotation_Number: res.data,
						},
					},
				});
				if (res && res.data && this.formRef.current)
					this.formRef.current.setFieldValue('quotation_Number', res.data, true, this.validationCheck(res.data));
			}
		});
	};


	validationCheck = (value) => {
		const data = {
			moduleType: 14,
			name: value,
		};
		this.props.quotationCreateAction
			.checkValidation(data)
			.then((response) => {
				if (response.data === 'Quotation Number Already Exists') {
					this.setState(
						{
							exist: true,
						},
						() => {

						},
					);
				} else {
					this.setState({
						exist: false,
					});
				}
			});
	};

	getTaxTreatment = (opt) => {

		let customer_taxTreatmentId = 0;
		let customer_item_taxTreatment = ''
		this.props.supplier_list.map(item => {
			if (item.label.contactId == opt) {
				this.setState({
					customer_taxTreatment: item.label.taxTreatment.id,
					customer_taxTreatment_des: item.label.taxTreatment.taxTreatment,
					// customer_currency_symbol: item.label.currency.currencyIsoCode,
				});

				customer_taxTreatmentId = item.label.taxTreatment.id;
				customer_item_taxTreatment = item.label.currency
			}
		})

		return customer_taxTreatmentId;
	}

	render() {
		strings.setLanguage(this.state.language);
		const { loading, loadingMsg, isRegisteredVat } = this.state
		const { data, discountOptions, initValue, prefix, param } = this.state;

		const {
			currency_list,
			supplier_list,
			universal_currency_list,
			currency_convert_list,
		} = this.props;

		let tmpSupplier_list = []

		supplier_list.map(item => {
			let obj = { label: item.label.contactName, value: item.value }
			tmpSupplier_list.push(obj)
		})


		return (
			loading == true ? <Loader loadingMsg={loadingMsg} /> : <div>
				<div className="create-supplier-invoice-screen">
					<div className=" fadeIn">
						<Row>
							<Col lg={12} className="mx-auto">
								<Card>
									<CardHeader>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-box-open" />
													<span className="ml-2">{strings.CreateQuotation}</span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										{loading ? (
											<Row>
												<Col lg={12}>
													<Loader />
												</Col>
											</Row>
										) : (
											<Row>
												<Col lg={12}>
													<Formik
														initialValues={initValue}
														ref={this.formRef}
														onSubmit={(values, { resetForm }) => {
															this.handleSubmit(values, resetForm);

														}}
														validate={(values) => {
															console.log(values, "values")
															let errors = {};
															if (this.state.exist === true) {
																errors.quotation_Number =
																	'Quotation number already exists';
															}
															if (values.quotation_Number === '') {
																errors.quotation_Number = strings.QuotationNumberIsRequired
															}
															// 	if(this.state.customer_taxTreatment_des=="VAT REGISTERED" 
															// 	||this.state.customer_taxTreatment_des=="VAT REGISTERED DESIGNATED ZONE" 
															// 	||this.state.customer_taxTreatment_des=="GCC VAT REGISTERED" )
															// 	{
															// 	if (!values.placeOfSupplyId)
															// 		errors.placeOfSupplyId ='Place of supply is required';
															//  	if (values.placeOfSupplyId &&
															// 		(values.placeOfSupplyId=="" ||
															// 		(values.placeOfSupplyId.label && values.placeOfSupplyId.label === "Select place of supply")
															// 	 )
															// 	) 
															// 	  errors.placeOfSupplyId ='Place of supply is required';
															//    }
															if (this.state.customer_taxTreatment_des != "NON GCC" && this.state.customer_taxTreatment_des != "GCC NON-VAT REGISTERED" && this.state.customer_taxTreatment_des != "GCC VAT REGISTERED") {
																if (!values.placeOfSupplyId)
																	errors.placeOfSupplyId = strings.PlaceOfSupplyRequired
																if (values.placeOfSupplyId &&
																	(values.placeOfSupplyId == "" ||
																		(values.placeOfSupplyId.label && values.placeOfSupplyId.label === "Select Place of Supply")
																	)
																)
																	errors.placeOfSupplyId = 'Place of supply is required';
															}
															if (param === true) {
																errors.discount =
																	'Discount amount Cannot be greater than invoice total amount';
															}
															if (!values.quotationdate) {
																errors.quotationdate =
																	strings.QuotationDateRequired
															}
															if (values.quotationdate && values.quotaionExpiration && (values.quotationdate > values.quotaionExpiration)) {
																errors.quotaionExpiration = 'Expiry date should be later than the quotation date';
																errors.quotationdate = 'Quotation date should be earlier than the expiration date';
															}
															return errors;
														}}
														validationSchema={Yup.object().shape(
															{
																quotation_Number: Yup.string().required(
																	'Invoice number is required',
																),
																customerId: Yup.string().required(
																	strings.Customer_Name_Is_Required
																	
																),
																// placeOfSupplyId: Yup.string().required('Place of supply is required'),

																//  poApproveDate: Yup.string().required(
																// 	'Order date is required',
																// ),
																quotaionExpiration: Yup.string().required(
																	'Expiry date is required'
																),
																quotationdate: Yup.string().required(
																	'Quotation date is required'
																),
																lineItemsString: Yup.array()
																	.required(
																		'Atleast one invoice sub detail is mandatory',
																	)
																	.of(
																		Yup.object().shape({
																			quantity: Yup.string()
																				.test(
																					'quantity',
																					strings.QuantityGreaterThan0,
																					(value) => {
																						if (value > 0) {
																							return true;
																						} else {
																							return false;
																						}
																					},
																				).required('Quantity is required'),
																			unitPrice: Yup.string()
																				.test(
																					'Unit Price',
																					strings.UnitPriceGreaterThan1,
																					(value) => {
																						if (value > 1) {
																							return true;
																						} else {
																							return false;
																						}
																					},
																				).required('Unit price is required'),
																			vatCategoryId: Yup.string().required(
																				strings.VATIsRequired,
																			),
																			productId: Yup.string().required(
																				strings.Product_Is_Required
																				
																			),
																		}),
																	),
																attachmentFile: Yup.mixed()
																	.test(
																		'fileType',
																		'*Unsupported file format',
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
																		'*File size is too large',
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
																			<Label htmlFor="quotation_Number">
																				<span className="text-danger">* </span>
																				{strings.QuotationNumber}
																			</Label>
																			<Input
																				type="text"
																				maxLength="50"
																				id="quotation_Number"
																				name="quotation_Number"
																				placeholder={strings.QuotationNumber}
																				value={props.values.quotation_Number}
																				onBlur={props.handleBlur('quotation_Number')}
																				onChange={(option) => {
																					if (
																						option.target.value === '' ||
																						this.regExInvNum.test(
																							option.target.value,
																						)
																					) {
																						props.handleChange('quotation_Number')(
																							option,
																						);
																					}
																					this.validationCheck(option.target.value)
																				}}
																				className={
																					props.errors.quotation_Number &&
																						props.touched.quotation_Number
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.quotation_Number &&
																				props.touched.quotation_Number && (
																					<div className="invalid-feedback">
																						{props.errors.quotation_Number}
																					</div>
																				)}
																		</FormGroup>
																	</Col>
																</Row>
																<Row>
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="customerId">
																				<span className="text-danger">* </span>
																				{strings.CustomerName}
																			</Label>
																			<Select
																				id="customerId"
																				name="customerId"
																				placeholder={strings.Select + strings.CustomerName}
																				options={
																					tmpSupplier_list
																						? selectOptionsFactory.renderOptions(
																							'label',
																							'value',
																							tmpSupplier_list,
																							'Customer Name',
																						)
																						: []
																				}
																				value={props.values.customerId}
																				// onChange={(option) => {
																				// 	if (option && option.value) {
																				// 		props.handleChange('customerId')(option);
																				// 	} else {

																				// 		props.handleChange('customerId')('');
																				// 	}
																				// }}
																				onChange={(option) => {
																					if (option && option.value) {
																						this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																						this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(option.value), true);
																						this.setExchange(this.getCurrency(option.value));
																						props.handleChange('customerId')(option);
																					} else {
																						props.handleChange('customerId')('');
																					}
																					this.resetVatId(props);
																					this.getCustomerShippingAddress(option.value, this.getTaxTreatment(option.value), props);
																				}}
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

																	<Col lg={3}>
																		<Label
																			htmlFor="contactId"
																			style={{ display: 'block' }}
																		>
																			{strings.AddNewCustomer}
																		</Label>
																		<Button
																			color="primary"
																			className="btn-square"
																			// style={{ marginBottom: '40px' }}
																			onClick={() =>
																				this.openCustomerModal()
																				//  this.props.history.push(`/admin/payroll/employee/create`,{goto:"Expense"})
																				// this.props.history.push(`/admin/master/contact/create`,{gotoParentURL:"/admin/income/quotation/create"})
																			}

																		>
																			<i className="fas fa-plus mr-1" />
																			{strings.AddACustomer}
																		</Button></Col>
																	{this.state.customer_taxTreatment_des && isRegisteredVat &&
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
																						this.state.customer_taxTreatment_des

																					}
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
																	}
																	<Col lg={3}>
																		{this.state.customer_taxTreatment_des !== "NON GCC" && this.state.customer_taxTreatment_des !== "GCC VAT REGISTERED" && this.state.customer_taxTreatment_des !== "GCC NON-VAT REGISTERED" &&
																			(<FormGroup className="mb-3">
																				<Label htmlFor="placeOfSupplyId">
																					<span className="text-danger">* </span>
																					{/* {this.state.customer_taxTreatment_des &&
																		(this.state.customer_taxTreatment_des=="VAT REGISTERED" 
																		||this.state.customer_taxTreatment_des=="VAT REGISTERED DESIGNATED ZONE" 
																		||this.state.customer_taxTreatment_des=="GCC VAT REGISTERED")
																		 && (
																			<span className="text-danger">* </span>
																		)} */}
																					{strings.PlaceofSupply}
																				</Label>
																				<Select
																					id="placeOfSupplyId"
																					name="placeOfSupplyId"
																					placeholder={strings.Select + strings.PlaceofSupply}
																					options={
																						this.placelist
																							? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								this.placelist,
																								'Place of Supply',

																							)
																							: []
																					}
																					value={
																						this.placelist &&
																						selectOptionsFactory.renderOptions(
																							'label',
																							'value',
																							this.placelist,
																							strings.PlaceofSupply,
																						).find(
																							(option) =>
																								option.value ==
																								((this.state.quotationId || this.state.parentId) ? this.state.placeOfSupplyId.value ? this.state.placeOfSupplyId.value : this.state.placeOfSupplyId :
																									props.values.placeOfSupplyId.toString()))
																					}
																					className={
																						props.errors.placeOfSupplyId &&
																							props.touched.placeOfSupplyId
																							? 'is-invalid'
																							: ''
																					}
																					onChange={(option) => {
																						props.handleChange('placeOfSupplyId')(
																							option,
																						)
																						this.setState({
																							placeOfSupplyId: option
																						})
																					}}
																				/>
																				{props.errors.placeOfSupplyId &&
																					props.touched.placeOfSupplyId && (
																						<div className="invalid-feedback">
																							{props.errors.placeOfSupplyId}
																						</div>
																					)}
																			</FormGroup>)}
																	</Col>



																</Row>
																<hr />
																<Row>
																	{/* <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">* </span>
																		Start Date
																	</Label>
																	<DatePicker
																		id="date"
																		name="poApproveDate"
																		className={`form-control ${
																			props.errors.poApproveDate &&
																			props.touched.poApproveDate
																				? 'is-invalid'
																				: ''
																		}`}
																		placeholderText="Order date"
																		selected={props.values.poApproveDate}
																		showMonthDropdown
																		showYearDropdown
																		dropdownMode="select"
																		dateFormat="dd-MM-yyyy"
																		maxDate={new Date()}
																		onChange={(value) => {
																			props.handleChange('poApproveDate')(value);
																		}}
																	/>
																	{props.errors.poApproveDate &&
																		props.touched.poApproveDate && (
																			<div className="invalid-feedback">
																				{props.errors.poApproveDate}
																			</div>
																		)}
																</FormGroup>
															</Col> */}
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="date">
																				<span className="text-danger">* </span>
																				{strings.QuotationDate}
																			</Label>
																			<DatePicker
																				id="quotationdate"
																				name="quotationdate"
																				className={`form-control ${props.errors.quotationdate &&
																					props.touched.quotationdate
																					? 'is-invalid'
																					: ''
																					}`}
																				placeholderText={strings.QuotationDate}
																				selected={props.values.quotationdate ? new Date(props.values.quotationdate) : props.values.quotationdate}
																				showMonthDropdown
																				showYearDropdown
																				dropdownMode="select"
																				dateFormat="dd-MM-yyyy"
																				onChange={(value) => {
																					if ((this.state.quotationDateForVatValidation < this.state.companyVATRegistrationDate && value > this.state.companyVATRegistrationDate) || (value < this.state.companyVATRegistrationDate && this.state.quotationDateForVatValidation > this.state.companyVATRegistrationDate)) {
																						this.resetVatId(props);
																					}
																					this.setState({ quotationDateForVatValidation: value });
																					props.handleChange('quotationdate')(value);
																					const minExpirationDate = value ? new Date(value) : null;
																					props.setFieldValue('quotaionExpiration', null);
																					props.setFieldTouched('quotaionExpiration', false); 
																					props.setFieldError('quotaionExpiration', '');
																					props.setFieldValue('quotaionExpiration', minExpirationDate); 
																				}}
																			/>
																			{props.errors.quotationdate &&
																				props.touched.quotationdate && (
																					<div className="invalid-feedback">
																						{props.errors.quotationdate}
																						{/* {props.errors.quotationdate.includes("nullable()") ? "Quotation date is required" :props.errors.quotationdate} */}
																					</div>
																				)}

																		</FormGroup>
																	</Col>
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="due_date">
																				<span className="text-danger">* </span>
																				{strings.ExpirationDate}
																			</Label>
																			<DatePicker
																				id="date"
																				name="quotaionExpiration"
																				className={`form-control ${props.errors.quotaionExpiration &&
																					props.touched.quotaionExpiration
																					? 'is-invalid'
																					: ''
																					}`}
																				placeholderText={strings.ExpirationDate}
																				selected={props.values.quotaionExpiration ? new Date(props.values.quotaionExpiration) : props.values.quotaionExpiration}
																				showMonthDropdown
																				showYearDropdown
																				dropdownMode="select"
																				dateFormat="dd-MM-yyyy"
																				minDate={props.values.quotationdate ? new Date(props.values.quotationdate) : null}
																				onChange={(value) => {
																					props.handleChange('quotaionExpiration')(value);
																				}}
																			/>
																			{props.errors.quotaionExpiration &&
																				props.touched.quotaionExpiration && (
																					<div className="invalid-feedback">
																						{/* {props.errors.quotaionExpiration} */}
																						{props.errors.quotaionExpiration.includes("nullable()") ? strings.ExpiryDateRequired : props.errors.quotaionExpiration}
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
																				isDisabled={true}
																				placeholder={strings.Select + strings.Currency}
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
																				id="currency"
																				name="currency"
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
																								this.state.supplier_currency,
																						)
																				}
																				onChange={(option) => {
																					props.handleChange('currency')(option);
																					this.setExchange(option.value);
																					this.setCurrency(option.value)
																				}}
																				className={`${props.errors.currency &&
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
																</Row>
																<hr style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }} />

																<Row style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }}>
																	<Col>
																		<Label >
																			{strings.CurrencyExchangeRate}
																		</Label>
																	</Col>
																</Row>

																<Row style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }}>
																	<Col md={1}>
																		<Input
																			disabled
																			id="1"
																			name="1"
																			value={
																				1}

																		/>
																	</Col>
																	<Col md={2}>
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
																					value={this.state?.supplier_currency_symbol}
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
																						this.exchangeRaterevalidate(parseFloat(value.target.value))
																					}}
																				/>
																			</div>
																		</FormGroup>
																	</Col>
																	<Col lg={2}>
																		<Input
																			type="text"
																			min="0"
																			disabled
																			id="currencyName"
																			name="currencyName"
																			value={
																				this.state?.basecurrency?.currencyName}

																		/>
																	</Col>


																</Row>

																<hr style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }} />

																<Row>
																	<Col lg={8} className="mb-3">
																		{/* <Button
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
																	<i className="fa fa-plus"></i>{' '}{strings.Addmore} 
																</Button> */}
																		<Button
																			color="primary"
																			className="btn-square mr-3"
																			onClick={(e, props) => {
																				this.openProductModal();
																				// this.props.history.push(`/admin/master/product/create`,{gotoParentURL:"/admin/income/quotation/create"})
																			}}
																		>
																			<i className="fa fa-plus"></i>{' '}{strings.Addproduct}
																		</Button>
																	</Col>

																	<Col  >
																		{this.state.taxType === false ?
																			<span style={{ color: "#0069d9" }} className='mr-4'><b>{strings.Exclusive}</b></span> :
																			<span className='mr-4'>{strings.Exclusive}</span>}
																		<Switch
																			value={props.values.taxType}
																			checked={this.state.taxType}
																			onChange={(taxType) => {

																				props.handleChange('taxType')(taxType);
																				this.setState({ taxType }, () => {
																					this.updateAmount(
																						this.state.data,
																						props
																					)
																				});


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
																		{this.state.taxType === true ?
																			<span style={{ color: "#0069d9" }} className='ml-4'><b>{strings.Inclusive}</b></span>
																			: <span className='ml-4'>{strings.Inclusive}</span>
																		}
																	</Col>
																</Row>
																<Row>
																	<Col lg={12}>
																		{props.errors.lineItemsString &&
																			props.errors.lineItemsString === 'string' && (
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
																		<BootstrapTable
																			options={this.options}
																			data={data}
																			version="4"
																			hover
																			keyField="id"
																			className="invoice-create-table"
																		>
																			<TableHeaderColumn
																				width="4%"
																				dataAlign="center"
																				dataFormat={(cell, rows) =>
																					this.renderActions(cell, rows, props)
																				}
																			></TableHeaderColumn>
																			<TableHeaderColumn
																				//width="17%"
																				dataField="product"
																				dataFormat={(cell, rows) =>
																					this.renderProduct(cell, rows, props)
																				}
																			>
																				{strings.PRODUCT}
																			</TableHeaderColumn>

																			<TableHeaderColumn
																				dataField="quantity"
																				//width="13%"
																				dataFormat={(cell, rows) =>
																					this.renderQuantity(cell, rows, props)
																				}
																			>
																				{strings.QUANTITY}
																			</TableHeaderColumn>
																			{/* <TableHeaderColumn
																				width="5%"
																				dataField="unitType"
																			>{strings.Unit}	<i
																					id="unitTooltip"
																					className="fa fa-question-circle"
																				/> <UncontrolledTooltip
																					placement="right"
																					target="unitTooltip"
																				>
																					Units / Measurements</UncontrolledTooltip>
																			</TableHeaderColumn> */}
																			<TableHeaderColumn
																				//width="10%"
																				dataField="unitPrice"
																				dataFormat={(cell, rows) =>
																					this.renderUnitPrice(cell, rows, props)
																				}
																			>
																				{strings.UNITPRICE}
																				<i
																					id="UnitPriceToolTip"
																					className="fa fa-question-circle ml-1"
																				></i>
																				<UncontrolledTooltip
																					placement="right"
																					target="UnitPriceToolTip"
																				>
																					Unit Price – Price of a single product or
																					service
																				</UncontrolledTooltip>
																			</TableHeaderColumn>
																			{this.state.discountEnabled == true &&
																				<TableHeaderColumn
																					//width="12%"
																					dataField="discount"
																					dataFormat={(cell, rows) =>
																						this.renderDiscount(cell, rows, props)
																					}
																				>
																					{strings.DisCount}
																				</TableHeaderColumn>}
																			{initValue.total_excise != 0 &&
																				<TableHeaderColumn
																					//width="10%"
																					dataField="exciseTaxId"
																					dataFormat={(cell, rows) =>
																						this.renderExcise(cell, rows, props)
																					}
																				>
																					{strings.Excises}
																					<i
																						id="ExiseTooltip"
																						className="fa fa-question-circle ml-1"
																					></i>
																					<UncontrolledTooltip
																						placement="right"
																						target="ExiseTooltip"
																					>
																						Excise dropdown will be enabled only for the excise products
																					</UncontrolledTooltip>
																				</TableHeaderColumn>}
																			{isRegisteredVat &&
																				<TableHeaderColumn
																					width="250px"
																					dataField="vat"
																					dataFormat={(cell, rows) =>
																						this.renderVat(cell, rows, props)
																					}
																				>
																					{strings.VAT}
																				</TableHeaderColumn>
																			}
																			{isRegisteredVat &&
																				<TableHeaderColumn
																					//width="10%"
																					width = {"250px"}
																					dataField="sub_total"
																					dataFormat={this.renderVatAmount}
																					className="text-right"
																					columnClassName="text-right"
																					formatExtraData={universal_currency_list}
																				>
																					{strings.VATAMOUNT}
																				</TableHeaderColumn>
																			}
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
																<Row className="ml-4 ">
																	<Col className=" ml-4">
																		<FormGroup className='pull-right'>
																			<Input
																				type="checkbox"
																				id="discountEnabled"
																				checked={this.state.discountEnabled}
																				onChange={(option) => {
																					if (initValue.discount > 0) {
																						this.setState({ discountEnabled: true })
																					} else {
																						this.setState({ discountEnabled: !this.state.discountEnabled })
																					}
																				}}
																			/>
																			<Label>{strings.ApplyLineItemDiscount}</Label>
																		</FormGroup>
																	</Col>
																</Row>
																<hr />
																{this.state.data.length > 0 ? (
																	<Row>
																		<Col lg={8}>
																			<FormGroup className="py-2">
																				<Label htmlFor="notes">{strings.TermsAndConditions}</Label><br />
																				<TextField
																					type="textarea"
																					multiline
																					style={{ width: "500px" }}
																					className="textarea"
																					inputProps={{ maxLength: 255 }}
																					name="notes"
																					id="notes"
																					rows="1"
																					maxRows={4}
																					placeholder={strings.DeliveryNotes}
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
																							{strings.ReferenceNumber}
																						</Label>
																						<Input
																							type="text"
																							style={{ width: "500px" }}
																							maxLength="20"
																							id="receiptNumber"
																							name="receiptNumber"
																							value={props.values.receiptNumber}
																							placeholder={strings.ReceiptNumber}
																							onChange={(value) => {
																								props.handleChange('receiptNumber')(value);
																							}}
																							className={props.errors.receiptNumber && props.touched.receiptNumber ? "is-invalid" : ""}
																						/>
																						{props.errors.receiptNumber && props.touched.receiptNumber && (
																							<div className="invalid-feedback">{props.errors.receiptNumber}</div>
																						)}
																					</FormGroup>
																				</Col>
																				<Col lg={6}>
																					<FormGroup className="mb-3 hideAttachment">
																						<Field
																							name="attachmentFile"
																							render={({ field, form }) => (
																								<div>
																									<Label>{strings.ReceiptAttachment}</Label>{' '}
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
																			<FormGroup className="mb-3 hideAttachment">
																				<Label htmlFor="attachmentDescription">
																					{strings.AttachmentDescription}
																				</Label><br />
																				<TextField
																					type="textarea"
																					className="textarea form-control"
																					maxLength="250"
																					style={{ width: "500px" }}
																					name="attachmentDescription"
																					id="attachmentDescription"
																					rows="2"
																					placeholder={strings.ReceiptAttachmentDescription}
																					onChange={(option) =>
																						props.handleChange(
																							'attachmentDescription',
																						)(option)
																					}
																					value={props.values.attachmentDescription}
																				/>
																			</FormGroup>

																		</Col>

																		<Col lg={4}>
																			<div className="">
																				{initValue.total_excise > 0 ?
																					<div className="total-item p-2" >
																						{/* style={{display:this.state.checked === true ? '':'none'}} */}
																						<Row>
																							<Col lg={6}>
																								<h5 className="mb-0 text-right">
																									{strings.Total_Excise}
																								</h5>
																							</Col>
																							<Col lg={6} className="text-right">
																								<label className="mb-0">

																									{this.state.supplier_currency_symbol} &nbsp;
																									{initValue.total_excise.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																								</label>
																							</Col>
																						</Row>
																					</div> : ''}
																				{this.state.discountEnabled == true ?
																					<div className="total-item p-2">
																						<Row>
																							<Col lg={6}>
																								<h5 className="mb-0 text-right">
																									{strings.Discount}
																								</h5>
																							</Col>
																							<Col lg={6} className="text-right">
																								<label className="mb-0">
																									{/* {universal_currency_list[0] && (
																							<Currency
																								value={initValue.total_net.toFixed(
																									2,
																								)}
																								currencySymbol={
																									universal_currency_list[0]
																										? universal_currency_list[0]
																												.currencyIsoCode
																										: 'USD'
																								}
																							/>
																						)} */}
																									{this.state.supplier_currency_symbol} &nbsp;
																									{initValue.discount.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																								</label>
																							</Col>
																						</Row>
																					</div> : ''}
																				<div className="total-item p-2">
																					<Row>
																						<Col lg={6}>
																							<h5 className="mb-0 text-right">
																								{strings.TotalNet}
																							</h5>
																						</Col>
																						<Col lg={6} className="text-right">
																							<label className="mb-0">
																								{/* {universal_currency_list[0] && (
																							<Currency
																								value={initValue.total_net.toFixed(
																									2,
																								)}
																								currencySymbol={
																									universal_currency_list[0]
																										? universal_currency_list[0]
																												.currencyIsoCode
																										: 'USD'
																								}
																							/>
																						)} */}
																								{this.state.supplier_currency_symbol}&nbsp;
																								{initValue.total_net.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																							</label>
																						</Col>
																					</Row>
																				</div>
																				{isRegisteredVat && <div className="total-item p-2">
																					<Row>
																						<Col lg={6}>
																							<h5 className="mb-0 text-right">
																								{strings.TotalVat}
																							</h5>
																						</Col>
																						<Col lg={6} className="text-right">
																							<label className="mb-0">
																								{/* {universal_currency_list[0] && (
																							<Currency
																								value={initValue.invoiceVATAmount.toFixed(
																									2,
																								)}
																								currencySymbol={
																									universal_currency_list[0]
																										? universal_currency_list[0]
																												.currencyIsoCode
																										: 'USD'
																								}
																							/>
																						)} */}
																								{this.state.supplier_currency_symbol}&nbsp;
																								{initValue.invoiceVATAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																							</label>
																						</Col>
																					</Row>
																				</div>}
																				<div className="total-item p-2">
																					<Row>
																						<Col lg={6}>
																							<h5 className="mb-0 text-right">
																								{strings.Total}
																							</h5>
																						</Col>
																						<Col lg={6} className="text-right">
																							<label className="mb-0">
																								{/* {universal_currency_list[0] && (
																							<Currency
																								value={initValue.totalAmount.toFixed(
																									2,
																								)}
																								currencySymbol={
																									universal_currency_list[0]
																										? universal_currency_list[0]
																												.currencyIsoCode
																										: 'USD'
																								}
																							/>
																						)} */}
																								{this.state.supplier_currency_symbol}&nbsp;
																								{initValue.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																							</label>
																						</Col>
																					</Row>
																				</div>
																			</div>
																		</Col>
																	</Row>
																) : null}
																<Row>
																	<Col lg={12} className="mt-5">
																		<FormGroup className="text-right">
																			<Button
																				type="button"
																				color="primary"
																				className="btn-square mr-3"
																				disabled={this.state.disabled}
																				onClick={() => {
																					if (this.state.data.length === 1) {
																						//console.log(props.errors,"ERRORs")
																						//	added validation popup	msg
																						props.handleBlur();
																						if (props.errors && Object.keys(props.errors).length != 0)
																							this.props.commonActions.fillManDatoryDetails();
																					}
																					else {
																						let newData = []
																						const data = this.state.data;
																						newData = data.filter((obj) => obj.productId !== "");
																						props.setFieldValue('lineItemsString', newData, true);
																						this.updateAmount(newData, props);
																					}
																					this.setState(
																						{ createMore: false },
																						() => {
																							props.handleSubmit();
																						},
																					);
																				}}
																			>
																				<i className="fa fa-dot-circle-o"></i>{' '}
																				{this.state.disabled
																					? 'Creating...'
																					: strings.Create}
																			</Button>
																			{this.props.location.state && this.props.location.state.parentId ? "" : <Button
																				type="button"
																				color="primary"
																				className="btn-square mr-3"
																				disabled={this.state.disabled}
																				onClick={() => {
																					if (this.state.data.length === 1) {
																						console.log(props.errors, "ERRORs")
																						//	added validation popup	msg
																						props.handleBlur();
																						if (props.errors && Object.keys(props.errors).length != 0)
																							this.props.commonActions.fillManDatoryDetails();
																					}
																					else {
																						let newData = []
																						const data = this.state.data;
																						newData = data.filter((obj) => obj.productId !== "");
																						props.setFieldValue('lineItemsString', newData, true);
																						this.updateAmount(newData, props);
																					}
																					this.setState(
																						{ createMore: true },
																						() => {
																							props.handleSubmit();
																						},
																					);
																				}}
																			>
																				<i className="fa fa-refresh mr-1"></i>
																				{this.state.disabled
																					? 'Creating...'
																					: strings.CreateandMore}
																			</Button>}
																			<Button
																				type="button"
																				color="secondary"
																				className="btn-square"
																				onClick={() => {
																					if (this.props?.location?.state?.renderURL) {
																						this.props.history.push(
																							`${this.props?.location?.state?.renderURL}`,
																							{ id: this.props?.location?.state?.renderID },);
																					} else
																						this.props.history.push(
																							'/admin/income/quotation',
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
					<CustomerModal
						openCustomerModal={this.state.openCustomerModal}
						closeCustomerModal={(e) => {
							this.closeCustomerModal(e);
						}}
						getCurrentUser={(e) => {
							this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
							this.getCurrentUser(e);
						}
						}
						createSupplier={this.props.requestForQuotationAction.createSupplier}
						getStateList={this.props.requestForQuotationAction.getStateList}
						currency_list={this.props.currency_convert_list}
						country_list={this.props.country_list}
					/>
					<ProductModal
						openProductModal={this.state.openProductModal}
						closeProductModal={(e) => {
							this.closeProductModal(e);
						}}
						getCurrentProduct={(e) => {
							this.props.supplierInvoiceActions.getProductList();
							this.getCurrentProduct(e);
						}}
						income={this.state.income}
						createProduct={this.props.ProductActions.createAndSaveProduct}
						vat_list={this.props.vat_list}
						product_category_list={this.props.product_category_list}
						salesCategory={this.state.salesCategory}
						purchaseCategory={this.state.purchaseCategory}
					/>
				</div>
				{this.state.disableLeavePage ? "" : <LeavePage />}
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateQuotation);
