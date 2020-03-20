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
  FormGroup,
  Input
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as ContactActions from './actions'
import { CommonActions } from 'services/global'
import { selectOptionsFactory } from 'utils'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    contact_list: state.contact.contact_list,
    contact_type_list: state.contact.contact_type_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    contactActions: bindActionCreators(ContactActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
  })
}

class Contact extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      selectedRows: [],
      dialog: null,
      filterData: {
        name: '',
        email: '',
        contactType: '',
      },
      selectedContactType: ''
    }

    this.initializeData = this.initializeData.bind(this)

    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.bulkDelete = this.bulkDelete.bind(this);
    this.removeBulk = this.removeBulk.bind(this);
    this.removeDialog = this.removeDialog.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

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

  componentWillUnmount() {
    this.setState({
      selectedRows: []
    })
  }

  initializeData() {
    let { filterData } = this.state
    const paginationData = {
      pageNo: this.options.page ? this.options.page - 1 : 0,
      pageSize: this.options.sizePerPage
    }
    filterData = { ...filterData, ...paginationData }
    this.props.contactActions.getContactList(filterData).then(res => {
      if (res.status === 200) {
        this.props.contactActions.getContactTypeList();
        this.setState({ loading: false });
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.message : null);
      this.setState({ loading: false })
    })
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
      rows.map(item =>  temp_list.push(item.id))
    }
    this.setState({
      selectedRows: temp_list
    })
  }

  goToDetail(row) {
    this.props.history.push('/admin/master/contact/detail', { id: row.id })
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
    const { contact_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.contactActions.removeBulk(obj).then((res) => {
      this.initializeData();
      this.props.commonActions.tostifyAlert('success', 'Contacts Deleted Successfully')
      if (contact_list && contact_list.data && contact_list.data.length > 0) {
        this.setState({
          selectedRows: []
        })
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err !== null ? err.data.message : null)
      this.setState({ isLoading: false })
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


  render() {

    const { loading, dialog , selectedRows } = this.state
    const { contact_list, contact_type_list } = this.props
    
    return (
      <div className="contact-screen">
        <div className="animated fadeIn">
          {dialog}
          {/* // <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-id-card-alt" />
                    <span className="ml-2">Contact</span>
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
                            disabled={contact_list && contact_list.data && contact_list.data.length === 0 ? true : false}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/master/contact/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Contact
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

                            <Col lg={3} className="mb-1">
                              <Input type="text" placeholder="Email" onChange={(e) => { this.handleChange(e.target.value, 'email') }} />
                            </Col>

                            <Col lg={3} className="mb-1">
                                <Select
                                  options={contact_type_list ? selectOptionsFactory.renderOptions('label', 'value', contact_type_list, 'Contact Type') : []}
                                  onChange={(val) => {
                                    if (val && val.value) {
                                      this.handleChange(val['value'], 'contactType')
                                      this.setState({ 'selectedContactType': val['value'] })
                                    } else {
                                      this.handleChange('', 'contactType')
                                      this.setState({ 'selectedContactType': '' })
                                    }
                                  }}
                                  className="select-default-width"
                                  placeholder="Contact Type"
                                  value={this.state.selectedContactType}
                                />
                            </Col>

                            <Col lg={2} className="mb-1">
                              <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch} >
                                <i className="fa fa-search"></i>
                              </Button>
                            </Col>

                          </Row>
                        </form>
                      </div>
                      <div>
                        <Row>
                          <Col xs="12" lg="12">
                            <BootstrapTable
                              selectRow={this.selectRowProp}
                              search={false}
                              options={this.options}
                              data={contact_list && contact_list.data ? contact_list.data : []}
                              version="4"
                              hover
                              pagination = {contact_list && contact_list.data && contact_list.data.length > 0 ? true : false}
                              remote
                              fetchInfo={{ dataTotalSize: contact_list.count ? contact_list.count : 0 }}
                              className="product-table"
                              trClassName="cursor-pointer"
                              csvFileName="Contact.csv"
                              ref={node => {
                                this.table = node
                              }}
                            >
                              <TableHeaderColumn
                                isKey
                                dataField="firstName"
                                dataSort
                              >
                                Name
                              </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="email"
                                dataSort
                              >
                                email
                              </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="contactTypeString"
                                dataSort
                              // dataFormat={this.typeFormatter}
                              >
                                Type
                              </TableHeaderColumn>
                            </BootstrapTable>
                          </Col>
                          {/* <Col xs="12" lg="4">
                            <div className="contact-info p-4">
                              <h4>Mr. Admin Admin</h4>
                              <hr />
                              <div className="d-flex">
                                <div className="contact-name mr-4">AA</div>
                                <div className="info">
                                  <p><strong>Company: </strong> admin </p>
                                  <p><strong>Email: </strong> admin@admin.com </p>
                                  <p><strong>Tel No: </strong> 1231 </p>
                                  <p><strong>Next Due Date: </strong> 11/01/2019 </p>
                                  <p><strong>Due Amount: </strong> Lek 400 </p>
                                  <p><strong>Contact Type: </strong>Customer </p>
                                </div>

                              </div>
                              <div className="text-right mt-3">
                                <Button
                                  color="primary"
                                  className="btn-square "
                                  onClick={() => this.props.history.push(`/admin/invoice/create`)}
                                >
                                  <i className="fas fa-plus mr-1" />
                                  New Invoice
                                </Button>
                              </div>
                            </div>
                          </Col> */}
                        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact)
