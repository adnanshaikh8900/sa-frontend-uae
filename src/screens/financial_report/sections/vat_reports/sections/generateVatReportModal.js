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
import * as VatReportActions from '../actions';

const mapStateToProps = (state) => {

	return {
		contact_list: state.request_for_quotation.contact_list,
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		commonActions: bindActionCreators(CommonActions, dispatch),
		payrollEmployeeActions: bindActionCreators(PayrollEmployeeActions, dispatch),
		vatReportActions: bindActionCreators(VatReportActions, dispatch),
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
class GenerateVatReportModal extends React.Component {
	constructor(props) {

		var date = new Date();
		var lastdayoflastmonth = new Date();
		
		var firstdayoflastmonth = new Date();
		firstdayoflastmonth.setDate(1);

		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			selectedRows: [],
			actionButtons: {},
			initValue: {
				startDate: firstdayoflastmonth.setMonth(firstdayoflastmonth.getMonth()-1),
				endDate: lastdayoflastmonth.setMonth(lastdayoflastmonth.getMonth(), 0),
			},
			dialog: null,
			filterData: {
				name: '',
				email: ''
			},
			csvData: [],
			view: false,
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

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};
	componentDidMount = () => {

	};

	handleChange = (val, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: val
			})
		})
	}

	generateReport = () => {
		const { openModal, closeModal } = this.props;
		this.setState({ disabled: true });
		const { initValue } = this.state;
		const postData = {
			startDate: moment(this.state.initValue.startDate).format('DD-MM-YYYY'),
			endDate: moment(this.state.initValue.endDate).format('DD-MM-YYYY'),
		};

		this.props.vatReportActions
			.generateReport(postData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success',	res.data && res.data.message?res.data.message:  'Vat Report Generated Successfully')
				}
				closeModal(false);
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
				closeModal(false);
			})
	}

	render() {
		strings.setLanguage(this.state.language);
		const { openModal, closeModal } = this.props;
		const { initValue, loading } = this.state;

		var lastdayoflastmonth = new Date();
		
		var firstdayoflastmonth = new Date();
		    firstdayoflastmonth.setDate(1);
		
		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<ModalHeader>
						<Row>
							<Col lg={12}>
								<div className="h4 mb-0 d-flex align-items-center">
									<i className="nav-icon fas fa-user-tie" />
									<span className="ml-2">Report Filling</span>
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
															<FormGroup className="mb-3">
																<Label htmlFor="startDate">{strings.StartDate}</Label>
																<DatePicker
																	id="date"
																	name="startDate"
																	className={`form-control`}
																	placeholderText="From"
																	showMonthDropdown
																	showYearDropdown
																	autoComplete="off"
																	minDate={new Date("01/01/2018")}
																	// maxDate={firstdayoflastmonth.setMonth(firstdayoflastmonth.getMonth()-1)}
																	maxDate={new Date(Date.now() - 86400000)}
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
																		this.setState({...this.state.initValue,initValue: {startDate: value,endDate:this.state.initValue.endDate} })
																	}}
																/>
															</FormGroup>
														</Col>
														<Col lg={4}>
															<FormGroup className="mb-3">
																<Label htmlFor="endDate">{strings.EndDate}</Label>
																<DatePicker
																	id="date"
																	name="endDate"
																	className={`form-control`}
																	autoComplete="off"
																	minDate={new Date("01/01/2018")}
																	// maxDate={lastdayoflastmonth.setMonth(lastdayoflastmonth.getMonth(), 0)}
																	maxDate={new Date(Date.now() - 86400000)}
																	placeholderText="From"
																	showMonthDropdown
																	showYearDropdown
																	value={moment(props.values.endDate).format(
																		'DD-MM-YYYY',
																	)}
																	dropdownMode="select"
																	dateFormat="dd-MM-yyyy"
																	onChange={(value) => {
																		props.handleChange('endDate')(value);
																		this.setState({...this.state.initValue,initValue: {endDate: value,startDate:this.state.initValue.startDate} })
																	}}
																/>
															</FormGroup>
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
									onClick={this.generateReport}
								// disabled={selectedRows.length === 0}

								>
									<i class="fas fa-check-double mr-1"></i>

									Generate
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
)(GenerateVatReportModal);