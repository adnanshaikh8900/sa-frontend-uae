
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
// import ImageUploader from 'react-images-upload'
import DatePicker from 'react-datepicker'

// import 'react-images-upload/styles.css'
// import 'react-images-upload/font.css'
import 'react-datepicker/dist/react-datepicker.css'

import { Loader, ConfirmDeleteModal , ImageUploader } from 'components'

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
    company_type_list: state.user.company_type_list
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
        email: '',
        password: '',
        dob: '',
        active: false,
        confirmPassword: '',
        roleId: ''
      },
      userPhoto: [],
      userPhotoFile: [],
      showIcon: false
    }
    this.uploadImage = this.uploadImage.bind(this);
    this.initializeData = this.initializeData.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.userActions.getRoleList()
    this.props.userActions.getCompanyTypeList()
    this.setState({showIcon: false})
  }

  uploadImage(picture,file) {
    this.setState({
      userPhoto: picture,
      userPhotoFile: file
    });
  }

  handleSubmit(data,resetForm) {
    const {
      firstName,
      lastName,
      email,
      dob,
      password,
      roleId,
      companyId,
      active,
    } = data;
    const { userPhoto } = this.state;
    let formData = new FormData();
    formData.append("firstName", firstName ? firstName : '');
    formData.append("lastName", lastName ? lastName : '');
    formData.append("email", email ? email : '');
    formData.append("dob", dob ? dob : '');
    formData.append("roleId", roleId ? roleId : '');
    formData.append("active", active ? active : '');
    formData.append("password", password ? password : '');
    formData.append("companyId", companyId ? companyId : '');
    if (this.state.userPhotoFile.length > 0) {
      formData.append("profilePic ", this.state.userPhotoFile[0]);
    }


    this.props.userCreateActions.createUser(formData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'New User Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm()
        } else {
          this.props.history.push('/admin/settings/user')
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  render() {

    const { role_list , company_type_list} = this.props;

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
                          this.handleSubmit(values,resetForm)
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
                          dob: Yup.date()
                            .required('DOB is Required')
                        })}
                      >
                        {props => (

                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col xs="4" md="4" lg={2}>
                                <FormGroup className="mb-3 text-center">
                                  {/* <ImagesUploader
                                    // url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    optimisticPreviews
                                    multiple={false}
                                    onLoadEnd={(err) => {
                                      console.log(err)
                                      if (err) {
                                        console.error(err);
                                      }
                                    }}
                                    onChange={(e)=>{console.log(e)}}
                                  /> */}
                                  <ImageUploader
                                    // withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.uploadImage}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={11048576}
                                    withPreview={true}
                                    singleImage={true}
                                    withIcon={this.state.showIcon}
                                    // buttonText="Choose Profile Image"
                                    flipHeight={this.state.userPhoto.length > 0 ? {height: "inherit"} : {}}
                                    label="'Max file size: 1mb"
                                    labelClass={this.state.userPhoto.length > 0 ? 'hideLabel' : 'showLabel'}
                                    buttonClassName={this.state.userPhoto.length > 0 ? 'hideButton' : 'showButton'}
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
                                      <Label htmlFor="email">Email ID</Label>
                                      <Input
                                        type="text"
                                        id="email"
                                        name="email"
                                        placeholder="Enter Email ID"
                                        onChange={(value) => {
                                          props.handleChange("email")(value)
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="date">Date Of Birth</Label>
                                      <DatePicker
                                        className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                        id="dob "
                                        name="dob "
                                        showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                        placeholderText="Enter Birth Date"
                                        selected={props.values.dob}
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
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="roleId">Role</Label>
                                      <Select
                                        className="select-default-width"
                                        options={role_list ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list , 'Role') : []}
                                        value={props.values.roleId}
                                        onChange={option => {
                                          if(option && option.value) {
                                            props.handleChange('roleId')(option.value)
                                          } else {
                                            props.handleChange('roleId')('')
                                          }
                                        }}
                                        placeholder="Select Role"
                                        id="roleId"
                                        name="roleId"
                                        className={
                                          props.errors.roleId && props.touched.roleId
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.roleId && props.touched.roleId && (
                                        <div className="invalid-feedback">{props.errors.roleId}</div>
                                      )}

                                    </FormGroup>
                                  </Col>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="active">Status</Label>
                                      <div>
                                        <FormGroup check inline>
                                          <div className="custom-radio custom-control">
                                            <input
                                              className="custom-control-input"
                                              type="radio"
                                              id="inline-radio1"
                                              name="active"
                                              value={true}
                                              onChange={option => props.handleChange('active')(option)}
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
                                              name="active"
                                              value={false}
                                              onChange={option => props.handleChange('active')(option)}
                                            />
                                            <label className="custom-control-label" htmlFor="inline-radio2">Inactive</label>
                                          </div>
                                        </FormGroup>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  {/* <Col lg={6}>
                                    <FormGroup>
                                      <Label htmlFor="companyId">Company</Label>
                                      <Select
                                        className="select-default-width"
                                        options={company_type_list ? selectOptionsFactory.renderOptions('label', 'value', company_type_list , 'Company') : []}
                                        value={props.values.companyId}
                                        onChange={option => props.handleChange('companyId')(option.value)}
                                        placeholder="Select Company"
                                        id="companyId"
                                        name="companyId"
                                        className={
                                          props.errors.companyId && props.touched.companyId
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.companyId && props.touched.companyId && (
                                        <div className="invalid-feedback">{props.errors.companyId}</div>
                                      )}

                                    </FormGroup>
                                  </Col> */}
                                </Row>
                                <Row>
                                
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
