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
import { ConfirmDeleteModal, ImageUploader, Loader } from 'components';
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
import { DateRangePicker } from 'react-dates';


const mapStateToProps = (state) => {

	return ({
		// currency_list: state.employee.currency_list,
		// country_list: state.contact.country_list,
		// state_list: state.contact.state_list,
		employees_for_dropdown: state.payrollRun.employees_for_dropdown,
		approver_dropdown_list: state.payrollRun.approver_dropdown_list,
		// employee_list:state.payrollEmployee.payroll_employee_list,
		// employee_list: state.payrollEmployee.employee_list_dropdown,

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
class UpdatePayroll extends React.Component {

	constructor(props) {
		super(props)
		var date = new Date();
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			createMore: false,
			loading: false,
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
			 payrollDate: new Date(),
			payrollSubject:undefined,
			//  startDate: new Date(date.getFullYear(), date.getMonth(), 1),
			//  endDate:  new Date(date.getFullYear(), date.getMonth() + 1, 0),
			startDate: '',
			endDate: '',
			 payPeriod : '',
			 apiSelector:'',
			 focusedInput:null,
			 submitButton:true,
			 payrollApprover:'',
			 dialog: null,
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
			onSortChange: this.sortColumn,
			
		}

	}

	componentDidMount = () => {

		// let search = window.location.search;
		// let params = new URLSearchParams(search);
		// let payroll_id = params.get('payroll_id');
		// this.props.createPayrollActions.getEmployeesForDropdown();
		// this.props.createPayrollEmployeeActions.getEmployeesForDropdown();
		this.props.createPayrollActions.getApproversForDropdown();
		let payroll_id = this.props.location.state === undefined ? '' : this.props.location.state.id;
		if (payroll_id) {
			this.setState({
				payroll_id: payroll_id
			})
			this.proceed(payroll_id);
		}
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
	proceed = (payroll_id) => {
		
		this.props.createPayrollActions.getPayrollById(payroll_id).then((res) => {
			if (res.status === 200) {
				//	 
				
				this.setState({
					loading: false,
					
					payrollId: res.data.id ? res.data.id : '',
					approvedBy: res.data.approvedBy ? res.data.approvedBy : '',
					comment: res.data.comment ? res.data.comment : '',
					deleteFlag: res.data.deleteFlag ? res.data.deleteFlag : '',
					employeeCount: res.data.employeeCount ? res.data.employeeCount : '',
					generatedBy: res.data.generatedBy ? res.data.generatedBy : '',

					isActive: res.data.isActive ? res.data.isActive : '',
					payPeriod: res.data.payPeriod ? res.data.payPeriod : '',
					payrollApprover: res.data.payrollApprover ? res.data.payrollApprover : '',
					submitButton: res.data.payrollApprover ===null ? true : false,
					payrollDate: res.data.payrollDate
						? moment(res.data.payrollDate).format('DD/MM/YYYY')
						: '',
					payrollSubject: res.data.payrollSubject ? res.data.payrollSubject : '',
					runDate: res.data.runDate ? res.data.runDate : '',
					status: res.data.status ? res.data.status : '',
					currencyIsoCode:res.data.currencyIsoCode ? res.data.currencyIsoCode : 'AED',
					

				}
				)
				this.initializeData();
				this.tableApiCallsOnStatus();
				let payPeriodString=this.state.payPeriod;
				let dateArray=payPeriodString.split('-')
				this.setState({
					startDate: moment(dateArray[0]),
					endDate:moment(dateArray[1])
				})
				
				this.calculatePayperioad(this.state.startDate ,this.state.endDate);
			}
		}).catch((err) => {
			this.setState({ loading: false })

		})
	}



	tableApiCallsOnStatus = () => {
		// this.proceed(this.state.payroll_id);
		// if(this.state.status==="Draft"){
		// 	this.getAllPayrollEmployee2()
		// }else{
		this.getAllPayrollEmployee()

	}
	closeModal = (res) => {
		this.setState({ openModal: false });
	};
	initializeData = () => {

		// this.props.createPayrollActions.getEmployeesForDropdown();
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
		// this.props.payrollEmployeeActions.getPayrollEmployeeList(postData).then((res) => {
		// 	if (res.status === 200) {

		// 		this.setState({ loading: false })
		// 	}
		// }).catch((err) => {
		// 	this.setState({ loading: false })
		// 	this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
		// })
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

	disable = () => {

		if (this.state.status === '') {
			return true;
		}
		else
			if (this.state.status === "Submitted") {
				return true;
			} else {
				return false;
			}
	};
	disableForGenerateButtun = () => {

		if (this.state.allPayrollEmployee && this.state.allPayrollEmployee.length === 0) {
			return true;
		}
		else
			if (this.state.status === "Submitted") {
				return true;
			} else {
				return false;
			}
	};
	disableForAddButton = () => {
		if (this.state.status === "Submitted") {
			return true;
		} else {
			return false;
		}
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
					// resetForm(this.state.initValue)
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
		// this.setState({payPeriod:diff});
		this.setState({payPeriod:string});
		const formData = new FormData();
		
		formData.append('payrollId',this.state.payrollId ? this.state.payrollId :'')

		formData.append('payPeriod', this.state.payPeriod)
		formData.append('employeeListIds', employeeListIds)
		if(payrollSubject === undefined)
		{formData.append('payrollSubject', this.state.payrollSubject ? this.state.payrollSubject :null)}
		else 
		{formData.append('payrollSubject', payrollSubject)}

		if(this.state.payrollApprover !=="")
		{
			formData.append('approverId', this.state.payrollApprover ?this.state.payrollApprover :null)}
		else if(payrollApprover!=="")
		{formData.append('approverId',  parseInt(payrollApprover) )}
		
		formData.append('generatePayrollString', JSON.stringify(this.state.selectedRows1));
		 formData.append('salaryDate',payrollDate)

		console.log(this.state.payPeriod,"JSON.stringify(this.state.allPayrollEmployee)",JSON.stringify(this.state.allPayrollEmployee))
		
		if(this.state.apiSelector ==="createPayroll"){
		this.props.createPayrollActions
			 .updatePayroll(formData)
			// .createPayroll(JSON.stringify(employeeListIds),payrollSubject,this.state.payPeriod,JSON.stringify(this.state.allPayrollEmployee),payrollDate)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Payroll updated Successfully')				
					this.tableApiCallsOnStatus()
					this.props.history.push(`/admin/payroll/payrollrun`);
					// resetForm(this.state.initValue)
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
	}else {
		if(this.state.apiSelector==="createAndSubmitPayroll"){

			this.props.createPayrollActions
			 .updateAndSubmitPayroll(formData)
			// .createPayroll(JSON.stringify(employeeListIds),payrollSubject,this.state.payPeriod,JSON.stringify(this.state.allPayrollEmployee),payrollDate)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success', 'Payroll updated And Submitted Successfully')				
					this.tableApiCallsOnStatus()
					this.props.history.push(`/admin/payroll/payrollrun`);
					// resetForm(this.state.initValue)
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
		}
	}	
	}
	handleDatesChange = ({ startDate, endDate }) => {
		this.setState({startDate:startDate,endDate:endDate})
		this.calculatePayperioad(startDate, endDate)
		  };
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
	updateAmounts=(row,value)=>{
		let newData = [...this.state.allPayrollEmployee]
			newData = newData.map((data) => {
											if (row.id === data.id) {
															debugger
														if(data.lopDay<value)
														{		
																													
															data.lopDay = value;
															data.noOfDays = data.noOfDays - 1
															data.grossPay = Number(((data.grossPay / 30) * (data.noOfDays))).toFixed(2)
															data.netPay =   Number(((data.grossPay / 30) * (data.noOfDays))).toFixed(2) - (data.deduction || 0)
														
															data.payrollId = this.state.payroll_id
															data.salaryDate = this.state.payrollDate
														}
														else if(data.lopDay>value)
															{	
																data.lopDay = value;
																data.noOfDays = data.noOfDays + 1
																data.grossPay = Number(((data.grossPay / 30) * (data.noOfDays))).toFixed(2)
																data.netPay   = Number(((data.grossPay / 30) * (data.noOfDays))).toFixed(2) - (data.deduction || 0)
															
																data.payrollId = this.state.payroll_id
																data.salaryDate = this.state.payrollDate}
														}
														return data

													})
													console.log(newData)

													this.setState({
														allPayrollEmployee: newData

													})
	}

	getAllPayrollEmployee = () => {
		if(this.state.payrollId){
		this.props.createPayrollActions.getAllPayrollEmployee2(this.state.payrollId).then((res) => {
			if (res.status === 200) {

				if(res.data.length===0){
					this.props.createPayrollActions.getAllPayrollEmployee(this.state.payrollId).then((res) => {
						if (res.status === 200) {
							
								this.setState({
									allPayrollEmployee: res.data
								})
							
						}
					})	
					}else{
						this.setState({
							allPayrollEmployee: res.data
						})
					}
					let newData = [...this.state.allPayrollEmployee]
					newData = newData.map((data) => {					
							data.noOfDays =this.state.paidDays					
						return data
					})
					console.log(newData)
	
					this.setState({
						allPayrollEmployee: newData
					})
			}
		})
	}
	}

	getPayrollEmployeeList = () => {
		const cols = [
			{
				label: 'Employee No',
				dataSort: true,
				width: '',
				key: 'empCode'
			},
			{
				label: 'Employee Name',
				dataSort: true,
				width: '',
				key: 'empName'

			},
			{
				label: 'LOP',
				dataSort: true,
				width: '8%',
				key: 'lopDay'
			},
			{
				label: 'Paid Days',
				dataSort: true,
				width: '12%',
				key: 'noOfDays'
			},
			{
				label: 'Gross Pay',
				dataSort: true,
				width: '',
				key: 'grossPay'
			},

			{
				label: 'Deductions',
				dataSort: true,
				width: '',
				key: 'deduction'
			},
			{
				label: 'Net Pay',
				dataSort: true,
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
												type="number"
												min="0"
												max={30}
												id="lopDay"
												name="lopDay"
												value={cell || 0}
												disabled={this.disableForAddButton() ? true : false}
												onChange={(evt) => {

													let value = evt.target.value;

													if (value > 30 || value < 0) {
														return;
													}

													this.updateAmounts(row,value)
												
												}}
											/>

										);

									}else if(col.key === 'grossPay'){
										
										return  (<div>{this.state.currencyIsoCode ? this.state.currencyIsoCode : "AED"}{" "+cell.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>)
									}
									 else
									 if(col.key === 'netPay'){
										return	(<div>{this.state.currencyIsoCode ? this.state.currencyIsoCode : "AED"}{" "+cell.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>);
								 }
								 
								  else if(col.key === 'deduction'){
									return (<div>{this.state.currencyIsoCode ? this.state.currencyIsoCode : "AED"}{" "+cell.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>);
							 } else {
										return (
											<div>{cell}</div>
										)
									}


								}

								return (
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

								)
							})
						}


					</BootstrapTable>
				</div>
			</React.Fragment>
		)
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
			this.state.selectedRows.map((item) => {
				if (item !== row.empId) {
					tempList.push(item);
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

	deletePayroll = () => {
		const message1 = (
			<text>
				<b>Delete Payroll?</b>
			</text>
		);
		const message =
			'This Payroll will be deleted permanently and cannot be recovered. ';
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={this.removePayroll}
					cancelHandler={this.removeDialog}
					message={message}
					message1={message1}
				/>
			),
		});
	};

	removePayroll = () => {
		this.setState({ disabled1: true });
		const { current_user_id } = this.state;
		this.props.createPayrollActions
			.deletePayroll(this.state.payrollId ? this.state.payrollId :0)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Payroll Deleted Successfully',
					);
					this.props.history.push(`/admin/payroll/payrollrun`);
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	removeDialog = () => {
		this.setState({
			dialog: null,
		});
	};

	render() {
		strings.setLanguage(this.state.language);

		const { employee_list, approver_dropdown_list } = this.props
		const { loading, initValue,	dialog } = this.state
		
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
												<span className="ml-2">Update Payroll</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
								{dialog}
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
															// payrollSubject: Yup.string()
															//   .required("Payroll Subject is Required"),
															payrollDate: Yup.string()
															  .required("Payroll Date is Required"),
														  // selectedRows: Yup.string()
														  //     .required("At least selection of one employee  is Required for create payroll"),
														  })}
														  validate={(values) => {
															 
															  let errors = {};
															  
															  if (!this.state.payrollSubject) {
																  errors.payrollSubject = 'Payroll Subject is  required';
															  }
															  if (!values.payrollDate) {
																  errors.payrollDate = 'Payroll date is  required';
															  }
															  if(this.state.selectedRows && this.state.selectedRows.length===0)
															  {
																  errors.selectedRows = 'At least selection of one employee  is Required for create payroll';
															  }
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
																				value={this.state.payrollSubject}
																				disabled={this.disableForAddButton() ? true : false}
																				placeholder={strings.Enter + " Payroll Subject"}
																				onChange={(value) => {
																					props.handleChange('payrollSubject')(value);
																					this.setState({payrollSubject:value.target.value})
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
																	<div style={{display: "flex"}}>
																	{/* <FormGroup className="mt-2"><i class="far fa-calendar-alt mt-1"></i>&nbsp;</FormGroup> */}
																	<FormGroup >
																				<DateRangePicker
																				startDate={this.state.startDate}
																				startDateId="tata-start-date"
																				endDate={this.state.endDate}
																				endDateId="tata-end-date"
																				onDatesChange={this.handleDatesChange}
																				focusedInput={this.state.focusedInput}
																				onFocusChange={(option)=>{this.setState({focusedInput:option})}}
																				/>																							
																	
																			{props.errors.startDate &&
																				props.touched.startDate && (
																					<div className="text-danger">
																						{props.errors.startDate}
																					</div>
																				)}
																		</FormGroup>

																	</div>
																		
																	</Col>

																	
																	<Col >	<Label htmlFor="due_date">
																				{/* <span className="text-danger">*</span> */}
																				Payroll Approver
																			</Label>
																		<FormGroup>
																			
																			<Select
																				isDisabled={this.disable() ? true : false}
																				styles={customStyles}
																				id="userId"
																				name="userId"
																				value={
																					approver_dropdown_list.data &&
																					selectOptionsFactory
																						.renderOptions(
																							'name',
																							'userId',
																							approver_dropdown_list.data,
																							'User',
																						)
																						.find(
																							(option) =>
																								option.value ===
																								this.state.payrollApprover,
																						)
																				}
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
																						this.setState({ userId: option.value,payrollApprover:option.value ,	submitButton:false})
																						
																					}
																				}}
																			/>

																		</FormGroup>
																	</Col>
																</Row>
																<Row>
								
																</Row>
																<hr/>
																<Row>

																	<FormGroup className="pull-left mt-3">
																		 {/* add and remove */}
																		{/* <Button type="button" color="primary" className="btn-square ml-3 mr-1 "
																			// disabled={this.disableForAddButton() ? true : false}
																			onClick={() => {
																				// this.setState(() => {
																				// 	props.handleSubmit()
																				// })
																				// this.setState({
																				// 	openModal: true
																				// })
																				this.props.createPayrollActions.getAllPayrollEmployee(this.state.payrollId).then((res) => {
																					if (res.status === 200) {
																						
																							this.setState({
																								allPayrollEmployee: res.data
																							})
																						
																					}
																				})	
																			}}>
																			<i className="fa fa-dot-circle-o"></i> Add All Employees
																		</Button> */}
																		{/* <Button
																			color="primary"
																			className="btn-square ml-3 "
																			onClick={() => {
																				this.removeEmployee()
																			}}

																			disabled={this.state.selectedRows.length === 0}
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
															<Row className="mt-4 ">


																<Col>
																
																		<Button
																			type="button"
																			color="danger"
																			className="btn-square"
																				disabled1={this.state.disabled1}
																			onClick={this.deletePayroll}
																		>
																			<i className="fa fa-trash"></i> {this.state.disabled1
																			? 'Deleting...'
																			: strings.Delete }
																		</Button>
																	
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
																								disabled={this.state.submitButton}
																		// disabled={this.state.allPayrollEmployee && this.state.allPayrollEmployee.length === 0 ?true :false}
																		title={
																			this.state.submitButton
																				? `Please Select Approver Before Submitting  Payroll !`
																				: ''
																		}
														
																	>

																		<i class="fas fa-check-double  mr-1"></i>Update and Submit
																	

																	</Button>
																	<Button type="button" color="primary" className="btn-square pull-right "
																
																	onClick={() => {
																		this.setState({apiSelector:"createPayroll"})
																			props.handleSubmit()
																							}}
																	>
																		<i className="fa fa-dot-circle-o  mr-1"></i> Update
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePayroll)

