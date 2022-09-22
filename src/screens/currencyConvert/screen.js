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
} from 'reactstrap';
import { toast } from 'react-toastify';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { CommonActions } from 'services/global';
import { Loader, ConfirmDeleteModal } from 'components';
import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.scss';
import * as CurrencyConvertActions from './actions';
import {data}  from '../Language/index'
import LocalizedStrings from 'react-localization';
import config from 'constants/config';
// import { AgGridReact,AgGridColumn } from 'ag-grid-react/lib/agGridReact';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const mapStateToProps = (state) => {
	return {
		
		currency_convert_list: state.currencyConvert.currency_convert_list,
		currency_converstion_list: state.currencyConvert.currency_converstion_list
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

let strings = new LocalizedStrings(data);
class CurrencyConvert extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			language: window['localStorage'].getItem('language'),
			// openDeleteModal: true,
			loading: true,
			selectedRows: [],
			filterData: {
				currencyCode:'',
				currencyCodeConvertedTo:'',
				exchangeRate:'',
			},
			paginationPageSize:10,
			csvData: [],
			view: false,
		};

		this.options = {
			onRowClick: config.ADD_CURRENCY ? this.goToDetail :()=>{},
			
		};

		this.selectRowProp = {
			//mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
			clickToSelect: false,
		};
		this.csvLink = React.createRef();
	}

	// onRowSelect = (row, isSelected, e) => {
	// 	let tempList = [];
	// 	if (isSelected) {
	// 		tempList = Object.assign([], this.state.selectedRows);
	// 		tempList.push(row.currencyConversionId);
	// 	} else {
	// 		this.state.selectedRows.map((item) => {
	// 			if (item !== row.currencyConversionId) {
	// 				tempList.push(item);
	// 			}
	// 			return item;
	// 		});
	// 	}
	// 	this.setState({
	// 		selectedRows: tempList,
	// 	});
	// };

	// onSelectAll = (isSelected, rows) => {
	// 	this.setState({
	// 		selectedRows: isSelected ? rows.map((row) => row.id) : [],
	// 	});
	// };

	// -------------------------
	// Data Table Custom Fields
	//--------------------------

	goToDetail = (row) => {
		{row.currencyConversionId === 10000 ? (	
			this.props.commonActions.tostifyAlert(
			'error',
			'Cannot Edit Base Currency'
		)) : (
				this.props.history.push(`/admin/master/currencyConvert/detail`, {
			id: row.currencyConversionId,
		})
		)
	}
	
	};


	goToCurrencyDetail = (currencyId) => {
		 
		{currencyId === 1 ? (	
			this.props.commonActions.tostifyAlert(
			'error',
			'Cannot Edit Base Currency'
		)) : (
				this.props.history.push(`/admin/master/currencyConvert/detail`, {
			id: currencyId,
		})
		)
	}
	
	};

	// Show Success Toast
	success = (res) => {
		return toast.success(
			'success',
			res.data ? res.data.message : '	Currency Conversion Deleted Successfully.', 
			{
			position: toast.POSITION.TOP_RIGHT,
		});
	};

	componentDidMount = () => {
		this.initializeData();
	};

	componentWillUnmount = () => {
		this.setState({
			selectedRows: [],
		});
	};

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
		this.props.currencyConvertActions
			.getCurrencyConversion(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ loading: false });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Currency Conversion Deleted Unsuccessfully',
				);
			});
	};

	renderCurrency = (cell, row) => {
		if (row.currencyName) {
			return (
				<label className="badge label-currency mb-0">{row.currencyName}</label>
			);
		} else {
			return <label className="badge badge-danger mb-0">No Specified</label>;
		}
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
	renderBaseCurrency = (cell, row) => {
		if (row.description) {
			return (
				<label className="badge label-currency mb-0">{row.description}</label>
			);
		} else {
			return <label className="badge badge-danger mb-0">No Specified</label>;
		}
	};
	
	onSizePerPageList = (sizePerPage) => {
		if (this.options.sizePerPage !== sizePerPage) {
			this.options.sizePerPage = sizePerPage;
			this.initializeData();
		}
	};

	onPageSizeChanged = (newPageSize) => {
		var value = document.getElementById('page-size').value;
		this.gridApi.paginationSetPageSize(Number(value));
	};
	onGridReady = (params) => {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
	};
 
	
	onPageChange = (page, sizePerPage) => {
		if (this.options.page !== page) {
			this.options.page = page;
			this.initializeData();
		}
	};

	sortColumn = (sortName, sortOrder) => {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		this.initializeData();
	};

	// -------------------------
	// Actions
	//--------------------------

	// Delete Vat By ID
	bulkDelete = () => {
		const { selectedRows } = this.state;
		const message1 =
			<text>
			<b>Delete Product Category?</b>
			</text>
			const message = 'This Product Category will be deleted permanently and cannot be recovered. ';
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
	};

	// removeBulk = () => {
	// 	let { selectedRows } = this.state;
	// 	const { product_category_list } = this.props;
	// 	let obj = {
	// 		ids: selectedRows,
	// 	};
	// 	this.removeDialog();
	// 	this.props.productCategoryActions
	// 		.deleteProductCategory(obj)
	// 		.then((res) => {
	// 			this.initializeData();
	// 			this.props.commonActions.tostifyAlert(
	// 				'success',
	// 				'Product Category Deleted Successfully',
	// 			);
	// 			if (
	// 				product_category_list &&
	// 				product_category_list.data &&
	// 				product_category_list.data.length > 0
	// 			) {
	// 				this.setState({
	// 					selectedRows: [],
	// 				});
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			this.props.commonActions.tostifyAlert(
	// 				'error',
	// 				err && err.data ? err.data.message : 'Something Went Wrong',
	// 			);
	// 		});
	// };

	// removeDialog = () => {
	// 	this.setState({
	// 		dialog: null,
	// 	});
	// };
	// deleteProductCategory() {
	//   // this.setState({ loading: true })
	//   this.setState({ openDeleteModal: false })
	//   const data = {
	//     ids: this.state.selectedRows
	//   }
	//   this.props.productCategoryActions.deleteProductCategory(data).then((res) => {
	//     if (res.status === 200) {
	//       // this.setState({ loading: false })
	//       this.initializeData()
	//     }
	//   }).catch((err) => {
	//     this.setState({ openDeleteModal: false })
	//   })
	// }

	// Open Confirm Modal
	// showConfirmModal() {
	//   this.setState({ openDeleteModal: true })
	// }
	// // Delete Confirm Modal
	// closeConfirmModal() {
	//   this.setState({ openDeleteModal: false })
	// }

	handleFilterChange = (e, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: e.target.value,
			}),
		});
	};
	handleSearch = () => {
		this.initializeData();
	};

	// getCsvData = () => {
	// 	if (this.state.csvData.length === 0) {
	// 		let obj = {
	// 			paginationDisable: true,
	// 		};
	// 		this.props.productCategoryActions
	// 			.getProductCategoryList(obj)
	// 			.then((res) => {
	// 				if (res.status === 200) {
	// 					this.setState({ csvData: res.data.data, view: true }, () => {
	// 						setTimeout(() => {
	// 							this.csvLink.current.link.click();
	// 						}, 0);
	// 					});
	// 				}
	// 			});
	// 	} else {
	// 		this.csvLink.current.link.click();
	// 	}
	// };

	clearAll = () => {
		this.setState(
			{
				filterData: {
					
				},
			},
			() => {
				this.initializeData();
			},
		);
	};

	getActionButtons = (params) => {
		return (
	<>
	{/* BUTTON ACTIONS */}
			{/* View */}
			<Button
				className="Ag-gridActionButtons btn-sm"
				title='Edit'
				color="secondary"

				onClick={()=>this.goToCurrencyDetail(params.data.currencyConversionId) }    
			
			>		<i className="fas fa-edit"/> </Button>
	</>
		)
	}

	render() {
		strings.setLanguage(this.state.language);
		const {
			loading,
			selectedRows,
			dialog,
			csvData,
			view,
			filterData,
		} = this.state;
		const { currency_converstion_list } = this.props;

		// let display_data = this.filterVatList(vatList)

		return (
			loading ==true? <Loader/> :
<div>
			<div className="vat-code-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<div className="h4 mb-0 d-flex align-items-center">
								<i className="nav-icon icon-briefcase" />
								<span className="ml-2"> {strings.CurrencyRate}</span>
							</div>
						</CardHeader>
						<CardBody>
							{dialog}
							{loading ? (
								<Loader></Loader>
							) : (
								<Row>
									{
										<Col lg={12}>
										<div className="d-flex justify-content-end">
											<ButtonGroup className="toolbar" size="sm">
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
														filename={'ProductCategory.csv'}
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
											{ config.ADD_CURRENCY && <Button
											color="primary"
											className="btn-square pull-right"
											style={{ marginBottom: '10px' }}
											onClick={() =>
												this.props.history.push(
													`/admin/master/CurrencyConvert/create`,
												)
											}
										>
											<i className="fas fa-plus mr-1" />
											 {strings.AddNewCurrencyConversion}
										</Button>}
										</div>
										{/* <div className="py-3">
											<h5>Filter : </h5>
											<form onSubmit={this.handleSubmit}>
												<Row>
													<Col lg={4} className="mb-1">
														<Input
															type="text"
															name="code"
															placeholder="Product Category Code"
															value={filterData.productCategoryCode}
															// value={productCategoryCode ? productCategoryCode: ''}
															onChange={(e) => {
																this.handleFilterChange(
																	e,
																	'productCategoryCode',
																);
															}}
														/>
													</Col>
													<Col lg={4} className="mb-1">
														<Input
															type="text"
															name="name"
															placeholder="Product Category Name"
															value={filterData.productCategoryName}
															autoComplete="off"
															// value={productCategoryName ?  productCategoryName : ''}
															onChange={(e) => {
																this.handleFilterChange(
																	e,
																	'productCategoryName',
																);
															}}
														/>
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
										</div> */}
										
										<BootstrapTable
											data={currency_converstion_list}
											hover
											pagination
											version="4"
											search={false}
											selectRow={this.selectRowProp}
											options={this.options}
											trClassName="cursor-pointer"
										>
											<TableHeaderColumn
												dataField="currencyName"
												dataSort
												isKey={true}
												dataFormat={this.renderCurrency}
												className="table-header-bg"
											>
												{strings. CURRENCYNAME}
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="description"
												dataSort
												dataFormat={this.renderBaseCurrency}
												className="table-header-bg"
											>
												 {strings.CURRENCYNAMECONVERTEDTO}
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="exchangeRate"
												dataSort
												className="table-header-bg"
											>
												{strings.EXCHANGERATE}
											</TableHeaderColumn>
											<TableHeaderColumn 
											dataField="isActive"
											dataFormat={this.renderStatus}
											className="table-header-bg"
											dataSort>
												 {strings.Status}
											</TableHeaderColumn>
										</BootstrapTable>

{/* <div className="ag-theme-alpine mb-3" style={{ height: 590,width:"100%" }}>
			<AgGridReact
				rowData={currency_converstion_list &&
					currency_converstion_list 
					? currency_converstion_list
						: []}
					//  suppressDragLeaveHidesColumns={true}
				// pivotMode={true}
				// suppressPaginationPanel={false}
				pagination={true}
				rowSelection="multiple"
				// paginationPageSize={10}
				// paginationAutoPageSize={true}
				paginationPageSize={this.state.paginationPageSize}
					floatingFilter={true}
					defaultColDef={{ 
								resizable: true,
								flex: 1,
								sortable: true
							}}
				sideBar="columns"
				onGridReady={this.onGridReady}
					>

				<AgGridColumn field="currencyName" 
				headerName=   {strings.CURRENCY}
				sortable={ true } 
				filter={ true } 
				enablePivot={true} 
				cellRendererFramework={(params) => <label
					className="mb-0 label-bank"
					style={{
						cursor: 'pointer',
						}}
				                                                         
		>
		{params.value}
		</label>
}
				></AgGridColumn>

				<AgGridColumn field="description" 
				headerName= {strings.CURRENCYNAMECONVERTEDTO}
				sortable={ true }
				filter={ true }
				enablePivot={true}
				></AgGridColumn>  


				<AgGridColumn field="exchangeRate" 
				headerName=  {strings.Exchangerate}
				sortable={ true }
				enablePivot={true} 
				filter={ true }
				></AgGridColumn>  

			
				
				<AgGridColumn
				headerName={strings.STATUS}
				field="isActive" 
				sortable={ true }
				filter={ true }
				enablePivot={true} 
				cellRendererFramework={(params) => params.value==true ?
													<label className="badge label-success"> Active</label>
													:
													<label className="badge label-due"> InActive</label>
										}
				></AgGridColumn>  
					<AgGridColumn field="action"
										// className="Ag-gridActionButtons"
										headerName="ACTIONS"
										cellRendererFramework={(params) =>
											<div
											 className="Ag-gridActionButtons"
											 >
												{this.getActionButtons(params)}
											</div>

										}
									></AgGridColumn> 	
			
			</AgGridReact>   */}
			{/* <div className="example-header mt-1">
					Page Size:
					<select onChange={() => this.onPageSizeChanged()} id="page-size">
					<option value="10" selected={true}>10</option>
					<option value="100">100</option>
					<option value="500">500</option>
					<option value="1000">1000</option>
					</select>
		</div>										 */}

									</Col>}
								</Row>
							)}
						</CardBody>
					</Card>
					{/* <Modal isOpen={this.state.openDeleteModal}
            className={'modal-danger ' + this.props.className}>
            <ModalHeader toggle={this.toggleDanger}>Delete</ModalHeader>
            <ModalBody>
              Are you sure want to delete this record?
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.deleteProductCategory}>Yes</Button>&nbsp;
                  <Button color="secondary" onClick={this.closeConfirmModal}>No</Button>
            </ModalFooter>
          </Modal> */}
				</div>
			</div>
			</div>			
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyConvert);
