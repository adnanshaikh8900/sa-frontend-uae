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
import { upperFirst } from 'lodash-es';

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
			initValue: {
				billingEmail: '',
				city: '',
				contactType: '',
				
				countryId: '',
				currencyCode: '',
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
				billingPostZipCode:'',
				billingcountryId: '',				
                shippingCountryId:'',
				shippingStateId:'',
				shippingPostZipCode:'',
				shippingCity:'',
				taxTreatmentId:'',


			},
			state_list_for_shipping:[],
			currentData: {},
			dialog: null,
			current_contact_id: null,
			disabled: false,
			disabled1:false,
			checkmobileNumberParam:false,
			selectedStatus: false,
			isActive: false,
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
	}

	componentDidMount = () => {
		this.initializeData();
		this.props.detailContactActions
		.getTaxTreatment()
		.then((res) => {
			
			if (res.status === 200) {
				let array=[]
				res.data.map((row)=>{
					if(row.id!==8)
						array.push(row);
				})
				this.setState({taxTreatmentList : array });					
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
								billingcountryId:
								{value:res.data.countryId && res.data.countryId !== null
									? res.data.countryId
									: ''},
						
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
								shippingAddress: res.data.addressLine2,
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
								billingFax:
									res.data.fax && res.data.fax !== null
										? res.data.fax
										: '',
								shippingCountryId:
										res.data.shippingCountryId && res.data.shippingCountryId !== null
											? res.data.shippingCountryId
											: 229,
								shippingStateId:
										res.data.shippingStateId && res.data.shippingStateId !== null
											? res.data.shippingStateId
											: '',
								shippingCity:
										res.data.shippingCity && res.data.shippingCity !== null
											? res.data.shippingCity
											: '',
								shippingFax:
									res.data.shippingFax && res.data.shippingFax !== null
										? res.data.shippingFax
										: '',
								shippingTelephone:
									res.data.shippingTelephone && res.data.shippingTelephone !== null
										? res.data.shippingTelephone
										: '',
								shippingPostZipCode:
									res.data.shippingPostZipCode && res.data.shippingPostZipCode !== null
										? res.data.shippingPostZipCode
										: '',
								website:
										res.data.website && res.data.website !== null
											? res.data.website
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
								taxTreatmentId: res.data.taxTreatmentId?res.data.taxTreatmentId:'',
								billingcountryId: {value:res.data.countryId && res.data.countryId !== null
									? res.data.countryId
									: ''},
								billingStateProvince:res.data.stateId && res.data.stateId !== null
													? res.data.stateId
													: '',
								stateId:res.data.stateId && res.data.stateId !== null
													? res.data.stateId
													: '',					
								billingCity: res.data.city && res.data.city,
								billingAddress: res.data.addressLine1 && res.data.addressLine1
								? res.data.addressLine1
								: '',
								billingPostZipCode: res.data.postZipCode && res.data.postZipCode !== null
										? res.data.postZipCode
										: '',
								billingPhoneNumber:res.data.billingTelephone && res.data.billingTelephone !== null
										? res.data.billingTelephone
										: '' ,
								billingFax: res.data.fax && res.data.fax !== null
										? res.data.fax
										: '' ,
							},
							showTaxTreatment: res.data.isRegisteredForVat? res.data.isRegisteredForVat:false,
							taxTreatmentId: res.data.taxTreatmentId?res.data.taxTreatmentId:'',
							isSame:res.data.isBillingAndShippingAddressSame
						},
						() => {
							this.props.contactActions.getStateList(
								this.state.initValue.countryId,
							);
							this.props.contactActions.getStateListForShippingAddress(
								this.state.initValue.shippingCountryId,
							).then((res)=>{
								
								this.setState({state_list_for_shipping:res})
							});

							if(this.state.initValue.taxTreatmentId=== 1 ||this.state.initValue.taxTreatmentId === 3 ||this.state.initValue.taxTreatmentId === 5 )
							this.setState({isRegisteredForVat:true})
							else
							this.setState({isRegisteredForVat:false})
							// if (this.state.isSame) {
							// 	this.setState({
							// 		billingAddress: {
							// 			billingcountryId: res.data.countryId && res.data.countryId !== null
							// 				? res.data.countryId
							// 				: '',
							// 			billingStateProvince:res.data.stateId && res.data.stateId !== null
							// 			? res.data.stateId
							// 			: '',
							// 			billingCity: res.data.city && res.data.city,
							// 			billingAddress: res.data.addressLine1 && res.data.addressLine1
							// 			? res.data.addressLine1
							// 			: '',
							// 			billingPostZipCode: res.data.postZipCode && res.data.postZipCode !== null
							// 			? res.data.postZipCode
							// 			: '',
							// 			billingPhoneNumber:res.data.billingTelephone && res.data.billingTelephone !== null
							// 			? res.data.billingTelephone
							// 			: '' ,
							// 			billingFax: res.data.fax && res.data.fax !== null
							// 			? res.data.fax
							// 			: '' ,
							// 		},
							// 	});
							// }
						},
					);
				})
				.catch((err) => {
					this.setState({ loading: false });
					this.props.commonActions.tostifyAlert(
						'error',
						err
					);
				});
				
		} else {
			this.props.history.push('/admin/master/contact');
		}
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
		temp[`countryId`] = data[`billingcountryId`].value ? data[`billingcountryId`].value: data[`billingcountryId`];
		temp[`stateId`] = data[`billingStateProvince`].value ? data[`billingStateProvince`].value:data[`billingStateProvince`];
		temp[`postZipCode`] =data[`billingPostZipCode`];
		temp[`city`] =data[`billingCity`];
		temp[`fax`] = data[`billingFax`];
		temp[`billingTelephone`] = data[`billingPhoneNumber`];

		temp[`addressLine2`] =  data[`shippingAddress`];
		// temp[`shippingCountryId`] = isSame ? this.state.billingAddress.billingcountryId :  data[`shippingCountryId`].value;
		// temp[`shippingStateId`] = isSame ? this.state.billingAddress.billingStateProvince :  data[`shippingStateId`].value;
		// temp[`shippingPostZipCode`] = isSame ? this.state.billingAddress.billingPostZipCode :  data[`shippingPostZipCode`];
		// temp[`shippingCity`] =isSame ? this.state.billingAddress.billingCity :  data[`shippingCity`];
		// temp[`shippingFax`] = isSame ? this.state.billingAddress.billingFax :  data[`shippingFax`];

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
						res.data ? res.data.message : 'Contact Updated Successfully',
					);
					this.props.history.push('/admin/master/contact');
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Contact Updated Unsuccessfully'
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
						res.data ? res.data.message : 'Contact Deleted Successfully',
					);
					
					this.props.history.push('/admin/master/contact');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.data ? err.data.message : 'Contact Deleted Unsuccessfully',
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
		const { initValue, loading, dialog, checkmobileNumberParam , taxTreatmentList,isSame,state_list_for_shipping} = this.state;
		
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

														
														if (values.vatRegistrationNumber === '' && this.state.isRegisteredForVat==true)
														errors.vatRegistrationNumber =	'Tax Registration Number is Required';
												

														// if( values.stateId ===''){
														// 	errors.stateId =
														// 	'State is Required';
														// }
														// if( values.stateId.label && values.stateId.label ==='Select State'){
														// 	errors.stateId =
														// 	'State is Required';
														// }
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
														taxTreatmentId: Yup.string().required(
															'Tax Treatment is Required',
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
															shippingAddress: Yup.string().required(
																'Shipping Address is Required',
															),
															billingAddress: Yup.string().required(
																'Billing Address is Required',
															),
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
														// stateId: Yup.string().when('countryId', {
														// 	is: (val) => (val ? true : false),
														// 	then: Yup.string().required('State is Required'),
														//   }),
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
																	</Col></Row>
																	<h4 className="mb-4">{strings.ContactName}</h4>
															<Row className="row-wrapper">
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="select">
																			<span className="text-danger">* </span>
																		{strings.FirstName}
																		</Label>
																		<Input
																			type="text"
																			id="firstName"
																			name="firstName"
																			maxLength="100"
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
																			maxLength="100"
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
																		<Label htmlFor="lastName">	<span className="text-danger">* </span>{strings.LastName}</Label>
																		<Input
																			type="text"
																			id="lastName"
																			name="lastName"
																			maxLength="100"
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
																<hr/>
																<h4 className="mb-4">{strings.ContactDetails}</h4>
																<Row>
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="contactType">
																			<span className="text-danger">* </span>
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
																			maxLength="100"
																			placeholder={strings.Enter+strings.OrganizationName}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regExAddress.test(
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
																		<Label htmlFor="email">
																			<span className="text-danger">* </span>
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
																		<Label htmlFor="currencyCode">
																			<span className="text-danger">* </span>
																			 {strings.CurrencyCode}
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
																			<span className="text-danger">* </span>
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
																
																
																<Col md="4">
																	<FormGroup>
																		<Label htmlFor="select">
																			{strings.POBoxNumber}
																		</Label>
																		<Input
																			type="text"
																			id="poBoxNumber"
																			name="poBoxNumber"
																			maxLength='8'
																			placeholder={strings.Enter+strings.POBoxNumber}
																			onChange={(option) => {
																				if (
																					option.target.value === '' ||
																					this.regEx.test(
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
																		styles={customStyles}
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
																		value={
																			taxTreatmentList &&
																			 selectOptionsFactory.renderOptions(
																					'name',
																					'id',
																					taxTreatmentList,
																					'TaxTreatment',
																				)
																					.find(
																						(option) =>
																							option.value ===
																							+props.values.taxTreatmentId,
																					)
																			}
																		onChange={(option) => {
																			// this.setState({
																			//   selectedVatCategory: option.value
																			// })
																			if (option && option.value) {

																				props.handleChange('taxTreatmentId')(
																					option.value,
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
															{props.values.taxTreatmentId && props.values.taxTreatmentId && (<Col md="4" style={{ display: props.values.taxTreatmentId === 1 || props.values.taxTreatmentId === 3 || props.values.taxTreatmentId === 5 ? '' : 'none' }}>
																<FormGroup>
																	<Label htmlFor="vatRegistrationNumber"><span className="text-danger">* </span>
																		{strings.TaxRegistrationNumber}
																	</Label>
																	<Input
																		type="text"
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
																			)
																			{
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
																			
																			country_list
																				&& selectOptionsFactory.renderOptions(
																					'countryName',
																					'countryCode',
																					country_list,
																					'Country',
																				).find(
																				(option) =>
																					option.value ===
																					+props.values.billingcountryId.value,
																			)
																		
																		}
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
																			// props.handleChange('billingStateProvince')({
																			// 	label: 'Select State',
																			// 	value: '',
																			// });
																			
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
																		{props.values.billingcountryId.value === 229 ? "Emirites" : "State / Provinces"}
																	</Label>
																	<Select
																		styles={customStyles}
																		options={
																			state_list
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					state_list,
																					props.values.billingcountryId.value === 229 ? "Emirites" : "State / Provinces",
																				)
																				: []
																		}
																		value={
																			state_list
																			&& selectOptionsFactory.renderOptions(
																				'label',
																				'value',
																				state_list,
																				props.values.billingcountryId.value === 229 ? "Emirites" : "State / Provinces",
																			).find(
																			(option) =>
																				option.value ===
																				+props.values.billingStateProvince,
																		)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('billingStateProvince')(option);
																				
																			} else {
																				props.handleChange('stateId')('');
																			}
																		}}
																		placeholder={strings.Select + props.values.billingcountryId === 229 ? "Emirites" : "State / Provinces"}
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
																	{props.errors.billingCity && props.touched.billingCity && (
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
																		maxLength="8"
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
																			type="checkbox"
																			id="inline-radio1"
																			name="SMTP-auth"
																			checked={this.state.isSame}
																			// onChange={(e) => {
																			// 	this.setState({
																			// 		isSame: !this.state.isSame,
																			// 	});
																			// }}
																			onChange={(option) => {

																			
																				if (this.state.isSame==false) {
																					debugger
																					this.setState({isSame: !this.state.isSame,});
																				    this.getStateListForShippingAddress(props.values.billingcountryId.value ?props.values.billingcountryId.value :props.values.billingcountryId);
																					props.handleChange('shippingAddress')(props.values.billingAddress);
																					props.handleChange('shippingCity')(props.values.billingCity);
																					props.handleChange('shippingCountryId')(props.values.billingcountryId.value ?props.values.billingcountryId.value :props.values.billingcountryId);
																					
																					props.handleChange('shippingStateId')(props.values.billingStateProvince.value ?props.values.billingStateProvince.value:props.values.billingStateProvince);
																					props.handleChange('shippingTelephone')(props.values.billingPhoneNumber);
																					props.handleChange('shippingPostZipCode')(props.values.billingPostZipCode);
																					props.handleChange('shippingFax')(props.values.billingFax);
																				} else {
																					this.setState({isSame: !this.state.isSame,});

																					props.handleChange('shippingAddress')("");
																					props.handleChange('shippingCity')("");
																					props.handleChange('shippingCountryId')("");
																					props.handleChange('shippingStateId')("");
																					props.handleChange('shippingPostZipCode')("");
																					props.handleChange('shippingTelephone')("");
																					props.handleChange('shippingFax')("");
																				}
																			}}
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
																							+props.values.shippingCountryId,
																					)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('shippingCountryId')(option);
																				this.getStateListForShippingAddress(option.value);
																			} else {
																				props.handleChange('shippingCountryId')('');
																				// this.getStateListForShippingAddress('');
																			}
																			props.handleChange('shippingStateId')({
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
																		{props.values.shippingCountryId === 229 || props.values.shippingCountryId.value === 229? "Emirites" : "State / Provinces"}
																	</Label>
																	<Select
																		
																		styles={customStyles}
																		options={
																			state_list_for_shipping
																				? selectOptionsFactory.renderOptions(
																					'label',
																					'value',
																					state_list_for_shipping,
																					props.values.shippingCountryId === 229 || props.values.shippingCountryId.value === 229? "Emirites" : "State / Provinces",
																				)
																				: []
																		}
																		value={
																			state_list_for_shipping.find(
																					(option) =>
																						option.value ===
																						+props.values.shippingStateId,
																				)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('shippingStateId')(option);
																			} else {
																				props.handleChange('shippingStateId')('');
																			}
																		}}
																		placeholder={strings.Select + props.values.shippingCountryId === 229 || props.values.shippingCountryId.value === 229 ? "Emirites" : "State / Provinces"}
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
																		maxLength="8"
																		id="shippingPostZipCode"
																		name="shippingPostZipCode"
																		placeholder={strings.Enter + strings.PostZipCode}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('shippingPostZipCode')(
																					option,
																				);
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
																		value={props.values.shippingFax}
																		placeholder={strings.Enter + strings.Fax}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('shippingFax')(
																					option,
																				);
																			}
																		}}
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
															<Row className="row-wrapper">
																
															
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
