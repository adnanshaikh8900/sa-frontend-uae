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
import FilterComponent2 from '../filterComponet2';
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
class VatReturnsReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,
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
		data:{
			totalAmount: '',
			totalVatAmount: '',
			totalAmountForDubai: '',
			nameForDubai: '',
			totalVatForDubai: '',
			totalAmountForAbuDhabi: 0,
			nameForAbuDhabi: '',
			totalVatForAbuDhabi: '',
			totalAmountForFujairah: '',
			nameForFujairah: '',
			totalVatForFujairah: '',
			totalAmountForSharjah: '',
			nameForSharjah: '',
			totalVatForSharjah: '',
			totalAmountForAjman: '',
			nameForAjman: '',
			totalVatForAjman:'',
			totalAmountForUmmAlQuwain: '',
			nameForUmmAlQuwain: '',
			totalVatForUmmAlQuwain: '',
			totalAmountForRasAlKhaimah: '',
			nameForRasAlKhalmah: '',
			totalVatForRasAlKhaimah: '',
			zeroRatedSupplies:'',
			totalValueOfDueTaxForThePeriod:'',
			standardRatedExpensesTotalAmount:'',
			standardRatedExpensesVatAmount:'',
			totalValueOfRecoverableTaxForThePeriod:'',
			netVatPayableOrReclaimableForThePeriod:'',
		},

			// data2: [
			// 	{
			// 		Box: 12,
			// 		Description: 'Total value of due tax for the period',
			// 		VATAmount: 0.0,
				
			// 	 },
			// 	{
			// 		Box: 13,
			// 		Description: 'Total value of recoverable tax for the period',
			// 		VATAmount: 0.0,
					
			// 	 },
			// 	{
			// 		Box: 14,
			// 		Description: 'Net VAT payable (or reclaimable) for the period',
			// 		VATAmount: 0.0,
					
			// 	 },
			// 	 {
			// 		Box: 15,
			// 		Description: 'Do you wish to request a refund for the above amount of reclaimable VAT?',
			// 		VATAmount: '',
					
			// 	 }
				
			// ],
				
		};
		this.columnHeader1 = [
			{ label: strings1.Box+"#", value: 'Box#', sort: false },
			{ label: strings1.Description, value: 'Description', sort: false },
			{ label: strings1.Amount, value: 'Amount', sort: false, },
			{ label: strings1.VatAmount, value: 'VATAmount', sort: false },
			{ label: strings1.Adjustment, value: 'Adjustment', sort: false },
		];
		this.columnHeader2 = [
			{ label: strings1.Box+"#", value: 'Box#', sort: false },
			{ label: strings1.Description, value: 'Description', sort: false },
			{ label: strings1.Amount, value: 'Amount', sort: false },
			{ label: strings1.Recoverable+" "+strings1.VatAmount, value: 'RecoverableVATAmount', sort: false },
			{ label: strings1.Adjustment, value: 'Adjustment', sort: false },
		];
		this.columnHeader3 = [
			{ label: strings1.Box+"#", value: 'Box#', sort: false },
			{ label: strings1.Description, value: 'Description', sort: false },
			{ label: strings1.VatAmount, value: 'VATAmount', sort: false },
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
		this.props.financialReportActions.getCompany();
		this.initializeData();
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate:this.props.location.state.startDate,
			endDate: this.props.location.state.endDate,
		};
		this.setState(
			{
				initValue: {
					startDate: this.props.location.state.startDate,
					endDate:this.props.location.state.endDate,
				},
				loading: true,
			},
			() => {
				// this.initializeData();
			},
		);
		this.props.financialReportActions
			.getVatReturnsReport(postData)
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
		  XLSX.writeFile(wb, fn || ('Vat Return Report.'+ (type || 'csv')));

	   }

	   exportExcelFile  = () => 
	   {   let dl =""
		   let fn =""
		   let type="xlsx"
		   var elt = document.getElementById('tbl_exporttable_to_xls');												
		   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		   return dl ?
			 XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
			 XLSX.writeFile(wb, fn || ('Vat Return  Report.'+ (type || 'xlsx')));
   
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
												{/* <p
													className="mb-0"
													style={{
														cursor: 'pointer',
														fontSize: '1rem',
														paddingLeft: '15px',
													}}
													onClick={this.viewFilter}
												>
													<i className="fa fa-cog mr-2"></i>{strings.CustomizeReport}
												</p> */}
											</div>
											<div className="d-flex">
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
																this.exportFile(csvData, 'Vat Return Report', 'xls');
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(
																	csvData,
																	'Vat Return Report',
																	'xlsx',
																);
															}}
														>
															XLSX (Microsoft Excel)
														</DropdownItem> */}
													</DropdownMenu>
												</Dropdown> &nbsp;&nbsp;
												<div
													className="mr-2 print-btn-cont"
													onClick={() => window.print()}
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
                                                        this.props.history.push('/admin/report/vatreports');
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
									fileName="Vat Return Report.pdf"
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
											<b style ={{ fontSize: '18px'}}>{strings.VatReturns}</b>
											<br style={{ marginBottom: '5px' }} />
											{strings.From} {initValue.startDate} {strings.To} {initValue.endDate}
									</div>
									<div>
									</div>									
							</div>
									{loading ? (
										<Loader />
									) : (
										<div id="tbl_exporttable_to_xls" className="table-wrapper">
											<p><b>{strings.VATonSalesandallotherOutputs}</b></p>
											<Table responsive className="table-bordered">
												<thead className="thead-dark ">
													<tr className="header-row">
														{this.columnHeader1.map((column, index) => {
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
															{/* Abu Dhabi */}
															<tr className="mainLable">
																<td className="mainLable ">1a</td>
																<td className="pt-0 pb-0">Standard rated supplies in Abu Dhabi</td>
																<td className="pt-0 pb-0 "  style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalAmountForAbuDhabi'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForAbuDhabi'
																			]}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatForAbuDhabi'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForAbuDhabi'
																			]}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

																{/* Ajman */}
																<tr className="mainLable">
																<td className="mainLable">1b</td>
																<td className="pt-0 pb-0">Standard rated supplies in Ajman</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalAmountForAjman'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForAjman'
																			]}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatForAjman'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForAjman'
																			]}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

																{/* Dubai */}
																<tr className="mainLable">
																<td className="mainLable ">1c</td>
																<td className="pt-0 pb-0">Standard rated supplies in Dubai</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalAmountForDubai'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForDubai'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatForDubai'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForDubai'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

																{/* Fujairah */}
																<tr className="mainLable">
																<td className="mainLable ">1d</td>
																<td className="pt-0 pb-0">Standard rated supplies in Fujairah</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalAmountForFujairah'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForFujairah'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatForFujairah'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForFujairah'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

																{/* RasAlKhaimah */}
																<tr className="mainLable">
																<td className="mainLable ">1e</td>
																<td className="pt-0 pb-0">Standard rated supplies in Ras Al Khaimah</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																				{this.state.data[
																				'totalAmountForRasAlKhalmah'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForRasAlKhalmah'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatForRasAlKhalmah'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForRasAlKhalmah'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																		
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

																{/* Sharjah */}
																<tr className="mainLable">
																<td className="mainLable ">1f</td>
																<td className="pt-0 pb-0">Standard rated supplies in Sharjah</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																				{this.state.data[
																				'totalAmountForSharjah'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForSharjah'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																				{this.state.data[
																				'totalVatForSharjah'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForSharjah'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

																{/* Abu Dhabi */}
																<tr className="mainLable">
																<td className="mainLable ">1g</td>
																<td className="pt-0 pb-0">Standard rated supplies in Umm Al Quwain</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalAmountForUmmAlQuwain'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalAmountForUmmAlQuwain'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatForUmmAlQuwain'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatForUmmAlQuwain'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
																<tr className="mainLable">
																<td className="mainLable ">2</td>
																<td className="pt-0 pb-0">Tax refunds provided to tourists under the tax refunds for tourists scheme</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalAmountForDubai'
																			] } */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

															<tr className="mainLable">
																<td className="mainLable ">3</td>
																<td className="pt-0 pb-0">Supplies subject to the reverse charge provisions</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalAmountForDubai'
																			] } */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>

															<tr className="mainLable">
																<td className="mainLable ">4</td>
																<td className="pt-0 pb-0">{strings.Zeroratedsupplies}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																{this.state.data[
																				'zeroRatedSupplies'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'zeroRatedSupplies'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">5</td>
																<td className="pt-0 pb-0">{strings.Exemptsupplies}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalAmountForDubai'
																			] } */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">6</td>
																<td className="pt-0 pb-0">Goods imported into the UAE</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalAmountForDubai'
																			] } */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">7</td>
																<td className="pt-0 pb-0">Adjustments and additions to goods imported into the UAE</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalAmountForDubai'
																			] } */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">8</td>
																<td className="pt-0 pb-0">{strings.Total}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																	
																			
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatAmount'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatAmount'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															

														</>

											) : (
														<tr className="mainLable">
															<td style={{ textAlign: 'center' }} colSpan="9">
															{strings.Thereisnodatatodisplay}
															</td>
														</tr>
													)}
												</tbody>
											</Table>
												<p><b>{strings1.VATonExpensesandallotherInputs}</b></p>
												<Table responsive className="table-bordered">
													<thead className="thead-dark ">
													<tr className="header-row">
														{this.columnHeader2.map((column, index) => {
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
															<tr className="mainLable">
																<td className="mainLable ">9</td>
																<td className="pt-0 pb-0">{strings.Standardratedexpenses}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'standardRatedExpensesTotalAmount'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'standardRatedExpensesTotalAmount'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																			
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'standardRatedExpensesVatAmount'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'standardRatedExpensesVatAmount'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																	
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">10</td>
																<td className="pt-0 pb-0">{strings.Suppliessubjecttothereversechargeprovisions}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'standardRatedExpensesTotalAmount'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'standardRatedExpensesTotalAmount'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)} */} 0.00
																			
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'standardRatedExpensesVatAmount'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'standardRatedExpensesVatAmount'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)} */}0.00
																	
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">11</td>
																<td className="pt-0 pb-0">{strings.Total}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																		
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalVatOnExpensesAndAllOtherInputs'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalVatOnExpensesAndAllOtherInputs'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}
																</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{/* {this.state.data[
																				'totalVatForDubai'
																			]} */}
																			0.00
																</td>
															</tr>
														</>	
														
																) : (
																	<tr className="mainLable">
																		<td style={{ textAlign: 'center' }} colSpan="9">
																		 {strings.Thereisnodatatodisplay}
																		</td>
																	</tr>
																)}
													</tbody>
												</Table>
											
											<div >
												<p><b>{strings.Net+" "+strings.Vat+" "+strings.Due}</b></p>
												<Table responsive className="table-bordered">
												<thead className="thead-dark ">
													<tr className="header-row">
														{this.columnHeader3.map((column, index) => {
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
															<tr className="mainLable">
																<td className="mainLable ">12</td>
																<td className="pt-0 pb-0">{strings.Totalvalueofduetaxfortheperiod}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalValueOfDueTaxForThePeriod'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalValueOfDueTaxForThePeriod'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}	
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">13</td>
																<td className="pt-0 pb-0">{strings.Totalvalueofrecoverabletaxfortheperiod}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'totalValueOfRecoverableTaxForThePeriod'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'totalValueOfRecoverableTaxForThePeriod'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}	
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">14</td>
																<td className="pt-0 pb-0">{strings.NetVATpayablefortheperiodorreclaimable}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}>
																			{this.state.data[
																				'netVatPayableOrReclaimableForThePeriod'
																			] ? (
																		<Currency
																			value={this.state.data[
																				'netVatPayableOrReclaimableForThePeriod'
																			] }
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0]
																							.currencyIsoCode
																					: 'USD'
																			}
																		/>
																	) : (
																		'0.00'
																	)}	
																</td>
															</tr>
															<tr className="mainLable">
																<td className="mainLable ">15</td>
																<td className="pt-0 pb-0">{strings.DoyouwishtorequestarefundfortheaboveamountofreclaimableVAT}</td>
																<td className="pt-0 pb-0 " style={{ textAlign: 'right' }}></td>
															</tr>

															</>	
														
														) : (
															<tr className="mainLable">
																<td style={{ textAlign: 'center' }} colSpan="9">
																	{strings.Thereisnodatatodisplay}
																</td>
															</tr>
														)}
												
													</tbody>
												</Table>
											</div>
										</div>
									)}
									<div style={{ textAlignLast:'center'}}>{strings.PoweredBy} <b>SimpleAccounts</b></div> 
								</PDFExport>
							</CardBody>
						</div>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VatReturnsReport);
