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
import DatePicker from 'react-datepicker'
import * as Yup from 'yup'
import { Loader } from 'components'
import { SupplierModal } from '../../sections'


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
        bank: '',
        supplier: '',
        invoiceId: '',
        amount: '',
        currency: '',
        project: '',
        paymentDate: '',
        description: '',
      },

      currentData: {},
      openSupplierModal: false,
      contactType: 1
    }

    this.options = {
    }

    this.regEx = /^[0-9\d]+$/;
    this.formRef = React.createRef()
  }

  componentDidMount = () => {
    this.initializeData()
  }


  initializeData = () => {
    this.props.paymentActions.getCurrencyList()
    this.props.paymentActions.getBankList()
    this.props.paymentActions.getSupplierContactList(this.state.contactType)
    this.props.paymentActions.getProjectList()
    this.props.paymentActions.getSupplierInvoiceList()

  }

  renderActions = (cell, row) => {
    return (
      <Button size="sm" className="btn-twitter btn-brand icon"><i className="fas fa-trash"></i></Button>
    )
  }


  handleChange = (e, name) => {
    this.setState({
      currentData: _.set(
        { ...this.state.currentData },
        e.target.name && e.target.name !== '' ? e.target.name : name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      )
    })
  }

  handleSubmit = (data, resetForm) => {
    const {
      bank,
      supplier,
      invoiceId,
      amount,
      paymentDate,
      currency,
      project,
      description,
    } = data

    let postData = {
      paymentDate: paymentDate !== null ? paymentDate : "",
      description,
      invoiceId: invoiceId && invoiceId.value ? invoiceId.value : '',
      invoiceAmount: amount,
      bankAccountId: bank && bank.value ? bank.value : '',
      contactId: supplier && supplier.value ? supplier.value : '',
      currencyCode: currency && currency.value ? currency.value : '',
      projectId: project && project.value ? project.value : '',
    }
    this.props.createPaymentActions.createPayment(postData).then((res) => {
      this.props.commonActions.tostifyAlert('success', 'Payment Created Successfully.')
      if (this.state.createMore) {
        this.setState({
          createMore: false,
        })
        resetForm(this.state.initialVals)
      } else {
        this.props.history.push('/admin/expense/payment')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

  renderProductName = (cell, row) => {
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

  renderQuantity = (cell, row) => {
    return (
      <Input
        type="text"
        value="0"
      />
    )
  }

  renderUnitPrice = (cell, row) => {
    return (
      <Input
        type="text"
        value="0.00"
      />
    )
  }

  renderVat = (cell, row) => {
    return (
      <Select
        className="select-default-width"
        options={[]}
        id="currency"
        name="currency"
      />
    )
  }

  renderSubTotal = (cell, row) => {

  }

  openSupplierModal = (e) => {
    e.preventDefault()
    this.setState({ openSupplierModal: true })
  }

  getCurrentUser = (data) => {
    let option
    if (data.label || data.value) {
      option = data
    } else {
      option = {
        label: `${data.fullName}`,
        value: data.id,
      }
    }
    this.setState({
      selectedSupplier: option
    })
    this.formRef.current.setFieldValue('supplier', option, true)
  }

  closeSupplierModal = (res) => {
    if (res) {
      this.props.paymentActions.getSupplierContactList(this.state.contactType);
    }
    this.setState({ openSupplierModal: false })
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
      initialVals,
      // selectedSupplier
    } = this.state
    const { loading } = this.state

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
                        ref={this.formRef}
                        initialValues={initialVals}
                        onSubmit={
                          (values, { resetForm }) => {
                            this.handleSubmit(values, resetForm)

                          }}
                        validationSchema={
                          Yup.object().shape({
                            supplier: Yup.string()
                              .required('Supplier is required'),
                            paymentDate: Yup.date()
                              .required('Payment Date is Required'),
                            currency: Yup.string()
                              .required('Currency is Required')
                              .nullable(),
                            invoiceId: Yup.string()
                              .required('Invoice Number is Required')
                              .nullable(),
                            amount: Yup.string()
                              .required('Invoice Amount is Required')
                              .matches(/^[0-9]*$/, "Enter a Valid Amount")
                          })
                        }
                      >
                        {
                          (props) => (
                            <Form onSubmit={props.handleSubmit}>
                              <Row>
                                <Col lg={12}>
                                  <Row>
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="supplier"><span className="text-danger">*</span>Supplier Name</Label>
                                        <Select

                                          id="supplier"
                                          name="supplier"
                                          options={supplier_list ? selectOptionsFactory.renderOptions('label', 'value', supplier_list, 'Supplier Name') : []}
                                          value={props.values.supplier}
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('supplier')(option)
                                            } else {
                                              props.handleChange('supplier')('')
                                            }
                                            // this.getCurrentUser(option)/
                                          }}
                                          className={
                                            props.errors.supplier && props.touched.supplier
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                        {props.errors.supplier && props.touched.supplier && (
                                          <div className="invalid-feedback">{props.errors.supplier}</div>
                                        )}
                                      </FormGroup>
                                      <Button type="button" color="primary" className="btn-square mr-3 mb-3"
                                        onClick={this.openSupplierModal}
                                      >
                                        <i className="fa fa-dot-circle-o"></i> Supplier
                                  </Button>
                                    </Col>
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="invoiceId"><span className="text-danger">*</span>Invoice #</Label>
                                        <Select
                                          id="invoiceId"
                                          name="invoiceId"
                                          options={invoice_list ? selectOptionsFactory.renderOptions('label', 'value', invoice_list, 'Invoice Number') : []}
                                          value={props.values.invoiceId}
                                          onChange={(option) => {
                                            // this.props.paymentActions.getInvoiceById(+option.value).then((res) => {
                                            // if (res.status === 200) {
                                            // }
                                            // let data;
                                            // data = invoice_list.filter((item) => item.invoiceId === option.value);
                                            // props.handleChange('amount')(data[0]['invoiceAmount'])
                                            // }
                                            // )
                                            if (option && option.value) {
                                              props.handleChange('invoiceId')(option)
                                            } else {
                                              props.handleChange('invoiceId')('')
                                            }

                                          }
                                          }
                                          className={
                                            props.errors.invoiceId && props.touched.invoiceId
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                        {props.errors.invoiceId && props.touched.invoiceId && (
                                          <div className="invalid-feedback">{props.errors.invoiceId}</div>
                                        )}
                                      </FormGroup>
                                    </Col>
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="amount"><span className="text-danger">*</span>Invoice Amount</Label>
                                        <Input
                                          // className="form-control"
                                          type="text"
                                          id="amount"
                                          name="amount"
                                          placeholder="Enter Amount"
                                          // required
                                          // defaultValue={props.values.amount}
                                          className={props.errors.amount && props.touched.amount ? "is-invalid" : ""}
                                          value={props.values.amount}
                                          onChange={(option) => { if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('amount')(option) } }}
                                        />
                                        {props.errors.amount && props.touched.amount && (
                                          <div className="invalid-feedback">{props.errors.amount}</div>
                                        )}
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="currency"><span className="text-danger">*</span>Currency</Label>
                                        <Select
                                          id="currency"
                                          name="currency"
                                          options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                          value={props.values.currency}
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('currency')(option)
                                            } else {
                                              props.handleChange('currency')('')
                                            }
                                          }
                                          }
                                          className={
                                            props.errors.currency && props.touched.currency
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                        {props.errors.currency && props.touched.currency && (
                                          <div className="invalid-feedback">{props.errors.currency}</div>
                                        )}
                                      </FormGroup>
                                    </Col>
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="project">Project</Label>
                                        <Select
                                          id="project"
                                          name="project"
                                          options={project_list ? selectOptionsFactory.renderOptions('label', 'value', project_list, 'Project') : []}
                                          value={props.values.project}
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('project')(option)
                                            } else {
                                              props.handleChange('project')('')
                                            }
                                          }}
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
                                        <Label htmlFor="paymentDate"><span className="text-danger">*</span>Payment Date</Label>
                                        <DatePicker

                                          id="date"
                                          name="paymentDate"
                                          placeholderText="Payment Date"
                                          selected={props.values.paymentDate}
                                          dateFormat="dd/MM/yyyy"
                                          maxDate={new Date()}
                                          showMonthDropdown
                                          showYearDropdown
                                          dropdownMode="select"
                                          onChange={(value) => {
                                            props.handleChange("paymentDate")(value)
                                          }}
                                          className={`form-control ${props.errors.paymentDate && props.touched.paymentDate ? "is-invalid" : ""}`}
                                        />
                                        {props.errors.paymentDate && props.touched.paymentDate && (
                                          <div className="invalid-feedback">{props.errors.paymentDate}</div>
                                        )}
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="bank">Bank</Label>
                                        <Select
                                          id="bank"
                                          name="bank"
                                          options={bank_list && bank_list.data ? selectOptionsFactory.renderOptions('name', 'bankAccountId', bank_list.data, 'Bank') : []}
                                          value={props.values.bank}
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('bank')(option)
                                            } else {
                                              props.handleChange('bank')('')
                                            }
                                          }}
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
                                      onChange={(option) => props.handleChange('referenceNo')(option)}
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
                                          onChange={(option) => props.handleChange('description')(option)}
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>


                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} className="mt-5">
                                  <FormGroup className="text-right">
                                    <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                      this.setState({ createMore: false }, () => {
                                        props.handleSubmit()
                                      })
                                    }
                                    }>
                                      <i className="fa fa-dot-circle-o"></i> Create
                        </Button>
                                    <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                      this.setState({ createMore: true }, () => {
                                        props.handleSubmit()
                                      })
                                    }
                                    }>
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
            )
          }
        </div>
        <SupplierModal
          openSupplierModal={this.state.openSupplierModal}
          closeSupplierModal={(e) => { this.closeSupplierModal(e) }}
          getCurrentUser={(e) => this.getCurrentUser(e)}
          createSupplier={this.props.paymentActions.createSupplier}
        />
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePayment)
