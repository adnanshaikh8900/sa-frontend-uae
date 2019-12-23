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

import * as ProjectActions from '../actions'
import {selectOptionsFactory} from 'utils'


class SupplierModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,

      initValue: {
        firstName: '',
        lastName: '',
        middleName: '',
        contactType: 'supplier'
      },
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // Create or Contact
  handleSubmit(data) {

    const request = this.props.createContact(data);
    request.then(res => {
      if (res.status === 200) {
      // this.success()
      this.closeContactModel()
      }
    })
  }

  render() {
    const { openSupplierModal, closeSupplierModal} = this.props
    return (
      <div className="contact-modal-screen">
        <Modal isOpen={openSupplierModal}
          className="modal-success contact-modal"
          >
          <Formik
            initialValues={this.state.initValue}
            onSubmit={(values, {resetForm}) => {
              this.handleSubmit(values)
              resetForm(this.state.initValue)
            }}
            >
            {props => (
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
                              onChange={props.handleChange}
                              placeholder="Enter FirstName "
                              value={props.values.firstName}
                              // className={
                              //   props.errors.warehouseName  && props.touched.warehouseName 
                              //   ? "is-invalid"
                              //   : ""
                              // }
                            />
                          {/* {props.errors.warehouseName  && props.touched.warehouseName  && (
                            <div className="invalid-feedback">{props.errors.warehouseName }</div>
                          )} */}
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
                              // className={
                              //   props.errors.warehouseName  && props.touched.warehouseName 
                              //   ? "is-invalid"
                              //   : ""
                              // }
                            />
                          {/* {props.errors.warehouseName  && props.touched.warehouseName  && (
                            <div className="invalid-feedback">{props.errors.warehouseName }</div>
                          )} */}
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
                              // className={
                              //   props.errors.warehouseName  && props.touched.warehouseName 
                              //   ? "is-invalid"
                              //   : ""
                              // }
                            />
                          {/* {props.errors.warehouseName  && props.touched.warehouseName  && (
                            <div className="invalid-feedback">{props.errors.warehouseName }</div>
                          )} */}
                        </FormGroup>
                      </Col>
                    </Row>

                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" type="submit" className="btn-square">Save</Button>&nbsp;
                    <Button color="secondary" className="btn-square" onClick={closeSupplierModal}>Cancel</Button>
                  </ModalFooter>
              </Form>
              )}
            </Formik>
          </Modal>
        </div>
    )
  }
}

export default SupplierModal