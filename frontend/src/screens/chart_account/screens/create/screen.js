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
import {
  CommonActions
} from 'services/global'

import { selectOptionsFactory } from 'utils'

import * as ChartOfAccontActions from '../../actions'
import * as CreateChartOfAccontActions from './actions'


import { Formik } from 'formik';
import * as Yup from "yup";


const mapStateToProps = (state) => {
  return ({
    transaction_type_list: state.chart_account.transaction_type_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    ChartOfAccontActions: bindActionCreators(ChartOfAccontActions, dispatch),
    createChartOfAccontActions: bindActionCreators(CreateChartOfAccontActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}
class CreateChartAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: {
        transactionCategoryCode: '',
        transactionCategoryName: '',
        transactionType: ''
      },
      loading: false,
      createMore: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.initializeData = this.initializeData.bind(this)
    // this.success = this.success.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.ChartOfAccontActions.getTransactionTypes();
  }
  // Show Success Toast
  // success() {
  //   toast.success('Chart Of Account Created Successfully... ', {
  //     position: toast.POSITION.TOP_RIGHT
  //   })
  // }

  // Create or Edit Vat
  handleSubmit(data,resetForm) {
    this.props.createChartOfAccontActions.createTransactionCategory(data).then(res => {
      if (res.status == 200) {
        this.props.commonActions.tostifyAlert('success', 'New Account Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm()
        } else {
          this.props.history.push('/admin/master/chart-account')
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  render() {
    const { loading } = this.state
    const { transaction_type_list } = this.props
    return (
      <div className="chart-account-screen">
        <div className="animated fadeIn">

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-area-chart" />
                    <span className="ml-2">New Chart Account</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={6}>
                      <Formik
                        initialValues={this.state.initValue}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values,resetForm)
                        }}
                        validationSchema={
                          Yup.object().shape({
                            transactionCategoryCode: Yup.string()
                              .required("Code Name is Required"),
                            transactionCategoryName: Yup.string()
                              .required("Account is Required"),
                            transactionType: Yup.string()
                              .required("Type is Required")
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
                              <Label htmlFor="name">Name</Label>
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
                              <Label htmlFor="name">Type</Label>
                              <Select
                                className="select-default-width"
                                options={transaction_type_list ? selectOptionsFactory.renderOptions('transactionTypeName', 'transactionTypeCode', transaction_type_list,'Type') : ''}
                                value={props.values.transactionType}
                                onChange={option => {
                                  if(option && option.value) {
                                    props.handleChange('transactionType')(option.value)
                                  } else {
                                    props.handleChange('transactionType')('')
                                  }
                                }}
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
                              <Button type="button" name="submit" color="primary" className="btn-square mr-3"  onClick={() => {
                                  this.setState({ createMore: false })
                                  props.handleSubmit()
                                }}>
                                <i className="fa fa-dot-circle-o"></i> Create
                                </Button>
                              <Button name="button" color="primary" className="btn-square mr-3"
                                onClick={() => {
                                  this.setState({ createMore: true })
                                  props.handleSubmit()
                                }}>
                                <i className="fa fa-refresh"></i> Create and More
                                </Button>
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
          {loading ? (
            <Loader></Loader>
          ) : (
              ""
            )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChartAccount)
