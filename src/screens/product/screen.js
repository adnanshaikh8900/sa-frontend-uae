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
	ButtonGroup,
	FormGroup,
	Input,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import Select from 'react-select';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { Loader, ConfirmDeleteModal, Currency } from 'components';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { selectOptionsFactory } from 'utils';

import * as ProductActions from './actions';
import { CommonActions } from 'services/global';
import { CSVLink } from 'react-csv';

import './style.scss';
import {data}  from '../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		product_list: state.product.product_list,
		vat_list: state.product.vat_list,
		universal_currency_list: state.common.universal_currency_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

let strings = new LocalizedStrings(data);
class Product extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			selectedRows: [],
			dialog: null,
			filterData: {
				name: '',
				productCode: '',
				vatPercentage: '',
			},
			selectedVat: '',
			csvData: [],
			view: false,
			actionButtons: {},
		};

		this.options = {
			// onRowClick: this.goToDetail,
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: '',
			sortOrder: '',
			onSortChange: this.sortColumn,
		};

		this.selectRowProp = {
			//mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
		this.csvLink = React.createRef();
	}

	componentDidMount = () => {
		this.props.productActions.getProductVatCategoryList();
		this.initializeData();
	};

	// componentWillUnmount = () => {
	// 	this.setState({
	// 		selectedRows: [],
	// 	});
	// };

	initializeData = (search) => {
		const { filterData } = this.state;
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage,
		};
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : '',
		};
		const postData = { ...filterData, ...paginationData, ...sortingData };
		this.props.productActions
			.getProductList(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ loading: false });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	goToDetail = (row) => {
		this.props.history.push('/admin/master/product/detail', { id: row.id });
	};

	sortColumn = (sortName, sortOrder) => {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
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

	onSelectAll = (isSelected, rows) => {
		let tempList = [];
		if (isSelected) {
			rows.map((item) => tempList.push(item.id));
		}
		this.setState({
			selectedRows: tempList,
		});
	};

	bulkDelete = () => {
		const { selectedRows } = this.state;
		console.log(selectedRows);
		this.props.productActions
			.getInvoicesCountProduct(selectedRows)
			.then((res) => {
				if (res.data > 0) {
					this.props.commonActions.tostifyAlert(
						'error',
						'You need to delete invoices to delete the product',
					);
				} else {
					const message1 =
			<text>
			<b>Delete Invoices?</b>
			</text>
			const message = 'This Invoices will be deleted permanently and cannot be recovered. ';
					if (selectedRows.length > 0) {
						this.setState({
							dialog: (
								<ConfirmDeleteModal
									isOpen={true}
									okHandler={this.removeBulk}
									cancelHandler={this.removeDialog}
									message={message}
									message1={message1}
								/>
							),
						});
					} else {
						this.props.commonActions.tostifyAlert(
							'info',
							'Please select the rows of the table and try again.',
						);
					}
				}
			});
	};

	removeBulk = () => {
		this.removeDialog();
		let { selectedRows } = this.state;
		const { product_list } = this.props;
		let obj = {
			ids: selectedRows,
		};
		this.props.productActions
			.removeBulk(obj)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						res.data ? res.data.message : 'Product Deleted Successfully',
					);
					this.initializeData();
					if (
						product_list &&
						product_list.data &&
						product_list.data.length > 0
					) {
						this.setState({
							selectedRows: [],
						});
					}
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Product Deleted Unsuccessfully',
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	vatCategoryFormatter = (cell, row) => {
		return row['vatCategory'] !== null ? row['vatCategory']['name'] : '';
	};

	handleChange = (val, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: val,
			}),
		});
	};

	handleSearch = () => {
		this.initializeData();
		// this.setState({})
	};

	onSizePerPageList = (sizePerPage) => {
		if (this.options.sizePerPage !== sizePerPage) {
			this.options.sizePerPage = sizePerPage;
			this.initializeData();
		}
	};

	onPageChange = (page, sizePerPage) => {
		if (this.options.page !== page) {
			this.options.page = page;
			this.initializeData();
		}
	};
	getCsvData = () => {
		if (this.state.csvData.length === 0) {
			let obj = {
				paginationDisable: true,
			};
			this.props.productActions.getProductList(obj).then((res) => {
				if (res.status === 200) {
					this.setState({ csvData: res.data.data, view: true }, () => {
						setTimeout(() => {
							this.csvLink.current.link.click();
						}, 0);
					});
				}
			});
		} else {
			this.csvLink.current.link.click();
		}
	};

	clearAll = () => {
		this.setState(
			{
				filterData: {
					name: '',
					productCode: '',
					vatPercentage: '',
				},
			},
			() => {
				this.initializeData();
			},
		);
	};

	unitPrice(cell, row, extraData) {
		return row.unitPrice === 0 ? (
			<Currency
				value={row.unitPrice}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			<Currency
				value={row.unitPrice}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		);
	}
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

	renderStatus = (cell, row) => {
        let classname = '';
        if (row.isActive === true) {
            classname = 'label-success';
        } else {
            classname = 'label-due';
        }
        return (
            <span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
                {
                    row.isActive === true ?
                        "Active" :
                        "InActive"
                }
            </span>
        );
    };

	renderInventory = (cell, row) => {
        let classname = '';
        if (row.isInventoryEnabled === true) {
            classname = 'label-success';
        } else {
            classname = 'label-due';
        }
        return (
            <span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
                {
                    row.isInventoryEnabled === true ?
                        "Enabled" :
                        "Disabled"
                }
            </span>
        );
    };
	exciseSlabFormatter  = (cell, row) => {
        let exciseTax='';
		if(row.exciseTaxId !=null){
			exciseTax=row.exciseTax
		}
		else{
			exciseTax="-"
		}
        return exciseTax;
    };
	renderType  = (cell, row) => {
        let type='';
		if(row.exciseTaxId !=null){
			type="EXCISE "+row.productType
		}
		else{
			type=row.productType
		}
        return type;
    };
	productType = (cell, row) => {
		return row['producttype'] !== null ? row['producttype']['type'] : '';
	};

	renderActions = (cell, row) => {
		return (
			<div>
				<ButtonDropdown
					isOpen={this.state.actionButtons[row.id]}
					toggle={() => this.toggleActionButton(row.id)}
				>
					<DropdownToggle size="sm" color="primary" className="btn-brand icon">
						{this.state.actionButtons[row.id] === true ? (
							<i className="fas fa-chevron-up" />
						) : (
							<i className="fas fa-chevron-down" />
						)}
					</DropdownToggle>
					<DropdownMenu right>
							<DropdownItem>
								<div
									onClick={() => {
										this.props.history.push(
											'/admin/master/product/detail',
											{ id: row.id },
										);
									}}
								>
									<i className="fas fa-edit" /> {strings.Edit}
								</div>
							</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
			</div>
		);
	};

	render() {
		strings.setLanguage(this.state.language);
		const {
			loading,
			dialog,
			filterData,
			selectedRows,
			csvData,
			view,
		} = this.state;
		const { product_list, vat_list, universal_currency_list } = this.props;

		return (
			<div className="product-screen">
				<div className="animated fadeIn">
					{dialog}
					{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="fas fa-object-group" />
										<span className="ml-2">{strings.Products} </span>
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
										<div className="d-flex justify-content-end">
											<ButtonGroup size="sm">
												{/* <Button
													color="primary"
													className="btn-square mr-1"
													onClick={() => this.getCsvData()}
												>
													<i className="fa glyphicon glyphicon-export fa-download mr-1" />
													Export To CSV
												</Button>
												{view && (
													<CSVLink
														data={csvData}
														filename={'Product.csv'}
														className="hidden"
														ref={this.csvLink}
														target="_blank"
													/>
												)} */}
												{/* <Button
													color="primary"
													className="btn-square mr-1"
													onClick={this.bulkDelete}
													disabled={selectedRows.length === 0}
												>
													<i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
													Bulk Delete
												</Button> */}
											</ButtonGroup>
										</div>
										<div className="py-3">
											<h5>{strings.Filter}: </h5>
											<form>
												<Row>
												<Col lg={3} className="mb-2">
														<Input
														maxLength="25"
															type="text"
															placeholder={strings.ProductCode}
															value={filterData.productCode}
															onChange={(e) => {
																this.handleChange(
																	e.target.value,
																	'productCode',
																);
															}}
														/>
													</Col>
													<Col lg={3} className="mb-1">
														<Input
														maxLength="30"
															type="text"
															placeholder={strings.Name}
															value={filterData.name}
															onChange={(e) => {
																this.handleChange(e.target.value, 'name');
															}}
														/>
													</Col>
													<Col lg={3} className="mb-1">
														<FormGroup className="mb-3">
															<Select
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
																className="select-default-width"
																placeholder={strings.VatPercentage}
																value={filterData.vatPercentage}
																onChange={(option) => {
																	if (option && option.value) {
																		this.handleChange(option, 'vatPercentage');
																	} else {
																		this.handleChange('', 'vatPercentage');
																	}
																}}
															/>
														</FormGroup>
													</Col>
													<Col lg={2} className="pl-0 pr-0">
														<Button
															type="button"
															color="primary"
															className="btn-square mr-1"
															onClick={this.handleSearch}
														>
															<i className="fa fa-search"></i>
														</Button>
														<Button
															type="button"
															color="primary"
															className="btn-square"
															onClick={this.clearAll}
														>
															<i className="fa fa-refresh"></i>
														</Button>
													</Col>
												</Row>
											</form>
										</div>
										<Button
											color="primary"
											className="btn-square pull-right"
											style={{ marginBottom: '10px' }}
											onClick={() =>
												this.props.history.push(`/admin/master/product/create`)
											}
										>
											<i className="fas fa-plus mr-1" />
											{strings.AddnewProduct}
										</Button>
										<div>
											<BootstrapTable
												selectRow={this.selectRowProp}
												search={false}
												options={this.options}
												data={
													product_list && product_list.data
														? product_list.data
														: []
												}
												version="4"
												hover
												pagination={
													product_list &&
													product_list.data &&
													product_list.data.length > 0
														? true
														: false
												}
												remote
												fetchInfo={{
													dataTotalSize: product_list.count
														? product_list.count
														: 0,
												}}
												className="product-table"
												trClassName="cursor-pointer"
												csvFileName="product_list.csv"
												ref={(node) => (this.table = node)}
											>
												<TableHeaderColumn 
													width="10%"
													dataField="productCode" 
													dataSort className="table-header-bg">
													{strings.PRODUCTCODE}
												</TableHeaderColumn>
												<TableHeaderColumn 
													width="20%"
													isKey dataField="name" 
													dataSort className="table-header-bg">
													{strings.NAME}
												</TableHeaderColumn >
												<TableHeaderColumn
													width="8%"
                                                    className="table-header-bg"
                                                    dataField="productType"
                                                    dataSort
                                                    dataFormat={this.renderType}
                                                    >
                                                        {strings.ProductType}

                          						</TableHeaderColumn>
												<TableHeaderColumn
													width="10%"
													dataAlign="center"
                                                    className="table-header-bg"
                                                    dataField="isInventoryEnabled"
                                                    dataSort
                                                    dataFormat={this.renderInventory}
                                                    >
                                                        {strings.Inventory}

                          						</TableHeaderColumn>
												{/* <TableHeaderColumn dataField="description" dataSort>
													Description
												</TableHeaderColumn> */}
												<TableHeaderColumn
													width="18%"
													// dataAlign="right"
													dataField="vatPercentage"
													dataSort
													// dataFormat={this.vatCategoryFormatter}
													className="table-header-bg"
												>
													 {strings.Vat+" "+strings.Type}
												</TableHeaderColumn>
												<TableHeaderColumn
													 dataAlign="center"
													dataField="exciseTax"
													dataSort
												    dataFormat={this.exciseSlabFormatter}
													className="table-header-bg"
												>
													 Excise Slab
												</TableHeaderColumn>
												<TableHeaderColumn
													width="8%"
													dataAlign="right"
													dataField="unitPrice"
													dataSort
													dataFormat={this.unitPrice}
													formatExtraData={universal_currency_list}
													className="table-header-bg"
												>
													 {strings.UNITPRICE}
												</TableHeaderColumn>
												<TableHeaderColumn
													width="10%"
													dataAlign="center"
                                                    className="table-header-bg"
                                                    dataField="isActive"
                                                    dataSort
                                                    dataFormat={this.renderStatus}
                                                    >
                                                        {strings.Status}

                          						</TableHeaderColumn>  
												<TableHeaderColumn
											className="text-right"
											columnClassName="text-right"
											width="5%"
											dataFormat={this.renderActions}
											className="table-header-bg"
										></TableHeaderColumn>
											</BootstrapTable>
										</div>
									</Col>
								</Row>
							)}
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
