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
import { Formik } from 'formik';
import * as Yup from "yup";
import { Loader, LeavePage, ConfirmDeleteModal } from 'components'
import { CommonActions } from 'services/global'
import * as EmployeeActions from '../../actions';
import * as DesignationDetailActions from './actions';
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
    designationDetailActions: bindActionCreators(DesignationDetailActions, dispatch)
  })
}
let strings = new LocalizedStrings(data);
class DetailDesignation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: window['localStorage'].getItem('language'), 
      loading: true,
			disableLeavePage:false,
      initValue: {},
      current_salary_role_id: null,
      dialog: false,
      idExist:false,
      nameExist:false
    }

    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;
  }

  componentDidMount = () => {
    this.initializeData();
  }

  designationIdvalidationCheck = (value) => {
    const data = {
        moduleType: 25,
        name: value,
    };
    this.props.commonActions.checkValidation(data).then((response) => {
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

designationNamevalidationCheck = (value) => {
  const data = {
      moduleType: 26,
      name: value,
  };
  this.props.commonActions.checkValidation(data).then((response) => {
      if (response.data === 'Designation name already exists') {
          this.setState({
              nameExist: true,
          });
      } else {
          this.setState({
              nameExist: false,
          });
      }
  });
};

  initializeData = () => {
    if (this.props.location.state && this.props.location.state.id) {
      this.props.designationDetailActions.getEmployeeDesignationById
      (this.props.location.state.id).then((res) => {
        if (res.status === 200) {
          this.setState({
            current_salary_role_id: this.props.location.state.id,
            initValue: {
              designationId:res.data.designationId ? res.data.designationId : '',
          
              designationName: res.data.designationName ? res.data.designationName : '',
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
    this.setState({ disableLeavePage:true });
		const { current_salary_role_id} = this.state;
		const {
      designationName,
      designationId
		} = data;

		let formData = new FormData();
		formData.append('id', current_salary_role_id);
    
		formData.append('designationId', designationId ? designationId : '');
    formData.append('designationName', designationName ? designationName : '');
		this.props.designationDetailActions
			.updateEmployeeDesignation(formData)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'Designation Updated Successfully.',
				);
				this.props.history.push('/admin/payroll/config',{tabNo:'3'});
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

  delete = () => {
    const message1 =
    <text>
    <b>Delete Designation ?</b>
    </text>
    const message = 'This designation will be deleted permanently and cannot be recovered. ';
    this.setState({
      dialog: <ConfirmDeleteModal
                  isOpen={true}
                  okHandler={this.remove}
                  cancelHandler={this.removeDialog}
                  message={message}
                  message1={message1} 
                />
    })
  }

  remove = () => {
    const { current_salary_role_id } = this.state;
    this.props.designationDetailActions.deleteDesignation(current_salary_role_id).then((res) => {
      if (res.status === 200) {
        this.setState({disableLeavePage:true})
        this.props.commonActions.tostifyAlert('success', 'Designation Deleted Successfully !')
        this.props.history.push('/admin/payroll/config',{tabNo:'3'})
      }

    }).catch((err) => {
      /**
       * “already exists http status code” 
       *  The appropriate status code for "Already Exists" would be 
       * '409 Conflict'
       */
      if(err.status===409)  
       {
        this.setState({disableLeavePage:true})
        this.props.commonActions.tostifyAlert('error', 'Designation can\'t be deleted, you need to delete employee first.')
        this.props.history.push('/admin/payroll/config',{tabNo:'3'})
        }
      else
      this.props.commonActions.tostifyAlert('error', 'Something Went Wrong')
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
                        <span className="ml-2">{strings.UpdateDesignation}</span>
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
                            
                         validate={(values) => {
                          let errors = {};

                          if(this.state.nameExist==true){
                            errors.designationName=
                             "Designation name is already exist";
                        }

                         if(this.state.idExist==true)
                            errors.designationId="Designation ID is already exist";

                          return errors;
                        }}
                            validationSchema={Yup.object().shape({
                              designationId:Yup.string()
                              .required("Designation ID is required"),
                              designationName: Yup.string()
                                .required("Designation name is required"),
                            
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
                                  <Label htmlFor="select"><span className="text-danger">* </span>{strings.DESIGNATIONID}</Label>
                                  <Input
                                    type="text"
                                    id="designationId"
                                    name="designationId"
                                    maxLength="9"
                                    value={props.values.designationId}
                                    placeholder={strings.Enter+strings.DESIGNATIONID}
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regEx.test(option.target.value))
                                         { props.handleChange('designationId')(option)   
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
                                  <Label htmlFor="select"><span className="text-danger">* </span>{strings.DesignationName}</Label>
                                  <Input
                                    type="text"
                                    id="designationName"
                                    name="designationName"
                                    maxLength="30"
                                    value={props.values.designationName}
                                    placeholder="Enter Designation Name"
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) {
                                         props.handleChange('designationName')(option)
                                         this.designationNamevalidationCheck(option.target.value)
                                        }
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
                                  <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                    <FormGroup>
                                      <Button type="button" name="button" color="danger" className="btn-square"
                                        onClick={this.delete}
                                      >
                                        <i className="fa fa-trash"></i> {strings.Delete}
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                    <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                    this.setState({ createMore: false }, () => {
                                      props.handleSubmit()
                                    })
                                  }}>
                                        <i className="fa fa-dot-circle-o"></i> {strings.Update}
                                    </Button>
                                      <Button type="button" color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push('/admin/payroll/config',{tabNo:'3'}) }}>
                                        <i className="fa fa-ban"></i> {strings.Cancel}
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
			{this.state.disableLeavePage ?"":<LeavePage/>}
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailDesignation)

