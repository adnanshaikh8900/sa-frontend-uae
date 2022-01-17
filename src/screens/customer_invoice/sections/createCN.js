import React from 'react';
import { connect } from 'react-redux';

import {
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	CardHeader,
	ModalBody,
	ModalFooter,
	UncontrolledTooltip,
} from 'reactstrap';
import { Formik, Field } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { selectOptionsFactory } from 'utils';
import DatePicker from 'react-datepicker';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import * as RequestForQuotationDetailsAction from '../screens/detail/actions';
import { bindActionCreators } from 'redux';
import * as RequestForQuotationAction from '../screens/detail/actions';
import { CommonActions } from 'services/global';
import * as CurrencyConvertActions from '../../currencyConvert/actions';
import { toast } from 'react-toastify';
import {data}  from '../../Language/index'
import LocalizedStrings from 'react-localization';
import Switch from "react-switch";


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
		rfqReceiveDate: state.rfqReceiveDate,
		excise_list: state.customer_invoice.excise_list,
	};
	
};


const mapDispatchToProps = (dispatch) => {
	return {
		requestForQuotationDetailsAction : bindActionCreators(
			RequestForQuotationDetailsAction,
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
class CreateCreditNoteModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
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
				creditNoteDate: new Date(),
				poReceiveDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
				supplierId: '',
				invoiceLineItems: [
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
			
				total_net: 0,
				term: '',
				totalAmount: 0,
				notes: '',
				type: 4,

			},
			prefixData:'',
			state_list: [],
			editorState: EditorState.createEmpty(),
			// selectedData:{
			// 	total_net: 0,
			
			// 	totalVatAmount:0,
			// 	totalAmount: 0,
			// },
			contentState: {},
			viewEditor: false,
			message: '',
			productId:'',

			fileName: '',
			creditNoteDate: new Date(),
		};
	
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.content = {
			entityMap: {},
			blocks: [
				{
					key: '637gr',
					text: this.state.message,
					type: 'unstyled',
					depth: 0,
					inlineStyleRanges: [],
					entityRanges: [],
					data: {},
				},
			],
		};
	}
 


    checkedRow = () => {
		if (this.state.selectedData.invoiceLineItems.length > 0) {
			let length = this.state.selectedData.invoiceLineItems.length - 1;
			let temp = Object.values(this.state.selectedData.invoiceLineItems[`${length}`]).indexOf('');
			if (temp > -1) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.selectedData !== nextProps.selectedData || prevState.totalAmount !== nextProps.totalAmount ||
			prevState.totalVatAmount != nextProps.totalVatAmount  ) {
			console.log('getDerivedStateFromProps state changed',nextProps.selectedData.invoiceLineItems);
		
		 return { prefixData : nextProps.prefixData,
		 	selectedData :nextProps.selectedData,
			 totalAmount :nextProps.totalAmount,
			 totalVatAmount :nextProps.totalVatAmount,
			 invoiceNumber :nextProps.invoiceNumber,
			 id:nextProps.id
		};
        }
		// else if(prevState.totalAmount !== nextProps.totalAmount)
		// {
		// 	console.log('+++++++++++++++++',nextProps.totalAmount)
		// 	return { prefixData : nextProps.prefixData,
		// 		totalAmount :nextProps.totalAmount };
		// }
		// else if(prevState.totalVatAmount != nextProps.totalVatAmount)
		// {
		// 	console.log('---------',nextProps.totalVatAmount)
		// 	return{
		// 		prefixData : nextProps.prefixData,
		// 		totalVatAmount :nextProps.totalVatAmount
		// 	};
		// }
    }

	setDate = (props, value) => {
		const { term } = this.state;
		const val = term ? term.value.split('_') : '';
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
		const values = value
			? value
			: moment(props.values.creditNoteDate, 'DD-MM-YYYY').toDate();
		// if (temp && values) {
		// 	const date = moment(values)
		// 		.add(temp - 1, 'days')
		// 		.format('DD-MM-YYYY');
		// 	props.setFieldValue('invoiceDueDate', date, true);
		// }
	};

	renderDescription = (cell, row, props) => {
		let idx;
		this.state.selectedData.invoiceLineItems.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`invoiceLineItems.${idx}.description`}
				render={({ field, form }) => (
					<Input
					disabled
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
						className={`form-control 
            ${
							props.errors.invoiceLineItems &&
							props.errors.invoiceLineItems[parseInt(idx, 10)] &&
							props.errors.invoiceLineItems[parseInt(idx, 10)].description &&
							Object.keys(props.touched).length > 0 &&
							props.touched.invoiceLineItems &&
							props.touched.invoiceLineItems[parseInt(idx, 10)] &&
							props.touched.invoiceLineItems[parseInt(idx, 10)].description
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	}

	selectItem = (e, row, name, form, field, props) => {
		//e.preventDefault();
		let data = this.state.selectedData.invoiceLineItems;
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
				this.state.selectedData.invoiceLineItems[parseInt(idx, 10)][`${name}`],
				true,
			);
			this.updateAmount(data, props);
		} else {
			this.setState({ data }, () => {
				form.setFieldValue(
					field.name,
					this.state.selectedData.invoiceLineItems[parseInt(idx, 10)][`${name}`],
					true,
				);
				this.updateAmount(data, props);
			});
		}
	};

	renderQuantity = (cell, row, props) => {
		let idx;
		this.state.selectedData.invoiceLineItems.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`invoiceLineItems.${idx}.quantity`}
				render={({ field, form }) => (
					<div>
						<Input
							type="number"
							// disabled
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
												props.errors.invoiceLineItems &&
												props.errors.invoiceLineItems[parseInt(idx, 10)] &&
												props.errors.invoiceLineItems[parseInt(idx, 10)]
													.quantity &&
												Object.keys(props.touched).length > 0 &&
												props.touched.invoiceLineItems &&
												props.touched.invoiceLineItems[parseInt(idx, 10)] &&
												props.touched.invoiceLineItems[parseInt(idx, 10)]
													.quantity
													? 'is-invalid'
													: ''
											}`}
						/>
						{props.errors.invoiceLineItems &&
							props.errors.invoiceLineItems[parseInt(idx, 10)] &&
							props.errors.invoiceLineItems[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.invoiceLineItems &&
							props.touched.invoiceLineItems[parseInt(idx, 10)] &&
							props.touched.invoiceLineItems[parseInt(idx, 10)].quantity && (
								<div className="invalid-feedback">
									{props.errors.invoiceLineItems[parseInt(idx, 10)].quantity}
								</div>
							)}
					</div>
				)}
			/>
		);
	}

	renderUnitPrice = (cell, row, props) => {
		let idx;
		this.state.selectedData.invoiceLineItems.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});
	
		return (
			<Field
				name={`invoiceLineItems.${idx}.unitPrice`}
				render={({ field, form }) => (
					<Input
					    type="number"
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
													props.errors.invoiceLineItems &&
													props.errors.invoiceLineItems[parseInt(idx, 10)] &&
													props.errors.invoiceLineItems[parseInt(idx, 10)]
														.unitPrice &&
													Object.keys(props.touched).length > 0 &&
													props.touched.invoiceLineItems &&
													props.touched.invoiceLineItems[parseInt(idx, 10)] &&
													props.touched.invoiceLineItems[parseInt(idx, 10)]
														.unitPrice
														? 'is-invalid'
														: ''
												}`}
					/>
				)}
			/>
		);
	}

	renderVat = (cell, row, props) => {
		const { vat_list } = this.props;
		let vatList = vat_list.length
			? [{ id: '', vat: 'Select Vat' }, ...vat_list]
			: vat_list;
		let idx;
		this.state.selectedData.invoiceLineItems.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`invoiceLineItems.${idx}.vatCategoryId`}
				render={({ field, form }) => (
					<Select
					isDisabled={true}
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
							props.errors.invoiceLineItems &&
							props.errors.invoiceLineItems[parseInt(idx, 10)] &&
							props.errors.invoiceLineItems[parseInt(idx, 10)].vatCategoryId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.invoiceLineItems &&
							props.touched.invoiceLineItems[parseInt(idx, 10)] &&
							props.touched.invoiceLineItems[parseInt(idx, 10)].vatCategoryId
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	}

	renderExcise = (cell, row, props) => {
		const { excise_list } = this.props;

		let idx;
		this.state.selectedData.invoiceLineItems.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`invoiceLineItems.${idx}.exciseTaxId`}
				render={({ field, form }) => (
					<Select
					isDisabled={true}
						styles={customStyles}
						options={
							excise_list
								? selectOptionsFactory.renderOptions(
										'name',
										'id',
										excise_list,
										'Excise Tax',
								  )
								: []
						}
						value={
							excise_list &&
							selectOptionsFactory
								.renderOptions('name', 'id', excise_list, 'Excise Tax')
								.find((option) => option.value === +row.exciseTaxId)
						}
						id="exciseTaxId"
						placeholder={strings.Select+strings.Vat}
						onChange={(e) => {
							this.selectItem(
								e.value,
								row,
								'exciseTaxId',
								form,
								field,
								props,
							);
						}}
						className={`${
							props.errors.invoiceLineItems &&
							props.errors.invoiceLineItems[parseInt(idx, 10)] &&
							props.errors.invoiceLineItems[parseInt(idx, 10)].exciseTaxId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.invoiceLineItems &&
							props.touched.invoiceLineItems[parseInt(idx, 10)] &&
							props.touched.invoiceLineItems[parseInt(idx, 10)].exciseTaxId
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	}

	renderSubTotal = (cell, row,extraData) => {
		// return row.subTotal ? (
		// 	<Currency
		// 		value={row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	''
		// );
		return row.subTotal ? row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : '';
	} 
	
	renderProduct = (cell, row, props) => {
		const { product_list } = this.props;
		let productList = product_list.length
			? [{ id: '', name: 'Select Product' }, ...product_list]
			: product_list;
		let idx;
		this.state.selectedData.invoiceLineItems.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`invoiceLineItems.${idx}.productId`}
				render={({ field, form }) => (
					<Select
						isDisabled={true}
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
							props.errors.invoiceLineItems &&
							props.errors.invoiceLineItems[parseInt(idx, 10)] &&
							props.errors.invoiceLineItems[parseInt(idx, 10)].productId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.invoiceLineItems &&
							props.touched.invoiceLineItems[parseInt(idx, 10)] &&
							props.touched.invoiceLineItems[parseInt(idx, 10)].productId
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	}
	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.selectedData.invoiceLineItems;
		const result = product_list.find((item) => item.id === parseInt(e));
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
			`invoiceLineItems.${idx}.vatCategoryId`,
			result.vatCategoryId,
			true,
		);
		form.setFieldValue(
			`invoiceLineItems.${idx}.unitPrice`,
			result.unitPrice,
			true,
		);
		form.setFieldValue(
			`invoiceLineItems.${idx}.description`,
			result.description,
			true,
		);
		this.updateAmount(data, props);
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
			return row.subTotal ? this.state.selectedData.currencyIsoCode+" " +row.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : '';
		}

	onContentStateChange = (contentState) => {
		this.setState(
			{
				contentState,
			},
			() => {
				this.setState({
					message: this.state.contentState.blocks[0].text,
				});
			},
		);
	};
	renderActions = (cell, rows, props) => {
		return (
			<Button
				size="sm"
				className="btn-twitter btn-brand icon"
				disabled={this.state.selectedData.invoiceLineItems.length === 1 ? true : false}
				onClick={(e) => {
					this.deleteRow(e, rows, props);
				}}
			>
				<i className="fas fa-trash"></i>
			</Button>
		);
	};
	deleteRow = (e, row, props) => {
		const id = row['id'];
		let newData = [];
		e.preventDefault();
		const data = this.state.selectedData.invoiceLineItems;
		newData = data.filter((obj) => obj.id !== id);
		let selectedData = {...this.state.selectedData}
												selectedData.invoiceLineItems = newData;
												this.setState({
													selectedData:selectedData
												})
		this.props.updateParentSelelectedData(selectedData);
		props.setFieldValue('invoiceLineItems', newData, true);
		this.updateAmount(newData, props);
	};
	getTotalNet = () => {

		let data =[];

		let value = 0

		if(this.state.selectedData && this.state.selectedData.invoiceLineItems && Array.isArray(this.state.selectedData.invoiceLineItems)) {

			data = this.state.selectedData.invoiceLineItems

		}

		data.forEach((d)=>{
			value = value+d.subTotal
		})

		return value;



	  }
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
			obj.subTotal =
				obj.unitPrice && obj.vatCategoryId ? +obj.unitPrice * obj.quantity : 0;
			total_net = +(total_net + +obj.unitPrice * obj.quantity);
			total_vat = +(total_vat + val);
			total = total_vat + total_net;
			return obj;
		});
		console.log(total_net,"total_net")
		console.log(total_vat,"total_vat")
		console.log(total,"total")
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
	
	this.props.updateParentAmount(total,total_vat)
	console.log("selectData total_vat ***",total_vat)
	console.log("selectDa tatotal ***",total)
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
				this.setFieldValue(
					'lineItemsString',
					this.state.data,
					true,
				);
				this.setFieldTouched(
					`lineItemsString[${this.state.data.length - 1}]`,
					false,
					true,
				);
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

	getData = (data) => {
		let temp = {};
		for (let item in data) {
			if (typeof data[`${item}`] !== 'object') {
				temp[`${item}`] = data[`${item}`];
			} else {
				temp[`${item}`] = data[`${item}`].value;
			}
		}
		return temp;
	};

	// Create

	handleSubmit = (data, resetForm) => {
		
		this.setState({ disabled: true });
		const {
			receiptAttachmentDescription,
			receiptNumber,
			contact_po_number,
			currency,
			invoiceNumber,
			// exchangeRate,
			// invoiceDueDate,
			creditNoteDate,
			contactId,
			creditNoteNumber,
			discount,
			discountType,
			discountPercentage,
			notes,
			
			email
		} = data;
		const { term } = this.state;
		const formData = new FormData();
	
			formData.append('invoiceId',this.state.id ?this.state.id : '');
			formData.append('currencyCode', this.state.selectedData.currencyCode);
			formData.append(
				'creditNoteNumber',
				creditNoteNumber !== null ? this.state.prefixData : '',
			);
		// formData.append(
		// 	'creditNoteNumber',
		// 	creditNoteNumber !== null ? this.state.prefixData + creditNoteNumber : '',
		// );
		formData.append(
			'email',
			email !== null ? email : '',
		);
		formData.append('cnCreatedOnPaidInvoice','1');
		// formData.append(
		// 	'invoiceDueDate',
		// 	invoiceDueDate ? moment(invoiceDueDate, 'DD-MM-YYYY').toDate() : null,
		// );
		formData.append(
			'creditNoteDate',
			creditNoteDate
				?
						moment(creditNoteDate,'DD-MM-YYYY')
						.toDate()
				: '',
		);
		formData.append(
			'receiptNumber',
			receiptNumber !== null ? receiptNumber : '',
		);
		// formData.append(
		// 	'exchangeRate',
		// 	exchangeRate !== null ? exchangeRate : '',
		// );
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
		formData.append('type', 7);
		formData.append('lineItemsString', JSON.stringify(this.state.selectedData.invoiceLineItems));
		formData.append('totalAmount', this.state.totalAmount );
		formData.append('discount', this.state.selectedData.discount ?this.state.selectedData.discount:0 );
        formData.append('totalVatAmount',this.state.totalVatAmount );
	   	// formData.append('discount', discount);
		// if (discountType && discountType.value) {
		// 	formData.append('discountType', discountType.value);
		// }
		// // if (term && term.value) {
		// 	formData.append('term', term.value);
		// }
		// if (discountType.value === 'PERCENTAGE') {
		// 	formData.append('discountPercentage', discountPercentage);
		// }

			formData.append('contactId', this.state.selectedData.contactId);

		this.props.createCreditNote(formData)
		.then((res) => {				
			if (res.status === 200) {
				resetForm();
				this.props.closeModal(true);

				
			}
		})
		.catch((err) => {
			this.displayMsg(err);
			this.formikRef.current.setSubmitting(false);
		});
		// this.props.creditNotesCreateActions
		// 	.createCreditNote(formData)
		// 	.then((res) => {
		// 		this.setState({ disabled: false });
		// 		this.props.commonActions.tostifyAlert(
		// 			'success',
		// 			'New Credit Note Created Successfully.',
		// 		);
		// 		if (this.state.createMore) {
		// 			this.setState(
		// 				{
		// 					createMore: false,
		// 					selectedContact: '',
		// 					term: '',
		// 					exchangeRate:'',
		// 					data: [
		// 						{
		// 							id: 0,
		// 							description: '',
		// 							quantity: 1,
		// 							unitPrice: '',
		// 							vatCategoryId: '',
		// 							subTotal: 0,
		// 							productId: '',
		// 						},
		// 					],
		// 					initValue: {
		// 						...this.state.initValue,
		// 						...{
		// 							total_net: 0,
		// 							invoiceVATAmount: 0,
		// 							totalAmount: 0,
		// 							discountType: '',
		// 							discount: 0,
		// 							discountPercentage: '',
		// 						},
		// 					},
		// 				},
		// 				() => {
		// 					resetForm(this.state.initValue);
		// 					this.getInvoiceNo();
		// 					this.formRef.current.setFieldValue(
		// 						'lineItemsString',
		// 						this.state.data,
		// 						false,
		// 					);
		// 				},
		// 			);
		// 		} else {
		// 			this.props.history.push('/admin/income/credit-notes');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		this.setState({ disabled: false });
		// 		this.props.commonActions.tostifyAlert(
		// 			'error',
		// 			err && err.data ? err.data.message : 'Something Went Wrong',
		// 		);
		// 	});
	};
	displayMsg = (err) => {
		toast.error(`${err.data}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};
	_showDetails = (bool) => {
		this.setState({
		  showDetails: bool
		});
	  }



	render() {
		strings.setLanguage(this.state.language);
		const { openModal, closeModal, id, supplier_list,rfqReceiveDate,prefixData ,selectedData,invoiceNumber} = this.props;
		const { initValue, contentState,data,supplierId } = this.state;
 console.log(this.state.prefixData,"prefixData")
		let tmpSupplier_list = []

		supplier_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpSupplier_list.push(obj)
		})

		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<Formik
						ref={this.formikRef}
						initialValues={initValue}
						onSubmit={(values, { resetForm }) => {
							
							if(this.state.selectedData && this.state.totalAmount<=this.state.selectedData.remainingInvoiceAmount){
								this.handleSubmit(values, resetForm);
							}
							
						}}
						validate={(values)=>{
							let errors = {};
							
							if(this.state.selectedData && this.state.totalAmount>this.state.selectedData.remainingInvoiceAmount)
							{
								errors.remainingInvoiceAmount =	'Invoice Total Amount Cannot be greater than  Remaining Invoice Amount';
							}
						
												
													return errors;
									
						}}
						validationSchema={Yup.object().shape(
							{
							//  creditNoteNumber: Yup.string().required(
                            // 							 	'credit Note Number Number is Required',
                            // 							 ),
							creditNoteDate: Yup.date().required("credit Note  Date is Required"),							
						}
						)
					}
					>
						{(props) => {
							const { isSubmitting } = props;
							return (
								
								<Form
									name="simpleForm"
									onSubmit={props.handleSubmit}
									className="create-contact-screen"
								>
									<CardHeader toggle={this.toggleDanger}>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="nav-icon fas fa-id-card-alt" />
													<span className="ml-2">{strings.CreateCreditNote}</span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<ModalBody>
								

						
            {console.log("in modal ",this.state.selectedData)}
           
            
									<Row>
                                                              <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="invoiceNumber">
																		<span className="text-danger">*</span>
																		 {strings.InvoiceNumber}
																	</Label>
																	<Input
                                                                    disabled={true}
																		type="text"
																		id="InvoiceNumber"
																		name="invoiceNumber"
																		placeholder={strings.InvoiceNumber}
																		value={this.state.invoiceNumber}
																		onBlur={props.handleBlur('invoiceNumber')}
																		onChange={(value) => {
																			props.handleChange('invoiceNumber')(
																				value,
																			);
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
															</Col>
                                                            <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="po_number">
																		<span className="text-danger">*</span>
																		 {strings.CreditNoteNumber}
																	</Label>
																	<Input
																		type="text"
																		id="creditNoteNumber"
																		name="creditNoteNumber"
																		placeholder={strings.CreditNoteNumber}
																		value={this.state.prefixData}
																		onBlur={props.handleBlur('creditNoteNumber')}
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

                                                            </Row>
                                                            <Row>

															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="contactId">
																		<span className="text-danger">*</span>
																		 {strings.CustomerName}
																	</Label>
																	<Input
																		styles={customStyles}
																		id="contactId"
																		name="contactId"
																		disabled={true}
																		placeholder={strings.Select+strings.CustomerName}
																		// options={
																		// 	tmpCustomer_list
																		// 		? selectOptionsFactory.renderOptions(
																		// 				'label',
																		// 				'value',
																		// 				tmpCustomer_list,
																		// 				'Customer',
																		// 		  )
																		// 		: []
																		// }
																		value={this.state.selectedData.name}
																		// onChange={(option) => {
																		// 	if (option && option.value) {
																		// 		this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
																		// 		// this.setExchange( this.getCurrency(option.value) );
																		// 		props.handleChange('contactId')(option);
																		// 	} else {
																		// 		props.handleChange('contactId')('');
																		// 	}
																		// }}
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
																		this.state.selectedData.taxTreatment
																	 	
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
														
                                                             <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="currencyCode">
																	<span className="text-danger">*</span>
																		{strings.Currency}
																	</Label>
																	<Input
																		type="text"
																		id="currencyCode"
																		name="currencyCode"
																		disabled={true}
																		value={this.state.selectedData.currencyName}
																		// onBlur={props.handleBlur('currencyCode')}
																		// onChange={(value) => {
																		// 	props.handleChange('currencyCode')(
																		// 		value,
																		// 	);
																		// }}
																		className={
																			props.errors.currencyCode &&
																			props.touched.currencyCode
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.currencyCode &&
																		props.touched.currencyCode && (
																			<div className="invalid-feedback">
																				{props.errors.currencyCode}
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
																		<span className="text-danger">*</span>
																		{strings.CreditNoteDate}
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
																				{props.errors.creditNoteDate}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="remainingInvoiceAmount">
																
																	Remaining Invoice Amount
																	</Label>
																	<Input
																		type="text"
																		id="remainingInvoiceAmount"
																		name="remainingInvoiceAmount"
																		disabled={true}
																		value={this.state.selectedData.remainingInvoiceAmount}
																		// onBlur={props.handleBlur('currencyCode')}
																		// onChange={(value) => {
																		// 	props.handleChange('currencyCode')(
																		// 		value,
																		// 	);
																		// }}
																		// className={
																		// 	props.errors.remainingInvoiceAmount &&
																		// 	props.touched.remainingInvoiceAmount
																		// 		? 'is-invalid'
																		// 		: ''
																		// }
																	/>
																	{props.errors.remainingInvoiceAmount &&
																	 (
																			<div className="text-danger">
																				{props.errors.remainingInvoiceAmount}
																			</div>
																		)}
																</FormGroup>
															</Col>

															{/* <Col lg={3}>
												<FormGroup>
													<Label htmlFor="email">
														{strings.SalesPerson}
													</Label>
													<Input
														type="text"
														maxLength="80"
														id="email"
														name="email"
														onChange={(value) => {
															props.handleChange('email')(value);
														}}
														value={props.values.email}
														className={
															props.errors.email && props.touched.email
																? 'is-invalid'
																: ''
														}
														placeholder="Enter email"
													/>
													{props.errors.email && props.touched.email && (
														<div className="invalid-feedback">
															{props.errors.email}
														</div>
													)}
												</FormGroup>
											</Col> */}
														</Row>
													
														<Row>
															<Col lg={12} className="mb-3">
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
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																{props.errors.invoiceLineItems &&
																	props.errors.invoiceLineItems === 'string' && (
																		<div
																			className={
																				props.errors.invoiceLineItems
																					? 'is-invalid'
																					: ''
																			}
																		>
																			<div className="invalid-feedback">
																				{props.errors.invoiceLineItems}
																			</div>
																		</div>
																	)}
																<BootstrapTable
																	options={this.options}
																	data={this.state.selectedData.invoiceLineItems}
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
																	width="15%"
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
																		dataField="vat"
																		dataFormat={(cell, rows) =>
																			this.renderVat(cell, rows, props)
																		}
																	>
																		{strings.VAT}
																	</TableHeaderColumn>
																	<TableHeaderColumn
																		dataField="vat"
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
																		dataField="sub_total"
																		dataFormat={this.renderSubTotal}
																		className="text-right"
																		columnClassName="text-right"
																	
																	>
																		{strings.SUBTOTAL}
																	</TableHeaderColumn>
																</BootstrapTable>
															</Col>
														</Row>
														<hr />
													
														{this.state.selectedData.invoiceLineItems &&this.state.selectedData.invoiceLineItems.length > 0 && (
																<Row>
																		<Col lg={8}>
																	<FormGroup className="py-2">
																		<Label htmlFor="notes">{strings.Notes}</Label>
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
																						Discount
																						</h5>
																					</Col>
																					<Col lg={6} className="text-right">
																						<label className="mb-0">
																					
																								{this.state.selectedData.currencyIsoCode}  &nbsp;
																								{this.state.selectedData.discount ? this.state.selectedData.discount.toLocaleString(navigator.language,{ minimumFractionDigits: 2 }):"0"}
																							
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
																								{this.state.selectedData.currencyIsoCode}  &nbsp;
																								{this.getTotalNet().toLocaleString(navigator.language,{ minimumFractionDigits: 2 })}
																							{/* {this.getTotalNet()} */}
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
																							{/* {this.state.totalVatAmount}  */}
																							{this.state.selectedData.currencyIsoCode}  &nbsp;
																							{this.state.totalVatAmount.toLocaleString(navigator.language,{ minimumFractionDigits: 2 })}
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
																						 {/* {this.state.totalAmount} */}
																							{this.state.selectedData.currencyIsoCode} &nbsp;
																							{this.state.totalAmount.toLocaleString(navigator.language,{ minimumFractionDigits: 2 })}
																						</label>
																					</Col>
																				</Row>
																			</div>
																		</div>
																	</Col>
																</Row>
															)}
									</ModalBody>
									<ModalFooter>
										<Button
											color="primary"
											type="submit"
											className="btn-square"
											disabled={isSubmitting}
											
										>
											<i className="fa fa-dot-circle-o mr-1"></i>{strings.Create}
										</Button>
										&nbsp;
										<Button
											color="secondary"
											className="btn-square"
											
											onClick={() => {
												let initValue = {...this.state.initValue}
												initValue.total_net = 0;
												this.setState({
													initValue:initValue
												})
												closeModal(false);
											}}
										>
											<i className="fa fa-ban"></i> {strings.Cancel}
										</Button>
									</ModalFooter>
								</Form>
							);
						}}

					</Formik>
				</Modal>
				
			</div>
		);
	}
}


export default connect(
	mapStateToProps
	
)(CreateCreditNoteModal);