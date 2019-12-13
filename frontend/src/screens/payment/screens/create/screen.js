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
import _ from 'lodash'
import {
  selectOptionsFactory
} from 'utils'
import { Formik } from 'formik'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'
import * as createPaymentActions from './actions'
import {
  CommonActions
} from 'services/global'

const mapStateToProps = (state) => {
  console.log(state.payment);
  return ({
    currency_list: state.payment.currency_list,
    supplier_list: state.payment.supplier_list,
    invoice_list: state.payment.invoice_list,
    project_list: state.payment.project_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    createPaymentActions: bindActionCreators(createPaymentActions, dispatch)
  })
}

class CreatePayment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initialVals: {
        supplier: null,
        invoice: null,
        payment_date: null,
        currency: null,
        project: null,
        payment_due_date: null,
        description: null,
        receiptNo: null,
        attachmentDescription: null
      },
      data: [
        {},
        {}
      ],
      currentData: {}
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.options = {
    }

    this.renderActions = this.renderActions.bind(this)
    this.renderProductName = this.renderProductName.bind(this)
    this.renderQuantity = this.renderQuantity.bind(this)
    this.renderUnitPrice = this.renderUnitPrice.bind(this)
    this.renderVat = this.renderVat.bind(this)
    this.renderSubTotal = this.renderSubTotal.bind(this)

  }

  componentDidMount() {
    this.initializeData()
  }


  initializeData() {
    this.props.createPaymentActions.getCurrencyList()
    this.props.createPaymentActions.getSupplierList()
    this.props.createPaymentActions.getInvoiceList()
    this.props.createPaymentActions.getProjectList()
  }

  renderActions(cell, row) {
    return (
      <Button size="sm" className="btn-twitter btn-brand icon"><i className="fas fa-trash"></i></Button>
    )
  }


  handleChange(e, name) {
    console.log(e)
    console.log(name)
    this.setState({
      currentData: _.set(
        { ...this.state.currentData },
        e.target.name && e.target.name !== '' ? e.target.name : name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      )
    })
  }

  handleSubmit(data) {
    const {
      supplier,
      invoice,
      payment_date,
      currency,
      project,
      payment_due_date,
      description,
      receiptNo,
      attachmentDescription
    } = data
    let formData = new FormData();   
    formData.append("paymentDate", payment_date !== null ? payment_date : "");
    formData.append("paymentDueDate", payment_due_date !== null ? payment_due_date : "");
    formData.append("description", description);
    formData.append("receiptNo", receiptNo);
    formData.append("attachmentDescription", attachmentDescription);
    if (supplier.value) {
      formData.append("supplierId", supplier.value);
    }
    if (invoice.value) {
      formData.append("invoiceId", invoice.value);
    }
    if (currency.value) {
      formData.append("currencyCode", currency.value);
    }
    if (project.value) {
      formData.append("projectId", project.value);
    } 
    if (this.uploadFile.files[0]) {
      formData.append("attachmentFile", this.uploadFile.files[0]);
    }
    this.props.createPaymentActions.createPayment(formData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Creted Successfully.')
      if (this.state.createMore) {
        this.setState({
          createMore: false
        })
      } else {
        this.props.history.push('/admin/expense/payment')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  renderProductName(cell, row) {
    return (
      <div className="d-flex align-items-center">
        <Select
          className="select-default-width flex-grow-1 mr-1"
          options={[]}
        />
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

  renderQuantity(cell, row) {
    return (
      <Input
        type="text"
        value="0"
      />
    )
  }

  renderUnitPrice(cell, row) {
    return (
      <Input
        type="text"
        value="0.00"
      />
    )
  }

  renderVat(cell, row) {
    return (
      <Select
        className="select-default-width"
        options={[]}
        id="currency"
        name="currency"
      />
    )
  }

  renderSubTotal(cell, row) {

  }

  render() {
    const {
      currency_list,
      supplier_list,
      invoice_list,
      project_list
    } = this.props
    const {
      initialVals
    } = this.state
    const { data } = this.state

    return (
      <div className="create-payment-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fas fa-money-check" />
                        <span className="ml-2">Create Payment</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Formik
                    initialValues={initialVals}
                    onSubmit={
                      (values, { resetForm }) => {
                        this.handleSubmit(values)
                        resetForm(initialVals)
                      }}
                  //   validationSchema={Yup.object().shape({
                  //     account_name: Yup.string()
                  //       .required('Account Name is Required'),
                  //     currency: Yup.object().shape({
                  //       label: Yup.string().required(),
                  //       value: Yup.string().required(),
                  //     }),
                  //     account_type: Yup.object().shape({
                  //       label: Yup.string().required(),
                  //       value: Yup.string().required(),
                  //     }),
                  //     bank_name: Yup.string()
                  //       .required('Bank Name is Required'),
                  //     account_number: Yup.string()
                  //       .required('Account Number is Required'),
                  //     iban_number: Yup.string()
                  //       .required('IBAN Number is Required'),
                  //     swift_code: Yup.string()
                  //       .required('Swift Code is Required'),
                  //     country: Yup.object().shape({
                  //       label: Yup.string().required(),
                  //       value: Yup.string().required(),
                  //     }),
                  //     account_is_for: Yup.object().shape({
                  //       label: Yup.string().required(),
                  //       value: Yup.string().required()
                  //     })
                  //   })
                  // }
                  >
                    {
                      props => (
                        <Form onSubmit={props.handleSubmit}>
                          <Row>
                            <Col lg={12}>

                              <Row>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="supplier">Supplier Name</Label>
                                    <Select
                                      className="select-default-width"
                                      id="supplier"
                                      name="supplier"
                                      options={selectOptionsFactory.renderOptions('firstName', 'contactId', supplier_list)}
                                      value={props.values.supplier}
                                      onChange={option => props.handleChange('supplier')(option)}
                                      className={
                                        props.errors.supplier && props.touched.supplier
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="invoice">Invoice</Label>
                                    <Select
                                      className="select-default-width"
                                      id="invoice"
                                      name="invoice"
                                      options={selectOptionsFactory.renderOptions('invoiceReferenceNumber', 'invoiceId', invoice_list)}
                                      value={props.values.invoice}
                                      onChange={option => props.handleChange('invoice')(option)}
                                      className={
                                        props.errors.invoice && props.touched.invoice
                                          ? 'is-invalid'
                                          : ''
                                      }
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
                                        onChange={option => props.handleChange('payment_date')(option)}
                                        selected={props.values.payment_date}
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
                                      id="currency"
                                      name="currency"
                                      options={selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list)}
                                      value={props.values.currency}
                                      onChange={option => props.handleChange('currency')(option)}
                                      className={
                                        props.errors.currency && props.touched.currency
                                          ? 'is-invalid'
                                          : ''
                                      }
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
                                      className={
                                        props.errors.project && props.touched.project
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="payment_due_date">Payment Due</Label>
                                    <div>
                                      <DatePicker
                                        className="form-control"
                                        id="payment_due_date"
                                        name="payment_due_date"
                                        placeholderText=""
                                        onChange={option => props.handleChange('payment_due_date')(option)}
                                        selected={props.values.payment_due_date}
                                      />
                                    </div>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={8}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                      type="textarea"
                                      name="description"
                                      id="description"
                                      rows="6"
                                      placeholder="Description..."
                                      onChange={option => props.handleChange('description')(option)}
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
                                        <Label htmlFor="recieptNo">Reciept Number</Label>
                                        <Input
                                          type="text"
                                          id="recieptNo"
                                          name="recieptNo"
                                          placeholder="Enter Reciept Number"
                                          required
                                          onChange={option => props.handleChange('recieptNo')(option)}
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="attachmentDescription">Attachment Description</Label>
                                        <Input
                                          type="textarea"
                                          name="attachmentDescription"
                                          id="attachmentDescription"
                                          rows="5"
                                          placeholder="Description..."
                                          onChange={option => props.handleChange('attachmentDescription')(option)}
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
                                  onClick={() => { this.props.history.push('/admin/expense/payment') }}>
                                  <i className="fa fa-ban"></i> Cancel
                        </Button>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>
                      )
                    }
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePayment)
