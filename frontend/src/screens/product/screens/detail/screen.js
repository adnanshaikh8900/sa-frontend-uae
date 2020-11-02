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
} from 'reactstrap';
import Select from 'react-select';

import { Formik } from 'formik';
import * as Yup from 'yup';

import _ from 'lodash';

import './style.scss';

import * as ProductActions from '../../actions';

import { WareHouseModal } from '../../sections';

import { Loader, ConfirmDeleteModal } from 'components';
import { selectOptionsFactory } from 'utils';
import * as DetailProductActions from './actions';
import { CommonActions } from 'services/global';

const mapStateToProps = (state) => {
	return {
		vat_list: state.product.vat_list,
		product_warehouse_list: state.product.product_warehouse_list,
		product_category_list: state.product.product_category_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		detailProductActions: bindActionCreators(DetailProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
		},
	}),
};

class DetailProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			initValue: {},
			currentData: {},
			openWarehouseModal: false,
			dialog: null,
			current_product_id: null,
		};

		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		if (this.props.location.state && this.props.location.state.id) {
			this.props.productActions.getProductCategoryList();
			this.props.productActions.getProductVatCategoryList();
			//this.props.productActions.getProductWareHouseList();
			this.salesCategory();
			this.purchaseCategory();
			this.props.detailProductActions
				.getProductById(this.props.location.state.id)
				.then((res) => {
					if (res.status === 200) {
						let productPriceType;
						if (res.data.productPriceType === 'BOTH') {
							productPriceType = ['SALES', 'PURCHASE'];
						} else {
							productPriceType = [res.data.productPriceType];
						}
						this.setState({
							loading: false,
							current_product_id: this.props.location.state.id,
							initValue: {
								productName: res.data.productName ? res.data.productName : '',
								productCode: res.data.productCode,
								vatCategoryId: res.data.vatCategoryId
									? res.data.vatCategoryId
									: '',
								unitPrice: res.data.unitPrice,
								productCategoryId: res.data.productCategoryId
									? res.data.productCategoryId
									: '',
								productWarehouseId: res.data.productWarehouseId
									? res.data.productWarehouseId
									: '',
								vatIncluded: res.data.vatIncluded,
								salesUnitPrice: res.data.salesUnitPrice
									? res.data.salesUnitPrice
									: '',
								salesTransactionCategoryId: res.data.salesTransactionCategoryId
									? res.data.salesTransactionCategoryId
									: '',
								salesDescription: res.data.salesDescription
									? res.data.salesDescription
									: '',
								purchaseUnitPrice: res.data.purchaseUnitPrice
									? res.data.purchaseUnitPrice
									: '',
								purchaseTransactionCategoryId: res.data
									.purchaseTransactionCategoryId
									? res.data.purchaseTransactionCategoryId
									: '',
								purchaseDescription: res.data.purchaseDescription
									? res.data.purchaseDescription
									: '',
								productType: res.data.productType ? res.data.productType : '',
								productPriceType: res.data.productPriceType
									? productPriceType
									: '',
								salesTransactionCategoryLabel: res.data
									.salesTransactionCategoryLabel
									? res.data.salesTransactionCategoryLabel
									: '',
								purchaseTransactionCategoryLabel: res.data
									.purchaseTransactionCategoryLabel
									? res.data.purchaseTransactionCategoryLabel
									: '',
							},
						});
					} else {
						this.setState({ loading: false });
						this.props.history.push('/admin/master/product');
					}
				});
		} else {
			this.props.history.push('/admin/master/product');
		}
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
								//console.log(this.state.salesCategory);
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

	handleChange = (e, name) => {
		this.setState({
			currentData: _.set(
				{ ...this.state.currentData },
				e.target.name && e.target.name !== '' ? e.target.name : name,
				e.target.type === 'checkbox' ? e.target.checked : e.target.value,
			),
		});
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

	handleSubmit = (data) => {
		const { current_product_id } = this.state;
		const productID = current_product_id;
		const productCode = data['productCode'];
		const salesUnitPrice = data['salesUnitPrice'];
		const salesTransactionCategoryId = data['salesTransactionCategoryId'];
		const salesDescription = data['salesDescription'];
		const purchaseDescription = data['purchaseDescription'];
		const purchaseTransactionCategoryId = data['purchaseTransactionCategoryId'];
		const purchaseUnitPrice = data['purchaseUnitPrice'];
		const vatCategoryId = data['vatCategoryId'];
		const vatIncluded = data['vatIncluded'];
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
			productID,
			productCode,
			productName,
			productType,
			productPriceType,
			vatCategoryId,
			vatIncluded,

			...(salesUnitPrice.length !== 0 &&
				data['productPriceType'].includes('SALES') && {
					salesUnitPrice,
				}),
			...(salesTransactionCategoryId.length !== 0 &&
				data['productPriceType'].includes('SALES') && {
					salesTransactionCategoryId,
				}),
			...(salesDescription.length !== 0 &&
				data['productPriceType'].includes('SALES') && {
					salesDescription,
				}),
			...(purchaseDescription.length !== 0 &&
				data['productPriceType'].includes('PURCHASE') && {
					purchaseDescription,
				}),
			...(purchaseTransactionCategoryId.length !== 0 &&
				data['productPriceType'].includes('PURCHASE') && {
					purchaseTransactionCategoryId,
				}),
			...(purchaseUnitPrice.length !== 0 &&
				data['productPriceType'].includes('PURCHASE') && {
					purchaseUnitPrice,
				}),
		};
		const postData = this.getData(dataNew);
		this.props.detailProductActions
			.updateProduct(postData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Product Updated Successfully',
					);
					this.props.history.push('/admin/master/product');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	showWarehouseModal = () => {
		this.setState({ openWarehouseModal: true });
	};
	// Cloase Confirm Modal
	closeWarehouseModal = () => {
		this.setState({ openWarehouseModal: false });
		this.props.productActions.getProductWareHouseList();
	};

	deleteProduct = () => {
		const { current_product_id } = this.state;
		this.props.productActions
			.getInvoicesCountProduct(current_product_id)
			.then((res) => {
				if (res.data > 0) {
					this.props.commonActions.tostifyAlert(
						'error',
						'You need to delete invoices to delete the contact',
					);
				} else {
					const message1 =
			<text>
			<b>Delete Product?</b>
			</text>
			const message = 'This Product will be deleted permanently and cannot be recovered. ';
					this.setState({
						dialog: (
							<ConfirmDeleteModal
								isOpen={true}
								okHandler={this.removeProduct}
								cancelHandler={this.removeDialog}
								message={message}
								message1={message1}
								
							/>
						),
					});
				}
			});
	};

	removeProduct = () => {
		const { current_product_id } = this.state;
		this.props.detailProductActions
			.deleteProduct(current_product_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.history.push('/admin/master/product');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	render() {
		const { vat_list, product_category_list } = this.props;
		const { loading, dialog, purchaseCategory, salesCategory } = this.state;
		return (
			<div className="detail-product-screen">
				<div className="animated fadeIn">
					{dialog}
					{loading ? (
						<Loader></Loader>
					) : (
						<Row>
							<Col lg={12} className="mx-auto">
								<Card>
									<CardHeader>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="fas fa-object-group" />
													<span className="ml-2">Update Product</span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<Row>
											<Col lg={12}>
												<Formik
													initialValues={this.state.initValue}
													onSubmit={(values, { resetForm }) => {
														this.handleSubmit(values);
														// resetForm(this.state.initValue)

														// this.setState({
														//   selectedWareHouse: null,
														//   selectedParentProduct: null,
														//   selectedVatCategory: null,
														// })
													}}
													validationSchema={Yup.object().shape({
														productName: Yup.string().required(
															'Product Name is Required',
														),
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
													{(props) => (
														<Form onSubmit={props.handleSubmit}>
															<Row>
																<Col lg={12}>
																	<FormGroup check inline className="mb-3">
																		<Label className="productlabel">Type</Label>
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
																						props.values.productType ===
																							'GOODS' || ''
																					}
																				/>
																				Goods
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
																							'SERVICE' || ''
																					}
																				/>
																				Service
																			</Label>
																		</div>
																	</FormGroup>
																</Col>
															</Row>
															<Row>
																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="productName">
																			<span className="text-danger">*</span>Name
																		</Label>
																		<Input
																			type="text"
																			id="productName"
																			name="productName"
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExAlpha.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange('productName')(
																						option,
																					);
																				}
																			}}
																			value={props.values.productName || ''}
																			placeholder="Enter Product Name"
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
																			<span className="text-danger">*</span>
																			Product Code
																		</Label>
																		<Input
																			type="text"
																			id="productCode"
																			name="productCode"
																			value={props.values.productCode || ''}
																			placeholder="Enter Product Code"
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
																			}}
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
																			Product Category
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
																			value={
																				product_category_list &&
																				product_category_list.data &&
																				selectOptionsFactory
																					.renderOptions(
																						'productCategoryName',
																						'id',
																						product_category_list.data,
																						'Product Category',
																					)
																					.find(
																						(option) =>
																							option.value ===
																							+props.values.productCategoryId,
																					)
																			}
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

																<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="vatCategoryId">
																			<span className="text-danger">*</span>Vat
																			Percentage
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
																			value={
																				vat_list &&
																				selectOptionsFactory
																					.renderOptions(
																						'name',
																						'id',
																						vat_list,
																						'Vat',
																					)
																					.find(
																						(option) =>
																							option.value ===
																							+props.values.vatCategoryId,
																					)
																			}
																			onChange={(option) => {
																				this.setState({
																					selectedVatCategory: option.value,
																				});

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
															<Row>
																<Col lg={12}>
																	<FormGroup check inline className="mb-3">
																		<Input
																			className="form-check-input"
																			type="checkbox"
																			id="vatIncluded"
																			name="vatIncluded"
																			onChange={props.handleChange}
																			defaultChecked={props.values.vatIncluded}
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
															</Row>

															<Row className="secondary-info">
																<Col lg={4}>
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
																			Sales Information
																			{props.errors.productPriceType &&
																				props.touched.productPriceType && (
																					<div className="invalid-feedback">
																						{props.errors.productPriceType}
																					</div>
																				)}
																		</Label>
																	</FormGroup>
																	<FormGroup className="mb-3">
																		<Label htmlFor="salesUnitPrice">
																			<span className="text-danger">*</span>{' '}
																			Selling Price
																		</Label>
																		<Input
																			type="text"
																			id="salesUnitPrice"
																			name="salesUnitPrice"
																			placeholder="Enter Selling Price"
																			readOnly={
																				props.values.productPriceType &&
																				props.values.productPriceType.includes(
																					'SALES',
																				)
																					? false
																					: true
																			}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regEx.test(option.target.value)
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
																	</FormGroup>
																	<FormGroup className="mb-3">
																		<Label htmlFor="transactionCategoryId">
																			Category
																		</Label>
																		<Select
																			styles={customStyles}
																			isDisabled={
																				props.values.productPriceType &&
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
																				salesCategory &&
																				props.values
																					.salesTransactionCategoryLabel
																					? salesCategory
																							.find(
																								(item) =>
																									item.label ===
																									props.values
																										.salesTransactionCategoryLabel,
																							)
																							.options.find(
																								(item) =>
																									item.value ===
																									+props.values
																										.salesTransactionCategoryId,
																							)
																					: props.values
																							.salesTransactionCategoryId
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
																	<FormGroup className="">
																		<Label htmlFor="salesDescription">
																			Description
																		</Label>
																		<Input
																			readOnly={
																				props.values.productPriceType &&
																				props.values.productPriceType.includes(
																					'SALES',
																				)
																					? false
																					: true
																			}
																			type="textarea"
																			name="salesDescription"
																			id="salesDescription"
																			rows="3"
																			placeholder="Description..."
																			onChange={(value) => {
																				props.handleChange('salesDescription')(
																					value,
																				);
																			}}
																			value={props.values.salesDescription}
																		/>
																	</FormGroup>
																</Col>
																<Col lg={4}>
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
																			Purchase Information
																			{props.errors.productPriceType &&
																				props.touched.productPriceType && (
																					<div className="invalid-feedback">
																						{props.errors.productPriceType}
																					</div>
																				)}
																		</Label>
																	</FormGroup>
																	<FormGroup className="mb-3">
																		<Label htmlFor="salesUnitPrice">
																			<span className="text-danger">*</span>{' '}
																			Purchase Price
																		</Label>
																		<Input
																			type="text"
																			id="purchaseUnitPrice"
																			name="purchaseUnitPrice"
																			placeholder="Enter Purchase Price"
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regEx.test(option.target.value)
																				) {
																					props.handleChange(
																						'purchaseUnitPrice',
																					)(option);
																				}
																			}}
																			readOnly={
																				props.values.productPriceType &&
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
																				</div>
																			)}
																	</FormGroup>

																	<FormGroup className="mb-3">
																		<Label htmlFor="transactionCategoryId">
																			Category
																		</Label>
																		<Select
																			styles={customStyles}
																			isDisabled={
																				props.values.productPriceType &&
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
																				purchaseCategory &&
																				props.values
																					.purchaseTransactionCategoryLabel
																					? purchaseCategory
																							.find(
																								(item) =>
																									item.label ===
																									props.values
																										.purchaseTransactionCategoryLabel,
																							)
																							.options.find(
																								(item) =>
																									item.value ===
																									+props.values
																										.purchaseTransactionCategoryId,
																							)
																					: props.values
																							.purchaseTransactionCategoryId
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
																	</FormGroup>
																	<FormGroup className="">
																		<Label htmlFor="purchaseDescription">
																			Description
																		</Label>
																		<Input
																			readOnly={
																				props.values.productPriceType &&
																				props.values.productPriceType.includes(
																					'PURCHASE',
																				)
																					? false
																					: true
																			}
																			type="textarea"
																			name="purchaseDescription"
																			id="purchaseDescription"
																			rows="3"
																			placeholder="Description..."
																			onChange={(value) => {
																				props.handleChange(
																					'purchaseDescription',
																				)(value);
																			}}
																			value={
																				props.values.purchaseDescription || ''
																			}
																		/>
																	</FormGroup>
																</Col>
															</Row>

															<Row>
																<Col
																	lg={12}
																	className="d-flex align-items-center justify-content-between flex-wrap mt-5"
																>
																	<FormGroup>
																		<Button
																			type="button"
																			name="button"
																			color="danger"
																			className="btn-square"
																			onClick={this.deleteProduct}
																		>
																			<i className="fa fa-trash"></i> Delete
																		</Button>
																	</FormGroup>
																	<FormGroup className="text-right">
																		<Button
																			type="submit"
																			name="submit"
																			color="primary"
																			className="btn-square mr-3"
																		>
																			<i className="fa fa-dot-circle-o"></i>{' '}
																			Update
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
																			<i className="fa fa-ban"></i> Cancel
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
					)}
				</div>
				<WareHouseModal
					openModal={this.state.openWarehouseModal}
					closeWarehouseModal={this.closeWarehouseModal}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct);
