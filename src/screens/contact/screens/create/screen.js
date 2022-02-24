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
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { CommonActions } from 'services/global';
import * as ContactActions from '../../actions';
import * as CreateContactActions from './actions';
import PhoneInput from "react-phone-input-2";
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
				
				countryId: '',
				currencyCode:{label: "UAE Dirham - AED", value: 150},
				email: '',
				firstName: '',
				shippingAddress: '',
				billingAddress: '',
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
				billingFax: '',
				billingStateProvince: '',
				billingcountryId: '',
                billingCity:'',
				billingPostZipCode:'',
				billingPhoneNumber:'',
				
                shippingCountryId:'',
				shippingStateId:'',
				shippingTelephone:'',
				shippingPostZipCode:'',
				shippingCity:'',
				shippingFax:'',
				taxTreatmentId:'',


			},
			state_list_for_shipping:[],
			createMore: false,
			checkmobileNumberParam: false,
			selectedStatus: true,
			isActive: true,
			isRegisteredForVat: false,
			isSame: false,
			// billingAddress: {
			// 	billingcountryId: '',
			// 	billingStateProvince: '',
			// 	billingCity: '',
			// 	billingAddress: '',
			// 	billingPostZipCode: '',
			// 	billingPhoneNumber: '',
			// 	billingFax: '',
			// },


		};

		this.regEx = /^[0-9\d]+$/;
		// this.regEx = /[a-zA-Z0-9]+$/;
		this.regExTelephone = /^[0-9-]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s\D,'-/]+$/;

		this.formRef = React.createRef();
	}

	componentDidMount = () => {
		this.initializeData();
		this.props.createContactActions
			.getTaxTreatment()
			.then((res) => {

				if (res.status === 200) {
					let array=[]
					res.data.map((row)=>{
						if(row.id!==8)
							array.push(row);
					})
					this.setState({ taxTreatmentList: array });
				}
			})
			.catch((err) => {

				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'ERROR',
				);
			});
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
		const { isSame } = this.state;
		for (let item in data) {
			if (typeof data[`${item}`] !== 'object') {
				temp[`${item}`] = data[`${item}`];
			} else {
				temp[`${item}`] = data[`${item}`].value;
			}
		}
		// isActive:this.state.isActive
		
		temp[`isActive`] = this.state.isActive;
	
		temp[`isBillingAndShippingAddressSame`] =isSame;

		temp[`addressLine1`] =data[`billingAddress`];
		temp[`countryId`] = data[`billingcountryId`].value;
		temp[`stateId`] = data[`billingStateProvince`].value;
		temp[`postZipCode`] =data[`billingPostZipCode`];
		temp[`city`] =data[`billingCity`];
		temp[`fax`] = data[`billingFax`];
		temp[`billingTelephone`] = data[`billingPhoneNumber`];
		

		temp[`addressLine2`] = data[`shippingAddress`];
		// temp[`shippingCountryId`] = isSame ? this.state.billingAddress.billingcountryId :  data[`shippingCountryId`].value;
		// temp[`shippingStateId`] = isSame ? this.state.billingAddress.billingStateProvince :  data[`shippingStateId`].value;
		// temp[`shippingPostZipCode`] = isSame ? this.state.billingAddress.billingPostZipCode :  data[`shippingPostZipCode`];
		// temp[`shippingCity`] =isSame ? this.state.billingAddress.billingCity :  data[`shippingCity`];
		// temp[`shippingFax`] = isSame ? this.state.billingAddress.billingFax :  data[`shippingFax`];
		

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
					// this.gotoParentUrl() this.props.history.push(this.props.location.state.goto)
					if (this.state.createMore) {
						resetForm(this.state.initValue);
						this.setState({ createMore: false });
					} else {
						
						if(this.props.location
							&& this.props.location.state
							&& this.props.location.state.gotoParentURL
						)
						    this.props.history.push(this.props.location.state.gotoParentURL)
						else
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
	getStateListForShippingAddress = (countryCode) => {
		this.props.contactActions.getStateListForShippingAddress(countryCode)
		.then((res)=>{
						this.setState({state_list_for_shipping:res})
		});
	};
	render() {
		strings.setLanguage(this.state.language);
		const {
			currency_list,
			country_list,
			contact_type_list,
			state_list,
		} = this.props;
		const { initValue, checkmobileNumberParam, taxTreatmentList, isSame ,state_list_for_shipping} = this.state;
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

													if (values.stateId === '') {
														errors.stateId ='State is Required';
													}
													// if (values.stateId.label && values.stateId.label === 'Select State') {
													// 	errors.stateId ='State is Required';
													// }

													if (this.state.isRegisteredForVat==true){
														if(values.vatRegistrationNumber=="")
														errors.vatRegistrationNumber =	'Tax Registration Number is Required';
													
														if(values.vatRegistrationNumber.length!=15){
															errors.vatRegistrationNumber="Please enter 15 digit Tax Registration Number"
														}}
												
													// if (param === true) {
													// 	errors.discount =
													// 		'Discount amount Cannot be greater than Invoice Total Amount';
													// }
													if(values.billingPostZipCode.length!=6){
														errors.billingPostZipCode="Please Enter 6 Digit Postal Zip Code"
													}

													if(values.shippingPostZipCode.length!=6){
														errors.shippingPostZipCode="Please Enter 6 Digit Postal Zip Code"
													}

													if(this.state.showbillingFaxErrorMsg==true)
													errors.billingFax="Please Enter 8 Digit Fax"

													
													if(this.state.showshippingFaxErrorMsg==true)
													errors.shippingFax="Please Enter 8 Digit Fax"

													if(this.state.showpoBoxNumberErrorMsg==true)
													errors.poBoxNumber="Please Enter 6 Digit PO Box Number"


													return errors;
													
												}}
												validationSchema={Yup.object().shape({
													firstName: Yup.string().required(
														'First Name is Required',
													),
													lastName: Yup.string().required(
														'Last Name is Required',
													),
													// vatRegistrationNumber: Yup.string().required(
													// 	'Tax Registration Number is Required',
													// ),
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
													taxTreatmentId: Yup.string().required(
														'Tax Treatment is Required',
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
														.required('Mobile Number is Required')

													,
													// billingEmail: Yup.string().email("Invalid Billing  Email "),
													//     addressLine1: Yup.string()
													//       .required("Address is required"),
													// countryId: Yup.string()
													// 	.required('Country is Required')
													// 	.nullable(),
													// stateId: Yup.string().when('countryId', {
													// 	is: (val) => (val ? true : false),
													// 	then: Yup.string().required('State is Required'),
													// }),
													shippingAddress: Yup.string().required(
														'Shipping Address is Required',
													),
													billingAddress: Yup.string().required(
														'Billing Address is Required',
													),
													// postZipCode: Yup.string().required(
													// 	'Postal Code is Required',
													// ),
													billingcountryId: Yup.string().required(
														'Country is Required',
													),
													billingStateProvince: Yup.string().required(
														'State is Required',
													),
													billingCity: Yup.string().required(
														'City is Required',
													),
													
													billingPostZipCode: Yup.string().required(
														'Postal Code is Required',
													),
													shippingCountryId: Yup.string().required(
														'Country is Required',
													),
													shippingStateId: Yup.string().required(
														'State is Required',
													),
													shippingPostZipCode: Yup.string().required(
														'Postal Code is Required',
													),
													shippingCity: Yup.string().required(
														'City is Required',
													),

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
														<Row>
															<Col >
																<FormGroup className="mb-3">
																	<Label htmlFor="active"><span className="text-danger">* </span>{strings.Status}</Label>
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
															</Col>
														</Row>
														<h4 className="mb-4">{strings.ContactName}</h4>


														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="select">
																		<span className="text-danger">* </span>{strings.FirstName}
																	</Label>
																	<Input
																		type="text"
																		maxLength="100"
																		id="firstName"
																		name="firstName"
																		placeholder={strings.Enter + strings.FirstName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {

																				let option1 = upperFirst(option.target.value)
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
																		maxLength="100"
																		id="middleName "
																		name="middleName "
																		placeholder={strings.Enter + strings.MiddleName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																			option = upperFirst(option.target.value)
																				props.handleChange('middleName')(
																					option,
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
																	<Label htmlFor="lastName"><span className="text-danger">* </span>{strings.LastName}</Label>
																	<Input
																		type="text"
																		maxLength="100"
																		id="lastName"
																		name="lastName"
																		placeholder={strings.Enter + strings.LastName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				option = upperFirst(option.target.value)
																				props.handleChange('lastName')(option);
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
														<h4 className="mb-4">{strings.ContactDetails}</h4>

														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="contactType">
																		<span className="text-danger">* </span>
																		{strings.ContactType}
																	</Label>
																	<Select
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
																		placeholder={strings.Select + strings.ContactType}
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
																		maxLength="100"
																		id="organization"
																		name="organization"
																		placeholder={strings.Enter + strings.OrganizationName}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				option = upperFirst(option.target.value)
																				props.handleChange('organization')(
																					option,
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
																	<Label htmlFor="email">
																		<span className="text-danger">* </span>{strings.Email}
																	</Label>
																	<Input
																		type="text"
																		maxLength="80"
																		id="email"
																		name="email"
																		placeholder={strings.Enter + strings.EmailAddress}
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


														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="currencyCode">
																		<span className="text-danger">* </span>
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
																						+props.values.currencyCode.value,
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
																		placeholder={strings.Select + strings.Currency}
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
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="telephone">{strings.Telephone}</Label>
																	<Input
																		maxLength="15"
																		type="text"
																		id="telephone"
																		name="telephone"
																		placeholder={strings.Enter + strings.TelephoneNumber}
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
																		<span className="text-danger">* </span>
																		{strings.MobileNumber}
																	</Label>
																	<div 	className={
																		props.errors.mobileNumber &&
																		props.touched.mobileNumber
																			? ' is-invalidMobile '
																			: ''
																	}>
																	<PhoneInput
																		enableSearch={true}
																		id="mobileNumber"
																		name="mobileNumber"
																		country={"ae"}
																		value={props.values.mobileNumber}
																		placeholder={strings.Enter + strings.MobileNumber}
																		onBlur={props.handleBlur('mobileNumber')}
																		onChange={(option) => {
																			props.handleChange('mobileNumber')(
																				option,
																			);

																			option.length !== 12 ? this.setState({ checkmobileNumberParam: true }) : this.setState({ checkmobileNumberParam: false });
																		}}
																		isValid
																	// className={
																	// 	props.errors.mobileNumber &&
																	// 	props.touched.mobileNumber
																	// 		? 'is-invalid'
																	// 		: ''
																	// }
																	/></div>
																	{props.errors.mobileNumber &&
																		props.touched.mobileNumber && (
																			<div  className="invalid-feedback">
																				{props.errors.mobileNumber}
																			</div>
																		)}
																</FormGroup>
															</Col>

															<Col md="4">
																<FormGroup>
																	<Label htmlFor="select">{strings.POBoxNumber}</Label>
																	<Input
																		type="text"
																		minLength="6"
																		maxLength="6"
																		id="poBoxNumber"
																		name="poBoxNumber"
																		placeholder={strings.Enter + strings.POBoxNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				if(option.target.value.length !=6 && option.target.value !="")
																				this.setState({showpoBoxNumberErrorMsg:true})
																				else
																				this.setState({showpoBoxNumberErrorMsg:false})
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


															<Col md="4">
																<FormGroup>
																	<Label htmlFor="select">
																		{strings.Website}
																	</Label>
																	<Input
																		type="text"
																		id="website"
																		name="website"
																		maxLength="100"
																		placeholder={strings.Enter + strings.Website}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				props.handleChange('website')(
																					option,
																				);
																			}
																		}}
																		value={props.values.website}
																		className={
																			props.errors.website &&
																				props.touched.website
																				? 'is-invalid'
																				: ''
																		}
																	/>
																
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="taxTreatmentId">
																		<span className="text-danger">* </span>{strings.TaxTreatment}
																	</Label>
																	<Select
																		options={
																			taxTreatmentList
																				? selectOptionsFactory.renderOptions(
																					'name',
																					'id',
																					taxTreatmentList,
																					'Vat',
																				)
																				: []
																		}
																		id="taxTreatmentId"
																		name="taxTreatmentId"
																		placeholder={strings.Select + strings.TaxTreatment}
																		value={props.values.taxTreatmentId}
																		onChange={(option) => {
																			// this.setState({
																			//   selectedVatCategory: option.value
																			// })
																			if (option && option.value) {

																				props.handleChange('taxTreatmentId')(
																					option,
																				);
																				if(option.value === 1 ||option.value === 3 ||option.value === 5 )
																				this.setState({isRegisteredForVat:true})
																				else
																				this.setState({isRegisteredForVat:false})
																			} else {
																				props.handleChange('taxTreatmentId')(
																					'',
																				);
																			}
																		}}
																		className={
																			props.errors.taxTreatmentId &&
																				props.touched.taxTreatmentId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.taxTreatmentId &&
																		props.touched.taxTreatmentId && (
																			<div className="invalid-feedback">
																				{props.errors.taxTreatmentId}
																			</div>
																		)}
																</FormGroup>
															</Col>
															{props.values.taxTreatmentId && props.values.taxTreatmentId.value && (<Col md="4" style={{ display: props.values.taxTreatmentId.value === 1 || props.values.taxTreatmentId.value === 3 || props.values.taxTreatmentId.value === 5 ? '' : 'none' }}>
																<FormGroup>
																	<Label htmlFor="vatRegistrationNumber"><span className="text-danger">* </span>
																		{strings.TaxRegistrationNumber}
																	</Label>
																	<Input
																		type="text"
																		minLength="15"
																		maxLength="15"
																		id="vatRegistrationNumber"
																		name="vatRegistrationNumber"
																		placeholder={strings.Enter + strings.TaxRegistrationNumber}
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
																		<br />
																		<b>	<a target="_blank" rel="noopener noreferrer" href="https://eservices.tax.gov.ae/en-us/trn-verify" style={{ color: '#2266d8' }}  >{strings.VerifyTRN}</a></b>
																	</div>
																</FormGroup>
															</Col>)}
														</Row>
														<hr />
														<h2 className="mb-3 mt-3">{strings.ContactAddressDetails}</h2>
														<h5 className="mb-3 mt-3">{strings.BillingDetails}</h5>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="billingAddress"><span className="text-danger">* </span>
																		{strings.BillingAddress}
																	</Label>
																	<Input
																		type="text"
																		maxLength="100"
																		id="billingAddress"
																		name="billingAddress"
																		placeholder={strings.Enter + strings.BillingAddress}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			){
																				props.handleChange('billingAddress')(option.target.value);																			
																			}
																		}}
																		value={props.values.billingAddress}
																		className={
																			props.errors.billingAddress &&
																				props.touched.billingAddress
																				? 'is-invalid'
																				: ''
																		}
																	/>
																		{props.errors.billingAddress &&
																		props.touched.billingAddress && (
																			<div className="invalid-feedback">
																				{props.errors.billingAddress}
																			</div>
																		)}
																</FormGroup>
															
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="billingcountryId"><span className="text-danger">* </span>{strings.Country}</Label>
																	<Select
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
																		value={props.values.billingcountryId}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('billingcountryId')(option);
																				this.getStateList(option.value);
																			
																			} else {
																				props.handleChange('billingcountryId')('');
																				this.getStateList('');							
																			}
																			props.handleChange('stateId')({
																				label: 'Select State',
																				value: '',
																			});
																		}}
																		placeholder={strings.Select + strings.Country}
																		id="billingcountryId"
																		name="billingcountryId"
																		className={
																			props.errors.billingcountryId &&
																				props.touched.billingcountryId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.billingcountryId &&
																		props.touched.billingcountryId && (
																			<div className="invalid-feedback">
																				{props.errors.billingcountryId}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="stateId"><span className="text-danger">* </span>
																		{/* {strings.StateRegion} */}
																		{props.values.billingcountryId.value === 229 ? "Emirates" : "State / Provinces"}
																	</Label>
																	<Select
																		options={
																			state_list
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					state_list,
																					props.values.billingcountryId.value === 229 ? "Emirates" : "State / Provinces",
																				)
																				: []
																		}
																		value={props.values.billingStateProvince}
																		
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('billingStateProvince')(option);																	
																			} else {
																				props.handleChange('stateId')('');
																			}
																		}}
																		placeholder={strings.Select + props.values.billingcountryId === 229 || props.values.billingcountryId.value === 229 ? "Emirates" : "State / Provinces"}
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
																	<Label htmlFor="billingEmail">
																		{strings.BillingEmail}
																	</Label>
																	<Input
																		type="text"
																		maxLength="80"
																		id="billingEmail"
																		name="billingEmail"
																		placeholder={strings.Enter + strings.BillingEmail + " " + strings.Address}
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
																	<Label htmlFor="city"><span className="text-danger">* </span>{strings.City}</Label>
																	<Input
																		id="billingCity"
																		name="billingCity"
																		type="text"
																		maxLength="100"
																		value={props.values.billingCity}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				option = upperFirst(option.target.value)
																				props.handleChange('billingCity')(option);
																	
																			}
																			
																		}}
																		placeholder={strings.Enter + strings.City}
																		className={
																			props.errors.billingCity && props.touched.billingCity
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.billingCity &&
																	 props.touched.billingCity && (
																		<div className="invalid-feedback">
																			{props.errors.billingCity}
																		</div>
																	)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="postZipCode"><span className="text-danger">* </span>
																		{strings.PostZipCode}
																	</Label>
																	<Input
																		type="text"
																		maxLength="6"
																		id="billingPostZipCode"
																		name="billingPostZipCode"
																		placeholder={strings.Enter + strings.PostZipCode}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('billingPostZipCode')(
																					option,
																				);
																			}
																
																		}}
																		value={props.values.billingPostZipCode}
																		className={
																			props.errors.billingPostZipCode &&
																				props.touched.billingPostZipCode
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.billingPostZipCode &&
																		props.touched.billingPostZipCode && (
																			<div className="invalid-feedback">
																				{props.errors.billingPostZipCode}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="billingPhoneNumber">{strings.Telephone}</Label>
																	<Input
																		maxLength="15"
																		type="text"
																		id="billingPhoneNumber"
																		name="billingPhoneNumber"
																		placeholder={strings.Enter + strings.TelephoneNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExTelephone.test(option.target.value)
																			) {
																				props.handleChange('billingPhoneNumber')(option);
																			}
																		}}
																		value={props.values.billingPhoneNumber}
																		className={
																			props.errors.billingPhoneNumber &&
																				props.touched.billingPhoneNumber
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.billingPhoneNumber &&
																		props.touched.billingPhoneNumber && (
																			<div className="invalid-feedback">
																				{props.errors.billingPhoneNumber}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="billingFax">
																		{strings.Fax}
																	</Label>
																	<Input
																		type="text"
																		maxLength="8"
																		id="billingFax"
																		name="billingFax"
																		placeholder={strings.Enter + strings.Fax}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				if(option.target.value.length !=8 && option.target.value !="")
																				this.setState({showbillingFaxErrorMsg:true})
																				else
																				this.setState({showbillingFaxErrorMsg:false})
																				props.handleChange('billingFax')(
																					option,
																				);
																			}
																	

																		}}
																		value={props.values.billingFax}
																		className={
																			props.errors.billingFax &&
																				props.touched.billingFax
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.billingFax &&
																		props.touched.billingFax && (
																			<div className="invalid-feedback">
																				{props.errors.billingFax}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>

														<hr />
														<h5 className="mb-3 mt-3">{strings.ShippingDetails}</h5>

														<Row>
															<Col lg={12}>
																<FormGroup check inline className="mb-3">
																	<div>
																		<Input
																			// className="custom-control-input"
																			onChange={(option) => {

																			
																				if (this.state.isSame==false) {
																					this.setState({isSame: !this.state.isSame,});
																					this.getStateListForShippingAddress(props.values.billingcountryId.value ?props.values.billingcountryId.value :props.values.billingcountryId);
																					props.handleChange('shippingAddress')(props.values.billingAddress);
																					props.handleChange('shippingCity')(props.values.billingCity);
																					props.handleChange('shippingCountryId')(props.values.billingcountryId);
																					props.handleChange('shippingStateId')(props.values.billingStateProvince);
																					props.handleChange('shippingTelephone')(props.values.billingPhoneNumber);
																					props.handleChange('shippingPostZipCode')(props.values.billingPostZipCode);
																					props.handleChange('shippingFax')(props.values.billingFax);
																					if(props.values.billingFax.length !=8 && props.values.billingFax !="")
																				this.setState({showshippingFaxErrorMsg:true})
																				else
																				this.setState({showshippingFaxErrorMsg:false})
																				} else {
																					this.setState({isSame: !this.state.isSame,});

																					props.handleChange('shippingAddress')("");
																					props.handleChange('shippingCity')("");
																					props.handleChange('shippingCountryId')("");
																					props.handleChange('shippingStateId')("");
																					props.handleChange('shippingTelephone')("");
																					props.handleChange('shippingPostZipCode')("");
																					props.handleChange('shippingFax')("");
																				}
																			}}
																			type="checkbox"
																			id="inline-radio1"
																			name="SMTP-auth"
																			checked={this.state.isSame}
																			// onChange={(e) => {
																			// 	this.setState({
																			// 		isSame: !this.state.isSame,
																			// 	});
																			// }}
																		/>
																		<label >
																			{strings.ShippingAddressIsSameAsBillingAddress}
																		</label>
																	</div>
																</FormGroup>
															</Col>
														</Row>
														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingAddress"><span className="text-danger">* </span>
																		{strings.ShippingAddress}
																	</Label>
																	<Input
																	type="text"
																		maxLength="100"
																		id="shippingAddress"
																		name="shippingAddress"
																		placeholder={strings.Enter + strings.ShippingAddress}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAddress.test(
																					option.target.value,
																				)
																			) {
																				option = upperFirst(option.target.value)
																				props.handleChange('shippingAddress')(
																					option,
																				);
																				this.setState({isSame: false,});
																			}
																		}}
																		value={props.values.shippingAddress}
																		className={
																			props.errors.shippingAddress &&
																				props.touched.shippingAddress
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingAddress &&
																		props.touched.shippingAddress && (
																			<div className="invalid-feedback">
																				{props.errors.shippingAddress}
																			</div>
																		)}
																</FormGroup>
															</Col>

															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingCountryId"><span className="text-danger">* </span>{strings.Country}</Label>
																	<Select
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
																		value={
																			country_list &&
																				selectOptionsFactory
																					.renderOptions(
																						'countryName',
																						'countryCode',
																						country_list,
																						'Country',
																					)
																					.find(
																						(option) =>
																							option.value ===
																							+props.values.shippingCountryId.value,
																					)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('shippingCountryId')(option);
																				this.getStateListForShippingAddress(option.value);
																				this.setState({isSame: false,});
																			} else {
																				props.handleChange('shippingCountryId')('');
																				// this.getStateListForShippingAddress('');
																			}
																			props.handleChange('stateId')({
																				label: 'Select State',
																				value: '',
																			});
																		}}
																		placeholder={strings.Select + strings.Country}
																		id="shippingCountryId"
																		name="shippingCountryId"
																		className={
																			props.errors.shippingCountryId &&
																				props.touched.shippingCountryId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingCountryId &&
																		props.touched.shippingCountryId && (
																			<div className="invalid-feedback">
																				{props.errors.shippingCountryId}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingStateId"><span className="text-danger">* </span>
																		{/* {strings.StateRegion} */}
																		{props.values.shippingCountryId.value === 229 ? "Emirates" : "State / Provinces"}
																	</Label>
																	<Select
																		options={
																			state_list_for_shipping
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					state_list_for_shipping,
																					props.values.shippingCountryId.value === 229 ? "Emirates" : "State / Provinces",
																				)
																				: []
																		}
																		value={
																			state_list_for_shipping.find(
																					(option) =>
																						option.value ===
																						+props.values.shippingStateId.value,
																				)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('shippingStateId')(option);
																				this.setState({isSame: false,});
																			} else {
																				props.handleChange('shippingStateId')('');
																			}
																		}}
																			placeholder={ props.values.shippingCountryId.value === 229 ? "Emirates" : "State / Provinces"}
																		id="shippingStateId"
																		name="shippingStateId"
																		className={
																			props.errors.shippingStateId &&
																				props.touched.shippingStateId
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingStateId &&
																		props.touched.shippingStateId && (
																			<div className="invalid-feedback">
																				{props.errors.shippingStateId}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingCity"><span className="text-danger">* </span>{strings.City}</Label>
																	<Input
																
																		// options={city ? selectOptionsFactory.renderOptions('cityName', 'cityCode', cityRegion) : ''}
																		value={props.values.shippingCity}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				option = upperFirst(option.target.value)
																				props.handleChange('shippingCity')(option);
																				this.setState({isSame: false,});
																			}
																		}}
																		placeholder={strings.Enter + strings.City}
																		id="shippingCity"
																		name="shippingCity"
																		type="text"
																		maxLength="100"
																		className={
																			props.errors.shippingCity && props.touched.shippingCity
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingCity && props.touched.shippingCity && (
																		<div className="invalid-feedback">
																			{props.errors.shippingCity}
																		</div>
																	)}
																</FormGroup>
															</Col>

															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingPostZipCode"><span className="text-danger">* </span>
																		{strings.PostZipCode}
																	</Label>
																	<Input
																	
																		type="text"
																		maxLength="6"
																		id="shippingPostZipCode"
																		name="shippingPostZipCode"
																		placeholder={strings.Enter + strings.PostZipCode}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('shippingPostZipCode')(
																					option.target.value,
																				);
																				this.setState({isSame: false,});
																			}
																		}}
																		value={props.values.shippingPostZipCode}
																		className={
																			props.errors.shippingPostZipCode &&
																				props.touched.shippingPostZipCode
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingPostZipCode &&
																		props.touched.shippingPostZipCode && (
																			<div className="invalid-feedback">
																				{props.errors.shippingPostZipCode}
																			</div>
																		)}
																</FormGroup>
															</Col>



															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingTelephone">{strings.Telephone}</Label>
																	<Input
																		maxLength="15"
																		type="text"
																		id="shippingTelephone"
																		name="shippingTelephone"
																		placeholder={strings.Enter + strings.TelephoneNumber}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExTelephone.test(option.target.value)
																			) {
																				props.handleChange('shippingTelephone')(option);
																			}
																		}}
																		value={props.values.shippingTelephone}
																		className={
																			props.errors.shippingTelephone &&
																				props.touched.shippingTelephone
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingTelephone &&
																		props.touched.shippingTelephone && (
																			<div className="invalid-feedback">
																				{props.errors.shippingTelephone}
																			</div>
																		)}
																</FormGroup>
															</Col>

															<Col md="4">
																<FormGroup>
																	<Label htmlFor="shippingFax">
																		{strings.Fax}
																	</Label>
																	<Input
																		type="text"
																		maxLength="8"
																		id="shippingFax"
																		name="shippingFax"
																		placeholder={strings.Enter + strings.Fax}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				if(option.target.value.length !=8 && option.target.value !="")
																				this.setState({showshippingFaxErrorMsg:true})
																				else
																				this.setState({showshippingFaxErrorMsg:false})
																				props.handleChange('shippingFax')(
																					option,
																				);
																			}
																	

																			}}
																		value={props.values.shippingFax}
																		className={
																			props.errors.shippingFax &&
																				props.touched.shippingFax
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.shippingFax &&
																		props.touched.shippingFax && (
																			<div className="invalid-feedback">
																				{props.errors.shippingFax}
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
																			: strings.Create}
																	</Button>
																	<Button
																		name="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
																			this.setState(
																				{ createMore: true, isSame:false },
																				() => {
																					props.handleSubmit();
																				},
																			);
																		}}
																	>
																		<i className="fa fa-refresh"></i> 	{this.state.disabled
																			? 'Creating...'
																			: strings.CreateandMore}
																	</Button>
																	<Button
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			if(this.props.location
																				&& this.props.location.state
																				&& this.props.location.state.gotoParentURL
																			)
																				this.props.history.push(this.props.location.state.gotoParentURL)
																			else
																				this.props.history.push('/admin/master/contact');
													
																			
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
