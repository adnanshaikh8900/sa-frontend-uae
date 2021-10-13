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
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.reports.company_profile,
		purchase_by_item: state.reports.purchase_by_item,
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
class PurchaseByitem extends React.Component {
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
			.getpurchasebyproduct(postData)
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
		return (this.state && this.state.data && this.state.data.purchaseByProductModelList ? this.state.data.purchaseByProductModelList  :'');
	};


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

	renderAverageAmount = (cell, row, extraData) => {
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
	render() {
		strings.setLanguage(this.state.language);
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list,company_profile,purchase_by_item } = this.props;
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
														{/* <DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem> */}
														<DropdownItem>
															<CSVLink
																data={this.exportFile()}
																className="csv-btn"
																filename={'Purchase By Item Report.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink>
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
									fileName="Purchase By Item.pdf"
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
											<b style ={{ fontSize: '18px'}}>{strings.PurhaseByProduct}</b>
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
													<Table  >
												<thead className="header-row" >
													<tr>
														<th style={{ padding: '0.5rem', textAlign: 'center' }}>{strings.ProductName}</th>
														<th style={{ padding: '0.5rem', textAlign: 'center' }}>{strings.QuantityPurchased}</th>

														<th style={{ padding: '0.5rem', textAlign: 'right' }}>
															{strings.Total+" "+strings.Amount}
														</th>
														<th style={{ padding: '0.5rem', textAlign: 'right' }}>{strings.Average+" "+strings.Amount}</th>

													</tr>
												</thead>
												<tbody className=" table-bordered table-hover">
													{this.state.data.purchaseByProductModelList &&
														this.state.data.purchaseByProductModelList.map((item, index) => {
															return (
																<tr key={index}>


																	<td style={{ textAlign: 'center', width: '20%' }}>{item.productName}</td>
																	<td style={{ textAlign: 'center', width: '20%' }}>{item.quantityPurchased}</td>
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
)(PurchaseByitem);
