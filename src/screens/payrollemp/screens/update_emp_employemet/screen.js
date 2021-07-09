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

import * as DetailEmployeeEmployementAction from './actions';
import * as CreatePayrollEmployeeActions from '../create/actions'


import { Formik } from 'formik';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import PhoneInput from 'react-phone-number-input'
import { selectOptionsFactory } from 'utils'
import moment from 'moment'




const mapStateToProps = (state) => {
    return ({
        salary_role_dropdown: state.payrollEmployee.salary_role_dropdown,
    })
}
const mapDispatchToProps = (dispatch) => {
    return ({
        commonActions: bindActionCreators(CommonActions, dispatch),
        detailEmployeeEmployementAction: bindActionCreators(DetailEmployeeEmployementAction, dispatch),
        createPayrollEmployeeActions: bindActionCreators(CreatePayrollEmployeeActions, dispatch)
    })
}
let strings = new LocalizedStrings(data);


class UpdateEmployeeEmployment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: window['localStorage'].getItem('language'),
            initValue: {},
            loading: true,
            dialog: null,
            selectedStatus: '',
            gender: '',
            bloodGroup: '',
            current_employee_id: null
        }
        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExSpaceBoth = /[a-zA-Z0-9 ]+$/;

        this.formRef = React.createRef();
    }

    componentDidMount = () => {
        if (this.props.location.state && this.props.location.state.id) {
            this.props.detailEmployeeEmployementAction.getEmployeeById(this.props.location.state.id).then((res) => {
                if (res.status === 200) {
                    this.props.createPayrollEmployeeActions.getSalaryRolesForDropdown();
                    this.setState({
                        loading: false,
                        current_employee_id: this.props.location.state.id,
                        initValue: {
                            id: res.data.id ? res.data.id : '',
                            employeeCode:
                                res.data.employeeCode && res.data.employeeCode !== null
                                    ? res.data.employeeCode
                                    : '',
                            department:
                                res.data.department && res.data.department !== null
                                    ? res.data.department
                                    : '',
                            salaryRoleId:
                                res.data.salaryRoleId && res.data.salaryRoleId !== null
                                    ? res.data.salaryRoleId
                                    : '',
                            dateOfJoining: res.data.dateOfJoining
                                ? moment(res.data.dateOfJoining, 'DD-MM-YYYY').toDate()
                                : '',

                            labourCard:
                                res.data.labourCard && res.data.labourCard !== null
                                    ? res.data.labourCard
                                    : '',
                            passportNumber:
                                res.data.passportNumber && res.data.passportNumber !== null
                                    ? res.data.passportNumber
                                    : '',
                            passportExpiryDate: res.data.passportExpiryDate
                                ? moment(res.data.passportExpiryDate, 'DD-MM-YYYY').toDate()
                                : '',

                            visaNumber:
                                res.data.visaNumber && res.data.visaNumber !== null
                                    ? res.data.visaNumber
                                    : '',
                            visaExpiryDate: res.data.visaExpiryDate
                                ? moment(res.data.visaExpiryDate, 'DD-MM-YYYY').toDate()
                                : '',



                        },
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



    // Create or Edit Vat
    handleSubmit = (data) => {

        this.setState({ disabled: true });
        const { current_employee_id } = this.state;
        const {
            department,
            labourCard,
            passportNumber,
            visaNumber,
            employee,
            dateOfJoining,
            passportExpiryDate,
            visaExpiryDate

        } = data;

        let formData = new FormData();
        formData.append('id', current_employee_id);
        formData.append(
            'department',
            department !== null ? department : '',
        );
        formData.append(
            'labourCard',
            labourCard !== null ? labourCard : '',
        );
        formData.append(
            'passportNumber',
            passportNumber !== null ? passportNumber : '',
        );
        formData.append(
            'visaNumber',
            visaNumber !== null ? visaNumber : '',
        );
        formData.append('dateOfJoining', dateOfJoining ? moment(dateOfJoining).format('DD-MM-YYYY') : '');
        formData.append('passportExpiryDate', passportExpiryDate ? moment(passportExpiryDate).format('DD-MM-YYYY') : '');
        formData.append('visaExpiryDate', visaExpiryDate ? moment(visaExpiryDate).format('DD-MM-YYYY') : '');
    
        this.props.detailEmployeeEmployementAction.updateEmployment(formData).then((res) => {
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
        const { salary_role_dropdown } = this.props

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
                                        <span className="ml-2"> {strings.UpdateEmployementDetails}</span>
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


                                                                <Col lg={12}>
                                                                    <Row>
                                                                    <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"> {strings.Department} </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="department"
                                                                                    name="department"
                                                                                    value={props.values.department}
                                                                                    placeholder={strings.Enter+strings.Department}
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
                                                                            <FormGroup>
                                                                                <Label htmlFor="salaryRoleId"><span className="text-danger">*</span> {strings.SalaryRole} </Label>
                                                                                <Select

                                                                                    options={
                                                                                        salary_role_dropdown.data
                                                                                            ? selectOptionsFactory.renderOptions(
                                                                                                'label',
                                                                                                'value',
                                                                                                salary_role_dropdown.data,
                                                                                                'SalaryRole',
                                                                                            )
                                                                                            : []
                                                                                    }
                                                                                    id="salaryRoleId"
                                                                                    name="salaryRoleId"
                                                                                    placeholder={strings.Select+strings.SalaryRole}
                                                                                    value={
                                                                                        salary_role_dropdown.data
                                                                                        && selectOptionsFactory.renderOptions(
                                                                                            'label',
                                                                                            'value',
                                                                                            salary_role_dropdown.data,
                                                                                            'EmploSalaryRoleyee',
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
                                                                        {/* <Col md="4">
            <FormGroup>
                <Label htmlFor="grossSalary">Gross Salary </Label>
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
        </Col> */}
                                                                    </Row>
                                                                    <Row  >
                                                                    <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"> {strings.Department} </Label>
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
                                                                                <Label htmlFor="dateOfJoining"><span className="text-danger">*</span> {strings.DateOfJoining}</Label>
                                                                                <DatePicker
                                                                                    className={`form-control ${props.errors.dateOfJoining && props.touched.dateOfJoining ? "is-invalid" : ""}`}
                                                                                    id="dateOfJoining"
                                                                                    name="dateOfJoining"
                                                                                    placeholderText={strings.Select+strings.DateOfJoining}
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
                                                                                {props.errors.dateOfJoining && props.touched.dateOfJoining && (
                                                                                    <div className="invalid-feedback">{props.errors.dateOfJoining}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>

                                                                         <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="labourCard">{strings.LabourCard}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="labourCard"
                                                                                    name="labourCard"
                                                                                    value={props.values.labourCard}
                                                                                    placeholder={strings.Enter+strings.LabourCard}
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
                                                                    <Row>
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="gender">{strings.PassportNumber} </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    maxLength="9"
                                                                                    id="passportNumber"
                                                                                    name="passportNumber"
                                                                                    placeholder={strings.Enter+strings.PassportNumber}
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
                                                                                <Label htmlFor="passportExpiryDate"> {strings.PassportExpiryDate}</Label>
                                                                                <DatePicker
                                                                                    className={`form-control ${props.errors.passportExpiryDate && props.touched.passportExpiryDate ? "is-invalid" : ""}`}
                                                                                    id="passportExpiryDate"
                                                                                    name="passportExpiryDate"
                                                                                    placeholderText={strings.Select+strings.PassportExpiryDate}
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
                                                                                <Label htmlFor="gender"> {strings.VisaNumber} </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="visaNumber"
                                                                                    name="visaNumber"
                                                                                    placeholder={strings.Enter+strings.VisaNumber}
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
                                                                                <Label htmlFor="visaExpiryDate">{strings.VisaExpiryDate}</Label>
                                                                                <DatePicker
                                                                                    className={`form-control ${props.errors.visaExpiryDate && props.touched.visaExpiryDate ? "is-invalid" : ""}`}
                                                                                    id="visaExpiryDate"
                                                                                    name="visaExpiryDate"
                                                                                    placeholderText={strings.Select+strings.VisaExpiryDate}
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

                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                            {/* <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="labourCard">{strings.LabourCard}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="labourCard"
                                                                                    name="labourCard"
                                                                                    value={props.values.labourCard}
                                                                                    placeholder={strings.Enter+strings.LabourCard}
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
                                                                        </Col> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmployeeEmployment)
