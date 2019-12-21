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
import { selectOptionsFactory } from 'utils'
import { Loader , ConfirmDeleteModal} from 'components'

import { ToastContainer, toast } from 'react-toastify'


import './style.scss'
import { Formik } from 'formik';
import * as Yup from "yup";

import {
  CommonActions
} from 'services/global'
import * as ContactActions from '../../actions'
import * as DetailContactActions from './actions'



const mapStateToProps = (state) => {
  return ({
    country_list: state.contact.country_list,
    currency_list: state.contact.currency_list,
    contact_type_list: state.contact.contact_type_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    contactActions: bindActionCreators(ContactActions, dispatch),
    detailContactActions: bindActionCreators(DetailContactActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}


class DetailContact extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      initValue: {},
      currentData: {},
      dialog: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.initializeData = this.initializeData.bind(this)
    this.success = this.success.bind(this)
    this.removeContact = this.removeContact.bind(this);
    this.removeDialog = this.removeDialog.bind(this);
    this.deleteContact = this.deleteContact.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const id = this.props.location.state.id;
    if (this.props.location.state && id) {
      this.props.contactActions.getContactTypeList();
      this.props.contactActions.getCountryList();
      this.props.contactActions.getCurrencyList();
      this.props.detailContactActions.getContactById(id).then(res => {
        this.setState({
          loading: false,
          initValue: {
            billingEmail: res.data.billingEmail,
            city: res.data.city ? {
              label: res.data.city.name,
              value: res.data.city.value
            } : '',
            contactType: res.data.contactType ? {
              label: res.data.contactType.name,
              value: res.data.contactType.id
            } : '',
            contractPoNumber: res.data.contractPoNumber,
            country: res.data.country ? {
              label: res.data.country.countryName,
              value: res.data.country.countryCode
            } : '',
            currency: res.data.currency ? {
              label: res.data.currency.currencyName,
              value: res.data.currency.currencyCode
            } : '',
            email: res.data.email,
            firstName: res.data.firstName,
            invoicingAddressLine1: res.data.invoicingAddressLine1,
            invoicingAddressLine2: res.data.invoicingAddressLine2,
            invoicingAddressLine3: res.data.invoicingAddressLine3,
            // language(Language, optional),
            lastName: res.data.lastName,
            middleName: res.data.middleName,
            mobileNumber: res.data.mobileNumber,
            organization: res.data.organization,
            poBoxNumber: res.data.poBoxNumber,
            postZipCode: res.data.postZipCode,
            stateRegion: res.data.stateRegion ? {
              label: res.data.country.countryName,
              value: res.data.country.countryCode
            } : '',
            telephone: res.data.telephone,
            vatRegistrationNumber: res.data.vatRegistrationNumber
          }
        })
      }).catch(err => {
        this.setState({ loading: false })
        this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
      })
    } else {
      this.props.location.push('/admin/master/contact')
    }
  }

  handleSubmit(data) {
    const {
      billingEmail,
      city,
      contactType,
      contractPoNumber,
      country,
      currency,
      email,
      firstName,
      invoicingAddressLine1,
      invoicingAddressLine2,
      invoicingAddressLine3,
      // language(Language, optional),
      lastName,
      middleName,
      mobileNumber,
      organization,
      poBoxNumber,
      postZipCode,
      stateRegion,
      telephone,
      vatRegistrationNumber
    } = data;
    const id = this.props.location.state.id;

    const postData = {
      contactId: id,
      billingEmail: billingEmail !== null ? billingEmail : '',
      city: city.value !== null ? city.value : '',
      contactType: contactType !== null ? contactType.value : '',
      contractPoNumber: contractPoNumber,
      country: country && country.value !== null ? country.value : '',
      currency: currency && currency.value !== null ? currency.value : '',
      email: email,
      firstName: firstName,
      invoicingAddressLine1: invoicingAddressLine1,
      invoicingAddressLine2: invoicingAddressLine2,
      invoicingAddressLine3: invoicingAddressLine3,
      // language(Language: optional):
      lastName: lastName,
      middleName: middleName,
      mobileNumber: mobileNumber,
      organization: organization,
      poBoxNumber: poBoxNumber,
      postZipCode: postZipCode,
      stateRegion: stateRegion,
      telephone: telephone,
      vatRegistrationNumber: vatRegistrationNumber
    }

    this.props.detailContactActions.updateContact(postData).then(res => {
      if (res.status === 200) {
        this.success();
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null);
      this.props.history.push('/admin/master/contact');
    })
  }
  success(msg) {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  deleteContact() {
    console.log('data')
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeContact}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeContact() {
    const id= this.props.location.state.id;
    this.props.detailContactActions.deleteContact(id).then(res=>{
      if(res.status === 200) {
        this.success('Contact Deleted Successfully');
        this.props.history.push('/admin/master/contact')
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
    const { currency_list, country_list, contact_type_list} = this.props;
    const { initValue, loading ,dialog} = this.state;
    return (
      <div className="create-contact-screen">
        <div className="animated fadeIn">
          {dialog}
          {loading ? (
            <Loader></Loader>
          )
            :
            (
              <Row>
                <Col lg={12} className="mx-auto">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col lg={12}>
                          <div className="h4 mb-0 d-flex align-items-center">
                            <i className="nav-icon fas fa-id-card-alt" />
                            <span className="ml-2">Update Contact</span>
                          </div>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col lg={12}>
                          <Formik
                            initialValues={initValue}
                            onSubmit={(values, { resetForm }) => {

                              this.handleSubmit(values)
                              resetForm(initValue)

                              // this.setState({
                              //   selectedCurrency: null,
                              //   selectedProject: null,
                              //   selectedBankAccount: null,
                              //   selectedCustomer: null

                              // })
                            }}

                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit}>
                                <h4 className="mb-4">Contact Name</h4>
                                <Row>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="select">Refrence Code  (TBD)</Label>
                                      <Input
                                        type="text"
                                        id=""
                                        name=""
                                        required
                                        onChange={(value) => { props.handleChange("reference_code")(value) }}
                                        defaultValue={props.values.reference_code}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="select">Type</Label>
                                      <Input
                                        type="text"
                                        id=""
                                        name=""
                                        required
                                        onChange={(value) => { props.handleChange("type")(value) }}
                                        defaultValue={props.values.type}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="select">First Name</Label>
                                      <Input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        onChange={(value) => { props.handleChange("firstName")(value) }}
                                        defaultValue={props.values.firstName}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="middleName ">Middle Name</Label>
                                      <Input
                                        type="text"
                                        id="middleName "
                                        name="middleName "
                                        required
                                        onChange={(value) => { props.handleChange("middleName")(value) }}
                                        defaultValue={props.values.middleName}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="lastName">Last Name</Label>
                                      <Input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        onChange={(value) => { props.handleChange("lastName")(value) }}
                                        defaultValue={props.values.lastName}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <hr />
                                <h4 className="mb-3 mt-3">Contact Details</h4>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="contactType">Contact Type</Label>
                                      <Select
                                        className="select-default-width"
                                        options={contact_type_list ? selectOptionsFactory.renderOptions('name', 'id', contact_type_list) : []}
                                        value={props.values.contactType.value}
                                        onChange={option => props.handleChange('contactType')(option)}
                                        placeholder="Select Type"
                                        id="contactType"
                                        name="contactType"

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="organization ">Organization Name</Label>
                                      <Input
                                        type="text"
                                        id="organization"
                                        name="organization"
                                        required
                                        onChange={(value) => { props.handleChange("organization")(value) }}
                                        defaultValue={props.values.organization}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="select">PO Box Number</Label>
                                      <Input
                                        type="text"
                                        id="poBoxNumber"
                                        name="poBoxNumber"
                                        required
                                        onChange={(value) => { props.handleChange("poBoxNumber")(value) }}
                                        defaultValue={props.values.poBoxNumber}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="email">Email</Label>
                                      <Input
                                        type="text"
                                        id="email"
                                        name="email"
                                        required
                                        onChange={(value) => { props.handleChange("email")(value) }}
                                        defaultValue={props.values.email}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="telephone">Telephone</Label>
                                      <Input
                                        type="number"
                                        id="telephone"
                                        name="telephone"
                                        // required/
                                        onChange={(value) => { props.handleChange("telephone")(value) }}
                                        defaultValue={props.values.telephone}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                                      <Input
                                        type="text"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        required
                                        onChange={(value) => { props.handleChange("mobileNumber")(value) }}
                                        defaultValue={props.values.mobileNumber}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="invoicingAddressLine1">Address Line1</Label>
                                      <Input
                                        type="text"
                                        id="invoicingAddressLine1"
                                        name="invoicingAddressLine1"
                                        required
                                        onChange={(value) => { props.handleChange("invoicingAddressLine1")(value) }}
                                        defaultValue={props.values.invoicingAddressLine1}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="invoicingAddressLine2">Address Line2</Label>
                                      <Input
                                        type="text"
                                        id="invoicingAddressLine2"
                                        name="invoicingAddressLine2"
                                        required
                                        onChange={(value) => { props.handleChange("invoicingAddressLine2")(value) }}
                                        defaultValue={props.values.invoicingAddressLine2}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="invoicingAddressLine3">Address Line3</Label>
                                      <Input
                                        type="text"
                                        id="invoicingAddressLine3"
                                        name="invoicingAddressLine3"
                                        required
                                        onChange={(value) => { props.handleChange("invoicingAddressLine3")(value) }}
                                        defaultValue={props.values.invoicingAddressLine3}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="country">Country</Label>
                                      <Select
                                        className="select-default-width"
                                        options={country_list ? selectOptionsFactory.renderOptions('countryName', 'countryCode', country_list) : []}
                                        value={props.values.country.value}
                                        onChange={option => props.handleChange('country')(option)}
                                        placeholder="Select Country"
                                        id="country"
                                        name="country"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    {/* <FormGroup>
                                    <Label htmlFor="stateRegion">State Region</Label>
                                    <Select
                                      className="select-default-width"
                                      options={stateRegion ? selectOptionsFactory.renderOptions('stateName', 'stateCode', stateRegion) : ''}
                                      defaultValue={props.values.stateRegion}
                                      onChange={option => props.handleChange('stateRegion')(option)}
                                      placeholder="Select Type"
                                      id="stateRegion"
                                      name="stateRegion"
                                    />
                                  </FormGroup> */}
                                  </Col>
                                  <Col md="4">
                                    {/* <FormGroup>
                                    <Label htmlFor="city">City</Label>
                                    <Select
                                      className="select-default-width"
                                      options={city ? selectOptionsFactory.renderOptions('cityName', 'cityCode', cityRegion) : ''}
                                      defaultValue={props.values.city}
                                      onChange={option => props.handleChange('city')(option)}
                                      placeholder="Select Type"
                                      id="city"
                                      name="city"
                                    />
                                  </FormGroup> */}
                                  </Col>
                                </Row>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="postZipCode">Post Zip Code</Label>
                                      <Input
                                        type="text"
                                        id="postZipCode"
                                        name="postZipCode"
                                        required
                                        onChange={(value) => { props.handleChange("postZipCode")(value) }}
                                        defaultValue={props.values.postZipCode}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <hr />
                                <h4 className="mb-3 mt-3">Invoicing Details</h4>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="billingEmail">Billing Email</Label>
                                      <Input
                                        type="text"
                                        id="billingEmail"
                                        name="billingEmail"
                                        required
                                        onChange={(value) => { props.handleChange("billingEmail")(value) }}
                                        defaultValue={props.values.billingEmail}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="contractPoNumber">Contract PO Number</Label>
                                      <Input
                                        type="text"
                                        id="contractPoNumber"
                                        name="contractPoNumber"
                                        required
                                        onChange={(value) => { props.handleChange("contractPoNumber")(value) }}
                                        defaultValue={props.values.contractPoNumber}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="row-wrapper">
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="vatRegistrationNumber">Vat Registration Number</Label>
                                      <Input
                                        type="text"
                                        id="vatRegistrationNumber"
                                        name="vatRegistrationNumber"
                                        required
                                        onChange={(value) => { props.handleChange("vatRegistrationNumber")(value) }}
                                        defaultValue={props.values.vatRegistrationNumber}

                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md="4">
                                    <FormGroup>
                                      <Label htmlFor="currency">Currency Code</Label>
                                      <Select
                                        className="select-default-width"
                                        options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list) : []}
                                        value={props.values.currency.value}
                                        onChange={option => props.handleChange('currency')(option)}
                                        placeholder="Select Type"
                                        id="currency"
                                        name="currency"
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                    <FormGroup>
                                      <Button type="button" name="button" color="danger" className="btn-square"
                                        onClick={this.deleteContact}
                                      >
                                        <i className="fa fa-trash"></i> Delete
                                    </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
                                      <Button type="button" name="button" color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push("/admin/master/contact") }}>
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContact)