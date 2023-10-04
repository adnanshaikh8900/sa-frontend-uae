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
	UncontrolledTooltip,
	
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
				ctcPercent: 1,
				flatAmount: '',
				percentOfCTC: 1,
				email: '',
				dob: new Date(),
				componentId:'',
				description: '',
				// percentOfCTC: '',
				formula:'',	
				// data: [
				// 	{
				// 		salaryStructure: 1,
				// 		type: '',
				// 		flatAmount: '',
				// 	},
				// ],
				calculationType: 'Percent Of CTC',
			},
			selectDisable:true,
			addNewDisabled: false,
			state_list: [],
			selectedData:{},
			selectedType:true,
			calculationType:'Percent Of CTC',
			
		};
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z][a-zA-Z ]*$/;
		this.regExAddress = /^[a-zA-Z0-9\s,'-]+$/;
		this.regDec1=/^\d{1,2}\.\d{1,2}$|^\d{1,2}$/;
		this.type = [
			{ label: 'Flat Amount', value: 1 },
			{ label: '% of CTC', value: 2 }
		];
	}

	static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.selectedData !== nextProps.selectedData  ) {
	
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
			componentId,
			description,
			formula,
			flatAmount,
			percentOfCTC
		} = data;


		const formData = new FormData();
		formData.append('id',id != null ? id.value : '');
		formData.append('employeeId',this.state.selectedData.id )
	

		formData.append(
			'salaryStructure', 1
		)
		formData.append(
			'componentId',
			componentId != null ? componentId : '',
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
		formData.append(
			'percentOfCTC',
			percentOfCTC != null ? percentOfCTC : '',
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
								if (values.componentId == "") {
									errors.componentId = 'Component ID is required';
								}
									if (values.description=="") {
										errors.description = 'Component name is required';
									}

								if (values.calculationType === 'Percent Of CTC' && !values.ctcPercent) {
									errors.ctcPercent = strings.PercentOfCTCIsRequired
								}
									// if (values.type=="") {
									// 	errors.type = 'Type is required';
									// }

									if(values.type.label && values.type.label ==="% of CTC" && values.formula==""){
										errors.formula="Percentage is required"
									}else
									if(values.type.label && values.type.label ==="Flat Amount" && values.flatAmount==""){
										errors.flatAmount="Flat amount is required"
									}
						}
						else if(this.state.selectDisable===true && (!values.id || values.id.label== "Select description")){
							   errors.id="Component is required"
						}
							return errors;
						}}

						// validationSchema={Yup.object().shape({
							//	firstName: Yup.string().required('First Name is required'),

							//currrencyCode: Yup.string().required('Currency is required'),

						// 	componentName: Yup.string().required(
						// 		'Component Name is required',
						// 	),
						// 	type: Yup.string().required(
						// 		'Type is required',
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
											<Col>
												<div className="h4 mb-0 d-flex align-items-center">
													<i className="nav-icon fas fa-id-card-alt" />
													<span className="ml-2">{strings.CreateAnEarningComponent}</span>
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
											{/* <ButtonGroup> */}
											<Button
											style={{
												width:80,
												borderRadius:50,
											  }}
											color="primary"
											className="btn-square mr-3 mt-4"
											 onClick={this._showDetails.bind(null, true)}
											 disabled={
												this._showDetails === true
											}
										 >	<i className="fa fa-plus"></i> {strings.AddNewComponent}
											 </Button>

											{/* </ButtonGroup> */}
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
                                       
										<Row className="row-wrapper">
											<Col>
												<FormGroup className="mb-3">
													<Label htmlFor="componentId">
														<span className="text-danger">* </span>{strings.ComponentID}
													</Label>
													<Input
														type="text"
														id="componentId"
														name="componentId"
														value={props.values.componentId}
														placeholder={strings.Enter + strings.ComponentID}
														onChange={(option) => {
															if (option.target.value === '' || this.regExBoth.test(option.target.value)) { props.handleChange('componentId')(option) }
														}}
														className={props.errors.componentId && props.touched.componentId ? "is-invalid" : ""}
													/>
													{props.errors.componentId && props.touched.componentId && (
														<div className="invalid-feedback">{props.errors.componentId}</div>
													)}
												</FormGroup>
											</Col>
											

										
										
											<Col>
												<FormGroup className="mb-3">
													<Label htmlFor="componentName">
													<span className="text-danger">* </span>{strings.ComponentName}
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
											<hr />
										
											


												<Row className="row-wrapper">
												<Col>
												<Label htmlFor="Earning"><span className="text-danger">* </span>{strings.ComponentType}
														<i
															id="ComponentTypetip"
															className="fa fa-question-circle ml-1"
														></i>
														<UncontrolledTooltip
															placement="right"
															target="ComponentTypetip"
														>
															The type of the component can not be changed,once it is linked to the employee's salary setup.
														</UncontrolledTooltip>&nbsp;&nbsp;
														<i className="fas fa-lock"></i>
												
												</Label><br></br>
																		&nbsp;&nbsp;&nbsp;
																				<FormGroup check inline>
																					<div className="custom-radio custom-control">
																						<input
																							className="custom-control-input"
																							type="radio"
																							id="inline-radio1"
															                             	name="inline-radio1"
																							checked={
																								this.state.selectedType
																							}
																							value={true}
																							onChange={(e) => {
																								if (
																									e.target.value === 'true'
																								) {
																									this.setState({
																										selectedType: true,
																										isActive: true
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio1"
																						>
																							{strings.Earning}
																						</label>
																					</div>
																				</FormGroup>
																			<FormGroup check inline>
																					<div className="custom-radio custom-control">
																						<input
																							className="custom-control-input"
																							type="radio"
																							id="inline-radio2"
																							name="inline-radio2"
																							value={false}
																							checked={
																								!this.state.selectedType
																							}
																							onChange={(e) => {
																								if (
																									e.target.value === 'false'
																								) {
																									this.setState({
																										selectedType: false,
																										isActive: false
																									});
																								}
																							}}
																						/>
																						<label
																							className="custom-control-label"
																							htmlFor="inline-radio2"
																						>
																							{strings.Deduction}
															</label><br></br><br></br>
																					</div>
																				</FormGroup>
																		</Col>
																		</Row>
																		<hr />
																	

											{/* <Row>
											<Col md="8">
												<FormGroup>
													<Label htmlFor="type"><span className="text-danger">* </span>{strings.Type}</Label>
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
										</Row> */}

										{/* <Row style={{ display: props.values.type.value !== 2 ? 'none' : '' }}>
											<Col lg={8}>
												<FormGroup className="mb-3">
													<Label htmlFor="salaryStructure"><span className="text-danger">* </span>
													 {strings.Percentage}
													</Label>
													<Input
														type="number"
														id="formula"
														name="formula"
														min="0"
														max="99"
															step="0.01"
														value={props.values.formula}
														maxLength={2}
														placeholder={strings.Enter+strings.Percentage}
														onChange={(option) => {
															if (option.target.value === '' || this.regDec1.test(option.target.value)) { props.handleChange('formula')(option) }
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
													<Label htmlFor="flatAmount"><span className="text-danger">* </span>
														 {strings.FlatAmount}
													</Label>
													<Input
														maxLength="8"
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

										</Row> */}

                                          <div>
												<Row className="row-wrapper">
												<Col>
													<Label htmlFor="calculationType"><span className="text-danger">* </span>{strings.CalculationType}</Label>
														<br></br>&nbsp;&nbsp;&nbsp;
													<FormGroup check inline>
														<div className="custom-radio custom-control">
															<input
																className="custom-control-input"
																type="radio"
																id="inline-radio3"
																name="inline-radio3"
																checked={props.values.calculationType === 'Percent Of CTC'}
																value={props.values.calculationType} 
																onChange={(value) => {
																props.handleChange('calculationType')('Percent Of CTC')
																	}}
															/>
															<label
																className="custom-control-label"
																htmlFor="inline-radio3"
															>
																{strings.PercentOfCTC}
															</label>
														</div>
													</FormGroup>
													<FormGroup check inline>
														<div className="custom-radio custom-control">
															<input
																className="custom-control-input"
																type="radio"
																id="inline-radio4"
																name="inline-radio4"
															
																// checked={
																// 	!this.state.selectedType
																// }
																
																	value={props.values.calculationType}
																	checked={props.values.calculationType === 'Flat Amount'}
																	onChange={(value) => {
																		props.handleChange('calculationType')('Flat Amount')
																	}}
															/>
															<label
																className="custom-control-label"
																htmlFor="inline-radio4"
															>
																{strings.FlatAmount}
															</label>
														</div>
													</FormGroup>
														<br></br><br></br><br></br>
													{/* <FormGroup className="mb-3">
														<Label htmlFor="percentOfCTC">
															<span className="text-danger">* </span>{strings.PercentOfCTC}
														</Label>
														<Input
															type="Number"
															id="percentOfCTC"
															name="percentOfCTC"
															value={props.values.percentOfCTC}
															// placeholder={strings.Enter + strings.ComponentName}
															// onChange={(option) => {
															// 	if (option.target.value === '' || this.regEx.test(option.target.value)) { props.handleChange('PercentageOfCTC')(option) }
															// }}
															className={props.errors.percentOfCTC && props.touched.percentOfCTC ? "is-invalid" : ""}
														/>
														{props.errors.percentOfCTC && props.touched.percentOfCTC && (
															<div className="invalid-feedback">{props.errors.percentOfCTC}</div>
														)}
													</FormGroup> */}
													<Row>
                                                        <Col md={6}>
														<FormGroup className="mb-3">
															<Label htmlFor="ctcPercent">
																<span className="text-danger">* </span>
																{strings.PercentOfCTC}
															</Label>
															<Input
																type='number'
																min={1}
																max={100}
																style={{display:'inline'}}
																value={props.values.ctcPercent}
																onChange={(option) => {
																	if (option.target.value > 0 && option.target.value < 101) {
																		props.handleChange('ctcPercent')(option,);
																	} else if (option.target.value === '') {
																		props.handleChange('ctcPercent')('');
																	}
																}}
																placeholder={strings.Enter + strings.PercentOfCTC}
																id="ctcPercent"
																name="ctcPercent"
																className={
																	props.errors.ctcPercent &&
																		props.touched.ctcPercent
																		? 'is-invalid'
																		: ''
																}
															/>
															{props.errors.ctcPercent &&
																props.touched.ctcPercent && (
																	<div className="invalid-feedback">
																		{props.errors.ctcPercent}
																	</div>
																)}
														</FormGroup> 
														</Col>
														</Row>
												</Col>

											</Row>
											</div>
											<hr />
											<Row>
												<Col>
													<p><strong>Note:</strong> {strings.SalaryComponentCreateNote}</p>
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
