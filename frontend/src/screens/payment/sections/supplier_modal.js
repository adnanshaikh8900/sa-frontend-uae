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

import { Formik } from 'formik';
import * as Yup from "yup";

import { toast } from 'react-toastify'



class SupplierModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      initValue: {
        firstName: '',
        lastName: '',
        middleName: '',
        contactType: 1
      },
    }
    this.formikRef = React.createRef()
    this.regExAlpha = /^[a-zA-Z]+$/
  }

  // Create or Contact
  handleSubmit = (data,resetForm,setSubmitting) => {
    this.props.createSupplier(data).then(res => {
      if (res.status === 200) {
        resetForm();
        this.props.closeSupplierModal(true)
        this.props.getCurrentUser(res.data)
      }
    }).catch(err => {
      this.displayMsg();
      this.formikRef.current.setSubmitting(false);
    })
  }

  displayMsg = () => {
    toast.error('Something Went Wrong... ', {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  render() {
    const { openSupplierModal, closeSupplierModal } = this.props
    const { initValue } = this.state
    return (
      <div className="contact-modal-screen">
        <Modal isOpen={openSupplierModal}
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
                  .required("First Name is Required"),
                lastName: Yup.string()
                  .required("Last Name is Required"),
                middleName: Yup.string()
                  .required("Middle Name is Required")
              })
            }
          >
            {props => {
                const { isSubmitting } = props;
              return (
              <Form name="simpleForm" onSubmit={props.handleSubmit}>
                <ModalHeader toggle={this.toggleDanger}>New Supplier</ModalHeader>
                <ModalBody>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label htmlFor="firstName"><span className="text-danger">*</span>First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          onChange={(option) => { 
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('firstName')(option) }}
                          placeholder="Enter First Name "
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
                          onChange={(option) => { 
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('middleName')(option) }}
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
                          onChange={(option) => { 
                            if (option.target.value === '' || this.regExAlpha.test(option.target.value)) props.handleChange('lastName')(option) }}
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
                    <Button color="secondary" className="btn-square" onClick={()=>{closeSupplierModal(false)}}>Cancel</Button>
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

export default SupplierModal