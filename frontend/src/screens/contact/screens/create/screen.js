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
import { Loader } from 'components'
import { ToastContainer, toast } from 'react-toastify'


import './style.scss'
import { Formik } from 'formik';
import * as Yup from "yup";

import {
  CommonActions
} from 'services/global'
import * as ContactActions from '../../actions'
import * as CreateContactActions from './actions'



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
    createContactActions: bindActionCreators(CreateContactActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class CreateContact extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      initValue: {
        billingEmail: '',
        city: '',
        contactType: '',
        contractPoNumber: '',
        country: '',
        currency: '',
        email: '',
        firstName: '',
        invoicingAddressLine1: '',
        invoicingAddressLine2: '',
        invoicingAddressLine3: '',
        // language(Language, optional),
        lastName: '',
        middleName: '',
        mobileNumber: '',
        organization: '',
        poBoxNumber: '',
        postZipCode: '',
        stateRegion: '',
        telephone: '',
        vatRegistrationNumber: '',
      },
      readMore: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.initializeData = this.initializeData.bind(this)
    this.success = this.success.bind(this)
  }


  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.contactActions.getContactTypeList();
    this.props.contactActions.getCountryList();
    this.props.contactActions.getCurrencyList();
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

    const postData = {
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

    this.props.createContactActions.createContact(postData).then(res => {
      if (res.status === 200) {
        this.success();
        if (this.state.readMore) {
          this.setState({ readMore: false });
          this.props.history.push('/admin/master/contact/create');
        }
      } else {
        this.props.history.push('/admin/master/contact');
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }
  success() {
    toast.success('Chart Of Account Created Successfully... ', {
      position: toast.POSITION.TOP_RIGHT
    })
  }
  render() {
    const { currency_list, country_list, loading, contact_type_list } = this.props;
    const { initValue } = this.state;
    return (
      <div className="create-contact-screen">
        <div className="animated fadeIn">

          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-id-card-alt" />
                        <span className="ml-2">Create Contact</span>
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

                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <h4 className="mb-3 mt-3">Contact Details</h4>
                            <Row className="row-wrapper">
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="country">Contact Type</Label>
                                  <Select
                                    className="select-default-width"
                                    options={contact_type_list ? selectOptionsFactory.renderOptions('name', 'id', contact_type_list) : []}
                                    value={props.values.contact_type_list}
                                    onChange={option => props.handleChange('contact_type_list')(option)}
                                    placeholder="Select Type"
                                    id="contact_type_list"
                                    name="contact_type_list"
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

                                  />
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="telephone">Telephone</Label>
                                  <Input
                                    type="text"
                                    id="telephone"
                                    name="telephone"
                                    required
                                    onChange={(value) => { props.handleChange("telephone")(value) }}

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
                                    value={props.values.country}
                                    onChange={option => props.handleChange('country')(option)}
                                    placeholder="Select Type"
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
                                      value={props.values.stateRegion}
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
                                      value={props.values.city}
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

                                  />
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label htmlFor="currency">Currency Code</Label>
                                  <Select
                                    className="select-default-width"
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list) : []}
                                    value={props.values.currency}
                                    onChange={option => props.handleChange('currency')(option)}
                                    placeholder="Select Type"
                                    id="currency"
                                    name="currency"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Create
                                </Button>
                                  <Button type="submit" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ readMore: true });
                                      props.handleSubmit();
                                    }}>
                                    <i className="fa fa-repeat"></i> Create and More
                                </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/master/contact') }}>
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
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateContact)
