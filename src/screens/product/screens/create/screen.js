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

import { Formik } from 'formik';
import * as Yup from 'yup';

import './style.scss';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

import * as ProductActions from '../../actions';
import * as SupplierInvoiceActions from '../../../supplier_invoice/actions';
import { CommonActions } from 'services/global';

import { WareHouseModal } from '../../sections';
import { selectOptionsFactory } from 'utils';

const mapStateToProps = (state) => {
	return {
		vat_list: state.product.vat_list,
		product_warehouse_list: state.product.product_warehouse_list,
		product_category_list: state.product.product_category_list,
		supplier_list: state.supplier_invoice.supplier_list,
		inventory_account_list:state.product.inventory_account_list,

	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		supplierInvoiceActions: bindActionCreators(
			SupplierInvoiceActions,
			dispatch,
		),
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
class CreateProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			openWarehouseModal: false,
			contactType:1,
			initValue: {
				productName: '',
				productDescription: '',
				productCode: '',
				vatCategoryId: '',
				exciseTaxId:'',
				productCategoryId: '',
				productWarehouseId: '',
				vatIncluded: false,
				productType: 'GOODS',
				salesUnitPrice: '',
				purchaseUnitPrice: '',
				productPriceType: ['SALES'],
				salesTransactionCategoryId: { value: 84, label: 'Sales' },
				purchaseTransactionCategoryId: {
					value: 49,
					label: 'Cost of Goods Sold',
				},
				inventoryPurchasePrice: '',
				inventoryQty:'',
				inventoryReorderLevel:'',
				contactId:'',
				salesDescription: '',
				purchaseDescription: '',
				productSalesPriceType: '',
				productPurchasePriceType: '',
				disabled: false,
				isInventoryEnabled: false,
				transactionCategoryId:{value: 150, label: 'Inventory Asset'},
				exciseTaxId:''
			},
			purchaseCategory: [],
			salesCategory: [],
			createMore: false,
			exist: false,
			ProductExist: false,
			disabled: false,
			productActive: true,
			isActive:true,
			selectedStatus:true,
			exciseTaxList:[],
			exciseTaxCheck:false
		};
		this.formRef = React.createRef();       
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[ +a-zA-Z0-9-./\\|]+$/;
		this.regExAlpha = /^[0-9!@#$&()-\\`.+,/\"]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regDecimal5 =/^\d{1,5}$/;
	}

	componentDidMount = () => {
		this.initializeData();
		this.salesCategory();
		this.purchaseCategory();
		this.inventoryAccount();
		this.getProductCode();
	};
	initializeData = () => {
		this.props.productActions.getProductVatCategoryList();
		this.props.productActions.getExciseTaxList().then((res) => {
			if (res.status === 200) {
				this.setState({
					exciseTaxList:res.data
				});
			}
		});
	//	this.props.productActions.getTransactionCategoryListForInventory();
		this.props.productActions.getProductCategoryList();
		this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
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
inventoryAccount = () => {
try {
	this.props.productActions
		.getTransactionCategoryListForInventory()
		.then((res) => {
			if (res.status === 200) {
				this.setState(
					{
						inventoryAccount: res.data,
					},
					() => {},
				);
			}
		});
} catch (err) {
	console.log(err);
}};
	// Show Invite User Modal
	showWarehouseModal = () => {
		this.setState({ openWarehouseModal: true });
	};
	// Cloase Confirm Modal
	closeWarehouseModal = () => {
		this.setState({ openWarehouseModal: false });
		this.props.productActions.getProductWareHouseList();
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

	// Create or Edit Product
	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const productCode = data['productCode'];
		const salesUnitPrice = data['salesUnitPrice'];
		const salesTransactionCategoryId = data['salesTransactionCategoryId'];
		const salesDescription = data['salesDescription'];
		const purchaseDescription = data['purchaseDescription'];
		const purchaseTransactionCategoryId = data['purchaseTransactionCategoryId'];
		const purchaseUnitPrice = data['purchaseUnitPrice'];
		const vatCategoryId = data['vatCategoryId'];
		const exciseTaxId = data['exciseTaxId'];
		const vatIncluded = data['vatIncluded'];
		const inventoryPurchasePrice = data['inventoryPurchasePrice'];
		const inventoryQty = data['inventoryQty'];
		const inventoryReorderLevel = data['inventoryReorderLevel'];
		const contactId = data['contactId'].value;
		const isInventoryEnabled = data['isInventoryEnabled'];
		const transactionCategoryId = data['transactionCategoryId'];
		const productCategoryId = data['productCategoryId'];
		const isActive = this.state.productActive;

		let productPriceType;
		if (data['productPriceType'].includes('SALES')) {
			productPriceType = 'SALES';
		}
		if (data['productPriceType'].includes('PURCHASE')) {
			productPriceType = 'PURCHASE';
		}
		if (
			data['productPriceType'].includes('SALES') &&
			data['productPriceType'].includes('PURCHASE')
		) {
			productPriceType = 'BOTH';
		}
		const productName = data['productName'];
		const productType = data['productType'];
		const dataNew = {
			productCode,
			productName,
			productType,
			productPriceType,
			vatCategoryId,
			exciseTaxId,
			vatIncluded,
			isInventoryEnabled,
			contactId,
			transactionCategoryId,
			productCategoryId,
			isActive,
			...(salesUnitPrice.length !== 0 && {
				salesUnitPrice,
			}),
			...(salesTransactionCategoryId.length !== 0 && {
				salesTransactionCategoryId,
			}),
			...(salesDescription.length !== 0 && {
				salesDescription,
			}),
			...(purchaseDescription.length !== 0 && {
				purchaseDescription,
			}),
			...(purchaseTransactionCategoryId.length !== 0 && {
				purchaseTransactionCategoryId,
			}),
			...(purchaseUnitPrice.length !== 0 && {
				purchaseUnitPrice,
			}),
			...(inventoryPurchasePrice.length !== 0 && {
				inventoryPurchasePrice,
			}),
			...(inventoryQty.length !== 0 && {
				inventoryQty,
			}),
			...(inventoryReorderLevel.length !== 0 && {
				inventoryReorderLevel,
			}),
		};
		const postData = this.getData(dataNew);
		this.props.productActions
			.createAndSaveProduct(postData)
			.then((res) => {
				this.setState({ disabled: false });
				if (res.status === 200) {
					// this.setState({ disabled: false });
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Product Created Successfully'
					);
					if (this.state.createMore) {
						this.setState({
							createMore: false,
						});
						resetForm(this.state.initValue);
						// this.props.history.push('/admin/master/product/create')
					} else {
						this.props.history.push('/admin/master/product');
					}
				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Product Created Unsuccessfully'
				);
			});
	};

	validationCheck = (value) => {
		const data = {
			moduleType: 1,
			name: value,
		};
		this.props.productActions.checkValidation(data).then((response) => {
			if (response.data === 'Product name already exists') {
				this.setState({
					exist: true,
				});
			} else {
				this.setState({
					exist: false,
				});
			}
		});
	};
	
	ProductvalidationCheck = (value) => {
		const data = {
			moduleType: 7,
			productCode: value,
		};
		this.props.productActions
			.checkProductNameValidation(data)
			.then((response) => {
				if (response.data === 'Product code already exists') {
					this.setState({
						ProductExist: true,
					});
				} else {
					this.setState({
						ProductExist: false,
					});
				}
			});
	};
	getProductCode=()=>{

		this.props.productActions.getProductCode().then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
						...this.state.initValue,
						...{ productCode: res.data },
					},
				});
				this.formRef.current.setFieldValue('productCode', res.data, true,true
				// this.validationCheck(res.data)
				);
			}
		});
	
	console.log(this.state.employeeCode)
	}
	render() {
		strings.setLanguage(this.state.language);
		const { vat_list, product_category_list,supplier_list,inventory_account_list} = this.props;
		const { initValue, purchaseCategory, salesCategory,inventoryAccount,exciseTaxList } = this.state;

		let tmpSupplier_list = []

		supplier_list.map(item => {
			let obj = {label: item.label.contactName, value: item.value}
			tmpSupplier_list.push(obj)
		})

		console.log(this.state.ReOrderLevel)
		console.log(this.state.PurchaseQuantity)
		return (
			<div className="create-product-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-object-group" />
												<span className="ml-2">{strings.CreateProduct}</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<Row>
										<Col lg={12}>
											<Formik
											ref={this.formRef}
												initialValues={initValue}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmit(values, resetForm);
												}}
												validate={(values) => {
													let errors = {};
													if (!values.productName) {
														errors.productName = 'Product  Name is  required';
													}
													if (this.state.exist === true) {
														errors.productName =
															'Product  Name is already exist';
													}
													if (this.state.ProductExist === true) {
														errors.productCode =
															'Product Code is already exist';
													}
													// if (values.inventoryReorderLevel > values.inventoryQty)
													// {
													// 	errors.inventoryReorderLevel = 
													// 		'Re-order level should be less than purchase quantity';
													// }
													// if (values.inventoryPurchasePrice > values.salesUnitPrice) {
													// 	errors.inventoryPurchasePrice = 
													// 	'Purchase price cannot be greater than Sales price';
													// }
													// else if (values.purchaseUnitPrice > values.salesUnitPrice) {
													// 	errors.purchaseUnitPrice = 
													// 	'Purchase price cannot be greater than Sales price';
													// }

													//  if (values.salesUnitPrice < values.purchaseUnitPrice) {

                                                    //     errors.salesUnitPrice= 

                                                    //     'Purchase price cannot be less than Sales price';

                                                    // }
													if(values.isInventoryEnabled===true){
														// if (values.salesUnitPrice < values.inventoryPurchasePrice) {

														// 	errors.salesUnitPrice= 
	
														// 	'Purchase price cannot be less than Sales price';
	
														// }														
														if(values.inventoryPurchasePrice ==='')
														errors.inventoryPurchasePrice = 
														'Inventory Purchase Price is requied';

														// if(values.inventoryReorderLevel ==='')
														// errors.inventoryReorderLevel = 
														// 'Inventory Reorder Level is requied';

														if(values.inventoryQty ==='')
														errors.inventoryQty = 
														'Inventory Quantity is requied';
														
													}

													if(this.state.exciseTaxCheck===true && values.exciseTaxId=='' ){
														errors.exciseTaxId = 'Excise Tax is requied';
													}
													return errors;
												}}
												
												validationSchema={
													Yup.object().shape({
													// isActive : Yup.boolean()
													// .required('status is Required') , 
													purchaseUnitPrice: Yup.string().when(
														'productPriceType',
														{
															is: (value) => value.includes('PURCHASE'),
															then: Yup.string().required(
																'Purchase Price is Required',
															),
															otherwise: Yup.string(),
														},
													),
													purchaseTransactionCategoryId: Yup.string().when(
														'productPriceType',
														{
															is: (value) => value.includes('PURCHASE'),
															then: Yup.string().required(
																'Purchase Category is Required',
															),
															otherwise: Yup.string(),
														},
													),
													salesTransactionCategoryId: Yup.string().when(
														'productPriceType',
														{
															is: (value) => value.includes('SALES'),
															then: Yup.string().required(
																'Selling Category is Required',
															),
															otherwise: Yup.string(),
														},
													),
													salesUnitPrice: Yup.string().when(
														'productPriceType',
														{
															is: (value) => value.includes('SALES'),
															then: Yup.string().required(
																'Selling Price is Required',
															),
															otherwise: Yup.string(),
														},
													),
													productPriceType: Yup.string().required(
														'At least one Selling type is required',
													),
													productCode: Yup.string().required(
														'Product code is required',
													),
													vatCategoryId: Yup.string()
														.required('Vat Category is Required')
														.nullable(),
												})}
											>
												{(props) => {
													const { handleBlur } = props;
													return (
														<Form onSubmit={props.handleSubmit}>
															<Row>
																<Col lg={4}>
																	<FormGroup check inline className="mb-3">
																		<Label className="productlabel">{strings.Type}</Label>
																		<div className="wrapper">
																			<Label
																				className="form-check-label"
																				check
																				htmlFor="producttypeone"
																			>
																				<Input
																					className="form-check-input"
																					type="radio"
																					id="producttypeone"
																					name="producttypeone"
																					value="GOODS"
																					onChange={(value) => {
																						props.handleChange('productType')(
																							value,
																						);
																					}}
																					checked={
																						props.values.productType === 'GOODS'
																					}
																				/>
																				{strings.Goods}
																			</Label>
																			<Label
																				className="form-check-label"
																				check
																				htmlFor="producttypetwo"
																			>
																				<Input
																					className="form-check-input"
																					type="radio"
																					id="producttypetwo"
																					name="producttypetwo"
																					value="SERVICE"
																					onChange={(value) => {
																						props.handleChange('productType')(
																							value,
																						);
																					}}
																					checked={
																						props.values.productType ===
																						'SERVICE'
																					}
																				/>
																				{strings.Service}
																			</Label>
																		</div>
																	</FormGroup>
																</Col>

																<Col lg={4}>
																<FormGroup check inline className="mb-3">
																	<Label className="productlabel"><span className="text-danger">* </span>{strings.Status}</Label>
																	<div className="wrapper">
																	<Label
																		className="form-check-label"
																		check
																	>
																	<Input
																		className="form-check-input"
																		type="radio"
																		id="inline-radio1"
                                                                        name="isActive"
																		checked={
																					this.state.selectedStatus
																				}
																		value={true}
																		onChange={(e) => {
																				if (
																						e.target.value === 'true'
																					) {
																						this.setState({
																						selectedStatus: true,
																						productActive: true,
																						isActive:true
																							});
																						}
																					}}
																				/>
																			  {strings.Active}
																			</Label>
																			<Label
																				className="form-check-label"
																				check
																			>
																				<Input
																					className="form-check-input"
																					type="radio"
																					id="inline-radio2"
                                                                                    name="isActive"
																					value={false}
                                                                                    checked={
                                                                                                !this.state.selectedStatus
                                                                                            }
                                                                                            onChange={(e) => {
                                                                                                if (
                                                                                                    	 e.target.value === 'false'
                                                                                                    ) {
                                                                                                        	this.setState({
                                                                                                            selectedStatus: false,
                                                                                                            productActive: false,
																											isActive:false
                                                                                                    	});
                                                                                                        }
                                                                                                     }}
																				/>
																				   {strings.Inactive}
																			</Label>
																		</div>   
                                                                    </FormGroup>
                                                                </Col>
															</Row>
															<hr></hr>
															<Row>
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="productName">
																			<span className="text-danger">* </span>{strings.Name}
																		</Label>
																		<Input
																			type="text"
																			maxLength="70"
																			id="productName"
																			name="productName"
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExBoth.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange('productName')(
																						option,
																					);
																				}
																				this.validationCheck(
																					option.target.value,
																				);
																			}}
																			onBlur={handleBlur}
																			value={props.values.productName}
																			placeholder={strings.Enter+strings.ProductName}
																			className={
																				props.errors.productName &&
																				props.touched.productName
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.productName &&
																			props.touched.productName && (
																				<div className="invalid-feedback">
																					{props.errors.productName}
																				</div>
																			)}
																	</FormGroup>
																</Col>

																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="productCode">
																			<span className="text-danger">* </span>
																			{strings.ProductCode}
																			<i
																				id="ProductCodeTooltip"
																				className="fa fa-question-circle ml-1"
																			></i>
																			<UncontrolledTooltip
																				placement="right"
																				target="ProductCodeTooltip"
																			>
																				Product Code - Unique identifier code
																				for the product
																			</UncontrolledTooltip>
																		</Label>
																		<Input
																			type="text"
																			maxLength="70"
																			id="productCode"
																			name="productCode"
																			placeholder={strings.Enter+strings.ProductCode}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExBoth.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange('productCode')(
																						option,
																					);
																				}
																				this.ProductvalidationCheck(
																					option.target.value,
																				);
																			}}
																			onBlur={handleBlur}
																			value={props.values.productCode}
																			className={
																				props.errors.productCode &&
																				props.touched.productCode
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.productCode &&
																			props.touched.productCode && (
																				<div className="invalid-feedback">
																					{props.errors.productCode}
																				</div>
																			)}
																	</FormGroup>
																</Col>
															</Row>
															<Row>
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="productCategoryId">
																			{strings.ProductCategory}
																		</Label>
																		<Select
																			styles={customStyles}
																			className="select-default-width"
																			options={
																				product_category_list &&
																				product_category_list.data
																					? selectOptionsFactory.renderOptions(
																							'productCategoryName',
																							'id',
																							product_category_list.data,
																							'Product Category',
																					  )
																					: []
																			}
																			id="productCategoryId"
																			name="productCategoryId"
																			placeholder={strings.Select+strings.ProductCategory}
																			value={props.values.productCategoryId}
																			onChange={(option) => {
																				// this.setState({
																				//   selectedParentProduct: option.value
																				// })
																				if (option && option.value) {
																					props.handleChange(
																						'productCategoryId',
																					)(option);
																				} else {
																					props.handleChange(
																						'productCategoryId',
																					)('');
																				}
																			}}
																		/>
																	</FormGroup>
																</Col>
																{/* <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="unitPrice">
                                    Product Price
                                  </Label>
                                  <Input
                                    type="text"
                                    id="unitPrice"
                                    name="unitPrice"
                                    placeholder="Enter Product Price"
                                    onChange={(option) => {
                                      if (
                                        option.target.value === '' ||
                                        this.regEx.test(option.target.value)
                                      ) {
                                        props.handleChange('unitPrice')(option);
                                      }
                                    }}
                                    value={props.values.unitPrice}
                                  />
                                </FormGroup>
                              </Col> */}
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="vatCategoryId">
																			<span className="text-danger">* </span>{strings.VAT+" "+strings.Type}
																		</Label>
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
																			id="vatCategoryId"
																			name="vatCategoryId"
																			placeholder={strings.Select+strings.VATCategory}
																			value={props.values.vatCategoryId}
																			onChange={(option) => {
																				// this.setState({
																				//   selectedVatCategory: option.value
																				// })
																				if (option && option.value) {
																					props.handleChange('vatCategoryId')(
																						option,
																					);
																				} else {
																					props.handleChange('vatCategoryId')(
																						'',
																					);
																				}
																			}}
																			className={
																				props.errors.vatCategoryId &&
																				props.touched.vatCategoryId
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.vatCategoryId &&
																			props.touched.vatCategoryId && (
																				<div className="invalid-feedback">
																					{props.errors.vatCategoryId}
																				</div>
																			)}
																	</FormGroup>
																</Col>
															</Row>
															<Row style={{display: props.values.productType !='SERVICE'   ?'' : 'none'}}		>
																<Col lg={4}>
																<FormGroup check inline className="mb-3">
																		<Label
																			className="form-check-label"
																			check
																			htmlFor="exciseTaxCheck"
																		>
																			<Input
																				type="checkbox"
																				id="exciseTaxCheck"
																				name="exciseTaxCheck"
																				onChange={(event) => {
																					if (
																						this.state.exciseTaxCheck===true
																						)
																					 {
																						this.setState({exciseTaxCheck:false})
																					} else {
																						this.setState({exciseTaxCheck:true})
																					}
																				}}
																				checked={this.state.exciseTaxCheck}
																				
																			/>
																			Excise Product ?
																		</Label>
																	</FormGroup>
																</Col>
																{this.state.exciseTaxCheck===true&&(	
													
																<Col  style={{display: props.values.productType !='SERVICE'   ?'' : 'none'}}	 lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="exciseTaxId">
																			<span className="text-danger">* </span>
																			Excise Tax Type
																		</Label>
																		<Select
																			styles={customStyles}
																			options={
																				exciseTaxList
																					? selectOptionsFactory.renderOptions(
																							'name',
																							'id',
																							exciseTaxList,
																							'Excise Tax Slab',
																					  )
																					: []
																			}
																			id="exciseTaxId"
																			name="exciseTaxId"
																			placeholder={strings.Select+ "excise Tax Slab"}
																			value={props.values.exciseTaxId}
																			onChange={(option) => {
																				
																				if (option && option.value) {
																					props.handleChange('exciseTaxId')(
																						option,
																					);
																				} else {
																					props.handleChange('exciseTaxId')(
																						'',
																					);
																				}
																			}}
																			className={
																				props.errors.exciseTaxId &&
																				props.touched.exciseTaxId
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.exciseTaxId &&
																			props.touched.exciseTaxId && (
																				<div className="invalid-feedback">
																					{props.errors.exciseTaxId}
																				</div>
																			)}
																	</FormGroup>
																</Col>

															)}
																
																</Row>
															
															<hr></hr>
															{/* <Row>
															<Col lg={12}>
																<FormGroup check inline className="mb-3">
																	<Input
																		className="form-check-input"
																		type="checkbox"
																		id="vatIncluded"
																		name="vatIncluded"
																		onChange={(value) => {
																			props.handleChange('vatIncluded')(value);
																		}}
																		checked={props.values.vatIncluded}
																	/>
																	<Label
																		className="form-check-label"
																		check
																		htmlFor="vatIncluded"
																	>
																		Vat Include
																	</Label>
																</FormGroup>
															</Col>
														</Row> */}

															{/* <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="productWarehouseId">
                                    Warehourse
                                  </Label>
                                  <Select
                                    className="select-default-width"
                                    options={
                                      product_warehouse_list
                                        ? selectOptionsFactory.renderOptions(
                                            'warehouseName',
                                            'warehouseId',
                                            product_warehouse_list,
                                            'Warehouse',
                                          )
                                        : []
                                    }
                                    id="productWarehouseId"
                                    name="productWarehouseId"
                                    value={props.values.productWarehouseId}
                                    onChange={(option) => {
                                      // this.setState({
                                      //   selectedWareHouse: option.value
                                      // })
                                      if (option && option.value) {
                                        props.handleChange(
                                          'productWarehouseId',
                                        )(option);
                                      } else {
                                        props.handleChange(
                                          'productWarehouseId',
                                        )('');
                                      }
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row> */}
															{/* <Row>
                              <Col lg={4}>
                                <FormGroup className="text-right">
                                  <Button
                                    color="primary"
                                    type="button"
                                    className="btn-square"
                                    onClick={this.showWarehouseModal}
                                  >
                                    <i className="fa fa-plus"></i> Add a
                                    Warehouse
                                  </Button>
                                </FormGroup>
                              </Col>
                            </Row> */}
															{/* <Row>
                              <Col lg={8}>
                                <FormGroup className="">
                                  <Label htmlFor="description">
                                    Description
                                  </Label>
                                  <Input
                                    type="textarea"
                                    name="productDescription"
                                    id="productDescription"
                                    rows="6"
                                    placeholder="Description..."
                                    onChange={(value) => {
                                      props.handleChange('productDescription')(
                                        value,
                                      );
                                    }}
                                    value={props.values.productDescription}
                                  />
                                </FormGroup>
                              </Col>
                            </Row> */}
															<Row>
																<Col lg={8}>
																	<FormGroup check inline className="mb-3">
																		<Label
																			className="form-check-label"
																			check
																			htmlFor="productPriceTypeOne"
																		>
																			<Input
																				type="checkbox"
																				id="productPriceTypeOne"
																				name="productPriceTypeOne"
																				onChange={(event) => {
																					if (
																						props.values.productPriceType.includes(
																							'SALES',
																						)
																					) {
																						const nextValue = props.values.productPriceType.filter(
																							(value) => value !== 'SALES',
																						);
																						props.setFieldValue(
																							'productPriceType',
																							nextValue,
																						);
																					} else {
																						const nextValue = props.values.productPriceType.concat(
																							'SALES',
																						);
																						props.setFieldValue(
																							'productPriceType',
																							nextValue,
																						);
																					}
																				}}
																				checked={props.values.productPriceType.includes(
																					'SALES',
																				)}
																				className={
																					props.errors.productPriceType &&
																					props.touched.productPriceType
																						? 'is-invalid'
																						: ''
																				}
																				
																			/>
																			{strings.SalesInformation}
																			{props.errors.productPriceType &&
																				props.touched.productPriceType && (
																					<div className="invalid-feedback">
																						{props.errors.productPriceType}
																					</div>
																				)}
																		</Label>
																	</FormGroup>
																	<Row>
																	<Col>
																	<FormGroup className="mb-3">
																		<Label htmlFor="salesUnitPrice">
																			<span className="text-danger">* </span>{' '}
																			{strings.SellingPrice}
																			<i
																				id="SalesTooltip"
																				className="fa fa-question-circle ml-1"
																			></i>
																			<UncontrolledTooltip
																				placement="right"
																				target="SalesTooltip"
																			>
																				Selling price – Price at which your
																				product is sold
																			</UncontrolledTooltip>
																		</Label>
																		<Input
																			type="text"
																			maxLength="10"
																			id="salesUnitPrice"
																			name="salesUnitPrice"
																			placeholder={strings.Enter+strings.SellingPrice}
																			readOnly={
																				props.values.productPriceType.includes(
																					'SALES',
																				)
																					? false
																					: true
																			}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regDecimal.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange('salesUnitPrice')(
																						option,
																					);
																				}
																			}}
																			value={props.values.salesUnitPrice}
																			className={
																				props.errors.salesUnitPrice &&
																				props.touched.salesUnitPrice
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.salesUnitPrice &&
																			props.touched.salesUnitPrice && (
																				<div className="invalid-feedback">
																					{props.errors.salesUnitPrice}
																				</div>
																			)}
																	</FormGroup></Col>
																	<Col>
																	<FormGroup className="mb-3">
																		<Label htmlFor="transactionCategoryId">
																			<span className="text-danger">* </span>{' '}
																			{strings.Account}
																		</Label>
																		<Select
																			styles={customStyles}
																			isDisabled={
																				props.values.productPriceType.includes(
																					'SALES',
																				)
																					? false
																					: true
																			}
																			options={
																				salesCategory ? salesCategory : []
																			}
																			value={
																				salesCategory
																					? props.values
																							.salesTransactionCategoryId
																					: ''
																			}
																			id="salesTransactionCategoryId"
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange(
																						'salesTransactionCategoryId',
																					)(option);
																				} else {
																					props.handleChange(
																						'salesTransactionCategoryId',
																					)('');
																				}
																			}}
																			className={
																				props.errors
																					.salesTransactionCategoryId &&
																				props.touched.salesTransactionCategoryId
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.salesTransactionCategoryId &&
																			props.touched
																				.salesTransactionCategoryId && (
																				<div className="invalid-feedback">
																					{
																						props.errors
																							.salesTransactionCategoryId
																					}
																				</div>
																			)}
																	</FormGroup>
																	</Col>
																	</Row>
																	<FormGroup className="">
																		<Label htmlFor="salesDescription">
																		{strings.Description}
																		</Label>
																		<Input
																			readOnly={
																				props.values.productPriceType.includes(
																					'SALES',
																				)
																					? false
																					: true
																			}
																			type="textarea"
																			maxLength="50"
																			name="salesDescription"
																			id="salesDescription"
																			rows="3"
																			placeholder={strings.Description}
																			onChange={(value) => {
																				props.handleChange('salesDescription')(
																					value,
																				);
																			}}
																			value={props.values.salesDescription}
																		/>
																			</FormGroup>
																		</Col>
																</Row>
															<Row 
													
																					>
																<Col lg={8}>
																	<FormGroup check inline className="mb-3">
																		<Label
																			className="form-check-label"
																			check
																			htmlFor="productPriceTypetwo"
																		>
																			<Input
																				type="checkbox"
																				id="productPriceTypetwo"
																				name="productPriceTypetwo"
																				onChange={(event) => {
																					if (
																						props.values.productPriceType.includes(
																							'PURCHASE',
																						)
																					) {
																						const nextValue = props.values.productPriceType.filter(
																							(value) => value !== 'PURCHASE',
																						);
																						props.setFieldValue(
																							'productPriceType',
																							nextValue,
																						);
																					} else {
																						const nextValue = props.values.productPriceType.concat(
																							'PURCHASE',
																						);
																						console.log(nextValue);
																						props.setFieldValue(
																							'productPriceType',
																							nextValue,
																						);
																					}
																				}}
																				checked={props.values.productPriceType.includes(
																					'PURCHASE',
																				)}
																				className={
																					props.errors.productPriceType &&
																					props.touched.productPriceType
																						? 'is-invalid'
																						: ''
																				}
																				
																			/>
																			{strings.PurchaseInformation}
																			{props.errors.productPriceType &&
																				props.touched.productPriceType && (
																					<div className="invalid-feedback">
																						{props.errors.productPriceType}
																					</div>
																				)}
																		</Label>
																	</FormGroup>
																	<Row>
																	<Col>
																	<FormGroup className="mb-3">
																		<Label htmlFor="salesUnitPrice">
																			<span className="text-danger">* </span>{' '}
																			{strings.PurchasePrice}
																			<i
																				id="PurchaseTooltip"
																				className="fa fa-question-circle ml-1"
																			></i>
																			<UncontrolledTooltip
																				placement="right"
																				target="PurchaseTooltip"
																			>
																				Purchase price – Amount of money you
																				paid for the product
																			</UncontrolledTooltip>
																		</Label>
																		<Input
																		type="text"
																			maxLength="10"
																			id="purchaseUnitPrice"
																			name="purchaseUnitPrice"
																			
																			placeholder={strings.Enter+strings.PurchasePrice}
																			disabled={props.values.isInventoryEnabled===true }
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regDecimal.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange(
																						'purchaseUnitPrice',
																					)(option);
																				}
																			}}
																			readOnly={
																				props.values.productPriceType.includes(
																					'PURCHASE',
																				)
																					? false
																					: true
																			}
																			value={props.values.purchaseUnitPrice}
																			className={
																				props.errors.purchaseUnitPrice &&
																				props.touched.purchaseUnitPrice
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.purchaseUnitPrice &&
																			props.touched.purchaseUnitPrice && (
																				<div className="invalid-feedback">
																					{props.errors.purchaseUnitPrice}
																					{props.values.isInventoryEnabled===true }
																				</div>
																			)}
																	</FormGroup>
																	</Col>
																	<Col>	
																	<FormGroup className="mb-3">
																		<Label htmlFor="salesUnitPrice">
																			<span className="text-danger">* </span>{' '}
																			{strings.Account}
																		</Label>
																		<Select
																			styles={customStyles}
																			isDisabled={
																				props.values.productPriceType.includes(
																					'PURCHASE',
																				)
																					? false
																					: true
																			}
																			options={
																				purchaseCategory ? purchaseCategory : []
																			}
																			value={
																				purchaseCategory
																					? props.values
																							.purchaseTransactionCategoryId
																					: ''
																			}
																			id="purchaseTransactionCategoryId"
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange(
																						'purchaseTransactionCategoryId',
																					)(option);
																				} else {
																					props.handleChange(
																						'purchaseTransactionCategoryId',
																					)('');
																				}
																			}}
																			className={
																				props.errors
																					.purchaseTransactionCategoryId &&
																				props.touched
																					.purchaseTransactionCategoryId
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors
																			.purchaseTransactionCategoryId &&
																			props.touched
																				.purchaseTransactionCategoryId && (
																				<div className="invalid-feedback">
																					{
																						props.errors
																							.purchaseTransactionCategoryId
																					}
																				</div>
																			)}
																	</FormGroup></Col></Row>
																	<FormGroup className="">
																		<Label htmlFor="purchaseDescription">
																		{strings.Description}
																		</Label>
																		<Input
																			readOnly={
																				props.values.productPriceType.includes(
																					'PURCHASE',
																				)
																					? false
																					: true
																			}
																			type="textarea"
																			maxLength="50"
																			name="purchaseDescription"
																			id="purchaseDescription"
																			rows="3"
																			placeholder={strings.Description}
																			onChange={(value) => {
																				props.handleChange(
																					'purchaseDescription',
																				)(value);
																			}}
																			value={props.values.purchaseDescription}
																		/>
																	</FormGroup>
																</Col>
															</Row>
															
															<hr></hr>
															
															<Row 
															style={{display: 
																				props.values.productPriceType.includes(
																					'PURCHASE' 
																				
																				)&& props.values.productType !=
																				'SERVICE'
																		
																			?'' : 'none'
																
																			}}
																		
																			>
																<Col lg={8}>
																	<FormGroup check inline className="mb-3">
																		<Label
																			className="form-check-label"
																			check
																			htmlFor="isInventoryEnabled"
																		>
																			<Input
																			className="form-check-input"
																			type="checkbox"
																			id="is"
																			name="isInventoryEnabled"
																			onChange={(value) => {
																				props.handleChange('isInventoryEnabled')(value);
																			}}
																			checked={props.values.isInventoryEnabled}
																				
																			
																				className={
																					props.errors.productPriceType &&
																					props.touched.productPriceType
																						? 'is-invalid'
																						: ''
																				}
																			/>
																		 {strings.EnableInventory}
																			{props.errors.productPriceType &&
																				props.touched.productPriceType && (
																					<div className="invalid-feedback">
																						{props.errors.productPriceType}
																					</div>
																				)}
																		</Label>
																	</FormGroup>

																	<Row style={{display: props.values.isInventoryEnabled === false ? 'none' : ''}}>
																	<Col>	
																	<FormGroup className="mb-3">
																		<Label htmlFor="salesUnitPrice">
																			{/* <span className="text-danger">* </span>{' '} */}
																			<span className="text-danger">* </span> {strings.InventoryAccount}
																		</Label>
																		<Select
																			styles={customStyles}
																			// isDisabled={
																			// 	props.values.productPriceType.includes(
																			// 		'INVENTORY',
																			// 	)
																			// 		? false
																			// 		: true
																			// }
																			options={
																				inventoryAccount ? inventoryAccount : []
																			}
																			value={
																				inventoryAccount
																					? props.values
																							.transactionCategoryId
																					: ''
																			}
																			id="transactionCategoryId"
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange(
																						'transactionCategoryId',
																					)(option);
																				} else {
																					props.handleChange(
																						'transactionCategoryId',
																					)('');
																				}
																			}}
																			className={
																				props.errors
																					.transactionCategoryId &&
																				props.touched
																					.transactionCategoryId
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors
																			.transactionCategoryId &&
																			props.touched
																				.transactionCategoryId && (
																				<div className="invalid-feedback">
																					{
																						props.errors
																							.transactionCategoryId
																					}
																				</div>
																			)}
																	</FormGroup></Col>
																	<Col>
																	<FormGroup className="mb-3">
																		<Label htmlFor="inventoryQty">
																			{/* <span className="text-danger">* </span>{' '} */}
																			<span className="text-danger">* </span>	 {strings.OpeningBalanceQuantity}
																			
																		</Label>
																		<Input
																		type="text"
																		min="0"
																			maxLength="10"
																			id="inventoryQty"
																			name="inventoryQty"
																			placeholder={strings.Enter+strings.OpeningBalanceQuantity}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regEx.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange(
																						'inventoryQty',
																					)(option);
																				}
																			}}
																			// readOnly={
																			// 	props.values.productPriceType.includes(
																			// 		'INVENTORY',
																			// 	)
																			// 		? false
																			// 		: true
																			// }
																			value={props.values.inventoryQty}
																			className={
																				props.errors.inventoryQty &&
																				props.touched.inventoryQty
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.inventoryQty &&
																			props.touched.inventoryQty && (
																				<div className="invalid-feedback">
																					{props.errors.inventoryQty}
																				</div>
																			)}
																	</FormGroup>
																	</Col>
																</Row>
																<Row style={{display: props.values.isInventoryEnabled === false ? 'none' : ''}}>
																<Col>
																	<FormGroup className="mb-3">
																		<Label htmlFor="inventoryPurchasePrice">
																			{/* <span className="text-danger">* </span>{' '} */}
																			<span className="text-danger">* </span>	{strings.PurchasePrice}
																		</Label>
																		<Input
																		type="text"
																		min="0"
																			maxLength="10"
																			id="inventoryPurchasePrice"
																			name="inventoryPurchasePrice"
																			placeholder={strings.Enter+strings.PurchasePrice}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regDecimal.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange(
																						'inventoryPurchasePrice',
																					)(option);
																				}
																			}}
																			// readOnly={
																			// 	props.values.productPriceType.includes(
																			// 		'INVENTORY',
																			// 	)
																			// 		? false
																			// 		: true
																			// }
																			value={props.values.inventoryPurchasePrice}
																			className={
																				props.errors.inventoryPurchasePrice &&
																				props.touched.inventoryPurchasePrice
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.inventoryPurchasePrice &&
																			props.touched.inventoryPurchasePrice && (
																				<div className="invalid-feedback">
																					{props.errors.inventoryPurchasePrice}
																				</div>
																			)}
																	<i>*Note :Inventory Purchase price will be considered </i>
																		 
																		
																	</FormGroup>
																	</Col>
																	<Col>
																	<FormGroup className="mb-3">
																	<Label htmlFor="contactId">
																		{/* <span className="text-danger">* </span> */}
																		  {strings.SupplierName}
																	</Label>
																	<Select
																		// isDisabled={
																		// 	props.values.productPriceType.includes(
																		// 		'INVENTORY',
																		// 	)
																		// 		? false
																		// 		: true
																		// }
																		styles={customStyles}
																		id="contactId"
																		name="contactId"
																		placeholder={strings.Select+strings.SupplierName}
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
																		value={props.values.contactId}
																		onChange={(option) => {
																			if (option && option.value) {
																				
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
																</Row>
																<Row style={{display: props.values.isInventoryEnabled === false ? 'none' : ''}}>
																	<Col lg={6}>
																	<FormGroup className="">
																		<Label htmlFor="inventoryReorderLevel">
																		  {strings.ReOrderLevel}
																		</Label>
																		<Input
																			// readOnly={
																			// 	props.values.productPriceType.includes(
																			// 		'INVENTORY',
																			// 	)
																			// 		? false
																			// 		: true
																			// }
																			type="text"
																			min="0"
																			max="1000"
																			maxLength="5"
																			name="inventoryReorderLevel"
																			id="inventoryReorderLevel"
																			rows="3"
																			placeholder={strings.Enter+strings.InventoryReorderLevel}
																			// onChange={(value) => {
																			// 	props.handleChange(
																			// 		'inventoryReorderLevel',
																			// 	)(value);
																			// }}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regDecimal5.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange(
																						'inventoryReorderLevel',
																					)(option);
																				}
																			}}
																			value={props.values.inventoryReorderLevel}
																			className={
																				props.errors.inventoryReorderLevel &&
																				props.touched.inventoryReorderLevel
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.inventoryReorderLevel &&
																		props.touched.inventoryReorderLevel && (
																			<div className="invalid-feedback">
																				{props.errors.inventoryReorderLevel}
																			</div>
																		)}
																	</FormGroup>
																	</Col>
																	
																	</Row>
																
																</Col>
															</Row>
															
															<Row>
																<Col lg={12} className="mt-5">
																	<FormGroup className="text-right" disabled={this.state.disabled}>
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
																			name="button"
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
																			<i className="fa fa-refresh"></i> 	{this.state.disabled
																			? 'Creating...'
																			: strings.CreateandMore }
																		</Button>
																		<Button
																			color="secondary"
																			className="btn-square"
																			onClick={() => {
																				this.props.history.push(
																					'/admin/master/product',
																				);
																			}}
																		>
																			<i className="fa fa-ban"></i> {strings.Cancel}
																		</Button>
																	</FormGroup>
																</Col>
															</Row>
														</Form>
													);
												}}
											</Formik>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>

				<WareHouseModal
					openModal={this.state.openWarehouseModal}
					closeWarehouseModal={this.closeWarehouseModal}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProduct);
