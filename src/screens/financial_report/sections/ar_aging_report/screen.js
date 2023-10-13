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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization'

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.reports.company_profile,
		ar_aging_report: state.reports.ar_aging_report,
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
class ArAgingReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
			dropdownOpen: false,
			ArAgingReport: [],
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD/MM/YYYY'),
				endDate: moment().endOf('month').format('DD/MM/YYYY'),

			},
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			data: [],

		};
		this.columnHeaderCompany = [
			// { label: 'Company Name', value: 'companyName', sort: true },
			// { label: 'Customer Id', value: 'customerId', sort: false },
			{ label: 'Customer Name', value: 'contactName', sort: true },
			// { label: 'Salesperson Id',value: 'salesPersonId',sort: true,},
			// { label: 'Salesperson Name', value: 'salespersonName', sort: true },
			// { label: 'Currency Id', value: 'currencyId', sort: false,align: 'right'  },
			// { label: 'Currency Code', value: 'currencyCode', sort: false },
			// 	{ label: 'Current', value: 'current', sort: false },
			{ label: 'Days 1 to 15', value: 'lessthen15', sort: false },
			{ label: 'Days 16 to 30', value: 'between15to30', sort: false },
			{ label: 'Days 31 and above', value: 'morethan30', sort: false },
			// { label: 'Days Above_45', value: 'daysAbove_45', sort: false },
			{ label: 'Total Amount', value: 'totalAmount', sort: false },
			// { label: 'FCY Code ', value: 'fcyCode', sort: false },
		];

	}

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					// 	startDate: moment(value.startDate).format('DD/MM/YYYY'),
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
			.getAgingReport(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						data: res.data.agingResponseModelList,
						loading: false,
					});
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	exportFile = () => {

	
		let dl =""
		let fn =""
		let type="csv"
		var elt = document.getElementById('tbl_exporttable_to_xls');												
		var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		return dl ?
		  XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
		  XLSX.writeFile(wb, fn || ('AR Aging Report.'+ (type || 'csv')));

	   }

	   exportExcelFile  = () => 
	   {   let dl =""
		   let fn =""
		   let type="xlsx"
		   var elt = document.getElementById('tbl_exporttable_to_xls');												
		   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		   return dl ?
			 XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
			 XLSX.writeFile(wb, fn || ('AR Aging Report.'+ (type || 'xlsx')));
   
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
	rendersalesExcludingvat = (cell, row, extraData) => {
		return row.salesExcludingvat === 0 ? (
			<Currency
				value={row.salesExcludingvat}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			<Currency
				value={row.salesExcludingvat}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		);

	};
	rendergetSalesWithvat = (cell, row, extraData) => {
		return row.getSalesWithvat === 0 ? (
			<Currency
				value={row.getSalesWithvat}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			<Currency
				value={row.getSalesWithvat}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		);

	};
	render() {
		strings.setLanguage(this.state.language);
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list, company_profile, ar_aging_report } = this.props;
		console.log(this.state.data)
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
													
													<DropdownItem  onClick={()=>{this.exportFile()}}>
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
									fileName="AR Aging Report.pdf"
								>
									<div style={{

										display: 'flex',
										justifyContent: 'space-between',
										marginUp: '1rem'
									}}>
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
										<div style={{ textAlign: 'center' }} >

											<h2>
												{company_profile &&
													company_profile['companyName']
													? company_profile['companyName']
													: ''}
											</h2>
											<br style={{ marginUp: '5px' }} />
											<b style={{ fontSize: '18px' }}>{strings.ARAgingReport}</b>
											<br style={{ marginUp: '5px' }} />
																						 
											{strings.Ason} {initValue.endDate.replaceAll("/","-")} 
										</div>
										<div>
										</div>
									</div>
									{loading ? (
										<Loader />
									) : (
										
										<div id="tbl_exporttable_to_xls" className="table-wrapper">
											<Table className="table-bordered">
											<thead className="table-header-bg">

													<tr className="header-row">
														{this.columnHeaderCompany.map((column, index) => {
															return (
																<th
																key={index}
																style={{ fontWeight: '600' ,textAlign:'center', color:'black'}}
																className={column.align ? 'text-center' : ''}
																className="table-header-bg"																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
												{this.state.data && 
													this.state.data.length > 0 ? (
														this.state.data.map(
															(item, index) => {
																return (
																	<>	
																				<tr key={index}>
																					<td style={{ width: '10%', textAlign:'center'}}>
																					{item["organizationName"] ? item["organizationName"] : item["contactName"]}																						
																					</td>
																					
																					{/* <td style={{ width: '12%', textAlign:'center' }}>
																							{item.currentAmount && (
																									<Currency
																										value={item.currentAmount }
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																							)}
																						</td> */}
																						<td style={{ width: '12%', textAlign:'center' }}>
																						
																									<Currency
																										value={item.lessthen15 }
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																						
																						</td>
																						<td style={{ width: '12%', textAlign:'center' }}>
																							
																									<Currency
																										value={item.between15to30 }
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																						
																						</td>
																						<td style={{ width: '12%', textAlign:'center' }}>
																					
																									<Currency
																										value={ item.morethan30}
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																							
																						</td>
																						<td style={{ width: '12%', textAlign:'center' }}>
																						
																									<Currency
																										value={item.totalAmount }
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																							
																						</td>
																					</tr>
																		
																	</>
																);
															},
														)
													) : (
														<tr style={{ borderBottom: '2px solid lightgray' }}>
															<td style={{ textAlign: 'center' }} colSpan="9">
															{strings.Thereisnodatatodisplay}
															</td>
														</tr>
													)}			
																		
														
												</tbody>
												</Table>
											{/* <Table  >
											
												<thead className="header-row" >
													<tr>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.CustomerId}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.CustomerName}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.SalesPersonId}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.SalesPersonName}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.CurrencyId}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.CurrencyCode}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.Current}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.Days1-15}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.Days16-20}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.Days31_45}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.DaysAbov45}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.Total}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.FCYTotal}</th>

													</tr>
												</thead>
												<tbody className=" table-bordered table-hover">
													{this.state.data.sbcustomerList &&
														this.state.data.sbcustomerList.map((item, index) => {
															return (
																<tr key={index}>


																	<td style={{ textAlign: 'center', width: '20%' }}>{item.customerName}</td>
																	<td style={{ textAlign: 'center', width: '20%' }}>{item.invoiceCount}</td>
																	<td style={{ textAlign: 'right', width: '20%' }}>
																		<Currency
																			value={item.salesExcludingvat}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0].currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>

																	<td style={{ textAlign: 'right', width: '20%' }}>
																		<Currency
																			value={item.getSalesWithvat}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0].currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>
																</tr>
															);
														})}

												</tbody>
												<tfoot>
													<tr style={{ border: "3px solid #dfe9f7" }}>
													<td style={{ textAlign: 'center', width: '20%' }}><b>{strings.Total}</b></td>
													<td></td>
													<td style={{ textAlign: 'right', width: '20%' }}>
													
														<b><Currency
															value={this.state.data.totalExcludingVat}
															currencySymbol={
																universal_currency_list[0]
																	? universal_currency_list[0].currencyIsoCode
																	: 'USD'
															}
														/></b>
														
													</td>

													<td style={{ textAlign: 'right', width: '20%' }}>
													<b>
													<Currency
															value={this.state.data.totalAmount}
															currencySymbol={
																universal_currency_list[0]
																	? universal_currency_list[0].currencyIsoCode
																	: 'USD'
															}
														/></b>
														
													</td>
												</tr>
												</tfoot>
											</Table> */}
										</div>
									)}
									<div style={{ textAlignLast: 'center' }}>{strings.PoweredBy} <b>SimpleAccounts</b></div>
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
)(ArAgingReport);
