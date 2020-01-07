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
import DatePicker from 'react-datepicker'

import { Formik } from 'formik';
import * as Yup from "yup";


import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as ReceiptActions from '../../actions';
import * as ReceiptCreateActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    contact_list: state.receipt.contact_list,
    invoice_list: state.receipt.invoice_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    receiptCreateActions: bindActionCreators(ReceiptCreateActions,dispatch),
    receiptActions: bindActionCreators(ReceiptActions, dispatch)
  })
}

class CreateReceipt extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      createMore: false,
      initValue: {
        receiptDate: '',
        receiptNo: '',
        referenceCode: '',
        contactId: '',
        invoiceId: '',
        amount: '',
        unusedAmount: '',
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.initializeData = this.initializeData.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.receiptActions.getContactList();
    this.props.receiptActions.getInvoiceList();
  }

  handleSubmit(data) {
    this.props.receiptCreateActions.createReceipt(data).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'New Receipt Created Successfully!')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
        } else this.props.history.push('/admin/revenue/receipt')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }


  render() {

    const { contact_list, invoice_list } = this.props;
    const { initValue } = this.state

    return (
      <div className="create-receipt-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fa fa-file-o" />
                        <span className="ml-2">Create Receipt</span>
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
                        }}
                      validationSchema={
                        Yup.object().shape({
                        receiptDate: Yup.date()
                          .required("Receipt Date is Required"),
                        referenceCode: Yup.string()
                          .required("Reference Number is Required"),
                        contactId: Yup.string()
                        .required('Customer is required'),
                        amount: Yup.string()
                        .required('Amount is required')
                      })}
                      >
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="receiptNo">Receipt Number</Label>
                                  <Input
                                    type="text"
                                    id="receiptNo"
                                    name="receiptNo"
                                    placeholder="Receipt Number"
                                    onChange={(value) => {
                                      props.handleChange("receiptNo")(value)
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="receipt_date">Receipt Date</Label>
                                  <DatePicker
                                  
                                   id="date"
                                   name="receiptDate"
                                  placeholderText="Receipt Date"
                                  selected={props.values.receiptDate}
                                  onChange={(value) => {
                                  props.handleChange("receiptDate")(value)
                              }}
                              className={`form-control ${props.errors.receiptDate && props.touched.receiptDate ? "is-invalid" : ""}`}

                              />
                              {props.errors.receiptDate && props.touched.receiptDate && (
                                <div className="invalid-feedback">{props.errors.receiptDate}</div>
                              )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="referenceCode">Reference Number</Label>
                                  <Input
                                    type="text"
                                    id="referenceCode"
                                    name="referenceCode"
                                    placeholder="Reference Number"
                                    onChange={option => {props.handleChange('referenceCode')(option)}}
                                    className={`form-control ${props.errors.referenceCode && props.touched.referenceCode ? "is-invalid" : ""}`}

                                    />
                                    {props.errors.referenceCode && props.touched.referenceCode && (
                                      <div className="invalid-feedback">{props.errors.referenceCode}</div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="customer_name">Customer Name</Label>
                                  <Select
                                options={contact_list ? selectOptionsFactory.renderOptions('label', 'value', contact_list,'Customer Name') : []}
                                // className="select-default-width"
                                placeholder="Customer Name"
                                value={props.values.contactId}
                                onChange={(option) => {
                                  if (option && option.value) {
                                    console.log(option.value)
                                    props.handleChange('contactId')(option.value)
                                  }
                                }}
                                className={`${props.errors.contactId && props.touched.contactId ? "is-invalid" : ""}`}

                                />
                                {props.errors.contactId && props.touched.contactId && (
                                  <div className="invalid-feedback">{props.errors.contactId}</div>
                                )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="invoice">Invoice</Label>
                                  <Select
                                 options={invoice_list ? selectOptionsFactory.renderOptions('label', 'value', invoice_list,'Invoice Number') : []}
                                  className="select-default-width"
                                  placeholder="Invoice Number"
                                 value={props.values.invoiceId}
                                  onChange={(option) => {
                                  if (option && option.value) {
                                    props.handleChange('invoiceId')(option.value)
                                  }
                                }}
                              />
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="mode">Mode</Label>
                                  <Select
                                    className="select-default-width"
                                    options={[]}
                                    id="mode"
                                    name="mode"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    placeholder="Amount"
                                    onChange={(value) => {props.handleChange('amount')(value)}}

                                    className={`form-control ${props.errors.amount && props.touched.amount ? "is-invalid" : ""}`}

                                    />
                                    {props.errors.amount && props.touched.amount && (
                                      <div className="invalid-feedback">{props.errors.amount}</div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="unusedAmount">Unused Amount</Label>
                                  <Input
                                    type="text"
                                    id="unusedAmount"
                                    name="unusedAmount"
                                    placeholder="Unused Amount"
                                    onChange={(value) => {props.handleChange('unusedAmount')(value)}}
                                    
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                                <Col lg={12} className="mt-5">
                                  <FormGroup className="text-right">
                                    <Button type="submit" color="primary" className="btn-square mr-3">
                                      <i className="fa fa-dot-circle-o"></i> Create
                                    </Button>
                                    <Button type="button" color="primary" className="btn-square mr-3"
                                      onClick={
                                        () => {
                                          this.setState({createMore: true})
                                          props.handleSubmit()
                                        }
                                      }
                                    >
                                      <i className="fa fa-repeat"></i> Create and More
                                    </Button>
                                    <Button color="secondary" className="btn-square" 
                                      onClick={() => {this.props.history.push('/admin/revenue/receipt')}}>
                                      <i className="fa fa-ban"></i> Cancel
                                    </Button>
                                  </FormGroup>
                                </Col>
                              </Row>
                          </Form>
                        )
                      }
                     </Formik>}
                    
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateReceipt)
