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
import {
  api,
} from 'utils'

import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";
import './style.scss'
import {
  Message
} from 'components'
import PasswordChecklist from "react-password-checklist"
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";



class NewPassword extends React.Component {
  constructor(props) {
    super(props);
    const queryParams = new URLSearchParams(window.location.search);
    this.state = {
      initValue: {
        password: "",
        confirmPassword: '',
        token: queryParams.get('token')
      },
      isPasswordShown: false,
      alert: null
    };
    this.formikRef = React.createRef();
     }
   
  handleSubmit = (val) => {
     
   let obj = {
      password: val.password,
      token: val.token
    }
      let data = {
        method: 'post',
        url: '/public/resetPassword',
        data: obj
      } 
    api(data).then((res) => {
      if(res.status === 200 ) {
        this.setState({
          alert: <Message
            type="success"
            content="Password Created Successfully."
          />
        },() => {
          setTimeout(() => {
            this.props.history.push('/login')
          },1500)
        })
      }
    }).catch((err) => {
      this.setState({
        alert: <Message
          type="danger"
          content="Email Verification Link Is Expired. Please enter your email address and we'll send another verification link."
          link="/reset-password"
        />
      })
  })
}

  displayMsg = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT
    });
  }
  togglePasswordVisiblity = () => {
		const { isPasswordShown } = this.state;
		this.setState({ isPasswordShown: !isPasswordShown });
	};

  render() {
    const { initValue } = this.state;
    const { isPasswordShown } = this.state;
    return (
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
                      <i className="fas fa-lock mt-1"></i> <h4 >Create Password</h4>
                    </CardHeader>
                    <CardBody className="p-4">
                      <Formik
                        ref={this.formikRef}
                        initialValues={initValue}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values, resetForm);
                        }}
                        validationSchema={Yup.object().shape({
                          password: Yup.string()
                            .required("Password is Required")
                            // .min(8, "Password Too Short")
                            .matches(
                              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                            ),
                          confirmPassword: Yup.string()
                            .required('Confirm Password is Required')
                            .oneOf([Yup.ref("password"), null], "Passwords must match"),
                        })}
                      >
                        {(props) => {
                          return (
                            <Form >
                              <Row>
                                <Col lg={12}>
                                  <FormGroup>
																			<Label htmlFor="select">
																				<span className="text-danger">*</span>
																				 Password
																			</Label>
																			<div>
																				<Input
																					type={
																						this.state.isPasswordShown
																							? 'text'
																							: 'password'
																					}
																					id="password"
																					name="password"
																					placeholder=" Enter Password"
																					value={props.values.password}
																					onChange={(option) => {
																						props.handleChange('password')(
																							option,
																						);
																					}}
																					className={
																						props.errors.password &&
																							props.touched.password
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				<i className={`fa ${isPasswordShown ? "fa-eye-slash" : "fa-eye"} password-icon fa-lg`}
																					onClick={this.togglePasswordVisiblity}
																				>
																					{/* <img 
																			src={eye}
																			style={{ width: '20px' }}
																		/> */}
																				</i>
																			</div>
																			{props.errors.password &&
																				props.touched.password && (
																					<div className="invalid-feedback">
																						{props.errors.password}
																					</div>
																				)}
																			<PasswordChecklist
																				rules={["minLength", "specialChar", "number", "capital"]}
																				minLength={8}
																				value={props.values.password}
																				valueAgain={props.values.confirmPassword}
																			/>
																		</FormGroup>
                                </Col>
                                <Col lg={12}>
                                  <FormGroup>
																			<Label htmlFor="select">
																				<span className="text-danger">*</span>
																			Confirm Password
																			</Label>
																			<Input
																				type="password"
																				id="confirmPassword"
																				name="confirmPassword"
																				value={props.values.confirmPassword}
																				placeholder="Confirm Password"
																				onChange={(value) => {
																					props.handleChange('confirmPassword')(
																						value,
																					);
																				}}
																				className={
																					props.errors.confirmPassword &&
																						props.touched.confirmPassword
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.confirmPassword &&
																				props.touched.confirmPassword && (
																					<div className="invalid-feedback">
																						{props.errors.confirmPassword}
																					</div>
																				)}
																				<PasswordChecklist
																				rules={[ "match"]}
																				minLength={8}
																				value={props.values.password}
																				valueAgain={props.values.confirmPassword}
																			/>
																		</FormGroup>
                                </Col>
                              </Row>
                              <Row className="button-group mt-4">
                                <Col lg="12">
                                  <Button
                                    color="primary"
                                    type="button"
                                    className="btn-square w-100 submit-btn"
                                 //   disabled={isSubmitting}
                                    onClick={() => { props.handleSubmit() }}
                                  >
                                   Create Password
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
        </div>
      // </div>
    );
  }
}

export default NewPassword;
