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

import * as EmployeeActions from './actions'
import {
  CommonActions
} from 'services/global'
import { CSVLink } from "react-csv";


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    employee_list: state.employeePayroll.employee_list,
    vat_list: state.employee.vat_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class EmployeePayroll extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      actionButtons: {},
      loading: true,
      selectedRows: [],
      dialog: null,
      filterData: {
        name: '',
        email: ''
      },
      csvData: [],
      view: false
    }

    this.options = {
      // onRowClick: this.goToDetail,
      paginationPosition: 'bottom',
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
      pageNo: this.options.page ? this.options.page - 1 : 0,
      pageSize: this.options.sizePerPage
    }
    const sortingData = {
      order: this.options.sortOrder ? this.options.sortOrder : '',
      sortingCol: this.options.sortName ? this.options.sortName : ''
    }
    const postData = { ...filterData, ...paginationData, ...sortingData }
    this.props.employeeActions.getEmployeeList(postData).then((res) => {
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
								<i className="fas fa-edit" /> Edit
							</DropdownItem>
					
				
						<DropdownItem
							onClick={() =>
								this.props.history.push(
									'/admin/payroll/employee/salarySlip',
									{ id: row.id },
								)
							}
						>
							<i className="fas fa-eye" /> Salary Slip
						</DropdownItem>
					
					</DropdownMenu>
				</ButtonDropdown>
			</div>
		);
	};

  // goToDetail = (row) => {
  //   this.props.history.push('/admin/payroll/employee/detail', { id: row.id })
  // }

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

  removeBulk = () => {
    this.removeDialog()
    let { selectedRows } = this.state;
    const { employee_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.employeeActions.removeBulkEmployee(obj).then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Employees Deleted Successfully')
        this.initializeData();
        if (employee_list && employee_list.data && employee_list.data.length > 0) {
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
        name: '',
        email: ''
      },
    },() => { this.initializeData() })
  }

  render() {

    const { loading, dialog, selectedRows, csvData, view, filterData } = this.state
    const { employee_list } = this.props


    return (
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
                    <span className="ml-2">Employees</span>
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
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/payroll/employee/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Employee
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/payroll/employee/viewPayroll`)}
                          >
                            {/* <i className="fas fa- mr-1" /> */}
                            Generate Payroll
                          </Button>
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
                      <div className="py-3">
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
                      </div>
                      <div>
                        <BootstrapTable
                          selectRow={this.selectRowProp}
                          search={false}
                          options={this.options}
                          data={employee_list && employee_list.data ? employee_list.data : []}
                          version="4"
                          hover
                          pagination={employee_list && employee_list.data && employee_list.data.length > 0 ? true : false}
                          keyField="id"
                          remote
                          fetchInfo={{ dataTotalSize: employee_list.count ? employee_list.count : 0 }}
                          className="employee-table"
                          trClassName="cursor-pointer"
                          csvFileName="employee_list.csv"
                          ref={(node) => this.table = node}
                        >
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="fullName"
                            dataSort
                          >
                            Full Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="dob"
                            dataSort
                          // dataFormat={this.vatCategoryFormatter}
                          >
                           Date Of Birth
                          </TableHeaderColumn>
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="gender"
                            dataSort
                          >
                           gender
                          </TableHeaderColumn>
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="email"
                            dataSort
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="mobileNumber"
                            dataSort
                          // dataFormat={this.vatCategoryFormatter}
                          >
                           mobile Number
                          </TableHeaderColumn>
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="city"
                            dataSort
                          // dataFormat={this.vatCategoryFormatter}
                          >
                            city
                          </TableHeaderColumn>
                          <TableHeaderColumn
                          className="table-header-bg"
                            dataField="isActive"
                            dataSort
                          // dataFormat={this.vatCategoryFormatter}
                          >
                            is-Active
                          </TableHeaderColumn>
                      <TableHeaderColumn
												className="text-right"
												columnClassName="text-right"
												//width="5%"
												dataFormat={this.renderActions}
												className="table-header-bg"
											></TableHeaderColumn>
                        </BootstrapTable>
                      </div>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeePayroll)
