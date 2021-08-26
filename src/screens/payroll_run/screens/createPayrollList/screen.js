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


const mapStateToProps = (state) => {

	return ({
		currency_list: state.employee.currency_list,
		country_list: state.contact.country_list,
		state_list: state.contact.state_list,
		employees_for_dropdown: state.payrollRun.employees_for_dropdown,
		approver_dropdown_list:state.payrollRun.approver_dropdown_list,
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
class CreatePayrollList extends React.Component {
	
	constructor(props) {
		super(props)		
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			createMore: false,
			loading: false,
			initValue: {},
			employeeListIds: [],
			openModal:false,
			selectedRows:[],	
			selectedRows1:[],
			selectRowProp : {
				mode: 'checkbox',
				bgColor: 'rgba(0,0,0, 0.05)',
				clickToSelect: false,
				onSelect: this.onRowSelect,
				onSelectAll: this.onSelectAll,
			}	                                          
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
		
		this.props.createPayrollActions.getApproversForDropdown();
		let payroll_id =this.props.location.state.id;
		if(payroll_id) {
			this.setState({
				payroll_id:payroll_id
			})
			this.proceed(payroll_id);
		}

        
	};

	proceed = (payroll_id) => {
		this.props.createPayrollActions.getPayrollById(payroll_id).then((res) => {
			if (res.status === 200) {
			//	debugger
				this.setState({
					    loading: false,
						id: res.data.id ? res.data.id : '',
						approvedBy: res.data.approvedBy ? res.data.approvedBy : '',
						comment: res.data.comment ? res.data.comment : '',
						deleteFlag: res.data.deleteFlag ? res.data.deleteFlag : '',
						employeeCount: res.data.employeeCount ? res.data.employeeCount : '',
						generatedBy: res.data.generatedBy ? res.data.generatedBy : '',
						
						isActive: res.data.isActive ? res.data.isActive : '',
						payPeriod: res.data.payPeriod ? res.data.payPeriod : '',
						payrollApprover:res.data.payrollApprover ? res.data.payrollApprover : '',
						payrollDate: res.data.payrollDate
																	? moment(res.data.payrollDate).format('DD/MM/YYYY')
																	: '',
						payrollSubject: res.data.payrollSubject ? res.data.payrollSubject : '',
						runDate: res.data.runDate ? res.data.runDate : '',
						status: res.data.status ? res.data.status : '',

				}
				)
				this.initializeData();
				this.tableApiCallsOnStatus();
				

			}
		}).catch((err) => {
			this.setState({ loading: false })
		  
		})
	}



tableApiCallsOnStatus=()=>{
	// this.proceed(this.state.payroll_id);
	if(this.state.status==="Draft"){
		this.getAllPayrollEmployee2()
	}else{
	this.getAllPayrollEmployee()
	}
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
		// this.formRef.current.setFieldValue('employeeListIds', option, true);
	};

	disable = () => {
		
		if (this.state.status === '') {
				return true;
		} else {
			return false;
		}
	};
	addEmployee = (data,resetForm) => {
		 
		this.setState({ disabled: true });
		const { employeeIds } = data;
	

		let employeeList =[];
		Object.keys(employeeIds).forEach(key => {
		 employeeList.push(employeeIds[key].value) 
		});
	

		this.props.createPayrollActions
			.addMultipleEmployees( this.state.payroll_id,employeeList)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert('success','Employees added Successfully')
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
			type,
			name
		} = data;


		const formData = new FormData();
		formData.append(
			'type',
			type != null ? type : '',
		)
		formData.append(
			'name',
			name != null ? name : '',
		)
		this.props.salaryStructureCreateActions
			.createSalaryStructure(formData)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'New Salary Structure Created Successfully')
					if (this.state.createMore) {
						this.setState({
							createMore: false
						})
						// resetForm(this.state.initValue)
					} else {
						this.props.history.push('/admin/payroll/config', { tabNo: '2' })
					}
				}
			}).catch((err) => {
				this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
			})
	}
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

	getAllPayrollEmployee2  = () => {
		this.props.createPayrollActions.getAllPayrollEmployee2(this.state.payroll_id).then((res)=>{

			if(res.status === 200) {
				this.setState({
					allPayrollEmployee:res.data
				})		  
			}
		})
	}


	getAllPayrollEmployee  = () => {
		this.props.createPayrollActions.getAllPayrollEmployee(this.state.payroll_id).then((res)=>{

			if(res.status === 200) {
				// uncomment this this is real data
				this.setState({
					allPayrollEmployee:res.data
				})

				//fake data remove it
				
				// let fakeData  = []

				// for(let i=0;i<10;i++) {
				// 	fakeData.push(
				// 		{
				// 			id:i,
				// 			empNo: 1,
				// 			name: 'data',
				// 			lop_days: null,
				// 			payble_days:30,
				// 			package:30000,
				// 			deductions:0,
				// 			net_pay:30000,
				// 			status:'ACTIVE'
							
				// 			}
				// 	)
				// }
				// this.setState({
				// 	allPayrollEmployee:fakeData
				// })
			  
			}
		})
	}

	getPayrollEmployeeList = () => {

		// const cols = [
		// 	{
		// 		label:'Employee No',
		// 		dataSort:true,
		// 		width:'',
		// 		key:'empNo'
		// 	},
		// 	{
		// 		label:'Employee Name',
		// 		dataSort:true,
		// 		width:'',
		// 		key:'name'

		// 	},
		// 	{
		// 		label:'LOP',
		// 		dataSort:true,
		// 		width:'8%',
		// 		key:'lop_days'
		// 	},
		// 	{
		// 		label:'Paid Days',
		// 		dataSort:true,
		// 		width:'12%',
		// 		key:'payble_days'
		// 	},
		// 	{
		// 		label:'Gross Pay',
		// 		dataSort:true,
		// 		width:'',
		// 		key:'package'
		// 	},
			
		// 	{
		// 		label:'Deductions',
		// 		dataSort:true,
		// 		width:'',
		// 		key:'deductions'
		// 	},
		// 	{
		// 		label:'Net Pay',
		// 		dataSort:true,
		// 		width:'12%',
		// 		key:'net_pay'

		// 	}
			
	// ]

	const cols = [
		{
			label:'Employee No',
			dataSort:true,
			width:'',
			key:'empCode'
		},
		{
			label:'Employee Name',
			dataSort:true,
			width:'',
			key:'empName'

		},
		{
			label:'LOP',
			dataSort:true,
			width:'8%',
			key:'lopDay'
		},
		{
			label:'Paid Days',
			dataSort:true,
			width:'12%',
			key:'noOfDays'
		},
		{
			label:'Gross Pay',
			dataSort:true,
			width:'',
			key:'grossPay'
		},
		
		{
			label:'Deductions',
			dataSort:true,
			width:'',
			key:'deduction'
		},
		{
			label:'Net Pay',
			dataSort:true,
			width:'12%',
			key:'netPay'

		}
	]





		return (
			<React.Fragment>
			<Row>
			<Col>
				<Button
					color="primary"
					className="btn-square mb-2 "
					onClick ={()=>{
						this.removeEmployee()
					}}
					
				 disabled={this.state.selectedRows.length === 0}
				>
					<i class="far fa-trash-alt mr-1"></i>
					Remove Employees
				</Button>
			</Col>

		</Row>
		<div >
			<BootstrapTable
				selectRow={this.state.selectRowProp}
				search={false}
				options={this.options}
				data = {this.state.allPayrollEmployee || []}
				version="4"
				hover
				keyField="id"
				remote
				trClassName="cursor-pointer"
				csvFileName="payroll_employee_list.csv"
				ref={(node) => this.table = node}
			>
				{
					cols.map((col,index)=>{

						const  format = (cell, row)=> {

							if(col.key === 'lopDay') {
								return (
									<Input
									type="number"
									max={30}
									id="lopDay"
									name="lopDay"
									value={cell || 0}
									onChange={(evt) => {

										let value = evt.target.value;

										if(value >30 || value<0) {
											return ;
										}

										let newData = [...this.state.allPayrollEmployee]
										newData = newData.map((data)=>{

                                        
											if(row.id === data.id) {
												data.lopDay = value;
												data.noOfDays = 30-value
												data.grossPay= Number(((data.grossPay/30)*(data.noOfDays))).toFixed(2)
												data.netPay = Number(((data.grossPay/30)*(30-value))).toFixed(2)-(data.deduction || 0)
												data.payrollId=this.state.payroll_id
												data.salaryDate=this.state.payrollDate
											}
											return data
											
										})
console.log(newData)
debugger
										this.setState({
											allPayrollEmployee:newData

										})



	
									}}
								/>
	
								);

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
								dataSort = {col.dataSort}
								width = {col.width}>
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
generate=()=>{
    const formData = new FormData();
	formData.append('payrollId', this.state.payroll_id)
	formData.append('salaryDate', this.state.payrollDate)
    formData.append('generatePayrollString', JSON.stringify(this.state.allPayrollEmployee));

	this.props.createPayrollActions
	.generatePayroll(formData )
	.then((res) => {
		if (res.status === 200) {
			this.props.commonActions.tostifyAlert('success','genrated payroll Successfully')
			this.tableApiCallsOnStatus()
			// resetForm(this.state.initValue)
		}
	}).catch((err) => {
		this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
	})

}
submitPayroll=(data)=>{
	debugger
	const {userId }=data;
	this.props.createPayrollActions
	.submitPayroll( this.state.payroll_id,this.state.userId)
	.then((res) => {
		if (res.status === 200) {
			this.props.commonActions.tostifyAlert('success','Payroll Submitted Successfully')
			this.tableApiCallsOnStatus()
			// resetForm(this.state.initValue)
		}
	}).catch((err) => {
		this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
	})

}
	removeEmployee = () => {
		let ids = this.state.selectedRows;
		if(ids && ids.length) {

			let employeeList =[];
			Object.keys(this.state.selectedRows).forEach(key => {
			 employeeList.push(this.state.selectedRows[key]) 
			});
			debugger
			this.props.createPayrollActions.removeEmployee(employeeList).then((res)=>{


				let newselectRowProp = {...this.state.selectedRowprop}
				newselectRowProp.selected = []

				this.setState({
					selectRow:[],
					selectedRowprop:newselectRowProp
					
				});

				if(res.status ==200) {

					this.props.commonActions.tostifyAlert('success','Employee(s) deleted Successfully')
					this.tableApiCallsOnStatus()
				}

				if(res.status ==204) {

					this.props.commonActions.tostifyAlert('success','Employee(s) deleted Successfully')
					this.tableApiCallsOnStatus()
				}
			}).catch((err)=>{

				this.props.commonActions.tostifyAlert('error','Error...')

			})

		}
		this.tableApiCallsOnStatus()
	}

	onRowSelect = (row, isSelected, e) => {
		 
		let tempList = [];
		let tempList1 = [];
		if (isSelected) {
			tempList = Object.assign([], this.state.selectedRows);
			tempList1 = Object.assign([], this.state.selectedRows1);
			tempList.push(row.id);
			tempList1.push(row);
		} else {
			this.state.selectedRows.map((item) => {
				if (item !== row.id) {
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
				tempList.push(item.id);
				tempList1.push(item); 
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
			selectedRows1: tempList1,
		});
	};


	render() {
		strings.setLanguage(this.state.language);

		const { employee_list,approver_dropdown_list } = this.props
		const { loading,initValue } = this.state
		console.log(approver_dropdown_list,"approver_dropdown_list")
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
												<span className="ml-2">Create Payroll List</span>
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
															this.addEmployee(values)

														}}

													>
														{(props) => (


															<Form onSubmit={props.handleSubmit}>
																<Row>
															<Col >
																<FormGroup className="mb-3">
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
																			value={this.state.payrollDate}
																			onChange={(value) => {
																				props.handleChange('payrollDate')(
																					moment(value).format('DD/MM/YYYY'),
																				);
																				this.setDate(props, value);
																			}}
																			className={`form-control ${
																				props.errors.payrollDate &&
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
																	<Col>
																		<FormGroup>
																			<Label htmlFor="payrollSubject"> Payroll Subject</Label>
																			<Input
																				type="text"
																				id="payrollSubject"
																				name="payrollSubject"
																				value={this.state.payrollSubject}
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
																	<Col>
																		<FormGroup>
																			<Label htmlFor="payPeriod">  Pay period</Label>
																			<Input
																				type="text"
																				id="payPeriod"
																				name="payPeriod"
																				value={this.state.payPeriod}
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
																
																	<Col ></Col>
																	<Col>
																	<FormGroup>
																			<Select
																				styles={customStyles}
																				isMulti
																				options={

																					// employee_list.data
																					// 	? selectOptionsFactory.renderOptions(
																					// 			'label',
																					// 			'value',
																					//       employee_list.data,
																					// 			'Employee',
																					// 	  )
																					// 	: []
																					employee_list.data
																						? employee_list.data
																						: []
																				}
																				id="employeeListIds"
																				name="employeeListIds"
																				placeholder="Select Employee Names "
																				value={
																					employee_list.data &&
																						props.values.employeeIds
																						? employee_list.data.find(
																							(option) =>
																								option.value ===
																								+props.values.employeeIds.map(
																									(item) => item.id,
																								),
																						)
																						: props.values
																							.employeeIds
																				}
																				onChange={(option) => {
																					props.handleChange(
																						'employeeIds',
																					)(option);
																					this.employeeListIds(option);
																				}}
																				className={`${props.errors.employeeListIds && props.touched.employeeListIds
																					? 'is-invalid'
																					: ''
																					}`}
																			/>
																			{props.errors.employeeListIds && props.touched.employeeListIds && (
																				<div className="invalid-feedback">
																					{props.errors.employeeListIds}
																				</div>
																			)}
																		</FormGroup>
																	</Col>
																	<Col>
																	<FormGroup className="pull-left">
																			<Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
																				this.setState(() => {
																					props.handleSubmit()
																				})
																				// this.setState({
																				// 	openModal: true
																				// })
																			}}>
																				<i className="fa fa-dot-circle-o"></i> Add Employees
																			</Button>
																		</FormGroup>
																	</Col>

																	
																</Row>
																
															</Form>
														)
														}
													</Formik>


												</div>
												{this.getPayrollEmployeeList()}
												<Formik
													
													initialValues={this.state}
														   onSubmit={(values, { resetForm }) => {
															   this.submitPayroll(values)
   
														   }}
   
													   >
														   {(props) => (
   
   
															   <Form onSubmit={props.handleSubmit}>
												<Row className="mt-4 ">
													<Col lg={3}>
														<FormGroup>
															<Label htmlFor="contactId">
																{/* <span className="text-danger">*</span> */}
																Select Approver
															</Label>
															<Select
																isDisabled={	this.disable() ? true : false}
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
																	this.setState({userId:option.value})
																
																}
															}}
															/>

														</FormGroup>
													</Col>

												</Row>
												<Row className="mb-4 ">
													<Col>
														<Button
															type="button"
															color="primary"
															className="btn-square mt-4 "
															className={`btn-square mt-4 ${
																this.disable() ? `disabled-cursor` : ``
															} `}
															submitPayroll
															disabled={this.disable() ? true : false}
															onClick={() =>
																// this.submitPayroll()
																this.setState(() => {
																	props.handleSubmit()
																})
															}
															title={
																this.disable()
																	? `Please Generate Payroll Before Submitting !`
																	: ''
															}
														>
															<i class="fas fa-bullseye mr-1"></i>
															Submit Payroll
														</Button>
													
													</Col>

													<Col>
														<Button
															color="primary"
															className="btn-square mt-4 pull-right"
															// onClick={}
															onClick={() =>
																this.generate()
																
															}
														// disabled={selectedRows.length === 0}
														>

															<i class="fas fa-check-double  mr-1"></i>
															Generate Payroll
														</Button>
													</Col>
												</Row>
												
												</Form>
														)
														}
													</Formik>
											</Col>
										</Row>
									)}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
				<AddEmployeesModal
					openModal={this.state.openModal}
					closeModal={(e) => {
						this.closeModal(e);
					}}
								
					// employee_list={employee_list.data}				
				/>
			</div>
		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(CreatePayrollList)

