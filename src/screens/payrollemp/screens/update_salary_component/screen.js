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
import { SalaryComponentDeduction, SalaryComponentFixed, SalaryComponentVariable } from 'screens/payrollemp/sections';
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
        salary_component_fixed_dropdown: state.payrollEmployee.salary_component_fixed_dropdown,
        salary_component_varaible_dropdown: state.payrollEmployee.salary_component_varaible_dropdown,
        salary_component_deduction_dropdown: state.payrollEmployee.salary_component_deduction_dropdown,
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
            initValue: {},
            loading: true,
            dialog: null,
            CTC: '',
            Fixed: [],
            Variable: [],
            Deduction: [],
            Fixed_Allowance: [],
            current_employee_id: null,
            openSalaryComponentFixed: false,
            openSalaryComponentVariable: false,
            openSalaryComponentDeduction: false,
            loadingMsg: "Loading....",
            disableLeavePage: false,
            varEarn: false,
            errorMsg: false,
            ctcTypeOption: this.props.location.state.ctcTypeOption ? this.props.location.state.ctcTypeOption : { label: "MONTHLY", value: 2 },
            ctcType: this.props.location.state.ctcTypeOption ? this.props.location.state.ctcTypeOption.label : "MONTHLY",
            ctcTypeList: [
                { label: "MONTHLY", value: 2 },
                { label: "ANNUALLY", value: 1 },
            ]
        }

        this.regEx = /^[0-9\d]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regDec1 = /^\d{1,2}\.\d{1,2}$|^\d{1,2}$/;
        this.type = [
            { label: 'Flat Amount', value: 1 },
            { label: '% of CTC', value: 2 }
        ];

        this.formRef = React.createRef();

        this.columnHeader1 = [
            { label: 'Component Name', value: 'Component Name', sort: false },
            { label: 'Calculation Type', value: 'Calculation Type', sort: false },
            { label: 'Monthly', value: 'Monthly', sort: false },
            { label: 'Annually', value: 'Annualy', sort: false },
        ];
    }

    //added by mudassar
    handleChange = (evt) => {


        const value = evt.target.value;
        this.setState({

            [this.state.Fixed.formula]: value
        });
    }
    //added by mudassar
    componentDidMount = () => {
        this.getSalaryComponentByEmployeeId_First_Time();
        this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownFixed();
        this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownDeduction();
        this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownVariable();
    }
    getSalaryComponentByEmployeeId_First_Time = () => {

        if (this.props.location.state && this.props.location.state.id) {
            this.props.detailSalaryComponentAction.getSalaryComponentByEmployeeId(this.props.location.state.id).then((res) => {

                if (res.status === 200) {

                    let ctcValue =
                        res.data.ctc ?
                            (
                                this.state.ctcType == "ANNUALLY" ?
                                    res.data.ctc
                                    : parseFloat(res.data.ctc) * 12
                            )
                            : ''

                    this.setState({
                        loading: false,
                        current_employee_id: this.props.location.state.id,
                        id: res.data.id ? res.data.id : '',
                        CTC: res.data.ctc ? res.data.ctc : '',
                        Fixed: res.data.salaryComponentResult.Fixed,
                        Variable: res.data.salaryComponentResult.Variable,
                        Deduction: res.data.salaryComponentResult.Deduction,
                        Fixed_Allowance: res.data.salaryComponentResult.Fixed_Allowance,
                    })

                    this.updateSalary(res.data.ctc ? ctcValue : this.state.CTC)
                    this.formRef.current.setFieldValue('CTC',
                        this.state.CTC != "" ?
                            (this.state.ctcType == "ANNUALLY" ?
                                this.state.CTC
                                : parseFloat(this.state.CTC) / 12)
                            : 0
                        , true);
                }
            }).catch((err) => {
                this.setState({ loading: false })
                this.props.history.push('/admin/master/employee')
            })
        } else {
            this.props.history.push('/admin/master/employee')
        }
    }
    getSalaryComponentByEmployeeId = () => {

        if (this.props.location.state && this.props.location.state.id) {
            this.props.detailSalaryComponentAction.getSalaryComponentByEmployeeId(this.props.location.state.id).then((res) => {

                if (res.status === 200) {
                    const resFixedLength = res.data.salaryComponentResult.Fixed ? res.data.salaryComponentResult.Fixed?.length : 0;
                    const resDeductionLength = res.data.salaryComponentResult.Deduction ? res.data.salaryComponentResult.Deduction?.length : 0;
                    const fixedLength = this.state.Fixed ? this.state.Fixed?.length : 0
                    const deductionLength = this.state.Deduction ? this.state.Deduction?.length : 0
                    if (resFixedLength > fixedLength) {
                       this.state.Fixed.push(res.data.salaryComponentResult.Fixed[resFixedLength - 1])
                    }
                    if(resDeductionLength > deductionLength){
                       this.state.Deduction.push(res.data.salaryComponentResult.Deduction[resDeductionLength - 1])
                    }
                    
                    this.updateSalary1(this.state.CTC)
                }
            }).catch((err) => {
                this.setState({ loading: false })
                this.props.history.push('/admin/master/employee/viewEmployee',
                { id: this.props.location.state.id })
            })
        } else {
            this.props.history.push('/admin/master/employee/viewEmployee',
            { id: this.props.location.state.id })
        }
    }
    openSalaryComponentFixed = (props) => {
        this.setState({ openSalaryComponentFixed: true });
    };
    closeSalaryComponentFixed = (res) => {
        this.setState({ openSalaryComponentFixed: false });
        this.getSalaryComponentByEmployeeId();
        // this.updateSalary();
    };
    openSalaryComponentVariable = (props) => {
        this.setState({ openSalaryComponentVariable: true });
    };
    closeSalaryComponentVariable = (res) => {
        this.setState({ openSalaryComponentVariable: false });
        this.getSalaryComponentByEmployeeId();
        //   this.updateSalary();
    };
    openSalaryComponentDeduction = (props) => {
        this.setState({ openSalaryComponentDeduction: true });
    };
    closeSalaryComponentDeduction = (res) => {
        this.setState({ openSalaryComponentDeduction: false });
        this.getSalaryComponentByEmployeeId();
        //this.updateSalary();
    };
    renderActionForState = () => {
        this.props.createPayrollEmployeeActions.getEmployeeById(this.state.current_employee_id)
            .then((res) => {
                this.setState({
                    selectedData: res.data,
                    loading: false,
                })
            });
    }

    totalEarnings = () => {
        const totalMonthlyAmount = Object.values(this.state.Fixed).reduce((total, item) => {
            if (typeof item.monthlyAmount == 'string') {
                total += parseFloat(item.monthlyAmount);
            } else {
                total += item.monthlyAmount
            }
            return total;
        }, 0);
        const totalMonthlyEarnings = totalMonthlyAmount ? totalMonthlyAmount : 0
        return totalMonthlyEarnings;
    }
    totalYearEarnings = () => {
        const totalYearlyAmount = Object.values(this.state.Fixed).reduce((total, item) => {
            if (typeof item.yearlyAmount == 'string') {
                total += parseFloat(item.yearlyAmount);
            } else {
                total += item.yearlyAmount
            }
            return total;
        }, 0);
        const totalYearlyEarnings = totalYearlyAmount ? totalYearlyAmount : 0
        return totalYearlyEarnings;
    }
    totalDeductions = () => {
        const totalMonthlyDeduction = Object.values(this.state.Deduction).reduce((total, item) => {
            if (typeof item.monthlyAmount == 'string') {
                total += parseFloat(item.monthlyAmount);
            } else {
                total += item.monthlyAmount
            }
            return total;
        }, 0);
        const totalMonthlyDeductions = totalMonthlyDeduction ? totalMonthlyDeduction : 0
        return totalMonthlyDeductions;
    }
    totalYearDeductions = () => {
        const totalYearlyDeduction = Object.values(this.state.Deduction).reduce((total, item) => {
            if (typeof item.yearlyAmount == 'string') {
                total += parseFloat(item.yearlyAmount);
            } else {
                total += item.yearlyAmount
            }
            return total;
        }, 0);
        const totalYearlyDeductions = totalYearlyDeduction ? totalYearlyDeduction : 0
        return totalYearlyDeductions;
    }
    grossEarnings = () => {
        const grossEarning = (this.totalEarnings()) + (typeof this.state.Deduction === 'object' ? this.totalDeductions() : 0)
        // this.setState({grossSalarys : grossEarning})
        return grossEarning;
    }
    grossYearEarnings = () => {
        const grossYearEarning = (this.totalYearEarnings()) + (typeof this.state.Deduction === 'object' ? this.totalYearDeductions() : 0)
        // this.setState({grossSalarys : grossEarning})
        return grossYearEarning;
    }

    // Create or Edit VAT
    handleSubmit = (data) => {

        this.setState({ disabled: true, disableLeavePage: true, });
        const { current_employee_id } = this.state;
        const { employee, CTC } = data;

        let formData = new FormData();
        formData.append('employee', current_employee_id)
        formData.append('employeeId', this.props.location.state.id ? this.props.location.state.id : "");
        if (this.state.ctcTypeOption.label == "ANNUALLY") {
            formData.append('grossSalary', (this.totalYearEarnings()) + (typeof this.state.Deduction === 'object' ? this.totalYearDeductions() : 0 ))
        } else {
            formData.append('grossSalary', (this.totalEarnings()) + (typeof this.state.Deduction === 'object' ? this.totalDeductions() : 0 ))
        }
        formData.append("totalNetPay", this.totalEarnings());
        formData.append('ctcType', this.state.ctcTypeOption.label ? this.state.ctcTypeOption.label : "ANNUALLY")
        formData.append('salaryComponentString', JSON.stringify(this.state.list));

        this.setState({ loading: true, loadingMsg: "Updating Salary Details ..." });
        this.props.detailSalaryComponentAction.updateEmployeeBank(formData).then((res) => {
            if (res.status === 200) {
                this.props.commonActions.tostifyAlert(
                    'success',
                    'Employee Updated Successfully.'
                )
                this.props.history.push('/admin/master/employee/viewEmployee',
                    { id: this.props.location.state.id })
                this.setState({ loading: false, });
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert(
                'error',
                err.data.message ? err.data.message : 'Employee Updated Unsuccessfully'
            )
        })
    }

    updateSalary = (CTC1) => {
        this.setState({ errorMsg: false })
        const Fixed = this.state.Fixed
        const Variable = this.state.Variable
        const Deduction = this.state.Deduction
        const Fixed_Allowance = this.state.Fixed_Allowance

        var locallist = []
        var totalFixedSalary = 0;
        Fixed.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.formula.length > 0) {
                var salaryAnnulay = CTC1 * (obj.formula / 100);
                var salaryMonthy = salaryAnnulay / 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else {
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }
            return obj;
        });

        if (Deduction != null) {
            Deduction.map((obj) => {
                locallist.push(obj);
                if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                    var salaryAnnulay = CTC1 * (obj.formula / 100);
                    var salaryMonthy = salaryAnnulay / 12;
                    obj.monthlyAmount = salaryMonthy;
                    obj.yearlyAmount = salaryAnnulay;
                    totalFixedSalary = totalFixedSalary + salaryMonthy;
                }
                else if (obj.flatAmount != null) {
                    var salaryMonthy = obj.flatAmount;
                    obj.monthlyAmount = salaryMonthy;
                    obj.yearlyAmount = salaryMonthy * 12;
                }
                return obj;
            });
        }

        const monthlySalary = CTC1 / 12
        const componentTotal1 = monthlySalary - totalFixedSalary;

        this.setState({
            componentTotal: componentTotal1,
            CTC: CTC1,
            list: locallist,
            initValue: {
                ...this.state.initValue,
                ...{
                    CTC: CTC1
                }
            }
        })
    }

    removeComponent = (ComponentId) => {
        this.props.detailSalaryComponentAction.deleteSalaryComponentRow(this.state.current_employee_id, ComponentId).then((res) => {
            if (res.status === 200) {
                const fixed = this.state.Fixed.filter(obj => obj.id !== ComponentId);
                const deduction = this.state.Deduction ? this.state.Deduction.filter(obj => obj.id !== ComponentId) : '';
                this.setState({ Fixed: fixed, Deduction: deduction })
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert('error', err.data.message)
        });
    }

    updateSalary1 = (CTC1, newFormula, id, newFlatAmount) => {
        this.setState({ errorMsg: false })
        const Fixed = this.state.Fixed
        const Variable = this.state.Variable
        const Deduction = this.state.Deduction
        const Fixed_Allowance = this.state.Fixed_Allowance

        var locallist = []
        var totalFixedSalary = 0;
        Fixed.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.formula.length > 0) {
                if (newFormula !== undefined && obj.id === id) {
                    if (newFormula === '') { obj.formula = '0'; }
                    else { obj.formula = newFormula; }
                }

                var salaryAnnulay = CTC1 * (obj.formula / 100);
                var salaryMonthy = salaryAnnulay / 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else {
                if (newFlatAmount !== undefined && obj.id === id) {
                    if (newFlatAmount === '') { obj.flatAmount = '0'; }
                    else { obj.flatAmount = newFlatAmount; }
                }
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }
            return obj;
        });

        if (Deduction != null) {
            Deduction.map((obj) => {
                locallist.push(obj);
                if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                    if (newFormula !== undefined && obj.id === id) {
                        if (newFormula === '') { obj.formula = '0'; }
                        else { obj.formula = newFormula; }
                    }
                    var salaryAnnulay = CTC1 * (obj.formula / 100);
                    var salaryMonthy = salaryAnnulay / 12;
                    obj.monthlyAmount = salaryMonthy;
                    obj.yearlyAmount = salaryAnnulay;
                    totalFixedSalary = totalFixedSalary + salaryMonthy;
                }
                else if (obj.flatAmount != null) {
                    if (newFlatAmount !== undefined && obj.id === id) {
                        if (newFlatAmount === '') { obj.flatAmount = '0'; }
                        else { obj.flatAmount = newFlatAmount; }
                    }
                    var salaryMonthy = obj.flatAmount;
                    obj.monthlyAmount = salaryMonthy;
                    obj.yearlyAmount = salaryMonthy * 12;
                }
                return obj;
            });
        }

        const monthlySalary = CTC1 / 12
        const componentTotal1 = monthlySalary - totalFixedSalary;

        this.setState({
            componentTotal: componentTotal1,
            CTC: CTC1,
            list: locallist
        })
    }

    render() {
        strings.setLanguage(this.state.language);
        const { loading, loadingMsg, initValue, dialog } = this.state
        const { designation_dropdown, country_list, state_list, employee_list_dropdown } = this.props

        return (
            loading == true ? <Loader loadingMsg={loadingMsg} /> :
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
                                            {loading ? (
                                                <Loader></Loader>
                                            ) : (
                                                <Row>
                                                    <Col>
                                                        <Formik
                                                            initialValues={initValue}
                                                            ref={this.formRef}
                                                            onSubmit={(values) => {
                                                                this.handleSubmit(values)
                                                            }}
                                                            validate={(values) => {
                                                                let errors = {}
                                                                if (this.state.errorMsg && this.state.CTC && (parseFloat(this.state.CTC) != parseFloat((this.totalYearEarnings()) + (typeof this.state.Deduction === 'object' ? this.totalYearDeductions() : 0)))) {
                                                                    errors.grossEarning = "Gross Earnings should be equal to CTC"
                                                                } else {
                                                                    errors = {}
                                                                }
                                                                return errors;
                                                            }}
                                                            validationSchema={Yup.object().shape({
                                                                CTC: Yup.string()
                                                                    .required("CTC is required")
                                                                    .test("non Zero", "CTC should be greater then zero", (value) => {
                                                                        return parseFloat(value) > 0
                                                                    }),
                                                            })}
                                                        >
                                                            {(props) => (
                                                                <Form onSubmit={props.handleSubmit} name="simpleForm">
                                                                    <div style={{ width: "100%" }}>
                                                                        <div style={{ textAlign: "center" }}>
                                                                            <FormGroup className="mt-3" style={{ textAlign: "center", display: "grid" }} >
                                                                                <div style={{ display: "flex", textAlign: "center", justifyContent: 'center' }}>
                                                                                    <h4 style={{ width: "30%", display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center' }} className="mb-0">
                                                                                        <span className="text-danger">*</span>  {strings.CosttoCompany}  ( CTC ) :
                                                                                    </h4>
                                                                                    <div style={{ width: "20%", paddingRight: "2%" }}>
                                                                                        <Input
                                                                                            type="text"
                                                                                            id="CTC"
                                                                                            size="30"
                                                                                            name="CTC"
                                                                                            maxLength='14,2'
                                                                                            style={{ textAlign: "center" }}
                                                                                            value={props.values.CTC}
                                                                                            placeholder={this.state.ctcType == "MONTHLY" ? "Enter Monthly Wages" : (strings.Enter + strings.ctc)}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) {
                                                                                                    let ctcValue = this.state.ctcType == "ANNUALLY" ? option.target.value : parseFloat(option.target.value) * 12
                                                                                                    props.handleChange('CTC')(option);
                                                                                                    this.setState({ ctcValue: ctcValue })
                                                                                                }
                                                                                                this.updateSalary(this.state.ctcType == "ANNUALLY" ? option.target.value : parseFloat(option.target.value) * 12);
                                                                                            }}
                                                                                            className={props.errors.CTC && props.touched.CTC ? "is-invalid" : ""}
                                                                                        />
                                                                                        {props.errors.CTC && props.touched.CTC && (
                                                                                            <div className="invalid-feedback">{props.errors.CTC}</div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div style={{ width: "20%" }}>
                                                                                        <Select
                                                                                            options={this.state.ctcTypeList}
                                                                                            id="ctcTypeOption"
                                                                                            name="ctcTypeOption"
                                                                                            className="mr-2"
                                                                                            value={this.state.ctcTypeOption}
                                                                                            onChange={(e) => {
                                                                                                this.setState({ ctcTypeOption: e, ctcType: e.label })
                                                                                                this.updateSalary(e.label == "ANNUALLY" ? props.values.CTC : parseFloat(props.values.CTC) * 12);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </FormGroup>
                                                                        </div>
                                                                    </div>
                                                                    <Row>
                                                                        <Col lg={9}>
                                                                            <Row className="ml-2">
                                                                                <h4>{strings.Earnings + ":"}</h4>
                                                                            </Row>
                                                                            <Table className="text-center" style={{ width: '133%' }} >
                                                                                <thead>
                                                                                    <tr style={{ background: '#dfe9f7', color: "Black" }}>
                                                                                        {this.state.Fixed ? this.columnHeader1.map((column, index) => {
                                                                                            return (
                                                                                                <th style={{ border: "3px solid #c8ced3" }}>
                                                                                                    {column.label}
                                                                                                </th>
                                                                                            );
                                                                                        }) : ""}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {this.state.Fixed ? Object.values(
                                                                                        this.state.Fixed,
                                                                                    ).map((item) => (
                                                                                        <tr>
                                                                                            <td style={{ border: "3px solid #c8ced3" }} >{item.description}</td>
                                                                                            <td style={{ border: "3px solid #c8ced3" }}>
                                                                                                <Field
                                                                                                    render={({ field, form }) => (
                                                                                                        <div>
                                                                                                            <div class="input-group">
                                                                                                                {item.formula ?
                                                                                                                    <Input
                                                                                                                        type="number"
                                                                                                                        min="0"
                                                                                                                        max="99"
                                                                                                                        step="0.01"
                                                                                                                        size="30"
                                                                                                                        maxLength={2}
                                                                                                                        style={{ textAlign: "center" }}
                                                                                                                        id="formula"
                                                                                                                        name="formula"
                                                                                                                        value={item.formula}
                                                                                                                        onChange={(option) => {
                                                                                                                            if (option.target.value === '' || this.regDec1.test(option.target.value)) {
                                                                                                                                props.handleChange('formula')(option)
                                                                                                                                this.updateSalary1(this.state.CTC, option.target.value, item.id);
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    /> :
                                                                                                                    <Input
                                                                                                                        maxLength="8"
                                                                                                                        type="text"
                                                                                                                        size="30"
                                                                                                                        style={{ textAlign: "center" }}
                                                                                                                        onChange={(option) => {
                                                                                                                            if (option.target.value === '' || this.regEx.test(option.target.value)) {
                                                                                                                                props.handleChange('flatAmount')(option)
                                                                                                                            }
                                                                                                                            this.updateSalary1(this.state.CTC, undefined, item.id, option.target.value);
                                                                                                                        }}
                                                                                                                        value={item.flatAmount}
                                                                                                                        id='' />
                                                                                                                }
                                                                                                                <div class="dropdown open input-group-append">
                                                                                                                    <div style={{ width: '200px' }}>
                                                                                                                        <Select
                                                                                                                            options={
                                                                                                                                this.type
                                                                                                                                    ? selectOptionsFactory.renderOptions(
                                                                                                                                        'label',
                                                                                                                                        'value',
                                                                                                                                        this.type,
                                                                                                                                        'Type',
                                                                                                                                    )
                                                                                                                                    : []
                                                                                                                            }
                                                                                                                            id="type"
                                                                                                                            name="type"
                                                                                                                            placeholder={strings.Select + strings.Type}
                                                                                                                            value={
                                                                                                                                this.type
                                                                                                                                && selectOptionsFactory.renderOptions(
                                                                                                                                    'label',
                                                                                                                                    'value',
                                                                                                                                    this.type,
                                                                                                                                    'Type',
                                                                                                                                ).find((option) => (item.formula == "" ?
                                                                                                                                    option.value == 1 : option.value == 2))
                                                                                                                            }
                                                                                                                            onChange={(value) => {
                                                                                                                                props.handleChange('type')(value);
                                                                                                                                if (value.value == 1) {
                                                                                                                                    item.formula = ""
                                                                                                                                    item.flatAmount = "1"
                                                                                                                                    this.updateSalary(this.state.CTC)
                                                                                                                                } else {
                                                                                                                                    item.formula = "1"
                                                                                                                                    item.flatAmount = ""
                                                                                                                                    this.updateSalary(this.state.CTC)
                                                                                                                                }
                                                                                                                            }}
                                                                                                                            className={`${props.errors.type && props.touched.type
                                                                                                                                ? 'is-invalid'
                                                                                                                                : ''
                                                                                                                                }`}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                />
                                                                                            </td>
                                                                                            {item.formula ?
                                                                                                (<td style={{ border: "3px solid #c8ced3" }}
                                                                                                >
                                                                                                    <Input
                                                                                                        disabled={true}
                                                                                                        type="text"
                                                                                                        size="30"
                                                                                                        style={{ textAlign: "center" }}
                                                                                                        value={item.monthlyAmount ? (item.monthlyAmount.toLocaleString(
                                                                                                            navigator.language,
                                                                                                            {
                                                                                                                minimumFractionDigits: 2,
                                                                                                                maximumFractionDigits: 2,
                                                                                                            }
                                                                                                        )) : 0.0}
                                                                                                        id=''
                                                                                                    />
                                                                                                </td>
                                                                                                ) : (
                                                                                                    <td style={{ border: "3px solid #c8ced3" }} >
                                                                                                        <Input
                                                                                                            disabled={true}
                                                                                                            maxLength="8"
                                                                                                            type="text"
                                                                                                            size="30"
                                                                                                            style={{ textAlign: "center" }}
                                                                                                            onChange={(option) => {
                                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                                this.updateSalary1(this.state.CTC, undefined, item.id, option.target.value);
                                                                                                            }}
                                                                                                            value={item.flatAmount ? item.flatAmount : 0}
                                                                                                            id='' />
                                                                                                    </td>
                                                                                                )}
                                                                                            {item.formula ?
                                                                                                (<td style={{ border: "3px solid  #c8ced3" }} >
                                                                                                    {item.yearlyAmount ? (item.yearlyAmount
                                                                                                        ? item.yearlyAmount.toLocaleString(
                                                                                                            navigator.language,
                                                                                                            {
                                                                                                                minimumFractionDigits: 2,
                                                                                                                maximumFractionDigits: 2,
                                                                                                            }
                                                                                                        )
                                                                                                        : 0.0) : 0}
                                                                                                </td>
                                                                                                ) : (
                                                                                                    <td style={{ border: "3px solid  #c8ced3" }} >

                                                                                                        {item.flatAmount ? item.flatAmount * 12 : 0.0}
                                                                                                    </td>
                                                                                                )}
                                                                                            <td style={{ border: 'none' }}>
                                                                                                {item.description !== "Basic SALARY" ? (
                                                                                                    <Button
                                                                                                        color='link'

                                                                                                        onClick={() => {
                                                                                                            this.removeComponent(item.id)
                                                                                                        }}
                                                                                                    >
                                                                                                        <i class="far fa-times-circle"></i>
                                                                                                    </Button>)
                                                                                                    : ''}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )) : ""}
                                                                                    <tr>
                                                                                        <td colSpan={4} style={{ border: "3px solid  #c8ced3" }}>
                                                                                            <Button
                                                                                                color="link"
                                                                                                className="pull-left"
                                                                                                onClick={(e, props) => {
                                                                                                    this.openSalaryComponentFixed(props);
                                                                                                    this.renderActionForState()
                                                                                                }}
                                                                                            >
                                                                                                <i className="fa fa-plus"></i>  {strings.AddEarnings}
                                                                                            </Button>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr style={{ background: "#dfe9f7", color: "Black" }}>
                                                                                        <td colSpan={2} style={{ border: "3px solid #c8ced3" }}>
                                                                                            <b className="pull-left">{strings.TotalEarnings + ' (A):'}</b>
                                                                                        </td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {this.totalEarnings()
                                                                                                ? this.totalEarnings().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0}
                                                                                        </b></td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {this.totalYearEarnings()
                                                                                                ? this.totalYearEarnings().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0}
                                                                                        </b></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                        </Col>
                                                                        {this.state.varEarn === true && <Col lg={8}>
                                                                            <Row className='ml-2'>
                                                                                <h4>{strings.VariableEarnings}</h4>
                                                                                <Button
                                                                                    color="link"
                                                                                    className=" mr-3 mb-3"
                                                                                    onClick={(e, props) => {
                                                                                        this.openSalaryComponentVariable(props);
                                                                                        this.renderActionForState()
                                                                                    }}
                                                                                >
                                                                                    <i className="fa fa-plus"></i>  {strings.AddVariable}
                                                                                </Button></Row>
                                                                            <Table className="text-center" style={{ border: "1px solid #c8ced3", width: '150%' }}>
                                                                                <thead style={{ border: "1px solid #c8ced3" }}>
                                                                                    <tr style={{ border: "1px solid #c8ced3", background: '#dfe9f7', color: "Black" }}>
                                                                                        {this.state.Variable ? this.columnHeader1.map((column, index) => {
                                                                                            return (
                                                                                                <th>
                                                                                                    {column.label}
                                                                                                </th>
                                                                                            );
                                                                                        }) : ""}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {this.state.Variable ? (
                                                                                        Object.values(
                                                                                            this.state.Variable,
                                                                                        ).map((item) => (
                                                                                            <tr>
                                                                                                {/* <td >{item.id}</td> */}
                                                                                                <td style={{ border: "1px solid  #c8ced3" }} >{item.description}</td>
                                                                                                {item.formula ?
                                                                                                    (
                                                                                                        <td style={{ border: "1px solid  #c8ced3" }}>
                                                                                                            <Input
                                                                                                                type="number"
                                                                                                                // min="0"
                                                                                                                min="0"
                                                                                                                max="99"
                                                                                                                step="0.01"
                                                                                                                maxLength={2}
                                                                                                                style={{ textAlign: "center" }}
                                                                                                                size="30"
                                                                                                                onChange={(option) => {
                                                                                                                    if (option.target.value === '' || this.regDec1.test(option.target.value)) {
                                                                                                                        props.handleChange('formula')(option)
                                                                                                                        this.updateSalary1(this.state.CTC, option.target.value, item.id);
                                                                                                                    }


                                                                                                                }}
                                                                                                                value={item.formula}
                                                                                                                id=''
                                                                                                            />{' '}% {strings.OfBasic}
                                                                                                        </td>
                                                                                                    ) : (
                                                                                                        <td style={{ border: "1px solid # #c8ced3" }}>{strings.FixedAmount}</td>)
                                                                                                }
                                                                                                {item.formula ?
                                                                                                    (<td style={{ border: "1px solid #c8ced3" }} >
                                                                                                        <Input
                                                                                                            disabled={true}
                                                                                                            type="text"
                                                                                                            size="30"
                                                                                                            style={{ textAlign: "center" }}
                                                                                                            onChange={(option) => {
                                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                                this.updateSalary1(this.state.CTC, option.target.value, item.id);

                                                                                                            }}
                                                                                                            value={item.monthlyAmount.toLocaleString()}
                                                                                                            id='' />
                                                                                                    </td>
                                                                                                    ) : (
                                                                                                        <td style={{ border: "1px solid  #c8ced3" }} >
                                                                                                            <Input
                                                                                                                maxLength="8"
                                                                                                                type="text"
                                                                                                                size="30"
                                                                                                                style={{ textAlign: "center" }}
                                                                                                                onChange={(option) => {
                                                                                                                    if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                                    this.updateSalary1(this.state.CTC, undefined, item.id, option.target.value);

                                                                                                                }}
                                                                                                                value={item.flatAmount}
                                                                                                                id='' />
                                                                                                        </td>
                                                                                                    )}
                                                                                                {item.formula ?
                                                                                                    (<td style={{ border: "1px solid  #c8ced3" }} >

                                                                                                        {(item.yearlyAmount.toLocaleString())}
                                                                                                    </td>
                                                                                                    ) : (
                                                                                                        <td style={{ border: "1px solid  #c8ced3" }} >
                                                                                                            {item.flatAmount * 12}
                                                                                                        </td>
                                                                                                    )}
                                                                                                <td>
                                                                                                    { }
                                                                                                    <Button
                                                                                                        color='link'
                                                                                                        onClick={() => {
                                                                                                            this.removeComponent(item.id)
                                                                                                        }}
                                                                                                    >
                                                                                                        <i class="far fa-times-circle"></i>
                                                                                                    </Button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))) : (
                                                                                        <tr style={{ border: "1px solid #c8ced3" }}></tr>
                                                                                    )}
                                                                                </tbody>
                                                                            </Table>
                                                                        </Col>}
                                                                        <Col lg={8}>
                                                                            <Row className="ml-2 mt-4">
                                                                                <h4>{strings.Deductions + ":"}</h4>
                                                                            </Row>
                                                                            <Table className="text-center" style={{ width: '150%' }}>
                                                                                <thead>
                                                                                    <tr style={{ background: '#dfe9f7', color: "Black" }}>
                                                                                        {this.columnHeader1.map((column, index) => {
                                                                                            return (
                                                                                                <th style={{ border: "3px solid #c8ced3" }}>
                                                                                                    {column.label}
                                                                                                </th>
                                                                                            );
                                                                                        })}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {this.state.Deduction ? (
                                                                                        Object.values(
                                                                                            this.state.Deduction,
                                                                                        ).map((item) => (
                                                                                            <tr>
                                                                                                <td style={{ border: "3px solid #c8ced3" }} >{item.description}</td>
                                                                                                <td style={{ border: "3px solid #c8ced3" }}>
                                                                                                    <Field
                                                                                                        render={({ field, form }) => (
                                                                                                            <div>
                                                                                                                <div class="input-group">
                                                                                                                    {item.formula ?
                                                                                                                        <Input
                                                                                                                            type="number"
                                                                                                                            min="0"
                                                                                                                            max="99"
                                                                                                                            step="0.01"
                                                                                                                            size="30"
                                                                                                                            maxLength={2}
                                                                                                                            style={{ textAlign: "center" }}
                                                                                                                            id="formula"
                                                                                                                            name="formula"
                                                                                                                            value={item.formula}
                                                                                                                            onChange={(option) => {
                                                                                                                                if (option.target.value === '' || this.regDec1.test(option.target.value)) {
                                                                                                                                    props.handleChange('formula')(option)
                                                                                                                                    this.updateSalary1(this.state.CTC, option.target.value, item.id);
                                                                                                                                }
                                                                                                                            }}
                                                                                                                        /> :
                                                                                                                        <Input
                                                                                                                            maxLength="8"
                                                                                                                            type="text"
                                                                                                                            size="30"
                                                                                                                            style={{ textAlign: "center" }}
                                                                                                                            onChange={(option) => {
                                                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                                                this.updateSalary1(this.state.CTC, undefined, item.id, option.target.value);
                                                                                                                            }}
                                                                                                                            value={item.flatAmount}
                                                                                                                            id='' />
                                                                                                                    }
                                                                                                                    <div class="dropdown open input-group-append">
                                                                                                                        <div style={{ width: '200px' }}>
                                                                                                                            <Select
                                                                                                                                options={
                                                                                                                                    this.type
                                                                                                                                        ? selectOptionsFactory.renderOptions(
                                                                                                                                            'label',
                                                                                                                                            'value',
                                                                                                                                            this.type,
                                                                                                                                            'Type',
                                                                                                                                        )
                                                                                                                                        : []
                                                                                                                                }
                                                                                                                                id="type"
                                                                                                                                name="type"
                                                                                                                                placeholder={strings.Select + strings.Type}
                                                                                                                                value={
                                                                                                                                    this.type
                                                                                                                                    && selectOptionsFactory.renderOptions(
                                                                                                                                        'label',
                                                                                                                                        'value',
                                                                                                                                        this.type,
                                                                                                                                        'Type',
                                                                                                                                    ).find((option) => (item.formula == "" ?
                                                                                                                                        option.value == 1 : option.value == 2))
                                                                                                                                }
                                                                                                                                onChange={(value) => {
                                                                                                                                    props.handleChange('type')(value);
                                                                                                                                    if (value.value == 1) {
                                                                                                                                        item.formula = ""
                                                                                                                                        item.flatAmount = "1"
                                                                                                                                        this.updateSalary(this.state.CTC)
                                                                                                                                    } else {
                                                                                                                                        item.formula = "1"
                                                                                                                                        item.flatAmount = ""
                                                                                                                                        this.updateSalary(this.state.CTC)
                                                                                                                                    }
                                                                                                                                }}
                                                                                                                                className={`${props.errors.type && props.touched.type
                                                                                                                                    ? 'is-invalid'
                                                                                                                                    : ''
                                                                                                                                    }`}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    />
                                                                                                </td>
                                                                                                {item.formula ?
                                                                                                    (<td style={{ border: "3px solid #c8ced3" }} >
                                                                                                        <Input
                                                                                                            disabled={true}
                                                                                                            type="text"
                                                                                                            size="30"
                                                                                                            style={{ textAlign: "center" }}
                                                                                                            value={item.monthlyAmount ? (item.monthlyAmount.toLocaleString(
                                                                                                                navigator.language,
                                                                                                                {
                                                                                                                    minimumFractionDigits: 2,
                                                                                                                    maximumFractionDigits: 2,
                                                                                                                }
                                                                                                            )) : 0}
                                                                                                        />
                                                                                                    </td>
                                                                                                    ) : (
                                                                                                        <td style={{ border: "3px solid #c8ced3" }} >
                                                                                                            <Input
                                                                                                                disabled={true}
                                                                                                                maxLength="8"
                                                                                                                type="text"
                                                                                                                size="30"
                                                                                                                onChange={(option) => {
                                                                                                                    if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                                    this.updateSalary1(this.state.CTC, undefined, item.id, option.target.value);

                                                                                                                }}
                                                                                                                style={{ textAlign: "center" }}
                                                                                                                value={item.flatAmount ? (item.flatAmount.toLocaleString(
                                                                                                                    navigator.language,
                                                                                                                    {
                                                                                                                        minimumFractionDigits: 2,
                                                                                                                        maximumFractionDigits: 2,
                                                                                                                    }
                                                                                                                )) : 0}
                                                                                                                id='' />
                                                                                                        </td>
                                                                                                    )}
                                                                                                {item.formula ?
                                                                                                    (<td style={{ border: "3px solid  #c8ced3" }} >
                                                                                                        {item.yearlyAmount ? (item.yearlyAmount.toLocaleString(
                                                                                                            navigator.language,
                                                                                                            {
                                                                                                                minimumFractionDigits: 2,
                                                                                                                maximumFractionDigits: 2,
                                                                                                            }
                                                                                                        )) : 0}
                                                                                                    </td>
                                                                                                    ) : (
                                                                                                        <td style={{ border: "3px solid  #c8ced3" }} >
                                                                                                            {item.flatAmount ? (item.flatAmount * 12) : 0}
                                                                                                        </td>
                                                                                                    )}
                                                                                                <td style={{ borderTop: "0px" }}>
                                                                                                    <Button
                                                                                                        color='link'
                                                                                                        onClick={() => {
                                                                                                            this.removeComponent(item.id)
                                                                                                        }}
                                                                                                    >
                                                                                                        <i class="far fa-times-circle"></i>
                                                                                                    </Button></td>
                                                                                            </tr>
                                                                                        ))) : (
                                                                                        " "
                                                                                    )}
                                                                                    <tr>
                                                                                        <td colSpan={4} style={{ border: "3px solid  #c8ced3" }}>
                                                                                            <Button
                                                                                                color="link"
                                                                                                className="pull-left"
                                                                                                onClick={(e, props) => {
                                                                                                    this.openSalaryComponentDeduction(props);
                                                                                                    this.renderActionForState()
                                                                                                }}
                                                                                            >
                                                                                                <i className="fa fa-plus"></i>  {strings.AddDeduction}
                                                                                            </Button>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr style={{ background: "#dfe9f7", color: "Black" }}>
                                                                                        <td colSpan={2} style={{ border: "3px solid #c8ced3" }}>
                                                                                            <b className="pull-left">{strings.Total + ' ' + strings.Deductions + ' (B):'}</b>
                                                                                        </td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {typeof this.state.Deduction === 'object' ? (this.totalDeductions()
                                                                                                ? this.totalDeductions().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0) : 0}
                                                                                        </b></td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {typeof this.state.Deduction === 'object' ? (this.totalYearDeductions()
                                                                                                ? this.totalYearDeductions().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0) : 0}
                                                                                        </b></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                        </Col>
                                                                        <Col lg={9}>
                                                                            <Row className="ml-2 mt-4">
                                                                                <h4>{strings.Gross + ' ' + strings.Earnings + ':'}</h4>
                                                                            </Row>
                                                                            <Table
                                                                                className="text-center"
                                                                                style={{
                                                                                    width: "133%",
                                                                                    marginBottom: "0px"
                                                                                }}
                                                                            >
                                                                                <tbody>
                                                                                    <tr style={{ background: "#dfe9f7", color: "Black" }}>
                                                                                        <td colSpan={2} style={{ border: "3px solid #c8ced3", width: "50%" }}>
                                                                                            <b className="pull-left">{strings.Gross + ' ' + strings.Earnings + ' (C):'}</b>
                                                                                            <b className="pull-right">{'(A + B)'}</b>
                                                                                        </td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {this.grossEarnings()
                                                                                                ? this.grossEarnings().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0}
                                                                                        </b></td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {this.grossYearEarnings()
                                                                                                ? this.grossYearEarnings().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0}
                                                                                        </b></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                            {this.state.errorMsg && props.errors.grossEarning && (
                                                                                <div style={{ width: '133%' }}>
                                                                                    <div className='pull-right'>
                                                                                        <div className='invalid-feedback d-block' style={{ fontSize: 'medium' }}>
                                                                                            {props.errors.grossEarning}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </Col>
                                                                        <Col lg={9}>
                                                                            <Row className="ml-2 mt-4">
                                                                                <h4>{strings.TotalNetPay + ':'}</h4>
                                                                            </Row>
                                                                            <Table
                                                                                className="text-center"
                                                                                style={{
                                                                                    width: "133%",
                                                                                }}
                                                                            >
                                                                                <tbody>
                                                                                    <tr style={{ background: "#dfe9f7", color: "Black" }}>
                                                                                        <td colSpan={2} style={{ border: "3px solid #c8ced3", width: "50%" }}>
                                                                                            <b className="pull-left">{strings.TotalNetPay + ':'}</b>
                                                                                            <b className="pull-right">{'(C - B)'}</b>
                                                                                        </td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {this.totalEarnings()
                                                                                                ? this.totalEarnings().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0}
                                                                                        </b></td>
                                                                                        <td style={{ border: "3px solid  #c8ced3" }}><b>
                                                                                            {this.totalYearEarnings()
                                                                                                ? this.totalYearEarnings().toLocaleString(
                                                                                                    navigator.language,
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2,
                                                                                                    }
                                                                                                )
                                                                                                : 0.0}
                                                                                        </b></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className='pull-right'>
                                                                        <FormGroup className="text-right">
                                                                            <Button
                                                                                type="submit"
                                                                                color="primary"
                                                                                className="btn-square mr-3"
                                                                                disabled={this.state.disabled}
                                                                                onClick={() => {
                                                                                    this.setState({ errorMsg: true })
                                                                                    //	added validation popup	msg
                                                                                    props.handleBlur();
                                                                                    if (
                                                                                        props.errors == {} && Object.keys(props.errors) == [] && Object.keys(props.errors) != 'grossEarning'
                                                                                    ) {
                                                                                        this.props.commonActions.fillManDatoryDetails();
                                                                                    }
                                                                                }}
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
                                                                                    this.props.history.push('/admin/master/employee/viewEmployee',
                                                                                        { id: this.props.location.state.id })
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
                        <SalaryComponentFixed
                            openSalaryComponentFixed={this.state.openSalaryComponentFixed}
                            closeSalaryComponentFixed={(e) => {
                                this.closeSalaryComponentFixed(e);
                            }}
                            salary_structure_dropdown={this.props.salary_structure_dropdown}
                            salary_component_dropdown={this.props.salary_component_fixed_dropdown}
                            CreateComponent={this.props.createPayrollEmployeeActions.saveSalaryComponent}
                            selectedData={this.state.selectedData}
                        />
                        <SalaryComponentVariable
                            openSalaryComponentVariable={this.state.openSalaryComponentVariable}
                            closeSalaryComponentVariable={(e) => {
                                this.closeSalaryComponentVariable(e);
                            }}
                            salary_structure_dropdown={this.props.salary_structure_dropdown}
                            salary_component_dropdown={this.props.salary_component_varaible_dropdown}
                            CreateComponent={this.props.createPayrollEmployeeActions.saveSalaryComponent}
                            selectedData={this.state.selectedData}
                        />
                        <SalaryComponentDeduction
                            openSalaryComponentDeduction={this.state.openSalaryComponentDeduction}
                            closeSalaryComponentDeduction={(e) => {
                                this.closeSalaryComponentDeduction(e);
                            }}
                            salary_structure_dropdown={this.props.salary_structure_dropdown}
                            salary_component_dropdown={this.props.salary_component_deduction_dropdown}
                            CreateComponent={this.props.createPayrollEmployeeActions.saveSalaryComponent}
                            selectedData={this.state.selectedData}
                        />
                    </div>
                    {this.state.disableLeavePage ? "" : <LeavePage />}
                </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSalaryComponent)
