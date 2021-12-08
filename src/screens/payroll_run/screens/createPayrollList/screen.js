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

import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { AddEmployeesModal } from './sections';
import moment from 'moment';
import "react-dates/initialize";
import { DateRangePicker ,isInclusivelyBeforeDay} from 'react-dates';
import "react-dates/lib/css/_datepicker.css";

const mapStateToProps = (state) => {

	return ({
		currency_list: state.employee.currency_list,
		country_list: state.contact.country_list,
		state_list: state.contact.state_list,
		employees_for_dropdown: state.payrollRun.employees_for_dropdown,
		approver_dropdown_list: state.payrollRun.approver_dropdown_list,
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
class CreatePayrollList extends React.Component {

	constructor(props) {
		super(props)
		var date = new Date();
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			createMore: false,
			initValue: {},
			employeeListIds: [],
			openModal: false,
			selectedRows: [],
			selectedRows1: [],
			selectRowProp: {
				mode: 'checkbox',
				bgColor: 'rgba(0,0,0, 0.05)',
				clickToSelect: false,
				onSelect: this.onRowSelect,
				onSelectAll: this.onSelectAll,
			},
			payrollSubject:'',
			payrollApprover:'',
			payrollDate: new Date(),
			 startDate: moment(new Date(date.getFullYear(), date.getMonth(), 1)),
			 endDate:  moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
			// startDate: '',
			// endDate: '',
			 payPeriod : '',
			 apiSelector:'',
			 submitButton:true,
			paidDays:30,
			countForTableApiCall:0,
			focusedInput:null,
			currencyIsoCode:"AED"
		}

		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;

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

		// let search = window.location.search;
		// let params = new URLSearchParams(search);
		// let payroll_id = params.get('payroll_id');
		this.props.createPayrollActions.getEmployeesForDropdown();

		this.props.createPayrollActions.getApproversForDropdown();
		let payroll_id = this.props.location.state === undefined ? '' : this.props.location.state.id;

		this.tableApiCallsOnStatus();
     this.calculatePayperioad(this.state.startDate ,this.state.endDate);
	};
calculatePayperioad=(startDate,endDate)=>{
	// let diffDays=	Math.abs(parseInt((this.state.startDate - this.state.endDate) / (1000 * 60 * 60 * 24), 10))+1
    const diffTime = Math.abs(startDate-endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1; 
	
    this.setState({paidDays:diffDays});
	this.getAllPayrollEmployee()
	console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
	console.log(this.state.paidDays,"paid-Days",diffDays)
}

	tableApiCallsOnStatus = () => {

		this.getAllPayrollEmployee()

	}
	closeModal = (res) => {
		this.setState({ openModal: false });
	};
	initializeData = () => {

		this.props.createPayrollActions.getEmployeesForDropdown();
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

	};

	addEmployee = (data, resetForm) => {

		this.setState({ disabled: true });
		const { employeeIds } = data;


		let employeeList = [];
		Object.keys(employeeIds).forEach(key => {
			employeeList.push(employeeIds[key].value)
		});


		this.props.createPayrollActions
			.addMultipleEmployees(this.state.payroll_id, employeeList)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Employees added Successfully')
					this.tableApiCallsOnStatus()

				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
	}

	handleSubmit = (data, resetForm) => {
		
		this.setState({ disabled: true });
		const {
			payrollSubject,
			payrollDate,
			payrollApprover,
			startDate,
			endDate
		} = data;
		let employeeListIds=this.state.selectedRows ? this.state.selectedRows :'';
		
		let diff=	Math.abs(parseInt((startDate - endDate) / (1000 * 60 * 60 * 24), 10))+1	
		
		let string =moment(this.state.startDate).format('MM/DD/YYYY')+'-'+moment(this.state.endDate).format('MM/DD/YYYY')
		this.setState({payPeriod:string});
		const formData = new FormData();
		if(payrollSubject === undefined)
		{formData.append('payrollSubject', this.state.payrollSubject ? this.state.payrollSubject :null)}
		else 
		{formData.append('payrollSubject', payrollSubject)}

		formData.append('payPeriod', this.state.payPeriod)
		formData.append('employeeListIds', employeeListIds)
		
		if(payrollApprover === undefined)
		{formData.append('approverId', this.state.payrollApprover ?this.state.payrollApprover :null)}
		else if(payrollApprover!=="")
		{formData.append('approverId',  parseInt(payrollApprover) )}

		formData.append('generatePayrollString', JSON.stringify(this.state.selectedRows1));
		formData.append('salaryDate',payrollDate)
		//Payroll total  amount
		let totalAmountPayroll=0;
		this.state.selectedRows1.map((row)=>{totalAmountPayroll +=parseFloat(row.grossPay)})
		formData.append('totalAmountPayroll', totalAmountPayroll);

		if(this.state.apiSelector ==="createPayroll"){
		this.props.createPayrollActions
			 .createPayroll(formData)
						.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Payroll created Successfully')				
					this.tableApiCallsOnStatus()
					this.props.history.push(`/admin/payroll/payrollrun`);
			
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
	}else {
		if(this.state.apiSelector==="createAndSubmitPayroll"){

			this.props.createPayrollActions
			 .createAndSubmitPayroll(formData)
					.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Payroll created And Submitted Successfully')				
					this.tableApiCallsOnStatus()
					this.props.history.push(`/admin/payroll/payrollrun`);
				
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
		}
	}	
	}

	setDate = (props, value) => {
		const { term } = this.state;
		const val = term ? term.value.split('_') : '';
		const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1];
		const values = value
			? value
			: moment(props.values.payrollDate, 'DD/MM/YYYY').toDate();

	};

	getAllPayrollEmployee2 = () => {
		this.props.createPayrollActions.getAllPayrollEmployee2(this.state.payroll_id).then((res) => {

			if (res.status === 200) {
				this.setState({
					allPayrollEmployee: res.data
				})
			}
		})
	}


	getAllPayrollEmployee = () => {
		//maintaining new state
		this.props.createPayrollActions.getAllPayrollEmployee().then((res) => {
			if (res.status === 200) {

				this.setState({
					allPayrollEmployee: res.data
				})

				let newData = [...this.state.allPayrollEmployee]
				newData = newData.map((data) => {	
					let tmpPaidDay=this.state.paidDays > 30 ?30	:this.state.paidDays				
						data.noOfDays =tmpPaidDay
						data.originalNoOfDays =tmpPaidDay
						data.originalGrossPay=data.grossPay
						data.originalDeduction=data.deduction
						data.deduction=	((data.originalDeduction/30) * data.noOfDays).toFixed(2)
					    data.perDaySal=data.originalGrossPay / 30	

						data.lopDay = 30-tmpPaidDay;
						data.grossPay = Number((data.perDaySal * (data.noOfDays))).toFixed(2)
						data.netPay   = Number((data.perDaySal * (data.noOfDays))).toFixed(2) - (data.deduction || 0)
						
					return data
				})
				console.log(newData)

				this.setState({
					allPayrollEmployee: newData
				})
			}
		})
	}

	getPayrollEmployeeList = () => {


		const cols = [
			{
				label: 'Employee No',
				// dataSort: true,
				width: '',
				key: 'empCode'
			},
			{
				label: 'Employee Name',
				// dataSort: true,
				width: '',
				key: 'empName'

			},
			{
				label: 'LOP',
				// dataSort: true,
				width: '8%',
				key: 'lopDay'
			},
			{
				label: 'Paid Days',
				// dataSort: true,
				width: '12%',
				key: 'noOfDays'
			},
			{
				label: 'Gross Pay',
				// dataSort: true,
				width: '',
				key: 'grossPay'
			},

			{
				label: 'Deductions',
				// dataSort: true,
				width: '',
				key: 'deduction'
			},
			{
				label: 'Net Pay',
				// dataSort: true,
				width: '12%',
				key: 'netPay'

			}
		]





		return (
			<React.Fragment>
				<Row>


				</Row>
				<div >
					<BootstrapTable
						selectRow={this.state.selectRowProp}
						search={false}
						options={this.options}
						data={this.state.allPayrollEmployee || []}
						version="4"
						hover
						keyField="id"
						remote
						trClassName="cursor-pointer"
						csvFileName="payroll_employee_list.csv"
						ref={(node) => this.table = node}
					>
						{
							cols.map((col, index) => {

								const format = (cell, row) => {

									if (col.key === 'lopDay') {
										return (
											
											<Input
												className="spinboxDisable"
												type="number"
												min={0}
												max={this.state.paidDays}
												id="lopDay"
												name="lopDay"
												value={cell || 0}
												
												onChange={(evt) => {
													
													let value = parseInt(evt.target.value ==="" ? "0":evt.target.value) ;

													if (value > 30 || value < 0) {
														return;
													}
														this.updateAmounts(row,value);
													}}
											/>

										);

									}else if(col.key === 'grossPay'){
										let grossPay=parseFloat(cell)
										return  (<div>{this.state.currencyIsoCode ? this.state.currencyIsoCode : "AED"}{" "+grossPay.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>)
									}
									 else
									 if(col.key === 'netPay'){
										return	(<div>{this.state.currencyIsoCode ? this.state.currencyIsoCode : "AED"}{" "+cell.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>);
								 }
								 
								  else if(col.key === 'deduction'){
									return (<div>{this.state.currencyIsoCode ? this.state.currencyIsoCode : "AED"}{" "+cell.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>);
							 }
							  else {
										return (
											<div>{cell}</div>
										)
									}


								}




if(col.key === 'netPay' || col.key === 'deduction' || col.key === 'grossPay'){
	return (
	<TableHeaderColumn
		key={index}
		dataFormat={format}
		dataField={col.key}
		dataAlign="right"
		className="table-header-bg"
		dataSort={col.dataSort}
		width={col.width}>
		{col.label}
	</TableHeaderColumn>

)}
else
								{return (
									<TableHeaderColumn
										key={index}
										dataFormat={format}
										dataField={col.key}
										dataAlign="center"
										className="table-header-bg"
										dataSort={col.dataSort}
										width={col.width}>
										{col.label}
									</TableHeaderColumn>

								)}
							})
						}


					</BootstrapTable>
				</div>
			</React.Fragment>

		)
	}
	updateAmounts=(row,value)=>{
		let newData = [...this.state.allPayrollEmployee]
			newData = newData.map((data) => {
											if (row.id === data.id) {
												data.lopDay = value;
												data.noOfDays = 30 - value
												data.deduction=	((data.originalDeduction/30) * data.noOfDays).toFixed(2)
												let deduction=data.noOfDays==0 ? 0:data.deduction;

												data.grossPay = Number((data.perDaySal * (data.noOfDays))).toFixed(2)
												data.netPay   = Number((data.perDaySal * (data.noOfDays))).toFixed(2) - (deduction || 0)
											}
											data.payrollId = this.state.payroll_id
											data.salaryDate = this.state.payrollDate
								    return  data

									})
								this.setState({	allPayrollEmployee: newData})
	}
	generate = () => {
		const formData = new FormData();
		formData.append('payrollId', this.state.payroll_id)
		formData.append('salaryDate', this.state.payrollDate)
		formData.append('generatePayrollString', JSON.stringify(this.state.allPayrollEmployee));

		this.props.createPayrollActions
			.generatePayroll(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'genrated payroll Successfully')
					this.proceed1()
					this.tableApiCallsOnStatus()
					// resetForm(this.state.initValue)
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})

	}
	


	submitPayroll = (data) => {

		const { userId } = data;
		this.props.createPayrollActions
			.submitPayroll(this.state.payroll_id, this.state.userId)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Payroll Submitted Successfully')
					this.proceed()
					this.tableApiCallsOnStatus()
					// resetForm(this.state.initValue)
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})

	}
	removeEmployee = () => {
		let ids = this.state.selectedRows;
		if (ids && ids.length) {

			let employeeList = [];
			Object.keys(this.state.selectedRows).forEach(key => {
				employeeList.push(this.state.selectedRows[key])
			});

			this.props.createPayrollActions.removeEmployee(employeeList).then((res) => {


				let newselectRowProp = { ...this.state.selectedRowprop }
				newselectRowProp.selected = []

				this.setState({
					selectRow: [],
					selectedRowprop: newselectRowProp
				});

				if (res.status == 200) {

					this.props.commonActions.tostifyAlert('success', 'Employee(s) deleted Successfully')
					this.tableApiCallsOnStatus()
				}

				if (res.status == 204) {

					this.props.commonActions.tostifyAlert('success', 'Employee(s) deleted Successfully')
					this.tableApiCallsOnStatus()
				}
			}).catch((err) => {

				this.props.commonActions.tostifyAlert('error', 'Error...')

			})

		}
		this.tableApiCallsOnStatus()
	}

	onSubmiitedStatus = () => {
		if (this.state.status === "Submmited") {
			return true;
		}
		else {
			return false;
		}
	}

	onRowSelect = (row, isSelected, e) => {

		let tempList = [];
		let tempList1 = [];
		if (isSelected) {
			tempList = Object.assign([], this.state.selectedRows);
			tempList1 = Object.assign([], this.state.selectedRows1);
			tempList.push(row.empId);
			tempList1.push(row);
		} else {
			this.state.selectedRows1.map((item) => {
				if (item.empId !== row.empId) {
					tempList.push(item.empId);
					tempList1.push(item);
				}
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
			selectedRows1: tempList1,
		});
	};
	onSelectAll = (isSelected, rows) => {

		let tempList = [];
		let tempList1 = [];
		if (isSelected) {
			rows.map((item) => {
				tempList.push(item.empId);
				tempList1.push(item);
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
			selectedRows1: tempList1,
		});
	};

	 handleDatesChange = ({ startDate, endDate }) => {
	this.setState({startDate:startDate,endDate:endDate})
	
	  };
 handleDateChange = ({ startDate, endDate }) =>   { this.setState({ startDate, endDate })
 this.calculatePayperioad(startDate, endDate)};
handleFocusChange = focusedInput => this.setState({ focusedInput });
showTotal=()=>{
	let totalAmountPayroll=0;
	this.state.selectedRows1.map((row)=>{totalAmountPayroll +=parseFloat(row.grossPay)})
	return(
		<div className="p-2" style={{    borderBottom: "1px solid #c8ced3", width: "25%"}}>
								<Row>
								<Col >
									<h5 className="mb-0">
										{strings.Total+" "+strings.Amount}
									</h5>
								</Col>
								<Col  className="text-right">
									<label className="mb-0">
									AED &nbsp;
									{totalAmountPayroll.toLocaleString(navigator.language,{ minimumFractionDigits: 2 })}				
									</label>
								</Col>
								</Row>
								</div>
	)
}	
	render() {
		strings.setLanguage(this.state.language);

		const { employee_list, approver_dropdown_list } = this.props
		const { loading, initValue } = this.state
		console.log(employee_list.data, "employee_list.data")
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

														initialValues={this.state}
														onSubmit={(values, { resetForm }) => {
															
															if(this.state.selectedRows){
																this.handleSubmit(values)
															}
														

														}}
												validationSchema={Yup.object().shape({
												  payrollSubject: Yup.string()
												    .required("Payroll Subject is Required"),
												  payrollDate: Yup.string()
												    .required("Payroll Date is Required"),
												// selectedRows: Yup.string()
												//     .required("At least selection of one employee  is Required for create payroll"),
												})}
												validate={(values) => {
													// let status = false
													let errors = {};
													
													if (!values.payrollSubject) {
														errors.payrollSubject = 'Payroll Subject is  required';
													}
													if (!values.payrollDate) {
														errors.payrollDate = 'Payroll date is  required';
													}
													// if(this.state.selectedRows && this.state.selectedRows.length===0)
													// {
													// 	errors.selectedRows = 'At least selection of one employee  is Required for create payroll';
													// }
													if (this.state.startDate==='' && this.state.endDate==='') {
														errors.startDate = 'Start and End Date is  required';
													}else
													if (this.state.startDate==='') {
														errors.startDate = 'Start Date is  required';
													}else
													if (this.state.endDate==='') {
														errors.startDate = 'End Date is  required';
													}
												
													return errors;
												}}
													>
														{(props) => (


															<Form onSubmit={props.handleSubmit}>
																<Row>
																	<Col >
																		<FormGroup>
																			<Label htmlFor="payrollSubject">	<span className="text-danger">*</span> Payroll Subject</Label>
																			<Input
																				type="text"
																				id="payrollSubject"
																				name="payrollSubject"
																				value={props.values.payrollSubject}
																			    maxLength="100"
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
																	<Col >
																		<FormGroup>
																			<Label htmlFor="date">
																				<span className="text-danger">*</span>
																				Payroll Date
																			</Label>
																			<DatePicker
																				id="payrollDate"
																				name="payrollDate"
																				placeholderText={strings.payrollDate}
																				showMonthDropdown
																				showYearDropdown
																				dateFormat="dd/MM/yyyy"
																				dropdownMode="select"
																				selected={props.values.payrollDate}
																			
																				onChange={(value) => {
																					props.handleChange('payrollDate')(value);

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
																	</Col>
																

																	<Col  >
																	<Label htmlFor="date">
																				<span className="text-danger">*</span>
																				Pay-period (Start date - End Date)
																			</Label>

																			<FormGroup >
																			<DateRangePicker
																			displayFormat="DD/MM/YYYY"
																				endDate={this.state.endDate}
																				endDateId="endDate"
																				focusedInput={this.state.focusedInput}
																				isOutsideRange={() => null}
																				onDatesChange={this.handleDateChange}
																				onFocusChange={this.handleFocusChange}
																				startDate={this.state.startDate}
																				startDateId="startDate"
																				/>																			
																			{props.errors.startDate &&
																				props.touched.startDate && (
																					<div className="text-danger">
																						{props.errors.startDate}
																					</div>
																				)}
																		</FormGroup>
																
																	</Col>

																	
																	
																	
																	<Col >	<Label htmlFor="due_date">
																				{/* <span className="text-danger">*</span> */}
																				Payroll Approver
																			</Label>
																		<FormGroup>
																			
																			<Select
																			
																				styles={customStyles}
																				id="userId"
																				name="userId"
																				placeholder={"Select Approver"}
																				options={
																					approver_dropdown_list.data
																						? selectOptionsFactory.renderOptions(
																							'name',
																							'userId',
																							approver_dropdown_list.data,
																							'User',
																						)
																						: []
																				}

																				onChange={(option) => {
																					if (option && option.value) {
																						props.handleChange('payrollApprover')(option.value);
																						this.setState({
																							 userId: option.value ,
																							 submitButton:false
																						})
																						
																					}
																				}}
																			/>

																		</FormGroup>
																	</Col>
																	
																</Row>
																<hr/>
																<Row>
													
																</Row>
																<Row>

																	<FormGroup className="pull-left mt-3">
																		 {/* add and remove */}

																		{/* <Button type="button" color="primary" className="btn-square ml-3 mr-1 "
																			
																			onClick={() => {
																				// this.setState(() => {
																				// 	props.handleSubmit()
																				// })
																				this.setState({
																					openModal: true
																				})
																			}}>
																			<i className="fa fa-dot-circle-o"></i> Add Employees
																		</Button>
																		<Button
																			color="primary"
																			className="btn-square ml-3 "
																			onClick={() => {
																				this.removeEmployee()
																			}}

																			
																		>
																			<i class="far fa-trash-alt mr-1"></i>
																			Remove Employees
																		</Button> */}
																	</FormGroup>

																	<Col></Col>
																	<Col></Col>
																	<Col lg={3} className="pull-right mt-3">
																	
																	</Col>
																</Row>

													
												{this.getPayrollEmployeeList()}
												<Row><Col>
														{this.state.selectedRows && (
																					<div className="text-danger">
																						{props.errors.selectedRows}
																					</div>
																				)}
												</Col></Row>

												
																			<Row>
																			<Col ></Col>
																			<Col ></Col>
												{
												// this.showTotal()
												}
																				
																			</Row>
																		
															<Row className="mt-4 ">


																<Col>
																	<Button
																		color="secondary"
																		className="btn-square pull-right"
																		onClick={() => {
																			this.props.history.push('/admin/payroll/payrollrun')
																		}}
																	>
																		<i className="fa fa-ban"></i> {strings.Cancel}
																	</Button>
																	<Button
																		color="primary"
																		className="btn-square pull-right"
																		// onClick={}
																		onClick={() => {
																			this.setState({apiSelector:"createAndSubmitPayroll"})
																				props.handleSubmit()
																								}}																		
																	        disabled={!this.state.submitButton && this.state.selectedRows && this.state.selectedRows.length !=0 ? false :true}
																			title={
																			this.state.submitButton
																				? `Please Select Approver Before Submitting  Payroll !`
																				: ''
																		}
																						

																	// 	title={
																	// 		this.state.selectedRows && this.state.selectedRows.length !=0
																	// 		? ''
																	// 		: `Please Select Employees Before creating  Payroll !`
																	// }
																			>

																		<i class="fas fa-check-double  mr-1"></i> Create and Submit
																	</Button>
																	<Button type="button" color="primary" className="btn-square pull-right "														
																    	onClick={() => {
																		this.setState({apiSelector:"createPayroll"})
																			props.handleSubmit()
																							}}
																							
																							disabled={this.state.selectedRows && this.state.selectedRows.length !=0 ? false :true}
																							title={
																								this.state.selectedRows && this.state.selectedRows.length !=0
																								? ''
																								: `Please Select Employees Before creating  Payroll !`
																						}
																	>
																		<i className="fa fa-dot-circle-o  mr-1"></i> Create
																	</Button>

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
				{/* <AddEmployeesModal
					openModal={this.state.openModal}
					closeModal={(e) => {
						this.closeModal(e);
					}}

				// employee_list={employee_list.data}				
				/> */}
			</div>
		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(CreatePayrollList)

