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
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
} from 'reactstrap';
import Select from 'react-select';
import { Message } from 'components';
import { selectCurrencyFactory } from 'utils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthActions } from 'services/global';

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
	};
};
const options = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' },
];
class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			alert: null,
			currencyList: [],
			success: false,
			initValue: {
				companyName: '',
				currencyCode: '',
				companyTypeCode: '',
				industryTypeCode: '',
				firstName: '',
				lastName: '',
				email: '',
				password: '',
			},
		};
	}

	componentDidMount = () => {
		this.getInitialData();
	};

	getInitialData = () => {
		this.props.authActions.getCurrencyList().then((response) => {
			this.setState({
				currencyList: response.data,
			});
		});
		this.props.authActions.getCompanyCount().then((response) => {
			if (response.data > 0) {
				this.props.history.push('/login');
			}
		});
	};

	handleChange = (key, val) => {
		this.setState({
			[key]: val,
		});
	};

	handleSubmit = (data, resetForm) => {
		const {
			companyName,
			currencyCode,
			companyTypeCode,
			industryTypeCode,
			firstName,
			lastName,
			email,
			password,
		} = data;
		let obj = {
			companyName: companyName,
			currencyCode: currencyCode ? currencyCode : '',
			companyTypeCode: companyTypeCode,
			industryTypeCode: industryTypeCode,
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		};
		let formData = new FormData();
		for (var key in this.state.initValue) {
			formData.append(key, data[key]);
		}
		console.log(data);
		this.props.authActions
			.register(formData)
			.then((res) => {
				this.setState({
					alert: (
						<Message
							type="success"
							title="Register Successfully please log in to continue"
							content=""
						/>
					),
					success: true,
				});
			})
			.catch((err) => {
				this.setState({
					alert: (
						<Message
							type="danger"
							title={err ? err.data.error : ''}
							content="Log in failed. Please try again later"
						/>
					),
				});
			});
	};

	render() {
		const customStyles = {
			control: (base, state) => ({
				...base,
				flex: '1 1 auto',
				width: '267px',
				borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
				boxShadow: state.isFocused ? null : null,
				'&:hover': {
					borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
				},
			}),
		};
		const { initValue, currencyList } = this.state;
		return (
			<div className="log-in-screen">
				<div className="animated fadeIn">
					<div className="app flex-row align-items-center">
						<Container>
							<Row className="justify-content-center flex-column text-center align-items-center">
								<Col md="6">{this.state.alert}</Col>
								{this.state.success === true && (
									<Col md="6">
										<Button
											color="primary"
											type="submit"
											className="btn-square mr-3 btn btn-primary"
											onClick={() => {
												this.props.history.push('/login');
											}}
										>
											Login
										</Button>
									</Col>
								)}
							</Row>
							<Row className="justify-content-center">
								<Col md="8">
									<CardGroup>
										<Card className="p-4">
											<CardBody>
												<div className="logo-container">
													<img
														src={logo}
														alt="logo"
														style={{ width: '226px' }}
													/>
												</div>
												<Formik
													initialValues={initValue}
													onSubmit={(values, { resetForm }) => {
														this.handleSubmit(values, resetForm);
													}}
													validationSchema={Yup.object().shape({
														companyName: Yup.string().required(
															'Company name is required',
														),
														currencyCode: Yup.string().required(
															'Currency is required',
														),
														firstName: Yup.string().required(
															'First Name is required',
														),
														lastName: Yup.string().required(
															'Last Name is required',
														),
														email: Yup.string()
															.required('Email is Required')
															.email('Invalid Email'),
														password: Yup.string()
															.required('Please Enter your password')
															.matches(
																/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
																'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
															),
													})}
												>
													{(props) => {
														return (
															<Form onSubmit={props.handleSubmit}>
																{/* <h1>Log In</h1> */}
																<p className="text-muted">
																	Create your account
																</p>
																<Row>
																	<Col lg={6}>
																		<InputGroup className="mb-3">
																			<InputGroupAddon addonType="prepend">
																				<InputGroupText>
																					<i className="icon-user"></i>
																				</InputGroupText>
																			</InputGroupAddon>
																			<Input
																				type="text"
																				maxLength="50"
																				id="companyName"
																				name="companyName"
																				placeholder="Enter Company Name"
																				value={props.values.companyName}
																				onChange={(option) => {
																					props.handleChange('companyName')(
																						option,
																					);
																				}}
																				className={
																					props.errors.companyName &&
																					props.touched.companyName
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.companyName &&
																				props.touched.companyName && (
																					<div className="invalid-feedback">
																						{props.errors.companyName}
																					</div>
																				)}
																		</InputGroup>
																	</Col>
																	<Col lg={6}>
																		<InputGroup className="mb-3">
																			<InputGroupAddon addonType="prepend">
																				<InputGroupText>
																					<i className="icon-user"></i>
																				</InputGroupText>
																			</InputGroupAddon>
																			<Select
																				styles={customStyles}
																				id="currencyCode"
																				name="currencyCode"
																				options={
																					currencyList
																						? selectCurrencyFactory.renderOptions(
																								'currencyName',
																								'currencyCode',
																								currencyList,
																								'Currency',
																						  )
																						: []
																				}
																				onChange={(option) => {
																					if (option && option.value) {
																						props.handleChange('currencyCode')(
																							option.value,
																						);
																					} else {
																						props.handleChange('currencyCode')(
																							'',
																						);
																					}
																				}}
																				className={
																					props.errors.currencyCode &&
																					props.touched.currencyCode
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.currencyCode &&
																				props.touched.currencyCode && (
																					<div className="invalid-feedback">
																						{props.errors.currencyCode}
																					</div>
																				)}
																		</InputGroup>
																	</Col>
																	<Col lg={6}>
																		<InputGroup className="mb-3">
																			<InputGroupAddon addonType="prepend">
																				<InputGroupText>
																					<i className="icon-user"></i>
																				</InputGroupText>
																			</InputGroupAddon>
																			<Input
																				type="text"
																				maxLength="50"
																				id="firstName"
																				name="firstName"
																				placeholder="Enter First Name"
																				value={props.values.firstName}
																				onChange={(option) => {
																					props.handleChange('firstName')(
																						option,
																					);
																				}}
																				className={
																					props.errors.firstName &&
																					props.touched.firstName
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.firstName &&
																				props.touched.firstName && (
																					<div className="invalid-feedback">
																						{props.errors.firstName}
																					</div>
																				)}
																		</InputGroup>
																	</Col>
																	<Col lg={6}>
																		<InputGroup className="mb-3">
																			<InputGroupAddon addonType="prepend">
																				<InputGroupText>
																					<i className="icon-user"></i>
																				</InputGroupText>
																			</InputGroupAddon>
																			<Input
																				type="text"
																				maxLength="50"
																				id="lastName"
																				name="lastName"
																				placeholder="Enter Last Name"
																				value={props.values.lastName}
																				onChange={(option) => {
																					props.handleChange('lastName')(
																						option,
																					);
																				}}
																				className={
																					props.errors.lastName &&
																					props.touched.lastName
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.lastName &&
																				props.touched.lastName && (
																					<div className="invalid-feedback">
																						{props.errors.lastName}
																					</div>
																				)}
																		</InputGroup>
																	</Col>
																	<Col lg={6}>
																		<InputGroup className="mb-3">
																			<InputGroupAddon addonType="prepend">
																				<InputGroupText>
																					<i className="icon-user"></i>
																				</InputGroupText>
																			</InputGroupAddon>
																			<Input
																				type="text"
																				maxLength="50"
																				id="email"
																				name="email"
																				placeholder="Enter Email Address"
																				value={props.values.email}
																				onChange={(option) => {
																					props.handleChange('email')(option);
																				}}
																				className={
																					props.errors.email &&
																					props.touched.email
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			{props.errors.email &&
																				props.touched.email && (
																					<div className="invalid-feedback">
																						{props.errors.email}
																					</div>
																				)}
																		</InputGroup>
																	</Col>
																	<Col lg={6}>
																		<InputGroup className="mb-4">
																			<InputGroupAddon addonType="prepend">
																				<InputGroupText>
																					<i className="icon-lock"></i>
																				</InputGroupText>
																			</InputGroupAddon>
																			<Input
																				type="password"
																				id="password"
																				name="password"
																				placeholder="Enter Password"
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
																		</InputGroup>
																	</Col>
																</Row>
																<Row>
																	<Col xs="12" lg="5">
																		<Button
																			type="submit"
																			name="submit"
																			color="primary"
																			className="btn-square mr-3"
																		>
																			<i className="fa fa-dot-circle-o"></i>{' '}
																			{this.state.disabled
																				? 'Creating...'
																				: 'Register'}
																		</Button>
																	</Col>
																</Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
