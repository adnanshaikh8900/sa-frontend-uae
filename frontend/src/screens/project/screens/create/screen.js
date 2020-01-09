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

import * as ProjectActions from '../../actions'
import * as CreateProjectActions from './actions'
import {
  CommonActions
} from 'services/global'

import { selectOptionsFactory } from 'utils'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.project.currency_list,
    contact_list: state.project.contact_list,
    country_list: state.project.country_list,
    title_list: state.project.title_list,

  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    projectActions: bindActionCreators(ProjectActions, dispatch),
    createProjectActions: bindActionCreators(CreateProjectActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}


const INVOICE_LANGUAGE_OPTIONS = [
  { value: 1, label: 'English' },
  { value: 2, label: 'Arabic' }
]

class CreateProject extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openContactModal: false,
      loading: false,

      selectedContact: null,
      selectedCurrency: null,
      selectedInvoiceLanguage: null,

      selectedContactCountry: null,
      selectedContactTitle: null,

      initValue: {
        projectName: '',
        invoiceLanguageCode: '',
        contactId: '',
        contractPoNumber: '',
        vatRegistrationNumber: '',
        expenseBudget: '',
        revenueBudget: '',
        currency: '',
        contractPoNumber: '',
      },
    }

    this.showContactModal = this.showContactModal.bind(this)
    this.closeContactModal = this.closeContactModal.bind(this)

    this.projectHandleSubmit = this.projectHandleSubmit.bind(this)
    this.success = this.success.bind(this)
  }


  // Show Invite User Modal
  showContactModal() {
    this.setState({ openContactModal: true })
  }
  // Cloase Confirm Modal
  closeContactModal(res) {
    if (res) {
      this.props.projectActions.getContactList();
    }
    this.setState({ openContactModal: false })
  }

  componentDidMount() {
    this.props.projectActions.getCurrencyList();
    this.props.projectActions.getContactList();
    this.props.projectActions.getCountryList();
    this.props.projectActions.getTitleList();

  }

  // Show Success Toast
  success() {
    // toast.success('Vat Code Updated successfully... ', {
    //   position: toast.POSITION.TOP_RIGHT
    // })
  }

  // Create or Edit Project
  projectHandleSubmit(data,resetForm) {
    const {
      projectName,
      invoiceLanguageCode,
      contactId,
      contractPoNumber,
      vatRegistrationNumber,
      expenseBudget,
      revenueBudget,
      currency,
    } = data

    const postData = {
      projectName: projectName ? projectName : '',
      invoiceLanguageCode: invoiceLanguageCode ? invoiceLanguageCode : '',
      contactId: contactId && contactId !== null ? contactId : '',
      contractPoNumber: contractPoNumber ? contractPoNumber : '',
      vatRegistrationNumber: vatRegistrationNumber ? vatRegistrationNumber : '',
      expenseBudget: expenseBudget ? expenseBudget : '',
      revenueBudget: revenueBudget ? revenueBudget : '',
      currencyCode: currency && currency !== null ? currency : ''
      // contractPoNumber: contractPoNumber ? contractPoNumber : ''
    }
    this.props.createProjectActions.createAndSaveProject(postData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'New Project Created Successfully!')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm()
        } else this.props.history.push('/admin/master/project')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  render() {
    const { currency_list, country_list, contact_list, title_list } = this.props

    return (
      <div className="create-product-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-project-diagram" />
                        <span className="ml-2">Create Project</span>
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
                          this.projectHandleSubmit(values,resetForm)
                          // resetForm(this.state.initValue)

                          this.setState({
                            selectedContactCurrency: null,
                            selectedCurrency: null,
                            selectedInvoiceLanguage: null
                          })
                        }}
                        validationSchema={Yup.object().shape({
                          projectName: Yup.string()
                            .required("Project Name is Required"),
                          contactId: Yup.string()
                            .required("Contact is Required"),
                          currency: Yup.string()
                            .required("Currency is Required")
                            .nullable(),
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
                                    value={props.values.projectName}
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
                                    options={contact_list ? selectOptionsFactory.renderOptions('firstName', 'id', contact_list, 'Contact Name') : []}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedContact: option.value
                                      })
                                      if(option.value) {
                                        props.handleChange("contactId")(option.value)
                                      } else {
                                        props.handleChange("contactId")('')
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
                                  <Button color="primary" className="btn-square " onClick={this.showContactModal}>
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
                                    value={props.values.contractPoNumber}
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
                                    value={props.values.vatRegistrationNumber}
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
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedCurrency: option.value
                                      })
                                      if(option && option.value) {
                                        props.handleChange('currencyCode')(option.value)
                                      } else {
                                        props.handleChange('currencyCode')('')
                                      }
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
                                  <Label htmlFor="expenseBudget">Expense Budget</Label>
                                  <Input
                                    type="number"
                                    id="expenseBudget"
                                    name="expenseBudget"
                                    onChange={props.handleChange}
                                    placeholder="Enter Expense Budgets"
                                    value={props.values.expenseBudget}
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
                                    value={props.values.revenueBudget}
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
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                    this.setState({ createMore: false }, () => {
                                      props.handleSubmit()
                                    })
                                  }}>
                                    <i className="fa fa-dot-circle-o"></i> Create
                                      </Button>
                                  <Button name="button" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ createMore: true }, () => {
                                        props.handleSubmit()
                                      })
                                    }}>
                                    <i className="fa fa-refresh"></i> Create and More
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
        </div>

        <ContactModal
          openContactModal={this.state.openContactModal}
          closeContactModal={(val) => { this.closeContactModal(val) }}
          currencyList={currency_list}
          countryList={country_list}
          createContact={this.props.projectActions.createProjectContact}
          titleList={title_list}
        />

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)
