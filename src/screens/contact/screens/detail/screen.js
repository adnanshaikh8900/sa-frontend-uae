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
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';
import { Loader, ConfirmDeleteModal } from 'components';

import { toast } from 'react-toastify';

import './style.scss';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { CommonActions } from 'services/global';
import * as ContactActions from '../../actions';
import * as DetailContactActions from './actions';
 
import PhoneInput  from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		country_list: state.contact.country_list,
		currency_list: state.contact.currency_list,
		contact_type_list: state.contact.contact_type_list,
		state_list: state.contact.state_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		contactActions: bindActionCreators(ContactActions, dispatch),
		detailContactActions: bindActionCreators(DetailContactActions, dispatch),
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
class DetailContact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			initValue: {},
			currentData: {},
			dialog: null,
			current_contact_id: null,
			disabled: false,
			disabled1:false,
			checkmobileNumberParam:false,
			selectedStatus: false,
			isActive: false,
		};
		
		this.regEx = /^[0-9\d]+$/;
		// this.regEx =/[a-zA-Z0-9]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAlpha1 = /^[a-zA-Z0-9!@#$&()-\\`.+,/\"]+$/;
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		if (this.props.location.state && this.props.location.state.id) {
			this.props.contactActions.getContactTypeList();
			this.props.contactActions.getCountryList();
			this.props.contactActions.getCurrencyList();

			this.props.detailContactActions
				.getContactById(this.props.location.state.id)
				.then((res) => {
					this.setState(
						{
							current_contact_id: this.props.location.state.id,
							loading: false,
							isActive: res.data ? res.data.isActive : '',
							selectedStatus: res.data ? res.data.isActive : '',
							initValue: {
								billingEmail:
									res.data.billingEmail && res.data.billingEmail !== null
										? res.data.billingEmail
										: '',
								city: res.data.city && res.data.city,
								contactType: res.data.contactType ? res.data.contactType : '',
								contractPoNumber:
									res.data.contractPoNumber && res.data.contractPoNumber
										? res.data.contractPoNumber
										: '',
								countryId:
									res.data.countryId && res.data.countryId !== null
										? res.data.countryId
										: '',
								currencyCode:
									res.data.currencyCode && res.data.currencyCode !== null
										? res.data.currencyCode
										: '',
								email:
									res.data.email && res.data.email !== null
										? res.data.email
										: '',
								firstName:
									res.data.firstName && res.data.firstName !== null
										? res.data.firstName
										: '',
								addressLine1:
									res.data.addressLine1 && res.data.addressLine1
										? res.data.addressLine1
										: '',
								addressLine2: res.data.addressLine2,
								addressLine3: res.data.addressLine3,
								// language(Language, optional),
								lastName:
									res.data.lastName && res.data.lastName !== null
										? res.data.lastName
										: '',
								middleName:
									res.data.middleName && res.data.middleName !== null
										? res.data.middleName
										: '',
								mobileNumber:
									res.data.mobileNumber && res.data.mobileNumber !== null
										? res.data.mobileNumber
										: '',
								organization:
									res.data.organization && res.data.organization !== null
										? res.data.organization
										: '',
								poBoxNumber:
									res.data.poBoxNumber && res.data.poBoxNumber !== null
										? res.data.poBoxNumber
										: '',
								postZipCode:
									res.data.postZipCode && res.data.postZipCode !== null
										? res.data.postZipCode
										: '',
								stateId:
									res.data.stateId && res.data.stateId !== null
										? res.data.stateId
										: '',
								telephone:
									res.data.telephone && res.data.telephone !== null
										? res.data.telephone
										: '',
								vatRegistrationNumber:
									res.data.vatRegistrationNumber &&
									res.data.vatRegistrationNumber !== null
										? res.data.vatRegistrationNumber
										: '',
								isActive: res.data ? res.data.isActive : '',
								selectedStatus: res.data ? res.data.isActive : '',
							},
						},
						() => {
							this.props.contactActions.getStateList(
								this.state.initValue.countryId,
							);
						},
					);
				})
				.catch((err) => {
					this.setState({ loading: false });
					this.props.commonActions.tostifyAlert(
						'error',
						err.data.message
					);
				});
		} else {
			this.props.history.push('/admin/master/contact');
		}
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
		temp[`isActive`] =this.state.isActive;
		return temp;
	};

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const { current_contact_id } = this.state;
		let postData = this.getData(data);

		postData = { ...postData, ...{ contactId: current_contact_id } };

		this.props.detailContactActions
			.updateContact(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ disabled: false });
					resetForm();
					this.props.commonActions.tostifyAlert(
						'success',
						'Contact Updated Successfully',
					);
					this.props.history.push('/admin/master/contact');
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
				err.data.message
				);
				// this.props.history.push('/admin/master/contact');
			});
	};
	success = (msg) => {
		toast.success(msg, {
			autoClose: 80000,
			position: toast.POSITION.TOP_RIGHT,
		});
	};

	deleteContact = () => {
	
		const { current_contact_id } = this.state;
		this.props.contactActions
			.getInvoicesCountContact(current_contact_id)
			.then((res) => {
				if (res.data > 0) {
					this.props.commonActions.tostifyAlert(
						'error',
						'You need to delete invoices to delete the contact',
					);
				} else {
						const message1 =
						<text>
						<b>Delete Contact?</b>
						</text>
						const message = 'This Contact will be deleted permanently and cannot be recovered. ';
					this.setState({
						dialog: (
							<ConfirmDeleteModal
								isOpen={true}
								okHandler={this.removeContact}
								cancelHandler={this.removeDialog}
								message1={message1}
								message={message}
							/>
						),
						
					});
					
				}
			});
	};

	removeContact = () => {
		this.setState({ disabled1: true });
		const { current_contact_id } = this.state;
		this.props.detailContactActions
			.deleteContact(current_contact_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Contact Deleted Successfully',
					);
					
					this.props.history.push('/admin/master/contact');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
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
		const { initValue, loading, dialog, checkmobileNumberParam } = this.state;
		return (
			<div className="create-contact-screen">
				<div className="animated fadeIn">
					{dialog}
					{loading ? (
						<Loader></Loader>
					) : (
						<Row>
							<Col lg={12} className="mx-auto">
								<Card>
									<CardHeader>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="nav-icon fas fa-id-card-alt" />
													<span className="ml-2"> {strings.UpdateContact} </span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<Row>
											<Col lg={12}>
												<Formik
													initialValues={initValue}
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
														contactType: Yup.string().required(
															'Contact Type is Required',
														),
														//       organization: Yup.string()
														//       .required("Organization Name is Required"),
														//     poBoxNumber: Yup.number()
														//       .required("PO Box Number is Required"),
														email: Yup.string()
															.required('Email is Required')
															.email('Invalid Email'),
														mobileNumber: Yup.string()
															.required('Mobile Number is required'),
														currencyCode: Yup.string()
															.required('Please Select Currency')
															.nullable(),
														countryId: Yup.string()
															.required('Country is Required')
															.nullable(),
														stateId: Yup.string().when('countryId', {
															is: (val) => (val ? true : false),
															then: Yup.string().required('State is Required'),
														  }),
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
																			<span className="text-danger">*</span>
																		{strings.FirstName}
																		</Label>
																		<Input
																			type="text"
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
																					props.handleChange('firstName')(
																						option,
																					);
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
																		<Label htmlFor="middleName">
																			 {strings.MiddleName}
																		</Label>
																		<Input
																			type="text"
																			id="middleName"
																			name="middleName"
																			placeholder={strings.Enter+strings.MiddleName}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExAlpha.test(
																						option.target.value,
																					)
																				) {
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
																	<Label htmlFor="lastName">	<span className="text-danger">*</span>{strings.LastName}</Label>
																		<Input
																			type="text"
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
																					props.handleChange('lastName')(
																						option,
																					);
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
															<h4 className="mb-3 mt-3"> {strings.ContactDetails}</h4>
															<Row className="row-wrapper">
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="contactType">
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
																			value={
																				contact_type_list &&
																				contact_type_list.find(
																					(option) =>
																						option.value ===
																						+props.values.contactType,
																				)
																			}
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange('contactType')(
																						option.value,
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
																			id="organization"
																			name="organization"
																			placeholder={strings.Enter+strings.OrganizationName}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExAlpha1.test(
																						option.target.value,
																					)
																				) {
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
																		<Label htmlFor="select">
																			{strings.POBoxNumber}
																		</Label>
																		<Input
																			type="text"
																			id="poBoxNumber"
																			name="poBoxNumber"
																			placeholder={strings.Enter+strings.POBoxNumber}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExBoth.test(
																						option.target.value,
																					)
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
																			<span className="text-danger">*</span>
																			 {strings.Email}
																		</Label>
																		<Input
																			type="text"
																			id="email"
																			name="email"
																			placeholder={strings.Enter+strings.EmailAddress}
																			onChange={(value) => {
																				props.handleChange('email')(value);
																			}}
																			value={props.values.email}
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
																					this.regEx.test(option.target.value)
																				) {
																					props.handleChange('telephone')(
																						option,
																					);
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
																			id="mobileNumber"
																			name="mobileNumber"
																				country={"ae"}
																				enableSearch={true}
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
																			id="addressLine1"
																			name="addressLine1"
																			placeholder={strings.Enter+strings.AddressLine1}
																			onChange={(value) => {
																				props.handleChange('addressLine1')(
																					value,
																				);
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
																			id="addressLine2"
																			name="addressLine2"
																			placeholder={strings.Enter+strings.AddressLine2}
																			value={props.values.addressLine2}
																			onChange={(value) => {
																				props.handleChange('addressLine2')(
																					value,
																				);
																			}}
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
																			id="addressLine3"
																			name="addressLine3"
																			placeholder={strings.Enter+strings.AddressLine3}
																			value={props.values.addressLine3}
																			onChange={(value) => {
																				props.handleChange('addressLine3')(
																					value,
																				);
																			}}
																		/>
																	</FormGroup>
																</Col>
															</Row>
															<Row className="row-wrapper">
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="countryId">
																		<span className="text-danger">*</span>	 {strings.Country}
																		</Label>
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
																							+props.values.countryId,
																					)
																			}
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange('countryId')(
																						option,
																					);
																					this.getStateList(option.value);
																				} else {
																					props.handleChange('countryId')('');
																					this.getStateList(option.value);
																				}
																				props.handleChange('stateId')('');
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
																		<Label htmlFor="stateId">
																		<span className="text-danger">*</span> {strings.StateRegion}
																		</Label>
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
																			value={
																				state_list &&
																				selectOptionsFactory
																					.renderOptions(
																						'label',
																						'value',
																						state_list,
																						'State',
																					)
																					.find(
																						(option) =>
																							option.value ===
																							props.values.stateId,
																					)
																			}
																			onChange={(option) => {
																				if (option && option.value) {
																					props.handleChange('stateId')(
																						option.value,
																					);
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
																					props.handleChange('city')(option);
																				}
																			}}
																			placeholder={strings.Enter+strings.City}
																			id="city"
																			name="city"
																			className={
																				props.errors.city && props.touched.city
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.errors.city &&
																			props.touched.city && (
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
																			id="postZipCode"
																			name="postZipCode"
																			placeholder={strings.Enter+strings.PostZipCode}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExBoth.test(
																						option.target.value,
																					)
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
															<h4 className="mb-3 mt-3">{strings.InvoicingDetails}</h4>
															<Row className="row-wrapper">
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="billingEmail">
																			 {strings.BillingEmail}
																		</Label>
																		<Input
																			type="text"
																			id="billingEmail"
																			name="billingEmail"
																			placeholder={strings.Enter+strings.BillingEmail+" "+strings.Address}
																			onChange={(value) => {
																				props.handleChange('billingEmail')(
																					value,
																				);
																			}}
																			value={props.values.billingEmail}
																			className={
																				props.errors.billingEmail &&
																				props.touched.billingEmail
																					? 'is-invalid'
																					: ''
																			}
																		/>
																		{props.billingEmail &&
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
																			id="contractPoNumber"
																			name="contractPoNumber"
																			placeholder={strings.Enter+strings.ContractPONumber}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExBoth.test(
																						option.target.value,
																					)
																				) {
																					props.handleChange(
																						'contractPoNumber',
																					)(option);
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
																					this.regEx.test(
																						option.target.value,
																					)
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
																		<b>	<a target="_blank" href="https://eservices.tax.gov.ae/en-us/trn-verify" style={{ color: '#2266d8' }} rel="noopener noreferrer"  >{strings.VerifyTRN}</a></b>
														</div>
																	</FormGroup>
																</Col>
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="currencyCode">
																			<span className="text-danger">*</span>
																			 {strings.CurrencyCode}
																		</Label>
																		<Select
																			isDisabled={true}
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
																					props.handleChange('currencyCode')(
																						'',
																					);
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
																<Col
																	lg={12}
																	className="d-flex align-items-center justify-content-between flex-wrap mt-5"
																>
																	<FormGroup>
																		<Button
																			type="button"
																			name="button"
																			color="danger"
																			className="btn-square"
																			disabled1={this.state.disabled1}
																			onClick={this.deleteContact}
																		>
																			<i className="fa fa-trash"></i> {this.state.disabled1
																			? 'Deleting...'
																			: strings.Delete }
																		</Button>
																	</FormGroup>
																	<FormGroup className="text-right">
																		<Button
																			type="submit"
																			name="submit"
																			color="primary"
																			className="btn-square mr-3"
																			disabled={this.state.disabled}
																		>
																			<i className="fa fa-dot-circle-o"></i>{' '}
																			{this.state.disabled
																			? 'Updating...'
																			: strings.Update }
																		</Button>
																		<Button
																			type="button"
																			name="button"
																			color="secondary"
																			className="btn-square"
																			onClick={() => {
																				this.props.history.push(
																					'/admin/master/contact',
																				);
																			}}
																		>
																			<i className="fa fa-ban"></i>{this.state.disabled1
																			? 'Deleting...'
																			: strings.Cancel }
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
					)}
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContact);
