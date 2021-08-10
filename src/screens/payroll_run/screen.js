import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	ButtonGroup,
	Input,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Label,
} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { selectOptionsFactory } from 'utils';

import { Loader, ConfirmDeleteModal, Currency } from 'components';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { CommonActions } from 'services/global';
import { CSVLink } from 'react-csv';

import * as PayRollActions from './actions';
import moment from 'moment';

import './style.scss';
import { data } from '../Language/index'
import LocalizedStrings from 'react-localization';
import { PayrollModal } from './sections';
import { PaidInvoices } from 'screens/dashboard/sections';

const mapStateToProps = (state) => {
	return {
		payroll_employee_list: state.payrollEmployee.payroll_employee_list.resultSalaryPerMonthList,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		payRollActions: bindActionCreators(PayRollActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
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

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = (search) => {
		const { initValue } = this.state;
		const postData =
			initValue.presentdate

		this.props.payRollActions
			.getPayrollEmployeeList(postData)
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
		this.renderActionForState(row.employeeId);
	};

	renderMode = (cell, row) => {
		return <span className="badge badge-success mb-0">Cash</span>;
	};

	renderDate = (cell, rows) => {
		return rows['receiptDate'] !== null
			? moment(rows['receiptDate']).format('DD/MM/YYYY')
			: '';
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
	debugger
			if (isSelected && row.status === "UnPaid") {
				tempList = Object.assign([], this.state.selectedRows);
				tempList.push(row.employeeId);
			} else 
			{ 
				if(isSelected==true) {	this.props.commonActions.tostifyAlert(
					'success',"Salary for \""+row.employeeName+'\" has ALREADY GENERATED',
				);}
				
			
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
	onSelectAll = (isSelected, rows) => {
		
		let tempList = [];
		let paidList = [];
		let EmployeeNames="";
		if (isSelected) {
			rows.map((item) => {
				if (item.status === 'UnPaid') {			
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
        if (row.status === "Paid") {
            classname = 'label-success';
        } else {
            classname = 'label-draft';
        }
        return (
            <span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
                {
                    row.status === "Paid"?
                        "Paid" :
                        "Draft"

                }
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
	renderActions = (cell, row) => {
		return (
			<div>
				<ButtonDropdown
					isOpen={this.state.actionButtons[row.id]}
					toggle={() => this.toggleActionButton(row.id)}
				>
					<DropdownToggle size="sm" color="primary" className="btn-brand icon">
						{this.state.actionButtons[row.id] === true ? (
							<i className="fas fa-chevron-up" />
						) : (
							<i className="fas fa-chevron-down" />
						)}
					</DropdownToggle>
					<DropdownMenu right>

						<DropdownItem
							onClick={() =>
								this.props.history.push(
									'/admin/payroll/employee/detail',
									{ id: row.id },
								)
							}
						>
							<i className="fas fa-edit" /> Edit
						</DropdownItem>


						<DropdownItem
							onClick={() =>
								this.props.history.push(
									'/admin/payroll/employee/salarySlip',
									{ id: row.id, monthNo: 4 },
								)
							}
						>
							<i className="fas fa-eye" /> Salary Slip
						</DropdownItem>

					</DropdownMenu>
				</ButtonDropdown>
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
			invoice_list,
			contact_list,
			universal_currency_list,
		} = this.props;
		console.log(payroll_employee_list)
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
										<i className="nav-icon fa fa-file-o" />
										<span className="ml-2">{strings.GeneratePayroll}</span>
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
												{/* <Button
													color="primary"
													className="btn-square mr-1"
													onClick={() => this.getCsvData()}
												>
													<i className="fa glyphicon glyphicon-export fa-download mr-1" />
													Export To CSV
												</Button>
												{view && (
													<CSVLink
														data={csvData}
														filename={'Receipt.csv'}
														className="hidden"
														ref={this.csvLink}
														target="_blank"
													/>
												)} */}
												{/* <Button
													color="primary"
													className="btn-square mr-1"
													onClick={this.bulkDelete}
													disabled={selectedRows.length === 0}
												>
													<i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
													Bulk Delete
												</Button> */}
											</ButtonGroup>
										</div>
										<Row className="mb-4 ">
											<Col lg={2} className="mb-1 ml-4">
												<Label>{strings.Period}</Label>
												<DatePicker
													className="form-control"
													id="date"
													name="salaryDate"
													placeholderText={strings.PostDate}
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													dateFormat="dd/MM/yyyy"
													autoComplete="off"
													value={this.state.salaryDate}
													onChange={(value) => {
														this.handleChange(value, 'salaryDate');
													}}
												/>
											</Col>
											<Col>
												<Button
													color="primary"
													className="btn-square mt-4"
													onClick={this.generateSalary}
													disabled={selectedRows.length === 0}
												>
													<i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
													{strings.GenerateSalary}
												</Button>
											</Col>
										</Row>
										<div >
											<BootstrapTable
												selectRow={this.selectRowProp}
												search={false}
												options={this.options}
												data={payroll_employee_list &&
													payroll_employee_list ? payroll_employee_list : []}
												version="4"
												hover
												keyField="employeeId"
												remote
												fetchInfo={{ dataTotalSize: payroll_employee_list.count ? payroll_employee_list.count : 0 }}
												// className="employee-table mt-4"
												trClassName="cursor-pointer"
												csvFileName="payroll_employee_list.csv"
												ref={(node) => this.table = node}
											>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
													width="10%"
												>
													{strings.STATUS}
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="employeeName"
													dataSort

												>
													{strings.EmployeeName}
												</TableHeaderColumn>
												
												<TableHeaderColumn
													className="table-header-bg"
													dataField="payDays"
													dataSort
													width="15%"
												>
													{strings.PAYDAYS}
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="earnings"
													dataSort
													dataFormat={this.earnings}
													width="12%"
												>
													{strings.EARNINGS}
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="deductions"
													dataSort
													dataFormat={this.deductions}
													width="12%"
												>
													{strings.DEDUCTIONS}
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="grossSalary"
													dataSort
													dataFormat={this.grossSalary}
													width="12%"
												>
													{strings.NETPAY}
												</TableHeaderColumn>

											
											</BootstrapTable>
										</div>

									</Col>

								</Row>
							)}
						</CardBody>
					</Card>
				</div>
				<PayrollModal
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


				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PayrollRun);
