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
import { LeavePage, Loader } from 'components';
import * as Yup from 'yup';
import * as SupplierInvoiceCreateActions from './actions';
import * as SupplierInvoiceActions from '../../actions';
import * as ProductActions from '../../../product/actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';
import * as CustomerInvoiceActions from '../../../customer_invoice/actions';
import { TextareaAutosize } from '@material-ui/core';
import { SupplierModal } from '../../sections';
import { ProductModal } from '../../../customer_invoice/sections';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { optionFactory, selectCurrencyFactory, selectOptionsFactory } from 'utils';
import './style.scss';
import moment from 'moment';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import Switch from "react-switch";

const mapStateToProps = (state) => {
	return {
		contact_list: state.supplier_invoice.contact_list,
		currency_list: state.supplier_invoice.currency_list,
		vat_list: state.supplier_invoice.vat_list,
		excise_list: state.supplier_invoice.excise_list,
		product_list: state.supplier_invoice.product_list,
		supplier_list: state.supplier_invoice.supplier_list,
		country_list: state.supplier_invoice.country_list,
		product_category_list: state.product.product_category_list,
		universal_currency_list: state.common.universal_currency_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		supplierInvoiceActions: bindActionCreators(
			SupplierInvoiceActions,
			dispatch,
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
class CreateSupplierInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			supplier_currency_symbol: '',
			loading: false,
			discountOptions: [
				{ value: 'FIXED', label: 'FIXED' },
				{ value: 'PERCENTAGE', label: '%' },
			],

			discount_option: '',
			disabled: false,
			isReverseChargeEnabled: false,
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
					transactionCategoryId: '',
					transactionCategoryLabel: '',
				},
			],
			idCount: 0,
			checked: false,
			initValue: {
				receiptAttachmentDescription: '',
				receiptNumber: '',
				contact_po_number: '',
				currencyCode: '',
				invoiceDueDate: '',
				invoiceDate: new Date(),
				contactId: '',
				placeOfSupplyId: '',
				project: '',
				exchangeRate: '',
				lineItemsString: [
					{
						id: 0,
						description: '',
						quantity: 1,
						unitPrice: '',
						vatCategoryId: '',
						subTotal: 0,
						productId: '',
						transactionCategoryId: '',
						isExciseTaxExclusive: ''
					},
				],
				invoice_number: '',
				total_net: 0,
				invoiceVATAmount: 0,
				term: '',
				totalAmount: 0,
				notes: '',
				discount: 0,
				discountPercentage: 0,
				discountType: 'FIXED',
				total_excise: 0,

			},
			discountEnabled: false,
			discountType: "FIXED",
			taxType: false,
			currentData: {},
			contactType: 1,
			openSupplierModal: false,
			openProductModal: false,
			openInvoiceNumberModel: false,
			selectedContact: '',
			createMore: false,
			fileName: '',
			term: '',
			prefix: '',
			selectedType: { value: 'FIXED', label: 'Fixed' },
			discountPercentage: '',
			discountAmount: 0,
			purchaseCategory: [],
			exchangeRate: '',
			basecurrency: [],
			language: window['localStorage'].getItem('language'),
			param: false,
			date: '',
			loadingMsg:"Loading...",
			disableLeavePage:false,
			isSelected:false,
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
		// this.options = {
		//   paginationPosition: 'top'
		// }
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
		this.regEx = /^[0-9\b]+$/;
		this.regExBoth = /[a-zA-Z0-9 /D]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regDec1 = /^\d{1,2}\.\d{1,2}$|^\d{1,2}$/;
		this.regExInvNum = /[a-zA-Z0-9-/]+$/;
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
	
		return (
			<Field
				name={`lineItemsString.${idx}.quantity`}
				render={({ field, form }) => (
					<div>
					<div class="input-group">
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
						<Input value={row['unitType'] }  disabled/> : ''}
						</div>
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].quantity && (
								<div className="invalid-feedback" style={{display:"block", whiteSpace: "normal"}}>
									{props.errors.lineItemsString[parseInt(idx, 10)].quantity}
								</div>
							)}
						
						{/* {totalquantityleft<0 && <div style={{color:'red',fontSize:'0.8rem'}} >
								Out of Stock
							</div>}  */}
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

	getParentInvoiceDetails=(parentInvoiceId)=>{
		this.props.supplierInvoiceCreateActions
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
							lineItemsString: res.data.invoiceLineItems
								? res.data.invoiceLineItems
								: [],
							discount: res.data.discount 
								? res.data.discount 
								: 0,
							discountPercentage: res.data.discountPercentage
								? res.data.discountPercentage
								: 0,
							discountType: res.data.discountType
								? res.data.discountType
								: '',
							term: res.data.term 
								? res.data.term 
								: '',
							placeOfSupplyId: res.data.placeOfSupplyId 
								? res.data.placeOfSupplyId 
								: '',
							fileName: res.data.fileName 
								? res.data.fileName 
								: '',
							filePath: res.data.filePath 
								? res.data.filePath 
								: '',
							isReverseChargeEnabled: res.data.isReverseChargeEnabled 
								? true 
								: false,
							checked: res.data.exciseType 
								? res.data.exciseType 
								: '',
							total_excise: res.data.totalExciseAmount 
								? res.data.totalExciseAmount 
								: 0,
							taxType : res.data.taxType 
								? true 
								: false,
						},
							customer_taxTreatment_des: res.data.taxTreatment 
								? res.data.taxTreatment 
								: '',
							checked: res.data.exciseType 
								? res.data.exciseType 
								: res.data.exciseType,
							invoiceDateNoChange :res.data.invoiceDate
								? moment(res.data.invoiceDate)
								: '',
							invoiceDueDateNoChange : res.data.invoiceDueDate 
								? moment(res.data.invoiceDueDate) 
								: '',
							invoiceDate: res.data.invoiceDate
								? res.data.invoiceDate
								: '',
							invoiceDueDate: res.data.invoiceDueDate
								? res.data.invoiceDueDate
								: '',
							discountAmount: res.data.discount 
								? res.data.discount 
								: 0,
							discountPercentage: res.data.discountPercentage
								? res.data.discountPercentage
								: 0,
							data: res.data.invoiceLineItems
								? res.data.invoiceLineItems
								: [],
							taxType : res.data.taxType 
								? true 
								: false,
							discountEnabled : res.data.discount > 0 
								? true 
								: false,
							selectedContact: res.data.contactId 
								? res.data.contactId 
								: '',
							contactId: res.data.contactId 
								? res.data.contactId 
								: '',
							term: term 
								? term 
								: '',
							placeOfSupplyId: res.data.placeOfSupplyId 
								? res.data.placeOfSupplyId 
								: '',
							isReverseChargeEnabled: res.data.isReverseChargeEnabled 
								? true 
								: false,
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
							this.formRef.current.setFieldValue('contactId', res.data.contactId, true);
							this.formRef.current.setFieldValue('placeOfSupplyId', res.data.placeOfSupplyId, true);
							this.formRef.current.setFieldValue('currency', this.getCurrency(res.data.contactId), true);
							this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(res.data.contactId), true);
							this.formRef.current.setFieldValue('term', term, true);
							// this.formRef.current.setFieldValue('notes',  res.data.notes, true);
							// this.formRef.current.setFieldValue('receiptNumber', res.data.receiptNumber, true);
							// this.formRef.current.setFieldValue('receiptAttachmentDescription',  res.data.receiptAttachmentDescription, true);
							const val = term ? term.value.split('_') : '';
							const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
							// const values = moment( moment( res.data.invoiceDate).format('DD-MM-YYYY'), 'DD-MM-YYYY').toDate();	
							const values =  new Date();						
								this.setState({
									date: moment(values).add(temp, 'days'),
									invoiceDate: moment(values),
								});
								const date1 = moment(values).add(temp, 'days').format('DD-MM-YYYY')
								this.formRef.current.setFieldValue('invoiceDueDate',date1, true);
								this.setExchange( this.getCurrency(res.data.contactId) );
								this.addRow();
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
	}
	getRFQDetails=(rfqId)=>{
		this.props.supplierInvoiceCreateActions.getRFQeById(rfqId)
												.then((res)=>{
													if (res.status === 200) {
														this.getCompanyCurrency();
														// this.purchaseCategory();
														this.setState(
															{
																isSelected:true,
																contactId: res.data.supplierId,
																rfqId: rfqId,
																poId:rfqId,
																initValue: {
																	rfqExpiryDate: res.data.rfqExpiryDate
																		? moment(res.data.rfqExpiryDate).format('DD-MM-YYYY')
																		: '',
																	rfqExpiryDate: res.data.rfqExpiryDate
																		? res.data.rfqExpiryDate
																		: '',
																	contactId: res.data.supplierId ? res.data.supplierId : '',
																	quotationNumber: res.data.quotationNumber
																		? res.data.quotationNumber
																		: '',
																	invoiceVATAmount: res.data.totalVatAmount
																		? res.data.totalVatAmount
																		: 0,
																	totalAmount: res.data.totalAmount ? res.data.totalAmount : 0,
																	total_net: 0,
																	notes: res.data.notes ? res.data.notes : '',
																	lineItemsString: res.data.poQuatationLineItemRequestModelList
																		? res.data.poQuatationLineItemRequestModelList
																		: [],
																	placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
																	total_excise: res.data.totalExciseAmount ? res.data.totalExciseAmount : '',
																	discount: res.data.discount ? res.data.discount : 0,
																	discountPercentage: res.data.discountPercentage
																		? res.data.discountPercentage
																		: 0,
																	discountType: res.data.discountType
																			? res.data.discountType
																			: '',
																		receiptNumber:	 res.data.rfqNumber
																		? res.data.rfqNumber
																		: '',
																		taxType:res.data.taxType
																	},
																		invoiceDateNoChange: res.data.rfqExpiryDate
																				? moment(res.data.rfqExpiryDate)
																				: '',
																		invoiceDueDateNoChange: res.data.rfqExpiryDate
																				? res.data.rfqExpiryDate
																				: '',
																		customer_taxTreatment_des : res.data.taxtreatment ? res.data.taxtreatment : '',
																		placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
																		total_excise: res.data.totalExciseAmount ? res.data.totalExciseAmount : '',
																		data: res.data.poQuatationLineItemRequestModelList
																			? res.data.poQuatationLineItemRequestModelList
																			: [],
																			taxType:res.data.taxType,
																		discountEnabled : res.data.discount > 0 
																		? true 
																		: false,
																		discountAmount: res.data.discount ? res.data.discount : 0,
																		discountPercentage: res.data.discountPercentage
																			? res.data.discountPercentage
																			: '',
																		selectedContact: res.data.supplierId ? res.data.supplierId : '',
																		// term: res.data.term ? res.data.term : '',
																		placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
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
																this.formRef.current.setFieldValue('contactId', res.data.supplierId, true);
																this.formRef.current.setFieldValue('placeOfSupplyId', res.data.placeOfSupplyId, true);
																this.formRef.current.setFieldValue('currency', this.getCurrency(res.data.supplierId), true);
																this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(res.data.supplierId), true);
																this.formRef.current.setFieldValue('receiptNumber', res.data.rfqNumber, true);
															   this.setExchange( this.getCurrency(res.data.supplierId) );
																} else {
																	this.setState({
																		idCount: 0,
																	});
																}
															}
														);
														this.getCurrency(res.data.supplierId)
													}
												})
			}
			getpoDetails=(poId)=>{
				this.props.supplierInvoiceCreateActions.getPOById(poId)
														.then((res)=>{
															if (res.status === 200) {
																this.getCompanyCurrency();
																// this.purchaseCategory();
																this.setState(
																	{
																		isSelected:true,
																		contactId: res.data.supplierId
																			? res.data.supplierId
																			: '',
																		taxType: res.data.taxType
																			? true 
																			: false,
																		poId: poId,
																		initValue: {
																			rfqExpiryDate: res.data.rfqExpiryDate
																					? moment(res.data.rfqExpiryDate).format('DD-MM-YYYY')
																					: '',
																				rfqExpiryDate: res.data.rfqExpiryDate
																					? res.data.rfqExpiryDate
																					: '',
																				contactId: res.data.supplierId 
																					? res.data.supplierId 
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
																				discountEnabled : res.data.discount > 0 
																					? true 
																					: false,
				
																		},
																			discountEnabled : res.data.discount > 0 
																				? true 
																				: false,
																			discount:res.data.discount
																				?res.data.discount
																				:0,
																			invoiceDateNoChange: res.data.rfqExpiryDate
																				? moment(res.data.rfqExpiryDate)
																				: '',
																			invoiceDueDateNoChange: res.data.rfqExpiryDate
																				? res.data.rfqExpiryDate
																				: '',
																			customer_taxTreatment_des : res.data.taxtreatment 
																				? res.data.taxtreatment 
																				: '',
																			placeOfSupplyId: res.data.placeOfSupplyId
																				? res.data.placeOfSupplyId 
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
																			selectedContact: res.data.supplierId ? res.data.supplierId : '',
																			// term: res.data.term ? res.data.term : '',
				
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
																		this.formRef.current.setFieldValue('contactId', res.data.supplierId, true);
																		this.formRef.current.setFieldValue('placeOfSupplyId', res.data.placeOfSupplyId, true);
																		this.formRef.current.setFieldValue('currency', this.getCurrency(res.data.supplierId), true);
																		this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(res.data.supplierId), true);
																		// this.formRef.current.setFieldValue('receiptNumber', res.data.poNumber, true);
																	   this.setExchange( this.getCurrency(res.data.supplierId) );
																		} else {
																			this.setState({
																				idCount: 0,
																			});
																		}
																	}
																);
																this.getCurrency(res.data.supplierId)
															}
														})
					}
	componentDidMount = () => {
		this.props.supplierInvoiceActions.getVatList();
		this.getInitialData();
		if(this.props.location.state &&this.props.location.state.contactData)
				this.getCurrentUser(this.props.location.state.contactData);
		if(this.props.location.state && this.props.location.state.rfqId){
			this.getRFQDetails(this.props.location.state.rfqId)
		}	
		if(this.props.location.state && this.props.location.state.poId){
			this.getpoDetails(this.props.location.state.poId)
		}
	if(this.props.location.state && this.props.location.state.parentInvoiceId )
				this.getParentInvoiceDetails(this.props.location.state.parentInvoiceId);
	};

	getInitialData = () => {
		this.getInvoiceNo();
		this.props.customerInvoiceActions.getVatList().then((res)=>{
			if(res.status==200 && res.data)
			 this.setState({vat_list:res.data})
		});
		this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
		this.props.currencyConvertActions.getCurrencyConversionList().then((response) => {
			this.setState({
				initValue: {
					...this.state.initValue,
					...{
						currencyCode: response.data
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
		this.props.supplierInvoiceActions.getInvoicePrefix().then((response) => {
			this.setState({
				prefixData: response.data

			});
		});
		this.props.supplierInvoiceActions.getVatList();
		this.props.supplierInvoiceActions.getExciseList();
		this.props.supplierInvoiceActions.getCountryList();
		this.props.supplierInvoiceActions.getProductList();
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
				// name={`lineItemsString.${idx}.vatCategoryId`}
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
										// onChange={(item) => {
										// 	props.handleChange(
										// 		'discountType',
										// 	)(item);
										// 	props.handleChange(
										// 		'discountPercentage',
										// 	)('');
										// 	props.setFieldValue(
										// 		'discount',
										// 		0,
										// 	);
										// 	this.setState(
										// 		{
										// 			discountPercentage: '',
										// 			discountAmount: 0,
										// 		},
										// 		() => {
										// 			this.updateAmount(
										// 				this.state.data,
										// 				props,
										// 			);
										// 		},
										// 	);
										// }}
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


	renderVat = (cell, row, props) => {
		const { vat_list } = this.props;
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
								.find((option) => option.value == row.vatCategoryId)
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
						}}
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
								.find((option) => option.value === +row.exciseTaxId)
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
	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.data;
		const result = product_list.find((item) => item.id === parseInt(e));
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj['unitPrice'] = result.unitPrice;
				obj['vatCategoryId'] = result.vatCategoryId;
				obj['exciseTaxId'] = result.exciseTaxId;
				obj['description'] = result.description;
				obj['transactionCategoryId'] = result.transactionCategoryId;
				obj['transactionCategoryLabel'] = result.transactionCategoryLabel;
				obj['isExciseTaxExclusive'] = result.isExciseTaxExclusive;
				obj['unitType']=result.unitType;
				obj['unitTypeId']=result.unitTypeId;
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
			`lineItemsString.${idx}.exciseTaxId`,
			result.exciseTaxId,
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
		form.setFieldValue(
			`lineItemsString.${idx}.transactionCategoryId`,
			result.transactionCategoryId,
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.transactionCategoryLabel`,
			result.transactionCategoryLabel,
			true,
		);
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

	renderAccount = (cell, row, props) => {
		const { purchaseCategory } = this.state;
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
		return (
			<Field
				name={`lineItemsString.${idx}.transactionCategoryId`}
				render={({ field, form }) => (
					<Select
						styles={{
							menu: (provided) => ({ ...provided, zIndex: 9999 }),
						}}
						options={purchaseCategory ? purchaseCategory : []}
						id="transactionCategoryId"
						onChange={(e) => {
							this.selectItem(
								e.value,
								row,
								'transactionCategoryId',
								form,
								field,
								props,
							);
						}}
						value={
							purchaseCategory && row.transactionCategoryLabel
								? purchaseCategory
									.find((item) => item.label === row.transactionCategoryLabel)
									.options.find(
										(item) => item.value === +row.transactionCategoryId,
									)
								: row.transactionCategoryId
						}
						isDisabled={row.transactionCategoryId===150}
						placeholder={strings.Select + strings.Account}
						className={`${props.errors.lineItemsString &&
								props.errors.lineItemsString[parseInt(idx, 10)] &&
								props.errors.lineItemsString[parseInt(idx, 10)]
									.transactionCategoryId &&
								Object.keys(props.touched).length > 0 &&
								props.touched.lineItemsString &&
								props.touched.lineItemsString[parseInt(idx, 10)] &&
								props.touched.lineItemsString[parseInt(idx, 10)]
									.transactionCategoryId
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
		return rows['productId'] != '' ?  
			<Button
				size="sm"
				className="btn-twitter btn-brand icon mt-1"
				// disabled={this.state.data.length === 1 ? true : false}
				onClick={(e) => {
					this.deleteRow(e, rows, props);
				}}
			>
				<i className="fas fa-trash"></i>
			</Button>
		: ''
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
			props.setFieldValue('invoiceDueDate', date1, true);
		}
	};

	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});
		if(result &&result[0]&&  result[0].exchangeRate)
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
	};

	setCurrency = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});

		this.formRef.current.setFieldValue('curreancyname', result[0].currencyName, true);
	};

	updateAmount = (data, props) => {
		const { vat_list } = this.props;
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
			const vat = index !== '' ? vat_list[`${index}`].vat : 0;

			//Exclusive case
			if(this.state.taxType === false){
				if (obj.discountType === 'PERCENTAGE') {	
					 net_value =
						((+obj.unitPrice -
							(+((obj.unitPrice * obj.discount)) / 100)) * obj.quantity);
					var discount =  (obj.unitPrice * obj.quantity) - net_value
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
						((obj.unitPrice * obj.quantity) - obj.discount)
					var discount =  (obj.unitPrice * obj.quantity) - net_value
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
					((+obj.unitPrice -
						(+((obj.unitPrice * obj.discount)) / 100)) * obj.quantity);

				//discount amount
				var discount =  (obj.unitPrice* obj.quantity) - net_value

				//vat amount
				var vat_amount =
				vat === 0 ? 0 :
				(+net_value  * (vat/ (100 + vat)*100)) / 100; 

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
				((obj.unitPrice * obj.quantity) - obj.discount)


				//discount amount
				var discount =  (obj.unitPrice * obj.quantity) - net_value
						
				//vat amount
				var vat_amount =
				vat === 0 ? 0 :
				(+net_value  * (vat/ (100 + vat)*100)) / 100; ;

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
			},

		);
	};

	handleSubmit = (data, resetForm) => {

		this.setState({ disabled: true ,disableLeavePage:true});
		const {
			receiptAttachmentDescription,
			receiptNumber,
			contact_po_number,
			currency,
			invoiceDueDate,
			invoiceDate,
			contactId,
			placeOfSupplyId,
			project,
			exchangeRate,
			invoice_number,
			discount,
			discountType,
			discountPercentage,
			notes,
			excisetype,
			total_excise,
		} = data;
		const { term } = this.state;

		let formData = new FormData();
		formData.append('quotationId',this.state.poId ? this.state.poId : '')
		formData.append('taxType', this.state.taxType)
		formData.append('referenceNumber',invoice_number ? this.state.prefix + invoice_number : '');
		formData.append('invoiceDueDate',invoiceDueDate ? this.state.date : null);
		formData.append('invoiceDate',invoiceDate? invoiceDate
				// moment(invoiceDate,'DD-MM-YYYY')
				// .toDate()
				: null);
		formData.append('receiptNumber', receiptNumber ? receiptNumber : '');
		formData.append('contactPoNumber', contact_po_number ? contact_po_number : '');
		formData.append('receiptAttachmentDescription',	receiptAttachmentDescription ? receiptAttachmentDescription : '');
		formData.append('notes', notes ? notes : '');
		formData.append('type', 1);
		formData.append('lineItemsString', JSON.stringify(this.state.data));
		formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
		formData.append('totalAmount', this.state.initValue.totalAmount);
		formData.append('totalExciseAmount', this.state.initValue.total_excise);
		formData.append('exciseType', this.state.checked);
		formData.append('isReverseChargeEnabled', this.state.isReverseChargeEnabled);
		formData.append('exchangeRate', exchangeRate);
		formData.append('discount', this.state.initValue.discount);

		if (term && term.value) {
			formData.append('term', term.value);
		}
		if (placeOfSupplyId ) {
			formData.append('placeOfSupplyId', placeOfSupplyId.value ?placeOfSupplyId.value:placeOfSupplyId);
		}
		if (contactId ) {
			formData.append('contactId', contactId.value?contactId.value:contactId);
		}
		if (currency !== null && currency) {
			formData.append('currencyCode', this.state.supplier_currency);
		}
		if (project !== null && project.value) {
			formData.append('projectId', project.value);
		}
		if (this.uploadFile.files[0]) {
			formData.append('attachmentFile', this.uploadFile.files[0]);
		}

		this.setState({ loading:true, loadingMsg:"Creating New Invoice..."});
		this.props.supplierInvoiceCreateActions
			.createInvoice(formData)
			.then((res) => {
				this.setState({ disabled: false });
				this.setState({ loading:false});
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'New Invoice Created Successfully.',
				);
				if (this.state.createMore) {
					this.setState(
						{
							createMore: false,
							selectedContact: '',
							term: '',
							exchangeRate:'',
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
									productId: '',
									transactionCategoryId: '',
									transactionCategoryLabel: '',
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
									discountType: '',
									discount: 0,
									discountPercentage: '',
									changeShippingAddress:false
								},}
							});
							this.getInvoiceNo();
							console.log(this.state.data,"State Data");
							this.formRef.current.setFieldValue(
								'lineItemsString',
								this.state.data,
								false,
							);
						},
					);
				} else {
					this.props.history.push('/admin/expense/supplier-invoice');
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
		this.setState({ openInvoiceNumberModel: true });
	};

	openSupplierModal = (e) => {
		this.setState({ openSupplierModal: true });
	};

	openProductModal = (props) => {
		this.setState({ openProductModal: true });
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

	getCurrentUser = (data) => {

		let option;
		if (data.label || data.value) {
			option = data;
		} else {
			option = {
				label: `${data.organization!==""?data.organization : data.organization!==""?data.organization : data.fullName}`,
				value: data.id,
			};
		}
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === data.currencyCode;
		});
		
		this.setState({
			supplier_currency: data.currencyCode,
			supplier_currency_des: result[0]  && result[0].currencyName ? result[0].currencyName:"AED",
			supplier_currency_symbol:data.currencyIso ?data.currencyIso:"AED",
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
	};

	closeSupplierModal = (res) => {
		if (res) {
			this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
			this.getInvoiceNo();
		}
		this.setState({ openSupplierModal: false });
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
		this.props.supplierInvoiceActions.getProductList().then((res) => {
			let newData=[]
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
						transactionCategoryId: res.data[0].transactionCategoryId,
						transactionCategoryLabel: res.data[0].transactionCategoryLabel,
					}),
					idCount: this.state.idCount + 1,					
				},					
				() => {
					const values = {
						values: this.state.initValue,
					};
					this.updateAmount(this.state.data, values);
					this.addRow();
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
				`lineItemsString.${0}.exciseTaxId`,
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
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.transactionCategoryId`,
				res.data[0].transactionCategoryId,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.transactionCategoryLabel`,
				res.data[0].transactionCategoryLabel,
				true,
			);
		});
	};
	getCurrentNumber = (data) => {
		this.getInvoiceNo();
	};

	getInvoiceNo = () => {
		this.props.supplierInvoiceCreateActions.getInvoiceNo().then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
						...this.state.initValue,
						...{
							invoice_number: res.data,
						},
					},
				});
				if( res &&  res.data &&this.formRef.current)
				this.formRef.current.setFieldValue('invoice_number', res.data, true, this.validationCheck(res.data));
			}
		});
	};

	validationCheck = (value) => {
		const data = {
			moduleType: 6,
			name: value,
		};
		this.props.supplierInvoiceCreateActions
			.checkValidation(data)
			.then((response) => {
				if (response.data === 'Invoice Number Already Exists') {
					this.setState(
						{
							exist: true,
						},
						() => {
							console.log(this.state.exist);
						},
					);
				} else {
					this.setState({
						exist: false,
					});
				}
			});
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

	rendertotalexcise = () => {
		const { initValue } = this.state

		let val = initValue.total_excise.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

		return parseFloat(val).toFixed(2)
	}

	render() {
		strings.setLanguage(this.state.language);
		const { data, discountOptions, initValue, prefix,tax_treatment_list, param,loading,loadingMsg } = this.state;

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
			loading ==true? <Loader loadingMsg={loadingMsg}/> :
			<div>
			<div className="create-supplier-invoice-screen">
				<div className=" fadeIn">
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
													// resetForm(initValue)

													// this.setState({
													//   selectedCurrency: null,
													//   selectedProject: null,
													//   selectedBankAccount: null,
													//   selectedCustomer: null

													// })
												}}
												validate={(values) => {
													let errors = {};
													if (this.state.exist === true) {
														errors.invoice_number =
															'Invoice number already exists';
													}
													if (values.invoice_number === '') {
														errors.invoice_number = 'Invoice number is required';
													}
												// 	if (values.placeOfSupplyId && values.placeOfSupplyId.label && values.placeOfSupplyId.label === "Select Place of Supply") {
												// 		errors.placeOfSupplyId = 'Place of supply is required';
												// 	}
												// 	if(this.state.customer_taxTreatment_des=="VAT REGISTERED" 
												// 	||this.state.customer_taxTreatment_des=="VAT REGISTERED DESIGNATED ZONE" 
												// 	||this.state.customer_taxTreatment_des=="GCC VAT REGISTERED" )
											    // 	{
												// 	if (!values.placeOfSupplyId) 
												// 	      	errors.placeOfSupplyId ='Place of supply is required';
												// 	if (values.placeOfSupplyId &&
												// 		(values.placeOfSupplyId=="" ||
												// 		(values.placeOfSupplyId.label && values.placeOfSupplyId.label === "Select place of supply")
												// 		)
												// 	   ) 
												// 	         errors.placeOfSupplyId ='Place of supply is required';
													
												//    }
												if(this.state.customer_taxTreatment_des!="NON GCC")
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
													if (values.term && values.term.label && values.term.label === "Select Terms") {
														errors.term = 'Term is required';
													}
													if (param === true) {
														errors.discount =
															'Discount amount cannot be greater than invoice Total Amount';
													}
														return errors;
												}}
												validationSchema={Yup.object().shape({
													invoice_number: Yup.string().required(
														'Invoice number is required',
													),
													contactId: Yup.string().required(
														'Supplier is required',
													),
													// placeOfSupplyId: Yup.string().required('Place of supply is required'),
													term: Yup.string().required('Term is required'),
													invoiceDate: Yup.string().required(
														'Invoice Date is required',
													),
													currency: Yup.string().required(
														'Currency is required',
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
																// transactionCategoryId: Yup.string().required(
																// 	'Account is required',
																// ),
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
																		maxLength="50"
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
														</Row>
														<hr />
														<Row>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="contactId">
																		<span className="text-danger">* </span>
																		{strings.Supplier} 
																	</Label>
																	<Select
																		isDisabled={this.state.isSelected}
																		id="contactId"
																		name="contactId"
																		placeholder={strings.Select + strings.Supplier}
																		options={
																			tmpSupplier_list
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					tmpSupplier_list,
																					'Supplier',
																				)
																				: []
																		}
																		
																		value={(this.state.rfqId || this.state.parentInvoiceId || this.state.poId) ?
																			tmpSupplier_list &&
																		   selectOptionsFactory.renderOptions(
																			   'label',
																			   'value',
																			   tmpSupplier_list,
																			   strings.CustomerName,
																		 ).find((option) => option.value == this.state.contactId)
																		   
																		 :
																		 
																		 props.values.contactId
																		   }
																		onChange={(option) => {
																			if (option && option.value) {
																				this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																				this.formRef.current.setFieldValue('taxTreatmentid', this.getTaxTreatment(option.value), true);
																				this.setExchange(this.getCurrency(option.value));
																				props.handleChange('contactId')(option);
																				this.setState({
																					contactId : option.value
																				})
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
															{this.props.location.state && this.props.location.state.rfqId ||
															this.props.location.state && this.props.location.state.poId ?"":<Col  lg={3}>
																<Label
																	htmlFor="contactId"
																	style={{ display: 'block' }}
																>
																	{strings.AddNewSupplier}
																</Label>
															<Button
																	type="button"
																	color="primary"
																	className="btn-square"
																	onClick={(e, props) => {
																		this.openSupplierModal()
																		// this.props.history.push(`/admin/master/contact/create`, { gotoParentURL: "/admin/expense/supplier-invoice/create" })
																	}}
																>
																	<i className="fa fa-plus"></i> {strings.AddASupplier}
																</Button>
															</Col>}

															{/* <Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="receiptNumber">
																			Tax Treatment
																				</Label>
																				<Input
																					type="text"
																					maxLength="50"
																					id="receiptNumber"
																					name="receiptNumber"
																					placeholder={strings.ReceiptNumber}
																					onChange={(option) => {
																						if (
																							option.target.value === '' ||
																							this.regExBoth.test(
																								option.target.value,
																							)
																						) {
																							props.handleChange(
																								'receiptNumber',
																							)(option);
																						}
																					}}
																					value={props.values.receiptNumber}
																				/>
																			</FormGroup>
																		</Col> */}
															{this.state.customer_taxTreatment_des ?
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="taxTreatmentid">
																			Tax Treatment
																		</Label>
																		<Input
																			disabled
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
																</Col> : ''}
															<Col lg={3}>
															{this.state.customer_taxTreatment_des!="NON GCC" &&(<FormGroup className="mb-3">
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
																	isDisabled={this.state.isSelected}
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
																				'Place of Supply',
																		    ).find(
																									(option) =>
																										option.value ==
																										((this.state.rfqId || this.state.poId || 
																											this.state.parentInvoiceId) ? 
																											this.state.placeOfSupplyId:props.values
																											.placeOfSupplyId.toString())

																								)
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
																		placeholder={strings.Select + strings.Terms}
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
																		value={props.values.invoiceDate}
																		selected={props.values.invoiceDate1 ?new Date(props.values.invoiceDate1):props.values.invoiceDate} 
																		onChange={(value) => {
																			props.handleChange('invoiceDate')(value);
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
																				{props.errors.invoiceDate.includes("nullable()") ? "Invoice date is required" : props.errors.invoiceDate}
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
																			id="invoiceDueDate"
																			name="invoiceDueDate"
																			placeholderText={strings.InvoiceDueDate}
																			value={props.values.invoiceDueDate}
																			showMonthDropdown
																			showYearDropdown
																			disabled
																			dateFormat="dd-MM-yyyy"
																			dropdownMode="select"
																			onChange={(value) => {
																				props.handleChange('invoiceDueDate')(
																					value,
																				);
																			}}
																			className={`form-control ${props.errors.invoiceDueDate &&
																					props.touched.invoiceDueDate
																					? 'is-invalid'
																					: ''
																				}`}
																		/>
																		{props.errors.invoiceDueDate &&
																			props.touched.invoiceDueDate && (
																				<div className="invalid-feedback">
																					{props.errors.invoiceDueDate}

																				</div>
																			)}
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
														<hr />
														<Row style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }}>
															<Col>
																<Label>
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
																			type="number"
																			min="0"
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

															<Col md={2}>
																<Input
																	disabled
																	id="currencyName"
																	name="currencyName"
																	value={
																		this.state.basecurrency.currencyName}

																/>
															</Col>
														</Row>
														<hr style={{ display: props.values.exchangeRate === 1 ? 'none' : '' }} />
														<Row className="mb-3">
															<Col lg={8} className="mb-3">
																{/* <Button
																	color="primary"
																	className={`btn-square mr-3 ${this.checkedRow() ? `disabled-cursor` : ``
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
																<Button
																	color="primary"
																	className="btn-square "
																	onClick={(e, props) => {
																		this.openProductModal()
																		// this.props.history.push(`/admin/master/product/create`, { gotoParentURL: "/admin/expense/supplier-invoice/create" })
																	}}
																>
																	<i className="fa fa-plus"></i> {strings.Addproduct}
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
																	class="container-fluid"
																>
																	<TableHeaderColumn
																		width="4%"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderActions(cell, rows, props)
																		}
																	></TableHeaderColumn>
																	<TableHeaderColumn
																		width="15%"
																		dataField="product"
																		dataFormat={(cell, rows) =>
																			this.renderProduct(cell, rows, props)
																		}
																	>
																		{strings.Products}
																	</TableHeaderColumn>
																	{/* <TableHeaderColumn
																		width="55"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderAddProduct(cell, rows, props)
																		}
																	></TableHeaderColumn> */}
																	<TableHeaderColumn
																		width="10%"
																		dataField="account"
																		dataFormat={(cell, rows) =>
																			this.renderAccount(cell, rows, props)
																		}
																	>
																		{strings.Account}
																	</TableHeaderColumn>
																	{/* <TableHeaderColumn
																		dataField="description"
																		dataFormat={(cell, rows) =>
																			this.renderDescription(cell, rows, props)
																		}
																	>
																		{strings.DESCRIPTION}
																	</TableHeaderColumn> */}
																	<TableHeaderColumn
																		dataField="quantity"
																		width="11%"
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
																		 className="fa fa-question-circle ml-1"
																	 ></i>
																	 
																	 <UncontrolledTooltip
																		 placement="right"
																		 target="unitTooltip"
																	 >
																		Units / Measurements
																	 </UncontrolledTooltip>
																 </TableHeaderColumn>  */}
																	<TableHeaderColumn
																		width="10%"
																		dataField="unitPrice"
																		dataFormat={(cell, rows) =>
																			this.renderUnitPrice(cell, rows, props)
																		}
																	>
																		{strings.UnitPrice}
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
																	</TableHeaderColumn>}
																	<TableHeaderColumn
																		width="10%"
																		dataField="vat"
																		dataFormat={(cell, rows) =>
																			this.renderVat(cell, rows, props)
																		}
																	>
																		{strings.VAT}
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		width="10%"
																		dataField="sub_total"
																		dataFormat={this.renderVatAmount}
																		className="text-right"
																		columnClassName="text-right"
																		formatExtraData={universal_currency_list}
																	>
																		{strings.VATAMOUNT}
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		width="10%"
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
														<Row className="ml-4">
															<Col className="ml-4">
																<Input
																	type="checkbox"
																	id="isReverseChargeEnabled"
																	checked={this.state.isReverseChargeEnabled}
																	onChange={(option) => {
																		this.setState({ isReverseChargeEnabled: !this.state.isReverseChargeEnabled })
																	}}
																/>
																<Label>{strings.IsReverseCharge}</Label>
															</Col>
															
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
														<hr />
														{this.state.data.length > 0 ? (
															<Row>
																<Col lg={8}>
																	<FormGroup className="py-2">
																		<Label htmlFor="notes">{strings.Notes}</Label><br/>
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
																			<FormGroup className="mb-3 hideAttachment">
																				<Field
																					name="attachmentFile"
																					render={({ field, form }) => (
																						<div>
																							<Label>{strings.ReceiptAttachment} </Label>{' '}
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
																						{this.state.supplier_currency_symbol} &nbsp;
																						{this.state.customer_currency_symbol} &nbsp;
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
																						{this.state.supplier_currency_symbol} &nbsp;
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
																						{this.state.supplier_currency_symbol} &nbsp;
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
																						{this.state.supplier_currency_symbol} &nbsp;
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
																			
																			if(this.state.data.length === 1)
																			{
																			console.log(props.errors,"ERRORs")
																				//	added validation popup	msg
																				props.handleBlur();
																				if(props.errors &&  Object.keys(props.errors).length != 0)
																				this.props.commonActions.fillManDatoryDetails();
																			}
																			else
																			{ let newData=[]
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
																	{this.state.poId || this.props.location.state && this.props.location.state.parentInvoiceId ? "" :	<Button
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
																		<i className="fa fa-repeat mr-1"></i>
																		{this.state.disabled
																			? 'Creating...'
																			: strings.CreateandMore}
																	</Button>}
																	<Button
																		type="button"
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push(
																				'/admin/expense/supplier-invoice',
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
				<SupplierModal
					openSupplierModal={this.state.openSupplierModal}
					closeSupplierModal={(e) => {
						this.closeSupplierModal(e);
					}}
					getCurrentUser={(e) =>
						{		
							this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
							this.getCurrentUser(e);
						}
						}
					createSupplier={this.props.supplierInvoiceActions.createSupplier}
					getStateList={this.props.supplierInvoiceActions.getStateList}
					currency_list={this.props.currency_convert_list}
					country_list={this.props.country_list}
				/>
				<ProductModal
					openProductModal={this.state.openProductModal}
					closeProductModal={(e) => {
						this.closeProductModal(e);
					}}
					getCurrentProduct={(e) =>{ 
						this.props.supplierInvoiceActions.getProductList();
						this.getCurrentProduct(e);
					}}
					createProduct={this.props.ProductActions.createAndSaveProduct}
					vat_list={this.props.vat_list}
					product_category_list={this.props.product_category_list}
					salesCategory={this.state.salesCategory}
					purchaseCategory={this.state.purchaseCategory}
				/>
				{/* <MultiSupplierProductModal
					openMultiSupplierProductModal={this.state.openMultiSupplierProductModal}
					closeMultiSupplierProductModal={(e) => {
						this.closeMultiSupplierProductModal(e);
					}}
					inventory_list={this.state.inventoryList}
				/> */}
				{/* <InvoiceNumberModel
					openInvoiceNumberModel={this.state.openInvoiceNumberModel}
					closeInvoiceNumberModel={(e) => {
						this.closeInvoiceNumberModel(e);
					}}
					getCurrentNumber={(e) => this.getCurrentNumber(e)}
					prefix ={this.state.prefixData}
					updatePrefix={this.props.customerInvoiceActions.updateInvoicePrefix}
					
				/> */}
			</div>
			{this.state.disableLeavePage ?"":<LeavePage/>}
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateSupplierInvoice);
