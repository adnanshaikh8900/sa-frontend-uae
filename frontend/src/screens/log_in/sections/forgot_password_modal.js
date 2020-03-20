import React from "react";
import {
  Button,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

class ForgotPasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: {
        email: "",
      }
    };
    this.formikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayMsg = this.displayMsg.bind(this);

  }

  // Create or Contact
  handleSubmit(data, resetForm, setSubmitting) {
    // this.props
    //   .createCustomer(data)
    //   .then(res => {
    //     if (res.status === 200) {
    //       resetForm();
    //       this.props.closeForgotPasswordModal(true);
    //       // this.props.getCurrentUser(res.data);
    //     }
    //   })
    //   .catch(err => {
    //     this.displayMsg();
    //     this.formikRef.current.setSubmitting(false);
    //   });
  }

  displayMsg() {
    toast.error("Something Went Wrong... ", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  render() {
    const {
      openForgotPasswordModal,
      closeForgotPasswordModal,
    } = this.props;
    const { initValue } = this.state;
    return (
      <div className="contact-modal-screen">
        <Modal
          isOpen={openForgotPasswordModal}
          className="modal-primary forgot-password-modal"
        >
          <Formik
            ref={this.formikRef}
            initialValues={initValue}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              this.handleSubmit(values, resetForm);
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .required("Email Id is Required")
                .email("Invalid Email Id"),
            })}
          >
            {props => {
              const { isSubmitting } = props;
              return (
                <Form name="simpleForm" onSubmit={props.handleSubmit}>
                  <ModalHeader toggle={this.toggleDanger}>
                    Forgot Password
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label htmlFor="email">
                        <span className="text-danger">*</span>Email Address
                          </Label>
                      <Input
                        type="text"
                        id="email"
                        name="email"
                        onChange={value => {
                          props.handleChange("email")(value);
                        }}
                        placeholder="Please Enter Your Email Address"
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
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      type="submit"
                      className="btn-square"
                      disabled={isSubmitting}
                    >
                      Send
                    </Button>
                    &nbsp;
                    <Button
                      color="secondary"
                      className="btn-square"
                      onClick={() => {
                        closeForgotPasswordModal(false);
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

export default ForgotPasswordModal;
