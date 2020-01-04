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

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { Loader, ConfirmDeleteModal } from 'components'

import { selectOptionsFactory } from 'utils'

import * as ExpenseDetailsAction from './actions';
import * as ExpenseActions from '../../actions';
import {
  CommonActions
} from 'services/global'

import moment from 'moment'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    expense_detail: state.expense.expense_detail,
    currency_list: state.expense.currency_list,
    project_list: state.expense.project_list,
    employee_list: state.expense.employee_list,
    vat_list: state.expense.vat_list,
    expense_categories_list: state.expense.expense_categories_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    expenseDetailActions: bindActionCreators(ExpenseDetailsAction, dispatch),
    expenseActions: bindActionCreators(ExpenseActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}

class DetailExpense extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      initValue: null,
    }


    this.options = {
      paginationPosition: 'top'
    }


    this.initializeData = this.initializeData.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    this.deleteExpense = this.deleteExpense.bind(this)
    this.removeExpense = this.removeExpense.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const { expenseId } = this.props.location.state;
    if (this.props.location.state && expenseId) {
      this.props.expenseActions.getVatList();
      this.props.expenseDetailActions.getExpenseDetail(expenseId).then(res => {
        if (res.status === 200) {
          this.props.expenseActions.getCurrencyList();
          this.props.expenseActions.getProjectList();
          this.props.expenseActions.getEmployeeList();
          this.props.expenseActions.getExpenseCategoriesList();
          this.setState({
            loading: false,
            initValue: {
              payee: res.data.payee,
              expenseDate: res.data.expenseDate ? moment(res.data.expenseDate).utc().format('YYYY-MM-DD') : '',
              currency: res.data.currencyCode ? res.data.currencyCode : '',
              expenseCategory: res.data.expenseCategory ? res.data.expenseCategory : '',
              projectId: res.data.projectId ? res.data.projectId : '',
              expenseAmount: res.data.expenseAmount,
              expenseDescription: res.data.expenseDescription,
              receiptNumber: res.data.receiptNumber,
              attachmentFile: res.data.attachmentFile,
              receiptAttachmentDescription: res.data.receiptAttachmentDescription,
              employee: res.data.employeeId ? res.data.employeeId : '',
            },
          })
        }
      }).catch(err => {
        this.setState({ loading: false })
      })
    }
  }

  handleSubmit(data, resetValue) {
    const id = this.props.location.state.expenseId;
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

    let formData = new FormData();
    formData.append("expenseId", id);
    formData.append("payee", payee);
    formData.append("expenseDate", expenseDate !== null ? moment(expenseDate).utc().toDate() : "");
    formData.append("expenseDescription", expenseDescription);
    formData.append("receiptNumber", receiptNumber);
    formData.append("receiptAttachmentDescription", receiptAttachmentDescription);
    formData.append('expenseAmount', expenseAmount);
    if (expenseCategory && expenseCategory.value) {
      formData.append("expenseCategoryId", expenseCategory.value);
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
    this.props.expenseDetailActions.updateExpense(formData).then(res => {
      if(res.status ===  200) {
        // resetValue({});
        this.props.commonActions.tostifyAlert('success', 'Expense Updated Successfully.')
        this.props.history.push('/admin/expense/expense')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }


  deleteExpense() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeExpense}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeExpense() {
    const id = this.props.location.state.expenseId;
    this.props.expenseDetailActions.deleteExpense(id).then(res => {
      if (res.status === 200) {
        // this.success('Chart Account Deleted Successfully');
        this.props.commonActions.tostifyAlert('success', 'Expense Deleted Successfully')
        this.props.history.push('/admin/expense/expense')
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

    const { expense_detail, currency_list, project_list, payment_list, employee_list, expense_categories_list } = this.props
    const { data, initValue, loading, dialog } = this.state

    return (
      <div className="detail-expense-screen">
        <div className="animated fadeIn">
          {dialog}
          {loading ? (
            <Loader />
          )
            :
            (
              <Row>
                <Col lg={12} className="mx-auto">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col lg={12}>
                          <div className="h4 mb-0 d-flex align-items-center">
                            <i className="fab fa-stack-exchange" />
                            <span className="ml-2">Update Expense</span>
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

                              // this.setState({
                              //   selectedCurrency: null,
                              //   selectedProject: null,
                              //   selectedBankAccount: null,
                              //   selectedCustomer: null

                              // })
                            }}
                            validationSchema={
                              Yup.object().shape({
                                expenseCategory: Yup.string()
                                  .required('Expense Category is required'),
                                expenseDate: Yup.date()
                                  .required('Expense Date is Required'),
                                expenseAmount: Yup.string()
                                  .required('Amount is Required')
                                  .matches(/^[0-9]*$/, "Enter a Valid Amount")
                              })
                            }
                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit}>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="expenseCategoryId">Expense Category</Label>
                                      <Select
                                        id="expenseCategory"
                                        name="expenseCategory"
                                        options={expense_categories_list ? selectOptionsFactory.renderOptions('transactionCategoryDescription', 'transactionCategoryId', expense_categories_list) : []}
                                        value={props.values.expenseCategory}
                                        className={props.errors.expenseCategory && props.touched.expenseCategory ? "is-invalid" : ""}
                                        onChange={option => props.handleChange('expenseCategory')(option)}
                                      />
                                      {props.errors.expenseCategory && props.touched.expenseCategory && (
                                        <div className="invalid-feedback">{props.errors.expenseCategory}</div>
                                      )}
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
                                        defaultValue={props.values.payee}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="expense_date">Expense Date</Label>
                                      <DatePicker

                                        id="date"
                                        name="expenseDate"
                                        className={`form-control ${props.errors.expenseDate && props.touched.expenseDate ? "is-invalid" : ""}`}
                                        placeholderText="Expense Date"
                                        value={moment(props.values.expenseDate).format('DD-MM-YYYY')}
                                        dateFormat="dd/MM/yyyy"
                                        // maxDate={new Date()}
                                        onChange={(value) => {
                                          props.handleChange("expenseDate")(value)
                                        }}
                                      />
                                      {props.errors.expenseDate && props.touched.expenseDate && (
                                        <div className="invalid-feedback">{props.errors.expenseDate}</div>
                                      )}
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
                                        options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list) : []}
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
                                        options={employee_list ? selectOptionsFactory.renderOptions('label', 'value', employee_list) : []}
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
                                        options={project_list ? selectOptionsFactory.renderOptions('label', 'value', project_list) : []}
                                        value={props.values.projectId}
                                        onChange={option => props.handleChange('projectId')(option)}
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
                                        className={props.errors.expenseAmount && props.touched.expenseAmount ? "is-invalid" : ""}
                                        onChange={option => props.handleChange('expenseAmount')(option)}
                                        value={props.values.expenseAmount}

                                      />
                                      {props.errors.expenseAmount && props.touched.expenseAmount && (
                                        <div className="invalid-feedback">{props.errors.expenseAmount}</div>
                                      )}
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
                                            required
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
                                  <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                    <FormGroup>
                                      <Button type="button" name="button" color="danger" className="btn-square"
                                        onClick={this.deleteExpense}
                                      >
                                        <i className="fa fa-trash"></i> Delete
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
                                      <Button type="button" name="button" color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push("/admin/expense/expense") }}>
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
            )
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailExpense)
