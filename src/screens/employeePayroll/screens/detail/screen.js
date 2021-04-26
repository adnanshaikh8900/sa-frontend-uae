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
	NavLink,
} from 'reactstrap';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as EmployeeActions from '../../actions';
import * as ProductActions from '../../../product/actions';
import * as EmployeeDetailActions from './actions';
import * as CurrencyConvertActions from '../../../currencyConvert/actions';


import { Loader, ConfirmDeleteModal,Currency, ImageUploader } from 'components';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';

import './style.scss';
import moment from 'moment';
import API_ROOT_URL from '../../../../constants/config';
import PhoneInput from 'react-phone-number-input';

const mapStateToProps = (state) => {
	return {
    salary_role_dropdown : state.employeePayroll.salary_role_dropdown,
    employee_list_dropdown : state.employeePayroll.employee_list_dropdown,
    designation_dropdown : state.employeePayroll.designation_dropdown,
    country_list : state.employeePayroll.country_list,
    state_list : state.employeePayroll.state_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		employeeDetailActions: bindActionCreators(
			EmployeeDetailActions,
			dispatch,
		),
		employeeActions: bindActionCreators(
			EmployeeActions,
			dispatch,
		),

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

class DetailEmployeePayroll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dialog: false,
			disabled: false,
			discountOptions: [
				{ value: 'FIXED', label: 'Fixed' },
				{ value: 'PERCENTAGE', label: 'Percentage' },
			],
      selectedStatus:'',
      current_employee_id: null,
      initValue: {},
      userPhoto: [],
			userPhotoFile: [],
    
		};

		// this.options = {
		//   paginationPosition: 'top'
		// }
		this.formRef = React.createRef();
		this.termList = [
			{ label: 'Net 7 Days', value: 'NET_7' },
			{ label: 'Net 10 Days', value: 'NET_10' },
			{ label: 'Net 30 Days', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
		this.placelist = [
			{ label: 'Abu Dhabi', value: '1' },
			{ label: 'Dubai', value: '2' },
			{ label: 'Sharjah', value: '3' },
			{ label: 'Ajman', value: '4' },
			{ label: 'Umm Al Quwain', value: '5' },
			{ label: 'Ras Al Khalmah', value: '6' },
			{ label: 'Fujairah', value: '7' },
		];
		this.regEx = /^[0-9\b]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;

		this.file_size = 1024000;
		this.supported_format = [
			'image/png',
			'image/jpeg',
			'text/plain',
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];
	}

	componentDidMount = () => {
		this.initializeData();
	};


	initializeData = () => {
     if(this.props.salary_role_dropdown.length ===0)
      { 
        console.log("this.props.salary_role_dropdown null",this.props.salary_role_dropdown)
        this.getEmployeeDesignationForDropdown();
      }
      else{
        console.log("this.props.salary_role_dropdown not null",this.props.salary_role_dropdown)
      }
		if (this.props.location.state && this.props.location.state.id) {
			this.props.employeeDetailActions
				.getEmployeeDetail(this.props.location.state.id)
				.then((res) => {
					if (res.status === 200) {


						this.setState(
							{
                current_employee_id: this.props.location.state.id,
                initValue: {
                  id: res.data.current_employee_id ? res.data.current_employee_id : '',
                  firstName: res.data.firstName && 
                    res.data.firstName !== null ? res.data.firstName : '',
                  middleName: res.data.middleName && 
                    res.data.middleName !== null ? res.data.middleName : '',
                  lastName: res.data.lastName && 
                    res.data.lastName !== null ? res.data.lastName : '',
                  email: res.data.email && 
                    res.data.email !== null ? res.data.email : '',
                  bloodGroup: res.data.bloodGroup &&
                     res.data.bloodGroup !== null ? res.data.bloodGroup : '',
                  dob: res.data.dob &&
                  res.data.dob !== null ? res.data.dob : '',
                  mobileNumber: res.data.mobileNumber &&
                     res.data.mobileNumber !== null ? res.data.mobileNumber : '',
                  gender: res.data.gender && 
                    res.data.gender !== null ? res.data.gender : '',
                  isActive: res.data.isActive && 
                    res.data.isActive !== null ? res.data.isActive : '',
                  permanentAddress: res.data.permanentAddress &&
                     res.data.permanentAddress !== null ? res.data.permanentAddress : '',
                  pincode: res.data.pincode && 
                    res.data.pincode !== null ? res.data.pincode : '',
                  stateId: res.data.stateId && 
                    res.data.stateId !== null ? res.data.stateId : '',
                  city: res.data.city && 
                    res.data.city !== null ? res.data.city : '',
                  salaryRoleId: res.data.salaryRoleId &&
                   res.data.salaryRoleId !== null ? res.data.salaryRoleId : '',
                  employeeDesignationId : res.data.employeeDesignationId && 
                   res.data.employeeDesignationId !== null ? res.data.employeeDesignationId :'',
                  passportNumber : res.data.passportNumber && 
                     res.data.passportNumber !== null ?  res.data.passportNumber: '',
                  passportExpiryDate :  res.data.passportExpiryDate && 
                     res.data.passportExpiryDate !== null ?  res.data.passportExpiryDate: '',
                  visaNumber :  res.data.visaNumber && 
                  res.data.visaNumber !== null ?  res.data.visaNumber: '',
                  visaExpiryDate :  res.data.visaExpiryDate && 
                  res.data.visaExpiryDate !== null ?  res.data.visaExpiryDate: '',
                  presentAddress :  res.data.presentAddress && 
                  res.data.presentAddress !== null ?  res.data.presentAddress: '',
                  countryId :  res.data.countryId && 
                  res.data.countryId !== null ?  res.data.countryId: '',
                  employeeCode :  res.data.employeeCode && 
                  res.data.employeeCode !== null ?  res.data.employeeCode: '',
                  parentId :  res.data.parentId && 
                  res.data.parentId !== null ?  res.data.parentId: '',
                  department :  res.data.department && 
                  res.data.department !== null ?  res.data.department: '',
                  dateOfJoining :  res.data.dateOfJoining && 
                  res.data.dateOfJoining !== null ?  res.data.dateOfJoining: '',
                labourCard : res.data.labourCard && 
                res.data.labourCard !== null ?  res.data.labourCard: '',
                grossSalary: res.data.grossSalary && 
                res.data.grossSalary !== null ?  res.data.grossSalary: '',
                accountHolderName : res.data.accountHolderName && 
                res.data.accountHolderName !== null ?  res.data.accountHolderName: '',
                accountNumber :  res.data.accountNumber && 
                res.data.accountNumber !== null ?  res.data.accountNumber : '',
                bankName : res.data.bankName && 
                res.data.bankName !== null ?  res.data.bankName: '',
                branch :  res.data.branch && 
                res.data.branch !== null ?  res.data.branch: '',
                ibanNumber :  res.data.iban && 
                res.data.iban !== null ?  res.data.iban: '',
                swiftCode :  res.data.swiftCode && 
                res.data.swiftCode !== null ?  res.data.swiftCode: '',
                },
                selectedStatus: res.data.isActive ? true : false,
                userPhoto: res.data.profilePicByteArray
                  ? this.state.userPhoto.concat(res.data.profilePicByteArray)
                  : [],
                loading: false,
							},
						);
					}
				}).catch((err) => {
          this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
        })
		} else {
			this.props.history.push('/admin/payroll/employee');
		}
	};

  getEmployeeDesignationForDropdown =() =>{
    this.props.employeeActions.getSalaryRolesForDropdown();
    this.props.employeeActions.getEmployeeDesignationForDropdown();
    this.props.employeeActions.getEmployeesForDropdown();
    this.props.employeeActions.getCountryList();
  }; 


	




  handleSubmit = (data) => {
    this.setState({ disabled: true });
		const { current_employee_id } = this.state;
    const { userPhotoFile } = this.state;
    const {
      firstName,
      middleName,
      lastName,
      mobileNumber,
      email,
      presentAddress,
      countryId,
      stateId,
      city,
      pincode,
      salaryRoleId,
      employeeDesignationId,
      dob,
      bloodGroup,
      gender,
      passportNumber,
      passportExpiryDate,
      visaNumber,
      employeeCode,
      visaExpiryDate,
      dateOfJoining,
      department,
      labourCard,
      grossSalary,
      accountHolderName,
      accountNumber,
      bankName,
      branch,
      ibanNumber,
      parentId,
      swiftCode
		} = data;

    let formData = new FormData();
    formData.append('id',current_employee_id);

    formData.append('isActive', this.state.selectedStatus);
   	formData.append(
			'firstName',
			firstName !== null ? firstName : '',
		);
    formData.append(
			'middleName',
			middleName !== null ? middleName : '',
		);
    formData.append(
			'lastName',
			lastName !== null ? lastName : '',
		);
    formData.append('dob', dob ? moment(dob).format('DD-MM-YYYY') : '')
    formData.append(
      'mobileNumber',
      mobileNumber !== null ? mobileNumber : '',
    );
    formData.append(
      'email',
      email != null ? email : '',
    )
    formData.append(
      'presentAddress',
      presentAddress != null ? presentAddress : '',
    )
    formData.append(
      'city',
      city != null ? city : '',
    )
    formData.append(
      'pincode',
      pincode != null ? pincode : '',
    )
    formData.append(
      'passportNumber',
      passportNumber != null ? passportNumber : '',
    )
    formData.append(
      'visaNumber',
      visaNumber != null ? visaNumber : '',
    )
    formData.append('passportExpiryDate', passportExpiryDate ? moment(passportExpiryDate).format('DD-MM-YYYY') : '')
    formData.append('visaExpiryDate', visaExpiryDate ? moment(visaExpiryDate).format('DD-MM-YYYY') : '')
  
    formData.append(
      'employeeCode',
      employeeCode != null ? employeeCode : '',
      )
   formData.append('dateOfJoining', dateOfJoining ? moment(dateOfJoining).format('DD-MM-YYYY') : '')
  
     formData.append(
       'department',
       department != null ? department :'',
     )
     formData.append(
       'labourCard',
       labourCard != null ? labourCard : '',
     )
     formData.append(
       'grossSalary',
       grossSalary != null ? grossSalary : '',
     )
     formData.append(
       'accountHolderName',
       accountHolderName != null ? accountHolderName : '',
     )
     formData.append(
       'accountNumber',
       accountNumber != null ? accountNumber : '',
     )
     formData.append(
       'bankName',
       bankName != null ? bankName : '',
     )
     formData.append(
      'branch',
      branch != null ? branch : '',
    )
    formData.append(
      'ibanNumber',
      ibanNumber != null ? ibanNumber : '',
    )
    formData.append(
      'swiftCode',
      swiftCode != null ? swiftCode : '',
    )
    if (this.state.userPhotoFile.length > 0) {
			formData.append('profilePic ', this.state.userPhotoFile[0]);
		}
    if (gender && gender.value) {
			formData.append('gender', gender.value);
		}
    if (parentId && parentId.value) {
			formData.append('parentId', parentId.value);
		}
    if (bloodGroup && bloodGroup.value) {
			formData.append('bloodGroup', bloodGroup.value);
		}
    if (salaryRoleId && salaryRoleId.value) {
			formData.append('salaryRoleId', salaryRoleId.value);
		}
    if (countryId && countryId.value) {
			formData.append('countryId', countryId.value);
		}
    if (stateId && stateId.value) {
			formData.append('stateId', stateId.value);
		}
    if (employeeDesignationId && employeeDesignationId.value) {
			formData.append('employeeDesignationId', employeeDesignationId.value);
		}
    this.props.employeeDetailActions
    .updateEmployee(formData).then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Employee Updated Successfully')
        this.props.history.push('/admin/payroll/employee')
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }

	openCustomerModal = (e) => {
		e.preventDefault();
		this.setState({ openCustomerModal: true });
	};
	openProductModal = (props) => {
		this.setState({ openProductModal: true });
	};

	getCurrentUser = (data) => {
		let option;
		if (data.label || data.value) {
			option = data;
		} else {
			option = {
				label: `${data.fullName}`,
				value: data.id,
			};
		}
		// this.setState({
		//   selectedContact: option
		// })
		this.formRef.current.setFieldValue('contactId', option.value, true);
	};

	closeCustomerModal = (res) => {
		if (res) {
			this.props.customerInvoiceActions.getCustomerList(this.state.contactType);
		}
		this.setState({ openCustomerModal: false });
	};

	closeProductModal = (res) => {
		this.setState({ openProductModal: false });
	};

	getCurrentProduct = () => {
		this.props.customerInvoiceActions.getProductList().then((res) => {
			this.setState(
				{
					data: [
						{
							id: 0,
							description: res.data[0].description,
							quantity: 1,
							unitPrice: res.data[0].unitPrice,
							vatCategoryId: res.data[0].vatCategoryId,
							subTotal: res.data[0].unitPrice,
							productId: res.data[0].id,
						},
					],
				},
				() => {
					const values = {
						values: this.state.initValue,
					};
					this.updateAmount(this.state.data, values);
				},
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.unitPrice`,
				res.data[0].unitPrice,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.quantity`,
				1,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.vatCategoryId`,
				res.data[0].vatCategoryId,
				true,
			);
			this.formRef.current.setFieldValue(
				`lineItemsString.${0}.productId`,
				res.data[0].id,
				true,
			);
		});
	};

	getCompanyCurrency = (basecurrency) => {
		this.props.currencyConvertActions
			.getCompanyCurrency()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ basecurrency: res.data });
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({ loading: false });
			});
	};	

	setExchange = (value) => {
		let result = this.props.currency_convert_list.filter((obj) => {
		return obj.currencyCode === value;
		});
		this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
		};

	deleteInvoice = () => {
		const message1 =
			<text>
			<b>Delete Customer Invoice?</b>
			</text>
			const message = 'This Customer Invoice will be deleted permanently and cannot be recovered. ';
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={this.removeInvoice}
					cancelHandler={this.removeDialog}
					message={message}
					message1={message1}
				/>
			),
		});
	};

	removeInvoice = () => {
		const { current_customer_id } = this.state;
		this.props.customerInvoiceDetailActions
			.deleteInvoice(current_customer_id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Data Deleted Successfully',
					);
					this.props.history.push('/admin/income/customer-invoice');
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

	getCurrency = (opt) => {
		let customer_currencyCode = 0;
		let customer_item_currency = ''
		this.props.customer_list.map(item => {
			if(item.label.contactId == opt) {
				this.setState({
					customer_currency: item.label.currency.currencyCode,
					customer_currency_des: item.label.currency.currencyName,
					customer_currency_symbol: item.label.currency.currencySymbol,
				});

				customer_currencyCode = item.label.currency.currencyCode;
				customer_item_currency = item.label.currency
			}
		})
	
		return customer_currencyCode;
	}

	render() {
		const { data, discountOptions, initValue, loading, dialog } = this.state;

		const { country_list, state_list,designation_dropdown, employee_list_dropdown,salary_role_dropdown } = this.props;

	
		return (
			<div className="detail-customer-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-address-book" />
												<span className="ml-2">Update Invoice</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									{dialog}
									{loading ? (
										<Loader />
									) : (
										<Row>
											<Col lg={12}>
												<Formik
													initialValues={this.state.initValue}
													ref={this.formRef}
													onSubmit={(values, { resetForm }) => {
														this.handleSubmit(values);
													}}
													// validationSchema={Yup.object().shape({
													// 	invoice_number: Yup.string().required(
													// 		'Invoice Number is Required',
													// 	),
													// 	contactId: Yup.string().required(
													// 		'Supplier is Required',
													// 	),
													// 	term: Yup.string().required('term is Required'),
													// //	placeOfSupplyId: Yup.string().required('Place of supply is Required'),
													// 	invoiceDate: Yup.string().required(
													// 		'Invoice Date is Required',
													// 	),
													// 	invoiceDueDate: Yup.string().required(
													// 		'Invoice Due Date is Required',
													// 	),
													// 	currency: Yup.string().required(
													// 		'Currency is Required',
													// 	),
													// 	lineItemsString: Yup.array()
													// 		.required(
													// 			'Atleast one invoice sub detail is mandatory',
													// 		)
													// 		.of(
													// 			Yup.object().shape({
													// 				// description: Yup.string().required(
													// 				// 	'Value is Required',
													// 				// ),
													// 				quantity: Yup.string()
													// 					.required('Value is Required')
													// 					.test(
													// 						'quantity',
													// 						'Quantity Should be Greater than 1',
													// 						(value) => {
													// 							if (value > 0) {
													// 								return true;
													// 							} else {
													// 								return false;
													// 							}
													// 						},
													// 					),
													// 				unitPrice: Yup.string()
													// 					.required('Value is Required')
													// 					.test(
													// 						'Unit Price',
													// 						'Unit Price Should be Greater than 1',
													// 						(value) => {
													// 							if (value > 0) {
													// 								return true;
													// 							} else {
													// 								return false;
													// 							}
													// 						},
													// 					),
													// 				vatCategoryId: Yup.string().required(
													// 					'Value is Required',
													// 				),
													// 				productId: Yup.string().required(
													// 					'Product is Required',
													// 				),
													// 			}),
													// 		),
													// 	attachmentFile: Yup.mixed()
													// 		.test(
													// 			'fileType',
													// 			'*Unsupported File Format',
													// 			(value) => {
													// 				value &&
													// 					this.setState({
													// 						fileName: value.name,
													// 					});
													// 				if (
													// 					!value ||
													// 					(value &&
													// 						this.supported_format.includes(
													// 							value.type,
													// 						))
													// 				) {
													// 					return true;
													// 				} else {
													// 					return false;
													// 				}
													// 			},
													// 		)
													// 		.test(
													// 			'fileSize',
													// 			'*File Size is too large',
													// 			(value) => {
													// 				if (
													// 					!value ||
													// 					(value && value.size <= this.file_size)
													// 				) {
													// 					return true;
													// 				} else {
													// 					return false;
													// 				}
													// 			},
													// 		),
													// })}
												>
													{(props) => (
														  <Form onSubmit={props.handleSubmit}>
                              <Row>
                        <Col xs="4" md="4" lg={2}>
                             <FormGroup className="mb-3 text-center">
                               <ImageUploader
                                 // withIcon={true}
                                 buttonText="Choose images"
                                 onChange={this.uploadImage}
                                 imgExtension={['jpg', 'gif', 'png', 'jpeg']}
                                 maxFileSize={11048576}
                                 withPreview={true}
                                 singleImage={true}
                                 withIcon={this.state.showIcon}
                                 // buttonText="Choose Profile Image"
                                 
                                 label="'Max file size: 1mb"
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
                               />
                             </FormGroup>
                           </Col>
                           <Col lg={10}>
                        <hr />
                         <h4>Personal Details</h4>
                         <hr />
                         <Row  className="row-wrapper">
                           
                           <Col lg={4}>
                             <FormGroup>
                               <Label htmlFor="select"><span className="text-danger">*</span>First Name</Label>
                               <Input
                                 type="text"
                                 id="firstName"
                                 name="firstName"
                                 value={props.values.firstName}
                                 placeholder="Enter First Name"
                                 onChange={(value) => {
                                   props.handleChange('firstName')(value);
                               
                                 }}
                                 className={props.errors.firstName && props.touched.firstName ? "is-invalid" : ""}
                               />
                               {props.errors.firstName && props.touched.firstName && (
                                 <div className="invalid-feedback">{props.errors.firstName}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col lg={4}>
                             <FormGroup>
                               <Label htmlFor="select">Middle Name</Label>
                               <Input
                                 type="text"
                                 id="middleName"
                                 name="middleName"
                                 value={props.values.middleName}
                                 placeholder="Enter Middle Name"
                                 onChange={(value) => {
                                   props.handleChange('middleName')(value);
                               
                                 }}
                                 className={props.errors.middleName && props.touched.middleName ? "is-invalid" : ""}
                               />
                               {props.errors.middleName && props.touched.middleName && (
                                 <div className="invalid-feedback">{props.errors.middleName}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col lg={4}>
                             <FormGroup>
                               <Label htmlFor="select"><span className="text-danger">*</span>Last Name</Label>
                               <Input
                                 type="text"
                                 id="lastName"
                                 name="lastName"
                                 value={props.values.lastName}
                                 placeholder="Enter Last Name"
                                 onChange={(value) => {
                                   props.handleChange('lastName')(value);
                               
                                 }}
                                 className={props.errors.lastName && props.touched.lastName ? "is-invalid" : ""}
                               />
                               {props.errors.lastName && props.touched.lastName && (
                                 <div className="invalid-feedback">{props.errors.lastName}</div>
                               )}
                             </FormGroup>
                           </Col>
                          
                         </Row>
                       
                         <Row  >
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="gender">Gender</Label>
                               <Select
                                 styles={customStyles}
                                 options={
                                   this.gender
                                     ? selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         this.gender,
                                         'Terms',
                                       )
                                     : []
                                 }
                                 id="gender"
                                 name="gender"
                                 placeholder="Select Gender "
                                 value={
                                   this.gender
                                     && selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         this.gender,
                                         'Terms',
                                       ).find(
                                     (option) =>
                                       option.value ===
                                       props.values
                                         .gender,
                                   )}
                                  onChange={(options) => {
                                           if (options && options.value) {
                                             props.handleChange(
                                               'gender',
                                             )(options.value);
                                           } else {
                                             props.handleChange(
                                               'gender',
                                             )('');
                                           }
                                         }}
                                 className={`${
                                   props.errors.gender && props.touched.gender
                                     ? 'is-invalid'
                                     : ''
                                 }`}
                               />
                               {props.errors.gender && props.touched.gender && (
                                 <div className="invalid-feedback">
                                   {props.errors.gender}
                                 </div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="bloodGroup">Blood group</Label>
                               <Select
                                 styles={customStyles}
                                 options={
                                   this.bloodGroup
                                     ? selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         this.bloodGroup,
                                         'Terms',
                                       )
                                     : []
                                 }
                                 id="bloodGroup"
                                 name="bloodGroup"
                                 placeholder="Select Blood Group "
                                 value={
                                   this.bloodGroup
                                     && selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         this.bloodGroup,
                                         'Terms',
                                       ).find(
                                     (option) =>
                                       option.value ===
                                       props.values
                                         .bloodGroup,
                                   )}
                                  onChange={(options) => {
                                           if (options && options.value) {
                                             props.handleChange(
                                               'bloodGroup',
                                             )(options.value);
                                           } else {
                                             props.handleChange(
                                               'bloodGroup',
                                             )('');
                                           }
                                         }}
                                 className={`${
                                   props.errors.bloodGroup && props.touched.bloodGroup
                                     ? 'is-invalid'
                                     : ''
                                 }`}
                               />
                               {props.errors.bloodGroup && props.touched.bloodGroup && (
                                 <div className="invalid-feedback">
                                   {props.errors.bloodGroup}
                                 </div>
                               )}

                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup className="mb-3">
                               <Label htmlFor="date"><span className="text-danger">*</span>Date Of Birth</Label>
                               <DatePicker
                                 className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                 id="dob"
                                 name="dob"
                                 placeholderText="Select Date of Birth"
                                 showMonthDropdown
                                 showYearDropdown
                                 dateFormat="dd/MM/yyyy"
                                 dropdownMode="select"
                                 selected={props.values.dob}
                                 value={props.values.dob}
                                 onChange={(value) => {
                                   props.handleChange("dob")(value)
                                 }}
                               />
                               {props.errors.dob && props.touched.dob && (
                                 <div className="invalid-feedback">{props.errors.dob}</div>
                               )}
                             </FormGroup>
                           </Col>
                         </Row>
                         <Row>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="gender">Passport Number </Label>
                               <Input 
                                 type="text"
                                 maxLength="9"
                                 id="passportNumber"
                                 name="passportNumber"
                                 placeholder="Enter Passport Number "
                                 onChange={(value) => { props.handleChange("passportNumber")(value) }}
                                 value={props.values.passportNumber}
                                 className={
                                   props.errors.passportNumber && props.touched.passportNumber
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.passportNumber && props.touched.passportNumber && (
                                 <div className="invalid-feedback">{props.errors.passportNumber}</div>
                               )}
                             </FormGroup>
                           </Col> 
                           <Col md="4">
                             <FormGroup className="mb-3">
                               <Label htmlFor="passportExpiryDate">Passport expiry Date</Label>
                               <DatePicker
                                 className={`form-control ${props.errors.passportExpiryDate && props.touched.passportExpiryDate ? "is-invalid" : ""}`}
                                 id="passportExpiryDate"
                                 name="passportExpiryDate"
                                 placeholderText="Select passport Expiry Date"
                                 showMonthDropdown
                                 showYearDropdown 
                                 dateFormat="dd/MM/yyyy"
                                 dropdownMode="select"
                                 selected={props.values.passportExpiryDate}
                                 value={props.values.passportExpiryDate}
                                 onChange={(value) => {
                                   props.handleChange("passportExpiryDate")(value)
                                 }}
                               />
                               {props.errors.dob && props.touched.passportExpiryDate && (
                                 <div className="invalid-feedback">{props.errors.passportExpiryDate}</div>
                               )}
                             </FormGroup>
                           </Col>
                           </Row>  <Row>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="gender">Visa Number </Label>
                               <Input 
                                 type="text" 
                                 id="visaNumber"
                                 name="visaNumber"
                                 placeholder="Enter Visa Number "
                                 onChange={(value) => { props.handleChange("visaNumber")(value) }}
                                 value={props.values.visaNumber}
                                 className={
                                   props.errors.visaNumber && props.touched.visaNumber
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.visaNumber && props.touched.visaNumber && (
                                 <div className="invalid-feedback">{props.errors.visaNumber}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup className="mb-3">
                               <Label htmlFor="visaExpiryDate">Visa ExpiryDate</Label>
                               <DatePicker 
                                 className={`form-control ${props.errors.visaExpiryDate && props.touched.visaExpiryDate ? "is-invalid" : ""}`}
                                 id="visaExpiryDate"
                                 name="visaExpiryDate"
                                 placeholderText="Select visa Expiry Date"
                                 showMonthDropdown
                                 showYearDropdown 
                                 dateFormat="dd/MM/yyyy"
                                 dropdownMode="select"
                                 selected={props.values.visaExpiryDate}
                                 value={props.values.visaExpiryDate}
                                 onChange={(value) => {
                                   props.handleChange("visaExpiryDate")(value)
                                 }}
                               />
                               {props.errors.dob && props.touched.visaExpiryDate && (
                                 <div className="invalid-feedback">{props.errors.visaExpiryDate}</div>
                               )}
                             </FormGroup>
                           </Col>
                         </Row>
                         <hr />
                         <h4>Contact Details</h4>
                         <hr />
                         <Row className="row-wrapper">
                         <Col md="4">
                             <FormGroup>
                               <Label htmlFor="mobileNumber">
                                 <span className="text-danger">*</span>Mobile
                                 Number
                               </Label>
                               <PhoneInput
                                 id="mobileNumber"
                                 name="mobileNumber"
                                 defaultCountry="AE"
                                 international
                                 value={props.values.mobileNumber}
                                 placeholder="Enter Mobile Number"
                                 onBlur={props.handleBlur('mobileNumber')}
                                 onChange={(option) => {
                                   props.handleChange('mobileNumber')(
                                     option,
                                   );
                                 }}
                                 className={
                                   props.errors.mobileNumber &&
                                   props.touched.mobileNumber
                                     ? 'is-invalid'
                                     : ''
                                 }
                               />
                               {props.errors.mobileNumber &&
                                 props.touched.mobileNumber && (
                                   <div className="invalid-feedback">
                                     {props.errors.mobileNumber}
                                   </div>
                                 )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="select"><span className="text-danger">*</span>Email</Label>
                               <Input
                                 type="text"
                                 id="email"
                                 name="email"
                                 value={props.values.email}
                                 placeholder="Enter Email Address"
                                 onChange={(value) => { props.handleChange('email')(value) }}
                                 className={props.errors.email && props.touched.email ? "is-invalid" : ""}
                               />
                               {props.errors.email && props.touched.email && (
                                 <div className="invalid-feedback">{props.errors.email}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
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
                                                 useractive: true
                                               });
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
                                               e.target.value === 'false'
                                             ) {
                                               this.setState({
                                                 selectedStatus: false,
                                                 useractive: false
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
                         <Row className="row-wrapper">
                           <Col md="8">
                             <FormGroup>
                               <Label htmlFor="gender">Present Address </Label>
                               <Input
                                 type="text"
                                 id="presentAddress"
                                 name="presentAddress"
                                 placeholder="Enter Present Address "
                                 onChange={(value) => { props.handleChange("presentAddress")(value) }}
                                 value={props.values.presentAddress}
                                 className={
                                   props.errors.presentAddress && props.touched.presentAddress
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.presentAddress && props.touched.presentAddress && (
                                 <div className="invalid-feedback">{props.errors.presentAddress}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="city">Pin Code </Label>
                               <Input
                                 type="text"
                                 id="pincode"
                                 name="pincode"
                                 placeholder="Enter Pin Code "
                                 onChange={(value) => { props.handleChange("pincode")(value) }}
                                 value={props.values.pincode}
                                 className={
                                   props.errors.pincode && props.touched.pincode
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.pincode && props.touched.pincode && (
                                 <div className="invalid-feedback">{props.errors.pincode}</div>
                               )}
                             </FormGroup>
                           </Col>
                           {/* <Col md="4">
                             <FormGroup>
                               <Label htmlFor="gender">Permanent Address </Label>
                               <Input
                                 type="text"
                                 id="permanentAddress"
                                 name="permanentAddress"
                                 placeholder="Enter Permanent Address "
                                 onChange={(value) => { props.handleChange("permanentAddress")(value) }}
                                 value={props.values.permanentAddress}
                                 className={
                                   props.errors.permanentAddress && props.touched.permanentAddress
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.permanentAddress && props.touched.permanentAddress && (
                                 <div className="invalid-feedback">{props.errors.permanentAddress}</div>
                               )}
                             </FormGroup>
                           </Col> */}
                         </Row>
                         <Row className="row-wrapper">
                         <Col md="4">
                             <FormGroup>
                               <Label htmlFor="countryId">Country</Label>
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
                                 placeholder="Select Country"
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
                               <Label htmlFor="stateId">State Region</Label>
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
                                 placeholder="Select State"
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
                               <Label htmlFor="state">City     </Label>
                               <Input
                                 type="text"
                                 id="city"
                                 name="city"
                                 placeholder="Enter City Name "
                                 onChange={(value) => { props.handleChange("city")(value) }}
                                 value={props.values.city}
                                 className={
                                   props.errors.city && props.touched.city
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.city && props.touched.city && (
                                 <div className="invalid-feedback">{props.errors.city}</div>
                               )}
                             </FormGroup>
                           </Col>
                           {/* <Col md="4">
                             <FormGroup>
                               <Label htmlFor="state">State </Label>
                               <Input
                                 type="text"
                                 id="state"
                                 name="state"
                                 placeholder="Enter state "
                                 onChange={(value) => { props.handleChange("state")(value) }}
                                 value={props.values.state}
                                 className={
                                   props.errors.state && props.touched.state
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.state && props.touched.state && (
                                 <div className="invalid-feedback">{props.errors.state}</div>
                               )}
                             </FormGroup>
                           </Col> */}
                         </Row>
                         
                      
                         <hr />
                         <h4>Employment Details</h4>
                         <hr />
                         <Row>
                      
                        <Col lg={12}>
                        <Row>
                        <Col md="4">
                             <FormGroup>
                               <Label htmlFor="select">Employee Code </Label>
                               <Input 
                                 type="text"
                                 id="employeeCode"
                                 name="employeeCode"
                                 value={props.values.employeeCode}
                                 placeholder="Enter Employee Code"
                                 onChange={(value) => {
                                   props.handleChange('employeeCode')(value);
                               
                                 }}
                                 className={props.errors.employeeCode && props.touched.employeeCode ? "is-invalid" : ""}
                               />
                               {props.errors.employeeCode && props.touched.employeeCode && (
                                 <div className="invalid-feedback">{props.errors.employeeCode}</div>
                               )}
                             </FormGroup>
                           </Col>
                        
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="employeeDesignationId"><span className="text-danger">*</span>Designation</Label>
                               <Select
                                 styles={customStyles}
                                 options={
                                   designation_dropdown
                                     ? selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         designation_dropdown,
                                         'employeeDesignationId',
                                       )
                                     : []
                                 }
                                 id="employeeDesignationId"
                                 name="employeeDesignationId"
                                 placeholder="Select designation "
                                 value={
                                   designation_dropdown
                                     && selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         designation_dropdown,
                                         'Employee Designation',
                                       ).find(
                                     (option) =>
                                       option.value ===
                                       props.values
                                         .employeeDesignationId,
                                   )}
                                  onChange={(options) => {
                                           if (options && options.value) {
                                             props.handleChange(
                                               'employeeDesignationId',
                                             )(options.value);
                                           } else {
                                             props.handleChange(
                                               'employeeDesignationId',
                                             )('');
                                           }
                                         }}
                                 className={`${
                                   props.errors.employeeDesignationId && props.touched.employeeDesignationId
                                     ? 'is-invalid'
                                     : ''
                                 }`}
                               />
                               {props.errors.designationId && props.touched.employeeDesignationId && (
                                 <div className="invalid-feedback">
                                   {props.errors.employeeDesignationId}
                                 </div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="parentId"><span className="text-danger">*</span>Reports To</Label>
                               <Select
                                 styles={customStyles}
                                 options={
                                   employee_list_dropdown
                                     ? selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         employee_list_dropdown,
                                         'Employee',
                                       )
                                     : []
                                 }
                                 id="parentId"
                                 name="parentId"
                                 placeholder="Select designation "
                                 value={
                                   employee_list_dropdown
                                     && selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         employee_list_dropdown,
                                         'Employee',
                                       ).find(
                                     (option) =>
                                       option.value ===
                                       props.values
                                         .parentId,
                                   )}
                                  onChange={(options) => {
                                           if (options && options.value) {
                                             props.handleChange(
                                               'parentId',
                                             )(options.value);
                                           } else {
                                             props.handleChange(
                                               'parentId',
                                             )('');
                                           }
                                         }}
                                 className={`${
                                   props.errors.parentId && props.touched.parentId
                                     ? 'is-invalid'
                                     : ''
                                 }`}
                               />
                               {props.errors.parentId && props.touched.parentId && (
                                 <div className="invalid-feedback">
                                   {props.errors.parentId}
                                 </div>
                               )}
                             </FormGroup>
                           </Col>
                       
                         </Row>
                         <Row  >
                         <Col md="4">
                             <FormGroup>
                               <Label htmlFor="select">Department </Label>
                               <Input
                                 type="text"
                                 id="department"
                                 name="department"
                                 value={props.values.department}
                                 placeholder="Enter department"
                                 onChange={(value) => {
                                   props.handleChange('department')(value);
                               
                                 }}
                                 className={props.errors.department && props.touched.department ? "is-invalid" : ""}
                               />
                               {props.errors.department && props.touched.department && (
                                 <div className="invalid-feedback">{props.errors.department}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup className="mb-3">
                               <Label htmlFor="dateOfJoining"><span className="text-danger">*</span>Date Of Joining</Label>
                               <DatePicker
                                 className={`form-control ${props.errors.dateOfJoining && props.touched.dateOfJoining ? "is-invalid" : ""}`}
                                 id="dateOfJoining"
                                 name="dateOfJoining"
                                 placeholderText="Select Date Of Joining"
                                 showMonthDropdown
                                 showYearDropdown 
                                 dateFormat="dd/MM/yyyy"
                                 dropdownMode="select"
                                 selected={props.values.dateOfJoining}
                                 value={props.values.dateOfJoining}
                                 onChange={(value) => {
                                   props.handleChange("dateOfJoining")(value)
                                 }}
                               />
                               {props.errors.dob && props.touched.dateOfJoining && (
                                 <div className="invalid-feedback">{props.errors.dateOfJoining}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="labourCard">Labour Card</Label>
                               <Input
                                 type="text"
                                 id="labourCard"
                                 name="labourCard"
                                 value={props.values.labourCard}
                                 placeholder="Enter labour Card"
                                 onChange={(value) => {
                                   props.handleChange('labourCard')(value);
                               
                                 }}
                                 className={props.errors.labourCard && props.touched.labourCard ? "is-invalid" : ""}
                               />
                               {props.errors.labourCard && props.touched.labourCard && (
                                 <div className="invalid-feedback">
                                   {props.errors.labourCard}
                                 </div>
                               )}

                             </FormGroup>
                           </Col>
                          
                         </Row>
                  
                         <Row className="row-wrapper">
                        
                         
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="salaryRoleId"><span className="text-danger">*</span>Salary Role </Label>
                               <Select
                                 styles={customStyles}
                                 options={
                                   salary_role_dropdown
                                     ? selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         salary_role_dropdown,
                                         'SalaryRole',
                                       )
                                     : []
                                 }
                                 id="salaryRoleId"
                                 name="salaryRoleId"
                                 placeholder="Select salary Role "
                                 value={
                                   salary_role_dropdown
                                     && selectOptionsFactory.renderOptions(
                                         'label',
                                         'value',
                                         salary_role_dropdown,
                                         'EmploSalaryRoleyee',
                                       ).find(
                                     (option) =>
                                       option.value ===
                                       props.values
                                         .salaryRoleId,
                                   )}
                                  onChange={(options) => {
                                           if (options && options.value) {
                                             props.handleChange(
                                               'salaryRoleId',
                                             )(options.value);
                                           } else {
                                             props.handleChange(
                                               'salaryRoleId',
                                             )('');
                                           }
                                         }}
                                 className={`${
                                   props.errors.salaryRoleId && props.touched.salaryRoleId
                                     ? 'is-invalid'
                                     : ''
                                 }`}
                               />
                               {props.errors.salaryRoleId && props.touched.salaryRoleId && (
                                 <div className="invalid-feedback">
                                   {props.errors.salaryRoleId}
                                 </div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="grossSalary">Gross Salary </Label>
                               <Input  
                                 type="text" 
                                 id="grossSalary"
                                 name="grossSalary"
                                 placeholder="Enter  grossSalary "
                                 onChange={(value) => {
                                   props.handleChange('grossSalary')(value);
                               
                                 }}
                                 value={props.values.grossSalary}
                                 className={
                                   props.errors.grossSalary && props.touched.grossSalary
                                     ? "is-invalid"
                                     : ""
                                 }
                               />
                               {props.grossSalary && props.touched.grossSalary && (
                                 <div className="invalid-feedback">{props.errors.visaNumber}</div>
                               )}
                             </FormGroup>
                           </Col>
                         </Row>
                         </Col>
                         </Row>
                         <hr />
                         <h4>Bank Details</h4>
                         <hr />
                        
                         <Row  >
                         <Col md="4">
                             <FormGroup>
                               <Label htmlFor="select">Account Holder Name </Label>
                               <Input
                                 type="text"
                                 id="accountHolderName"
                                 name="accountHolderName"
                                 value={props.values.accountHolderName}
                                 placeholder="Enter Account Holder Name"
                                 onChange={(value) => {
                                   props.handleChange('accountHolderName')(value);
                               
                                 }}
                                 className={props.errors.accountHolderName && props.touched.accountHolderName ? "is-invalid" : ""}
                               />
                               {props.errors.accountHolderName && props.touched.accountHolderName && (
                                 <div className="invalid-feedback">{props.errors.accountHolderName}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="accountNumber">Account Number</Label>
                               <Input
                                 type="text"
                                 id="accountNumber"
                                 name="accountNumber"
                                 value={props.values.accountNumber}
                                 placeholder="Enter account Number"
                                 onChange={(value) => {
                                   props.handleChange('accountNumber')(value);
                               
                                 }}
                                 className={props.errors.accountNumber && props.touched.accountNumber ? "is-invalid" : ""}
                               />
                               {props.errors.accountNumber && props.touched.accountNumber && (
                                 <div className="invalid-feedback">{props.errors.accountNumber}</div>
                               )}
                             </FormGroup>
                           </Col>
                           <Col md="4">
                             <FormGroup>
                               <Label htmlFor="bankName">Bank Name</Label>
                               <Input
                                 type="text"
                                 id="bankName"
                                 name="bankName"
                                 value={props.values.bankName}
                                 placeholder="Enter bank Name"
                                 onChange={(value) => {
                                   props.handleChange('bankName')(value);
                               
                                 }}
                                 className={props.errors.bankName && props.touched.bankName ? "is-invalid" : ""}
                               />
                               {props.errors.bankName && props.touched.bankName && (
                                 <div className="invalid-feedback">
                                   {props.errors.bankName}
                                 </div>
                               )}

                             </FormGroup>
                           </Col>
                         </Row>
                  
                         <Row className="row-wrapper">
                         <Col lg={4}>
                             <FormGroup>
                               <Label htmlFor="branch">Branch</Label>
                               <Input 
                                 type="text"
                                 id="branch"
                                 name="branch"
                                 value={props.values.branch}
                                 placeholder="Enter branch"
                                 onChange={(value) => {
                                   props.handleChange('branch')(value);
                               
                                 }}
                                 className={props.errors.branch && props.touched.branch ? "is-invalid" : ""}
                               />
                               {props.errors.branch && props.touched.branch && (
                                 <div className="invalid-feedback">{props.errors.branch}</div>
                               )}
                             </FormGroup>
                           </Col>
                         <Col md="4">
                             <FormGroup>
                               <Label htmlFor="ibanNumber">IBAN Number</Label>
                               <Input 
                                 type="text"
                                 id="ibanNumber"
                                 name="ibanNumber"
                                 value={props.values.ibanNumber}
                                 placeholder="Enter IBAN Number"
                                 onChange={(value) => {
                                   props.handleChange('ibanNumber')(value);
                               
                                 }}
                                 className={props.errors.ibanNumber && props.touched.ibanNumber ? "is-invalid" : ""}
                               />
                               {props.errors.employeeCode && props.touched.employeeCode && (
                                 <div className="invalid-feedback">{props.errors.ibanNumber}</div>
                               )}
                             </FormGroup>
                           </Col>
                          
                           <Col lg={4}>
                             <FormGroup>
                               <Label htmlFor="select">Swift Code</Label>
                               <Input 
                                 type="text"
                                 id="swiftCode"
                                 name="swiftCode"
                                 value={props.values.swiftCode}
                                 placeholder="Enter swift Code"
                                 onChange={(value) => {
                                   props.handleChange('swiftCode')(value);
                               
                                 }}
                                 className={props.errors.swiftCode && props.touched.swiftCode ? "is-invalid" : ""}
                               />
                               {props.errors.swiftCode && props.touched.swiftCode && (
                                 <div className="invalid-feedback">{props.errors.swiftCode}</div>
                               )}
                             </FormGroup>
                           </Col>
               
                   </Row>
                          
                             <Row>
                               <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                 <FormGroup>
                                   <Button type="button" name="button" color="danger" className="btn-square"
                                     onClick={this.deleteEmployee}
                                   >
                                     <i className="fa fa-trash"></i> Delete
                                 </Button>
                                 </FormGroup>
                                 <FormGroup className="text-right">
                                   <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                     <i className="fa fa-dot-circle-o"></i> Update
                                 </Button>
                                   <Button type="button" color="secondary" className="btn-square"
                                     onClick={() => { this.props.history.push('/admin/payroll/employee') }}>
                                     <i className="fa fa-ban"></i> Cancel
                                 </Button>
                                 </FormGroup>
                               </Col>
                             </Row>
                             </Col>
                             </Row>
                           </Form>
													)}
												</Formik>
											</Col>
										</Row>
									)}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DetailEmployeePayroll);
