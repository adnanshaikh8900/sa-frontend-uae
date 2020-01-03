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
import _ from 'lodash'
import moment from 'moment'

import { Loader , ConfirmDeleteModal} from 'components'

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as EmployeeActions from '../../actions';
import * as EmployeeDetailActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    employeeDetailActions: bindActionCreators(EmployeeDetailActions, dispatch)
  })
}

class DetailEmployee extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initValue: {},
      id: props.location.state.id,
      dialog: false,
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleSubmit = this.handleSbmit.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)
    this.removeProduct = this.removeProduct.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  // changeBirthday(date){
  //   this.setState({
  //     birthday: date
  //   })
  // }

  // handleChange = (name, e) => {
  //    this.setState({
  //     currentData: _.set(
  //       { ...this.state.currentData },
  //       e.target.name && e.target.name !== '' ? e.target.name : name,
  //       e.target.type === 'checkbox' ? e.target.checked : e.target.value
  //     )
  //   })
  // this.setState({
  //   currentData: _.set(
  //     { ...this.state.currentData },
  //     e.target.name && e.target.name !== '' ? e.target.name : name,
  //     e.target.type === 'checkbox' ? e.target.checked : e.target.value
  //   )
  // })

  componentDidMount() {
    this.props.employeeActions.getCurrencyList()
  }
  
  initializeData() {
    const {id} = this.state;
    if(id) {
      this.props.employeeDetailActions.getEmployeeById(id).then(res => {
        if(res.status === 200) {
          this.props.employeeAction.getCurrencyList()
          this.setState({
            initValue: {
              firstName: res.data.firstName !== '' ? res.data.firstName : '',
              middleName: res.data.middleName !== '' ? res.data.middleName : '',
              lastName: res.data.lastName !== '' ? res.data.lastName : '',
              email: res.data.email !== '' ? res.data.email : '',
              password: res.data.password !== '' ? res.data.passowrd : '',
              dob: res.data.dob !== '' ? moment(res.data.dob).format('DD-MM-YYYY') : '',
              referenceCode: res.data.referenceCode !== '' ? res.data.referenceCode : '',
              title: res.data.title !== '' ? res.data.title : '',
              billingEmail: res.data.billingEmail !== '' ? res.data.billingEmail : '',
              vatRegistrationNumber: res.data.vatRegistrationNumber !== '' ? res.data.vatRegistrationNumber : '',
              currencyCode: res.data.currencyCode !== '' ? res.data.currencyCode : '',
              poBoxNumber: res.data.poBoxNumber !== '' ? res.data.poBoxNumber : '',
            },
          })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
      })
    }
  }

  handleSubmit(data) {
    
    this.props.employeeDetailActions.updateEmployee(data).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully')
          this.props.history.push('/admin/master/employee')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  deleteProduct() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeProduct}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeProduct() {
    const {id} = this.state;
    this.props.employeeDetailActions.deleteEmployee(id).then(res=>{
      if(res.status === 200) {
        // this.success('Product Deleted Successfully');
        this.props.history.push('/admin/master/employee')
      }
    }).catch(err=> {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }
  render() {

    const { currency_list } = this.props
    const { dialog,loading,initValue} = this.state
    return (
      <div className="detail-employee-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user-tie" />
                        <span className="ml-2">Update Employee</span>
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
                          // resetForm(this.state.initValue)
                        }}
                        validationSchema={Yup.object().shape({
                          firstName: Yup.string()
                            .required("First Name is Required"),
                          lastName: Yup.string()
                            .required("Last Name is Required"),
                          middleName: Yup.string()
                            .required("Middle Name is Required"),
                          password: Yup.string()
                            .required("Password is Required")
                            .min(8,"Password Too Short")
                            .matches(
                              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])$/,
                              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                            ),
                          confirmPassword: Yup.string()
                            .required('Confirm Password is Required')
                            .oneOf([Yup.ref("password"), null], "Passwords must match"),
                          dob: Yup.date()
                            .required('DOB is Required')
                        })}
                      >
                        {props => (

                          <Form onSubmit={props.handleSubmit}>
                            <h4 className="mb-4">Contact Name</h4>
                            <Row>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Reference Code</Label>
                                  <Input
                                    type="text"
                                    id="referenceCode"
                                    name="referenceCode"
                                    value={props.values.referenceCode}
                                    onChange={(value) => { props.handleChange('referenceCode')(value) }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Title</Label>
                                  <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={props.values.title}
                                    onChange={(value) => { props.handleChange('title')(value) }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Email</Label>
                                  <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={props.values.email}
                                    onChange={(value) => { props.handleChange('email')(value) }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">First Name</Label>
                                  <Input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={props.values.firstName}
                                    onChange={(value) => { props.handleChange('firstName')(value) }}
                                    className={props.errors.firstName && props.touched.firstName ? "is-invalid" : ""}
                                    />
                                    {props.errors.firstName && props.touched.firstName && (
                                      <div className="invalid-feedback">{props.errors.firstName}</div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Middle Name</Label>
                                  <Input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={props.values.middleName}
                                    onChange={(value) => { props.handleChange('middleName')(value) }}
                                    className={props.errors.middleName && props.touched.middleName ? "is-invalid" : ""}
                                    />
                                    {props.errors.middleName && props.touched.middleName && (
                                      <div className="invalid-feedback">{props.errors.middleName}</div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Last Name</Label>
                                  <Input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={props.values.lastName}
                                    onChange={(value) => { props.handleChange('lastName')(value) }}
                                    className={props.errors.lastName && props.touched.lastName ? "is-invalid" : ""}
                                    />
                                    {props.errors.lastName && props.touched.lastName && (
                                      <div className="invalid-feedback">{props.errors.lastName}</div>
                                    )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Password</Label>
                                  <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={props.values.password}
                                    onChange={(value) => { props.handleChange('password')(value) }}
                                    className={props.errors.password && props.touched.password ? "is-invalid" : ""}
                                    />
                                    {props.errors.password && props.touched.password && (
                                      <div className="invalid-feedback">{props.errors.password}</div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Confirm Password</Label>
                                  <Input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={props.values.confirmPassword}
                                    onChange={(value) => { props.handleChange('confirmPassword')(value) }}
                                    className={props.errors.confirmPassword && props.touched.confirmPassword ? "is-invalid" : ""}
                                    />
                                    {props.errors.confirmPassword && props.touched.confirmPassword && (
                                      <div className="invalid-feedback">{props.errors.confirmPassword}</div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="date">Date Of Birth</Label>
                                  <DatePicker
                                    className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                    id="dob"
                                    name="dob"
                                    placeholderText="Enter Birth Date"
                                    selected={props.values.dob}
                                    value={props.values.dob}
                                    onChange={(value) => {
                                      props.handleChange("dob")(value)
                                    }}
                                  />
                                  {props.errors.dob && props.touched.dob && (
                                    <div className="invalid-feedback">{props.errors.dob}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <h4 className="mb-3 mt-3">Invoicing Details</h4>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="billingEmail">Billing Email</Label>
                                  <Input
                                    type="text"
                                    id="billingEmail"
                                    name="billingEmail"
                                    value={props.values.billingEmail}
                                    onChange={(value) => { props.handleChange("billingEmail")(value) }}
                                    className={
                                      props.errors.billingEmail && props.touched.billingEmail
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.billingEmail && props.touched.billingEmail && (
                                    <div className="invalid-feedback">{props.errors.billingEmail}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="contractPoNumber">Contract PO Number</Label>
                                  <Input
                                    type="text"
                                    id="contractPoNumber"
                                    name="contractPoNumber"

                                    onChange={(value) => { props.handleChange("contractPoNumber")(value) }}
                                    value={props.values.contractPoNumber}
                                    className={
                                      props.errors.contractPoNumber && props.touched.contractPoNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.contractPoNumber && props.touched.contractPoNumber && (
                                    <div className="invalid-feedback">{props.errors.contractPoNumber}</div>
                                  )}

                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="vatRegistrationNumber">Vat Registration Number</Label>
                                  <Input
                                    type="text"
                                    id="vatRegistrationNumber"
                                    name="vatRegistrationNumber"
                                    onChange={(value) => { props.handleChange("vatRegistrationNumber")(value) }}
                                    value={props.values.vatRegistrationNumber}
                                    className={
                                      props.errors.vatRegistrationNumber && props.touched.vatRegistrationNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.vatRegistrationNumber && props.touched.vatRegistrationNumber && (
                                    <div className="invalid-feedback">{props.errors.vatRegistrationNumber}</div>
                                  )}

                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="currencyCode">Currency Code</Label>
                                  <Select
                                    className="select-default-width"
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list) : []}
                                    value={props.values.currencyCode}
                                    onChange={option => props.handleChange('currencyCode')(option.value)}
                                    placeholder="Select Currency"
                                    id="currencyCode"
                                    name="currencyCode"
                                    className={
                                      props.errors.currencyCode && props.touched.currencyCode
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.currencyCode && props.touched.currencyCode && (
                                    <div className="invalid-feedback">{props.errors.currencyCode}</div>
                                  )}

                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                            <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                  <FormGroup>
                                    <Button type="button" name="button" color="danger" className="btn-square"
                                      onClick={this.deleteEmployee}
                                    >
                                      <i className="fa fa-trash"></i> Delete
                                    </Button>
                                  </FormGroup>
                                  <FormGroup className="text-right">
                                    <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                      <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
                                    <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/master/employee') }}>
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
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailEmployee)

