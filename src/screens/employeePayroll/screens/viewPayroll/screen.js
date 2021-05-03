import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";
import { ImageUploader } from 'components';
import {
  CommonActions
} from 'services/global'
import {selectCurrencyFactory, selectOptionsFactory} from 'utils'
import * as EmployeeActions from '../../actions';
import * as EmployeeCreateActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'
import PhoneInput from 'react-phone-number-input'
import moment from 'moment'

const mapStateToProps = (state) => {
  return ({
    employee_list_dropdown: state.employeePayroll.employee_list_dropdown,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    employeeCreateActions: bindActionCreators(EmployeeCreateActions, dispatch)

  })
}
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		},
	}),
};
class ViewPayroll extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initValue: {
        employeeIds:'',
        employeeListIds:[],
        noOfDays: '',
        salaryDate:'',
    
      },

    }

    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;


  }

  componentDidMount = () => {
    this.initializeData();
  };

  initializeData = () => {
    this.props.employeeActions.getEmployeesForDropdown();
  };

  handleSubmit = (data, resetForm) => {
    debugger
    this.setState({ disabled: true });
		const {
      employeeIds,
      employeeListIds,
      noOfDays,
      salaryDate
		} = data;
    var result = employeeListIds.map((o) => ({
      employeeIds: o.value,  
    }));
		const formData = new FormData();
   
    formData.append(
			'noOfDays',
			noOfDays !== null ? noOfDays : '',
		);
    formData.append('salaryDate', salaryDate ? moment(salaryDate).format('DD-MM-YYYY') : '')

			// formData.append(
			// 	'employeeListIds',
      //   employeeIds.value)
      employeeIds.forEach(item => {
          formData.append('employeeListIds', item.value);
         });
    this.props.employeeCreateActions
    .generateSalary(formData)
    .then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert(
          'success',
           'salary slip generated Successfully')
          resetForm(this.state.initValue)
        
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }
	employeeListIds = (option) => {
		this.setState(
			{
				initValue: {
					...this.state.initValue,
					...{
						employeeListIds: option,
					},
				},
			},
			() => { },
		);
		// this.formRef.current.setFieldValue('employeeListIds', option, true);
	};
  getStateList = (countryCode) => {
		this.props.employeeActions.getStateList(countryCode);
	};

  render() {

    const { currency_list,country_list,state_list,employee_list_dropdown } = this.props

   
    return (
      <div className="create-employee-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user-tie" />
                        <span className="ml-2">Generate Salary Slip</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                         initialValues={this.state.initValue}
                         onSubmit={(values, { resetForm }) => {
                           this.handleSubmit(values, resetForm)
                           // resetForm(this.state.initValue)
 
                           // this.setState({
                           //   selectedContactCurrency: null,
                           //   selectedCurrency: null,
                           //   selectedInvoiceLanguage: null
                           // })
                         }}
                        // validationSchema={Yup.object().shape({
                        //   noOfDays: Yup.string()
                        //     .required("Number Of Days is Required"),
                        //   salaryDate: Yup.string()
                        //     .required("Salary Date is Required"),
                        //   employeeId: Yup.string()
                        //     .required("employee Name is Required"),
                        // })}
                      >
                        {(props) => (

                          
                      <Form onSubmit={props.handleSubmit}>
                          
                       <Row>
                          
                           <Col lg={10}>
                            <Row  className="row-wrapper">
                              
                            <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="employeeListIds"><span className="text-danger">*</span>Employee Name</Label>
                                  <Select
																		styles={customStyles}
                                    isMulti
																		options={
                                      // employee_list.data
																			// 	? selectOptionsFactory.renderOptions(
																			// 			'label',
																			// 			'value',
                                      //       employee_list.data,
																			// 			'Employee',
																			// 	  )
																			// 	: []
                                      employee_list_dropdown
                                      ?  employee_list_dropdown
                                      : []
																		}
																		id="employeeListIds"
																		name="employeeListIds"
																		placeholder="Select Employee Names "
																		value={
                                      employee_list_dropdown &&
                                      props.values.employeeIds
                                      ? employee_list_dropdown.find(
                                        (option) =>
                                          option.value ===
                                          +props.values.employeeIds.map(
                                            (item) => item.id,
                                          ),
                                      )
                                      : props.values
                                        .employeeIds
                                    }
                                    onChange={(option) => {
                                      props.handleChange(
                                        'employeeIds',
                                      )(option);
                                      this.employeeListIds(option);
                                    }}
																		className={`${
																			props.errors.employeeListIds && props.touched.employeeListIds
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.employeeListIds && props.touched.employeeListIds && (
																		<div className="invalid-feedback">
																			{props.errors.employeeListIds}
																		</div>
																	)}
                                </FormGroup>
                              </Col>
                          
                              <Col lg={4}>                            
                                <FormGroup className="mb-3">
                                  <Label htmlFor="date"><span className="text-danger">*</span>Salary Date</Label>
                                  <DatePicker
                                    className={`form-control ${props.errors.salaryDate && props.touched.salaryDate ? "is-invalid" : ""}`}
                                    id="salaryDate"
                                    name="salaryDate"
                                    placeholderText="Select Salary Date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    selected={props.values.salaryDate}
                                    value={props.values.salaryDate}
                                    onChange={(value) => {
                                      props.handleChange("salaryDate")(value)
                                    }}
                                  />
                                  {props.errors.salaryDate && props.touched.salaryDate && (
                                    <div className="invalid-feedback">{props.errors.salaryDate}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>Number Of Days</Label>
                                  <Input
                                    type="text"
                                    id="noOfDays"
                                    name="noOfDays"
                                    value={props.values.noOfDays}
                                    placeholder="Enter nunmber Of Days"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExBoth.test(option.target.value)) { props.handleChange('noOfDays')(option) }
                                    }}
                                    className={props.errors.noOfDays && props.touched.noOfDays ? "is-invalid" : ""}
                                  />
                                  {props.errors.noOfDays && props.touched.lastName && (
                                    <div className="invalid-feedback">{props.errors.noOfDays}</div>
                                  )}
                                </FormGroup>
                              </Col>
                             
                            </Row>
                          
                                </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                    this.setState(() => {
                                      props.handleSubmit()
                                    })
                                  }}>
                                    <i className="fa fa-dot-circle-o"></i> Generate
                                      </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/payroll/employee') }}>
                                    <i className="fa fa-ban"></i> Cancel
                                      </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        )
                        }
                      </Formik>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewPayroll)

