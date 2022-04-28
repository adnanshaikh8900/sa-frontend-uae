import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Button,
	Col,
	FormGroup,
	Card,
	CardHeader,
	CardBody,
	Row,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Form,
	Label,
	Table,
	Input
} from 'reactstrap';
import { AuthActions, CommonActions } from 'services/global';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css'
import './style.scss';
import { data } from '../Language/index'

import { Formik } from 'formik';
import * as Yup from 'yup';
import LocalizedStrings from 'react-localization';
import { Loader } from 'components';
import { TextareaAutosize } from '@material-ui/core';
import * as NotesSettingsAction from './actions';
import { toast } from 'react-toastify';
const mapStateToProps = (state) => {
	return {
		version: state.common.version,
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		authActions: bindActionCreators(AuthActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		notesSettingsAction: bindActionCreators(NotesSettingsAction, dispatch),
	};
};


let strings = new LocalizedStrings(data);
class NotesSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			disabled: false,
			defaultFootNotes: "",
			defaultNotes: "",
			loadingMsg: "Loading..."
		};

	}

	componentWillMount = () => {

		this.props.notesSettingsAction.getNoteSettingsInfo().then((res) => {
			if (res.status === 200) {
				this.setState({
					defaultFootNotes: res.data.defaultFootNotes,
					defaultNotes: res.data.defaultNotes
				});
			}
		});
	};

	handleSubmit = (data) => {
		
		let formData=new FormData()
		formData.append("defaultNote",this.state.defaultNotes)
		formData.append("defaultFootNote",this.state.defaultFootNotes)
		this.props.notesSettingsAction.saveNoteSettingsInfo(formData).then((res) => {
			if (res.status === 200) {
				toast.success("Default Notes Saved Successfully")
				this.props.history.push('/admin/dashboard');
			}
		}).catch((err) => {
			toast.error("Save UnSuccessful")
		})
	}
	render() {
		strings.setLanguage(this.state.language);
		const { initValue, loading, loadingMsg } = this.state;

		return (
			loading == true ? <Loader loadingMsg={loadingMsg} /> :
				<div>
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
														<span className="ml-2">{strings.CustomerInvoiceNotesSettings}</span>
													</div>
												</Col>
											</Row>
										</CardHeader>
										<CardBody>
											<Formik
												initialValues={this.state}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmit(values, resetForm);
												}}
												validate={(values) => {
													let errors = {};
													// 
													// if(this.state.defaultFootNotes=="")
													// errors.defaultFootNotes='Default Foot Note is Required';

													// if(this.state.defaultNotes=="")
													// errors.defaultNotes='Default Note is Required'
													return errors;

												}}
												validationSchema
											>
												{(props) => (
													<Form onSubmit={props.handleSubmit}>

														<Row className="row-wrapper">
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="select">
																		{/* <span className="text-danger">* </span> */}
																		{strings.DefaultDeliveryNotes}

																	</Label>
																	<br />
																	<TextareaAutosize
																		style={{ width: "1000px" }}
																		type="textarea"
																		maxLength="255"
																		className='textarea'
																		name="defaultNotes"
																		id="defaultNotes"
																		rows="5"
																		placeholder={strings.DeliveryNotes}
																		onChange={(option) => {
																			props.handleChange(
																				'defaultNotes',
																			)(option)
																			this.setState({ defaultNotes: option.target.value })
																		}
																		}
																		value={this.state.defaultNotes}
																	/>
																	{props.errors.defaultNotes && (
																		<div className="invalid-feedback">
																			{props.errors.defaultNotes}
																		</div>
																	)}
																</FormGroup>
															</Col>

														</Row>
														<Row>
															<Col md="4">
																<FormGroup>
																	<Label htmlFor="defaultFootNotes ">
																		{/* <span className="text-danger">* </span> */}
																		{strings.DefaultFootnotes}
																	</Label>
																	<br />
																	<TextareaAutosize
																		style={{ width: "1000px" }}
																		type="textarea"
																		maxLength="255"
																		className='textarea'
																		name="defaultFootNotes"
																		id="defaultFootNotes"
																		rows="5"
																		placeholder={strings.PaymentDetails}
																		onChange={(option) => {
																			props.handleChange(
																				'defaultFootNotes',
																			)(option)
																			this.setState({ defaultFootNotes: option.target.value })
																		}
																		}
																		value={
																			this.state.defaultFootNotes
																		}
																	/>
																	{props.errors.defaultFootNotes && (
																		<div className="invalid-feedback">
																			{props.errors.defaultFootNotes}
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
																			? 'Saving...'
																			: strings.Save}
																	</Button>

																	<Button
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push('/admin/dashboard');
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
										</CardBody>
									</Card>
								</Col>
							</Row>
						</div>
					</div>
				</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesSettings);
