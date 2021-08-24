import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	ButtonGroup,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";
import { ImageUploader, Loader } from 'components';
import {
	CommonActions
} from 'services/global'
import { selectCurrencyFactory, selectOptionsFactory } from 'utils'
import * as EmployeeActions from '../../actions';
import * as CreatePayrollActions from './actions';
import * as CreatePayrollEmployeeActions from '../../../payrollemp/screens/create/actions';
import * as PayrollEmployeeActions from '../../../payrollemp/actions'
import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'
import PhoneInput from 'react-phone-number-input'
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { AddEmployeesModal } from './sections';
import moment from 'moment';

const mapStateToProps = (state) => {

	return ({
		currency_list: state.employee.currency_list,
		country_list: state.contact.country_list,
		state_list: state.contact.state_list,
		employees_for_dropdown: state.payrollRun.employees_for_dropdown,
		// employee_list:state.payrollEmployee.payroll_employee_list,
		employee_list: state.payrollEmployee.employee_list_dropdown,

	})
}
const mapDispatchToProps = (dispatch) => {
	return ({
		commonActions: bindActionCreators(CommonActions, dispatch),
		employeeActions: bindActionCreators(EmployeeActions, dispatch),
		createPayrollActions: bindActionCreators(CreatePayrollActions, dispatch),
		createPayrollEmployeeActions: bindActionCreators(CreatePayrollEmployeeActions, dispatch),
		payrollEmployeeActions: bindActionCreators(PayrollEmployeeActions, dispatch),

	})
}
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
class CreatePayroll extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			createMore: false,
			loading: false,
			initValue: {
				type: '',
				name: '',
			},
			payrollDate:new Date(),
			payrollSubject:'',
			employeeListIds: [],
			openModal: false
		}

		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.selectRowProp = {
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		}
		this.options = {
			// onRowClick: this.goToDetail,
			paginationPosition: 'bottom',
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: '',
			sortOrder: '',
			onSortChange: this.sortColumn
		}

	}

	componentDidMount = () => {
		this.initializeData();
	};
	closeModal = (res) => {
		this.setState({ openModal: false });
	};
	initializeData = () => {

		this.props.createPayrollActions.getEmployeesForDropdown();
		this.props.createPayrollEmployeeActions.getEmployeesForDropdown();
		const { filterData } = this.state
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage
		}
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : ''
		}
		const postData = { ...filterData, ...paginationData, ...sortingData }
		this.props.payrollEmployeeActions.getPayrollEmployeeList(postData).then((res) => {
			if (res.status === 200) {

				this.setState({ loading: false })
			}
		}).catch((err) => {
			this.setState({ loading: false })
			this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
		})
	};
	employeeListIds = (option) => {
		this.setState(
			{
				initValue: {
					...this.state.initValue,
					...{
						employeeListIds: option,
					},
				},
			},
			() => { },
		);
		// this.formRef.current.setFieldValue('employeeListIds', option, true);
	};
	setDate = (props, value) => {
		const { term } = this.state;
		const val = term ? term.value.split('_') : '';
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
		const values = value
			? value
			: moment(props.values.payrollDate, 'DD/MM/YYYY').toDate();
		// if (temp && values) {
		// 	const date = moment(values)
		// 		.add(temp - 1, 'days')
		// 		.format('DD/MM/YYYY');
		// 	props.setFieldValue('invoiceDueDate', date, true);
		// }
	};
	addEmployee = (data, resetForm) => {

		this.setState({ disabled: true });
		const {
			employeeIds,
			employeeListIds,
			noOfDays,
			salaryDate
		} = data;
		// var result = employeeListIds.map((o) => ({
		//   employeeIds: o.value,  
		// }));
		const formData = new FormData();
		// formData.append(
		// 	'employeeListIds',
		//   employeeIds.value)
		employeeIds.forEach(item => {
			formData.append('employeeListIds', item.value);
		});
		this.props.createPayrollActions
			.addMultipleEmployees(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Employees added Successfully')
					resetForm(this.state.initValue)
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
	}

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const {
			payrollDate,
			payPeriod,
			payrollSubject
		} = data;


		const formData = new FormData();

		formData.append(
			'payrollSubject',
			payrollSubject != null ? payrollSubject : '',
		)
		formData.append(
			'payPeriod',
			payPeriod != null ? payPeriod : '',
		)
	
		this.props.createPayrollActions
			.createPayrolls(payPeriod,payrollSubject)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'New Payroll Created Successfully')
						
						this.props.history.push('/admin/payroll/createPayrollList',{id:res.data})
					
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
	}


	render() {
		strings.setLanguage(this.state.language);

		const { employee_list } = this.props
		const { loading } = this.state
		return (
			<div className="create-employee-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="nav-icon fas fa-user-tie" />
												<span className="ml-2">Create Payroll</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									{loading ? (
										<Row>
											<Col lg={12}>
												<Loader />
											</Col>
										</Row>
									) : (
										<Row>
											<Col lg={12}>
												<div className="d-flex justify-content-end">
													<ButtonGroup size="sm">

													</ButtonGroup>
												</div>
												<div>
													<Formik
														initialValues={this.state.initValue}
														onSubmit={(values, { resetForm }) => {
															this.handleSubmit(values, resetForm)

														}}

													>
														{(props) => (


															<Form onSubmit={props.handleSubmit}>
																<Row>
																	{/* <Col md="4">
																		<FormGroup>
																			<Label htmlFor="payrollSubject">Payroll Date</Label>
																			<Input
																				type="text"
																				id="payrollSubject"
																				name="payrollSubject"
																				value={props.values.payrollSubject}
																				placeholder={strings.Select + "Payroll Date"}
																				onChange={(value) => {
																					props.handleChange('payrollSubject')(value);

																				}}
																				className={props.errors.payrollSubject && props.touched.payrollSubject ? "is-invalid" : ""}
																			/>
																			{props.errors.payrollSubject && props.touched.payrollSubject && (
																				<div className="invalid-feedback">
																					{props.errors.payrollSubject}
																				</div>
																			)}

																		</FormGroup>
																	</Col> */}
																	{/* <Col lg={3}>
																<FormGroup className="mb-3">
																	<Label htmlFor="date">
																		<span className="text-danger">*</span>
																		Payroll Date
																	</Label>
																	<DatePicker
																		id="payrollDate"
																		name="payrollDate"
																		placeholder={strings.Select + "Payroll Date"}
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd/MM/yyyy"
																		dropdownMode="select"
																		value={props.values.payrollDate}
																		selected={props.values.payrollDate}
																		onChange={(value) => {
																			props.handleChange('payrollDate')(value);
																			this.setDate(props, value);
																		}}
																		className={`form-control ${props.errors.payrollDate &&
																				props.touched.payrollDate
																				? 'is-invalid'
																				: ''
																		}`}
																	/>
																	{props.errors.payrollDate &&
																		props.touched.payrollDate && (
																			<div className="invalid-feedback">
																				{props.errors.payrollDate}
																			</div>
																		)}
																</FormGroup>
															</Col> */}
																	<Col md="4">
																		<FormGroup>
																			<Label htmlFor="payrollSubject"> Payroll Subject</Label>
																			<Input
																				type="text"
																				id="payrollSubject"
																				name="payrollSubject"
																				value={props.values.payrollSubject}
																				placeholder={strings.Enter + " Payroll Subject"}
																				onChange={(value) => {
																					props.handleChange('payrollSubject')(value);

																				}}
																				className={props.errors.payrollSubject && props.touched.payrollSubject ? "is-invalid" : ""}
																			/>
																			{props.errors.payrollSubject && props.touched.payrollSubject && (
																				<div className="invalid-feedback">
																					{props.errors.payrollSubject}
																				</div>
																			)}

																		</FormGroup>
																	</Col>
																	<Col md="4">
																		<FormGroup>
																			<Label htmlFor="payPeriod">  Pay period</Label>
																			<Input
																				type="text"
																				id="payPeriod"
																				name="payPeriod"
																				value={props.values.payPeriod}
																				placeholder={strings.Enter + " Pay period"}
																				onChange={(value) => {
																					props.handleChange('payPeriod')(value);

																				}}
																				className={props.errors.payPeriod && props.touched.payPeriod ? "is-invalid" : ""}
																			/>
																			{props.errors.payPeriod && props.touched.payPeriod && (
																				<div className="invalid-feedback">
																					{props.errors.payPeriod}
																				</div>
																			)}

																		</FormGroup>
																	</Col>

																</Row>
																<Row>

																	<Col>
																		<FormGroup className="pull-right">
																			<Button type="button" color="primary" className="btn-square mr-3"
																				onClick={() =>
																					props.handleSubmit()
																				}>
																				<i className="fa fa-dot-circle-o"></i> Create
																			</Button>
																		</FormGroup>
																	</Col>

																</Row>

															</Form>
														)
														}
													</Formik>


												</div>

											</Col>
										</Row>
									)}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			
			</div>
		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(CreatePayroll)

