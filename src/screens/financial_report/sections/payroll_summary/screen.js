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
import { CommonActions } from 'services/global';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.reports.company_profile,
		payable_invoice: state.reports.payable_invoice,
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
class PayrollSummaryReport extends React.Component {
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
			
			},
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
		data:[],
		};
	
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
		this.props.financialReportActions.getCompany() 
		this.initializeData();
	
		
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
		// this.props.financialReportActions
		// 	.getPayableInvoiceSummary(postData)
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
			.getPayrollSummaryReport(postData)
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

	
		let dl =""
		let fn =""
		let type="csv"
		var elt = document.getElementById('tbl_exporttable_to_xls');												
		var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		return dl ?
		  XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
		  XLSX.writeFile(wb, fn || ('Payroll Summary Report.'+ (type || 'csv')));

	   }

	   exportExcelFile  = () => 
	   {   let dl =""
		   let fn =""
		   let type="xlsx"
		   var elt = document.getElementById('tbl_exporttable_to_xls');												
		   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		   return dl ?
			 XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
			 XLSX.writeFile(wb, fn || ('PayablesInvoice Summary Report.'+ (type || 'xlsx')));
   
	   }



	// exportFile = (csvData, fileName, type) => {
	// 	const fileType =
	// 		type === 'xls'
	// 			? 'application/vnd.ms-excel'
	// 			: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	// 	const fileExtension = `.${type}`;
	// 	const ws = XLSX.utils.json_to_sheet(csvData);
	// 	const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
	// 	const excelBuffer = XLSX.write(wb, { bookType: type, type: 'array' });
	// 	const data = new Blob([excelBuffer], { type: fileType });
	// 	FileSaver.saveAs(data, fileName + fileExtension);
	// };
	renderPayperiod = (row) => {
		let dateArr=row.payPeriod ? row.payPeriod.split("-"):[];

				let  startDate= moment(dateArr[0]).format('DD-MM-YYYY')
				let	 endDate=moment(dateArr[1]).format('DD-MM-YYYY')
		
		return(
			<div>{startDate}<b>&nbsp;to&nbsp;</b>{endDate}</div>
		// <Table>
		// 	<Row><Col className="pull-right"><b>Start-Date</b></Col><Col>: {startDate}</Col></Row>
		// 	<Row><Col className="pull-right"><b>End-Date</b></Col><Col>: {endDate}</Col></Row>
		// 	 </Table>  
			) ;
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
	renderinvoiceDate = (cell, rows) => {
		return moment(rows.invoiceDate).format('DD-MM-YYYY');
	};
	renderinvoiceDueDate = (cell, rows) => {
		return moment(rows.invoiceDueDate).format('DD-MM-YYYY');
	};
	renderbalance = (cell, row, extraData) => {
		return row.balance === 0 ? (
			<Currency
				value={row.balance}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			<Currency
				value={row.balance}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		);
		
	};
	renderPayrolltotalAmount= (row) => {
		
		return (
			<div style={{fontSize:"11px"}}>
				<div>
					<label className="font-weight-bold mr-2 ">{strings.Payroll +" "+strings.Amount}: </label>
					<label>
						{row.totalAmount === 0 ?  "AED "+ row.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }): "AED "+ row.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
					
					</label>
				</div>
				
				<div style={{ display: row.dueAmount === 0 ? 'none' : '' }}>
					<label className="font-weight-bold mr-2">{strings.DueAmount} : </label>
					<label>{row.dueAmount === 0 ? row.dueAmount +" "+ row.dueAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }) : "AED "+ row.dueAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</label>
				</div>

			</div>);
	};
	render() {
		strings.setLanguage(this.state.language); 
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list,company_profile,payable_invoice } = this.props;
		
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
												<div>
												<Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
													<DropdownToggle caret>Export As</DropdownToggle>
													<DropdownMenu>
														
													<DropdownItem>
															
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
												</Dropdown></div> &nbsp;&nbsp;
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
									fileName="Payables Invoice Summary.pdf"
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
											<b style ={{ fontSize: '18px'}}>{strings.Payroll+"s  "+strings.Summary}</b>
											<br style={{ marginBottom: '5px' }} />
											{strings.From } {initValue.startDate} {strings.To } {initValue.endDate}
											
									</div>
									<div>
									</div>									
							</div>
									{loading ? (
										<Loader />
									) : (
										<div id="tbl_exporttable_to_xls" className="table-wrapper">
											<Table >
												<thead className="header-row" >
													<tr>
														<th style={{ padding: '0.5rem', textAlign: 'center' ,width:"10%", color:'black'}}>	Payroll Date</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', width:"25%", color:'black'}}>	Payroll Subject</th>
														<th style={{ padding: '0.5rem', textAlign: 'center',width:"25%", color:'black'}}>	Pay Period</th>
														<th style={{ padding: '0.5rem', textAlign: 'center' ,width:"15%", color:'black'}}>Employee Count</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>	Generated by</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>	Approver</th>
														<th style={{ padding: '0.5rem', textAlign: 'center' ,width:"10%", color:'black' }}>Run Date</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.Status}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black',width:"25%"}}>{strings.Amount}</th>
													</tr>
												</thead>
												<tbody className=" table-bordered table-hover">
													{this.state.data.payrollSummaryModelList &&
														this.state.data.payrollSummaryModelList.map((item, index) => {
															return (
																<tr key={index}>
																	<td style={{ textAlign: 'center'}}>
																	{item.payrollDate ? (
																		moment(item.payrollDate).format('DD-MM-YYYY')
																	) : (" ")}</td>
																	
																	<td style={{ textAlign: 'center'}}>{item.payrollSubject}</td>
																	<td style={{ textAlign: 'center'}}>{this.renderPayperiod(item)}</td>
																	<td style={{ textAlign: 'center' }}>{item.employeeCount}</td>
																	<td style={{ textAlign: 'center'}}>{item.generatedByName}</td>
																	<td style={{ textAlign: 'center'}}>{item.payrollApproverName}</td>
																	
																	<td style={{ textAlign: 'center'}}>
																	{item.runDate ? (
																		moment(item.runDate).format('DD-MM-YYYY')
																	) : (" ")}</td>
																	<td style={{ textAlign: 'center' }}>{item.status}</td>
																	<td style={{ textAlign: 'right' }}>{this.renderPayrolltotalAmount(item)}</td>
																	{/* <td style={{ textAlign: 'right' }}>
																		<Currency
																			value={item.totalInvoiceAmount}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0].currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td> */}

																	{/* <td style={{ textAlign: 'right' }}>
																		<Currency
																			value={item.balance}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0].currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td> */}
																</tr>
															);
														})}

												</tbody>
												{/* <tfoot>
													<tr style={{ border: "3px solid #dfe9f7" }}>
													<td style={{ textAlign: 'center', width: '20%' }}><b>{strings.Total}</b></td>
													<td></td>	<td></td>	<td></td>	<td></td>
													<td style={{ textAlign: 'right', width: '20%' }}>
												
														<b><Currency
															value={this.state.data.totalAmount}
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
															value={this.state.data.totalBalance}
															currencySymbol={
																universal_currency_list[0]
																	? universal_currency_list[0].currencyIsoCode
																	: 'USD'
															}
														/></b>
														
													</td>
												</tr>
												</tfoot> */}
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

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PayrollSummaryReport);
