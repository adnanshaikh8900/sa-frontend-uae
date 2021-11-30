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
import DatePicker from 'react-datepicker';
import { Message } from 'components';
import { selectCurrencyFactory,selectOptionsFactory } from 'utils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthActions, CommonActions } from 'services/global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import PasswordChecklist from "react-password-checklist"

import './style.scss';
import logo from 'assets/images/brand/logo.png';

const mapStateToProps = (state) => {
	return {
		country_list: state.common.country_list,
		state_list: state.common.state_list,
		version: state.common.version,
		universal_currency_list :state.common.universal_currency_list,
	};
};
const eye = require('assets/images/settings/eye.png');
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
			isPasswordShown: false,
			alert: null,
			currencyList: [
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
				confirmPassword: '',
				timeZone: '',
				countryId: '',
				stateId: '',
				IsDesignatedZone:'',
				IsRegistered:'',
				TaxRegistrationNumber:'',
				vatRegistrationDate:'',
				

			},
			userDetail: false,
			show: false,
			togglePassword: '***********',
			loading: false,
			timezone: [],
		};

		this.regEx = /^[0-9\d]+$/;
	}

	componentDidMount = () => {
		this.getInitialData();
	};
	getStateList = (countryCode) => {
		this.props.commonActions.getStateList(countryCode);
	};
	getInitialData = () => {
		this.props.authActions.getTimeZoneList().then((response) => {
			let output = response.data.map(function (value) {
				return { label: value, value: value };
			});
			this.setState({ timezone: output });
		});
		this.props.commonActions.getCountryList();

		this.props.authActions.getCurrencyList();
		this.props.authActions.getCompanyCount().then((response) => {
			if (response.data > 0) {
				this.props.history.push('/login');
			}
		});
	};

	// togglePasswordVisiblity = () => {
	// 	this.setState({
	// 		passwordShown: !this.state.passwordShown,
	// 	});
	// };
	// togglePasswordVisiblity = () => {
	// 	const { isPasswordShown } = this.state;
	// 	this.setState({ isPasswordShown: !isPasswordShown });
	//   };
	handleChange = (key, val) => {
		this.setState({
			[key]: val,
		});
	};

	handleSubmit = (data, resetForm) => {
		 
		this.setState({ loading: true });
		const {
			companyName,
			currencyCode,
			companyTypeCode,
			industryTypeCode,
			firstName,
			lastName,
			email,
			password,
			timeZone,
			countryId,
				stateId,
				IsDesignatedZone,
				IsRegistered,
				TaxRegistrationNumber,
				vatRegistrationDate,
				companyAddress

		} = data;
		let obj = {
			companyName: companyName,
			currencyCode: currencyCode ? currencyCode : '',
			companyTypeCode: companyTypeCode,
			industryTypeCode: industryTypeCode,
			firstName: firstName,
			lastName: lastName,
			email: email,
		
			countryId:countryId.value,
			stateId:stateId.value,
			IsDesignatedZone:IsDesignatedZone,
			IsRegisteredVat:IsRegistered,
			TaxRegistrationNumber:TaxRegistrationNumber,
			vatRegistrationDate:vatRegistrationDate,
		};
		let formData = new FormData();
		// for (var key in this.state.initValue) {
		// 	formData.append(key, data[key]);
		// }
		formData.append('companyName', companyName ? companyName : '')
		formData.append('currencyCode', currencyCode ? currencyCode :'')
		formData.append('firstName', firstName ? firstName :'')
		formData.append('lastName', lastName ? lastName :'')
		formData.append('email', email ? email : '')
		formData.append('timeZone', timeZone)
		formData.append('countryId', countryId ? countryId.value : '')
		formData.append('stateId', stateId ? stateId.value : '')
		if (IsDesignatedZone) {
			formData.append('IsDesignatedZone', IsDesignatedZone);
		}
		if (IsRegistered) {
			formData.append('IsRegisteredVat', IsRegistered);
		}
		if (TaxRegistrationNumber) {
			formData.append('TaxRegistrationNumber', TaxRegistrationNumber);
		}
		if (vatRegistrationDate) {
			formData.append('vatRegistrationDate', vatRegistrationDate);
		}
		
		
	
		formData.append('companyAddressLine1',companyAddress ? companyAddress : '')
		formData.append('companyAddressLine2',companyAddress ? companyAddress : '')

		formData.append('loginUrl', window.location.origin);
		this.props.authActions
			.register(formData)
			.then((res) => {
				this.setState({ loading: true });
				toast.success('Register Successfully please log in to continue', {
					position: toast.POSITION.TOP_RIGHT,
				});
			
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

	render() {
		const { isPasswordShown } = this.state;
		const customStyles = {
			control: (base, state) => ({
				...base,
				flex: '1 1 auto',
				borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
				boxShadow: state.isFocused ? null : null,
				'&:hover': {
					borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
				},
			}),
		};
	
		const { initValue, currencyList, userDetail, timezone } = this.state;
		const {universal_currency_list,country_list,state_list} = this.props;
		console.log(country_list)
		return (
			<div className="log-in-screen">
				<ToastContainer
				 autoClose={1700}
				closeOnClick
            	draggable
				/>
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
															style={{ width: '300px' }}
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
															companyAddress: Yup.string().required(
																'Company Address is required',
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
															timeZone: Yup.string().required(
																'Time Zone is Required',
															),
															TaxRegistrationNumber: Yup.string().when(
																'IsRegistered',
																{
																	is: (value) => value === true,
																	then: Yup.string().required(
																		'Tax Registration Number is Required',
																	),
																	otherwise: Yup.string(),
																},
															),							
															vatRegistrationDate: Yup.string().when(
																'IsRegistered',
																{
																	is: (value) => value === true,
																	then: Yup.string().required(
																		'Vat Registration Date is Required',
																	),
																	otherwise: Yup.string(),
																},
															)
																								
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
																	<div>
																	<h4 className="">Company Details</h4>
																	</div>
																	<Row className="mt-2">
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="companyName">
																					 
																					Company Name
																				</Label>
																				<Input
																					type="text"
																					maxLength="50"
																					id="companyName"
																					name="companyName"
																					placeholder="Enter Company Name"
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
																					 
																					Currency
																				</Label>
																				<Select
																					styles={customStyles}
																					id="currencyCode"
																					name="currencyCode"
																					options={
																						universal_currency_list
																							? selectCurrencyFactory.renderOptions(
																									'currencyName',
																									'currencyCode',
																									universal_currency_list,
																									'Currency',
																							  )
																							: []
																					}
																					value={
																						universal_currency_list &&
																						selectCurrencyFactory
																							.renderOptions(
																								'currencyName',
																								'currencyCode',
																								universal_currency_list,
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
																		
															
																		</Row>
																	<Row className="row-wrapper">
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="companyAddress">
																					 
																				Company Address Line1
																				</Label>
																				<Input
																					type="text"
																				 maxLength="150"
																					id="companyAddress"
																					name="companyAddress"
																					placeholder="Enter Company Address"
																					value={props.values.account_name}
																					onChange={(option) => {
																						props.handleChange('companyAddress')(
																							option,
																						);
																					}}
																					className={
																						props.errors.companyAddress &&
																						props.touched.companyAddress
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.companyAddress &&
																					props.touched.companyAddress && (
																						<div className="invalid-feedback">
																							{props.errors.companyAddress}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="companyAddress">
																					 
																				Company Address Line2
																				</Label>
																				<Input
																					type="text"
																				 maxLength="150"
																					id="companyAddress"
																					name="companyAddress"
																					placeholder="Enter Company Address"
																					value={props.values.account_name}
																					onChange={(option) => {
																						props.handleChange('companyAddress')(
																							option,
																						);
																					}}
																					className={
																						props.errors.companyAddress &&
																						props.touched.companyAddress
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.companyAddress &&
																					props.touched.companyAddress && (
																						<div className="invalid-feedback">
																							{props.errors.companyAddress}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																			</Row>
																		<Row className="row-wrapper">
															<Col lg={6}>
																<FormGroup>
																	<Label htmlFor="countryId"> Country</Label>
																	<Select
																		styles={customStyles}
																		options={
																			
																			country_list
																				? selectOptionsFactory.renderOptions(
																						'countryName',
																						'countryCode',
																						country_list,
																						'Country',
																				  )
																				: []
																		}
																		value={props.values.countryId}
																		onChange={(option) => {
																			 
																			if (option && option.value) {
																				props.handleChange('countryId')(option);
																				this.getStateList(option.value);
																			} else {
																				props.handleChange('countryId')('');
																				this.getStateList('');
																			}
																			props.handleChange('stateId')({
																				label: 'Select State',
																				value: '',
																			});
																		}}
																		// placeholder={strings.Select+strings.Country}
																		id="countryId"
																		name="countryId"
																		className={
																			props.errors.countryId &&
																			props.touched.countryId
																				? 'is-invalid'
																				: ''
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
															<Col lg={6}>
																<FormGroup>
																	<Label htmlFor="stateId"> {props.values.countryId.value === 229 ? "Emirates" : "State/Provinces"}</Label>
																	<Select
																		styles={customStyles}
																		options={
																			state_list
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						state_list,
																						'State',
																				  )
																				: []
																		}
																		value={props.values.stateId}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('stateId')(option);
																			} else {
																				props.handleChange('stateId')('');
																			}
																		}}
																		// placeholder={strings.Select+strings.StateRegion}
																		id="stateId"
																		name="stateId"
																		className={
																			props.errors.stateId &&
																			props.touched.stateId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.stateId &&
																		props.touched.stateId && (
																			<div className="invalid-feedback">
																				{props.errors.stateId}
																			</div>
																		)}
																</FormGroup>
															</Col>
													
															</Row>
															<Row style={{display:props.values.countryId.value === 229 ? '' : 'none'}}>
															<Col lg={6} >
																<FormGroup check inline className="mt-1">
																		<Label
																			className="form-check-label mt-3"
																			check
																			htmlFor="Zone"
																		>
																			<Input
																				type="checkbox"
																				id="IsDesignatedZone"
																				name="IsDesignatedZone"
																				checked={props.values.IsDesignatedZone}
																				onChange={(value) => {
																					if(value != null){
																					props.handleChange('IsDesignatedZone')(
																						value,
																					);
																					}else{
																						props.handleChange('IsDesignatedZone')(
																							'',
																						);
																					}
																				}}
																				className={
																					props.errors.IsDesignatedZone &&
																					props.touched.IsDesignatedZone
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			Company located in Designated Zone?
																			{props.errors.IsDesignatedZone &&
																				props.touched.IsDesignatedZone && (
																					<div className="invalid-feedback">
																						{props.errors.IsDesignatedZone}
																					</div>
																				)}
																		</Label>
																	</FormGroup>
																	</Col>
															</Row>
															<Row className="mb-4" style={{display:props.values.countryId.value === 229 ? '' : 'none'}}>
															<Col lg={6}>
																<FormGroup check inline className="mt-1">
																		<Label
																			className="form-check-label mt-3"
																			check
																			htmlFor="vat"
																		>
																			<Input
																				type="checkbox"
																				id="IsRegistered"
																				name="IsRegistered"
																				checked={props.values.IsRegistered}
																				value={true}
																				onChange={(value) => {
																					if(value != null){
																						props.handleChange('IsRegistered')(
																							value,
																						);
																					}else{
																						props.handleChange('IsRegistered')(
																							'',
																						);
																					}
																				
																				}}
																				className={
																					props.errors.IsRegistered &&
																					props.touched.IsRegistered
																						? 'is-invalid'
																						: ''
																				}
																			/>
																			Is Vat Registered?
																			{props.errors.IsRegistered &&
																				props.touched.IsRegistered && (
																					<div className="invalid-feedback">
																						{props.errors.IsRegistered}
																					</div>
																				)}
																		</Label>
																	</FormGroup>
																	</Col>
															</Row>
														<Row className="row-wrapper" style={{display:props.values.IsRegistered === true ? '': 'none'}}>
																<Col lg={6}>
																<FormGroup >
																	<Label htmlFor="TaxRegistrationNumber">								
																	Tax Registration Number
																	</Label>
																	<Input
																		type="text"
																		maxLength="15"
																		id="TaxRegistrationNumber"
																		name="TaxRegistrationNumber"
																		// placeholder={strings.Enter+strings.TaxRegistrationNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange(
																					'TaxRegistrationNumber',
																				)(option);
																			}
																		}}
																		value={props.values.TaxRegistrationNumber}
																		className={
																			props.errors.TaxRegistrationNumber &&
																			props.touched.TaxRegistrationNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.TaxRegistrationNumber &&
																		props.touched.TaxRegistrationNumber && (
																			<div className="invalid-feedback">
																				{props.errors.TaxRegistrationNumber}
																			</div>
																		)}
																			<div className="VerifyTRN">
																		<br/>
																		<b>	<a target="_blank" rel="noopener noreferrer"  href="https://eservices.tax.gov.ae/en-us/trn-verify" style={{ color: '#2266d8' }}  >Verify TRN</a></b>
																	</div>
																</FormGroup>
															</Col>
															<Col lg={6}>
																<FormGroup>
																	<Label htmlFor="date">
																	Vat Registered On
																	</Label>
																	<DatePicker
																		autoComplete="off"
																		id="vatRegistrationDate"
																		name="vatRegistrationDate"
																		maxDate={new Date()}
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd/MM/yyyy"
																		dropdownMode="select"
																		value={props.values.vatRegistrationDate}
																		selected={props.values.vatRegistrationDate}
																		onBlur={props.handleBlur('vatRegistrationDate')}
																		onChange={(value) => {
																			props.handleChange('vatRegistrationDate')(
																				value,
																			);
																		}}
																		className={`form-control ${
																			props.errors.vatRegistrationDate &&
																			props.touched.vatRegistrationDate
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																		{props.errors.vatRegistrationDate &&
																		props.touched.vatRegistrationDate && (
																			<div className="invalid-feedback">
																				{props.errors.vatRegistrationDate}
																			</div>
																		)}
																</FormGroup>
															</Col>
															</Row>
															<hr />
																<div>
																	<h4>User Details</h4>
																	</div>
														
																		<Row>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="firstName">
																					 
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
																		</Row>
																		<Row>
																		<Col lg={6}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="email">
																					 
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
																				<Label htmlFor="timeZone">
																					Time Zone Preference
																				</Label>
																				<Select
																					styles={customStyles}
																					id="timeZone"
																					name="timeZone"
																					options={timezone ? timezone : []}
																					value={props.values.timezone}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange('timeZone')(
																								option.value,
																							);
																						} else {
																							props.handleChange('timeZone')(
																								'',
																							);
																						}
																					}}
																					className={
																						props.errors.timeZone &&
																							props.touched.timeZone
																							? 'is-invalid'
																							: ''
																					}
																				/>
																				{props.errors.timeZone &&
																					props.touched.timeZone && (
																						<div className="invalid-feedback">
																							{props.errors.timeZone}
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
																				disabled={this.state.loading}
																				className="btn-square mr-3 mt-3 "
																				style={{ width: '200px' }}
																			>
																				<i className="fa fa-dot-circle-o"></i>{' '}
																				{this.state.loading
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
							)}
							{userDetail === true &&
								this.props.history.push('/login')}
						</Container>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
