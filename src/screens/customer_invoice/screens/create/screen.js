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
import * as CustomerInvoiceCreateActions from './actions';
import * as CustomerInvoiceActions from '../../actions';
import * as ProductActions from '../../../product/actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';
import { CustomerModal, ProductModal} from '../../sections';
import { MultiSupplierProductModal } from '../../sections';
import { LeavePage, Loader } from 'components';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { optionFactory, selectCurrencyFactory, selectOptionsFactory } from 'utils';
import Switch from "react-switch";
import './style.scss';
import moment from 'moment';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { TextareaAutosize } from '@material-ui/core';
import { formControlClasses } from '@mui/material';

const mapStateToProps = (state) => {
	return {
		currency_list: state.customer_invoice.currency_list,
		vat_list: state.customer_invoice.vat_list,
		product_list: state.customer_invoice.product_list,
		customer_list: state.customer_invoice.customer_list,
		excise_list: state.customer_invoice.excise_list,
		country_list: state.customer_invoice.country_list,
		product_category_list: state.product.product_category_list,
		universal_currency_list: state.common.universal_currency_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		customerInvoiceActions: bindActionCreators(
			CustomerInvoiceActions,
			dispatch,
		),
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
		customerInvoiceCreateActions: bindActionCreators(
			CustomerInvoiceCreateActions,
			dispatch,
		),
		productActions: bindActionCreators(ProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
let strings = new LocalizedStrings(data);
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

class CreateCustomerInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			customer_currency_symbol:'',
			loading: false,
			disabled: false,
			discountOptions: [
				{ value: 'FIXED', label: 'FIXED' },
				{ value: 'PERCENTAGE', label: '%' },
			],
			exciseTypeOption:[
				{ value: 'Inclusive', label: 'Inclusive' },
				{ value: 'Exclusive', label: 'Exclusive' },
			],
			disabledDate: true,
			data: [
				{
					id: 0,
					description: '',
					quantity: 1,
					unitPrice: '',
					vatCategoryId: '',
					exciseTaxId:'',
					discountType: 'FIXED',
					exciseAmount:0,
					discount: 0,
					subTotal: 0,
					vatAmount:0,
					productId: '',
					isExciseTaxExclusive: '',
					unitType:'',
				},
			],
			discountEnabled: false,
			idCount: 0,
			initValue: {
				receiptAttachmentDescription: '',
				receiptNumber: '',
				contact_po_number: '',
				currency: '',
				invoiceDueDate: '',
				invoiceDate: new Date(),
				contactId: '',
				placeOfSupplyId: '',
				project: '',
				term: '',
				exchangeRate:'',
				shippingAddress: '',
				shippingCountryId:'',
				shippingStateId:'',
				shippingCity:'',
                shippingPostZipCode:'',
				POBoxNumber: '',
				lineItemsString: [
					{
						id: 0,
						description: '',
						quantity: 1,
						unitPrice: '',
						vatCategoryId: '',
						productId: '',
					},
				],
				invoice_number: '',
				total_net: 0,
				invoiceVATAmount: 0,
				totalAmount: 0,
				notes: '',
				discount: 0,
				discountPercentage: '',
				discountType: "FIXED",
				total_excise: 0,
			},
			taxType: false,
			// excisetype: { value: 'Inclusive', label: 'Inclusive' },
			currentData: {},
			contactType: 2,
			openMultiSupplierProductModal: false,
			openCustomerModal: false,
			openProductModal: false,
			openInvoiceNumberModel: false,
			selectedContact: '',
			createMore: false,
			fileName: '',
			term: '',
			discountPercentage: '',
			discountAmount: 0,
			exist: false,
			prefix: '',
			purchaseCategory: [],
			salesCategory: [],
			exchangeRate:'',		
			basecurrency:[],
			inventoryList:[],
			state_list_for_shipping:[],
			param:false,
			date:'',
			contactId:'',
			isDesignatedZone:false,
			isRegisteredVat:false,
			companyVATRegistrationDate:new Date(),
			invoiceDateForVatValidation:new Date(),
			producttype:[],
			isQuotationSelected:false,
			loadingMsg:"Loading...",
			disableLeavePage:false, 
			vat_list:[
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

		this.termList = [
			{ label: 'Net 7 Days', value: 'NET_7' },
			{ label: 'Net 10 Days', value: 'NET_10' },
			{ label: 'Net 15 Days', value: 'NET_15' },
			{ label: 'Net 30 Days', value: 'NET_30' },
			{ label: 'Net 45 Days', value: 'NET_45' },
			{ label: 'Net 60 Days', value: 'NET_60' },
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
		this.regEx = /^[0-9\d]+$/;
		this.regExFax = /^[0-9]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExInvNum = /[a-zA-Z0-9-/]+$/;
		this.regExTelephone = /^[0-9-]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s\D,'-/]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regDec1=/^\d{1,2}\.\d{1,2}$|^\d{1,2}$/;
		this.regDecimalP = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
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
						maxLength="250"
						value={row['description'] !== '' ? row['description'] : ''}
						onChange={(e) => {
							this.selectItem(e.target.value, row, 'description', form, field);
						}}
						placeholder={strings.Description}
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
		var { product_list } = this.props;
		const product = product_list.find((i)=>row['productId']===i.id)
		let addedproducts=[]
		if(product)
		addedproducts=props.values.lineItemsString.filter((i)=>(i.productId===product.id && row.id!==i.id))
		let totalquantityleft= addedproducts.length>0 && product?.stockOnHand!==null ?product?.stockOnHand-addedproducts.reduce((a,c)=>a+parseInt(c.quantity===""?0:c.quantity),0):product?.stockOnHand
		totalquantityleft=totalquantityleft-parseInt(row.quantity)
		return (
			<Field
				name={`lineItemsString.${idx}.quantity`}
				render={({ field, form }) => (
					<div>
					<div class="input-group">
						<Input
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
							type="text"
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
						<Input value={row['unitType'] }  disabled/> : ''}
						</div>
						{(totalquantityleft<0 && product?.stockOnHand) && <div style={{color:'red',fontSize:'0.8rem'}} >
									Stock In Hand:{product?.stockOnHand}
								</div>} 
						{props.errors.lineItemsString &&
						props.errors.lineItemsString[parseInt(idx, 10)] &&
						props.errors.lineItemsString[parseInt(idx, 10)].quantity &&
						Object.keys(props.touched).length > 0 &&
						props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].quantity &&
						(
					   <div className='invalid-feedback'style={{display:"block", whiteSpace: "normal"}}>
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
					{props.errors.lineItemsString &&
						props.errors.lineItemsString[parseInt(idx, 10)] &&
						props.errors.lineItemsString[parseInt(idx, 10)].unitPrice &&
						Object.keys(props.touched).length > 0 &&
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

renderSubTotal = (cell, row,extraData) => {
	return row.subTotal === 0 ? this.state.customer_currency_symbol +" "+  row.subTotal.toLocaleString(navigator.language,{ minimumFractionDigits: 2, maximumFractionDigits: 2 }): this.state.customer_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language,{ minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

renderVatAmount = (cell, row,extraData) => {
	return row.vatAmount === 0 ? this.state.customer_currency_symbol +" "+  row.vatAmount.toLocaleString(navigator.language,{ minimumFractionDigits: 2, maximumFractionDigits: 2 }): this.state.customer_currency_symbol +" "+ row.vatAmount.toLocaleString(navigator.language,{ minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

	setDate = (props, value) => {
		const { term } = this.state;
		const val = term ? term.value.split('_') : '';
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];

		const values = value
			? value
			: moment(props.values.invoiceDate, 'DD-MM-YYYY').toDate();
			if (temp && values) {
				this.setState({
					date: moment(values).add(temp, 'days'),
				});
				const date1 = moment(values)
				.add(temp, 'days')
				.format('DD-MM-YYYY')
				props.handleChange('invoiceDate1')(value);
				props.setFieldValue('invoiceDueDate',date1, true);
			}
	};

	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
		return obj.currencyCode === value;
		});
		if(result &&result[0]&&  result[0].exchangeRate)
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
		this.exchangeRaterevalidate(result[0].exchangeRate)
		};

	setCurrency = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
		return obj.currencyCode === value;
		});
		this.formRef.current.setFieldValue('curreancyname', result[0].currencyName, true);
		};

	validationCheck = (value) => {
		const data = {
			moduleType: 6,
			name: value,
		};
		this.props.customerInvoiceCreateActions
			.checkValidation(data)
			.then((response) => {
				if (response.data === 'Invoice Number Already Exists') {
					this.setState(
						{
							exist: true,
						},
						
						() => {},
					);
				
				} else {
					this.setState({
						exist: false,
					});
				}
			});
	};
	getQuotationDetails=(quotationId)=>{
									this.props.customerInvoiceCreateActions.getQuotationById(quotationId)
										.then((res)=>{
											if (res.status === 200) {
												this.getCompanyCurrency();
												// this.purchaseCategory();
												this.setState(
													{
														isQuotationSelected:true,
														contactId: res.data.customerId
															? res.data.customerId
															: '',
														taxType: res.data.taxType
															? true 
															: false,
														quotationId: quotationId,
														initValue: {
																quotaionExpiration: res.data.quotaionExpiration
																	? moment(res.data.quotaionExpiration).format('DD-MM-YYYY')
																	: '',
																quotaionExpiration1: res.data.quotaionExpiration
																	? res.data.quotaionExpiration
																	: '',
																contactId: res.data.customerId 
																	? res.data.customerId 
																	: '',
																quotationNumber: res.data.quotationNumber
																	? res.data.quotationNumber
																	: '',
																invoiceVATAmount: res.data.totalVatAmount
																	? res.data.totalVatAmount
																	: 0,
																totalAmount: res.data.totalAmount 
																	? res.data.totalAmount 
																	: 0,
																total_net: 0,
																notes: res.data.notes 
																	? res.data.notes 
																	: '',
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
																receiptNumber:res.data.quotationNumber
																	?res.data.quotationNumber
																	:'',
															},
																discountEnabled: res.data.discount > 0 
																	? true
																	: false,
																invoiceDateNoChange: res.data.quotaionExpiration
																	? moment(res.data.quotaionExpiration)
																	: '',
																invoiceDueDateNoChange: res.data.quotaionExpiration
																	? res.data.quotaionExpiration
																	: '',
																customer_taxTreatment_des : res.data.taxtreatment 
																	? res.data.taxtreatment 
																	: '',
																total_excise: res.data.totalExciseAmount 
																	? res.data.totalExciseAmount 
																	: '',
																data: res.data.poQuatationLineItemRequestModelList
																	? res.data.poQuatationLineItemRequestModelList
																	: [],
																discountAmount: res.data.discount 
																	? res.data.discount 
																	: 0,
																discountPercentage: res.data.discountPercentage
																	? res.data.discountPercentage
																	: '',
																selectedContact: res.data.customerId 
																	? res.data.customerId 
																	: '',
																// term: res.data.term ? res.data.term : '',
																placeOfSupplyId: res.data.placeOfSupplyId 
																	? res.data.placeOfSupplyId 
																	: '',
																loading: false,

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
																this.formRef.current.setFieldValue(
																	'lineItemsString',
																	this.state.data,
																	true,
																);
														this.formRef.current.setFieldValue('contactId', res.data.customerId, true);
														this.formRef.current.setFieldValue('placeOfSupplyId', res.data.placeOfSupplyId, true);
														this.formRef.current.setFieldValue('currency', this.getCurrency(res.data.customerId), true);
														this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(res.data.customerId), true);
														this.formRef.current.setFieldValue('receiptNumber', res.data.quotationNumber, true);
													    this.setExchange( this.getCurrency(res.data.customerId) );
														} else {
															this.setState({
																idCount: 0,
															});
														}
														this.addRow()
													}
												);
												this.getCurrency(res.data.customerId)
											}
										})
	}

	getParentInvoiceDetails=(parentInvoiceId)=>{
		this.props.customerInvoiceCreateActions
		.getInvoiceById(parentInvoiceId)
		.then((res) => {
			if (res.status === 200) {
				this.getCompanyCurrency();
				let term=	this.termList.find((option) =>option.value == res.data.term)
				this.setState(
					{
						parentInvoiceId:parentInvoiceId,
						initValue: {
							receiptAttachmentDescription: res.data.receiptAttachmentDescription
								? res.data.receiptAttachmentDescription
								: '',
							receiptNumber: res.data.receiptNumber
								? res.data.receiptNumber
								: '',
							contact_po_number: res.data.contactPoNumber
								? res.data.contactPoNumber
								: '',
							currencyCode: res.data.currencyCode 
								? res.data.currencyCode 
								: '',
							exchangeRate:res.data.exchangeRate 
								? res.data.exchangeRate 
								: '',
							currencyName:res.data.currencyName 
								? res.data.currencyName 
								: '',
							invoiceDueDate: res.data.invoiceDueDate
								? moment(res.data.invoiceDueDate).format('DD-MM-YYYY')
								: '',
							invoiceDate: res.data.invoiceDate
								? moment(res.data.invoiceDate).format('DD-MM-YYYY')
								: '',
							invoiceDate1: res.data.invoiceDate
								? res.data.invoiceDate
								: '',
							contactId: res.data.contactId 
								? res.data.contactId 
								: '',
							project: res.data.projectId 
								? res.data.projectId 
								: '',
							invoice_number: res.data.referenceNumber
								? res.data.referenceNumber
								: '',
							total_net: 0,
							invoiceVATAmount: res.data.totalVatAmount
								? res.data.totalVatAmount
								: 0,
							totalAmount: res.data.totalAmount 
								? res.data.totalAmount 
								: 0,
							notes: res.data.notes 
								? res.data.notes 
								: '',
							changeShippingAddress: res.data.changeShippingAddress 
								? res.data.changeShippingAddress 
								: '',
							shippingAddress: res.data.shippingAddress 
								? res.data.shippingAddress 
								: '',
							shippingCountryId: res.data.shippingCountry 
								? res.data.shippingCountry 
								: '',
							shippingStateId: res.data.shippingState 
								? res.data.shippingState 
								: '',
							shippingCity: res.data.shippingCity 
								? res.data.shippingCity 
								: '',
							shippingPostZipCode: res.data.shippingPostZipCode 
								? res.data.shippingPostZipCode 
								: '',
							shippingTelephone: res.data.shippingTelephone 
								? res.data.shippingTelephone 
								: '',
							shippingFax: res.data.shippingFax 
								? res.data.shippingFax 
								: '',
							lineItemsString: res.data.invoiceLineItems
								? res.data.invoiceLineItems
								: [],
							discount: res.data.discount 
								? res.data.discount 
								: 0,
							term: term,
							placeOfSupplyId: res.data.placeOfSupplyId 
								? res.data.placeOfSupplyId 
								: '',
							fileName: res.data.fileName 
								? res.data.fileName 
								: '',
							filePath: res.data.filePath 
								? res.data.filePath 
								: '',
							total_excise: res.data.totalExciseAmount 
								? res.data.totalExciseAmount 
								: 0,
							taxType: res.data.taxType 
								? true 
								: false,
						 },
							customer_taxTreatment_des: res.data.taxTreatment 
								? res.data.taxTreatment 
								: '',
							invoiceDateNoChange :res.data.invoiceDate
								? moment(res.data.invoiceDate)
								: '',
							taxType: res.data.taxType 
								? true 
								: false,
							invoiceDueDateNoChange : res.data.invoiceDueDate 
								? moment(res.data.invoiceDueDate) 
								: '',
							invoiceDate: res.data.invoiceDate
								? res.data.invoiceDate
								: '',
							invoiceDateForVatValidation: res.data.invoiceDate
								? new Date(res.data.invoiceDate)
								: '',
							invoiceDueDate: res.data.invoiceDueDate
								? res.data.invoiceDueDate
								: '',
							discountAmount: res.data.discount 
								? res.data.discount 
								: 0,
							discountPercentage: res.data.discountPercentage
								? res.data.discountPercentage
								: '',
							invoiceDate1: res.data.invoiceDate
								? res.data.invoiceDate
								: '',
							data: res.data.invoiceLineItems
								? res.data.invoiceLineItems
								: [],
							selectedContact: res.data.contactId 
								? res.data.contactId 
								: '',
							contactId: res.data.contactId 
								? res.data.contactId 
								: '',
							term: term ? term : '',
							discountEnabled: res.data.discount > 0 
								? true 
								: false,
							placeOfSupplyId: res.data.placeOfSupplyId 
								? res.data.placeOfSupplyId 
								: '',
							loading: false,
					},
					() => {
						if(this.state.initValue && this.state.initValue.changeShippingAddress && this.state.initValue.shippingCountryId)
						{
							let state_list_for_shipping=[]
							let state=""
						this.props.customerInvoiceActions.getStateListForShippingAddress(this.state.initValue.shippingCountryId).then((res)=>{
							if(res.length>0)
							{	this.setState({state_list_for_shipping:res})
								state_list_for_shipping=res;
								state=   state_list_for_shipping.find((option) =>	option.value ==this.state.initValue.shippingStateId)
														
								this.formRef.current.setFieldValue('shippingStateId',state, true);	
								if(this.props.country_list && this.props.country_list.length>0){
									let country = selectOptionsFactory.renderOptions(
																					'countryName',
																					'countryCode',
																					this.props.country_list,
																					'Country',
																				) .find((option)=>option.value == this.state.initValue.shippingCountryId)
									this.formRef.current.setFieldValue('shippingCountryId',country, true);	
								   }
							}});

							this.formRef.current.setFieldValue('changeShippingAddress', this.state.initValue.changeShippingAddress , true);	
							this.formRef.current.setFieldValue('shippingAddress', this.state.initValue.shippingAddress , true);	
							this.formRef.current.setFieldValue('shippingCity', this.state.initValue.shippingCity , true);	
							this.formRef.current.setFieldValue('shippingPostZipCode', this.state.initValue.shippingPostZipCode , true);	
							this.formRef.current.setFieldValue('shippingFax', this.state.initValue.shippingFax , true);	
							this.formRef.current.setFieldValue('shippingTelephone', this.state.initValue.shippingTelephone , true);
				            this.formRef.current.setFieldValue('shippingFax', this.state.initValue.shippingFax , true);	

						}
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
							this.formRef.current.setFieldValue('contactId', res.data.contactId, true);
							this.formRef.current.setFieldValue('placeOfSupplyId', res.data.placeOfSupplyId, true);
							this.formRef.current.setFieldValue('currency', this.getCurrency(res.data.contactId), true);
							this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(res.data.contactId), true);
							this.formRef.current.setFieldValue('term', term, true);
							// this.formRef.current.setFieldValue('notes',  res.data.notes, true);
							// this.formRef.current.setFieldValue('receiptNumber', res.data.receiptNumber, true);
							// this.formRef.current.setFieldValue('receiptAttachmentDescription',  res.data.receiptAttachmentDescription, true);
							// this.setDate(undefined, '');
							const val = term ? term.value.split('_') : '';
							const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
							// const values =  res.data.invoiceDate	
							const values =  new Date();
								this.setState({
									date: moment(values).add(parseInt(temp), 'days'),
									invoiceDate1: moment(values),
								});
								const date1 = moment(values).add(temp, 'days').format('DD-MM-YYYY')
								this.formRef.current.setFieldValue('invoiceDate1',values, true);
								this.formRef.current.setFieldValue('invoiceDueDate',date1, true);
								// this.formRef.current.setFieldValue('invoiceDate1',values, true);
								this.setExchange( this.getCurrency(res.data.contactId) );
								this.addRow();
						} else {
							this.setState({
								idCount: 0,
							});
						}
					},
				);
				this.getCurrency(res.data.contactId);
			}
		});
	}
	componentDidMount = () => {
		this.props.customerInvoiceActions.getVatList();
		if(this.props.location.state && this.props.location.state.quotationId)
		this.getQuotationDetails(this.props.location.state.quotationId);
		this.getInitialData();
		this.getCompanyType();
		if(this.props.location.state &&this.props.location.state.contactData){
		this.getCurrentUser(this.props.location.state.contactData);
	  }
	  if(this.props.location.state && this.props.location.state.parentInvoiceId )
	  this.getParentInvoiceDetails(this.props.location.state.parentInvoiceId);
	  this.getDefaultNotes()
	};

	getDefaultNotes=()=>{
		this.props.commonActions.getNoteSettingsInfo().then((res)=>{
			if(res.status===200){
				this.formRef.current.setFieldValue('notes',res.data.defaultNotes, true);
				this.formRef.current.setFieldValue('footNote',  res.data.defaultFootNotes, true);
			}
		})
	}
	getInitialData = () => {
		this.getInvoiceNo();
		this.props.customerInvoiceActions.getVatList().then((res)=>{
			if(res.status==200 && res.data)
			 this.setState({vat_list:res.data})
		});
		this.props.customerInvoiceActions.getCustomerList(this.state.contactType);
		this.props.customerInvoiceActions.getCountryList();
		this.props.customerInvoiceActions.getExciseList();
		this.props.customerInvoiceActions.getProductList();
		this.props.productActions.getProductCategoryList();
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
		this.props.customerInvoiceActions.getInvoicePrefix().then((response) => {
			this.setState({prefixData:response.data
			
			});
		});
		this.getCompanyCurrency();
		this.salesCategory();
		this.purchaseCategory();
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
			this.props.productActions
				.getTransactionCategoryListForPurchaseProduct('10')
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								purchaseCategory: res.data,
							},
							() => {},
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
					unitPrice: 0,
					vatCategoryId: '',
					subTotal: 0,
					exciseTaxId:'',
					discountType:'FIXED',
					vatAmount:0,
					discount: 0,
					productId: '',
					unitType:'',
					unitTypeId:''
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
			name === 'quantity'||
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
			   <div  class="input-group">
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
		   ${
						   props.errors.lineItemsString &&
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

		<div 	style={{width:'100px'}}>
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
discountType = (row) =>

{
  	return this.state.discountOptions &&
		selectOptionsFactory
			.renderOptions('label', 'value', this.state.discountOptions, 'discount')
			.find((option) => option.value === +row.discountType)
}
getCustomerShippingAddress = (cutomerID,taxID,props) =>{
	if(taxID !== 5 && taxID !== 6 && taxID !== 7){
		this.props.customerInvoiceCreateActions.getCustomerShippingAddressbyID(cutomerID).then((res) => {
			if(res.status === 200){
				var PlaceofSupply= this.placelist &&
					selectOptionsFactory.renderOptions(
						'label',
						'value',
						this.placelist,
						'Place of Supply',).
						find((option) => option.label.toUpperCase() === res.data.shippingStateName.toUpperCase())
					if(PlaceofSupply){
					props.handleChange('placeOfSupplyId')(PlaceofSupply,);
					this.setState({placeOfSupplyId : PlaceofSupply});
					this.formRef.current.setFieldValue('placeOfSupplyId', PlaceofSupply.value, true);
				}
			}
		});
	}
};
getCompanyType = () => {
	this.props.customerInvoiceCreateActions
		.getCompanyById()
		.then((res) => {
				if (res.status === 200) {
					console.log(res,"COMPANY");
					this.setState({
						isDesignatedZone: res.data.isDesignatedZone,
						companyVATRegistrationDate : new Date(moment(res.data.vatRegistrationDate).format('MM DD YYYY')),
					});
					this.setState({
						isRegisteredVat: res.data.isRegisteredVat,
					});
				}
			})
		.catch((err) => {
			console.log(err,"Get Company Type Error");
		});
};
getProductType=(id)=>{
	if(this.state.customer_taxTreatment_des){
		this.props.customerInvoiceCreateActions
		.getProductById(id)
		.then((res) => {
			if (res.status === 200) {
				var { vat_list } = this.props;
				let pt={};
				var vt=[];
				pt.id=res.data.productID;
				pt.type=res.data.productType
				if(this.state.isRegisteredVat && (this.state.invoiceDateForVatValidation > this.state.companyVATRegistrationDate)){
					if(this.state.isDesignatedZone ){
						if(res.data.productType=== "GOODS" ){
							if(this.state.customer_taxTreatment_des==='VAT REGISTERED' || this.state.customer_taxTreatment_des=== 'VAT REGISTERED DESIGNATED ZONE' || this.state.customer_taxTreatment_des==='NON-VAT REGISTERED DESIGNATED ZONE' || this.state.customer_taxTreatment_des==='GCC VAT REGISTERED' || this.state.customer_taxTreatment_des==='GCC NON-VAT REGISTERED' || this.state.customer_taxTreatment_des=== 'NON GCC'){
								vat_list.map(element => {
									if(element.name=='OUT OF SCOPE'){
										vt.push(element);
									}
								});
							}
							if(this.state.customer_taxTreatment_des==='NON-VAT REGISTERED'){
								vt=vat_list;
							}
						}
						else if(res.data.productType === "SERVICE"){
							if(this.state.customer_taxTreatment_des==='VAT REGISTERED' || this.state.customer_taxTreatment_des==='NON-VAT REGISTERED' || this.state.customer_taxTreatment_des=== 'VAT REGISTERED DESIGNATED ZONE' || this.state.customer_taxTreatment_des==='NON-VAT REGISTERED DESIGNATED ZONE'){
								vt=vat_list;
							}
							if(this.state.customer_taxTreatment_des==='GCC VAT REGISTERED' || this.state.customer_taxTreatment_des==='GCC NON-VAT REGISTERED' || this.state.customer_taxTreatment_des=== 'NON GCC'){
								vat_list.map(element => {
									if(element.name=='ZERO RATED TAX (0%)'){
										vt.push(element);
									}
								});
								
							}	
						}
					}else{
						if(this.state.customer_taxTreatment_des==='VAT REGISTERED' || this.state.customer_taxTreatment_des==='NON-VAT REGISTERED' || this.state.customer_taxTreatment_des=== 'VAT REGISTERED DESIGNATED ZONE' || this.state.customer_taxTreatment_des==='NON-VAT REGISTERED DESIGNATED ZONE'){
							vt=vat_list;
						}
						if(this.state.customer_taxTreatment_des==='GCC VAT REGISTERED' || this.state.customer_taxTreatment_des==='GCC NON-VAT REGISTERED' || this.state.customer_taxTreatment_des=== 'NON GCC'){
							vat_list.map(element => {
								if(element.name=='ZERO RATED TAX (0%)'){
									vt.push(element);
								}
							});
						}	
					}
				}else{
					vt=[{
						"id": 10,
						"vat": 0,
						"name": "N/A"
					}];
				}
				pt.vat_list=vt;
				this.setState(prevState => ({
					producttype: [...prevState.producttype, pt]
				}));
			}
	})
	.catch((err) => {
		console.log(err,"Get Product by ID Error");
	});
}
};
resetVatId = (props) => {
	this.setState({
		producttype: [],
	});
	let newData = [];
	const data = this.state.data;
	data.map((obj,index) => {
		if(obj.productId){
			obj['vatCategoryId'] = '' ;
			newData.push(obj);
			return obj;
		}
	})
	props.setFieldValue('lineItemsString', newData, true);
	this.updateAmount(newData, props);
};
	renderVat = (cell, row, props) => {
	//	const { vat_list } = this.props;
		let vat_list=[];
		const product = this.state.producttype.find(element => element.id === row.productId);
		if(product){
			vat_list=product.vat_list;
		}
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
		if(row.productId && row.vatCategoryId)
		{
			row.vatCategoryId=typeof(row.vatCategoryId) === 'string' ? parseInt(row.vatCategoryId):row.vatCategoryId;
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
							vat_list &&
							selectOptionsFactory
								.renderOptions('name', 'id', vat_list, 'VAT')
								.find((option) => option.value === row.vatCategoryId)
						}
						id="vatCategoryId"
						placeholder={strings.Select+strings.VAT}
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
						}}
					}

						className={`${
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
					/>
					   {props.errors.lineItemsString &&
						props.errors.lineItemsString[parseInt(idx, 10)] &&
						props.errors.lineItemsString[parseInt(idx, 10)].vatCategoryId &&
						Object.keys(props.touched).length > 0 &&
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
						isDisabled={row.exciseTaxId === 0 || row.exciseTaxId === null }
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
						placeholder={strings.Select_Excise}
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
						}}
					}
						className={`${
							props.errors.lineItemsString &&
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

	exchangeRaterevalidate=(exc)=>{
		let local=[...this.state.data]
		var { product_list } = this.props;
		
		let local2=local.map((obj, index) => {

			const result = product_list.find((item) => item.id === obj.productId);
			return {
				...obj,unitPrice:result?
				(parseFloat(result.unitPrice)*(1/exc)).toFixed(2):0
			}
			
		});
		
		this.setState({data:local2},()=>{
			this.updateAmount(local2);
			if(this.checkedRow()) this.addRow()
		})
	}
	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.data;
		const result = product_list.find((item) => item.id === parseInt(e));
		let idx;
		let exchangeRate=this.formRef.current?.state?.values?.exchangeRate>0 
			&& this.formRef.current?.state?.values?.exchangeRate!=="" ?
			this.formRef.current?.state?.values?.exchangeRate:1
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj['unitPrice'] = (parseFloat(result.unitPrice)*(1/exchangeRate)).toFixed(2);
				obj['description'] = result.description;
				obj['exciseTaxId'] = result.exciseTaxId;
				obj['discountType'] = result.discountType;
				obj['isExciseTaxExclusive'] = result.isExciseTaxExclusive;
				obj['unitType']=result.unitType;
				obj['unitTypeId']=result.unitTypeId;
				idx = index;
				if(this.state.isRegisteredVat){
					this.state.producttype.map(element => {
						if(element.id===e){
							const found = element.vat_list.find(element => element.id === result.vatCategoryId);
							if(!found){
								obj['vatCategoryId']='';
							}
							else{
								obj['vatCategoryId'] = result.vatCategoryId;
							}
							return found;
						}
					});
				
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
		this.updateAmount(data, props);
	};

	setValue = (value) => {
		this.setState((prevState) => ({
			...prevState,
			initValue: [],
		}));
	};

	renderProduct = (cell, row, props) => {
		var { product_list } = this.props;
		product_list=product_list.filter((row)=>row.stockOnHand !=0 )
		if(product_list.length>0){
			if(product_list.length > this.state.producttype.length){
				product_list.map(element => {
					this.getProductType(element.id);
				});
			}
		}
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
	//	if (product_list.length > 0) {
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
							placeholder={strings.Select+strings.Product}
							onChange={(e) => {
								if (e && e.label !== 'Select Product') {
									this.selectItem(
										e.value,
										row,
										'productId',
										form,
										field,
										props,
									);
									this.prductValue(
										e.value,
										row,
										'productId',
										form,
										field,
										props,
									);
									this.props.customerInvoiceActions.getInventoryByProductId(e.value).then((response) => {
										this.setState({inventoryList:response.data						
										});
										// if(response.data.length !== 0 && response.data.length !== 1){
										// this.openMultiSupplierProductModal(response);}
									});
									if(this.checkedRow())
									   this.addRow();
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
												unitPrice: 0,
												vatCategoryId: '',
												vatAmount:0,
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
							className={`${
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
						/>
						{props.errors.lineItemsString &&
						props.errors.lineItemsString[parseInt(idx, 10)] &&
						props.errors.lineItemsString[parseInt(idx, 10)].productId &&
						Object.keys(props.touched).length > 0 &&
						(
					   <div className='invalid-feedback'>
					   {props.errors.lineItemsString[parseInt(idx, 10)].productId}
					   </div>
						 )}
						 {row['productId'] != '' ? 
						   <div className='mt-1'>
						   <Input
						type="text"
						maxLength="250"
						value={row['description'] !== '' && row['description'] !== null ? row['description'] : ''}
						onChange={(e) => {
							this.selectItem(e.target.value, row, 'description', form, field);
						}}
						placeholder={strings.Description}
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
						   </div> : ''}
					   </>
					 
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

	checkedRow = () => {
		if (this.state.data.length > 0) {
			let length = this.state.data.length - 1;
			let temp = this.state.data?.[length].productId!==""?
			this.state.data?.[length].productId:-2
			if (temp > -1) {
				return true;
			} else {
				return false;
			}

		} else {
			return true;
		}
	};

	updateAmount = (data, props,addrowinfo) => {
		const { vat_list } = this.state;
		let total_net = 0;
		let total_excise = 0;
		let total = 0;
		let total_vat = 0;
		let net_value = 0; 
		let discount_total = 0;
		
		data.map((obj) => {
			let unitprice=obj.unitPrice;
			const index =
				obj.vatCategoryId !== ''
					? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
					: '';
			const vat = index !== '' && index >=0 ? vat_list[`${index}`].vat : 0;

			//Exclusive case
			if(this.state.taxType === false){
				if (obj.discountType === 'PERCENTAGE') {	
					 net_value =
						((+unitprice -
							(+((unitprice * obj.discount)) / 100)) * obj.quantity);
					var discount =  (unitprice * obj.quantity) - net_value
				if(obj.exciseTaxId !=  0){
					if(obj.exciseTaxId === 1){
						const value = +(net_value) / 2 ;
							net_value = parseFloat(net_value) + parseFloat(value) ;
							obj.exciseAmount = parseFloat(value) ;
						}else if (obj.exciseTaxId === 2){
							const value = net_value;
							net_value = parseFloat(net_value) +  parseFloat(value) ;
							obj.exciseAmount = parseFloat(value) ;
						}
				}
				else{
					obj.exciseAmount = 0
				}
					var vat_amount =
					vat === 0 ? 0 :
					((+net_value  * vat ) / 100);
				}else{
					 net_value =
						((unitprice * obj.quantity) - obj.discount)
					var discount =  (unitprice * obj.quantity) - net_value
						if(obj.exciseTaxId !=  0){
							if(obj.exciseTaxId === 1){
								const value = +(net_value) / 2 ;
									net_value = parseFloat(net_value) + parseFloat(value) ;
									obj.exciseAmount = parseFloat(value) ;
								}else if (obj.exciseTaxId === 2){
									const value = net_value;
									net_value = parseFloat(net_value) +  parseFloat(value) ;
									obj.exciseAmount = parseFloat(value) ;
								}
						}
						else{
							obj.exciseAmount = 0
						}
						var vat_amount =
						vat === 0 ? 0 :
						((+net_value  * vat ) / 100);
			}

			}
			//Inclusive case
			else
			{			
				if (obj.discountType === 'PERCENTAGE') {	

					//net value after removing discount
					 net_value =
					((+unitprice -
						(+((unitprice * obj.discount)) / 100)) * obj.quantity);

				//discount amount
				var discount =  (unitprice* obj.quantity) - net_value

				//vat amount
				var vat_amount =
				(vat === 0 ? 0:
				((+net_value  * (vat/ (100 + vat)*100)) / 100));

				//net value after removing vat for inclusive
				net_value = net_value - vat_amount

				//excise calculation
				if(obj.exciseTaxId !=  0){
				if(obj.exciseTaxId === 1){
					const value = net_value / 3
					net_value = net_value 
					obj.exciseAmount = parseFloat(value);
					}
				else if (obj.exciseTaxId === 2){
					const value = net_value / 2
					obj.exciseAmount = parseFloat(value);
					net_value = net_value}
			
						}
						else{
							obj.exciseAmount = 0
						}
					}

				else // fixed discount
						{
				//net value after removing discount
				 net_value =
				((unitprice * obj.quantity) - obj.discount)

				//discount amount
				var discount =  (unitprice * obj.quantity) - net_value
						
				//vat amount
				var vat_amount =
				(vat===0 ? 0 :
				((+net_value  * (vat/ (100 + vat)*100)) / 100));

				//net value after removing vat for inclusive
				net_value = net_value - vat_amount

				//excise calculation
				if(obj.exciseTaxId !=  0){
					if(obj.exciseTaxId === 1){
						const value = net_value / 3
						net_value = net_value 
						obj.exciseAmount = parseFloat(value);
						}
					else if (obj.exciseTaxId === 2){
						const value = net_value / 2
						obj.exciseAmount = parseFloat(value);
					net_value = net_value}
							}
							else{
								obj.exciseAmount = 0
							}
					}
			}
			obj.unitPrice=unitprice
			obj.vatAmount = vat_amount
			obj.subTotal =
			net_value ? parseFloat(net_value) + parseFloat(vat_amount) : 0;
			discount_total = +discount_total +discount
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
						total_net:  total_net-total_excise,
						invoiceVATAmount: total_vat,
						discount:  discount_total ? discount_total : 0,
						totalAmount:  total ,
						total_excise: total_excise
					},

				},
			},()=>{
				if(this.checkedRow() && !addrowinfo) this.addRow()
			}

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
		this.setState({ disabled: true });
		const {
			receiptAttachmentDescription,
			receiptNumber,
			contact_po_number,
			currency,
			exchangeRate,
			invoiceDueDate,
			invoiceDate,
			contactId,
			placeOfSupplyId,
			project,
			invoice_number,
			shippingAddress,
			shippingCountryId,
			shippingStateId,
			shippingCity,
			shippingPostZipCode,
			shippingTelephone,
			shippingFax,
			discount,
			discountType,
			discountPercentage,
			notes,
			changeShippingAddress,
			quotationId,
			footNote
		} = data;
		const { term } = this.state;
		const formData = new FormData();
		formData.append('taxType', this.state.taxType)
		formData.append('quotationId', this.state.quotationId ? this.state.quotationId : '')
		formData.append('referenceNumber', invoice_number !== null ? this.state.prefix + invoice_number : '');
		formData.append('invoiceDueDate', invoiceDueDate ? this.state.date : null);
		formData.append('invoiceDate', invoiceDate?invoiceDate
						// moment(invoiceDate,'DD-MM-YYYY')
						// .toDate()
				: null,
		);
		formData.append('receiptNumber', receiptNumber !== null ? receiptNumber : '');
		formData.append('receiptAttachmentDescription', receiptAttachmentDescription !== null ? receiptAttachmentDescription : '',);
		formData.append('exchangeRate', exchangeRate !== null ? exchangeRate : '');
		formData.append('contactPoNumber', contact_po_number !== null ? contact_po_number : '');
		if(changeShippingAddress && changeShippingAddress==true)
		{
			formData.append('changeShippingAddress', changeShippingAddress !== null ? changeShippingAddress : '');
			formData.append('shippingAddress', shippingAddress !== null ? shippingAddress : '');
			formData.append('shippingCountry', shippingCountryId.value  ? shippingCountryId.value : shippingCountryId);
			formData.append('shippingState', shippingStateId.value !== null ? shippingStateId.value : shippingStateId);
			formData.append('shippingCity',	shippingCity  ? shippingCity : '');
			formData.append('shippingPostZipCode', shippingPostZipCode  ? shippingPostZipCode : '');
			formData.append('shippingTelephone',shippingTelephone  ? shippingTelephone : '');
			formData.append('shippingFax',shippingFax ? shippingFax : '');
		}
			formData.append('notes', notes !== null ? notes : '');
			formData.append('footNote',footNote? footNote : '')
			formData.append('type', 2);
			const local=[...this.state.data.map(({taxtreatment,...rest})=>rest)]
			formData.append('lineItemsString', JSON.stringify(local));
			formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
			formData.append('totalAmount', this.state.initValue.totalAmount);
			formData.append('totalExciseAmount', this.state.initValue.total_excise);
			formData.append('discount',this.state.initValue.discount);
		if (term && term.value) {
			formData.append('term', term.value);
		}

		if(this.state.quotationId != null || this.state.parentInvoiceId != null){
			formData.append('contactId', this.state.contactId );
		}else{
		if (contactId && contactId.value) {
			formData.append('contactId', contactId.value);
		}}

		if (placeOfSupplyId ) {
			formData.append('placeOfSupplyId', placeOfSupplyId.value ?placeOfSupplyId.value:placeOfSupplyId);
		}
		if (currency !== null && currency) {
			formData.append('currencyCode', this.state.customer_currency);
		}
		if (project !== null && project.value) {
			formData.append('projectId', project.value);
		}
		if (this.uploadFile && this.uploadFile.files && this.uploadFile?.files?.[0]) {
			formData.append('attachmentFile', this.uploadFile?.files?.[0]);
		}
		this.setState({ loading:true, disableLeavePage:true, loadingMsg:"Creating Invoice..."});
		this.props.customerInvoiceCreateActions
			.createInvoice(formData)
			.then((res) => {
				this.setState({ disabled: false });
				this.setState({ loading:false});
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'Invoice Created Successfully.',
				);
				if (this.state.createMore) {
					this.setState(
						{
							createMore: false,
							selectedContact: '',
							exchangeRate:'',
							disableLeavePage:false,
							invoiceDateForVatValidation: new Date(),
							producttype:[],
							data: [
								{
									id: 0,
									description: '',
									quantity: 1,
									unitPrice: '',
									vatCategoryId: '',
									taxtreatment: '',
									subTotal: 0,
									discount: 0,
									discountType: 'FIXED',
									vatAmount:0,
									productId: '',
								},
							],
							initValue: {
								...this.state.initValue,
								...{
									total_net: 0,
									invoiceVATAmount: 0,
									totalAmount: 0,
									discountType: 'FIXED',
									discount: 0,
									discountPercentage: '',
									total_excise: 0,
								},
							},
						},
						() => {
							resetForm(this.state.initValue);
							this.setState({
								contactId:'',
								customer_taxTreatment_des:'',
								placeOfSupplyId:'',
								customer_currency:null,
								customer_currency_des:'',
								currency:'',
								initValue: {
								...this.state.initValue,
								...{
									total_net: 0,
									invoiceVATAmount: 0,
									totalAmount: 0,
									discountType: 'FIXED',
									discount: 0,
									discountPercentage: '',
									changeShippingAddress:false
								},}
							});
							this.getInvoiceNo();
							this.formRef.current.setFieldValue(
								'lineItemsString',
								this.state.data,
								false,
							);
							this.formRef.current.setFieldValue('contactId', '', true);
							this.formRef.current.setFieldValue('placeOfSupplyId', '', true);
							this.formRef.current.setFieldValue('currency', null, true);
							this.formRef.current.setFieldValue('taxTreatmentid','', true);
							this.formRef.current.setFieldValue('term', '', true);
						},
					);
				} else {
					this.props.history.push('/admin/income/customer-invoice');
					this.setState({ loading:false,});
				}
			})
			.catch((err) => {
				this.setState({ disabled: false });

				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Invoice Created Unsuccessfully',
				);
			});
	};
	openInvoiceNumberModel = (props) => {
		this.setState({ openInvoiceNumberModel : true });
	};
	openCustomerModal = (props) => {
		this.setState({ openCustomerModal: true });
	};
	openProductModal = (props) => {
		this.setState({ openProductModal: true });
	};
	openMultiSupplierProductModal = (props) => {
		this.setState({ openMultiSupplierProductModal: true });
	};
	closeMultiSupplierProductModal = (props) => {
		this.setState({ openMultiSupplierProductModal: false });
	};

	openInvoicePreviewModal = (props) => {
		this.setState({ openInvoicePreviewModal: true });
	};
	checkAmount=(discount)=>{
		const { initValue } = this.state;
			if(discount >= initValue.totalAmount){
					this.setState({
						param:true
					});
			}
			else{
				this.setState({
					param:false
				});
			}

	}
	// getCurrentUser = (data) => {
	// 	let option;
	// 	console.log('data', data)
	// 	if (data.label || data.value) {
	// 		option = data;
	// 	} else {
	// 		option = {
	// 			label: `${data.fullName}`,
	// 			value: data.id,
	// 		};
	// 	}
	// 	this.formRef.current.setFieldValue('contactId', option, true);
	// };
	
	getCurrentUser = (data) => {

		let option;
		if (data.label || data.value) {
			option = data;
		} else {
			option = {
				label: `${data.organization!==""?data.organization : data.fullName}`,
				value: data.id,
			};
		}

		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === data.currencyCode;
		});
		
		this.setState({
			customer_currency: data.currencyCode,
			customer_currency_des: result[0]  && result[0].currencyName ? result[0].currencyName:"AED",
			customer_currency_symbol:data.currencyIso ?data.currencyIso:"AED",
			customer_taxTreatment_des:data.taxTreatment?data.taxTreatment:""
		});
		this.formRef.current.setFieldValue('contactId', option, true);
		this.setState({
			contactId:option.value
		})
		if(result[0] && result[0].currencyCode)
		this.formRef.current.setFieldValue('currency',result[0].currencyCode, true);

		this.formRef.current.setFieldValue('taxTreatmentid', data.taxTreatmentId, true);

		if( result[0] &&  result[0].exchangeRate)
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
		const taxID = data.taxTreatment?data.taxTreatment:"";
		if(taxID !== 5 && taxID !== 6 && taxID !== 7){
			this.props.customerInvoiceCreateActions.getCustomerShippingAddressbyID(option.value).then((res) => {
				if(res.status === 200){
					var PlaceofSupply= this.placelist &&
						selectOptionsFactory.renderOptions(
							'label',
							'value',
							this.placelist,
							'Place of Supply',).
							find((option) => option.label.toUpperCase() === res.data.shippingStateName.toUpperCase())
						if(PlaceofSupply){
						this.setState({placeOfSupplyId : PlaceofSupply});
						this.formRef.current.setFieldValue('placeOfSupplyId', PlaceofSupply.value, true);
					}
				}
			});
		}
	};

	getCurrentNumber = (data) => {
		this.getInvoiceNo();
	};

	getCurrentProduct = () => {
		this.props.customerInvoiceActions.getProductList().then((res) => {
			let newData=[]
			const data = this.state.data;
			newData = data.filter((obj) => obj.productId !== "");
			// props.setFieldValue('lineItemsString', newData, true);
			// this.updateAmount(newData, props);
			this.setState(
				{
					data: [...newData,{
						id: this.state.idCount + 1,
						description: res.data[0].description,
						quantity: 1,
						discount:0,
						unitPrice: res.data[0].unitPrice,
						vatCategoryId: res.data[0].vatCategoryId,
						exciseTaxId: res.data[0].exciseTaxId,
						vatAmount:res.data[0].vatAmount ?res.data[0].vatAmount:0,
						subTotal: res.data[0].unitPrice,
						productId: res.data[0].id,
						discountType: res.data[0].discountType,
						unitType:res.data[0].unitType,
						unitTypeId:res.data[0].unitTypeId,
					},
					
				],
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
				`lineItemsString.${0}.unitType`,
				res.data[0].unitType,
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
				`lineItemsString.${0}.exciseTaxId`,
				1,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.productId`,
				res.data[0].id,
				true,
			);
		});
	};

	closeCustomerModal = (res) => {
		this.setState({ openCustomerModal: false });
	};
	closeInvoiceNumberModel = (res) => {
		this.setState({ openInvoiceNumberModel: false });
	};
	closeProductModal = (res) => {
		this.setState({ openProductModal: false });
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
				if( res &&  res.data &&this.formRef.current)
				this.formRef.current.setFieldValue('invoice_number', res.data, true,this.validationCheck(res.data));
			}
		});
	};

	getCurrency = (opt) => {
		let customer_currencyCode = 0;
		let customer_item_currency = ''
		this.props.customer_list.map(item => {
			if(item.label.contactId == opt) {
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


	getTaxTreatment= (opt) => {

		let customer_taxTreatmentId = 0;
		let customer_item_taxTreatment = ''
		this.props.customer_list.map(item => {
			if(item.label.contactId == opt) {
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

	rendertotalexcise=()=>{
		const {initValue}= this.state
		let val=initValue.total_excise.toLocaleString(navigator.language, {minimumFractionDigits: 2, maximumFractionDigits: 2})
		return parseFloat(val).toFixed(2)
	}

	getStateList = (countryCode) => {
		this.props.customerInvoiceActions.getStateList(countryCode);
	};
	getStateListForShippingAddress = (countryCode) => {
		this.props.customerInvoiceActions.getStateListForShippingAddress(countryCode)
		.then((res)=>{
						this.setState({state_list_for_shipping:res})
		});
	};
	render() {
		strings.setLanguage(this.state.language);
		const { loading, loadingMsg } = this.state
		const { data, discountOptions, initValue, exist, param,prefix ,tax_treatment_list,state_list_for_shipping} = this.state;
		const {
				customer_list,
				country_list,
				universal_currency_list,
				currency_convert_list,
			} = this.props;
		
		let tmpCustomer_list = []
		customer_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpCustomer_list.push(obj)
		})
		this.handleFax= (e) => {
			var initValue = this.state.initValue;
			initValue.shippingAddress = e.target.value.replace(/[^0-9]/gi, '');;
			this.setState({initValue});
//			alert(this.state.initValue.shippingAddress );
		  }
		return (
			loading ==true? <Loader loadingMsg={loadingMsg}/> :
			<div>
			<div className="create-customer-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<img
													alt="invoiceimage"
													src={invoiceimage}
													style={{ width: '40px' }}
												/>
												<span className="ml-2">{strings.CreateInvoice}</span>
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
												
													let errors = {};
													if (exist === true) {
														errors.invoice_number =
															'Invoice number already exists';
													}
													if (values.invoice_number==='') {
														errors.invoice_number = 'Invoice number is required';
													}
													if (param === true) {
														errors.discount =
															'Discount amount cannot be greater than invoice total amount';
													}
													if(this.state.customer_taxTreatment_des!="NON GCC" && this.state.customer_taxTreatment_des!="GCC NON-VAT REGISTERED" && this.state.customer_taxTreatment_des!="GCC VAT REGISTERED")
													{
														if (!values.placeOfSupplyId) 
															       	errors.placeOfSupplyId ='Place of supply is required';
														if (values.placeOfSupplyId &&
																	(values.placeOfSupplyId=="" ||
																	(values.placeOfSupplyId.label && values.placeOfSupplyId.label === "Select Place of Supply")
																	)
																   ) 
															         errors.placeOfSupplyId ='Place of supply is required';
													}
												// 	if(this.state.customer_taxTreatment_des=="VAT REGISTERED" 
												// 	||this.state.customer_taxTreatment_des=="VAT REGISTERED DESIGNATED ZONE" 
												// 	||this.state.customer_taxTreatment_des=="GCC VAT REGISTERED" )
											    // 	{
												// 		if (!values.placeOfSupplyId) 
												// 	       	errors.placeOfSupplyId ='Place of supply is required';
												// 		if (values.placeOfSupplyId &&
												// 			(values.placeOfSupplyId=="" ||
												// 			(values.placeOfSupplyId.label && values.placeOfSupplyId.label === "Select place of supply")
												// 			)
												// 		   ) 
												// 	         errors.placeOfSupplyId ='Place of supply is required';
												//  }
												
													if (values.term && values.term.label && values.term.label === "Select Terms") {
														errors.term =
														'Term is required';
													}
										
													if(values.changeShippingAddress==true){
														if(values.shippingAddress =="")  
														errors.shippingAddress ='Shipping address is required';
												    }

													if(values.changeShippingAddress==true){
														if(values.shippingCountryId =="")  
														errors.shippingCountryId ='Country is required';
													}
																								
													if(values.changeShippingAddress==true){
														if (values.shippingCountryId == 229 || values.shippingCountryId.value == 229) {
															if (values.shippingPostZipCode == '')
																errors.shippingPostZipCode = 'PO box number is required';
															else if (values.shippingPostZipCode.length < 3)
																errors.shippingPostZipCode = 'Please enter 3 to 6 digit PO box number';
															if(values.shippingStateId =="")  
																errors.shippingStateId ='Emirate is required';
															
														} else {
															if (values.shippingPostZipCode == '')
																errors.shippingPostZipCode = 'Postal code is required';
															else if (values.shippingPostZipCode.length !== 6 )
																errors.shippingPostZipCode = 'Please enter 6 digit postal zip code';
															if(values.shippingStateId =="")  
																errors.shippingStateId ='State is required';
														}
													}

													let isoutoftock=0

													values.lineItemsString.map((c,i)=>{
														if(c.quantity>0 && c.productId!=="" ){ 

															let product=this.props.product_list.find((o)=>c.productId===o.id)
															let stockinhand=product.stockOnHand-values.lineItemsString.reduce((a,c)=>{
																 return c.productId===product.id ? a+parseInt(c.quantity):a+0
															},0)

														if( product.stockOnHand!==null &&stockinhand<0 ) 
														isoutoftock=isoutoftock+1
														else isoutoftock=isoutoftock+0 
													
														} else 
														isoutoftock=isoutoftock+0
														
													})
												
													if(isoutoftock>0){
														errors.outofstock="Some Prod"
													}
														
														return errors;
												}}
												validationSchema={Yup.object().shape({
													invoice_number: Yup.string().required(
														'Invoice number is required',
													),
													contactId: Yup.string().required(
														'Customer is required',
													),
													// placeOfSupplyId: Yup.string().required('Place of supply is required'),
													term: Yup.string().required('Term is required'),
													currency: Yup.string().required(
														'Currency is required',
													),
													invoiceDate: Yup.string().required(
														'Invoice date is required',
													),
													
													lineItemsString: Yup.array()
														.required(
															'Atleast one invoice sub detail is mandatory',
														)
														.of(
															Yup.object().shape({
															quantity: Yup.string()
																	.required('Value is required')
																	.test(
																		'quantity',
																		'Quantity should be greater than 0',
																		(value) => {                                      
																			if (value > 0) {
																				return true;
																			} else {
																				return false;
																			}
																		},
																	),
																unitPrice: Yup.string()
																	.required('Value is required')
																	.test(
																		'Unit Price',
																		'Unit price should be greater than 1',
																		(value) => {
																			if (value > 0) {
																				return true;
																			} else {
																				return false;
																			}
																		},
																	),
																vatCategoryId: Yup.string().required(
																	'VAT is required',
																),
																productId: Yup.string().required(
																	'Product is required',
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
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="invoice_number">
																		<span className="text-danger">* </span>
																		{strings.InvoiceNumber}
																	</Label>
																	<Input
																		type="text"
																		maxLength='50'
																		id="invoice_number"
																		name="invoice_number"
																		placeholder={strings.InvoiceNumber}
																		value={props.values.invoice_number}
																		onBlur={props.handleBlur('invoice_number')}
																		onChange={(option) => {
																			if(
																				option.target.value === '' ||
																				this.regExInvNum.test(
																					option.target.value,
																				)
																			) {
																				props.handleChange('invoice_number')(
																					option,
																				);
																				}
																			this.validationCheck(
																				option.target.value
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
															{/* {this.state.isQuotationSelected==true &&(
																<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="quotationNumber">
																		<span className="text-danger">* </span>
																		{strings.QuotationNumber}
																	</Label>
																	<Input
																		type="text"
																		maxLength='50'
																		id="quotationNumber"
																		name="quotationNumber"
																		placeholder={strings.QuotationNumber}
																		value={props.values.quotationNumber}

																	/>

																</FormGroup>
															</Col>

															)} */}
															</Row>
														<hr />
														<Row>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="contactId">
																		<span className="text-danger">* </span>
																	{strings.Customer}
																	</Label>
																	<Select
																	isDisabled={this.state.isQuotationSelected}
																		id="contactId"
																		name="contactId"
																		placeholder={strings.Select + strings.Customer} 
																		options={
																			tmpCustomer_list
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						tmpCustomer_list,
																						strings.Customer,
																				  )
																				: []
																		}
																		value={
																			(this.state.quotationId || this.state.parentInvoiceId) ?

																			 tmpCustomer_list &&
																			selectOptionsFactory.renderOptions(
																				'label',
																				'value',
																				tmpCustomer_list,
																				strings.Customer,
																		  ).find((option) => option.value == this.state.contactId)
																			
																		  :
																		  
																		  props.values.contactId
																			}
															
																		onChange={(option) => {
																			if (option && option.value) {
																				this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																				this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(option.value), true);
																				this.setExchange( this.getCurrency(option.value) );
																				props.handleChange('contactId')(option);
																				this.setState({
																					contactId : option.value
																				})
																			} else {
																				props.handleChange('contactId')('');
																			}
																			this.resetVatId(props);
																			this.getCustomerShippingAddress(option.value,this.getTaxTreatment(option.value),props);
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
															{this.props.location.state && this.props.location.state.quotationId ? "" : <Col  lg={3}>
																<Label
																	htmlFor="contactId"
																	style={{ display: 'block' }}
																>
																{strings.AddNewCustomer}
																</Label>
																<Button
																	type="button"
																	color="primary"
																	className="btn-square mr-3 mb-3"
																	onClick={(e, props) => {
																		this.openCustomerModal()
																		// this.props.history.push(`/admin/master/contact/create`,{gotoParentURL:"/admin/income/customer-invoice/create"})
																	}}
																>
																	<i className="fa fa-plus"></i> {strings.AddACustomer}
																</Button>
															</Col>}
															{this.state.customer_taxTreatment_des ?
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="taxTreatmentid">
																	{strings.TaxTreatment}
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
															</Col>: ''}
															<Col lg={3}>
															{this.state.customer_taxTreatment_des !== "NON GCC" && this.state.customer_taxTreatment_des !== "GCC VAT REGISTERED" && this.state.customer_taxTreatment_des !== "GCC NON-VAT REGISTERED" &&
																(<FormGroup className="mb-3">
																	<Label htmlFor="placeOfSupplyId">
																		<span className="text-danger">* </span>
																	{/* {this.state.customer_taxTreatment_des &&
																		(this.state.customer_taxTreatment_des=="VAT REGISTERED"
																		||this.state.customer_taxTreatment_des=="VAT REGISTERED DESIGNATED ZONE"
																		||this.state.customer_taxTreatment_des=="GCC VAT REGISTERED") && (
																			<span className="text-danger">* </span>
																		)} */}
																		{strings.PlaceofSupply}
																	</Label>
																	<Select
																		isDisabled={this.state.isQuotationSelected}
																		id="placeOfSupplyId"
																		name="placeOfSupplyId"
																		placeholder={strings.Select+strings.PlaceofSupply}
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
																				'Place of Supply',
																		  ).find(
																				(option) =>
																					option.value ==
																					((this.state.quotationId||this.state.parentInvoiceId) ? this.state.placeOfSupplyId.value ? this.state.placeOfSupplyId.value : this.state.placeOfSupplyId :
																					props.values.placeOfSupplyId.toString()))
																			}
																		className={
																			props.errors.placeOfSupplyId &&
																			props.touched.placeOfSupplyId
																				? 'is-invalid'
																				: ''
																		}
																		onChange={(option) =>{
																			props.handleChange('placeOfSupplyId')(
																				option,
																			)
																			this.setState({
																				placeOfSupplyId : option
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
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="term">
																		<span className="text-danger">* </span>{strings.Terms}{' '}
																		<i
																			id="UncontrolledTooltipExample"
																			className="fa fa-question-circle ml-1"
																		></i>
																		<UncontrolledTooltip
																			placement="right"
																			target="UncontrolledTooltipExample"
																		>
																			<p>
																				{' '}
																				Terms- The duration given to a buyer for
																				payment.
																			</p>

																			<p>
																				Net 7 – payment due in 7 days from
																				invoice date{' '}
																			</p>

																			<p>
																				{' '}
																				Net 10 – payment due in 10 days from
																				invoice date{' '}
																			</p>

																			<p>
																				{' '}
																				Net 30 – payment due in 30 days from
																				invoice date{' '}
																			</p>
																		</UncontrolledTooltip>
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
																		placeholder={strings.Select+strings.Terms} 
																		value={
																			(this.state.quotationId || this.state.parentInvoiceId) ?

																			this.termList &&
																			selectOptionsFactory.renderOptions(
																				'label',
																				'value',
																				this.termList,
																				'Terms',
																		  ).find((option) => option.value ==  this.state.term.value)
																			
																		  :
																		  
																		  props.values.term
																			}
																		//value={this.state.term}
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
																						this.setDate(props, props.values.invoiceDate);
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
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">* </span>
																		{strings.InvoiceDate}
																	</Label>
																	<DatePicker
																		id="invoiceDate"
																		name="invoiceDate"
																		placeholderText={strings.InvoiceDate}
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd-MM-yyyy"
																		//minDate={new Date()}
																		dropdownMode="select"
																		value={props.values.invoiceDate1 ? new Date(props.values.invoiceDate1):props.values.invoiceDate}
																		// value={props.values.invoiceDate}
																		selected={props.values.invoiceDate1 ? new Date(props.values.invoiceDate1):props.values.invoiceDate} 
																		onChange={(value) => {
																			if((this.state.invoiceDateForVatValidation < this.state.companyVATRegistrationDate && value > this.state.companyVATRegistrationDate ) || (value < this.state.companyVATRegistrationDate && this.state.invoiceDateForVatValidation > this.state.companyVATRegistrationDate)){
																				this.resetVatId(props);
																			}
																			this.setState({invoiceDateForVatValidation : value});
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
																				{props.errors.invoiceDate.includes("nullable()") ? "Invoice date is required" :props.errors.invoiceDate}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="due_date">
																		{strings.InvoiceDueDate}
																	</Label>
																	<div>
																		<DatePicker
																			className="form-control"
																			id="invoiceDueDate"
																			name="invoiceDueDate"
																			placeholderText={strings.InvoiceDueDate}
																			showMonthDropdown
																			showYearDropdown
																			disabled
																			dateFormat="dd-MM-yyyy"
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
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="currency">
																		<span className="text-danger">* </span>
																		{strings.Currency}
																	</Label>
																	<Select
																	isDisabled={true}
																		styles={customStyles}
																		placeholder={strings.Select+strings.Currency}
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
																			(this.state.customer_currency!=null?
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
																	 				+this.state.customer_currency,
																	 		)
																				:'')
																	 	
																		}
																		className={
																			props.errors.currency &&
																			props.touched.currency
																				? 'is-invalid'
																				: ''
																		}
																		onChange={(option) => {
																		props.handleChange('currency')(option);
																		this.setExchange(option.value);
																		this.setCurrency(option.value)
																	    }}

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
														<hr/>
														<Row>
															<Col>
																<FormGroup check inline className="mb-3">
																					<div>
																						<Input
																							// className="custom-control-input"
																							type="checkbox"
																							id="inline-radio1"
																							name="SMTP-auth"
																							checked={props.values.changeShippingAddress}
																							onChange={(value) => {
																								if(value != null){
																								props.handleChange('changeShippingAddress')(
																									value,
																								);
																								}else{
																									props.handleChange('changeShippingAddress')(
																										'',
																									);
																								}
																							}}
																						/>
																						<label htmlFor="inline-radio1">
																					{strings.noteforchangeaddress}
																					</label>
																					</div>
																</FormGroup>
                                                            </Col>
														</Row>
														
														<Row style={{display: props.values.changeShippingAddress === true ? '' : 'none'}}>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingAddress"><span className="text-danger">* </span>
																		{strings.ShippingAddress}
																	</Label>
																	<Input
																	type="text"
																		maxLength="100"
																		id="shippingAddress"
																		name="shippingAddress"
																		placeholder={strings.Enter + strings.ShippingAddress}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				
																				props.handleChange('shippingAddress')(
																					option,
																				);
																			}
																		}}
																		value={props.values.shippingAddress}
																		className={
																			props.errors.shippingAddress &&
																				props.touched.shippingAddress
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingAddress &&
																		props.touched.shippingAddress && (
																			<div className="invalid-feedback">
																				{props.errors.shippingAddress}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingCountryId"><span className="text-danger">* </span>{strings.Country}</Label>
																	<Select
																		options={
																			country_list
																				? selectOptionsFactory.renderOptions(
																					'countryName',
																					'countryCode',
																					country_list,
																					'Country',
																				)
																				: []
																		}
																		value={  country_list  &&
																				selectOptionsFactory
																					.renderOptions(
																						'countryName',
																						'countryCode',
																						country_list,
																						'Country',
																					)
																					.find(
																						(option) =>
																							option.value ===
																							+(props.values.shippingCountryId && props.values.shippingCountryId.value ?props.values.shippingCountryId.value :""),
																					)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('shippingCountryId')(option);
																				this.getStateListForShippingAddress(option.value);
																			} else {
																				props.handleChange('shippingCountryId')('');
																				// this.getStateListForShippingAddress("");
																			}
																			props.handleChange('stateId')({
																				label: 'Select State',
																				value: '',
																			});
																		}}
																		placeholder={strings.Select + strings.Country}
																		id="shippingCountryId"
																		name="shippingCountryId"
																		className={
																			props.errors.shippingCountryId &&
																				props.touched.shippingCountryId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingCountryId &&
																		props.touched.shippingCountryId && (
																			<div className="invalid-feedback">
																				{props.errors.shippingCountryId}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingStateId"><span className="text-danger">* </span>
																		{/* {strings.StateRegion} */}
																		{props.values.shippingCountryId &&props.values.shippingCountryId.value && props.values.shippingCountryId.value === 229 ? strings.Emirate: strings.StateRegion}
																	</Label>
																	<Select
																		options={
																			state_list_for_shipping
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					state_list_for_shipping,
																					props.values.shippingCountryId &&props.values.shippingCountryId.value && props.values.shippingCountryId.value === 229 ?strings.Emirate: strings.StateRegion,
																				)
																				: []
																		}
																		value={ state_list_for_shipping.find(
																					(option) =>
																						option.value == (props.values.shippingStateId && props.values.shippingStateId.value? props.values.shippingStateId.value :''),
																				)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('shippingStateId')(option);
																			} else {
																				props.handleChange('shippingStateId')('');
																			}
																		}}
																		placeholder={props.values.shippingCountryId &&props.values.shippingCountryId.value && props.values.shippingCountryId.value === 229 ? strings.Emirate: strings.StateRegion}
																		id="shippingStateId"
																		name="shippingStateId"
																		className={
																			props.errors.shippingStateId &&
																				props.touched.shippingStateId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingStateId &&
																		props.touched.shippingStateId && (
																			<div className="invalid-feedback">
																				{props.errors.shippingStateId}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row style={{display: props.values.changeShippingAddress === true ? '' : 'none'}}>
														<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingCity"><span className="text-danger"></span>{strings.City}</Label>
																	<Input
																		// options={city ? selectOptionsFactory.renderOptions('cityName', 'cityCode', cityRegion) : ''}
																		value={props.values.shippingCity}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				props.handleChange('shippingCity')(option);
																			}
																		}}
																		placeholder={strings.Location}
																		id="shippingCity"
																		name="shippingCity"
																		type="text"
																		maxLength="100"
																		className={
																			props.errors.shippingCity && props.touched.shippingCity
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingCity && props.touched.shippingCity && (
																		<div className="invalid-feedback">
																			{props.errors.shippingCity}
																		</div>
																	)}
																</FormGroup>
															</Col>
															
															<Col md="4" >
																		<FormGroup>
																			{props.values.shippingCountryId &&( props.values.shippingCountryId == 229 || props.values.shippingCountryId.value == 229) ?
																				<Label htmlFor="POBoxNumber">
																					<span className="text-danger">* </span>{strings.POBoxNumber}
																				</Label>:
																				<Label htmlFor="PostZipCode"><span className="text-danger">* </span>{strings.PostZipCode}</Label>
																					}
																				<Input
																					type="text"
																					maxLength="6"
																					id="shippingPostZipCode"
																					name="shippingPostZipCode"
																					autoComplete="Off"
																					placeholder={props.values.shippingCountryId &&( props.values.shippingCountryId == 229 || props.values.shippingCountryId.value == 229) ?
																									strings.Enter + strings.POBoxNumber : strings.Enter + strings.PostZipCode}
																					onChange={(option) => {
																						if (
																							option.target.value === '' ||
																							this.regEx.test(option.target.value)
																						) {
																							props.handleChange('shippingPostZipCode')(
																								option,
																							);
																						}

																					}}
																					value={props.values.shippingPostZipCode}
																					className={
																						props.errors.shippingPostZipCode &&
																							props.touched.shippingPostZipCode
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.shippingPostZipCode &&
																					props.touched.shippingPostZipCode && (
																						<div className="invalid-feedback">
																							{props.errors.shippingPostZipCode}
																						</div>
																					)}
																			</FormGroup>
																			</Col>
															{/* <Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingTelephone">{strings.Telephone}</Label>
																	<Input
																		maxLength="15"
																		type="text"
																		id="shippingTelephone"
																		name="shippingTelephone"
																		placeholder={strings.Enter + strings.TelephoneNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExTelephone.test(option.target.value)
																			) {
																				props.handleChange('shippingTelephone')(option);
																			}
																		}}
																		value={props.values.shippingTelephone}
																		className={
																			props.errors.shippingTelephone &&
																				props.touched.shippingTelephone
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingTelephone &&
																		props.touched.shippingTelephone && (
																			<div className="invalid-feedback">
																				{props.errors.shippingTelephone}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row style={{display: props.values.changeShippingAddress === true ? '' : 'none'}}>
														<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingFax">
																		{strings.Fax}
																	</Label>
																	<Input
																		type="text"
																		maxLength="8"
																		id="shippingFax"
																		name="shippingFax"
																		placeholder={strings.Enter + strings.Fax}
																		onKeyPress={this.handleKeyPress}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				if (option.target.value.length != 8 && option.target.value != "")
																					{this.setState({ showshippingFaxErrorMsg: true })}
																					
																				else{
																					this.setState({ showshippingFaxErrorMsg: false })}
																			}
																			this.handleFax(option)
																		}}
																		value={this.state.initValue.shippingAddress }
																		className={
																			props.errors.shippingFax &&
																				props.touched.shippingFax
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingFax &&
																		props.touched.shippingFax && (
																			<div className="invalid-feedback">
																				{props.errors.shippingFax}
																			</div>
																		)}
																</FormGroup>
															</Col> */}
									
														</Row>
														<hr />
																<Row style={{display: props.values.exchangeRate === 1  ? 'none' : ''}}>
																<Col>
																<Label >
																		{strings.CurrencyExchangeRate}
																	</Label>	
																</Col>
																</Row>
																
																<Row style={{display: props.values.exchangeRate === 1 ? 'none' : ''}}>
																<Col md={1}>
																<Input
																		disabled
																				id="1"
																				name="1"
																				value=	{
																					1 }
																				
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
																			value={this.state.customer_currency_des}
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
															<Col  lg={2}>
																	<Input
																		type="text"
																		min="0"	
																		disabled
																		id="currencyName"
																		name="currencyName"
																		value=	{
																		this.state.basecurrency.currencyName }
																				
																			/>
														</Col>
														
														
														</Row>
														
														<hr style={{display: props.values.exchangeRate === 1 ? 'none' : ''}} />
														<Row className="mb-3">
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
																<i className="fa fa-plus"></i> {strings.Addmore}
															</Button> */}
															{this.props.location.state &&	this.props.location.state.quotationId ?"":<Button
																color="primary"
																className= "btn-square mr-3"
																onClick={(e, props) => {
																	this.openProductModal()
																	// this.props.history.push(`/admin/master/product/create`,{gotoParentURL:"/admin/income/customer-invoice/create"})
																	}}
																>
																<i className="fa fa-plus"></i> {strings.Addproduct}
															</Button>}
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
																		width="4%"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderActions(cell, rows, props)
																		}
																	></TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="product"
																		width="17%"
																		dataFormat={(cell, rows) =>
																			this.renderProduct(cell, rows, props)
																		}
																	>
																		{strings.PRODUCT}
																	</TableHeaderColumn>
																	{/* <TableHeaderColumn
																		width="55"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderAddProduct(cell, rows, props)
																		}
																	></TableHeaderColumn> */}
																	{/* <TableHeaderColumn
																		width="10%"
																		dataField="description"
																		dataFormat={(cell, rows) =>
																			this.renderDescription(cell, rows, props)
																		}
																	>
																	{strings.DESCRIPTION}
																	</TableHeaderColumn> */}
																	<TableHeaderColumn
																		width="13%"
																		dataField="quantity"
																		dataFormat={(cell, rows) =>
																			this.renderQuantity(cell, rows, props)
																		}
																	>
																		{strings.QUANTITY}
																	</TableHeaderColumn>
																	{/* <TableHeaderColumn
																			width="5%"
																			dataField="unitType"
																     	>{strings.Unit}
																			 	<i
																		 id="unitTooltip"
																		 className="fa fa-question-circle"
																	 /> <UncontrolledTooltip
																		 placement="right"
																		 target="unitTooltip"
																	 >
																		Units / Measurements</UncontrolledTooltip>
																		</TableHeaderColumn> */}
																		<TableHeaderColumn
																		width="10%"
																		dataField="unitPrice"
																		dataFormat={(cell, rows) =>
																			this.renderUnitPrice(cell, rows, props)
																		}
																	>
																	{strings.UnitPrice}
																		<i
																			id="UnitPriceTooltip"
																			className="fa fa-question-circle ml-1"
																		></i>
																		<UncontrolledTooltip
																			placement="right"
																			target="UnitPriceTooltip"
																		>
																			Unit Price – Price of a single product or
																			service
																		</UncontrolledTooltip>
																	</TableHeaderColumn>
																	{this.state.discountEnabled == true &&
																	<TableHeaderColumn
																		width="12%"
																		dataField="discount"
																		dataFormat={(cell, rows) =>
																			this.renderDiscount(cell, rows, props)
																		}
																		>
																	{strings.DisCount}
																	</TableHeaderColumn>}
																	{initValue.total_excise != 0 &&
																	<TableHeaderColumn
																		width="10%"
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
																	</TableHeaderColumn> }
																
																	<TableHeaderColumn
																		width="13%"
																		dataField="vat"
																		dataFormat={(cell, rows) =>
																			this.renderVat(cell, rows, props)
																		}
																	>
																		{strings.VAT}
																	</TableHeaderColumn>
																	<TableHeaderColumn

																		dataField="vat_amount"
																		dataFormat={this.renderVatAmount}
																		className="text-right"
																		columnClassName="text-right"
																		formatExtraData={universal_currency_list}
																	>
																	{strings.VATAMOUNT}
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

														<Row className="ml-4 ">
															<Col className=" ml-4">
																<FormGroup className='pull-right'>
																<Input
																	type="checkbox"
																	id="discountEnabled"
																	checked={this.state.discountEnabled}
																	onChange={(option) => {
																		if(initValue.discount > 0){
																			this.setState({ discountEnabled: true })
																		}else{
																		this.setState({ discountEnabled: !this.state.discountEnabled })}
																	}}
																/>
																<Label>{strings.ApplyLineItemDiscount}</Label>
																</FormGroup>
															</Col>
														</Row>
														{this.state.data.length > 0 ? (
															<Row>
																<Col lg={8}>
																	<FormGroup className="py-2">
																		<Label htmlFor="notes">
																			{strings.Notes}
																		</Label><br/>
																		<TextareaAutosize
																			type="textarea"
																			style={{width: "700px"}}
																			className="textarea form-control"
																			maxLength="255"
																			name="notes"
																			id="notes"
																			rows="2"
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
																			<FormGroup className="mb-3 hideAttachment" >
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
																		<Label htmlFor="receiptAttachmentDescription">
																			{strings.AttachmentDescription}
																		</Label><br/>
																		<TextareaAutosize
																			type="textarea"
																			className="textarea form-control"
																			maxLength="250"
																			style={{width: "700px"}}
																			name="receiptAttachmentDescription"
																			id="receiptAttachmentDescription"
																			rows="2"
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
																	<FormGroup className="mb-3">
																		<Label htmlFor="footNote">
																		{strings.Footnote}
																		</Label>
																		<br/>
																		<TextareaAutosize
																			type="textarea"
																			className="textarea form-control"
																			maxLength="255"
																			style={{width: "700px"}}
																			name="footNote"
																			id="footNote"
																			rows="2"
																			placeholder={strings.PaymentDetails}
																			onChange={(option) =>
																				props.handleChange(
																					'footNote',
																				)(option)
																			}
																			value={
																				props.values
																					.footNote
																			}
																		/>
																	</FormGroup>
																</Col>


																<Col lg={4}>
																	<div className="">	
																	{initValue.total_excise > 0 ?																
																		<div className="total-item p-2" >
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																				{strings.Total_Excise}
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">

																						{this.state.customer_currency_symbol} &nbsp;
																						{/* {this.rendertotalexcise()} */}
																						{initValue.total_excise.toLocaleString(navigator.language, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
																						{this.state.customer_currency_symbol} &nbsp;
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
																						{this.state.customer_currency_symbol} &nbsp;
																						{initValue.total_net.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																					</label>
																				</Col>
																			</Row>
																		</div>
																		{/* <div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																					{strings.Discount}
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
																						{this.state.supplier_currency_symbol} &nbsp;
																						{this.state.initValue.discount  ? '-'+initValue.discount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : initValue.discount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })

																							}
																					</label>
																				</Col>
																			</Row>
																		</div> */}
																		<div className="total-item p-2">
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
																						{this.state.customer_currency_symbol} &nbsp;
																						{initValue.invoiceVATAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
																					</label>
																				</Col>
																			</Row>
																		</div>
																		
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
																						{this.state.customer_currency_symbol} &nbsp;
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
															<Col
																lg={12}
																className="mt-5 d-flex flex-wrap align-items-center justify-content-between"
															>
																<FormGroup className="text-right w-100">
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
																			if(this.state.data.length === 1)
																				{
																				//	added validation popup	msg
																				props.handleBlur();
																				if(props.errors &&  Object.keys(props.errors).length != 0){
																					this.props.commonActions.fillManDatoryDetails();
																					}
																				}
																				else
																				{
																			 	let newData=[]
																				const data = this.state.data;
																				newData = data.filter((obj) => obj.productId !== "");
																				props.setFieldValue('lineItemsString', newData, true);
																				this.updateAmount(newData, props,true);
																				//	added validation popup	msg
																				// props.handleBlur();
																				// if(props.errors &&  Object.keys(props.errors).length != 0){
																				// 	this.props.commonActions.fillManDatoryDetails();
																				// }
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
																			: strings.Create }
																	</Button>
																	{this.state.quotationId || this.props.location.state && this.props.location.state.parentInvoiceId ? "": (<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
																			
                                                                            if(this.state.data.length === 1)
                                                                            {
                                                                                console.log(props.errors,"ERRORs")
                                                                                //  added validation popup  msg
																				props.handleBlur();
																				if(props.errors &&  Object.keys(props.errors).length != 0)
																				this.props.commonActions.fillManDatoryDetails();
																				}
																				else
																				{
                                                                                let newData=[]
                                                                                const data = this.state.data;
                                                                                newData = data.filter((obj) => obj.productId !== "");
                                                                                props.setFieldValue('lineItemsString', newData, true);
                                                                                this.updateAmount(newData, props,true);
																				// props.handleBlur();
                                                                            	// if(props.errors &&  Object.keys(props.errors).length != 0)
                                                                            	// 	this.props.commonActions.fillManDatoryDetails();
                                                                            }
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
																		<i className="fa fa-repeat mr-1"></i>
																		{this.state.disabled
																			? 'Creating...'
																			: strings.CreateandMore }
																	</Button>)}
																	<Button
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push(
																				'/admin/income/customer-invoice',
																			);
																		}}
																	>
																		<i className="fa fa-ban mr-1"></i>{strings.Cancel}
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
					getCurrentUser={(e) =>{
						this.props.customerInvoiceActions.getCustomerList(this.state.contactType);
						this.getCurrentUser(e);
					}}
					// createCustomer={this.props.customerInvoiceActions.createCustomer}
					// currency_list={this.props.currency_convert_list}
					// currency={this.state.currency}
					// country_list={this.props.country_list}
					// getStateList={this.props.customerInvoiceActions.getStateList}
				/>
				<ProductModal
					openProductModal={this.state.openProductModal}
					closeProductModal={(e) => {
						this.closeProductModal(e);
					}}
					getCurrentProduct={(e) =>
						{ 
							this.props.customerInvoiceActions.getProductList();
							this.getCurrentProduct(e)}
						}
					createProduct={this.props.productActions.createAndSaveProduct}
					vat_list={this.props.vat_list}
					product_category_list={this.props.product_category_list}
					salesCategory={this.state.salesCategory}
					purchaseCategory={this.state.purchaseCategory}
				/>
				{
				<MultiSupplierProductModal
					openMultiSupplierProductModal={this.state.openMultiSupplierProductModal}
					closeMultiSupplierProductModal={(e) => {
						this.closeMultiSupplierProductModal(e);
					}}
					inventory_list={this.state.inventoryList}
				/>}			
			</div>
			{this.state.disableLeavePage ?"":<LeavePage/>}
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateCustomerInvoice);
