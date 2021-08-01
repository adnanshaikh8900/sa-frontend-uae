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

import * as DetailEmployeeBankAction from './actions';


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
        detailEmployeeBankAction: bindActionCreators(DetailEmployeeBankAction, dispatch),
    })
}
let strings = new LocalizedStrings(data);


class UpdateEmployeeBank extends React.Component {
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
            this.props.detailEmployeeBankAction.getEmployeeById(this.props.location.state.id).then((res) => {
                if (res.status === 200) {

                    this.setState({
                        loading: false,
                        current_employee_id: this.props.location.state.id,
                        initValue: {
                            id: res.data.id ? res.data.id : '',
                            employeeBankDetailsId: res.data.employeeBankDetailsId ? res.data.employeeBankDetailsId : '',
                            accountHolderName:
                                res.data.accountHolderName && res.data.accountHolderName !== null
                                    ? res.data.accountHolderName
                                    : '',
                            accountNumber:
                                res.data.accountNumber && res.data.accountNumber !== null
                                    ? res.data.accountNumber
                                    : '',
                            bankName:
                                res.data.bankName && res.data.bankName !== null
                                    ? res.data.bankName
                                    : '',
                            iban:
                                res.data.iban && res.data.iban !== null
                                    ? res.data.iban
                                    : '',
                            swiftCode:
                                res.data.swiftCode && res.data.swiftCode !== null
                                    ? res.data.swiftCode
                                    : '',

                            branch:
                                res.data.branch && res.data.branch !== null
                                    ? res.data.branch
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
            accountHolderName,
            accountNumber,
            iban,
            bankName,
            branch,
            swiftCode

        } = data;

        let formData = new FormData();
        formData.append('id', this.state.initValue.employeeBankDetailsId);
        formData.append('employee', this.props.location.state.id?this.props.location.state.id:"");
        formData.append(
            'accountHolderName',
            accountHolderName !== null ? accountHolderName : '',
        );
        formData.append(
            'accountNumber',
            accountNumber !== null ? accountNumber : '',
        );
        formData.append(
            'iban',
            iban !== null ? iban : '',
        );
        formData.append(
            'bankName',
            bankName !== null ? bankName : '',
        );
        formData.append(
            'branch',
            branch !== null ? branch : '',
        );
        formData.append(
            'swiftCode',
            swiftCode !== null ? swiftCode : '',
        );
        this.props.detailEmployeeBankAction.updateEmployeeBank(formData).then((res) => {
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
        console.log(this.state.gender, "gender")
        console.log(this.state.bloodGroup, "blood")
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
                                        <span className="ml-2"> {strings.UpdateEmployeeBankDetails} </span>
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
                                                                    <h4>{strings.BankDetails}</h4>
                                                                    <hr />

                                                                    <Row  >
                                                                        <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">*</span>{strings.AccountHolderName} </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="accountHolderName"
                                                                                    name="accountHolderName"
                                                                                    value={props.values.accountHolderName}
                                                                                    placeholder={strings.Enter+strings.AccountHolderName}
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
                                                                                <Label htmlFor="select"><span className="text-danger">*</span> {strings.AccountNumber}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="accountNumber"
                                                                                    name="accountNumber"
                                                                                    value={props.values.accountNumber}
                                                                                    placeholder={strings.Enter+strings.AccountNumber}
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
                                                                                <Label htmlFor="select">{strings.BankName} </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="bankName"
                                                                                    name="bankName"
                                                                                    value={props.values.bankName}
                                                                                    placeholder={strings.Enter+strings.BankName}
                                                                                    onChange={(value) => {
                                                                                        props.handleChange('bankName')(value);

                                                                                    }}
                                                                                    className={props.errors.bankName && props.touched.bankName ? "is-invalid" : ""}
                                                                                />
                                                                                {props.errors.bankName && props.touched.bankName && (
                                                                                    <div className="invalid-feedback">{props.errors.bankName}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>

                                                                    <Row className="row-wrapper">
                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select">{strings.Branch}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="branch"
                                                                                    name="branch"
                                                                                    value={props.values.branch}
                                                                                    placeholder={strings.Enter+strings.Branch}
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
                                                                                <Label htmlFor="select"> {strings.IBANNumber}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="iban"
                                                                                    name="iban"
                                                                                    value={props.values.iban}
                                                                                    placeholder={strings.Enter+strings.IBANNumber}
                                                                                    onChange={(value) => {
                                                                                        props.handleChange('iban')(value);

                                                                                    }}
                                                                                    className={props.errors.iban && props.touched.iban ? "is-invalid" : ""}
                                                                                />
                                                                                {props.errors.employeeCode && props.touched.employeeCode && (
                                                                                    <div className="invalid-feedback">{props.errors.iban}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>

                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select">{strings.SwiftCode}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="swiftCode"
                                                                                    name="swiftCode"
                                                                                    value={props.values.swiftCode}
                                                                                    placeholder={strings.Enter+strings.SwiftCode}
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmployeeBank)
