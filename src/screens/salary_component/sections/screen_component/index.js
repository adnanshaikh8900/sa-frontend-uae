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
  UncontrolledTooltip,
} from 'reactstrap'
import { Formik } from 'formik';
import * as Yup from "yup";
import Select from 'react-select';
import { LeavePage, ConfirmDeleteModal, Loader } from 'components';
import { selectOptionsFactory } from 'utils';
import { CommonActions } from 'services/global'
import * as SalaryComponentActions from '../../actions';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css'
//import './style.scss'
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    salaryComponentActions: bindActionCreators(SalaryComponentActions, dispatch),
  })
}
let strings = new LocalizedStrings(data);
class SalaryComponentScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: window['localStorage'].getItem('language'),
      loading: false,
      createMore: false,
      disableLeavePage: false,
      salaryComponent_id:'null',
      initValue: {
        componentId: '',
        componentName: '',
        componentType: this.props.ComponentType ? this.props.ComponentType : 'Earning',
        calculationType: 2,
        ctcPercent: '',
        flatAmount: '',
      },
      enableDelete: true,
    }
    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;
    this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
  }

  componentDidMount = () => {
    this.initializeData();
  };

  initializeData = () => {
    if (this.props.componentID && !this.props.isCreated) {
      // this.props.employeeActions.getEmployeeCountForDesignation(this.props.location.state.id).then(res => {
      //   if (res.status === 200) {
      //     this.setState({ enableDelete: res.data && res.data > 0 ? false : true })
      //   }
      // })
    }

  };
  componentNamevalidationCheck = (value) => {
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
  componentIdvalidationCheck = (value) => {
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
        this.setState({ disableLeavePage: true })
        this.props.commonActions.tostifyAlert('success', 'Designation Deleted Successfully !')
        this.props.history.push('/admin/payroll/config', { tabNo: '3' })
      }

    }).catch((err) => {
      /**
       * “already exists http status code” 
       *  The appropriate status code for "Already Exists" would be 
       * '409 Conflict'
       */
      if (err.status === 409) {
        this.setState({ disableLeavePage: true })
        this.props.commonActions.tostifyAlert('error', 'Designation can\'t be deleted, you need to delete employee first.')
        this.props.history.push('/admin/payroll/config', { tabNo: '3' })
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
  handleSubmit = (data, resetForm) => {
  
    this.setState({ disabled: true, disableLeavePage: true, });
    const {
      componentName,
      componentId,
      componentType,
      flatAmount,
      ctcPercent,
      calculationType
    } = data;

    const formData = new FormData();
    formData.append('description', componentName != null ? componentName : '',)
    formData.append('flatAmount', flatAmount != null ? flatAmount : '',)
    formData.append('formula', ctcPercent != null ? ctcPercent : '',)
    formData.append('componentCode', componentId != null ? componentId : '',)
    formData.append('componentType', componentType ? componentType : '');
    formData.append('salaryStructure', componentType ? componentType === 'Earning' ? 1 : componentType === 'Deduction' : 3);
    formData.append('calculationType', calculationType ? calculationType : '');

    this.props.salaryComponentActions
      .saveSalaryComponent(formData)
      .then((res) => {
        if (res.status === 200) {
          this.props.commonActions.tostifyAlert(
            'success',
            'Salary Component Created Successfully')
          if (this.state.createMore) {
            this.setState({
              createMore: false
            })
            resetForm(this.state.initValue)
          } else {
            this.props.history.push('/admin/payroll/config', { tabNo: '3' })
          }
        }
      }).catch((err) => {
        this.setState({ disabled: false, disableLeavePage: false });
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
      })

  
      .updateSalaryComponent(formData)
      .then((res) => {
        if (res.status === 200) {
          this.props.commonActions.tostifyAlert(
            'success',
            'Salary Component Updated Successfully!')
          if (this.state.createMore) {
            this.setState({
              createMore: false
            })
            resetForm(this.state.initValue)
          } else {
            this.props.history.push('/admin/payroll/config', { tabNo: '3' })
          }
        }
      }).catch((err) => {
        this.setState({ disabled: false, disableLeavePage: false });
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
      })
  }
  deleteSalaryComponent = () => {
    const message1 =
      <text>
        <b>Delete Product Category?</b>
      </text>
    const message = 'This Salary Component will be deleted permanently and cannot be recovered. ';
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeSalaryComponent}
        cancelHandler={this.removeDialog}
        message={message}
        message1={message1}
      />
    })
  }
  removeSalaryComponent = () => {
    this.setState({ disabled1: true });
    const { salaryComponent_id } = this.state
    this.setState({ loading: true, loadingMsg: "Deleting Salary Component..." });
    this.props.detailProductCategoryAction.deleteSalaryComponent(salaryComponent_id).then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert(
          'success',
          res.data ? res.data.message : 'Salary Component Deleted Successfully'
        )
        this.props.history.push('/admin/payroll/config')
        this.setState({ loading: false, });
      }
    }).catch((err) => {
      this.setState({ disabled: false, disableLeavePage: false });
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
    const { ComponentType, isCreated, salaryStructureModalCard } = this.props
    const { enableDelete } = this.state;


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
                        <i className="nav-icon fas fa-money-check" />
                        <span className="ml-2">{this.props.isCreated ? strings.CreateSalaryComponent : strings.UpdateSalaryComponent}</span>
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
                        }}
                        validate={(values) => {
                          let errors = {};
                          if (parseInt(values.componentId) === 0) {
                            errors.componentId =
                              "Enter valid designation ID";
                          } else if (this.state.idExist === true || parseInt(values.componentId) === 1 || parseInt(values.componentId) === 2 || parseInt(values.componentId) === 3 || parseInt(values.componentId) === 4) {
                            errors.componentId =
                              "Designation ID already exist";
                          }

                          if (this.state.nameExist === true) {
                            errors.componentName =
                              "Designation name already exist";
                          }
                          // return errors;
                          if (values.calculationType === 2 && !values.ctcPercent) {
                            errors.ctcPercent = strings.PercentOfCTCIsRequired
                          }
                          if (values.calculationType === 1 && !values.flatAmount) {
                            errors.flatAmount = strings.FlatAmountIsRequired
                          }

                          return errors;
                        }}

                        validationSchema={Yup.object().shape({
                          componentName: Yup.string()
                            .required(strings.ComponentNameIsRequired).test('is new',
                              strings.ComponentNameAlreadyExists,
                              () => !this.state.nameExist),
                          componentType: Yup.string()
                            .required(strings.componentTypeIsRequired),
                          componentId: Yup.string()
                            .required("Compoonent id is required").test('is new',
                              "Component ID already exist",
                              () => !this.state.idExist)
                        })}
                      >
                        {(props) => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={12}>
                                <Row className="row-wrapper">
                                  <Col lg={4}>
                                    <FormGroup>
                                      <Label htmlFor="componentId"><span className="text-danger">* </span>{strings.ComponentID}</Label>
                                      <Input
                                        type="text"
                                        id="componentId"
                                        name="componentId"
                                        maxLength="9"
                                        value={props.values.componentId}
                                        placeholder={strings.Enter + strings.ComponentID}
                                        onChange={(option) => {
                                          if (option.target.value === '' || this.regEx.test(option.target.value)) {
                                            props.handleChange('componentId')(option)
                                            this.componentIdvalidationCheck(option.target.value)
                                          }
                                        }}
                                        className={props.errors.componentId && props.touched.componentId ? "is-invalid" : ""}
                                      />
                                      {props.errors.componentId && props.touched.componentId && (
                                        <div className="invalid-feedback">{props.errors.componentId}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup>
                                      <Label htmlFor="componentName"><span className="text-danger">* </span>{strings.ComponentName}</Label>
                                      <Input
                                        type="text"
                                        id="componentName"
                                        name="componentName"
                                        maxLength="30"
                                        value={props.values.componentName}
                                        placeholder={strings.Enter + strings.ComponentName}
                                        onChange={(option) => {
                                          if (option.target.value === '' || this.regExAlpha.test(option.target.value)) {
                                            props.handleChange('componentName')(option)
                                            this.componentNamevalidationCheck(option.target.value)
                                          }
                                        }}
                                        className={props.errors.componentName && props.touched.componentName ? "is-invalid" : ""}
                                      />
                                      {props.errors.componentName && props.touched.componentName && (
                                        <div className="invalid-feedback">{props.errors.componentName}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <hr />
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="componentType">
                                        <span className="text-danger">* </span>
                                        {strings.ComponentType}
                                        <i
                                          id="componentTypeTooltip"
                                          className="fa fa-question-circle ml-1"
                                        ></i>
                                        <UncontrolledTooltip
                                          placement="right"
                                          target="componentTypeTooltip"
                                        >
                                          {strings.ComponentTypeTooltip}
                                        </UncontrolledTooltip>
                                      </Label>
                                      <br />
                                      <FormGroup check inline>
                                        <div className="custom-radio custom-control">
                                          <input
                                            disabled={ComponentType}
                                            className="custom-control-input"
                                            type="radio"
                                            id="componentType-inline-radio1"
                                            name="componentType-inline-radio1"
                                            checked={props.values.componentType === 'Earning'}
                                            value={props.values.componentType}
                                            onChange={(value) => {
                                              props.handleChange('componentType')('Earning')
                                            }}
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="componentType-inline-radio1"
                                          >
                                            {strings.Earning}
                                          </label>
                                        </div>
                                      </FormGroup>
                                      <FormGroup check inline>
                                        <div className="custom-radio custom-control">
                                          <input
                                            disabled={ComponentType}
                                            className="custom-control-input"
                                            type="radio"
                                            id="componentType-inline-radio2"
                                            name="componentType-inline-radio2"
                                            value={props.values.componentType}
                                            checked={props.values.componentType === 'Deduction'}
                                            onChange={(value) => {
                                              props.handleChange('componentType')('Deduction')
                                            }}
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="componentType-inline-radio2"
                                          >
                                            {strings.Deduction}
                                          </label>
                                        </div>
                                      </FormGroup>

                                    </FormGroup>
                                  </Col>
                                </Row>
                                <hr />
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="calculationType">
                                        <span className="text-danger">* </span>
                                        {strings.CalculationType}
                                      </Label>
                                      <br />
                                      <FormGroup check inline>
                                        <div className="custom-radio custom-control">
                                          <input
                                            className="custom-control-input"
                                            type="radio"
                                            id="calculationType-inline-radio1"
                                            name="calculationType-inline-radio1"
                                            checked={props.values.calculationType === 2}
                                            value={props.values.calculationType}
                                            onChange={(value) => {
                                              props.handleChange('calculationType')(2)
                                            }}
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="calculationType-inline-radio1"
                                          >
                                            {strings.PercentOfCTC}
                                          </label>
                                        </div>
                                      </FormGroup>
                                      <FormGroup check inline>
                                        <div className="custom-radio custom-control">
                                          <input
                                            className="custom-control-input"
                                            type="radio"
                                            id="calculationType-inline-radio2"
                                            name="calculationType-inline-radio2"
                                            value={props.values.calculationType}
                                            checked={props.values.calculationType === 1}
                                            onChange={(value) => {
                                              props.handleChange('calculationType')(1)
                                            }}
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="calculationType-inline-radio2"
                                          >
                                            {strings.FlatAmount}
                                          </label>
                                        </div>
                                      </FormGroup>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    {props.values.calculationType === 2 ?
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="ctcPercent">
                                          <span className="text-danger">* </span>
                                          {strings.PercentOfCTC}
                                        </Label>
                                        <Input
                                          type='number'
                                          min={1}
                                          max={100}
                                          value={props.values.ctcPercent}
                                          onChange={(option) => {
                                            if (option.target.value > 0 && option.target.value < 101) {
                                              props.handleChange('ctcPercent')(option,);
                                            } else if (option.target.value === '') {
                                              props.handleChange('ctcPercent')('');
                                            }
                                          }}
                                          placeholder={strings.Enter + strings.PercentOfCTC}
                                          id="ctcPercent"
                                          name="ctcPercent"
                                          className={
                                            props.errors.ctcPercent &&
                                              props.touched.ctcPercent
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                        {props.errors.ctcPercent &&
                                          props.touched.ctcPercent && (
                                            <div className="invalid-feedback">
                                              {props.errors.ctcPercent}
                                            </div>
                                          )}
                                      </FormGroup> :
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="flatAmount">
                                          <span className="text-danger">* </span>
                                          {strings.FlatAmount}
                                        </Label>
                                        <Input
                                          type='text'
                                          maxLength="14,2"
                                          min={1}
                                          value={props.values.flatAmount}
                                          onChange={(option) => {
                                            if (option.target.value === '' || this.regDecimal.test(option.target.value)) {
                                              props.handleChange('flatAmount')(option,);
                                            }
                                          }}
                                          placeholder={strings.Enter + strings.FlatAmount}
                                          id="flatAmount"
                                          name="flatAmount"
                                          className={
                                            props.errors.flatAmount &&
                                              props.touched.flatAmount
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                        {props.errors.flatAmount &&
                                          props.touched.flatAmount && (
                                            <div className="invalid-feedback">
                                              {props.errors.flatAmount}
                                            </div>
                                          )}

                                      </FormGroup>
                                    }
                                  </Col>
                                </Row>
                                <hr />
                                <Row>
                                  <Col>
                                    <p><strong>Note:</strong> {strings.SalaryComponentCreateNote}</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                <FormGroup>
                                  {enableDelete && !isCreated && <Button type="button" name="button" color="danger" className="btn-square"
                                    onClick={this.delete}
                                  >
                                    <i className="fa fa-trash"></i> {strings.Delete}
                                  </Button>}
                                </FormGroup>
                                <FormGroup className="text-right">
                                  {isCreated ? <>
                                    <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                      //  added validation popup  msg                                                                
                                      props.handleBlur();
                                      if (props.errors && Object.keys(props.errors).length != 0)
                                        this.props.commonActions.fillManDatoryDetails();
                                      this.setState({ createMore: false }, () => {
                                        props.handleSubmit()
                                      })
                                    }}>
                                      <i className="fa fa-dot-circle-o"></i>  {strings.Create}
                                    </Button>
                                    {!salaryStructureModalCard && <Button name="button" color="primary" className="btn-square mr-3"
                                      onClick={() => {
                                        //  added validation popup  msg                                                                
                                        props.handleBlur();
                                        if (props.errors && Object.keys(props.errors).length != 0)
                                          this.props.commonActions.fillManDatoryDetails();
                                        this.setState({ createMore: true }, () => {
                                          props.handleSubmit()
                                        })
                                      }}>
                                      <i className="fa fa-refresh"></i>  {strings.CreateandMore}
                                    </Button>}
                                  </> :
                                    <Button type="button" color="primary" className="btn-square mr-3"
                                      //disabled={!props.dirty}
                                      onClick={() => {
                                        this.setState({ createMore: false }, () => {
                                          props.handleSubmit()
                                        })
                                      }}>
                                      <i className="fa fa-dot-circle-o"></i> {strings.Update}
                                    </Button>
                                  }
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => {
                                      if (salaryStructureModalCard)
                                        this.props.closeModal(true);
                                      else
                                        this.props.history.push('/admin/payroll/config', { tabNo: '3' })
                                    }}>
                                    <i className="fa fa-ban"></i>  {strings.Cancel}
                                  </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        {this.state.disableLeavePage ? "" : <LeavePage />}
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SalaryComponentScreen)

