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
import { Loader, ConfirmDeleteModal, ImageUploader } from 'components'
import Select from 'react-select'
import {
    CommonActions
} from 'services/global'
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'

import * as DetailEmployeePersonalAction from './actions';
import * as CreatePayrollEmployeeActions from '../create/actions'

import { Formik } from 'formik';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import PhoneInput  from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { selectOptionsFactory } from 'utils'
import moment from 'moment'




const mapStateToProps = (state) => {
    return ({
        designation_dropdown: state.payrollEmployee.designation_dropdown,
        employee_list_dropdown: state.payrollEmployee.employee_list_dropdown,
        state_list: state.payrollEmployee.state_list,
        country_list: state.payrollEmployee.country_list,
        salary_role_dropdown: state.payrollEmployee.salary_role_dropdown,
    })
}
const mapDispatchToProps = (dispatch) => {
    return ({
        commonActions: bindActionCreators(CommonActions, dispatch),
        detailEmployeePersonalAction: bindActionCreators(DetailEmployeePersonalAction, dispatch),
        createPayrollEmployeeActions: bindActionCreators(CreatePayrollEmployeeActions, dispatch)
    })
}
let strings = new LocalizedStrings(data);


class UpdateEmployeePersonal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: window['localStorage'].getItem('language'),
            initValue: {},
            loading: true,
            dialog: null,
            gender:'',
            bloodGroup:'',
            userPhoto: [],
			showIcon: false,
			userPhotoFile: {},
            current_employee_id: null,
            checkmobileNumberParam:false,
            checkmobileNumberParam1:false,
            checkmobileNumberParam2:false,
        }

        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regEx = /^[0-9\d]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExSpaceBoth = /[a-zA-Z0-9 ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s\D,'-/ ]+$/;
        this.formRef = React.createRef();
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

    uploadImage = (picture, file) => {
		this.setState({
			userPhoto: picture,
			userPhotoFile: file,
		});
	};
    componentDidMount = () => {
        if (this.props.location.state && this.props.location.state.id) {
            this.props.detailEmployeePersonalAction.getEmployeeById(this.props.location.state.id).then((res) => {
                this.props.createPayrollEmployeeActions.getCountryList();
                this.props.createPayrollEmployeeActions.getStateList();
                this.props.createPayrollEmployeeActions.getEmployeeDesignationForDropdown();
                this.props.createPayrollEmployeeActions.getEmployeesForDropdown();
                this.props.createPayrollEmployeeActions.getSalaryRolesForDropdown();
                if (res.status === 200) {

                    this.setState({
                        loading: false,
                        current_employee_id: this.props.location.state.id,
                        initValue: {
                            id: res.data.id ? res.data.id : '',
                            firstName:
                                res.data.firstName && res.data.firstName !== null
                                    ? res.data.firstName
                                    : '',
                            middleName:
                                res.data.middleName && res.data.middleName !== null
                                    ? res.data.middleName
                                    : '',
                            lastName:
                                res.data.lastName && res.data.lastName !== null
                                    ? res.data.lastName
                                    : '',
                            email:
                                res.data.email && res.data.email !== null
                                    ? res.data.email
                                    : '',
                            mobileNumber:
                                res.data.mobileNumber && res.data.mobileNumber !== null
                                    ? res.data.mobileNumber
                                    : '',
                                    salaryRoleId:
                                    res.data.salaryRoleId && res.data.salaryRoleId !== null
                                        ? res.data.salaryRoleId
                                        : '',
                            dob: res.data.dob
                                ? moment(res.data.dob, 'DD-MM-YYYY').toDate()
                                : '',
                                gender: res.data.gender ? res.data.gender : '',
                            presentAddress:
                                res.data.presentAddress && res.data.presentAddress !== null
                                    ? res.data.presentAddress
                                    : '',
                            city:
                                res.data.city && res.data.city !== null
                                    ? res.data.city
                                    : '',
                            countryId:
                                res.data.countryId && res.data.countryId !== null
                                    ? res.data.countryId
                                    : '',
                            stateId:
                                res.data.stateId && res.data.stateId !== null
                                    ? res.data.stateId
                                    : '',
                            pincode:
                                res.data.pincode && res.data.pincode !== null
                                    ? res.data.pincode
                                    : '',
                            bloodGroup:
                                res.data.bloodGroup && res.data.bloodGroup !== null
                                    ? res.data.bloodGroup
                                    : '',
                            employeeDesignationId:
                                res.data.employeeDesignationId && res.data.employeeDesignationId !== null
                                    ? res.data.employeeDesignationId
                                    : '',
                            parentId:
                                res.data.parentId && res.data.parentId !== null
                                    ? res.data.parentId
                                    : '',
                            emergencyContactName1:
                            res.data.emergencyContactName1 && res.data.emergencyContactName1 !== null?
                            res.data.emergencyContactName1:'',
                            emergencyContactName2:
                            res.data.emergencyContactName2 && res.data.emergencyContactName2 !== null?
                            res.data.emergencyContactName2:'',
                            emergencyContactNumber1:
                            res.data.emergencyContactNumber1 && res.data.emergencyContactNumber1 !== null?
                            res.data.emergencyContactNumber1:'',
                            emergencyContactNumber2:
                            res.data.emergencyContactNumber2 && res.data.emergencyContactNumber2 !== null?
                            res.data.emergencyContactNumber2:'',
                            emergencyContactRelationship1:
                            res.data.emergencyContactRelationship1 && res.data.emergencyContactRelationship1 !== null?
                            res.data.emergencyContactRelationship1:'',
                            emergencyContactRelationship2:
                            res.data.emergencyContactRelationship2 && res.data.emergencyContactRelationship2 !== null?
                            res.data.emergencyContactRelationship2:'',
                            university:
                            res.data.university && res.data.university !== null
                                ? res.data.university
                                : '',
                            qualification:
                                res.data.qualification && res.data.qualification !== null
                                    ? res.data.qualification
                                    : '',
                                    qualificationYearOfCompletionDate:
                                    res.data.qualificationYearOfCompletionDate && res.data.qualificationYearOfCompletionDate !== null
                                        ? res.data.qualificationYearOfCompletionDate
                                        : '',

                            isActive:
                                res.data.isActive && res.data.isActive !== null
                                    ? res.data.isActive
                                    : '',
                                    userPhoto: res.data.profilePicByteArray
                                    ? this.state.userPhoto.concat(res.data.profilePicByteArray)
                                    : [],

                        },
                        selectedStatus: res.data.isActive ? true : false,
                    },
                    () => {
                        this.props.createPayrollEmployeeActions.getStateList(
                            this.state.initValue.countryId,
                        );
                    }

                    )

                }

            }

            ).catch((err) => {
                this.setState({ loading: false })
                // this.props.history.push('/admin/payroll/employee')
                this.props.history.push('/admin/master/employee')
            })
        } else {
            // this.props.history.push('/admin/payroll/employee')
            this.props.history.push('/admin/master/employee')
        }
    }


    getStateList = (countryCode) => {
		this.props.createPayrollEmployeeActions.getStateList(countryCode);
	};

    // Create or Edit Vat
    handleSubmit = (data) => {

        this.setState({ disabled: true });
		const { current_employee_id } = this.state;
		const {
            firstName,
            middleName,
            lastName,
            email,
            dob,
            parentId,
            mobileNumber,
            stateId,
            countryId,
            city,
            gender,
            pincode,
            bloodGroup,
            presentAddress,
            employeeDesignationId,
            salaryRoleId,
           
            university,
            qualification,
            qualificationYearOfCompletionDate,
            emergencyContactName1,
            emergencyContactNumber2,
            emergencyContactRelationship1,
            emergencyContactNumber1,
            emergencyContactName2,
            emergencyContactRelationship2
			
		} = data;

		let formData = new FormData();
		formData.append('id', current_employee_id);
        formData.append('salaryRoleId', salaryRoleId);
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
			'email',
			email !== null ? email : '',
		);
        formData.append('dob', dob ? moment(dob).format('DD-MM-YYYY') : '');
        formData.append('gender', gender);

        formData.append('bloodGroup', bloodGroup);
        formData.append(
			'mobileNumber',
			mobileNumber !== null ? mobileNumber : '',
		);
        formData.append(
			'pincode',
			pincode !== null ? pincode : '',
		);
        formData.append('isActive', this.state.selectedStatus);
        formData.append(
			'presentAddress',
			presentAddress !== null ? presentAddress : '',
		);
        formData.append(
			'city',
			city !== null ? city : '',
		);
        formData.append(
            'university',
            university != null ? university :'',
        );
        formData.append(
            'qualification',
            qualification != null ? qualification :'',
        );
        formData.append(
            'qualificationYearOfCompletionDate',
            qualificationYearOfCompletionDate != null ? qualificationYearOfCompletionDate :'',
        );
        formData.append(
            'emergencyContactName1',
            emergencyContactName1 != null ? emergencyContactName1 :'',
        );
         
        formData.append(
            'emergencyContactNumber2',
            emergencyContactNumber2 != null ? 
            emergencyContactNumber2 :'',
        );
        formData.append(
            'emergencyContactRelationship1',
            emergencyContactRelationship1 != null ?emergencyContactRelationship1 :'',
        );
        formData.append(
            'emergencyContactNumber1',
            emergencyContactNumber1!= null ? emergencyContactNumber1:'',
        );
        formData.append(
            'emergencyContactName2',
            emergencyContactName2 != null ? emergencyContactName2 :'',
        );
        formData.append(
            'emergencyContactRelationship2',
            emergencyContactRelationship2 != null ?emergencyContactRelationship2:'',
        );
        if (employeeDesignationId && employeeDesignationId.value) {
			formData.append('employeeDesignationId', employeeDesignationId.value);
		}
        if (stateId && stateId.value) {
			formData.append('stateId', stateId.value);
		}
        if (countryId && countryId.value) {
			formData.append('countryId', countryId.value);
		}
        if (parentId && parentId.value) {
			formData.append('parentId', parentId.value);
		}

        this.props.detailEmployeePersonalAction.updateEmployeePersonal(formData).then((res) => {
            if (res.status === 200) {
                this.props.commonActions.tostifyAlert(
                    'success',
                     res.data ? res.data.message :'Employee Updated Successfully'
                     )
                // this.props.history.push('/admin/payroll/employee')
                this.props.history.push('/admin/master/employee')
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert(
                'error',
                  err.data.message ? err.data.message :'updated Unsuccessfully'
                  )
        })
    }
    render() {
        strings.setLanguage(this.state.language);
        const { loading, initValue, dialog ,checkmobileNumberParam,checkmobileNumberParam1,checkmobileNumberParam2} = this.state
        const { designation_dropdown, country_list, state_list, employee_list_dropdown,salary_role_dropdown } = this.props

        return (
            loading ==true? <Loader/> :
<div>
            <div className="detail-vat-code-screen">
                <div className="animated fadeIn">
                    {dialog}
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <div className="h4 mb-0 d-flex align-items-center">
                                        <i className="nav-icon icon-briefcase" />
                                        <span className="ml-2"> {strings.UpdateEmployeePersonalDetails}</span>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    {loading ? (
                                        <Loader></Loader>
                                    ) : (

                                        <Row>
                                            <Col lg={12}>
                                                <Formik
                                                    initialValues={initValue}
                                                    ref={this.formRef}
                                                    onSubmit={(values) => {
                                                        this.handleSubmit(values)
                                                    }}
                                                    validate={(values) => {
														let errors = {};
	
														if (checkmobileNumberParam === true) {
														errors.mobileNumber =
														'Invalid mobile number';
														}

                                                        
                                                        if (checkmobileNumberParam1 === true) {
                                                            errors.emergencyContactNumber1 =
                                                            'Invalid mobile number';
                                                            }

                                                            if (checkmobileNumberParam2 === true) {
                                                                errors.emergencyContactNumber2 =
                                                                'Invalid mobile number';
                                                                }
                                                            
                                                            if (values.employeeDesignationId && values.employeeDesignationId.label && values.employeeDesignationId.label === "Select Employee Designation") {
                                                                    errors.employeeDesignationId =
                                                                    'Designation is Required';
                                                                }

                                                                if (values.salaryRoleId && values.salaryRoleId.label && values.salaryRoleId.label === "Select Salary Role") {
                                                                    errors.salaryRoleId =
                                                                    'Salary Role is Required';
                                                                }

														return errors;
													}}
                                                    validationSchema={Yup.object().shape({
                                                        firstName: Yup.string()
                                                            .required("first Name is Required"),
                                                        lastName: Yup.string()
                                                            .required("Last Name is Required"),
                                                        email: Yup.string()
                                                            .required("Valid Email Required"),
                                                        // salaryRoleId: Yup.string()
                                                        //     .required(" Employee Role is required"),
                                                        dob: Yup.date()
                                                            .required('DOB is Required'),
                                                            presentAddress: Yup.string()
                                                            .required("Present Address is Required"),
                                                            pincode: Yup.string()
                                                            .required("Pin Code is Required"),
                                                            countryId: Yup.string()
                                                            .required("Country is Required"),
                                                            stateId: Yup.string()
                                                            .required("State is Required"),
                                                            city: Yup.string()
                                                            .required("City is Required"),
                                                            gender: Yup.string()
                                                            .required("Gender is Required"),
                                                        // active: Yup.string()
                                                        //     .required('status is Required'),
                                                        employeeDesignationId: Yup.string()
                                                            .required('Designation is Required'),
                                                            salaryRoleId : Yup.string()
                                                            .required('Salary Role is Required'),
                                                            mobileNumber: Yup.string()
															.required('Mobile Number is Required'),
                                                            emergencyContactName1: Yup.string()
                                                           .required('Contact Name 1 is Required') ,
                                                            emergencyContactNumber1:Yup.string()
                                                           .required("Contact Number 1 is Required"),
                                                            emergencyContactRelationship1: Yup.string()
                                                           .required('Relationship 1 is Required') ,
                                                                          
                                                    })}

                                                >
                                                    {(props) => (
                                                        <Form onSubmit={props.handleSubmit} name="simpleForm">
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

                                                                <Col  xs="4" md="4" lg={10}>
                                                                    <Row className="row-wrapper">

                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">* </span> {strings.FirstName}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="firstName"
                                                                                    name="firstName"
                                                                                    value={props.values.firstName}
                                                                                    placeholder={strings.Enter + strings.FirstName}
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
                                                                                <Label htmlFor="select"> {strings.MiddleName}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="middleName"
                                                                                    name="middleName"
                                                                                    value={props.values.middleName}
                                                                                    placeholder={strings.Enter + strings.MiddleName}
                                                                                    onChange={(option) => {
                                                                                        if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('middleName')(option) }
                                                                                    }}
                                                                                    className={props.errors.middleName && props.touched.middleName ? "is-invalid" : ""}
                                                                                />
                                                                                {props.errors.middleName && props.touched.firstName && (
                                                                                    <div className="invalid-feedback">{props.errors.middleName}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">* </span>{strings.LastName}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="lastName"
                                                                                    name="lastName"
                                                                                    value={props.values.lastName}
                                                                                    placeholder={strings.Enter + strings.LastName}
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
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">* </span>{strings.Email}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="email"
                                                                                    name="email"
                                                                                    value={props.values.email}
                                                                                    placeholder={strings.Enter + strings.EmailAddress}
                                                                                    onChange={(value) => { props.handleChange('email')(value) }}
                                                                                    className={props.errors.email && props.touched.email ? "is-invalid" : ""}
                                                                                />
                                                                                {props.errors.email && props.touched.email && (
                                                                                    <div className="invalid-feedback">{props.errors.email}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="mobileNumber">
                                                                                <span className="text-danger">* </span>  {strings.MobileNumber}
                                                                                </Label>
                                                                                <PhoneInput
                                                                                    id="mobileNumber"
                                                                                    name="mobileNumber"
                                                                                    country={"ae"}
                                                                                    enableSearch={true}
                                                                                    international
                                                                                    value={props.values.mobileNumber}
                                                                                    placeholder={strings.Enter + strings.MobileNumber}
                                                                                    onBlur={props.handleBlur('mobileNumber')}
                                                                                    onChange={(option) => {
                                                                                        props.handleChange('mobileNumber')(
                                                                                            option,
                                                                                        );
                                                                                        option.length!==12 ?  this.setState({checkmobileNumberParam:true}) :this.setState({checkmobileNumberParam:false});
                                                                                    }}
                                                                                    // className={
                                                                                    //     props.errors.mobileNumber &&
                                                                                    //         props.touched.mobileNumber
                                                                                    //         ? 'is-invalid'
                                                                                    //         : ''
                                                                                    // }
                                                                                />
                                                                                {props.errors.mobileNumber && props.touched.mobileNumber && (
                                                                                    <div style={{color:"red"}}>{props.errors.mobileNumber}</div>
                                                                                )}

                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <FormGroup className="mb-3">
                                                                                <Label htmlFor="date"><span className="text-danger">* </span>{strings.DateOfBirth}</Label>
                                                                                <DatePicker
                                                                                    className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                                                                    id="dob"
                                                                                    name="dob"
                                                                                    placeholderText={strings.Select + strings.DateOfBirth}
                                                                                    showMonthDropdown
                                                                                    showYearDropdown
                                                                                    maxDate={new Date()}
                                                                                    autoComplete={"off"}
                                                                                    dateFormat="dd-MM-yyyy"
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
                                                                        <Col md="4">
                                                                            <FormGroup className="mb-3">
                                                                                <Label htmlFor="active"><span className="text-danger">* </span> {strings.Status}</Label>
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
                                                                                                {strings.Active}
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
                                                                                                {strings.Inactive}
                                                                                            </label>
                                                                                        </div>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </FormGroup>
                                                                        </Col>

                                                                    </Row>
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="gender"><span className="text-danger">* </span>{strings.Gender}</Label>
                                                                                <Select

                                                                                    options={
                                                                                        this.gender
                                                                                            ? selectOptionsFactory.renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                this.gender,
                                                                                                'Gender',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="gender"
                                                                                    name="gender"
                                                                                    placeholder={strings.Select + strings.Gender}
                                                                                    value={this.gender &&
                                                                                        this.gender.find(
                                                                                            (option) =>
                                                                                                option.value === props.values.gender,
                                                                                        )
                                                                                    }
                                                                                    onChange={(option) => {
                                                                                        props.handleChange('gender')(option.value);

                                                                                    }}
                                                                                    className={`${props.errors.gender && props.touched.gender
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
                                                                                <Label htmlFor="bloodGroup">{strings.BloodGroup}</Label>
                                                                                <Select

                                                                                    options={
                                                                                        this.bloodGroup
                                                                                            ? selectOptionsFactory.renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                this.bloodGroup,
                                                                                                'Blood Group',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="bloodGroup"
                                                                                    name="bloodGroup"
                                                                                    placeholder={strings.Select + strings.BloodGroup}
                                                                                    value={this.bloodGroup &&
                                                                                        this.bloodGroup.find(
                                                                                            (option) =>
                                                                                                option.value === props.values.bloodGroup,
                                                                                        )
                                                                                    }
                                                                                    onChange={(option) => {
                                                                                         
                                                                                        props.handleChange('bloodGroup')(
                                                                                            option.value,
                                                                                        );

                                                                                    }}
                                                                                    className={`${props.errors.bloodGroup && props.touched.bloodGroup
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
                                                                            <FormGroup>
                                                                                <Label htmlFor="parentId"> {strings.ReportsTo}</Label>
                                                                                <Select

                                                                                    options={
                                                                                        employee_list_dropdown.data
                                                                                            ? selectOptionsFactory.renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                employee_list_dropdown.data,
                                                                                                'Employee',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="parentId"
                                                                                    name="parentId"
                                                                                    placeholder={strings.Select + strings.SuperiorEmployeeName}
                                                                                    value={employee_list_dropdown.data
                                                                                        && selectOptionsFactory.renderOptions(
                                                                                            'label',
                                                                                            'value',
                                                                                            employee_list_dropdown.data,
                                                                                            'Employee',
                                                                                        )
                                                                                            .find(
                                                                                                (option) =>
                                                                                                    option.value ===
                                                                                                    +props.values.parentId,
                                                                                            )}
                                                                                    onChange={(value) => {
                                                                                        props.handleChange('parentId')(value);

                                                                                    }}
                                                                                    className={`${props.errors.parentId && props.touched.parentId
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
                                                                    <Row>
                                                                    <Col md="4">
                                                                            <FormGroup>

                                                                                <Label htmlFor="salaryRoleId"><span className="text-danger">* </span> {strings.SalaryRole} </Label>
                                                                                <Select

                                                                                    options={
                                                                                        salary_role_dropdown.data
                                                                                            ? selectOptionsFactory.renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                salary_role_dropdown.data,
                                                                                                'Salary Role',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="salaryRoleId"
                                                                                    name="salaryRoleId"
                                                                                    placeholder={strings.Select + strings.SalaryRole}
                                                                                    value={
                                                                                        salary_role_dropdown.data
                                                                                        && selectOptionsFactory.renderOptions(
                                                                                            'label',
                                                                                            'value',
                                                                                            salary_role_dropdown.data,
                                                                                            'Employee Salary Role',
                                                                                        ).find(
                                                                                            (option) =>
                                                                                                option.value ===
                                                                                                props.values
                                                                                                    .salaryRoleId,
                                                                                        )}
                                                                                    onChange={(options) => {
                                                                                        if (options && options.value) {
                                                                                            props.handleChange(
                                                                                                'salaryRoleId',
                                                                                            )(options.value);
                                                                                        } else {
                                                                                            props.handleChange(
                                                                                                'salaryRoleId',
                                                                                            )('');
                                                                                        }
                                                                                    }}
                                                                                    className={`${props.errors.salaryRoleId && props.touched.salaryRoleId
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
                                                                                <Label htmlFor="employeeDesignationId"><span className="text-danger">* </span>{strings.Designation}</Label>
                                                                                <Select

                                                                                    options={
                                                                                        designation_dropdown
                                                                                            ? selectOptionsFactory.renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                designation_dropdown,
                                                                                                'Employee Designation',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="employeeDesignationId"
                                                                                    name="employeeDesignationId"
                                                                                    placeholder={strings.Select + strings.Designation}
                                                                                    value={designation_dropdown
                                                                                        && selectOptionsFactory.renderOptions(
                                                                                            'label',
                                                                                            'value',
                                                                                            designation_dropdown,
                                                                                            'employeeDesignationId',
                                                                                        ).find(
                                                                                            (option) =>
                                                                                                option.value ===
                                                                                                +props.values.employeeDesignationId,
                                                                                        )}
                                                                                    onChange={(value) => {
                                                                                        props.handleChange('employeeDesignationId')(value);

                                                                                    }}
                                                                                    className={`${props.errors.employeeDesignationId && props.touched.employeeDesignationId
                                                                                        ? 'is-invalid'
                                                                                        : ''
                                                                                        }`}
                                                                                />
                                                                                {props.errors.employeeDesignationId && props.touched.employeeDesignationId && (
                                                                                    <div className="invalid-feedback">
                                                                                        {props.errors.employeeDesignationId}
                                                                                    </div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>
                                                                        {/* <Col>
                                                                            <Label
                                                                                htmlFor="employeeDesignationId"
                                                                                style={{ display: 'block' }}
                                                                            >

                                                                            </Label>
                                                                            <Button
                                                                                type="button"
                                                                                color="primary"
                                                                                className="btn-square mr-3 mb-3 mt-4"
                                                                                onClick={(e, props) => {
                                                                                    this.openDesignationModal(props);
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-plus"></i> Add Designation
															                            	</Button>
                                                                        </Col> */}


                                                                    </Row>
                                                                    <Row className="row-wrapper">
                                                                        <Col md="8">
                                                                            <FormGroup>
                                                                                <Label htmlFor="gender"><span className="text-danger">* </span> {strings.PresentAddress} </Label>
                                                                                <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
                                                                                                        id="presentAddress"
                                                                                                        name="presentAddress"
                                                                                                        value={props.values.presentAddress}
                                                                                                        placeholder={strings.Enter+strings.PresentAddress}
                                                                                                        onChange={(option) => {
                                                                                                            if (
                                                                                                                option.target.value === '' ||
                                                                                                                this.regExAddress.test(
                                                                                                                    option.target.value,
                                                                                                                )
                                                                                                            ){
                                                                                                                props.handleChange('presentAddress')(option.target.value);																			
                                                                                                            }
                                                                                                        }}
                                                                                                        className={props.errors.presentAddress && props.touched.presentAddress ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.presentAddress && props.touched.presentAddress && (
                                                                                                        <div className="invalid-feedback">{props.errors.presentAddress}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                              
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="city"><span className="text-danger">*</span>{strings.PinCode} </Label>
                                                                                <Input
                                                                                                        type="text"
                                                                                                        maxLength="8"
                                                                                                        id="pincode"
                                                                                                        name="pincode"
                                                                                                        value={props.values.pincode}
                                                                                                        placeholder={strings.Enter+strings.PinCode}

                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('pincode')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.pincode && props.touched.pincode ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.pincode && props.touched.pincode && (
                                                                                                        <div className="invalid-feedback">{props.errors.pincode}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                          
                                                                                
                                                                        </Col>

                                                                    </Row>

                                                                    <Row className="row-wrapper">
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="countryId"><span className="text-danger">*</span>{strings.Country}</Label>
                                                                                <Select
                                                                                isDisabled
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
                                                                                    value={country_list &&
                                                                                        selectOptionsFactory
                                                                                            .renderOptions(
                                                                                                'countryName',
                                                                                                'countryCode',
                                                                                                country_list,
                                                                                                'Country',
                                                                                            )
                                                                                            .find(
                                                                                                (option) =>
                                                                                                    option.value ===
                                                                                                    +props.values.countryId,
                                                                                            )}
                                                                                    onChange={(option) => {
                                                                                        if (option && option.value) {
                                                                                            props.handleChange('countryId')(option);
                                                                                            this.getStateList(option.value);
                                                                                        } else {
                                                                                            props.handleChange('countryId')('');
                                                                                            this.getStateList(option.value);
                                                                                        }
                                                                                        props.handleChange('stateId')({
                                                                                            label: 'Select State',
                                                                                            value: '',
                                                                                        });
                                                                                    }}
                                                                                    placeholder={strings.Select + strings.Country}
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
                                                                                <Label htmlFor="stateId"><span className="text-danger">* </span>{strings.StateRegion}</Label>
                                                                                <Select

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
                                                                                    value={state_list &&
                                                                                        selectOptionsFactory
                                                                                            .renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                state_list,
                                                                                                'State',
                                                                                            )
                                                                                            .find(
                                                                                                (option) =>
                                                                                                    option.value ===
                                                                                                    props.values.stateId,
                                                                                            )}
                                                                                    onChange={(option) => {
                                                                                        if (option && option.value) {
                                                                                            props.handleChange('stateId')(option);
                                                                                        } else {
                                                                                            props.handleChange('stateId')('');
                                                                                        }
                                                                                    }}
                                                                                    placeholder={strings.Select + strings.StateRegion}
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
                                                                                <Label htmlFor="state"><span className="text-danger">* </span>{strings.City} </Label>
                                                                                <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
                                                                                                        id="city"
                                                                                                        name="city"
                                                                                                        value={props.values.city}
                                                                                                        placeholder={strings.Enter+strings.City}

                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('city')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.city && props.touched.city ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.city && props.touched.city && (
                                                                                                        <div className="invalid-feedback">{props.errors.city}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                               
                                                                              
                                                                        </Col>
                                                                    </Row>

                                                                    <hr></hr>
                                                                                                        <h4 className="mb-3 mt-3">{strings.EducationDetails}</h4>
                                                                                        <Row>
                                                                                       
                                                                                          <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="university"> {strings.University} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
                                                                                                        id="university"
                                                                                                        name="university"
                                                                                                        placeholder={strings.Enter+strings.University}
                                                                                                        onChange={(value) => { props.handleChange("university")(value) }}
                                                                                                        value={props.values.university}
                                                                                                        className={
                                                                                                            props.errors.university && props.touched.university
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.university && props.touched.university && (
                                                                                                        <div className="invalid-feedback">{props.errors.university}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="qualification"> {strings.qualification} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="50"
                                                                                                        id="qualification"
                                                                                                        name="qualification"
                                                                                                        placeholder={strings.Enter+strings.qualification}
                                                                                                        onChange={(value) => { props.handleChange("qualification")(value) }}
                                                                                                        value={props.values.qualification}
                                                                                                        className={
                                                                                                            props.errors.qualification && props.touched.qualification
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.qualification && props.touched.qualification && (
                                                                                                        <div className="invalid-feedback">{props.errors.qualification}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="qualificationYearOfCompletionDate"> {strings.qualificationYearOfCompletionDate} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="10"
                                                                                                        id="qualificationYearOfCompletionDate"
                                                                                                        name="qualificationYearOfCompletionDate"
                                                                                                        placeholder={strings.Enter+strings.qualificationYearOfCompletionDate}
                                                                                                        onChange={(value) => { props.handleChange("qualificationYearOfCompletionDate")(value) }}
                                                                                                        value={props.values.qualificationYearOfCompletionDate}
                                                                                                        className={
                                                                                                            props.errors.qualificationYearOfCompletionDate && props.touched.qualificationYearOfCompletionDate
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.qualificationYearOfCompletionDate && props.touched.qualificationYearOfCompletionDate && (
                                                                                                        <div className="invalid-feedback">{props.errors.qualificationYearOfCompletionDate}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                      </Row>                      


                                                                                      <hr></hr>
                                                                                                        <h4 className="mb-3 mt-3">{strings.EmergencyContact}</h4>
                                                                                        <Row>
                                                                                    
                                                                                          <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactName1"><span className="text-danger">* </span>{strings.ContactName1}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="26"
                                                                                                        id="emergencyContactName1"
                                                                                                        name="emergencyContactName1"
                                                                                                        value={props.values.emergencyContactName1}
                                                                                                        placeholder={strings.Enter+strings.ContactName1}

                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('emergencyContactName1')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.emergencyContactName1 && props.touched.emergencyContactName1 ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.emergencyContactName1 && props.touched.emergencyContactName1 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactName1}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                          
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactNumber1"><span className="text-danger">* </span>{strings.ContactNumber1} </Label>
                                                                                                    <PhoneInput
                                                                                                        id="emergencyContactNumber1"
                                                                                                        name="emergencyContactNumber1"
                                                                                                        country={"ae"}
                                                                                                        enableSearch={true}
                                                                                                        international
                                                                                                        value={props.values.emergencyContactNumber1}
                                                                                                        placeholder={strings.Enter+strings.ContactNumber1}
                                                                                                        onBlur={props.handleBlur('emergencyContactNumber1')}
                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('emergencyContactNumber1')(
                                                                                                                option,
                                                                                                            );
                                                                                                            option.length!==12 ?  this.setState({checkmobileNumberParam1:true}) :this.setState({checkmobileNumberParam1:false});
                                                                                                        }}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactNumber1 &&
                                                                                                                props.touched.emergencyContactNumber1
                                                                                                                ? 'text-danger'
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                     {props.errors.emergencyContactNumber1 && props.touched.emergencyContactNumber1 && (
                                                                                                        <div className="text-danger">{props.errors.emergencyContactNumber1}</div>
                                                                                                    )}
                                                                                                   
                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactRelationship1"><span className="text-danger">* </span> {strings.Relationship1} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="26"
                                                                                                        id="emergencyContactRelationship1"
                                                                                                        name="emergencyContactRelationship1"
                                                                                                        value={props.values.emergencyContactRelationship1}
                                                                                                        placeholder={strings.Enter+strings.Relationship1}

                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('emergencyContactRelationship1')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.emergencyContactRelationship1 && props.touched.emergencyContactRelationship1 ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.emergencyContactRelationship1 && props.touched.emergencyContactRelationship1 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactRelationship1}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                     
                                                                                            </Col>
                                                                                           
                                                                                          <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactName2"> {strings.ContactName2} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="emergencyContactName2"
                                                                                                        name="emergencyContactName2"
                                                                                                        placeholder={strings.Enter+strings.ContactName2}
                                                                                                        onChange={(value) => { props.handleChange("emergencyContactName2")(value) }}
                                                                                                        value={props.values.emergencyContactName2}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactName2 && props.touched.emergencyContactName2
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.emergencyContactName2 && props.touched.emergencyContactName2 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactName2}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactNumber2"> {strings.ContactNumber2} </Label>
                                                                                                    <PhoneInput
                                                                                                        id="emergencyContactNumber2"
                                                                                                        name="emergencyContactNumber2"
                                                                                                        country={"ae"}
                                                                                                        enableSearch={true}
                                                                                                        international
                                                                                                        value={props.values.emergencyContactNumber2}
                                                                                                        placeholder={strings.Enter+strings.ContactNumber2}
                                                                                                        onBlur={props.handleBlur('emergencyContactNumber2')}
                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('emergencyContactNumber2')(
                                                                                                                option,
                                                                                                            );
                                                                                                            option.length!==12 ?  this.setState({checkmobileNumberParam2:true}) :this.setState({checkmobileNumberParam2:false});
                                                                                                        }}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactNumber2 &&
                                                                                                                props.touched.emergencyContactNumber2
                                                                                                                ? 'text-danger'
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                     {props.errors.emergencyContactNumber2 && props.touched.emergencyContactNumber2 && (
                                                                                                        <div className="text-danger">{props.errors.emergencyContactNumber2}</div>
                                                                                                    )}
                                                                                                   
                                                                                                </FormGroup>
                                                                                                    {/* <PhoneInput
                                                                                                        id="emergencyContactNumber2"
                                                                                                        name="emergencyContactNumber2"
                                                                                                        country={"ae"}
                                                                                                        enableSearch={true}
                                                                                                        international
                                                                                                        value={props.values.emergencyContactNumber2}
                                                                                                        placeholder={strings.Enter+strings.ContactNumber2}
                                                                                                        onBlur={props.handleBlur('emergencyContactNumber2')}
                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('emergencyContactNumber2')(
                                                                                                                option,
                                                                                                            );
                                                                                                        }}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactNumber2 &&
                                                                                                                props.touched.emergencyContactNumber2
                                                                                                                ? 'is-invalid'
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                     {props.errors.emergencyContactNumber2 && props.touched.memergencyContactNumber2 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactNumber2}</div>
                                                                                                    )}
                                                                                                   
                                                                                                </FormGroup> */}
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactRelationship2"> {strings.Relationship2} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="emergencyContactRelationship2"
                                                                                                        name="emergencyContactRelationship2"
                                                                                                        placeholder={strings.Enter+strings.Relationship2}
                                                                                                        // placeholder={strings.Enter+strings.PinCode}
                                                                                                        onChange={(value) => { props.handleChange("emergencyContactRelationship2")(value) }}
                                                                                                        value={props.values.emergencyContactRelationship2}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactRelationship2 && props.touched.emergencyContactRelationship2
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.emergencyContactRelationship2 && props.touched.emergencyContactRelationship2 && (
                                                                                                        <div className="invalid-feedback">{props.errors.qemergencyContactRelationship2}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                         
                                                                                      </Row>                      
                                                                    
                                                                </Col>
                                                            </Row>
                                                            <Row className='pull-right'>
                                                                <FormGroup className="text-right">
                                                                    <Button
                                                                        type="submit"
                                                                        color="primary"
                                                                        className="btn-square mr-3"
                                                                        disabled={this.state.disabled}
                                                                    >
                                                                        <i className="fa fa-dot-circle-o"></i>{' '}
                                                                        {this.state.disabled
                                                                            ? 'Updating...'
                                                                            : strings.Update}
                                                                    </Button>
                                                                    <Button
                                                                        color="secondary"
                                                                        className="btn-square"
                                                                        onClick={() => {
                                                                            // this.props.history.push(
                                                                            //     '/admin/payroll/employee/viewEmployee',
                                                                            // );
                                                                            this.props.history.push(
                                                                                '/admin/master/employee/viewEmployee',
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i className="fa fa-ban"></i> {strings.Cancel}
                                                                    </Button>
                                                                </FormGroup>
                                                            </Row>
                                                        </Form>
                                                    )}
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmployeePersonal)
