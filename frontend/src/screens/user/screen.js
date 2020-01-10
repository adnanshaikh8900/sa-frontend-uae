import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  ButtonGroup,
  Form,
  FormGroup,
  Input
} from 'reactstrap'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'

import { Loader, ConfirmDeleteModal } from 'components'

import * as UserActions from './actions'
import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'

import moment from 'moment'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'react-datepicker/dist/react-datepicker.css'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    user_list: state.user.user_list,
    role_list: state.user.role_list,
    company_type_list: state.user.company_type_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    userActions: bindActionCreators(UserActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)

  })
}

class User extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      selectedRows: [],
      dialog: false,
      filterData: {
        name: '',
        dob: '',
        active: 'true',
        // companyId: '',
        roleId: ''
      },
      selectedStatus: ''
    }

    this.statusOption = [
      { label: 'Select Status', value: ''},
      { label: 'Active', value: 'true' },
      { label: 'InActive', value: 'false' },
    ]

    this.initializeData = this.initializeData.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)

    this.renderDate = this.renderDate.bind(this)
    this.renderRole = this.renderRole.bind(this)
    this.renderStatus = this.renderStatus.bind(this)

    this.renderCompany = this.renderCompany.bind(this)

    this.bulkDelete = this.bulkDelete.bind(this)
    this.removeBulk = this.removeBulk.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.onPageChange = this.onPageChange.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this)


    this.options = {
      onRowClick: this.goToDetail,
      paginationPosition: 'top',
      page: 1,
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

  initializeData() {
    let { filterData } = this.state
    const data = {
      pageNo: this.options.page,
      pageSize: this.options.sizePerPage
    }
    filterData = { ...filterData, ...data }
    this.props.userActions.getUserList(filterData).then(res => {
      if (res.status === 200) {
        this.props.userActions.getRoleList()
        this.props.userActions.getCompanyTypeList()
        this.setState({ loading: false })
      }
    }).catch((err) => {
      this.setState({
        loading: false
      })
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  goToDetail(row) {
    console.log(row)
    this.props.history.push('/admin/settings/user/detail', { id: row.id })
  }

  onPageChange = (page, sizePerPage) => {
    this.options.page = page
  }

  onSizePerPageList = (sizePerPage) => {
    this.options.sizePerPage = sizePerPage
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
    const { filterData } = this.state;
    let { selectedRows } = this.state;
    const { user_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.removeDialog()
    this.props.userActions.removeBulk(obj).then((res) => {
      this.initializeData();
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (user_list && user_list.length > 0) {
        this.setState({
          selectedRows: []
        })
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }

  renderDate(cell, row) {
    return row['dob'] !== null ? moment(row['dob']).format('DD-MM-YYYY') : ''
  }

  renderRole(cell, row) {
    return row['role'] ? row['role']['roleName'] : ''
  }

  renderCompany(cell, row) {
    return row['company'] ? row['company']['companyName'] : ''
  }

  renderStatus(cell, row) {
    return (row['active'] !== '') ? (row['active'] === true ? 'Active' : 'InActive') : ''
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
  }

  render() {

    const { loading, dialog, selectedRows, selectedStatus, filterData } = this.state
    const { user_list, role_list, company_type_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="user-screen">
        <div className="animated fadeIn">
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-users" />
                    <span className="ml-2">Users</span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {dialog}
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
                            disabled={user_list.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/settings/user/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Users
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
                        <Row>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="User Name" onChange={(e) => { this.handleChange(e.target.value, 'name') }} />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <DatePicker
                              className="form-control"
                              id="date"
                              name="dob"
                              placeholderText="Date of Birth"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              selected={filterData.dob}
                              value={filterData.dob}
                              onChange={(value) => {
                                this.handleChange(value, "dob")
                              }}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Select
                              className="select-default-width"
                              placeholder="Select Role"
                              id="roleId"
                              name="roleId"
                              options={role_list ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list, 'Role') : []}
                              value={filterData.roleId}
                              onChange={(option) => { 
                                if(option && option.value) {
                                  this.handleChange(option.value, 'roleId')
                                } else {
                                  this.handleChange('', 'roleId')
                                }
                               }}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Select
                              className="select-default-width"
                              placeholder="Select Status"
                              id="active"
                              name="active"
                              options={this.statusOption ? this.statusOption : []}
                              // value={filterData.supplierId}
                              value={selectedStatus}
                              onChange={(option) => {
                                if(option) {
                                  this.handleChange(option.value, 'active')
                                this.setState({ selectedStatus: option.value })
                                } else {
                                this.handleChange('true', 'active')
                                this.setState({ selectedStatus: 'true' })
                                }
                              }}
                            />
                          </Col>
                          {/* <Col lg={2} className="mb-1">
                          <Select
                              className="select-default-width"
                              placeholder="Select Company"
                              id="companyId"
                              name="companyId"
                              options={company_type_list ? selectOptionsFactory.renderOptions('label', 'value', company_type_list , 'Company') : []}
                              value={filterData.companyId}
                              onChange={(option) => { this.handleChange(option.value, 'companyId') }}
                            />
                          </Col> */}
                          <Col lg={1} className="mb-1">
                            <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch}>
                              <i className="fa fa-search"></i>
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <BootstrapTable
                          selectRow={this.selectRowProp}
                          search={false}
                          options={this.options}
                          data={user_list ? user_list : []}
                          version="4"
                          hover
                          keyField="id"
                          pagination
                          totalSize={user_list ? user_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                          ref={node => {
                            this.table = node
                          }}
                        >
                          <TableHeaderColumn
                            dataField="firstName"
                            dataSort
                          >
                            User Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="dob"
                            dataSort
                            dataFormat={this.renderDate}
                          >
                            DOB
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="roleName"
                            dataSort
                          // dataFormat={this.renderRole}
                          >
                            Role Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="active"
                            dataSort
                            dataFormat={this.renderStatus}
                          >
                            Status
                          </TableHeaderColumn>
                          {/* <TableHeaderColumn
                            dataField="companyName"
                            dataSort
                            // dataFormat={this.renderCompany}
                          >
                            Company
                          </TableHeaderColumn> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(User)
