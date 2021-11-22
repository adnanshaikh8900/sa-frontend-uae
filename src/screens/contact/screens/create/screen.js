import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';
import Select from 'react-select';
import { upperFirst } from 'lodash-es';
import { selectOptionsFactory, selectCurrencyFactory } from 'utils';

import './style.scss';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { CommonActions } from 'services/global';
import * as ContactActions from '../../actions';
import * as CreateContactActions from './actions';
import PhoneInput  from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

const mapStateToProps = (state) => {
	return {
		country_list: state.contact.country_list,
		state_list: state.contact.state_list,
		currency_list: state.contact.currency_list,
		contact_type_list: state.contact.contact_type_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		contactActions: bindActionCreators(ContactActions, dispatch),
		createContactActions: bindActionCreators(CreateContactActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		},
	}),
};

let strings = new LocalizedStrings(data);
class CreateContact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			initValue: {
				billingEmail: '',
				city: '',
				contactType: '',
				contractPoNumber: '',
				countryId: '',
				currencyCode: '',
				email: '',
				firstName: '',
				addressLine1: '',
				addressLine2: '',
				addressLine3: '',
				// language(Language, optional),
				lastName: '',
				middleName: '',
				mobileNumber: '',
				organization: '',
				poBoxNumber: '',
				postZipCode: '',
				stateId: '',
				telephone: '',
				vatRegistrationNumber: '',
				disabled: false,
			},
			createMore: false,
			checkmobileNumberParam:false,
			selectedStatus: true,
			isActive: true,

		};

		this.regEx = /^[0-9\d]+$/;
		// this.regEx = /[a-zA-Z0-9]+$/;
		this.regExTelephone = /^[0-9-]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s,'-/]+$/;
		
		this.formRef = React.createRef();
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		this.props.contactActions.getContactTypeList();
		this.props.contactActions.getCountryList();
		this.props.contactActions.getCurrencyList().then((response) => {
			this.setState({
				initValue: {
					...this.state.initValue,
					...{
						currencyCode: response.data
							? parseInt(response.data[0].currencyCode)
							: '',
					},
				},
			});
			// this.formRef.current.setFieldValue(
			// 	'currencyCode',
			// 	response.data[0].currencyCode,
			// 	true,
			// );
		});
	};

	getData = (data) => {
		let temp = {};
		for (let item in data) {
			if (typeof data[`${item}`] !== 'object') {
				temp[`${item}`] = data[`${item}`];
			} else {
				temp[`${item}`] = data[`${item}`].value;
			}
		}
		// isActive:this.state.isActive
		temp[`isActive`] = this.state.isActive;
		return temp;
	};

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const postData = this.getData(data);
		this.props.createContactActions
			.createContact(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ disabled: false });
					this.props.commonActions.tostifyAlert(
						'success',
						"Contact Created Successfully"
					);
					if (this.state.createMore) {
						resetForm(this.state.initValue);
						this.setState({ createMore: false });
					} else {
						this.props.history.push('/admin/master/contact');
					}
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Contact Created Unsuccessfully',
				);
			});
	};

	getStateList = (countryCode) => {
		this.props.contactActions.getStateList(countryCode);
	};

	render() {
		strings.setLanguage(this.state.language);
		const {
			currency_list,
			country_list,
			contact_type_list,
			state_list,
		} = this.props;
		const { initValue ,checkmobileNumberParam} = this.state;
		return (
			<div className="create-contact-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="nav-icon fas fa-id-card-alt" />
												<span className="ml-2">{strings.CreateContact}</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<Row>
										<Col lg={12}>
											<Formik
												initialValues={initValue}
												ref={this.formRef}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmit(values, resetForm);
												}}
												validate={(values) => {
													let errors = {};

													if (checkmobileNumberParam === true) {
													errors.mobileNumber =
													'Invalid mobile number';
													}
													
													if( values.stateId ===''){
														errors.stateId =
														'State is Required';
													}
													if( values.stateId.label && values.stateId.label ==='Select State'){
														errors.stateId =
														'State is Required';
													}
													
													// if (param === true) {
													// 	errors.discount =
													// 		'Discount amount Cannot be greater than Invoice Total Amount';
													// }
													return errors;
												}}
												validationSchema={Yup.object().shape({
													firstName: Yup.string().required(
														'First Name is Required',
													),
													lastName: Yup.string().required(
														'Last Name is Required',
													),
													// lastName: Yup.string().required(
													//   'Last Name is Required',
													// ),
													// middleName: Yup.string().required(
													//   'Middle Name is Required',
													// ),
													currencyCode: Yup.string().required(
														'Currency is Required',
													),
													contactType: Yup.string().required(
														'Contact Type is Required',
													),
													//       organization: Yup.string()
													//       .required("Organization Name is Required"),
													//     poBoxNumber: Yup.number()
													//       .required("PO Box Number is Required"),
													email: Yup.string()
														.required('Email is Required')
														.email('Invalid Email')
														,
													// telephone: Yup.number().required(
													//   'Telephone Number is Required',
													// ),
													mobileNumber: Yup.string()
														.required('Mobile Number is required')
													
														,
														billingEmail: Yup.string().email("Invalid Billing  Email "),
													//     addressLine1: Yup.string()
													//       .required("Address is required"),
													countryId: Yup.string()
													  .required('Country is Required')
													  .nullable(),
													stateId: Yup.string().when('countryId', {
													  is: (val) => (val ? true : false),
													  then: Yup.string().required('State is Required'),
													}),
													// postZipCode: Yup.string().required(
													//   'Postal Code is Required',
													// ),
													// addressLine1: Yup.string()
													//   .min(2, 'Must be at least 2 characters.')
													//   .matches(
													//     this.regExAddress,
													//     'May only contain hyphens, periods, commas or alphanumeric characters.',
													//   ),
													// addressLine2: Yup.string()
													//   .min(2, 'Must be at least 2 characters.')
													//   .matches(
													//     this.regExAddress,
													//     'May only contain hyphens, periods, commas or alphanumeric characters.',
													//   ),
													// addressLine3: Yup.string()
													//   .min(2, 'Must be at least 2 characters.')
													//   .matches(
													//     this.regExAddress,
													//     'May only contain hyphens, periods, commas or alphanumeric characters.',
													//   ),
													//     billingEmail: Yup.string()
													//       .required("Billing Email is Required")
													//       .email('Invalid Email'),
													//     contractPoNumber: Yup.number()
													//       .required("Contract PoNumber is Required"),
													// vatRegistrationNumber: Yup.string().required(
													//   'Tax Registration Number is Required',
													// ),
													//       currencyCode: Yup.string()
													//       .required("Please Select Currency")
													//       .nullable(),
												})}
											>
												{(props) => (
													<Form onSubmit={props.handleSubmit}>
														<h4 className="mb-4">{strings.ContactName}</h4>
														<Row>
																	<Col >
																		<FormGroup className="mb-3">
																			<Label htmlFor="active"><span className="text-danger">*</span>{strings.Status}</Label>
																			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																				<FormGroup check inline>
																					<div className="custom-radio custom-control">
																						<input
																							className="custom-control-input"
																							type="radio"
																							id="inline-radio1"
																							name="active"
																							checked={
																								this.state.selectedStatus
																							}
																							value={true}
																							onChange={(e) => {
																								if (
																									e.target.value === 'true'
																								) {
																									this.setState({
																										selectedStatus: true,
																										isActive: true
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio1"
																						>
																							{strings.Active}
																							</label>
																					</div>
																				</FormGroup>
																				<FormGroup check inline>
																					<div className="custom-radio custom-control">
																						<input
																							className="custom-control-input"
																							type="radio"
																							id="inline-radio2"
																							name="active"
																							value={false}
																							checked={
																								!this.state.selectedStatus
																							}
																							onChange={(e) => {
																								if (
																									e.target.value === 'false'
																								) {
																									this.setState({
																										selectedStatus: false,
																										isActive: false
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio2"
																						>
																							{strings.Inactive}
																							</label>
																					</div>
																				</FormGroup>
																			
																		</FormGroup>
																	</Col></Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="select">
																		<span className="text-danger">*</span>{strings.FirstName}
																	</Label>
																	<Input
																		type="text"
																		maxLength="26"
																		id="firstName"
																		name="firstName"
																		placeholder={strings.Enter+strings.FirstName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				
																			let option1=	upperFirst(option.target.value)
																				props.handleChange('firstName')(option1);
																			}
																		}}
																		value={props.values.firstName}
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
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="middleName ">
																	{strings.MiddleName}
																	</Label>
																	<Input
																		type="text"
																		maxLength="26"
																		id="middleName "
																		name="middleName "
																		placeholder={strings.Enter+strings.MiddleName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('middleName')(
																					option1,
																				);
																			}
																		}}
																		value={props.values.middleName}
																		className={
																			props.errors.middleName &&
																			props.touched.middleName
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.middleName &&
																		props.touched.middleName && (
																			<div className="invalid-feedback">
																				{props.errors.middleName}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="lastName"><span className="text-danger">*</span>{strings.LastName}</Label>
																	<Input
																		type="text"
																		maxLength="26"
																		id="lastName"
																		name="lastName"
																		placeholder={strings.Enter+strings.LastName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('lastName')(option1);
																			}
																		}}
																		value={props.values.lastName}
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
														<hr />
														<h4 className="mb-3 mt-3">{strings.ContactDetails}</h4>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="countryId">
																		<span className="text-danger">*</span>
																		{strings.ContactType}
																	</Label>
																	<Select
																		styles={customStyles}
																		options={
																			contact_type_list
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						contact_type_list,
																						'Contact Type',
																				  )
																				: []
																		}
																		value={props.values.contactType}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('contactType')(
																					option,
																				);
																			} else {
																				props.handleChange('contactType')('');
																			}
																		}}
																		placeholder={strings.Select+strings.ContactType}
																		id="contactType"
																		name="contactType"
																		className={
																			props.errors.contactType &&
																			props.touched.contactType
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.contactType &&
																		props.touched.contactType && (
																			<div className="invalid-feedback">
																				{props.errors.contactType}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="organization ">
																	{strings.OrganizationName}
																	</Label>
																	<Input
																		type="text"
																		maxLength="50"
																		id="organization"
																		name="organization"
																		placeholder={strings.Enter+strings.OrganizationName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('organization')(
																					option1,
																				);
																			}
																		}}
																		value={props.values.organization}
																		className={
																			props.errors.organization &&
																			props.touched.organization
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.organization &&
																		props.touched.organization && (
																			<div className="invalid-feedback">
																				{props.errors.organization}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="select">{strings.POBoxNumber}</Label>
																	<Input
																		type="text"
																		maxLength="8"
																		id="poBoxNumber"
																		name="poBoxNumber"
																		placeholder={strings.Enter+strings.POBoxNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExBoth.test(option.target.value)
																			) {
																				props.handleChange('poBoxNumber')(
																					option,
																				);
																			}
																		}}
																		value={props.values.poBoxNumber}
																		className={
																			props.errors.poBoxNumber &&
																			props.touched.poBoxNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.poBoxNumber &&
																		props.touched.poBoxNumber && (
																			<div className="invalid-feedback">
																				{props.errors.poBoxNumber}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="email">
																		<span className="text-danger">*</span>{strings.Email}
																	</Label>
																	<Input
																		type="text"
																		maxLength="80"
																		id="email"
																		name="email"
																		placeholder={strings.Enter+strings.EmailAddress}
																		onChange={(option) => {
																				props.handleChange('email')(option);
																		}}
																		value={props.values.email}
																		className={
																			props.errors.email && props.touched.email
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
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="telephone">{strings.Telephone}</Label>
																	<Input
																		maxLength="15"
																		type="text"
																		id="telephone"
																		name="telephone"
																		placeholder={strings.Enter+strings.TelephoneNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExTelephone.test(option.target.value)
																			) {
																				props.handleChange('telephone')(option);
																			}
																		}}
																		value={props.values.telephone}
																		className={
																			props.errors.telephone &&
																			props.touched.telephone
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.telephone &&
																		props.touched.telephone && (
																			<div className="invalid-feedback">
																				{props.errors.telephone}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="mobileNumber">
																		<span className="text-danger">*</span>
																	{strings.MobileNumber}
																	</Label>
																	<PhoneInput
																		enableSearch={true}
																		id="mobileNumber"
																		name="mobileNumber"
																		country={"ae"}
																		value={props.values.mobileNumber}
																		placeholder={strings.Enter+strings.MobileNumber}
																		onBlur={props.handleBlur('mobileNumber')}
																		onChange={(option) => {
																			props.handleChange('mobileNumber')(
																				option,
																			);
																			
																			option.length!==12 ?  this.setState({checkmobileNumberParam:true}) :this.setState({checkmobileNumberParam:false});
																		}}
																		isValid
																		// className={
																		// 	props.errors.mobileNumber &&
																		// 	props.touched.mobileNumber
																		// 		? 'is-invalid'
																		// 		: ''
																		// }
																	/>
																		{props.errors.mobileNumber &&
																		props.touched.mobileNumber && (
																			<div style={{color:"red"}}>
																				{props.errors.mobileNumber}
																			</div>
																		)}
																</FormGroup>
															</Col>

														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="addressLine1">
																	{strings.AddressLine1}
																	</Label>
																	<Input
																		type="text"
																		maxLength="100"
																		id="addressLine1"
																		name="addressLine1"
																		placeholder={strings.Enter+strings.AddressLine1}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('addressLine1')(
																					option1,
																				);
																			}
																		}}
																		value={props.values.addressLine1}
																		className={
																			props.errors.addressLine1 &&
																			props.touched.addressLine1
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.addressLine1 &&
																		props.touched.addressLine1 && (
																			<div className="invalid-feedback">
																				{props.errors.addressLine1}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="addressLine2">
																	{strings.AddressLine2}
																	</Label>
																	<Input
																		type="text"
																		maxLength="100"
																		id="addressLine2"
																		name="addressLine2"
																		placeholder={strings.Enter+strings.AddressLine2}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('addressLine2')(
																					option1,
																				);
																			}
																		}}
																		value={props.values.addressLine2}
																	/>
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="addressLine3">
																	{strings.AddressLine3}
																	</Label>
																	<Input
																		type="text"
																		maxLength="100"
																		id="addressLine3"
																		name="addressLine3"
																		placeholder={strings.Enter+strings.AddressLine3}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('addressLine3')(
																					option1,
																				);
																			}
																		}}
																		value={props.values.addressLine3}
																	/>
																</FormGroup>
															</Col>
														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="countryId"><span className="text-danger">*</span>{strings.Country}</Label>
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
																		placeholder={strings.Select+strings.Country}
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
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="stateId"><span className="text-danger">*</span>{strings.StateRegion}</Label>
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
																		placeholder={strings.Select+strings.StateRegion}
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
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="city">{strings.City}</Label>
																	<Input
																		// options={city ? selectOptionsFactory.renderOptions('cityName', 'cityCode', cityRegion) : ''}
																		value={props.values.city}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				let option1=	upperFirst(option.target.value)
																				props.handleChange('city')(option1);
																			}
																		}}
																		placeholder={strings.Enter+strings.City}
																		id="city"
																		name="city"
																		type="text"
																		maxLength="20"
																		className={
																			props.errors.city && props.touched.city
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.city && props.touched.city && (
																		<div className="invalid-feedback">
																			{props.errors.city}
																		</div>
																	)}
																</FormGroup>
															</Col>
														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="postZipCode">
																	{strings.PostZipCode}
																	</Label>
																	<Input
																		type="text"
																		maxLength="8"
																		id="postZipCode"
																		name="postZipCode"
																		placeholder={strings.Enter+strings.PostZipCode}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExBoth.test(option.target.value)
																			) {
																				props.handleChange('postZipCode')(
																					option,
																				);
																			}
																		}}
																		value={props.values.postZipCode}
																		className={
																			props.errors.postZipCode &&
																			props.touched.postZipCode
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.postZipCode &&
																		props.touched.postZipCode && (
																			<div className="invalid-feedback">
																				{props.errors.postZipCode}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>

														<hr />
														<h4 className="mb-3 mt-3">{strings.InvoicingDetails} </h4>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="billingEmail">
																	{strings.BillingEmail}
																	</Label>
																	<Input
																		type="text"
																		maxLength="80"
																		id="billingEmail"
																		name="billingEmail"
																		placeholder={strings.Enter+strings.BillingEmail+" "+strings.Address}
																		onChange={(value) => {
																			props.handleChange('billingEmail')(value);
																		}}
																		value={props.values.billingEmail}
																		className={
																			props.errors.billingEmail &&
																			props.touched.billingEmail
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.billingEmail &&
																		props.touched.billingEmail && (
																			<div className="invalid-feedback">
																				{props.errors.billingEmail}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="contractPoNumber">
																	{strings.ContractPONumber}
																	</Label>
																	<Input
																		type="text"
																		maxLength="8"
																		id="contractPoNumber"
																		name="contractPoNumber"
																		placeholder={strings.Enter+strings.ContractPONumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExBoth.test(option.target.value)
																			) {
																				props.handleChange('contractPoNumber')(
																					option,
																				);
																			}
																		}}
																		value={props.values.contractPoNumber}
																		className={
																			props.errors.contractPoNumber &&
																			props.touched.contractPoNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.contractPoNumber &&
																		props.touched.contractPoNumber && (
																			<div className="invalid-feedback">
																				{props.errors.contractPoNumber}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="vatRegistrationNumber">								
																		{strings.TaxRegistrationNumber}
																	</Label>
																	<Input
																		type="text"
																		maxLength="15"
																		id="vatRegistrationNumber"
																		name="vatRegistrationNumber"
																		placeholder={strings.Enter+strings.TaxRegistrationNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange(
																					'vatRegistrationNumber',
																				)(option);
																			}
																		}}
																		value={props.values.vatRegistrationNumber}
																		className={
																			props.errors.vatRegistrationNumber &&
																			props.touched.vatRegistrationNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.vatRegistrationNumber &&
																		props.touched.vatRegistrationNumber && (
																			<div className="invalid-feedback">
																				{props.errors.vatRegistrationNumber}
																			</div>
																		)}
																			<div className="VerifyTRN">
																		<br/>
																		<b>	<a target="_blank" rel="noopener noreferrer"  href="https://eservices.tax.gov.ae/en-us/trn-verify" style={{ color: '#2266d8' }}  >{strings.VerifyTRN}</a></b>
														</div>
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="currencyCode">
																		<span className="text-danger">*</span>
																		{strings.Currency}
																	</Label>
																	<Select
																		styles={customStyles}
																		options={
																			currency_list
																				? selectCurrencyFactory.renderOptions(
																						'currencyName',
																						'currencyCode',
																						currency_list,
																						'Currency',
																				  )
																				: []
																		}
																		value={
																			currency_list &&
																			selectCurrencyFactory
																				.renderOptions(
																					'currencyName',
																					'currencyCode',
																					currency_list,
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
																				props.handleChange('currencyCode')(
																					option,
																				);
																			} else {
																				props.handleChange('currencyCode')('');
																			}
																		}}
																		placeholder={strings.Select+strings.Currency}
																		id="currencyCode"
																		name="currencyCode"
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
														<Row>
															<Col lg={12} className="mt-5">
																<FormGroup className="text-right">
																	<Button
																		type="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
																			this.setState(
																				{ createMore: false },
																				() => {
																					props.handleSubmit();
																				},
																			);
																		}}
																	>
																		<i className="fa fa-dot-circle-o"></i>	{this.state.disabled
																			? 'Creating...'
																			: strings.Create }
																	</Button>
																	<Button
																		name="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
																			this.setState(
																				{ createMore: true },
																				() => {
																					props.handleSubmit();
																				},
																			);
																		}}
																	>
																		<i className="fa fa-refresh"></i> 	{this.state.disabled
																			? 'Creating...'
																			: strings.CreateandMore }
																	</Button>
																	<Button
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push(
																				'/admin/master/contact',
																			);
																		}}
																	>
																		<i className="fa fa-ban mr-1"></i>{strings.Cancel}
																	</Button>
																</FormGroup>
															</Col>
														</Row>
													</Form>
												)}
											</Formik>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateContact);
