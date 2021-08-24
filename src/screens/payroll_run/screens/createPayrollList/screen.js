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
		
		// if (this.props.location.state 
		// 	// && this.props.location.state.id
		// 	) {
            this.props.createPayrollActions.getPayrollById(1105).then((res) => {
                if (res.status === 200) {
					debugger
                    this.setState({
                        loading: false,
                        // current_payroll_id: this.props.location.state.id,
                  
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
					

                }
            }).catch((err) => {
                this.setState({ loading: false })
              
            })
        
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
	addEmployee = (data) => {
		 
		this.setState({ disabled: true });
		const {
			employeeIds,
			employeeListIds,
			noOfDays,
			salaryDate
		} = data;
	
		const formData = new FormData();

		// var result = employeeListIds.map((o) => ({
		//   employeeIds: o.value,  
		// }));
		// formData.append(
		// 	'employeeListIds',
		//   employeeIds)
		// employeeIds.forEach(item => {
		// 	formData.append('employeeListIds', item.value);
		// });
let employeeList =[];
		  Object.keys(employeeIds).forEach(key => {
			// buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
			employeeList.push(employeeIds[key].value) 
		  });
	
formData.append('employeeListIds', employeeList );
		
		formData.append(
			'payrollId',
		  this.props.location.state.id);

		this.props.createPayrollActions
			.addMultipleEmployees( this.props.location.state.id,employeeList)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Employees added Successfully')
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

	render() {
		strings.setLanguage(this.state.language);

		const { employee_list } = this.props
		const { loading,initValue } = this.state
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
												<Row>
													<Col>
														<Button
															color="primary"
															className="btn-square mb-2 "
															// onClick={}
															onClick={() =>
																this.props.history.push('/admin/payroll/createPayroll')
															}
														// disabled={selectedRows.length === 0}
														>
															<i class="far fa-trash-alt mr-1"></i>
															Remove Employees
														</Button>
													</Col>
													{/* <Col>
																		<FormGroup className="pull-right">
																			<Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
																				// this.setState(() => {
																				// 	props.handleSubmit()
																				// })
																				this.setState({
																					openModal: true
																				})
																			}}>
																				<i className="fa fa-dot-circle-o"></i> Add Employees
																			</Button>
																		</FormGroup>
																	</Col> */}

												</Row>
												<div >
													<BootstrapTable
														selectRow={this.selectRowProp}
														search={false}
														options={this.options}
														// data={payroll_employee_list &&
														// 	payroll_employee_list ? payroll_employee_list : []}
														version="4"
														hover
														keyField="employeeId"
														remote
														// fetchInfo={{ dataTotalSize: payroll_employee_list.count ? payroll_employee_list.count : 0 }}
														// className="employee-table mt-4"
														trClassName="cursor-pointer"
														csvFileName="payroll_employee_list.csv"
														ref={(node) => this.table = node}
													>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort

														>
															Employee NO#
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort
														>
															Employee Name
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort
															width="8%"

														>
															LOP Days 
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort
															width="12%"
														>
															Payable Days
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort	>
															Package
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort


														>
															Earnings
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort


														>
															Deductions
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort

														>
															Net Pay
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort
															width="8%"
														>
															{strings.STATUS}
														</TableHeaderColumn>

													</BootstrapTable>
												</div>
												<Row className="mt-4 ">
													<Col lg={3}>
														<FormGroup>
															<Label htmlFor="contactId">
																{/* <span className="text-danger">*</span> */}
																Select Approver
															</Label>
															<Select
																styles={customStyles}
																id="contactId"
																name="contactId"
																placeholder={"Select Approver"}
															// options={
															// 	tmpCustomer_list
															// 		? selectOptionsFactory.renderOptions(
															// 				'label',
															// 				'value',
															// 				tmpCustomer_list,
															// 				'Customer',
															// 		  )
															// 		: []
															// }
															// value={props.values.contactId}
															// onChange={(option) => {
															// 	if (option && option.value) {
															// 		this.formRef.current.setFieldValue('currency', this.getCurrency(option.value), true);
															// 		// this.setExchange( this.getCurrency(option.value) );
															// 		props.handleChange('contactId')(option);
															// 	} else {
															// 		props.handleChange('contactId')('');
															// 	}
															// }}
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
																this.props.history.push('/admin/payroll/createPayroll')
															}
														// disabled={selectedRows.length === 0}
														>

															<i class="fas fa-check-double  mr-1"></i>
															Generate Payroll
														</Button>
													</Col>
												</Row>
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

