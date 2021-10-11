import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Card,

	CardBody,
	Row,
	Col,

	Button,
	CardHeader,
	ButtonGroup,

	UncontrolledTooltip,
} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import { Loader, } from 'components';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { CommonActions } from 'services/global';


import * as PayRollActions from './actions';
import moment from 'moment';

import './style.scss';
import { data } from '../Language/index'
import LocalizedStrings from 'react-localization';

import { toast } from 'react-toastify';
import { Table } from '@material-ui/core';

const mapStateToProps = (state) => {

	return {
		user_approver_generater_dropdown_list: state.payrollRun.user_approver_generater_dropdown_list.data,
		payroll_employee_list: state.payrollRun.payroll_list,
		// payroll_employee_list: state.payrollEmployee.payroll_employee_list.resultSalaryPerMonthList,
		incompleteEmployeeList: state.payrollRun.incompleteEmployeeList,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		payRollActions: bindActionCreators(PayRollActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
// const customStyles = {
// 	control: (base, state) => ({
// 		...base,
// 		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
// 		boxShadow: state.isFocused ? null : null,
// 		'&:hover': {
// 			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
// 		},
// 	}),
// };

let strings = new LocalizedStrings(data);
class PayrollRun extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			payRollList: {},
			actionButtons: {},
			loading: true,
			selectedRows: [],
			dialog: false,
			salaryDate: moment().startOf('month').format('DD/MM/YYYY'),
			filterData: {
				contactId: '',
				invoiceId: '',
				receiptReferenceCode: '',
				receiptDate: '',
				contactType: 2,
			},
			initValue: {
				presentdate: moment().local().format('DD/MM/YYYY'),
			},
			activeTab: new Array(4).fill('1'),
			csvData: [],
			view: false,
			openPayrollModal: false,
			selectedData: '',
			current_employee: '',
			lop: '',
		};

		this.options = {
			onRowClick: this.goToDetail,
			paginationPosition: 'bottom',
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: '',
			sortOrder: '',
			onSortChange: this.sortColumn,
		};

		this.selectRowProp = {
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		}
		this.csvLink = React.createRef();
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({ payroll_employee_list1: nextProps.payroll_employee_list })
		console.log(nextProps.payroll_employee_list, "nextProps")


	}
	componentDidMount = () => {

		this.props.payRollActions.getUserAndRole();
		this.initializeData();
	};
	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		console.log(tab);
		this.setState({
			activeTab: newArray,
		});
	};

	initializeData = (search) => {
		const { initValue } = this.state;
		const postData =
			initValue.presentdate


		// this.props.payRollActions.getIncompletedEmployeeList()
		// .then((res) => {
		// 	if (res.status === 200) {

		// 		this.setState({
		// 			incompleteEmployeeList: res.data,
		// 		})
		// 	}
		// })
		// .catch((err) => {
		// 	this.setState({ loading: false });
		// });

		this.props.payRollActions
			.getPayrollList(postData)
			.then((res) => {
				if (res.status === 200) {

					this.setState({
						loading: false,
					})
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});



	};

	goToDetail = (row) => {
		// this.renderActionForState(row.employeeId);
		const { user_approver_generater_dropdown_list } = this.props;
		 
		var userValue = user_approver_generater_dropdown_list.length ? user_approver_generater_dropdown_list[0].value : '';
		var userLabel = user_approver_generater_dropdown_list.length ? user_approver_generater_dropdown_list[0].label : '';

		if (userValue.toString() === row.generatedBy && userLabel === "Payroll Generator") {
			this.props.history.push('/admin/payroll/updatePayroll', { id: row.id })
		}
		else
			if (userValue === row.payrollApprover && userLabel === "Payroll Approver") {
				this.props.history.push('/admin/payroll/payrollApproverScreen', { id: row.id })
			}
			else
			if ( userLabel === "Admin" && row.status==="Draft") {
				this.props.history.push('/admin/payroll/updatePayroll', { id: row.id })
			}
			else
			
				if ( userLabel === "Admin" && row.status==="Submitted") {
					this.props.history.push('/admin/payroll/payrollApproverScreen', { id: row.id })
				}else
				if ( userLabel === "Admin" && row.status==="Approved") {
					this.props.history.push('/admin/payroll/payrollApproverScreen', { id: row.id })
				}
				else
				if ( userLabel === "Admin" && row.status==="Rejected") {
					this.props.history.push('/admin/payroll/updatePayroll', { id: row.id })
				}
		        else{
				let list = [...this.state.payroll_employee_list1];
				list = list.map((data) => {
					if (data.id === row.id) {
						data.hover = true;
					}
					return data;
				});
				console.log(list, "list")
				this.setState({ payroll_employee_list1: list })

				toast.success("This is created by another user , So you can'nt able to Open it !")
			}			
			
	};

	renderMode = (cell, row) => {
		return <span className="badge badge-success mb-0">Cash</span>;
	};

	renderDate = (cell, rows) => {
		return rows.payrollDate ? moment(rows.payrollDate).format('DD/MM/YYYY') : '-';
	};

	renderAmount = (cell, row, extraData) => {
		// return row.amount ? (
		// 	<Currency
		// 		value={row.amount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	''
		// );
		return row.amount ? row.currencySymbol + row.amount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : '';
	};

	renderCurrency = (cell, row) => {
		if (row.currencyIsoCode) {
			return (
				<label className="badge label-currency mb-0">{row.currencyIsoCode}</label>
			);
		} else {
			return <label className="badge badge-danger mb-0">No Specified</label>;
		}
	};
	renderUnusedAmount = (cell, row) => {
		return row.unusedAmount ? row.unusedAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : '';
	};

	onSizePerPageList = (sizePerPage) => {
		if (this.options.sizePerPage !== sizePerPage) {
			this.options.sizePerPage = sizePerPage;
			this.initializeData();
		}
	};

	onPageChange = (page, sizePerPage) => {
		if (this.options.page !== page) {
			this.options.page = page;
			this.initializeData();
		}
	};

	sortColumn = (sortName, sortOrder) => {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		this.initializeData();
	};

	onRowSelect = (row, isSelected, e) => {
		let tempList = [];

		if (isSelected && row.status === "Draft") {
			tempList = Object.assign([], this.state.selectedRows);
			tempList.push(row.employeeId);
		} else {
			// if(isSelected==true) {	this.props.commonActions.tostifyAlert(
			// 	'success',"Salary for \""+row.employeeName+'\" has ALREADY GENERATED',
			// );}


			this.state.selectedRows.map((item) => {
				if (item !== row.employeeId) {
					tempList.push(item);
				}
				return item;
			});
		}

		this.setState({
			selectedRows: tempList,
		});
	};
	renderRunDate = (cell, row) => {
		return row.runDate ? moment(row.runDate).format('DD/MM/YYYY') : '-';
	};
	renderEmployeeCount = (cell, row) => {
		let employeeCount= row.employeeCount ? row.employeeCount : '-'
		return (<div className="text-center">{employeeCount}</div>);
	};
	renderPayperiod = (cell, row) => {
		let dateArr=row.payPeriod ? row.payPeriod.split("-"):[];

		
		return(<Table>
			<Row><Col className="pull-right"><b>Start-Date</b></Col><Col>: {dateArr[0]}</Col></Row>
			<Row><Col className="pull-right"><b>End-Date</b></Col><Col>: {dateArr[1]}</Col></Row>
			 </Table>  
			) ;
	};
	renderPayrollApprover = (cell, row) => {
		return row.payrollApproverName ? row.payrollApproverName : '-';
	};
	renderGeneratedBy= (cell, row) => {
		return row.generatedByName ? row.generatedByName : '-';
	};
	renderComment = (cell, row) => {

		if(row.comment !==null)
		{return( <label
			className="mb-0 label-bank"
			id="UnitPriceTooltip1"
			style={{
				cursor: 'pointer',
				// backgroundColor: "yellow !important"
			}}
		>
			{/* <UncontrolledTooltip
				placement="right"
				target="UnitPriceTooltip1"
				key={row.id}
			>
				{row.comment ? row.comment:''}
			</UncontrolledTooltip> */}
			Read Here..
		</label>);}
		else{
			return("-");
		}
	};
	onSelectAll = (isSelected, rows) => {

		let tempList = [];
		// let paidList = [];
		// let EmployeeNames = "";
		if (isSelected) {
			rows.map((item) => {
				if (item.status === 'Draft') {
					tempList.push(item.employeeId)
				}
			});
		}
		// this.props.commonActions.tostifyAlert(
		// 	'info',"Salary for below Employees has already generated  : "+EmployeeNames,
		// );
		// paidList.map((e)=>{

		// })
		this.setState({
			selectedRows: tempList,
		});
	};

	renderStatus = (cell, row) => {
		let classname = '';
		
		if (row.status === 'Approved') {
			classname = 'label-success';
		} else if (row.status === 'Draft') {
			classname = 'label-currency';
		} else if (row.status === 'Paid') {
			classname = 'label-approved';
		}else if (row.status === 'Rejected') {
			classname = 'label-due';
		}  if (row.status === 'Submitted') {
			classname = 'label-sent';
		}
		// else {
		// 	classname = 'label-overdue';
		// }
		return (
			<span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
				{row.status}
			</span>
		);
	};

	// bulkDelete = () => {
	// 	const { selectedRows } = this.state;

	// 			if (selectedRows.length > 0) {
	// 		this.setState({
	// 			dialog: (
	// 				<ConfirmDeleteModal
	// 					isOpen={true}
	// 					okHandler={this.removeBulk}
	// 					cancelHandler={this.removeDialog}
	// 					message={message}
	// 					message1={message1}
	// 				/>
	// 			),
	// 		});
	// 	} else {
	// 		this.props.commonActions.tostifyAlert(
	// 			'info',
	// 			'Please select the rows of the table and try again.',
	// 		);
	// 	}
	// };

	generateSalary = () => {
		//let { selectedRows,salaryDate } = this.state;
		const { payroll_employee_list } = this.props;
		// let obj = {
		// 	employeeListIds: selectedRows,
		//     salaryDate : salaryDate

		// };

		const {
			employeeListIds,
			salaryDate
		} = data;


		const formData = new FormData();
		formData.append('employeeListIds', (this.state.selectedRows))
		formData.append('salaryDate', this.state.salaryDate)

		this.props.payRollActions
			.generateSalary(formData)
			.then((res) => {
				if (res.status === 200) {
					this.initializeData();
					this.props.commonActions.tostifyAlert(
						'success',
						'Salary Generated Successfully',
					);
					if (payroll_employee_list && payroll_employee_list.length > 0) {
						this.setState({
							selectedRows: [],
						});
					}
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	// removeDialog = () => {
	// 	this.setState({
	// 		dialog: null,
	// 	});
	// };

	handleChange = (val, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: val,
			}),
		});
	};

	handleSearch = () => {
		this.initializeData();
	};

	getCsvData = () => {
		if (this.state.csvData.length === 0) {
			let obj = {
				paginationDisable: true,
			};
			this.props.receiptActions.getReceiptList(obj).then((res) => {
				if (res.status === 200) {
					this.setState({ csvData: res.data.data, view: true }, () => {
						setTimeout(() => {
							this.csvLink.current.link.click();
							this.initializeData();
						}, 0);
					});
				}
			});
		} else {
			this.csvLink.current.link.click();
		}
	};
	updateParentLop = (lop, noOfDays) => {
		this.setState({ lop: lop, noOfDays })
		console.log(lop, "00000000")
		console.log(noOfDays, "noOfDays")
	};
	renderActionForState = (employeeId) => {
		this.props.payRollActions.getSalaryDetailByEmployeeIdNoOfDays(employeeId).then((res) => {
			this.setState({
				current_employee: employeeId,
				openPayrollModal: true, rowId: employeeId,
				selectedData: res.data,
				employeename: res.data.employeeName,
				netPay: res.data.netPay,
				noOfDays: res.data.noOfDays,
				lop: 30 - res.data.noOfDays,
				salaryDetailAsNoOfDaysMap: res.data.salaryDetailAsNoOfDaysMap,

				loading: false,
			})
			console.log(this.state.lop, " saigisagfgbaskf")
		});
	}


	clearAll = () => {
		this.setState(
			{
				filterData: {
					contactId: '',
					invoiceId: '',
					receiptReferenceCode: '',
					receiptDate: '',
				},
			},
			() => {
				this.initializeData();
			},
		);
	};
	 columnHover = (cell, row, enumObject, rowIndex) => {

		return cell
	  }
	toggleActionButton = (index) => {
		let temp = Object.assign({}, this.state.actionButtons);
		if (temp[parseInt(index, 10)]) {
			temp[parseInt(index, 10)] = false;
		} else {
			temp[parseInt(index, 10)] = true;
		}
		this.setState({
			actionButtons: temp,
		});
	};
	renderSubject = (cell, row) => {
		if (row.hover) {
			 
			return (

				<label
					className="mb-0 label-bank"
					id="UnitPriceTooltip"
					style={{
						cursor: 'pointer',
						backgroundColor: "yellow !important"
					}}
				>
					<UncontrolledTooltip
						placement="right"
						target="UnitPriceTooltip"
					>
						This is created by another user , So you can'nt able to Open it !
					</UncontrolledTooltip>
					{row.payrollSubject}
				</label>
			);
		}
		else {
			return (
				<label
					className="mb-0 label-bank"
					style={{
						cursor: 'pointer',
					}}
				>
					{row.payrollSubject}
				</label>
			);
		}


	};
	renderActions = (cell, row) => {
		return (
			<div>

				<Button
					onClick={() =>
						this.props.history.push(
							'/admin/payroll/employee/viewEmployee',
							{ id: row.employeeId },
						)
					}
				>
					<i className="fas fa-edit" />
				</Button>
				&nbsp;&nbsp;&nbsp;	{row.employeeName}

			</div>
		);
	};

	openPayrollModal = (props) => {
		this.setState({ openPayrollModal: true });
	};
	closePayrollModal = (res) => {
		this.setState({ openPayrollModal: false });
		this.initializeData();
	};

	grossSalary = (cell, row, extraData) => {
		return row.grossSalary ? row.grossSalary.toLocaleString() : row.grossSalary.toLocaleString();
	}

	deductions = (cell, row, extraData) => {
		return row.deductions ? row.deductions.toLocaleString() : row.deductions.toLocaleString();
	}

	earnings = (cell, row, extraData) => {
		return row.earnings ? row.earnings.toLocaleString() : row.earnings.toLocaleString();
	}

	render() {
		strings.setLanguage(this.state.language);
		const {
			loading,
			dialog,
			selectedRows,
			filterData,
			csvData,
			view,
		} = this.state;
		const {
			payroll_employee_list,
			user_approver_generater_dropdown_list,
			incompleteEmployeeList,
			invoice_list,
			contact_list,
			universal_currency_list,
		} = this.props;

		const userForCheckApprover = user_approver_generater_dropdown_list && user_approver_generater_dropdown_list.length !== 0 ? user_approver_generater_dropdown_list[0].label : '';

		console.log(user_approver_generater_dropdown_list, "user_approver_generater_dropdown_list")
		return (
			<div className="receipt-screen">
				<div className="animated fadeIn">
					{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
					{dialog}
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i class="fas fa-money-check-alt"></i>
										<span className="ml-2">Payrolls</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>


							<div className="employee-screen">
								<div className="animated fadeIn">
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
												<Row className="mb-4 ">
													{userForCheckApprover === "Payroll Approver" ? ""
														: <Col>
															<Button
																color="primary"
																className="btn-square mt-2 pull-right"
																// onClick={}
																onClick={() =>
																	this.props.history.push('/admin/payroll/createPayrollList')
																}
															// disabled={selectedRows.length === 0}
															>
																<i className="fas fa-plus mr-1" />

																Create New Payroll
															</Button>
														</Col>
													}

												</Row>
												<div >
													<BootstrapTable
														//  selectRow={this.selectRowProp}
														search={false}
														options={this.options}
														data={this.state.payroll_employee_list1 &&
															this.state.payroll_employee_list1 ? this.state.payroll_employee_list1 : []}
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
															dataField="payrollDate"
															dataFormat={this.renderDate}
															dataSort
															width="10%"
														>
															Payroll Date
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="payrollSubject"
															dataFormat={this.renderSubject}
															dataSort
														>
															Payroll Subject
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="payPeriod"
															dataFormat={this.renderPayperiod}
															width='15%'
															dataSort
														>
															Pay Period
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="employeeCount"
															dataSort
															dataFormat={this.renderEmployeeCount}
														>
															Employee Count
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="generatedBy"
															dataSort
															dataFormat={this.renderGeneratedBy}
														>
															Generated by
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="payrollApprover"
															dataSort
															dataFormat={this.renderPayrollApprover}
														>
															Approver
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="status"
															dataSort
															dataFormat={this.renderStatus}
														>
															{strings.STATUS}
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="runDate"
															dataSort
															width="10%"
															dataFormat={this.renderRunDate}
														>
															Run Date
														</TableHeaderColumn>
														<TableHeaderColumn
															className="table-header-bg"
															dataField="comment"
															dataSort
															columnTitle={this.columnHover}
															 dataFormat={this.renderComment}
															
														>
															comment
														</TableHeaderColumn>


													</BootstrapTable>
												</div>

											</Col>

										</Row>
									)}

								</div>
							</div>
						</CardBody>
					</Card>
				</div>
				{/* <PayrollModal
					openPayrollModal={this.state.openPayrollModal}
					closePayrollModal={(e) => {
						this.closePayrollModal(e);
					}}
					updateParentLop={
						(e, e1) => {
							this.updateParentLop(e, e1);
						}}
					selectedData={this.state.selectedData}
					employeename={this.state.selectedData.employeeName}
					netPay={this.state.selectedData.netPay}
					noOfDays={this.state.noOfDays}
					current_employee={this.state.current_employee}
					lop={this.state.lop}
					updateEmployeeSalary={this.props.payRollActions.updateSalaryComponentAsNoOfDays}


				/> */}
			</div>
		);
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(PayrollRun);
