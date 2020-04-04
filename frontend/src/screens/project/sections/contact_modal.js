import React from 'react'
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import Select from 'react-select'

import { Formik } from 'formik';
import * as Yup from "yup";

import { selectOptionsFactory } from 'utils'



class ContactModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,

      initContactValue: {
        billingEmail: '',
        city: '',
        countryId: '',
        currencyCode: '',
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        stateId: '',
        addressLine1: '',
        addressLine2: ''
      },
      stateList: []
    }
    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z]+$/;
  }

  // Create or Contact
  contactHandleSubmit = (data) => {
    const request = this.props.createContact(data);
    request.then(res => {
      if (res.status === 200) {
        this.props.closeContactModal(true,res.data)
      }
    })
  }

  getStateList = (countryCode) => {
    this.props.getStateList(countryCode).then(res => {
      if (res.status === 200) {
        this.setState({
          stateList: res.data
        })
      }
    })
  }

  render() {
    const { openContactModal, closeContactModal, currencyList, countryList } = this.props
    const { stateList } = this.state;
    return (
      <div className="contact-modal-screen">
        <Modal isOpen={openContactModal}
          className="modal-success contact-modal"
        >
          <Formik
            initialValues={this.state.initContactValue}
            onSubmit={(values, { resetForm }) => {
              this.contactHandleSubmit(values)
              resetForm(this.state.initContactValue)
            }}
            validationSchema={Yup.object().shape({
              // title: Yup.string()
              //   .required('Title is a required field'),
              billingEmail: Yup.string()
                .email('Billing Email must be a valid email')
                .required('Billing Email is a required field'),
              city: Yup.string()
                .required('City is a required field'),
              countryId: Yup.string()
                .required('Country is a required field'),
              currencyCode: Yup.string()
                .required('Currency is a required field'),
              firstName: Yup.string()
                .required('First Name is a required field'),
              lastName: Yup.string()
                .required('Last Name is a required field'),
              email: Yup.string()
                .email('Email must be a valid email')
                .required('Email is a required field'),
              stateId: Yup.string()
                .when('countryId', {
                  is: (val) => val ? true : false,
                  then: Yup.string()
                    .required('State is Required')
                }),
              addressLine1: Yup.string()
                .required('Address1 is a required field'),
              addressLine2: Yup.string()
                .required('Address2 is a required field')
            })}>
            {props => (
              <Form name="simpleForm" onSubmit={props.handleSubmit}>
                <ModalHeader toggle={this.toggleDanger}>New Contact</ModalHeader>
                <ModalBody>
                  {/* <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="categoryCode"><span className="text-danger">*</span>Title</Label>
                          <Select
                            options={titleList? selectOptionsFactory.renderOptions('titleName', 'titleCode', titleList): []}
                            id="title"
                            onChange={(option) => {
                              this.setState({
                              selectedContactTitle: option.value
                              })
                              props.handleChange("title")(option.label);
                            }}
                            placeholder="Select title"
                            value={this.state.selectedContactTitle}
                            name="title"
                            className={
                              props.errors.title && (props.touched.title)
                              ? "is-invalid"
                              : ""
                            }
                          />
                          {props.errors.title && props.touched.title && (
                            <div className="invalid-feedback">{props.errors.title}</div>
                          )}
                        </FormGroup>                 
                      </Col>
                    </Row> */}
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="categoryName"><span className="text-danger">*</span>First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          onChange={(option) => {
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('firstName')(option)
                          }}
                          placeholder="Enter firstName "
                          value={props.values.firstName}
                          className={
                            props.errors.firstName && props.touched.firstName
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.firstName && props.touched.firstName && (
                          <div className="invalid-feedback">{props.errors.firstName}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="categoryName">Middle Name</Label>
                        <Input
                          type="text"
                          id="middleName"
                          name="middleName"
                          onChange={(option) => {
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('middleName')(option)
                          }}
                          placeholder="Enter middleName  "
                          value={props.values.middleName}
                          className={
                            props.errors.middleName && props.touched.middleName
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.middleName && props.touched.middleName && (
                          <div className="invalid-feedback">{props.errors.middleName}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="categoryName"><span className="text-danger">*</span>Last Name</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          onChange={(option) => {
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('lastName')(option)
                          }}
                          placeholder="Enter lastName   "
                          value={props.values.lastName}
                          className={
                            props.errors.lastName && props.touched.lastName
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.lastName && props.touched.lastName && (
                          <div className="invalid-feedback">{props.errors.lastName}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="categoryName"><span className="text-danger">*</span>Email</Label>
                        <Input
                          type="text"
                          id="email"
                          name="email"
                          onChange={props.handleChange}
                          placeholder="Enter email"
                          value={props.values.email}
                          className={
                            props.errors.email && props.touched.email
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.email && props.touched.email && (
                          <div className="invalid-feedback">{props.errors.email}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="categoryName"><span className="text-danger">*</span>Address Line 1</Label>
                        <Input
                          type="text"
                          id="addressLine1"
                          name="addressLine1"
                          onChange={props.handleChange}
                          placeholder="Enter AddressLine1"
                          value={props.values.addressLine1}
                          className={
                            props.errors.addressLine1 && props.touched.addressLine1
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.addressLine1 && props.touched.addressLine1 && (
                          <div className="invalid-feedback">{props.errors.addressLine1}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="categoryName"><span className="text-danger">*</span>Address Line 2</Label>
                        <Input
                          type="text"
                          id="addressLine2"
                          name="addressLine2"
                          onChange={props.handleChange}
                          placeholder="Enter AddressLine2"
                          value={props.values.addressLine2}
                          className={
                            props.errors.addressLine2 && props.touched.addressLine2
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.addressLine2 && props.touched.addressLine2 && (
                          <div className="invalid-feedback">{props.errors.addressLine2}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="row-wrapper">
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="countryId">
                          <span className="text-danger">*</span>Country
                          </Label>
                        <Select
                          options={
                            countryList
                              ? selectOptionsFactory.renderOptions(
                                "countryName",
                                "countryCode",
                                countryList,
                                "Country"
                              )
                              : []
                          }
                          value={props.values.countryId}
                          onChange={option => {
                            if (option && option.value) {
                              props.handleChange("countryId")(option.value);
                              this.getStateList(option.value)
                            } else {
                              props.handleChange("countryId")("");
                              this.getStateList(option.value)
                            }
                          }}
                          placeholder="Select Country"
                          id="countryId"
                          name="countryId"
                          className={
                            props.errors.countryId && props.touched.countryId
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.countryId &&
                          props.touched.countryId && (
                            <div className="invalid-feedback">
                              {props.errors.countryId}
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="stateId">State</Label>
                        <Select
                          options={stateList ? selectOptionsFactory.renderOptions('label', 'value', stateList, 'State') : []}
                          value={props.values.stateId}
                          onChange={option => {
                            if (option && option.value) {
                              props.handleChange('stateId')(option.value)
                            } else {
                              props.handleChange('stateId')('')
                            }
                          }}
                          placeholder="Select State"
                          id="stateId"
                          name="stateId"
                          className={
                            props.errors.stateId && props.touched.stateId
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.stateId && props.touched.stateId && (
                          <div className="invalid-feedback">{props.errors.stateId}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="city">City</Label>
                        <Input
                          // options={city ? selectOptionsFactory.renderOptions('cityName', 'cityCode', cityRegion) : ''}
                          value={props.values.city}
                          onChange={(option) => {
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('city')(option)
                          }}
                          placeholder=""
                          id="city"
                          name="city"
                          className={
                            props.errors.city && props.touched.city
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.city && props.touched.city && (
                          <div className="invalid-feedback">
                            {props.errors.city}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label htmlFor="currencyCode">Currency Code</Label>
                        <Select
                          options={
                            currencyList
                              ? selectOptionsFactory.renderOptions(
                                "currencyName",
                                "currencyCode",
                                currencyList,
                                "Currency"
                              )
                              : []
                          }
                          value={props.values.currencyCode}
                          onChange={option => {
                            if (option && option.value) {
                              props.handleChange("currencyCode")(
                                option.value
                              );
                            } else {
                              props.handleChange("currencyCode")("");
                            }
                          }}
                          placeholder="Select Currency"
                          id="currencyCode"
                          name="currencyCode"
                          className={
                            props.errors.currencyCode &&
                              props.touched.currencyCode
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.currencyCode &&
                          props.touched.currencyCode && (
                            <div className="invalid-feedback">
                              {props.errors.currencyCode}
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                    <Col lg={4}>
                      <FormGroup>
                        <Label htmlFor="categoryName"><span className="text-danger">*</span>Billing Email</Label>
                        <Input
                          type="text"
                          id="billingEmail"
                          name="billingEmail"
                          onChange={props.handleChange}
                          placeholder="Enter billingEmail"
                          value={props.values.billingEmail}
                          className={
                            props.errors.billingEmail && props.touched.billingEmail
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {props.errors.billingEmail && props.touched.billingEmail && (
                          <div className="invalid-feedback">{props.errors.billingEmail}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                </ModalBody>
                <ModalFooter>
                  <Button color="success" type="submit" className="btn-square">Save</Button>&nbsp;
                    <Button color="secondary" type="button" className="btn-square" onClick={() => { closeContactModal(false) }}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    )
  }
}

export default ContactModal