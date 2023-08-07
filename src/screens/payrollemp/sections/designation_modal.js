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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { data } from '../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
class DesignationModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			showDetails: false,
			loading: false,
			initValue: {
				designationName:'',
				designationId:''
			  },
			idExist:false,
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

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const {
			designationName,
			designationId
		} = data;
		const formData = new FormData();

		formData.append(
			'designationId',
			designationId != null ? designationId : '',
		  )
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
					toast.success("Designation Created Successfully")
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

	render() {
		strings.setLanguage(this.state.language);
		const {
			openDesignationModal,
			closeDesignationModal,
			nameDesigExist,
			idDesigExist,
			validateinfo,
			validateid,
		} = this.props;
		const { initValue } = this.state;
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
						
						validate={(values) => {
							let errors = {};
						  
						   if(values.designationId === '0'){
							  errors.designationId=
							   "Designation ID should be greater than 0";
						   }

						   if(this.state.idDesigExist==true){
							  errors.designationId=
							   "Designation ID already exist";
						   }
  
						   if(this.state.nameDesigExist==true){
							errors.designationName=
							 "Designation name already exist";
						}
							// return errors;
						   
							return errors;
						  }}
						validationSchema={Yup.object().shape({
							//	firstName: Yup.string().required('First Name is required'),

							designationName: Yup.string().required('Designation Name is required').test('is new',
								"Designation Name already exist",
								() => !nameDesigExist),
							designationId: Yup.string().required('Designation ID is required').test('is new',
								"Designation ID already exist",
								() => !idDesigExist)

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
										<Col lg={5}>
												<FormGroup>
												<Label htmlFor="select"><span className="text-danger">* </span>{strings.DESIGNATIONID}</Label>
												<Input
													type="text"
													id="designationId"
													name="designationId"
													maxLength="9"
													value={props.values.designationId}
													placeholder={strings.Enter+strings.DESIGNATIONID}
													onChange={(option) => {
													if (option.target.value === '' || this.regEx.test(option.target.value)) {
														props.handleChange('designationId')(option)
														validateid(option.target.value)
													}
													}}
													className={props.errors.designationId && props.touched.designationId ? "is-invalid" : ""}
												/>
												{props.errors.designationId && props.touched.designationId && (
													<div className="invalid-feedback">{props.errors.designationId}</div>
												)}
												</FormGroup>
											</Col>
											<Col lg={5}>
												<FormGroup>
													<Label htmlFor="select"><span className="text-danger">* </span>{strings.DesignationName}</Label>
													<Input
														type="text"
														id="designationName"
														name="designationName"
														value={props.values.designationName}
														placeholder={strings.Enter + strings.DesignationName}
														onChange={(option) => {
															if (option.target.value === '' || this.regExAlpha.test(option.target.value)) {

																props.handleChange('designationName')(option)
																validateinfo(option.target.value)
															}
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
												this.setState(() => {
													props.handleSubmit();
												});
											}}
										>
											<i className="fa fa-dot-circle-o"></i>  {this.state.disabled
												? 'Creating...'
												: strings.Create}
										</Button>
										&nbsp;
										<Button
											color="secondary"
											className="btn-square"
											onClick={() => {
												closeDesignationModal(false);
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

export default DesignationModal;
