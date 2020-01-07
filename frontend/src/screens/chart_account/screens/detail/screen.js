import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Row,
  Col
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import Select from 'react-select'
import _ from 'lodash'
import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import './style.scss'

import { selectOptionsFactory } from 'utils'

import * as ChartOfAccontActions from '../../actions'
import * as DetailChartOfAccontActions from './actions'

import { Formik } from 'formik';
import * as Yup from "yup";

import {
  CommonActions
} from 'services/global'


const mapStateToProps = (state) => {
  return ({
    transaction_type_list: state.chart_account.transaction_type_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    chartOfAccontActions: bindActionCreators(ChartOfAccontActions, dispatch),
    detailChartOfAccontActions: bindActionCreators(DetailChartOfAccontActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)

  })
}

class DetailChartAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: null,
      loading: true,
      createMore: false,
      dialog: false,
      currentData: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.initializeData = this.initializeData.bind(this)
    this.success = this.success.bind(this)
    this.deleteChartAccount = this.deleteChartAccount.bind(this)
    this.removeChartAccount = this.removeChartAccount.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const id = this.props.location.state.id
    if (this.props.location.state && id) {
      this.props.detailChartOfAccontActions.getTransactionCategoryById(id).then(res => {
        if (res.status === 200) {
          this.props.chartOfAccontActions.getTransactionTypes();
          this.setState({
            loading: false,
            initValue: {
              transactionCategoryCode: res.data.transactionCategoryCode,
              transactionCategoryName: res.data.transactionCategoryName,
              transactionType: res.data.transactionTypeId ? res.data.transactionTypeId : '',
            }
          })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null);
        this.setState({ loading: false })
        this.props.history.push('/admin/master/chart-account')
      })
    }
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
  // Show Success Toast
  success(msg) {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  deleteChartAccount() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeChartAccount}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeChartAccount() {
    const id = this.props.location.state.id;
    this.props.detailChartOfAccontActions.deleteChartAccount(id).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Account Deleted Successfully')
        this.props.history.push('/admin/master/chart-account')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }

  // Create or Edit Vat
  handleSubmit(data, resetForm) {
    const id = this.props.location.state.id
    const { transactionCategoryCode, transactionCategoryName, transactionType } = data
    const postData = Object.assign(data, { transactionCategoryId: id })
    this.props.detailChartOfAccontActions.updateTransactionCategory(postData).then(res => {
      if (res.status === 200) {
        resetForm()
        this.props.commonActions.tostifyAlert('success', 'Chart Account Updated Successfully')
        this.props.history.push('/admin/master/chart-account')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  render() {
    const { loading, dialog } = this.state
    const { transaction_type_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }
    return (
      <div className="chart-account-screen">
        <div className="animated fadeIn">
          {dialog}
          {loading ? (
            <Loader></Loader>
          ) : (
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardHeader>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-area-chart" />
                        <span className="ml-2">Update Chart Account</span>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col lg={6}>
                          <Formik
                            initialValues={this.state.initValue}
                            onSubmit={(values, { resetForm }) => {
                              this.handleSubmit(values, resetForm)
                            }}
                            validationSchema={
                              Yup.object().shape({
                                transactionCategoryCode: Yup.string()
                                  .required("Code Name is Required"),
                                transactionCategoryName: Yup.string()
                                  .required("Account is Required"),
                                transactionType: Yup.string()
                                  .required("Type is Required")
                                  .nullable()
                              })}
                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit} name="simpleForm">
                                <FormGroup>
                                  <Label htmlFor="transactionCategoryCode">Code</Label>
                                  <Input
                                    type="text"
                                    id="transactionCategoryCode"
                                    name="transactionCategoryCode"
                                    placeholder="Enter Code"
                                    onChange={(val) => { props.handleChange('transactionCategoryCode')(val) }}
                                    value={props.values.transactionCategoryCode}
                                    className={
                                      props.errors.transactionCategoryCode && props.touched.transactionCategoryCode
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.transactionCategoryCode && props.touched.transactionCategoryCode && (
                                    <div className="invalid-feedback">{props.errors.transactionCategoryCode}</div>
                                  )}
                                </FormGroup>
                                <FormGroup>
                                  <Label htmlFor="transactionCategoryName">Name</Label>
                                  <Input
                                    type="text"
                                    id="transactionCategoryName"
                                    name="transactionCategoryName"
                                    placeholder="Enter Name"
                                    onChange={(value) => { props.handleChange('transactionCategoryName')(value) }}
                                    value={props.values.transactionCategoryName}
                                    className={
                                      props.errors.transactionCategoryName && props.touched.transactionCategoryName
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.transactionCategoryName && props.touched.transactionCategoryName && (
                                    <div className="invalid-feedback">{props.errors.transactionCategoryName}</div>
                                  )}
                                </FormGroup>
                                <FormGroup>
                                  <Label htmlFor="transactionType">Type</Label>
                                  <Select
                                    className="select-default-width"
                                    options={transaction_type_list ? selectOptionsFactory.renderOptions('transactionTypeName', 'transactionTypeCode', transaction_type_list,'Type') : []}
                                    value={props.values.transactionType}
                                    onChange={option => props.handleChange('transactionType')(option.value)}
                                    placeholder="Select Type"
                                    id="transactionType"
                                    name="transactionType"
                                    className={
                                      props.errors.transactionType && props.touched.transactionType
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.transactionType && props.touched.transactionType && (
                                    <div className="invalid-feedback">{props.errors.transactionType}</div>
                                  )}
                                </FormGroup>

                                <Row>
                                  <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                    <FormGroup>
                                      <Button type="button" name="button" color="danger" className="btn-square"
                                        onClick={this.deleteChartAccount}
                                      >
                                        <i className="fa fa-trash"></i> Delete
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
                                      <Button type="button" name="button" color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push("/admin/master/chart-account") }}>
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
            )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailChartAccount)
