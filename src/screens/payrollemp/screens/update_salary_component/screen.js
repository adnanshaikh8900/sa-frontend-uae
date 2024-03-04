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
    Col,
    Table,
} from 'reactstrap'
import { Loader, LeavePage } from 'components'
import Select from 'react-select'
import { CommonActions } from 'services/global'
import 'react-toastify/dist/ReactToastify.css'
import * as DetailSalaryComponentAction from './actions';
import * as CreatePayrollEmployeeActions from '../create/actions'
import { SalaryComponentDeduction, SalaryComponentFixed, SalaryComponentVariable, SalaryComponent } from 'screens/payrollemp/sections';
import { Formik, Field } from 'formik';
import * as Yup from "yup";
import { selectOptionsFactory } from 'utils';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
    return ({
        designation_dropdown: state.payrollEmployee.designation_dropdown,
        employee_list_dropdown: state.payrollEmployee.employee_list_dropdown,
        state_list: state.payrollEmployee.state_list,
        country_list: state.payrollEmployee.country_list,
        salary_component_fixed_dropdown: state.payrollEmployee.salary_component_fixed_dropdown.data,
        salary_component_varaible_dropdown: state.payrollEmployee.salary_component_varaible_dropdown,
        salary_component_deduction_dropdown: state.payrollEmployee.salary_component_deduction_dropdown.data,
    })
}
const mapDispatchToProps = (dispatch) => {
    return ({
        commonActions: bindActionCreators(CommonActions, dispatch),
        detailSalaryComponentAction: bindActionCreators(DetailSalaryComponentAction, dispatch),
        createPayrollEmployeeActions: bindActionCreators(CreatePayrollEmployeeActions, dispatch),
    })
}

let strings = new LocalizedStrings(data);

class UpdateSalaryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: window['localStorage'].getItem('language'),
            loading: false,
            dialog: null,
            loadingMsg: "Loading....",
            disableLeavePage: false,
            current_employee_id: this.props.location.state.id,
            ctcTypeOption: this.props.location.state.ctcTypeOption ? this.props.location.state.ctcTypeOption : { label: "MONTHLY", value: 2 },
            ctcType: this.props.location.state.ctcTypeOption ? this.props.location.state.ctcTypeOption.label : "MONTHLY",
        }
    }

    // Create or Edit Employee Salary
    handleSubmit = (data) => {
        const {
            current_employee_id,
            totalMonthlyEarnings,
            totalNetPayMontly,
            totalNetPayYearly,
            list,
            totalYearlyEarnings,
            ctcType,
            ctcTypeOption,
        } = data;
        this.setState({ disabled: true, disableLeavePage: true, });
        const salaryComponentStringList = list.filter(obj => obj.id !== '');
        let formData = new FormData();
        formData.append('employee', current_employee_id)
        formData.append('employeeId', current_employee_id ?? "");
        if (ctcType === "ANNUALLY") {
            formData.append('grossSalary', totalYearlyEarnings)
            formData.append('totalNetPay', totalNetPayYearly)
        } else {
            formData.append('grossSalary', totalMonthlyEarnings)
            formData.append('totalNetPay', totalNetPayMontly)
        }
        formData.append('ctcType', ctcTypeOption.label ? ctcTypeOption.label : "ANNUALLY")
        formData.append('salaryComponentString', JSON.stringify(salaryComponentStringList));

        this.setState({ loading: true, loadingMsg: "Updating Salary Details ..." });
        this.props.detailSalaryComponentAction.updateEmployeeBank(formData).then((res) => {
            if (res.status === 200) {
                this.props.commonActions.tostifyAlert(
                    'success',
                    'Employee Updated Successfully.'
                )
                this.props.history.push('/admin/master/employee/viewEmployee',
                    { id: current_employee_id, tabNo: '2' })
                this.setState({ loading: false, });
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert(
                'error',
                err.data.message ? err.data.message : 'Employee Updated Unsuccessfully'
            )
        })
    }

    render() {
        strings.setLanguage(this.state.language);
        const { loading, loadingMsg, dialog, current_employee_id, ctcType, ctcTypeOption } = this.state

        return (loading == true ? <Loader loadingMsg={loadingMsg} /> :
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
                                            <span className="ml-2"> {strings.Update + " " + strings.SalaryDetails}</span>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <SalaryComponent
                                            employeeId={current_employee_id}
                                            ctcType={ctcType}
                                            ctcTypeOption={ctcTypeOption}
                                            handleSubmit={(values) => {
                                                this.handleSubmit(values);
                                            }}
                                            history={this.props.history}
                                            updateComponent={true}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                {this.state.disableLeavePage ? "" : <LeavePage />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSalaryComponent)
