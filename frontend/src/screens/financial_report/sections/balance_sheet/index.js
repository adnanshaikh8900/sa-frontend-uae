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
import { Loader, Currency } from 'components';
import * as FinancialReportActions from '../../actions';
import FilterComponent from '../filterComponent';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
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
				totalCurrentAssets: 24136.36,
				totalFixedAssets: 0,
				totalAssets: 24136.36,
				totalOtherCurrentAssets: 386.36,
				totalBank: 3750,
				totalOtherLiability: 0,
				totalAccountReceivable: 20000,
				totalAccountPayable: 22250,
				totalOtherCurrentLiability: 7750,
				totalLiability: 30000,
				totalEquities: 0,
				totalLiabilityEquities: 30000,
				stocks: 0,
				currentAssets: {},
				otherCurrentAssets: {
					'Input VAT': 386.36,
				},
				bank: {
					'Axis Bank-Afzal Khan': 3750,
				},
				fixedAssets: {},
				otherLiability: {},
				otherCurrentLiability: {
					'Employee Reimbursements': 7750,
				},
				equities: {},
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
		const { profile, universal_currency_list } = this.props;
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
																filename={'balancesheet.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink>
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(csvData, 'balancesheet', 'xls');
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(
																	csvData,
																	'balancesheet',
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
											As on {initValue.endDate}
										</p>
									</div>
									{loading ? (
										<Loader />
									) : (
										<div className="table-wrapper">
											<Table responsive className="table-bordered">
												<thead className="thead-dark table-custom-head">
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
																		{this.state.data['currentAssets'] ? (
																			<Currency
																				value={this.state.data['currentAssets'][
																					`${item}`
																				].toFixed(2)}
																				currencySymbol={
																					universal_currency_list[0]
																						? universal_currency_list[0]
																								.currencyIsoCode
																						: 'USD'
																				}
																			/>
																		) : (
																			0
																		)}
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
																			{this.state.data['bank'] ? (
																				<Currency
																					value={this.state.data['bank'][
																						`${item}`
																					].toFixed(2)}
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				0
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable">
																	Account Receivable
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAccountReceivable'] ? (
																		<Currency
																			value={this.state.data[
																				'totalAccountReceivable'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable">
																	Other Current Assets
																</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['otherCurrentAssets'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		{this.state.data['otherCurrentAssets'] ? (
																			<Currency
																				value={this.state.data[
																					'otherCurrentAssets'
																				][`${item}`].toFixed(2)}
																				currencySymbol={
																					universal_currency_list[0]
																						? universal_currency_list[0]
																								.currencyIsoCode
																						: 'USD'
																				}
																			/>
																		) : (
																			0
																		)}
																	</td>
																</tr>
															))}
															<tr className="mainLable">
																<td className="text-right">
																	Total Current Assets
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalCurrentAssets'] ? (
																		<Currency
																			value={this.state.data[
																				'totalCurrentAssets'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
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
																			{this.state.data['fixedAssets'] ? (
																				<Currency
																					value={this.state.data['fixedAssets'][
																						`${item}`
																					].toFixed(2)}
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				0
																			)}
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
																	{this.state.data['totalFixedAssets'] ? (
																		<Currency
																			value={this.state.data[
																				'totalFixedAssets'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
																</td>
															</tr>
															<br />
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Assets
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAssets'] ? (
																		<Currency
																			value={this.state.data[
																				'totalAssets'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
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
																		{this.state.data['otherLiability'] ? (
																			<Currency
																				value={this.state.data[
																					'otherLiability'
																				][`${item}`].toFixed(2)}
																				currencySymbol={
																					universal_currency_list[0]
																						? universal_currency_list[0]
																								.currencyIsoCode
																						: 'USD'
																				}
																			/>
																		) : (
																			0
																		)}
																	</td>
																</tr>
															))}
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Other Liability
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalOtherLiability'] ? (
																		<Currency
																			value={this.state.data[
																				'totalOtherLiability'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
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
																		{this.state.data[
																			'otherCurrentLiability'
																		] ? (
																			<Currency
																				value={this.state.data[
																					'otherCurrentLiability'
																				][`${item}`].toFixed(2)}
																				currencySymbol={
																					universal_currency_list[0]
																						? universal_currency_list[0]
																								.currencyIsoCode
																						: 'USD'
																				}
																			/>
																		) : (
																			0
																		)}
																	</td>
																</tr>
															))}
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Other Current Liability
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data[
																		'totalOtherCurrentLiability'
																	] ? (
																		<Currency
																			value={this.state.data[
																				'totalOtherCurrentLiability'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
																</td>
															</tr>
															<br />
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Liability
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalLiability'] ? (
																		<Currency
																			value={this.state.data[
																				'totalLiability'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
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
																			{this.state.data['equities'] ? (
																				<Currency
																					value={this.state.data['equities'][
																						`${item}`
																					].toFixed(2)}
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				0
																			)}
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
																	{this.state.data['totalEquities'] ? (
																		<Currency
																			value={this.state.data[
																				'totalEquities'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
																</td>
															</tr>
															<tr className="">
																<td className="mainLable">Accounts Payable</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAccountPayable'] ? (
																		<Currency
																			value={this.state.data[
																				'totalAccountPayable'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
																</td>
															</tr>
															<tr className="">
																<td className="mainLable">Stocks</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['stocks'] ? (
																		<Currency
																			value={this.state.data['stocks'].toFixed(
																				2,
																			)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable text-right">
																	Total Liability & Equities
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalLiabilityEquities'] ? (
																		<Currency
																			value={this.state.data[
																				'totalLiabilityEquities'
																			].toFixed(2)}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		0
																	)}
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
