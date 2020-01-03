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
import _ from 'lodash'

import { Formik } from 'formik';
import * as Yup from "yup";

import { selectOptionsFactory } from 'utils'
import { ToastContainer, toast } from 'react-toastify'



class CustomerModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initValue: {
        firstName: '',
        lastName: '',
        middleName: '',
        contactType: 2
      },
    }
    this.formikRef = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.displayMsg = this.displayMsg.bind(this)
  }

  // Create or Contact
  handleSubmit(data,resetForm,setSubmitting) {
    this.props.createCustomer(data).then(res => {
      if (res.status === 200) {
        resetForm();
        const val = res.data
        this.props.closeCustomerModal(true)
        this.props.getCurrentUser(res.data)
      }
    }).catch(err => {
      this.displayMsg();
      this.formikRef.current.setSubmitting(false);
    })
  }

  displayMsg() {
    toast.error('Something Went Wrong... ', {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  render() {
    const { openCustomerModal, closeCustomerModal } = this.props
    const { initValue } = this.state
    return (
      <div className="contact-modal-screen">
        <Modal isOpen={openCustomerModal}
          className="modal-success contact-modal"
        >
          <Formik
            ref={this.formikRef}
            initialValues={initValue}
            onSubmit={(values, { resetForm , setSubmitting}) => {
              this.handleSubmit(values,resetForm)
            }}
            validationSchema={
              Yup.object().shape({
                firstName: Yup.string()
                  .required("FirstName is Required"),
                lastName: Yup.string()
                  .required("LastName is Required"),
                middleName: Yup.string()
                  .required("MiddleName is Required")
              })
            }
          >
            {props => {
                const { isSubmitting } = props;
              return (
              <Form name="simpleForm" onSubmit={props.handleSubmit}>
                <ModalHeader toggle={this.toggleDanger}>New Customer</ModalHeader>
                <ModalBody>
                  <Row>
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
                  </Row>

                </ModalBody>
                <ModalFooter>
                  <Button color="success" type="submit" className="btn-square" disabled={isSubmitting}>Save</Button>&nbsp;
                    <Button color="secondary" className="btn-square" onClick={()=>{closeCustomerModal(false)}}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
            }
          </Formik>
        </Modal>
      </div >
    )
  }
}

export default CustomerModal