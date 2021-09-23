import React from 'react';
import { connect } from 'react-redux';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Input,
    Form,
    Label,
    Table,
} from 'reactstrap';
import Select from 'react-select'

import { bindActionCreators } from 'redux'
import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';


import {
    FormGroup,
    Button
} from 'reactstrap'

import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";
import { ImageUploader } from 'components';
import {
    CommonActions
} from 'services/global'
import { selectCurrencyFactory, selectOptionsFactory } from 'utils'


import 'react-datepicker/dist/react-datepicker.css'
import PhoneInput  from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import moment from 'moment'
import * as DetailSalaryComponentAction from '../update_salary_component/actions';
import * as CreatePayrollEmployeeActions from '../create/actions'
import * as PayrollEmployeeActions from '../../actions'
import { DesignationModal, SalaryComponentDeduction, SalaryComponentFixed, SalaryComponentVariable } from 'screens/payrollemp/sections';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import * as DetailEmployeePersonalAction from '../update_emp_personal/actions';
import * as DetailEmployeeEmployementAction from '../update_emp_employemet/actions';
import * as DetailEmployeeBankAction from '../update_emp_bank/actions';


const mapStateToProps = (state) => {
    return ({
        designation_dropdown: state.payrollEmployee.designation_dropdown,
        employee_list_dropdown: state.payrollEmployee.employee_list_dropdown,
        state_list: state.payrollEmployee.state_list,
        country_list: state.payrollEmployee.country_list,
        salary_role_dropdown: state.payrollEmployee.salary_role_dropdown,
        salary_structure_dropdown: state.payrollEmployee.salary_structure_dropdown,
        salary_component_fixed_dropdown: state.payrollEmployee.salary_component_fixed_dropdown,
        salary_component_varaible_dropdown: state.payrollEmployee.salary_component_varaible_dropdown,
        salary_component_deduction_dropdown: state.payrollEmployee.salary_component_deduction_dropdown,
    })
};
const mapDispatchToProps = (dispatch) => {
    return {
        detailSalaryComponentAction:bindActionCreators(DetailSalaryComponentAction,dispatch),
        detailEmployeePersonalAction: bindActionCreators(DetailEmployeePersonalAction, dispatch),
        detailEmployeeEmployementAction: bindActionCreators(DetailEmployeeEmployementAction, dispatch),
        detailEmployeeBankAction: bindActionCreators(DetailEmployeeBankAction, dispatch),
        createPayrollEmployeeActions: bindActionCreators(CreatePayrollEmployeeActions, dispatch),
        payrollEmployeeActions: bindActionCreators(PayrollEmployeeActions, dispatch),
        commonActions: bindActionCreators(CommonActions, dispatch),
    };
};
let strings = new LocalizedStrings(data);
class CreateEmployeePayroll extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            language: window['localStorage'].getItem('language'),
            Fixed: [
                {
                    description: '',
                    flatAmount: '',
                    formula: '',
                    id: '',
                    monthlyAmount: '',
                    yearlyAmount: ''
                },
            ],

            Variable: [
                {
                    description: '',
                    flatAmount: '',
                    formula: '',
                    id: '',
                    monthlyAmount: '',
                    yearlyAmount: ''
                },
            ],
            Deduction: [
                {
                    description: '',
                    flatAmount: '',
                    formula: '',
                    id: '',
                    monthlyAmount: '',
                    yearlyAmount: ''
                },
            ],
            FixedAllowance: [
                {
                    description: '',
                    flatAmount: '',
                    formula: '',
                    id: '',
                    monthlyAmount: '',
                    yearlyAmount: ''
                },
            ],
            list: [],
            isDisabled:false,
            loading: false,
            createMore: false,
            initValue: {
                designationName: '',
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                password: '',
                dob: '',
                referenceCode: '',
                title: '',
                billingEmail: '',
                countryId: '',
                permanentAddress: '',
                presentAddress: '',
                bloodGroup: '',
                mobileNumber: '',
                vatRegestationNo: '',
                currencyCode: '',
                poBoxNumber: '',
                employeeRole: '',
                stateId: '',
                gender: '',
                pincode: '',
                city: '',
                employeeDesignationId: '',
                active: true,
                passportNumber: '',
                passportExpiryDate: '',
                visaNumber: '',
                employeeCode:'',
                visaExpiryDate: '',
                dateOfJoining: '',
                department: '',
                labourCard: '',
                grossSalary: '',
                salaryRoleId: '',
                accountHolderName: '',
                accountNumber: '',
                bankName: '',
                branch: '',
                iban: '',
                parentId: '',
                swiftCode: '',
                accountHolderName: '',
                accountNumber: '',
                bankName: '',
                branch: '',
                iban: '',
                swiftCode: '',
                CTC: '',
                componentTotal: '',
                qualification: '',
                university: '',
                qualificationYearOfCompletionDate:'',
                emergencyContactName1:'',
                emergencyContactNumber2:'',
                emergencyContactRelationship1:'',
                emergencyContactNumber1:'',
                emergencyContactName2:'',
                
            },
            userPhoto: [],
            userPhotoFile: [],
            useractive: false,
            showIcon: false,
            basic: false,
            activeTab: new Array(4).fill('1'),
            openDesignationModal: false,
            openSalaryComponentFixed: false,
            openSalaryComponentVariable: false,
            openSalaryComponentDeduction: false,
            employeeid: '',
            selectedData: {},
            componentTotal: '',
            prefix: '',
            exist: false,
        }        
        this.formRef = React.createRef();       
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

        this.columnHeader1 = [
            { label: 'Component Name', value: 'Component Name', sort: false },
            { label: 'Calculation Type', value: 'Calculation Type', sort: false },
            { label: 'Monthly', value: 'Monthly', sort: false },
            { label: 'Annualy', value: 'Annualy', sort: false },
        ];

        // this.columnHeader2 = [
        //     { label: 'Sr.No', value: 'Sr.No', sort: false },
        //     { label: 'Component Name', value: 'Component Name', sort: false },
        //     { label: 'Monthly', value: 'Monthly', sort: false },
        //     { label: 'Annualy', value: 'Annualy', sort: false },
        // ];
    }

    componentDidMount = () => {
        this.props.createPayrollEmployeeActions.getCountryList();
        this.props.createPayrollEmployeeActions.getStateList();
        this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownFixed();
        this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownDeduction();
        this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownVariable();
        this.props.createPayrollEmployeeActions.getEmployeeDesignationForDropdown();
        this.props.createPayrollEmployeeActions.getEmployeesForDropdown();
        this.props.createPayrollEmployeeActions.getSalaryRolesForDropdown();
        // this.props.employeeActions.getEmployeesForDropdown();
        this.setState({ showIcon: false });

        this.initializeData();
    };

    initializeData = () => {
        this.getEmployeeCode();
        
        // this.props.createPayrollEmployeeActions.getInvoicePrefix().then((response) => {
		// 	this.setState({prefixData:response.data
		// });
		// });
    };

    getSalaryComponentByEmployeeId = () => {
        this.props.createPayrollEmployeeActions.getSalaryComponentByEmployeeId(this.state.employeeid)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        Fixed: res.data.salaryComponentResult.Fixed,
                        Variable: res.data.salaryComponentResult.Variable,
                        Deduction: res.data.salaryComponentResult.Deduction,
                         FixedAllowance : res.data.salaryComponentResult.Fixed_Allowance,
                        loading: false,
                        CTC:this.state.CTC
                    })
                    
                }
                this.updateSalary(this.state.CTC)
            }).catch((err) => {
                this.setState({ loading: false })
                this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
            })
    }
uploadImage = (picture, file) => {
		this.setState({
			userPhoto: picture,
			userPhotoFile: file,
		});
	};

getEmployeeCode=()=>{

    this.props.createPayrollEmployeeActions.getEmployeeCode().then((res) => {
        if (res.status === 200) {
            this.setState({
                initValue: {
                    ...this.state.initValue,
                    ...{ employeeCode: res.data },
                },
            });
            this.formRef.current.setFieldValue('employeeCode', res.data, true,this.validationCheck(res.data));
        }
    });

console.log(this.state.employeeCode)
}
validationCheck = (value) => {
    const data = {
        moduleType: 15,
        name: value,
    };
    this.props.createPayrollEmployeeActions
        .checkValidation(data)
        .then((response) => {
            if (response.data === 'employeeCode already exists') {
                this.setState(
                    {
                        exist: true,
                    },
                    
                    () => {},
                );
            
            } else {
                this.setState({
                    exist: false,
                });
            }
        });
};
    renderActionForState = () => {
        this.props.createPayrollEmployeeActions.getEmployeeById(this.state.employeeid)
            .then((res) => {
                this.setState({
                    selectedData: res.data,

                    loading: false,
                })
            });
    }

    handleSubmitForSalary = (data, resetForm) => {
        this.setState({ disabled: true });
        const {
            employee,
            CTC
        } = data;


        const formData = new FormData();
        formData.append('employee', this.state.employeeid)
        formData.append('grossSalary', CTC != null ? CTC : '')

        formData.append('salaryComponentString', JSON.stringify(this.state.list));
        this.props.createPayrollEmployeeActions
            .saveSalaryComponent(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                        ' Finacial details saved Successfully')
                    this.getSalaryComponentByEmployeeId();
                    this.props.history.push('/admin/payroll/employee');
                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
            })
    }
    removeComponent=(ComponentId)=>{

        this.props.detailSalaryComponentAction.deleteSalaryComponentRow(this.state.employeeid,ComponentId).then((res) => {
            if (res.status === 200) {
                this.getSalaryComponentByEmployeeId();
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert('error', err.data.message)
        });
       
    }
    handleSubmitForFinancial = (data, resetForm) => {
        this.setState({ disabled: true });
        const {
            accountHolderName,
            accountNumber,
            bankName,
            branch,
            iban,
            swiftCode
        } = data;


        const formData = new FormData();
        formData.append('employee', this.state.employeeid)
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
            'iban',
            iban != null ? iban : '',
        )
        formData.append(
            'swiftCode',
            swiftCode != null ? swiftCode : '',
        )
        if(this.state.selectedData.employeeBankDetailsId === null || this.state.selectedData.employeeBankDetailsId === ""){
            this.props.createPayrollEmployeeActions
            .saveEmployeeBankDetails(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                        ' Finacial details saved Successfully')
                    this.toggle(0, '4')
                    this.getSalaryComponentByEmployeeId();
                    this.renderActionForState(this.state.employeeid)
                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
            })
        }else{
            this.props.detailEmployeeBankAction.updateEmployeeBank(formData).then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully!')
                    this.toggle(0, '4')
                    this.getSalaryComponentByEmployeeId();
                    this.renderActionForState(this.state.employeeid)
                }
            }).catch((err) => {
                this.props.commonActions.tostifyAlert('error', err.data.message)
            })
        }
      
    }
    handleSubmitForEmployement = (data, resetForm) => {
        this.setState({ disabled: true });
        const {
            passportNumber,
            passportExpiryDate,
            visaNumber,
            employeeCode,
            visaExpiryDate,
            dateOfJoining,
            department,
            labourCard,
            grossSalary,
            salaryRoleId
        } = data;


        const formData = new FormData();

        formData.append('employee', this.state.employeeid)
        formData.append('salaryRoleId', salaryRoleId);

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
        if (salaryRoleId && salaryRoleId.value) {
            formData.append('salaryRoleId', salaryRoleId.value);
        }
        formData.append(
            'department',
            department != null ? department : '',
        )
        formData.append(
            'labourCard',
            labourCard != null ? labourCard : '',
        )
        formData.append(
            'grossSalary',
            grossSalary != null ? grossSalary : '',
        )
        if(this.state.selectedData.employmentId === null || this.state.selectedData.employmentId === "" ){
        this.props.createPayrollEmployeeActions
            .saveEmployment(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                        ' Employment details saved Successfully')
                    this.toggle(0, '3')
                    this.renderActionForState(this.state.employeeid)
                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
            })
        }else{
            this.props.detailEmployeeEmployementAction.updateEmployment(formData).then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully!')
                    this.toggle(0, '3')
                    this.renderActionForState(this.state.employeeid)
                }
            }).catch((err) => {
                this.props.commonActions.tostifyAlert('error', err.data.message)
            })
        }

    }

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
            employeeDesignationId,
            dob,
            bloodGroup,
            gender,
            salaryRoleId,
            parentId,
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


        const formData = new FormData();
        
        if(typeof this.state.employeeid !=="string"){
         
            formData.append('id', this.state.employeeid);
        }
        
        formData.append('isActive', this.state.useractive);
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
        if (this.state.userPhotoFile.length > 0) {
            formData.append('profilePic ', this.state.userPhotoFile[0]);
        }
        if (gender && gender.value) {
            formData.append('gender', gender.value);
        }
        if (parentId && parentId.value) {
            formData.append('parentId', parentId.value);
        }
            formData.append('bloodGroup', bloodGroup);

        if (countryId && countryId.value) {
            formData.append('countryId', countryId.value);
        }

        if (stateId && stateId.value) {
            formData.append('stateId', stateId.value);
        }
        if (employeeDesignationId && employeeDesignationId.value) {
            formData.append('employeeDesignationId', employeeDesignationId.value);
        }
        if(this.state.employeeid === null || this.state.employeeid === ""){ 
        this.props.createPayrollEmployeeActions
            .createEmployee(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                        'New Employee Created Successfully')
                    this.setState({
                        employeeid: res.data,

                    })
                    this.toggle(0, '2')
                    this.renderActionForState(this.state.employeeid)
                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
            })
        }
        else{
            this.props.detailEmployeePersonalAction.updateEmployeePersonal(formData).then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully!')
                    this.toggle(0, '2')
                    this.renderActionForState(this.state.employeeid)
                }
            }).catch((err) => {
                this.props.commonActions.tostifyAlert('error', err.data.message)
            })
        }
    }


    toggle = (tabPane, tab) => {
        const newArray = this.state.activeTab.slice();
        newArray[parseInt(tabPane, 10)] = tab;
        this.setState({
            activeTab: newArray,
        });
    };

    getStateList = (countryCode) => {
        this.props.createPayrollEmployeeActions.getStateList(countryCode);
    };
    openDesignationModal = (props) => {
        this.setState({ openDesignationModal: true });
    };
    closeDesignationModal = (res) => {
        this.setState({ openDesignationModal: false });
    };

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

    getCurrentUser = (data) => {
        this.props.createPayrollEmployeeActions.getEmployeeDesignationForDropdown().then((res) => {
            if (res.status === 200) {
                this.setState({
                    initValue: {
                        ...this.state.initValue,
                        ...{ employeeDesignationId: res.data.designationName },

                    },

                });
            }
        });
    };


    updateSalary = (CTC1) => {
        const CTC = this.state.CTC
        const Fixed = this.state.Fixed
        const Variable = this.state.Variable
        const Deduction = this.state.Deduction
        const FixedAllowance = this.state.FixedAllowance
     
        var locallist = []
        var basicSalaryAnnulay = 0;
        var basicSalaryMonthy = 0;
        var totalFixedSalary = 0;
        Fixed.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.description === "Basic SALARY") {
                basicSalaryAnnulay = (CTC1 * (obj.formula / 100));
                basicSalaryMonthy = (basicSalaryAnnulay) / 12;
                obj.monthlyAmount = basicSalaryMonthy;
                obj.yearlyAmount = basicSalaryAnnulay;
                totalFixedSalary = totalFixedSalary + basicSalaryMonthy;
            }
            else if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                var salaryMonthy = basicSalaryMonthy * (obj.formula / 100);
                var salaryAnnulay = salaryMonthy * 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else if (obj.flatAmount != null) {
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }

            return obj;
        });
        if(Variable != null){
        Variable.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                var salaryMonthy = basicSalaryMonthy * (obj.formula / 100);
                var salaryAnnulay = salaryMonthy * 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else if (obj.flatAmount != null) {
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }

            return obj;
        });}
        if(Deduction != null){
        Deduction.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                var salaryMonthy = basicSalaryMonthy * (obj.formula / 100);
                var salaryAnnulay = salaryMonthy * 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else if (obj.flatAmount != null) {
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }

            return obj;
        });}



        const monthlySalary = CTC1 / 12
        const componentTotal1 = monthlySalary - totalFixedSalary;

        if(FixedAllowance != null){
            FixedAllowance.map((obj) => {
                locallist.push(obj);
            if (obj.flatAmount != null) {
                 
                    obj.monthlyAmount = componentTotal1;
                    obj.yearlyAmount = componentTotal1 * 12;
               
                }
    
                return obj;
            });}

        this.setState(
            {
                componentTotal: componentTotal1,
                CTC: CTC1,
                list: locallist

            })
    }
    updateSalary1 = (CTC1,newFormula,id,newFlatAmount) => {
        const CTC = this.state.CTC

        const Fixed = this.state.Fixed
        const Variable = this.state.Variable
        const Deduction = this.state.Deduction
        const Fixed_Allowance = this.state.FixedAllowance
     
        var locallist = []
        var basicSalaryAnnulay = 0;
        var basicSalaryMonthy = 0;
        var totalFixedSalary = 0;
        Fixed.map((obj) => {
            locallist.push(obj);
          
            if (obj.formula != null && obj.description === "Basic SALARY") {
                if(newFormula !== undefined && obj.id===id ){
                        if( newFormula === '')
                        {  obj.formula = '0' ;}
                        else
                            { obj.formula=newFormula ;} 
                }
          
                basicSalaryAnnulay = (CTC1 * (obj.formula / 100));
                basicSalaryMonthy = (basicSalaryAnnulay) / 12;
                obj.monthlyAmount = basicSalaryMonthy;
                obj.yearlyAmount = basicSalaryAnnulay;
                totalFixedSalary = totalFixedSalary + basicSalaryMonthy;
            }
            else if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                if(newFormula !== undefined && obj.id===id ){
                    if( newFormula === '')
                    {  obj.formula = '0' ;}
                    else
                        { obj.formula=newFormula ;} 
            }
                var salaryMonthy = basicSalaryMonthy * (obj.formula / 100);
                var salaryAnnulay = salaryMonthy * 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else if (obj.flatAmount != null) {
                if(newFlatAmount !== undefined && obj.id===id ){
                    if( newFlatAmount === '')
                    {  obj.flatAmount = '0' ;}
                    else
                        { obj.flatAmount=newFlatAmount ;} 
            }
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }

            return obj;
        });
        if(Variable != null){
        Variable.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                if(newFormula !== undefined && obj.id===id ){
                    if( newFormula === '')
                    {  obj.formula = '0' ;}
                    else
                        { obj.formula=newFormula ;} 
            }
                var salaryMonthy = basicSalaryMonthy * (obj.formula / 100);
                var salaryAnnulay = salaryMonthy * 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else if (obj.flatAmount != null) {
                if(newFlatAmount !== undefined && obj.id===id ){
                    if( newFlatAmount === '')
                    {  obj.flatAmount = '0' ;}
                    else
                        { obj.flatAmount=newFlatAmount ;} 
            }
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }

            return obj;
        });}
        if(Deduction != null){
        Deduction.map((obj) => {
            locallist.push(obj);
            if (obj.formula != null && obj.description != "Basic SALARY" && obj.formula.length > 0) {
                if(newFormula !== undefined && obj.id===id ){
                    if( newFormula === '')
                    {  obj.formula = '0' ;}
                    else
                        { obj.formula=newFormula ;} 
            }
                var salaryMonthy = basicSalaryMonthy * (obj.formula / 100);
                var salaryAnnulay = salaryMonthy * 12;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryAnnulay;
                totalFixedSalary = totalFixedSalary + salaryMonthy;
            }
            else if (obj.flatAmount != null) {
                if(newFlatAmount !== undefined && obj.id===id ){
                    if( newFlatAmount === '')
                    {  obj.flatAmount = '0' ;}
                    else
                        { obj.flatAmount=newFlatAmount ;} 
            }
                var salaryMonthy = obj.flatAmount;
                obj.monthlyAmount = salaryMonthy;
                obj.yearlyAmount = salaryMonthy * 12;
                totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
            }

            return obj;
        });}



        const monthlySalary = CTC1 / 12
        const componentTotal1 = monthlySalary - totalFixedSalary;
        console.log(componentTotal1, "%$componentTotal")

        if(Fixed_Allowance != null){
            Fixed_Allowance.map((obj) => {
                locallist.push(obj);
            if (obj.flatAmount != null) {
                 
                    obj.monthlyAmount = componentTotal1;
                    obj.yearlyAmount = componentTotal1 * 12;
               
                }
    
                return obj;
            });}

        this.setState(
            {
                componentTotal: componentTotal1,
                CTC: CTC1,
                list: locallist

            })
        console.log(this.state.componentTotal, "componentTotal")
    }
    render() {
        strings.setLanguage(this.state.language);
        const {	exist}=this.state
        const { salary_role_dropdown, designation_dropdown, country_list, state_list, employee_list_dropdown } = this.props
        return (
            <div className="financial-report-screen">
                <div className="animated fadeIn">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col lg={12}>
                                    <div className="h4 mb-0 d-flex align-items-center">
                                        <i className="nav-icon fas fa-user-tie" />
                                        <span className="ml-2">{strings.CreateEmployee}</span>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody >
                            <Nav className="justify-content-center" tabs pills  >
                                <NavItem>
                                    <NavLink
                                        active={this.state.activeTab[0] === '1'}
                                    // onClick={() => {
                                    // 	this.toggle(0, '1');
                                    // }}
                                    >
                                         {strings.BasicDetails}
									</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        active={this.state.activeTab[0] === '2'}
                                        // onClick={() => {
                                        //     this.toggle(0, '2');
                                        // }}
                                    >
                                        {strings.Employment}
									</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        active={this.state.activeTab[0] === '3'}
                                    // onClick={() => {
                                    // 	this.toggle(0, '3');
                                    // }}
                                    >
                                         {strings.FinancialDetails}
									</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        active={this.state.activeTab[0] === '4'}
                                    // onClick={() => {
                                    // 	this.toggle(0, '4');
                                    // }}
                                    >
                                        {strings.SalarySetup}
									</NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab[0]}>
                                <TabPane tabId="1">

                                    <div className="create-employee-screen">
                                        <div className="animated fadeIn">
                                            <Row>
                                                <Col lg={12} className="mx-auto">
                                                    <div>
                                                   
                                               
                                                            <Row>
                                                                <Col lg={12}>
                                                                    <Formik
                                                                        initialValues={this.state.initValue}
                                                                        onSubmit={(values, { resetForm }) => {
                                                                            this.handleSubmit(values, resetForm)
                                                                        }}
                                                                      
                                                                        validationSchema={Yup.object().shape({
                                                                            firstName: Yup.string()
                                                                                .required("First Name is Required"),
                                                                            lastName: Yup.string()
                                                                            .required("Last Name is Required"),
                                                                            email: Yup.string()
                                                                            .required("Valid Email Required"),
                                                                            mobileNumber:Yup.string()
                                                                            .required("mobile number Required"),
                                                                            // salaryRoleId :  Yup.string()
                                                                            // .required(" Employee Role is required"),
                                                                            dob: Yup.date()
                                                                            .required('DOB is Required') ,
                                                                          
                                                                            active : Yup.string()
                                                                            .required('status is Required') ,  
                                                                            employeeDesignationId : Yup.string()
                                                                            .required('Designation is Required') ,
                                                                        })}
                                                                    >
                                                                        {(props) => (

                                                                            <Form onSubmit={props.handleSubmit}>

                                                                                <Row>
                                                                                    <Col xs="4" md="4" lg={2}>
                                                                                        <FormGroup className="mb-3 text-center">
                                                                                            <ImageUploader
                                                                                                // withIcon={true}
                                                                                                buttonText="Choose image"
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
                                                                                                defaultImages={this.state.userPhoto}
                                                                                                imageState={this.state.imageState}
                                                                                            />
                                                                                        </FormGroup>
                                                                                    </Col>

                                                                                    <Col xs="4" md="4" lg={10}>
                                                                                        <Row className="row-wrapper">

                                                                                            <Col lg={4}>
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="select"><span className="text-danger">*</span> {strings.FirstName}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="firstName"
                                                                                                        name="firstName"
                                                                                                        value={props.values.firstName}
                                                                                                        placeholder={strings.Enter+strings.FirstName}

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
                                                                                                    <Label htmlFor="select">{strings.MiddleName}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="middleName"
                                                                                                        name="middleName"
                                                                                                        value={props.values.middleName}
                                                                                                        placeholder={strings.Enter+strings.MiddleName}
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
                                                                                                        placeholder={strings.Enter+strings.LastName}
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">*</span> {strings.Email}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="email"
                                                                                                        name="email"
                                                                                                        value={props.values.email}
                                                                                                        placeholder={strings.Enter+strings.EmailAddress}
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
                                                                                                    <Label htmlFor="date"><span className="text-danger">*</span>{strings.DateOfBirth}</Label>
                                                                                                    <DatePicker
                                                                                                        className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                                                                                        id="dob"
                                                                                                        name="dob"
                                                                                                        placeholderText={strings.Select+strings.DateOfBirth}
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
                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="mobileNumber"><span className="text-danger">*</span>
                                                                                                         {strings.MobileNumber}
															                                    		</Label>
                                                                                                    <PhoneInput
                                                                                                        id="mobileNumber"
                                                                                                        name="mobileNumber"
                                                                                                        country={"ae"}
                                                                                                        enableSearch={true}
                                                                                                        international
                                                                                                        value={props.values.mobileNumber}
                                                                                                        placeholder={strings.Enter+strings.MobileNumber}
                                                                                                        onBlur={props.handleBlur('mobileNumber')}
                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('mobileNumber')(
                                                                                                                option,
                                                                                                            );
                                                                                                        }}
                                                                                                        className={
                                                                                                            props.errors.mobileNumber &&
                                                                                                                props.touched.mobileNumber
                                                                                                                ? 'text-danger'
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                     {props.errors.mobileNumber && props.touched.mobileNumber && (
                                                                                                        <div className="text-danger">{props.errors.mobileNumber}</div>
                                                                                                    )}
                                                                                                   
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            {/* <Col md="4">
                                                                                                <FormGroup className="mb-3">
                                                                                                    <Label htmlFor="active"><span className="text-danger">*</span>{strings.Status}</Label>
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
                                                                                            </Col> */}

                                                                                        </Row>
                                                                                        <Row> <Col md="4">
                                                                                                <FormGroup className="mb-3">
                                                                                                    <Label htmlFor="active"><span className="text-danger">*</span>{strings.Status}</Label>
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
                                                                                                    <Label htmlFor="gender">{strings.Gender}</Label>
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
                                                                                                        placeholder={strings.Select+strings.Gender}
                                                                                                        value={this.state.gender}
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
                                                                                                                    'Blood Group',
                                                                                                                )
                                                                                                                : []
                                                                                                        }
                                                                                                        id="bloodGroup"
                                                                                                        name="bloodGroup"
                                                                                                        placeholder={strings.Select+strings.BloodGroup}
                                                                                                        value={this.state.bloodGroup}
                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('bloodGroup')(option.value);

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
                                                                                                    <Label htmlFor="parentId">{strings.ReportsTo}</Label>
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
                                                                                                        placeholder={strings.Select+strings.SuperiorEmployeeName}
                                                                                                        value={this.state.parentId}
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
                                                                                                    <Label htmlFor="salaryRoleId">{strings.SalaryRole} </Label>
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
                                                                                                        placeholder={strings.Select+strings.SalaryRole}
                                                                                                        value={
                                                                                                            salary_role_dropdown.data
                                                                                                            && selectOptionsFactory.renderOptions(
                                                                                                                'label',
                                                                                                                'value',
                                                                                                                salary_role_dropdown.data,
                                                                                                                'Salary Role',
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
                                                                                                    <Label htmlFor="employeeDesignationId"><span className="text-danger">*</span>{strings.Designation}</Label>
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
                                                                                                        placeholder={strings.Select+strings.Designation}
                                                                                                        value={this.state.salaryDesignation}
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
                                                                                            <Col>
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
                                                                                                    <i className="fa fa-plus"></i>  {strings.AddDesignation}
															                            	</Button>
                                                                                            </Col>


                                                                                        </Row>
                                                                                        
                                                                                        <Row className="row-wrapper">
                                                                                            <Col md="8">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="gender"> {strings.PresentAddress} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="presentAddress"
                                                                                                        name="presentAddress"
                                                                                                        placeholder={strings.Enter+strings.PresentAddress}
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
                                                                                                    <Label htmlFor="city"> {strings.PinCode} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="pincode"
                                                                                                        name="pincode"
                                                                                                        placeholder={strings.Enter+strings.PinCode}
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
                                                                                                        placeholder={strings.Select+strings.Country}
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
                                                                                                        value={props.values.stateId}
                                                                                                        onChange={(option) => {
                                                                                                            if (option && option.value) {
                                                                                                                props.handleChange('stateId')(option);
                                                                                                            } else {
                                                                                                                props.handleChange('stateId')('');
                                                                                                            }
                                                                                                        }}
                                                                                                        placeholder={strings.Select+strings.StateRegion}
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
                                                                                                    <Label htmlFor="state">{strings.City}     </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="city"
                                                                                                        name="city"
                                                                                                        placeholder={strings.Enter+strings.City}
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
                                                                                                        <hr></hr>
                                                                                                        <h4 className="mb-3 mt-3">{strings.EducationDetails}</h4>
                                                                                        <Row>
                                                                                       
                                                                                          <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="university"> {strings.University} </Label>
                                                                                                    <Input
                                                                                                        type="text"
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
                                                                                                    <Label htmlFor="emergencyContactName1">{strings.ContactName1}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="emergencyContactName1"
                                                                                                        name="emergencyContactName1"
                                                                                                         placeholder={strings.Enter+strings.ContactName1}
                                                                                                        onChange={(value) => { props.handleChange("emergencyContactName1")(value) }}
                                                                                                        value={props.values.uemergencyContactName1}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactName1 && props.touched.emergencyContactName1
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.emergencyContactName1 && props.touched.emergencyContactName1 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactName1}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactNumber1"> {strings.ContactNumber1} </Label>
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
                                                                                                        }}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactNumber1 &&
                                                                                                                props.touched.emergencyContactNumber1
                                                                                                                ? 'is-invalid'
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                     {props.errors.emergencyContactNumber1 && props.touched.memergencyContactNumber1 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactNumber1}</div>
                                                                                                    )}
                                                                                                   

                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactRelationship1"> {strings.Relationship1} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="emergencyContactRelationship1"
                                                                                                        name="emergencyContactRelationship1"
                                                                                                        placeholder={strings.Enter+strings.Relationship1}
                                                                                                        onChange={(value) => { props.handleChange("emergencyContactRelationship1")(value) }}
                                                                                                        value={props.values.emergencyContactRelationship1e}
                                                                                                        className={
                                                                                                            props.errors.emergencyContactRelationship1 && props.touched.emergencyContactRelationship1
                                                                                                                ? "is-invalid"
                                                                                                                : ""
                                                                                                        }
                                                                                                    />
                                                                                                    {props.emergencyContactRelationship1 && props.touched.emergencyContactRelationship1 && (
                                                                                                        <div className="invalid-feedback">{props.errors.emergencyContactRelationship1}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                           
                                                                                          <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactName2"> {strings.ContactName2}</Label>
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
                                                                                                   
                                                                                                </FormGroup>
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactRelationship2"> {strings.Relationship2} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="emergencyContactRelationship2"
                                                                                                        name="emergencyContactRelationship2"
                                                                                                         placeholder={strings.Enter+strings.Relationship2}
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

                                                                                <Row>
                                                                                    <Col lg={12} className="mt-5">
                                                                                      
                                                                                    {/* <Button  color="secondary" className="btn-square"
                                                                                              
                                                                                               
                                                                                            >
                                                                                                <i className="fa fa-ban"></i> Back
                                                                                              </Button> */}
                                                                                            <Button name="button" color="primary" className="btn-square pull-right"
                                                                                                // onClick={() => {
                                                                                                //     this.toggle(0, '2')
                                                                                                // }}
                                                                                                onClick={() => {
                                                                                                    this.setState({ createMore: false }, () => {
                                                                                                        props.handleSubmit()
                                                                                                    })
                                                                                                }}
                                                                                            >
                                                                                                 {strings.Next}<i class="far fa-arrow-alt-circle-right ml-1"></i>
                                                                                              </Button>

                                                                                    
                                                                                    </Col>
                                                                                </Row>
                                                                            </Form>
                                                                        )
                                                                        }
                                                                    </Formik>
                                                                </Col>
                                                            </Row>
                                               
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tabId="2">

                                    <div className="create-employee-screen">
                                        <div className="animated fadeIn">
                                            <Row>
                                                <Col lg={12} className="mx-auto">
                                                    <div>
                                             
                                                 
                                                            <Row>
                                                                <Col lg={12}>
                                                                    <Formik
                                                                    ref={this.formRef}
                                                                        initialValues={this.state.initValue}
                                                                        onSubmit={(values, { resetForm }) => {
                                                                            this.handleSubmitForEmployement(values, resetForm)
                                                                        }}
                                                                        validate={(values) => {
                                                                            let errors = {};
                                                                            if (exist === true) {
                                                                                errors.employeeCode =
                                                                                    'employeeCode Number already exists';
                                                                            }
                                                                            return errors;
                                                                        }}
                                                                        validationSchema={Yup.object().shape({
                                                                            employeeCode: Yup.string()
                                                                                .required("employee Code is Required"),
                                                                            //     salaryRoleId: Yup.string()
                                                                            // .required("salary Role is Required"),
                                                                
                                                                            dateOfJoining: Yup.date()
                                                                                .required('date Of Joining is Required')                   
                                                                        })}
                                                                    >
                                                                        {(props) => (

                                                                            <Form onSubmit={props.handleSubmit}>

                                                                                <Row>


                                                                                    <Col xs="4" md="4" lg={10}>
                                                                                        <Row>
                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="select"><span className="text-danger">*</span> {strings.EmployeeCode}  </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="employeeCode"
                                                                                                        name="employeeCode"
                                                                                                        value={props.values.employeeCode}
                                                                                                        placeholder={strings.Enter+strings.EmployeeCode}
                                                                                                        // onChange={(value) => {
                                                                                                        //     props.handleChange('employeeCode')(value);
                                                                                                        // }}

                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('employeeCode')(
                                                                                                                option,
                                                                                                            );
                                                                                                            this.validationCheck(option.target.value);
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
                                                                                                    <Label htmlFor="labourCard"> {strings.LabourCard}</Label>
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
                                                                                            {/* <Col md="4">
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
                                                                                                        placeholder="Select salary Role "
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
                                                                                            </Col> */}
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
                                                                                                    <Label htmlFor="select"> {strings.Department}  </Label>
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
                                                                                                <FormGroup className="mb-3">
                                                                                                    <Label htmlFor="dateOfJoining"><span className="text-danger">*</span>{strings.DateOfJoining}</Label>
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
                                                                                                    <Label htmlFor="visaExpiryDate">{strings.VisaExpiryDate} </Label>
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
                                                                                    <Col lg={12} className="mt-5">
                                                                                    <Button name="button" color="primary" className="btn-square"
                                                                                                onClick={() => {
                                                                                                    this.toggle(0, '1')
                                                                                                }}
                                                                                               
                                                                                            >
                                                                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> Back
                                                                                              </Button>
                                                                                            <Button name="button" color="primary" className="btn-square pull-right"
                                                                                                // onClick={() => {
                                                                                                //     this.toggle(0, '3')
                                                                                                // }}
                                                                                                onClick={() => {
                                                                                                    this.setState({ createMore: false }, () => {
                                                                                                        props.handleSubmit()
                                                                                                    })
                                                                                                }}
                                                                                            >
                                                                                           {strings.Next}<i class="far fa-arrow-alt-circle-right ml-1"></i>
                                                                                              </Button>

                                                                                    </Col>
                                                                                </Row>
                                                                            </Form>
                                                                        )
                                                                        }
                                                                    </Formik>
                                                                </Col>
                                                            </Row>
                                                
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>

                                </TabPane>
                                <TabPane tabId="3">
                                    <div className="create-employee-screen">
                                        <div className="animated fadeIn">
                                            <Row>
                                                <Col lg={12} className="mx-auto">
                                                    <div>
                                
                                           
                                                            <Row>
                                                                <Col lg={12}>
                                                                    <Formik
                                                                        initialValues={this.state.initValue}
                                                                        onSubmit={(values, { resetForm }) => {
                                                                            this.handleSubmitForFinancial(values, resetForm)
                                                                        }}
                                                                        validationSchema={Yup.object().shape({
                                                                            accountHolderName: Yup.string()
                                                                                .required("Account Holder Name is Required"),
                                                                            accountNumber: Yup.string()
                                                                            .required("Account Number is Required"),
                                                                            
                                                                                           
                                                                        })}
                                                                    >
                                                                        {(props) => (

                                                                            <Form onSubmit={props.handleSubmit}>

                                                                                <Row>


                                                                                    <Col xs="4" md="4" lg={10}>
                                                                                        <h4> {strings.BankDetails} </h4>
                                                                                       

                                                                                        <Row  >
                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="select"><span className="text-danger">*</span>{strings.AccountHolderName}  </Label>
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
                                                                                                    <Label htmlFor="select"> {strings.BankName} </Label>
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
                                                                                                    <Label htmlFor="select">{strings.IBANNumber}</Label>
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
                                                                                <Row>
                                                                                    <Col lg={12} className="mt-5">
                                                                                    <Button name="button" color="primary" className="btn-square "
                                                                                                onClick={() => {
                                                                                                    this.toggle(0, '2')
                                                                                                }}
                                                                                              
                                                                                            >
                                                                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> Back
                                                                                              </Button>
                                                                                            <Button name="button" color="primary" className="btn-square pull-right "
                                                                                                onClick={() => {
                                                                                                    this.setState({ createMore: false }, () => {
                                                                                                        props.handleSubmit()
                                                                                                    })
                                                                                                }}
                                                                                            >
                                                                                                 {strings.Next} <i class="far fa-arrow-alt-circle-right ml-1"></i>
                                                                                              </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Form>
                                                                        )
                                                                        }
                                                                    </Formik>
                                                                </Col>
                                                            </Row>
                                     
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>


                                    {/* <div className="table-wrapper">
                                        <FormGroup className="text-center">
                                            <Button color="secondary" className="btn-square"
                                                onClick={() => { this.toggle(0, '2') }}>
                                                <i className="fa fa-ban"></i> Back
                                      </Button>
                                            <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                                this.setState({ createMore: false }, () => {
                                                    //   props.handleSubmit()
                                                })
                                            }}>
                                                <i className="fa fa-dot-circle-o"></i> Save
                                      </Button>
                                            <Button name="button" color="primary" className="btn-square mr-3"
                                                onClick={() => {
                                                    this.toggle(0, '4')
                                                }}>
                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> Next
                                      </Button>

                                        </FormGroup>
                                    </div> */}
                                </TabPane>
                                <TabPane tabId="4">
                                   
                                    <Formik
                                        initialValues={this.state.initValue}
                                        onSubmit={(values, { resetForm }) => {
                                            this.handleSubmitForSalary(values, resetForm)
                                        }}
                                        validationSchema={Yup.object().shape({
                                            CTC: Yup.string()
                                                .required("CTC is Required"),
                                            // lastName: Yup.string()
                                            // .required("Last Name is Required"),
                                            // email: Yup.string()
                                            // .email("Valid Email Required"),
                                            // employeeDesignationId : Yup.string()
                                            // .required("Designation is required"),
                                            // salaryRoleId :  Yup.string()
                                            // .required(" Employee Role is required"),
                                            // dob: Yup.date()
                                            //     .required('DOB is Required')                   
                                        })}
                                    >
                                        {(props) => (

                                            <Form onSubmit={props.handleSubmit}>
                                              <div style={{width:"100%"}}> 
                                             
                                                <div style={{textAlign:"center"}}>
                                                        <FormGroup className="mt-3"   style={{textAlign:"center",display: "inline-grid"}} >
                                                         <Label><span className="text-danger">*</span>  CTC : </Label>
                                                            <Input
                                                                type="text"
                                                                id="CTC"
                                                                size="30"
                                                                name="CTC"
                                                                maxLength='10'
                                                                style={{textAlign:"center"}}
                                                                value={props.values.CTC}
                                                                placeholder={strings.Enter+"CTC"}
                                                                onChange={(option) => {
                                                                    if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('CTC')(option) }
                                                                    this.updateSalary(option.target.value);

                                                                }}
                                                                className={props.errors.CTC && props.touched.CTC ? "is-invalid" : ""}
                                                            />
                                                            {props.errors.CTC && props.touched.CTC && (
                                                                <div className="invalid-feedback">{props.errors.CTC}</div>
                                                            )}
                                                        </FormGroup>
                                                        </div>
                                               
                                                </div> 
                                                <Row >
                                                    
                                                    <Row className='m-4'>
                                                        <Col lg={9}>
                                                            <Row  className='ml-2'>  
                                                                 <h4>{strings.FixedEarnings}</h4>
                                                                
                                                                <Button
                                                                color="link"
                                                                 className=" mr-3 mb-3"
                                                                onClick={(e, props) => {
                                                                    this.openSalaryComponentFixed(props);
                                                                    this.renderActionForState()
                                                                }}
                                                            >
                                                                <i className="fa fa-plus"></i>  {strings.AddFixed}
																</Button>
                                                             
                                                                </Row>
                                                           
                                                            <Table className="text-center" style={{border:"3px solid #c8ced3",    width: '133%'}} >
                                                                <thead style={{border:"3px solid #c8ced3"}}>
                                                                      <tr style={{border:"3px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        { this.state.Fixed ? this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        }): ""}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.values(
                                                                     this.state.Fixed,
                                                                    ).map((item) => (
                                                                        <tr>
                                                                            {/* <td >{item.id}</td> */}
                                                                            <td style={{border:"3px solid #c8ced3"}} >{item.description}</td>
                                                                            {item.formula ?
                                                                                (
                                                                                    <td style={{border:"3px solid #c8ced3"}}>
                                                                                        <Input
                                                                                            type="number"
min="0"
                                                                                            size="30"
                                                                                            style={{textAlign:"center"}}
                                                                                            id="formula"
                                                                                            name="formula"
                                                                                            value={item.formula}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,option.target.value,item.id);
    
                                                                                            }}        
                                                                                        />{item.description !== 'Basic SALARY' ? ( ' % of Basic') : ( ' % of CTC')}
                                                                                    </td>
                                                                                ) : (
                                                                                    <td style={{border:"3px solid #c8ced3"}}> {strings.FixedAmount}</td>)
                                                                            }
                                                                            {item.formula ?
                                                                                (<td style={{border:"3px solid #c8ced3"}}
                                                                                 >
                                                                                      <Input
                                                                                           disabled={true}
                                                                                        type="text"
                                                                                        size="30"
                                                                                        style={{textAlign:"center"}}
                                                                                        value={item.monthlyAmount ? item.monthlyAmount.toLocaleString() : 0.00 }
                                                                                        id='' />
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"3px solid #c8ced3"}} >
                                                                                        <Input
                                                                                            type="text"
                                                                                            size="30"
                                                                                            style={{textAlign:"center"}}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value);
    
                                                                                            }}  
                                                                                            value={item.flatAmount}
                                                                                            id='' />
                                                                                    </td>
                                                                                )}

                                                                            {item.formula ?
                                                                                (<td style={{border:"3px solid  #c8ced3"}} >
                                                                                     
                                                                                        {item.yearlyAmount ?  item.yearlyAmount.toLocaleString() : 0.00}
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"3px solid  #c8ced3"}} >
                                                                                  
                                                                                          {item.flatAmount ? item.flatAmount* 12 : 0.00}
                                                                                    </td>
                                                                                )}
                                                                                  <td>    
                                                                              { item.description !== "Basic SALARY" ?(
                                                                                        <Button 
                                                                                          color='link'

                                                                                          onClick={()=>{
                                                                                           this.removeComponent(item.id)
                                                                                          }}
                                                                                        >
                                                                                           <i class="far fa-times-circle"></i>
                                                                                       </Button>) : ''}</td>
                                                                               
                                                                        </tr>
                                                                      
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                          
                                                        </Col>
                                                        <Col lg={9}>
                                                            <Row  className='ml-2'> 
                                                                <h4> {strings.VariableEarnings}</h4>
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
                                                            <Table className="text-center" style={{border:"3px solid #c8ced3",    width: '133%'}}>
                                                            <thead style={{border:"3px solid #c8ced3"}}>
                                                                      <tr style={{border:"3px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        { this.state.Variable ? this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        }) : ""}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.Variable  ? (
                                                                    Object.values(
                                                                        this.state.Variable,
                                                                    ).map((item) => (
                                                                        <tr>
                                                                            {/* <td >{item.id}</td> */}
                                                                            <td style={{border:"3px solid  #c8ced3"}} >{item.description}</td>
                                                                            {item.formula ?
                                                                                (
                                                                                    <td style={{border:"3px solid  #c8ced3"}}>
                                                                                        <Input
                                                                                            type="number"
min="0"
                                                                                            style={{textAlign:"center"}}
                                                                                            size="30"
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,option.target.value,item.id);
    
                                                                                            }}   
                                                                                            value={item.formula}
                                                                                            id=''
                                                                                        />{' '}% of Basic
                                                                                    </td>
                                                                                ) : (
                                                                                    <td style={{border:"3px solid # #c8ced3"}}>{strings.FixedAmount}</td>)
                                                                            }
                                                                            {item.formula ?
                                                                                (<td style={{border:"3px solid #c8ced3"}} >
                                                                                      <Input
                                                                                           disabled={true}
                                                                                        type="text"
                                                                                        size="30"
                                                                                        style={{textAlign:"center"}}
                                                                                          
                                                                                        value={item.monthlyAmount.toLocaleString()}
                                                                                        id='' />
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"3px solid  #c8ced3"}} >
                                                                                        <Input
                                                                                            type="text"
                                                                                            size="30"
                                                                                            style={{textAlign:"center"}}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value);
    
                                                                                            }}  
                                                                                            value={item.flatAmount}
                                                                                            id='' />
                                                                                    </td>
                                                                                )}

                                                                        {item.formula ?
                                                                                (<td style={{border:"3px solid  #c8ced3"}} >
                                                                                     
                                                                                        {(item.yearlyAmount.toLocaleString())}
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"3px solid  #c8ced3"}} >
                                                                                     {item.flatAmount * 12}
                                                                                    </td>
                                                                                )}
                                                                                 <td>    
                                                                            {}
                                                                                        <Button 
                                                                                          color='link'

                                                                                          onClick={()=>{
                                                                                           this.removeComponent(item.id)
                                                                                          }}
                                                                                        >
                                                                                           <i class="far fa-times-circle"></i>
                                                                                       </Button></td>
                                                                        

                                                                        </tr>
                                                                    ))): (
                                                                        <tr style={{border:"3px solid #c8ced3"}}></tr>
                                                                    )}
                                       
                                                                  
                                                                </tbody>
                                                            </Table>
                                                          
                                                        </Col>
                                                        <Col lg={9}>
                                                            <Row  className='ml-2'>    
                                                            <h4> {strings.Deductions}</h4>
                                                              <Button
                                                               color="link"
                                                               className=" mr-3 mb-3"
                                                                onClick={(e, props) => {
                                                                    this.openSalaryComponentDeduction(props);
                                                                    this.renderActionForState()
                                                                }}
                                                            >
                                                                <i className="fa fa-plus"></i>  {strings.AddDeduction}
																</Button></Row>
                                                            <Table className="text-center" style={{border:"3px solid #c8ced3", width: '133%'}}>
                                                            <thead style={{border:"3px solid #c8ced3"}}>
                                                                      <tr style={{border:"3px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        {this.state.Deduction ? this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        }) : ""}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.Deduction  ? (
                                                                    Object.values(
                                                                        this.state.Deduction,
                                                                    ).map((item) => (
                                                                        <tr>
                                                                            {/* <td >{item.id}</td> */}
                                                                            <td style={{border:"3px solid #c8ced3"}} >{item.description}</td>
                                                                            {item.formula ?
                                                                                (
                                                                                    <td style={{border:"3px solid #c8ced3"}}>
                                                                                        <Input
                                                                                            type="number"
min="0"
                                                                                            size="30"
                                                                                            className="text-center"
                                                                                            value={item.formula}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,option.target.value,item.id);
    
                                                                                            }}        
                                                                                        />{' '}% of Basic
                                                                                    </td >
                                                                                ) : (
                                                                                    <td style={{border:"3px solid #c8ced3"}}>{strings.FixedAmount}</td>)
                                                                            }
                                                                            {item.formula ?
                                                                                (<td style={{border:"3px solid #c8ced3"}} >
                                                                                    <Input
                                                                                    disabled={true}
                                                                                        type="text"
                                                                                        size="30"
                                                                                        style={{textAlign:"center"}}
                                                                                        value={item.monthlyAmount.toLocaleString()}
                                                                                    />
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"3px solid #c8ced3"}} >
                                                                                        <Input
                                                                                            type="text"
                                                                                            size="30"
                                                                                            style={{textAlign:"center"}}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value);
    
                                                                                            }}  
                                                                                            value={item.flatAmount}
                                                                                            id='' />
                                                                                    </td>
                                                                                )}

                                                                        {item.formula ?
                                                                                (<td style={{border:"3px solid  #c8ced3"}} >
                                                                                     
                                                                                        {item.yearlyAmount.toLocaleString()}
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"3px solid  #c8ced3"}} >
                                                                                      {item.flatAmount * 12}
                                                                                    </td>
                                                                                )}
                                                                                  <td>    
                                                                            {}
                                                                                        <Button 
                                                                                          color='link'

                                                                                          onClick={()=>{
                                                                                           this.removeComponent(item.id)
                                                                                          }}
                                                                                        >
                                                                                           <i class="far fa-times-circle"></i>
                                                                                       </Button></td>
                                                                        
                                                                        </tr>
                                                                    ))) : (
                                                                        " "
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                       
                                                        </Col>
                                                        <Col lg={9}>
                                                            <Table className="text-center" style={{border:"3px solid #c8ced3" ,    width: '133%'}}>
                                                            {/* <thead style={{border:"3px solid #dfe9f7"}}>
                                                                      <tr style={{border:"3px solid #dfe9f7",    background: '#dfe9f7',color:"Black"}}>
                                                                        {this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                </thead> */}
                                                                <tbody> 
                                                                    {this.state.FixedAllowance  ? (
                                                                    Object.values(
                                                                        this.state.FixedAllowance,
                                                                    ).map((item) => (
                                                                    <Row >
                                                                        <Col className="p-2"  >{item.description ? item.description : "-"}</Col>
                                                                        <Col className="p-2" > {"-"} </Col>
                                                                        <Col className="p-2" > {item.monthlyAmount ? item.monthlyAmount.toLocaleString() :"-"} </Col>
                                                                        <Col className="p-2" >{item.yearlyAmount ? item.yearlyAmount.toLocaleString() : "-"}</Col>
                                                                    </Row>
                                                                      ))) : (
                                                                       ""
                                                                    )}
                                                                </tbody>
                                                            </Table>
                                                          
                                                        </Col>
                                                        <Col lg={9}>
                                                            <Table className="text-center"  style={{border:"3px solid #c8ced3",    width: '133%'}}>
                                                            {/* <thead style={{border:"3px solid #c8ced3"}}>
                                                                      <tr style={{border:"3px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        {this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                </thead>  */}
                                                                <tbody>
                                                                <Row >
                                                                        <Col className="p-2" >{"Company Cost"}</Col>
                                                                        <Col className="p-2"  > {"-"} </Col>
                                                                        <Col className="p-2"  >{props.values.CTC ? (props.values.CTC / 12).toLocaleString() :"-"}</Col>
                                                                        <Col className="p-2" >{props.values.CTC ? props.values.CTC : "-"}</Col>
                                                                    </Row>
                                                                 
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                    <div className="table-wrapper mb-4" style={{width: "100%"}}>
                                                    <Button name="button" color="primary" className="btn-square"
                                                                                                onClick={() => {
                                                                                                    this.toggle(0, '3')
                                                                                                }}
                                                                                             
                                                                                            >
                                                                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> Back
                                                                                              </Button>
                                                   
                                                   <Button type="button" color="primary" className="btn-square mr-5 pull-right" onClick={() => {
                                                       this.setState({ createMore: false }, () => {
                                                           props.handleSubmit()
                                                       })
                                                    
                                                   }}
                                                   >
                                                       <i className="fa fa-dot-circle-o"></i>  {strings.Save}
                                                  </Button>
                                            
                                           </div>
                                                   
                                                </Row>
                                             
                                            </Form>
                                        )
                                        }
                                    </Formik>
                                    
                                </TabPane>

                            </TabContent>

                        </CardBody>
                    </Card>
                </div>
                <DesignationModal
                    openDesignationModal={this.state.openDesignationModal}
                    closeDesignationModal={(e) => {
                        this.closeDesignationModal(e);
                    }}
                    getCurrentUser={(e) => this.getCurrentUser(e)}
                    createDesignation={this.props.createPayrollEmployeeActions.createEmployeeDesignation}
                // currency_list={this.props.currency_convert_list}
                // currency={this.state.currency}
                // country_list={this.props.country_list}
                // getStateList={this.props.customerInvoiceActions.getStateList}
                />

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
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployeePayroll);
