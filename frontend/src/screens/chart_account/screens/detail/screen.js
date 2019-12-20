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
import { Loader } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import './style.scss'

import { selectOptionsFactory } from 'utils'

import * as ChartOfAccontActions from '../../actions'
import * as DetailChartOfAccontActions from './actions'

import { Formik } from 'formik';
import * as Yup from "yup";


const mapStateToProps = (state) => {
  return ({
    transaction_type_list: state.chart_account.transaction_type_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    chartOfAccontActions: bindActionCreators(ChartOfAccontActions, dispatch),
    detailChartOfAccontActions: bindActionCreators(DetailChartOfAccontActions, dispatch)
  })
}

// const CHART_ACCOUNT_TYPES = [
//   { value: 1, label: 'Sales'},
//   { value: 2, label: 'Cost of Sales'}
// ]

class DetailChartAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: null,
      loading: true,
      readMore: false,
      currentData: {}

    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.initializeData = this.initializeData.bind(this)
    this.success = this.success.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const id = this.props.location.state.id
    if (this.props.location.state && id) {
      this.props.chartOfAccontActions.getTransactionTypes();
      // this.setState({
      // }, () => {
      this.props.detailChartOfAccontActions.getTransactionCategoryById(id).then(res => {
        console.log(res.data)
        if(res.status === 200) {
          this.setState({
            loading: false,
            initValue: {
              transactionCategoryCode: res.data.transactionCategoryCode,
              transactionCategoryName: res.data.transactionCategoryName,
              transactionType: res.data.transactionType ? {
                label: res.data.transactionType.transactionTypeName,
                value: res.data.transactionType.transactionTypeCode
              } : null,
            }
          })
        } else {this.props.history.push('/admin/master/chartAccount')}
      })
      // })
    } else {
      this.props.history.push('/admin/master/chartAccount')
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
  success() {
    toast.success('Transaction Category Updated successfully... ', {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  // Create or Edit Vat
  handleSubmit(data) {
    const id = this.props.location.state.id
    const { transactionCategoryCode, transactionCategoryName, transactionType } = data
    const postData = {
      transactionCategoryId: id,
      transactionCategoryCode: transactionCategoryCode,
      transactionCategoryName: transactionCategoryName,
      transactionType: (transactionType && transactionType.value !== null ? transactionType.value : '')
    }
    this.props.detailChartOfAccontActions.updateTransactionCategory(postData).then(res => {
      if (res.status === 200) {
        this.success()

        if (this.state.readMore) {
          this.setState({
            readMore: false
          })
        } else this.props.history.push('/admin/master/chart-account')
      }
    })
    console.log(postData)
  }

  render() {
    const { loading } = this.state
    const { transaction_type_list } = this.props
    return (
      <div className="chart-account-screen">
        <div className="animated fadeIn">

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

                              this.handleSubmit(values)
                              resetForm(this.state.initValue)
                            }}
                          // validationSchema={Yup.object().shape({
                          //   code: Yup.string()
                          //     .required("Code Name is Required"),
                          //   account: Yup.string()
                          //     .required("Account is Required"),
                          //   type: Yup.string()
                          //     .required("Type is Required")
                          // })}
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
                                    options={transaction_type_list ? selectOptionsFactory.renderOptions('transactionTypeName', 'transactionTypeCode', transaction_type_list) : []}
                                    value={props.values.transactionType}
                                    onChange={option => props.handleChange('transactionType')(option)}
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

                                <FormGroup className="text-right mt-5">
                                  <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Update
                                </Button>
                                  {/* <Button name="button" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ readMore: true })
                                      props.handleSubmit()
                                    }}>
                                    <i className="fa fa-refresh"></i> Create and More
                                </Button> */}
                                  <Button type="submit" color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/master/chart-account') }}>
                                    <i className="fa fa-ban"></i> Cancel
                                </Button>
                                </FormGroup>
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
