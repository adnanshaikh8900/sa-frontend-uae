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
  
import { selectOptionsFactory } from 'utils'
import moment from 'moment'
import * as CreatePayrollEmployeeActions from '../create/actions'



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
        createPayrollEmployeeActions: bindActionCreators(CreatePayrollEmployeeActions, dispatch),
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
            current_employee_id: null,
            existForAccountNumber: false,
        }
        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExSpaceBoth = /[a-zA-Z0-9 ]+$/;

        this.formRef = React.createRef();
    }

    componentDidMount = () => {
        this.props.createPayrollEmployeeActions.getBankListForEmployees()
        .then((response) => {
            this.setState({bankList:response.data
        });
        });
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
                            bankId: res.data.bankId && res.data.bankId !== null
                            ? res.data.bankId
                            : '',


                        },
                    }
                    )

                }
            }).catch((err) => {
                this.setState({ loading: false })
                // this.props.history.push('/admin/payroll/employee')
                this.props.history.push('/admin/master/employee')
            })
        } else {
            // this.props.history.push('/admin/payroll/employee')
            this.props.history.push('/admin/master/employee')
        }
    }

    existForAccountNumber = (value) => {
        const data = {
            moduleType: 19,
            name: value,
        };
        this.props.createPayrollEmployeeActions
            .checkValidation(data)
            .then((response) => {
                if (response.data === 'accountNumber already exists') {
                    this.setState(
                        {
                            existForAccountNumber: true,
                        },
                        
                        () => {},
                    );
                
                } else {
                    this.setState({
                        existForAccountNumber: false,
                    });
                }
            });
    };
  
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
            swiftCode,
            bankId,

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
        // formData.append(
        //     'bankName',
        //     bankName !== null ? bankName : '',
        // );
        if (bankId && bankId.value) {
            formData.append('bankId', bankId.value);
        }
        if (bankId && bankId.label) {
            formData.append('bankName', bankId.label);
        }
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
                this.props.commonActions.tostifyAlert('success', res.data ? res.data.message : 'Employee Bank Updated Successfully!')
                // this.props.history.push('/admin/payroll/employee')
                  this.props.history.push('/admin/master/employee')
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert('error',  err.data.message ? err.data.message :'Employee Bank Updated Unsuccessfully')
        })
    }
    render() {
        strings.setLanguage(this.state.language);
        const { loading, initValue, dialog ,bankList ,existForAccountNumber } = this.state
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
                                                    validate={(values) => {
                                                        let errors = {};
                                                        if (existForAccountNumber === true) {
                                                            errors.accountNumber =
                                                                'Account Number already exists';
                                                        }
                                                        return errors;
                                                    }}
                                                    validationSchema={Yup.object().shape({
                                                        accountHolderName: Yup.string()
                                                            .required("Account Holder Name is Required"),
                                                        accountNumber: Yup.string()
                                                        .required("Account Number is Required"),
                                                        // bankName: Yup.string()
                                                        // .required("Bank Name is Required"),
                                                        bankId: Yup.string()
                                                        .required('Bank is Required') ,
                                                        swiftCode: Yup.string()
                                                        .required("Swift Code is Required"),
                                                        branch: Yup.string()
                                                        .required("Branch is Required"),
                                                        iban: Yup.string()
                                                        .required("IBAN is Required"),
                                                                       
                                                    })}

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
                                                                                    maxLength="60"
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
                                                                                    maxLength="25"
                                                                                    id="accountNumber"
                                                                                    name="accountNumber"
                                                                                    value={props.values.accountNumber}
                                                                                    placeholder={strings.Enter+strings.AccountNumber}
                                                                                    onChange={(option) => {
                                                                                        if (
                                                                                            option.target.value === '' ||
                                                                                            this.regExBoth.test(option.target.value)
                                                                                        ) {
                                                                                            props.handleChange('accountNumber')(
                                                                                                option,
                                                                                            );
                                                                                            this.existForAccountNumber(option.target.value);
                                                                                        }
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
                                                                                                <Label htmlFor="select"><span className="text-danger">*</span> {strings.BankName} </Label>
                                                                                                    <Select

                                                                                                        options={
                                                                                                            bankList
                                                                                                                ? selectOptionsFactory.renderOptions(
                                                                                                                    'bankName',
                                                                                                                    'bankId',
                                                                                                                    bankList,
                                                                                                                    'Bank',
                                                                                                                )
                                                                                                                : []
                                                                                                        }
                                                                                                        value={props.values.bankId}
                                                                                                        value={bankList &&
                                                                                                            selectOptionsFactory
                                                                                                                .renderOptions(
                                                                                                                    'bankName',
                                                                                                                    'bankId',
                                                                                                                    bankList,
                                                                                                                    'Bank',
                                                                                                                )
                                                                                                                .find(
                                                                                                                    (option) =>
                                                                                                                        option.value ===
                                                                                                                        props.values.bankId,
                                                                                                                )}
                                                                                                        onChange={(option) => {
                                                                                                            if (option && option.value) {
                                                                                                                props.handleChange('bankId')(option);
                                                                                                            } else {
                                                                                                                props.handleChange('bankId')('');
                                                                                                            }
                                                                                                        }}
                                                                                                        placeholder={strings.Select+strings.BankName}
                                                                                                        id="bankId"
                                                                                                        name="bankId"
                                                                                                        className={
                                                                                                            props.errors.bankId &&
                                                                                                                props.touched.bankId
                                                                                                                ? 'is-invalid'
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                    {props.errors.bankId &&
                                                                                                        props.touched.bankId && (
                                                                                                            <div className="invalid-feedback">
                                                                                                                {props.errors.bankId}
                                                                                                            </div>
                                                                                                        )}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                        {/* <Col md="4">
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">*</span>{strings.BankName} </Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="bankName"
                                                                                    name="bankName"
                                                                                    value={props.values.bankName}
                                                                                    placeholder={strings.Enter+strings.BankName}
                                                                                    onChange={(option) => {
                                                                                        if (
                                                                                            option.target.value === '' ||
                                                                                            this.regExBoth.test(option.target.value)
                                                                                        ) {
                                                                                            props.handleChange('bankName')(
                                                                                                option,
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    className={props.errors.bankName && props.touched.bankName ? "is-invalid" : ""}
                                                                                />
                                                                                {props.errors.bankName && props.touched.bankName && (
                                                                                    <div className="invalid-feedback">{props.errors.bankName}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col> */}
                                                                    </Row>

                                                                    <Row className="row-wrapper">
                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">*</span>{strings.Branch}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    maxLength="30"
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
                                                                                <Label htmlFor="select"> <span className="text-danger">*</span>{strings.IBANNumber}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    id="iban"
                                                                                    name="iban"
                                                                                    maxLength="34"
                                                                                    value={props.values.iban}
                                                                                    placeholder={strings.Enter+strings.IBANNumber}
                                                                                    onChange={(value) => {
                                                                                        props.handleChange('iban')(value);

                                                                                    }}
                                                                                    className={props.errors.iban && props.touched.iban ? "is-invalid" : ""}
                                                                                />
                                                                                {props.errors.iban && props.touched.iban && (
                                                                                    <div className="invalid-feedback">{props.errors.iban}</div>
                                                                                )}
                                                                            </FormGroup>
                                                                        </Col>

                                                                        <Col lg={4}>
                                                                            <FormGroup>
                                                                                <Label htmlFor="select"><span className="text-danger">*</span>{strings.SwiftCode}</Label>
                                                                                <Input
                                                                                    type="text"
                                                                                    maxLength="11"
                                                                                    id="swiftCode"
                                                                                    name="swiftCode"
                                                                                    value={props.values.swiftCode}
                                                                                    placeholder={strings.Enter+strings.SwiftCode}
                                                                                    onChange={(option) => {
                                                                                        if (option.target.value === '' || this.regExBoth.test(option.target.value)) { props.handleChange('swiftCode')(option) }
                                                                                    }}
                                                                                    className={props.errors.swiftCode && props.touched.swiftCode ? "is-invalid" : ""}
                                                                                />                                                     {props.errors.swiftCode && props.touched.swiftCode && (
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
                                                                            // this.props.history.push(
                                                                            //     '/admin/payroll/employee',
                                                                            // );
                                                                            this.props.history.push(
                                                                                '/admin/master/employee',
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
