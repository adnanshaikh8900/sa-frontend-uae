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
  Label,
  FormText
} from 'reactstrap'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as EmployeeActions from '../../actions';
import * as EmployeeCreateActions from './actions';

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
    employeeCreateActions: bindActionCreators(EmployeeCreateActions, dispatch)

  })
}

class CreateEmployee extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      createMore: false,
      initValue: {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        referenceCode: '',
        title: '',
        billingEmail: '',
        vatRegestationNo: '',
        currencyCode: '',
        poBoxNumber: '',
      },
    }

    // this.changeBirthday = this.changeBirthday.bind(this)
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

  handleSubmit(data, resetForm) {
    this.props.employeeCreateActions.createEmployee(data).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'New Employee Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm()
        } else {
          this.props.history.push('/admin/master/employee')
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }
  render() {

    const { currency_list } = this.props
    return (
      <div className="create-employee-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user-tie" />
                        <span className="ml-2">Create Employee</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={this.state.initValue}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values, resetForm)
                          // resetForm(this.state.initValue)

                          // this.setState({
                          //   selectedContactCurrency: null,
                          //   selectedCurrency: null,
                          //   selectedInvoiceLanguage: null
                          // })
                        }}
                        validationSchema={Yup.object().shape({
                          firstName: Yup.string()
                            .required("First Name is Required"),
                          lastName: Yup.string()
                            .required("Last Name is Required"),
                          middleName: Yup.string()
                            .required("Middle Name is Required"),
                          email: Yup.string().email("Valid Email Required"),
                          billingEmail: Yup.string().email("Valid Email Required"),
                          password: Yup.string()
                            .required("Password is Required")
                            // .min(8, "Password Too Short")
                            .matches(
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
                                  <Label htmlFor="select"><span className="text-danger">*</span>Email</Label>
                                  <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={props.values.email}
                                    onChange={(value) => { props.handleChange('email')(value) }}
                                    className={props.errors.email && props.touched.email ? "is-invalid" : ""}
                                  />
                                  {props.errors.email && props.touched.email && (
                                    <div className="invalid-feedback">{props.errors.email}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>First Name</Label>
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
                                  <Label htmlFor="select"><span className="text-danger">*</span>Middle Name</Label>
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
                                  <Label htmlFor="select"><span className="text-danger">*</span>Last Name</Label>
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
                                  <Label htmlFor="select"><span className="text-danger">*</span>Password</Label>
                                  <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={props.values.password}
                                    onChange={(value) => { props.handleChange('password')(value) }}
                                    className={props.errors.password && props.touched.password ? "is-invalid" : ""}
                                  />
                                  {!props.errors.password ?
                                    (
                                      <FormText style={{ color: '#20a8d8', fontSize: '14px' }}>hint: Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character</FormText>
                                    ) : null}
                                  {props.errors.password && props.touched.password && (
                                    <div className="invalid-feedback">{props.errors.password}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>Confirm Password</Label>
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
                                  <Label htmlFor="date"><span className="text-danger">*</span>Date Of Birth</Label>
                                  <DatePicker
                                    className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                    id="dob"
                                    name="dob"
                                    placeholderText="Enter Birth Date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
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

                                    onChange={(value) => { props.handleChange("billingEmail")(value) }}
                                    value={props.values.billingEmail}
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
                                  <Label htmlFor="poBoxNumber">Contract PO Number</Label>
                                  <Input
                                    type="text"
                                    id="poBoxNumber"
                                    name="poBoxNumber"

                                    onChange={(value) => { props.handleChange("poBoxNumber")(value) }}
                                    value={props.values.poBoxNumber}
                                    className={
                                      props.errors.poBoxNumber && props.touched.poBoxNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.poBoxNumber && props.touched.poBoxNumber && (
                                    <div className="invalid-feedback">{props.errors.poBoxNumber}</div>
                                  )}

                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="vatRegestationNo">Tax Registration Number</Label>
                                  <Input
                                    type="text"
                                    id="vatRegestationNo"
                                    name="vatRegestationNo"

                                    onChange={(value) => { props.handleChange("vatRegestationNo")(value) }}
                                    value={props.values.vatRegestationNo}
                                    className={
                                      props.errors.vatRegestationNo && props.touched.vatRegestationNo
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.vatRegestationNo && props.touched.vatRegestationNo && (
                                    <div className="invalid-feedback">{props.errors.vatRegestationNo}</div>
                                  )}

                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="currencyCode">Currency Code</Label>
                                  <Select
                                    className="select-default-width"
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                    value={props.values.currencyCode}
                                    onChange={option => {
                                      if (option && option.value) {
                                        props.handleChange('currencyCode')(option.value)
                                      } else {
                                        props.handleChange('currencyCode')('')
                                      }
                                    }}
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
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                    this.setState({ createMore: false }, () => {
                                      props.handleSubmit()
                                    })
                                  }}>
                                    <i className="fa fa-dot-circle-o"></i> Create
                                      </Button>
                                  <Button name="button" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ createMore: true }, () => {
                                        props.handleSubmit()
                                      })
                                    }}>
                                    <i className="fa fa-refresh"></i> Create and More
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployee)

