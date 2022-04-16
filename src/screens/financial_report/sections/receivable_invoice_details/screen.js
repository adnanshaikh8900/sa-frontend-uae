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
import FilterComponent from './sections/filterComponent';
import { Loader, Currency } from 'components';

import * as ReceivbaleInvoiceDetailsActions from './actions';

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
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		receivbaleInvoiceDetailsActions: bindActionCreators(
			ReceivbaleInvoiceDetailsActions,
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

class ReceivableInvoiceDetailsReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dropdownOpen: false,
			receivbaleInvoiceDetailsList: {},
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
			chart_of_account_list: [],
		};
		this.columnHeader = [
			{ label: strings1.InvoiceDate, value: 'invoiceDate' },
			{ label: strings1.InvoiceNumber, value: 'invoiceNumber' },
			
			{ label: strings1.ProductName, value: 'productName' },
			{label: strings1.Description,value: 'description',sort: true,},
			{ label: strings1.Quantity, value: 'quantity', sort: true },
			{ label: strings1.UnitPrice, value: 'unitPrice', sort: false,align: 'right'  },
			{ label: strings1.VatAmount, value: 'vatAmount', sort: false, align: 'left' },
			{ label: strings1.Total+" "+strings1.Amount, value: 'totalAmount', sort: false, align: 'left' },
		];
	}

	componentDidMount = () => {
		this.props.receivbaleInvoiceDetailsActions.getCompany() 
		this.initializeData();
	
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
		this.props.receivbaleInvoiceDetailsActions
			.getReceivableInvoiceDetail(postData)
			.then((res) => {
			
				const tempData = [];
				if (res.status === 200) {
				
				
					this.setState(
						
						{ receivbaleInvoiceDetailsList: res.data },
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
		  XLSX.writeFile(wb, fn || ('Receivable Invoice Details Report.'+ (type || 'csv')));

	   }

	   exportExcelFile  = () => 
	   {   let dl =""
		   let fn =""
		   let type="xlsx"
		   var elt = document.getElementById('tbl_exporttable_to_xls');												
		   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		   return dl ?
			 XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
			 XLSX.writeFile(wb, fn || ('Receivable Invoice Details Report.'+ (type || 'xlsx')));
   
	   }
     

	// exportFile = () => {
		
	// 	return (this.state  && this.state.receivbaleInvoiceDetailsList.resultObject? this.state.receivbaleInvoiceDetailsList.resultObject[0] :'');
	// };

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

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					startDate: moment(value.startDate).format('DD/MM/YYYY'),
					endDate: moment(value.endDate).format('DD/MM/YYYY'),
					// reportBasis: value.reportBasis.value,
					// chartOfAccountId: value.chartOfAccountId.value,
				},
				loading: true,
				view: !this.state.view,
			},
			() => {
				this.initializeData();
			},
		);
	};

	onSort = (column) => {
		let checkedValue = [];
		let obj = {};
		const direction = this.state.sort.column
			? this.state.sort.direction === 'asc'
				? 'desc'
				: 'asc'
			: 'desc';
		const sortedData = this.state.receivbaleInvoiceDetailsList.map((data) => {
			let nameA, nameB;
			data.sort((a, b) => {
				if (column !== 'date') {
					nameA = a[`${column}`] ? a[`${column}`].toUpperCase() : '';
					nameB = b[`${column}`] ? b[`${column}`].toUpperCase() : '';
				} else {
					nameA = a[`${column}`]
						? moment(a[`${column}`], 'DD-MM-YYYY').toDate()
						: '';
					nameB = b[`${column}`]
						? moment(b[`${column}`], 'DD-MM-YYYY').toDate()
						: '';
				}
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
			checkedValue = data[0][`${column}`];
			if (direction === 'desc') {
				data.reverse();
				checkedValue = data[0][`${column}`];
			}
			obj = {
				data,
				value: checkedValue,
			};
			return obj;
		});
		const temp = sortedData.sort((a, b) => {
			const nameA = a['value'] ? a['value'].toUpperCase() : '';
			const nameB = b['value'] ? b['value'].toUpperCase() : '';
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});
		if (direction === 'desc') {
			temp.reverse();
		}

		const val = temp.map((item) => {
			return item.data;
		});
		this.setState({
			receivbaleInvoiceDetailsList: val,
			sort: {
				column,
				direction,
			},
		});
	};

	setArrow = (column) => {
		let className = 'sort-direction';
		if (this.state.sort.column === column) {
			className += this.state.sort.direction === 'asc' ? ' desc' : ' asc';
		}
		return className;
	};

	getInvoice = (postingType, type, id) => {
		switch (postingType) {
			case 'INVOICE':
				if (type === 1) {
					this.props.history.push('/admin/expense/supplier-invoice/view', {
						id,
					});
				} else {
					this.props.history.push('/admin/income/customer-invoice/view', {
						id,
					});
				}
				break;
			case 'EXPENSE':
				this.props.history.push('/admin/expense/expense/detail', {
					expenseId: id,
					view: true,
				});
				break;
			case 'BANK_ACCOUNT':
				this.props.history.push(
					'/admin/banking/bank-account/transaction/detail',
					{ id, view: true },
				);
				break;
			case 'MANUAL':
				this.props.history.push('/admin/accountant/journal', { id });
				break;
			default:
		}
	};

	render() {
		strings.setLanguage(this.state.language);
		const {
			loading,
			initValue,
			dropdownOpen,
			csvData,
			view,
			chart_of_account_list,
		} = this.state;
		const { profile, universal_currency_list,company_profile } = this.props;

		console.log(this.state.receivbaleInvoiceDetailsList.resultObject)
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
														
													<DropdownItem onClick={()=>{this.exportFile()}}>
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
									chart_of_account_list={chart_of_account_list}
									generateReport={(value) => {
										this.generateReport(value);
									}}
								/>
							</div>
							<CardBody id="section-to-print">
							<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A3"
									fileName="Receivable Invoice Details.pdf"
								>

<div style={{										
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: '1rem'}}>
									<div className="logo-container" style={{	
									width:'150px',}}>
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
									<div className="text-center" style={{justifyContent:'center'}} >
								
										<h2>
										{company_profile &&
											company_profile['companyName']
												? company_profile['companyName']
												: ''}
											</h2>	
											<div  className="ml-4" >
												<b style ={{ fontSize: '18px'}}>{strings.Receivable+" "+strings.Invoice+" "+strings.Details}</b>
												<br/>
												
												{strings.From} {(initValue.startDate).replaceAll("/","-")} {strings.To} {initValue.endDate.replaceAll("/","-")} 

											</div>	
									</div>
									<div className='mr-3'>
								
								
									
									</div>									
							</div>
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
												<thead>
													<tr className="header-row">
														{this.columnHeader.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' ,textAlign:'center', color:'black'}}
																	className={column.align ? 'text-center' : ''}
																	className="table-header-bg"
																>
																	<span>{column.label}</span>
																	{/* // onClick={() => { column.sort && this.onSort(column.value) }} */}
																	{/* {column.sort && <span className="fa fa-sort sort-container">
                                <span className={column.sort ? this.setArrow(column.value) : ''}></span>
                                </span>} */}
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{this.state.receivbaleInvoiceDetailsList.resultObject && 
													this.state.receivbaleInvoiceDetailsList.resultObject.length > 0 ? (
														this.state.receivbaleInvoiceDetailsList.resultObject.map(
															(item, index) => {
																return (
																	<>
																		<tr
																			style={{ background: '#f7f7f7' }}
																			key={index}
																		>
																			<td colSpan="9">
																				<b style={{ fontWeight: '600' }}>
																					{item[0]['invoiceNumber']}
																				</b>
																			</td>
																		</tr>
																		{/* <tr>
                              <td>As On 01/01/2020 </td>
                              <td colSpan="5">Opening Balance</td>
                              <td></td>
                              <td>0.00</td>
                              <td></td>
                            </tr> */}
																		{item.map((row, index) => {
																			return (
																				<tr key={index}>
																					<td style={{ width: '12%', textAlign:'center'}}>
																					{row.invoiceDate ? (
																							moment(row.invoiceDate).format('DD-MM-YYYY')
																						) : (" ")}
																					</td>
																					<td style={{ width: '12%', textAlign:'center'}}>
																						{/* {row.transactionTypeName} */}
																						{row['invoiceNumber']}
																					</td>
																					<td style={{ width: '12%', textAlign:'center'}}>
																						{/* {row['name']} */}
																						{row['productName']}
																					</td>
																					<td style={{ width: '12%', textAlign:'center'}}>
																						{/* {row['postingReferenceTypeEnum']} */}
																						{row['description']}
																					</td>
																					<td style={{ width: '12%', textAlign:'center' }}>
																						{row['quantity']}
																					</td>
																					<td style={{ width: '12%', textAlign:'center' }}>
																						{row['unitPrice']}
																					</td>
																					{/* <td style={{ width: '12%' }}>
																						{row['discount']}
																					</td> */}
																					
																						<td style={{ width: '12%' }}>
																							{row.vatAmount > 0 && (row.unitPrice ? (
																									""
																								) : (
																									<p
																									className="text-center"
																									// onClick={() =>
																									// 	this.getInvoice(
																									// 		row[
																									// 			'postingReferenceType'
																									// 		],
																									// 		row['invoiceType'],
																									// 		row['referenceId'],
																									// 	)
																									// }
																								>
																									<Currency
																										value={ row.vatAmount }
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																								</p>
																								)


																								
																							)}
																						</td>
																						<td style={{ width: '12%' }}>
																							{row.totalAmount > 0 && (
																								<p
																									className="text-center"
																									// onClick={() =>
																									// 	this.getInvoice(
																									// 		row[
																									// 			'postingReferenceType'
																									// 		],
																									// 		row['invoiceType'],
																									// 		row['referenceId'],
																									// 	)
																									// }
																								>
																									<Currency
																										value={row.totalAmount }
																										currencySymbol={
																											universal_currency_list[0]
																												? universal_currency_list[0]
																														.currencyIsoCode
																												: 'INR'
																										}
																									/>
																								</p>
																							)}
																						</td>
																						
																					

																				
																				
																				</tr>
																			);
																		})}
																		{/* <tr>
                              <td>As On 31/01/2020 </td>
                              <td colSpan="5">Closing Balance</td>
                              <td>0.00</td>
                              <td></td>
                              <td></td>
                            </tr> */}
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
)(ReceivableInvoiceDetailsReport);
