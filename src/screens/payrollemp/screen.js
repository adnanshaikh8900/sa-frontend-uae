import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Row,
    Col,
    ButtonGroup,
    Input,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as PayrollEmployeeActions from './actions'

import {
    CommonActions
} from 'services/global'


import './style.scss'
import moment from 'moment';
import {data}  from '../Language/index'
import LocalizedStrings from 'react-localization';
import { AgGridReact,AgGridColumn } from 'ag-grid-react/lib/agGridReact';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import PhoneInput from 'react-phone-input-2';
const mapStateToProps = (state) => {
    return ({
        payroll_employee_list: state.payrollEmployee.payroll_employee_list,
    })
}
const mapDispatchToProps = (dispatch) => {
    return ({
        payrollEmployeeActions: bindActionCreators(PayrollEmployeeActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch)
    })
}
let strings = new LocalizedStrings(data);
class PayrollEmployee extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            language: window['localStorage'].getItem('language'),
            actionButtons: {},
            loading: true,
            selectedRows: [],
            dialog: null,
            filterData: {
                name: '',
                email: ''
            },
            paginationPageSize:10,
            csvData: [],
            view: false
        }

        this.options = {
           // onRowClick: this.goToDetail,
            paginationPosition: 'bottom',
            // page: 1,
            // sizePerPage: 10,
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

    componentDidMount = () => {
        this.initializeData()
    }

    componentWillUnmount = () => {
        this.setState({
            selectedRows: []
        })
    }

    initializeData = (search) => {
        const { filterData } = this.state
        const paginationData = {
            // pageNo: this.options.page ? this.options.page - 1 : 0,
            // pageSize: this.options.sizePerPage
        }
        const sortingData = {
            order: this.options.sortOrder ? this.options.sortOrder : '',
            sortingCol: this.options.sortName ? this.options.sortName : ''
        }
        const postData = { ...filterData, ...paginationData, ...sortingData }
        this.props.payrollEmployeeActions.getPayrollEmployeeList(postData).then((res) => {
            if (res.status === 200) {
                this.setState({ loading: false })
            }
        }).catch((err) => {
            this.setState({ loading: false })
            this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
        })
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
                                    { id: row.id },
                                )
                            }
                        >
                            <i className="fas fa-edit" />  {strings.Edit}
							</DropdownItem>


                        <DropdownItem
                            onClick={() =>
                                this.props.history.push(
                                    '/admin/payroll/employee/salarySlip',
                                    { id: row.id, monthNo: 4 },
                                )
                            }
                        >
                            <i className="fas fa-eye" />  {strings.SalarySlip}
						</DropdownItem>

                    </DropdownMenu>
                </ButtonDropdown>
            </div>
        );
    };

    fullname1 = (cell, row) => {
        
		return (
			<label
				className="mb-0 label-bank"
				style={{
					cursor: 'pointer',
					}}
				onClick={
                    () =>{ 
					// this.props.history.push('/admin/payroll/employee/viewEmployee',
                    // { id: row.id })
                	this.props.history.push('/admin/master/employee/viewEmployee',
                    { id: cell.data.id })
                }
                    
				}
                

			>
				{cell.data.fullName}
			</label>
		);
	};
    onPageSizeChanged = (newPageSize) => {
        var value = document.getElementById('page-size').value;
        this.gridApi.paginationSetPageSize(Number(value));
      };
    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      };
      
    onBtnExport = () => {
        this.gridApi.exportDataAsCsv();
      };

    onBtnExportexcel= () => {
        this.gridApi.exportDataAsExcel();
      };

    goToDetail = (row) => {
        // this.props.history.push('/admin/payroll/employee/viewEmployee',
        // { id: row.id })
        this.props.history.push('/admin/master/employee/viewEmployee',
        { id: row.id })
    }

    sortColumn = (sortName, sortOrder) => {
        this.options.sortName = sortName;
        this.options.sortOrder = sortOrder;
        this.initializeData()
    }

    onRowSelect = (row, isSelected, e) => {
        let tempList = []
        if (isSelected) {
            tempList = Object.assign([], this.state.selectedRows)
            tempList.push(row.id);
        } else {
            this.state.selectedRows.map((item) => {
                if (item !== row.id) {
                    tempList.push(item)
                }
                return item
            });
        }
        this.setState({
            selectedRows: tempList
        })
    }
    onSelectAll = (isSelected, rows) => {
        let tempList = []
        if (isSelected) {
            rows.map((item) => {
                tempList.push(item.id)
                return item
            })
        }
        this.setState({
            selectedRows: tempList
        })
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
    renderDOB = (cell, rows) => {
        return moment(rows.dob).format('DD-MM-YYYY');
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


    removeBulk = () => {
        this.removeDialog()
        let { selectedRows } = this.state;
        const { payroll_employee_list } = this.props
        let obj = {
            ids: selectedRows
        }
        this.props.employeeActions.removeBulkEmployee(obj).then((res) => {
            if (res.status === 200) {
                this.props.commonActions.tostifyAlert(
                    'success',
                     'Employees Deleted Successfully'
                     )
                this.initializeData();
                if (payroll_employee_list && payroll_employee_list.data && payroll_employee_list.data.length > 0) {
                    this.setState({
                        selectedRows: []
                    })
                }
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert(
                'error',
                 err && err.data ? err.data.message : 'Something Went Wrong'
                 )
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
    getActionButtons = (params) => {
		return (
	<>
	{/* BUTTON ACTIONS */}
			{/* View */}
			<Button
				className="Ag-gridActionButtons btn-sm"
				title='Edit'
				color="secondary"

                onClick={
                    () =>{ 
                                                          
                    this.props.history.push('/admin/master/employee/viewEmployee',{ id: params.data.id })
                        }                                                                                               
}                                            
			
			>		<i className="fas fa-edit"/> </Button>
	</>
		)
	}

    clearAll = () => {
        this.setState({
            filterData: {
                name: '',
                email: ''
            },
        }, () => { this.initializeData() })
    }
    renderDate=(data)=>{
        
            return moment(data.value).format("DD-MM-YYYY")
    }
    render() {
        strings.setLanguage(this.state.language);
        const { loading, dialog, selectedRows, csvData, view, filterData } = this.state
        const { payroll_employee_list } = this.props

        return (
            loading ==true? <Loader/> :
<div>
            <div className="employee-screen">
                <div className="animated fadeIn">
                    {dialog}
                    {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col lg={12}>
                                    <div className="h4 mb-0 d-flex align-items-center">
                                        <i className="fas fa-object-group" />
                                        <span className="ml-2"> {strings.Employees} </span>
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
                                                    <Row>
                                          
                                                        <div style={{ width: "1650px" }}>
                                                        <Button
                                                                color="primary"
                                                                className="btn-square pull-right mb-2 mr-4"
                                                                style={{ marginBottom: '10px' }}
                                                                // onClick={() =>
                                                                //     //  this.props.history.push(`/admin/payroll/employee/create`)
                                                                //      this.props.history.push(`/admin/master/employee/create`)  
                                                                //     }
                                                                onClick={() => this.onBtnExport()}

                                                            >             
                                                            CSV
                                                        </Button>
                                                            <Button
                                                                color="primary"
                                                                className="btn-square pull-right mb-2 mr-4"
                                                                style={{ marginBottom: '10px' }}
                                                                onClick={() =>
                                                                    //  this.props.history.push(`/admin/payroll/employee/create`)
                                                                     this.props.history.push(`/admin/master/employee/create`)  
                                                                    }
                                                                // onClick={() => this.onBtnExport()}

                                                            >
                                                                <i className="fas fa-plus mr-1" />
                                         {strings.NewEmployee}
									</Button>
                                  
                                    </div>

                                    </Row>
                                                    {/* <Button
                                                        color="primary"
                                                        className="btn-square"
                                                        onClick={() => this.props.history.push(`/admin/payroll/employee/viewPayroll`)}
                                                    >
                                                       
                            Generate Payroll
                          </Button> */}

                                                </ButtonGroup>
                                            </div>
                                            {/* <div className="py-3">
                                                <h5>Filter : </h5>
                                                <form >
                                                    <Row>
                                                        <Col lg={3} className="mb-1">
                                                            <Input type="text" placeholder="Name" value={filterData.name}
                                                             onChange={(e) => { this.handleChange(e.target.value, 'name') }} />
                                                        </Col>
                                                        <Col lg={3} className="mb-2">
                                                            <Input type="text" placeholder="Email" value={filterData.email}
                                                             onChange={(e) => { this.handleChange(e.target.value, 'email') }} />
                                                        </Col>
                                                        <Col lg={1} className="pl-0 pr-0" style={{ display: "contents" }}>
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
                                            								<div className="mobileNumberCSS ag-theme-alpine mb-3" style={{ height: 590,width:"100%" }}>
                                                                            
                                                                                    <AgGridReact
                                                                                        rowData={payroll_employee_list &&
                                                                                            payroll_employee_list.data 
                                                                                            ? payroll_employee_list.data
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

                                                                                        <AgGridColumn field="employeeCode" 
                                                                                        headerName=   {strings.EMPLOYEECODE}
                                                                                        sortable={ true } 
                                                                                        filter={ true } 
                                                                                        // checkboxSelection={true}
                                                                                        enablePivot={true} 
                                                                                       ></AgGridColumn>

                                                                                        <AgGridColumn field="fullName" 
                                                                                        headerName=       {strings.FULLNAME}
                                                                                        sortable={ true }
                                                                                        filter={ true }
                                                                                        enablePivot={true}
                                                                                        cellRendererFramework={(params) => <label
                                                                                                                            className="mb-0 label-bank"
                                                                                                                            style={{
                                                                                                                                cursor: 'pointer',
                                                                                                                                }}
                                                                                                                                                                          
                                                                                                                >
                                                                                                                    {params.data.fullName}
                                                                                                                </label>
                                                                                                    }
                                                                                        ></AgGridColumn>  

                                                                                        <AgGridColumn field="email" 
                                                                                        headerName=  {strings.EMAIL}
                                                                                        sortable={ true } 
                                                                                        filter={ true }
                                                                                        enablePivot={true}  
                                                                                        ></AgGridColumn>

                                                                                        <AgGridColumn field="mobileNumber" 

                                                                                        headerName={strings.MOBILENUMBER}
                                                                                        sortable={true}
                                                                                        enablePivot={true} 
                                                                                        filter={true}
                                                                                        cellRendererFramework={(params)=>
                                                                                            <PhoneInput     
                                                                                            className="mobileNumberCSS"                                                                     
                                                                                            value={params.value}
                                                                                            disabled={true}
                                                                                            autoFocus={false}
                                                                                        />

                                                                                        }
                                                                                        ></AgGridColumn>  

                                                                                    
                                                                                        <AgGridColumn field="dob" 
                                                                                        headerName=  {strings.DATEOFBIRTH}
                                                                                        sortable={ true } 
                                                                                        enablePivot={true} 
                                                                                        filter={ true } 
                                                                                        valueFormatter={this.renderDate}
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
                                                                                    </AgGridReact>  
                                                                                    <div className="example-header mt-1">
                                                                                            Page Size:
                                                                                            <select onChange={() => this.onPageSizeChanged()} id="page-size">
                                                                                            <option value="10" selected={true}>10</option>
                                                                                            <option value="100">100</option>
                                                                                            <option value="500">500</option>
                                                                                            <option value="1000">1000</option>
                                                                                            </select>
                                                                                        </div>     
                                                                                                                                                              
                                                                                </div>										
                                        </Col>
                                    </Row>
                            }
                        </CardBody>
                    </Card>
                </div>
            </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayrollEmployee)
