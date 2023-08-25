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
import * as DebitNoteCreateActions from './actions';
import * as DebitNoteActions from '../../actions';
import * as ProductActions from '../../../product/actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import Switch from "react-switch";
import { Checkbox } from '@material-ui/core';

const mapStateToProps = (state) => {
	console.log(state)
	return {
		currency_list: state.debit_notes.currency_list,
		invoice_list: state.debit_notes.invoice_list,
		tax_treatment_list: state.common.tax_treatment_list,
		vat_list: state.debit_notes.vat_list,
		customer_list: state.debit_notes.customer_list,
		excise_list: state.debit_notes.excise_list,
		country_list: state.debit_notes.country_list,
		product_category_list: state.product.product_category_list,
		universal_currency_list: state.common.universal_currency_list,
		currency_convert_list: state.currencyConvert.currency_convert_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		debitNoteActions: bindActionCreators(DebitNoteActions, dispatch,),
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
		debitNoteCreateActions: bindActionCreators(DebitNoteCreateActions, dispatch,),
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

const invoiceimage = require('assets/images/invoice/invoice.png');

let strings = new LocalizedStrings(data);
class CreateDebitNote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			customer_currency_symbol: '',
			loading: false,
			disabled: false,
			discountOptions: [
				{ value: 'FIXED', label: '₹' },
				{ value: 'PERCENTAGE', label: '%' },
			],
			disabledDate: true,
			data: [
				{
					id: 0,
					description: '',
					quantity: 1,
					unitPrice: '',
					vatCategoryId: '',
					exciseTaxId: '',
					exciseAmount: '',
					subTotal: 0,
					vatAmount: 0,
					productId: '',
					isExciseTaxExclusive: '',
					discountType: 'FIXED',
					discount: 0,
					unitType: '',
					unitTypeId: ''
				},
			],
			idCount: 0,
			initValue: {
				invoiceNumber: '',
				receiptAttachmentDescription: '',
				referenceNumber: '',
				contact_po_number: '',
				currency: '',
				// invoiceDueDate: '',
				creditNoteDate: new Date(),
				contactId: '',
				reason: "",
				placeOfSupplyId: '',
				project: '',
				term: '',
				exchangeRate: 1,
				lineItemsString: [
					{
						id: 0,
						description: '',
						quantity: 1,
						exciseAmount: 0,
						discount: 0,
						unitPrice: '',
						vatCategoryId: '',
						productId: '',
						subTotal: 0,
					},
				],
				debitNoteNumber: '',
				total_net: 0,
				invoiceVATAmount: 0,
				totalVatAmount: 0,
				totalAmount: 0,
				notes: '',
				email: '',
				totalDiscount: 0,
				discountPercentage: '',
				discountType: 'FIXED',
				creditAmount: 0,
				total_excise: 0,
			},
			total_excise: 0,
			currentData: {},
			contactType: 2,
			selectedContact: '',
			createMore: false,
			fileName: '',
			term: '',
			selectedType: { value: 'FIXED', label: '₹' },
			discountPercentage: '',
			discountAmount: 0,
			debitNoteExist: false,
			prefix: '',
			purchaseCategory: [],
			salesCategory: [],
			basecurrency: [],
			inventoryList: [],
			remainingInvoiceAmount: '',
			invoiceSelected: false,
			isDNWIWithoutProduct: false,
			quantityExceeded: '',
			isCreatedWithoutInvoice: false,
			shippingCharges: 0,
			invoiveSelected: false,
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
			{ label: 'Net 30 Days', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
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
		this.regEx = /^[0-9\b]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regDecimalP = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
	}

	renderProductName = (cell, row) => {
		return (
			<div className="d-flex align-items-center">
				<Input type="hidden" className="mr-1"></Input>
			</div>
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

									this.setState({ currentRow: row })
								}

							}}
							placeholder={strings.Quantity}
							className={`form-control  ${props.errors.lineItemsString &&
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
						disabled
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
						className={`form-control ${props.errors.lineItemsString &&
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
		return row.subTotal === 0 ? this.state.customer_currency_symbol + " " + row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.customer_currency_symbol + " " + row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 });

	}

	renderVatAmount = (cell, row, extraData) => {
		return row.vatAmount === 0 ? this.state.customer_currency_symbol + " " + row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : this.state.customer_currency_symbol + " " + row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 });

	}

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
								disabled
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

										isDisabled={true}
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

	setDate = (props, value) => {
		const { term } = this.state;
		const val = term ? term.value.split('_') : '';
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
		const values = value
			? value
			: moment(props.values.creditNoteDate, 'DD-MM-YYYY').toDate();

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
		this.props.debitNoteCreateActions
			.checkValidation(data)
			.then((response) => {
				if (response.data === 'Invoice Number Already Exists') {
					this.setState({ debitNoteExist: true, });
				} else {
					this.setState({ debitNoteExist: false, });
				}
			});
	};

	componentDidMount = () => {
		this.getInitialData();
	};

	getInitialData = () => {
		this.getInvoiceNo();
		this.props.commonActions.getTaxTreatmentList();
		this.props.debitNoteActions.getInvoiceListForDropdown();
		this.props.debitNoteActions.getCustomerList(this.state.contactType);
		this.props.debitNoteActions.getCountryList();
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
		// this.props.debitNoteActions.getInvoicePrefix().then((response) => {
		// 	this.setState({
		// 		prefixData: response.data

		// 	});
		// });
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
							() => { },
						);
					}
				});
		} catch (err) {
			console.log(err);
		}
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
						isDisabled={true}
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
	addRow = () => {
		const data = [...this.state.data];
		this.setState(
			{
				data: data.concat({
					id: this.state.idCount + 1,
					description: '',
					quantity: 1,
					unitPrice: '',
					productId: '',
					subTotal: 0,
					discountType: 'FIXED',
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
	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.state;
		let data = this.state.data;
		const result = product_list.find((item) => item.id === parseInt(e));
		let idx;
		data.map((obj, index) => {
			if (obj.id === row.id) {
				console.log(result);
				obj['unitPrice'] = result.unitPrice;
				obj['description'] = result.description;
				obj['discountType'] = result.discountType;
				obj['hsnOrSac'] = result.hsnOrSac;
				obj['taxPercentage'] = result.interStateTaxSlab ? result.interStateTaxSlab.taxPercentage :
					result.intraStateTaxSlab ? result.intraStateTaxSlab.taxPercentage : "0";
				obj['taxSlab'] = result.interStateTaxSlab ? result.interStateTaxSlab.interStateTaxSlab :
					result.intraStateTaxSlab ? result.intraStateTaxSlab.intraStateTaxSlab : "N/A";
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
		const { product_list } = this.state;
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
							isDisabled
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
							placeholder={strings.Select + strings.Product}
							onChange={(e) => {
								if (e && e.label !== 'Select Product') {
									this.selectItem(e.value, row, 'productId', form, field, props,);
									this.prductValue(e.value, row, 'productId', form, field, props,);
								} else {
									form.setFieldValue(`lineItemsString.${idx}.productId`, e.value, true,);
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
									: ''
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
						<div className='mt-1'>
							<Input
								disabled
								type="text"
								maxLength="250"
								value={row['description'] ? row['description'] : ''}
								onChange={(e) => {
									this.selectItem(e.target.value, row, 'description', form, field);
								}}
								placeholder={strings.Description}
								className={`form-control ${props.errors.lineItemsString &&
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
						</div>
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


	updateAmount = (data, props) => {

		//Initialization

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
						totalDiscount: discount,
						CESS_totalAmount: total_cess,
						CGST_totalAmount: total_cgst,
						SGST_totalAmount: total_sgst,
						IGST_totalAmount: total_igst,
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

		this.setState({ disabled: true });
		const {
			receiptAttachmentDescription,
			referenceNumber,
			contact_po_number,
			currency,
			invoiceNumber,
			creditNoteDate,
			contactId,
			debitNoteNumber,
			totalDiscount,
			discountType,
			discountPercentage,
			notes,
			email,
			creditAmount,
			reason,
			totalTaxAmount,
			exchangeRate,
			placeOfSupplyId
		} = data;
		const { term } = this.state;
		const formData = new FormData();

		formData.append('isDNWIWithoutProduct', this.state.isDNWIWithoutProduct);

		if (reason)
			formData.append('reason', reason.label ? reason.label : reason);

		formData.append(
			'creditNoteNumber',
			debitNoteNumber !== null ? this.state.prefix + debitNoteNumber : '',
		);
		formData.append(
			'email',
			email !== null ? email : '',
		);
		formData.append(
			'creditNoteDate',
			creditNoteDate
				?
				moment(creditNoteDate, 'DD-MM-YYYY')
					.toDate()
				: null,
		);
		formData.append(
			'referenceNumber',
			referenceNumber !== null ? referenceNumber : '',
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
		formData.append('email', email !== null ? email : '');
		formData.append('type', 11);
		if (this.state.isDNWIWithoutProduct === true)
			formData.append('totalAmount', creditAmount);
		formData.append('exchangeRate', exchangeRate)
		if (invoiceNumber && invoiceNumber.value) {
			formData.append('invoiceId', invoiceNumber.value);
			formData.append('cnCreatedOnPaidInvoice', '1');
		}
		debugger
		if (this.state.isDNWIWithoutProduct === false) {
			if (this.state.igstEnabled == true)
				formData.append('totalIgst', this.state.initValue.IGST_totalAmount);
			else {
				formData.append('totalCgst', this.state.initValue.CGST_totalAmount);
				formData.append('totalSgst', this.state.initValue.SGST_totalAmount);
			}
			formData.append('totalCess', this.state.initValue.CESS_totalAmount);
			formData.append('totalTaxAmount', this.state.initValue.totalTaxAmount)

			formData.append('subTotal', this.state.initValue.total_net);
			formData.append('discount', this.state.initValue.totalDiscount);
			formData.append('shippingCharges', this.state.shippingCharges);
			formData.append('lineItemsString', JSON.stringify(this.state.data));
			formData.append('totalAmount', this.state.initValue.totalAmount + this.state.shippingCharges);
		}
		if (contactId && contactId.value) {
			formData.append('contactId', contactId.value);
		}
		if (currency !== null && currency) {
			formData.append('currencyCode', this.state.customer_currency);
		}
		if (this.uploadFile && this.uploadFile.files && this.uploadFile.files[0]) {
			formData.append('attachmentFile', this.uploadFile.files[0]);
		}

		formData.append('placeOfSupplyId', this.state.initValue.placeOfSupplyId)
		this.props.debitNoteCreateActions
			.createDebitNote(formData)
			.then((res) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'success',
					res.data ? res.data.message : 'New Tax Credit Note Created Successfully.'
				);
				if (this.state.createMore) {
					this.setState(
						{
							createMore: false,
							selectedContact: '',
							term: '',
							exchangeRate: '',
							data: [
								{
									id: 0,
									description: '',
									quantity: 1,
									unitPrice: '',
									subTotal: 0,
									productId: '',
								},
							],
							initValue: {
								...this.state.initValue,
								...{
									total_net: 0,
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
					this.props.history.push('/admin/expense/debit-notes');
				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'New Tax Credit Note Created Unsuccessfully.',
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

		let result = this.props.currency_convert_list.filter((obj) => {
			return obj.currencyCode === data.currencyCode;
		});

		this.formRef.current.setFieldValue('currency', result[0].currencyCode, true);
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);

		this.setState({
			customer_currency: data.currencyCode,
			customer_currency_des: result[0].currencyName,
		})
		this.formRef.current.setFieldValue('contactId', option, true);
	};

	getCurrentNumber = (data) => {
		this.getInvoiceNo();
	};

	getCurrentProduct = () => {
		this.props.debitNoteActions.getProductList().then((res) => {
			this.setState(
				{
					data: [
						{
							id: 0,
							discount: 0,
							description: res.data[0].description,
							quantity: 1,
							unitPrice: res.data[0].unitPrice,
							subTotal: res.data[0].unitPrice,
							productId: res.data[0].id,
							discountType: res.data[0].discountType,
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
				1,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.exciseTaxId`,
				1,
				true,
			);
		});
	};
	getInvoiceNo = () => {
		this.props.debitNoteCreateActions.getInvoiceNo().then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
						...this.state.initValue,
						...{ debitNoteNumber: res.data },
					},
				});
				this.formRef.current.setFieldValue('debitNoteNumber', res.data, true, this.validationCheck(res.data));
			}
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
	getTaxTreatment = (value) => {
		debugger
		const { tax_treatment_list } = this.props
		const taxtreatment = tax_treatment_list ? tax_treatment_list.find((option) => option.name === value) : '';
		if (taxtreatment)
			this.formRef.current.setFieldValue('taxTreatmentId', { 'label': taxtreatment.name, 'value': taxtreatment.id }, true);
		else
			this.formRef.current.setFieldValue('taxTreatmentId', value, true);
	}
	getInvoiceDetails = (value) => {
		if (value) {
			this.props.debitNoteActions
				.getInvoiceById(value).then((response) => {
					if (response.status = 200) {
						const custmerName = {
							label: response.data.organisationName === '' ? response.data.name : response.data.organisationName,
							value: response.data.contactId,
						}
						this.setState(
							{
								option: custmerName,
								data: response.data.invoiceLineItems ? response.data.invoiceLineItems : [],
								totalAmount: response.data.totalAmount,
								customer_currency: response.data.currencyCode,
								remainingInvoiceAmount: response.data.remainingInvoiceAmount,
								shippingCharges: response.data.shippingCharges ? response.data.shippingCharges : 0,
								initValue: {
									...this.state.initValue,
									...{
										lineItemsString: response.data.invoiceLineItems ? response.data.invoiceLineItems : [],
										totalAmount: response.data.totalAmount,
										totalDiscount: response.data.discount,
										placeOfSupplyId: response.data.placeOfSupplyId,
									},
								},

							}, () => {
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
						this.formRef.current.setFieldValue('contactId', custmerName, true);
						this.formRef.current.setFieldValue('remainingInvoiceAmount', this.state.remainingInvoiceAmount, true);
						this.formRef.current.setFieldValue('currencyCode', this.state.customer_currency, true);
						this.getCurrency(custmerName.value)
						this.getTaxTreatment(response.data.taxTreatment)
					}
				});
		}
	}


	render() {
		strings.setLanguage(this.state.language);
		const { data, discountOptions, initValue, debitNoteExist, prefix } = this.state;
		const {
			customer_list,
			invoice_list,
			universal_currency_list,
			currency_convert_list,
			vat_list,
			tax_treatment_list,
		} = this.props;
		let tmpCustomer_list = []
		customer_list.map(item => {
			let obj = { label: item.label.contactName, value: item.value }
			tmpCustomer_list.push(obj)
		})

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
												<img
													alt="invoiceimage"
													src={invoiceimage}
													style={{ width: '40px' }}
												/>
												<span className="ml-2">{strings.CreateDebitNote}</span>
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
												validate={(values) => {
													let errors = {};

													if (debitNoteExist === true) {
														errors.debitNoteNumber = 'Tax Credit Note Number cannot be same';
													}

													if (!this.state.isCreatedWithoutInvoice && !values.invoiceNumber) {
														errors.invoiceNumber = 'Invoice Number is Required';
													}

													if (this.state.isDNWIWithoutProduct == true && this.state.invoiceSelected == true && !values.creditAmount)
														errors.creditAmount = 'Credit Amount is Required';

													//credit amount check
													// if(this.state.invoiceSelected && this.state.initValue.totalAmount>this.state.remainingInvoiceAmount)
													// {
													// 	errors.remainingInvoiceAmount =	'Invoice Total Amount Cannot be greater than  Remaining Invoice Amount';
													// }	
													// if(this.state.remainingInvoiceAmount && values.creditAmount<this.state.remainingInvoiceAmount)		
													// {
													// 	errors.creditAmount = 'Credit Amount Cannot be less than Remaining Invoice Amount';
													// }														
													return errors;
												}}
												validationSchema={Yup.object().shape({

													debitNoteNumber: Yup.string().required(
														'Tax Credit Note Number is Required',
													),
													contactId: Yup.string().required(
														'Customer Name is Required',
													),
													// reason:Yup.string().required("Reason is Required"),

													creditNoteDate: Yup.string().required(
														'Tax Credit Note Date is Required',
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

														<Row >
															{this.state.invoiveSelected && <Col lg={4}>
																<Checkbox
																	checked={this.state.isDNWIWithoutProduct}
																	onChange={(check) => {
																		this.setState({ isDNWIWithoutProduct: !this.state.isDNWIWithoutProduct })
																	}}
																/>	{strings.CreateDebitNoteWithoutProduct}
															</Col>}
															{!this.state.invoiveSelected && <Col lg={4}>
																<Checkbox
																	checked={this.state.isCreatedWithoutInvoice}
																	onChange={(check) => {
																		this.setState({ isCreatedWithoutInvoice: !this.state.isCreatedWithoutInvoice })
																		this.setState({ isDNWIWithoutProduct: !this.state.isDNWIWithoutProduct })
																	}}
																/>	{strings.CreateDebitNoteWithoutInvoice}
															</Col>}
														</Row>
														<hr />
														<Row>
															{!this.state.isCreatedWithoutInvoice && (<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="invoiceNumber"><span className="text-danger">* </span>
																		{strings.InvoiceNumber}
																	</Label>
																	<Select
																		//isDisabled={lockInvoiceDetail}
																		id="invoiceNumber"
																		name="invoiceNumber"
																		placeholder={strings.Select + strings.InvoiceNumber}
																		options={
																			invoice_list ? selectOptionsFactory.renderOptions(
																				'label',
																				'value',
																				invoice_list,
																				'Invoice Number',
																			) : []
																		}
																		value={props.values.invoiceNumber?.value ? props.values.invoiceNumber : invoice_list && selectOptionsFactory.renderOptions(
																			'label',
																			'value',
																			invoice_list,
																			'Invoice Number',).find(obj => obj.value === props.values.invoiceNumber)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				this.getInvoiceDetails(option.value)
																				props.handleChange('invoiceNumber')(option);
																				this.setState({ invoiceSelected: true })
																			} else {
																				this.setState({ invoiceSelected: false })
																				props.handleChange('invoiceNumber')('');
																				this.setState({ invoiceSelected: false })
																			}
																		}}
																		className={
																			props.errors.invoiceNumber &&
																				props.touched.invoiceNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.invoiceNumber &&
																		props.touched.invoiceNumber && (
																			<div className="invalid-feedback">
																				{props.errors.invoiceNumber}
																			</div>
																		)}
																</FormGroup>
															</Col>)}
														</Row>
														<Row>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="debitNoteNumber">
																		<span className="text-danger">* </span>
																		{strings.DebitNoteNumber}
																	</Label>
																	<Input
																		maxLength="50"
																		type="text"
																		id="debitNoteNumber"
																		name="debitNoteNumber"
																		placeholder={strings.DebitNoteNumber}
																		value={props.values.debitNoteNumber}
																		onBlur={props.handleBlur('debitNoteNumber')}
																		onChange={(option) => {
																			this.setState({ debitNoteExist: false }, () => {
																				props.handleChange('debitNoteNumber')(option,);
																				this.validationCheck(option.target.value);
																			})
																		}}
																		className={
																			props.errors.debitNoteNumber &&
																				props.touched.debitNoteNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.debitNoteNumber &&
																		props.touched.debitNoteNumber && (
																			<div className="invalid-feedback">
																				{props.errors.debitNoteNumber}
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
																		id="contactId"
																		name="contactId"
																		placeholder={strings.Select + strings.CustomerName}
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
																		value={props.values.contactId}

																		isDisabled={this.state.invoiceSelected}
																		onChange={(option) => {
																			if (option && option.value) {
																				this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																				this.formRef.current.setFieldValue('taxTreatmentId', this.getTaxTreatment(option.value), true);
																				// this.setExchange( this.getCurrency(option.value) );
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
															</Col>

															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="taxTreatmentId">
																		{strings.TaxTreatment}
																	</Label>
																	<Select
																		options={
																			tax_treatment_list
																				? selectOptionsFactory.renderOptions(
																					'name',
																					'id',
																					tax_treatment_list,
																					'VAT',
																				)
																				: []
																		}
																		isDisabled={true}
																		id="taxTreatmentId"
																		name="taxTreatmentId"
																		placeholder={strings.Select + strings.TaxTreatment}
																		value={props.values.taxTreatmentId?.value ? props.values.taxTreatmentId :
																			tax_treatment_list &&
																			selectOptionsFactory
																				.renderOptions(
																					'name',
																					'id',
																					tax_treatment_list,
																					'VAT',
																				)
																				.find(
																					(option) =>
																						option.label === props.values.taxTreatmentId,
																				)
																		}
																		onChange={(option) => {
																			props.handleChange('taxTreatmentId')(
																				option,
																			);
																		}}
																		className={
																			props.errors.taxTreatmentId &&
																				props.touched.taxTreatmentId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.taxTreatmentId &&
																		props.touched.taxTreatmentId && (
																			<div className="invalid-feedback">
																				{props.errors.taxTreatmentId}
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
																		id="creditNoteDate"
																		name="creditNoteDate"
																		placeholderText={strings.CreditNoteDate}
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd-MM-yyyy"
																		dropdownMode="select"
																		value={props.values.creditNoteDate}
																		selected={props.values.creditNoteDate}
																		onChange={(value) => {
																			props.handleChange('creditNoteDate')(value);
																			this.setDate(props, value);
																		}}
																		className={`form-control ${props.errors.creditNoteDate &&
																			props.touched.creditNoteDate
																			? 'is-invalid'
																			: ''
																			}`}
																	/>
																	{props.errors.creditNoteDate &&
																		props.touched.creditNoteDate && (
																			<div className="invalid-feedback">
																				{props.errors.creditNoteDate.includes("nullable()") ? "Tax Credit Note Date is Required" : props.errors.creditNoteDate}
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
																		styles={customStyles}
																		placeholder={strings.Select + strings.Currency}
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
																						+this.state.customer_currency,
																				)
																		}
																		className={
																			props.errors.currency &&
																				props.touched.currency
																				? 'is-invalid'
																				: ''
																		}
																		onChange={(option) => {
																			props.handleChange('currency')(option);
																			// this.setExchange(option.value);
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

															{(this.state.isDNWIWithoutProduct === false || this.state.invoiceSelected == true) && (<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="remainingInvoiceAmount">

																		Remaining Invoice Amount
																	</Label>
																	<Input
																		type="text"
																		id="remainingInvoiceAmount"
																		name="remainingInvoiceAmount"
																		placeholder='Remaining invoice Amount'
																		disabled={true}
																		value={this.state.remainingInvoiceAmount}
																	/>
																	{props.errors.remainingInvoiceAmount &&
																		(
																			<div className="text-danger">
																				{props.errors.remainingInvoiceAmount}
																			</div>
																		)}
																</FormGroup>
															</Col>)}

															{this.state.isDNWIWithoutProduct === true && (
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="creditAmount"><span className="text-danger">* </span>
																			Debit  Amount
																		</Label>
																		<Input
																			type="text"
																			id="creditAmount"
																			name="creditAmount"
																			placeholder={strings.Enter + " Credit Amount"}
																			value={this.state.creditAmount}
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



														{this.state.isDNWIWithoutProduct === false && (
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
																			width="20%"
																			dataField="product"
																			dataFormat={(cell, rows) =>
																				this.renderProduct(cell, rows, props)
																			}
																		>
																			{strings.PRODUCT}
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
																		{initValue.totalDiscount != 0 &&
																			<TableHeaderColumn
																				dataField="discount"
																				dataFormat={(cell, rows) =>
																					this.renderDiscount(cell, rows, props)
																				}
																			>
																				Discount Type
																			</TableHeaderColumn>
																		}
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
															</Row>)}
														{this.state.data.length > 0 ? (
															<Row>
																<Col lg={7}>
																	<Col lg={6}>
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
																		<FormGroup className="mb-3">
																			<Label htmlFor="referenceNumber">
																				{strings.ReferenceNumber}
																			</Label>
																			<Input
																				type="text"
																				maxLength="100"
																				id="referenceNumber"
																				name="referenceNumber"
																				value={props.values.referenceNumber}
																				placeholder={strings.ReceiptNumber}
																				onChange={(value) => {
																					props.handleChange('referenceNumber')(value);

																				}}
																				className={props.errors.referenceNumber && props.touched.referenceNumber ? "is-invalid" : " "}
																			/>
																			{props.errors.referenceNumber && props.touched.referenceNumber && (
																				<div className="invalid-feedback">{props.errors.referenceNumber}</div>
																			)}
																		</FormGroup>
																	</Col>
																</Col>
																{this.state.isDNWIWithoutProduct === false && (<Col lg={5}>
																	<div className="">
																		{initValue.total_excise == 0 ? null : (
																			<div className="total-item p-2" >
																				<Row>
																					<Col lg={6}>
																						<h5 className="mb-0 text-right">
																							{strings.TotalExcise}
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
																		)}
																		{initValue.totalDiscount == 0 ? null : (
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
																							{initValue.totalDiscount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																						</label>
																					</Col>
																				</Row>
																			</div>
																		)}

																		<div className="total-item p-2">
																			<Row>
																				<Col lg={6}>
																					<h5 className="mb-0 text-right">
																						{strings.TotalNet}
																					</h5>
																				</Col>
																				<Col lg={6} className="text-right">
																					<label className="mb-0">
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
																						{this.state.customer_currency_symbol} &nbsp;
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
																						{this.state.customer_currency_symbol} &nbsp;
																						{initValue.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
																					</label>
																				</Col>
																			</Row>
																		</div>
																	</div>
																</Col>)}
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
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
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
																		<i className="fa fa-repeat"></i>{' '}
																		{this.state.disabled
																			? 'Creating...'
																			: strings.CreateandMore}
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
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
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
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateDebitNote);
