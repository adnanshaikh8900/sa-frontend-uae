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
} from 'reactstrap';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';
import DatePicker from 'react-datepicker';

import { Loader, ConfirmDeleteModal } from 'components';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'bootstrap-daterangepicker/daterangepicker.css';

import * as TransactionsActions from './actions';
import { CommonActions } from 'services/global';
import { selectOptionsFactory } from 'utils';
import { CSVLink } from 'react-csv';
import { ExplainTrasactionDetail } from './sections';

import './style.scss';

const mapStateToProps = (state) => {
	return {
		bank_transaction_list: state.bank_account.bank_transaction_list,
		transaction_type_list: state.bank_account.transaction_type_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		transactionsActions: bindActionCreators(TransactionsActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class BankTransactions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			openDeleteModal: false,
			typeOptions: [
				{ value: 'Withdrawal', label: 'Withdrawal' },
				{ value: 'Deposit', label: 'Deposit' },
			],
			statusOptions: [
				{ value: 'All', label: 'All' },
				{ value: 'Matched', label: 'Matched' },
				{ value: 'Manually Added', label: 'Manually Added' },
				{ value: 'Categorized', label: 'Categorized' },
				{ value: 'Reconciled', label: 'Reconciled' },
				{ value: 'Unreconciled', label: 'Unreconciled' },
			],
			actionButtons: {},
			filterData: {
				transactionDate: '',
				chartOfAccountId: '',
			},
			selectedData: '',
			selectedreconcileRrefId: '',
			id: '',
			dialog: null,
			selectedRowData: {},
			sidebarOpen: false,
			csvData: [],
			view: false,
			selectedRow: null,
			transactionId: '',
			openExplainTransactionModal: false,
			rowId: null,
			show: false,
			bankId: '',
			expanded: [],
			page: 1,
		};

		this.options = {
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
		};

		this.selectRowProp = {
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: true,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
		this.csvLink = React.createRef();
	}

	componentDidMount = () => {
		this.props.transactionsActions.getTransactionTypeList();
		this.initializeData();
		//this.setState({ bankId: this.props.location.state.bankAccountId });
	};

	initializeData = (search) => {
		this.setState({
			bankId: this.props.location.state.bankAccountId,
		});
		let { filterData } = this.state;
		const data = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage,
		};
		if (this.props.location.state && this.props.location.state.bankAccountId) {
			const postData = {
				...filterData,
				...data,
				id: this.props.location.state.bankAccountId,
			};
			this.props.transactionsActions
				.getTransactionList(postData)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							loading: false,
						});
					}
				})
				.catch((err) => {
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
					this.setState({ loading: false });
				});
		} else {
			this.props.history.push('/admin/banking/bank-account');
		}
	};

	// toggleDangerModal () {
	//   this.setState({
	//     openDeleteModal: !this.state.openDeleteModal
	//   })
	// }

	toggleActionButton = (row) => {
		let temp = Object.assign({}, this.state.actionButtons);
		if (temp[`${row.id}`]) {
			temp[`${row.id}`] = false;
		} else {
			temp[`${row.id}`] = true;
		}
		this.setState(
			{
				actionButtons: temp,
				show: !this.state.show,
				selectedData: row,
			},
			() => {
				const activeClass = document.querySelector('.editTransactions');
				const open = document.querySelector('.overlay');
				const main = document.querySelector('.main');
				open.classList.add('open');
				main.classList.add('open');
				if (activeClass.classList.contains('active')) {
					activeClass.classList.remove('active');
				} else {
					activeClass.classList.add('active');
				}
			},
		);
	};

	renderAccountNumber = (cell, row) => {
		return (
			<label
				className="mb-0 my-link"
				onClick={() =>
					this.props.history.push(
						'/admin/banking/bank-account/transaction/detail',
					)
				}
			>
				{row.reference_number}
			</label>
		);
	};

	renderTransactionStatus = (cell, row) => {
		let classname = '';
		if (row.status === 'Explained') {
			classname = 'badge-success';
		} else if (row.status === 'Unexplained') {
			classname = 'badge-danger';
		} else {
			classname = 'badge-primary';
		}
		return <span className={`badge ${classname} mb-0`}>{row.status}</span>;
	};

	renderreconcileRrefId = (cell, row) => {
		let classname = '';
		let value = '';
		if (row.status === 'Explained') {
			classname = 'badge-success';
			value = 'Withdrawal';
		} else if (row.status === 'Unexplained') {
			classname = 'badge-danger';
			value = 'Deposit';
		} else {
			classname = 'badge-primary';
			value = 'Tax Claim';
		}
		return <span className={`badge ${classname} mb-0`}>{value}</span>;
	};

	renderDepositAmount = (cell, row) => {
		return row.depositeAmount >= 0 ? row.depositeAmount.toFixed(2) : '';
	};
	renderWithdrawalAmount = (cell, row) => {
		return row.withdrawalAmount >= 0 ? row.withdrawalAmount.toFixed(2) : '';
	};
	renderRunningAmount = (cell, row) => {
		return row.runningAmount >= 0 ? row.runningAmount.toFixed(2) : '';
	};

	test(row) {
		this.setState({
			rowId: row.id,
			show: !this.state.show,
		});
	}

	onRowSelect = (row, isSelected, e) => {
		console.log(isSelected);
		let temp = Object.assign({}, this.state.actionButtons);
		if (temp[`${row.id}`]) {
			temp[`${row.id}`] = false;
		} else {
			temp[`${row.id}`] = true;
		}
		this.setState(
			{
				actionButtons: temp,
				show: true,
				selectedData: row,
				selectedRow: row,
			},
			() => {
				const activeClass = document.querySelector('.editTransactions');
				const main = document.querySelector('.main');
				main.classList.add('open');
				activeClass.classList.add('active');
			},
		);
	};
	onSelectAll = (isSelected, rows) => {};

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

	handleChange = (val, name, reconcile, row, label) => {
		if (!reconcile) {
			this.setState({
				filterData: Object.assign(this.state.filterData, {
					[name]: val,
				}),
			});
		} else {
			if (row) {
				this.handleExplain(val, name, reconcile, row, label);
			}
		}
	};

	handleSearch = () => {
		this.initializeData();
	};

	closeTransaction = (id) => {
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={() => this.removeTransaction(id)}
					cancelHandler={this.removeDialog}
				/>
			),
		});
	};

	removeTransaction = (id) => {
		this.removeDialog();
		this.props.transactionsActions
			.deleteTransactionById(id)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'Transaction Deleted Successfully',
				);
				this.initializeData();
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : null,
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
			this.props.transactionsActions.getTransactionList(obj).then((res) => {
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
					transactionDate: '',
					chartOfAccountId: '',
				},
			},
			() => {
				this.initializeData();
			},
		);
	};

	openExplainTransactionModal = (row) => {
		this.setState(
			{
				selectedData: row,
			},
			() => {
				this.setState({
					openExplainTransactionModal: true,
				});
			},
		);
	};

	closeExplainTransactionModal = (res) => {
		this.componentDidMount();
		if (!this.state.expanded.includes(res)) {
			this.setState(() => ({
				expanded: [...this.state.expanded, res],
			}));
		} else {
			this.setState(() => ({
				expanded: this.state.expanded.filter((x) => x !== res),
			}));
		}
	};

	handleOnExpand = (row) => {
		this.setState(() => ({
			expanded: [...this.state.expanded, row.id],
		}));
	};

	isExpandableRow(row) {
		if (row.id) return true;
		else return false;
	}
	expandComponent(row) {
		//console.log(row);
		return <div className="transition">{row.id}</div>;
	}

	handleTableChange = (type, { page, sizePerPage }) => {
		this.setState(
			{
				page,
				sizePerPage,
			},
			() => {
				this.onPageChange(page, sizePerPage);
			},
		);
	};

	render() {
		const {
			loading,
			statusOptions,
			filterData,
			dialog,
			csvData,
			view,
		} = this.state;
		const { bank_transaction_list, transaction_type_list } = this.props;

		function statusFormatter(cell, row) {
			if (row.explinationStatusEnum === 'FULL') {
				return <div>Explained</div>;
			} else {
				return <div>Not Explained</div>;
			}
		}

		const columns = [
			{
				dataField: 'transactionDate',
				text: 'Date',
			},
			{
				dataField: 'description',
				text: 'Description',
			},
			{
				dataField: 'depositeAmount',
				text: 'Deposite Amount',
			},
			{
				dataField: 'withdrawalAmount',
				text: 'Withdrawal Amount',
			},
			{
				dataField: 'explinationStatusEnum',
				text: 'Status',
				formatter: statusFormatter,
			},
		];
		const expandRow = {
			onlyOneExpanding: true,
			renderer: (row) => (
				<ExplainTrasactionDetail
					closeExplainTransactionModal={(e) => {
						this.closeExplainTransactionModal(e);
					}}
					bankId={this.state.bankId}
					selectedData={row}
				/>
			),
			showExpandColumn: true,
		};

		return (
			<div className="bank-transaction-screen">
				<div className="animated fadeIn">
					<Card className={this.state.sidebarOpen ? `main-table-panel` : ''}>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="icon-doc" />
										<span className="ml-2">Bank Transactions</span>
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
												<Button
													color="success"
													className="btn-square"
													onClick={() => this.getCsvData()}
												>
													<i className="fa glyphicon glyphicon-export fa-download mr-1" />
													Export To CSV
												</Button>
												{view && (
													<CSVLink
														data={csvData}
														filename={'Transaction.csv'}
														className="hidden"
														ref={this.csvLink}
														target="_blank"
													/>
												)}
												<Button
													color="info"
													className="btn-square"
													onClick={() =>
														this.props.history.push(
															'/admin/banking/upload-statement',
															{
																bankAccountId:
																	this.props.location.state &&
																	this.props.location.state.bankAccountId
																		? this.props.location.state.bankAccountId
																		: '',
															},
														)
													}
												>
													<i className="fa glyphicon glyphicon-export fa-upload mr-1" />
													Upload Statement
												</Button>
												<Button
													color="success"
													className="btn-square"
													onClick={() =>
														this.props.history.push(
															'/admin/banking/bank-account/detail',
															{
																bankAccountId:
																	this.props.location.state &&
																	this.props.location.state.bankAccountId
																		? this.props.location.state.bankAccountId
																		: '',
															},
														)
													}
												>
													<i className="fas fa-edit mr-1" />
													Edit Account
												</Button>
											</ButtonGroup>
										</div>
										<div className="py-3">
											<h6>Filter : </h6>
											<Row>
												<Col lg={3} className="mb-1">
													<Select
														className=""
														options={statusOptions}
														placeholder="Transaction Status(TBD)"
													/>
												</Col>
												<Col lg={3} className="mb-1">
													<Select
														options={
															transaction_type_list
																? selectOptionsFactory.renderOptions(
																		'chartOfAccountName',
																		'chartOfAccountId',
																		transaction_type_list,
																		'Transaction Type',
																  )
																: []
														}
														onChange={(val) => {
															if (val && val.value) {
																this.handleChange(
																	val.value,
																	'chartOfAccountId',
																);
																this.setState({
																	selectedreconcileRrefId: val.value,
																});
															} else {
																this.handleChange('', 'chartOfAccountId');
																this.setState({ selectedreconcileRrefId: '' });
															}
														}}
														className="select-default-width"
														placeholder="Transaction Type"
														value={filterData.chartOfAccountId}
													/>
												</Col>
												<Col lg={3} className="mb-1">
													<DatePicker
														className="form-control"
														id="date"
														name="transactionDate"
														placeholderText="Transaction Date"
														showMonthDropdown
														showYearDropdown
														dropdownMode="select"
														dateFormat="dd-MM-yyyy"
														selected={filterData.transactionDate}
														onChange={(value) => {
															this.handleChange(value, 'transactionDate');
														}}
														autoComplete="off"
													/>
												</Col>
												<Col lg={2} className="pl-0 pr-0">
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
											className="btn-square"
											style={{ marginBottom: '10px' }}
											onClick={() =>
												this.props.history.push(
													'/admin/banking/bank-account/transaction/create',
													{
														bankAccountId:
															this.props.location.state &&
															this.props.location.state.bankAccountId
																? this.props.location.state.bankAccountId
																: '',
													},
												)
											}
										>
											<i className="fas fa-plus mr-1" />
											Add New Transaction
										</Button>
										<div>
											<BootstrapTable
												keyField="id"
												data={
													bank_transaction_list.data
														? bank_transaction_list.data
														: []
												}
												columns={columns}
												expandRow={expandRow}
												noDataIndication="There is no data to display"
												remote
												fetchInfo={{
													dataTotalSize: bank_transaction_list.count
														? bank_transaction_list.count
														: 0,
												}}
												onTableChange={this.handleTableChange}
												pagination={paginationFactory({
													page: this.state.page,
													sizePerPage: 10,
													totalSize: bank_transaction_list.count,
												})}
											/>
										</div>
									</Col>
								</Row>
							)}
						</CardBody>
					</Card>
					<div className="overlay"></div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BankTransactions);
