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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { selectOptionsFactory } from 'utils'

import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'bootstrap-daterangepicker/daterangepicker.css'
import {
  CommonActions
} from 'services/global'


import * as ReceiptActions from './actions'
import moment from 'moment'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    receipt_list: state.receipt.receipt_list,
    invoice_list: state.receipt.invoice_list,
    contact_list: state.receipt.contact_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    receiptActions: bindActionCreators(ReceiptActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class Receipt extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      selectedRows: [],
      dialog: false,
      filterData: {
        contactId: '',
        invoiceId: '',
        receiptReferenceCode: '',
        receiptDate: '',
      }
    }

    this.initializeData = this.initializeData.bind(this)
    this.renderMode = this.renderMode.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
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
      pageNo: this.options.page ? this.options.page - 1 : 0,
      pageSize: this.options.sizePerPage
    }
    const postData = { ...filterData, ...data };
    this.props.receiptActions.getContactList();
    this.props.receiptActions.getInvoiceList();
    this.props.receiptActions.getReceiptList(postData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch((err) => {
      this.setState({ loading: false })
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  goToDetail(row) {
    this.props.history.push('/admin/revenue/receipt/detail', { id: row.receiptId })
  }

  renderMode(cell, row) {
    return (
      <span className="badge badge-success mb-0">Cash</span>
    )
  }

  renderDate(cell, rows) {
    return rows['receiptDate'] !== null ? moment(rows['receiptDate']).format('DD/MM/YYYY') : ''
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
      temp_list.push(row.receiptId);
    } else {
      this.state.selectedRows.map(item => {
        if (item !== row.receiptId) {
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
      rows.map(item => temp_list.push(item.receiptId))
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
    let { selectedRows } = this.state;
    const { receipt_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.removeDialog()
    this.props.receiptActions.removeBulk(obj).then((res) => {
      this.initializeData();
      this.props.commonActions.tostifyAlert('success', 'Receipt Deleted Successfully')
      if (receipt_list && receipt_list.length > 0) {
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
    this.initializeData();
  }

  render() {
    const { loading, dialog, selectedRows, filterData } = this.state
    const { receipt_list, invoice_list, contact_list } = this.props;

    return (
      <div className="receipt-screen">
        <div className="animated fadeIn">
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          {dialog}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fa fa-file-o" />
                    <span className="ml-2">Receipts</span>
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
                            disabled={receipt_list.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/revenue/receipt/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Receipt
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
                            <DatePicker
                              className="form-control"
                              id="date"
                              name="receiptDate"
                              placeholderText="Receipt Date"
                              selected={filterData.receiptDate}
                              showMonthDropdown
                              showYearDropdown
                              dateFormat="dd/MM/yyyy"
                              dropdownMode="select"
                              onChange={(value) => {
                                this.handleChange(value, "receiptDate")
                              }}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Reference Number" onChange={(e) => { this.handleChange(e.target.value, 'receiptReferenceCode') }} />
                          </Col>
                          <Col lg={3} className="mb-1">
                            <FormGroup className="mb-3">
                              <Select
                                options={invoice_list ? selectOptionsFactory.renderOptions('label', 'value', invoice_list, 'Invoice Number') : []}
                                className="select-default-width"
                                placeholder="Invoice Number"
                                value={filterData.invoiceId}
                                onChange={(option) => {
                                  if (option && option.value) {
                                    this.handleChange(option.value, 'invoiceId')
                                  } else {
                                    this.handleChange('', 'invoiceId')

                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={3} className="mb-1">
                            <FormGroup className="mb-3">
                              <Select
                                options={contact_list ? selectOptionsFactory.renderOptions('label', 'value', contact_list, 'Customer') : []}
                                className="select-default-width"
                                placeholder="Customer Name"
                                value={filterData.contactId}
                                onChange={(option) => {
                                  if (option && option.value) {
                                    this.handleChange(option.value, 'contactId')
                                  } else {
                                    this.handleChange('', 'contactId')

                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={2} className="mb-1">
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
                          data={receipt_list  && receipt_list.data ? receipt_list.data : []}
                          version="4"
                          keyField="receiptId"
                          hover
                          pagination = {receipt_list && receipt_list.data && receipt_list.data.length > 0 ? true : false}
                          remote
                          fetchInfo={{ dataTotalSize: receipt_list.count ? receipt_list.count : 0 }}
                          className="receipt-table"
                          trClassName="cursor-pointer"
                          csvFileName="Receipt.csv"
                          ref={node => this.table = node}
                        >
                          <TableHeaderColumn
                            dataField="receiptDate"
                            dataSort
                            dataFormat={this.renderDate}
                          >
                            Receipt Date
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="referenceCode"
                            dataSort
                          >
                            Reference Number
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="customerName"
                            dataSort
                          >
                            Customer Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="invoiceNumber"
                            dataSort
                          >
                            Invoice #
                          </TableHeaderColumn>
                          {/* <TableHeaderColumn
                            dataField="transactionType"
                            dataFormat={this.renderMode}
                            dataSort
                          >
                            Mode
                          </TableHeaderColumn> */}
                          <TableHeaderColumn
                            dataField="amount"
                            dataSort
                          >
                            Amount
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="unusedAmount"
                            dataSort
                          >
                            Unused Amount
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

export default connect(mapStateToProps, mapDispatchToProps)(Receipt)
