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
// import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';

import EmailModal from '../customer_invoice/sections/email_template';

import { Loader, ConfirmDeleteModal, Currency } from 'components';

import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-datepicker/dist/react-datepicker.css';


import * as QuotationAction from './actions';
import * as CustomerInvoiceActions from './../customer_invoice/actions'
import { CommonActions } from 'services/global';
import { selectOptionsFactory } from 'utils';

import './style.scss';
import {data}  from '../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		customer_list: state.customer_invoice.customer_list,
		status_list: state.supplier_invoice.status_list,
		universal_currency_list: state.common.universal_currency_list,
		quotation_list: state.quotation.quotation_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		quotationAction: bindActionCreators(
			QuotationAction,
			dispatch,
		),
		customerInvoiceActions: bindActionCreators(CustomerInvoiceActions, dispatch),
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

const invoiceimage = require('assets/images/invoice/invoice.png');
const overWeekly = require('assets/images/invoice/week1.png');
const overduemonthly = require('assets/images/invoice/month.png');
const overdue = require('assets/images/invoice/due1.png');

let strings = new LocalizedStrings(data);
class Quatation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dialog: false,
			openEmailModal: false,
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
			contactType: 1,
			openInvoicePreviewModal: false,
			selectedId: '',
			csvData: [],
			view: false,
			overDueAmountDetails: {
				overDueAmount: '',
				overDueAmountWeekly: '',
				overDueAmountMonthly: '',
			},
			language: window['localStorage'].getItem('language'),
		};

		this.options = {
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
		let { filterData } = this.state;
		this.props.quotationAction.getStatusList();
		this.props.customerInvoiceActions.getCustomerList(filterData.contactType);
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
		this.props.quotationAction
			.getQuotationList(postData)
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
				this.setState({ loading: false });
			});
	};
	componentWillUnmount = () => {
		this.setState({
			selectedRows: [],
		});
	};



	renderRFQStatus = (cell, row) => {
		let classname = '';
		if (row.status === 'Draft') {
			classname = 'label-draft';
		} else if (row.status === 'Closed') {
			classname = 'label-closed';
		} else if (row.status === 'Sent') {
			classname = 'label-sent';
		}else {
			classname = 'label-overdue';
		}
		return (
			<span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
				{row.status}
			</span>
		);
	};

	sortColumn = (sortName, sortOrder) => {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		this.initializeData();
	};

	renderrfqAmount = (cell, row, extraData) => {
		return(
			<div>
								<div>
						<label className="font-weight-bold mr-2 ">{strings.QuotationAmount}: </label>
						<label>
							{row.totalAmount  === 0 ? row.currencyIsoCode +" "+ row.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) :  row.currencyIsoCode +" "+ row.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
						</label>
					</div>
				
					<div style={{display: row.totalVatAmount === 0 ? 'none' : ''}}>
					<label className="font-weight-bold mr-2">{strings.VatAmount}: </label>
					<label>{row.totalVatAmount === 0  ?  row.currencyIsoCode +" "+ row.totalVatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) :   row.currencyIsoCode +" "+ row.totalVatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</label>
				
					</div>
					
					
			</div>);
		};

	renderDueAmount =(cell,row,extraData) => {
		return row.dueAmount === 0  ? row.currencyIsoCode+" "+row.dueAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : row.currencyIsoCode+" "+row.dueAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	}

	renderVatAmount = (cell, row, extraData) => {
		return row.vatAmount === 0 ? row.currencyIsoCode+" "+row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : row.currencyIsoCode+" "+row.vatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
	};
	renderCurrency = (cell, row) => {
		if (row.currencyName) {
			return (
				<label className="badge label-currency mb-0">{row.currencyName}</label>
			);
		} else {
			return <label className="badge badge-danger mb-0">No Specified</label>;
		}
	};
	sendCustomEmail = (id) => {
		this.setState({ openEmailModal: true });
	};

	closeEmailModal = (res) => {
		this.setState({ openEmailModal: false });
	};

	rfqDueDate = (cell, row) => {
		return row.poReceiveDate ? row.poReceiveDate : '';
	};
	pODate = (cell, row) => {
		return row.quotaionExpiration ? row.quotaionExpiration : '';
	};
	quotationCreatedDate= (cell, row) => {
		return row.quotationCreatedDate ? row.quotationCreatedDate : '';
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
					{row.status !== 'Closed' && row.status !== "Sent" && (
							<DropdownItem
								onClick={() =>
									this.props.history.push(
										'/admin/income/quotation/detail',
										{ id: row.id },
									)
								}
							>
								<i className="fas fa-edit" />  {strings.Edit} </DropdownItem>
					)}
							{row.status !== 'Closed' && row.status !== "Sent" && (
							<DropdownItem
								onClick={() => {
									this.sendMail(row.id);
								}}
							>
								<i className="fas fa-send" />  {strings.Send}
							</DropdownItem>)}
							{row.status === 'Sent' && (
							<DropdownItem
							onClick={() => {
							this.changeStatus(row.id);
							}}
							>
								<i className="far fa-times-circle" />  {strings.Close}
							</DropdownItem>
							)}
						<DropdownItem
							onClick={() =>
								this.props.history.push(
									'/admin/income/quotation/view',
									{ id: row.id },
								)
							}
						>
							<i className="fas fa-eye" />  {strings.View}
						</DropdownItem>
						{/* {row.status === 'Sent' && (
							<DropdownItem
							onClick={() => {
								this.changeStatus(row.id);
							}}
							>
								<i className="fas fa-send" /> Approve & Create GRN
							</DropdownItem>
							)} */}
				
						{/* {row.statusEnum !== 'Paid' && row.statusEnum !== 'Sent' && (
							<DropdownItem
								onClick={() => {
									this.closeInvoice(row.id, row.status);
								}}
							>
								<i className="fa fa-trash-o" /> Delete
							</DropdownItem>
						)} */}
						{/* {row.statusEnum !== 'Paid' && row.statusEnum !== 'Sent' && (
							<DropdownItem
								onClick={() => {
									this.sendCustomEmail(row.id);
								}}
							>
								<i className="fa fa-send" /> Send Custom Email
							</DropdownItem>
						)} */}
					</DropdownMenu>
				</ButtonDropdown>
			</div>
		);
	};
	changeStatus = (id) => {
		this.props.quotationAction
		.changeStatus(id)
		.then((res) => {
			if (res.status === 200) {
				this.props.commonActions.tostifyAlert(
					'success',
					'Quotation Closed Successfully',
				);


				this.setState({
					loading: false,
				});
			}
			this.initializeData();
		})

.catch((err) => {
	this.props.commonActions.tostifyAlert(
		'error',
	);
});

}

	sendMail = (id,status) => {
		this.props.quotationAction
			.sendMail(id)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Quotation Send Successfully',
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
					'Something When Wrong',
				);
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
		const message1 = (
			<text>
				<b>Delete Supplier Invoice?</b>
			</text>
		);
		const message =
			'This Supplier Invoice will be deleted permanently and cannot be recovered. ';
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
		this.removeDialog();
		let { selectedRows, filterData } = this.state;
		const { supplier_invoice_list } = this.props;
		let obj = {
			ids: selectedRows,
		};
		this.props.purchaseOrderAction
			.removeBulk(obj)
			.then((res) => {
				this.initializeData(filterData);
				this.props.commonActions.tostifyAlert(
					'success',
					'Supplier Invoice Deleted Successfully',
				);
				if (supplier_invoice_list && supplier_invoice_list.length > 0) {
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

	postInvoice = (row) => {
		this.setState({
			loading: true,
		});
		const postingRequestModel = {
			amount: row.invoiceAmount,
			postingRefId: row.id,
			postingRefType: 'INVOICE',
		};
		this.props.purchaseOrderAction
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
					this.getOverdue();
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

	unPostInvoice = (row) => {
		this.setState({
			loading: true,
		});
		const postingRequestModel = {
			amount: row.invoiceAmount,
			postingRefId: row.id,
			postingRefType: 'INVOICE',
		};
		this.props.purchaseOrderAction
			.unPostInvoice(postingRequestModel)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Invoice Moved To Draft Successfully',
					);
					this.setState({
						loading: false,
					});
					this.getOverdue();
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

	closeInvoicePreviewModal = (res) => {
		this.setState({ openInvoicePreviewModal: false });
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

	closeInvoice = (id, status) => {
		if (status === 'Paid') {
			this.props.commonActions.tostifyAlert(
				'error',
				'Please delete the receipt first to delete the invoice',
			);
		} else {
			const message1 = (
				<text>
					<b>Delete Supplier Invoice?</b>
				</text>
			);
			const message =
				'This Supplier Invoice will be deleted permanently and cannot be recovered. ';
			this.setState({
				dialog: (
					<ConfirmDeleteModal
						isOpen={true}
						okHandler={() => this.removeInvoice(id)}
						cancelHandler={this.removeDialog}
						message={message}
						message1={message1}
					/>
				),
			});
		}
	};

	removeInvoice = (id) => {
		this.removeDialog();
		this.props.purchaseOrderAction
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

	getCsvData = () => {
		if (this.state.csvData.length === 0) {
			let obj = {
				paginationDisable: true,
			};
			this.props.purchaseOrderAction
				.getSupplierInvoiceList(obj)
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
					statusEnum: '',
					contactType: 2,
					contactId: '',
				},
			},
			() => {
				this.initializeData();
			},
		);
	};

	render() {
		strings.setLanguage(this.state.language);
		const {
			loading,
			filterData,
			dialog,
			selectedRows,
			csvData,
			view,
		} = this.state;
		const {
			status_list,
			customer_list,
			quotation_list,
			universal_currency_list,
		} = this.props;
		// const containerStyle = {
		//   zIndex: 1999
		// }

		const quotation_data =
		quotation_list && quotation_list.data
				? this.props.quotation_list.data.data.map((quotation) => ({
						id: quotation.id,
						status: quotation.status,
						customerName: quotation.customerName,
						quatationNumber: quotation.quatationNumber,
						quotaionExpiration: quotation.quotaionExpiration ? quotation.quotaionExpiration : '',
						quotationCreatedDate:quotation.quotationCreatedDate ? quotation.quotationCreatedDate : '',
						totalAmount: quotation.totalAmount,
						totalVatAmount: quotation.totalVatAmount,
						currencyIsoCode: quotation.currencyIsoCode,
				  }))
				: '';

				let tmpCustomer_list = []

				customer_list.map(item => {
					let obj = { label: item.label.contactName, value: item.value }
					tmpCustomer_list.push(obj)
				})
		
		return (
			<div className="supplier-invoice-screen">
				<div className="animated fadeIn">
					{/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<img
											alt="invoiceimage"
											src={invoiceimage}
											style={{ width: '40px' }}
										/>
										<span className="ml-2">{strings.Quotation}
										</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							{dialog}
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
													filename={'SupplierInvoice.csv'}
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
									<div className="py-3">
										<h5>{strings.Filter} : </h5>
										<Row>
										<Col lg={2} className="mb-1">
												<Select
													className="select-default-width"
													placeholder={strings.Select+strings.Customer}
													id="customer"
													name="customer"
													options={
														tmpCustomer_list
															? selectOptionsFactory.renderOptions(
																'label',
																'value',
																tmpCustomer_list,
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
											{/* <Col lg={2} className="mb-1">
												<DatePicker
													className="form-control"
													id="date"
													name="invoiceDate"
													placeholderText="Invoice Date"
													showMonthDropdown
													showYearDropdown
													autoComplete="off"
													dropdownMode="select"
													dateFormat="dd/MM/yyyy"
													selected={filterData.invoiceDate}
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
													autoComplete="off"
													dropdownMode="select"
													dateFormat="dd/MM/yyyy"
													selected={filterData.invoiceDueDate}
													onChange={(value) => {
														this.handleChange(value, 'invoiceDueDate');
													}}
												/>
											</Col> */}
										
											{/* <Col lg={2} className="mb-1">
												<Select
													styles={customStyles}
													className=""
													// options={status_list ? status_list.map((item) => {
													//   return { label: item, value: item }
													// }) : ''}
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
											</Col> */}
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
									<Row>
									<div style={{width:"1650px"}}>
									<Button
										color="primary"
										style={{ marginBottom: '10px' }}
										className="btn-square pull-right"
										onClick={() =>
											this.props.history.push(
												`/admin/income/quotation/create`,
											)
										}
									>
										<i className="fas fa-plus mr-1" />
										{strings.AddNewRequest}
									</Button>
									</div>
									</Row> 
								
										<BootstrapTable
											selectRow={this.selectRowProp}
											search={false}
											options={this.options}
											data={quotation_data ? quotation_data : []}
											version="4"
											hover
											keyField="id"
											pagination={
											true
											}
											remote

											fetchInfo={{
												dataTotalSize: quotation_list && quotation_list && quotation_list.data && quotation_list.data.count
													? quotation_list.data.count
													: 0,
											}}
											className="customer-invoice-table"
											ref={(node) => (this.table = node)}
										>
											<TableHeaderColumn
												dataField="quatationNumber"
												
												dataSort
											//	width="10%"
												className="table-header-bg"
											>
												{strings.QUOTATIONNUMBER}
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="customerName"
												dataSort
											//	width="12%"
												className="table-header-bg"
											>
												{strings.CUSTOMERNAME}
											</TableHeaderColumn>
											<TableHeaderColumn
											//	width="10%"
												dataField="status"
												dataFormat={this.renderRFQStatus}
												dataSort
												className="table-header-bg"
											>
												{strings.STATUS}
											</TableHeaderColumn>
											{/* <TableHeaderColumn
												dataField="quotationCreatedDate"
												dataSort
											//	width="12%"
												className="table-header-bg"
											>
												Created Date
											</TableHeaderColumn> */}
											<TableHeaderColumn
												dataField="quotationCreatedDate"
												dataSort
											//	width="7%"
											 dataFormat={this.quotationCreatedDate}
												className="table-header-bg"
											>
											Created Date
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="poApproveDate"
												dataSort
											//	width="7%"
												dataFormat={this.pODate}
												className="table-header-bg"
											>
												{strings.EXPIRATIONDATE}
											</TableHeaderColumn>
										
											
											<TableHeaderColumn
												dataAlign="right"
												dataField="totalAmount"
												dataSort
												width="30%"
												dataFormat={this.renderrfqAmount}
												className="table-header-bg"
												formatExtraData={universal_currency_list}
											>
											   {strings.AMOUNT}
											</TableHeaderColumn>
										
											<TableHeaderColumn
												className="text-right"
												columnClassName="text-right"
												//width="5%"
												dataFormat={this.renderActions}
												className="table-header-bg"
											></TableHeaderColumn>
										</BootstrapTable>
								
								</Col>
							</Row>
						</CardBody>
					</Card>
				</div>
				{/* <PreviewInvoiceModal
          openInvoicePreviewModal={this.state.openInvoicePreviewModal}
          closeInvoicePreviewModal={(e) => { this.closeInvoicePreviewModal(e) }}
          getInvoiceById={this.props.supplierInvoiceActions.getInvoiceById}
          id={this.state.selectedId}
          currency_list={this.props.currency_list}
          history={this.props.history}
        /> */}
				<EmailModal
					openEmailModal={this.state.openEmailModal}
					closeEmailModal={(e) => {
						this.closeEmailModal(e);
					}}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Quatation);
