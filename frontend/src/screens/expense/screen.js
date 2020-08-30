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
	FormGroup,
	Input,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Loader, ConfirmDeleteModal, Currency } from 'components';

import { selectOptionsFactory } from 'utils';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import { CommonActions } from 'services/global';
import * as ExpenseActions from './actions';

import moment from 'moment';
import { CSVLink } from 'react-csv';

import './style.scss';

const mapStateToProps = (state) => {
	return {
		expense_list: state.expense.expense_list,
		expense_categories_list: state.expense.expense_categories_list,
		universal_currency_list: state.common.universal_currency_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		commonActions: bindActionCreators(CommonActions, dispatch),
		expenseActions: bindActionCreators(ExpenseActions, dispatch),
	};
};
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#6a4bc4' : '#c7c7c7',
		},
	}),
};

class Expense extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dialog: null,
			selectedRows: [],
			actionButtons: {},
			filterData: {
				expenseDate: '',
				transactionCategoryId: '',
				payee: '',
			},
			sortName: '',
			sortOrder: '',
			csvData: [],
			view: false,
		};

		this.options = {
			//  onRowClick: this.goToDetail,
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: this.state.sortName,
			sortOrder: this.state.sortOrder,
			onSortChange: this.sortColumn,
		};

		this.selectRowProp = {
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
		this.csvLink = React.createRef();
	}

	componentDidMount = () => {
		this.props.expenseActions.getExpenseCategoriesList();
		this.initializeData();
	};

	initializeData = (search) => {
		const { filterData } = this.state;
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage,
		};
		const sortingData = {
			order: this.state.sortOrder ? this.state.sortOrder : '',
			sortingCol: this.state.sortName ? this.state.sortName : '',
		};
		const postData = { ...filterData, ...paginationData, ...sortingData };

		this.props.expenseActions
			.getExpenseList(postData)
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

	componentWillUnmount = () => {
		this.setState({
			selectedRows: [],
		});
	};

	sortColumn = (sortName, sortOrder) => {
		this.setState(
			{
				sortName,
				sortOrder,
			},
			() => {
				this.initializeData();
			},
		);
	};
	goToDetail = (row) => {
		this.props.history.push('/admin/expense/expense/detail', {
			expenseId: row['expenseId'],
		});
	};

	onRowSelect = (row, isSelected, e) => {
		let tempList = [];
		if (isSelected) {
			tempList = Object.assign([], this.state.selectedRows);
			tempList.push(row.expenseId);
		} else {
			this.state.selectedRows.map((item) => {
				if (item !== row.expenseId) {
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
			rows.map((item) => {
				tempList.push(item.expenseId);
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
		});
	};

	renderDate = (cell, rows) => {
		return moment(rows.expenseDate).format('DD/MM/YYYY');
	};

	renderActions = (cell, row) => {
		return (
			<div>
				<ButtonDropdown
					isOpen={this.state.actionButtons[row.expenseId]}
					toggle={() => this.toggleActionButton(row.expenseId)}
				>
					<DropdownToggle size="sm" color="primary" className="btn-brand icon">
						{this.state.actionButtons[row.expenseId] === true ? (
							<i className="fas fa-chevron-up" />
						) : (
							<i className="fas fa-chevron-down" />
						)}
					</DropdownToggle>
					<DropdownMenu right>
						{row.expenseStatus !== 'Post' && (
							<DropdownItem>
								<div
									onClick={() => {
										this.props.history.push('/admin/expense/expense/detail', {
											expenseId: row['expenseId'],
										});
									}}
								>
									<i className="fas fa-edit" /> Edit
								</div>
							</DropdownItem>
						)}
						{row.expenseStatus !== 'Post' && (
							<DropdownItem
								onClick={() => {
									this.postExpense(row);
								}}
							>
								<i className="fas fa-heart" /> Post
							</DropdownItem>
						)}
						{/* <DropdownItem  onClick={() => {this.openInvoicePreviewModal(row.expenseId)}}>
              <i className="fas fa-eye" /> View
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-adjust" /> Adjust
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-upload" /> Send
            </DropdownItem>
            <DropdownItem>
              <i className="fas fa-times" /> Cancel
            </DropdownItem>  */}
						<DropdownItem
							onClick={() => {
								this.closeExpense(row.expenseId);
							}}
						>
							<i className="fa fa-trash-o" /> Delete
						</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
			</div>
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

	handleChange = (val, name) => {
		this.setState({
			filterData: Object.assign(this.state.filterData, {
				[name]: val,
			}),
		});
	};

	renderInvoiceStatus = (cell, row) => {
		let classname = '';
		if (row.expenseStatus === 'Post') {
			classname = 'badge-success';
		} else if (row.expenseStatus === 'Unpaid') {
			classname = 'badge-danger';
		} else if (row.expenseStatus === 'Pending') {
			classname = 'badge-warning';
		} else {
			classname = 'badge-primary';
		}
		return (
			<span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
				{row.expenseStatus}
			</span>
		);
	};

	renderAmount = (cell, row, extraData) => {
		return row.expenseAmount ? (
			<Currency
				value={row.expenseAmount.toFixed(2)}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			''
		);
	};

	handleSearch = () => {
		this.initializeData();
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

	postExpense = (row) => {
		this.setState({
			loading: true,
		});
		const postingRequestModel = {
			amount: row.expenseAmount,
			postingRefId: row.expenseId,
			postingRefType: 'EXPENSE',
			postingChartOfAccountId: row.chartOfAccountId,
		};
		this.props.expenseActions
			.postExpense(postingRequestModel)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Expense Posted Successfully',
					);
					this.setState({
						loading: false,
					});
					this.initializeData();
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({
					loading: false,
				});
			});
	};

	bulkDeleteExpenses = () => {
		const { selectedRows } = this.state;
		const message =
			'Warning: This Expense will be deleted permanently and cannot be recovered.  ';
		if (selectedRows.length > 0) {
			this.setState({
				dialog: (
					<ConfirmDeleteModal
						isOpen={true}
						okHandler={this.removeBulkExpenses}
						cancelHandler={this.removeDialog}
						message={message}
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

	removeBulkExpenses = () => {
		this.removeDialog();
		let { selectedRows } = this.state;
		const { expense_list } = this.props;
		let obj = {
			ids: selectedRows,
		};
		this.props.expenseActions
			.removeBulkExpenses(obj)
			.then(() => {
				this.initializeData();
				this.props.commonActions.tostifyAlert(
					'success',
					'Expense Deleted Successfully',
				);
				if (expense_list && expense_list.data && expense_list.data.length > 0) {
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

	closeExpense = (id) => {
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={() => this.removeExpense(id)}
					cancelHandler={this.removeDialog}
				/>
			),
		});
	};

	removeExpense = (id) => {
		this.removeDialog();
		this.props.expenseActions
			.deleteExpense(id)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'Expense Deleted Successfully',
				);
				this.initializeData();
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

	getCsvData = () => {
		if (this.state.csvData.length === 0) {
			let obj = {
				paginationDisable: true,
			};
			this.props.expenseActions.getExpenseList(obj).then((res) => {
				if (res.status === 200) {
					this.setState({ csvData: res.data.data, view: true }, () => {
						setTimeout(() => {
							this.csvLink.current.link.click();
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
					expenseDate: '',
					transactionCategoryId: '',
					payee: '',
				},
			},
			() => {
				this.initializeData();
			},
		);
	};

	render() {
		const {
			loading,
			dialog,
			filterData,
			selectedRows,
			csvData,
			view,
		} = this.state;
		const {
			expense_list,
			expense_categories_list,
			universal_currency_list,
		} = this.props;
		// const containerStyle = {
		//   zIndex: 1999
		// }

		return (
			<div className="expense-screen">
				<div className="animated fadeIn">
					{dialog}
					{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="fab fa-stack-exchange" />
										<span className="ml-2">Expenses</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							{loading && (
								<Row>
									<Col lg={12} className="rounded-loader">
										<Loader />
									</Col>
								</Row>
							)}
							<Row>
								<Col lg={12}>
									<div className="d-flex justify-content-end">
										<ButtonGroup size="sm">
											<Button
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
													filename={'Expense.csv'}
													className="hidden"
													ref={this.csvLink}
													target="_blank"
												/>
											)}
											<Button
												color="primary"
												className="btn-square mr-1"
												onClick={this.bulkDeleteExpenses}
												disabled={selectedRows.length === 0}
											>
												<i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
												Bulk Delete
											</Button>
										</ButtonGroup>
									</div>
									<div className="py-3">
										<h5>Filter : </h5>
										<Row>
											<Col lg={2} className="mb-1">
												<Input
													type="text"
													placeholder="Payee"
													value={filterData.payee}
													onChange={(e) =>
														this.handleChange(e.target.value, 'payee')
													}
												/>
											</Col>
											<Col lg={2} className="mb-1">
												{/* <DateRangePicker>
                              <Input type="text" placeholder="Expense Date" />
                            </DateRangePicker> */}
												<DatePicker
													className="form-control"
													id="date"
													name="expenseDate"
													placeholderText="Expense Date"
													selected={filterData.expenseDate}
													showMonthDropdown
													showYearDropdown
													dateFormat="dd/MM/yyyy"
													dropdownMode="select"
													value={filterData.expenseDate}
													onChange={(value) => {
														this.handleChange(value, 'expenseDate');
													}}
												/>
											</Col>

											<Col lg={2} className="mb-1">
												{/* <Input type="text" placeholder="Supplier Name" /> */}
												<FormGroup className="mb-3">
													<Select
														styles={customStyles}
														className="select-default-width"
														id="expenseCategoryId"
														name="expenseCategoryId"
														value={filterData.transactionCategoryId}
														options={
															expense_categories_list
																? selectOptionsFactory.renderOptions(
																		'transactionCategoryName',
																		'transactionCategoryId',
																		expense_categories_list,
																		'Expense Category',
																  )
																: []
														}
														onChange={(option) => {
															if (option && option.value) {
																this.handleChange(
																	option,
																	'transactionCategoryId',
																);
															} else {
																this.handleChange('', 'transactionCategoryId');
															}
														}}
														placeholder="Expense Category"
													/>
												</FormGroup>
											</Col>
											<Col lg={3} className="pl-0 pr-0">
												<Button
													type="button"
													color="primary"
													className="btn-square mr-1"
													onClick={this.handleSearch}
												>
													<i className="fa fa-search"></i>
												</Button>
												<Button
													type="button"
													color="primary"
													className="btn-square"
													onClick={this.clearAll}
												>
													<i className="fa fa-refresh"></i>
												</Button>
											</Col>
										</Row>
									</div>
									<Button
										color="primary"
										style={{ marginBottom: '10px' }}
										className="btn-square"
										onClick={() =>
											this.props.history.push(`/admin/expense/expense/create`)
										}
									>
										<i className="fas fa-plus mr-1" />
										Add New Expense
									</Button>
									<div>
										<BootstrapTable
											selectRow={this.selectRowProp}
											search={false}
											options={this.options}
											data={
												expense_list && expense_list.data
													? expense_list.data
													: []
											}
											version="4"
											hover
											keyField="expenseId"
											pagination={
												expense_list &&
												expense_list.data &&
												expense_list.data.length > 0
													? true
													: false
											}
											remote
											fetchInfo={{
												dataTotalSize: expense_list.count
													? expense_list.count
													: 0,
											}}
											multiColumnSort
											className="expense-table"
											trClassName="cursor-pointer"
											ref={(node) => (this.table = node)}
											csvFileName="expense_list.csv"
										>
											<TableHeaderColumn
												dataField="expenseDate"
												dataSort
												dataFormat={this.renderDate}
												width="20%"
											>
												Expense Date
											</TableHeaderColumn>
											<TableHeaderColumn dataField="payee" dataSort>
												Payee
											</TableHeaderColumn>
											<TableHeaderColumn
												width="20%"
												dataField="expenseStatus"
												dataFormat={this.renderInvoiceStatus}
												dataSort
											>
												Status
											</TableHeaderColumn>
											{/* <TableHeaderColumn
												dataField="expenseDescription"
												dataSort
											>
												Description
											</TableHeaderColumn>
											<TableHeaderColumn dataField="receiptNumber" dataSort>
												Receipt No
											</TableHeaderColumn> */}
											<TableHeaderColumn
												dataField="transactionCategoryName"
												dataSort
												width="20%"
											>
												Expense Category
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="expenseAmount"
												dataSort
												dataFormat={this.renderAmount}
												formatExtraData={universal_currency_list}
												width="15%"
											>
												Expense Amount
											</TableHeaderColumn>
											<TableHeaderColumn
												className="text-right"
												columnClassName="text-right"
												width="55"
												dataFormat={this.renderActions}
											></TableHeaderColumn>
										</BootstrapTable>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Expense);
