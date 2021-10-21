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
import download from 'downloadjs';


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
class ExpenseByCategory extends React.Component {
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
			data: [],

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
			.getExpenseByCategory(postData)
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
		
		// let object = Object.assign([],this.state.data.expenseByCategoryList)
		// let data=[];
		// for(let i=0;i<object.length;i++){
		// 		let o=object[i];
		// 		o=Object.assign([],o);
		// 		data.push(o);
		// }
		// const blob = new Blob(data,{type:'application/csv'});
		// 			download(blob,'Sample Transaction.csv')
		return (this.state && this.state.data && this.state.data.expenseByCategoryList ? this.state.data.expenseByCategoryList :'');
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
		const { profile, universal_currency_list, company_profile, sales_by_customer } = this.props;
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
														
														<DropdownItem>
															<CSVLink
																data={this.exportFile()}
																className="csv-btn"
																filename={'Expense By Category Report.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink>
														</DropdownItem>
														<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
														{/* <DropdownItem
															onClick={() => {
																this.exportFile();
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem> */}
														{/* <DropdownItem
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
									fileName="Expense By Catogery.pdf"
								>
									<div style={{

										display: 'flex',
										justifyContent: 'space-between',
										marginBottom: '1rem'
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
											<br style={{ marginBottom: '5px' }} />
											<b style={{ fontSize: '18px' }}>Expense By Category details</b>
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
														<th style={{ padding: '0.5rem', textAlign: 'center' }}>{strings.TransactionCategory+" "+strings.Name}</th>
													
														<th style={{ padding: '0.5rem', textAlign: 'right' }}>
														{strings.Amount}
														</th>
														<th style={{ padding: '0.5rem', textAlign: 'right' }}>{strings.Amount+" "+strings.WithTax}</th>

													</tr>
												</thead>
												<tbody className=" table-bordered table-hover">
													{this.state.data.expenseByCategoryList &&
														this.state.data.expenseByCategoryList.map((item, index) => {
															return (
																<tr key={index}>


																	<td style={{ textAlign: 'left', width: '60%' }}>{item.transactionCategoryName}</td>
																
																	<td style={{ textAlign: 'right', width: '20%' }}>
																		<Currency
																			value={item.expensesAmountWithoutTaxSum}
																			currencySymbol={
																				universal_currency_list[0]
																					? universal_currency_list[0].currencyIsoCode
																					: 'USD'
																			}
																		/>
																	</td>

																	<td style={{ textAlign: 'right', width: '20%' }}>
																		<Currency
																			value={item.expensesAmountSum}
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
													<td style={{ textAlign: 'left', width: '20%' }}><b>{strings.Total}</b></td>
													
													<td style={{ textAlign: 'right', width: '20%' }}>
													
														<b><Currency
															value={this.state.data.totalAmountWithoutTax}
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
											</Table>
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
)(ExpenseByCategory);
