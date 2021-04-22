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
} from 'reactstrap'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";
import { ImageUploader } from 'components';
import {
  CommonActions
} from 'services/global'
import {selectCurrencyFactory, selectOptionsFactory} from 'utils'
import * as EmployeeActions from '../../actions';
import * as EmployeeCreateActions from './actions';
import * as SalaryTemplateActions from '../../../salaryTemplate/actions'

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'
import PhoneInput from 'react-phone-number-input'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list,
    country_list: state.contact.country_list,
    state_list: state.contact.state_list,
    salary_role_dropdown: state.salarytemplate.salary_role_dropdown,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    employeeCreateActions: bindActionCreators(EmployeeCreateActions, dispatch),
    salaryTemplateActions: bindActionCreators(SalaryTemplateActions,dispatch),
  })
}
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		},
	}),
};
class CreateEmployeePayroll extends React.Component {

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
        countryId: '',
        permanentAddress:'',
        presentAddress:'',
        bloodGroup:'',
        mobileNumber:'',
        vatRegestationNo: '',
        currencyCode: '',
        poBoxNumber: '',
        employeeRole:'',
        stateId: '',
        gender:'',
        pincode: '',
        city: '',
      },
      userPhoto: [],
			userPhotoFile: [],
    }

    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;

    this.gender = [
			{ label: 'Male', value: 'Male' },
			{ label: 'Female', value: 'Female' }
		];

    this.bloodGroup = [
			{ label: 'O+', value: 'O+' },
			{ label: 'O-', value: 'O-' },
      { label: 'A+', value: 'A+' },
			{ label: 'A-', value: 'A-' },
      { label: 'B+', value: 'B+' },
			{ label: 'B-', value: 'B-' },
      { label: 'AB+', value: 'AB+' },
			{ label: 'AB-', value: 'AB-' },
    
		];
  }

  componentDidMount = () => {
    this.initializeData();
  };

  initializeData = () => {
    this.props.employeeActions.getCountryList();
    this.props.salaryTemplateActions.getSalaryRolesForDropdown();

  };

  handleSubmit = (data, resetForm) => {
    this.setState({ disabled: true });
		const {
      firstName,
      middleName,
      lastName,
      mobileNumber,
      email,
      presentAddress,
      countryId,
      stateId,
      city,
      pincode,
      salaryRoleId,
		} = data;

		const { gender } = this.state;
    const { bloodGroup } = this.state;
		const formData = new FormData();

   	formData.append(
			'firstName',
			firstName !== null ? firstName : '',
		);
    formData.append(
			'middleName',
			middleName !== null ? middleName : '',
		);
    formData.append(
			'lastName',
			lastName !== null ? lastName : '',
		);
    formData.append(
      'mobileNumber',
      mobileNumber !== null ? mobileNumber : '',
    );
    formData.append(
      'email',
      email != null ? email : '',
    )
    formData.append(
      'presentAddress',
      presentAddress != null ? presentAddress : '',
    )
    formData.append(
      'city',
      city != null ? city : '',
    )
    formData.append(
      'pincode',
      pincode != null ? pincode : '',
    )
    if (gender && gender.value) {
			formData.append('gender', gender.value);
		}
    if (bloodGroup && bloodGroup.value) {
			formData.append('bloodGroup', bloodGroup.value);
		}
    if (salaryRoleId && salaryRoleId.value) {
			formData.append('salaryRoleId', salaryRoleId.value);
		}
    if (countryId && countryId.value) {
			formData.append('countryId', countryId.value);
		}
    if (stateId && stateId.value) {
			formData.append('stateId', stateId.value);
		}
    
    this.props.employeeCreateActions
    .createEmployee(formData)
    .then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert(
          'success',
           'New Employee Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm(this.state.initValue)
        } else {
          this.props.history.push('/admin/master/employee')
        }
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

  getStateList = (countryCode) => {
		this.props.employeeActions.getStateList(countryCode);
	};

  render() {

    const { salary_role_dropdown,country_list,state_list } = this.props

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
                           resetForm(this.state.initValue)

                          // this.setState({
                          //   selectedContactCurrency: null,
                          //   selectedCurrency: null,
                          //   selectedInvoiceLanguage: null
                          // })
                        }}
                        // validationSchema={Yup.object().shape({
                        //   firstName: Yup.string()
                        //     .required("First Name is Required"),
                        //   lastName: Yup.string()
                        //     .required("Last Name is Required"),
                        //   middleName: Yup.string()
                        //     .required("Middle Name is Required"),
                        //   email: Yup.string().email("Valid Email Required"),
                        //   billingEmail: Yup.string().email("Valid Email Required"),
                        //   password: Yup.string()
                        //     .required("Password is Required")
                        //     // .min(8, "Password Too Short")
                        //     .matches(
                        //       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                        //       "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                        //     ),
                        //   confirmPassword: Yup.string()
                        //     .required('Confirm Password is Required')
                        //     .oneOf([Yup.ref("password"), null], "Passwords must match"),
                        //   dob: Yup.date()
                        //     .required('DOB is Required')
                        // })}
                      >
                        {(props) => (

                          <Form  onSubmit={(values, { resetForm }) => {
                            this.handleSubmit(values, resetForm)
                            resetForm(this.state.initValue)
  
                          }}>
                            <h4 className="mb-4">Basic Details</h4>
                       <Row>
                           <Col xs="4" md="4" lg={2}>
																<FormGroup className="mb-3 text-center">
																	<ImageUploader
																		// withIcon={true}
																		buttonText="Choose images"
																		onChange={this.uploadImage}
																		imgExtension={['jpg', 'gif', 'png', 'jpeg']}
																		maxFileSize={11048576}
																		withPreview={true}
																		singleImage={true}
																		withIcon={this.state.showIcon}
																		// buttonText="Choose Profile Image"
																		flipHeight={
																			this.state.userPhoto.length > 0
																				? { height: 'inherit' }
																				: {}
																		}
																		label="'Max file size: 1mb"
																		labelClass={
																			this.state.userPhoto.length > 0
																				? 'hideLabel'
																				: 'showLabel'
																		}
																		buttonClassName={
																			this.state.userPhoto.length > 0
																				? 'hideButton'
																				: 'showButton'
																		}
																	/>
																</FormGroup>
															</Col>
                           <Col lg={10}>
                            <Row  className="row-wrapper">
                              
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>First Name</Label>
                                  <Input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={props.values.firstName}
                                    placeholder="Enter First Name"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('firstName')(option) }
                                    }}
                                    className={props.errors.firstName && props.touched.firstName ? "is-invalid" : ""}
                                  />
                                  {props.errors.firstName && props.touched.firstName && (
                                    <div className="invalid-feedback">{props.errors.firstName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>Middle Name</Label>
                                  <Input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={props.values.middleName}
                                    placeholder="Enter Middle Name"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('middleName')(option) }
                                    }}
                                    className={props.errors.middleName && props.touched.middleName ? "is-invalid" : ""}
                                  />
                                  {props.errors.middleName && props.touched.middleName && (
                                    <div className="invalid-feedback">{props.errors.middleName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>Last Name</Label>
                                  <Input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={props.values.lastName}
                                    placeholder="Enter Last Name"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('lastName')(option) }
                                    }}
                                    className={props.errors.lastName && props.touched.lastName ? "is-invalid" : ""}
                                  />
                                  {props.errors.lastName && props.touched.lastName && (
                                    <div className="invalid-feedback">{props.errors.lastName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                             
                            </Row>
                          
                            <Row  >
                            <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Employee Role </Label>
                                  <Select
																		styles={customStyles}
																		options={
                                      salary_role_dropdown
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
                                            salary_role_dropdown,
																						'SalaryRole',
																				  )
																				: []
																		}
																		id="salaryRoleId"
																		name="salaryRoleId"
																		placeholder="Select salary Role "
																		value={this.state.salaryDesignation}
                                    onChange={(value) => {
																			props.handleChange('salaryRoleId')(value);
																	
																		}}
																		className={`${
																			props.errors.salaryRoleId && props.touched.salaryRoleId
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.salaryRoleId && props.touched.salaryRoleId && (
																		<div className="invalid-feedback">
																			{props.errors.salaryRoleId}
																		</div>
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
                                    placeholderText="Select Date of Birth"
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

                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="gender">Gender</Label>
                                  <Select
																		styles={customStyles}
																		options={
																			this.gender
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						this.gender,
																						'Terms',
																				  )
																				: []
																		}
																		id="gender"
																		name="gender"
																		placeholder="Select Gender "
																		value={this.state.gender}
                                    onChange={(value) => {
																			props.handleChange('gender')(value);
																	
																		}}
																		className={`${
																			props.errors.gender && props.touched.gender
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.gender && props.touched.gender && (
																		<div className="invalid-feedback">
																			{props.errors.gender}
																		</div>
																	)}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="bloodGroup">Blood group</Label>
                                  <Select
																		styles={customStyles}
																		options={
																			this.bloodGroup
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						this.bloodGroup,
																						'Terms',
																				  )
																				: []
																		}
																		id="bloodGroup"
																		name="bloodGroup"
																		placeholder="Select Blood Group "
																		value={this.state.bloodGroup}
                                    onChange={(value) => {
																			props.handleChange('bloodGroup')(value);
																	
																		}}
																		className={`${
																			props.errors.bloodGroup && props.touched.bloodGroup
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.bloodGroup && props.touched.bloodGroup && (
																		<div className="invalid-feedback">
																			{props.errors.bloodGroup}
																		</div>
																	)}

                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="row-wrapper">
                            <Col md="4">
																<FormGroup>
																	<Label htmlFor="mobileNumber">
																		<span className="text-danger">*</span>Mobile
																		Number
																	</Label>
																	<PhoneInput
																		id="mobileNumber"
																		name="mobileNumber"
																		defaultCountry="AE"
																		international
																		value={props.values.mobileNumber}
																		placeholder="Enter Mobile Number"
																		onBlur={props.handleBlur('mobileNumber')}
																		onChange={(option) => {
																			props.handleChange('mobileNumber')(
																				option,
																			);
																		}}
																		className={
																			props.errors.mobileNumber &&
																			props.touched.mobileNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.mobileNumber &&
																		props.touched.mobileNumber && (
																			<div className="invalid-feedback">
																				{props.errors.mobileNumber}
																			</div>
																		)}
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
                                    placeholder="Enter Email Address"
                                    onChange={(value) => { props.handleChange('email')(value) }}
                                    className={props.errors.email && props.touched.email ? "is-invalid" : ""}
                                  />
                                  {props.errors.email && props.touched.email && (
                                    <div className="invalid-feedback">{props.errors.email}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <Row className="row-wrapper">
                              <Col md="8">
                                <FormGroup>
                                  <Label htmlFor="gender">Present Address </Label>
                                  <Input
                                    type="text"
                                    id="presentAddress"
                                    name="presentAddress"
                                    placeholder="Enter Present Address "
                                    onChange={(value) => { props.handleChange("presentAddress")(value) }}
                                    value={props.values.presentAddress}
                                    className={
                                      props.errors.presentAddress && props.touched.presentAddress
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.presentAddress && props.touched.presentAddress && (
                                    <div className="invalid-feedback">{props.errors.presentAddress}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              {/* <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="gender">Permanent Address </Label>
                                  <Input
                                    type="text"
                                    id="permanentAddress"
                                    name="permanentAddress"
                                    placeholder="Enter Permanent Address "
                                    onChange={(value) => { props.handleChange("permanentAddress")(value) }}
                                    value={props.values.permanentAddress}
                                    className={
                                      props.errors.permanentAddress && props.touched.permanentAddress
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.permanentAddress && props.touched.permanentAddress && (
                                    <div className="invalid-feedback">{props.errors.permanentAddress}</div>
                                  )}
                                </FormGroup>
                              </Col> */}
                            </Row>
                            <Row className="row-wrapper">
                            <Col md="4">
																<FormGroup>
																	<Label htmlFor="countryId">Country</Label>
																	<Select
																		options={
																			country_list
																				? selectOptionsFactory.renderOptions(
																						'countryName',
																						'countryCode',
																						country_list,
																						'Country',
																				  )
																				: []
																		}
																		value={props.values.countryId}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('countryId')(option);
																				this.getStateList(option.value);
																			} else {
																				props.handleChange('countryId')('');
																				this.getStateList('');
																			}
																			props.handleChange('stateId')({
																				label: 'Select State',
																				value: '',
																			});
																		}}
																		placeholder="Select Country"
																		id="countryId"
																		name="countryId"
																		className={
																			props.errors.countryId &&
																			props.touched.countryId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.countryId &&
																		props.touched.countryId && (
																			<div className="invalid-feedback">
																				{props.errors.countryId}
																			</div>
																		)}
																</FormGroup>
															</Col>
                              <Col md="4">
																<FormGroup>
																	<Label htmlFor="stateId">State Region</Label>
																	<Select
																		styles={customStyles}
																		options={
																			state_list
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						state_list,
																						'State',
																				  )
																				: []
																		}
																		value={props.values.stateId}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('stateId')(option);
																			} else {
																				props.handleChange('stateId')('');
																			}
																		}}
																		placeholder="Select State"
																		id="stateId"
																		name="stateId"
																		className={
																			props.errors.stateId &&
																			props.touched.stateId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.stateId &&
																		props.touched.stateId && (
																			<div className="invalid-feedback">
																				{props.errors.stateId}
																			</div>
																		)}
																</FormGroup>
															</Col>
                              {/* <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="state">State </Label>
                                  <Input
                                    type="text"
                                    id="state"
                                    name="state"
                                    placeholder="Enter state "
                                    onChange={(value) => { props.handleChange("state")(value) }}
                                    value={props.values.state}
                                    className={
                                      props.errors.state && props.touched.state
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.state && props.touched.state && (
                                    <div className="invalid-feedback">{props.errors.state}</div>
                                  )}
                                </FormGroup>
                              </Col> */}
                            </Row>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="state">City     </Label>
                                  <Input
                                    type="text"
                                    id="city"
                                    name="city"
                                    placeholder="Enter City Name "
                                    onChange={(value) => { props.handleChange("city")(value) }}
                                    value={props.values.city}
                                    className={
                                      props.errors.city && props.touched.city
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.city && props.touched.city && (
                                    <div className="invalid-feedback">{props.errors.city}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="city">Pin Code </Label>
                                  <Input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Enter Pin Code "
                                    onChange={(value) => { props.handleChange("pincode")(value) }}
                                    value={props.values.pincode}
                                    className={
                                      props.errors.pincode && props.touched.pincode
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.pincode && props.touched.pincode && (
                                    <div className="invalid-feedback">{props.errors.pincode}</div>
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
                                    onClick={() => { this.props.history.push('/admin/payroll/employee') }}>
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


export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployeePayroll)

