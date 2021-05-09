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
		rfqReceiveDate: state.rfqReceiveDate
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
class CreateGoodsReceivedNote extends React.Component {
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
				grnReceiveDate: new Date(),
				poReceiveDate:new Date(new Date().setMonth(new Date().getMonth() + 1)),
				supplierId: '',
				poQuatationLineItemRequestModelList: [
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
				supplierReferenceNumber: '',
			},
			prefixData:'',
			state_list: [],
			editorState: EditorState.createEmpty(),
			selectedData:{},
			contentState: {},
			viewEditor: false,
			message: '',
			productId:'',
			prefixData:'',
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
		if (this.state.selectedData.poQuatationLineItemRequestModelList.length > 0) {
			let length = this.state.selectedData.poQuatationLineItemRequestModelList.length - 1;
			let temp = Object.values(this.state.selectedData.poQuatationLineItemRequestModelList[`${length}`]).indexOf('');
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
        if (prevState.selectedData !== nextProps.selectedData ) {
        //   setState( {
		// 	poQuatationLineItemRequestModelList:nextProps.selectedData.poQuatationLineItemRequestModelList,
        //   //   id: nextProps.selectedData.poQuatationLineItemRequestModelList.invoiceId,
        //  //    productId:nextProps.selectedData.poQuatationLineItemRequestModelList.productId,
        // //     quantity:nextProps.selectedData.poQuatationLineItemRequestModelList.quantity,
        //  //   type:nextProps.selectedData.poQuatationLineItemRequestModelList.invoiceType,

		// 	 });
	//	const { selectedData } = nextProps.selectedData;
		return { prefixData : nextProps.prefixData,
			selectedData :nextProps.selectedData };
        }
    }


	renderDescription = (cell, row, props) => {
		let idx;
		this.state.selectedData.poQuatationLineItemRequestModelList.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`poQuatationLineItemRequestModelList.${idx}.description`}
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
						placeholder="Description"
						className={`form-control 
            ${
							props.errors.poQuatationLineItemRequestModelList &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)].description &&
							Object.keys(props.touched).length > 0 &&
							props.touched.poQuatationLineItemRequestModelList &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)].description
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
		let data = this.state.selectedData.poQuatationLineItemRequestModelList;
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
			name === 'grnReceivedQuantity'
		) {
			form.setFieldValue(
				field.name,
				this.state.selectedData.poQuatationLineItemRequestModelList[parseInt(idx, 10)][`${name}`],
				true,
			);
			this.updateAmount(data, props);
		} else {
			this.setState({ data }, () => {
				form.setFieldValue(
					field.name,
					this.state.selectedData.poQuatationLineItemRequestModelList[parseInt(idx, 10)][`${name}`],
					true,
				);
			});
		}
	};

	renderQuantity = (cell, row, props) => {
		let idx;
		this.state.selectedData.poQuatationLineItemRequestModelList.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`poQuatationLineItemRequestModelList.${idx}.quantity`}
				render={({ field, form }) => (
					<div>
						<Input
						disabled
							type="number"
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
							placeholder="Quantity"
							className={`form-control 
           						${
												props.errors.poQuatationLineItemRequestModelList &&
												props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
												props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)]
													.quantity &&
												Object.keys(props.touched).length > 0 &&
												props.touched.poQuatationLineItemRequestModelList &&
												props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
												props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)]
													.quantity
													? 'is-invalid'
													: ''
											}`}
						/>
						{props.errors.poQuatationLineItemRequestModelList &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)].quantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.poQuatationLineItemRequestModelList &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)].quantity && (
								<div className="invalid-feedback">
									{props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)].quantity}
								</div>
							)}
					</div>
				)}
			/>
		);
	}

	renderUnitPrice = (cell, row, props) => {
		let idx;
		this.state.selectedData.poQuatationLineItemRequestModelList.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`poQuatationLineItemRequestModelList.${idx}.unitPrice`}
				render={({ field, form }) => (
					<Input
					type="number"
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
						placeholder="Unit Price"
						className={`form-control 
                       ${
													props.errors.poQuatationLineItemRequestModelList &&
													props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
													props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)]
														.unitPrice &&
													Object.keys(props.touched).length > 0 &&
													props.touched.poQuatationLineItemRequestModelList &&
													props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
													props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)]
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
		this.state.selectedData.poQuatationLineItemRequestModelList.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`poQuatationLineItemRequestModelList.${idx}.vatCategoryId`}
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
						placeholder="Select Vat"
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
							props.errors.poQuatationLineItemRequestModelList &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)].vatCategoryId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.poQuatationLineItemRequestModelList &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)].vatCategoryId
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
		// 		value={row.subTotal.toFixed(2)}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	''
		// );
		return row.subTotal ? row.subTotal.toFixed(2) : '';
	}
	
	renderProduct = (cell, row, props) => {
		const { product_list } = this.props;
		let productList = product_list.length
			? [{ id: '', name: 'Select Product' }, ...product_list]
			: product_list;
		let idx;
		this.state.selectedData.poQuatationLineItemRequestModelList.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`poQuatationLineItemRequestModelList.${idx}.productId`}
				render={({ field, form }) => (
					<Select
						styles={customStyles}
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
											quantity: '',
                                            grnReceivedQuantity: 0,
                                            poQuantity:'',
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
							props.errors.poQuatationLineItemRequestModelList &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.errors.poQuatationLineItemRequestModelList[parseInt(idx, 10)].productId &&
							Object.keys(props.touched).length > 0 &&
							props.touched.poQuatationLineItemRequestModelList &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)] &&
							props.touched.poQuatationLineItemRequestModelList[parseInt(idx, 10)].productId
								? 'is-invalid'
								: ''
						}`}
					/>
				)}
			/>
		);
	}
	renderGRNQuantity = (cell, row, props) => {
		let idx;
		this.state.data.map((obj, index) => {
			if (obj.id === row.id) {
				idx = index;
			}
			return obj;
		});

		return (
			<Field
				name={`lineItemsString.${idx}.grnReceivedQuantity`}
				render={({ field, form }) => (
					<div>
						<Input
							type="number"
							maxLength="10"
							value={row['grnReceivedQuantity'] !== 0 ? row['grnReceivedQuantity'] : 0}
							onChange={(e) => {
								if (e.target.value === '' || this.regDecimal.test(e.target.value)) {
									this.selectItem(
										e.target.value,
										row,
										'grnReceivedQuantity',
										form,
										field,
										props,
									);
								}
							}}
							placeholder="grnReceivedQuantity"
							className={`form-control 
            ${
							props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].grnReceivedQuantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].grnReceivedQuantity
								? 'is-invalid'
								: ''
						}`}
						/>
						{props.errors.lineItemsString &&
							props.errors.lineItemsString[parseInt(idx, 10)] &&
							props.errors.lineItemsString[parseInt(idx, 10)].grnReceivedQuantity &&
							Object.keys(props.touched).length > 0 &&
							props.touched.lineItemsString &&
							props.touched.lineItemsString[parseInt(idx, 10)] &&
							props.touched.lineItemsString[parseInt(idx, 10)].grnReceivedQuantity && (
								<div className="invalid-feedback">
									{props.errors.lineItemsString[parseInt(idx, 10)].grnReceivedQuantity}
								</div>
							)}
					</div>
				)}
			/>
		);
	};
	prductValue = (e, row, name, form, field, props) => {
		const { product_list } = this.props;
		let data = this.state.selectedData.poQuatationLineItemRequestModelList;
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
			`poQuatationLineItemRequestModelList.${idx}.vatCategoryId`,
			result.vatCategoryId,
			true,
		);
		form.setFieldValue(
			`poQuatationLineItemRequestModelList.${idx}.unitPrice`,
			result.unitPrice,
			true,
		);
		form.setFieldValue(
			`poQuatationLineItemRequestModelList.${idx}.description`,
			result.description,
			true,
		);
		this.updateAmount(data, props);
	};

		renderSubTotal = (cell, row,extraData) => {
			// return row.subTotal ? (
			// 	<Currency
			// 		value={row.subTotal.toFixed(2)}
			// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			// 	/>
			// ) : (
			// 	''
			// );
			return row.subTotal ? row.subTotal.toFixed(2) : '';
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
				disabled={this.state.selectedData.poQuatationLineItemRequestModelList.length === 1 ? true : false}
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
		const data = this.state.selectedData.poQuatationLineItemRequestModelList;
		newData = data.filter((obj) => obj.id !== id);
		props.setFieldValue('poQuatationLineItemRequestModelList', newData, true);
		this.updateAmount(newData, props);
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
						+((obj.unitPrice * discountPercentage) / 100).toFixed(2)) *
						vat *
						obj.grnReceivedQuantity) /
					100;
			} else if (props.values.discountType === 'FIXED') {
				var val =
					(obj.unitPrice * obj.grnReceivedQuantity - discountAmount / data.length) *
					(vat / 100);
			} else {
				var val = (+obj.unitPrice * vat * obj.grnReceivedQuantity) / 100;
			}
			obj.subTotal =
				obj.unitPrice && obj.vatCategoryId ? +obj.unitPrice * obj.grnReceivedQuantity : 0;
			total_net = +(total_net + +obj.unitPrice * obj.grnReceivedQuantity);
			total_vat = +(total_vat + val);
			total = total_vat + total_net;
			return obj;
		});
		const discount =
			props.values.discountType === 'PERCENTAGE'
				? +((total_net * discountPercentage) / 100).toFixed(2)
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

    addRow = () => {
		const data = [...this.state.data];
		this.setState(
			{
				data: data.concat({
					id: this.state.idCount + 1,
					description: '',
					quantity: '',
					grnReceivedQuantity: 0,
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
	handleSubmit = (data, resetForm, setSubmitting) => {
		this.setState({ disabled: true });
		const {
			id,
			grnReceiveDate,
			poApproveDate,
			supplierId,
            poNumber,
			grn_number,
			notes,
			supplierReferenceNumber,
		} = data;
		const postData = this.getData(data);
		
		let formData = new FormData();
		formData.append(
			'poId',
			id !== null ?this.state.selectedData.id : '',
		);

		formData.append(
			'grnNumber',
			grn_number !== null ? this.state.prefixData : '',
		);
		formData.append('grnReceiveDate', grnReceiveDate ? grnReceiveDate : '');
	
		formData.append('notes', notes ? notes : '');
		formData.append('type', 5);
		formData.append('lineItemsString', JSON.stringify(this.state.selectedData.poQuatationLineItemRequestModelList));
		formData.append('totalAmount', this.state.initValue.totalAmount);
        formData.append('totalVatAmount',this.state.initValue.totalVatAmount);
		formData.append('supplierId', this.state.selectedData.supplierId);
        if (poNumber && poNumber.value) {
			formData.append('poNumber', poNumber.value);
		}
		formData.append('supplierReferenceNumber',this.state.selectedData.supplierReferenceNumber);
		
		this.props.createGRN(formData)
			.then((res) => {				
				if (res.status === 200) {
					resetForm();
					this.props.closeGoodsReceivedNotes(true);

					
				}
			})
			.catch((err) => {
				this.displayMsg(err);
				this.formikRef.current.setSubmitting(false);
			});

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
		const { openGoodsReceivedNotes, closeGoodsReceivedNotes, id, supplier_list,rfqReceiveDate } = this.props;
		const { initValue, contentState,data,supplierId } = this.state;
 
		let tmpSupplier_list = []

		supplier_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpSupplier_list.push(obj)
		})

		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openGoodsReceivedNotes} className="modal-success contact-modal">
					<Formik
						ref={this.formikRef}
						initialValues={initValue}
						onSubmit={(values, { resetForm ,setSubmitting}) => {
							this.handleSubmit(values, resetForm);
						}}
					// 	validationSchema={Yup.object().shape(
					// 		{
						
					// }}
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
													<span className="ml-2"> {strings.CreateGoodsReceivedNote} </span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<ModalBody>
								

						
            {/* {console.log("in modal ",this.state.selectedData)} */}
           
            
			<Row>
                                                              <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="poNumber">
																		<span className="text-danger">*</span>
																		 {strings.PONumber}
																	</Label>
																	<Input
                                                                    disabled={true}
																		type="text"
																		id="poNumber"
																		name="poNumber"
																		placeholder="Invoice Number"
																		value={this.state.selectedData.poNumber}
																		onBlur={props.handleBlur('poNumber')}
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
                                                            <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="grn_number">
																		<span className="text-danger">*</span>
																		 {strings.GRNNumber}
																	</Label>
																	<Input
																		type="text"
																		id="grn_number"
																		name="grn_number"
																		placeholder="Invoice Number"
																		value={this.state.prefixData}
																		onBlur={props.handleBlur('grn_number')}
																		onChange={(value) => {
																			props.handleChange('grn_number')(
																				value,
																			);
																		}}
																		className={
																			props.errors.grn_number &&
																			props.touched.grn_number
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.grn_number &&
																		props.touched.grn_number && (
																			<div className="invalid-feedback">
																				{props.errors.grn_number}
																			</div>
																		)}
																</FormGroup>
															</Col>
                                                           
                                                            </Row>
                                                            <Row>
                                                           
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="supplierName">
																		<span className="text-danger">*</span>
																		 {strings.SupplierName}
																	</Label>
                                                                    <Input
																		type="text"
                                                                        disabled={true}
																		id="supplierName"
																		name="supplierName"
																		// placeholder="Invoice Number"
																		value={this.state.selectedData.supplierName}
																		onBlur={props.handleBlur('po_number')}
																		// onChange={(value) => {
																		// 	props.handleChange('po_number')(
																		// 		value,
																		// 	);
																		// }}
																		className={
																			props.errors.po_number &&
																			props.touched.po_number
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{/* <Select
																		styles={customStyles}
																		id="supplierId"
																		name="supplierId"
																		placeholder={this.state.selectedData.supplierName}
																		// options={
																		// 	tmpSupplier_list
																		// 		? selectOptionsFactory.renderOptions(
																		// 				'label',
																		// 				'value',
																		// 				tmpSupplier_list,
																		// 				'Supplier Name',
																		// 		  )
																		// 		: []
																		// }
																		value={this.state.selectedData.supplierName}
																		// onChange={(option) => {
																		// 	if (option && option.value) {
																		// 		props.handleChange('supplierId')(option);
																		// 	} else {

																		// 		props.handleChange('supplierId')('');
																		// 	}
																		// }}
																		// className={
																		// 	props.errors.supplierId &&
																		// 	props.touched.supplierId
																		// 		? 'is-invalid'
																		// 		: ''
																		// }
																	/> */}
																	{/* {this.state.selectedData.supplierId &&
																		this.state.selectedData.supplierId && (
																			<div className="invalid-feedback">
																				{this.state.selectedData.supplierId}
																			</div>
																		)} */}
																</FormGroup>
															</Col>
															{/* <Col>
																<Label
																	htmlFor="supplierId"
																	style={{ display: 'block' }}
																>
																	Add New Supplier
																</Label>
																<Button
																	type="button"
																	color="primary"
																	className="btn-square"
																	onClick={this.openSupplierModal}
																>
																	<i className="fa fa-plus"></i> Add a Supplier
																</Button>
															</Col> */}
                                                             <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="supplierReferenceNumber">
																		<span className="text-danger">*</span>
																		{strings.SupplierReferenceNumber}
																	</Label>
																	<Input
																		disabled
																		type="text"
																		id="supplierReferenceNumber"
																		name="supplierReferenceNumber"
																		placeholder="Supplier Reference Number"
																		value={this.state.selectedData.supplierReferenceNumber}
																	
																		onChange={(value) => {
																			props.handleChange('supplierReferenceNumber')(
																				value,
																			);}}
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
														
														</Row>
														<Row>
															<Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">*</span>
																		{strings.ReceivedDate}
																	</Label>
																	<DatePicker
																		id="date"
																		name="grnReceiveDate"
																		className={`form-control ${
																			props.errors.grnReceiveDate &&
																			props.touched.grnReceiveDate
																				? 'is-invalid'
																				: ''
																		}`}
																		placeholderText="Order date"
																		selected={props.values.grnReceiveDate}
																		showMonthDropdown
																		showYearDropdown
																		dropdownMode="select"
																		dateFormat="dd/MM/yyyy"
																		maxDate={new Date()}
																		onChange={(value) => {
																			props.handleChange('grnReceiveDate')(value);
																		}}
																	/>
																	{props.errors.grnReceiveDate &&
																		props.touched.grnReceiveDate && (
																			<div className="invalid-feedback">
																				{props.errors.grnReceiveDate}
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
																	<i className="fa fa-plus"></i> {strings.Addmore}
																</Button>
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																{props.errors.poQuatationLineItemRequestModelList &&
																	props.errors.poQuatationLineItemRequestModelList === 'string' && (
																		<div
																			className={
																				props.errors.poQuatationLineItemRequestModelList
																					? 'is-invalid'
																					: ''
																			}
																		>
																			<div className="invalid-feedback">
																				{props.errors.poQuatationLineItemRequestModelList}
																			</div>
																		</div>
																	)}
																<BootstrapTable
																	options={this.options}
																	data={this.state.selectedData.poQuatationLineItemRequestModelList}
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
																		dataField="poQuantity"
																		width="10%"
																		dataFormat={(cell, rows) =>
																			this.renderGRNQuantity(cell, rows, props)
																		}
																	>
																		 {strings.RECEIVEDQUANTITY}
																	</TableHeaderColumn>
																
																	<TableHeaderColumn
																		dataField="quantity"
																		width="100"
																		dataFormat={(cell, rows) =>
																			this.renderQuantity(cell, rows, props)
																		}
																	>
																	 {strings.POQUANTITY}
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
													
														{this.state.selectedData.poQuatationLineItemRequestModelList.length > 0 && (
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
																			placeholder="Notes"
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
																						value=	{initValue.total_net.toFixed(2)}
																						currencySymbol={
																						universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.initValue.total_net}
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
																						value=	{initValue.invoiceVATAmount.toFixed(
																							2,
																						)}
																						currencySymbol={
																						universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.initValue.totalVatAmount	}
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
																						value=	{initValue.totalAmount.toFixed(2)}
																						currencySymbol={
																						universal_currency_list[0]
																						? universal_currency_list[0].currencyIsoCode
																						: 'USD'
																							}
																							/>
																							)} */}
																							{this.state.initValue.totalAmount}
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
											<i className="fa fa-dot-circle-o"></i> {strings.Create}
										</Button>
										&nbsp;
										<Button
											color="secondary"
											className="btn-square"
											onClick={() => {
												closeGoodsReceivedNotes(false);
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
	
)(CreateGoodsReceivedNote);