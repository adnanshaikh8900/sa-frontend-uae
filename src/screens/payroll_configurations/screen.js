import React from 'react';
import { connect } from 'react-redux';
import {
	Card,

	CardBody,
	Row,
	Col,
	NavItem,
	Nav,
	TabContent,
	NavLink,
	TabPane,

	Button,
	CardHeader,
	ButtonGroup,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import { ConfirmDeleteModal } from 'components'
import * as DesignationActions from '../designation/actions'
import * as EmployeeActions from "../salaryRoles/actions"
import * as SalaryStructureAction from "../salaryStructure/actions"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';
import { bindActionCreators } from 'redux';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import {
	CommonActions
} from 'services/global'
import { data } from '../Language/index'
import LocalizedStrings from 'react-localization';
import { Loader } from 'components';

const mapStateToProps = (state) => {
	return {
		designation_list: state.employeeDesignation.designation_list,
		salaryStructure_list: state.salaryStructure.salaryStructure_list,
		salaryRole_list: state.salaryRoles.salaryRole_list,
		profile: state.auth.profile,
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		designationActions: bindActionCreators(DesignationActions, dispatch),
		salaryStructureActions: bindActionCreators(SalaryStructureAction, dispatch),
		employeeActions: bindActionCreators(EmployeeActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};


let strings = new LocalizedStrings(data);
class PayrollConfigurations extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			dialog: null,
			language: window['localStorage'].getItem('language'),
			openModal: false,
			selectedData: {},
			activeTab: new Array(4).fill('1'),
			filterData: {
				salaryRoleId: '',
				salaryRoleName: ''
			},
			current_employee_id: '',
		};


		this.options = {
			onRowClick: this.goToDetail,
			paginationPosition: 'top',
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: '',
			sortOrder: '',
			onSortChange: this.sortColumn
		}

		this.selectRowProp = {
		  bgColor: 'rgba(0,0,0, 0.05)',
		  clickToSelect: false,
		  onSelect: this.onRowSelect,
		  onSelectAll: this.onSelectAll
		}
		this.csvLink = React.createRef()
	}
	// handleLanguageChange(e) {
	//   e.preventDefault();
	//   let lang = e.target.value;
	//   this.setState(prevState => ({
	//     language: lang
	//   }))
	// }
	componentDidMount = () => {
		window['localStorage'].getItem('accessToken')
		this.initializeData()
		this.initializeDataForDesignations()
		this.initializeDataForStructure()
	}

	componentWillUnmount = () => {
		this.setState({
			selectedRows: []
		})
	}
	renderActions = (cell, row) => {
	
	};
	initializeData = (search) => {  
		if(this.props.location.state!==undefined && this.props.location.state!==null && this.props.location.state.tabNo !== undefined && this.props.location.state.tabNo !== null){
			this.toggle(0, this.props.location.state.tabNo)
		}
		const { filterData } = this.state
		
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage
		}
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : ''
		}
		const postData = { ...filterData, ...paginationData, ...sortingData }
		this.props.employeeActions.getSalaryRoleList(postData).then((res) => {
			if (res.status === 200) {
				this.setState({ loading: false })
			}
		}).catch((err) => {
			this.setState({ loading: false })
			this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
		})
	}
	initializeDataForDesignations = (search) => {
		const { filterData } = this.state
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage
		}
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : ''
		}
		const postData = { ...filterData, ...paginationData, ...sortingData }
		this.props.designationActions.getEmployeeDesignationList(postData).then((res) => {
			if (res.status === 200) {
				this.setState({ loading: false })
			}
		}).catch((err) => {
			this.setState({ loading: false })
			this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
		})
	}

	initializeDataForStructure = (search) => {
		const { filterData } = this.state
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage
		}
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : ''
		}
		const postData = { ...filterData, ...paginationData, ...sortingData }
		this.props.salaryStructureActions.getSalaryStructureList(postData).then((res) => {
			if (res.status === 200) {
				this.setState({ loading: false })
			}
		}).catch((err) => {
			this.setState({ loading: false })
			this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
		})
	}

	// goToDetail = (row) => {
	
	// 	this.props.history.push('/admin/payroll/salaryRoles/detail', { id: row.salaryRoleId })
	// }
	goToDetailForRoles=  (cell, row) => {


		return (
			<Row>
			<div>
				<Button
				className="btn btn-sm pdf-btn"
				onClick={(e, ) => {
					this.props.history.push('/admin/payroll/config/detailSalaryRoles', { id: row.salaryRoleId })
				}}
				>
				<i class="far fa-edit fa-lg"></i>
				</Button>
			</div>
		
			</Row>
			
			
		);
	}
	goToDetailForStructure = (cell, row) => {
		return (
			<Row>
			<div>
				<Button
				className="btn btn-sm pdf-btn"
				onClick={(e, ) => {
					
					this.props.history.push('/admin/payroll/config/detailSalaryStructure', { id: row.salaryStructureId })
				}}
				>
				<i class="far fa-edit fa-lg"></i>
				</Button>
			</div>
		
			</Row>
			
			
		);
	}
	goToDetailForDesignations =  (cell, row) => {


		return (
			<Row>
			<div>
				<Button
				className="btn btn-sm pdf-btn"
				onClick={(e, ) => {
					this.props.history.push('/admin/payroll/config/detailEmployeeDesignation', { id: row.id })
				}}
				>
				<i class="far fa-edit fa-lg"></i>
				</Button>
			</div>
		
			</Row>
			
			
		);
	}
	
	sortColumn = (sortName, sortOrder) => {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		this.initializeData()
	}


	bulkDelete = () => {
		const {
			selectedRows
		} = this.state
		if (selectedRows.length > 0) {
			const message1 =
				<text>
					<b>Delete Employee?</b>
				</text>
			const message = 'This Employee will be deleted permanently and cannot be recovered. ';
			this.setState({
				dialog: <ConfirmDeleteModal
					isOpen={true}
					okHandler={this.removeBulk}
					cancelHandler={this.removeDialog}
					message={message}
					message1={message1}
				/>
			})
		} else {
			this.props.commonActions.tostifyAlert('info', 'Please select the rows of the table and try again.')
		}
	}

	removeBulk = () => {
		this.removeDialog()
		let { selectedRows } = this.state;
		const { salaryRole_list } = this.props
		let obj = {
			ids: selectedRows
		}
		this.props.employeeActions.removeBulkEmployee(obj).then((res) => {
			if (res.status === 200) {
				this.props.commonActions.tostifyAlert('success', 'Employees Deleted Successfully')
				this.initializeData();
				if (salaryRole_list && salaryRole_list.data && salaryRole_list.data.length > 0) {
					this.setState({
						selectedRows: []
					})
				}
			}
		}).catch((err) => {
			this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
		})
	}

	removeDialog = () => {
		this.setState({
			dialog: null
		})
	}

	handleChange = (val, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: val
			})
		})
	}

	handleSearch = () => {
		this.initializeData();
		// this.setState({})
	}

	onSizePerPageList = (sizePerPage) => {
		if (this.options.sizePerPage !== sizePerPage) {
			this.options.sizePerPage = sizePerPage
			this.initializeData()
		}
	}

	onPageChange = (page, sizePerPage) => {
		if (this.options.page !== page) {
			this.options.page = page
			this.initializeData()
		}
	}


	getCsvData = () => {
		if (this.state.csvData.length === 0) {
			let obj = {
				paginationDisable: true
			}
			this.props.employeeActions.getEmployeeList(obj).then((res) => {
				if (res.status === 200) {
					this.setState({ csvData: res.data.data, view: true }, () => {
						setTimeout(() => {
							this.csvLink.current.link.click()
						}, 0)
					});
				}
			})
		} else {
			this.csvLink.current.link.click()
		}
	}

	clearAll = () => {
		this.setState({
			filterData: {
				id: '',
				salaryRoleName: ''
			},
		}, () => { this.initializeData() })
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
	renderForId=(cell,row)=>{
		for(let i=121;i<=10000;i++){
		return (
			<div>{row.designationId ?row.designationId :row.id}</div>
		);
		}
	}
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

						<DropdownItem
							onClick={() =>
								this.props.history.push(
									'/admin/payroll/employee/detail',
									{ salaryRoleId: row.id },
								)
							}
						>

							<i className="fas fa-edit" /> {strings.Edit}
						</DropdownItem>


						{/* <DropdownItem
								  onClick={() =>
									  this.props.history.push(
										  '/admin/payroll/employee/salarySlip',
										  { id: row.id },
									  )
								  }
							  >
								  <i className="fas fa-eye" /> Salary Slip
							  </DropdownItem> */}

					</DropdownMenu>
				</ButtonDropdown>
			</div>
		);
	};
	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		console.log(tab);
		this.setState({
			activeTab: newArray,
		});
	};



	render() {
		strings.setLanguage(this.state.language);
		console.log(this.state.Fixed)
		const { loading, dialog } = this.state;
		const {  salaryRole_list, salaryStructure_list, designation_list } = this.props;
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="nav-icon fas fa-cogs" />
										<span className="ml-2">{strings.PayrollConfigurations}</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>


							<Nav tabs pills>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '1'}
										onClick={() => {
											this.toggle(0, '1');
										}}
									>
									{strings.SalaryRole}
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '2'}
										onClick={() => {
											this.toggle(0, '2');
										}}
									>
									{strings.SalaryStructure}
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '3'}
										onClick={() => {
											this.toggle(0, '3');
										}}
									>
										{strings.EmployeeDesignation}
									</NavLink>
								</NavItem>

							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>
								<TabPane tabId="1" >
									<div className="employee-screen">
										<div className="animated fadeIn">
											{dialog}
											{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
											{/* <Card> */}

												{/* <div>
												Change Language:   <select onChange={this.handleLanguageChange}>
													<option value="en">En- English</option>
													<option value="it">fr-french</option>
													<option value="ar">ar-Arabic</option>
												</select>
											</div> */}
											{/* </Card> */}
											{/* <Card> */}
												<CardHeader>
													<Row>
														<Col lg={12}>
															<div className="h4 mb-0 mt-0 d-flex align-items-center">
																<i className="fas fa-object-group" />
																<span className="ml-2 "> {strings.SalaryRole}</span>
															</div>
														</Col>
													</Row>
												</CardHeader>
												<CardBody>
													{
														loading ?
															<Row>
																<Col lg={12}>
																	<Loader />
																</Col>
															</Row>
															:
															<Row>

																<Col lg={12}>
																	<div className="d-flex justify-content-end">
																		<ButtonGroup size="sm">
																			{/* <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.getCsvData()}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />Export To CSV
                          </Button>
                          {view && <CSVLink
                            data={csvData}
                            filename={'Employee.csv'}
                            className="hidden"
                            ref={this.csvLink}
                            target="_blank"
                          />} */}
																			{/* <Button

                            color="primary"
                            className="btn-square mb-2"
                            onClick={() => this.props.history.push(`/admin/payroll/salaryRoles/create`)}
                          >
                            <i className="fas fa-plus mr-1 " />
                            {strings.NewSalaryRoles}
                          </Button> */}

																			<div style={{ width: "1650px" }}>
																				<Button
																					color="primary"
																					className="btn-square pull-right mb-2 mr-2"
																					style={{ marginBottom: '10px' }}
																					onClick={() => this.props.history.push(`/admin/payroll/config/createSalaryRoles`)}

																				>
																					<i className="fas fa-plus mr-1" />
																					{strings.NewSalaryRoles}
																				</Button>
																			</div>
																			{/* <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDelete}
                            disabled={selectedRows.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
                            Bulk Delete
                          </Button> */}
																		</ButtonGroup>
																	</div>

																	<div>
																		<BootstrapTable
																			selectRow={this.selectRowProp}
																			search={false}
																			options={this.options}
																			data={salaryRole_list && salaryRole_list.data ? salaryRole_list.data : []}
																			version="4"
																			hover
																			// pagination={salaryRole_list && salaryRole_list.data && salaryRole_list.data.length > 0 ? true : false}
																			keyField="id"
																			remote
																			fetchInfo={{ dataTotalSize: salaryRole_list.count ? salaryRole_list.count : 0 }}
																			//  className="employee-table"
																			trClassName="cursor-pointer"
																			csvFileName="salaryRole_list.csv"
																			ref={(node) => this.table = node}
																		>
																			<TableHeaderColumn
																				dataField="salaryRoleId"
																				className="table-header-bg"
																			>
																				{strings.SALARYROLEID}
																			</TableHeaderColumn>
																			<TableHeaderColumn
																				dataField="salaryRoleName"
																				className="table-header-bg"
																			>
																				{strings.SALARYROLENAME}
																			</TableHeaderColumn>
																			<TableHeaderColumn
																				dataField="salaryRoleName"
																				className="table-header-bg"
																				dataFormat={this.goToDetailForRoles}
																			>
																			
																			</TableHeaderColumn>
																			
																		</BootstrapTable>
																	</div>
																</Col>

															</Row>


													}
												</CardBody>
											{/* </Card> */}
										</div>
									</div>
								</TabPane>



								<TabPane tabId="2">
									<div className="employee-screen">
										<div className="animated fadeIn">
											{dialog}
											{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
											{/* <Card> */}
												<CardHeader>
													<Row>
														<Col lg={12}>
															<div className="h4 mb-0 d-flex align-items-center">
																<i className="fas fa-object-group" />
																<span className="ml-2">{strings.SalaryStructure}</span>
															</div>
														</Col>
													</Row>
												</CardHeader>
												<CardBody>
													{
														loading ?
															<Row>
																<Col lg={12}>
																	<Loader />
																</Col>
															</Row>
															:
															<Row>
																<Col lg={12}>
																	<div className="d-flex justify-content-end">
																		<ButtonGroup size="sm">
																			{/* <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.getCsvData()}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />Export To CSV
                          </Button>
                          {view && <CSVLink
                            data={csvData}
                            filename={'Employee.csv'}
                            className="hidden"
                            ref={this.csvLink}
                            target="_blank"
                          />} */}
																			{/* <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/payroll/salaryStructure/create`)}
                          >
                            <i className="fas fa-plus" />
                            {strings.NewSalaryStructure}
                          </Button> */}

																			<div style={{ width: "1650px" }}>
																				<Button
																					color="primary"
																					className="btn-square pull-right mb-2 mr-2"
																					style={{ marginBottom: '10px' }}
																					onClick={() => this.props.history.push(`/admin/payroll/config/createSalaryStructure`)}

																				>
																					<i className="fas fa-plus mr-1" />
																					{strings.NewSalaryStructure}
																				</Button>
																			</div>
																			{/* <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDelete}
                            disabled={selectedRows.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
                            Bulk Delete
                          </Button> */}
																		</ButtonGroup>
																	</div>
																	{/* <div className="py-3">
                        <h5>Filter : </h5>
                        <form >
                          <Row>
                            <Col lg={3} className="mb-1">
                              <Input type="text" placeholder="Name" value={filterData.name} onChange={(e) => { this.handleChange(e.target.value, 'name') }} />
                            </Col>
                            <Col lg={3} className="mb-2">
                              <Input type="text" placeholder="Email" value={filterData.email} onChange={(e) => { this.handleChange(e.target.value, 'email') }} />
                            </Col>
                            <Col lg={1} className="pl-0 pr-0" style={{display: "contents"}}>
                              <Button type="button" color="primary" className="btn-square mr-1" onClick={this.handleSearch}>
                                <i className="fa fa-search"></i>
                              </Button>
                              <Button type="button" color="primary" className="btn-square" onClick={this.clearAll}>
                                <i className="fa fa-refresh"></i>
                              </Button>
                            </Col>
                          </Row>
                        </form>
                         </div> */}
																	<div>
																		<BootstrapTable
																		   selectRow={this.selectRowProp}
																			search={false}
																			options={this.options}
																			data={salaryStructure_list && salaryStructure_list.data ? salaryStructure_list.data : []}
																			version="4"
																			hover
																			// pagination={salaryStructure_list && salaryStructure_list.data && salaryStructure_list.data.length > 0 ? true : false}
																			keyField="id"
																			remote
																			fetchInfo={{ dataTotalSize: salaryStructure_list.count ? salaryStructure_list.count : 0 }}
																			className="employee-table"
																			trClassName="cursor-pointer"
																			// csvFileName="salaryStructure_list.csv"
																			ref={(node) => this.table = node}
																		>
																			<TableHeaderColumn
																				className="table-header-bg"
																				dataField="salaryStructureType"

																			>
																				{strings.SalaryStructureType}
																			</TableHeaderColumn>
																			<TableHeaderColumn
																				className="table-header-bg"
																				dataField="salaryStructureName"

																			// dataFormat={this.vatCategoryFormatter}
																			>
																				{strings.SalaryStructureName}
																			</TableHeaderColumn>
																			<TableHeaderColumn
																				className="table-header-bg"
																				dataField="salaryStructureName"

																			 dataFormat={this.goToDetailForStructure}
																			>
																			
																			</TableHeaderColumn>
																			
																		</BootstrapTable>
																	</div>
																</Col>
															</Row>
													}
												</CardBody>
											{/* </Card> */}
										</div>
									</div>
								</TabPane>


								<TabPane tabId="3">
									<div className="employee-screen">
										<div className="animated fadeIn">
											{dialog}
											{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
											{/* <Card> */}
												<CardHeader>
													<Row>
														<Col lg={12}>
															<div className="h4 mb-0 d-flex align-items-center">
																<i className="fas fa-object-group" />
																<span className="ml-2">{strings.EmployeeDesignation}</span>
															</div>
														</Col>
													</Row>
												</CardHeader>
												<CardBody>
													{
														loading ?
															<Row>
																<Col lg={12}>
																	<Loader />
																</Col>
															</Row>
															:
															<Row>
																<Col lg={12}>
																	<div className="d-flex justify-content-end">
																		<ButtonGroup size="sm">
																			{/* <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.getCsvData()}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />Export To CSV
                          </Button>
                          {view && <CSVLink
                            data={csvData}
                            filename={'Employee.csv'}
                            className="hidden"
                            ref={this.csvLink}
                            target="_blank"
                          />} */}

																			<div style={{ width: "1650px" }}>
																				<Button
																					color="primary"
																					className="btn-square pull-right mb-2 mr-2"
																					style={{ marginBottom: '10px' }}
																					onClick={() => this.props.history.push(`/admin/payroll/config/createEmployeeDesignation`)}

																				>
																					<i className="fas fa-plus mr-1" />
																					{strings.NewDesignation}
																				</Button>
																			</div>
																			{/* <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDelete}
                            disabled={selectedRows.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
                            Bulk Delete
                          </Button> */}
																		</ButtonGroup>
																	</div>

																	<div>
																		<BootstrapTable
																			 selectRow={this.selectRowProp}
																			search={false}
																			options={this.options}
																			data={designation_list && designation_list.data ? designation_list.data : []}
																			version="4"
																			hover
																			// pagination={designation_list && designation_list.data && designation_list.data.length > 0 ? true : false}
																			keyField="id"
																			remote
																			fetchInfo={{ dataTotalSize: designation_list.count ? designation_list.count : 0 }}
																			className="employee-table"
																			trClassName="cursor-pointer"
																			csvFileName="designation_list.csv"
																			ref={(node) => this.table = node}
																		>
																			<TableHeaderColumn
																				className="table-header-bg"
																				dataField="designationId"
																				dataFormat={this.renderForId}																				
																			>
																				{strings.DESIGNATIONID}
																			</TableHeaderColumn>
																			<TableHeaderColumn
																				className="table-header-bg"
																				dataField="designationName"
																			
																			// dataFormat={this.vatCategoryFormatter}
																			>
																				{strings.DESIGNATIONNAME}
																			</TableHeaderColumn>
																			<TableHeaderColumn
																				className="table-header-bg"
																				dataField="designationName"
																		
																			 dataFormat={this.goToDetailForDesignations}
																			>
																			
																			</TableHeaderColumn>
																			
																		</BootstrapTable>
																	</div>
																</Col>
															</Row>
													}
												</CardBody>
											{/* </Card> */}
										</div>
									</div>
								</TabPane>

							</TabContent>

						</CardBody>
					</Card>
				</div>
				{/* <ViewPaySlip
					openModal={this.state.openModal}
					closeModal={(e) => {
						this.closeModal(e);
					}}
					bankDetails={this.state.EmployeeDetails}
					employeename={this.state.employeename}
				// id={this.state.rowId}
				Fixed={this.state.Fixed}
				 FixedAllowance={this.state.FixedAllowance}
				 selectedData={this.state.selectedData}
				 Deduction={this.state.Deduction}
				 Variable={this.state.Variable}
				 companyData={profile}
				/> */}
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PayrollConfigurations);
