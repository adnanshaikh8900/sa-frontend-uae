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
import PhoneInput from 'react-phone-number-input'
import { selectOptionsFactory } from 'utils'
import moment from 'moment'




const mapStateToProps = (state) => {
    return ({
        designation_dropdown: state.payrollEmployee.designation_dropdown,
        employee_list_dropdown: state.payrollEmployee.employee_list_dropdown,
        state_list: state.payrollEmployee.state_list,
        country_list: state.payrollEmployee.country_list,
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
            current_employee_id: null
        }
        
        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExSpaceBoth = /[a-zA-Z0-9 ]+$/;

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

    componentDidMount = () => {
        if (this.props.location.state && this.props.location.state.id) {
            this.props.detailEmployeePersonalAction.getEmployeeById(this.props.location.state.id).then((res) => {
                this.props.createPayrollEmployeeActions.getCountryList();
                this.props.createPayrollEmployeeActions.getStateList();
                this.props.createPayrollEmployeeActions.getEmployeeDesignationForDropdown();
                this.props.createPayrollEmployeeActions.getEmployeesForDropdown();
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
                           
                            isActive:
                                res.data.isActive && res.data.isActive !== null
                                    ? res.data.isActive
                                    : '',

                        },
                        selectedStatus: res.data.isActive ? true : false,
                    }
                    )

                }
            }).catch((err) => {
                this.setState({ loading: false })
                this.props.history.push('/admin/payroll/employee')
            })
        } else {
            this.props.history.push('/admin/payroll/employee')
        }
    }


    getStateList = (countryCode) => {
		this.props.createPayrollEmployeeActions.getStateList(countryCode);
	};

    // Create or Edit Vat
    handleSubmit = (data) => {
        
        this.setState({ disabled: true });
		const { current_employee_id,gender,bloodGroup } = this.state;
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
            pincode,
            presentAddress,
            employeeDesignationId,
			
		} = data;

		let formData = new FormData();
		formData.append('id', current_employee_id);
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
                this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully!')
                this.props.history.push('/admin/payroll/employee')
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert('error', err.data.message)
        })
    }
    render() {
        strings.setLanguage(this.state.language);
        const { loading, initValue, dialog } = this.state
        const { designation_dropdown, country_list, state_list, employee_list_dropdown } = this.props
        console.log(this.state.gender,"gender")
        console.log(this.state.bloodGroup,"blood")
        console.log(this.state.selectedStatus)

        return (
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
                                            <Col lg={8}>
                                                <Formik
                                                    initialValues={initValue}
                                                    ref={this.formRef}
                                                    onSubmit={(values) => {
                                                        this.handleSubmit(values)
                                                    }}
                                                  
                                                >
                                                    {(props) => (
                                                        <Form onSubmit={props.handleSubmit} name="simpleForm">
                                                            <Row>
                                                                {/* <Col xs="4" md="4" lg={2}>
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
                                                                                    </Col> */}

                                                                <Col  lg={12}>
                                                                    <Row className="row-wrapper">

                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">*</span> {strings.FirstName}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="firstName"
                                                                                    name="firstName"
                                                                                    value={props.values.firstName}
                                                                                    placeholder="Enter first Name"
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
                                                                                    placeholder="Enter middle Name"
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
                                                                                <Label htmlFor="select"><span className="text-danger">*</span>{strings.LastName}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="lastName"
                                                                                    name="lastName"
                                                                                    value={props.values.lastName}
                                                                                    placeholder="Enter last Name"
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
                                                                                <Label htmlFor="select"><span className="text-danger">*</span>{strings.Email}</Label>
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
                                                                            <FormGroup>
                                                                                <Label htmlFor="mobileNumber">
                                                                                {strings. MobileNumber}
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
                                                                                {props.errors.mobileNumber && props.touched.mobileNumber && (
                                                                                    <div className="invalid-feedback">{props.errors.mobileNumber}</div>
                                                                                )}

                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="4">
                                                                            <FormGroup className="mb-3">
                                                                                <Label htmlFor="active"><span className="text-danger">*</span> {strings.Status}</Label>
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
                                                                                <Label htmlFor="gender"> {strings.Gender} {strings.Gender}</Label>
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
                                                                                    placeholder="Select Gender "
                                                                                    value={this.gender &&
                                                                                        this.gender.find(
                                                                                            (option) =>
                                                                                                option.value === props.values.gender,
                                                                                        )
                                                                                    }
                                                                                    onChange={(value) => {
                                                                                        props.handleChange('gender')(value);

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
                                                                                                'Terms',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="bloodGroup"
                                                                                    name="bloodGroup"
                                                                                    placeholder="Select Blood Group "
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
                                                                            <FormGroup className="mb-3">
                                                                                <Label htmlFor="date"><span className="text-danger">*</span>{strings.DateOfBirth}</Label>
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
                                                                                    placeholder="Select Superior Employee Name "
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
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="employeeDesignationId"><span className="text-danger">*</span>{strings.Designation}</Label>
                                                                                <Select

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
                                                                                <Label htmlFor="gender"> {strings.PresentAddress} </Label>
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
                                                                                <Label htmlFor="city">{strings.PinCode} </Label>
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

                                                                    <Row className="row-wrapper">
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="countryId">{strings.Country}</Label>
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
                                                                                <Label htmlFor="stateId">{strings.StateRegion}</Label>
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
                                                                                <Label htmlFor="state">{strings.City} </Label>
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
																				this.props.history.push(
																					'/admin/payroll/employee',
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
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmployeePersonal)
