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

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.common.company_profile,	
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

class ReceivableInvoiceDetailsReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
			{ label: 'invoiceDate', value: 'invoiceDate' },
			{ label: 'invoiceNumber', value: 'invoiceNumber' },
			
			{ label: 'productCode', value: 'productCode'},
			{
				label: 'description',
				value: 'description',
				sort: true,
			},
			{ label: 'quantity', value: 'quantity', sort: true },
			{ label: 'unitPrice', value: 'unitPrice', sort: false,align: 'right'  },
			{ label: 'discount', value: 'discount', sort: false, align: 'left' },
			{ label: 'vatAmount', value: 'vatAmount', sort: false, align: 'left' },
			{ label: 'totalAmount', value: 'totalAmount', sort: false, align: 'left' },
		];
	}

	componentDidMount = () => {
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
			debugger
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

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					startDate: moment(value.startDate).format('DD/MM/YYYY'),
					endDate: moment(value.endDate).format('DD/MM/YYYY'),
					reportBasis: value.reportBasis.value,
					chartOfAccountId: value.chartOfAccountId.value,
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
						? moment(a[`${column}`], 'DD/MM/YYYY').toDate()
						: '';
					nameB = b[`${column}`]
						? moment(b[`${column}`], 'DD/MM/YYYY').toDate()
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
													<i className="fa fa-cog mr-2"></i>Customize Report
												</p>
											</div>
											<div className="d-flex">
												<div
													className="mr-2 print-btn-cont"
													onClick={() => window.print()}
													style={{
														cursor: 'pointer',
														}}
												>
													<i className="fa fa-print"></i>
												</div>
												<div
												className="mr-2 print-btn-cont"
												onClick={() => {
													this.exportPDFWithComponent();
												}}
												style={{
													cursor: 'pointer',
													}}
												>
												<i className="fa fa-file-pdf-o"></i>
												</div>
												
												<div
													className="mr-2 print-btn-cont"
                                                    onClick={() => {
                                                        this.props.history.push('/admin/report/financial');
                                                    }}
													style={{
														cursor: 'pointer',
														}}
												>
												<span>X</span>
												</div>
                                             
												{/* <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
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
												</Dropdown> */}
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
										filename={'detailGeneralLedger.pdf'}
								>

								<div style={{										
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: '1rem'}}>
									<div className="logo-container" style={{	
									width:'150px',}}>
											<img src={logo} alt="logo" style={{width:'150%'}}/>
									</div>
									<div style={{justifyContent:'center'}} >
								
										<h2>
										{company_profile &&
											company_profile['companyName']
												? company_profile['companyName']
												: ''}
											</h2>	
											<div >
												<b style ={{ fontSize: '18px'}}>Receivable Invoice Detail</b>
												<br/>
												
												From {initValue.startDate} To {initValue.endDate}
											</div>	
									</div>
									<div className='mr-3'>
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
										<div className="table-wrapper">
											<Table responsive>
												<thead>
													<tr className="header-row">
														{this.columnHeader.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' }}
																	className={column.align ? 'text-right' : ''}
																	className="table-header-color"
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
																					<td style={{ width: '12%' }}>
																					{row['invoiceDate']}
																					</td>
																					<td style={{ width: '18%' }}>
																						{/* {row.transactionTypeName} */}
																						{row['invoiceNumber']}
																					</td>
																					<td style={{ width: '13%' }}>
																						{/* {row['name']} */}
																						{row['productCode']}
																					</td>
																					<td style={{ width: '13%' }}>
																						{/* {row['postingReferenceTypeEnum']} */}
																						{row['description']}
																					</td>
																					<td style={{ width: '12%' }}>
																						{row['quantity']}
																					</td>
																					<td style={{ width: '8%' }}>
																						{row['unitPrice']}
																					</td>
																					<td style={{ width: '8%' }}>
																						{row['discount']}
																					</td>
																					
																						<td style={{ width: '15%' }}>
																							{row.vatAmount > 0 && (
																								<p
																									className="text-left"
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
																										value={row.vatAmount.toFixed(
																											2,
																										)}
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
																						<td style={{ width: '15%' }}>
																							{row.totalAmount > 0 && (
																								<p
																									className="text-left"
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
																										value={row.totalAmount.toFixed(
																											2,
																										)}
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
																There is no data to display
															</td>
														</tr>
													)}
												</tbody>
											</Table>
										</div>
									)}
									<div style={{ textAlignLast:'center'}}> Powered By <b>SimpleAccounts</b></div> 
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
