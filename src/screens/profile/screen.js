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
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';
import Select from 'react-select';
// import ImagesUploader from 'react-images-uploader'
import { Loader, ImageUploader } from 'components';
import {
	selectOptionsFactory,
	cryptoService,
	selectCurrencyFactory,
	api,
} from 'utils';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ProfileActions from './actions';
import { CommonActions, AuthActions } from 'services/global';
import './style.scss';
import { upperFirst } from 'lodash-es';

import 'react-datepicker/dist/react-datepicker.css';
// import 'react-images-uploader/styles.css'
// import 'react-images-uploader/font.css'

import './style.scss';
import PhoneInput  from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import {data}  from '../Language/index'
import LocalizedStrings from 'react-localization';
import { Message } from '@material-ui/icons';
import PasswordChecklist from "react-password-checklist"

const mapStateToProps = (state) => {
	return {
		currency_list: state.profile.currency_list,
		country_list: state.profile.country_list,
		industry_type_list: state.profile.industry_type_list,
		company_type_list: state.profile.company_type_list,
		role_list: state.profile.role_list,
		invoicing_state_list: state.profile.invoicing_state_list,
		company_state_list: state.profile.company_state_list,
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

const mapDispatchToProps = (dispatch) => {
	return {
		profileActions: bindActionCreators(ProfileActions, dispatch),
		authActions: bindActionCreators(AuthActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
let strings = new LocalizedStrings(data);
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			activeTab: new Array(2).fill('1'),
			userPhotoFile: [],
			userPhoto: [],
			companyLogo: [],
			companyLogoFile: [],
			initUserData: {},
			email:'',
			initCompanyData: {
				companyName: '',
				companyRegistrationNumber: '',
				vatRegistrationNumber: '',
				companyTypeCode: '',
				industryTypeCode: '',
				phoneNumber: '',
				emailAddress: '',
				website: '',
				invoicingAddressLine1: '',
				invoicingAddressLine2: '',
				invoicingAddressLine3: '',
				invoicingCity: '',
				invoicingStateRegion: '',
				invoicingPostZipCode: '',
				invoicingPoBoxNumber: '',
				invoicingCountryCode: '',
				currencyCode: '',
				companyAddressLine1: '',
				companyAddressLine2: '',
				companyAddressLine3: '',
				companyCity: '',
				companyStateRegion: '',
				companyPostZipCode: '',
				companyPoBoxNumber: '',
				companyCountryCode: 229,
				companyExpenseBudget: '',
				companyRevenueBudget: '',
				dateFormat: '',
				telephoneNumber:'',
				fax:'',
			},
			// companyId: '',
			imageState: true,
			flag: true,
			selectedStatus: false,
			isSame: false,
			companyAddress: {
				companyAddressLine1: '',
				companyAddressLine2: '',
				companyAddressLine3: '',
				companyCity: '',
				companyStateCode: '',
				companyPostZipCode: '',
				companyPoBoxNumber: '',
				companyCountryCode: 229,
			},
			timezone: [],
		};

		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9-\d]+$/;
		this.regExAlpha = /^[a-zA-Z0-9_\-@#$&*().''<>/ ]+$/;
		this.regExTelephone = /^[0-9-\d]+$/;
		this.regExAlpha1 = /^[a-zA-Z ]+$/;
	}

	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		this.setState({
			activeTab: newArray,
		});
		if (tab === '1') {
			if (
				this.state.userPhoto[0] &&
				this.state.userPhoto[0].indexOf('data') < 0
			) {
				this.setState({ imageState: true });
			} else {
				this.setState({ imageState: false });
			}
		} else {
			this.setState({ loading: true });
			this.getCompanyData();
		}
	};
	componentDidMount = () => {
		this.getUserData();
		this.props.profileActions
				.getCompanyTypeList2()
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							companyTypeList: res.data,
						});
					}
				})
				.catch((err) => {
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
					
				});
		
	};

	uploadUserImage = (picture, file) => {
		this.setState({
			userPhoto: picture,
			userPhotoFile: file,
			imageState: false,
		});
	};

	uploadCompanyImage = (picture, file) => {
		this.setState({
			companyLogo: picture,
			companyLogoFile: file,
			imageState: false,
		});
	};

	stopLoading = () => {
		this.setState({ loading: false });
	};

	getUserData = () => {
		this.props.authActions.getTimeZoneList().then((response) => {
			let output = response.data.map(function (value) {
				return { label: value, value: value };
			});
			this.setState({ timezone: output });
		});
		const userId = cryptoService.decryptService('userId');
		this.setState({
			loading: true,
		});
		if (userId) {
			this.props.profileActions
				.getUserById(userId)
				.then((res) => {
					// this.props.userActions.getRoleList();
					this.props.profileActions.getCurrencyList();
					this.props.profileActions.getCountryList();
					//this.props.profileActions.getIndustryTypeList();
					this.props.profileActions.getCompanyTypeList();
					this.props.profileActions.getRoleList();

					if (res.status === 200) {
						this.setState({
							initUserData: {
								firstName: res.data.firstName ? res.data.firstName : '',
								lastName: res.data.lastName ? res.data.lastName : '',
								email: res.data.email ? res.data.email : '',
								password: '',
								confirmPassword:'',
								currentPassword:'',
								dob: res.data.dob
									? moment(res.data.dob, 'DD-MM-YYYY').toDate()
									: '',
								active: res.data.active ? res.data.active : '',
								// confirmPassword: '',
								roleId: res.data.roleId ? res.data.roleId : '',
								timezone: res.data.timeZone ? res.data.timeZone : '',
								// companyId: res.data.companyId ? res.data.companyId : '',
							},
							userId: res.data.id ? res.data.id : '',
							loading: false,
							selectedStatus: res.data.active ? true : false,
							userPhoto: res.data.profilePicByteArray
								? this.state.userPhoto.concat(res.data.profilePicByteArray)
								: [],
							// companyId: res.data.companyId ? res.data.companyId : ''
						});
					}
				})
				.catch((err) => {
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
					this.setState({ loading: false });
				});
		}
	};

	getStateList = (countryCode, type) => {
		this.props.profileActions.getStateList(countryCode, type);
	};

	handleUserSubmit = (data) => {
		const {
			firstName,
			lastName,
			email,
			dob,
			password,
			confirmPassword,
			currentPassword,
			roleId,
			timezone,
		} = data;
		const { userPhotoFile } = this.state;
		const userId = cryptoService.decryptService('userId');

		let formData = new FormData();
		formData.append('id', userId);
		formData.append('firstName', firstName ? firstName : '');
		formData.append('lastName', lastName ? lastName : '');
		formData.append('email', email ? email : '');
		formData.append('dob', dob ? moment(dob).format('DD-MM-YYYY') : '');
		formData.append('active', this.state.selectedStatus);
		formData.append('timeZone', timezone ? timezone : '');
		formData.append('roleId', roleId ? roleId : '');

		if (password.length > 0) {
			formData.append('password ', password);
		}
		
		if (confirmPassword.length > 0) {
			formData.append('confirmPassword ', confirmPassword);
		}
		if (this.state.userPhotoFile.length > 0) {
			formData.append('profilePic', userPhotoFile[0]);
		}
		// if (currentPassword.length > 0) {
		// 	formData.append('currentPassword ', currentPassword);
		// }
		
		this.props.profileActions
			.updateUser(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'User Updated Successfully',
					);
					this.props.authActions.checkAuthStatus().catch((err) => {
						this.props.authActions.logOut();
						this.props.history.push('/login');
					});
					this.props.history.push('/admin/dashboard');
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	getCompanyData = () => {
		// const {companyId} = this.state;
		this.props.profileActions
			.getCompanyById()
			.then((res) => {
				if (res.status === 200) {
					if (this.state.flag) {
						this.setState(
							{
								initCompanyData: {
									...this.state.initCompanyData,
									companyName: res.data.companyName ? res.data.companyName : '',
									companyRegistrationNumber: res.data.companyRegistrationNumber
										? res.data.companyRegistrationNumber
										: '',
									vatRegistrationNumber: res.data.vatRegistrationNumber
										? res.data.vatRegistrationNumber
										: '',
									companyTypeCode: res.data.companyTypeCode
										? res.data.companyTypeCode
										: '',
									industryTypeCode: res.data.industryTypeCode
										? res.data.industryTypeCode
										: '',
									phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : '',
									emailAddress: res.data.emailAddress
										? res.data.emailAddress
										: '',
									website: res.data.website ? res.data.website : '',
									invoicingAddressLine1: res.data.invoicingAddressLine1
										? res.data.invoicingAddressLine1
										: '',
									invoicingAddressLine2: res.data.invoicingAddressLine2
										? res.data.invoicingAddressLine2
										: '',
									invoicingAddressLine3: res.data.invoicingAddressLine3
										? res.data.invoicingAddressLine3
										: '',
									invoicingCity: res.data.invoicingCity
										? res.data.invoicingCity
										: '',
									invoicingStateRegion: res.data.invoicingStateRegion
										? res.data.invoicingStateRegion
										: '',
									invoicingPostZipCode: res.data.invoicingPostZipCode
										? res.data.invoicingPostZipCode
										: '',
									invoicingPoBoxNumber: res.data.invoicingPoBoxNumber
										? res.data.invoicingPoBoxNumber
										: '',
									invoicingCountryCode: res.data.invoicingCountryCode
										? res.data.invoicingCountryCode
										: '',
									currencyCode: res.data.currencyCode
										? res.data.currencyCode
										: '',
									companyAddressLine1: res.data.companyAddressLine1
										? res.data.companyAddressLine1
										: '',
									companyAddressLine2: res.data.companyAddressLine2
										? res.data.companyAddressLine2
										: '',
									companyAddressLine3: res.data.companyAddressLine3
										? res.data.companyAddressLine3
										: '',
									companyCity: res.data.companyCity ? res.data.companyCity : '',
									companyStateRegion: res.data.companyStateRegion
										? res.data.companyStateRegion
										: '',
									companyPostZipCode: res.data.companyPostZipCode
										? res.data.companyPostZipCode
										: '',
									companyPoBoxNumber: res.data.companyPoBoxNumber
										? res.data.companyPoBoxNumber
										: '',
									companyCountryCode: res.data.companyCountryCode
										? res.data.companyCountryCode
										: '',
									companyExpenseBudget: res.data.companyExpenseBudget
										? res.data.companyExpenseBudget
										: '',
									companyRevenueBudget: res.data.companyRevenueBudget
										? res.data.companyRevenueBudget
										: '',
									dateFormat: res.data.dateFormat ? res.data.dateFormat : '',
									isDesignatedZone: res.data.isDesignatedZone ? res.data.isDesignatedZone : '',
									isRegisteredVat: res.data.isRegisteredVat ? res.data.isRegisteredVat : '',
									companyStateCode: res.data.companyStateCode ? res.data.companyStateCode :'',
									vatRegistrationDate: res.data.vatRegistrationDate
									? res.data.vatRegistrationDate
									: '',
								},
								email: res.data.email
										? res.data.email
										: '',
								companyLogo: res.data.companyLogoByteArray
									? this.state.companyLogo.concat(res.data.companyLogoByteArray)
									: [],
								loading: false,
								flag: false,
								isSame: res.data.isSame ? res.data.isSame : false,
							},
							() => {
								if (res.data.invoicingCountryCode) {
									this.getStateList(res.data.invoicingCountryCode, 'invoicing');
								}
								if (res.data.companyCountryCode) {
									this.getStateList(res.data.companyCountryCode, 'company');
								}
								if (this.state.isSame) {
									this.setState({
										companyAddress: {
											companyAddressLine1: res.data.invoicingAddressLine1
												? res.data.invoicingAddressLine1
												: '',
											companyAddressLine2: res.data.invoicingAddressLine2
												? res.data.invoicingAddressLine2
												: '',
											companyAddressLine3: res.data.invoicingAddressLine3
												? res.data.invoicingAddressLine3
												: '',
											companyCity: res.data.invoicingCity
												? res.data.invoicingCity
												: '',
											companyStateRegion: res.data.invoicingStateRegion
												? res.data.invoicingStateRegion
												: '',
											companyPostZipCode: res.data.invoicingPostZipCode
												? res.data.invoicingPostZipCode
												: '',
											companyPoBoxNumber: res.data.invoicingPoBoxNumber
												? res.data.invoicingPoBoxNumber
												: '',
											companyCountryCode: res.data.invoicingCountryCode
												? res.data.invoicingCountryCode
												: '',
										},
									});
								}
							},
						);
					} else {
						this.setState({
							loading: false,
						});
					}

					if (
						this.state.companyLogo[0] &&
						this.state.companyLogo[0].indexOf('data') < 0
					) {
						this.setState({
							imageState: true,
						});
					} else {
						this.setState({
							imageState: false,
						});
					}
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({
					loading: false,
				});
			});
	};

	resetPassword = (email) => {
		debugger
		
			let data = {
			  method: 'post',
			  url: '/public/forgotPassword',
			  data: { "username": email,url:window.location.href }
			}
			api(data).then((res) => {
			  this.setState({
				alert: <Message
				  type="success"
				  content="We Have Sent You a Verification Email. Please Check Your Mail Box."
				/>
			  },() => {
				  setTimeout(() => {
					this.props.history.push('/login')
				}, 1500);
			  })
			}).catch((err) => {
			  this.setState({
				alert: <Message
				  type="danger"
				  content="Invalid Email Address"
				/>
			  })
			})
		  }
	

	handleCompanySubmit = (data) => {
		const {
			companyName,
			companyRegistrationNumber,
			vatRegistrationNumber,
			companyTypeCode,
			industryTypeCode,
			phoneNumber,
			emailAddress,
			website,
			invoicingAddressLine1,
			invoicingAddressLine2,
			invoicingAddressLine3,
			invoicingCity,
			invoicingStateRegion,
			invoicingPostZipCode,
			invoicingPoBoxNumber,
			invoicingCountryCode,
			currencyCode,
			companyAddressLine1,
			companyAddressLine2,
			companyAddressLine3,
			companyCity,
			companyStateRegion,
			companyPostZipCode,
			companyPoBoxNumber,
			companyCountryCode,
			companyExpenseBudget,
			companyRevenueBudget,
			dateFormat,
			isDesignatedZone,
			isRegisteredVat,
			companyStateCode,
			vatRegistrationDate,
			fax,
			telephoneNumber,
			


		} = data;
		const { companyAddress, isSame } = this.state;
		let formData = new FormData();
		// formData.append("id", companyId);
		formData.append('companyName', companyName ? companyName : '');
		formData.append(
			'companyRegistrationNumber',
			companyRegistrationNumber ? companyRegistrationNumber : '',
		);
		formData.append(
			'vatRegistrationNumber',
			vatRegistrationNumber ? vatRegistrationNumber : '',
		);
		formData.append('companyTypeCode', companyTypeCode ? companyTypeCode : '');
		formData.append(
			'industryTypeCode',
			industryTypeCode ? industryTypeCode : '',
		);
		formData.append('phoneNumber', phoneNumber ? phoneNumber : '');
		formData.append('emailAddress', emailAddress ? emailAddress : '');
		formData.append('website', website ? website : '');
		formData.append(
			'companyExpenseBudget',
			companyExpenseBudget ? companyExpenseBudget : '',
		);
		formData.append(
			'companyRevenueBudget',
			companyRevenueBudget ? companyRevenueBudget : '',
		);
		formData.append(
			'invoicingAddressLine1',
			invoicingAddressLine1 ? invoicingAddressLine1 : '',
		);
		formData.append(
			'invoicingAddressLine2',
			invoicingAddressLine2 ? invoicingAddressLine2 : '',
		);
		formData.append(
			'invoicingAddressLine3',
			invoicingAddressLine3 ? invoicingAddressLine3 : '',
		);
		formData.append('invoicingCity', invoicingCity ? invoicingCity : '');
		formData.append(
			'invoicingStateRegion',
			invoicingStateRegion ? invoicingStateRegion : '',
		);
		formData.append(
			'invoicingPostZipCode',
			invoicingPostZipCode ? invoicingPostZipCode : '',
		);
		formData.append(
			'invoicingPoBoxNumber',
			invoicingPoBoxNumber ? invoicingPoBoxNumber : '',
		);
		formData.append(
			'invoicingCountryCode',
			invoicingCountryCode ? invoicingCountryCode : '',
		);
		formData.append(
			'companyStateCode',
			companyStateCode ? companyStateCode : '',
		);
		formData.append(
			'isDesignatedZone',
			isDesignatedZone ? isDesignatedZone : '',
		);
		formData.append(
			'isRegisteredVat',
			isRegisteredVat ? isRegisteredVat : 0,
		);
		formData.append(
			'vatRegistrationDate',
			vatRegistrationDate !== null ? moment(vatRegistrationDate) : '',
		);
		formData.append(
			'fax',
			fax ? fax : '',
		);
		formData.append(
			'phoneNumber',
			telephoneNumber ? telephoneNumber : '',
		);
		formData.append('currencyCode', currencyCode ? currencyCode : '');
		formData.append('dateFormat', dateFormat ? dateFormat : '');
		formData.append(
			'companyAddressLine1',
			isSame ? companyAddress.companyAddressLine1 : companyAddressLine1,
		);
		formData.append(
			'companyAddressLine2',
			isSame ? companyAddress.companyAddressLine2 : companyAddressLine2,
		);
		formData.append(
			'companyAddressLine3',
			isSame ? companyAddress.companyAddressLine3 : companyAddressLine3,
		);
		formData.append(
			'companyCity',
			isSame ? companyAddress.companyCity : companyCity,
		);
		formData.append(
			'companyStateRegion',
			isSame ? companyAddress.companyStateRegion : companyStateRegion,
		);
		formData.append(
			'companyPostZipCode',
			isSame ? companyAddress.companyPostZipCode : companyPostZipCode,
		);
		formData.append(
			'companyPoBoxNumber',
			isSame ? companyAddress.companyPoBoxNumber : companyPoBoxNumber,
		);
		formData.append(
			'companyCountryCode',
			isSame ? companyAddress.companyCountryCode : '229',
		);
		// formData.append("isSame", isSame);

		if (this.state.companyLogoFile.length > 0) {
			formData.append('companyLogo', this.state.companyLogoFile[0]);
		}
		this.props.profileActions
			.updateCompany(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Company Updated Successfully',
					);
					this.props.history.push('/admin/dashboard');
					this.props.commonActions.getCurrencyList();
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	handlePasswordSubmit = (data) => {
		const {
			currentPassword,
			password,
		} = data;
		let formData = new FormData();
		formData.append('id', this.state.userId ? this.state.userId : '');
		formData.append('currentPassword', currentPassword ? currentPassword : '');
		formData.append('password', password ? password : '');

		this.props.profileActions
			.resetNewpassword(formData)
			.then((res) => {
				debugger
				if (res.status === 200) {
					this.props.history.push('/login');
					this.props.commonActions.tostifyAlert(
						'success',
						'Password Updated Successfully. Please Login With New Password',
					);
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	}

	render() {
		strings.setLanguage(this.state.language);
		const { loading, isSame, timezone ,companyTypeList} = this.state;
		const {
			currency_list,
			country_list,
			role_list,
			invoicing_state_list,
			company_state_list,
		} = this.props;
		return (
			<div className="profile-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="nav-icon fas fa-user" />
												<span className="ml-2">{strings.Profile} </span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<Nav tabs>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '1'}
												onClick={() => {
													this.toggle(0, '1');
												}}
											>
												 {strings.Account}
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '2'}
												onClick={() => {
													this.toggle(0, '2');
												}}
											>
												 {strings.CompanyProfile}
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '3'}
												onClick={() => {
													this.toggle(0, '3');
												}}
											>
												 {strings.ResetPassword}
											</NavLink>
										</NavItem>
									</Nav>
									<TabContent activeTab={this.state.activeTab[0]}>
										<TabPane tabId="1">
											<Row>
												<Col lg={12}>
													{loading ? (
														<Loader />
													) : (
															<Formik
																initialValues={this.state.initUserData}
																onSubmit={(values, { resetForm }) => {
																	this.handleUserSubmit(values);
																	// resetForm(this.state.initValue)

																	// this.setState({
																	//   selectedContactCurrency: null,
																	//   selectedCurrency: null,
																	//   selectedInvoiceLanguage: null
																	// })
																}}
																validationSchema={Yup.object().shape({
																	firstName: Yup.string().required(
																		'First Name is Required',
																	),
																	lastName: Yup.string().required(
																		'Last Name is Required',
																	),
																	email: Yup.string()
																		.required('Email is Required')
																		.email('Invalid Email'),
																	roleId: Yup.string().required(
																		'Role is Required',
																	),
																	timezone: Yup.string().required(
																		'Time Zone is Required',
																	),
																	// password: Yup.string()
																	// 	 .required("Password is Required")
																	// 	// .min(8, "Password Too Short")
																	// 	.matches(
																	// 		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
																	// 		'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
																	// 	),
																	// confirmPassword: Yup.string()
																	// 	 .required('Confirm Password is Required')
																	// 	.oneOf(
																	// 		[Yup.ref('password'), null],
																	// 		'Passwords must match',
																	// 	),
																	dob: Yup.string().required('DOB is Required'),
																})}
															>
																{(props) => (
																	<Form
																		onSubmit={props.handleSubmit}
																		encType="multipart/form-data"
																	>

																		<Row>
																			<Col lg={10}>
																				<Row>
																					<Col lg={6}>
																						<FormGroup>
																							<Label htmlFor="select">
																								<span className="text-danger">
																									*
																							</span> {strings.FirstName}
																						</Label>
																							<Input
																								type="text"
																								id="firstName"
																								name="firstName"
																								onChange={(option) => {
																									if (
																										option.target.value === '' ||
																										this.regExAlpha.test(
																											option.target.value,
																										)
																									) {
																										props.handleChange(
																											'firstName',
																										)(option);
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
																					<Col lg={6}>
																						<FormGroup>
																							<Label htmlFor="select">
																								<span className="text-danger">
																									*
																							</span> {strings.LastName}
																						</Label>
																							<Input
																								type="text"
																								id="lastName"
																								name="lastName"
																								onChange={(option) => {
																									if (
																										option.target.value === '' ||
																										this.regExAlpha.test(
																											option.target.value,
																										)
																									) {
																										props.handleChange(
																											'lastName',
																										)(option);
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
																				<Row>
																					<Col lg={6}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="email">
																								<span className="text-danger">
																									*
																							</span> {strings.EmailID}
																						</Label>
																							<Input
																								type="text"
																								id="email"
																								name="email"
																								placeholder={strings.Enter+strings.EmailID}
																								value={props.values.email}
																								onChange={(value) => {
																									props.handleChange('email')(
																										value,
																									);
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
																							<Label htmlFor="date">
																								<span className="text-danger">
																									*
																							</span> {strings.DateOfBirth}
																						</Label>
																							<DatePicker
																								className={`form-control ${props.errors.dob &&
																										props.touched.dob
																										? 'is-invalid'
																										: ''
																									}`}
																								id="dob "
																								name="dob "
																								showMonthDropdown
																								showYearDropdown
																								dateFormat="dd-MM-yyyy"
																								dropdownMode="select"
																								placeholderText={strings.Enter+strings.DateOfBirth}
																								maxDate={new Date()}
																								autoComplete="off"
																								// selected={props.values.dob}
																								value={
																									props.values.dob
																										? moment(
																											props.values.dob,
																										).format('DD-MM-YYYY')
																										: ''
																								}
																								onChange={(value) => {
																									props.handleChange('dob')(
																										value,
																									);
																								}}
																							/>
																							{props.errors.dob &&
																								props.touched.dob && (
																									<div className="invalid-feedback">
																										{props.errors.dob}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																				</Row>
																				<Row>
																					<Col lg={6}>
																						<FormGroup>
																							<Label htmlFor="roleId">
																							<span className="text-danger">
																									*
																							</span> {strings.Role}</Label>
																							<Select
																								styles={customStyles}
																								options={
																									role_list
																										? selectOptionsFactory.renderOptions(
																											'roleName',
																											'roleCode',
																											role_list,
																											'Role',
																										)
																										: []
																								}
																								value={
																									role_list &&
																									selectOptionsFactory
																										.renderOptions(
																											'roleName',
																											'roleCode',
																											role_list,
																											'Role',
																										)
																										.find(
																											(option) =>
																												option.value ===
																												+props.values.roleId,
																										)
																								}
																								onChange={(option) => {
																									if (option.value) {
																										props.handleChange('roleId')(
																											option.value,
																										);
																									} else {
																										props.handleChange('roleId')(
																											'',
																										);
																									}
																								}}
																								placeholder={strings.Select+strings.Role}
																								id="roleId"
																								name="roleId"
																								className={
																									props.errors.roleId &&
																										props.touched.roleId
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.roleId &&
																								props.touched.roleId && (
																									<div className="invalid-feedback">
																										{props.errors.roleId}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																					<Col lg={6}>
																						<FormGroup>
																							<Label htmlFor="roleId">
																								<span className="text-danger">
																									*
																							</span> {strings.TimeZonePreference}
																						</Label>
																							<Select
																								isDisabled
																								styles={customStyles}
																								options={timezone ? timezone : []}
																								value={
																									timezone &&
																									timezone.find(
																										(option) =>
																											option.value ===
																											props.values.timezone,
																									)
																								}
																								onChange={(option) => {
																									if (option.value) {
																										props.handleChange(
																											'timezone',
																										)(option.value);
																									} else {
																										props.handleChange(
																											'timezone',
																										)('');
																									}
																								}}
																								placeholder={strings.Select+strings.TimeZonePreference}
																								id="timezone"
																								name="timezone"
																								className={
																									props.errors.timezone &&
																										props.touched.timezone
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.timezone &&
																								props.touched.timezone && (
																									<div className="invalid-feedback">
																										{props.errors.timezone}
																									</div>
																								)}
																						</FormGroup>
																					</Col>

																					{/* <FormGroup>
                                          <Label htmlFor="companyId">Company</Label>
                                          <Select
                                            className="select-default-width"
                                            options={company_type_list ? selectOptionsFactory.renderOptions('label', 'value', company_type_list , 'Company') : []}
                                            value={props.values.companyId}
                                            onChange={(option) => props.handleChange('companyId')(option.value)}
                                            placeholder="Select Company"
                                            id="companyId"
                                            name="companyId"
                                            className={
                                              props.errors.companyId && props.touched.companyId
                                                ? "is-invalid"
                                                : ""
                                            }
                                          />
                                          {props.errors.companyId && props.touched.companyId && (
                                            <div className="invalid-feedback">{props.errors.companyId}</div>
                                          )}
      
                                        </FormGroup> */}

																				</Row>
																				<Row>
																					{/* <Col lg={6}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="active">Status</Label>
                                          <div>
                                            <FormGroup check inline>
                                              <div className="custom-radio custom-control">
                                                <input
                                                  className="custom-control-input"
                                                  type="radio"
                                                  id="inline-radio1"
                                                  name="active"
                                                  checked={this.state.selectedStatus}
                                                  value={true}
                                                  onChange={(e) => {
                                                    if(e.target.value) {
                                                      this.setState({selectedStatus: true},() => {
                                                      })
                                                    }
                                                  }}
                                                />
                                                <label className="custom-control-label" htmlFor="inline-radio1">Active</label>
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
                                                  checked={!this.state.selectedStatus}
                                                  onChange={(e) => {
                                                    if(e.target.value === 'false') {
                                                      this.setState({selectedStatus: false})
                                                    }
                                                  }}
                                                />
                                                <label className="custom-control-label" htmlFor="inline-radio2">Inactive</label>
                                              </div>
                                            </FormGroup>
                                          </div>
                                        </FormGroup>
                                      </Col> */}
																				</Row>
																			
																				{/* {this.state.userId !== 1 &&
																				(
																				<Row>
																					<Col lg={6}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="active">
																								Status
																						</Label>
																							<div>
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
																												if (e.target.value) {
																													this.setState(
																														{
																															selectedStatus: true,
																														},
																														() => { },
																													);
																												}
																											}}
																										/>
																										<label
																											className="custom-control-label"
																											htmlFor="inline-radio1"
																										>
																											Active
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
																													e.target.value ===
																													'false'
																												) {
																													this.setState({
																														selectedStatus: false,
																													});
																												}
																											}}
																										/>
																										<label
																											className="custom-control-label"
																											htmlFor="inline-radio2"
																										>
																											Inactive
																									</label>
																									</div>
																								</FormGroup>
																							</div>
																						</FormGroup>
																					</Col>
																				</Row>
																				)} */}
																			</Col>
																			<Col xs="12" md="4" lg={2}>
																				<FormGroup className="mb-3 text-center">
																					<ImageUploader
																						// withIcon={true}
																						buttonText="Choose images"
																						onChange={this.uploadUserImage}
																						imgExtension={[
																							'jpg',																							
																							'png',
																							'jpeg',
																						]}
																						maxFileSize={40000}
																						withPreview={true}
																						singleImage={true}
																						// withIcon={this.state.showIcon}
																						withIcon={false}
																						// buttonText="Choose Profile Image"
																						flipHeight={
																							this.state.userPhoto.length > 0
																								? { height: 'inherit' }
																								: {}
																						}
																						label="'Max file size: 40kb"
																						labelClass={
																							this.state.userPhoto.length > 0
																								? 'hideLabel'
																								: 'showLabel'
																						}
																						buttonClassName={
																							this.state.userPhoto.length > 0
																								? 'hideButton'
																								: 'showButton'
																						}
																						defaultImages={this.state.userPhoto}
																						imageState={this.state.imageState}
																					/>
																				</FormGroup>
																			</Col>
																		</Row>
																		<Row>
																			<Col
																				lg={12}
																				className="mt-5 d-flex flex-wrap align-items-center  justify-content-end"
																			>
																				
																				<FormGroup className="text-right">
																					<Button
																						type="submit"
																						color="primary"
																						className="btn-square mr-3"
																					>
																						<i className="fa fa-dot-circle-o"></i>{' '}
																					 {strings.Update}
																				</Button>
																					<Button
																						color="secondary"
																						className="btn-square"
																						onClick={() => {
																							this.props.history.push(
																								'/admin/dashboard',
																							);
																						}}
																					>
																						<i className="fa fa-ban"></i> {strings.Cancel}
																				</Button>
																				</FormGroup>
																			</Col>
																		</Row>
																	</Form>
																)}
															</Formik>
														)}
												</Col>
											</Row>
										</TabPane>
										<TabPane tabId="2">
											{loading ? (
												<Loader></Loader>
											) : (
													<Row>
														<Col lg="12">
															<Formik
																initialValues={this.state.initCompanyData}
																onSubmit={(values, { resetForm }) => {
																	this.handleCompanySubmit(values);
																	// resetForm(this.state.initValue)

																	// this.setState({
																	//   selectedContactCurrency: null,
																	//   selectedCurrency: null,
																	//   selectedInvoiceLanguage: null
																	// })
																}}
															// validationSchema={Yup.object().shape({
															//   firstName: Yup.()
															//     .required("First Name is Required"),
															//   lastName: Yup.()
															//     .required("Last Name is Required"),
															// })}
															validationSchema={Yup.object().shape({
																companyName: Yup.string().required(
																	'Company Name is required',
																),
																companyRegistrationNumber: Yup.string().required(
																	'Company Registration Number is required',
																),
																vatRegistrationNumber: Yup.string().required(
																	'Tax Registration Number is required')
																	.test(
																		'vatRegistrationNumber',
																		'Invalid TRN',
																		(value) => {
																			if (value > 15) {
																				return true;
																			} else {
																				return false;
																			}
																		},
																	),
																emailAddress: Yup.string()
																	.required('Email is Required')
																	.email('Invalid Email'),
																companyTypeCode: Yup.string().required(
																	'Company/Business Type is required',
																),
																phoneNumber: Yup.string().required(
																	'Mobile Number is required',
																),
																companyAddressLine1: Yup.string().required(
																	'Company Address Line 1 is required',
																),
																// companyAddressLine2: Yup.string().required(
																// 	'Company Address Line 2 is required',
																// ),
																// companyAddressLine3: Yup.string().required(
																// 	'Company Address Line 3 is required',
																// ),
																companyCountryCode: Yup.string().required(
																	'Country is required',
																)
																.nullable(),
																companyStateCode: Yup.string().required(
																	'State is required',
																),
																companyCity: Yup.string().required(
																	'City is required',
																),
																// companyPoBoxNumber: Yup.string().required(
																// 	'PO Box Number is required',
																// ),
																companyPostZipCode: Yup.string().required(
																	'Post Zip Code is required',
																),
															})}
															>
																{(props) => (
																	<Form onSubmit={props.handleSubmit}>
																		<h5 className="mt-3 mb-3">{strings.CompanyDetail}</h5>
																		<Row>
																			<Col lg={2} md={4}>
																				<FormGroup className="mb-3 text-center">
																					{/* <ImagesUploader
                                    url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    optimisticPreviews
                                    multiple={false}
                                    onLoadEnd={(err) => {
                                      if (err) {
                                        console.error(err);
                                      }
                                    }}
                                  /> */}
																					<ImageUploader
																						// withIcon={true}
																						buttonText="Choose images"
																						onChange={this.uploadCompanyImage}
																						imgExtension={[
																							'jpg',
																							'gif',
																							'png',
																							'jpeg',
																						]}
																						maxFileSize={40000}
																						withPreview={true}
																						singleImage={true}
																						// withIcon={this.state.showIcon}
																						withIcon={false}
																						// buttonText="Choose Profile Image"
																						flipHeight={
																							this.state.companyLogo.length > 0
																								? { height: 'inherit' }
																								: {}
																						}
																						label="'Max file size: 40kb"
																						labelClass={
																							this.state.companyLogo.length > 0
																								? 'hideLabel'
																								: 'showLabel'
																						}
																						buttonClassName={
																							this.state.companyLogo.length > 0
																								? 'hideButton'
																								: 'showButton'
																						}
																						defaultImages={this.state.companyLogo}
																						imageState={this.state.imageState}
																					/>
																				</FormGroup>
																			</Col>
																			<Col lg={10}>
																				<Row>
																					<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="product_code">
																							<span className="text-danger">*</span> {strings.CompanyName}
																						</Label>
																							<Input
																								maxLength={150}
																								type="text"
																								id="companyName"
																								name="companyName"
																								placeholder={strings.Enter+strings.CompanyName}
																								value={props.values.companyName}
																								onChange={(option) => {
																									if (
																										option.target.value === '' ||
																										this.regExAlpha.test(
																											option.target.value,
																										)
																									) {
																										props.handleChange(
																											'companyName',
																										)(option);
																									}
																								}}
																								value={props.values.companyName}
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
																					<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="product_code">
																							<span className="text-danger">*</span> {strings.CompanyRegistrationNo}
																						</Label>
																							<Input
																								maxLength={20}
																								type="text"
																								id="companyRegistrationNumber"
																								name="companyRegistrationNumber"
																								placeholder={strings.Enter+strings.CompanyRegistrationNo}
																								value={
																									props.values
																										.companyRegistrationNumber
																								}
																								onChange={(option) => {
																									if (
																										option.target.value === '' ||
																										this.regExBoth.test(option.target.value)
																									) {
																										props.handleChange('companyRegistrationNumber')(
																											option,
																										);
																									} 
																								}
																							}
																							value={props.values.companyRegistrationNumber}
																								className={
																									props.errors.companyRegistrationNumber &&
																									props.touched.companyRegistrationNumber
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.companyRegistrationNumber &&
																								props.touched.companyRegistrationNumber && (
																									<div className="invalid-feedback">
																										{props.errors.companyRegistrationNumber}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																					<Col lg={4}>
																						<FormGroup>
																							<Label htmlFor="companyId">
																							<span className="text-danger">*</span> {strings.CompanyBusinessType}
																						</Label>
																							<Select
																							// isDisabled
																								options={
																									companyTypeList
																										? selectOptionsFactory.renderOptions(
																											'label',
																											'value',
																											companyTypeList,
																											'Company Type',
																										)
																										: []
																								}
																								value={
																									companyTypeList &&
																									companyTypeList.find(
																										(option) =>
																											option.value ===
																											+props.values
																												.companyTypeCode,
																									)
																								}
																								onChange={(option) => {
																									if (option && option.value) {
																										props.handleChange(
																											'companyTypeCode',
																										)(option.value);
																									} else {
																										props.handleChange(
																											'companyTypeCode',
																										)('');
																									}
																								}}
																								placeholder={strings.Enter+strings.CompanyName}
																								id="companyTypeCode"
																								name="companyTypeCode"
																								className={
																									props.errors.companyTypeCode &&
																										props.touched.companyTypeCode
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.companyTypeCode &&
																								props.touched.companyTypeCode && (
																									<div className="invalid-feedback">
																										{props.errors.companyTypeCode}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																					<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="product_code">
																							<span className="text-danger">*</span> {strings.EmailAddress}
																						</Label>
																							<Input
																								maxLength={80}
																								type="text"
																								id="emailAddress"
																								name="emailAddress"
																								placeholder={strings.Enter+strings.Email}
																								value={props.values.emailAddress}
																								onChange={(option) => {
																									props.handleChange(
																										'emailAddress',
																									)(option);
																								}}
																								className={
																									props.errors.emailAddress &&
																										props.touched.emailAddress
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.emailAddress &&
																								props.touched.emailAddress && (
																									<div className="invalid-feedback">
																										{props.errors.emailAddress}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																					<Col lg={4}>
																						<FormGroup>
																							<Label htmlFor="currencyCode">
																							<span className="text-danger">*</span> {strings.CurrencyCode}
																						</Label>
																							<Select
																								isDisabled
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
																												+props.values
																													.currencyCode,
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
																					<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="product_code">
																								{strings.Website}
																						</Label>
																							<Input
																								maxLength={50}
																								type="text"
																								id="website"
																								name="website"
																								placeholder={strings.Enter+strings.Website}
																								value={props.values.website}
																								onChange={(option) => {
																									props.handleChange('website')(
																										option,
																									);
																								}}
																							/>
																						</FormGroup>
																					</Col>
																				</Row>
																				
																				<Row>
																					<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="telephoneNumber">
																					{strings.Telephone}
																				</Label>
																					<Input
																						maxLength={15}
																						type="text"
																						id="telephoneNumber"
																						name="telephoneNumber"
																						placeholder={strings.Enter+"Telephone Number"}
																						value={ props.values.telephoneNumber
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regExTelephone.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'telephoneNumber',
																								)(option);
																							}
																						}}
																						value={props.values.telephoneNumber}
																						className={
																							props.errors.telephoneNumber &&
																							props.touched.telephoneNumber
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.telephoneNumber &&
																						props.touched.telephoneNumber && (
																						<div className="invalid-feedback">
																							{props.errors.telephoneNumber}
																						</div>
																					)}
																				</FormGroup>
																				</Col>
																				<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="phoneNumber">
																							<span className="text-danger">*</span> {strings.MobileNumber}
																						</Label>
																							<PhoneInput
																								country={"ae"}
																								enableSearch={true}
																								international
																								value={props.values.phoneNumber}
																								placeholder={strings.Enter+strings.MobileNumber}
																								onChange={(option) => {
																									props.handleChange(
																										'phoneNumber',
																									)(option);
																								}}
																								isValid
																								// className={
																								// 	props.errors.phoneNumber &&
																								// 		props.touched.phoneNumber
																								// 		? 'is-invalid'
																								// 		: ''
																								// }
																							/>
																							{props.errors.phoneNumber &&
																								props.touched.phoneNumber && (
																									<div style={{color:"red"}}>
																										{props.errors.phoneNumber}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																				</Row>
																				<Row>
																				

																					
																					
																			
																			
																					{/* <Col lg={4}>
																						<FormGroup>
																							<Label htmlFor="industryTypeCode">
																								 {strings.IndustryTypeCode}
																						</Label>
																							<Select
																								options={
																									industry_type_list
																										? selectOptionsFactory.renderOptions(
																											'label',
																											'value',
																											industry_type_list,
																											'Industry Type Code',
																										)
																										: []
																								}
																								value={
																									industry_type_list &&
																									industry_type_list.find(
																										(option) =>
																											option.value ===
																											+props.values
																												.industryTypeCode,
																									)
																								}
																								onChange={(option) => {
																									if (option && option.value) {
																										props.handleChange(
																											'industryTypeCode',
																										)(option.value);
																									} else {
																										props.handleChange(
																											'industryTypeCode',
																										)('');
																									}
																								}}
																								placeholder={strings.Select+strings.IndustryTypeCode}
																								id="industryTypeCode"
																								name="industryTypeCode"
																								className={
																									props.errors.industryTypeCode &&
																										props.touched.industryTypeCode
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.industryTypeCode &&
																								props.touched
																									.industryTypeCode && (
																									<div className="invalid-feedback">
																										{
																											props.errors
																												.industryTypeCode
																										}
																									</div>
																								)}
																						</FormGroup>
																					</Col>
																					 */}
																				</Row>
																				
																				<Row>
																				<Col lg={12}>
																			<h5 className="mt-3 mb-3">{strings.CompanyAddress}</h5>
																			</Col>
																		</Row>
																		<Row style={{ display: props.values.countryName !== 1 ? '' : 'none' }}>
																		<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					<span className="text-danger">*</span> {strings.CompanyAddressLine1}
																				</Label>
																					<Input
																						maxLength={100}
																						type="text"
																						id="companyAddressLine1"
																						name="companyAddressLine1"
																						placeholder={strings.Enter+strings.CompanyAddressLine1}
																						rows="5"
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyAddressLine1
																								: props.values.companyAddressLine1
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'companyAddressLine1',
																							)(option);
																						}}
																						value={props.values.companyAddressLine1}
																						className={
																							props.errors.companyAddressLine1 &&
																							props.touched.companyAddressLine1
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyAddressLine1 &&
																								props.touched.companyAddressLine1 && (
																									<div className="invalid-feedback">
																										{props.errors.companyAddressLine1}
																									</div>
																								)}
																				</FormGroup>
																			</Col>

																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					{/* <span className="text-danger">*</span> */}
																						 {strings.CompanyAddressLine2}
																				</Label>
																					<Input
																						maxLength={100}
																						type="text"
																						id="companyAddressLine2"
																						name="companyAddressLine2"
																						placeholder={strings.Enter+strings.CompanyAddressLine2}
																						rows="5"
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyAddressLine2
																								: props.values.companyAddressLine2
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'companyAddressLine2',
																							)(option);
																						}}
																						value={props.values.companyAddressLine2}
																						className={
																							props.errors.companyAddressLine2 &&
																							props.touched.companyAddressLine2
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyAddressLine2 &&
																								props.touched.companyAddressLine2 && (
																									<div className="invalid-feedback">
																										{props.errors.companyAddressLine2}
																									</div>
																								)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="companyPostZipCode">
																					<span className="text-danger">*</span> {strings.PostZipCode}
																				</Label>
																					<Input
																						maxLength={8}
																						type="text"
																						id="companyPostZipCode"
																						name="companyPostZipCode"
																						placeholder={strings.Enter+strings.PostZipCode}
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyPostZipCode
																								: props.values.companyPostZipCode
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'companyPostZipCode',
																								)(option);
																							}
																						}}
																						value={props.values.companyPostZipCode}
																						className={
																							props.errors.companyPostZipCode &&
																							props.touched.companyPostZipCode
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyPostZipCode &&
																						props.touched.companyPostZipCode && (
																						<div className="invalid-feedback">
																							{props.errors.companyPostZipCode}
																						</div>
																					)}
																				</FormGroup>
																			</Col>

																			<Col lg={4}>
																				<FormGroup>
																					<Label htmlFor="companyCountryCode">
																					<span className="text-danger">*</span> {strings.CountryCode}
																						{/* <Col> */}
																				
																			{/* </Col> */}
																				</Label>
																					<Select
																						isDisabled
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
																							isSame
																								? country_list &&
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
																											+this.state.companyAddress
																												.companyCountryCode,
																									)
																								: country_list &&
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
																											+props.values
																												.companyCountryCode,
																									)
																						}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange(
																									'companyCountryCode',
																								)(option.value, 'company');
																								props.handleChange(
																									'companyStateCode',
																								)('');
																								this.getStateList(
																									option.value,
																									'company',
																								);
																							} else {
																								props.handleChange(
																									'companyCountryCode',
																								)('');
																								props.handleChange(
																									'companyStateCode',
																								)('');
																							}
																						}}
																						placeholder={strings.Select+strings.CountryCode}
																						id="companyCountryCode"
																						name="companyCountryCode"
																						className={
																							props.errors.companyCountryCode &&
																								props.touched.companyCountryCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.companyCountryCode &&
																						props.touched.companyCountryCode && (
																							<div className="invalid-feedback">
																								{props.errors.companyCountryCode}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					<span className="text-danger">*</span> {props.values.companyCountryCode === 229 ? strings.Emirates : strings.StateRegion}
																				</Label>
																					<Select
																						options={selectOptionsFactory.renderOptions(
																							'label',
																							'value',
																							isSame
																								? invoicing_state_list
																								: company_state_list,
																							'Emirates',
																						)}
																						value={
																							isSame
																								? invoicing_state_list.find(
																									(option) =>
																										option.value ===
																										+this.state.companyAddress
																											.companyStateCode,
																								)
																								: company_state_list.find(
																									(option) =>
																										option.value ===
																										+props.values
																											.companyStateCode,
																								)
																						}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange(
																									'companyStateCode',
																								)(option.value);
																							} else {
																								props.handleChange(
																									'companyStateCode',
																								)('');
																							}
																						}}
																						placeholder={strings.Select+strings.Emirates}
																						id="companyStateCode"
																						name="companyStateCode"
																						className={
																							props.errors.companyStateCode &&
																								props.touched.companyStateCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.companyStateCode &&
																						props.touched.companyStateCode && (
																							<div className="invalid-feedback">
																								{props.errors.companyStateRegion}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="companyCity">
																					<span className="text-danger">*</span> {strings.City}
																				</Label>
																					<Input
																						maxLength={20}
																						type="text"
																						id="companyCity"
																						name="companyCity"
																						placeholder={strings.Enter+strings.City}
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyCity
																								: props.values.companyCity
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regExAlpha1.test(
																									option.target.value,
																								)
																							) {
																								option = upperFirst(option.target.value)
																								props.handleChange('companyCity')(option);
																							}
																						}}
																						value={props.values.companyCity}
																						className={
																							props.errors.companyCity &&
																							props.touched.companyCity
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyCity &&
																						props.touched.companyCity && (
																						<div className="invalid-feedback">
																							{props.errors.companyCity}
																						</div>
																					)}
																				</FormGroup>
																			</Col>
																			
																		</Row>
																		
																		<Row>

																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="companyPoBoxNumber">
																					{/* <span className="text-danger">*</span> */}
																						 {strings.POBoxNumber}
																				</Label>
																					<Input
																						maxLength={6}
																						type="text"
																						id="companyPoBoxNumber"
																						name="companyPoBoxNumber"
																						placeholder={strings.Enter+strings.POBoxNumber}
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyPoBoxNumber
																								: props.values.companyPoBoxNumber
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'companyPoBoxNumber',
																								)(option);
																							}
																						}}
																						value={props.values.companyPoBoxNumber}
																						className={
																							props.errors.companyPoBoxNumber &&
																							props.touched.companyPoBoxNumber
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyPoBoxNumber &&
																						props.touched.companyPoBoxNumber && (
																						<div className="invalid-feedback">
																							{props.errors.companyPoBoxNumber}
																						</div>
																					)}
																				</FormGroup>
																				
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="fax">
																					{/* <span className="text-danger">*</span> */}
																					{strings.Fax}
																				</Label>
																					<Input
																						maxLength={8}
																						type="text"
																						id="fax"
																						name="fax"
																						placeholder={strings.Enter+"Fax"}
																						rows="5"

																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								option = upperFirst(option.target.value)
																								props.handleChange('fax')(option);
																							}
																						}}
																						value={props.values.fax}
																				
																					/>
																				
																				</FormGroup>
																			</Col>
																		</Row>


																		<Row className={"mt-3"}>
																			<Col lg={4}>
																				<FormGroup className="mb-3" check inline >
																					<div>
																						<Input
																							// className="custom-control-input"
																							type="checkbox"
																							id="inline-radio2"
																							name="SMTP-auth"
																							// value={props.values.isDesignatedZone}
																							checked={props.values.isDesignatedZone}
																							onChange={(value) => {
																								if(value != null){
																								props.handleChange('isDesignatedZone')(
																									value,
																								);
																								}else{
																									props.handleChange('isDesignatedZone')(
																										'',
																									);
																								}
																							}}
																						/>
																						<label htmlFor="inline-radio2">
																						{strings.CompanyLoatedInDesignatedZone}
																					</label>
																					</div>
																				</FormGroup>
																				</Col>
																				<Col lg={4}>
																				<FormGroup check inline className="mb-3">
																					<div>
																						<Input
																							// className="custom-control-input"
																							type="checkbox"
																							id="inline-radio1"
																							name="SMTP-auth"
																							checked={props.values.isRegisteredVat}
																							onChange={(value) => {
																								if(value != null){
																								props.handleChange('isRegisteredVat')(
																									value,
																								);
																								}else{
																									props.handleChange('isRegisteredVat')(
																										'',
																									);
																								}
																							}}
																						/>
																						<label htmlFor="inline-radio1">
																						{strings.CompanyVatRegistered}
																					</label>
																					</div>
																				</FormGroup>
																			</Col>
																		</Row>
																		
																		<Row style={{display: props.values.isRegisteredVat === true ? '' : 'none'}}>
																			<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="product_code">
																							<span className="text-danger">*</span> {strings.TaxRegistrationNumber}
																						</Label>
																							<Input
																								type="text"
																								id="vatRegistrationNumber"
																								minLength="15"
																								maxLength="15"
																								name="vatRegistrationNumber"
																								placeholder={strings.Enter+strings.TaxRegistrationNumber}
																								value={
																									props.values
																										.vatRegistrationNumber
																								}
																								onChange={(option) => {
																									if (
																										option.target.value === '' ||
																										this.regEx.test(option.target.value)
																									) {
																										props.handleChange('vatRegistrationNumber')(
																											option,
																										);
																									} 
																								}
																							}
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
																					<Col lg={4}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="expense_date">
																			<span className="text-danger">*</span> {strings.VatRegisteredOn}
																		</Label>
																		<DatePicker
																			id="date"
																			minDate={new Date("01/01/2018")}
																			name="vatRegistrationDate"
																			className={`form-control ${
																				props.errors.vatRegistrationDate &&
																				props.touched.vatRegistrationDate
																					? 'is-invalid'
																					: ''
																			}`}
																			
																			value={moment(
																				props.values.vatRegistrationDate,
																			).format('DD-MM-YYYY')}
																			showMonthDropdown
																			showYearDropdown
																			dropdownMode="select"
																			dateFormat="dd-MM-yyyy"
																		 maxDate={new Date()}
																			onChange={(value) => {
																				props.handleChange('vatRegistrationDate')(
																					value,
																				);
																			}}
																		/>
																		{props.errors.vatRegistrationDate &&
																			props.touched.vatRegistrationDate && (
																				<div className="invalid-feedback">
																					{props.errors.vatRegistrationDate}
																				</div>
																			)}
																	</FormGroup>
																</Col>
																					{/* <Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="date">
																			<span className="text-danger">*</span>
																			Vat Registration Date
																		</Label>
																		<DatePicker
																			id="vatRegistrationDate"
																			name="vatRegistrationDate"
																			showMonthDropdown
																			showYearDropdown
																			dateFormat="dd-MM-yyyy"
																			dropdownMode="select"
																			 value={props.values.vatRegistrationDate}
																			 selected={new Date(props.values.vatRegistrationDate)} 
																			
																			onChange={(value) => {
																			
																				props.handleChange('vatRegistrationDate')(
																					value
																				);
																				this.setDate(props, value);
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
																</Col> */}
																			
																			
																		
																		</Row>

																		
																		
																			</Col>
																		</Row>

																		{/* <h5 className="mt-3 mb-3">{strings.CompanyCost}</h5>
																		<Row>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																						 {strings.ExpenseBudget}
																				</Label>
																					<Input
																						type="text"
																						id="companyExpenseBudget"
																						name="companyExpenseBudget"
																						placeholder={strings.Enter+strings.ExpenseBudget}
																						value={
																							props.values.companyExpenseBudget
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'companyExpenseBudget',
																								)(option);
																							}
																						}}
																					/>
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																						 {strings.RevenueBudget}
																				</Label>
																					<Input
																						type="text"
																						id="companyRevenueBudget"
																						name="companyRevenueBudget"
																						placeholder={strings.Enter+strings.RevenueBudget}
																						value={
																							props.values.companyRevenueBudget
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'companyRevenueBudget',
																								)(option);
																							}
																						}}
																					/>
																				</FormGroup>
																			</Col>
																		</Row> */}

																		{/* <h5 className="mt-3 mb-3">
																			{strings.InvoicingAddress}
																	</h5>
																		<Row>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																						{strings.InvoicingAddressLine1}
																				</Label>
																					<Input
																						type="textarea"
																						id="invoicingAddressLine1"
																						name="invoicingAddressLine1"
																						placeholder={strings.Enter+strings.InvoicingAddressLine1}
																						rows="5"
																						value={
																							props.values.invoicingAddressLine1
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'invoicingAddressLine1',
																							)(option);
																							this.setState({
																								companyAddress: {
																									...this.state.companyAddress,
																									...{
																										companyAddressLine1:
																											option.target.value,
																									},
																								},
																							});
																						}}
																					/>
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					 {strings.InvoicingAddressLine2}
																				</Label>
																					<Input
																						type="textarea"
																						id="categoryDiscription"
																						name="categoryDiscription"
																						placeholder={strings.Enter+strings.InvoicingAddressLine2}
																						rows="5"
																						value={
																							props.values.invoicingAddressLine2
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'invoicingAddressLine2',
																							)(option);
																							this.setState({
																								companyAddress: {
																									...this.state.companyAddress,
																									...{
																										companyAddressLine2:
																											option.target.value,
																									},
																								},
																							});
																						}}
																					/>
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																						{strings.InvoicingAddressLine3}
																				</Label>
																					<Input
																						type="textarea"
																						id="categoryDiscription"
																						name="categoryDiscription"
																						placeholder={strings.Enter+strings.InvoicingAddressLine3}
																						rows="5"
																						value={
																							props.values
																								.invoicingAddressLine3 || ''
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'invoicingAddressLine3',
																							)(option);
																							this.setState({
																								companyAddress: {
																									...this.state.companyAddress,
																									...{
																										companyAddressLine3:
																											option.target.value,
																									},
																								},
																							});
																						}}
																					/>
																				</FormGroup>
																			</Col>
																		</Row>

																		<Row>
																			<Col lg={4}>
																				<FormGroup>
																					<Label htmlFor="invoicingCountryCode">
																						 {strings.CountryCode}
																				</Label>
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
																										+props.values
																											.invoicingCountryCode,
																								)
																						}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange(
																									'invoicingCountryCode',
																								)(option.value);
																								props.handleChange(
																									'invoicingStateRegion',
																								)('');
																								this.getStateList(
																									option.value,
																									'invoicing',
																								);
																								this.setState({
																									companyAddress: {
																										...this.state.companyAddress,
																										...{
																											companyCountryCode:
																												option.value,
																											companyStateRegion: '',
																										},
																									},
																								});
																							} else {
																								props.handleChange(
																									'invoicingCountryCode',
																								)('');
																								props.handleChange(
																									'invoicingStateRegion',
																								)('');
																								this.setState({
																									companyAddress: {
																										...this.state.companyAddress,
																										...{
																											companyCountryCode: '',
																											companyStateRegion: '',
																										},
																									},
																								});
																							}
																						}}
																						placeholder={strings.Select+strings.CountryCode}
																						id="invoicingCountryCode"
																						name="invoicingCountryCode"
																						className={
																							props.errors.invoicingCountryCode &&
																								props.touched.invoicingCountryCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.invoicingCountryCode &&
																						props.touched
																							.invoicingCountryCode && (
																							<div className="invalid-feedback">
																								{
																									props.errors
																										.invoicingCountryCode
																								}
																							</div>
																						)}
																				</FormGroup>
																			</Col> */}
																			{/* <Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																						 {strings.StateRegion}
																				</Label> */}
																					{/* <Input
                                            type="text"
                                            id="invoicingStateRegion"
                                            name="invoicingStateRegion"
                                            placeholder="Enter State Region"
                                            value={props.values.invoicingStateRegion || ''}
                                            onChange={(option) => {
                                              props.handleChange('invoicingStateRegion')(option)
                                              this.setState({
                                                companyAddress: {
                                                  ...this.state.companyAddress, ...{
                                                    companyStateRegion: option.target.value
                                                  }
                                                }
                                              })
                                            }}
                                          /> */}
																					{/* <Select
																						options={
																							invoicing_state_list
																								? selectOptionsFactory.renderOptions(
																									'label',
																									'value',
																									invoicing_state_list,
																									'State',
																								)
																								: []
																						}
																						value={
																							invoicing_state_list &&
																							invoicing_state_list.find(
																								(option) =>
																									option.value ===
																									+props.values
																										.invoicingStateRegion,
																							)
																						}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange(
																									'invoicingStateRegion',
																								)(option.value);
																								// props.handleChange('companyStateRegion')(option.value)
																								this.setState({
																									companyAddress: {
																										...this.state.companyAddress,
																										...{
																											companyStateRegion:
																												option.value,
																										},
																									},
																								});
																							} else {
																								props.handleChange(
																									'invoicingStateRegion',
																								)('');
																								// props.handleChange('companyStateRegion')('')
																								this.setState({
																									companyAddress: {
																										...this.state.companyAddress,
																										...{
																											companyStateRegion: '',
																										},
																									},
																								});
																							}
																						}}
																						placeholder={strings.Select+strings.StateRegion}
																						id="invoicingStateRegion"
																						name="invoicingStateRegion"
																						className={
																							props.errors.invoicingStateRegion &&
																								props.touched.invoicingStateRegion
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.invoicingStateRegion &&
																						props.touched
																							.invoicingStateRegion && (
																							<div className="invalid-feedback">
																								{
																									props.errors
																										.invoicingStateRegion
																								}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					{strings.City}
																				</Label>
																					<Input
																						type="text"
																						id="invoicingCity"
																						name="invoicingCity"
																						placeholder={strings.Enter+strings.City}
																						value={
																							props.values.invoicingCity || ''
																						}
																						onChange={(option) => {
																							props.handleChange('invoicingCity')(
																								option,
																							);
																							this.setState({
																								companyAddress: {
																									...this.state.companyAddress,
																									...{
																										companyCity:
																											option.target.value,
																									},
																								},
																							});
																						}}
																					/>
																				</FormGroup>
																			</Col>
																		</Row>
																		<Row>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="invoicingPoBoxNumber">
																						 {strings.POBoxNumber}
																				</Label>
																					<Input
																						type="text"
																						id="invoicingPoBoxNumber"
																						name="invoicingPoBoxNumber"
																						placeholder={strings.Enter+strings.POBoxNumber}
																						value={
																							props.values.invoicingPoBoxNumber ||
																							''
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regExBoth.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'invoicingPoBoxNumber',
																								)(option);
																								this.setState({
																									companyAddress: {
																										...this.state.companyAddress,
																										...{
																											companyPoBoxNumber:
																												option.target.value,
																										},
																									},
																								});
																							}
																						}}
																					/>
																				</FormGroup>
																			</Col> */}
																			{/* <Col lg={4}> */}
																				{/* <FormGroup className="mb-3">
																					<Label htmlFor="invoicingPostZipCode">
																						{strings.PostZipCode}
																				</Label>
																					<Input
																						type="text"
																						id="invoicingPostZipCode"
																						name="invoicingPostZipCode"
																						placeholder={strings.Enter+strings.PostZipCode}
																						value={
																							props.values.invoicingPostZipCode ||
																							''
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'invoicingPostZipCode',
																								)(option);
																								this.setState({
																									companyAddress: {
																										...this.state.companyAddress,
																										...{
																											companyPostZipCode:
																												option.target.value,
																										},
																									},
																								});
																							}
																						}}
																					/>
																				</FormGroup>
																			</Col> */}
																			{/* <Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="dateFormat">
																						Date Format
																				</Label>
																					<Input
																						type="text"
																						id="dateFormat"
																						name="dateFormat"
																						placeholder="Enter Date Format"
																						value={props.values.dateFormat}
																						showMonthDropdown
																						showYearDropdown
																						dateFormat="dd-MM-yyyy"
																						dropdownMode="select"
																						onChange={(option) => {
																							props.handleChange('dateFormat')(
																								option,
																							);
																						}}
																					/>
																				</FormGroup>
																			</Col> */}
																		{/* </Row> */}

																	
																		{/* <Row className={"mt-4"}>
																		<Col lg={12}>
																		<FormGroup check inline >
																					<div>
																						<Input
																							// className="custom-control-input"
																							type="checkbox"
																							id="inline-radio2"
																							name="SMTP-auth"
																							// value={props.values.isDesignatedZone}
																							checked={props.values.isDesignatedZone}
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
																						/>
																						<label htmlFor="inline-radio2">
																						{strings.CompanyLoatedInDesignatedZone}
																					</label>
																					</div>
																				</FormGroup>
																				</Col>
																		</Row> */}
																		{/* <Row>
																			<Col lg={12}>
																				<FormGroup check inline className="mb-3">
																					<div>
																						<Input
																							// className="custom-control-input"
																							type="checkbox"
																							id="inline-radio1"
																							name="SMTP-auth"
																							checked={props.values.isRegisteredVat}
																							onChange={(value) => {
																								if(value != null){
																								props.handleChange('isRegisteredVat')(
																									value,
																								);
																								}else{
																									props.handleChange('isRegisteredVat')(
																										'',
																									);
																								}
																							}}
																						/>
																						<label htmlFor="inline-radio1">
																						{strings.CompanyVatRegistered}
																					</label>
																					</div>
																				</FormGroup>
																			</Col>
																		</Row> */}

																		{/* <Row style={{display: props.values.isRegisteredVat === true ? '' : 'none'}}>
																			<Col lg={4}>
																						<FormGroup className="mb-3">
																							<Label htmlFor="product_code">
																							<span className="text-danger">*</span>
																							 {strings.TaxRegistrationNumber}
																						</Label>
																							<Input
																								type="text"
																								id="vatRegistrationNumber"
																								maxLength="15"
																								name="vatRegistrationNumber"
																								placeholder={strings.Enter+strings.TaxRegistrationNumber}
																								value={
																									props.values
																										.vatRegistrationNumber
																								}
																								onChange={(option) => {
																									if (
																										option.target.value === '' ||
																										this.regEx.test(option.target.value)
																									) {
																										props.handleChange('vatRegistrationNumber')(
																											option,
																										);
																									} else {
																										props.handleChange('vatRegistrationNumber')(
																											option,
																										);
																								}}
																							}
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
																						</FormGroup>
																					</Col>
																					<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="expense_date">
																			<span className="text-danger">*</span>
																			Vat Registered On 
																		</Label>
																		<DatePicker
																			id="date"
																			name="vatRegistrationDate"
																			className={`form-control ${
																				props.errors.vatRegistrationDate &&
																				props.touched.vatRegistrationDate
																					? 'is-invalid'
																					: ''
																			}`}
																			
																			value={moment(
																				props.values.vatRegistrationDate,
																			).format('DD-MM-YYYY')}
																			showMonthDropdown
																			showYearDropdown
																			dropdownMode="select"
																			dateFormat="dd-MM-yyyy"
																		 maxDate={new Date()}
																			onChange={(value) => {
																				props.handleChange('vatRegistrationDate')(
																					value,
																				);
																			}}
																		/>
																		{props.errors.vatRegistrationDate &&
																			props.touched.vatRegistrationDate && (
																				<div className="invalid-feedback">
																					{props.errors.vatRegistrationDate}
																				</div>
																			)}
																	</FormGroup>
																</Col> */}
																					{/* <Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="date">
																			<span className="text-danger">*</span>
																			Vat Registration Date
																		</Label>
																		<DatePicker
																			id="vatRegistrationDate"
																			name="vatRegistrationDate"
																			showMonthDropdown
																			showYearDropdown
																			dateFormat="dd-MM-yyyy"
																			dropdownMode="select"
																			 value={props.values.vatRegistrationDate}
																			 selected={new Date(props.values.vatRegistrationDate)} 
																			
																			onChange={(value) => {
																			
																				props.handleChange('vatRegistrationDate')(
																					value
																				);
																				this.setDate(props, value);
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
																</Col> */}
																			{/* </Row> */}
																		{/* <h5 className="mt-3 mb-3">{strings.CompanyAddress}</h5>
																		<Row>
																			
																		
																		</Row> */}

																		{/* <Row style={{ display: props.values.countryName !== 1 ? '' : 'none' }}>
																		<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					<span className="text-danger">*</span>
																						 {strings.CompanyAddressLine1}
																				</Label>
																					<Input
																						type="text"
																						id="companyAddressLine1"
																						name="companyAddressLine1"
																						placeholder={strings.Enter+strings.CompanyAddressLine1}
																						rows="5"
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyAddressLine1
																								: props.values.companyAddressLine1
																						}
																						onChange={(option) => {
																							props.handleChange(
																								'companyAddressLine1',
																							)(option);
																						}}
																						value={props.values.companyAddressLine1}
																						className={
																							props.errors.companyAddressLine1 &&
																							props.touched.companyAddressLine1
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyAddressLine1 &&
																								props.touched.companyAddressLine1 && (
																									<div className="invalid-feedback">
																										{props.errors.companyAddressLine1}
																									</div>
																								)}
																				</FormGroup>
																			</Col>
																			

																			<Col lg={4}>
																				<FormGroup>
																					<Label htmlFor="companyCountryCode">
																					<span className="text-danger">*</span>
																						{strings.CountryCode} */}
																						{/* <Col> */}
																				
																			{/* </Col> */}
																				{/* </Label>
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
																							isSame
																								? country_list &&
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
																											+this.state.companyAddress
																												.companyCountryCode,
																									)
																								: country_list &&
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
																											+props.values
																												.companyCountryCode,
																									)
																						}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange(
																									'companyCountryCode',
																								)(option.value, 'company');
																								props.handleChange(
																									'companyStateCode',
																								)('');
																								this.getStateList(
																									option.value,
																									'company',
																								);
																							} else {
																								props.handleChange(
																									'companyCountryCode',
																								)('');
																								props.handleChange(
																									'companyStateCode',
																								)('');
																							}
																						}}
																						placeholder={strings.Select+strings.CountryCode}
																						id="companyCountryCode"
																						name="companyCountryCode"
																						className={
																							props.errors.companyCountryCode &&
																								props.touched.companyCountryCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.companyCountryCode &&
																						props.touched.companyCountryCode && (
																							<div className="invalid-feedback">
																								{props.errors.companyCountryCode}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="product_code">
																					<span className="text-danger">*</span>
																						{props.values.companyCountryCode === 229 ? strings.Emirates : strings.StateRegion}
																				</Label>
																					<Select
																						options={selectOptionsFactory.renderOptions(
																							'label',
																							'value',
																							isSame
																								? invoicing_state_list
																								: company_state_list,
																							'State/Province',
																						)}
																						value={
																							isSame
																								? invoicing_state_list.find(
																									(option) =>
																										option.value ===
																										+this.state.companyAddress
																											.companyStateCode,
																								)
																								: company_state_list.find(
																									(option) =>
																										option.value ===
																										+props.values
																											.companyStateCode,
																								)
																						}
																						onChange={(option) => {
																							if (option && option.value) {
																								props.handleChange(
																									'companyStateCode',
																								)(option.value);
																							} else {
																								props.handleChange(
																									'companyStateCode',
																								)('');
																							}
																						}}
																						placeholder={strings.Select+strings.StateRegion}
																						id="companyStateCode"
																						name="companyStateCode"
																						className={
																							props.errors.companyStateCode &&
																								props.touched.companyStateCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.companyStateCode &&
																						props.touched.companyStateCode && (
																							<div className="invalid-feedback">
																								{props.errors.companyStateRegion}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																			
																		</Row> */}
																		{/* <Row>
																		<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="companyCity">
																					<span className="text-danger">*</span>
																						 {strings.City}
																				</Label>
																					<Input
																						type="text"
																						id="companyCity"
																						name="companyCity"
																						placeholder={strings.Enter+strings.City}
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyCity
																								: props.values.companyCity
																						}
																						onChange={(option) => {
																							props.handleChange('companyCity')(
																								option,
																							);
																						}}
																						value={props.values.companyCity}
																						className={
																							props.errors.companyCity &&
																							props.touched.companyCity
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyCity &&
																						props.touched.companyCity && (
																						<div className="invalid-feedback">
																							{props.errors.companyCity}
																						</div>
																					)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="companyPostZipCode">
																					<span className="text-danger">*</span>
																						 {strings.PostZipCode}
																				</Label>
																					<Input
																						type="text"
																						id="companyPostZipCode"
																						name="companyPostZipCode"
																						placeholder={strings.Enter+strings.PostZipCode}
																						value={
																							isSame
																								? this.state.companyAddress
																									.companyPostZipCode
																								: props.values.companyPostZipCode
																						}
																						onChange={(option) => {
																							if (
																								option.target.value === '' ||
																								this.regEx.test(
																									option.target.value,
																								)
																							) {
																								props.handleChange(
																									'companyPostZipCode',
																								)(option);
																							}
																						}}
																						value={props.values.companyPostZipCode}
																						className={
																							props.errors.companyPostZipCode &&
																							props.touched.companyPostZipCode
																							? 'is-invalid'
																							: ''
																						}
																					/>
																					{props.errors.companyPostZipCode &&
																						props.touched.companyPostZipCode && (
																						<div className="invalid-feedback">
																							{props.errors.companyPostZipCode}
																						</div>
																					)}
																				</FormGroup>
																			</Col>
																			<Col lg={4}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="fax"> */}
																					{/* <span className="text-danger">*</span> */}
																						{/* Fax
																				</Label>
																					<Input
																						type="text"
																						id="fax"
																						name="fax"
																						placeholder={strings.Enter+"Fax"}
																						rows="5"
																						
																						onChange={(option) => {
																							props.handleChange(
																								'fax',
																							)(option);
																						}}
																						value={props.values.fax}
																				
																					/>
																				
																				</FormGroup>
																			</Col>
																		</Row> */}

																		<Row>
																			<Col lg={12} className="mt-5">
																				<FormGroup className="text-right">
																					<Button
																						type="submit"
																						color="primary"
																						className="btn-square mr-3"
																					>
																						<i className="fa fa-dot-circle-o"></i>{' '}
																					 {strings.Update}
																				</Button>
																					<Button
																						color="secondary"
																						className="btn-square"
																						onClick={() => {
																							this.props.history.push(
																								'/admin/dashboard',
																							);
																						}}
																					>
																						<i className="fa fa-ban"></i>  {strings.Cancel}
																				</Button>
																				</FormGroup>
																			</Col>
																		</Row>
																	</Form>
																)}
															</Formik>
														</Col>
													</Row>
												)}
										</TabPane>
										<TabPane tabId="3">{loading ? (
												<Loader></Loader>
											) : (
												<Row>
													<Col lg="12">
													<Formik
																// initialValues={this.state.initCompanyData}
																onSubmit={(values, { resetForm }) => {
																	this.handlePasswordSubmit(values);
																	// resetForm(this.state.initValue)

																	// this.setState({
																	//   selectedContactCurrency: null,
																	//   selectedCurrency: null,
																	//   selectedInvoiceLanguage: null
																	// })
																}}
															// validationSchema={Yup.object().shape({
															//   firstName: Yup.()
															//     .required("First Name is Required"),
															//   lastName: Yup.()
															//     .required("Last Name is Required"),
															// })}
															// // validationSchema={Yup.object().shape({
															// // 	password: Yup.string()
															// // 		 .required("Password is Required")
															// // 		// .min(8, "Password Too Short")
															// // 		.matches(
															// // 			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
															// // 			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
															// // 		),
															// // 	confirmPassword: Yup.string()
															// // 		 .required('Confirm Password is Required')
															// // 		.oneOf(
															// // 			[Yup.ref('password'), null],
															// // 			'Passwords must match',
															// // 		),
															// })}

															>
																{(props) => (
																	<Form
																		onSubmit={props.handleSubmit}
																		encType="multipart/form-data"
																	>

																		<Row>
																			<Col lg={10}>
																				<Row>
																				<Col lg={4}>
																						<FormGroup>
																							<Label htmlFor="select">
																							<span className="text-danger">
																									*
																							</span> {strings.CurrentPassword}
																						</Label>
																							<Input
																								type="password"
																								id="currentPassword"
																								name="currentPassword"
																								autoComplete="current-password"
																								placeholder={strings.Enter+strings.Password}
																								onChange={(value) => {
																									props.handleChange('currentPassword')(
																										value,
																									);
																								}}
																								className={
																									props.errors.currentPassword &&
																										props.touched.currentPassword
																										? 'is-invalid'
																										: ''
																								}
																							/>
																							{props.errors.currentPassword &&
																								props.touched.currentPassword ? (
																									<div className="invalid-feedback">
																										{props.errors.currentPassword}
																									</div>
																								) : (
																									<span className="password-msg">
																										{/* Must Contain 8 Characters, One
																										Uppercase, One Lowercase, One
																										Number and one special case
																										Character. */}
																									</span>
																								)}
																						</FormGroup>
																					</Col>
																					<Col lg={4}>
																						<FormGroup>
																							<Label htmlFor="select">
																							<span className="text-danger">
																									*
																							</span> {strings.NewPassword}
																						</Label>
																							<Input
																							onPaste={(e)=>{
																								e.preventDefault()
																								return false;
																							  }} onCopy={(e)=>{
																								e.preventDefault()
																								return false;
																							  }}
																							// onselectstart="return false"
																							// oncopy="return false"
																							// ondrop="return false"
																							// onpaste="return false"
																								type="password"
																								id="password"
																								name="password"
																								autoComplete="new-password"
																								placeholder={strings.Enter+strings.Password}
																								onChange={(value) => {
																									props.handleChange('password')(
																										value,
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
																								props.touched.password ? (
																									<div className="invalid-feedback">
																										{props.errors.password}
																									</div>
																								) : (
																									<span className="password-msg">
																										Must Contain 8 Characters, One
																										Uppercase, One Lowercase, One
																										Number and one special case
																										Character.
																									</span>
																								)}
																						</FormGroup>
																					</Col>
																					<Col lg={4}>
																						<FormGroup>
																							<Label htmlFor="select">
																							<span className="text-danger">
																									*
																							</span> {strings.ConfirmPassword}
																						</Label>
																							<Input
																							onPaste={(e)=>{
																								e.preventDefault()
																								return false;
																							  }} onCopy={(e)=>{
																								e.preventDefault()
																								return false;
																							  }}
																							// onselectstart="return false"
																							// oncopy="return false"
																							// ondrop="return false"
																							// onpaste="return false"
																								type="password"
																								id="confirmPassword"
																								name="confirmPassword"
																								placeholder={strings.Enter+strings.ConfirmPassword}
																								onChange={(value) => {
																									props.handleChange(
																										'confirmPassword',
																									)(value);
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
																						</FormGroup>
																					</Col>
																				</Row>
																				
																			</Col>
																			
																		</Row>
																		<Row>
																			<Col
																				lg={12}
																				className="mt-5 d-flex flex-wrap align-items-center  justify-content-end"
																			>
																				<FormGroup className="text-right">
																				{/* <Button
																					color="primary"
																					type="button"
																					className="btn-square mr-3 submit-btn"
																					//   disabled={isSubmitting}
																					onClick={() => { 
																						this.resetPassword(props.values.email) }}
																					>
																					{strings.ResetPassword}
																				</Button> */}
																					<Button
																						type="submit"
																						color="primary"
																						className="btn-square mr-3"
																					>
																						<i className="fa fa-dot-circle-o"></i>{' '}
																					 {strings.Update}
																				</Button>
																					<Button
																						color="secondary"
																						className="btn-square"
																						onClick={() => {
																							this.props.history.push(
																								'/admin/dashboard',
																							);
																						}}
																					>
																						<i className="fa fa-ban"></i> {strings.Cancel}
																				</Button>
																				</FormGroup>
																			</Col>
																		</Row>
																	</Form>
																)}
															</Formik>
												</Col>
											</Row>
											)}</TabPane>
									</TabContent>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
