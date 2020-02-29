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
import { Formik, Field } from 'formik';
import * as Yup from 'yup'

import {
  CommonActions
} from 'services/global'
import {
  selectOptionsFactory,
} from 'utils'

import moment from 'moment'

import * as transactionCreateActions from './actions';
import * as  transactionActions from "../../actions";

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    transaction_category_list: state.bank_account.transaction_category_list,
    transaction_type_list: state.bank_account.transaction_type_list,
    project_list: state.bank_account.project_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    transactionActions: bindActionCreators(transactionActions, dispatch),
    transactionCreateActions: bindActionCreators(transactionCreateActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
  })
}

class CreateBankTransaction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      createMore: false,
      fileName: '',
      initValue: {
        bankAccountId: '',
        transactionDate: '',
        transactionDescription: '',
        transactionAmount: '',
        transactionTypeCode: '',
        transactionCategoryId: '',
        projectId: '',
        receiptNumber: '',
        attachementDescription: '',
        attachment: '',
      },
      id: ''
    }

    this.file_size = 1024000;
    this.supported_format = [
      "",
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    this.regEx = /^[0-9\d]+$/;

    this.formRef = React.createRef()

    this.initializeData = this.initializeData.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)

  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
      if(this.props.location.state && this.props.location.state.bankAccountId) {
        this.setState({
          id: this.props.location.state.bankAccountId
        })
        this.props.transactionActions.getTransactionCategoryList()
        this.props.transactionActions.getTransactionTypeList()
        this.props.transactionActions.getProjectList()
      }
  }

  handleFileChange(e, props) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
      };
      reader.readAsDataURL(file);
      console.log(file)
      props.setFieldValue('attachment', file);
    }
  }


  handleSubmit(data, resetForm) {
    let bankAccountId = this.props.location.state && this.props.location.state.bankAccountId ? this.props.location.state.bankAccountId : ''
    const {
      transactionDate,
      transactionDescription,
      transactionAmount,
      transactionTypeCode,
      transactionCategoryId,
      projectId,
      receiptNumber,
      attachementDescription,
    } = data

    let formData = new FormData();
    formData.append("bankAccountId ", bankAccountId ? bankAccountId : '');
    formData.append("transactionDate", transactionDate ? moment(transactionDate).toString() : '');
    formData.append("transactionDescription", transactionDescription ? transactionDescription : '');
    formData.append("transactionAmount", transactionAmount ? transactionAmount : '');
    formData.append("transactionTypeCode", transactionTypeCode ? transactionTypeCode : '');
    formData.append("transactionCategoryId", transactionCategoryId ? transactionCategoryId : '');
    formData.append("projectId", projectId ? projectId : '');
    formData.append("receiptNumber", receiptNumber ? receiptNumber : '');
    formData.append("attachementDescription", attachementDescription ? attachementDescription : '');
    if (this.uploadFile.files[0]) {
      formData.append("attachment", this.uploadFile.files[0]);
    }
    this.props.transactionCreateActions.createTransaction(formData).then(res => {
      if (res.status === 200) {
        resetForm()
        this.props.commonActions.tostifyAlert('success', 'New Transaction Created Successfully.')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
        } else {
          this.props.history.push('/admin/banking/bank-account/transaction',{'bankAccountId': bankAccountId})
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }


  render() {
    const { project_list, transaction_category_list, transaction_type_list } = this.props
    const { initValue ,id} = this.state
    return (
      <div className="create-bank-transaction-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="icon-doc" />
                        <span className="ml-2">Create Bank Transaction</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={initValue}
                        ref={this.formRef}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values, resetForm)
                        }}
                        validationSchema={
                          Yup.object().shape({
                            transactionDate: Yup.date()
                              .required('Transaction Date is Required'),
                            transactionAmount: Yup.string()
                              .required('Transaction Amount is Required'),
                            transactionTypeCode: Yup.string()
                              .required('Transaction Type is Required'),
                            attachment: Yup.mixed()
                              .test('fileType', "*Unsupported File Format", value => {
                                if (value && !this.supported_format.includes(value.type)) {
                                  this.setState({
                                    fileName: value.name
                                  })
                                  return false
                                } else {
                                  return true
                                }
                              })
                              .test('fileSize', "*File Size is too large", value => {
                                if (value && value.size >= this.file_size) {
                                  return false
                                } else {
                                  return true
                                }
                              })
                          })}
                      >
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="transactionTypeCode">Transaction Type</Label>
                                  <Select
                                    className="select-default-width"
                                    options={transaction_type_list ? selectOptionsFactory.renderOptions('transactionTypeName', 'transactionTypeCode', transaction_type_list, 'Type') : ''}
                                    value={props.values.transactionTypeCode}
                                    onChange={option => {
                                      if (option && option.value) {
                                        props.handleChange('transactionTypeCode')(option.value)
                                      } else {
                                        props.handleChange('transactionTypeCode')('')
                                      }
                                    }}
                                    placeholder="Select Type"
                                    id="transactionTypeCode"
                                    name="transactionTypeCode"
                                    className={
                                      props.errors.transactionTypeCode && props.touched.transactionTypeCode
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.transactionTypeCode && props.touched.transactionTypeCode && (
                                    <div className="invalid-feedback">{props.errors.transactionTypeCode}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="date">Transaction Date</Label>
                                  <DatePicker
                                    id="transactionDate"
                                    name="transactionDate"
                                    placeholderText="Transaction Date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    value={props.values.transactionDate}
                                    selected={props.values.transactionDate}
                                    onChange={(value) => {
                                      props.handleChange("transactionDate")(value)
                                    }}
                                    className={`form-control ${props.errors.transactionDate && props.touched.transactionDate ? "is-invalid" : ""}`}
                                  />
                                  {props.errors.transactionDate && props.touched.transactionDate && (
                                    <div className="invalid-feedback">{props.errors.transactionDate}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="transactionAmount">Total Amount</Label>
                                  <Input
                                    type="text"
                                    id="transactionAmount"
                                    name="transactionAmount"
                                    placeholder="Amount"
                                    onChange={(option) => { if (option.target.value === '' || this.regEx.test(option.target.value)) props.handleChange('transactionAmount')(option) }}
                                    value={props.values.transactionAmount}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="transactionCategoryId">Category</Label>
                                  <Select
                                    className="select-default-width"
                                    options={transaction_category_list ? selectOptionsFactory.renderOptions('transactionCategoryName', 'transactionCategoryId', transaction_category_list, 'Category') : []}
                                    id="transactionCategoryId"
                                    value={props.values.transactionCategoryId}
                                    onChange={option => props.handleChange('transactionCategoryId')(option.value)}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="transactionDescription">Description</Label>
                                  <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    rows="6"
                                    placeholder="Description..."
                                    onChange={option => props.handleChange('transactionDescription')(option)}
                                    value={props.values.transactionDescription}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="projectId">Project</Label>
                                  <Select
                                    className="select-default-width"
                                    options={project_list ? selectOptionsFactory.renderOptions('projectName', 'projectId', project_list, 'Project') : []}
                                    id="projectId"
                                    name="projectId"
                                    onChange={option => props.handleChange('projectId')(option.value)}
                                    value={props.values.projectId}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
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
                                        placeholder="Reciept Number"
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
                                      <Field name="attachment"
                                        render={({ field, form }) => (
                                          <div>
                                            <Label>Reciept Attachment</Label> <br />
                                            <Button color="primary" onClick={() => { document.getElementById('fileInput').click() }} className="btn-square mr-3">
                                              <i className="fa fa-upload"></i> Upload
                                  </Button>
                                            <input id="fileInput" ref={ref => {
                                              this.uploadFile = ref;
                                            }} type="file" style={{ display: 'none' }} onChange={(e) => {
                                              this.handleFileChange(e, props)
                                            }} />
                                            {this.state.fileName}

                                          </div>
                                        )}
                                      />
                                      {console.log(props.errors)}
                                      {props.errors.attachment && (
                                        <div className="invalid-file">{props.errors.attachment}</div>
                                      )}
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
                                  <Button type="button" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ createMore: true }, () => {
                                        props.handleSubmit()
                                      })
                                    }
                                    }>
                                    <i className="fa fa-repeat"></i> Create and More
                        </Button>
                                  <Button color="secondary" className="btn-square" onClick={() => {
                                    this.props.history.push('/admin/banking/bank-account/transaction',{'bankAccountId': id})}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateBankTransaction)
