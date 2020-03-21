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

import { Formik } from 'formik';
import * as Yup from "yup";

import { ContactModal } from '../../sections'
import { Loader ,ConfirmDeleteModal } from 'components'

import * as ProjectActions from '../../actions'
import { toast } from 'react-toastify'

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
      selectedcontactId: null,
      selectedCurrency: null,
      selectedInvoiceLanguage: null,

      selectedcontactIdCountry: null,
      selectedcontactIdCurrency: null,
      selectedcontactIdTitle: null,
      current_project_id: null,
      initValue: {},
    }

    this.showContactModal = this.showContactModal.bind(this)
    this.closeContactModal = this.closeContactModal.bind(this)

    this.projectHandleSubmit = this.projectHandleSubmit.bind(this)
    this.success = this.success.bind(this)
    this.deleteProject = this.deleteProject.bind(this)
    this.removeProject = this.removeProject.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  // Show Invite User Modal
  showContactModal() {
    this.setState({ openContactModal: true })
  }
  // Cloase Confirm Modal
  closeContactModal() {
    this.setState({ openContactModal: false })
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.id) {
      this.props.detailProjectActions.getProjectById(this.props.location.state.id).then(res => {
        this.props.projectActions.getContactList()
        this.props.projectActions.getCountryList()
        this.props.projectActions.getCurrencyList()
        if (res.status === 200) {
          this.setState({
            current_project_id: this.props.location.state.id,
            initValue: {
              projectName: res.data.projectName,
              // invoiceLanguageCode: res.data.invoiceLanguageCode !== null ? {
              //   label: res.data.invoiceLanguageCode.id,
              //   value: res.data.invoiceLanguageCode.value
              // } : '',
              contactId: res.data.contactId ? res.data.contactId: '',
              contractPoNumber: res.data.contractPoNumber,
              vatRegistrationNumber: res.data.vatRegistrationNumber,
              expenseBudget: res.data.expenseBudget,
              revenueBudget: res.data.revenueBudget,
              currencyCode: res.data.currencyCode ? res.data.currencyCode : ''
            },
            loading: false,
          })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
        this.setState({loading: false})
      })
    } else {
      this.props.history.push('/admin/master/project')
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

    const {current_project_id} = this.state;
    const {
      projectName,
      invoiceLanguageCode,
      contactId,
      contractPoNumber,
      vatRegistrationNumber,
      expenseBudget,
      revenueBudget,
      currencyCode,
    } = data

    const postData = {
      projectId: current_project_id,
      projectName: projectName ? projectName: '',
      invoiceLanguageCode: invoiceLanguageCode ? invoiceLanguageCode : '',
      contactId: contactId && contactId !== null ? contactId : '',
      contractPoNumber: contractPoNumber ? contractPoNumber : '',
      vatRegistrationNumber: vatRegistrationNumber ? vatRegistrationNumber : '',
      expenseBudget: expenseBudget ? expenseBudget : '',
      revenueBudget: revenueBudget ? revenueBudget : '',
      currencyCode: currencyCode && currencyCode!== null ? currencyCode : ''
      // contractPoNumber: contractPoNumber ? contractPoNumber : ''
    }
    this.props.detailProjectActions.updateProject(postData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Project Updated successfully!')
         this.props.history.push('/admin/master/project')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
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
    const { current_project_id }= this.state;
    this.props.detailProjectActions.deleteProject(current_project_id).then(res=>{
      if(res.status === 200) {
        this.success('Project Deleted Successfully');
        this.props.history.push('/admin/master/project')
      }
    }).catch(err=> {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
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
                          // resetForm(initValue)
                        }}
                        validationSchema={Yup.object().shape({
                          projectName: Yup.string()
                            .required("Project Name is Required"),
                          contactId: Yup.string()
                            .required("Contact is Required"),
                          currencyCode: Yup.string()
                            .required("currencyCode is Required"),
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
                                    onChange={props.handleChange}
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
                                  <Label htmlFor="contactId"><span className="text-danger">*</span>Contact</Label>
                                  <Select
                                    options={contact_list ? selectOptionsFactory.renderOptions('label', 'value', contact_list,'Contact Name') : []}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedContact: option.value
                                      })
                                        if (option && option.value) {
                                          props.handleChange('contactId')(option.value)
                                        } else {
                                          props.handleChange('contactId')('')
                                        }
                                      }}
                                    id="contactId"
                                    name="contactId"
                                    placeholder="Select Contact"
                                    value={props.values.contactId}
                                    className={
                                      props.errors.contactId && props.touched.contactId
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.contactId && props.touched.contactId && (
                                    <div className="invalid-feedback">{props.errors.contactId}</div>
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
                                    onChange={props.handleChange}

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
                                    onChange={props.handleChange}
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
                                  <Label htmlFor="currencyCode">
                                    <span className="text-danger">*</span>currencyCode
                                      </Label>
                                  <Select
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedCurrency: option.value ? option.value : ''
                                      })
                                      if(option && option.value) {
                                        props.handleChange('currencyCode')(option.value)
                                      } else {
                                        props.handleChange('currencyCode')('')
                                      }
                                    }}
                                    placeholder="Select currencyCode"
                                    value={props.values.currencyCode}
                                    id="currencyCode"
                                    name="currencyCode"
                                    className={
                                      props.errors.currencyCode && props.touched.currencyCode
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.currencyCode && props.touched.currencyCode && (
                                    <div className="invalid-feedback">{props.errors.currencyCode}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="">
                                  <Label htmlFor="expenseBudget">Expense Budget</Label>
                                  <Input
                                    type="number"
                                    id="expenseBudget"
                                    name="expenseBudget"
                                    onChange={props.handleChange}

                                    placeholder="Enter Expense Budgets"
                                    defaultValue={props.values.expenseBudget}
                                    className={
                                      props.errors.expenseBudget && props.touched.expenseBudget
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.expenseBudget && props.touched.expenseBudget && (
                                    <div className="invalid-feedback">{props.errors.expenseBudget}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="">
                                  <Label htmlFor="revenueBudget">Revenue Budget</Label>
                                  <Input
                                    type="number"
                                    id="revenueBudget"
                                    name="revenueBudget"
                                    onChange={props.handleChange}
                                    placeholder="Enter VAT Revenue Budget"
                                    defaultValue={props.values.revenueBudget}
                                    className={
                                      props.errors.revenueBudget && props.touched.revenueBudget
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.revenueBudget && props.touched.revenueBudget && (
                                    <div className="invalid-feedback">{props.errors.revenueBudget}</div>
                                  )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="">
                                  <Label htmlFor="invoiceLanguageCode">
                                    <span className="text-danger"></span>Invoice Language(TBD)
                                      </Label>
                                  <Select
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
          closeContactModal={(val)=>{this.closeContactModal(val)}}
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