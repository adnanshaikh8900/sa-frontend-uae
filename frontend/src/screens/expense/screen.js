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
  Input,
  Label
} from 'reactstrap'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
// import DateRangePicker from 'react-bootstrap-daterangepicker'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import { Loader, ConfirmDeleteModal } from 'components'

import {
  selectOptionsFactory,
  filterFactory
} from 'utils'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'bootstrap-daterangepicker/daterangepicker.css'


import {
  CommonActions
} from 'services/global'
import * as ExpenseActions from './actions';

import moment from 'moment'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    expense_list: state.expense.expense_list,
    expense_categories_list: state.expense.expense_categories_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    expenseActions: bindActionCreators(ExpenseActions, dispatch)
  })
}

class Expense extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dialog: null,
      selectedRows: [],
      filterData: {
        expenseDate: '',
        transactionCategoryId: '',
        payee: ''
      }
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.bulkDeleteExpenses = this.bulkDeleteExpenses.bind(this);
    this.removeBulkExpenses = this.removeBulkExpenses.bind(this);
    this.removeDialog = this.removeDialog.bind(this);

    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this);
    this.renderDate = this.renderDate.bind(this);

    this.options = {
      onRowClick: this.goToDetail,
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

  componentWillUnmount() {
    this.setState({
      selectedRows: []
    })
  }

  componentDidMount() {
    this.initializeData()
    this.props.expenseActions.getExpenseCategoriesList();
  }

  initializeData() {
    this.props.expenseActions.getExpenseList(this.state.filterData);
  }

  goToDetail(row) {
    this.props.history.push('/admin/expense/expense/detail', { expenseId: row['expenseId'] })
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selectedRows)
      temp_list.push(row.expenseId);
    } else {
      this.state.selectedRows.map(item => {
        if (item !== row.expenseId) {
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
        temp_list.push(item.expenseId)
      })
    }
    this.setState({
      selectedRows: temp_list
    })
  }

  renderDate(cell, rows) {
    return moment(rows.expenseDate).format('DD-MM-YYYY')
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

  bulkDeleteExpenses() {
    const {
      selectedRows
    } = this.state
    if (selectedRows.length > 0) {
      this.setState({
        dialog: <ConfirmDeleteModal
          isOpen={true}
          okHandler={this.removeBulkExpenses}
          cancelHandler={this.removeDialog}
        />
      })
    } else {
      this.props.commonActions.tostifyAlert('info', 'Please select the rows of the table and try again.')
    }
  }

  removeBulkExpenses() {
    this.removeDialog()
    let { selectedRows } = this.state;
    const { expense_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.expenseActions.removeBulkExpenses(obj).then(() => {
      this.initializeData()
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (expense_list && expense_list.length > 0) {
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

  render() {
    const { loading,
      dialog,
      filterData ,
      selectedRows
    } = this.state
    const { expense_list, expense_categories_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="expense-screen">
        <div className="animated fadeIn">
          {dialog}
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="fab fa-stack-exchange" />
                    <span className="ml-2">Expenses</span>
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
                            disabled={expense_list.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/expense/expense/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Expense
                          </Button>
                          <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDeleteExpenses}
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
                            <Input
                              type="text"
                              placeholder="Payee"
                              value={filterData.payee}
                              onChange={e => this.handleChange(e.target.value, 'payee')}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            {/* <DateRangePicker>
                              <Input type="text" placeholder="Expense Date" />
                            </DateRangePicker> */}
                            <DatePicker
                              className="form-control"
                              id="date"
                              name="expenseDate"
                              placeholderText="Expense Date"
                              selected={filterData.expenseDate}
                              showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                              value={filterData.expenseDate}
                              onChange={(value) => {
                                this.handleChange(value, "expenseDate")
                              }}
                            />
                          </Col>

                          <Col lg={2} className="mb-1">
                            {/* <Input type="text" placeholder="Supplier Name" /> */}
                            <FormGroup className="mb-3">
                              <Select
                                className="select-default-width"
                                id="expenseCategoryId"
                                name="expenseCategoryId"
                                value={filterData.transactionCategoryId}
                                options={expense_categories_list ? selectOptionsFactory.renderOptions('transactionCategoryDescription', 'transactionCategoryId', expense_categories_list, 'Expense Category') : []}
                                onChange={(option) => { 
                                  if(option && option.value) {
                                    this.handleChange(option.value, 'transactionCategoryId')
                                  } else {
                                    this.handleChange('', 'transactionCategoryId')
                                  }
                                 }}
                                placeholder="Expense Category"
                              />
                            </FormGroup>
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
                          data={expense_list ? expense_list : []}
                          version="4"
                          hover
                          keyField="expenseId"
                          pagination
                          totalSize={expense_list ? expense_list.length : 0}
                          className="expense-table"
                          trClassName="cursor-pointer"
                          ref={node => this.table = node}
                          csvFileName="expense_list.csv"
                        >
                          <TableHeaderColumn
                            dataField="payee"
                            dataSort
                          >
                            Payee
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="expenseDescription"
                            dataSort
                          >
                            Description
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="receiptNumber"
                            dataSort
                          >
                            Receipt Number
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="expenseAmount"
                            dataSort
                          >
                            Expense Amount
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="expenseDate"
                            dataSort
                            dataFormat={this.renderDate}
                          >
                            Expense Date
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

export default connect(mapStateToProps, mapDispatchToProps)(Expense)
