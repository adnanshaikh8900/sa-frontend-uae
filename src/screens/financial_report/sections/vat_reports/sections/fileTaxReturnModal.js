import React from 'react';
import { connect } from 'react-redux';
import logo from 'assets/images/brand/datainnLogo.png';
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
	UncontrolledTooltip,
	CardBody,
	Table,
	Card,
	ButtonGroup,
	ModalHeader,
} from 'reactstrap';
import { toInteger, upperCase, upperFirst } from 'lodash';
import { Formik, Field } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { selectOptionsFactory } from 'utils';
import DatePicker from 'react-datepicker';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { CommonActions } from 'services/global';

import { toast } from 'react-toastify';
import { data } from '../../../../Language/index'
import LocalizedStrings from 'react-localization';

import '../style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';
import ReactToPrint from 'react-to-print';
import { Loader } from 'components';
import * as PayrollEmployeeActions from '../../../../payrollemp/actions'
import * as VatreportActions from '../actions';
import { Checkbox } from '@material-ui/core';

const mapStateToProps = (state) => {

	return {
		contact_list: state.request_for_quotation.contact_list,
		payroll_employee_list: state.payrollEmployee.payroll_employee_list,
	};

};


const mapDispatchToProps = (dispatch) => {
	return {
		commonActions: bindActionCreators(CommonActions, dispatch),
		payrollEmployeeActions: bindActionCreators(PayrollEmployeeActions, dispatch),
		vatreportActions: bindActionCreators(VatreportActions, dispatch),
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
class FileTaxReturnModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			selectedRows: [],
			actionButtons: {},
			initValue: {
				taxablePersonNameInEnglish: '',
				taxFiledOn: new Date(),
				vatReportFiling: '',
				vatRegistrationNumber: '',
				taxAgentApprovalNumber: '',
				taxAgencyNumber: '',
				taxAgencyName: '',
				taxAgentName: '',
				taxablePersonNameInArabic: '',
			},
			isTANMandetory:false,
			isTAANMandetory:false,
			isTaxAgentName:false,
			dialog: null,
			filterData: {
				name: '',
				email: ''
			},
			reporting_period_list: [{ label: "Custom", value: 1 }],
			view: false
		};
		this.regEx = /^[0-9\d]+$/;
		// this.regEx = /[a-zA-Z0-9]+$/;
		this.regExTelephone = /^[0-9-]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s\D,'-/]+$/;

		this.formikRef = React.createRef();
	}


	handleSubmit = (data, resetForm, setSubmitting) => {
		this.setState({ disabled: true });

		this.props.vatreportActions
			.fileVatReport(data)
			.then((res) => {
				let resConfig = JSON.parse(res.config.data);
				
				if (res.status === 200) {
					this.setState({ disabled: false });
					this.props.commonActions.tostifyAlert(
						'success',
						res.data.message?res.data.message:'Vat Report Filed Successfully',
					);
					resetForm();
					this.setState({isTANMandetory:false})
					this.setState({isTAANMandetory:false})
					this.props.closeModal(true);
				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.displayMsg(err);
				this.formikRef.current.setSubmitting(false);
			});
	};

	displayMsg = (err) => {
		toast.error(`${err.data.message}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};
	_showDetails = (bool) => {
		this.setState({
		  showDetails: bool
		});
	  }


	componentDidMount = () => {
		this.props.vatreportActions.getCompanyDetails().then((res)=>{			
			if(res.status==200){
			this.setState({initValue:{vatRegistrationNumber:res.data.vatRegistrationNumber?res.data.vatRegistrationNumber:""}})}
		});
	};
dateLimit=()=>{
	const { endDate} = this.props;

		if(endDate){
			var datearray = endDate.split("/");
			return	new Date(parseInt(datearray[2]),parseInt(datearray[1])-1,parseInt(datearray[0])+1)
		}
	}
	render() {
		strings.setLanguage(this.state.language);
		const { openModal, closeModal ,current_report_id,endDate,taxReturns} = this.props;
		const { initValue, loading, reporting_period_list } = this.state;

		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<ModalHeader>
						<Row>
							<Col lg={12}>
								<div className="h4 mb-0 d-flex align-items-center">
									<i className="nav-icon fas fa-user-tie" />
									<span className="ml-2">File The Report For Vat Return ( {taxReturns} )</span>
								</div>
							</Col>
						</Row>
					</ModalHeader>
			
					<Formik
						ref={this.formikRef}
						initialValues={initValue}
						onSubmit={(values, { resetForm, setSubmitting }) => {
							this.handleSubmit(values, resetForm);
						}}
						validate={(values) => {
							let errors = {};
							 
							if (this.state.isTANMandetory === true &&( values.taxAgencyNumber=="" ||values.taxAgencyNumber==undefined)) 
							{
								errors.taxAgencyNumber ='TAN is Required';
								if (values.taxAgentApprovalNumber=="" || values.taxAgentApprovalNumber==undefined)
								{
									errors.taxAgentApprovalNumber = 'TAAN is Required';
								}
								if (values.taxAgentName=="" || values.tax==undefined)
								{
									errors.taxAgentName = 'Tax Agent Name is Required';
								}
							}debugger
							if (this.state.isTAANMandetory === true && (values.taxAgentApprovalNumber=="" || values.taxAgentApprovalNumber==undefined))
							{
								errors.taxAgentApprovalNumber = 'TAAN is Required';
							}												
							return errors;
						}}
						validationSchema={Yup.object().shape({
							// taxAgentName: Yup.string().required('Tax Agent Name is Required'),
							taxablePersonNameInEnglish: Yup.string().required('Taxable Person Name In English is Required'),
							// taxablePersonNameInArabic: Yup.string().required('Taxable Person Name In Arabic is Required'),
							// taxAgentApprovalNumber: Yup.string().required('TAAN is Required'),
							vatRegistrationNumber: Yup.string().required('Tax Registration Number is Required'),
							taxFiledOn: Yup.string().required(
								'Date of Filling is Required',
							),
										})}
					>
						{(props) => {
							const { isSubmitting } = props;
							return (
								<Form
									name="simpleForm"
									onSubmit={props.handleSubmit}
									className="create-contact-screen"
								>
				
									<ModalBody>
								<Row className='mb-4'><Col><h4>Once report is filed, you won't be able to edit any transactions for this tax period.</h4></Col></Row>
													<Row>
														<Col lg={4}>
															<FormGroup className="mb-3"><span className="text-danger">* </span>
																<Label htmlFor="taxablePersonNameInEnglish">Taxable Person Name (English)</Label>
																<Input
																	type="text"
																	name="taxablePersonNameInEnglish"
																	id="taxablePersonNameInEnglish"
																	maxLength="100"
																	placeholder={"Enter Taxable Person Name (English)"}
																	onChange={(option) =>{
																		props.handleChange('taxablePersonNameInEnglish')(option)
																		props.handleChange('vatReportFiling')(current_report_id)
																		}
																	}
																	defaultValue={props.values.taxablePersonNameInEnglish}
																/>
																{props.errors.taxablePersonNameInEnglish &&												
																(
																		<div className='text-danger' >
																			{props.errors.taxablePersonNameInEnglish}
																		</div>
																	)}
															</FormGroup>
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3"><span className="text-danger"> </span>
																<Label htmlFor="taxablePersonNameInArabic">Taxable Person Name (Arabic)</Label>
																<Input
																	type="text"
																	name="taxablePersonNameInArabic"
																	id="taxablePersonNameInArabic"
																	maxLength="100"
																	placeholder={"Enter Taxable Person Name (Arabic)"}
																	onChange={(option) =>
																		props.handleChange('taxablePersonNameInArabic')(option)
																	}
																	defaultValue={props.values.taxablePersonNameInArabic}
																/>
																{props.errors.taxablePersonNameInArabic &&												
																(
																		<div className='text-danger' >
																			{props.errors.taxablePersonNameInArabic}
																		</div>
																	)}
															</FormGroup>
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3">
															{this.state.isTANMandetory === true &&(<span className="text-danger">* </span>)}
																<Label htmlFor="taxAgentName">Tax Agent Name</Label>
																<Input
																	type="text"
																	name="taxAgentName"
																	id="taxAgentName"
																	maxLength="100"
																	placeholder={"Enter Agenct Name"}
																	onChange={(option) =>{
																		props.handleChange('taxAgentName')(option)

																		if(option.target.value !=""){
																			this.setState({isTAANMandetory:true})
																		}else{
																			this.setState({isTAANMandetory:false})

																		}
																	}}
																	defaultValue={props.values.taxAgentName}
																/>
																
													{props.errors.taxAgentName &&												
																(
																		<div className='text-danger' >
																			{props.errors.taxAgentName}
																		</div>
																	)}
															</FormGroup>
														</Col>
													</Row>

													<Row>
														<Col lg={4}>
															<FormGroup className="mb-3">
															{this.state.isTANMandetory === true &&(<span className="text-danger"> </span>)}
																<Label htmlFor="taxAgencyName">Tax Agency Name </Label>
																<Input
																	type="text"
																	name="taxAgencyName"
																	id="taxAgencyName"
																	maxLength="100"
																	placeholder={"Enter Tax Agency Name"}
																	onChange={(option) =>{
																		props.handleChange('taxAgencyName')(option)
																
																			if(option.target.value !=""){
																				this.setState({isTANMandetory:true})
																			}
																			else{
																			    this.setState({isTANMandetory:false})
																			}
																		}}
																	defaultValue={props.values.taxAgencyName}
																/>
															</FormGroup>
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3">
													{this.state.isTANMandetory === true &&(<span className="text-danger">* </span> )}
																<Label htmlFor="taxAgencyNumber">Tax Agency Number (TAN)</Label>
																<Input
																	type="text"
																	name="taxAgencyNumber"
																	id="taxAgencyNumber"
																	maxLength="8"
																	autoComplete='off'
																	placeholder={"Enter Tax Agency Number (TAN)"}
																	onChange={(option) =>
																		{
																		if (option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {																				
																				props.handleChange('taxAgencyNumber')(option)
																			}
																		}}
																	value={props.values.taxAgencyNumber}
																/>
																	{props.errors.taxAgencyNumber &&												
																(
																		<div className='text-danger' >
																			{props.errors.taxAgencyNumber}
																		</div>
																	)}
															</FormGroup>
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3">
																	
																{(this.state.isTANMandetory === true || this.state.isTAANMandetory) &&(<span className="text-danger">* </span>)}
															
																<Label htmlFor="taxAgentApprovalNumber">Tax Agent Approval Number (TAAN) </Label>
																<Input
																	type="text"
																	name="taxAgentApprovalNumber"
																	id="taxAgentApprovalNumber"
																	maxLength="8"
																	autoComplete='off'
																	placeholder={"Enter Tax Agent Approval Number (TAAN)"}
																	onChange={(option) => 
																		{
																		if (
																			option.target.value === '' ||
																			this.regEx.test(option.target.value)
																		) {
																			props.handleChange('taxAgentApprovalNumber')(option)
																		}
																	}}
																	value={props.values.taxAgentApprovalNumber}
																/>
																{props.errors.taxAgentApprovalNumber &&												
																		(
																				<div className='text-danger' >
																					{props.errors.taxAgentApprovalNumber}
																				</div>
																			)}
															</FormGroup>
														</Col>

													</Row>
													<Row>
														<Col lg="4" >
															<FormGroup>
																<Label htmlFor="vatRegistrationNumber"><span className="text-danger">* </span>
																	{strings.TaxRegistrationNumber}
																</Label>
																<Input
																disabled
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
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3"><span className="text-danger">*</span>
																<Label htmlFor="taxFiledOn">Date Of Filling</Label>
																<DatePicker
																		id="taxFiledOn"
																		name="taxFiledOn"
																		placeholderText={"Tax Filed On"}
																		showMonthDropdown
																		showYearDropdown
																		autoComplete='off'
																		dateFormat="dd-MM-yyyy"
																		dropdownMode="select"
																		minDate={this.dateLimit()}
																		value={props.values.taxFiledOn}
																		selected={props.values.taxFiledOn}
																		onChange={(value) => {																			
																			props.handleChange('taxFiledOn')(value);
																		}}
																		className={`form-control ${
																			props.errors.taxFiledOn &&
																			props.touched.taxFiledOn
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.taxFiledOn &&
																   (
																		<div className='text-danger'>
																			{props.errors.taxFiledOn}
																		</div>
																	)}
															</FormGroup>
														</Col>
													</Row>
									</ModalBody>
									<ModalFooter>
										<Button
											color="primary"
											type="submit"
											className="btn-square"
											disabled={this.state.disabled}
											disabled={isSubmitting}
										>
											<i className="fa fa-dot-circle-o"></i> 	{this.state.disabled
																			? 'Saving...'
																			: strings.Save }
										</Button>
										&nbsp;
										<Button
											color="secondary"
											className="btn-square"
											onClick={() => {											
												this.setState({isTANMandetory:false})
												this.setState({isTAANMandetory:false})
												closeModal(false);
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


export default connect(
	mapStateToProps
	, mapDispatchToProps
)(FileTaxReturnModal);