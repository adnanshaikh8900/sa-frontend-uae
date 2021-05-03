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
import moment from 'moment'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list,
    country_list: state.contact.country_list,
    state_list: state.contact.state_list,
    salary_role_dropdown: state.employeePayroll.salary_role_dropdown,
    designation_dropdown: state.employeePayroll.designation_dropdown,
    employee_list_dropdown: state.employeePayroll.employee_list_dropdown,
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
//    this._handleClick = this._handleClick.bind(this);
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
        designationId:'',
        active:true,
      },
      userPhoto: [],
			userPhotoFile: [],
      useractive: false,
      showIcon: false,
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
    this.props.employeeActions.getSalaryRolesForDropdown();
    this.props.employeeActions.getEmployeeDesignationForDropdown();
    this.props.employeeActions.getEmployeesForDropdown();
    this.setState({ showIcon: false });

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
      employeeDesignationId,
      dob,
      bloodGroup,
      gender,
      passportNumber,
      passportExpiryDate,
      visaNumber,
      employeeCode,
      visaExpiryDate,
      dateOfJoining,
      department,
      labourCard,
      grossSalary,
      accountHolderName,
      accountNumber,
      bankName,
      branch,
      ibanNumber,
      parentId,
      swiftCode
		} = data;


		const formData = new FormData();
		formData.append('isActive', this.state.useractive);
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
    formData.append('dob', dob ? moment(dob).format('DD-MM-YYYY') : '')
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
    formData.append(
      'passportNumber',
      passportNumber != null ? passportNumber : '',
    )
    formData.append(
      'visaNumber',
      visaNumber != null ? visaNumber : '',
    )
    formData.append('passportExpiryDate', passportExpiryDate ? moment(passportExpiryDate).format('DD-MM-YYYY') : '')
    formData.append('visaExpiryDate', visaExpiryDate ? moment(visaExpiryDate).format('DD-MM-YYYY') : '')
  
    formData.append(
      'employeeCode',
      employeeCode != null ? employeeCode : '',
      )
   formData.append('dateOfJoining', dateOfJoining ? moment(dateOfJoining).format('DD-MM-YYYY') : '')
  
     formData.append(
       'department',
       department != null ? department :'',
     )
     formData.append(
       'labourCard',
       labourCard != null ? labourCard : '',
     )
     formData.append(
       'grossSalary',
       grossSalary != null ? grossSalary : '',
     )
     formData.append(
       'accountHolderName',
       accountHolderName != null ? accountHolderName : '',
     )
     formData.append(
       'accountNumber',
       accountNumber != null ? accountNumber : '',
     )
     formData.append(
       'bankName',
       bankName != null ? bankName : '',
     )
     formData.append(
      'branch',
      branch != null ? branch : '',
    )
    formData.append(
      'ibanNumber',
      ibanNumber != null ? ibanNumber : '',
    )
    formData.append(
      'swiftCode',
      swiftCode != null ? swiftCode : '',
    )
    if (this.state.userPhotoFile.length > 0) {
			formData.append('profilePic ', this.state.userPhotoFile[0]);
		}
    if (gender && gender.value) {
			formData.append('gender', gender.value);
		}
    if (parentId && parentId.value) {
			formData.append('parentId', parentId.value);
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
    if (employeeDesignationId && employeeDesignationId.value) {
			formData.append('employeeDesignationId', employeeDesignationId.value);
		}
    this.props.employeeCreateActions
    .createEmployee(formData)
    .then((res) => {
      if (res.status === 200) {
        this.setState({ disabled: false });
        this.props.commonActions.tostifyAlert(
          'success',
           'New Employee Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm(this.state.initValue)
        } else {
          this.props.history.push('/admin/payroll/employee')
        }
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

  getStateList = (countryCode) => {
		this.props.employeeActions.getStateList(countryCode);
	};
  uploadImage = (picture, file) => {
		this.setState({
			userPhoto: picture,
			userPhotoFile: file,
		});
	};

  render() {

    const { salary_role_dropdown,designation_dropdown,country_list,state_list,employee_list_dropdown } = this.props

    console.log(employee_list_dropdown)

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
                        validationSchema={Yup.object().shape({
                          firstName: Yup.string()
                            .required("First Name is Required"),
                          lastName: Yup.string()
                            .required("Last Name is Required"),
                          email: Yup.string()
                          .email("Valid Email Required"),
                          employeeDesignationId : Yup.string()
                          .required("Designation is required"),
                          salaryRoleId :  Yup.string()
                          .required(" Employee Role is required"),
                          dob: Yup.date()
                            .required('DOB is Required')
                        })}
                      >
                        {(props) => (

                          <Form  onSubmit={(values, { resetForm }) => {
                            this.handleSubmit(values, resetForm)
                            resetForm(this.state.initValue)
  
                          }}>
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
                           <hr />
                            <h4>Personal Details</h4>
                            <hr />
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
                                    onChange={(value) => {
																			props.handleChange('firstName')(value);
																	
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
                                  <Label htmlFor="select">Middle Name</Label>
                                  <Input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={props.values.middleName}
                                    placeholder="Enter Middle Name"
                                    onChange={(value) => {
																			props.handleChange('middleName')(value);
																	
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
                                    onChange={(value) => {
																			props.handleChange('lastName')(value);
																	
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
                            <Row>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="gender">Passport Number </Label>
                                  <Input 
                                    type="text"
                                    maxLength="9"
                                    id="passportNumber"
                                    name="passportNumber"
                                    placeholder="Enter Passport Number "
                                    onChange={(value) => { props.handleChange("passportNumber")(value) }}
                                    value={props.values.passportNumber}
                                    className={
                                      props.errors.passportNumber && props.touched.passportNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.passportNumber && props.touched.passportNumber && (
                                    <div className="invalid-feedback">{props.errors.passportNumber}</div>
                                  )}
                                </FormGroup>
                              </Col> 
                              <Col md="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="passportExpiryDate">Passport expiry Date</Label>
                                  <DatePicker
                                    className={`form-control ${props.errors.passportExpiryDate && props.touched.passportExpiryDate ? "is-invalid" : ""}`}
                                    id="passportExpiryDate"
                                    name="passportExpiryDate"
                                    placeholderText="Select passport Expiry Date"
                                    showMonthDropdown
                                    showYearDropdown 
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    selected={props.values.passportExpiryDate}
                                    value={props.values.passportExpiryDate}
                                    onChange={(value) => {
                                      props.handleChange("passportExpiryDate")(value)
                                    }}
                                  />
                                  {props.errors.dob && props.touched.passportExpiryDate && (
                                    <div className="invalid-feedback">{props.errors.passportExpiryDate}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              </Row>  <Row>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="gender">Visa Number </Label>
                                  <Input 
                                    type="text" 
                                    id="visaNumber"
                                    name="visaNumber"
                                    placeholder="Enter Visa Number "
                                    onChange={(value) => { props.handleChange("visaNumber")(value) }}
                                    value={props.values.visaNumber}
                                    className={
                                      props.errors.visaNumber && props.touched.visaNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.visaNumber && props.touched.visaNumber && (
                                    <div className="invalid-feedback">{props.errors.visaNumber}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="visaExpiryDate">Visa ExpiryDate</Label>
                                  <DatePicker 
                                    className={`form-control ${props.errors.visaExpiryDate && props.touched.visaExpiryDate ? "is-invalid" : ""}`}
                                    id="visaExpiryDate"
                                    name="visaExpiryDate"
                                    placeholderText="Select visa Expiry Date"
                                    showMonthDropdown
                                    showYearDropdown 
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    selected={props.values.visaExpiryDate}
                                    value={props.values.visaExpiryDate}
                                    onChange={(value) => {
                                      props.handleChange("visaExpiryDate")(value)
                                    }}
                                  />
                                  {props.errors.dob && props.touched.visaExpiryDate && (
                                    <div className="invalid-feedback">{props.errors.visaExpiryDate}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <h4>Contact Details</h4>
                            <hr />
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
                              <Col md="4">
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
																							checked={
																								this.state.selectedStatus
																							}
																							value={true}
																							onChange={(e) => {
																								if (
																									e.target.value === 'true'
																								) {
																									this.setState({
																										selectedStatus: true,
																										useractive: true
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio1"
																						>
																							Active
																							</label>
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
																							checked={
																								!this.state.selectedStatus
																							}
																							onChange={(e) => {
																								if (
																									e.target.value === 'false'
																								) {
																									this.setState({
																										selectedStatus: false,
																										useractive: false
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio2"
																						>
																							Inactive
																							</label>
																					</div>
																				</FormGroup>
																			</div>
																		</FormGroup>
																	</Col>
                            </Row>
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
                            
                         
                            <hr />
                            <h4>Employment Details</h4>
                            <hr />
                            <Row>
                         
                           <Col lg={12}>
                           <Row>
                           <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Employee Code </Label>
                                  <Input 
                                    type="text"
                                    id="employeeCode"
                                    name="employeeCode"
                                    value={props.values.employeeCode}
                                    placeholder="Enter Employee Code"
                                    onChange={(value) => {
																			props.handleChange('employeeCode')(value);
																	
																		}}
                                    className={props.errors.employeeCode && props.touched.employeeCode ? "is-invalid" : ""}
                                  />
                                  {props.errors.employeeCode && props.touched.employeeCode && (
                                    <div className="invalid-feedback">{props.errors.employeeCode}</div>
                                  )}
                                </FormGroup>
                              </Col>
                           
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="salaryRoleId"><span className="text-danger">*</span>Designation</Label>
                                  <Select
																		styles={customStyles}
																		options={
                                      designation_dropdown
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
                                            designation_dropdown,
																						'employeeDesignationId',
																				  )
																				: []
																		}
																		id="employeeDesignationId"
																		name="employeeDesignationId"
																		placeholder="Select designation "
																		value={this.state.salaryDesignation}
                                    onChange={(value) => {
																			props.handleChange('employeeDesignationId')(value);
																	
																		}}
																		className={`${
																			props.errors.designationId && props.touched.designationId
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.designationId && props.touched.designationId && (
																		<div className="invalid-feedback">
																			{props.errors.designationId}
																		</div>
																	)}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="parentId"><span className="text-danger">*</span>Reports To</Label>
                                  <Select
																		styles={customStyles}
																		options={
                                      employee_list_dropdown
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
                                            employee_list_dropdown,
																						'Employee',
																				  )
																				: []
																		}
																		id="parentId"
																		name="parentId"
																		placeholder="Select designation "
																		value={this.state.parentId}
                                    onChange={(value) => {
																			props.handleChange('parentId')(value);
																	
																		}}
																		className={`${
																			props.errors.parentId && props.touched.parentId
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.parentId && props.touched.parentId && (
																		<div className="invalid-feedback">
																			{props.errors.parentId}
																		</div>
																	)}
                                </FormGroup>
                              </Col>
                          
                            </Row>
                            <Row  >
                            <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Department </Label>
                                  <Input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={props.values.department}
                                    placeholder="Enter department"
                                    onChange={(value) => {
																			props.handleChange('department')(value);
																	
																		}}
                                    className={props.errors.department && props.touched.department ? "is-invalid" : ""}
                                  />
                                  {props.errors.department && props.touched.department && (
                                    <div className="invalid-feedback">{props.errors.department}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="dateOfJoining"><span className="text-danger">*</span>Date Of Joining</Label>
                                  <DatePicker
                                    className={`form-control ${props.errors.dateOfJoining && props.touched.dateOfJoining ? "is-invalid" : ""}`}
                                    id="dateOfJoining"
                                    name="dateOfJoining"
                                    placeholderText="Select Date Of Joining"
                                    showMonthDropdown
                                    showYearDropdown 
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    selected={props.values.dateOfJoining}
                                    value={props.values.dateOfJoining}
                                    onChange={(value) => {
                                      props.handleChange("dateOfJoining")(value)
                                    }}
                                  />
                                  {props.errors.dob && props.touched.dateOfJoining && (
                                    <div className="invalid-feedback">{props.errors.dateOfJoining}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="labourCard">Labour Card</Label>
                                  <Input
                                    type="text"
                                    id="labourCard"
                                    name="labourCard"
                                    value={props.values.labourCard}
                                    placeholder="Enter labour Card"
                                    onChange={(value) => {
																			props.handleChange('labourCard')(value);
																	
																		}}
                                    className={props.errors.labourCard && props.touched.labourCard ? "is-invalid" : ""}
                                  />
																	{props.errors.labourCard && props.touched.labourCard && (
																		<div className="invalid-feedback">
																			{props.errors.labourCard}
																		</div>
																	)}

                                </FormGroup>
                              </Col>
                             
                            </Row>
                     
                            <Row className="row-wrapper">
                           
                            
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="salaryRoleId"><span className="text-danger">*</span>Salary Role </Label>
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
                                <FormGroup>
                                  <Label htmlFor="gender">Gross Salary </Label>
                                  <Input  
                                    type="text" 
                                    id="grossSalary"
                                    name="grossSalary"
                                    placeholder="Enter  grossSalary "
                                    onChange={(value) => {
																			props.handleChange('grossSalary')(value);
																	
																		}}
                                    value={props.values.grossSalary}
                                    className={
                                      props.errors.grossSalary && props.touched.grossSalary
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.grossSalary && props.touched.grossSalary && (
                                    <div className="invalid-feedback">{props.errors.visaNumber}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            </Col>
                            </Row>
                            <hr />
                            <h4>Bank Details</h4>
                            <hr />
                           
                            <Row  >
                            <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Account Holder Name </Label>
                                  <Input
                                    type="text"
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    value={props.values.accountHolderName}
                                    placeholder="Enter Account Holder Name"
                                    onChange={(value) => {
																			props.handleChange('accountHolderName')(value);
																	
																		}}
                                    className={props.errors.accountHolderName && props.touched.accountHolderName ? "is-invalid" : ""}
                                  />
                                  {props.errors.accountHolderName && props.touched.accountHolderName && (
                                    <div className="invalid-feedback">{props.errors.accountHolderName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">Account Number</Label>
                                  <Input
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={props.values.accountNumber}
                                    placeholder="Enter account Number"
                                    onChange={(value) => {
																			props.handleChange('accountNumber')(value);
																	
																		}}
                                    className={props.errors.accountNumber && props.touched.accountNumber ? "is-invalid" : ""}
                                  />
                                  {props.errors.accountNumber && props.touched.accountNumber && (
                                    <div className="invalid-feedback">{props.errors.accountNumber}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="labourCard">Bank Name</Label>
                                  <Input
                                    type="text"
                                    id="bankName"
                                    name="bankName"
                                    value={props.values.bankName}
                                    placeholder="Enter bank Name"
                                    onChange={(value) => {
																			props.handleChange('bankName')(value);
																	
																		}}
                                    className={props.errors.bankName && props.touched.bankName ? "is-invalid" : ""}
                                  />
																	{props.errors.bankName && props.touched.bankName && (
																		<div className="invalid-feedback">
																			{props.errors.bankName}
																		</div>
																	)}

                                </FormGroup>
                              </Col>
                            </Row>
                     
                            <Row className="row-wrapper">
                            <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select">Branch</Label>
                                  <Input 
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    value={props.values.branch}
                                    placeholder="Enter branch"
                                    onChange={(value) => {
																			props.handleChange('branch')(value);
																	
																		}}
                                    className={props.errors.branch && props.touched.branch ? "is-invalid" : ""}
                                  />
                                  {props.errors.branch && props.touched.branch && (
                                    <div className="invalid-feedback">{props.errors.branch}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="select">IBAN Number</Label>
                                  <Input 
                                    type="text"
                                    id="ibanNumber"
                                    name="ibanNumber"
                                    value={props.values.ibanNumber}
                                    placeholder="Enter IBAN Number"
                                    onChange={(value) => {
																			props.handleChange('ibanNumber')(value);
																	
																		}}
                                    className={props.errors.ibanNumber && props.touched.ibanNumber ? "is-invalid" : ""}
                                  />
                                  {props.errors.employeeCode && props.touched.employeeCode && (
                                    <div className="invalid-feedback">{props.errors.ibanNumber}</div>
                                  )}
                                </FormGroup>
                              </Col>
                             
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select">Swift Code</Label>
                                  <Input 
                                    type="text"
                                    id="swiftCode"
                                    name="swiftCode"
                                    value={props.values.swiftCode}
                                    placeholder="Enter swift Code"
                                    onChange={(value) => {
																			props.handleChange('swiftCode')(value);
																	
																		}}
                                    className={props.errors.swiftCode && props.touched.swiftCode ? "is-invalid" : ""}
                                  />
                                  {props.errors.swiftCode && props.touched.swiftCode && (
                                    <div className="invalid-feedback">{props.errors.swiftCode}</div>
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

