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
    Table
} from 'reactstrap'
import { Loader, ConfirmDeleteModal, ImageUploader } from 'components'
import Select from 'react-select'
import {
    CommonActions
} from 'services/global'
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'

import * as DetailSalaryComponentAction from './actions';
import * as CreatePayrollEmployeeActions from '../create/actions'
import { SalaryComponentDeduction, SalaryComponentFixed, SalaryComponentVariable } from 'screens/payrollemp/sections';

import { Formik } from 'formik';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
  
import { selectOptionsFactory } from 'utils'
import moment from 'moment'




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
        createPayrollEmployeeActions : bindActionCreators(CreatePayrollEmployeeActions, dispatch),
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
           Variable: [ ],
        Deduction: [],
        Fixed_Allowance: [ ],
            current_employee_id: null,
            openSalaryComponentFixed: false,
            openSalaryComponentVariable: false,
            openSalaryComponentDeduction: false,
        }
        
        this.regEx = /^[0-9\d]+$/;
        this.regExBoth = /[a-zA-Z0-9]+$/;
        this.regExAlpha = /^[a-zA-Z ]+$/;
        this.regDec1=/^\d{1,2}\.\d{1,2}$|^\d{1,2}$/;

        this.formRef = React.createRef();

        this.columnHeader1 = [
            { label: 'Component Name', value: 'Component Name', sort: false },
            { label: 'Calculation Type', value: 'Calculation Type', sort: false },
            { label: 'Monthly', value: 'Monthly', sort: false },
            { label: 'Annualy', value: 'Annualy', sort: false },
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
      this.getSalaryComponentByEmployeeId();
      this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownFixed();
      this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownDeduction();
      this.props.createPayrollEmployeeActions.getSalaryComponentForDropdownVariable();
    }

    getSalaryComponentByEmployeeId = () => {
       
        if (this.props.location.state && this.props.location.state.id) {
            this.props.detailSalaryComponentAction.getSalaryComponentByEmployeeId(this.props.location.state.id).then((res) => {

                if (res.status === 200) {
                    this.setState({
                        loading: false,
                        current_employee_id: this.props.location.state.id,
                       
                            id: res.data.id ? res.data.id : '',
                            CTC: res.data.ctc ? res.data.ctc : '',
                            Fixed:  res.data.salaryComponentResult.Fixed,
                            Variable : res.data.salaryComponentResult.Variable,
                            Deduction : res.data.salaryComponentResult.Deduction,
                            Fixed_Allowance : res.data.salaryComponentResult.Fixed_Allowance,
                      
                    }
                    )
                    
                     this.updateSalary(res.data.ctc ? res.data.ctc : this.state.CTC)
                }
            }).catch((err) => {
                this.setState({ loading: false })
                this.props.history.push('/admin/master/employee')
            })
        } else {
            this.props.history.push('/admin/master/employee')
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
    // Create or Edit Vat
    handleSubmit = (data) => {

        this.setState({ disabled: true });
        const { current_employee_id } = this.state;
        const {
            employee,
            CTC

        } = data;

        let formData = new FormData();
        formData.append('employee', current_employee_id)
        formData.append('employeeId', this.props.location.state.id?this.props.location.state.id:"");
        formData.append('grossSalary', CTC != null ? CTC : '')

        formData.append('salaryComponentString', JSON.stringify(this.state.list));
        this.props.detailSalaryComponentAction.updateEmployeeBank(formData).then((res) => {
            if (res.status === 200) {
                this.props.commonActions.tostifyAlert(
                    'success', 
                    'Employee Updated Successfully.'
                )
                this.props.history.push('/admin/master/employee')
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert(
                'error', 
                err.data.message ? err.data.message :'Employee Updated Unsuccessfully'
            )
        })
    }

    
    updateSalary = (CTC1) => {
        const CTC = this.state.CTC

        const Fixed = this.state.Fixed
        const Variable = this.state.Variable
        const Deduction = this.state.Deduction
        const Fixed_Allowance = this.state.Fixed_Allowance
     
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
 
    removeComponent=(ComponentId)=>{

        this.props.detailSalaryComponentAction.deleteSalaryComponentRow(this.state.current_employee_id,ComponentId).then((res) => {
            if (res.status === 200) {
                this.getSalaryComponentByEmployeeId();
            }
        }).catch((err) => {
            this.props.commonActions.tostifyAlert('error', err.data.message)
        });
       
    }

    updateSalary1 = (CTC1,newFormula,id,newFlatAmount) => {
        const CTC = this.state.CTC

        const Fixed = this.state.Fixed
        const Variable = this.state.Variable
        const Deduction = this.state.Deduction
        const Fixed_Allowance = this.state.Fixed_Allowance
     
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
        const { loading, initValue, dialog } = this.state
        const { designation_dropdown, country_list, state_list, employee_list_dropdown } = this.props
        console.log(this.state.CTC, "Fixed")
        console.log(this.state.Fixed_Allowance, "Fixed_Allowance")
     
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
                                        <span className="ml-2"> {strings.Update +" "+strings.SalaryDetails}</span>
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
                                                         
                                                               <div style={{textAlign:"center"}}>
                                                        <FormGroup className="mt-3"   style={{textAlign:"center",display: "inline-grid"}} >
                                                         <Label><span className="text-danger">*</span>  CTC : </Label>
                                                            <Input
                                                                type="text"
                                                                id="CTC"
                                                                size="30"
                                                                name="CTC"
                                                                maxLength='14,2'
                                                                style={{textAlign:"center"}}
                                                                value={this.state.CTC ? this.state.CTC : props.values.CTC}
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
                                              
                                                    <Row>
                                                        <Col lg={8}>
                                                            <Row className='ml-2'>  
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
                                                           
                                                            <Table className="text-center" style={{border:"1px solid #c8ced3",  width: '150%'}} >
                                                                <thead style={{border:"1px solid #c8ced3"}}>
                                                                      <tr style={{border:"1px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        { this.state.Fixed ? this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        }) :""}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { this.state.Fixed ? Object.values(
                                                                     this.state.Fixed,
                                                                    ).map((item) => (
                                                                        <tr>
                                                                            {/* <td >{item.id}</td> */}
                                                                            <td style={{border:"1px solid #c8ced3"}} >{item.description}</td>
                                                                            {item.formula ?
                                                                                (
                                                                                    <td style={{border:"1px solid #c8ced3"}}>
                                                                                        <Input
                                                                                            type="number"
                                                                                            min="0"
                                                                                            max="99"
															                                step="0.01"
                                                                                            size="30"
                                                                                            maxLength={2}
                                                                                            style={{textAlign:"center"}}
                                                                                            id="formula"
                                                                                            name="formula"
                                                                                            value={item.formula}
                                                                                           // onChange={(e)=>{this.handleChange(e)}}   
                                                                                           onChange={(option) => {
                                                                                            if (option.target.value === '' || this.regDec1.test(option.target.value)) {
                                                                                                 props.handleChange('formula')(option) 
                                                                                                 this.updateSalary1(this.state.CTC,option.target.value,item.id);
                                                                                        }
                                                                                            

                                                                                        }}                                  
                                                                                                />
                                                                                            {item.description !== 'Basic SALARY' ? ( ' % of Basic') : ( ' % of CTC')}
                                                                                    </td>
                                                                                ) : (
                                                                                    <td style={{border:"1px solid #c8ced3"}}>{strings.FixedAmount}</td>)
                                                                            }
                                                                            {item.formula ?
                                                                                (<td style={{border:"1px solid #c8ced3"}}
                                                                                 >
                                                                                      <Input
                                                                                        disabled={true}
                                                                                        type="text"
                                                                                        size="30"
                                                                                        style={{textAlign:"center"}}
                                                                                        value={item.monthlyAmount ? item.monthlyAmount.toLocaleString() : 0.00 }
                                                                                        id=''
                                                                                        isDisabled={true}
                                                                                       />
                                                                                        {/* {item.monthlyAmount ?  item.monthlyAmount.toLocaleString() : 0.00} */}

                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"1px solid #c8ced3"}} >
                                                                                        <Input
                                                                                            maxLength="8"
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
                                                                                (<td style={{border:"1px solid  #c8ced3"}} >
                                                                                     
                                                                                        {item.yearlyAmount ?  item.yearlyAmount.toLocaleString() : 0.00}
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"1px solid  #c8ced3"}} >
                                                                                  
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
                                                                        
                                                                    )) :""}
                                                                </tbody>
                                                            </Table>
                                                          
                                                        </Col>
                                                        <Col lg={8}>
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
                                                            <Table className="text-center" style={{border:"1px solid #c8ced3",    width: '150%'}}>
                                                            <thead style={{border:"1px solid #c8ced3"}}>
                                                                      <tr style={{border:"1px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        {this.state.Variable  ? this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        }) :""}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.Variable  ? (
                                                                    Object.values(
                                                                        this.state.Variable,
                                                                    ).map((item) => (
                                                                        <tr>
                                                                            {/* <td >{item.id}</td> */}
                                                                            <td style={{border:"1px solid  #c8ced3"}} >{item.description}</td>
                                                                            {item.formula ?
                                                                                (
                                                                                    <td style={{border:"1px solid  #c8ced3"}}>
                                                                                        <Input
                                                                                            type="number"
                                                                                            // min="0"
                                                                                            min="0"
                                                                                             max="99"
                                                                                            step="0.01"
                                                                                            maxLength={2}
                                                                                            style={{textAlign:"center"}}
                                                                                            size="30"
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regDec1.test(option.target.value)) { props.handleChange('formula')(option)
                                                                                                this.updateSalary1(this.state.CTC,option.target.value,item.id);
                                                                                             }
                                                                                               
    
                                                                                            }}     
                                                                                            value={item.formula}
                                                                                            id=''
                                                                                        />{' '}% {strings.OfBasic}
                                                                                    </td>
                                                                                ) : (
                                                                                    <td style={{border:"1px solid # #c8ced3"}}>{strings.FixedAmount}</td>)
                                                                            }
                                                                            {item.formula ?
                                                                                (<td style={{border:"1px solid #c8ced3"}} >
                                                                                      <Input
                                                                                    disabled={true}
                                                                                        type="text"
                                                                                        size="30"
                                                                                        style={{textAlign:"center"}}
                                                                                        onChange={(option) => {
                                                                                            if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                            this.updateSalary1(this.state.CTC,option.target.value,item.id);

                                                                                        }}   
                                                                                        value={item.monthlyAmount.toLocaleString()}
                                                                                        id='' />
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"1px solid  #c8ced3"}} >
                                                                                        <Input
                                                                                        maxLength="8"
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
                                                                                (<td style={{border:"1px solid  #c8ced3"}} >
                                                                                     
                                                                                        {(item.yearlyAmount.toLocaleString())}
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"1px solid  #c8ced3"}} >
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
                                                                        <tr style={{border:"1px solid #c8ced3"}}></tr>
                                                                    )}
                                       
                                                                  
                                                                </tbody>
                                                            </Table>
                                                          
                                                        </Col>
                                                        <Col lg={8}>
                                                            <Row className='ml-2'>   
                                                            <h4>{strings.Deductions}</h4>
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
                                                            <Table className="text-center" style={{border:"1px solid #c8ced3",    width: '150%'}}>
                                                            <thead style={{border:"1px solid #c8ced3"}}>
                                                                      <tr style={{border:"1px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
                                                                        {this.state.Deduction  ?  this.columnHeader1.map((column, index) => {
                                                                            return (
                                                                                <th>
                                                                                    {column.label}
                                                                                </th>
                                                                            );
                                                                        }):""}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.Deduction  ? (
                                                                    Object.values(
                                                                        this.state.Deduction,
                                                                    ).map((item) => (
                                                                        <tr>
                                                                            {/* <td >{item.id}</td> */}
                                                                            <td style={{border:"1px solid #c8ced3"}} >{item.description}</td>
                                                                            {item.formula ?
                                                                                (
                                                                                    <td style={{border:"1px solid #c8ced3"}}>
                                                                                        <Input
                                                                                            type="number"
                                                                                            // min="0"
                                                                                            min="0"
                                                                                            max="99"
                                                                                            step="0.01"
                                                                                            maxLength={2}
                                                                                            size="30"
                                                                                            className="text-center"
                                                                                            value={item.formula}
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regDec1.test(option.target.value)) { props.handleChange('formula')(option) 
                                                                                                this.updateSalary1(this.state.CTC,option.target.value,item.id);
                                                                                            }
                                                                                               
    
                                                                                            }}   
                                                                                        />{' '}% of Basic
                                                                                    </td >
                                                                                ) : (
                                                                                    <td style={{border:"1px solid #c8ced3"}}>{strings.FixedAmount}</td>)
                                                                            }
                                                                            {item.formula ?
                                                                                (<td style={{border:"1px solid #c8ced3"}} >
                                                                                    <Input
                                                                                    disabled={true}
                                                                                        type="text"
                                                                                        size="30"
                                                                                        style={{textAlign:"center"}}
                                                                                        value={item.monthlyAmount.toLocaleString()}
                                                                                    />
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"1px solid #c8ced3"}} >
                                                                                        <Input
                                                                                        maxLength="8"
                                                                                            type="text"
                                                                                            size="30"
                                                                                            onChange={(option) => {
                                                                                                if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
                                                                                                this.updateSalary1(this.state.CTC,undefined,item.id,option.target.value);
    
                                                                                            }}  
                                                                                            style={{textAlign:"center"}}
                                                                                            value={item.flatAmount}
                                                                                            id='' />
                                                                                    </td>
                                                                                )}

                                                                        {item.formula ?
                                                                                (<td style={{border:"1px solid  #c8ced3"}} >
                                                                                     
                                                                                        {item.yearlyAmount.toLocaleString()}
                                                                                </td>

                                                                                ) : (
                                                                                    <td style={{border:"1px solid  #c8ced3"}} >
                                                                                      {item.flatAmount * 12}
                                                                                    </td>
                                                                                )}                                                                            
                                                                                <td>    
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
                                                        <Col lg={8}>
                                                            <Table className="text-center" style={{border:"1px solid #c8ced3" ,    width: '150%'}}>
                                                            {/* <thead style={{border:"1px solid #dfe9f7"}}>
                                                                      <tr style={{border:"1px solid #dfe9f7",    background: '#dfe9f7',color:"Black"}}>
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
                                                                    {this.state.Fixed_Allowance  ? (
                                                                    Object.values(
                                                                        this.state.Fixed_Allowance,
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
                                                        <Col lg={8}>
                                                            <Table className="text-center"  style={{border:"1px solid #c8ced3",    width: '150%'}}>
                                                            {/* <thead style={{border:"1px solid #c8ced3"}}>
                                                                      <tr style={{border:"1px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
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
                                                                        <Col className="p-2" >{this.state.CTC ? this.state.CTC.toLocaleString() : "-"}</Col>
                                                                    </Row>
                                                                 
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
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSalaryComponent)
