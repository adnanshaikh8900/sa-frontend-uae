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
import * as CreatePayrollActions from '../actions';
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
		createPayrollActions: bindActionCreators(CreatePayrollActions, dispatch),
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
class VatSettingModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			selectedRows: [],
			actionButtons: {},

			dialog: null,
			filterData: {
				name: '',
				email: ''
			},
			reporting_period_list: [{ label: "Custom", value: 1 }],
			view: false
		};



	}



	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.employee_list !== nextProps.employee_list) {
			console.log('getDerivedStateFromProps state changed', nextProps.selectedData);
			return {
				prefixData: nextProps.prefixData,
				employee_list: nextProps.employee_list,
			};
		}

	}


	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
	};
	handleChange = (val, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: val
			})
		})
	}


	componentWillUnmount = () => {
		this.setState({
			selectedRows: []
		})
	}

	render() {
		strings.setLanguage(this.state.language);
		const { openModal, closeModal } = this.props;
		const { initValue, loading, reporting_period_list } = this.state;

		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<ModalHeader>
						<Row>
							<Col lg={12}>
								<div className="h4 mb-0 d-flex align-items-center">
									<i className="nav-icon fas fa-user-tie" />
									<span className="ml-2">Tax Return Settings</span>
								</div>
							</Col>
						</Row>
					</ModalHeader>
					<ModalBody style={{ padding: "15px 0px 0px 0px" }}>
						<div style={{ padding: " 0px 1px" }}>
							<div >
								<CardBody>
									{loading ? (
										<Row>
											<Col lg={12}>
												<Loader />
											</Col>
										</Row>
									) : (
										<> <Formik initialValues={initValue}>
											{(props) => (
												<Form>
													<Row>
														
														<Col lg={4}>
															<FormGroup className="mb-3"><span className="text-danger">* </span>
																<Label htmlFor="startDate">{strings.VatRegisteredOn}</Label>
																<DatePicker
																	id="date"
																	name="startDate"
																	className={`form-control`}
																	placeholderText="From"
																	showMonthDropdown
																	showYearDropdown
																	autoComplete="off"
																	maxDate={new Date()}
																	value={moment(props.values.startDate).format(
																		'DD-MM-YYYY',
																	)}
																	dropdownMode="select"
																	dateFormat="dd-MM-yyyy"
																	// onChange={(value) => {
																	// 	props.handleChange('startDate')(value);
																	// 	if (moment(value).isBefore(props.values.startDate)) {
																	// 		props.setFieldValue(
																	// 			'startDate',
																	// 			moment(value).add(1, 'M'),
																	// 		);
																	// 	}
																	// }}

																	onChange={(value) => {
																		props.handleChange('startDate')(value);
																	}}
																/>
															</FormGroup>
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3"><span className="text-danger">* </span>
																<Label htmlFor="endDate">Generate First Tax Return From</Label>
																<DatePicker
																	id="date"
																	name="endDate"
																	className={`form-control`}
																	autoComplete="off"
																	maxDate={new Date()}
																	placeholderText="From"
																	showMonthDropdown
																	showYearDropdown
																	value={moment(props.values.endDate).format(
																		'DD-MM-YYYY',
																	)}
																	dropdownMode="select"
																	dateFormat="dd-MM-yyyy"
																	// onChange={(value) => {
																	// 	 
																	// 	props.handleChange('endDate')(value);
																	// 	if (moment(value).isBefore(props.values.endDate)) {
																	// 		props.setFieldValue(
																	// 			'endDate',
																	// 			moment(value).subtract(1, 'M'),
																	// 		);
																	// 	}
																	// }}
																	onChange={(value) => {
																		props.handleChange('endDate')(value);
																	}}
																/>
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
															<FormGroup className="mb-3">
																<Label htmlFor="reportingPeriod">
																	Repoting Period
																</Label>
																<Select
																	// isDisabled
																	styles={customStyles}
																	id="reportingPeriod"
																	name="reportingPeriod"
																	placeholder={strings.Select + strings.PlaceofSupply}
																	options={
																		reporting_period_list
																	}
																	// value={
																	// 	reporting_period_list 
																	// 	&& reporting_period_list.find(
																	// 		(option) =>
																	// 			option.value ===
																	// 			props.values.reportingPeriod,
																	// 	)
																	// }
																	className={
																		props.errors.reportingPeriod &&
																			props.touched.reportingPeriod
																			? 'is-invalid'
																			: ''
																	}
																	onChange={(option) =>
																		props.handleChange('reportingPeriod')(
																			option,
																		)
																	}
																/>
																{props.errors.reportingPeriod &&
																	props.touched.reportingPeriod && (
																		<div className="invalid-feedback">
																			{props.errors.reportingPeriod}
																		</div>
																	)}
															</FormGroup>
														</Col>

													</Row>
													<Row>
														{/* <Col lg={4} >	
										
															<Label> International Trade</Label>
															</Col> */}
														<Col lg={4} >
															<Checkbox
																id="isReverseChargeEnabled"
																checked={this.state.isReverseChargeEnabled}
																onChange={(option) => {
																	this.setState({ isReverseChargeEnabled: !this.state.isReverseChargeEnabled })
																	// for resetting VAT
																	props.handleChange('vatCategoryId')('');
																}}
															/>
															<Label> Enable Trade With contacts ouside U.A.E.</Label>
														</Col>
													</Row>

												</Form>
											)}
										</Formik> </>
									)}
								</CardBody>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>

						<Row className="mb-4 ">

							<Col>
								<Button
									color="primary"
									className="btn-square "
									onClick={this.addEmployees}
								// disabled={selectedRows.length === 0}

								>
									<i class="fas fa-check-double mr-1"></i>

									Save
								</Button>
								<Button
									color="secondary"
									className="btn-square"
									onClick={() => {
										closeModal(false);
									}}
								>
									<i className="fa fa-ban"></i> {strings.Cancel}
								</Button>
							</Col>
						</Row>

					</ModalFooter>
				</Modal>

			</div>
		);
	}
}


export default connect(
	mapStateToProps
	, mapDispatchToProps
)(VatSettingModal);