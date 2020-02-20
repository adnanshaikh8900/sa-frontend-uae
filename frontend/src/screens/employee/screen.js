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
} from 'reactstrap'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Loader, ConfirmDeleteModal } from 'components'


import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as EmployeeActions from './actions'
import {
  CommonActions
} from 'services/global'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    employee_list: state.employee.employee_list,
    vat_list: state.employee.vat_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class Employee extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      selectedRows: [],
      dialog: null,
      filterData: {
        name: '',
        email: ''
      }
    }

    this.initializeData = this.initializeData.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.bulkDelete = this.bulkDelete.bind(this);
    this.removeBulk = this.removeBulk.bind(this);
    this.removeDialog = this.removeDialog.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.onPageChange = this.onPageChange.bind(this)
    this.onSizePerPageList = this.onSizePerPageList.bind(this)

    this.options = {
      onRowClick: this.goToDetail,
      paginationPosition: 'top',
      page: 0,
      sizePerPage: 10,
      onSizePerPageList: this.onSizePerPageList,
      onPageChange: this.onPageChange,
    }

    this.selectRowProp = {
      mode: 'checkbox',
      bgColor: 'rgba(0,0,0, 0.05)',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }

  }

  componentDidMount() {
    this.initializeData()
  }

  componentWillUnmount() {
    this.setState({
      selectedRows: []
    })
  }

  initializeData() {
    const { filterData } = this.state
    const paginationData = {
      pageNo: this.options.page,
      pageSize: this.options.sizePerPage
    }
    const postData = { ...filterData, ...paginationData }
    this.props.employeeActions.getEmployeeList(postData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch(err => {
      this.setState({ loading: false })
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  goToDetail(row) {
    this.props.history.push('/admin/master/employee/detail', { id: row.id })
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selectedRows)
      temp_list.push(row.id);
    } else {
      this.state.selectedRows.map(item => {
        if (item !== row.id) {
          temp_list.push(item)
        }
        return item
      });
    }
    this.setState({
      selectedRows: temp_list
    })
  }
  onSelectAll(isSelected, rows) {
    let temp_list = []
    if (isSelected) {
      rows.map(item => {
        temp_list.push(item.id)
        return item
      })
    }
    this.setState({
      selectedRows: temp_list
    })
  }

  bulkDelete() {
    const {
      selectedRows
    } = this.state
    if (selectedRows.length > 0) {
      this.setState({
        dialog: <ConfirmDeleteModal
          isOpen={true}
          okHandler={this.removeBulk}
          cancelHandler={this.removeDialog}
        />
      })
    } else {
      this.props.commonActions.tostifyAlert('info', 'Please select the rows of the table and try again.')
    }
  }

  removeBulk() {
    this.removeDialog()
    let { selectedRows } = this.state;
    const { employee_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.employeeActions.removeBulkEmployee(obj).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
        this.initializeData();
        if (employee_list && employee_list.length > 0) {
          this.setState({
            selectedRows: []
          })
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }

  handleChange(val, name) {
    this.setState({
      filterData: Object.assign(this.state.filterData, {
        [name]: val
      })
    })
  }

  handleSearch() {
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

  render() {

    const { loading, dialog , selectedRows } = this.state
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
                          <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.table.handleExportCSV()}
                            disabled={employee_list.length === 0}

                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/master/employee/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Employee
                          </Button>
                          <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDelete}
                            disabled={selectedRows.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
                            Bulk Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                      <div className="py-3">
                        <h5>Filter : </h5>
                        <form>
                          <Row>
                            <Col lg={3} className="mb-1">
                              <Input type="text" placeholder="Name" onChange={(e) => { this.handleChange(e.target.value, 'name') }} />
                            </Col>
                            <Col lg={3} className="mb-2">
                              <Input type="text" placeholder="Email" onChange={(e) => { this.handleChange(e.target.value, 'email') }} />
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch}>
                                <i className="fa fa-search"></i>
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
                          data={employee_list ? employee_list : []}
                          version="4"
                          hover
                          pagination
                          keyField="id"
                          remote
                          fetchInfo={{ dataTotalSize: employee_list.totalCount ? employee_list.totalCount : 0 }}
                          className="employee-table"
                          trClassName="cursor-pointer"
                          csvFileName="employee_list.csv"
                          ref={node => this.table = node}
                        >
                          <TableHeaderColumn

                            dataField="firstName"
                            dataSort
                          >
                            First Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="referenceCode"
                            dataSort
                          >
                            Reference Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            dataSort
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="vatRegestationNo"
                            dataSort
                          // dataFormat={this.vatCategoryFormatter}
                          >
                            Vat Registration No
                          </TableHeaderColumn>
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

export default connect(mapStateToProps, mapDispatchToProps)(Employee)
