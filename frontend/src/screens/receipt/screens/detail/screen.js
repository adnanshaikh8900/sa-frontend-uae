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
import moment from 'moment'


import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as ReceiptActions from '../../actions';
import * as ReceiptDetailActions from './actions';

import { Loader, ConfirmDeleteModal } from 'components'


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
    receiptDetailActions: bindActionCreators(ReceiptDetailActions, dispatch),
    receiptActions: bindActionCreators(ReceiptActions, dispatch)
  })
}

class DetailReceipt extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dialog: null,
      initValue: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.initializeData = this.initializeData.bind(this)
    this.deleteReceipt = this.deleteReceipt.bind(this)
    this.removeReceipt = this.removeReceipt.bind(this)
    this.removeDialog = this.removeDialog.bind(this)

  }


  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const id = this.props.location.state.id ? this.props.location.state.id : ''
    if (this.props.location.state && id) {
      this.props.receiptActions.getContactList();
      this.props.receiptActions.getInvoiceList();
      this.props.receiptDetailActions.getReceiptById(id).then(res => {
        // this.props.receiptActions.getTitleList()
        const { receiptDate } = res.data
        if (res.status === 200) {
          this.setState({
            initValue: {
              receiptNo: res.data.receiptNo,
              contactId: res.data.contactId ? res.data.contactId : '',
              referenceCode: res.data.referenceCode,
              receiptDate: res.data.receiptDate ? res.data.receiptDate : '',
              unusedAmount: res.data.unusedAmount,
              amount: res.data.amount,
              invoiceId: res.data.invoiceId ? res.data.invoiceId : ''
            },
            loading: false,

          }, () => {
            console.log(this.state.initValue)
          })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err ? err.data.message : null)
        this.setState({ loading: false })
      })
    }
  }

  handleSubmit(data) {

    const id = this.props.location.state.id;
    const {
      receiptDate,
      receiptNo,
      referenceCode,
      contactId,
      invoiceId,
      amount,
      unusedAmount
    } = data

    const postData = {
      receiptId: id,
      receiptNo: receiptNo ? receiptNo : '',
      referenceCode: referenceCode ? referenceCode : '',
      receiptDate: receiptDate ? receiptDate : '',
      contactId: contactId && contactId !== null ? contactId : '',
      amount: amount ? amount : '',
      unusedAmount: unusedAmount ? unusedAmount : '',
      invoiceId: invoiceId && invoiceId !== null ? invoiceId : ''
      // contractPoNumber: contractPoNumber ? contractPoNumber : ''
    }
    this.props.receiptDetailActions.updateReceipt(postData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Updated successfully!')
        this.props.history.push('/admin/revenue/receipt')
    }
  }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  deleteReceipt() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeReceipt}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeReceipt() {
    const id = this.props.location.state.id;
    this.props.receiptDetailActions.deleteReceipt(id).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success','Receipt Deleted Successfully');
        this.props.history.push('/admin/revenue/receipt')
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

    const { contact_list, invoice_list } = this.props
    const { loading, dialog, initValue } = this.state

    return (
      <div className="detail-receipt-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fa fa-file-o" />
                        <span className="ml-2">Update Receipt</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {dialog}
                  {loading ?
                    (
                      <Loader />
                    )
                    :
                    (
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
                                      value={props.values.receiptNo}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="receipt_date">Receipt Date</Label>
                                    <DatePicker
                                     className="form-control"
                                     id="date"
                                     name="receiptDate"
                                    placeholderText="Receipt Date"
                                    value={props.values.receiptDate ? moment(props.values.receiptDate).format('DD-MM-YYYY') : ''}
                                    onChange={(value) => {
                                    props.handleChange("receiptDate")(value)
                                }}
                              />
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
                                      value={props.values.referenceCode}
                                      onChange={option => {props.handleChange('referenceCode')(option)}}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="customer_name">Customer Name</Label>
                                    <Select
                                  options={contact_list ? selectOptionsFactory.renderOptions('label', 'value', contact_list,'Customer Name') : []}
                                  className="select-default-width"
                                  placeholder="Customer Name"
                                  value={props.values.contactId}
                                  onChange={(option) => {
                                    if (option && option.value) {
                                      console.log(option.value)
                                      props.handleChange('contactId')(option.value)
                                    }
                                  }}
                                />
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
                                      value={props.values.amount}
                                      onChange={(value) => {props.handleChange('amount')(value)}}
  
                                    />
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
                                      value={props.values.unusedAmount}
                                      onChange={(value) => {props.handleChange('unusedAmount')(value)}}
                                      
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                            <Col lg={12} className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
                              <FormGroup>
                                <Button color="danger" className="btn-square" onClick={this.deleteReceipt}>
                                  <i className="fa fa-trash"></i> Delete
                                </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                </Button>
                                      <Button color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push('/admin/revenue/receipt') }}>
                                        <i className="fa fa-ban"></i> Cancel
                                </Button>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Form>
                            )
                            }
                          </Formik>

                        </Col>
                      </Row>
                    )


                  }

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailReceipt)

