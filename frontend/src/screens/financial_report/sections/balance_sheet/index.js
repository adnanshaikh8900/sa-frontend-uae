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

class BalanceSheet extends React.Component {
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
				totalCurrentAssets: 3300.0,
				totalFixedAssets: 2300.0,
				totalAssets: 27700.0,
				totalOtherCurrentAssets: 2300.0,
				totalBank: 19800.0,
				totalOtherLiability: null,
				totalAccountReceivable: null,
				totalAccountPayable: null,
				totalOtherCurrentLiability: 2000.0,
				totalLiability: 4300.0,
				totalEquities: 1600.0,
				totalLiabilityEquities: 5900.0,
				currentAssets: {
					'Trade Debtors': 1100.0,
					Inventory: 1100.0,
					'Unpaid Shares': 1100.0,
				},
				otherCurrentAssets: {
					'Employee Advance': 1200.0,
					'Advance Tax': 1100.0,
					'Input VAT': 0.0,
				},
				bank: {
					'SBI-Adil khan': 13600.0,
					'SBI-Imran khan': 6200.0,
				},
				fixedAssets: {
					'Capital Asset Depreciation Brought Forward': 1200.0,
					'Capital Asset Brought Forward': 1100.0,
				},
				otherLiability: {},
				otherCurrentLiability: {
					'Employee Reimbursements': 2000.0,
				},
				equities: {
					'Owners Current Account': 1000.0,
					'Retained Earnings': 600.0,
				},
				accountReceivable: {},
				accountPayable: {
					'Accounts Payable': 2300.0,
				},
			},
		};
		this.columnHeader = [
			{ label: 'Account', value: 'Account', sort: true },
			{ label: 'Account Code', value: 'Account Code', sort: false },
			{ label: 'Total', value: 'Total', sort: false },
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
		this.props.financialReportActions
			.getBalanceReport(postData)
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
											Balance Sheet
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
															</tr>
															<tr>
																<td className="mainLable">Current Assets</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['currentAssets'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		{this.state.data['currentAssets']
																			? this.state.data['currentAssets'][
																					`${item}`
																			  ].toFixed(2)
																			: ''}
																	</td>
																</tr>
															))}
															<tr>
																<td className="mainLable">Bank</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['bank']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data['bank']
																				? this.state.data['bank'][
																						`${item}`
																				  ].toFixed(2)
																				: ' '}
																		</td>
																	</tr>
																),
															)}
															<tr className="mainLable">
																<td className="text-right">
																	Total Current Assets
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalCurrentAssets']
																		? this.state.data[
																				'totalCurrentAssets'
																		  ].toFixed(2)
																		: ''}
																</td>
															</tr>
															<br />
															<tr>
																<td className="mainLable">Fixed Assets</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['fixedAssets']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data['fixedAssets']
																				? this.state.data['fixedAssets'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
															<tr className="mainLable">
																<td className="text-right">
																	Total Fixed Assets
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalFixedAssets']
																		? this.state.data[
																				'totalFixedAssets'
																		  ].toFixed(2)
																		: ''}
																</td>
															</tr>
															<br />
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Assets
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAssets']
																		? this.state.data['totalAssets'].toFixed(2)
																		: ''}
																</td>
															</tr>
															<br />
															<tr>
																<td className="mainLable">
																	Liabilities & Equities
																</td>
																<td></td>
																<td></td>
															</tr>
															<tr>
																<td className="mainLable">Other Liability</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['otherLiability'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		{this.state.data['otherLiability']
																			? this.state.data['otherLiability'][
																					`${item}`
																			  ].toFixed(2)
																			: ''}
																	</td>
																</tr>
															))}
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Other Liability
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalOtherLiability']
																		? this.state.data[
																				'totalOtherLiability'
																		  ].toFixed(2)
																		: ''}
																</td>
															</tr>
															<br />
															<tr>
																<td className="mainLable">
																	Other Current Liability
																</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['otherCurrentLiability'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		{this.state.data['otherCurrentLiability']
																			? this.state.data[
																					'otherCurrentLiability'
																			  ][`${item}`].toFixed(2)
																			: ''}
																	</td>
																</tr>
															))}
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Other Current Liability
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalOtherCurrentLiability']
																		? this.state.data[
																				'totalOtherCurrentLiability'
																		  ].toFixed(2)
																		: ''}
																</td>
															</tr>
															<br />
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Liability
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalLiability']
																		? this.state.data['totalLiability'].toFixed(
																				2,
																		  )
																		: ''}
																</td>
															</tr>
															<br />
															<tr>
																<td className="mainLable">Equities</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['equities']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0"></td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data['equities']
																				? this.state.data['equities'][
																						`${item}`
																				  ].toFixed(2)
																				: ''}
																		</td>
																	</tr>
																),
															)}
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Equity
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalEquities']
																		? this.state.data['totalEquities'].toFixed(
																				2,
																		  )
																		: ''}
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Liability Equities
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalLiabilityEquities']
																		? this.state.data[
																				'totalLiabilityEquities'
																		  ].toFixed(2)
																		: ''}
																</td>
															</tr>
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

export default connect(mapStateToProps, mapDispatchToProps)(BalanceSheet);
