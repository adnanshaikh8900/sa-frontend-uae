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
class TrailBalances extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dropdownOpen: false,
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD-MM-YYYY'),
				endDate: moment().endOf('month').format('DD-MM-YYYY'),
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
				transactionCategoryMapper: {
					'Capital Asset Depreciation Brought Forward': 'Credit',
					Sales: 'Credit',
					'Capital Asset Brought Forward': 'Debit',
					'Accommodation and Meals': 'Debit',
					'Accountancy Fees': 'Debit',
					'Retained Earnings': 'Credit',
					'Input VAT': 'Debit',
					'SBI-Adil khan': 'Debit',
					'SBI-Imran khan': 'Debit',
					'Accounts Payable': 'Credit',
				},
				assets: {
					'Input VAT': 0.0,
				},
				fixedAsset: {
					'Capital Asset Depreciation Brought Forward': 1200.0,
					'Capital Asset Brought Forward': 1100.0,
				},
				liabilities: {},
				equities: {},
				income: {
					Sales: 1200.0,
				},
				expense: {
					'Accommodation and Meals': 5200.0,
					'Accountancy Fees': 3400.0,
				},
				accountReceivable: {},
				accountpayable: {
					'Accounts Payable': 2300.0,
				},
				bank: {
					'SBI-Adil khan': 2400.0,
					'SBI-Imran khan': 400.0,
				},
				totalCreditAmount: 5300.0,
				totalDebitAmount: 12500.0,
			},
		};
		this.columnHeader = [
			{ label: strings1.Account, value: 'Account', sort: true },
			{ label: strings1.Net+" "+strings1.Debit, value: 'Net Debit', sort: false },
			{ label: strings1.Net+" "+strings1.Credit, value: 'Net Credit', sort: false },
		];
	}

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					startDate: moment(value.startDate).format('DD-MM-YYYY'),
					endDate: moment(value.endDate).format('DD-MM-YYYY'),
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
		this.props.financialReportActions.getCompany();
		this.initializeData();
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
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

	exportFile = () => {

		// let exportData
	 
		// 	 let singleResultArray=this.state && this.state.data 
	 	// 		 ?	 
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
		  XLSX.writeFile(wb, fn || ('Trial Balance Report.'+ (type || 'csv')));

	 }

	 exportExcelFile  = () => 
	 {   let dl =""
		 let fn =""
		 let type="xlsx"
		 var elt = document.getElementById('tbl_exporttable_to_xls');												
		 var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		 return dl ?
		   XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
		   XLSX.writeFile(wb, fn || ('Trial Balance Report.'+ (type || 'xlsx')));
 
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
																filename={'Trial Balance Report.csv'}
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
														<DropdownItem>
															
															<span
															style={{
																border: 0,
    															padding: 0,
																backgroundColor:"white !important"
															}}
														     onClick={()=>{this.exportExcelFile()}}
															>Excel</span>
														</DropdownItem>
															<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
														{/* <DropdownItem
															onClick={() => {
																this.exportFile(csvData, 'trialBalance', 'xls');
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(
																	csvData,
																	'trialBalance',
																	'xlsx',
																);
															}}
														>
															XLSX (Microsoft Excel)
														</DropdownItem> */}
													</DropdownMenu>
												</Dropdown>&nbsp;&nbsp;
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
									fileName="Trail Balances.pdf"
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
										
											<b style ={{ fontSize: '18px'}}>{strings.TrailBalances+" "+strings.Report}</b>
											<br/>
											{strings.Ason} {initValue.endDate}
											
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
																	style={{ fontWeight: '600', color:'black' }}
																	className={column.align ? 'text-right' : ''}
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
																<td className="mainLable ">{strings.Assets}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['assets']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['assets'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['assets'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">{strings.FixedAssets}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['fixedAsset']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['fixedAsset'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['fixedAsset'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">{strings.Bank} </td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['bank']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['bank'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['bank'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">{strings.Liabilities}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['liabilities']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['liabilities'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['liabilities'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">{strings.Equities}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['equities']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['equities'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['equities'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">{strings.Income}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['income']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['income'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['income'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">{strings.Expense}</td>
																<td></td>
																<td></td>
															</tr>
															{Object.keys(this.state.data['expense']).map(
																(item) => (
																	<tr>
																		<td className="pt-0 pb-0">{item}</td>
																		<td className="pt-0 pb-0 text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Debit' ? (
																				<Currency
																					value={this.state.data['expense'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																		<td className="text-right">
																			{this.state.data[
																				'transactionCategoryMapper'
																			][`${item}`] === 'Credit' ? (
																				<Currency
																					value={this.state.data['expense'][
																						`${item}`
																					]   }
																					currencySymbol={
																						universal_currency_list[0]
																							? universal_currency_list[0]
																									.currencyIsoCode
																							: 'USD'
																					}
																				/>
																			) : (
																				''
																			)}
																		</td>
																	</tr>
																),
															)}
															<tr>
																<td className="mainLable ">
																	{strings.Account+" "+strings.Receivable}
																</td>
																<td className="text-right">
																	{this.state.data['transactionCategoryMapper'][
																		'Accounts Receivable'
																	] === 'Debit' ? (
																		<Currency
																			value={this.state.data[
																				'accountReceivable'
																			]['Accounts Receivable']   }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		''
																	)}
																</td>
																<td className="text-right">
																	{this.state.data['transactionCategoryMapper'][
																		'Accounts Receivable'
																	] === 'Credit' ? (
																		<Currency
																			value={this.state.data[
																				'accountReceivable'
																			]['Accounts Receivable']   }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		''
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable ">{strings.AccountsPayable }</td>
																<td className="text-right">
																	{' '}
																	{this.state.data['transactionCategoryMapper'][
																		'Accounts Payable'
																	] === 'Debit' ? (
																		<Currency
																			value={this.state.data['accountpayable'][
																				'Accounts Payable'
																			]   }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		''
																	)}
																</td>
																<td className="text-right">
																	{this.state.data['transactionCategoryMapper'][
																		'Accounts Payable'
																	] === 'Credit' ? (
																		<Currency
																			value={this.state.data['accountpayable'][
																				'Accounts Payable'
																			]   }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		''
																	)}
																</td>
															</tr>
															<tr>
																<td className="mainLable text-right ">{strings.Total}</td>
																<td className="text-right">
																	<Currency
																		value={this.state.data['totalDebitAmount']}
																		currencySymbol={
																			universal_currency_list[0]
																				? universal_currency_list[0]
																						.currencyIsoCode
																				: 'USD'
																		}
																	/>
																</td>
																<td className="text-right">
																	<Currency
																		value={this.state.data['totalCreditAmount']}
																		currencySymbol={
																			universal_currency_list[0]
																				? universal_currency_list[0]
																						.currencyIsoCode
																				: 'USD'
																		}
																	/>
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
									<div style={{ textAlignLast:'center'}}> {strings.PoweredBy } <b>SimpleAccounts</b></div> 
								</PDFExport>
							</CardBody>
						</div>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailBalances);
