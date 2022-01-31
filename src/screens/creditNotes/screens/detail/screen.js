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
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as CreditNotesDetailActions from './actions';
import * as ProductActions from '../../../product/actions';
import * as CreditNotesActions from '../../actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';

import { CustomerModal ,ProductModal } from '../../sections';
import { Loader, ConfirmDeleteModal,Currency } from 'components';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';
import API_ROOT_URL from '../../../../constants/config';
import {data}  from '../../../Language/index'
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
class DetailCreditNote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dialog: false,
			disabled: false,
			disabled1:false,
			discountOptions: [
				{ value: 'FIXED', label: 'Fixed' },
				{ value: 'PERCENTAGE', label: 'Percentage' },
			],
			discount_option: '',
			data: [],
			current_customer_id: null,
			initValue: {},
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
			basecurrency:[],
			customer_currency: '',
			showInvoiceNumber:false
		};

		// this.options = {
		//   paginationPosition: 'top'
		// }
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
				if(res.data.length && res.data.length !=0 )
				this.setState(
					{
						invoiceNumber: res.data[0].invoiceNumber,
						showInvoiceNumber:true
					},
					() => {	},
				);
			}
		})
		//CN details
			this.props.creditNotesDetailActions
				.getCreditNoteById(this.props.location.state.id,
					this.props.location.state.isCNWithoutProduct ?this.props.location.state.isCNWithoutProduct:false)
				.then((res) => {
					if (res.status === 200) {
						this.getCompanyCurrency();
						this.props.creditNotesActions.getVatList();
						this.props.creditNotesActions.getCustomerList(
							this.state.contactType,
						);
						this.props.creditNotesActions.getExciseList();
						this.props.currencyConvertActions.getCurrencyConversionList();
						this.props.creditNotesActions.getCountryList();
						this.props.creditNotesActions.getProductList();

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
									exchangeRate:res.data.exchangeRate ? res.data.exchangeRate : '',
									currencyName:res.data.currencyName ? res.data.currencyName : '',
									// invoiceDueDate: res.data.invoiceDueDate
									// 	? moment(res.data.invoiceDueDate).format('DD-MM-YYYY')
									// 	: '',
									invoiceDate: res.data.creditNoteDate
										? moment(res.data.creditNoteDate).format('DD-MM-YYYY')
										: '',
									contactId: res.data.contactId ? res.data.contactId : '',
									project: res.data.projectId ? res.data.projectId : '',
									invoice_number: res.data.creditNoteNumber
										? res.data.creditNoteNumber
										: '',
									total_net: 0,
									invoiceVATAmount: res.data.totalVatAmount
										? res.data.totalVatAmount
										: 0,
									totalAmount: res.data.totalAmount ? res.data.totalAmount : 0,
									creditAmount: res.data.totalAmount ? res.data.totalAmount : 0,
									notes: res.data.notes ? res.data.notes : '',
									lineItemsString: res.data.invoiceLineItems
										? res.data.invoiceLineItems
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
								},
								customer_taxTreatment_des : res.data.taxTreatment ? res.data.taxTreatment : '',
								checked: res.data.exciseType ? res.data.exciseType : res.data.exciseType,
								discountAmount: res.data.discount ? res.data.discount : 0,
								total_excise: res.data.totalExciseTaxAmount ? res.data.totalExciseTaxAmount : 0,
								discountPercentage: res.data.discountPercentage
									? res.data.discountPercentage
									: '',
								data: res.data.invoiceLineItems
									? res.data.invoiceLineItems
									: [],
								selectedContact: res.data.contactId ? res.data.contactId : '',
								term: res.data.term ? res.data.term : '',
								placeOfSupplyId: res.data.placeOfSupplyId ? res.data.placeOfSupplyId : '',
								loading: false,
							},
							() => {
								if (this.state.data.length > 0) {
									this.calTotalNet(this.state.data);
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
			this.props.history.push('/admin/income/credit-notes');
		}
	};

	calTotalNet = (data) => {
		let total_net = 0;
		data.map((obj) => {
			if(obj.isExciseTaxExclusive === false){

                total_net = +(total_net + +obj.unitPrice  * obj.quantity);

            }else{

                total_net = +(total_net + +(obj.unitPrice + obj.exciseAmount) * obj.quantity);

            }
        return obj;

        });
		total_net=total_net-this.state.discountAmount
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
            ${
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
						placeholder={strings.Select+strings.Vat}
						onChange={(e) => {
							debugger
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
           						${
												props.errors.lineItemsString &&
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
                       ${
													props.errors.lineItemsString &&
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

	renderSubTotal = (cell, row,extraData) => {
		// return row.subTotal ? (
		// 	<Currency
		// 		value={row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	''
		// );
		return row.subTotal === 0 ? this.state.customer_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.customer_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
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
		return row.vatAmount === 0 ? this.state.customer_currency_symbol +" "+ row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.customer_currency_symbol +" "+ row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
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
					productId: '',
					discountType :'FIXED',
					exciseTaxId:'',
					vatAmount:0,
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
						placeholder={strings.Select+strings.Vat}
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
					   placeholder={strings.discount}
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
	type="text"
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
	debugger
	
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
				obj['vatCategoryId'] = result.vatCategoryId;
				obj['description'] = result.description;
				obj['exciseTaxId'] = result.exciseTaxId;
				obj['isExciseTaxExclusive'] = result.isExciseTaxExclusive;
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
		form.setFieldValue(
			`lineItemsString.${idx}.exciseTaxId`,
			result.exciseTaxId,
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
		const { vat_list , excise_list} = this.props;
		const { discountPercentage, discountAmount } = this.state;
		let total_net = 0;
		let total_excise = 0;
		let total = 0;
		let total_vat = 0;
		let net_value = 0;
		let discount = 0;
		data.map((obj) => {
			const index =
				obj.vatCategoryId !== ''
					? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
					: '';
			const vat = index !== '' ? vat_list[`${index}`].vat : 0;

			//Excise calculation
			if(obj.exciseTaxId !=  0){
				if(obj.isExciseTaxExclusive === true){
				if(obj.exciseTaxId === 1){
				const value = +(obj.unitPrice) / 2 ;
					net_value = parseFloat(obj.unitPrice) + parseFloat(value) ;
					obj.exciseAmount = parseFloat(value) * obj.quantity;
				}else if (obj.exciseTaxId === 2){
					const value = obj.unitPrice;
					net_value = parseFloat(obj.unitPrice) +  parseFloat(value) ;
					obj.exciseAmount = parseFloat(value) * obj.quantity;
				}
				else{
					net_value = obj.unitPrice
				}
			}	else{
				if(obj.exciseTaxId === 1){
					const value = obj.unitPrice / 3
					obj.exciseAmount = parseFloat(value) * obj.quantity;
				net_value = obj.unitPrice}
				else if (obj.exciseTaxId === 2){
					const value = obj.unitPrice / 2
					obj.exciseAmount = parseFloat(value) * obj.quantity;
				net_value = obj.unitPrice}
				else{
					net_value = obj.unitPrice
				}
			}
		}else{
			net_value = obj.unitPrice;
			obj.exciseAmount = 0
		}
			//vat calculation
			if (obj.discountType === 'PERCENTAGE') {
				var val =
				((+net_value -
				 (+((net_value * obj.discount)) / 100)) *
					vat *
					obj.quantity) /
				100;

				var val1 =
				((+net_value -
				 (+((net_value * obj.discount)) / 100)) * obj.quantity ) ;
			} else if (obj.discountType === 'FIXED') {
				var val =
						 (net_value * obj.quantity - obj.discount ) *
					(vat / 100);

					var val1 =
					((net_value * obj.quantity )- obj.discount )

			} else {
				var val = (+net_value * vat * obj.quantity) / 100;
				var val1 = net_value * obj.quantity
			}

			//discount calculation
			discount = +(discount +(net_value * obj.quantity)) - parseFloat(val1)
			total_net = +(total_net + net_value * obj.quantity);
			total_vat = +(total_vat + val);
			obj.vatAmount = val
			obj.subTotal =
			net_value && obj.vatCategoryId ? parseFloat(val1) + parseFloat(val) : 0;
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
						total_net: discount ? total_net - discount : total_net,
						invoiceVATAmount: total_vat,
						discount:  discount ? discount : 0,
						totalAmount: total_net > discount ? total - discount : total - discount,
						total_excise: total_excise
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
			// props.setFieldValue('invoiceDueDate', date, true);
		}
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

	handleSubmit = (data) => {

		this.setState({ disabled: true });
		const { current_customer_id, term } = this.state;
		const {
			receiptAttachmentDescription,
			receiptNumber,
			contact_po_number,
			currency,
			// invoiceDueDate,
			invoiceDate,
			contactId,
			// project,
			// placeOfSupplyId,
			// exchangeRate,
			invoice_number,
			notes,
			creditAmount,
			discount,
			discountType,
			discountPercentage,
		} = data;

		let formData = new FormData();
		formData.append('type', 7);
		formData.append('creditNoteId', current_customer_id);
		formData.append(
			'creditNoteNumber',
			invoice_number !== null ? invoice_number : '',
		);
		formData.append(
			'creditNoteDate',
			typeof invoiceDate === 'string'
				? moment(invoiceDate, 'DD-MM-YYYY').toDate()
				: invoiceDate,
		);
		// formData.append(
		// 	'invoiceDueDate',
		// 	typeof invoiceDueDate === 'string'
		// 		? moment(invoiceDueDate, 'DD-MM-YYYY').toDate()
		// 		: invoiceDueDate,
		// );

		formData.append('exchangeRate',  this.state.initValue.exchangeRate);
		
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

		
		formData.append('isCreatedWithoutInvoice', this.props.location.state.isCNWithoutProduct==true ?true:false);
		if(this.props.location.state.isCNWithoutProduct==true)
		formData.append('totalAmount', creditAmount);
		else
		{
			formData.append('lineItemsString', JSON.stringify(this.state.data));
			formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
			formData.append('totalAmount', this.state.initValue.totalAmount);	
			formData.append('totalExciseAmount', this.state.initValue.total_excise);
			formData.append('discount',this.state.initValue.discount);	
		formData.append('totalExciseTaxAmount', this.state.initValue.total_excise);}
		// formData.append('exciseType', this.state.checked);
		// formData.append('discountType', discountType);
		// formData.append('term', term);
		//formData.append('placeOfSupplyId',placeOfSupplyId.value);
		// if (discountType === 'PERCENTAGE') {
		// 	formData.append('discountPercentage', discountPercentage);
		// }
		if (contactId) {
			formData.append('contactId', contactId);
		}
		if (currency && currency.value) {
			formData.append('currencyCode', currency.value);
		}
		// if (placeOfSupplyId && placeOfSupplyId.value) {
		// 	formData.append('placeOfSupplyId', placeOfSupplyId.value);
		// }
		// if (project) {
		// 	formData.append('projectId', project);
		// }
		// if (this.uploadFile.files[0]) {
		// 	formData.append('attachmentFile', this.uploadFile.files[0]);
		// }
		this.props.creditNotesDetailActions
			.UpdateCreditNotes(formData)
			.then((res) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'Credit Note Updated Successfully'
				);
				this.props.history.push('/admin/income/credit-notes');
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Credit Note Updated Unsuccessfully'

				);
			});
	};

	openCustomerModal = (e) => {
		e.preventDefault();
		this.setState({ openCustomerModal: true });
	};
	openProductModal = (props) => {
		this.setState({ openProductModal: true });
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
			this.props.creditNotesActions.getCustomerList(this.state.contactType);
		}
		this.setState({ openCustomerModal: false });
	};

	closeProductModal = (res) => {
		this.setState({ openProductModal: false });
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
							vatCategoryId: res.data[0].vatCategoryId,
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

	deleteInvoice = () => {
		const message1 =
			<text>
			<b>Delete Tax Credit Note?</b>
			</text>
			const message = 'This Tax Credit Note  will be deleted permanently and cannot be recovered. ';
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
		if(this.props.location.state.isCNWithoutProduct!=true)
		{this.props.creditNotesDetailActions
			.deleteInvoice(current_customer_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Credit Note Deleted Successfully'
					);
					this.props.history.push('/admin/income/credit-notes');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Credit Note Deleted Unsuccessfully'
				);
			});}
			else
			{this.props.creditNotesDetailActions
				.deleteCN(current_customer_id)
				.then((res) => {
					if (res.status === 200) {
						this.props.commonActions.tostifyAlert(
							'success',
							res.data ? res.data.message : 'Credit Note Deleted Successfully'
						);
						this.props.history.push('/admin/income/credit-notes');
					}
				})
				.catch((err) => {
					this.props.commonActions.tostifyAlert(
						'error',
						err.data ? err.data.message : 'Credit Note Deleted Unsuccessfully'
					);
				});}
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
	showInvoiceNumber=()=>{
		return(
			this.state.showInvoiceNumber &&(<Col lg={3}>
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
																</Col>)
		)
	}
	render() {
		strings.setLanguage(this.state.language);
		const { data, discountOptions, initValue, loading, dialog } = this.state;

		const { project_list, currency_list,currency_convert_list, customer_list,universal_currency_list } = this.props;

		let tmpCustomer_list = []

		customer_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpCustomer_list.push(obj)
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
												<span className="ml-2">{strings.UpdateCreditNote}</span>
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
													// validationSchema={Yup.object().shape({
													// 	invoice_number: Yup.string().required(
													// 		'Credit Note Number is Required',
													// 	),
													// 	contactId: Yup.string().required(
													// 		'Supplier is Required',
													// 	),
													// 	term: Yup.string().required('term is Required'),
													// 	placeOfSupplyId: Yup.string().required('Place of supply is Required'),
													// 	invoiceDate: Yup.string().required(
													// 		'Credit Note Date is Required',
													// 	),
													// 	invoiceDueDate: Yup.string().required(
													// 		'Credit Note Due Date is Required',
													// 	),
													// 	currency: Yup.string().required(
													// 		'Currency is Required',
													// 	),
													// 	lineItemsString: Yup.array()
													// 		.required(
													// 			'Atleast one invoice sub detail is mandatory',
													// 		)
													// 		.of(
													// 			Yup.object().shape({
													// 				// description: Yup.string().required(
													// 				// 	'Value is Required',
													// 				// ),
													// 				quantity: Yup.string()
													// 					.required('Value is Required')
													// 					.test(
													// 						'quantity',
													// 						'Quantity Should be Greater than 1',
													// 						(value) => {
													// 							if (value > 0) {
													// 								return true;
													// 							} else {
													// 								return false;
													// 							}
													// 						},
													// 					),
													// 				unitPrice: Yup.string()
													// 					.required('Value is Required')
													// 					.test(
													// 						'Unit Price',
													// 						'Unit Price Should be Greater than 1',
													// 						(value) => {
													// 							if (value > 0) {
													// 								return true;
													// 							} else {
													// 								return false;
													// 							}
													// 						},
													// 					),
													// 				vatCategoryId: Yup.string().required(
													// 					'Value is Required',
													// 				),
													// 				productId: Yup.string().required(
													// 					'Product is Required',
													// 				),
													// 			}),
													// 		),
													// 	attachmentFile: Yup.mixed()
													// 		.test(
													// 			'fileType',
													// 			'*Unsupported File Format',
													// 			(value) => {
													// 				value &&
													// 					this.setState({
													// 						fileName: value.name,
													// 					});
													// 				if (
													// 					!value ||
													// 					(value &&
													// 						this.supported_format.includes(
													// 							value.type,
													// 						))
													// 				) {
													// 					return true;
													// 				} else {
													// 					return false;
													// 				}
													// 			},
													// 		)
													// 		.test(
													// 			'fileSize',
													// 			'*File Size is too large',
													// 			(value) => {
													// 				if (
													// 					!value ||
													// 					(value && value.size <= this.file_size)
													// 				) {
													// 					return true;
													// 				} else {
													// 					return false;
													// 				}
													// 			},
													// 		),
													// })}
												>
													{(props) => (
														<Form onSubmit={props.handleSubmit}>
															<Row>{this.showInvoiceNumber()}  </Row>
															<Row>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="invoice_number">
																			<span className="text-danger">* </span>
															        {strings.CreditNoteNumber}
																		</Label>
																		<Input
																			type="text"
																			id="invoice_number"
																			name="invoice_number"
																			placeholder=""
																			disabled
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
																					this.setExchange( this.getCurrency(option.value) );
																					props.handleChange('contactId')(
																						option.value,
																					);
																				} else {
																					props.handleChange('contactId')('');
																				}
																				// this.getCurrentUser(option)
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
																{/* <Col>
																	<Label
																		htmlFor="contactId"
																		style={{ display: 'block' }}
																	>
																		Add New Customer
																	</Label>
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3 mb-3"
																		onClick={this.openCustomerModal}
																	>
																		<i className="fa fa-plus"></i> Add a
																		Customer
																	</Button>
																</Col> */}
																{/* <Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="placeOfSupplyId">
																			<span className="text-danger">*</span>
																			Place of Supply
																		</Label>
																		<Select
																			styles={customStyles}
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
																			id="placeOfSupplyId"
																			name="placeOfSupplyId"
																			value={
																				this.placelist &&
																				selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					this.placelist,
																					'Place of Supply',
																			  ).find(
																										(option) =>
																											option.value ===
																											props.values
																												.placeOfSupplyId.toString(),
																									)
																							}
																							onChange={(options) => {
																								if (options && options.value) {
																									props.handleChange(
																										'placeOfSupplyId',
																									)(options.value);
																								} else {
																									props.handleChange(
																										'placeOfSupplyId',
																									)('');
																								}
																							}}
																			className={`${
																				props.errors.placeOfSupplyId &&
																				props.touched.placeOfSupplyId
																					? 'is-invalid'
																					: ''
																			}`}
																		/>
																		{props.errors.placeOfSupplyId &&
																			props.touched.placeOfSupplyId && (
																				<div className="invalid-feedback">
																					{props.errors.placeOfSupplyId}
																				</div>
																			)}
																	</FormGroup>
																</Col> */}
															</Row>
															<hr />
															<Row>
																{/* <Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="term">
																			<span className="text-danger">*</span>
																			Terms{' '}
																			<i className="fa fa-question-circle"></i>
																		</Label>
																		<Select
																			styles={customStyles}
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
																			value={
																				this.termList &&
																				this.termList.find(
																					(option) =>
																						option.value === props.values.term,
																				)
																			}
																			onChange={(option) => {
																				props.handleChange('term')(
																					option.value,
																				);
																				if (option.value === '') {
																					this.setState({
																						term: option.value,
																					});
																					props.setFieldValue(
																						'invoiceDueDate',
																						'',
																					);
																				} else {
																					this.setState(
																						{
																							term: option.value,
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
																		{props.errors.term &&
																			props.touched.term && (
																				<div className="invalid-feedback">
																					{props.errors.term}
																				</div>
																			)}
																	</FormGroup>
																</Col> */}
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="date">
																			<span className="text-danger">* </span>
																			 {strings.CreditNoteDate}
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
																{/* <Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="due_date">
																		Credit Note Due Date
																		</Label>
																		<div>
																			<DatePicker
																				id="invoiceDueDate"
																				name="invoiceDueDate"
																				placeholderText="Invoice Due Date"
																				// selected={props.values.invoiceDueDate}
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
																				className={`form-control ${
																					props.errors.invoiceDueDate &&
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
																</Col> */}
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
																			className={`${
																				props.errors.currencyCode &&
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
																{this.props.location.state.isCNWithoutProduct==true &&(<Col  lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="creditAmount"><span className="text-danger">* </span>
																	Credit Amount
																	</Label>
																	<Input
																		type="text"
																		id="creditAmount"
																		name="creditAmount"
																		placeholder={strings.Enter+" Credit Amount"}																		
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
															</Col>)}
																</Row>
																<hr />
																{/* <Row style={{display: props.values.exchangeRate === 1 ? 'none' : ''}}>
																<Col>
																<Label htmlFor="currency">
																		Currency Exchange Rate
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
																	<Label htmlFor="exchangeRate">
																		Exchange rate
																	</Label>
																	<div>
																		<Input
																		disabled	
																			className="form-control"
																			id="currencyName"
																			name="currencyName"
																			disabled
																			value={this.state.customer_currency_des ? this.state.customer_currency_des : props.values.currencyName}
																			onChange={(value) => {
																				props.handleChange('currencyName')(
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
																	<Label htmlFor="exchangeRate">
																		Exchange rate
																	</Label>
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
																				value=	{
																					this.state.basecurrency.currencyName }
																				
																			/>
														</Col>
														</Row> */}
															{/* <hr style={{display: props.values.exchangeRate === 1 ? 'none' : ''}} />
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
																		<i className="fa fa-plus"></i> {strings.Addmore}
																	</Button>
																</Col>
															</Row> */}
														
														{this.props.location.state.isCNWithoutProduct!=true &&(	<Row>
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
																			 {strings.PRODUCT}
																		</TableHeaderColumn>
																		{/* <TableHeaderColumn
																		width="55"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderAddProduct(cell, rows, props)
																		}
																	></TableHeaderColumn> */}
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
																	width="10%"
																		dataField="exciseTaxId"
																		dataFormat={(cell, rows) =>
																			this.renderExcise(cell, rows, props)
																		}
																	>
																	Excise
																	<i
																			id="ExiseTooltip"
																			className="fa fa-question-circle ml-1"
																		></i>
																		<UncontrolledTooltip
																			placement="right"
																			target="ExiseTooltip"
																		>
																			If Exise Type for a product is Inclusive
																			then the Excise dropdown will be Disabled
																		</UncontrolledTooltip>
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		width="12%"
																		dataField="discount"
																		dataFormat={(cell, rows) =>
																			this.renderDiscount(cell, rows, props)
																		}
																	>
																	DisCount
																	</TableHeaderColumn>
																		<TableHeaderColumn
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
																		Vat amount
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
															</Row>)}
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
																				{/* <Input
																					type="text"
																					maxLength="100"
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
																				/> */}
																			</FormGroup>
																		</Col>
																		{/* <Col lg={6}>
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
																		</Col> */}
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
																			{/* <div className="total-item p-2">
																				<Row>
																					<Col lg={6}>
																						<FormGroup>
																							<Label htmlFor="discountType">
																								 {strings.DiscountType}
																							</Label>
																							<Select
																								styles={customStyles}
																								className="select-default-width"
																								options={discountOptions}
																								id="discountType"
																								name="discountType"
																								value={
																									discountOptions &&
																									discountOptions.find(
																										(option) =>
																											option.value ===
																											props.values.discountType,
																									)
																								}
																								onChange={(item) => {
																									props.handleChange(
																										'discountPercentage',
																									)('');
																									props.handleChange(
																										'discountType',
																									)(item.value);
																									props.setFieldValue(
																										'discount',
																										0,
																									);

																									this.setState(
																										{
																											discountPercentage: 0,
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
																					{props.values.discountType ===
																						'PERCENTAGE' && (
																						<Col lg={6}>
																							<FormGroup>
																								<Label htmlFor="discountPercentage">
																									 {strings.Percentage}
																								</Label>
																								<Input
																								id="discountPercentage"
																								name="discountPercentage"
																								placeholder="Discount Percentage"
																								type="number"
min="0"
																								maxLength="5"
																								value={
																									props.values
																										.discountPercentage
																								}
																								onChange={(e) => {
																									if (
																										e.target.value === '' ||
																										this.regDecimal.test(
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
																					)}
																				</Row>
																				<Row>
																					<Col lg={6} className="mt-4">
																						<FormGroup>
																							<Label htmlFor="discount">
																								 {strings.DiscountAmount}
																							</Label>
																							<Input
																								id="discount"
																								name="discount"
																								type="text"
																								disabled={
																									props.values.discountType &&
																									props.values.discountType ===
																										'Percentage'
																										? true
																										: false
																								}
																								placeholder="Discount Amounts"
																								value={props.values.discount}
																								onChange={(option) => {
																									if (
																										option.target.value ===
																											'' ||
																										this.regDecimal.test(
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
																			</div> */}
																				<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																						 {strings.Discount}
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
																				
																						{this.state.customer_currency_symbol} &nbsp;
																							{initValue.discount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																					
																					</label>
																				</Col>
																			</Row>
																		</div>
																		<div className="total-item p-2" >
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																					Total Excise
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">

																						{this.state.customer_currency_symbol} &nbsp;
																						{initValue.total_excise.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																					</label>
																				</Col>
																			</Row>
																		</div>
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
																						value=	{initValue.total_net.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						currencySymbol={
																							universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.customer_currency_symbol} &nbsp;
																							{initValue.total_net.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						</label>
																					</Col>
																				</Row>
																			</div>
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
																						value={initValue.invoiceVATAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						currencySymbol={
																							universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.customer_currency_symbol} &nbsp;
																							{initValue.invoiceVATAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
																					
																							{this.state.customer_currency_symbol} &nbsp;
																								{this.state.initValue.discount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						</label>
																					</Col>
																				</Row>
																			</div> */}
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
																						value=	{initValue.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						currencySymbol={
																							universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.customer_currency_symbol} &nbsp;
																								{initValue.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						</label>
																					</Col>
																				</Row>
																			</div>
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
																			onClick={this.deleteInvoice}
																		>
																			<i className="fa fa-trash"></i> {' '} {this.state.disabled1
																			? 'Deleting...'
																			: strings.Delete }
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
																			: strings.Update }
																			{/* { {this.state.disabled }
																				? 'Updating...'
																				{ : 'Update'} } */}
																		</Button>
																		<Button
																			color="secondary"
																			className="btn-square"
																			onClick={() => {
																				this.props.history.push(
																					'/admin/income/credit-notes',
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
					getCurrentUser={(e) => this.getCurrentUser(e)}
					createCustomer={this.props.creditNotesActions.createCustomer}
					currency_list={this.props.currency_list}
					country_list={this.props.country_list}
					getStateList={this.props.creditNotesActions.getStateList}
				/>
				<ProductModal
					openProductModal={this.state.openProductModal}
					closeProductModal={(e) => {
						this.closeProductModal(e);
					}}
					getCurrentProduct={(e) => this.getCurrentProduct(e)}
					createProduct={this.props.productActions.createAndSaveProduct}
					vat_list={this.props.vat_list}
					product_category_list={this.props.product_category_list}
					salesCategory={this.state.salesCategory}
					purchaseCategory={this.state.purchaseCategory}
				/>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DetailCreditNote);
