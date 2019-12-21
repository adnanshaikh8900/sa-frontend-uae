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
import DateRangePicker from 'react-bootstrap-daterangepicker'

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
    supplier_list: state.expense.supplier_list,
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
      selected_id_list: [],


      filter_expense_date: '',
      filter_receipt_number: '',
      filter_supplier_name: ''
    }

    this.initializeData = this.initializeData.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
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
      selected_id_list: []
    })
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.expenseActions.getExpenseList();
    this.props.expenseActions.getSupplierList();

  }

  

  goToDetail(row) {
    this.props.history.push('/admin/expense/expense/detail', { expenseId: row['expenseId'] })
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selected_id_list)
      temp_list.push(row.expenseId);
    } else {
      this.state.selected_id_list.map(item => {
        if (item !== row.expenseId) {
          temp_list.push(item)
        }
      });
    }
    this.setState({
      selected_id_list: temp_list
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
      selected_id_list: temp_list
    })
  }

  renderDate(cell, rows) {
    return moment(cell[0].expenseDate).format('DD-MM-YYYY')
  }

  inputHandler(key, value) {
    this.setState({
      [key]: value
    })
  }

  

    bulkDeleteExpenses() {
      const {
        selected_id_list
      } = this.state
      if (selected_id_list.length > 0) {
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
      let { selected_id_list } = this.state;
      const { expense_list } = this.props
      let obj = {
        ids: selected_id_list
      }
      this.props.expenseActions.removeBulkExpenses(obj).then(() => {
        this.props.expenseActions.getExpenseList()
        this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
        if(expense_list && expense_list.length > 0) {
                  this.setState({
          selected_id_list: []
        })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
      })
    }

    removeDialog() {
      this.setState({
        dialog: null
      })
    }



    render() {

      const { loading,
        filter_supplier_name,
        dialog,
        filter_receipt_number
      } = this.state
      const { expense_list, supplier_list } = this.props
      const containerStyle = {
        zIndex: 1999
      }



      return (
        <div className="expense-screen">
          <div className="animated fadeIn">
            {dialog}
            <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
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
                              onClick={()=>this.table.handleExportCSV()}
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
                              <DateRangePicker>
                                <Input type="text" placeholder="Expense Date" />
                              </DateRangePicker>
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Input
                                type="text"
                                placeholder="Reciept Number"
                                value={filter_receipt_number}
                                onChange={e => this.inputHandler('filter_receipt_number', e.target.value)}
                              />
                            </Col>
                            <Col lg={2} className="mb-1">
                              {/* <Input type="text" placeholder="Supplier Name" /> */}
                              <FormGroup className="mb-3">
                                <Select
                                  className="select-default-width"
                                  id="supplier"
                                  name="supplier"
                                  options={supplier_list}
                                  value={filter_supplier_name}
                                  onChange={option => {
                                    this.setState({
                                      filter_supplier_name: option
                                    })
                                  }}
                                  placeholder="Supplier Name"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <div>
                          <BootstrapTable
                            selectRow={this.selectRowProp}
                            search={false}
                            options={this.options}
                            data={expense_list}
                            version="4"
                            hover
                            keyField="expenseId"
                            pagination
                            totalSize={expense_list ? expense_list.length : 0}
                            className="expense-table"
                            trClassName="cursor-pointer"
                            ref={node => this.table = node}
                            csvFileName="ExpenseList.csv"
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
                              dataField="vat"
                              dataSort
                            >
                              VAT
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
                              Date
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
