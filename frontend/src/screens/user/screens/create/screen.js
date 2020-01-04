
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
import ImagesUploader from 'react-images-uploader'
import DatePicker from 'react-datepicker'

import 'react-images-uploader/styles.css'
import 'react-images-uploader/font.css'
import 'react-datepicker/dist/react-datepicker.css'

import { Loader, ConfirmDeleteModal } from 'components'

import * as UserActions from '../../actions'
import * as UserCreateActions from './actions'

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import moment from 'moment'
import { Formik } from 'formik';
import * as Yup from "yup";


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    role_list: state.user.role_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    userCreateActions: bindActionCreators(UserCreateActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class CreateUser extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      createMore: false,
      initValue: {
        firstName: '',
        lastName: '',
        userEmail: '',
        password: '',
        dateOfBirth: '',
        isActive: 'Y',
        profileImageBinary: '',
        confirmPassword: '',
        role: ''
      },
    }
    this.initializeData = this.initializeData.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.userActions.getRoleList()
  }

  handleSubmit(data) {
    this.props.userCreateActions.createUser(data).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'New Employee Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
        } else {
          this.props.history.push('/admin/master/employee')
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  render() {

    const { role_list } = this.props;

    return (
      <div className="create-user-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-users" />
                        <span className="ml-2">Create User</span>
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
                          this.handleSubmit(values)
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
                          dateOfBirth: Yup.date()
                            .required('DOB is Required')
                        })}
                      >
                        {props => (

                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={2}>
                                <FormGroup className="mb-3 text-center">
                                  <ImagesUploader
                                    url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    optimisticPreviews
                                    multiple={false}
                                    onLoadEnd={(err) => {
                                      console.log(err)
                                      if (err) {
                                        console.error(err);
                                      }
                                    }}

                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={10}>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="select">First Name</Label>
                                      <Input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        onChange={(value) => { props.handleChange('firstName')(value) }}
                                        className={props.errors.firstName && props.touched.firstName ? "is-invalid" : ""}
                                      />
                                      {props.errors.firstName && props.touched.firstName && (
                                        <div className="invalid-feedback">{props.errors.firstName}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="select">Last Name</Label>
                                      <Input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        onChange={(value) => { props.handleChange('lastName')(value) }}
                                        className={props.errors.lastName && props.touched.lastName ? "is-invalid" : ""}
                                      />
                                      {props.errors.lastName && props.touched.lastName && (
                                        <div className="invalid-feedback">{props.errors.lastName}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="product_code">Email ID</Label>
                                      <Input
                                        type="text"
                                        id="product_code"
                                        name="product_code"
                                        placeholder="Enter Email ID"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="date">Date Of Birth</Label>
                                      <DatePicker
                                        className={`form-control ${props.errors.dateOfBirth && props.touched.dateOfBirth ? "is-invalid" : ""}`}
                                        id="dateOfBirth "
                                        name="dateOfBirth "
                                        placeholderText="Enter Birth Date"
                                        selected={props.values.dateOfBirth}
                                        onChange={(value) => {
                                          props.handleChange("dateOfBirth")(value)
                                        }}
                                      />
                                      {props.errors.dateOfBirth && props.touched.dateOfBirth && (
                                        <div className="invalid-feedback">{props.errors.dateOfBirth}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="role">Role</Label>
                                      <Select
                                        className="select-default-width"
                                        options={role_list  ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list ) : []}
                                        value={props.values.role}
                                        onChange={option => props.handleChange('role')(option.value)}
                                        placeholder="Select Role"
                                        id="role"
                                        name="role"
                                        className={
                                          props.errors.role && props.touched.role
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.role && props.touched.role && (
                                        <div className="invalid-feedback">{props.errors.role}</div>
                                      )}

                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="product_code">Status</Label>
                                      <div>
                                        <FormGroup check inline>
                                          <div className="custom-radio custom-control">
                                            <input
                                              className="custom-control-input"
                                              type="radio"
                                              id="inline-radio1"
                                              name="isActive"
                                              value="Y"
                                              onChange={option => props.handleChange('isActive')(option)}
                                               />
                                            <label className="custom-control-label" htmlFor="inline-radio1">Active</label>
                                          </div>
                                        </FormGroup>
                                        <FormGroup check inline>
                                          <div className="custom-radio custom-control">
                                            <input
                                              className="custom-control-input"
                                              type="radio"
                                              id="inline-radio2"
                                              name="isActive"
                                              value="N"
                                              onChange={option => props.handleChange('isActive')(option)}
                                              />
                                            <label className="custom-control-label" htmlFor="inline-radio2">Inactive</label>
                                          </div>
                                        </FormGroup>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="select">Password</Label>
                                      <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        onChange={(value) => { props.handleChange('password')(value) }}
                                        className={props.errors.password && props.touched.password ? "is-invalid" : ""}
                                      />
                                      {props.errors.password && props.touched.password && (
                                        <div className="invalid-feedback">{props.errors.password}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="select">Confirm Password</Label>
                                      <Input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onChange={(value) => { props.handleChange('confirmPassword')(value) }}
                                        className={props.errors.confirmPassword && props.touched.confirmPassword ? "is-invalid" : ""}
                                      />
                                      {props.errors.confirmPassword && props.touched.confirmPassword && (
                                        <div className="invalid-feedback">{props.errors.confirmPassword}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Create
                              </Button>
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-repeat"></i> Create and More
                              </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/settings/user') }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser)
