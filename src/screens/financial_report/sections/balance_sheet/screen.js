import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Col,
	Table,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	

} from 'reactstrap';

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
import logo from 'assets/images/brand/logo.png';
import { CommonActions } from 'services/global';
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
		commonActions: bindActionCreators(CommonActions, dispatch),
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
class BalanceSheet extends React.Component {
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
			{ label: strings1.Account, value: 'Account', sort: true },
			{ label: strings1.Account+" "+strings1.Code, value: 'Account Code', sort: false },
			{ label: strings1.Total, value: 'Total', sort: false },
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
	

	
	exportFile = () => 
	{
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
		  XLSX.writeFile(wb, fn || ('Balance Sheet Report.'+ (type || 'csv')));

	}
	exportExcelFile  = () => 
	{
	    let dl =""
		let fn =""
		let type="xlsx"
		var elt = document.getElementById('tbl_exporttable_to_xls');												
		var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		return dl ?
		  XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
		  XLSX.writeFile(wb, fn || ('Balance Sheet Report.'+ (type || 'xlsx')));

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
							<column>
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
													
														<DropdownItem onClick={()=>{this.exportFile()}}>
															{/* <CSVLink
																onClick={()=>{this.exportFile()}}
																className="csv-btn"
																filename={'Balance Sheet Report.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink> */}
															<span
															style={{
																border: 0,
    															padding: 0,
																backgroundColor:"white !important"
															}}
														  >CSV (Comma Separated Value)</span>
														</DropdownItem>
														<DropdownItem onClick={()=>{this.exportExcelFile()}}>
								                         <span
															style={{
																border: 0,
    															padding: 0,
																backgroundColor:"white !important"
															}}
															>Excel</span>
														</DropdownItem>
															<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
														{/* <DropdownItem
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
								</column>
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
									fileName="Balance Sheet.pdf"
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
											<b style ={{ fontSize: '18px'}}>{strings.BalanceSheet}</b>
											<br style={{ marginBottom: '5px' }} />
											{strings.Ason}  {initValue.endDate.replaceAll("/","-")} 
											
									</div>
									<div>
								
									
									</div>									
							</div>
									{loading ? (
										<Loader />
									) : (
										<div className="table-wrapper mt-4">
											<Table id="tbl_exporttable_to_xls"
											 responsive className="table-bordered">
												<thead>
													<tr className="header-row">
														{this.columnHeader.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600', color:'black'
																 }}
																	className={column.align ? 'text-right' : ''}
																	className="table-header-bg"
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
																<td className="mainLable ">{strings.Assets}</td>
																<td></td>
																<td></td>
															</tr>
															<tr>
																<td className="mainLable ">{strings.FixedAssets}</td>
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
																					]  }
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
															<tr className="mainLable ">
																<td className="text-right">
																	{strings.Total+" "+strings.FixedAssets} 
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalFixedAssets'] ? (
																		<Currency
																			value={this.state.data[
																				'totalFixedAssets'
																			]  }
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
																<td className="mainLable ">{strings.CurrentAssets}</td>
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
																				]  }
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
																<td className="mainLable ">{strings.Bank}</td>
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
																					]  }
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
																<td className="mainLable ">
																 {strings.Account+" "+strings.Receivable}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAccountReceivable'] ? (
																		<Currency
																			value={this.state.data[
																				'totalAccountReceivable'
																			]  }
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
																<td className="mainLable ">
																 {strings.Other+" "+strings.CurrentAssets}
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
																				][`${item}`]  }
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
															<tr className="mainLable ">
																<td className="text-right">
																{strings.Total+" "+strings.CurrentAssets}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalCurrentAssets'] ? (
																		<Currency
																			value={this.state.data[
																				'totalCurrentAssets'
																			]  }
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
															<tr className="mainLable table-amount-header">
																<td className="mainLable text-right">
																	{strings.Total+" "+strings.Assets}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAssets'] ? (
																		<Currency
																			value={this.state.data[
																				'totalAssets'
																			]  }
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
																<td className="mainLable ">
																	{strings.EquitiesandLiabilities}
																</td>
																<td></td>
																<td></td>
															</tr>
															<tr>
																<td className="mainLable ">{strings.Equities}</td>
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
																					]  }
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
															<tr className="mainLable ">
																<td className="mainLable text-right">
																	{strings.TotalEquity}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalEquities'] ? (
																		<Currency
																			value={this.state.data[
																				'totalEquities'
																			]  }
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
																<td className="mainLable ">{strings.Other+" "+strings.Liability}</td>
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
																				][`${item}`]  }
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
															<tr className="mainLable ">
																<td className="mainLable text-right">
																	{strings.Total+" "+strings.Other+" "+strings.Liability }
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalOtherLiability'] ? (
																		<Currency
																			value={this.state.data[
																				'totalOtherLiability'
																			]  }
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
																<td className="mainLable ">
																{strings.Other+" "+strings.CurrentLiability }
																</td>
																<td></td>
																<td></td>
															</tr>

															<tr className="">
																<td className="mainLable ">{strings.AccountsPayable}</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalAccountPayable'] ? (
																		<Currency
																			value={this.state.data[
																				'totalAccountPayable'
																			]  }
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
																				][`${item}`]  }
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
															<tr className="mainLable ">
																<td className="mainLable text-right">
																	{strings.Total+" "+strings.Other+" "+strings.CurrentLiability }
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data[
																		'totalOtherCurrentLiability'
																	] ? (
																		<Currency
																			value={this.state.data[
																				'totalOtherCurrentLiability'
																			]  }
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
															<tr className="mainLable ">
																<td className="mainLable text-right">
																	{strings.Total+" "+strings.Liability}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalLiability'] ? (
																		<Currency
																			value={this.state.data[
																				'totalLiability'
																			]  }
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
															<tr className="mainLable table-amount-header">
																<td className="mainLable text-right">
																	 {strings.Total+" "+strings.Equities+" & "+strings.Liability}
																</td>
																<td></td>
																<td className="text-right">
																	{this.state.data['totalLiabilityEquities'] ? (
																		<Currency
																			value={this.state.data[
																				'totalLiabilityEquities'
																			]  }
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
														<tr className="mainLable ">
															<td style={{ textAlign: 'center' }} colSpan="9">
																{strings.Thereisnodatatodisplay }
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

export default connect(mapStateToProps, mapDispatchToProps)(BalanceSheet);
