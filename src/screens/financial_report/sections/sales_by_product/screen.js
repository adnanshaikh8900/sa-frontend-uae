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
import * as XLSX from 'xlsx';
import { Loader, Currency } from 'components';
import * as FinancialReportActions from '../../actions';
import FilterComponent2 from '../filterComponet2';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.scss';
import logo from 'assets/images/brand/logo.png';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import FilterComponent3 from '../filterComponent3';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.common.company_profile,
		sales_by_item: state.reports.sales_by_item,
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
class SalesByProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			customPeriod: 'customRange',
			dropdownOpen: false,
			hideAsOn: true,
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
			data:[],
		};
	
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
			.getSalesByProduct(postData)
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
		  XLSX.writeFile(wb, fn || ('Sales By Product Report.'+ (type || 'csv')));

	   }

	   exportExcelFile  = () => 
	   {   let dl =""
		   let fn =""
		   let type="xlsx"
		   var elt = document.getElementById('tbl_exporttable_to_xls');												
		   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });		
		   return dl ?
			 XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
			 XLSX.writeFile(wb, fn || ('Sales By Product Report.'+ (type || 'xlsx')));
   
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
	rendertotalAmountForAProduct = (cell, row, extraData) => {
		return row.totalAmountForAProduct === 0 ? (
			<Currency
				value={row.totalAmountForAProduct}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			<Currency
				value={row.totalAmountForAProduct}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		);
		
	};
	renderaverageAmount = (cell, row, extraData) => {
		return row.averageAmount === 0 ? (
			<Currency
				value={row.averageAmount}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		) : (
			<Currency
				value={row.averageAmount}
				currencySymbol={extraData[0] ? extraData[0].currencyIsoCode : 'USD'}
			/>
		);
		
	};

	hideExportOptionsFunctionality = (val) => {
		this.setState({ hideExportOptions: val });
	}

	render() {
		strings.setLanguage(this.state.language);
		const { loading, initValue, dropdownOpen, csvData, view, hideAsOn, customPeriod } = this.state;
		const { profile, universal_currency_list,company_profile,sales_by_item } = this.props;
		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
					<Card>
						<div>
						{!this.state.hideExportOptions &&
										<div
											className="h4 mb-0 d-flex align-items-center pull-right"
											style={{ justifyContent: 'space-between',marginRight: '20px', marginTop: '55px' }}
										>
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
									}
							 <CardHeader>
							<FilterComponent3
									hideExportOptionsFunctionality={(val) => this.hideExportOptionsFunctionality(val)}
									customPeriod={customPeriod}
									hideAsOn={hideAsOn}
									viewFilter={this.viewFilter}
									generateReport={(value) => {
										this.generateReport(value);
									}}
									setCutomPeriod={(value) => {
										this.setState({ customPeriod: value })
									}}
									handleCancel={() => {
										if (customPeriod === 'customRange') {
										const currentDate = moment();
										this.setState(prevState => ({
										initValue: {
										...prevState.initValue,
										endDate: currentDate,            }
										 }));
										this.generateReport({ endDate: currentDate });
										}
										this.setState({ customPeriod: 'customRange' });
										}}
								/>
							</CardHeader>
									<CardBody id="section-to-print">
									<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A3"
									fileName="Sales By Product.pdf"
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
											<b style ={{ fontSize: '18px'}}>{strings.SalesByProduct}</b>
											<br style={{ marginBottom: '5px' }} />
											{customPeriod === 'asOn' ? `${strings.Ason} ${initValue.endDate.replaceAll("/", "-")}`
											 : `${strings.From} ${initValue.startDate.replaceAll("/", "-")} to ${initValue.endDate.replaceAll("/", "-")}`}
										
									</div>
									<div>
									</div>									
							</div>
									{loading ? (
										<Loader />
									) : (
										<div id="tbl_exporttable_to_xls" className="table-wrapper">
													<Table className="table-bordered" >
												<thead className="table-header-bg">
													<tr >
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.ProductName}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center', color:'black' }}>{strings.QuantitySold}</th>
														<th style={{ padding: '0.5rem', textAlign: 'right', color:'black' }}>{strings.Total+" "+strings.Amount}</th>
														<th style={{ padding: '0.5rem', textAlign: 'right', color:'black' }}>{strings.Average+" "+strings.Amount}</th>

													</tr>
												</thead>
												<tbody className=" table-bordered table-hover">
													{this.state.data.salesByProductModelList &&
														this.state.data.salesByProductModelList.map((item, index) => {
															return (
																<tr key={index}>


																	<td style={{ textAlign: 'center', width: '20%' }}>{item.productName}</td>
																	<td style={{ textAlign: 'center', width: '20%' }}>{item.quantitySold}</td>
																	<td style={{ textAlign: 'right', width: '20%' }}>
																		<Currency
																			value={item.totalAmountForAProduct}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0].currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>

																	<td style={{ textAlign: 'right', width: '20%' }}>
																		<Currency
																			value={item.averageAmount}
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
)(SalesByProduct);
