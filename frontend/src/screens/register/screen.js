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
	Row,
	FormGroup,
	Label,
} from 'reactstrap';
import Select from 'react-select';
import { Message } from 'components';
import { selectCurrencyFactory } from 'utils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthActions, CommonActions } from 'services/global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
			currencyList: [
				{
					createdBy: 1,
					createdDate: '2017-04-01T06:03:11.000+0000',
					currencyCode: 150,
					currencyDescription: 'United Arab Emirates Dirham',
					currencyIsoCode: 'AED',
					currencyName: 'UAE Dirham',
					currencySymbol: 'د.إ',
					defaultFlag: 'N',
					deleteFlag: true,
					description: 'United Arab Emirates Dirham - AED(د.إ)',
					lastUpdateBy: null,
					lastUpdateDate: null,
					orderSequence: 151,
					versionNumber: 1,
				},
			],
			success: false,
			initValue: {
				companyName: '',
				currencyCode: 150,
				companyTypeCode: '',
				industryTypeCode: '',
				firstName: '',
				lastName: '',
				email: '',
				password: '',
			},
			userDetail: false,
			togglePassword: '********',
		};
	}

	componentDidMount = () => {
		this.getInitialData();
	};

	getInitialData = () => {
		// this.props.authActions.getCurrencyList().then((response) => {
		// 	this.setState({
		// 		currencyList: response.data,
		// 	});
		// });
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
		this.props.authActions
			.register(formData)
			.then((res) => {
				toast.success('Register Successfully please log in to continue', {
					position: toast.POSITION.TOP_RIGHT,
				});
				console.log(this.state.initValue.email);
				this.setState({
					userDetail: true,
					userName: email,
					password: password,
				});
				// setTimeout(() => {
				// 	this.props.history.push('/login');
				// }, 3000);
			})
			.catch((err) => {
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

	render() {
		const customStyles = {
			control: (base, state) => ({
				...base,
				flex: '1 1 auto',
				borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
				boxShadow: state.isFocused ? null : null,
				'&:hover': {
					borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
				},
			}),
		};
		const { initValue, currencyList, userDetail } = this.state;
		return (
			<div className="log-in-screen">
				<ToastContainer autoClose={5000} />
				<div className="animated fadeIn">
					<div className="app flex-row align-items-center">
						<Container>
							{userDetail === false && (
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
																	<div className="registerScreen">
																		<h2 className="">Register</h2>
																		<p>Enter your details below to register</p>
																	</div>
																	<Row>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="companyName">
																					<span className="text-danger">*</span>
																					Company Name
																				</Label>
																				<Input
																					type="text"
																					maxLength="50"
																					id="companyName"
																					name="companyName"
																					placeholder="Enter Compnay Name"
																					value={props.values.account_name}
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
																			</FormGroup>
																		</Col>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="currencyCode">
																					<span className="text-danger">*</span>
																					Currency
																				</Label>
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
																					value={
																						currencyList &&
																						selectCurrencyFactory
																							.renderOptions(
																								'currencyName',
																								'currencyCode',
																								currencyList,
																								'Currency',
																							)
																							.find(
																								(option) =>
																									option.value ===
																									+props.values.currencyCode,
																							)
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange(
																								'currencyCode',
																							)(option.value);
																						} else {
																							props.handleChange(
																								'currencyCode',
																							)('');
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
																			</FormGroup>
																		</Col>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="firstName">
																					<span className="text-danger">*</span>
																					First Name
																				</Label>
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
																			</FormGroup>
																		</Col>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="lastName">
																					<span className="text-danger">*</span>
																					Last Name
																				</Label>
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
																			</FormGroup>
																		</Col>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="email">
																					<span className="text-danger">*</span>
																					Email Address
																				</Label>
																				<Input
																					type="text"
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
																			</FormGroup>
																		</Col>
																		<Col lg={6}>
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
																	</Row>
																	<Row>
																		<Col className="text-center">
																			<Button
																				type="submit"
																				name="submit"
																				color="primary"
																				className="btn-square mr-3 mt-3 "
																				style={{ width: '200px' }}
																			>
																				<i className="fa fa-dot-circle-o"></i>{' '}
																				{this.state.disabled
																					? 'Creating...'
																					: 'Register'}
																			</Button>
																		</Col>
																	</Row>
																	<Row>
																		<Col>
																			<Button
																				type="button"
																				color="link"
																				className="px-0"
																				onClick={() => {
																					this.props.history.push('/login');
																				}}
																				style={{ marginTop: '-10px' }}
																			>
																				Back
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
							)}
							{userDetail === true && (
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
													<div className="registerScreen">
														<h2 className="">Login Details</h2>
														<p>Please save Username and Password to login</p>
													</div>
													<Row>
														<Col md="12">
															<FormGroup className="mb-3">
																<Label htmlFor="lastName">User Name</Label>
																<div style={{ fontWeight: 'bold' }}>
																	{this.state.userName}
																</div>
															</FormGroup>
														</Col>
														<Col md="12">
															<FormGroup className="mb-3">
																<Label htmlFor="lastName">Password</Label>
																<div style={{ fontWeight: 'bold' }}>
																	{this.state.togglePassword}
																</div>
																<span
																	style={{
																		marginTop: '10px;',
																		display: 'block',
																	}}
																	onClick={() => {
																		this.setState({
																			togglePassword: this.state.password,
																		});
																	}}
																>
																	Show Password
																</span>
															</FormGroup>
														</Col>
													</Row>
													<Row>
														<Col className="mt-3">
															<p className="r-btn">
																Saved Credentials? Now{' '}
																<span
																	onClick={() => {
																		this.props.history.push('/login');
																	}}
																>
																	Login
																</span>
															</p>
														</Col>
													</Row>
												</CardBody>
											</Card>
										</CardGroup>
									</Col>
								</Row>
							)}
						</Container>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
