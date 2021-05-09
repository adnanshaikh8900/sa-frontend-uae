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
import {data}  from '../Language/index'
import LocalizedStrings from 'react-localization';
import { PayrollModal } from './sections';

const mapStateToProps = (state) => {
	return {
		payroll_employee_list: state.payrollEmployee.payroll_employee_list,
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
            actionButtons: {},
			loading: true,
			selectedRows: [],
			dialog: false,
			filterData: {
				contactId: '',
				invoiceId: '',
				receiptReferenceCode: '',
				receiptDate: '',
				contactType: 2,
			},
			csvData: [],
			view: false,
			language: window['localStorage'].getItem('language'),
            openPayrollModal : false,
		};

		this.options = {
			//onRowClick: this.goToDetail,
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
			//	mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
		this.csvLink = React.createRef();
	}

	componentDidMount = () => {
	
		this.initializeData();
	};

	initializeData = (search) => {
		let { filterData } = this.state;
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage,
		};
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : '',
		};
		const postData = { ...filterData, ...paginationData, ...sortingData };

		this.props.payRollActions
			.getPayrollEmployeeList(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ loading: false });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

	goToDetail = (row) => {
		this.props.history.push('/admin/income/receipt/detail', {
			id: row.receiptId,
		});
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
		// 		value={row.amount.toFixed(2)}
		// 		currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
		// 	/>
		// ) : (
		// 	''
		// );
		return row.amount ? row.currencySymbol + row.amount.toFixed(2) : '';
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
		return row.unusedAmount ? row.unusedAmount.toFixed(2) : '';
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
		if (isSelected) {
			tempList = Object.assign([], this.state.selectedRows);
			tempList.push(row.receiptId);
		} else {
			this.state.selectedRows.map((item) => {
				if (item !== row.receiptId) {
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
		if (isSelected) {
			rows.map((item) => tempList.push(item.receiptId));
		}
		this.setState({
			selectedRows: tempList,
		});
	};

	bulkDelete = () => {
		const { selectedRows } = this.state;
		const message1 =
        <text>
        <b>Delete Income Receipt?</b>
        </text>
        const message = 'This Income Receipt will be deleted permanently and cannot be recovered. ';
				if (selectedRows.length > 0) {
			this.setState({
				dialog: (
					<ConfirmDeleteModal
						isOpen={true}
						okHandler={this.removeBulk}
						cancelHandler={this.removeDialog}
						message={message}
						message1={message1}
					/>
				),
			});
		} else {
			this.props.commonActions.tostifyAlert(
				'info',
				'Please select the rows of the table and try again.',
			);
		}
	};

	removeBulk = () => {
		let { selectedRows } = this.state;
		const { receipt_list } = this.props;
		let obj = {
			ids: selectedRows,
		};
		this.removeDialog();
		this.props.receiptActions
			.removeBulk(obj)
			.then((res) => {
				this.initializeData();
				this.props.commonActions.tostifyAlert(
					'success',
					'Income Receipt Deleted Successfully',
				);
				if (receipt_list && receipt_list.length > 0) {
					this.setState({
						selectedRows: [],
					});
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
    };

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
										<span className="ml-2">{strings.Receipts}</span>
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
										
										{/* <Button
											color="primary"
											style={{ marginBottom: '10px' }}
											className="btn-square"
											onClick={() =>
												this.props.history.push(`/admin/income/receipt/create`)
											}
										>
											<i className="fas fa-plus mr-1" />
											Add New Receipt
										</Button> */}
										<div>
                                        <BootstrapTable
                                                    selectRow={this.selectRowProp}
                                                    search={false}
                                                    options={this.options}
                                                    data={payroll_employee_list &&
                                                         payroll_employee_list.data ? payroll_employee_list.data : []}
                                                    version="4"
                                                    hover
                                                    pagination={payroll_employee_list && payroll_employee_list.data 
                                                        && payroll_employee_list.data.length > 0 ? true : false}
                                                    keyField="id"
                                                    remote
                                                    fetchInfo={{ dataTotalSize: payroll_employee_list.count ? payroll_employee_list.count : 0 }}
                                                    className="employee-table"
                                                    trClassName="cursor-pointer"
                                                    csvFileName="payroll_employee_list.csv"
                                                    ref={(node) => this.table = node}
                                                >
                                                    <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="fullName"
                                                        dataSort
                                                        width="15%"
                                                    >
                                                        Full Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="email"
                                                        dataSort
                                                        width="15%"
                                                    >
                                                        Email
                          </TableHeaderColumn>
                                                    <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="mobileNumber"
                                                        dataSort
                                                    // dataFormat={this.vatCategoryFormatter}
                                                    width="12%"
                                                    >
                                                        mobile Number
                          </TableHeaderColumn>
                                                    <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="dob"
                                                        dataSort
                                                        dataFormat={this.renderDOB}
                                                        width="12%"
                                                    >
                                                        Date Of Birth
                          </TableHeaderColumn>
                                                    <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="gender"
                                                        dataSort
                                                        width="12%"
                                                    >
                                                        gender
                          </TableHeaderColumn>
                                                  
                                                    <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="city"
                                                        dataSort
                                                    // dataFormat={this.vatCategoryFormatter}
                                                    width="10%"
                                                    >
                                                        city
                          </TableHeaderColumn>
                                                    <TableHeaderColumn
                                                        className="table-header-bg"
                                                        dataField="isActive"
                                                        dataSort
                                                    // dataFormat={this.vatCategoryFormatter}
                                                    width="10%"
                                                    >
                                                        is-Active
                          </TableHeaderColumn>
                                                    <TableHeaderColumn
                                                        className="text-right"
                                                        columnClassName="text-right"
                                                        //width="5%"
                                                        dataFormat={this.renderActions}
                                                        className="table-header-bg"
                                                    ></TableHeaderColumn>
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
                  

                />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PayrollRun);
