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

import moment from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { Loader, Currency } from 'components';
import * as FinancialReportActions from '../../actions';
import FilterComponent from '../filterComponent';
import FilterComponent2 from '../filterComponet2';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.scss';
import logo from 'assets/images/brand/logo.png';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.reports.company_profile,
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
let strings = new LocalizedStrings(data);
let strings1 = new LocalizedStrings(data);
if(localStorage.getItem('language')==null)
{
	strings1.setLanguage('en');
}
else{
strings1.setLanguage(localStorage.getItem('language'));
}

class ProfitAndLossReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
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
				nonOperatingIncome: {},

				nonOperatingIncomeExpense: 0.0,
				netProfitLoss: 0.0,
				operatingIncome: {},

				costOfGoodsSold: {},
				operatingExpense: {},
				nonOperatingExpense: {},
			},
		};
		this.columnHeader = [
			{ label: strings1.Account, value: 'Account', sort: true },
			{ label: '', value: 'Account Code', sort: false },
			{ label: strings1.Total, value: 'Total', sort: true },
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
		this.props.financialReportActions.getCompany() 
		this.initializeData();
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
		this.props.financialReportActions
			.getProfitAndLossReport(postData)
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

	
	exportFile = () => {

		// let exportData
	 
		// 	 let singleResultArray=this.state && this.state.data 
	 
		// 	 ?
	 
		// 	 Object.entries(this.state.data)     :[];
	    //  const { Parser, transforms: { unwind, flatten } } = require('json2csv');
		//  const json2csvParser = new Parser({ transforms: [unwind({ blankOut: true }), flatten('__')] });
		//   exportData = json2csvParser.parse(singleResultArray);
	 
	 
		//    return (exportData);
		let dl =""
		let fn =""
		let type="csv"
		var elt = document.getElementById('tbl_exporttable_to_xls');												
		var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		return dl ?
		  XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
		  XLSX.writeFile(wb, fn || ('Profit & Loss Report.'+ (type || 'csv')));
	}
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
		strings.setLanguage(this.state.language);
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list,company_profile } = this.props;
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
													<i className="fa fa-cog mr-2"></i>{strings.CustomizeReport}
												</p>
											</div>
											<div className="d-flex">
												<Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
													<DropdownToggle caret>Export As</DropdownToggle>
													<DropdownMenu>
													
														<DropdownItem>
															{/* <CSVLink
																data={this.exportFile()}
																className="csv-btn"
																filename={'Profit & Loss Report.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink> */}
															<span
															style={{
																border: 0,
    															padding: 0,
																backgroundColor:"white !important"
															}}
														     onClick={()=>{this.exportFile()}}
															>CSV (Comma Separated Value)</span>
														</DropdownItem>
															<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
														{/* <DropdownItem
															onClick={() => {
																this.exportFile(csvData, 'profitloss', 'xls');
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(csvData, 'profitloss', 'xlsx');
															}}
														>
															XLSX (Microsoft Excel)
														</DropdownItem> */}
													</DropdownMenu>
												</Dropdown>
													&nbsp;&nbsp;
												<div
													className="mr-2 print-btn-cont"
													onClick={() => window.print()}
													style={{
														cursor: 'pointer',
														}}
												>
													<i className="fa fa-print"></i>
												</div>
												{/* <div
												className="mr-2 print-btn-cont"
												onClick={() => {
													this.exportPDFWithComponent();
												}}
												style={{
													cursor: 'pointer',
													}}
												>
												<i className="fa fa-file-pdf-o"></i>
											</div> */}
												<div
													className="mr-2 print-btn-cont"
                                                    onClick={() => {
                                                        this.props.history.push('/admin/report/reports-page');
                                                    }}
													style={{
														cursor: 'pointer',
														}}
												>
												<span>X</span>
												</div>
												
											</div>
										</div>
									</Col>
								</Row>
							</CardHeader>
							<div className={`panel ${view ? 'view-panel' : ''}`}>
								<FilterComponent2
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
									fileName="Profit & Loss.pdf"
								>
							<div style={{	
									
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: '1rem'}}>
									<div>
									<img
										src={ 
											company_profile &&
											company_profile.companyLogoByteArray
												? 'data:image/jpg;base64,' +
											company_profile.companyLogoByteArray
												: logo
										}
										className=""
										alt=""
										style={{ width: ' 150px' }}></img>
								
									
									</div>			
									<div style={{textAlign:'center'}} >
								
										<h2>
										{company_profile &&
											company_profile['companyName']
												? company_profile['companyName']
												: ''}
											</h2>	
											<br style={{ marginBottom: '5px' }} />
											<b style ={{ fontSize: '18px'}}>{strings.ProfitandLoss}</b>
											<br style={{ marginBottom: '5px' }} />
											{strings.From} {initValue.startDate} {strings.To} {initValue.endDate}
											
									</div>
									<div>
									</div>									
							</div>
									{loading ? (
										<Loader />
									) : (
										<div className="table-wrapper">
											<Table id="tbl_exporttable_to_xls" responsive className="table-bordered">
												<thead className="thead-dark ">
													<tr className="header-row">
														{this.columnHeader.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' }}
																	className={column.align ? 'text-right' : '' }
																	className="table-header-color"
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
																<td className="mainLable ">{strings.OperatingIncome}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['operatingIncome'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		<Currency
																			value={this.state.data['operatingIncome'][
																				`${item}`
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>
																</tr>
															))}
															<tr>
																<td className="mainLable ">
																	{strings.Total+" "+strings.OperatingIncome}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalOperatingIncome'] !=
																	null ? (
																		<Currency
																			value={this.state.data[
																				'totalOperatingIncome'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable ">
																	{strings.CostofGoodsSold}
																</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['costOfGoodsSold'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		<Currency
																			value={this.state.data['costOfGoodsSold'][
																				`${item}`
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>
																</tr>
															))}
															<tr>
																<td className="mainLable ">
																	{strings.Total+" "+strings.CostofGoodsSold}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalCostOfGoodsSold'] !=
																	null ? (
																		<Currency
																			value={this.state.data[
																				'totalCostOfGoodsSold'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td></td>
																<td className="mainLable ">{strings.GrossProfit}</td>
																<td className="text-right">
																	{this.state.data['grossProfit'] != null ? (
																		<Currency
																			value={this.state.data[
																				'grossProfit'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable ">{strings.Operating+" "+strings.Expense}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['operatingExpense'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		<Currency
																			value={this.state.data[
																				'operatingExpense'
																			][`${item}`]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>
																</tr>
															))}
															<tr>
																<td className="mainLable ">
																	{strings.Total+" "+strings.Operating+" "+strings.Expense}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalOperatingExpense'] !=
																	null ? (
																		<Currency
																			value={this.state.data[
																				'totalOperatingExpense'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td></td>
																<td className="mainLable ">{strings.OperatingProfit} </td>
																<td className="text-right">
																	{this.state.data['operatingProfit'] !=
																	null ? (
																		<Currency
																			value={this.state.data[
																				'operatingProfit'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable ">
																	{strings.NonOperating+" "+strings.Income}
																</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['nonOperatingIncome'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		<Currency
																			value={this.state.data[
																				'nonOperatingIncome'
																			][`${item}`]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>
																</tr>
															))}
															<tr>
																<td className="mainLable ">
																	{strings.Total+" "+strings.NonOperating+" "+strings.Income}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalNonOperatingIncome'] !=
																	null ? (
																		<Currency
																			value={this.state.data[
																				'totalNonOperatingIncome'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable ">
																	 {strings.NonOperating+" "+strings.Expense}
																</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(
																this.state.data['nonOperatingExpense'],
															).map((item) => (
																<tr>
																	<td className="pt-0 pb-0">{item}</td>
																	<td className="pt-0 pb-0"></td>
																	<td className="pt-0 pb-0 text-right">
																		<Currency
																			value={this.state.data[
																				'nonOperatingExpense'
																			][`${item}`]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>
																</tr>
															))}
															<tr>
																<td className="mainLable ">
																	{strings.Total+" "+strings.NonOperating+" "+strings.Expense}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data[
																		'totalNonOperatingExpense'
																	] != null ? (
																		<Currency
																			value={this.state.data[
																				'totalNonOperatingExpense'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
															<tr>
																<td></td>
																<td className="mainLable ">{strings.NetProfitLoss} </td>
																<td className="text-right">
																	{this.state.data['netProfitLoss'] != null ? (
																		<Currency
																			value={this.state.data[
																				'netProfitLoss'
																			]  }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.0'
																	)}
																</td>
															</tr>
														</>
													) : (
														<tr className="mainLable ">
															<td style={{ textAlign: 'center' }} colSpan="9">
																{strings.Thereisnodatatodisplay}
															</td>
														</tr>
													)}
												</tbody>
											</Table>
										</div>
									)}
									<div style={{ textAlignLast:'center'}}> {strings.PoweredBy} <b>SimpleAccounts</b></div> 
								</PDFExport>
							</CardBody>
						</div>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProfitAndLossReport);
