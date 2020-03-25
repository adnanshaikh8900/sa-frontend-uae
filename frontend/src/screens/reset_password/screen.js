import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  FormGroup,
  Label,
  Row
} from 'reactstrap'


import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import './style.scss'
import {
  Message
} from 'components'
import ResetNewPassword from './sections/reset_new_password'
import {
  api,
} from 'utils'

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: {
        username: "",
      },
      alert: null
    };
    this.formikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayMsg = this.displayMsg.bind(this);
  }

  componentDidMount() {
    if (this.props && this.props.location && this.props.location.search) {
      const query = new URLSearchParams(this.props.location.search);
      const token = query.get('token')
      this.setState({
        token: token
      })
    }
  }

  // Create or Contact
  handleSubmit = (obj,) => {
    let data = {
      method: 'post',
      url: '/public/forgotPassword',
      data: { "username": obj.username }
    }
    api(data).then(res => {
      this.setState({
        alert: <Message
          type="success"
          content="We Have Sent You a Verification Email. Please Check Your Mail Box."
        />
      },()=>{
          setTimeout(() => {
            this.props.history.push('/login')
        }, 1500);
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        alert: <Message
          type="danger"
          content="Invalid Email Address"
        />
      })
    })
  }

  displayMsg(msg) {
    console.log(msg)
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  render() {
    const { initValue, token } = this.state;

    return (
      <div className="reset-password-screen">
        {!token ? (
          <div className="animated fadeIn">
            <div className="app flex-row align-items-center">
              <Container>
                <Row className="justify-content-center">
                  <Col md="5">
                    {this.state.alert}
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col md="5">
                    <Card>
                      <CardHeader className="register-header d-flex">
                        <i className="fas fa-lock"></i> <h5 className="mb-0">Forgot Password</h5>
                      </CardHeader>
                      <CardBody className="p-4">
                        <Formik
                          ref={this.formikRef}
                          initialValues={initValue}
                          onSubmit={(values, { resetForm }) => {
                            this.handleSubmit(values, resetForm);
                          }}
                          validationSchema={Yup.object().shape({
                            username: Yup.string()
                              .required("Email Id is Required")
                              .email("Invalid Email Id"),
                          })}
                        >
                          {props => {
                            return (
                              <Form >
                                <Row>
                                  <Col lg="12">
                                    <FormGroup>
                                      <Label htmlFor="username">
                                        <span className="text-danger">*</span>Email Address
                                     </Label>
                                      <Input
                                        type="text"
                                        id="username"
                                        name="username"
                                        onChange={value => {
                                          props.handleChange("username")(value);
                                        }}
                                        placeholder="Please Enter Your Email Address"
                                        value={props.values.username}
                                        className={
                                          props.errors.username && props.touched.username
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.username && props.touched.username && (
                                        <div className="invalid-feedback">
                                          {props.errors.username}
                                        </div>
                                      )}
                                      {console.log(props.errors)}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row className="button-group">
                                  <Col lg="12">
                                    <Button
                                      color="primary"
                                      type="button"
                                      className="btn-square w-100 submit-btn"
                                  //    disabled={isSubmitting}
                                      onClick={() => { props.handleSubmit() }}
                                    >
                                      Send Verification Email
                               </Button>
                                  </Col>
                                  <Col lg="12 mt-2">
                                    <Button
                                      color="secondary"
                                      className="btn-square w-100 close-btn"
                                      onClick={() => {
                                        this.props.history.push('/login')
                                      }}
                                    >
                                      BACK TO LOGIN
                                     </Button>
                                  </Col>
                                </Row>
                              </Form>
                            );
                          }}
                        </Formik>
                      </CardBody>
                    </Card>

                  </Col>
                </Row>
              </Container>
            </div>
          </div>) : (
            <ResetNewPassword token={token} {...this.props}/>)
        }
      </div>
    );
  }
}

export default ResetPassword;
