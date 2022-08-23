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
import { Formik } from 'formik';
import * as Yup from "yup";
import { LeavePage } from 'components';
import {
  CommonActions
} from 'services/global'
import * as SalaryRoleActions from '../../actions';
import * as EmployeeDesignationCreateActions from './actions';
import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'  
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list,

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    salaryRoleActions: bindActionCreators(SalaryRoleActions, dispatch),
    employeeDesignationCreateAction: bindActionCreators(EmployeeDesignationCreateActions, dispatch)

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

let strings = new LocalizedStrings(data);
class CreateDesignation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: window['localStorage'].getItem('language'),
      loading: false,
      createMore: false,
			disableLeavePage:false,
      initValue: {
        designationName:'',
        designationId:''
      },
      idExist:false
    }

    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;


  }

  componentDidMount = () => {
    this.initializeData();
  };

  initializeData = () => {

  };
  designationIdvalidationCheck = (value) => {
    const data = {
        moduleType: 25,
        name: value,
    };
    this.props.commonActions.checkValidation(data).then((response) => {
      console.log(response.data);
        if (response.data === 'Designation ID already exists') {
            this.setState({
                idExist: true,
            });
        } else {
            this.setState({
                idExist: false,
            });
        }
    });
};
  handleSubmit = (data, resetForm) => {
    this.setState({ disabled: true,disableLeavePage:true });
		const {
      designationName,
      designationId
		} = data;

		const formData = new FormData();

    if(!this.state.idExist){
    formData.append(
      'designationId',
      designationId != null ? designationId : '',
    )}
    formData.append(
      'designationName',
      designationName != null ? designationName : '',
    )
   
    this.props.employeeDesignationCreateAction
    .createEmployeeDesignation(formData)
    .then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert(
          'success',
           'New Employee Designation Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm(this.state.initValue)
        } else {
          this.props.history.push('/admin/payroll/config',{tabNo:'3'})
        }
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

  render() {
    strings.setLanguage(this.state.language);
    const { currency_list,state_list } = this.props


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
                        <span className="ml-2">{strings.CreateDesignation}</span>
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

                        //   // this.setState({
                        //   //   selectedContactCurrency: null,
                        //   //   selectedCurrency: null,
                        //   //   selectedInvoiceLanguage: null
                        //   // })
                         }}
                         validate={(values) => {
                          let errors = {};

                         if(this.state.idExist==true)
                            errors.designationId="Designation ID is already exist";

                          return errors;
                        }}
                        validationSchema={Yup.object().shape({
                          designationName: Yup.string()
                            .required("Designation name is required"),  
                            designationId: Yup.string()
                            .required("Designation id is required"),                  
                        })}
                      >
                        {(props) => (

                          <Form onSubmit={props.handleSubmit}>
                          
                       <Row>
                          
                           <Col lg={10}>
                            <Row  className="row-wrapper">
                            <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">* </span>{strings.DESIGNATIONID}</Label>
                                  <Input
                                    type="text"
                                    id="designationId"
                                    name="designationId"
                                    maxLength="9"
                                    value={props.values.designationId}
                                    placeholder={strings.Enter+strings.DESIGNATIONID}
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regEx.test(option.target.value)) {
                                         props.handleChange('designationId')(option)
                                         this.designationIdvalidationCheck(option.target.value)
                                     }
                                    }}
                                    className={props.errors.designationId && props.touched.designationId ? "is-invalid" : ""}
                                  />
                                  {props.errors.designationId && props.touched.designationId && (
                                    <div className="invalid-feedback">{props.errors.designationId}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">* </span>{strings.EmployeeDesignationName}</Label>
                                  <Input
                                    type="text"
                                    id="designationName"
                                    name="designationName"
                                    maxLength="30"
                                    value={props.values.designationName}
                                    placeholder={strings.Enter+strings.DesignationName}
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('designationName')(option) }
                                    }}
                                    className={props.errors.designationName && props.touched.designationName ? "is-invalid" : ""}
                                  />
                                  {props.errors.designationName && props.touched.designationName && (
                                    <div className="invalid-feedback">{props.errors.designationName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                          
                            </Row>                         
                          
                            <hr />
                           
                            </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                    	//  added validation popup  msg                                                                
																				props.handleBlur();
																				if(props.errors &&  Object.keys(props.errors).length != 0)
																				this.props.commonActions.fillManDatoryDetails();
                                    this.setState({ createMore: false }, () => {
                                      props.handleSubmit()
                                    })
                                  }}>
                                    <i className="fa fa-dot-circle-o"></i>  {strings.Create}
                                      </Button>
                                  <Button name="button" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      	//  added validation popup  msg                                                                
																				props.handleBlur();
																				if(props.errors &&  Object.keys(props.errors).length != 0)
																				this.props.commonActions.fillManDatoryDetails();
                                      this.setState({ createMore: true }, () => {
                                        props.handleSubmit()
                                      })
                                    }}>
                                    <i className="fa fa-refresh"></i>  {strings.CreateandMore}
                                      </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/payroll/config',{tabNo:'3'}) }}>
                                    <i className="fa fa-ban"></i>  {strings.Cancel}
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
			{this.state.disableLeavePage ?"":<LeavePage/>}
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateDesignation)

