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
import * as Yup from 'yup'
import { Loader } from 'components'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'
import * as PaymentActions from '../../actions'
import * as CreatePaymentActions from './actions'

import {
  CommonActions
} from 'services/global'

const mapStateToProps = (state) => {
  return ({
    bank_list: state.payment.bank_list,
    currency_list: state.payment.currency_list,
    supplier_list: state.payment.supplier_list,
    project_list: state.payment.project_list,
    invoice_list: state.payment.invoice_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    createPaymentActions: bindActionCreators(CreatePaymentActions, dispatch),
    paymentActions: bindActionCreators(PaymentActions, dispatch)
  })
}

class CreatePayment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initialVals: {
        bank: null,
        supplier: null,
        invoiceId: null,
        amount: null,
        currency: null,
        project: null,
        payment_due_date: null,
        description: null,
      },
      data: [
        {},
        {}
      ],
      currentData: {}
    }

    this.options = {
    }
    
    this.initializeData = this.initializeData.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
    this.props.paymentActions.getCurrencyList()
    this.props.paymentActions.getBankList()
    this.props.paymentActions.getSupplierList()
    this.props.paymentActions.getProjectList()
    this.props.paymentActions.getSupplierInvoiceList()

  }

  renderActions(cell, row) {
    return (
      <Button size="sm" className="btn-twitter btn-brand icon"><i className="fas fa-trash"></i></Button>
    )
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

  handleSubmit(data) {
    const {
      bank,
      supplier,
      invoiceId,
      amount,
      payment_date,
      currency,
      project,
      description,
    } = data

    const postData = {
      paymentDate: payment_date !== null ? payment_date : "",
      description: description,
      invoiceId: invoiceId && invoiceId.value ? invoiceId.value : '',
      invoiceAmount: amount,
      bankAccountId: bank && bank.value ? bank.value: '' ,
      supplierId: supplier && supplier.value ? supplier.value : '',
      currencyCode: currency && currency.value ? currency.value : '',
      projectId: project && project.value ? project.value : '',
    }
    this.props.createPaymentActions.createPayment(postData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Created Successfully.')
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
      bank_list,
      supplier_list,
      invoice_list,
      project_list
    } = this.props
    const {
      initialVals
    } = this.state
    const { data ,loading} = this.state

    return (
      <div className="create-payment-screen">
        <div className="animated fadeIn">
          {loading ? 
          <Loader />
          :
          (
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
                  // validationSchema={Yup.object().shape({
                  //   currency: Yup.object().shape({
                  //     label: Yup.string().required(),
                  //     value: Yup.string().required(),
                  //   }),
                  //   invoiceReferenceNo: Yup.string()
                  //   .required('Reference is Required'),
                  //   amount: Yup.string()
                  //   .required('Amount is Required'),
                  //   payment_date: Yup.string()
                  //     .required('Payment Date is Required'),
                  //   payment_due_date: Yup.string()
                  //     .required('Payment Due Date is Required'),
                  //   receiptNo: Yup.string()
                  //     .required('Receipt Number is Required'),
                  //   supplier: Yup.object().shape({
                  //     label: Yup.string().required(),
                  //     value: Yup.string().required(),
                  //   }),
                  //   project: Yup.object().shape({
                  //     label: Yup.string().required(),
                  //     value: Yup.string().required()
                  //   })
                  // })
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
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Supplier
                                  </Button>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="invoiceId">Invoice</Label>
                                    <Select
                                      className="select-default-width"
                                      id="invoiceId"
                                      name="invoiceId"
                                      options={selectOptionsFactory.renderOptions('invoiceReferenceNumber', 'invoiceId', invoice_list)}
                                      value={props.values.invoiceId}
                                      onChange={option => {
                                        let data;
                                        data = invoice_list.filter(item => item.invoiceId === option.value);
                                        props.handleChange('amount')(data[0]['invoiceAmount'])
                                        props.handleChange('invoiceId')(option)
                                      }}
                                      className={
                                        props.errors.invoiceId && props.touched.invoiceId
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="amount">Invoice Amount</Label>
                                    <Input
                                      // className="form-control"
                                      type="text"
                                      id="amount"
                                      name="amount"
                                      placeholder="Enter Amount"
                                      required
                                      defaultValue={props.values.amount}
                                      value={props.values.amount}
                                      onChange={option => props.handleChange('amount')(option)}
                                    />

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
                                    <Label htmlFor="payment_date">Payment Date</Label>
                                    <div>
                                      <DatePicker
                                        className="form-control"
                                        id="payment_date"
                                        name="payment_date"
                                        placeholderText=""
                                        onChange={option => props.handleChange('payment_date')(option)}
                                        value={props.values.payment_date}
                                        selected={props.values.payment_date}
                                      />
                                    </div>

                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="bank">Bank</Label>
                                    <Select
                                      className="select-default-width"
                                      id="bank"
                                      name="bank"
                                      options={selectOptionsFactory.renderOptions('bankAccountName', 'bankAccountId', bank_list)}
                                      value={props.values.bank}
                                      onChange={option => props.handleChange('bank')(option)}
                                      className={
                                        props.errors.bank && props.touched.bank
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                {/* <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="referenceNo">Reference Number</Label>
                                    <Input
                                      type="text"
                                      id="referenceNo"
                                      name="referenceNo"
                                      placeholder="Enter Reference Number"
                                      required
                                      onChange={option => props.handleChange('referenceNo')(option)}
                                      value={props.values.referenceNo}
                                      className={
                                        props.errors.referenceNo && props.touched.referenceNo
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                  </FormGroup>
                                </Col> */}
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
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePayment)
