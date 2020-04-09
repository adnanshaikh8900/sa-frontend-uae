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
  FormGroup,
  Alert
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
import { CSVLink } from "react-csv";


import './style.scss'
// import moment from 'moment'

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
      selectedreconcileRrefId: '',
      id: '',
      dialog: null,
      selectedRowData: {},
      sidebarOpen: false,
      transaction_type_list_reconcile: [],
      categoryList: {},
      reconcileData: {
        categoryType: '',
        reconcileRrefId: '',
      },
      categoryDetails: {},
      selectedReconcilereconcileRrefId: '',
      selectedReconcileCategoryType: '',
      // categoryLabel: '',
      csvData: [],
      view: false,
      selectedRow: '',
      explainList: [],
      transaction_amount: 0,
      currentBalance: 0,
      idCount: 0,
      showChartOfAccount: false,
      transaction_category_list: [],
      selectedTransactionCategoryType: '',
      submitBtnClick: false,
      transactionId: '',
      showAlert: false
    }

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
    this.csvLink = React.createRef()
  }

  componentDidMount = () => {
    this.props.transactionsActions.getTransactionTypeList();
    this.initializeData()
  }

  initializeData = (search) => {
    let { filterData } = this.state
    const data = {
      pageNo: this.options.page ? this.options.page - 1 : 0,
      pageSize: this.options.sizePerPage
    }
    if (this.props.location.state && this.props.location.state.bankAccountId) {
      const postData = { ...filterData, ...data, id: this.props.location.state.bankAccountId }
      this.props.transactionsActions.getTransactionList(postData).then((res) => {
        if (res.status === 200) {
          this.setState({
            loading: false
          },()=>{
            if(search) {
              this.setState({
                filterData: {
                  transactionDate: '',
                  chartOfAccountId: ''
                },
              })
            }
          });
        }
      }).catch((err) => {
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong');
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
  addRow = () => {
    const explainList = [...this.state.explainList]
    this.setState({
      explainList: explainList.concat({
        id: this.state.idCount + 1,
        categoryType: '',
        reconcileRrefId: '',
        categoryLabel: ''
      }), idCount: this.state.idCount + 1
    })
  }

  deleteRow = (id) => {
    const ids = id;
    let newData = []
    const data = this.state.explainList
    newData = data.filter((obj) => obj.id !== ids);
    this.setState({
      explainList: newData
    }, () => {
      this.calculateCurrentBalance()
    })
  }

  onSetSidebarOpen = (open, data) => {
    let transaction_amount = data.withdrawalAmount ? data.withdrawalAmount : data.depositeAmount;
    this.setState({
      explainList: [{
        id: 0,
        categoryType: '',
        reconcileRrefId: '',
        categoryLabel: ''
      }]
    }, () => {
      this.setState({ sidebarOpen: open, transactionId: data.id, categoryDetails: {}, selectedRow: data.id, transaction_amount, currentBalance: transaction_amount,showAlert: false,submitBtnClick: false });
      this.getTransactionListForReconcile(data.debitCreditFlag)
    })
  }

  getTransactionListForReconcile = (type) => {
    let element = document.querySelector('body');
    if (!element.className.includes('sidebar-minimized')) {
      element.className = element.className + ' sidebar-minimized brand-minimized'
    }

    this.props.transactionsActions.getTransactionListForReconcile(type).then((res) => {
      if (res.status === 200) {
        this.setState({
          transaction_type_list_reconcile: res.data
        })
      }
    })
  }

  getCategoryList = (options) => {
    const { label, value } = options
    const { currentBalance, categoryList } = this.state
    let data = Object.assign({}, categoryList)
    let keys = Object.keys(data)
    if (!keys.includes(label)) {
      this.props.transactionsActions.getCategoryListForReconcile(value).then((res) => {
        if (res.status === 200) {
          res.data.map((x) => {
            x['name'] = x.label
            x['label'] = `${x['label']} (${x['amount']} ${x['currencySymbol']})`
            x['disabled'] = x['amount'] <= currentBalance ? false : true
            return x
          })
          data[`${label}`] = res.data
          this.setState({
            categoryList: data
          })
        }
      })
    }
  }

  getDetail = (val) => {
    const data = this.state.categoryList.filter((x) => x.id === val)
    this.setState({
      categoryDetails: {
        name: data[0].name,
        date: data[0].date,
        amount: `${data[0].currencySymbol} ${(data[0].amount).toFixed(2)}`,
        due_date: data[0].dueDate,
      },
    })
  }

  checkChartOfAccount = () => {
    const { transaction_amount, currentBalance, submitBtnClick,transaction_category_list} = this.state
    if (transaction_amount > currentBalance && currentBalance !== 0 && submitBtnClick) {
      this.setState({
        showChartOfAccount: true
      })
      if(transaction_category_list.length === 0) {
        this.props.transactionsActions.getTransactionCategoryList().then((res) => {
          if (res.status === 200) {
            this.setState({
              transaction_category_list: res.data.data
            })
          }
        })
      }
      return true
    } else {
      this.setState({
        showChartOfAccount: false,
        selectedTransactionCategoryType: ''
      })
      return false
    }
  }

  handleSubmit = () => {
    const { selectedTransactionCategoryType } = this.state
    const postData = {
      'transactionCategory': selectedTransactionCategoryType,
    }
    this.setState({
      submitBtnClick: true
    }, () => {
      if (this.checkChartOfAccount()) {
        if (postData.transactionCategory && !this.checkedRow()) {
          this.setState({
            showAlert: false
          })
          this.submitExplain(postData)
        } else {
          this.setState({
            showAlert: true
          })
        }
      } else {
        if(!this.checkedRow()) {
          this.submitExplain(postData)
        }
      }
    })
  }

  submitExplain = (postData) => {
    const { transactionId, explainList, currentBalance } = this.state
    let data = [...explainList]
    data = JSON.parse(JSON.stringify(data));
    const temp = data.map((item) => {
      delete item['id']
      delete item['categoryLabel']
      return item
    })
    let obj = { ...{ explainData: temp }, transactionId, ...{ 'remainingBalance': currentBalance } };
    if (postData.transactionCategory) {
      obj = { ...obj, ...postData }
    }
    this.props.transactionsActions.reconcileTransaction(obj).then((res) => {
      if (res.status === 200) {
        this.setState({
          sidebarOpen: false
        })
      }
    })
  }

  closeSideBar = () => {
    this.setState({ sidebarOpen: false, selectedRowData: '', selectedRow: '', explainList: [], showChartOfAccount: false, selectedTransactionCategoryType: '', submitBtnClick: false,showAlert: false })
    let element = document.querySelector('body');
    element.className = element.className.replace('sidebar-minimized brand-minimized', '')
  }

  checkedRow = () => {
    const { explainList } = this.state
    if (explainList.length > 0) {
      let length = explainList.length - 1
      let temp = Object.values(explainList[length]).indexOf('');
      if (temp > -1) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  checkCategory = (value, label) => {
    const { explainList } = this.state;
    const temp = explainList.filter(item => item[`${label}`] === value)
    if (temp.length > 0) {
      return false
    } else {
      return true
    }
  }

  getSideBarContent = () => {
    const { transaction_type_list_reconcile, categoryList, showChartOfAccount, transaction_amount, currentBalance, explainList, transaction_category_list ,submitBtnClick , showAlert} = this.state
    // const { date, amount, name, due_date } = this.state.categoryDetails
    return (
      <div className="sidebar-content">
        <div className="header text">
          <h2>Explain</h2>
          <i className="fa fa-close close-btn" onClick={() => this.closeSideBar()}></i>
        </div>
        {
          <div>
            <div className="content-details p-3">
              { (this.checkedRow() && submitBtnClick) || showAlert ? ( <Alert color="danger">
                Please Select all the remaining fields.
              </Alert> ) : null}
              <Row>
                <Col lg={5}>
                  <label class="value">Transaction Amount</label>
                  <label class="value">{transaction_amount}</label>
                </Col>
                <Col lg={5} className="p-0">
                  <label class="value">Current Balance</label>
                  <label class="value">{currentBalance}</label>
                </Col>
                <Col lg={1}>
                  <div className="text-right">
                    <Button color="primary" className="btn-square" onClick={this.addRow} disabled={currentBalance === 0 ? true : false}
                    >
                      <i className="fa fa-plus"></i>
                    </Button>
                  </div>
                </Col>
              </Row>
              <form>
                <div className="details-container">
                  {explainList && explainList.map((item, index) => (
                    <div className="d-flex detail-row">
                      <div className="mb-3 mr-3" style={{ width: '40%' }}>
                        <Label className="label">Transaction Type</Label>
                        <Select
                          options={transaction_type_list_reconcile ? selectOptionsFactory.renderOptions('label', 'value', transaction_type_list_reconcile, 'Transaction Type') : []}
                          onChange={(val) => {
                            if (val && val.value) {
                              this.handleChange(val.label, 'categoryLabel', true, item)
                              this.handleChange(val.value, 'categoryType', true, item)
                              this.getCategoryList(val)
                            } else {
                              this.handleChange('', 'categoryType', true, item)
                            }
                          }}
                          className="select-default-width"
                          placeholder="Transaction Type"
                          value={item.categoryType}
                        />
                      </div>
                      {explainList[`${index}`].categoryType && <div className="mb-3" style={{ width: '40%' }}>
                        <Label className="label">{explainList[`${index}`].categoryLabel}</Label>
                        <Select
                          options={categoryList[`${explainList[`${index}`].categoryLabel}`] ? selectOptionsFactory.renderOptions('label', 'id', categoryList[`${explainList[`${index}`].categoryLabel}`], explainList[`${index}`].categoryLabel, ['disabled']) : []}
                          onChange={(val) => {
                            if (val && val.value) {
                              // this.getDetail(val.value)
                              if (this.checkCategory(val.value, 'reconcileRrefId')) {
                                this.handleChange(val.value, 'reconcileRrefId', true, item, explainList[`${index}`].categoryLabel)
                              } else {
                                this.handleChange('', 'reconcileRrefId', true, item, explainList[`${index}`].categoryLabel)
                              }
                            } else {
                              this.handleChange('', 'reconcileRrefId', true, item, explainList[`${index}`].categoryLabel)
                            }
                          }}
                          className="select-default-width"
                          value={item.reconcileRrefId}
                        />
                      </div>}
                      {/* {name ?
                                      <>
                                        <label className="label">Name</label>
                                        <label className="value">{name}</label>
                                      </> : ''
                                    }
                                    {amount ?
                                      <>
                                        <label className="label">Amount</label>
                                        <label className="value">{amount}</label>
                                      </> : ''
                                    }
                                    {date ?
                                      <>
                                        <label className="label">Date</label>
                                        <label className="value">{moment(date).format('DD/MM/YYYY')}</label>
                                      </> : ''
                                    }
                                    {due_date ?
                                      <>
                                        <label className="label">Due Date</label>
                                        <label className="value">{moment(due_date).format('DD/MM/YYYY')}</label>
                                      </> : ''
                                    } */}
                      <div className="remove-row">
                        <button className="btn" onClick={() => this.deleteRow(item.id)} disabled={explainList.length === 1}>
                          <i className="fa fa-close" ></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  {transaction_amount > currentBalance && showChartOfAccount && (
                    <Row className="m-0">
                      <Col lg={5} className="pl-0">
                        <label class="value">Remaining Balance</label>
                        <label class="value">{currentBalance}</label>
                      </Col>
                      <Col lg={5} className="p-0">
                        <Label className="label">Transaction Category</Label>
                        <Select
                          options={transaction_category_list ? selectOptionsFactory.renderOptions('transactionCategoryName', 'transactionCategoryId', transaction_category_list, 'Type') : ''}
                          value={this.state.selectedTransactionCategoryType}
                          onChange={(option) => {
                            if (option && option.value) {
                              this.setState({
                                selectedTransactionCategoryType: option.value,
                                showAlert: false
                              })
                            } else {
                              this.setState({
                                selectedTransactionCategoryType: option.value,
                                showAlert: true
                              })
                            }
                          }}
                          placeholder="Select Type"
                          id="chartOfAccountId"
                          name="chartOfAccountId"
                        />
                      </Col>
                    </Row>

                  )}
                </div>
                <Row>
                  <Col lg={12}>
                    <FormGroup className="text-right">
                      <Button type="button" color="primary" className="btn-square" onClick={() => { this.handleSubmit() }}
                        disabled={currentBalance === transaction_amount ? true : false}
                      >
                        <i className="fa fa-dot-circle-o"></i> Explain
                        </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
          // :
          // <Loader />
        }
      </div >)
  }

  toggleActionButton = (index) => {
    let val = index
    let temp = Object.assign({}, this.state.actionButtons)
    if (temp[val]) {
      temp[val] = false
    } else {
      temp[val] = true
    }
    this.setState({
      actionButtons: temp
    })
  }

  renderAccountNumber = (cell, row) => {
    return (
      <label
        className="mb-0 my-link"
        onClick={() => this.props.history.push('/admin/banking/bank-account/transaction/detail')}
      >
        {row.reference_number}
      </label>
    )
  }

  renderTransactionStatus = (cell, row) => {
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

  renderreconcileRrefId = (cell, row) => {
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

  renderDepositAmount = (cell, row) => {
    return row.depositeAmount >= 0 ? (row.depositeAmount).toFixed(2) : ''
  }
  renderWithdrawalAmount = (cell, row) => {
    return row.withdrawalAmount >= 0 ? (row.withdrawalAmount).toFixed(2) : ''
  }
  renderRunningAmount = (cell, row) => {
    return row.runningAmount >= 0 ? (row.runningAmount).toFixed(2) : ''
  }

  renderActions = (cell, row) => {
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
              <i className="fa fa-connectdevelop" /> Explain
            </DropdownItem>
            <DropdownItem onClick={() => this.closeTransaction(row.id)}>
              <i className="fa fa-trash" /> Delete
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }

  onRowSelect = (row, isSelected, e) => {
  }
  onSelectAll = (isSelected, rows) => {
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

  handleChange = (val, name, reconcile, row, label) => {
    if (!reconcile) {
      this.setState({
        filterData: Object.assign(this.state.filterData, {
          [name]: val
        })
      })
    } else {
      if (row) {
        this.handleExplain(val, name, reconcile, row, label)
      }
    }
  }

  handleExplain = (val, name, reconcile, row, label) => {
    let data = [...this.state.explainList];
    data.map((item, index) => {
      if (item.id === row.id) {
        data[`${index}`][`${name}`] = val
      }
      return item
    })
    this.setState({
      explainList: data
    }, () => {
      // if (name === 'reconcileRrefId') {
      this.calculateCurrentBalance();
      // }
    })
  }

  calculateCurrentBalance = () => {
    let temp;
    let amount = 0;
    this.state.explainList.map((obj) => {
      for (let item in this.state.categoryList) {
        let tempAmount;
        if (item === obj['categoryLabel']) {
          temp = this.state.categoryList[`${obj['categoryLabel']}`].filter((item) => item.id === obj.reconcileRrefId);
          tempAmount = temp.length ? temp[0]['amount'] : 0
          amount = amount + tempAmount;
        }
      }
      return obj
    })
    this.setState({
      currentBalance: this.state.transaction_amount - amount
    }, () => {
      this.checkChartOfAccount()
    })
  }

  handleSearch = () => {
    this.initializeData(true);
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
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog = () => {
    this.setState({
      dialog: null
    })
  }

  getCsvData = () => {
    if (this.state.csvData.length === 0) {
      let obj = {
        paginationDisable: true
      }
      this.props.transactionsActions.getTransactionList(obj).then((res) => {
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


  render() {

    const {
      loading,
      statusOptions,
      filterData,
      dialog,
      csvData,
      view
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
                            color="success"
                            className="btn-square"
                            onClick={() => this.getCsvData()}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />Export To CSV
                          </Button>
                          {view && <CSVLink
                            data={csvData}
                            filename={'Transaction.csv'}
                            className="hidden"
                            ref={this.csvLink}
                            target="_blank"
                          />}
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
                                  this.setState({ 'selectedreconcileRrefId': val.value })
                                } else {
                                  this.handleChange('', 'chartOfAccountId')
                                  this.setState({ 'selectedreconcileRrefId': '' })
                                }
                              }}
                              className="select-default-width"
                              placeholder="Transaction Type"
                              value={filterData.chartOfAccountId}
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
                              autoComplete="off"
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
                          selectRow={{
                            mode: 'radio',
                            clickToSelect: true,
                            bgColor: '#ccc',
                            // onSelect: this.onRowSelect,
                            // onSelectAll: this.onAllRowSelect,
                            selected: [this.state.selectedRow],
                            hideSelectColumn: true
                          }}
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
                            // dataFormat={this.renderreconcileRrefId}
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
