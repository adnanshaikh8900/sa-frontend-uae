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
  DropdownItem
} from 'reactstrap'
import Select from 'react-select'
// import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'


import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'react-datepicker/dist/react-datepicker.css'

import moment from 'moment'

import * as SupplierInvoiceActions from './actions'
import {
  CommonActions
} from 'services/global'
import {
  selectOptionsFactory,
} from 'utils'

import './style.scss'
// import { setNestedObjectValues } from 'formik';
import { PreviewInvoiceModal } from './sections'


const mapStateToProps = (state) => {
  return ({
    supplier_invoice_list: state.supplier_invoice.supplier_invoice_list,
    supplier_list: state.supplier_invoice.supplier_list,
    status_list: state.supplier_invoice.status_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    supplierInvoiceActions: bindActionCreators(SupplierInvoiceActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class SupplierInvoice extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dialog: false,
      actionButtons: {},
      filterData: {
        supplierId: '',
        referenceNumber: '',
        invoiceDate: '',
        invoiceDueDate: '',
        amount: '',
        status: '',
        contactType: 1
      },
      selectedRows: [],
      contactType: 1,
      openInvoicePreviewModal: false,

    }

    this.initializeData = this.initializeData.bind(this)
    this.renderInvoiceNumber = this.renderInvoiceNumber.bind(this)
    this.renderInvoiceStatus = this.renderInvoiceStatus.bind(this)
    this.renderActions = this.renderActions.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.toggleActionButton = this.toggleActionButton.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.bulkDelete = this.bulkDelete.bind(this);
    this.removeBulk = this.removeBulk.bind(this);
    this.removeDialog = this.removeDialog.bind(this);
    this.closeInvoicePreviewModal = this.closeInvoicePreviewModal.bind(this)
    this.openInvoicePreviewModal = this.openInvoicePreviewModal.bind(this)

    this.options = {
      paginationPosition: 'top'
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
    const paginationData = {
      pageNo: this.options.page,
      pageSize: this.options.sizePerPage
    }
    const postData = {...filterData,...paginationData }
    this.props.supplierInvoiceActions.getSupplierInvoiceList(postData).then(res => {
    if (res.status === 200) {
        this.props.supplierInvoiceActions.getStatusList()
        this.props.supplierInvoiceActions.getSupplierList(filterData.contactType);
        this.setState({ loading: false });
     }
    }).catch(err => {
       this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.message : null);
       this.setState({ loading: false })
    })

  }
  componentWillUnmount() {
    this.setState({
      selectedRows: []
    })
  }

  renderInvoiceNumber(cell, row) {
    return (
      <label
        className="mb-0 my-link"
        onClick={() => this.props.history.push('/admin/expense/supplier-invoice/detail')}
      >
        {row.transactionCategoryName}
      </label>
    )
  }

  renderInvoiceStatus(cell, row) {
    let classname = ''
    if (row.status === 'Paid') {
      classname = 'badge-success'
    } else if (row.status === 'Unpaid') {
      classname = 'badge-danger'
    } else if (row.status === 'PARTIALLY PAID') {
      classname = "badget-info"
    } else {
      classname = 'badge-primary'
    }
    return (
      <span className={`badge ${classname} mb-0`}>{row.status}</span>
    )
  }

  toggleActionButton(index) {
    let temp = Object.assign({}, this.state.actionButtons)
    if (temp[index]) {
      temp[index] = false
    } else {
      temp[index] = true
    }
    this.setState({
      actionButtons: temp
    })
  }



  renderActions(cell, row) {
    return (
      <div>
        <ButtonDropdown
          isOpen={this.state.actionButtons[row.id]}
          toggle={() => this.toggleActionButton(row.id)}
        >
          <DropdownToggle size="sm" color="primary" className="btn-brand icon">
            {
              this.state.actionButtons[row.id] === true ?
                <i className="fas fa-chevron-up" />
                :
                <i className="fas fa-chevron-down" />
            }
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => this.props.history.push('/admin/expense/supplier-invoice/detail', { id: row.id })}>
              <i className="fas fa-edit" /> Edit
            </DropdownItem>
            {row.status !== 'Post' && (
              <DropdownItem onClick={() => { this.postInvoice(row) }}>
                <i className="fas fa-heart" /> Post
                        </DropdownItem>
            )}
            <DropdownItem  onClick={()=>{this.openInvoicePreviewModal()}}>
              <i className="fas fa-eye" /> View
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-upload" /> Send
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-print" /> Print
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-times" /> Cancel
            </DropdownItem>
            <DropdownItem>
              <i className="fa fa-trash-o" /> Delete
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
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
    let { selectedRows, filterData } = this.state;
    const { supplier_invoice_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.supplierInvoiceActions.removeBulk(obj).then((res) => {
      this.initializeData(filterData)
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (supplier_invoice_list && supplier_invoice_list.length > 0) {
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

  handleChange(val, name) {
    this.setState({
      filterData: Object.assign(this.state.filterData, {
        [name]: val
      })
    })
  }

  handleSearch() {
    this.initializeData()
  }

  postInvoice(row){
    this.setState({
      loading: true
    })
    const postingRequestModel = {
      amount : row.invoiceAmount,
      postingRefId: row.id,
      postingRefType: 'INVOICE'
    }
    this.props.supplierInvoiceActions.postInvoice(postingRequestModel).then(res => {
    if (res.status === 200) {
      this.props.commonActions.tostifyAlert('success', 'Invoice Posted Successfully');
      this.setState({
        loading: false
      })
      this.initializeData()
     }
    }).catch(err => {
       this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.message : null);
       this.setState({
        loading: false
      })
    })
  }

  openInvoicePreviewModal() {
    this.setState({ openInvoicePreviewModal: true })
  }

  closeInvoicePreviewModal(res) {
    this.setState({ openInvoicePreviewModal: false })
  }

  render() {
    const { loading, filterData, dialog, selectedRows } = this.state
    const {  status_list, supplier_list } = this.props
    // const containerStyle = {
    //   zIndex: 1999
    // }

    const supplier_invoice_data = this.props.supplier_invoice_list ? this.props.supplier_invoice_list.map(supplier =>

      ({
        id: supplier.id,
        status: supplier.status,
        customerName: supplier.name,
        invoiceNumber: supplier.referenceNumber,
        invoiceDate: supplier.invoiceDate ? moment(supplier.invoiceDate).format('DD/MM/YYYY') : '',
        invoiceDueDate: supplier.invoiceDueDate ? moment(supplier.invoiceDueDate).format('DD/MM/YYYY'): '',
        invoiceAmount: supplier.totalAmount,
        vatAmount: supplier.totalVatAmount,
      })
    ) : ""


    return (
      <div className="supplier-invoice-screen">
        <div className="animated fadeIn">
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="fas fa-address-book" />
                    <span className="ml-2">Supplier Invoices</span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {dialog}
              {
                loading &&
                  <Row>
                    <Col lg={12} className="rounded-loader">
                      <Loader />
                    </Col>
                  </Row>
              }
                  
                  <Row>
                    <Col lg={12}>
                      <div className="mb-4 status-panel p-3">
                        <Row>
                          <Col lg={3}>
                            <h5>Overdue</h5>
                            <h3 className="status-title">$53.25 USD</h3>
                          </Col>
                          <Col lg={3}>
                            <h5>Due Within This Week</h5>
                            <h3 className="status-title">$220.28 USD</h3>
                          </Col>
                          <Col lg={3}>
                            <h5>Due Within 30 Days</h5>
                            <h3 className="status-title">$220.28 USD</h3>
                          </Col>
                          <Col lg={3}>
                            <h5>Average Time to Get Paid</h5>
                            <h3 className="status-title">0 day</h3>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex justify-content-end">
                        <ButtonGroup size="sm">
                          <Button
                            color="success"
                            type="button"
                            className="btn-square"
                            onClick={() => {
                              this.table.handleExportCSV()
                            }}
                            // disabled={supplier_invoice_list.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/expense/supplier-invoice/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Invoice
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
                            <Select
                              className="select-default-width"
                              placeholder="Select Supplier"
                              id="supplier"
                              name="supplier"
                              options={supplier_list ? selectOptionsFactory.renderOptions('label', 'value', supplier_list, 'Supplier Name') : []}
                              value={filterData.supplierId}
                              onChange={(option) => { 
                                if(option && option.value) {
                                  this.handleChange(option.value, 'supplierId')
                                } else {
                                  this.handleChange('', 'supplierId')
                                }
                               }}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Reference Number" onChange={(e) => { this.handleChange(e.target.value, 'referenceNumber') }} />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <DatePicker
                              className="form-control"
                              id="date"
                              name="invoiceDate"
                              placeholderText="Invoice Date"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              selected={filterData.invoiceDate}
                              // value={filterData.invoiceDate}
                              onChange={(value) => {
                                this.handleChange(value, "invoiceDate")
                              }}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <DatePicker
                              className="form-control"
                              id="date"
                              name="invoiceDueDate"
                              placeholderText="Invoice Due Date"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              selected={filterData.invoiceDueDate}
                              onChange={(value) => {
                                this.handleChange(value, "invoiceDueDate")
                              }}
                            />
                          </Col>
                          <Col lg={1} className="mb-1">
                            <Input type="text" placeholder="Amount" onChange={(e) => { this.handleChange(e.target.value, 'amount') }} />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Select
                              className=""
                              // options={status_list ? status_list.map(item => {
                              //   return { label: item, value: item }
                              // }) : ''}
                              options={status_list ? selectOptionsFactory.renderOptions('label', 'value', status_list, 'Status') : []}
                              value={this.state.filterData.status}
                              onChange={(option) => { 
                                if(option && option.value) {
                                  this.handleChange(option.value, 'status')
                                } else {
                                  this.handleChange('', 'status')
                                }
                               }}
                              placeholder="Status"
                            />
                          </Col>
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
                          data={supplier_invoice_data}
                          version="4"
                          hover
                          keyField="id"
                          pagination
                          remote
                          fetchInfo={{ dataTotalSize: supplier_invoice_data.totalCount ? supplier_invoice_data.totalCount : 0 }}
                          className="supplier-invoice-table"
                          ref={node => this.table = node}
                        >

                          <TableHeaderColumn
                            width="130"
                            dataField="status"
                            dataFormat={this.renderInvoiceStatus}
                            dataSort
                          >
                            Status
                          </TableHeaderColumn>
                          <TableHeaderColumn                           
                            dataField="customerName"
                            dataSort
                          >
                            Supplier Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="invoiceNumber"
                            // dataFormat={this.renderInvoiceNumber}
                            dataSort
                          >
                            Invoice Number
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="invoiceDate"
                            dataSort
                          >
                            Invoice Date
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="invoiceDueDate"
                            dataSort
                          >
                            Due Date
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="invoiceAmount"
                            dataSort
                          >
                            Invoice Amount
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="vatAmount"
                            dataSort
                          >
                            VAT Amount
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            className="text-right"
                            columnClassName="text-right"
                            width="55"
                            dataFormat={this.renderActions}
                          >
                          </TableHeaderColumn>
                        </BootstrapTable>
                      </div>
                    </Col>
                  </Row>
            </CardBody>
          </Card>
        </div>
        <PreviewInvoiceModal
          openInvoicePreviewModal={this.state.openInvoicePreviewModal}
          closeInvoicePreviewModal={(e) => { this.closeInvoicePreviewModal(e) }}
        />
      </div>




    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SupplierInvoice)
