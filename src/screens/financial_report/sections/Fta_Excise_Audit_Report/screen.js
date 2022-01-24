import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.scss';
import logo from 'assets/images/brand/logo.png';
import { CommonActions } from 'services/global';
import LocalizedStrings from 'react-localization';


const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.common.company_profile,	
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		financialReportActions: bindActionCreators(
			FinancialReportActions,
			dispatch,
		),
		commonActions: bindActionCreators(
			CommonActions,
			dispatch,
		)
	};
};


class ViewFtaExciseAuditReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dropdownOpen: false,
			FtaExciseAuditData: [],
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD-MM-YYYY'),
				endDate: moment().endOf('month').format('DD-MM-YYYY'),
				companyId: 1,
				userId: 1,
			},
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			chart_of_account_list: [],
		};
		this.columnHeaderCompany = [
			{ label: 'Company Name', value: 'companyName', sort: true },
			{ label: 'Taxable Person Name En', value: 'taxablePersonNameEn', sort: false },
			{ label: 'Taxable Person Name Ar', value: 'taxablePersonNameAr', sort: true },
			{label: 'Tax Registration Number',value: 'taxRegistrationNumber',sort: true,},
			{ label: 'Tax Agency Name', value: 'TaxAgencyName', sort: true },
			{ label: 'Tax Agency Number', value: 'taxAgencyNumber', sort: false,align: 'right'  },
			{ label: 'TaxAgentName', value: 'TaxAgentName', sort: false },
			{ label: 'Tax Agency Agent Number', value: 'taxAgencyAgentNumber', sort: false },
			{ label: 'Period Start ', value: 'startDate', sort: false },
			{ label: 'Period End ', value: 'endDate', sort: false },
			{ label: 'FAFCreationDate ', value: 'creationDate', sort: false },
			{ label: 'ProductVersion ', value: 'productVersion', sort: false },
		];
		this.columnHeaderCustomer = [
			{ label: 'Customer Name', value: 'customerName', sort: true },
			{ label: 'Customer Country', value: 'customerCountry', sort: false },
			{ label: 'Customer TRN', value: 'customerTRN', sort: true },
		];
		this.columnHeaderSupplier = [
			{ label: 'Supplier Name', value: 'supplierName', sort: true },
			{ label: 'Supplier Country', value: 'supplierCountry', sort: false },
			{ label: 'Supplier TRN', value: 'supplierTRN', sort: true },
		];
		this.columnHeaderSupply = [
			{ label: 'Customer Name', value: 'customerName', sort: true },
			{ label: 'Customer Country', value: 'customerCountry', sort: false },
			{ label: 'Customer TRN', value: 'customerTRN', sort: true },
			{ label: 'Invoice Date', value: 'invoiceDate', sort: true },
			{ label: 'Invoice No', value: 'invoiceNo', sort: false },
			{ label: 'Permit.No', value: 'permitNo', sort: true },
			{ label: 'Transaction ID', value: 'transactionID', sort: true },
			{ label: 'Line No.', value: 'lineNo', sort: false },
			{ label: 'Product Name', value: 'productName', sort: true },
			{ label: 'Product Type', value: 'productType', sort: true },
			{ label: 'Product Description', value: 'productDescription', sort: false },
			{ label: 'Supply Amount AED', value: 'supplyValue', sort: true },
			{ label: 'Excise Amount AED', value: 'exciseTaxValue', sort: true },
			{ label: 'TaxCode', value: 'taxCode', sort: false },
			{ label: 'Excise Amount FCY', value: 'exciseTaxFCY', sort: true },
			{ label: 'Supply FCY', value: 'supplyFCY', sort: true },
			{ label: 'FCY Code', value: 'fcycode', sort: false },
		];
		this.columnHeaderCustomerTotal = [
			{ label: 'Transaction Count Total', value: 'customerTransactionCountTotal', sort: true },
			{ label: 'Supply Total AED', value: 'supplyTotal', sort: false },
			{ label: 'VAT Total AED', value: 'customerVATTotal', sort: true },
		];
		this.columnHeaderPurchase = [
			{ label: 'Supplier Name', value: 'supplierName', sort: true },
			{ label: 'Supplier Country', value: 'supplierCountry', sort: false },
			{ label: 'Supplier TRN', value: 'supplierTRN', sort: true },
			{ label: 'Invoice Date', value: 'invoiceDate', sort: true },
			{ label: 'Invoice No', value: 'invoiceNo', sort: false },
			{ label: 'Permit.No', value: 'permitNo', sort: true },
			{ label: 'Transaction ID', value: 'transactionID', sort: true },
			{ label: 'Line No.', value: 'lineNo', sort: false },
			{ label: 'Product Name', value: 'productName', sort: true },
			{ label: 'Product Type', value: 'productType', sort: true },
			{ label: 'Product Description', value: 'productDescription', sort: false },
			{ label: 'Purchase Amount AED', value: 'purchaseValue', sort: true },
			{ label: 'Excise Amount AED', value: 'vatvalue', sort: true },
			{ label: 'TaxCode', value: 'taxCode', sort: false },
			{ label: 'Excise Amount FCY', value: 'vatfcy', sort: true },
			{ label: 'PurchaseFCY', value: 'purchaseFCY', sort: true },
			{ label: 'FCY Code', value: 'fcycode', sort: false },
		];
		this.columnHeaderSupplierTotal = [
			{ label: 'Transaction Count Total', value: 'supplierTransactionCountTotal', sort: true },
			{ label: 'Purchase Total AED', value: 'purchaseTotal', sort: false },
			{ label: 'VAT Total AED', value: 'supplierVATTotal', sort: true },
		];
		this.columnHeaderGenral = [
			{ label: 'Transaction Date', value: 'transactionDate', sort: true },
			{ label: 'Account ID', value: 'accountID', sort: false },
			{ label: 'Account Name', value: 'accountName', sort: true },
			{ label: 'Transaction Description', value: 'transactionDescription', sort: true },
			{ label: 'Name', value: 'name', sort: false },
			{ label: 'Transaction ID', value: 'transactionID', sort: true },
			{ label: 'Source Type', value: 'sourceType', sort: true },
			{ label: 'Debit.', value: 'debit', sort: false },
			{ label: 'Credit', value: 'credit', sort: true },
			{ label: 'Balance', value: 'balance', sort: true },
		
		];
		this.columnHeaderGeneralTotal= [
			{ label: 'Transaction Count Total', value: 'transactionCountTotal', sort: true },
			{ label: 'Total Credit', value: 'totalCredit', sort: false },
			{ label: 'Total Debit', value: 'totalDebit', sort: true },
			{label: 'GLTCurrencyt', value: 'gltcurrency', sort: true }
		];
	}

	componentDidMount = () => {
		this.initializeData();
		
			this.props.commonActions.getCompany() 
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
			companyId: initValue.companyId,
			userId: initValue.userId,
		};
		this.props.financialReportActions
			.getFtaExciseAuditReport(postData)
			.then((res) => {
				const tempData = [];
				if (res.status === 200) {
					debugger
					// res.data.map((item) => {
					// 	item.map((val) => {
					// 		tempData.push(val);
					// 		return val;
					// 	});
					// 	return item;
					// });
					debugger
					this.setState(
						{ FtaExciseAuditData: res.data, csvData: tempData },
						() => {
							this.setState({
								loading: false,
							});
						},
					);
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
		  XLSX.writeFile(wb, fn || ('FTA AUDIT REPORT.'+ (type || 'csv')));

	   }

	   exportExcelFile  = () => 
	   {   let dl =""
		   let fn =""
		   let type="xlsx"
		   var elt = document.getElementById('tbl_exporttable_to_xls');												
		   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		   return dl ?
			 XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
			 XLSX.writeFile(wb, fn || ('FTA AUDIT REPORT.'+ (type || 'xlsx')));
   
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

		const {
			loading,
			dropdownOpen,
		} = this.state;
	
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
													<i className="fa fa-cog mr-2"></i>CustomizeReport
												</p>
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
							{/* <div className={`panel ${view ? 'view-panel' : ''}`}>
								<FilterComponent
									viewFilter={this.viewFilter}
									chart_of_account_list={chart_of_account_list}
									generateReport={(value) => {
										this.generateReport(value);
									}}
								/>
							</div> */}
							<CardBody id="section-to-print">
								<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A3"
								    fileName="Detailed General Ledger.pdf"
								>

									{/* <div className="logo-container">
													<img src={logo} alt="logo" />
												</div>
									<div style={{ textAlign: 'center'}}>
										<p><h2>
										{company_profile &&
											company_profile['companyName']
												? company_profile['companyName']
												: ''}
												</h2>
											<br style={{ marginBottom: '5px' }} />
											<b style ={{ fontSize: '18px'}}>Detailed General Ledger</b>
											<br style={{ marginBottom: '5px' }} />
											From {initValue.startDate} To {initValue.endDate}
										</p>
									</div> */}

									
									{loading ? (
										<Loader />
									) : (
										<div id="tbl_exporttable_to_xls" className="table-wrapper">
											<Table responsive>
												<Table>
												<tr>
													<td>
													Company Information Table
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderCompany.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
												
																				<tr>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.companyName}
																					</td>
																					<td style={{ width: '18%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxablePersonNameEn}
																					</td>
																					<td style={{ width: '13%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxablePersonNameAr}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxRegistrationNumber}
																					</td>
																					<td style={{ width: '18%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxAgencyName}
																					</td>
																					<td style={{ width: '13%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxAgencyNumber}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxAgentName}
																					</td>
																					<td style={{ width: '18%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.taxAgencyAgentNumber}
																					</td>
																					<td style={{ width: '13%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.startDate}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.endDate}
																					</td>
																					<td style={{ width: '18%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.creationDate}
																					</td>
																					<td style={{ width: '13%', textAlign: 'center'}}>
																						{this.state.FtaExciseAuditData.productVersion}
																					</td>
																				
																				</tr>
																		
														
												</tbody>
												</Table>
<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													Costumer Data Audit File
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderCustomer.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{this.state.FtaExciseAuditData &&
														this.state.FtaExciseAuditData.customerDataResponseModels.map(
															(item, index) => {
																debugger
																return (
																	<>
																		
																	
																				<tr key={index}>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['customerName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['customerCountry']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['customerTRN']}
																					</td>
																					
																				
																				</tr>
																		
																	</>
																);
															},
														)}
												</tbody>
												</Table>
												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													Supplier Data Audit File
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderSupplier.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{this.state.FtaExciseAuditData &&
														this.state.FtaExciseAuditData.supplierDataResponseModels.map(
															(item, index) => {
																return (
																	<>
																		
																		
																				<tr key={index}>
																				<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplierName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplierCountry']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplierTRN']}
																					</td>
																					
																				
																				</tr>
																		
																	</>
																);
															},
														)}
												</tbody>
												</Table>
												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													Supply Data Information
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderSupply.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{this.state.FtaExciseAuditData &&
														this.state.FtaExciseAuditData.customerSupplyListingResponseModel.map(
															(item, index) => {
																return (
																	<>
																		
																		
																				<tr key={index}>
																				<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['customerName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['customerCountry']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['customerTRN']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['invoiceDate']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['invoiceNo']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['permitNo']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['transactionID']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['lineNo']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['productName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['productType']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['productDescription']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplyValue']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['exciseTaxValue']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['taxCode']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplyFCY']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['exciseTaxFCY']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['fcycode']}
																					</td>
																				
																				</tr>
																		
																	</>
																);
															},
														)}
												</tbody>
												</Table>
												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													Customer Supply Listing Total
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderCustomerTotal.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													
																	<>
																		
																		
																				<tr >
																				<td style={{ width: '12%', textAlign: 'center'}}>
																				{this.state.FtaExciseAuditData.customerTransactionCountTotal}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.supplyTotal}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.customerVATTotal}
																					</td>
																					
																				
																				</tr>
																		
																	</>
															
												</tbody>
												</Table>

												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													Supply Data Information
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderPurchase.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{this.state.FtaExciseAuditData &&
														this.state.FtaExciseAuditData.supplierSupplyListingResponseModels.map(
															(item, index) => {
																return (
																	<>
																		
																		
																				<tr key={index}>
																				<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplierName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplierCountry']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['supplierTRN']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['invoiceDate']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['invoiceNo']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['permitNo']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['transactionID']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['lineNo']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['productName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['productType']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['productDescription']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['purchaseValue']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['exciseTaxValue']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['taxCode']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['purchaseFCY']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['exciseTaxFCY']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['fcycode']}
																					</td>
																				
																				</tr>
																		
																	</>
																);
															},
														)}
												</tbody>
												</Table>
												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													Supplier Purchase Listing Total
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderSupplierTotal.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													
																	<>
																		
																		
																				<tr >
																				<td style={{ width: '12%', textAlign: 'center'}}>
																				{this.state.FtaExciseAuditData.supplierTransactionCountTotal}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.purchaseTotal}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.supplierVATTotal}
																					</td>
																					
																				
																				</tr>
																		
																	</>
															
												</tbody>
												</Table>
												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													General Ledger Table
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderGenral.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{this.state.FtaExciseAuditData &&
														this.state.FtaExciseAuditData.generalLedgerListingResponseModels.map(
															(item, index) => {
																return (
																	<>
																		
																		
																				<tr key={index}>
																				<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['transactionDate']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['accountID']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['accountName']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['transactionDescription']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['name']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['transactionID']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['sourceType']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['credit']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['debit']}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																						{item['balance']}
																					</td>
																				
																				</tr>
																		
																	</>
																);
															},
														)}
												</tbody>
												</Table>
												<tr>
	<> </>
</tr>
												<Table>
												<tr>
													<td>
													General Ledger Table Total
													</td>
												</tr>
												<thead>
													<tr className="header-row">
														{this.columnHeaderGeneralTotal.map((column, index) => {
															return (
																<th
																	key={index}
																>
																	<span>{column.label}</span>
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													
																	<>
																		
																		
																				<tr >
																				<td style={{ width: '12%', textAlign: 'center'}}>
																				{this.state.FtaExciseAuditData.transactionCountTotal}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.totalCredit}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.totalDebit}
																					</td>
																					<td style={{ width: '12%', textAlign: 'center'}}>
																					{this.state.FtaExciseAuditData.gltcurrency}
																					</td>
																				
																				</tr>
																		
																	</>
															
												</tbody>
												</Table>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ViewFtaExciseAuditReport);
