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
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'

import { Formik } from 'formik';
import * as Yup from "yup";

import {
  CommonActions
} from 'services/global'
import * as ExpenseActions from '../../actions';

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.expense.currency_list,
    project_list: state.expense.project_list,
    bank_account_list: state.expense.bank_account_list,
    customer_list: state.expense.customer_list,
    payment_list: state.expense.payment_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    expenseActions: bindActionCreators(ExpenseActions, dispatch)
  })
}

class CreateExpense extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [
        {},
        {}
      ],

      selectedCurrency: null,
      selectedProject: null,
      selectedBankAccount: null,
      selectedCustomer: null,
      selectedPayment:null,

      initExpenseValue: {
        expenseId: null,
        expenseAmount: null,
        expenseDate: null,
        expenseContactId: null,
        bankAccountId: null,
        expenseDescription: null,
        receiptNumber: null,
        transactionType: null,
        transactionCategory: null,
        currencyCode: null,
        project: null,
        paymentId: null,
        receiptAttachmentPath: null,
        receiptAttachmentDescription: null,
        createdBy: null,
        createdDate: null,
        lastUpdatedBy: null,
        lastUpdateDate: null,
        deleteFlag: false,
        attachmentFile: null,
        receiptAttachmentName: null,
        receiptAttachmentContentType: null
      }

    }

    
    this.initializeData = this.initializeData.bind(this)
    
    this.renderActions = this.renderActions.bind(this)
    this.renderProductName = this.renderProductName.bind(this)
    this.renderAmount = this.renderAmount.bind(this)
    this.renderVat = this.renderVat.bind(this)
    this.renderSubTotal = this.renderSubTotal.bind(this);
    this.addRow = this.addRow.bind(this);
    
    this.options = {
      paginationPosition: 'top'
    }
  }


  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.expenseActions.getCurrencyList();
    this.props.expenseActions.getProjectList();
    this.props.expenseActions.getBankAccountList();
    this.props.expenseActions.getCustomerList();
    this.props.expenseActions.getPaymentList();

  }

  renderActions(cell, row) {
    return (
      <Button
        size="sm"
        className="btn-twitter btn-brand icon"
      >
        <i className="fas fa-trash"></i>
      </Button>
    )
  }

  renderProductName(cell, row) {
    return (
      <div className="d-flex align-items-center">
        <Input type="select" className="mr-1">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </Input>
        <Button
          size="sm"
          color="primary"
          className="btn-brand icon"
        >
          <i className="fas fa-plus"></i>
        </Button>
      </div>
    )
  }

  renderAmount(cell, row) {
    return (
      <Input
        type="text"
        defaultValue="0"
      />
    )
  }

  renderVat(cell, row) {
    return (
      <Input type="select">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </Input>
    )
  }

  renderSubTotal(cell, row) {
    return (
      <label className="mb-0">0.00</label>
    )
  }

  addRow() {
    const data = [...this.state.data]
    this.setState({data: data.concat({})})
  }

  render() {

    const { data ,
      initExpenseValue: {
        expenseDate
    }
    } = this.state
    const { currency_list, project_list,bank_account_list,customer_list,payment_list} = this.props


    return (
      <div className="create-expense-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fab fa-stack-exchange" />
                        <span className="ml-2">Create Expense</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={this.state.ExpenseValue}
                        onSubmit={(values, { resetForm }) => {

                          this.expenseHandleSubmit(values)
                          resetForm(this.state.initProductValue)

                          this.setState({
                            selectedCurrency: null,
                            selectedProject: null,
                            selectedBankAccount: null,
                            selectedCustomer: null

                          })
                        }}
                     
                      >
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                              <FormGroup className="mb-3">
                                  <Label htmlFor="expenseContactId">Customer</Label>
                                  <Select
                                    className="select-default-width"
                                    options={customer_list}
                                    id="expenseContactId"
                                    name="expenseContactId"
                                    value={this.state.selectedCustomer}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedCustomer: option.value
                                      })
                                      props.handleChange("expenseContactId")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expense_date">Expense Date</Label>
                                  <div>
                                    <DatePicker
                                      className="form-control"
                                      id="date"
                                      name="expenseDate"
                                      placeholderText=""
                                      selected={expenseDate}
                                      onChange={(val)=> {
                                        this.setState({
                                          initExpenseValue: {
                                            expenseDate: val
                                          }
                                        })
                                        props.handleChange("expenseDate")(val)}
                                      }
                                    />
                                  </div>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="currency">Currency</Label>
                                  <Select
                                    className="select-default-width"
                                    options={currency_list}
                                    id="currencyCode"
                                    name="currencyCode"
                                    value={this.state.selectedCurrency}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedCurrency: option.value
                                      })
                                      props.handleChange("currencyCode")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="project">Project</Label>
                                  <Select
                                    className="select-default-width"
                                    options={project_list}
                                    id="project"
                                    name="project"
                                    value={this.state.selectedProject}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedProject: option.value
                                      })
                                      props.handleChange("project")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="bank">Bank</Label>
                                  <Select
                                    className="select-default-width"
                                    options={bank_account_list}
                                    id="bankAccountId"
                                    name="bankAccountId"
                                    value={this.state.selectedBankAccount}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedBankAccount: option.value
                                      })
                                      props.handleChange("bankAccountId")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="payment_date">Payment Date</Label>
                                  <div>
                                    <DatePicker
                                      className="form-control"
                                      id="payment_date"
                                      name="payment_date"
                                      placeholderText=""
                                    />
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                              <FormGroup className="mb-3">
                                  <Label htmlFor="paymentId">Payment</Label>
                                  <Select
                                    className="select-default-width"
                                    options={payment_list}
                                    id="paymentId"
                                    name="paymentId"
                                    value={this.state.selectedPayment}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedPayment: option.value
                                      })
                                      props.handleChange("paymentId")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expenseDescription">Description</Label>
                                  <Input
                                    type="textarea"
                                    name="expenseDescription"
                                    id="expenseDescription"
                                    rows="5"
                                    placeholder="1024 characters..."
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col lg={8}>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="receiptNumber">Reciept Number</Label>
                                      <Input
                                        type="text"
                                        id="receiptNumber"
                                        name="receiptNumber"
                                        placeholder="Enter Reciept Number"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="attachment_description">Attachment Description</Label>
                                      <Input
                                        type="textarea"
                                        name="attachment_description"
                                        id="attachment_description"
                                        rows="5"
                                        placeholder="1024 characters..."
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label>Reciept Attachment</Label><br />
                                      <Button color="primary" onClick={() => { document.getElementById('fileInput').click() }} className="btn-square mr-3">
                                        <i className="fa fa-upload"></i> Upload
                                  </Button>
                                      <input id="fileInput" ref={ref => {
                                        this.uploadFile = ref;
                                      }}
                                        type="file" type="file" style={{ display: 'none' }} />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col lg={12} className="mb-3">
                                <Button color="primary" className="btn-square mr-3" onClick={this.addRow}>
                                  <i className="fa fa-plus"></i> Add More
                            </Button>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12}>
                                <BootstrapTable
                                  options={this.options}
                                  data={data}
                                  version="4"
                                  hover
                                  className="expense-create-table"
                                >
                                  <TableHeaderColumn
                                    width="55"
                                    dataAlign="center"
                                    dataFormat={this.renderActions}
                                  >
                                  </TableHeaderColumn>
                                  <TableHeaderColumn
                                    isKey
                                    dataField="product_name"
                                    dataFormat={this.renderProductName}
                                  >
                                    Account Code
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="quantity"
                                    dataFormat={this.renderAmount}
                                  >
                                    Amount
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="vat"
                                    dataFormat={this.renderVat}
                                  >
                                    Vat (%)
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="sub_total"
                                    dataFormat={this.renderSubTotal}
                                    className="text-right"
                                    columnClassName="text-right"
                                  >
                                    Sub Total (All)
                              </TableHeaderColumn>
                                </BootstrapTable>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={4} className="ml-auto">
                      <div className="">
                        <div className="total-item p-2">
                          <Row>
                            <Col lg={6}>
                              <h5 className="mb-0 text-right">Total Net</h5>
                            </Col>
                            <Col lg={6} className="text-right">
                              <label className="mb-0">0.00</label>
                            </Col>
                          </Row>
                        </div>
                        <div className="total-item p-2">
                          <Row>
                            <Col lg={6}>
                              <h5 className="mb-0 text-right">Total Vat</h5>
                            </Col>
                            <Col lg={6} className="text-right">
                              <label className="mb-0">0.00</label>
                            </Col>
                          </Row>
                        </div>
                        <div className="total-item p-2">
                          <Row>
                            <Col lg={6}>
                              <h5 className="mb-0 text-right">Total</h5>
                            </Col>
                            <Col lg={6} className="text-right">
                              <label className="mb-0">0.00</label>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="mt-5">
                      <FormGroup className="text-right">
                        <Button type="submit" color="primary" className="btn-square mr-3">
                          <i className="fa fa-dot-circle-o"></i> Create
                        </Button>
                        <Button type="submit" color="primary" className="btn-square mr-3">
                          <i className="fa fa-repeat"></i> Create and More
                        </Button>
                        <Button color="secondary" className="btn-square"
                          onClick={() => { this.props.history.push('/admin/expense/expense') }}>
                          <i className="fa fa-ban"></i> Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateExpense)
