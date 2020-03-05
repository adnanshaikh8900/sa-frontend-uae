import React from "react";
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
  ModalFooter
} from "reactstrap";
import Select from "react-select";
import _ from "lodash";

import { Formik } from "formik";
import * as Yup from "yup";

import { selectOptionsFactory } from "utils";
import { ToastContainer, toast } from "react-toastify";

class CustomerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initValue: {
        contactType: 2,
        billingEmail: "",
        city: "",
        contractPoNumber: "",
        countryId: "",
        currencyCode: "",
        email: "",
        firstName: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        // language(Language, optional),
        lastName: "",
        middleName: "",
        mobileNumber: "",
        organization: "",
        poBoxNumber: "",
        postZipCode: "",
        stateRegion: "",
        telephone: "",
        vatRegistrationNumber: ""
      }
    };
    this.formikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayMsg = this.displayMsg.bind(this);
  }

  // Create or Contact
  handleSubmit(data, resetForm, setSubmitting) {
    this.props
      .createCustomer(data)
      .then(res => {
        if (res.status === 200) {
          resetForm();
          const val = res.data;
          this.props.closeCustomerModal(true);
          this.props.getCurrentUser(res.data);
        }
      })
      .catch(err => {
        this.displayMsg();
        this.formikRef.current.setSubmitting(false);
      });
  }

  displayMsg() {
    toast.error("Something Went Wrong... ", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  render() {
    const {
      openCustomerModal,
      closeCustomerModal,
      currency_list,
      country_list
    } = this.props;
    const { initValue } = this.state;
    return (
      <div className="contact-modal-screen">
        <Modal
          isOpen={openCustomerModal}
          className="modal-success contact-modal"
        >
          <Formik
            ref={this.formikRef}
            initialValues={initValue}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              this.handleSubmit(values, resetForm);
            }}
            validationSchema={Yup.object().shape({
              firstName: Yup.string().required("FirstName is Required"),
              lastName: Yup.string().required("LastName is Required"),
              // middleName: Yup.string()
              //   .required("MiddleName is Required"),
              // contactType: Yup.string()
              // .required("Please Select Contact Type"),
              //       organization: Yup.string()
              //       .required("Organization Name is Required"),
              //     poBoxNumber: Yup.number()
              //       .required("PO Box Number is Required"),
              email: Yup.string()
                .required("Email is Required")
                .email("Invalid Email"),
              //     telephone: Yup.number()
              //       .required("Telephone Number is Required"),
              //     mobileNumber: Yup.string().matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
              //       .required("Mobile Number is required"),
              //     addressLine1: Yup.string()
              //       .required("Address is required"),
              countryId: Yup.string().required("Please Select Country")
              // .nullable(),
              //     stateRegion: Yup.string()
              //       .required("State is Required"),
              //     city: Yup.string()
              //       .required("City is Required"),
              //     postZipCode: Yup.number()
              //       .required("Postal Code is Required"),
              //     billingEmail: Yup.string()
              //       .required("Billing Email is Required")
              //       .email('Invalid Email'),
              //     contractPoNumber: Yup.number()
              //       .required("Contract PoNumber is Required"),
              //       vatRegistrationNumber: Yup.number()
              //       .required("Vat Registration Number is Required"),
              //       currencyCode: Yup.string()
              //       .required("Please Select Currency")
              //       .nullable(),
            })}
          >
            {props => {
              const { isSubmitting } = props;
              return (
                <Form name="simpleForm" onSubmit={props.handleSubmit}>
                  <ModalHeader toggle={this.toggleDanger}>
                    New Customer
                  </ModalHeader>
                  <ModalBody>
                    {/* <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="firstName"><span className="text-danger">*</span>First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          onChange={props.handleChange}
                          placeholder="Enter FirstName "
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
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="lastName"><span className="text-danger">*</span>Middle Name</Label>
                        <Input
                          type="text"
                          id="middleName"
                          name="middleName"
                          onChange={props.handleChange}
                          placeholder="Enter Middle Name "
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
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="lastName"><span className="text-danger">*</span>Last Name</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          onChange={props.handleChange}
                          placeholder="Enter Last Name "
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
                  </Row> */}
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="firstName">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            onChange={value => {
                              props.handleChange("firstName")(value);
                            }}
                            value={props.values.firstName}
                            className={
                              props.errors.firstName && props.touched.firstName
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.firstName &&
                            props.touched.firstName && (
                              <div className="invalid-feedback">
                                {props.errors.firstName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="middleName">Middle Name</Label>
                          <Input
                            type="text"
                            id="middleName "
                            name="middleName "
                            onChange={value => {
                              props.handleChange("middleName")(value);
                            }}
                            value={props.values.middleName}
                            className={
                              props.errors.middleName &&
                                props.touched.middleName
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.middleName &&
                            props.touched.middleName && (
                              <div className="invalid-feedback">
                                {props.errors.middleName}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="lastName">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            onChange={value => {
                              props.handleChange("lastName")(value);
                            }}
                            value={props.values.lastName}
                            className={
                              props.errors.lastName && props.touched.lastName
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.lastName && props.touched.lastName && (
                            <div className="invalid-feedback">
                              {props.errors.lastName}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr />
                    <h4 className="mb-3 mt-3">Contact Details</h4>
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="organization ">
                            Organization Name
                          </Label>
                          <Input
                            type="text"
                            id="organization"
                            name="organization"
                            onChange={value => {
                              props.handleChange("organization")(value);
                            }}
                            value={props.values.organization}
                            className={
                              props.errors.organization &&
                                props.touched.organization
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.organization &&
                            props.touched.organization && (
                              <div className="invalid-feedback">
                                {props.errors.organization}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="select">PO Box Number</Label>
                          <Input
                            type="text"
                            id="poBoxNumber"
                            name="poBoxNumber"
                            onChange={value => {
                              props.handleChange("poBoxNumber")(value);
                            }}
                            value={props.values.poBoxNumber}
                            className={
                              props.errors.poBoxNumber &&
                                props.touched.poBoxNumber
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.poBoxNumber &&
                            props.touched.poBoxNumber && (
                              <div className="invalid-feedback">
                                {props.errors.poBoxNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="email">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="email"
                            name="email"
                            onChange={value => {
                              props.handleChange("email")(value);
                            }}
                            value={props.values.email}
                            className={
                              props.errors.email && props.touched.email
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.email && props.touched.email && (
                            <div className="invalid-feedback">
                              {props.errors.email}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="telephone">Telephone</Label>
                          <Input
                            type="text"
                            id="telephone"
                            name="telephone"
                            onChange={value => {
                              props.handleChange("telephone")(value);
                            }}
                            value={props.values.telephone}
                            className={
                              props.errors.telephone && props.touched.telephone
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.telephone &&
                            props.touched.telephone && (
                              <div className="invalid-feedback">
                                {props.errors.telephone}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="mobileNumber">Mobile Number</Label>
                          <Input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            onChange={value => {
                              props.handleChange("mobileNumber")(value);
                            }}
                            value={props.values.mobileNumber}
                            className={
                              props.errors.mobileNumber &&
                                props.touched.mobileNumber
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.mobileNumber &&
                            props.touched.mobileNumber && (
                              <div className="invalid-feedback">
                                {props.errors.mobileNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="addressLine1">Address Line1</Label>
                          <Input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            onChange={value => {
                              props.handleChange("addressLine1")(value);
                            }}
                            value={props.values.addressLine1}
                            className={
                              props.errors.addressLine1 &&
                                props.touched.addressLine1
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.addressLine1 &&
                            props.touched.addressLine1 && (
                              <div className="invalid-feedback">
                                {props.errors.addressLine1}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="addressLine2">Address Line2</Label>
                          <Input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            onChange={value => {
                              props.handleChange("addressLine2")(value);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="addressLine3">Address Line3</Label>
                          <Input
                            type="text"
                            id="addressLine3"
                            name="addressLine3"
                            onChange={value => {
                              props.handleChange("addressLine3")(value);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="countryId">
                            Country <span className="text-danger">*</span>
                          </Label>
                          <Select
                            className="select-default-width"
                            options={
                              country_list
                                ? selectOptionsFactory.renderOptions(
                                  "countryName",
                                  "countryCode",
                                  country_list,
                                  "Country"
                                )
                                : []
                            }
                            value={props.values.countryId}
                            onChange={option => {
                              if (option && option.value) {
                                props.handleChange("countryId")(option.value);
                              } else {
                                props.handleChange("countryId")("");
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
                          <Label htmlFor="stateRegion">State Region</Label>
                          <Input
                            className="select-default-width"
                            // options={stateRegion ? selectOptionsFactory.renderOptions('stateName', 'stateCode', stateRegion) : ''}
                            value={props.values.stateRegion}
                            onChange={option =>
                              props.handleChange("stateRegion")(option)
                            }
                            placeholder=""
                            id="stateRegion"
                            name="stateRegion"
                            className={
                              props.errors.stateRegion &&
                                props.touched.stateRegion
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.stateRegion &&
                            props.touched.stateRegion && (
                              <div className="invalid-feedback">
                                {props.errors.stateRegion}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="city">City</Label>
                          <Input
                            className="select-default-width"
                            // options={city ? selectOptionsFactory.renderOptions('cityName', 'cityCode', cityRegion) : ''}
                            value={props.values.city}
                            onChange={option =>
                              props.handleChange("city")(option)
                            }
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
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="postZipCode">Post Zip Code</Label>
                          <Input
                            type="text"
                            id="postZipCode"
                            name="postZipCode"
                            onChange={value => {
                              props.handleChange("postZipCode")(value);
                            }}
                            value={props.values.postZipCode}
                            className={
                              props.errors.postZipCode &&
                                props.touched.postZipCode
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.postZipCode &&
                            props.touched.postZipCode && (
                              <div className="invalid-feedback">
                                {props.errors.postZipCode}
                              </div>
                            )}
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
                            onChange={value => {
                              props.handleChange("billingEmail")(value);
                            }}
                            value={props.values.billingEmail}
                            className={
                              props.errors.billingEmail &&
                                props.touched.billingEmail
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.billingEmail && props.touched.billingEmail && (
                            <div className="invalid-feedback">
                              {props.errors.billingEmail}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="contractPoNumber">
                            Contract PO Number
                          </Label>
                          <Input
                            type="text"
                            id="contractPoNumber"
                            name="contractPoNumber"
                            onChange={value => {
                              props.handleChange("contractPoNumber")(value);
                            }}
                            value={props.values.contractPoNumber}
                            className={
                              props.errors.contractPoNumber &&
                                props.touched.contractPoNumber
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.contractPoNumber &&
                            props.touched.contractPoNumber && (
                              <div className="invalid-feedback">
                                {props.errors.contractPoNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="row-wrapper">
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="vatRegistrationNumber">
                            Vat Registration Number
                          </Label>
                          <Input
                            type="text"
                            id="vatRegistrationNumber"
                            name="vatRegistrationNumber"
                            onChange={value => {
                              props.handleChange("vatRegistrationNumber")(
                                value
                              );
                            }}
                            value={props.values.vatRegistrationNumber}
                            className={
                              props.errors.vatRegistrationNumber &&
                                props.touched.vatRegistrationNumber
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {props.errors.vatRegistrationNumber &&
                            props.touched.vatRegistrationNumber && (
                              <div className="invalid-feedback">
                                {props.errors.vatRegistrationNumber}
                              </div>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label htmlFor="currencyCode">Currency Code</Label>
                          <Select
                            className="select-default-width"
                            options={
                              currency_list
                                ? selectOptionsFactory.renderOptions(
                                  "currencyName",
                                  "currencyCode",
                                  currency_list,
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
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="success"
                      type="submit"
                      className="btn-square"
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                    &nbsp;
                    <Button
                      color="secondary"
                      className="btn-square"
                      onClick={() => {
                        closeCustomerModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              );
            }}
          </Formik>
        </Modal>
      </div>
    );
  }
}

export default CustomerModal;
