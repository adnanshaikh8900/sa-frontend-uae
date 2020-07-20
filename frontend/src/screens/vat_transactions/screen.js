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
	FormGroup,
	Form,
	ButtonGroup,
	Input,
} from 'reactstrap';

import Select from 'react-select';
import { DateRangePicker2 } from 'components';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as VatTransactionActions from './actions';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';

const mapStateToProps = (state) => {
	console.log(state);
	return {
		vat_transaction_list: state.vat_transactions.vat_transaction_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		vatTransactionActions: bindActionCreators(VatTransactionActions, dispatch),
	};
};

const vatOptions = [
	{ value: 'input', label: 'Input' },
	{ value: 'output', label: 'Output' },
	{ value: 'all', label: 'All' },
];

const tempdata = [
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 2,
		transactionCategoryCode: 2,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 1,
		transactionCategoryCode: 4,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 1,
		transactionCategoryCode: 4,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 1,
		transactionCategoryCode: 4,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 1,
		transactionCategoryCode: 4,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 1,
		transactionCategoryCode: 4,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
	{
		transactionDate: '10/15/2019',
		transactionCategoryId: 1,
		transactionCategoryCode: 4,
		transactionCategoryName: 'temp',
		transactionCategoryDescription: 'temp',
		parentTransactionCategory: 'Loream Ipsume',
		transactionType: 'TEMP',
	},
];

const ranges = {
	'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	'This Week': [moment().startOf('week'), moment().endOf('week')],
	'This Month': [moment().startOf('month'), moment().endOf('month')],
	'Last Month': [
		moment().subtract(1, 'month').startOf('month'),
		moment().subtract(1, 'month').endOf('month'),
	],
};

class VatTransactions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedVat: '',
			selectedStatus: '',
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
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
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
		this.props.vatTransactionActions
			.vatTransactionList(postData)
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

	changeVat = (selectedVat) => {
		this.setState({ selectedVat });
	};

	changeStatus = (selectedStatus) => {
		this.setState({ selectedStatus });
	};

	getAction = (cell, row) => {
		return <button className="btn">Detail</button>;
	};

	render() {
		const vat_transaction_data =
			this.props.vat_transaction_list && this.props.vat_transaction_list.data
				? this.props.vat_transaction_list.data.map((data) => ({
						id: data.id,
						amount: data.amount,
						date: data.date ? moment(data.date).format('DD/MM/YYYY') : '',
						referenceType: data.referenceType,
						vatAmount: data.vatAmount,
						vatType: data.vatType,
				  }))
				: '';
		return (
			<div className="vat-transactions-screen ">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="fas fa-exchange-alt" />
										<span className="ml-2">VAT Transactions</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							<Form onSubmit={this.handleSubmit} name="simpleForm">
								<div className="flex-wrap d-flex justify-content-end">
									<FormGroup>
										<ButtonGroup className="mr-3">
											<Button
												color="success"
												className="btn-square"
												onClick={() => this.table.handleExportCSV()}
											>
												<i className="fa glyphicon glyphicon-export fa-download mr-1" />
												Export to CSV
											</Button>
										</ButtonGroup>
									</FormGroup>
									<FormGroup>
										<div className="date-range">
											<DateRangePicker2 ranges={ranges} opens={'left'} />
										</div>
									</FormGroup>
								</div>
							</Form>
							<div className="py-3">
								<h5>Filter : </h5>
								<Row>
									<Col lg={2} className="mb-1">
										<Input type="text" placeholder="Party Name" />
									</Col>
									<Col lg={2} className="mb-1">
										<Select
											className=""
											options={vatOptions}
											value={this.state.selectedType}
											placeholder="Vat Type"
											onChange={this.changeType}
										/>
									</Col>
									<Col lg={2} className="mb-1">
										<Select
											className=""
											options={vatOptions}
											value={this.state.selectedType}
											placeholder="Source"
											onChange={this.changeType}
										/>
									</Col>
									<Col lg={2} className="mb-1">
										<Select
											className=""
											options={vatOptions}
											value={this.state.selectedType}
											placeholder="Status"
											onChange={this.changeType}
										/>
									</Col>
									<Col lg={1} className="mb-1">
										<Button
											type="button"
											color="primary"
											className="btn-square"
											onClick={this.handleSearch}
										>
											<i className="fa fa-search"></i>
										</Button>
									</Col>
								</Row>
							</div>
							<div className="table-wrapper">
								<BootstrapTable
									data={vat_transaction_data ? vat_transaction_data : []}
									hover
									remote
									keyField="id"
									pagination={
										vat_transaction_data && vat_transaction_data.length > 0
											? true
											: false
									}
									fetchInfo={{
										dataTotalSize: vat_transaction_data.count
											? vat_transaction_data.count
											: 0,
									}}
									csvFileName="VatTransactionReport.csv"
									ref={(node) => {
										this.table = node;
									}}
								>
									<TableHeaderColumn dataField="date">Date</TableHeaderColumn>
									<TableHeaderColumn dataField="referenceType">
										Reference Type
									</TableHeaderColumn>
									<TableHeaderColumn dataField="vatType">
										Vat Type
									</TableHeaderColumn>
									<TableHeaderColumn isKey dataField="amount">
										Amount
									</TableHeaderColumn>
									<TableHeaderColumn dataField="vatAmount">
										Vat Amount
									</TableHeaderColumn>
								</BootstrapTable>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VatTransactions);
