import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	Table,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import { DateRangePicker2 } from 'components';
import moment from 'moment';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { Loader } from 'components';
import * as FinancialReportActions from '../../actions';
import FilterComponent from '../filterComponent';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		financialReportActions: bindActionCreators(
			FinancialReportActions,
			dispatch,
		),
	};
};

class CashFlowStatement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dropdownOpen: false,
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD/MM/YYYY'),
				endDate: moment().endOf('month').format('DD/MM/YYYY'),
				reportBasis: 'ACCRUAL',
				chartOfAccountId: '',
			},
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			data: {
				totalOperatingIncome: 0.0,
				totalCostOfGoodsSold: 0.0,
				grossProfit: 0.0,
				totalOperatingExpense: 0.0,
				operatingProfit: 0.0,
				totalNonOperatingIncome: 0.0,
				totalNonOperatingExpense: 0.0,
				nonOperatingIncomeExpense: 0.0,
				netProfitLoss: 0.0,
				transactionCategoryMapper: {},
				expense: {},
				income: {},
				equities: {},
				liabilities: {},
				assets: {},
			},
		};
		this.columnHeader = [
			{ label: 'Account', value: 'Account', sort: true },
			{ label: 'Account Code', value: 'Account Code', sort: false },
			{ label: 'Net Debit', value: 'Net Debit', sort: false },
			{ label: 'Net Cebit', value: 'Net Cebit', sort: false },
		];
	}

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					startDate: moment(value.startDate).format('DD/MM/YYYY'),
					endDate: moment(value.endDate).format('DD/MM/YYYY'),
				},
				loading: true,
				view: !this.state.view,
			},
			() => {
				this.initializeData();
			},
		);
	};

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
		// this.props.financialReportActions
		// 	.getProfitAndLossReport(postData)
		// 	.then((res) => {
		// 		if (res.status === 200) {
		// 			this.setState({
		// 				data: res.data,
		// 				loading: false,
		// 			});
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		this.setState({ loading: false });
		// 	});
		this.props.financialReportActions
			.getTrialBalanceReport(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						data: res.data,
						loading: false,
					});
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	exportFile = (csvData, fileName, type) => {
		const fileType =
			type === 'xls'
				? 'application/vnd.ms-excel'
				: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = `.${type}`;
		const ws = XLSX.utils.json_to_sheet(csvData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: type, type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	toggle = () =>
		this.setState((prevState) => {
			return { dropdownOpen: !prevState.dropdownOpen };
		});

	viewFilter = () =>
		this.setState((prevState) => {
			return { view: !prevState.view };
		});

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};

	render() {
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile } = this.props;
		console.log(this.state.data['expense']);
		console.log(
			this.state.data['transactionCategoryMapper']['Accommodation and Meals'],
		);
		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
					<Card>
						<div>
							<CardHeader>
								<Row>
									<Col lg={12}>
										<div
											className="h4 mb-0 d-flex align-items-center"
											style={{ justifyContent: 'space-between' }}
										>
											<div>
												<p
													className="mb-0"
													style={{
														cursor: 'pointer',
														fontSize: '1rem',
														paddingLeft: '15px',
													}}
													onClick={this.viewFilter}
												>
													<i className="fa fa-cog mr-2"></i>Customize Report
												</p>
											</div>
											<div className="d-flex">
												<div
													className="mr-2 print-btn-cont"
													onClick={() => window.print()}
												>
													<i className="fa fa-print"></i>
												</div>
												<Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
													<DropdownToggle caret>Export As</DropdownToggle>
													<DropdownMenu>
														<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
														<DropdownItem>
															<CSVLink
																data={csvData}
																className="csv-btn"
																filename={'detailGeneralLedger.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink>
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(
																	csvData,
																	'detailGeneralLedger',
																	'xls',
																);
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(
																	csvData,
																	'detailGeneralLedger',
																	'xlsx',
																);
															}}
														>
															XLSX (Microsoft Excel)
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</div>
										</div>
									</Col>
								</Row>
							</CardHeader>
							<div className={`panel ${view ? 'view-panel' : ''}`}>
								<FilterComponent
									viewFilter={this.viewFilter}
									generateReport={(value) => {
										this.generateReport(value);
									}}
								/>{' '}
							</div>
							<CardBody id="section-to-print">
								<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A3"
								>
									<div style={{ textAlign: 'center', margin: '3rem 0' }}>
										<p>
											{profile &&
											profile.company &&
											profile.company['companyName']
												? profile.company['companyName']
												: ''}
											<br style={{ marginBottom: '5px' }} />
											Detailed General Ledger
											<br style={{ marginBottom: '5px' }} />
											From {initValue.startDate} To {initValue.endDate}
										</p>
									</div>
									{loading ? (
										<Loader />
									) : (
										<div className="table-wrapper">
											<Table responsive className="table-bordered">
												<thead className="thead-dark">
													<tr className="header-row">
														{this.columnHeader.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' }}
																	className={column.align ? 'text-right' : ''}
																>
																	{column.label}
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{Object.keys(this.state.data).length > 0 ? (
														<>
															<tr>
																<td className="mainLable">Assets</td>
																<td></td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['assets']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit'
																				? this.state.data['assets'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																		<td className="pt-0 pb-0">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit'
																				? this.state.data['assets'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable">Liabilities</td>
																<td></td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['liabilities']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit'
																				? this.state.data['liabilities'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																		<td>
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit'
																				? this.state.data['liabilities'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable">Equities</td>
																<td></td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['equities']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit'
																				? this.state.data['equities'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																		<td>
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit'
																				? this.state.data['equities'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable">Income</td>
																<td></td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['income']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit'
																				? this.state.data['income'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																		<td>
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit'
																				? this.state.data['income'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable">Expense</td>
																<td></td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['expense']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit'
																				? this.state.data['expense'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																		<td>
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit'
																				? this.state.data['expense'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
														</>
													) : (
														<tr className="mainLable">
															<td style={{ textAlign: 'center' }} colSpan="9">
																There is no data to display
															</td>
														</tr>
													)}
												</tbody>
											</Table>
										</div>
									)}
								</PDFExport>
							</CardBody>
						</div>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CashFlowStatement);
