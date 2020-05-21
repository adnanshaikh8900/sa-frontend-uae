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
import Select from 'react-select';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';

import { Loader, ConfirmDeleteModal } from 'components';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';

import * as CustomerInvoiceActions from './actions';
import { CommonActions } from 'services/global';
import { selectOptionsFactory } from 'utils';

import './style.scss';

const mapStateToProps = (state) => {
	return {
		customer_invoice_list: state.customer_invoice.customer_invoice_list,
		customer_list: state.customer_invoice.customer_list,
		status_list: state.customer_invoice.status_list,
		currency_list: state.customer_invoice.currency_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		customerInvoiceActions: bindActionCreators(
			CustomerInvoiceActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class CustomerInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dialog: false,
			actionButtons: {},
			filterData: {
				customerId: '',
				referenceNumber: '',
				invoiceDate: '',
				invoiceDueDate: '',
				amount: '',
				status: '',
				contactType: 2,
			},
			selectedRows: [],
			selectedId: '',
			openInvoicePreviewModal: false,
			csvData: [],
			view: false,
			overDueAmountDetails: {
				overDueAmount: '',
				overDueAmountWeekly: '',
				overDueAmountMonthly: '',
			},
		};

		this.options = {
			paginationPosition: 'top',
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
			onSelectAll: this.onSelectAll,
		};

		this.csvLink = React.createRef();
	}

	componentDidMount = () => {
		let { filterData } = this.state;
		this.props.customerInvoiceActions.getStatusList();
		this.props.customerInvoiceActions.getCurrencyList();
		this.props.customerInvoiceActions.getCustomerList(filterData.contactType);
		this.props.customerInvoiceActions
			.getOverdueAmountDetails(filterData.contactType)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ overDueAmountDetails: res.data });
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({ loading: false });
			});
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
		this.props.customerInvoiceActions
			.getCustomerInvoiceList(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ loading: false }, () => {
						if (this.props.location.state && this.props.location.state.id) {
							this.openInvoicePreviewModal(this.props.location.state.id);
						}
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

	componentWillUnmount = () => {
		this.setState({
			selectedRows: [],
		});
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

	postInvoice = (row) => {
		this.setState({
			loading: true,
		});
		const postingRequestModel = {
			amount: row.invoiceAmount,
			postingRefId: row.id,
			postingRefType: 'INVOICE',
		};
		this.props.customerInvoiceActions
			.postInvoice(postingRequestModel)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Invoice Posted Successfully',
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

	renderInvoiceNumber = (cell, row) => {
		return (
			<label
				className="mb-0 my-link"
				onClick={() =>
					this.props.history.push('/admin/revenue/customer-invoice/detail')
				}
			>
				{row.transactionCategoryName}
			</label>
		);
	};

	renderInvoiceStatus = (cell, row) => {
		let classname = '';
		if (row.status === 'Post') {
			classname = 'badge-success';
		} else if (row.status === 'Unpaid') {
			classname = 'badge-danger';
		} else if (row.status === 'Pending') {
			classname = 'badge-warning';
		} else {
			classname = 'badge-primary';
		}
		return (
			<span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
				{row.status}
			</span>
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

	renderInvoiceAmount = (cell, row) => {
		return row.invoiceAmount ? row.invoiceAmount.toFixed(2) : '';
	};

	renderVatAmount = (cell, row) => {
		return row.vatAmount ? row.vatAmount.toFixed(2) : '';
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
						{row.statusEnum !== 'Paid' && (
							<DropdownItem>
								<div
									onClick={() => {
										this.props.history.push(
											'/admin/revenue/customer-invoice/detail',
											{ id: row.id },
										);
									}}
								>
									<i className="fas fa-edit" /> Edit
								</div>
							</DropdownItem>
						)}
						{row.statusEnum !== 'Sent' && row.statusEnum !== 'Paid' && (
							<DropdownItem
								onClick={() => {
									this.postInvoice(row);
								}}
							>
								<i className="fas fa-heart" /> Send
							</DropdownItem>
						)}
						{/* <DropdownItem onClick={() => { this.openInvoicePreviewModal(row.id) }}>
              <i className="fas fa-eye" /> View
            </DropdownItem> */}
						<DropdownItem
							onClick={() =>
								this.props.history.push(
									'/admin/revenue/customer-invoice/view',
									{ id: row.id },
								)
							}
						>
							<i className="fas fa-eye" /> View
						</DropdownItem>
						{row.statusEnum === 'Sent' && (
							<DropdownItem
								onClick={() =>
									this.props.history.push(
										'/admin/revenue/customer-invoice/record-payment',
										{ id: row },
									)
								}
							>
								<i className="fas fa-eye" /> Record Payment
							</DropdownItem>
						)}
						<DropdownItem
							onClick={() => {
								this.closeInvoice(row.id);
							}}
						>
							<i className="fa fa-trash-o" /> Delete
						</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
			</div>
		);
	};

	sendMail = (id) => {
		this.props.customerInvoiceActions
			.sendMail(id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Invoice Send Successfully',
					);
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					'Please First fill The Mail Configuration Detail',
				);
			});
	};

	onRowSelect = (row, isSelected, e) => {
		let tempList = [];
		if (isSelected) {
			tempList = Object.assign([], this.state.selectedRows);
			tempList.push(row.id);
		} else {
			this.state.selectedRows.map((item) => {
				if (item !== row.id) {
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
				tempList.push(item.id);
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
		});
	};

	bulkDelete = () => {
		const { selectedRows } = this.state;
		if (selectedRows.length > 0) {
			this.setState({
				dialog: (
					<ConfirmDeleteModal
						isOpen={true}
						okHandler={this.removeBulk}
						cancelHandler={this.removeDialog}
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
		this.removeDialog();
		let { selectedRows } = this.state;
		const { customer_invoice_list } = this.props;
		let obj = {
			ids: selectedRows,
		};
		this.props.customerInvoiceActions
			.removeBulk(obj)
			.then((res) => {
				if (res.status === 200) {
					this.initializeData();
					this.props.commonActions.tostifyAlert(
						'success',
						'Invoice Deleted Successfully',
					);
					if (customer_invoice_list && customer_invoice_list.length > 0) {
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

	openInvoicePreviewModal = (id) => {
		this.setState(
			{
				selectedId: id,
			},
			() => {
				this.setState({
					openInvoicePreviewModal: true,
				});
			},
		);
	};

	closeInvoice = (id) => {
		this.setState({
			dialog: (
				<ConfirmDeleteModal
					isOpen={true}
					okHandler={() => this.removeInvoice(id)}
					cancelHandler={this.removeDialog}
				/>
			),
		});
	};

	removeInvoice = (id) => {
		this.removeDialog();
		this.props.customerInvoiceActions
			.deleteInvoice(id)
			.then((res) => {
				this.props.commonActions.tostifyAlert(
					'success',
					'Invoice Deleted Successfully',
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

	closeInvoicePreviewModal = (res) => {
		this.setState({ openInvoicePreviewModal: false });
	};

	getCsvData = () => {
		if (this.state.csvData.length === 0) {
			let obj = {
				paginationDisable: true,
			};
			this.props.customerInvoiceActions
				.getCustomerInvoiceList(obj)
				.then((res) => {
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
					customerId: '',
					referenceNumber: '',
					invoiceDate: '',
					invoiceDueDate: '',
					amount: '',
					status: '',
					contactType: 2,
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
			filterData,
			dialog,
			selectedRows,
			csvData,
			view,
		} = this.state;
		const { status_list, customer_list, customer_invoice_list } = this.props;

		const customer_invoice_data =
			this.props.customer_invoice_list && this.props.customer_invoice_list.data
				? this.props.customer_invoice_list.data.map((customer) => ({
						id: customer.id,
						status: customer.status,
						statusEnum: customer.statusEnum,
						customerName: customer.name,
						contactId: customer.contactId,
						invoiceNumber: customer.referenceNumber,
						invoiceDate: customer.invoiceDate
							? moment(customer.invoiceDate).format('DD/MM/YYYY')
							: '',
						invoiceDueDate: customer.invoiceDueDate
							? moment(customer.invoiceDueDate).format('DD/MM/YYYY')
							: '',
						invoiceAmount: customer.totalAmount,
						vatAmount: customer.totalVatAmount,
				  }))
				: '';

		return (
			<div className="customer-invoice-screen">
				<div className="animated fadeIn">
					{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="fas fa-address-book" />
										<span className="ml-2">Customer Invoices</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							{dialog}
							{loading && (
								<Row>
									<Col lg={12} className="rounded-loader">
										<div>
											<Loader />
										</div>
									</Col>
								</Row>
							)}
							<Row>
								<Col lg={12}>
									<div className="mb-4 status-panel p-3">
										<Row>
											<Col lg={3}>
												<h5>Overdue</h5>
												<h3 className="status-title">
													{this.state.overDueAmountDetails.overDueAmount}
												</h3>
											</Col>
											<Col lg={3}>
												<h5>Due Within This Week</h5>
												<h3 className="status-title">
													{this.state.overDueAmountDetails.overDueAmountWeekly}
												</h3>
											</Col>
											<Col lg={3}>
												<h5>Due Within 30 Days</h5>
												<h3 className="status-title">
													{this.state.overDueAmountDetails.overDueAmountMonthly}
												</h3>
											</Col>
											<Col lg={3}>
												<h5>Average Time to Get Paid</h5>
												<h3 className="status-title">0 day</h3>
											</Col>
										</Row>
									</div>
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
													filename={'CustomerInvoice.csv'}
													className="hidden"
													ref={this.csvLink}
													target="_blank"
												/>
											)}
											<Button
												color="primary"
												className="btn-square"
												onClick={() =>
													this.props.history.push(
														`/admin/revenue/customer-invoice/create`,
													)
												}
											>
												<i className="fas fa-plus mr-1" />
												New Invoice
											</Button>
											<Button
												color="warning"
												className="btn-square"
												onClick={this.bulkDelete}
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
												<Select
													className="select-default-width"
													placeholder="Select Customer"
													id="customer"
													name="customer"
													options={
														customer_list
															? selectOptionsFactory.renderOptions(
																	'label',
																	'value',
																	customer_list,
																	'Customer',
															  )
															: []
													}
													value={filterData.customerId}
													onChange={(option) => {
														if (option && option.value) {
															this.handleChange(option, 'customerId');
														} else {
															this.handleChange('', 'customerId');
														}
													}}
												/>
											</Col>
											<Col lg={2} className="mb-1">
												<Input
													type="text"
													placeholder="Reference Number"
													value={filterData.referenceNumber}
													onChange={(e) => {
														this.handleChange(
															e.target.value,
															'referenceNumber',
														);
													}}
												/>
											</Col>
											<Col lg={2} className="mb-1">
												<DatePicker
													className="form-control"
													id="date"
													name="invoiceDate"
													placeholderText="Invoice Date"
													selected={filterData.invoiceDate}
													autoComplete="off"
													showMonthDropdown
													showYearDropdown
													dateFormat="dd/MM/yyyy"
													dropdownMode="select"
													// value={filterData.invoiceDate}
													onChange={(value) => {
														this.handleChange(value, 'invoiceDate');
													}}
												/>
											</Col>
											<Col lg={2} className="mb-1">
												<DatePicker
													className="form-control"
													id="date"
													name="invoiceDueDate"
													placeholderText="Invoice Due Date"
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													dateFormat="dd/MM/yyyy"
													autoComplete="off"
													selected={filterData.invoiceDueDate}
													onChange={(value) => {
														this.handleChange(value, 'invoiceDueDate');
													}}
												/>
											</Col>
											<Col lg={1} className="mb-1">
												<Input
													type="text"
													value={filterData.amount}
													placeholder="Amount"
													onChange={(e) => {
														this.handleChange(e.target.value, 'amount');
													}}
												/>
											</Col>
											<Col lg={2} className="mb-1">
												<Select
													className=""
													options={
														status_list
															? selectOptionsFactory.renderOptions(
																	'label',
																	'value',
																	status_list,
																	'Status',
															  )
															: []
													}
													value={filterData.status}
													onChange={(option) => {
														if (option && option.value) {
															this.handleChange(option, 'status');
														} else {
															this.handleChange('', 'status');
														}
													}}
													placeholder="Status"
												/>
											</Col>
											<Col lg={1} className="pl-0 pr-0">
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
									<div>
										<BootstrapTable
											selectRow={this.selectRowProp}
											search={false}
											options={this.options}
											data={customer_invoice_data ? customer_invoice_data : []}
											version="4"
											hover
											currencyList
											keyField="id"
											remote
											pagination={
												customer_invoice_data &&
												customer_invoice_data.length > 0
													? true
													: false
											}
											fetchInfo={{
												dataTotalSize: customer_invoice_list.count
													? customer_invoice_list.count
													: 0,
											}}
											className="customer-invoice-table"
											csvFileName="Customer_Invoice.csv"
											ref={(node) => {
												this.table = node;
											}}
										>
											<TableHeaderColumn
												width="230"
												dataField="status"
												dataFormat={this.renderInvoiceStatus}
												dataSort
											>
												Status
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="customerName"
												dataSort
												width="15%"
											>
												Customer Name
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="invoiceNumber"
												// dataFormat={this.renderInvoiceNumber}
												dataSort
											>
												Invoice Number
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="invoiceDate"
												dataSort
												width="13%"
											>
												Invoice Date
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="invoiceDueDate"
												dataSort
												width="10%"
											>
												Due Date
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="totalAmount"
												dataSort
												dataFormat={this.renderInvoiceAmount}
												dataAlign="right"
											>
												Invoice Amount
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="totalVatAmount"
												dataSort
												dataFormat={this.renderVatAmount}
												dataAlign="right"
											>
												VAT Amount
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
				{/* <PreviewInvoiceModal
          openInvoicePreviewModal={this.state.openInvoicePreviewModal}
          closeInvoicePreviewModal={(e) => { this.closeInvoicePreviewModal(e) }}
          getInvoiceById={this.props.customerInvoiceActions.getInvoiceById}
          currency_list={this.props.currency_list}
          id={this.state.selectedId}
        /> */}
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInvoice);
