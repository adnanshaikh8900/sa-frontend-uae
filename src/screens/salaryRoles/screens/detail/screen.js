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
  Label
} from 'reactstrap'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";
import moment from 'moment'

import { Loader, ConfirmDeleteModal } from 'components'

import {
  CommonActions
} from 'services/global'
import {selectCurrencyFactory, selectOptionsFactory} from 'utils'
import * as EmployeeActions from '../../actions';
import * as SalarayRoleDetailActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    salarayRoleDetailActions: bindActionCreators(SalarayRoleDetailActions, dispatch)
  })
}
let strings = new LocalizedStrings(data);
class DetailSalaryRole extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: window['localStorage'].getItem('language'),
      loading: true,
      initValue: {},
      current_salary_role_id: null,
      dialog: false,
      disabled: false,
    }

    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;
  }

  componentDidMount = () => {
    this.initializeData();
  }

  initializeData = () => {
    if (this.props.location.state && this.props.location.state.id) {
      this.props.salarayRoleDetailActions.getSalaryRoleById
      (this.props.location.state.id).then((res) => {
        if (res.status === 200) {
          this.setState({
            current_salary_role_id: this.props.location.state.id,
            initValue: {
              salaryRoleName: res.data.salaryRoleName ? res.data.salaryRoleName : '',
            },
            loading: false,
          })
        }
      }).catch((err) => {
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
      })
    } else {
      this.props.history.push('/admin/payroll/config')
    }
  }

  // handleSubmit = (data) => {
  //   const postData = Object.assign({},data)
  //   if(typeof postData.currencyCode === 'object') {
  //     postData.currencyCode = data.currencyCode.value
  //   }
  //   this.props.employeeDetailActions.updateSalaryRole(postData).then((res) => {
  //     if (res.status === 200) {
  //       this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully')
  //       this.props.history.push('/admin/master/employee')
  //     }
  //   }).catch((err) => {
  //     this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
  //   })
  // }
  handleSubmit = (data) => {
    this.setState({ disabled: true });
		const { current_salary_role_id} = this.state;
		const {
		salaryRoleName,
    
		} = data;

		let formData = new FormData();
		formData.append('id', current_salary_role_id);
		formData.append('salaryRoleName', salaryRoleName ? salaryRoleName : '');
		this.props.salarayRoleDetailActions
			.updateSalaryRole(formData)
			.then((res) => {
        this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'success',
					'Salary Role Updated Successfully.',
				);
				this.props.history.push('/admin/payroll/config');
			})
			.catch((err) => {
        this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

  deleteEmployee = () => {
    const message1 =
    <text>
    <b>Delete Employee?</b>
    </text>
    const message = 'This Employee will be deleted permanently and cannot be recovered. ';
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeEmployee}
        cancelHandler={this.removeDialog}
        message={message}
        message1={message1}
      />
    })
  }

  removeEmployee = () => {
    const { current_employee_id } = this.state;
    this.props.employeeDetailActions.deleteEmployee(current_employee_id).then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Employee Deleted Successfully !!')
        this.props.history.push('/admin/master/employee')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

  removeDialog = () => {
    this.setState({
      dialog: null
    })
  }

  render() {
    strings.setLanguage(this.state.language);
    const { currency_list } = this.props
    const { dialog, loading, initValue } = this.state
    return (
      loading ==true? <Loader/> :
<div>
      <div className="detail-employee-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user-tie" />
                        <span className="ml-2"> {strings.UpdateSalaryRole}</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {dialog}
                  {loading ?
                    (
                      <Loader />
                    )
                    :
                    (
                      <Row>
                        <Col lg={12}>
                          <Formik
                            initialValues={initValue}
                            onSubmit={(values, { resetForm }) => {
                              this.handleSubmit(values)
                              // resetForm(this.state.initValue)
                            }}
                            validationSchema={Yup.object().shape({
                              salaryRoleName: Yup.string()
                                .required("Salary Role Name is Required"),
                            
                            })}
                          >
                                  {(props) => (

                                  <Form  onSubmit={(values, { resetForm }) => {
                                    this.handleSubmit(values, resetForm)
                                    // resetForm(this.state.initValue)

                                  }}>
                               
                                <Row>
                                <Col lg={10}>
                            <Row  className="row-wrapper">
                              
                              <Col lg={4}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">* </span>{strings.SalaryRoleName}</Label>
                                  <Input
                                    type="text"
                                    id="salaryRoleName"
                                    name="salaryRoleName"
                                    value={props.values.salaryRoleName}
                                    placeholder="Enter Salary Role Name"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('salaryRoleName')(option) }
                                    }}
                                    className={props.errors.salaryRoleName && props.touched.salaryRoleName ? "is-invalid" : ""}
                                  />
                                  {props.errors.firstName && props.touched.firstName && (
                                    <div className="invalid-feedback">{props.errors.salaryRoleName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                          
                            </Row>                         
                          
                            <hr />
                           
                            </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                    {/* <FormGroup>
                                      <Button type="button" name="button" color="danger" className="btn-square"
                                        onClick={this.deleteEmployee}
                                      >
                                        <i className="fa fa-trash"></i>  {strings.Delete}
                                    </Button>
                                    </FormGroup> */}
                                    <FormGroup className="text-right">
                                    <Button type="button" color="primary" className="btn-square mr-3" 	disabled={this.state.disabled} onClick={() => {
                                    this.setState({ createMore: false }, () => {
                                      props.handleSubmit()
                                    })
                                  }}>
                                        <i className="fa fa-dot-circle-o"></i> {this.state.disabled
																			? 'Updating...'
																			: strings.Update }
                                    </Button>
                                      <Button type="button" color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push('/admin/payroll/config',{tabNo:'1'}) }}>
                                        <i className="fa fa-ban"></i>{strings.Cancel}
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
                    )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailSalaryRole)

