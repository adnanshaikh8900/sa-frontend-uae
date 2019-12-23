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
import _ from 'lodash'

import { Formik } from 'formik';
import * as Yup from "yup";

import { ContactModal } from '../../sections'
import { Loader ,ConfirmDeleteModal } from 'components'

import * as ProjectActions from '../../actions'
import { ToastContainer, toast } from 'react-toastify'

import {
  CommonActions
} from 'services/global'
import * as DetailProjectActions from './actions'
import { selectOptionsFactory } from 'utils'



import './style.scss'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.project.currency_list,
    country_list: state.project.country_list,
    contact_list: state.project.contact_list,
    title_list: state.project.title_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    projectActions: bindActionCreators(ProjectActions, dispatch),
    detailProjectActions: bindActionCreators(DetailProjectActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}


const INVOICE_LANGUAGE_OPTIONS = [
  { value: 1, label: 'English' },
  { value: 2, label: 'Arabic' }
]

class DetailProject extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openContactModal: false,
      loading: true,
      dialog: null,
      selectedContact: null,
      selectedCurrency: null,
      selectedInvoiceLanguage: null,

      selectedContactCountry: null,
      selectedContactCurrency: null,
      selectedContactTitle: null,

      initValue: {},
    }

    this.showContactModel = this.showContactModel.bind(this)
    this.closeContactModel = this.closeContactModel.bind(this)

    this.projectHandleSubmit = this.projectHandleSubmit.bind(this)
    this.success = this.success.bind(this)
    this.deleteProject = this.deleteProject.bind(this)
    this.removeProject = this.removeProject.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  // Show Invite User Modal
  showContactModel() {
    this.setState({ openContactModal: true })
  }
  // Cloase Confirm Modal
  closeContactModel() {
    this.setState({ openContactModal: false })
  }

  componentDidMount() {
    const id = this.props.location.state.id;
    if (this.props.location.state && id) {
      this.props.detailProjectActions.getProjectById(id).then(res => {
        this.props.projectActions.getCountryList()
        this.props.projectActions.getContactList()
        this.props.projectActions.getCurrencyList()
        this.props.projectActions.getTitleList()
        if (res.status === 200) {
          this.setState({
            loading: false,
            initValue: {
              projectName: res.data.projectName,
              invoiceLanguageCode: res.data.invoiceLanguageCode !== null ? {
                label: res.data.invoiceLanguageCode.id,
                value: res.data.invoiceLanguageCode.value
              } : '',
              contact: res.data.contact ? {
                label: res.data.contact.firstName,
                value: res.data.contact.contactId
              } : '',
              contractPoNumber: res.data.contractPoNumber,
              vatRegistrationNumber: res.data.vatRegistrationNumber,
              projectExpenseBudget: res.data.projectExpenseBudget,
              projectRevenueBudget: res.data.projectRevenueBudget,
              currency: res.data.currency ? {
                label: res.data.currency.currencyName,
                value: res.data.currency.currencyCode
              } : ''
            }
          })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
        this.setState({loading: false})
      })
    }

  }


  
  // Show Success Toast
  success(msg) {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  // Create or Edit Vat
  projectHandleSubmit(data) {
    const {
      projectName,
      invoiceLanguageCode,
      contact,
      contractPoNumber,
      vatRegistrationNumber,
      projectExpenseBudget,
      projectRevenueBudget,
      currency,
    } = data

    const postData = {
      projectName: projectName ? projectName: '',
      invoiceLanguageCode: invoiceLanguageCode ? invoiceLanguageCode : '',
      contact: contact && contact !== null ? contact : '',
      contractPoNumber: contractPoNumber ? contractPoNumber : '',
      vatRegistrationNumber: vatRegistrationNumber ? vatRegistrationNumber : '',
      projectExpenseBudget: projectExpenseBudget ? projectExpenseBudget : '',
      projectRevenueBudget: projectRevenueBudget ? projectRevenueBudget : '',
      currencyCode: currency && currency!== null ? currency : ''
      // contractPoNumber: contractPoNumber ? contractPoNumber : ''
    }
    this.props.detailProjectActions.updateProject(postData).then(res => {
      if (res.status === 200) {
        // this.success()

        if (this.state.readMore) {
          this.setState({
            readMore: false
          })
        } else this.props.history.push('/admin/master/project')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  deleteProject() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeProject}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeProject() {
    const id= this.props.location.state.id;
    this.props.detailProjectActions.deleteProject(id).then(res=>{
      if(res.status === 200) {
        this.success('Project Deleted Successfully');
        this.props.history.push('/admin/master/project')
      }
    }).catch(err=> {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }


  render() {
    const { currency_list, country_list,contact_list,title_list} = this.props
    const { initValue , loading , dialog} = this.state;
    return (
      <div className="create-product-screen">
        <div className="animated fadeIn">
      {dialog}
          {loading ? 
          <Loader /> 
          :
         ( <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-project-diagram" />
                        <span className="ml-2">Update Project</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                      enableReinitialize={true}
                        initialValues={initValue}
                        onSubmit={(values, { resetForm }) => {
                          this.projectHandleSubmit(values)
                          resetForm(initValue)
                        }}
                        validationSchema={Yup.object().shape({
                          projectName: Yup.string()
                            .required("Project Name is Required"),
                          contact: Yup.string()
                            .required("Contact is Required"),
                          currency: Yup.string()
                            .required("Currency is Required"),
                          // invoiceLanguageCode: Yup.string()
                          //   .required("Invoice Language is Required")
                        })}>
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="projectName"><span className="text-danger">*</span>Project Name</Label>
                                  <Input
                                    type="text"
                                    id="name"
                                    name="projectName"
                                    onChange={(option)=>{props.handleChange('projectName',option)}}
                                    placeholder="Enter Project Name"
                                    defaultValue={props.values.projectName}
                                    className={
                                      props.errors.projectName && props.touched.projectName
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.projectName && props.touched.projectName && (
                                    <div className="invalid-feedback">{props.errors.projectName}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="contact"><span className="text-danger">*</span>Contact</Label>
                                  <Select
                                    options={selectOptionsFactory.renderOptions('firstName', 'contactId', contact_list)}
                                    onChange={(option) => {
                                      // this.setState({
                                      //   selectedContact: option.value
                                      // })
                                      props.handleChange("contact")(option.value);
                                    }}
                                    id="contact"
                                    name="contact"
                                    placeholder="Select Contact"
                                    value={props.values.contact}
                                    className={
                                      props.errors.contact && props.touched.contact
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.contact && props.touched.contact && (
                                    <div className="invalid-feedback">{props.errors.contact}</div>
                                  )}
                                </FormGroup>
                                <FormGroup className="mb-5 text-right">
                                  <Button color="primary" className="btn-square " onClick={this.showContactModel}>
                                    <i className="fa fa-plus"></i> Add a Contact
                                      </Button>
                                </FormGroup>
                              </Col>

                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="contractPoNumber">Contract PO Number</Label>
                                  <Input
                                    type="text"
                                    id="contractPoNumber"
                                    name="contractPoNumber"
                                    onChange={(option)=>{props.handleChange('contractPoNumber',option)}}

                                    placeholder="Enter Contract PO Number"
                                    defaultValue={props.values.contractPoNumber}
                                    className={
                                      props.errors.contractPoNumber && props.touched.contractPoNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.contractPoNumber && props.touched.contractPoNumber && (
                                    <div className="invalid-feedback">{props.errors.contractPoNumber}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="vatRegistrationNumber">VAT Registration Number</Label>
                                  <Input
                                    type="text"
                                    id="vatRegistrationNumber"
                                    name="vatRegistrationNumber"
                                    onChange={(option)=>{props.handleChange('vatRegistrationNumber',option)}}
                                    placeholder="Enter VAT Registration Number"
                                    defaultValue={props.values.vatRegistrationNumber}
                                    className={
                                      props.errors.vatRegistrationNumber && props.touched.vatRegistrationNumber
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.vatRegistrationNumber && props.touched.vatRegistrationNumber && (
                                    <div className="invalid-feedback">{props.errors.vatRegistrationNumber}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="currency">
                                    <span className="text-danger">*</span>Currency
                                      </Label>
                                  <Select
                                    className="select-default-width"
                                    options={selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list)}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedCurrency: option.value
                                      })
                                      props.handleChange("currency")(option.value);
                                    }}
                                    placeholder="Select currency"
                                    value={props.values.currency}
                                    id="currency"
                                    name="currency"
                                    className={
                                      props.errors.currency && props.touched.currency
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.currency && props.touched.currency && (
                                    <div className="invalid-feedback">{props.errors.currency}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="">
                                  <Label htmlFor="projectExpenseBudget">Expense Budget</Label>
                                  <Input
                                    type="number"
                                    id="projectExpenseBudget"
                                    name="projectExpenseBudget"
                                    onChange={(option)=>{props.handleChange('projectExpenseBudget',option)}}

                                    placeholder="Enter Expense Budgets"
                                    defaultValue={props.values.projectExpenseBudget}
                                    className={
                                      props.errors.projectExpenseBudget && props.touched.projectExpenseBudget
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.projectExpenseBudget && props.touched.projectExpenseBudget && (
                                    <div className="invalid-feedback">{props.errors.projectExpenseBudget}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="">
                                  <Label htmlFor="projectRevenueBudget">Revenue Budget</Label>
                                  <Input
                                    type="number"
                                    id="projectRevenueBudget"
                                    name="projectRevenueBudget"
                                    onChange={(option)=>{props.handleChange('projectRevenueBudget',option)}}
                                    placeholder="Enter VAT Revenue Budget"
                                    defaultValue={props.values.projectRevenueBudget}
                                    className={
                                      props.errors.projectRevenueBudget && props.touched.projectRevenueBudget
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.projectRevenueBudget && props.touched.projectRevenueBudget && (
                                    <div className="invalid-feedback">{props.errors.projectRevenueBudget}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="">
                                  <Label htmlFor="invoiceLanguageCode">
                                    <span className="text-danger">*</span>Invoice Language
                                      </Label>
                                  <Select
                                    className="select-default-width"
                                    options={INVOICE_LANGUAGE_OPTIONS}
                                    id="invoiceLanguageCode"
                                    onChange={(option) => {
                                      this.setState({
                                        selectedInvoiceLanguage: option.value
                                      })
                                      props.handleChange("invoiceLanguageCode")(option.value);
                                    }}
                                    placeholder="Select invoiceLanguageCode"
                                    value={this.state.selectedInvoiceLanguage}
                                    name="invoiceLanguageCode"
                                    className={
                                      props.errors.invoiceLanguageCode && props.touched.invoiceLanguageCode
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.invoiceLanguageCode && props.touched.invoiceLanguageCode && (
                                    <div className="invalid-feedback">{props.errors.invoiceLanguageCode}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
                                <FormGroup>
                                  <Button color="danger" className="btn-square" onClick={this.deleteProject}>
                                    <i className="fa fa-trash"></i> Delete
                                      </Button>
                                </FormGroup>
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Update
                                      </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/master/project') }}>
                                    <i className="fa fa-ban"></i> Cancel
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
         )}
        </div>
        <ContactModal
          openContactModal={this.state.openContactModal}
          closeContactModel={this.closeContactModel}
          currencyList={currency_list}
          countryList={country_list}
          createContact={this.props.projectActions.createProjectContact}
          titleList={title_list}
        />

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProject)