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
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
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
import * as SupplierInvoiceActions from '../../../supplier_invoice/actions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { InventoryModel} from '../../sections';
import moment from 'moment'
function dateFormat(value, row, index) {
	return moment(value).format('DD/MM/YYYY');
 }

const mapStateToProps = (state) => {
	return {
		vat_list: state.product.vat_list,
		product_warehouse_list: state.product.product_warehouse_list,
		product_category_list: state.product.product_category_list,
		supplier_list: state.supplier_invoice.supplier_list,
		inventory_list: state.product.inventory_list,
		inventory_history_list :state.product.inventory_history_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		detailProductActions: bindActionCreators(DetailProductActions, dispatch),
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

class InventoryHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			initValue: {},
			contactType: 1,
			currentData: {},
			selectedRows: [],
			openWarehouseModal: false,
			dialog: null,
			current_inventory_id: null,
		};

		this.selectRowProp = {
			//mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
		this.options = {
			onRowClick: this.goToDetail,
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: '',
			sortOrder: '',
			onSortChange: this.sortColumn,
		};
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
	}

	componentDidMount = () => {
		this.initializeData();
	};
	
	onRowSelect = (row, isSelected, e) => {
		let tempList = [];
		if (isSelected) {
			tempList = Object.assign([], this.state.selectedRows);
			tempList.push(row.id);
		} else {
			this.state.selectedRows.map((item) => {
				if (item !== row.id) {
					tempList.push(item);
				}
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
		});
	};

	initializeData = () => {
	//	if (this.props.location.state && this.props.location.state.id) {
			// this.props.productActions
			// 	.getInventoryHistory()
			// 	.then((res) => {
			// 		if (res.status === 200) {
			// 			this.setState({
			// 				loading: false,
						
			// 			});
			// 		} else {
			// 			this.setState({ loading: false });
			// 			this.props.history.push('/admin/master/product');
			// 		}
			// 	});			
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
		const { current_inventory_id } = this.state;
		console.log(current_inventory_id);
		const inventoryId = current_inventory_id;
		const productCode = data['productCode'];
		const vatCategoryId = data['vatCategoryId'];
		const vatIncluded = data['vatIncluded'];
		const contactId = data['contactId'];
		const isInventoryEnabled = data['isInventoryEnabled'];
		const transactionCategoryId = data['transactionCategoryId'];
	
		const productName = data['productName'];
		const productType = data['productType'];
		const inventoryQty = data['inventoryQty'];
		const inventoryReorderLevel = data['inventoryReorderLevel'];
		const inventoryPurchasePrice = data['inventoryPurchasePrice'];
		const dataNew = {
			
			productCode,
			productName,
			productType,
			vatCategoryId,
			vatIncluded,
			isInventoryEnabled,
			contactId,
			transactionCategoryId,
			inventoryId,
			inventoryQty,
			inventoryReorderLevel,
			inventoryPurchasePrice,
		
		};
		const postData = this.getData(dataNew);
		this.props.productActions
			.updateInventory(postData)
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
	openInventoryModel = (props) => {
		this.setState({ openInventoryModel : true });
	};
	closeInventoryModel = (res) => {
		this.setState({ openInventoryModel: false });
	};
	deleteProduct = () => {
		const { current_product_id } = this.state;
		this.props.productActions
			.getInvoicesCountProduct(current_product_id)
			.then((res) => {
				if (res.data > 0) {
					this.props.commonActions.tostifyAlert(
						'error',
						'You need to delete invoices to delete the Product',
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
	getInventoryId = () => {
		this.props.productActions.getInventoryById()
		.then((res) => {
			if (res.status === 200) {
				this.setState({
					initValue: {
					
					},
				});
			
			}
		});
	};

	renderDate = (cell, rows) => {
		return moment(rows.date).format('DD/MM/YYYY');
	};
	getInventoryById = (data) => {
		this.getInventoryId();
	};

	removeProduct = () => {
		const { current_product_id } = this.state;
		this.props.detailProductActions
			.deleteProduct(current_product_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Product Deleted Successfully')
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
	toggleActionButton = (index) => {
		let temp = Object.assign({}, this.state.actionButtons);
		if (temp[parseInt(index, 10)]) {
			temp[parseInt(index, 10)] = false;
		} else {
			temp[parseInt(index, 10)] = true;
		}
		this.setState({
			actionButtons: temp,
		});
	};
	renderActions = (cell, row) => {
		return (
			<div>
				<Button
				onClick={(e, ) => {
					this.openInventoryModel({id: row.inventoryId});
		}}
		>
				</Button>
			</div>
		);
	};

	render() {
		const { vat_list, product_category_list,supplier_list,inventory_history_list,current_inventory_id} = this.props;
		const { loading, dialog, purchaseCategory, salesCategory, inventoryAccount ,singleObject} = this.state;
	 	this.state.singleObject=this.props.inventory_history_list[0];
		//const so=singleObject['productCode'];
		for(let x of Object.keys(this.state.singleObject)){
			console.log(x);
		}
	 console.log(singleObject)
		return (
			<div className="detail-product-screen">
				<div className="animated fadeIn">
					{dialog}
					
						<Row>
							<Col lg={12} className="mx-auto">
								<Card>
									<CardHeader>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="fa fa-history fa-2x" />
													<span className="ml-2">Inventory History</span>
												</div>
											</Col>
										</Row>

									</CardHeader>
									<CardBody>
										
								<div><h5>Product Code :{} </h5></div>
								<div><h5>Product Name :{} </h5></div>
										<div>
											<BootstrapTable
												selectRow={this.selectRowProp}
												search={false}
												options={this.options}
												data={
													inventory_history_list 
														? inventory_history_list
														: []
												}
												version="4"
												hover			
												remote	
												className="product-table"
												trClassName="cursor-pointer"	
											>
											    <TableHeaderColumn dataField="productCode" dataSort className="table-header-bg">
												Product Code
												</TableHeaderColumn>
												<TableHeaderColumn isKey dataField="productname" dataSort className="table-header-bg">
												Product	Name
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="supplierName" dataSort className="table-header-bg">
												Supplier / Customer 
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="date" 
												dataSort 
												dataFormat={this.renderDate} className="table-header-bg">
												Date
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="transactionType" dataSort className="table-header-bg">
												Transaction Type
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="invoiceNumber" dataSort className="table-header-bg">
												Invoice Number
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="unitCost" dataSort className="table-header-bg">
												Unit Cost
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="unitSellingPrice" dataSort className="table-header-bg">
												Unit Selling Price
												</TableHeaderColumn >
											</BootstrapTable>
										</div>		
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

export default connect(mapStateToProps, mapDispatchToProps)(InventoryHistory);
