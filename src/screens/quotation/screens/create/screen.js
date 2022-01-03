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
import { Currency } from 'components';
import * as Yup from 'yup';
import * as SupplierInvoiceCreateActions from './actions';
import * as QuotationCreateAction from './actions'
import * as RequestForQuotationAction from '../../actions';
import * as SupplierInvoiceActions from '../../../supplier_invoice/actions'
import * as ProductActions from '../../../product/actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';
import * as CustomerInvoiceActions from '../../../customer_invoice/actions';

import { SupplierModal } from '../../sections';
import { ProductModal } from '../../../customer_invoice/sections';
import Switch from "react-switch";


import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

import './style.scss';
import moment from 'moment';

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
		currency_convert_list: state.currencyConvert.currency_convert_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		requestForQuotationAction: bindActionCreators(
			RequestForQuotationAction,
			dispatch,
		),
		supplierInvoiceActions : bindActionCreators(
			SupplierInvoiceActions,dispatch,
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
		quotationCreateAction: bindActionCreators(QuotationCreateAction,dispatch),
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
			supplier_currency_symbol:'',
			loading: false,
			discountOptions: [
				{ value: 'FIXED', label: 'Fixed' },
				{ value: 'PERCENTAGE', label: 'Percentage' },
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
					exciseTaxId:'',
					exciseAmount:'',
					subTotal: 0,
					vatAmount:0,
					productId: ''
				},
			],
			idCount: 0,
			checked:false,
			initValue: {
				total_excise: 0,
				contact_po_number: '',
				currencyCode: '',
				poApproveDate: new Date(),
				quotaionExpiration: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				// quotaionExpiration: new Date(),
				customerId: '',
				placeOfSupplyId: '',
				project: '',
				exchangeRate:'',
				lineItemsString: [
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
				quotation_Number: '',
				total_net: 0,
				invoiceVATAmount: 0,
				term: '',
				totalAmount: 0,
				notes: '',
				discount: 0,
				discountPercentage: 0,
				discountType: { value: 'FIXED', label: 'Fixed' },
			},
			currentData: {},
			contactType: 2,
			openSupplierModal: false,
			openProductModal: false,
			openInvoiceNumberModel: false,
			selectedContact: '',
			createMore: false,
			
			
			prefix: '',
			selectedType: { value: 'FIXED', label: 'Fixed' },
			discountPercentage: '',
			discountAmount: 0,
			purchaseCategory: [],	
			exist: false,
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
						maxLength="250"
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
						isDisabled={row.exciseTaxId === 0 || this.state.checked === false}
						
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
							props.errors.lineItemsString[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].quantity
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
					min="0"
						maxLength="17,3"
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
            ${
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
		return row.subTotal === 0 ? this.state.supplier_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.supplier_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	};

	componentDidMount = () => {
		this.getInitialData();
	};

	getInitialData = () => {
		this.getInvoiceNo();
		this.props.requestForQuotationAction.getSupplierList(this.state.contactType);
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
		this.props.requestForQuotationAction.getPoPrefix().then((response) => {
			this.setState({prefixData:response.data
		});
		});
		this.props.requestForQuotationAction.getExciseList();
		this.props.requestForQuotationAction.getVatList();
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
					unitPrice: '',
					vatCategoryId: '',
					subTotal: 0,
					productId: '',
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
					<Select
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

	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.data;
		const result = product_list.find((item) => item.id === parseInt(e));
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				obj['unitPrice'] = result.unitPrice;
				obj['vatCategoryId'] = result.vatCategoryId;
				obj['description'] = result.description;
				obj['exciseTaxId'] = result.exciseTaxId;
				
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
			`lineItemsString.${idx}.exciseTaxId`,
			result.exciseTaxId,
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.description`,
			result.description,
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
					<Select
						styles={customStyles}
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
						id="productId"
						placeholder={strings.Select+strings.Product}
						onChange={(e) => {
							if (e && e.label !== 'Select Product') {
								this.selectItem(e.value, row, 'productId', form, field, props);
								this.prductValue(e.value, row, 'productId', form, field, props);
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
		return (
			<Button
				size="sm"
				className="btn-twitter btn-brand icon mt-1"
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

	// setDate = (props, value) => {
	// 	const { term } = this.state;
	// 	const val = term ? term.value.split('_') : '';
	// 	const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
	// 	const values = value
	// 		? value
	// 		: moment(props.values.invoiceDate, 'DD/MM/YYYY').toDate();
	// 	if (temp && values) {
	// 		const date = moment(values)
	// 			.add(temp - 1, 'days')
	// 			.format('DD/MM/YYYY');
	// 		props.setFieldValue('invoiceDueDate', date, true);
	// 	}
	// };

	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});

		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
		};

	setCurrency = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === value;
		});
		
	    this.formRef.current.setFieldValue('curreancyname', result[0].currencyName, true);
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
			if(this.state.checked === true){
				if(obj.exciseTaxId === 1){
				const value = +(obj.unitPrice) / 2 ;
					net_value = parseFloat(obj.unitPrice) +  value ;
				obj.exciseAmount = value;
				}else if (obj.exciseTaxId === 2){
					const value = obj.unitPrice;
					net_value = parseFloat(obj.unitPrice) +  value ;
					obj.exciseAmount = value;
				}
				else{
					net_value = obj.unitPrice
				}
			}	else{
				if(obj.exciseTaxId === 1){
					const value = obj.unitPrice / 3
				obj.exciseAmount = value;
				net_value = obj.unitPrice}
				else if (obj.exciseTaxId === 2){
					const value = obj.unitPrice / 2
				obj.exciseAmount = value;
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
			discount = +(discount +(net_value * obj.quantity)) - val1
			total_net = +(total_net + net_value * obj.quantity);
			total_vat = +(total_vat + val);
			obj.vatAmount = val
			obj.subTotal =
			net_value && obj.vatCategoryId ? val1  + val : 0;
			total_excise = +((total_excise + obj.exciseAmount) * obj.quantity)
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

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const {
			quotaionExpiration,
			currency,
			customerId,
			quotation_Number,
			notes,
			placeOfSupplyId
		} = data;
		const { term } = this.state;

		let formData = new FormData();
		formData.append(
			'quotationNumber',
			quotation_Number !== null ? this.state.prefix + quotation_Number : '',
		);
		formData.append(
			'quotaionExpiration',
			quotaionExpiration ? quotaionExpiration : '',
		);
		formData.append('totalExciseAmount', this.state.initValue.total_excise);
		if (placeOfSupplyId) {
			formData.append('placeOfSupplyId', placeOfSupplyId.value ? placeOfSupplyId.value : placeOfSupplyId);
		};
		formData.append('exciseType', this.state.checked);
		formData.append('notes', notes ? notes : '');
		formData.append('type', 6);
		formData.append('lineItemsString', JSON.stringify(this.state.data));
		formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
		formData.append('totalAmount', this.state.initValue.totalAmount);
		if (customerId && customerId.value) {
			formData.append('customerId', customerId.value);
		}
		if (currency !== null && currency) {
			formData.append('currencyCode', this.state.supplier_currency);
		}
		this.props.quotationCreateAction
			.createQuotation(formData)
			.then((res) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message :'New Quotation Created Successfully.',
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
									quantity: 1,
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
					this.props.history.push('/admin/income/quotation');
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
		this.setState({ openInvoiceNumberModel : true });
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
			reader.onloadend = () => {};
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
				label: `${data.fullName}`,
				value: data.id,
			};
		}
		
		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === data.currencyCode;
		});
		
	    this.formRef.current.setFieldValue('currency', result[0].currencyCode, true);
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);

		this.setState({
			supplier_currency: data.currencyCode,
			supplier_currency_des: result[0].currencyName,
		})

		// this.setState({
		//   selectedContact: option
		// })
		this.formRef.current.setFieldValue('customerId', option, true);
	};
	getCurrency = (opt) => {
		let supplier_currencyCode = 0;

		this.props.supplier_list.map(item => {
			if(item.label.contactId == opt) {
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
	closeSupplierModal = (res) => {
		if (res) {
			this.props.requestForQuotationAction.getSupplierList(this.state.contactType);
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
		this.props.requestForQuotationAction.getProductList().then((res) => {
			this.setState(
				{
					data: [
						{
							id: 0,
							description: res.data[0].description,
							quantity: 1,
							unitPrice: res.data[0].unitPrice,
							vatCategoryId: res.data[0].vatCategoryId,
							exciseTaxId: res.data[0].exciseTaxId,
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
				this.formRef.current.setFieldValue('quotation_Number', res.data, true,this.validationCheck(res.data));
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
				if (response.data === 'QuotationNumber already exists') {
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



	render() {
		strings.setLanguage(this.state.language);

		const { data, discountOptions, initValue, prefix } = this.state;

		const {
			currency_list,
			supplier_list,
			universal_currency_list,
			currency_convert_list,
		} = this.props;

		let tmpSupplier_list = []

		supplier_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpSupplier_list.push(obj)
		})

		return (
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
												<span className="ml-2">{strings.CreateQuotation}</span>
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
												validate={(values) => 
													{
													let errors = {};
													if (this.state.exist === true) {
														errors.quotation_Number =
															'Quotation Number already exists';
													}
													if (values.quotation_Number==='') {
														errors.quotation_Number = 'Quotation Number is required';
													}
													return errors;
												}}
												validationSchema={Yup.object().shape(
													{
														quotation_Number: Yup.string().required(
														'Invoice Number is Required',
													),
													customerId: Yup.string().required(
														'Supplier is Required',
													),
													// placeOfSupplyId: Yup.string().required('Place of supply is Required'),
													
													// poApproveDate: Yup.string().required(
													// 	'Order Date is Required',
													// ),
													quotaionExpiration: Yup.string().required(
														'Order Due Date is Required'
													),
													lineItemsString: Yup.array()
														.required(
															'Atleast one invoice sub detail is mandatory',
														)
														.of(
															Yup.object().shape({
																quantity: Yup.string()
																	.required('Value is Required')
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
												}
												)
											}
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
																		placeholder={strings.InvoiceNumber}
																		value={props.values.quotation_Number}
																		onBlur={props.handleBlur('quotation_Number')}
																		onChange={(option) => {
																			props.handleChange('quotation_Number')(
																				option,
																			);
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
																		styles={customStyles}
																		id="customerId"
																		name="customerId"
																		placeholder={strings.Select+strings.CustomerName}
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
																				this.setExchange( this.getCurrency(option.value) );
																				props.handleChange('customerId')(option);
																			} else {

																				props.handleChange('customerId')('');
																			}
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
																	//  this.props.history.push(`/admin/payroll/employee/create`,{goto:"Expense"})
																	this.props.history.push(`/admin/master/contact/create`,{gotoParentURL:"/admin/income/quotation/create"})
																	}

                                                            >
                                                                <i className="fas fa-plus mr-1" />
                                         {strings.AddACustomer}
									</Button></Col>
									<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="placeOfSupplyId">
																		<span className="text-danger">*</span>
																		{strings.PlaceofSupply}
																	</Label>
																	<Select
																		styles={customStyles}
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
																			this.state.placelist
																						}
																		className={
																			props.errors.placeOfSupplyId &&
																			props.touched.placeOfSupplyId
																				? 'is-invalid'
																				: ''
																		}
																		onChange={(option) =>
																			props.handleChange('placeOfSupplyId')(
																				option,
																			)
																		}
																	/>
																	{props.errors.placeOfSupplyId &&
																		props.touched.placeOfSupplyId && (
																			<div className="invalid-feedback">
																				{props.errors.placeOfSupplyId}
																			</div>
																		)}
																</FormGroup>
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
																		dateFormat="dd/MM/yyyy"
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
																	<Label htmlFor="due_date">
																	<span className="text-danger">* </span>
																	{strings.ExpirationDate}
																	</Label>
																	<DatePicker
																		id="date"
																		name="quotaionExpiration"
																		className={`form-control ${
																			props.errors.quotaionExpiration &&
																			props.touched.quotaionExpiration
																				? 'is-invalid'
																				: ''
																		}`}
																		placeholderText={strings.OrderDueDate}
																		selected={props.values.quotaionExpiration}
																		showMonthDropdown
																		showYearDropdown
																		dropdownMode="select"
																		dateFormat="dd/MM/yyyy"
																		
																		onChange={(value) => {
																			props.handleChange('quotaionExpiration')(value);
																		}}
																	/>
																	{props.errors.quotaionExpiration &&
																		props.touched.quotaionExpiration && (
																			<div className="invalid-feedback">
																				{props.errors.quotaionExpiration}
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
																	placeholder={strings.Select+strings.Currency}
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
														</Row>
													
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
																	<i className="fa fa-plus"></i>{' '}{strings.Addmore} 
																</Button>
																<Button
																	color="primary"
																	className= "btn-square mr-3"
																	onClick={(e, props) => {
																		this.openProductModal(props);
																		}}
																	
																>
																	<i className="fa fa-plus"></i>{' '}{strings.Addproduct} 
																</Button>
															</Col>

															<Col lg={3}>
																					<FormGroup>

																						<span className='mr-4'>Inclusive</span>
																						<Switch
            checked={this.state.checked}
			onChange={(checked) => {

				props.handleChange('checked')(checked);
				this.setState(
					{
						checked,
					},
					() => {
						this.updateAmount(data, props);
					},
				);

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
		  <span  className='ml-4'>Exclusive</span>

																					</FormGroup>
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
																		width="5%"
																		dataAlign="center"
																		dataFormat={(cell, rows) =>
																			this.renderActions(cell, rows, props)
																		}
																	></TableHeaderColumn>
																	<TableHeaderColumn
																	width="20%"
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
																			this.renderDescription(cell, rows, props)
																		}
																	>
																	{strings.DESCRIPTION}
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="quantity"
																		width="100"
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
																	<TableHeaderColumn
																	width="10%"
																		dataField="exciseTaxId"
																		dataFormat={(cell, rows) =>
																			this.renderExcise(cell, rows, props)
																		}
																	>
																	Excise
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
														<hr />
														{this.state.data.length > 0 ? (
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

																</Col>

																<Col lg={4}>
																	<div className="">
																	<div className="total-item p-2" style={{display:this.state.checked === true ? '':'none'}}>
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																					Total Excise
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">

																						{this.state.supplier_currency_symbol} &nbsp;
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
																						{initValue.total_net.toFixed(
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
																						{initValue.totalAmount.toFixed(
																									2,
																								)}
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
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
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
																			: strings.CreateandMore }
																	</Button>
																	<Button
																		type="button"
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
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
					getCurrentUser={(e) => this.getCurrentUser(e)}
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
					getCurrentProduct={(e) => this.getCurrentProduct(e)}
					createProduct={this.props.ProductActions.createAndSaveProduct}
					vat_list={this.props.vat_list}
					product_category_list={this.props.product_category_list}
					salesCategory={this.state.salesCategory}
					purchaseCategory={this.state.purchaseCategory}
				/>
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
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateQuotation);
