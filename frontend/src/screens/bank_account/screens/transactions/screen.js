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
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'


import { Loader } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'bootstrap-daterangepicker/daterangepicker.css'


import * as TransactionsActions from './actions'
import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    bank_transaction_list: state.bank_account.bank_transaction_list,
    transaction_type_list: state.bank_account.transaction_type_list,

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    transactionsActions: bindActionCreators(TransactionsActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class BankTransactions extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      openDeleteModal: false,
      typeOptions: [
        { value: 'Withdrawal', label: 'Withdrawal' },
        { value: 'Deposit', label: 'Deposit' }
      ],
      statusOptions: [
        { value: 'All', label: 'All' },
        { value: 'Matched', label: 'Matched' },
        { value: 'Manually Added', label: 'Manually Added' },
        { value: 'Categorized', label: 'Categorized' },
        { value: 'Reconciled', label: 'Reconciled' },
        { value: 'Unreconciled', label: 'Unreconciled' }
      ]
      ,
      actionButtons: {},
      filterData: {
        transactionDate: '',
        transactionTypeCode: ''
      },
      selectedData: null,
      selectedTransactionType: ''
    }

    this.initializeData = this.initializeData.bind(this)
    // this.toggleDangerModal = this.toggleDangerModal.bind(this)
    this.renderAccountNumber = this.renderAccountNumber.bind(this)
    this.renderTransactionStatus = this.renderTransactionStatus.bind(this)
    this.renderTransactionType = this.renderTransactionType.bind(this)
    this.renderActions = this.renderActions.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.toggleActionButton = this.toggleActionButton.bind(this)
    this.onPageChange = this.onPageChange.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.options = {
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

  initializeData() {
    let { filterData } = this.state
    const data = {
      pageNo: this.options.page,
      pageSize: this.options.sizePerPage
    }
    if (this.props.location.state && this.props.location.state.bankAccountId) {
      const postData = { ...filterData, ...data ,id: this.props.location.state.bankAccountId}
      this.props.transactionsActions.getTransactionList(postData).then(res => {
        this.props.transactionsActions.getTransactionTypeList();
        if (res.status === 200) {
          this.setState({ loading: false });
        }
      }).catch(err => {
        // this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : '');
        this.setState({ loading: false })
      })
    } else {
      this.props.history.push('/admin/banking/bank-account')
    }
  }

  // toggleDangerModal () {
  //   this.setState({
  //     openDeleteModal: !this.state.openDeleteModal
  //   })
  // }

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

  renderAccountNumber(cell, row) {
    return (
      <label
        className="mb-0 my-link"
        onClick={() => this.props.history.push('/admin/banking/bank-account/transaction/detail')}
      >
        {row.reference_number}
      </label>
    )
  }

  renderTransactionStatus(cell, row) {
    let classname = ''
    if (row.status === 'Explained') {
      classname = 'badge-success'
    } else if (row.status === 'Unexplained') {
      classname = 'badge-danger'
    } else {
      classname = 'badge-primary'
    }
    return (
      <span className={`badge ${classname} mb-0`}>{row.status}</span>
    )
  }

  renderTransactionType(cell, row) {
    let classname = ''
    let value = ''
    if (row.status === 'Explained') {
      classname = 'badge-success'
      value = 'Withdrawal'
    } else if (row.status === 'Unexplained') {
      classname = 'badge-danger'
      value = 'Deposit'
    } else {
      classname = 'badge-primary'
      value = 'Tax Claim'
    }
    return (
      <span className={`badge ${classname} mb-0`}>{value}</span>
    )
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
              this.state.actionButtons[row.reference_number] === true ?
                <i className="fas fa-chevron-up" />
                :
                <i className="fas fa-chevron-down" />
            }
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => this.props.history.push('/admin/banking/bank-account/transaction/detail', { id: row.id })}>
              <i className="fas fa-edit" /> Edit
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-wrench" /> Archive
            </DropdownItem>
            <DropdownItem>
              <i className="fa fa-trash" /> Delete
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }

  onRowSelect(row, isSelected, e) {
    console.log('one row checked ++++++++', row)
  }
  onSelectAll(isSelected, rows) {
    console.log('current page all row checked ++++++++', rows)
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

    const {
      loading,
      statusOptions,
      filterData
    } = this.state
    const { bank_transaction_list,transaction_type_list} = this.props

    return (
      <div className="bank-transaction-screen">
        <div className="animated fadeIn">
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="icon-doc" />
                    <span className="ml-2">Bank Transactions</span>
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
                            color="info"
                            className="btn-square"
                            onClick={() => this.props.history.push('/admin/banking/upload-statement', {
                              bankAccountId: this.props.location.state && this.props.location.state.bankAccountId ?
                                this.props.location.state.bankAccountId : ''
                            })}
                          >
                            <i className="fa glyphicon glyphicon-export fa-upload mr-1" />
                            Upload Statement
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push('/admin/banking/bank-account/transaction/create', {
                              bankAccountId: this.props.location.state && this.props.location.state.bankAccountId ?
                                this.props.location.state.bankAccountId : ''
                            })}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Transaction
                          </Button>
                          <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.props.history.push('/admin/banking/bank-account/detail', {
                              bankAccountId: this.props.location.state && this.props.location.state.bankAccountId ?
                                this.props.location.state.bankAccountId : ''
                            })}
                          >
                            <i className="fas fa-edit mr-1" />
                            Edit Account
                          </Button>
                        </ButtonGroup>
                      </div>
                      <div className="py-3">
                        <h6>Filter : </h6>
                        <Row>
                          <Col lg={2} className="mb-1">
                            <Select
                              className=""
                              options={statusOptions}
                              placeholder="Transaction Status(TBD)"
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <FormGroup className="mb-3">

                              <Select
                                options={transaction_type_list ? selectOptionsFactory.renderOptions('transactionTypeName', 'transactionTypeCode', transaction_type_list, 'Transaction Type') : []}
                                onChange={(val) => {
                                  if (val && val.value) {
                                    this.handleChange(val.value, 'transactionTypeCode')
                                    this.setState({ 'selectedTransactionType': val.value })
                                  } else {
                                    this.handleChange('', 'transactionTypeCode')
                                    this.setState({ 'selectedTransactionType': '' })
                                  }
                                }}
                                className="select-default-width"
                                placeholder="Transaction Type"
                                value={this.state.selectedTransactionType}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={2} className="mb-1">
                          <DatePicker
                              className="form-control"
                              id="date"
                              name="transactionDate"
                              placeholderText="Transaction Date"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              selected={filterData.transactionDate}
                              onChange={(value) => {
                                this.handleChange(value, "transactionDate")
                              }}
                            />
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
                          search={false}
                          options={this.options}
                          data={bank_transaction_list ? bank_transaction_list : []}
                          version="4"
                          hover
                          keyField="id"
                          pagination
                          // totalSize={bank_transaction_list ? bank_transaction_list.length : 0}
                          remote
                          fetchInfo={{ dataTotalSize: bank_transaction_list.totalCount ? bank_transaction_list.totalCount : 0 }}
                          className="bank-transaction-table"
                        >
                          {/* <TableHeaderColumn
                            width="120"
                            dataFormat={this.renderTransactionStatus}
                          >
                          </TableHeaderColumn> */}
                          <TableHeaderColumn
                            dataField="transactionDate"
                            dataSort
                          >
                            Date
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="referenceNo"
                            // dataFormat={this.renderAccountNumber}
                            dataSort
                          >
                            Reference No.
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="transactionTypeName"
                            // dataFormat={this.renderTransactionType}
                            dataSort
                          >
                            Transaction Type
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="depositeAmount"
                            dataSort
                          >
                            Deposit
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="withdrawalAmount"
                            dataSort
                          >
                            Withdrawal
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="openingBalance"
                            dataSort
                          >
                            Running Balance
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
              }
            </CardBody>
          </Card>
          {/* <Modal
            isOpen={this.state.openDeleteModal}
            centered
            className="modal-primary"
          >
            <ModalHeader toggle={this.toggleDangerModal}>
              <h4 className="mb-0">Are you sure ?</h4>
            </ModalHeader>
            <ModalBody>
              <h5 className="mb-0">This record will be deleleted permanently.</h5>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="btn-square" onClick={this.deleteBank}>Yes</Button>{' '}
              <Button color="secondary" className="btn-square" onClick={this.toggleDangerModal}>No</Button>
            </ModalFooter>
          </Modal> */}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankTransactions)
