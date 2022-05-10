import React from 'react';
import {
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	CardHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';

import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from 'yup';


import { toast } from 'react-toastify';
 
import moment from 'moment';
import {data}  from '../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
class DesignationModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			showDetails : false,
			loading: false,
			initValue: {
			firstName: '',
			lastName: '',
			middleName: '',
			email: '',
			disabled: false,
			dob: new Date(),
			},
			state_list: [],
		};
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s,'-]+$/;
	}


	getData = (data) => {
		let temp = {};
		for (let item in data) {
			if (typeof data[`${item}`] !== 'object') {
				temp[`${item}`] = data[`${item}`];
			} else {
				temp[`${item}`] = data[`${item}`].value;
			}
		}
		return temp;
	};

	// Create or Contact
	// handleSubmit = (data, resetForm) => {


	// 	this.setState({ disabled: true });
	// 	// const employeeId = data['employeeId'];
	// 	const firstName = data['firstName'];
	// 	const lastName = data['lastName'];
	// 	const middleName = data['middleName'];
	
	// 	const email = data['email'];
	// 	const dob = data['dob'];

	// 	const dataNew = {
	// 		firstName,
	// 		lastName,
	// 		middleName,
	// 		email,
	// 		dob,
	// 	};
	// 	const postData = this.getData(dataNew);
	// 	this.props
	// 		.createEmployee(postData)
	// 		.then((res) => {
				
	// 			if (res.status === 200) {
	// 				resetForm();
	// 				this.props.closeEmployeeModal(true);
	// 				this.props.getCurrentUser(res);
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			this.displayMsg(err);
	// 			this.formikRef.current.setSubmitting(false);
	// 		});
	// };
    handleSubmit = (data, resetForm) => {
        this.setState({ disabled: true });
            const {
          designationName
            } = data;
    
    
            const formData = new FormData();
    
      
        formData.append(
          'designationName',
          designationName != null ? designationName : '',
        )
       
        this.props
        .createDesignation(formData)
        .then((res) => {
            //  let resConfig = JSON.parse(res.config.data);
            
            if (res.status === 200) {
				this.setState({ disabled: false });
            
                resetForm();
            
                this.props.closeDesignationModal(true);
                this.props.getCurrentUser(res.data);
            }
        })
        .catch((err) => {
			this.setState({ disabled: false });
            this.displayMsg(err);
            this.formikRef.current.setSubmitting(false);
        });
      }
    
	

	displayMsg = (err) => {
		toast.error(`${err.data}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};
	_showDetails = (bool) => {
		this.setState({
		  showDetails: bool
		});
	  }

	// getStateList = (countryCode) => {
	// 	if (countryCode) {
	// 		this.props.getStateList(countryCode).then((res) => {
	// 			if (res.status === 200) {
	// 				this.setState({
	// 					state_list: res.data,
	// 				});
	// 			}
	// 		});
	// 	} else {
	// 		this.setState({
	// 			state_list: [],
	// 		});
	// 	}
	// };
	// .contact-modal {
	// 	max-width: 70% !important;
	// }
	render() {
		strings.setLanguage(this.state.language);
		const {
			openDesignationModal,
			closeDesignationModal,
			// currency_list,
			// country_list,
		} = this.props;
		const { initValue} = this.state;
		return (
			<div className="contact-modal-screen">
				<Modal
					isOpen={openDesignationModal}
					className="modal-success designation-model"
				>
					<Formik
						ref={this.formikRef}
						initialValues={initValue}
						onSubmit={(values, { resetForm, setSubmitting }) => {
							this.handleSubmit(values, resetForm);
						}}
						validationSchema={Yup.object().shape({
						//	firstName: Yup.string().required('First Name is Required'),
						
							//currrencyCode: Yup.string().required('Currency is Required'),
							// contactType: Yup.string()
							// .required("Please Select Contact Type"),
							//       organization: Yup.string()
							//       .required("Organization Name is Required"),
							//     poBoxNumber: Yup.number()
							//       .required("PO Box Number is Required"),
							// email: Yup.string()
							// 	.required('Email is Required')
							// 	.email('Invalid Email'),
							// mobileNumber: Yup.string()
							// 	.required('Mobile Number is required')
							// 	.test('quantity', 'Invalid Mobile Number', (value) => {
							// 		if (isValidPhoneNumber(value)) {
							// 			return true;
							// 		} else {
							// 			return false;
							// 		}
							// 	}),
							//     addressLine1: Yup.string()
							//       .required("Address is required"),
							//     city: Yup.string()
							//       .required("City is Required"),
							//     billingEmail: Yup.string()
							//       .required("Billing Email is Required")
							//       .email('Invalid Email'),
							//     contractPoNumber: Yup.number()
							//       .required("Contract PoNumber is Required"),
							
							//       currencyCode: Yup.string()
							//       .required("Please Select Currency")
							//       .nullable(),
							// currencyCode: Yup.string().required('Please Select Currency'),
						})}
					>
						{(props) => {
							const { handleBlur } = props;
							return (
								<Form
									name="simpleForm"
									onSubmit={props.handleSubmit}
									className="create-contact-screen"
								>
									<CardHeader toggle={this.toggleDanger}>
										<Row>
											<Col lg={12}>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="nav-icon fas fa-id-card-alt" />
													<span className="ml-2"> {strings.CreateDesignation} </span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<ModalBody>
								
										<Row className="row-wrapper">
                                        <Col lg={8}>
                                <FormGroup>
                                  <Label htmlFor="select"><span className="text-danger">* </span> {strings.EmployeeDesignationName} </Label>
                                  <Input
                                    type="text"
                                    id="designationName"
                                    name="designationName"
                                    value={props.values.designationName}
                                    placeholder={strings.Enter+strings.DesignationName}
                                    onChange={(option) => {
                                      if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('designationName')(option) }
                                    }}
                                    className={props.errors.designationName && props.touched.designationName ? "is-invalid" : ""}
                                  />
                                  {props.errors.designationName && props.touched.designationName && (
                                    <div className="invalid-feedback">{props.errors.designationName}</div>
                                  )}
                                </FormGroup>
                              </Col>	
                              
										</Row>		
									</ModalBody>
									<ModalFooter>
									<Button
											type="button"
											color="primary"
											className="btn-square mr-3"
											disabled={this.state.disabled}
											onClick={() => {
												this.setState( () => {
													props.handleSubmit();
												});
											}}
										>
											<i className="fa fa-dot-circle-o"></i>  {this.state.disabled
																			? 'Creating...'
																			: strings.Create }
										</Button>
										&nbsp;
										<Button
											color="secondary"
											className="btn-square"
											onClick={() => {
												closeDesignationModal(false);
											}}
										>
											<i className="fa fa-ban"></i> {strings. Cancel}
										</Button>
									</ModalFooter>
								</Form>
							);
						}}
					</Formik>
				</Modal>
				
			</div>
		);
	}
}

export default DesignationModal ;
