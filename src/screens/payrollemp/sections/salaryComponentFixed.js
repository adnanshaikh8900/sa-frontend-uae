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
	ButtonGroup,
} from 'reactstrap';

import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils'

import Select from 'react-select'
import { toast } from 'react-toastify';
 
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import {data}  from '../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
class SalaryComponentFixed extends React.Component {
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
				description: '',
				formula:'',	
				// data: [
				// 	{
				// 		salaryStructure: 1,
				// 		type: '',
				// 		flatAmount: '',
				// 	},
				// ],
			},
			selectDisable:true,
			addNewDisabled: false,
			state_list: [],
			selectedData:{},
		};
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z][a-zA-Z ]*$/;
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
			'salaryStructure', 1
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
					this.props.closeSalaryComponentFixed(true);
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
			showDetails: bool,
		});
		if(bool===true){
			this.setState({
				addNewDisabled:true,
				selectDisable:false
			});
		}
		else{
			this.setState({
				addNewDisabled:false,
				selectDisable:true
			});
		}
	}

	
	render() {
		strings.setLanguage(this.state.language);
		const {
			openSalaryComponentFixed,
			closeSalaryComponentFixed,
			salary_structure_dropdown,
			salary_component_dropdown,
		} = this.props;
		console.log(salary_structure_dropdown)
		const { initValue } = this.state;
		return (
			<div style={{ width: "250px" }}>
				<Modal
					isOpen={openSalaryComponentFixed}
					className="modal-success salary-model"
				>
					<Formik
						ref={this.formikRef}
						initialValues={initValue}
						onSubmit={(values, { resetForm, setSubmitting }) => {
							this.handleSubmit(values, resetForm);
						}}

						validate={(values) => {
							let errors = {};
							if(this.state.addNewDisabled===true)
							{	
									if (values.description=="") {
										errors.description = 'Component Name is Required';
									}
									if (values.type=="") {
										errors.type = 'Type is Required';
									}

									if(values.type.label && values.type.label ==="% of Basic" && values.formula==""){
										errors.formula="Percentage is required"
									}else
									if(values.type.label && values.type.label ==="Flat Amount" && values.flatAmount==""){
										errors.flatAmount="Flat Amount is required"
									}
						}
						else if(this.state.selectDisable===true && (!values.id || values.id.label== "Select description")){
							   errors.id="Component is required"
						}
							return errors;
						}}

						// validationSchema={Yup.object().shape({
							//	firstName: Yup.string().required('First Name is Required'),

							//currrencyCode: Yup.string().required('Currency is Required'),

						// 	componentName: Yup.string().required(
						// 		'Component Name is Required',
						// 	),
						// 	type: Yup.string().required(
						// 		'Type is Required',
						// 	),
						
						// })}
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
													<span className="ml-2">{strings.CreateFixedComponent}</span>
												</div>
											</Col>
										</Row>
									</CardHeader>
									<ModalBody>
									{ this.state.selectDisable &&(<Row>
											<Col lg={8}>
												<FormGroup>
													<Label htmlFor="id">{strings.Select+""+strings.Component}</Label>
													<Select

														options={
															salary_component_dropdown.data
																? selectOptionsFactory.renderOptions(
																	'label',
																	'value',
																	salary_component_dropdown.data,
																	'description',
																)
																: []
														}
														id="id"
														name="id"
														placeholder={strings.Select+strings.SalaryComponent}
														value={this.state.id}
														onChange={(value) => {
															props.handleChange('id')(value);

														}}
														className={`${props.errors.id && props.touched.id
															? 'is-invalid'
															: ''
															}`}
													/>
													{props.errors.id && (
														<div className="text-danger">
															{props.errors.id}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col>
											<ButtonGroup>
											<Button
											color="primary"
											className="btn-square mr-3 mb-3"
											 onClick={this._showDetails.bind(null, true)}
											 disabled={
												this._showDetails === true
											}
										 >	<i className="fa fa-plus"></i> {strings.AddNewComponent}
											 </Button>

											</ButtonGroup>
											</Col>
										</Row>
										)}
								
										{/* <Row > 
											<Col  lg={8}>
											<div className="text-center"><b>OR </b> </div> */}
											{/* <div className="text-center"><h5> Create New Component</h5></div> */}
											{/* </Col>
										</Row>
									<br/> */}

										{this.state.showDetails &&
										(<div id="moreDetails">
										<Row>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="componentName">
													<span className="text-danger">*</span>{strings.ComponentName}
													</Label>
													<Input
														type="text"
														id="description"
														name="description"
														value={props.values.description}
														placeholder={strings.Enter+strings.ComponentName}
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
													<Label htmlFor="type"><span className="text-danger">*</span>{strings.Type}</Label>
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
													{props.errors.type && (
														<div className="text-danger">
															{props.errors.type}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>


										<Row style={{ display: props.values.type.value !== 2 ? 'none' : '' }}>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="salaryStructure"><span className="text-danger">*</span>
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
													{props.errors.formula &&(
														<div className="text-danger">{props.errors.formula}</div>
													)}
												</FormGroup>
											</Col>
										</Row>
										<Row  style={{ display: props.values.type.value !== 1 ? 'none' : '' }}>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="flatAmount"><span className="text-danger">*</span>
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
													{props.errors.flatAmount &&(
														<div className="text-danger">{props.errors.flatAmount}</div>
													)}
												</FormGroup>
											</Col>

										</Row>
										<Row>
										<IconButton 
										aria-label="delete"
										size="medium" 
										 onClick={this._showDetails.bind(null, false)}>
          								<i class="fa fa-angle-double-up" aria-hidden="true"></i>
       										 </IconButton>
										 </Row>
										</div>
											)}
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
												closeSalaryComponentFixed(false);
											}}
										>
											<i className="fa fa-ban"></i> {strings.Cancel}
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

export default SalaryComponentFixed;
