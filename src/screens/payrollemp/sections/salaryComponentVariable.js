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
import { selectCurrencyFactory, selectOptionsFactory } from 'utils'

import Select from 'react-select'
import { toast } from 'react-toastify';
 
import moment from 'moment';
import {data}  from '../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
class SalaryComponentVariable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			showDetails: false,
			loading: false,
			initValue: {
				employeeId:'',
				salaryStructure: 1,
				type: '',
				flatAmount: '',
				email: '',
				dob: new Date(),
				// data: [
				// 	{
				// 		salaryStructure: 1,
				// 		type: '',
				// 		flatAmount: '',
				// 	},
				// ],
			},
			state_list: [],
			selectedData:{},
		};
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s,'-]+$/;
		this.type = [
			{ label: 'Flat Amount', value: 1 },
			{ label: '% of Basic', value: 2 }
		];
	}

	static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.selectedData !== nextProps.selectedData  ) {
	
			console.log('muyts',nextProps.selectedData)
		 return { 
			selectedData :nextProps.selectedData,
			  };
        }
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


	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const {
			id,
			salaryStructure,
			description,
			formula,
			flatAmount
		} = data;


		const formData = new FormData();
		formData.append('id',id != null ? id.value : '');
		formData.append('employeeId',this.state.selectedData.id )
	

		formData.append(
			'salaryStructure', 2
		)
		formData.append(
			'description',
			description != null ? description : '',
		)
		formData.append(
			'formula',
			formula != null ? formula : '',
		)
		formData.append(
			'flatAmount',
			flatAmount != null ? flatAmount : '',
		)
		// formData.append('salaryComponentString', JSON.stringify(
		// 	this.state.data
		// ));

		this.props
			.CreateComponent(formData)
			.then((res) => {
				if (res.status === 200) {
					resetForm();
					this.props.closeSalaryComponentVariable(true);
				}
			})
			.catch((err) => {
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
			openSalaryComponentVariable,
			closeSalaryComponentVariable,
			salary_structure_dropdown,
			salary_component_dropdown,
			// country_list,
		} = this.props;
		console.log(salary_structure_dropdown)
		const { initValue } = this.state;
		return (
			<div style={{ width: "250px" }}>
				<Modal
					isOpen={openSalaryComponentVariable}
					className="modal-success salary-model"
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
													<span className="ml-2">{strings.CreateVariableComponent}</span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<ModalBody>
										<Row>
											<Col lg={8}>
												<FormGroup>
													<Label htmlFor="id">{strings.Component}</Label>
													<Select

														options={
															salary_component_dropdown.data
																? selectOptionsFactory.renderOptions(
																	'label',
																	'value',
																	salary_component_dropdown.data,
																	'Type',
																)
																: []
														}
														id="id"
														name="id"
														placeholder={strings.Select+strings.Component}
														value={this.state.id}
														onChange={(value) => {
															props.handleChange('id')(value);

														}}
														className={`${props.errors.id && props.touched.id
															? 'is-invalid'
															: ''
															}`}
													/>
													{props.errors.id && props.touched.id && (
														<div className="invalid-feedback">
															{props.errors.id}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="salaryStructure">
													{strings.ComponentName}
													</Label>
													<Input
														type="text"
														id="description"
														name="description"
														value={props.values.description}
														placeholder={strings.Enter+strings.SalaryComponent+" "+strings.Name}
														onChange={(option) => {
															if (option.target.value === '' || this.regExAlpha.test(option.target.value)) { props.handleChange('description')(option) }
														}}
														className={props.errors.description && props.touched.description ? "is-invalid" : ""}
													/>
													{props.errors.description && props.touched.description && (
														<div className="invalid-feedback">{props.errors.description}</div>
													)}
												</FormGroup>
											</Col>

									
										</Row>
										<Row>
											<Col md="8">
												<FormGroup>
													<Label htmlFor="gender">{strings.Type}</Label>
													<Select

														options={
															this.type
																? selectOptionsFactory.renderOptions(
																	'label',
																	'value',
																	this.type,
																	'Type',
																)
																: []
														}
														id="type"
														name="type"
														placeholder={strings.Select+strings.Type}
														value={this.state.gender}
														onChange={(value) => {
															props.handleChange('type')(value);

														}}
														className={`${props.errors.type && props.touched.type
															? 'is-invalid'
															: ''
															}`}
													/>
													{props.errors.type && props.touched.type && (
														<div className="invalid-feedback">
															{props.errors.type}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>
										<Row style={{ display: props.values.type.value !== 2 ? 'none' : '' }}>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="salaryStructure">
													 {strings.Percentage}
													</Label>
													<Input
														type="text"
														id="formula"
														name="formula"
														value={props.values.formula}
														placeholder={strings.Enter+strings.Percentage}
														onChange={(option) => {
															if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('formula')(option) }
														}}
														className={props.errors.formula && props.touched.formula ? "is-invalid" : ""}
													/>
													{props.errors.formula && props.touched.formula && (
														<div className="invalid-feedback">{props.errors.formula}</div>
													)}
												</FormGroup>
											</Col>
										</Row>
										<Row  style={{ display: props.values.type.value !== 1 ? 'none' : '' }}>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="flatAmount">
														{strings.FlatAmount}
													</Label>
													<Input
														type="text"
														id="flatAmount"
														name="flatAmount"
														value={props.values.flatAmount}
														placeholder={strings.Enter+strings.FlatAmount}
														onChange={(option) => {
															if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('flatAmount')(option) }
														}}
														className={props.errors.flatAmount && props.touched.flatAmount ? "is-invalid" : ""}
													/>
													{props.errors.flatAmount && props.touched.flatAmount && (
														<div className="invalid-feedback">{props.errors.flatAmount}</div>
													)}
												</FormGroup>
											</Col>

										</Row>
									</ModalBody>
									<ModalFooter style={{padding: "10px"}}>
										<Button
											type="button"
											color="primary"
											className="btn-square mr-3"
											onClick={() => {
												this.setState(() => {
													props.handleSubmit();
												});
											}}
										>
											<i className="fa fa-dot-circle-o"></i> {strings.Create}
										</Button>
										&nbsp;
										<Button
											color="secondary"
											className="btn-square"
											onClick={() => {
												closeSalaryComponentVariable(false);
											}}
										>
											<i className="fa fa-ban"></i>  {strings.Cancel}
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

export default SalaryComponentVariable;
