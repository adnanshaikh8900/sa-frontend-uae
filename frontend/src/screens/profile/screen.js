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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import Select from 'react-select'
// import ImagesUploader from 'react-images-uploader'
import { Loader, ConfirmDeleteModal, ImageUploader } from 'components'
import { selectOptionsFactory } from 'utils'


import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Formik } from 'formik';
import * as Yup from "yup";
import * as ProfileActions from './actions'
import {
  CommonActions
} from 'services/global'
import './style.scss'


import 'react-datepicker/dist/react-datepicker.css'
// import 'react-images-uploader/styles.css'
// import 'react-images-uploader/font.css'

import './style.scss'

const mapStateToProps = (state) => {
  console.log(state.profile.currency_list)
  return ({
    currency_list: state.profile.currency_list,
    country_list: state.profile.country_list,
    industry_type_list: state.profile.industry_type_list,
    company_type_list: state.profile.company_type_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    profileActions: bindActionCreators(ProfileActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)

  })
}

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      activeTab: new Array(2).fill('1'),
      userPhoto: [],
      companyLogo: [],
      initUserData: {},
      initCompanyData: {},
      companyId: '',
      imageState:'',
    }

    this.toggle = this.toggle.bind(this)
    this.getUserData = this.getUserData.bind(this)
    this.getCompanyData = this.getCompanyData.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.handleUserSubmit = this.handleUserSubmit.bind(this)

  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray
    })
    console.log(typeof tab)
    if (tab === '1') {
      this.state.userPhoto = []
      this.setState({loading: true})
      this.getUserData()
    } else {
      const { companyId } = this.state
      const id = companyId ? companyId : ''
      if (id) {
        this.state.companyLogo = []
        this.setState({loading: true})
        this.getCompanyData(id)
      }
    }
  }
  componentDidMount() {
    this.getUserData()
  }

  uploadImage(picture) {
    this.setState({
      userPhoto: picture,
      imageState: false
    });
  }

  getUserData() {
    const userId = localStorage.getItem('userId')
    this.props.profileActions.getUserById(userId).then(res => {
      // this.props.userActions.getRoleList();
      this.props.profileActions.getCurrencyList();
      this.props.profileActions.getCountryList();
      this.props.profileActions.getIndustryTypeList();
      this.props.profileActions.getCompanyTypeList();
      if (res.status === 200) {
        this.setState({
          initUserData: {
            firstName: res.data.firstName ? res.data.firstName : '',
            lastName: res.data.lastName ? res.data.lastName : '',
            email: res.data.email ? res.data.email : '',
            password: '',
            dob: res.data.dob ? res.data.dob : '',
            // active: res.data.active ? res.data.active : '',
            // confirmPassword: '',
            // roleId: res.data.roleId ? res.data.roleId : '',
            // companyId: res.data.companyId ? res.data.companyId : '',
          },
          loading: false,
          userPhoto: res.data.profilePicByteArray ? this.state.userPhoto.concat(res.data.profilePicByteArray) : [],
          companyId: res.data.companyId ? res.data.companyId : ''
          // selectedStatus: res.data.active ? true : false,
        },()=>{this.setState({imageState: this.state.userPhoto.length > 0 ? true : false})})
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  handleUserSubmit(data) {
    const {
      firstName,
      lastName,
      email,
      dob,
      password,
    } = data;
    const userId = localStorage.getItem('userId')
    const { userPhoto } = this.state;
    let formData = new FormData();
    formData.append("id", userId);

    formData.append("firstName", firstName ? firstName : '');
    formData.append("lastName", lastName ? lastName : '');
    formData.append("email", email ? email : '');
    formData.append("dob", dob ? (typeof dob === "string" ? moment(dob).toDate() : dob) : (''));
    formData.append("password", password ? password : '');
    if (password.length > 0) {
      formData.append("password ", password);
    }
    if (userPhoto.length > 0) {
      formData.append("profilePic", userPhoto[0]);
    }


    this.props.profileActions.updateUser(formData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'User Updated Successfully')
          this.props.history.push('/admin/profile')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  getCompanyData(id) {
    this.props.profileActions.getCompanyById(id).then(res => {
      if (res.status === 200) {
        this.setState({
          initCompanyData: {
            companyName: res.data.companyName ? res.data.companyName : '',
            companyRegistrationNumber: res.data.companyRegistrationNumber ? res.data.companyRegistrationNumber : '',
            vatRegistrationNumber: res.data.vatRegistrationNumber ? res.data.vatRegistrationNumber : '',
            companyTypeCode: res.data.companyTypeCode ? res.data.companyTypeCode : '',
            industryTypeCode: res.data.industryTypeCode ? res.data.industryTypeCode : '',
            phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : '',
            emailAddress: res.data.emailAddress ? res.data.emailAddress : '',
            website: res.data.website ? res.data.website : '',
            invoicingAddressLine1: res.data.invoicingAddressLine1 ? res.data.invoicingAddressLine1 : '',
            invoicingAddressLine2: res.data.invoicingAddressLine2 ? res.data.invoicingAddressLine2 : '',
            invoicingAddressLine3: res.data.invoicingAddressLine3 ? res.data.invoicingAddressLine3 : '',
            invoicingCity: res.data.invoicingCity ? res.data.invoicingCity : '',
            invoicingStateRegion: res.data.invoicingStateRegion ? res.data.invoicingStateRegion : '',
            invoicingPostZipCode: res.data.invoicingPostZipCode ? res.data.invoicingPostZipCode : '',
            invoicingPoBoxNumber: res.data.invoicingPoBoxNumber ? res.data.invoicingPoBoxNumber : '',
            invoicingCountryCode: res.data.invoicingCountryCode ? res.data.invoicingCountryCode : '',
            currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
            companyAddressLine1: res.data.companyAddressLine1 ? res.data.companyAddressLine1 : '',
            companyAddressLine2: res.data.companyAddressLine2 ? res.data.companyAddressLine2 : '',
            companyAddressLine3: res.data.companyAddressLine3 ? res.data.companyAddressLine3 : '',
            companyCity: res.data.companyCity ? res.data.companyCity : '',
            companyStateRegion: res.data.companyStateRegion ? res.data.companyStateRegion : '',
            companyPostZipCode: res.data.companyPostZipCode ? res.data.companyPostZipCode : '',
            companyPoBoxNumber: res.data.companyPoBoxNumber ? res.data.companyPoBoxNumber : '',
            companyCountryCode: res.data.companyCountryCode ? res.data.companyCountryCode : '',
            companyExpenseBudget: res.data.companyExpenseBudget ? res.data.companyExpenseBudget : '',
            companyRevenueBudget: res.data.companyRevenueBudget ? res.data.companyRevenueBudget : '',
            dateFormat: res.data.dateFormat ? res.data.dateFormat : '',

          },
          companyLogo: res.data.companyLogoByteArray ? this.state.companyLogo.concat(res.data.companyLogoByteArray) : [],

          loading: false
        })
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  render() {
    const { loading } = this.state
    const {currency_list,country_list,industry_type_list,company_type_list} = this.props
    return (
      <div className="profile-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user" />
                        <span className="ml-2">Profile</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        active={this.state.activeTab[0] === '1'}
                        onClick={() => { this.toggle(0, '1') }}
                      >
                        Account
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={this.state.activeTab[0] === '2'}
                        onClick={() => { this.toggle(0, '2') }}
                      >
                        Company Profile
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab[0]}>
                    <TabPane tabId="1">
                      <Row>
                        <Col lg={12}>
                          {loading ?
                            (
                              <Loader />
                            )
                            :
                            (
                              <Formik
                                initialValues={this.state.initUserData}
                                onSubmit={(values, { resetForm }) => {
                                  this.handleUserSubmit(values)
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
                                    // .required("Password is Required")
                                    // .min(8, "Password Too Short")
                                    .matches(
                                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                                    ),
                                  confirmPassword: Yup.string()
                                    // .required('Confirm Password is Required')
                                    .oneOf([Yup.ref("password"), null], "Passwords must match"),
                                  dob: Yup.date()
                                    .required('DOB is Required')
                                })}
                              >
                                {props => (
                                  <Form onSubmit={props.handleSubmit} enctype="multipart/form-data">
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
                                            maxFileSize={1048576}
                                            withPreview={true}
                                            singleImage={true}
                                            // withIcon={this.state.showIcon}
                                            withIcon={false}
                                            // buttonText="Choose Profile Image"
                                            flipHeight={this.state.userPhoto.length > 0 ? { height: "inherit" } : {}}
                                            label="'Max file size: 1mb"
                                            labelClass={this.state.userPhoto.length > 0 ? 'hideLabel' : 'showLabel'}
                                            buttonClassName={this.state.userPhoto.length > 0 ? 'hideButton' : 'showButton'}
                                            defaultImages={this.state.userPhoto}
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
                                                value={props.values.firstName}
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
                                                value={props.values.lastName}
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
                                                value={props.values.email}

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
                                                placeholderText="Enter Birth Date"
                                                // selected={props.values.dob}
                                                value={props.values.dob ? moment(props.values.dob).format('DD-MM-YYYY') : ''}

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
                                        {/* <Row>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="roleId">Role</Label>
                                          <Select
                                            className="select-default-width"
                                            options={role_list ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list , 'Role') : []}
                                            value={props.values.roleId}
                                            onChange={option => props.handleChange('roleId')(option.value)}
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
                                        <FormGroup>
                                          <Label htmlFor="companyId">Company</Label>
                                          <Select
                                            className="select-default-width"
                                            options={role_list ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list , 'Role') : []}
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
                                      </Col>
                                    </Row> */}
                                        {/* <Row>
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
                                                  checked={this.state.selectedStatus}
                                                  value={true}
                                                  onChange={e => {
                                                    console.log(e.target.value)
                                                    if(e.target.value) {
                                                      this.setState({selectedStatus: true},()=>{
                                                        console.log(this.state)
                                                      })
                                                    }
                                                  }}
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
                                                  checked={!this.state.selectedStatus}
                                                  onChange={e => {
                                                    console.log(e.target.value);
                                                    console.log(typeof e.target.value)
                                                    if(e.target.value === 'false') {
                                                      console.log(e.target.value)
                                                      this.setState({selectedStatus: false})
                                                    }
                                                  }}
                                                />
                                                <label className="custom-control-label" htmlFor="inline-radio2">Inactive</label>
                                              </div>
                                            </FormGroup>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                    </Row> */}
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
                                      <Col lg={12} className="mt-5 d-flex flex-wrap align-items-center  justify-content-end">
                                        <FormGroup className="text-right">
                                          <Button type="submit" color="primary" className="btn-square mr-3">
                                            <i className="fa fa-dot-circle-o"></i> Update
                                      </Button>
                                          <Button color="secondary" className="btn-square"
                                            onClick={() => { this.props.history.push('/admin/expense/supplier-invoice') }}>
                                            <i className="fa fa-ban"></i> Cancel
                                      </Button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Form>
                                )}
                              </Formik>
                            )
                          }
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      {
                        loading ?
                          <Loader></Loader> :
                          <Row>
                            <Col lg='12'>
                              {console.log(this.props)}
                              <Formik
                                initialValues={this.state.initCompanyData}
                                onSubmit={(values, { resetForm }) => {
                                  this.handleSubmit(values)
                                  // resetForm(this.state.initValue)

                                  // this.setState({
                                  //   selectedContactCurrency: null,
                                  //   selectedCurrency: null,
                                  //   selectedInvoiceLanguage: null
                                  // })
                                }}
                              // validationSchema={Yup.object().shape({
                              //   firstName: Yup.()
                              //     .required("First Name is Required"),
                              //   lastName: Yup.()
                              //     .required("Last Name is Required"),
                              // })}
                              >
                                {props => (

                                  <Form>
                                    <h5 className="mt-3 mb-3">Company Detail</h5>
                                    <Row>
                                      <Col lg={2}>
                                        <FormGroup className="mb-3 text-center">
                                          {/* <ImagesUploader
                                    url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    optimisticPreviews
                                    multiple={false}
                                    onLoadEnd={(err) => {
                                      if (err) {
                                        console.error(err);
                                      }
                                    }}
                                  /> */}
                                          <ImageUploader
                                            // withIcon={true}
                                            buttonText='Choose images'
                                            // onChange={this.uploadImage}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={1048576}
                                            withPreview={true}
                                            singleImage={true}
                                            // withIcon={this.state.showIcon}
                                            withIcon={false}
                                            // buttonText="Choose Profile Image"
                                            flipHeight={this.state.companyLogo.length > 0 ? { height: "inherit" } : {}}
                                            label="'Max file size: 1mb"
                                            labelClass={this.state.companyLogo.length > 0 ? 'hideLabel' : 'showLabel'}
                                            buttonClassName={this.state.companyLogo.length > 0 ? 'hideButton' : 'showButton'}
                                            defaultImages={this.state.companyLogo}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={10}>
                                        <Row>
                                          <Col lg={4}>
                                            <FormGroup className="mb-3">
                                              <Label htmlFor="product_code">Company Name</Label>
                                              <Input
                                                type="text"
                                                id="companyName"
                                                name="companyName"
                                                placeholder="Enter Company Name"
                                                value={props.values.companyName}
                                                onChange={value => props.handleChange('companyName')(value)}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col lg={4}>
                                            <FormGroup className="mb-3">
                                              <Label htmlFor="product_code">Company Registration No</Label>
                                              <Input
                                                type="text"
                                                id="companyRegistrationNumber"
                                                name="companyRegistrationNumber"
                                                placeholder="Enter Company Registration No"
                                                value={props.values.companyRegistrationNumber}
                                                onChange={value => props.handleChange('companyRegistrationNumber')(value)}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col lg={4}>
                                            <FormGroup className="mb-3">
                                              <Label htmlFor="product_code">VAT Registration No</Label>
                                              <Input
                                                type="text"
                                                id="vatRegistrationNumber"
                                                name="vatRegistrationNumber"
                                                placeholder="Enter VAT Registration No"
                                                value={props.values.vatRegistrationNumber}
                                                onChange={value => props.handleChange('vatRegistrationNumber')(value)}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col lg={4}>
                                            <FormGroup>
                                              <Label htmlFor="companyId">Company Type Code</Label>
                                              <Select
                                                className="select-default-width"
                                                options={company_type_list ? selectOptionsFactory.renderOptions('label', 'value', company_type_list, 'Company Type Code') : []}
                                                value={props.values.companyTypeCode}
                                                onChange={option => props.handleChange('companyTypeCode')(option.value)}
                                                placeholder="Select Company"
                                                id="companyTypeCode"
                                                name="companyTypeCode"
                                                className={
                                                  props.errors.companyTypeCode && props.touched.companyTypeCode
                                                    ? "is-invalid"
                                                    : ""
                                                }
                                              />
                                              {props.errors.companyTypeCode && props.touched.companyTypeCode && (
                                                <div className="invalid-feedback">{props.errors.companyTypeCode}</div>
                                              )}

                                            </FormGroup>
                                          </Col>
                                          <Col lg={4}>
                                            <FormGroup>
                                              <Label htmlFor="industryTypeCode">Industry Type Code</Label>
                                              <Select
                                                className="select-default-width"
                                                options={industry_type_list ? selectOptionsFactory.renderOptions('label', 'value', industry_type_list, 'Industry Type') : []}
                                                value={props.values.industryTypeCode}
                                                onChange={option => props.handleChange('industryTypeCode')(option.value)}
                                                placeholder="Select Industry Type Code"
                                                id="industryTypeCode"
                                                name="industryTypeCode"
                                                className={
                                                  props.errors.industryTypeCode && props.touched.industryTypeCode
                                                    ? "is-invalid"
                                                    : ""
                                                }
                                              />
                                              {props.errors.industryTypeCode && props.touched.industryTypeCode && (
                                                <div className="invalid-feedback">{props.errors.industryTypeCode}</div>
                                              )}

                                            </FormGroup>
                                          </Col>
                                          <Col lg={4}>
                                            <FormGroup>
                                              <Label htmlFor="currencyCode">Currency Code</Label>
                                              <Select
                                                className="select-default-width"
                                                options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                                value={props.values.currencyCode}
                                                onChange={option => {
                                                  props.handleChange('currencyCode')(option)
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
                                          <Col lg={4}>
                                            <FormGroup className="mb-3">
                                              <Label htmlFor="product_code">Website</Label>
                                              <Input
                                                type="text"
                                                id="website"
                                                name="website"
                                                placeholder="Enter Website"
                                                value={props.values.website}
                                                onChange={option => {
                                                  props.handleChange('website')(option)
                                                }}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col lg={4}>
                                            <FormGroup className="mb-3">
                                              <Label htmlFor="product_code">Email Address</Label>
                                              <Input
                                                type="text"
                                                id="emailAddress"
                                                name="emailAddress"
                                                placeholder="Enter Email"
                                                value={props.values.emailAddress}
                                                onChange={option => {
                                                  props.handleChange('emailAddress')(option)
                                                }}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col lg={4}>
                                            <FormGroup className="mb-3">
                                              <Label htmlFor="product_code">Phone Number</Label>
                                              <Input
                                                type="text"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="Enter Phone Number"
                                                value={props.values.phoneNumber}
                                                onChange={option => {
                                                  props.handleChange('phoneNumber')(option)
                                                }}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>

                                    <h5 className="mt-3 mb-3">Company Cost</h5>
                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Expense Budget</Label>
                                          <Input
                                            type="text"
                                            id="companyExpenseBudget"
                                            name="companyExpenseBudget"
                                            placeholder="Enter Expense Budget"
                                            value={props.values.companyExpenseBudget}
                                            onChange={option => {
                                              props.handleChange('companyExpenseBudget')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Revenue Budget</Label>
                                          <Input
                                            type="text"
                                            id="companyRevenueBudget"
                                            name="companyRevenueBudget"
                                            placeholder="Enter Revenue Budget"
                                            value={props.values.companyRevenueBudget}
                                            onChange={option => {
                                              props.handleChange('companyRevenueBudget')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>

                                    <h5 className="mt-3 mb-3">Invoicing Address</h5>
                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Invoicing Address Line1</Label>
                                          <Input
                                            type="textarea"
                                            id="invoicingAddressLine1"
                                            name="invoicingAddressLine1"
                                            placeholder="Enter Invoicing Address Line1"
                                            rows="5"
                                            value={props.values.invoicingAddressLine1}
                                            onChange={option => {
                                              props.handleChange('invoicingAddressLine1')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Invoicing Address Line1</Label>
                                          <Input
                                            type="textarea"
                                            id="categoryDiscription"
                                            name="categoryDiscription"
                                            placeholder="Enter Invoicing Address Line2"
                                            rows="5"
                                            value={props.values.invoicingAddressLine2}
                                            onChange={option => {
                                              props.handleChange('invoicingAddressLine2')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Invoicing Address Line3</Label>
                                          <Input
                                            type="textarea"
                                            id="categoryDiscription"
                                            name="categoryDiscription"
                                            placeholder="Enter Invoicing Address Line3"
                                            rows="5"
                                            value={props.values.invoicingAddressLine3}
                                            onChange={option => {
                                              props.handleChange('invoicingAddressLine3')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">City</Label>
                                          <Input
                                            type="text"
                                            id="invoicingCity"
                                            name="invoicingCity"
                                            placeholder="Enter City"
                                            value={props.values.invoicingCity}
                                            onChange={option => {
                                              props.handleChange('invoicingCity')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">State Region</Label>
                                          <Input
                                            type="text"
                                            id="invoicingStateRegion"
                                            name="invoicingStateRegion"
                                            placeholder="Enter State Region"
                                            value={props.values.invoicingStateRegion}
                                            onChange={option => {
                                              props.handleChange('invoicingStateRegion')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup>
                                          <Label htmlFor="invoicingCountryCode">Country Code</Label>
                                          <Select
                                            className="select-default-width"
                                            options={country_list ? selectOptionsFactory.renderOptions('countryName', 'countryCode', country_list, 'Country') : []}
                                            value={props.values.invoicingCountryCode}
                                            onChange={option => {
                                              props.handleChange('invoicingCountryCode')(option)
                                            }}
                                            placeholder="Select Currency"
                                            id="invoicingCountryCode"
                                            name="invoicingCountryCode"
                                            className={
                                              props.errors.invoicingCountryCode && props.touched.invoicingCountryCode
                                                ? "is-invalid"
                                                : ""
                                            }
                                          />
                                          {props.errors.invoicingCountryCode && props.touched.invoicingCountryCode && (
                                            <div className="invalid-feedback">{props.errors.invoicingCountryCode}</div>
                                          )}

                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="invoicingPoBoxNumber">PO Box No</Label>
                                          <Input
                                            type="text"
                                            id="invoicingPoBoxNumber"
                                            name="invoicingPoBoxNumber"
                                            placeholder="Enter PO Box No"
                                            value={props.values.invoicingPoBoxNumber}
                                            onChange={option => {
                                              props.handleChange('invoicingPoBoxNumber')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="invoicingPostZipCode">Post Zip Code</Label>
                                          <Input
                                            type="text"
                                            id="invoicingPostZipCode"
                                            name="invoicingPostZipCode"
                                            placeholder="Enter Post Zip Code"
                                            value={props.values.invoicingPostZipCode}
                                            onChange={option => {
                                              props.handleChange('invoicingPostZipCode')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="dateFormat">Date Format</Label>
                                          <Input
                                            type="text"
                                            id="dateFormat"
                                            name="dateFormat"
                                            placeholder="Enter Date Format"
                                            value={props.values.dateFormat}
                                            onChange={option => {
                                              props.handleChange('dateFormat')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>


                                    <h5 className="mt-3 mb-3">Company Address</h5>
                                    <Row>
                                      <Col lg={12}>
                                        <FormGroup check inline className="mb-3">
                                          <div className="custom-checkbox custom-control">
                                            <input
                                              className="custom-control-input"
                                              type="checkbox"
                                              id="inline-radio1"
                                              name="SMTP-auth"
                                            />
                                            <label className="custom-control-label" htmlFor="inline-radio1">
                                              Company Address is same as Invoicing Address
                                    </label>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Company Address Line1</Label>
                                          <Input
                                            type="textarea"
                                            id="companyAddressLine1"
                                            name="companyAddressLine1"
                                            placeholder="Enter Company Address Line1"
                                            rows="5"
                                            value={props.values.companyAddressLine1}
                                            onChange={option => {
                                              props.handleChange('companyAddressLine1')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Company Address Line1</Label>
                                          <Input
                                            type="textarea"
                                            id="categoryDiscription"
                                            name="categoryDiscription"
                                            placeholder="Enter Company Address Line2"
                                            rows="5"
                                            value={props.values.invoicingAddressLine2}
                                            onChange={option => {
                                              props.handleChange('invoicingAddressLine2')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">Company Address Line3</Label>
                                          <Input
                                            type="textarea"
                                            id="categoryDiscription"
                                            name="categoryDiscription"
                                            placeholder="Enter Company Address Line3"
                                            rows="5"
                                            value={props.values.companyAddressLine3}
                                            onChange={option => {
                                              props.handleChange('companyAddressLine3')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">City</Label>
                                          <Input
                                            type="text"
                                            id="companyCity"
                                            name="companyCity"
                                            placeholder="Enter City"
                                            value={props.values.companyCity}
                                            onChange={option => {
                                              props.handleChange('companyCity')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="product_code">State Region</Label>
                                          <Input
                                            type="text"
                                            id="companyStateRegion"
                                            name="companyStateRegion"
                                            placeholder="Enter State Region"
                                            value={props.values.companyStateRegion}
                                            onChange={option => {
                                              props.handleChange('companyStateRegion')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                      <FormGroup>
                                              <Label htmlFor="companyCountryCode">Country Code</Label>
                                              <Select
                                                className="select-default-width"
                                                options={country_list ? selectOptionsFactory.renderOptions('countryName', 'countryCode', country_list, 'Country') : []}
                                                value={props.values.companyCountryCode}
                                                onChange={option => {
                                                  props.handleChange('companyCountryCode')(option)
                                                }}
                                                placeholder="Select Currency"
                                                id="companyCountryCode"
                                                name="companyCountryCode"
                                                className={
                                                  props.errors.companyCountryCode && props.touched.companyCountryCode
                                                    ? "is-invalid"
                                                    : ""
                                                }
                                              />
                                              {props.errors.companyCountryCode && props.touched.companyCountryCode && (
                                                <div className="invalid-feedback">{props.errors.companyCountryCode}</div>
                                              )}

                                            </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="companyPoBoxNumber">PO Box No</Label>
                                          <Input
                                            type="text"
                                            id="companyPoBoxNumber"
                                            name="companyPoBoxNumber"
                                            placeholder="Enter PO Box No"
                                            value={props.values.companyPoBoxNumber}
                                            onChange={option => {
                                              props.handleChange('companyPoBoxNumber')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={4}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="companyPostZipCode">Post Zip Code</Label>
                                          <Input
                                            type="text"
                                            id="companyPostZipCode"
                                            name="companyPostZipCode"
                                            placeholder="Enter Post Zip Code"
                                            value={props.values.companyPostZipCode}
                                            onChange={option => {
                                              props.handleChange('companyPostZipCode')(option)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col lg={12} className="mt-5">
                                        <FormGroup className="text-right">
                                          <Button type="submit" color="primary" className="btn-square mr-3">
                                            <i className="fa fa-dot-circle-o"></i> Save
                                  </Button>
                                          <Button color="secondary" className="btn-square"
                                            onClick={() => { this.props.history.push('/admin/master/user') }}>
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
                      }
                    </TabPane>
                  </TabContent>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)