import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Button,
	Card,
	CardBody,
	CardGroup,
	Col,
	Container,
	Form,
	Input,
	FormGroup,
	Label,
	Row,
} from 'reactstrap';

import { AuthActions, CommonActions } from 'services/global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Formik } from 'formik';
import * as Yup from 'yup';
import './style.scss';
import logo from 'assets/images/brand/logo.png';

const mapStateToProps = (state) => {
	return {
		version: state.common.version,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		authActions: bindActionCreators(AuthActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class LogIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initValue: {
				username: '',
				password: '',
			},
			alert: null,
			openForgotPasswordModal: false,
			companyCount: 1,
			loading: false,
		};
	}

	componentDidMount = () => {
		this.getInitialData();
	};

	getInitialData = () => {
		this.props.authActions.getCompanyCount().then((response) => {
			console.log(response.data);
			if (response.data < 1) {
				this.props.history.push('/register');
			}
			this.setState({ companyCount: response.data }, () => {});
		});
	};

	handleChange = (key, val) => {
		this.setState({
			[key]: val,
		});
	};

	handleSubmit = (data, resetForm) => {
		this.setState({ loading: true });
		const { username, password } = data;
		let obj = {
			username,
			password,
		};
		this.props.authActions
			.logIn(obj)
			.then((res) => {
				toast.success('Log in Succesfully', {
					position: toast.POSITION.TOP_RIGHT,
				});
				this.props.history.push('/admin');
				this.setState({ loading: false });
			})
			.catch((err) => {
				this.setState({ loading: true });
				toast.error(
					err && err.data
						? 'Log in failed. Please try again'
						: 'Something Went Wrong',
					{
						position: toast.POSITION.TOP_RIGHT,
					},
				);
			});
	};

	openForgotPasswordModal = () => {
		this.setState({ openForgotPasswordModal: true });
	};

	closeForgotPasswordModal = (res) => {
		this.setState({ openForgotPasswordModal: false });
	};

	render() {
		const { initValue } = this.state;
		return (
			<div className="log-in-screen">
				<ToastContainer />
				<div className="animated fadeIn">
					<div className="app flex-row align-items-center">
						<Container>
							<Row className="justify-content-center">
								<Col md="6">{this.state.alert}</Col>
							</Row>
							<Row className="justify-content-center">
								<Col md="6">
									<CardGroup>
										<Card className="p-4">
											<CardBody>
												<div className="logo-container">
													<img src={logo} alt="logo" />
												</div>
												<Formik
													initialValues={initValue}
													onSubmit={(values, { resetForm }) => {
														this.handleSubmit(values, resetForm);
													}}
													validationSchema={Yup.object().shape({
														username: Yup.string().required(
															'Email is Required',
														),
														password: Yup.string().required(
															'Please Enter your password',
														),
													})}
												>
													{(props) => {
														return (
															<Form onSubmit={props.handleSubmit}>
																{/* <h1>Log In</h1> */}
																<div className="registerScreen">
																	<h2 className="">Login</h2>
																	<p>Enter your details below to continue</p>
																</div>
																<Row>
																	<Col lg={12}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="username">
																				<span className="text-danger">*</span>
																				User Name
																			</Label>
																			<Input
																				type="text"
																				id="username"
																				name="username"
																				placeholder="Enter User Name"
																				value={props.values.username}
																				onChange={(option) => {
																					props.handleChange('username')(
																						option,
																					);
																				}}
																				className={
																					props.errors.username &&
																					props.touched.username
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.username &&
																				props.touched.username && (
																					<div className="invalid-feedback">
																						{props.errors.username}
																					</div>
																				)}
																		</FormGroup>
																	</Col>
																	<Col lg={12}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="email">
																				<span className="text-danger">*</span>
																				Password
																			</Label>
																			<Input
																				type="password"
																				id="password"
																				name="password"
																				placeholder="Enter password"
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
																			{props.errors.password &&
																				props.touched.password && (
																					<div className="invalid-feedback">
																						{props.errors.password}
																					</div>
																				)}
																		</FormGroup>
																	</Col>
																	<Col>
																		<Button
																			type="button"
																			color="link"
																			className="px-0"
																			onClick={() => {
																				this.props.history.push(
																					'/reset-password',
																				);
																			}}
																			style={{ marginTop: '-10px' }}
																		>
																			Forgot password?
																		</Button>
																	</Col>
																</Row>
																<Row>
																	<Col className="text-center">
																		<Button
																			color="primary"
																			type="submit"
																			className="px-4 btn-square mt-3"
																			style={{ width: '200px' }}
																			disabled={this.state.loading}
																		>
																			<i className="fa fa-sign-in" /> Log In
																		</Button>
																	</Col>
																</Row>
																{this.state.companyCount < 1 && (
																	<Row>
																		<Col className="mt-3">
																			<p className="r-btn">
																				Don't have an account?{' '}
																				<span
																					onClick={() => {
																						this.props.history.push(
																							'/register',
																						);
																					}}
																				>
																					Register Here
																				</span>
																			</p>
																		</Col>
																	</Row>
																)}
															</Form>
														);
													}}
												</Formik>
											</CardBody>
										</Card>
									</CardGroup>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
