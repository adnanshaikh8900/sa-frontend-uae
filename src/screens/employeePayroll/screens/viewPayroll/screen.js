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

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list,
    country_list: state.contact.country_list,
    state_list: state.contact.state_list,
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
      createMore: false,
      initValue: {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        referenceCode: '',
        title: '',
        billingEmail: '',
        countryId: '',
        permanentAddress:'',
        presentAddress:'',
        bloodGroup:'',
        mobileNumber:'',
        vatRegestationNo: '',
        currencyCode: '',
        poBoxNumber: '',
        employeeRole:'',
        stateId: '',
        gender:'',
        pincode: '',
        city: '',
      },
      userPhoto: [],
			userPhotoFile: [],
    }

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
  }

  componentDidMount = () => {
    this.initializeData();
  };

  initializeData = () => {
    this.props.employeeActions.getCountryList();
  };

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
		} = data;

		const { gender } = this.state;
    const { bloodGroup } = this.state;
		const formData = new FormData();

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
      'mobileNumber',
      mobileNumber != null ? mobileNumber : '',
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
      'countryId',
      countryId != null ? countryId :'',
    )
    formData.append(
      'stateId',
      stateId != null ? stateId :'',
    )
    formData.append(
      'city',
      city != null ? city : '',
    )
    formData.append(
      'pincode',
      pincode != null ? pincode : '',
    )
    if (gender && gender.value) {
			formData.append('gender', gender.value);
		}
    if (bloodGroup && bloodGroup.value) {
			formData.append('bloodGroup', bloodGroup.value);
		}
    
    this.props.employeeCreateActions
    .createEmployee(formData)
    .then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert(
          'success',
           'New Employee Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm(this.state.initValue)
        } else {
          this.props.history.push('/admin/master/employee')
        }
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

  getStateList = (countryCode) => {
		this.props.employeeActions.getStateList(countryCode);
	};

  render() {

    const { currency_list,country_list,state_list } = this.props

    console.log(country_list)
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
                        <span className="ml-2">View Payroll</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        // initialValues={this.state.initValue}
                        // onSubmit={(values, { resetForm }) => {
                        //   this.handleSubmit(values, resetForm)
                        //   // resetForm(this.state.initValue)

                        //   // this.setState({
                        //   //   selectedContactCurrency: null,
                        //   //   selectedCurrency: null,
                        //   //   selectedInvoiceLanguage: null
                        //   // })
                        // }}
                        // validationSchema={Yup.object().shape({
                        //   firstName: Yup.string()
                        //     .required("First Name is Required"),
                        //   lastName: Yup.string()
                        //     .required("Last Name is Required"),
                        //   middleName: Yup.string()
                        //     .required("Middle Name is Required"),
                        //   email: Yup.string().email("Valid Email Required"),
                        //   billingEmail: Yup.string().email("Valid Email Required"),
                        //   password: Yup.string()
                        //     .required("Password is Required")
                        //     // .min(8, "Password Too Short")
                        //     .matches(
                        //       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                        //       "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                        //     ),
                        //   confirmPassword: Yup.string()
                        //     .required('Confirm Password is Required')
                        //     .oneOf([Yup.ref("password"), null], "Passwords must match"),
                        //   dob: Yup.date()
                        //     .required('DOB is Required')
                        // })}
                      >
                        {(props) => (

                          <Form onSubmit={props.handleSubmit}>
                          
                       <Row>
                          
                           <Col lg={10}>
                            <Row  className="row-wrapper">
                              
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>Employee Name</Label>
                                  <Input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={props.values.firstName}
                                    placeholder="Enter First Name"
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
                                  <Label htmlFor="select"><span className="text-danger">*</span>Salary Date</Label>
                                  <Input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={props.values.middleName}
                                    placeholder="Enter Middle Name"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('middleName')(option) }
                                    }}
                                    className={props.errors.middleName && props.touched.middleName ? "is-invalid" : ""}
                                  />
                                  {props.errors.middleName && props.touched.middleName && (
                                    <div className="invalid-feedback">{props.errors.middleName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">*</span>Number Of days</Label>
                                  <Input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={props.values.lastName}
                                    placeholder="Enter Last Name"
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
                          
                                </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="button" color="primary" className="btn-square mr-3"
                        
                                     
                                   onClick={() => { this.props.history.push('/admin/payroll/employee/salarySlip') }}
                                  >
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

