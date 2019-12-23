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
import {Loader, ConfirmDeleteModal} from 'components'
import moment from 'moment'


import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'
import * as PaymentActions from '../../actions'
import * as DetailPaymentActions from './actions'
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
    detailPaymentActions: bindActionCreators(DetailPaymentActions, dispatch),
    paymentActions: bindActionCreators(PaymentActions, dispatch)
  })
}

class DetailPayment extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dialog: null,
      data: [
        {},
        {}
      ],
      initialVals: {}
    }

    this.options = {
    }

    // this.initializeData = this.initializeData.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    this.renderActions = this.renderActions.bind(this)
    this.renderProductName = this.renderProductName.bind(this)
    this.renderQuantity = this.renderQuantity.bind(this)
    this.renderUnitPrice = this.renderUnitPrice.bind(this)
    this.renderVat = this.renderVat.bind(this)
    this.renderSubTotal = this.renderSubTotal.bind(this)
    this.deletePayment = this.deletePayment.bind(this)
    this.removePayment = this.removePayment.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  componentDidMount() {
    const id = this.props.location.state.id
    if(this.props.location.state && id) {
      this.props.paymentActions.getCurrencyList()
      this.props.paymentActions.getBankList()
      this.props.paymentActions.getSupplierList()
      this.props.paymentActions.getProjectList()
      this.props.paymentActions.getSupplierInvoiceList()
        this.props.detailPaymentActions.getPaymentById(id).then(res => {
          if(res.status === 200) {
            this.setState({
              initialVals: {
                paymentId: res.data.paymentId,
                supplier: res.data.supplierId,
                invoice: res.data.invoiceId,
                invoiceAmount : res.data.invoiceAmount,
                currency: res.data.currencyCode,
                project: res.data.projectId,
                payment_date: res.data.paymentDate,
                description: res.data.description,
                bank: res.data.bankAccountId
              },
              loading: false

            })
          }})}}



  renderActions (cell, row) {
    return (
      <Button size="sm" className="btn-twitter btn-brand icon"><i className="fas fa-trash"></i></Button>
    )
  }

  handleSubmit(data) {
    const {
      bank,
      supplier,
      invoiceId,
      invoiceAmount,
      payment_date,
      currency,
      project,
      description,
    } = data

    const postData = {
      paymentId: this.state.initialVals.paymentId,
      paymentDate: payment_date !== null ? payment_date : "",
      description: description,
      invoiceId: invoiceId && invoiceId.value ? invoiceId.value : '',
      invoiceAmount: invoiceAmount,
      bankAccountId: bank && bank.value ? bank.value: '' ,
      supplierId: supplier && supplier.value ? supplier.value : '',
      currencyCode: currency && currency.value ? currency.value : '',
      projectId: project && project.value ? project.value : '',
    }
    this.props.detailPaymentActions.updatePayment(postData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Update Successfully.')
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

  renderProductName (cell, row) {
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

  renderQuantity (cell, row) {
    return (
      <Input
        type="text"
        value="0"
      />
    )
  }

  renderUnitPrice (cell, row) {
    return (
      <Input
        type="text"
        value="0.00"
      />
    )
  }

  renderVat (cell, row) {
    return (
      <Select
        className="select-default-width"
        options={[]}
        id="currency"
        name="currency"
      />
    )
  }

  renderSubTotal (cell, row) {

  }

  deletePayment() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removePayment}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removePayment() {
    const id = this.props.location.state.id;
    this.props.detailPaymentActions.deletePayment(id).then(res => {
      if (res.status === 200) {
        // this.success('Chart Account Deleted Successfully');
        this.props.commonActions.tostifyAlert('success', 'Payment Deleted Successfully')
        this.props.history.push('/admin/expense/payment')
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

    const { data , loading , initialVals , dialog} = this.state
    const {
      currency_list,
      bank_list,
      supplier_list,
      invoice_list,
      project_list
    } = this.props
    return (
      <div className="detail-payment-screen">
        <div className="animated fadeIn">
          {dialog}
          {loading? 
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
                        <span className="ml-2">Update Payment</span>
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
                                  <Button type="submit" color="primary" className="btn-square mr-3 mb-3">
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
                                      value={props.values.invoice}
                                      onChange={option => {
                                        let data;
                                        data = invoice_list.filter(item => item.invoiceId === option.value);
                                        props.handleChange('amount')(data[0]['invoiceAmount'])
                                        props.handleChange('invoice')(option)
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
                                      defaultValue={props.values.invoiceAmount}
                                      value={props.values.invoiceAmount}
                                      onChange={option => props.handleChange('invoiceAmount')(option)}
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
                                        value={moment(props.values.payment_date).format('DD-MM-YYYY')}
                                        // selected={props.values.payment_date}
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
                                      defaultValue={props.values.description}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>


                            </Col>
                          </Row>
                          <Row>
                                  <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                    <FormGroup>
                                      <Button type="button" name="button" color="danger" className="btn-square"
                                        onClick={this.deletePayment}
                                      >
                                        <i className="fa fa-trash"></i> Delete
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
                                      <Button type="button" name="button" color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push("/admin/expense/payment") }}>
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
          )  
        }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailPayment)
