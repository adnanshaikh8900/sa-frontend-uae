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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as SupplierInvoiceDetailActions from './actions';
import * as SupplierInvoiceActions from '../../actions';
import * as PurchaseOrderDetailsAction from './actions';
import * as RequestForQuotationAction from '../../actions'
import * as ProductActions from '../../../product/actions';
import { SupplierModal } from '../../sections';
import { ProductModal } from '../../../customer_invoice/sections';
import { Loader, ConfirmDeleteModal,Currency } from 'components';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';
import API_ROOT_URL from '../../../../constants/config';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		project_list: state.request_for_quotation.project_list,
		contact_list: state.request_for_quotation.contact_list,
		currency_list: state.request_for_quotation.currency_list,
		vat_list: state.request_for_quotation.vat_list,
		product_list: state.customer_invoice.product_list,
		supplier_list: state.request_for_quotation.supplier_list,
		country_list: state.request_for_quotation.country_list,
		product_category_list: state.product.product_category_list,
		universal_currency_list: state.common.universal_currency_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
		rfq_list: state.purchase_order.rfq_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		supplierInvoiceActions: bindActionCreators(
			SupplierInvoiceActions,
			dispatch,
		),
		ProductActions: bindActionCreators(ProductActions, dispatch),
		supplierInvoiceDetailActions: bindActionCreators(
			SupplierInvoiceDetailActions,
			dispatch,
		),
		
		purchaseOrderDetailsAction : bindActionCreators(
			PurchaseOrderDetailsAction,
			dispatch,
		),
		requestForQuotationAction : bindActionCreators(
			RequestForQuotationAction,
			dispatch,
		),
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
class DetailPurchaseOrder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dialog: false,
			discountOptions: [
				{ value: 'FIXED', label: 'Fixed' },
				{ value: 'PERCENTAGE', label: 'Percentage' },
			],
			discount_option: '',
			data: [],
			initValue: {},
			contactType: 1,
			openSupplierModal: false,
			openProductModal: false,
			selectedContact: '',
			current_supplier_id: null,
			term: '',
			placeOfSupply: '',
			selectedType: '',
			discountPercentage: '',
			discountAmount: 0,
			fileName: '',
			purchaseCategory: [],
			basecurrency:[],
			supplier_currency: '',
			disabled1:false,
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
		this.regEx = /^[0-9\b]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
	}

	// renderActions  = (cell, row) => {
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

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		if (this.props.location.state && this.props.location.state.id) {
			this.props.purchaseOrderDetailsAction
				.getPOById(this.props.location.state.id)
				.then((res) => {
					if (res.status === 200) {
						this.getCompanyCurrency();
						this.props.requestForQuotationAction.getVatList();
						this.props.requestForQuotationAction.getSupplierList(
							this.state.contactType,
						);
						this.props.currencyConvertActions.getCurrencyConversionList();
						this.props.requestForQuotationAction.getCountryList();
						this.props.requestForQuotationAction.getProductList();
						this.purchaseCategory();
						this.setState(
							{
								current_po_id: this.props.location.state.id,
								initValue: {
									poApproveDate: res.data.poApproveDate
										? moment(res.data.poApproveDate).format('DD/MM/YYYY')
										: '',
										poReceiveDate: res.data.poReceiveDate
										? moment(res.data.poReceiveDate).format('DD/MM/YYYY')
										: '',
										supplierId: res.data.supplierId ? res.data.supplierId : '',
										poNumber: res.data.poNumber
										? res.data.poNumber
										: '',
									totalVatAmount: res.data.totalVatAmount
										? res.data.totalVatAmount
										: 0,
										totalAmount: res.data.totalAmount ? res.data.totalAmount : 0,
										total_net: 0,
									notes: res.data.notes ? res.data.notes : '',
									lineItemsString: res.data.poQuatationLineItemRequestModelList
										? res.data.poQuatationLineItemRequestModelList
										: [],
										supplierReferenceNumber: res.data.supplierReferenceNumber ? 
										res.data.supplierReferenceNumber : '',
										rfqNumber: res.data.rfqNumber ? res.data.rfqNumber : '',
								
								
								},
								
								data: res.data.poQuatationLineItemRequestModelList
									? res.data.poQuatationLineItemRequestModelList
									: [],
								selectedContact: res.data.supplierId ? res.data.supplierId : '',
							
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
						 
						this.getCurrency(res.data.supplierId)	
					}
				});
		} else {
			this.props.history.push('/admin/expense/purchase-order');
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
						() => {
						},
					);
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	calTotalNet = (data) => {
		let total_net = 0;
		data.map((obj) => {
			total_net = +(total_net + +obj.unitPrice * obj.quantity);
			return obj;
		});
		this.setState({
			initValue: Object.assign(this.state.initValue, { total_net }),
		});
	};
	openProductModal = (props) => {
		this.setState({ openProductModal: true });
	};
	closeProductModal = (res) => {
		this.setState({ openProductModal: false });
	};

	getCurrentProduct = () => {
		this.props.customerInvoiceActions.getProductList().then((res) => {
			this.setState(
				{
					data: [
						{
							id: 0,
							description: res.data[0].description,
							quantity: 1,
							unitPrice: res.data[0].unitPrice,
							vatCategoryId: res.data[0].vatCategoryId,
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
					maxLength="255"
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
					maxLength="10"
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
		return row.subTotal === 0 ? this.state.supplier_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.supplier_currency_symbol +" "+ row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
		// return row.subTotal ? row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : '';
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
				obj['unitPrice'] = parseInt(result.unitPrice);
				obj['vatCategoryId'] = parseInt(result.vatCategoryId);
				obj['description'] = result.description;
				idx = index;
			}
			return obj;
		});
		form.setFieldValue(
			`lineItemsString.${idx}.vatCategoryId`,
			parseInt(result.vatCategoryId),
			true,
		);
		form.setFieldValue(
			`lineItemsString.${idx}.unitPrice`,
			parseInt(result.unitPrice),
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
		const { vat_list } = this.props;
		let total_net = 0;
		let total = 0;
		let total_vat = 0;
		const { discountPercentage, discountAmount } = this.state;

		data.map((obj) => {
			const index =
				obj.vatCategoryId !== ''
					? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
					: '';
			const vat = index !== '' ? vat_list[`${index}`].vat : 0;
			// let val = (((+obj.unitPrice) * vat) / 100)
			if (props.values.discountType === 'PERCENTAGE') {
				var val =
					((+obj.unitPrice -
						+((obj.unitPrice * discountPercentage) / 100).toLocaleString(navigator.language, { minimumFractionDigits: 2 })) *
						vat *
						obj.quantity) /
					100;
			} else if (props.values.discountType === 'FIXED') {
				var val =
					(obj.unitPrice * obj.quantity - discountAmount / data.length) *
					(vat / 100);
			} else {
				var val = (+obj.unitPrice * vat * obj.quantity) / 100;
			}
			total_net = +(total_net + +obj.unitPrice * obj.quantity);
			total_vat = +(total_vat + val);
			obj.subTotal =
				obj.unitPrice && obj.vatCategoryId ? (+obj.unitPrice * obj.quantity)+total_vat : 0;
			total = total_vat + total_net;
			return obj;
		});
		const discount =
			props.values.discountType === 'PERCENTAGE'
				? +((total_net * discountPercentage) / 100).toLocaleString(navigator.language, { minimumFractionDigits: 2 })
				: discountAmount;
		this.setState(
			{
				data,
				initValue: {
					...this.state.initValue,
					...{
						total_net: discount ? total_net - discount : total_net,
						totalVatAmount: total_vat,
						discount: total_net > discount ? discount : 0,
						totalAmount: total_net > discount ? total - discount : total,
					},
				},
			},
			() => {
				if (props.values.discountType === 'PERCENTAGE') {
					this.formRef.current.setFieldValue('discount', discount);
				}
			},
		);
	};

	handleSubmit = (data) => {
		this.setState({ disabled: true });
		const { current_po_id, term } = this.state;
		const {
			poApproveDate,
			poReceiveDate,
			supplierId,
			poNumber,
			supplierReferenceNumber,
			notes,
			totalVatAmount,
			totalAmount,
			rfqNumber,
			currency,
		} = data;

		let formData = new FormData();
		formData.append('type', 4);
		formData.append('id', current_po_id);
		formData.append('poNumber', poNumber ? poNumber : '');
		formData.append(
			'poReceiveDate',
			typeof poReceiveDate === 'string'
				? moment(poReceiveDate, 'DD/MM/YYYY').toDate()
				: poReceiveDate,
		);
		formData.append(
			'poApproveDate',
			typeof poApproveDate === 'string'
				? moment(poApproveDate, 'DD/MM/YYYY').toDate()
				: poApproveDate,
		);
	
		formData.append('notes', notes ? notes : '');
		formData.append('lineItemsString', JSON.stringify(this.state.data));
		formData.append('totalVatAmount', this.state.initValue.totalVatAmount);
		formData.append('totalAmount', this.state.initValue.totalAmount);
		formData.append('supplierReferenceNumber', supplierReferenceNumber ? supplierReferenceNumber : '');
		formData.append('rfqNumber',rfqNumber ? rfqNumber : '');
		if (supplierId) {
			formData.append('supplierId', supplierId);
		}
		if (currency !== null && currency) {
			formData.append('currencyCode', this.state.supplier_currency);
		}
		this.props.purchaseOrderDetailsAction
			.updatePO(formData)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'Purchase Order Updated Successfully'
				);
				this.props.history.push('/admin/expense/purchase-order');
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Purchase Order Updated Unsuccessfully'
				);
			});
	};

	deletepo = () => {
		const message1 =
        <text>
        <b>Delete Request For Quotation?</b>
        </text>
        const message = 'This Purchase Order will be deleted permanently and cannot be recovered. ';
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={this.removePo}
					cancelHandler={this.removeDialog}
					message={message}
					message1={message1}
				/>
			),
		});
	};

	removePo = () => {
		this.setState({ disabled1: true });
		const { current_po_id } = this.state;
		this.props.purchaseOrderDetailsAction
			.deletePo(current_po_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Purchase Order Deleted Successfully'
					);
					this.props.history.push('/admin/expense/purchase-order');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Purchase Order Deleted Unsuccessfully'
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	openSupplierModal = (e) => {
		e.preventDefault();
		this.setState({ openSupplierModal: true });
	};
	closeProductModal = (res) => {
		this.setState({ openProductModal: false });
	};
	setDate = (props, value) => {
		const { term } = this.state;
		const val = term.split('_');
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

	getCurrentProduct = () => {
		this.props.customerInvoiceActions.getProductList().then((res) => {
			this.setState(
				{
					data: [
						{
							id: 0,
							description: res.data[0].description,
							quantity: 1,
							unitPrice: res.data[0].unitPrice,
							vatCategoryId: res.data[0].vatCategoryId,
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

	getCurrentUser = (data) => {
		let option;
		if (data && (data.label || data.value)) {
			option = data;
		} else {
			option = {
				label: `${data.fullName}`,
				value: data.id,
			};
		}
		this.formRef.current.setFieldValue('supplierId', option.value, true);
	};

	closeSupplierModal = (res) => {
		if (res) {
			this.props.requestForQuotationAction.getSupplierList(this.state.contactType);
		}
		this.setState({ openSupplierModal: false });
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

	render() {
		strings.setLanguage(this.state.language);
		const { data, discountOptions, initValue, loading, dialog } = this.state;

		const { project_list, currency_list,currency_convert_list, supplier_list,universal_currency_list,rfq_list } = this.props;

		let tmpSupplier_list = []

		supplier_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpSupplier_list.push(obj)
		})

		return (
			<div className="detail-supplier-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-address-book" />
												<span className="ml-2">{strings.UpdatePurchaseOrder}</span>
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
													validationSchema={Yup.object().shape(
														{
														// 	po_number: Yup.string().required(
														// 	'Invoice Number is Required',
														// ),
														// supplierId: Yup.string().required(
														// 	'Supplier is Required',
														// ),
														// rfqNumber: Yup.string().required(
														// 	'Rfq Number is Required',
														// ),
														// placeOfSupplyId: Yup.string().required('Place of supply is Required'),
														
														poApproveDate: Yup.string().required(
															'Order Date is Required',
														),
														poReceiveDate: Yup.string().required(
															'Order Due Date is Required'
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
																	<Label htmlFor="rfqNumber">
																		 {strings.RFQNumber}
																	</Label>
																	<Input
																			type="text"
																			id="rfqNumber"
																			name="rfqNumber"
																			placeholder=""
																			disabled
																			value={props.values.rfqNumber}
																			onChange={(value) => {
																				props.handleChange('rfqNumber')(
																					value,
																				);
																			}}
																			className={
																				props.errors.rfqNumber &&
																				props.touched.rfqNumber
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.rfqNumber &&
																			props.touched.rfqNumber && (
																				<div className="invalid-feedback">
																					{props.errors.rfqNumber}
																				</div>
																			)}
																
																</FormGroup>
															</Col>
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="poNumber">
																			<span className="text-danger">* </span>
																			 {strings.PONumber}
																		</Label>
																		<Input
																			type="text"
																			id="poNumber"
																			name="poNumber"
																			placeholder=""
																			disabled
																			value={props.values.poNumber}
																			onChange={(value) => {
																				props.handleChange('poNumber')(
																					value,
																				);
																			}}
																			className={
																				props.errors.poNumber &&
																				props.touched.poNumber
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.poNumber &&
																			props.touched.poNumber && (
																				<div className="invalid-feedback">
																					{props.errors.poNumber}
																				</div>
																			)}
																	</FormGroup>
																</Col>
																
															</Row>
															<Row>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="supplierId">
																			<span className="text-danger">* </span>
																			{strings.SupplierName}
																		</Label>
																		<Select
																			isDisabled={true}
																			styles={customStyles}
																			id="supplierId"
																			name="supplierId"
																			onBlur={props.handlerBlur}
																			options={
																				tmpSupplier_list
																					? selectOptionsFactory.renderOptions(
																							'label',
																							'value',
																							tmpSupplier_list,
																							'Supplier Name',
																					  )
																					: []
																			}
																			value={
																				tmpSupplier_list &&
																				tmpSupplier_list.find(
																					(option) =>
																						option.value ===
																						+props.values.supplierId,
																				)
																			}
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange('supplierId')(
																						option.value,
																					);
																				} else {
																					props.handleChange('supplierId')('');
																				}
																			}}
																			className={
																				props.errors.supplierId &&
																				props.touched.supplierId
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.supplierId &&
																			props.touched.supplierId && (
																				<div className="invalid-feedback">
																					{props.errors.supplierId}
																				</div>
																			)}
																	</FormGroup>
																</Col>
																<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="supplierReferenceNumber">
																		 {strings.SupplierReferenceNumber}
																	</Label>
																	<Input
																		type="text"
																		disabled={true}
																		id="supplierReferenceNumber"
																		name="supplierReferenceNumber"
																		placeholder={strings.SupplierReferenceNumber}
																		value={props.values.supplierReferenceNumber}
																		onBlur={props.handleBlur('supplierReferenceNumber')}
																		onChange={(value) => {
																			props.handleChange('supplierReferenceNumber')(
																				value,
																			);
																		}}
																		className={
																			props.errors.supplierReferenceNumber &&
																			props.touched.supplierReferenceNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.supplierReferenceNumber &&
																		props.touched.supplierReferenceNumber && (
																			<div className="invalid-feedback">
																				{props.errors.supplierReferenceNumber}
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
																			if (option && option.value) {
																				this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																				
																				props.handleChange('supplierId')(option);
																			} else {

																				props.handleChange('supplierId')('');
																			}
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
															<hr />
															<Row>
																
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="date">
																			<span className="text-danger">* </span>
																			 {strings.PODate}
																		</Label>
																		<DatePicker
																			id="poApproveDate"
																			name="poApproveDate"
																			placeholderText={strings.InvoiceDate}
																			showMonthDropdown
																			showYearDropdown
																			dateFormat="dd/MM/yyyy"
																			dropdownMode="select"
																			value={props.values.poApproveDate}
																			onChange={(value) => {
																				props.handleChange('poApproveDate')(
																					moment(value).format('DD/MM/YYYY'),
																				);
																				this.setDate(props, value);
																			}}
																			className={`form-control ${
																				props.errors.poApproveDate &&
																				props.touched.poApproveDate
																					? 'is-invalid'
																					: ''
																			}`}
																		/>
																		{props.errors.poApproveDate &&
																			props.touched.poApproveDate && (
																				<div className="invalid-feedback">
																					{props.errors.poApproveDate}
																				</div>
																			)}
																	</FormGroup>
																</Col>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="due_date">
																		<span className="text-danger">* </span>
																		 {strings.PODueDate}
																		</Label>
																		<div>
																			<DatePicker
																				id="poReceiveDate"
																				name="poReceiveDate"
																				placeholderText={strings.DueDate}
																				value={props.values.poReceiveDate}
																				showMonthDropdown
																				showYearDropdown
																				dateFormat="dd/MM/yyyy"
																				dropdownMode="select"
																				onChange={(value) => {
																					props.handleChange('poReceiveDate')(
																						moment(value).format('DD/MM/YYYY'),
																					);
																					this.setDate(props, value);
																				}}
																				className={`form-control ${
																					props.errors.poReceiveDate &&
																					props.touched.poReceiveDate
																						? 'is-invalid'
																						: ''
																				}`}
																			/>
																			{props.errors.poReceiveDate &&
																				props.touched.poReceiveDate && (
																					<div className="invalid-feedback">
																						{props.errors.poReceiveDate}
																					</div>
																				)}
																		</div>
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
																		<i className="fa fa-plus"></i>  {strings.Addmore}
																	</Button>
																</Col>
															</Row>
															<Row>
																<Col lg={12}>
																	{props.errors.lineItemsString &&
																		props.touched.lineItemsString &&
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
																			width="12%"
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
																		{/* <TableHeaderColumn
																			dataField="account"
																			width="15%"
																			dataFormat={(cell, rows) =>
																				this.renderAccount(cell, rows, props)
																			}
																		>
																			Account
																		</TableHeaderColumn> */}
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
															{data.length > 0 && (
																<Row>
																		<Col lg={8}>
																	<FormGroup className="py-2">
																		<Label htmlFor="notes"> {strings.Notes}</Label>
																		<Input
																			type="textarea"
																			maxLength="255"
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
																							{this.state.supplier_currency_symbol} &nbsp;
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
																						value=	{initValue.invoiceVATAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						currencySymbol={
																						universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.supplier_currency_symbol} &nbsp;
																							{initValue.totalVatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
																						value=	{initValue.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						currencySymbol={
																						universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.supplier_currency_symbol} &nbsp;
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
																			onClick={this.deletepo}
																		>
																			<i className="fa fa-trash"></i> {this.state.disabled1
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
																			<i className="fa fa-dot-circle-o"></i>{' '}
																			{this.state.disabled
																			? 'Updating...'
																			: strings.Update }
																		</Button>
																		<Button
																			color="secondary"
																			className="btn-square"
																			onClick={() => {
																				this.props.history.push(
																					'/admin/expense/purchase-order',
																				);
																			}}
																		>
																			<i className="fa fa-ban"></i> {this.state.disabled1
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
					getCurrentUser={(e) => this.getCurrentUser(e)}
					createSupplier={this.props.requestForQuotationAction.createSupplier}
					currency_list={this.props.currency_list}
					country_list={this.props.country_list}
					getStateList={this.props.requestForQuotationAction.getStateList}
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
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DetailPurchaseOrder);
