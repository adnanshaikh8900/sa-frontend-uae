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
import _ from 'lodash'

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as ExpenseActions from '../../actions';
import * as ExpenseCreateActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.expense.currency_list,
    project_list: state.expense.project_list,
    employee_list: state.expense.employee_list,
    customer_list: state.expense.customer_list,
    payment_list: state.expense.payment_list,
    vat_list: state.expense.vat_list,
    expense_categories_list: state.expense.expense_categories_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    expenseActions: bindActionCreators(ExpenseActions, dispatch),
    expenseCreateActions: bindActionCreators(ExpenseCreateActions, dispatch)
  })
}

class CreateExpense extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      readMore: false,
      // selectedCurrency: null,
      // selectedProject: null,
      // selectedBankAccount: null,
      // selectedCustomer: null,
      // selectedPayment: null,

      initValue: {
        payee: '',
        expenseDate: '',
        currency: '',
        project: '',
        expenseCategory: '',
        expenseAmount: '',
        expenseDescription: '',
        receiptNumber: '',
        attachmentFile: '',
        receiptAttachmentDescription: '',
      },
      currentData: {}

    }


    this.initializeData = this.initializeData.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this)

    this.options = {
      paginationPosition: 'top'
    }
  }


  componentDidMount() {
    this.initializeData()
  }


  initializeData() {
    console.log(this.props.history)
    this.props.expenseActions.getVatList();
    this.props.expenseActions.getExpenseCategoriesList();
    this.props.expenseActions.getCurrencyList();
    this.props.expenseActions.getProjectList();
    this.props.expenseActions.getEmployeeList();

  }


  handleSubmit(data) {
    const {
      payee,
      expenseDate,
      currency,
      project,
      expenseCategory,
      expenseAmount,
      employee,
      expenseDescription,
      receiptNumber,
      attachmentFile,
      receiptAttachmentDescription,
    } = data

    console.log(data)
    let formData = new FormData();
    formData.append("payee", payee);
    formData.append("expenseDate", expenseDate !== null ? expenseDate : "");
    formData.append("expenseDescription", expenseDescription);
    formData.append("receiptNumber", receiptNumber);
    formData.append("receiptAttachmentDescription", receiptAttachmentDescription);
    formData.append('expenseAmount', expenseAmount);
    if (expenseCategory && expenseCategory.value) {
      formData.append("expenseCategory", expenseCategory.value);
    }
    if (employee && employee.value) {
      formData.append("employeeId", employee.value);
    }
    if (currency && currency.value) {
      formData.append("currencyCode", currency.value);
    }
    if (project && project.value) {
      formData.append("projectId", project.value);
    }
    if (this.uploadFile.files[0]) {
      formData.append("attachmentFile", this.uploadFile.files[0]);
    }
    this.props.expenseCreateActions.createExpense(formData).then(res => {
      if (res.status === 200) {
        console.log('22')
        if (this.state.readMore) {
          this.setState({
            readMore: false
          })
        } else {
          this.props.commonActions.tostifyAlert('success', 'Created Successfully.')
          this.props.history.push('/admin/expense/expense')
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  handleChange(e, name) {
    this.setState({
      currentData: _.set(
        { ...this.state.currentData },
        e.target.name && e.target.name !== '' ? e.target.name : name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      )
    })
  }

  render() {

    const { data } = this.state
    const { initValue } = this.state
    const { currency_list, project_list, expense_categories_list, employee_list } = this.props

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
                        initialValues={initValue}
                        onSubmit={(values, { resetForm }) => {

                          this.handleSubmit(values)
                          resetForm(initValue)

                          // this.setState({
                          //   selectedCurrency: null,
                          //   selectedProject: null,
                          //   selectedBankAccount: null,
                          //   selectedCustomer: null

                          // })
                        }}


                      >
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expenseCategoryId">Expense Category</Label>
                                  <Select
                                    className="select-default-width"
                                    id="expenseCategory"
                                    name="expenseCategory"
                                    options={expense_categories_list ? selectOptionsFactory.renderOptions('transactionCategoryDescription', 'transactionCategoryId', expense_categories_list) : []}
                                    value={props.values.expenseCategory}
                                    onChange={option => props.handleChange('expenseCategory')(option)}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="payee">Payee</Label>
                                  <Input
                                    type="text"
                                    name="payee"
                                    id="payee"
                                    rows="5"
                                    placeholder="Payee"
                                    onChange={(value) => { props.handleChange("payee")(value) }}
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
                                      selected={props.values.expenseDate}
                                      onChange={(value) => {
                                        props.handleChange("expenseDate")(value)
                                      }}
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
                                    id="currencyCode"
                                    name="currencyCode"
                                    options={selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list)}
                                    value={props.values.currency}
                                    onChange={option => props.handleChange('currency')(option)}

                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="employee">Employee</Label>
                                  <Select
                                    className="select-default-width"
                                    id="employee"
                                    name="employee"
                                    options={employee_list ? selectOptionsFactory.renderOptions('firstName', 'userId', employee_list) : []}
                                    value={props.values.employee}
                                    onChange={option => props.handleChange('employee')(option)}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="project">Project</Label>
                                  <Select
                                    className="select-default-width"
                                    id="project"
                                    name="project"
                                    options={selectOptionsFactory.renderOptions('projectName', 'projectId', project_list)}
                                    value={props.values.project}
                                    onChange={option => props.handleChange('project')(option)}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expenseAmount">Amount</Label>
                                  <Input
                                    type="text"
                                    name="expenseAmount"
                                    id="expenseAmount"
                                    rows="5"
                                    onChange={option => props.handleChange('expenseAmount')(option)}
                                    value={props.values.expenseAmount}

                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={8}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expenseDescription">Description</Label>
                                  <Input
                                    type="textarea"
                                    name="expenseDescription"
                                    id="expenseDescription"
                                    rows="5"
                                    placeholder="1024 characters..."
                                    onChange={option => props.handleChange('expenseDescription')(option)}
                                    value={props.values.expenseDescription}

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
                                        onChange={option => props.handleChange('receiptNumber')(option)}
                                        value={props.values.receiptNumber}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="receiptAttachmentDescription">Attachment Description</Label>
                                      <Input
                                        type="textarea"
                                        name="receiptAttachmentDescription"
                                        id="receiptAttachmentDescription"
                                        rows="5"
                                        placeholder="1024 characters..."
                                        onChange={option => props.handleChange('receiptAttachmentDescription')(option)}
                                        value={props.values.receiptAttachmentDescription}

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
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Create
                        </Button>
                                  <Button type="submit" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ readMore: true })
                                      props.handleSubmit()
                                    }}
                                  >
                                    <i className="fa fa-repeat"></i> Create and More
                        </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/expense/expense') }}>
                                    <i className="fa fa-ban"></i> Cancel
                        </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
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
