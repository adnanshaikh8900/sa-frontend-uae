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
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  FormGroup
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'


import { Loader, ConfirmDeleteModal, SidebarComponent } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'bootstrap-daterangepicker/daterangepicker.css'


import * as TransactionsActions from './actions'
import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'


import './style.scss'
import moment from 'moment'

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
      loading: true,
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
        chartOfAccountId: ''
      },
      selectedData: null,
      selectedTransactionType: '',
      id: '',
      dialog: null,
      selectedRowData: {},
      sidebarOpen: false,
      transaction_type_list_reconcile: [],
      categoryList: [],
      reconcileData: {
        transaction_type: '',
        category_type: '',
        transaction_id: ''
      },
      categoryDetails: {},
      selectedReconcileTransactionType: '',
      selectedReconcileCategoryType: ''
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
    if (this.props.location.state && this.props.location.state.bankAccountId) {
      const postData = { ...filterData, ...data, id: this.props.location.state.bankAccountId }
      this.props.transactionsActions.getTransactionList(postData).then(res => {
        this.props.transactionsActions.getTransactionTypeList();
        if (res.status === 200) {
          this.setState({
            loading: false
          });
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
  onSetSidebarOpen = (open, data) => {
    this.setState({ sidebarOpen: open, reconcileData: {transaction_id: data.id} });
    this.getTransactionListForReconcile(data.debitCreditFlag)
  }

  getTransactionListForReconcile(type) {
    // let element = document.querySelector('body');
    // element.className = element.className + '' + ' sidebar-minimized brand-minimized'
   

    this.props.transactionsActions.getTransactionListForReconcile(type).then(res => {
      if(res.status === 200) {
        this.setState({
          transaction_type_list_reconcile: res.data
      })
    }})
}

  getCategoryList(val) {
    this.props.transactionsActions.getCategoryListForReconcile(val).then(res => {
      if (res.status === 200) {
        res.data.map(x => {
          x['name'] = x.label
          x['label'] = `${x['label']}(${x['amount']} ${x['date']})`
          return x
        })
        this.setState({
          categoryList: res.data
        })
  }})
}

  getDetail(val) {
    const data = this.state.categoryList.filter(x => x.id === val)
    this.setState({
          categoryDetails: {
            name: data[0].name,
            date: data[0].date,
            amount: data[0].amount
          }
    })
  }

  handleSubmit = () => {
    const { reconcileData} = this.state
    const postData= {
     reconcileCategoryCode: reconcileData.transaction_type,
     reconcileRrefId:  reconcileData.category_type,
     transactionId:  reconcileData.transaction_id
    }
    this.props.transactionsActions.reconcileTransaction(postData).then(res => {
      if (res.status === 200) {
        this.setState({
          sidebarOpen: false
        })
      }
    })
  }

  closeSideBar = () => {
    this.setState({ sidebarOpen: false, selectedRowData: '' })
    // let element = document.querySelector('body');
    // element.className = element.className.replace('sidebar-minimized brand-minimized','')
  }

  getSideBarContent = () => {
    const { transaction_type_list_reconcile, categoryList, reconcileData } = this.state
    const { date, amount, name } = this.state.categoryDetails
    return (
      <div className="sidebar-content">
        <div className="header text">
          <h2>Reconcile</h2>
          <i className="fa fa-close" onClick={() => this.closeSideBar()}></i>
        </div>
        {
          <div>
            <div className="content-details p-3">
              <form>
                <div className="mb-3">
                  <Label className="label">Transaction Type</Label>
                  <Select
                    options={transaction_type_list_reconcile ? selectOptionsFactory.renderOptions('label', 'value', transaction_type_list_reconcile, 'Transaction Type') : []}
                    onChange={(val) => {
                      if (val && val.value) {
                        this.getCategoryList(val.value)
                        this.handleChange(val.value, 'transaction_type',true)
                      } else {
                        this.handleChange('', 'transaction_type',true)
                      }
                    }}
                    className="select-default-width"
                    placeholder="Transaction Type"
                    value={reconcileData.transaction_type}
                  />
                </div>
                {reconcileData.transaction_type && <div className="mb-3">
                  <Label className="label">Category</Label>
                  <Select
                    options={categoryList ? selectOptionsFactory.renderOptions('label', 'id', categoryList, 'Category') : []}
                    onChange={(val) => {
                      if (val && val.value) {
                        this.getDetail(val.value)
                        this.handleChange(val.value, 'category_type',true)
                      } else {
                        this.handleChange('', 'category_type')
                      }
                    }}
                    className="select-default-width"
                    placeholder="Transaction Type"
                    value={reconcileData.category_type}
                  />
                </div>}
                {name ?
                  <>
                    <label className="label">Name</label>
                    <label className="value">{name}</label>
                  </> : ''
                }
                {amount ?
                  <>
                    <label className="label">Amount</label>
                    <label className="value">{amount.toFixed(2)}</label>
                  </> : ''
                }
                {date ?
                  <>
                    <label className="label">Date</label>
                    <label className="value">{moment(date).format('DD/MM/YYYY')}</label>
                  </> : ''
                }
              {name && <Row>
                  <Col lg={12} className="mt-5">
                    <FormGroup className="text-right">
                      <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {this.handleSubmit()}}>
                        <i className="fa fa-dot-circle-o"></i> Reconcile
                        </Button>

                    </FormGroup>
                  </Col>
                </Row> }
              </form>
            </div>
          </div>
          // :
          // <Loader />
        }
      </div >)
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

  renderDepositAmount(cell, row) {
    return row.depositeAmount >= 0 ? (row.depositeAmount).toFixed(2) : ''
  }
  renderWithdrawalAmount(cell, row) {
    return row.withdrawalAmount >= 0 ? (row.withdrawalAmount).toFixed(2) : ''
  }
  renderRunningAmount(cell, row) {
    return row.runningAmount >= 0 ? (row.runningAmount).toFixed(2) : ''
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
            <DropdownItem onClick={() => { this.onSetSidebarOpen(true, row) }}>
              <i className="fa fa-connectdevelop" /> Reconcile
            </DropdownItem>
            <DropdownItem onClick={() => this.closeTransaction(row.id)}>
              <i className="fa fa-trash" /> Close
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }

  onRowSelect(row, isSelected, e) {
  }
  onSelectAll(isSelected, rows) {
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

  handleChange(val, name, reconcile) {
    if (!reconcile) {
      this.setState({
        filterData: Object.assign(this.state.filterData, {
          [name]: val
        })
      })
    } else {
      this.setState({
        reconcileData: Object.assign(this.state.reconcileData, {
          [name]: val
        })
      })
    }
  }

  handleSearch() {
    this.initializeData();
  }

  closeTransaction = (id) => {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={() => this.removeTransaction(id)}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeTransaction = (id) => {
    this.removeDialog()
    this.props.transactionsActions.deleteTransactionById(id).then((res) => {
      this.props.commonActions.tostifyAlert('success', 'Transaction Deleted Successfully')
      this.initializeData()
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog = () => {
    this.setState({
      dialog: null
    })
  }

  render() {

    const {
      loading,
      statusOptions,
      filterData,
      dialog
    } = this.state
    const { bank_transaction_list, transaction_type_list } = this.props

    return (
      <div className="bank-transaction-screen">
        <div className="animated fadeIn">
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          <Card className={this.state.sidebarOpen ? `main-table-panel` : ''}>
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
              <SidebarComponent
                sidebar={this.getSideBarContent()}
                pullRight
                sidebarOpen={this.state.sidebarOpen} />
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
                          <Col lg={3} className="mb-1">
                            <Select
                              className=""
                              options={statusOptions}
                              placeholder="Transaction Status(TBD)"
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Select
                              options={transaction_type_list ? selectOptionsFactory.renderOptions('chartOfAccountName', 'chartOfAccountId', transaction_type_list, 'Transaction Type') : []}
                              onChange={(val) => {
                                if (val && val.value) {
                                  this.handleChange(val.value, 'chartOfAccountId')
                                  this.setState({ 'selectedTransactionType': val.value })
                                } else {
                                  this.handleChange('', 'chartOfAccountId')
                                  this.setState({ 'selectedTransactionType': '' })
                                }
                              }}
                              className="select-default-width"
                              placeholder="Transaction Type"
                              value={this.state.selectedTransactionType}
                            />
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
                              dateFormat="dd-MM-yyyy"
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
                          data={bank_transaction_list.data ? bank_transaction_list.data : []}
                          version="4"
                          hover
                          keyField="id"
                          pagination={bank_transaction_list && bank_transaction_list.data && bank_transaction_list.data.length > 0 ? true : false}
                          // totalSize={bank_transaction_list ? bank_transaction_list.length : 0}
                          remote
                          fetchInfo={{ dataTotalSize: bank_transaction_list.count ? bank_transaction_list.count : 0 }}
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
                            dataFormat={this.renderDepositAmount}
                            dataAlign="right"
                          >
                            Deposit
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="withdrawalAmount"
                            dataSort
                            dataFormat={this.renderWithdrawalAmount}
                            dataAlign="right"

                          >
                            Withdrawal
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="runningAmount"
                            dataSort
                            dataFormat={this.renderRunningAmount}
                            dataAlign="right"

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
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankTransactions)
