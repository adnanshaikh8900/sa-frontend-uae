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
    UncontrolledTooltip,
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
import { ImageUploader ,Loader} from 'components';
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
            loading:false,
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
            BankList: [],
            isDisabled:false,
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
                countryId: {label: "United Arab Emirate", value: 229},
                permanentAddress: '',
                presentAddress: '',
                bloodGroup: '',
                mobileNumber: '',
                vatRegestationNo: '',
                currencyCode:'',
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
                agentId:'',
                visaExpiryDate: '',
                dateOfJoining: '',
                department: '',
                labourCard: '',
                grossSalary: '',
                salaryRoleId: '',
                parentId: '',
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
                bankId:''
                
            },
            userPhoto: [],
            userPhotoFile: [],
            useractive: true,
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
            existForAccountNumber: false,
            selectedStatus:true,
            checkmobileNumberParam:false,
            checkmobileNumberParam1:false,
            checkmobileNumberParam2:false,
            loadingMsg:"Loading...",
            ctcTypeOption:{label:"ANNUALLY",value:1},
            ctcType:"ANNUALLY",
            ctcTypeList:[
                {label:"ANNUALLY",value:1},
                {label:"MONTHLY",value:2},
            ]
        }        
        this.formRef = React.createRef();       
        this.regEx = /^[0-9\d]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regExAddress = /^[a-zA-Z0-9\s\D,'-/ ]+$/;
        this.regExQualification = /^[a-zA-Z,-/ ]+$/;
        this.regExQualificationYear = /^[0-9,'-]+$/;

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
        this.props.createPayrollEmployeeActions.getBankListForEmployees()
            .then((response) => {
            	this.setState({bankList:response.data
            });
            });
        // this.props.employeeActions.getEmployeesForDropdown();
        this.setState({ showIcon: false });

        this.initializeData();
    };

    initializeData = () => {
        this.getEmployeeCode();
        this.getStateList(this.state.initValue.countryId.value ?this.state.initValue.countryId.value:'');
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
            if (response.data === 'Employee Code Already Exists') {
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

existForAccountNumber = (value) => {
    const data = {
        moduleType: 19,
        name: value,
    };
    this.props.createPayrollEmployeeActions
        .checkValidation(data)
        .then((response) => {
            if (response.data === 'Account Number Already Exists') {
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
        formData.append('ctcType',this.state.ctcTypeOption.label ?this.state.ctcTypeOption.label:"ANNUALLY")
        formData.append('salaryComponentString', JSON.stringify(this.state.list));
        this.setState({ loading:true, loadingMsg:"Creating New Employee..."});
        this.props.createPayrollEmployeeActions
            .saveSalaryComponent(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                        ' New Employee Created Successfully'
                        )
                    this.getSalaryComponentByEmployeeId();
                    // this.props.history.push('/admin/payroll/employee');
                    this.props.history.push('/admin/master/employee');
                    this.setState({ loading:false,});
                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert(
                    'error',
                     err && err.data ? err.data.message : 'New Employee Created Unsuccessfully'
                     )
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
            swiftCode,
            bankId
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
        // formData.append(
        //     'bankName',
        //     bankName != null ? bankName : '',
        // )
        
        if (bankId && bankId.value) {
            formData.append('bankId', bankId.value);
        }
        if (bankId && bankId.label) {
            formData.append('bankName', bankId.label);
        }
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
            this.setState({ loading:true, loadingMsg:"Creating Finacial Details..."});
            this.props.createPayrollEmployeeActions
            .saveEmployeeBankDetails(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success', 
                        res.data ? res.data.mesg : ' Finacial Details Saved Successfully'
                        )
                    this.toggle(0, '4')
                    this.getSalaryComponentByEmployeeId();
                    this.renderActionForState(this.state.employeeid)
                    this.setState({ loading:false,});
                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert(
                    'error',
                     err && err.data ? err.data.message : 'Finacial Details Saved Unuccessfully'
                     )
            })
        }else{
            this.setState({ loading:true, loadingMsg:"Updating Employee..."});
            this.props.detailEmployeeBankAction.updateEmployeeBank(formData).then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                         res.data ? res.data.mesg : 'Employee Updated Successfully'
                         )
                    this.toggle(0, '4')
                    this.getSalaryComponentByEmployeeId();
                    this.renderActionForState(this.state.employeeid)
                    this.setState({ loading:false,});
                }
            }).catch((err) => {
                this.props.commonActions.tostifyAlert('error',  err.data.message ? err.data.message :'Updated Unssccessfully')
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
            salaryRoleId,
            agentId
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
        formData.append(
            'agentId',
            agentId != null ? agentId : '',
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
            this.setState({ loading:true, loadingMsg:"Creating Employee Details..."});
        this.props.createPayrollEmployeeActions
            .saveEmployment(formData)
            .then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                         res.data ? res.data.mesg : 'Employment Details Saved Successfully'
                        )
                    this.toggle(0, '3')
                    this.renderActionForState(this.state.employeeid)
                    this.setState({ loading:false,});

                }
            }).catch((err) => {

                this.props.commonActions.tostifyAlert(
                    'error',
                     err && err.data ? err.data.message : 'Employment Details Saved Unsuccessfully'
                     )
            })
        }else{
            this.setState({ loading:true, loadingMsg:"Updating Employement Details..."});
            formData.append('id', this.state.selectedData.employmentId);
            this.props.detailEmployeeEmployementAction.updateEmployment(formData).then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                         res.data ? res.data.mesg : 'Employment Details Updated Successfully'
                         )
                    this.toggle(0, '3')
                    this.renderActionForState(this.state.employeeid)
                    this.setState({ loading:false,});
                }
            }).catch((err) => {
                this.props.commonActions.tostifyAlert(
                    'error',
                      err.data.message ? err.data.message :'Employment Details Saved Unsuccessfully'
                      )
            })
        }

    }

    handleSubmit = (data, resetForm) => {
        this.setState({ loading:true, loadingMsg:"Creating Employee Basic Details..."});
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
            formData.append('profileImageBinary ', this.state.userPhotoFile[0]);
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
                        'Employee Basic Details Saved Successfully'
                        )
                    this.setState({
                        employeeid: res.data,

                    })
                    if(this.props.location && this.props.location.state && this.props.location.state.goto && this.props.location.state.goto==="Expense"){                    
                            this.props.history.push(`/admin/expense/expense/create`)  
                            this.setState({ loading:false,});                     
                    }
                    this.toggle(0, '2')

                    const formData1 = new FormData();
                    formData1.append('employee', this.state.employeeid)
                    formData1.append('employeeCode',this.state.initValue.employeeCode != null ?this.state.initValue.employeeCode : '')
                    this.props.createPayrollEmployeeActions.saveEmployment(formData1).then((res)=>{
                        if(res.status==200)
                         this.renderActionForState(this.state.employeeid);  })
                }
            }).catch((err) => {
        
                let error=err && err.data ? err.data : 'Employee Basic Details Saved Unsuccessfully';
                if(err.data && err.data.message !== undefined){
                    error=err.data.message ? err.data.message :err.data;
                }
                this.setState({ disabled: false, loading: false });
                this.props.commonActions.tostifyAlert('error',  error)
            })
        }
        else{
            this.setState({ loading:true, loadingMsg:"Updating Employee Details..."});
            this.props.detailEmployeePersonalAction.updateEmployeePersonal(formData).then((res) => {
                if (res.status === 200) {
                    this.props.commonActions.tostifyAlert(
                        'success',
                        res.data ? res.data.message : 'Employee Updated Successfully!'
                        )
                    this.toggle(0, '2')
                    this.renderActionForState(this.state.employeeid)
                    this.setState({ loading:false,});   
                    
                }
            }).catch((err) => {
                this.props.commonActions.tostifyAlert(
                    'error',
                    err.data ? err.data.mesg : 'Employee Updated Unsuccessfully'
                )
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
                // totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
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
                // totalFixedSalary = totalFixedSalary + parseInt(salaryMonthy);
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
        const {	exist,checkmobileNumberParam,checkmobileNumberParam1,checkmobileNumberParam2,existForAccountNumber,bankList,loading,loadingMsg}=this.state
        const { salary_role_dropdown, designation_dropdown, country_list, state_list, employee_list_dropdown } = this.props
        return (
            loading ==true? <Loader loadingMsg={loadingMsg}/> :
         
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
                        {loading ? (
										<Row>
											<Col lg={12}>
												<Loader />
											</Col>
										</Row>
									) : (
                                    
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
                                                                            if (values.gender && values.gender.label && values.gender.label === "Select Gender") {
                                                                                errors.gender =
                                                                                'Gender is Required';
                                                                            }
                                                                            if (values.employeeDesignationId && values.employeeDesignationId.label && values.employeeDesignationId.label === "Select Employee Designation") {
                                                                                errors.employeeDesignationId =
                                                                                'Designation is Required';
                                                                            }
                                                                            if (values.salaryRoleId && values.salaryRoleId.label && values.salaryRoleId.label === "Select Salary Role") {
                                                                                errors.salaryRoleId =
                                                                                'Salary Role is Required';
                                                                            }
                                                                                
                                                                            
                                                                            // if( values.stateId ===''){
                                                                            //     errors.stateId =
                                                                            //     'State is Required';
                                                                            // }
                                                                            if( values.stateId.label && values.stateId.label ==='Select State'){
                                                                                errors.stateId =
                                                                                'State is Required';
                                                                            }
                                                                            
                                                                            // if (param === true) {
                                                                            // 	errors.discount =
                                                                            // 		'Discount amount Cannot be greater than Invoice Total Amount';
                                                                            // }
                                                                            return errors;
                                                                        }}
                                                                        validationSchema={Yup.object().shape({
                                                                            firstName: Yup.string()
                                                                                .required("First Name is Required"),
                                                                            lastName: Yup.string()
                                                                            .required("Last Name is Required"),
                                                                            email: Yup.string()
                                                                            .required("Valid Email Required"),
                                                                            mobileNumber:Yup.string()
                                                                            .required("Mobile Number is Required"),
                                                                            // salaryRoleId :  Yup.string()
                                                                            // .required(" Employee Role is required"),
                                                                            dob: Yup.date()
                                                                            .required('DOB is Required') ,
                                                                            gender: Yup.string()
                                                                            .required('Gender is Required') ,
                                                                            presentAddress: Yup.string()
                                                                            .required('Present Address is Required') ,
                                                                            // pincode: Yup.string()
                                                                            // .required('Pin Code is Required') ,
                                                                            countryId: Yup.string()
                                                                            .required('Country is Required') ,
                                                                            stateId: Yup.string()
                                                                            .required('State is Required') ,
                                                                            // city: Yup.string()
                                                                            // .required('City is Required') ,
                                                                          
                                                                            active : Yup.string()
                                                                            .required('status is Required') , 
                                                                            salaryRoleId : Yup.string()
                                                                            .required('Salary Role is Required'),
                                                                            employeeDesignationId : Yup.string()
                                                                            .required('Designation is Required') ,
                                                                            emergencyContactName1: Yup.string()
                                                                            .required('Contact Name 1 is Required') ,
                                                                            emergencyContactNumber1:Yup.string()
                                                                            .required("Contact Number 1 is Required"),
                                                                            emergencyContactRelationship1: Yup.string()
                                                                            .required('Relationship 1 is Required') ,
                                                                          
                                                                           
                                                                        })}
                                                                    >
                                                                        {(props) => (

                                                                            <Form onSubmit={props.handleSubmit}>

                                                                                <Row>
                                                                                    <Col xs="4" md="4" lg={2}>
                                                                                        <FormGroup className="mb-3 text-center">
                                                                                            <ImageUploader
                                                                                                // withIcon={true}
                                                                                                buttonText={strings.chooseimage}
                                                                                                onChange={this.uploadImage}
                                                                                                imgExtension={['jpg', 'png', 'jpeg']}
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
                                                                                                label= {strings.filesize}
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span> {strings.FirstName}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
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
                                                                                                        maxLength="100"
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span>{strings.LastName}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span> {strings.Email}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="80"
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
                                                                                                    <Label htmlFor="date"><span className="text-danger">* </span>{strings.DateOfBirth}</Label>
                                                                                                    <DatePicker
                                                                                                        className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                                                                                        id="dob"
                                                                                                        name="dob"                                                           
                                                                                                        placeholderText={strings.Select+strings.DateOfBirth}
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
                                                                                                    {props.errors.dob && 
                                                                                                        props.touched.dob && (
                                                                                                        <div className="invalid-feedback">
                                                                                                            {props.errors.dob.includes("nullable()") ? "DOB is Required" :props.errors.dob}

                                                                                                        </div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="mobileNumber"><span className="text-danger">* </span>
                                                                                                         {strings.MobileNumber}
															                                    		</Label>
                                                                                                        <div 	className={
																	                                 	props.errors.mobileNumber &&
																		                                props.touched.mobileNumber
																			                                ? ' is-invalidMobile '
																			                                : ''
																	                                }>
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
                                                                                                            option.length !==12 ? this.setState({checkmobileNumberParam: true }) : this.setState({ checkmobileNumberParam: false });
                                                                                                        }}
                                                                                                        isValid
                                                                                                        // className={
                                                                                                        //     props.errors.mobileNumber &&
                                                                                                        //         props.touched.mobileNumber
                                                                                                        //         ? 'text-danger'
                                                                                                        //         : ''
                                                                                                        // }
                                                                                                    /></div>
                                                                                                     {props.errors.mobileNumber &&
                                                                                                      props.touched.mobileNumber && (
                                                                                                        <div className="invalid-feedback">
                                                                                                            {props.errors.mobileNumber}
                                                                                                        </div>
                                                                                                    )}
                                                                                                   
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            {/* <Col md="4">
                                                                                                <FormGroup className="mb-3">
                                                                                                    <Label htmlFor="active"><span className="text-danger">* </span>{strings.Status}</Label>
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
                                                                                                    <Label htmlFor="active"><span className="text-danger">* </span>{strings.Status}</Label>
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
                                                                                                    <Label htmlFor="gender"><span className="text-danger">* </span> {strings.PresentAddress} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
                                                                                                        id="presentAddress"
                                                                                                        name="presentAddress"
                                                                                                        value={props.values.presentAddress}
                                                                                                        placeholder={strings.Enter+strings.PresentAddress}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExAddress.test(option.target.value)) { props.handleChange('presentAddress')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.presentAddress && props.touched.presentAddress ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.presentAddress && props.touched.presentAddress && (
                                                                                                        <div className="invalid-feedback">{props.errors.presentAddress}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                  
                                                                                            </Col>
                                                            {props.values.countryId == 229 || props.values.countryId.value == 229 ? 
														 	<Col md="4" >
																 <FormGroup>
															 {/* <Label htmlFor="select">{strings.POBoxNumber}</Label> */}
															 <Label htmlFor="POBoxNumber">
																 <span className="text-danger"></span>{strings.POBoxNumber}
															 </Label>
															 <Input
																 type="text"
																 minLength="3"
																 maxLength="6"
																 id="poBoxNumber"
																 name="poBoxNumber"
																 autoComplete="Off"
																 placeholder={strings.Enter + strings.POBoxNumber}
																 onChange={(option) => {
																	 if (
																		 option.target.value === '' ||
																		 this.regEx.test(option.target.value)
																	 ) {
																		 if(option.target.value.length<3)
																		 this.setState({showpoBoxNumberErrorMsg:true})
																		 else
																		 this.setState({showpoBoxNumberErrorMsg:false})
																		 props.handleChange('poBoxNumber')(
																			 option,
																		 );
																	 }
																 }}
																 value={props.values.poBoxNumber}
																 className={
																	 props.errors.poBoxNumber &&
																		 props.touched.poBoxNumber
																		 ? 'is-invalid'
																		 : ''
																 }
															 />
															 {props.errors.poBoxNumber &&
																 props.touched.poBoxNumber && (
																	 <div className="invalid-feedback">
																		 {props.errors.poBoxNumber}
																	 </div>
																 )}
														 </FormGroup>
														 </Col>

														: 
															<Col md="4" ><FormGroup>
																	<Label htmlFor="postZipCode"><span className="text-danger"> </span>
																		{strings.PostZipCode}
																	</Label>
																	<Input
																		type="text"
																		maxLength="6"
																		id="PostZipCode"
																		name="PostZipCode"
																		autoComplete="Off"
																		placeholder={strings.Enter + strings.PostZipCode}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('PostZipCode')(
																					option,
																				);
																			}
																
																		}}
																		value={props.values.PostZipCode}
																		className={
																			props.errors.PostZipCode &&
																				props.touched.PostZipCode
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.PostZipCode &&
																		props.touched.PostZipCode && (
																			<div className="invalid-feedback">
																				{props.errors.PostZipCode}
																			</div>
																		)}
																</FormGroup>
																</Col>}
                                                                    </Row>
                                                                                        <Row className="row-wrapper">
                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="countryId"><span className="text-danger">* </span>{strings.Country}</Label>
                                                                                                    <Select
                                                                                                  //  isDisabled
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
                                                                                                    <Label htmlFor="stateId"><span className="text-danger">* </span>
                                                                                                    {props.values.countryId.value === 229 ? strings.Emirate: strings.StateRegion}

                                                                                                    </Label>
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
                                                                                                        placeholder={strings.Select + props.values.countryId === 229 || props.values.countryId.value === 229 ? strings.Emirate: strings.StateRegion}
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
                                                                                                    <Label htmlFor="state"><span className="text-danger"></span>{strings.City} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
                                                                                                        id="city"
                                                                                                        name="city"
                                                                                                        value={props.values.city}
                                                                                                        placeholder={strings.Location}

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
                                                                                                        value={props.values.university}
                                                                                                        placeholder={strings.Enter+strings.University}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('university')(option) }
                                                                                                          } }
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
                                                                                                        maxLength="100"
                                                                                                        id="qualification"
                                                                                                        name="qualification"
                                                                                                        placeholder={strings.Enter+strings.qualification}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExQualification.test(option.target.value)) { props.handleChange('qualification')(option) }
                                                                                                          }}
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
                                                                                                    <Label htmlFor="Year Of Passing"> {strings.qualificationYearOfCompletionDate} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="10"
                                                                                                        id="Year Of Passing"
                                                                                                        name="Year Of Passing"
                                                                                                        placeholder={strings.Enter+strings.qualificationYearOfCompletionDate}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExQualificationYear.test(option.target.value)) { props.handleChange('qualificationYearOfCompletionDate')(option) }
                                                                                                          }}
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
                                                                                                        maxLength="100"
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
                                                                                                    <Label htmlFor="emergencyContactNumber1"><span className="text-danger">* </span> {strings.ContactNumber1} </Label>
                                                                                                    <div 	className={
																	                            	props.errors.mobileNumber &&
																		                            props.touched.mobileNumber
																			                        ? ' is-invalidMobile '
																			                        : ''
																	                                }>
                                                                                                        
                                                                                                    <PhoneInput
                                                                                                        id="emergencyContactNumber1"
                                                                                                        name="emergencyContactNumber1"
                                                                                                        country={"ae"}
                                                                                                        enableSearch={true}
                                                                                                        international
                                                                                                        value={props.values.emergencyContactNumber1}
                                                                                                        placeholder={strings.Enter+strings.emergencyContactNumber1}
                                                                                                        onBlur={props.handleBlur('emergencyContactNumber1')}
                                                                                                        onChange={(option) => {
                                                                                                            props.handleChange('emergencyContactNumber1')(
                                                                                                                option,
                                                                                                            );
                                                                                                            option.length !==12 ? this.setState({checkmobileNumberParam: true }) : this.setState({ checkmobileNumberParam: false });
                                                                                                        }}
                                                                                                        isValid
                                                                                                    /></div>
                                                                                                     {props.errors.emergencyContactNumber1 &&
                                                                                                      props.touched.emergencyContactNumber1 && (
                                                                                                        <div className="invalid-feedback">
                                                                                                            {props.errors.emergencyContactNumber1}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </FormGroup>
                            
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactRelationship1"> <span className="text-danger">* </span>{strings.Relationship1} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
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
                                                                                                    <Label htmlFor="emergencyContactName2"> {strings.ContactName2}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="100"
                                                                                                        id="emergencyContactName2"
                                                                                                        name="emergencyContactName2"
                                                                                                        placeholder={strings.Enter+strings.ContactName2}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('emergencyContactName2')(option) }
                                                                                                        }}
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
                                                                                                    
                                                                                            </Col>

                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="emergencyContactRelationship2"> {strings.Relationship2} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength={"100"}
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
                                                                                      
                                                                                    <Button  
                                                                                    color="secondary" 
                                                                                    className="btn-square"
                                                                                    onClick={()=>{this.props.history.push('/admin/master/employee')}}
                                                                                           >
                                                                                                <i className="fa fa-ban"></i> Back
                                                                                              </Button>
                                                                                            <Button name="button" color="primary" className="btn-square pull-right"
                                                                                                // onClick={() => {
                                                                                                //     this.toggle(0, '2')
                                                                                                // }}
                                                                                                onClick={() => {
                                                                                                    //  added validation popup  msg                                                                
																                                	props.handleBlur();
																                                	if(props.errors &&  Object.keys(props.errors).length != 0)
																	                                this.props.commonActions.fillManDatoryDetails();
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
                                                                        validationSchema={Yup.object().shape({
                                                                            employeeCode: Yup.string()
                                                                                .required("Employee Unique Id is Required"),
                                                                                agentId: Yup.string()
                                                                                .required("Agent Id is Required"),
                                                                            //     salaryRoleId: Yup.string()
                                                                            // .required("salary Role is Required"),
                                                                
                                                                            dateOfJoining: Yup.date()
                                                                                .required('Date of Joining is Required')                   
                                                                        })}
                                                                        validate={(values) => {
                                                                            let errors = {};
                                                                             
                                                                            if (exist === true  && values.employeeCode!="") {
                                                                                errors.employeeCode =
                                                                                'Employee Code Number Already Exists';
                                                                            }
                                                                            return errors;

                                                                        }}
                                                                        
                                                                    >
                                                                        {(props) => (

                                                                            <Form onSubmit={props.handleSubmit}>

                                                                                <Row>


                                                                                    <Col xs="4" md="4" lg={10}>
                                                                                        <Row>
                                                                                            <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span>{strings.employee_unique_id}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="14"
                                                                                                        minLength="14"
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span>{strings.agent_id} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="9"
                                                                                                        minLength="9"
                                                                                                        id="agentId"
                                                                                                        name="agentId"
                                                                                                        value={props.values.agentId}
                                                                                                        placeholder={strings.Enter+ strings.agent_id}
                                                                                                       

                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('agentId')(option) }
                                                                                                            // this.validationCheck(option.target.value);
                                                                                                        }}
                                                                                                        className={props.errors.agentId && props.touched.agentId ? "is-invalid" : ""}
                                                                                                    />
                                                                                                    {props.errors.agentId && props.touched.agentId && (
                                                                                                        <div className="invalid-feedback">{props.errors.agentId}</div>
                                                                                                    )}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                         
                                                                                            {/* <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="salaryRoleId"><span className="text-danger">* </span> {strings.SalaryRole} </Label>
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
                                                                                                    <Label htmlFor="dateOfJoining"><span className="text-danger">* </span>{strings.DateOfJoining}</Label>
                                                                                                    <DatePicker
                                                                                                        className={`form-control ${props.errors.dateOfJoining && props.touched.dateOfJoining ? "is-invalid" : ""}`}
                                                                                                        id="dateOfJoining"
                                                                                                        name="dateOfJoining"
                                                                                                        placeholderText={strings.Select+strings.DateOfJoining}
                                                                                                        showMonthDropdown
                                                                                                        showYearDropdown
                                                                                                        dateFormat="dd-MM-yyyy"
                                                                                                        dropdownMode="select"
                                                                                                        maxDate={new Date()}
                                                                                                        autoComplete={"off"}
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
                                                                                                        value={props.values.passportNumber}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExBoth.test(option.target.value)) { props.handleChange('passportNumber')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.passportNumber && props.touched.passportNumber ? "is-invalid" : ""}
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
                                                                                                        dateFormat="dd-MM-yyyy"
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
                                                                                                        maxLength="8"
                                                                                                        id="visaNumber"
                                                                                                        name="visaNumber"
                                                                                                        placeholder={strings.Enter+strings.VisaNumber}
                                                                                                        value={props.values.visaNumber}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExBoth.test(option.target.value)) { props.handleChange('visaNumber')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.visaNumber && props.touched.visaNumber ? "is-invalid" : ""}
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
                                                                                                        dateFormat="dd-MM-yyyy"
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
                                                                                        <Row>
                                                                                        <Col md="4">
                                                                                                <FormGroup>
                                                                                                    <Label htmlFor="labourCard"> {strings.LabourCard}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="14"
                                                                                                        id="labourCard"
                                                                                                        name="labourCard"
                                                                                                        value={props.values.labourCard}
                                                                                                        placeholder={strings.Enter+strings.LabourCard}
                                                                                                        onChange={(option) => {
                                                                                                            if (option.target.value === '' || this.regExBoth.test(option.target.value)) { props.handleChange('labourCard')(option) }
                                                                                                        }}
                                                                                                        className={props.errors.labourCard && props.touched.labourCard ? "is-invalid" : ""}
                                                                                                    />                                                                                         {props.errors.labourCard && props.touched.labourCard && (
                                                                                                        <div className="invalid-feedback">
                                                                                                            {props.errors.labourCard}
                                                                                                        </div>
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
                                                                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> {strings.back}
                                                                                              </Button>
                                                                                            <Button name="button" color="primary" className="btn-square pull-right"
                                                                                                // onClick={() => {
                                                                                                //     this.toggle(0, '3')
                                                                                                // }}
                                                                                                onClick={() => {
                                                                                                    //  added validation popup  msg                                                                
																	                            props.handleBlur();
																	                            if(props.errors &&  Object.keys(props.errors).length != 0)
																	                            this.props.commonActions.fillManDatoryDetails();
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
                                                                        validate={(values) => {
                                                                            let errors = {};
                                                                            if (existForAccountNumber === true) {
                                                                                errors.accountNumber =
                                                                                    'Account Number Already Exists';
                                                                            }
                                                                            return errors;
                                                                        }}
                                                                        validationSchema={Yup.object().shape({
                                                                            accountHolderName: Yup.string()
                                                                                .required("Account Holder Name is Required"),
                                                                            accountNumber: Yup.string()
                                                                            .required("Account Number is Required"),
                                                                            iban: Yup.string()
                                                                            .required("IBAN is Required"),
                                                                            // bankName: Yup.string()
                                                                            // .required("Bank Name is Required"),
                                                                            bankId: Yup.string()
                                                                            .required('Bank is Required') ,
                                                                            branch: Yup.string()
                                                                            .required("Branch is Required"),
                                                                            // swiftCode: Yup.string()
                                                                            // .required("Swift Code is Required"),
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span>{strings.AccountHolderName}  </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        maxLength="60"
                                                                                                        id="accountHolderName"
                                                                                                        name="accountHolderName"
                                                                                                        value={props.values.accountHolderName}
                                                                                                        placeholder={strings.Enter+strings.AccountHolderName}
                                                                                                        onChange={(option) => {
                                                                                                            
                                                                                                            if (
                                                                                                                option.target.value === '' ||
                                                                                                                this.regExAlpha.test(option.target.value)
                                                                                                            ) {
                                                                                                                props.handleChange('accountHolderName')(option);
                                                                                                            }

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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span> {strings.AccountNumber}</Label>
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
                                                                                                <Label htmlFor="select"><span className="text-danger">* </span> {strings.BankName} </Label>
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span> {strings.BankName} </Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="bankName"
                                                                                                        name="bankName"
                                                                                                        value={props.values.bankName}
                                                                                                        placeholder={strings.Enter+strings.BankName}
                                                                                                        onChange={(option) => {
                                                                                                          
                                                                                                            if (
                                                                                                                option.target.value === '' ||
                                                                                                                this.regExAlpha.test(option.target.value)
                                                                                                            ) {
                                                                                                                props.handleChange('bankName')(option);
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span>{strings.Branch}</Label>
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
                                                                                                    <Label htmlFor="select"><span className="text-danger">* </span>{strings.IBANNumber}</Label>
                                                                                                    <Input
                                                                                                        type="text"
                                                                                                        id="iban"
                                                                                                        name="iban"
                                                                                                        maxLength="23"
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
                                                                                                    <Label htmlFor="select">
                                                                                                        {/* <span className="text-danger">* </span> */}
                                                                                                        {strings.SwiftCode}</Label>
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
                                                                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> {strings.back}
                                                                                              </Button>
                                                                                            <Button name="button" color="primary" className="btn-square pull-right "
                                                                                                onClick={() => {
                                                                                                    //  added validation popup  msg                                                                
                                                                                                    props.handleBlur();
                                                                                                    if(props.errors &&  Object.keys(props.errors).length != 0)
                                                                                                    this.props.commonActions.fillManDatoryDetails();
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
                                                         <Label><span className="text-danger">* </span> Cost To Company  ( CTC )
                                                         {/* <i				id="CtcTooltip"
																				className="fa fa-question-circle ml-1"
																			></i>
																			<UncontrolledTooltip
																				placement="right"
																				target="CtcTooltip"
																			>
																				Cost To Company -  It indicates the total amount of expenses an company (organisation) spends on an employee during one year.
																			</UncontrolledTooltip> */}
                                                         
                                                          : </Label>
                                                          <div   style={{display:"flex"}}>
                                                                 <div   style={{width:"-webkit-fill-available"}}>
                                                                       <Select 
                                                                                options={this.state.ctcTypeList}
                                                                                id="ctcTypeOption"
                                                                                name="ctcTypeOption"
                                                                                className="mr-2"
                                                                                value={this.state.ctcTypeOption}
                                                                                onChange={(e) => {															
                                                                                this.setState({ctcTypeOption:e,ctcType:e.label})	
                                                                                props.handleChange('CTC')(0);
                                                                                this.updateSalary(0)													
                                                                                }}
                                                                                />
                                                                 </div>
                                                            <Input
                                                                type="text"
                                                                id="CTC"
                                                                size="30"
                                                                name="CTC"
                                                                maxLength='10'
                                                                style={{textAlign:"center"}}
                                                                value={props.values.CTC}
                                                                placeholder={strings.Enter+ strings.ctc}
                                                                onChange={(option) => {
                                                                    if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('CTC')(option) }
                                                                    
                                                                    this.updateSalary(this.state.ctcType=="ANNUALLY"?option.target.value:parseFloat(option.target.value)*12);
                                                                }}
                                                                className={props.errors.CTC && props.touched.CTC ? "is-invalid" : ""}
                                                            />
                                                            {props.errors.CTC && props.touched.CTC && (
                                                                <div className="invalid-feedback">{props.errors.CTC}</div>
                                                            )}</div>
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
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { 
                                                                                                    props.handleChange('formula')(option)
                                                                                                    this.updateSalary1(this.state.CTC,option.target.value,item.id); 
                                                                                                }
                                                                                               
    
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
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) 
                                                                                                { 
                                                                                                    props.handleChange('formula')(option)
                                                                                                    this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value);
                                                                                                }
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
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value))
                                                                                                 {
                                                                                                      props.handleChange('formula')(option)
                                                                                                      this.updateSalary1(this.state.CTC,option.target.value,item.id);
                                                                                                 }
                                                                                                
    
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
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) 
                                                                                                {
                                                                                                     props.handleChange('formula')(option)
                                                                                                     this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value);
                                                                                                }
                                                                                             
    
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
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value))
                                                                                                 { 
                                                                                                     props.handleChange('formula')(option) 
                                                                                                     this.updateSalary1(this.state.CTC,option.target.value,item.id);
                                                                                                 }
                                                                                               
    
                                                                                            }}        
                                                                                        />{' '}{strings.basic_percent}
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
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value))
                                                                                                 {
                                                                                                      props.handleChange('formula')(option)
                                                                                                      this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value); 
                                                                                                 }
                                                                                               
    
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
                                                                        <Col className="p-2"  >{this.state.CTC ? (this.state.CTC / 12).toLocaleString() :"-"}</Col>
                                                                        <Col className="p-2" >{this.state.CTC ? this.state.CTC : "-"}</Col>
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
                                                                                                <i class="far fa-arrow-alt-circle-left mr-1"></i> {strings.back}
                                                                                              </Button>
                                                   
                                                   <Button type="button" color="primary" className="btn-square mr-5 pull-right" onClick={() => {
                                                                        //  added validation popup  msg                                                                
																		props.handleBlur();
																		if(props.errors &&  Object.keys(props.errors).length != 0)
																		this.props.commonActions.fillManDatoryDetails();
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
                        )}
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
