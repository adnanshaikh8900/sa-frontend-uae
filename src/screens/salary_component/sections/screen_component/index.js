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
import { LeavePage } from 'components';
import { selectOptionsFactory } from 'utils';
import { CommonActions } from 'services/global'
import * as SalaryComponentActions from '../../actions';
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
class ScreenComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: window['localStorage'].getItem('language'),
      loading: false,
      createMore: false,
      disableLeavePage: false,
      initValue: {
        componentId: '',
        componentName: '',
        componentType: 'Earning',
        calculationType: 'Percent of CTC',
        ctcPercent: 1,
        flatAmount: 1,
      },
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
    this.props.salaryComponentActions.getParentDesignationList();

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

  handleSubmit = (data, resetForm) => {
    this.setState({ disabled: true, disableLeavePage: true });
    const {
      componentName,
      componentId,
      componentType
    } = data;

    const formData = new FormData();

    // if(!this.state.idExist && !this.state.nameExist){
    formData.append('componentId', componentId != null ? componentId : '',)
    formData.append('componentName', componentName != null ? componentName : '',);
    formData.append('parentId', componentType ? componentType.value ? componentType.value : componentType : '');

    // this.props.employeeDesignationCreateAction
    //   .createEmployeeDesignation(formData)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       this.props.commonActions.tostifyAlert(
    //         'success',
    //         'New Employee Designation Created Successfully')
    //       if (this.state.createMore) {
    //         this.setState({
    //           createMore: false
    //         })
    //         resetForm(this.state.initValue)
    //       } else {
    //         this.props.history.push('/admin/payroll/config', { tabNo: '3' })
    //       }
    //     }
    //   }).catch((err) => {
    //     this.setState({ disabled: false, disableLeavePage: false });
    //     this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    //   })
  }

  render() {
    strings.setLanguage(this.state.language);
    const { componentType, state_list, componentType_list } = this.props


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
                          if (values.calculationType === 'Percent of CTC' && !values.ctcPercent) {
                            errors.ctcPercent = strings.PercentOfCTCIsRequired
                          }
                          if (values.calculationType === 'Flat Amount' && !values.flatAmount) {
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
                              <Col lg={10}>
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
                                  <Col lg={4}>
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
                                  <Col lg={4}>
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
                                            checked={props.values.calculationType === 'Percent of CTC'}
                                            value={props.values.calculationType}
                                            onChange={(value) => {
                                              props.handleChange('calculationType')('Percent of CTC')
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
                                            checked={props.values.calculationType === 'Flat Amount'}
                                            onChange={(value) => {
                                              props.handleChange('calculationType')('Flat Amount')
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
                                    {props.values.calculationType === 'Percent of CTC' ?
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
                                          type='number'
                                          min={1}
                                          step={0.01}
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
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
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
                                  <Button name="button" color="primary" className="btn-square mr-3"
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
                                  </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/payroll/config', { tabNo: '3' }) }}>
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
        {this.state.disableLeavePage ? "" : <LeavePage />}
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ScreenComponent)

