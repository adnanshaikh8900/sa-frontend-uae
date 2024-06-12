import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import { ReportTables } from 'screens/financial_report/sections'
import moment from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';
import * as XLSX from 'xlsx';
import FilterComponent from './sections/filterComponent';
import { Loader } from 'components';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import * as ExpenseDetailsActions from './actions';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.scss';
import logo from 'assets/images/brand/logo.png';

const mapStateToProps = (state) => {
	return {
		company_profile: state.reports.company_profile,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		expenseDetailsActions: bindActionCreators(
			ExpenseDetailsActions,
			dispatch,
		),
	};
};
let strings = new LocalizedStrings(data);
class ExpenseDetailsReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			dropdownOpen: false,
			expenseDetailsList: {},
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
	}

	componentDidMount = () => {
		this.props.expenseDetailsActions.getCompany()
		this.initializeData();

	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
		this.props.expenseDetailsActions
			.getExpenseDetails(postData)
			.then((res) => {
				if (res.status === 200) {
					let expenseSummaryModelModelList = res.data.expenseSummaryModelModelList
					expenseSummaryModelModelList.push({
						amountWithoutTax: res.data.totalAmountWithoutTax,
						expenseAmount: res.data.totalAmount,
						expenseVatAmount: res.data.totalVatAmount,
						transactionCategoryName: strings.Total,
						isTotalRow: true,
					})
					expenseSummaryModelModelList = expenseSummaryModelModelList.map((row, i) => {
						row.id = i + 1;
						return row
					})
					this.setState({
						expenseSummaryModelModelList: expenseSummaryModelModelList,
						loading: false,
					});
				}
			}).catch((err) => {
				this.setState({ loading: false });
			});
	};

	exportFile = () => {


		let dl = ""
		let fn = ""
		let type = "csv"
		var elt = document.getElementById('tbl_exporttable_to_xls');
		var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
		return dl ?
			XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
			XLSX.writeFile(wb, fn || ('Expense Details Report.' + (type || 'csv')));

	}

	exportExcelFile = () => {
		let dl = ""
		let fn = ""
		let type = "xlsx"
		var elt = document.getElementById('tbl_exporttable_to_xls');
		var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
		return dl ?
			XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
			XLSX.writeFile(wb, fn || ('Expense Details  Report.' + (type || 'xlsx')));

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
	render() {
		strings.setLanguage(this.state.language);
		const {
			loading,
			initValue,
			dropdownOpen,
			expenseSummaryModelModelList,
			view,
			chart_of_account_list,
		} = this.state;
		const { company_profile } = this.props;

		console.log(this.state.expenseDetailsList)
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

														<DropdownItem onClick={() => { this.exportFile() }}>
															<span
																style={{
																	border: 0,
																	padding: 0,
																	backgroundColor: "white !important"
																}}
															>CSV (Comma Separated Value)</span>
														</DropdownItem>
														<DropdownItem onClick={() => { this.exportExcelFile() }}>
															<span
																style={{
																	border: 0,
																	padding: 0,
																	backgroundColor: "white !important"
																}}
															>Excel</span>
														</DropdownItem>
														<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
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
									fileName="Expense Details.pdf"
								>

									<div style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginBottom: '1rem'
									}}>
										<div className="logo-container" style={{
											width: '150px',
										}}>
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
										<div className="text-center" style={{ justifyContent: 'center' }} >

											<h2>
												{company_profile &&
													company_profile['companyName']
													? company_profile['companyName']
													: ''}
											</h2>
											<div className="ml-4" >
												<br style={{ marginBottom: '5px' }} />
												<b style={{ fontSize: '18px' }}>{strings.Expense + " " + strings.Details}</b>
												<br style={{ marginBottom: '5px' }} />

												{strings.From} {(initValue.startDate).replaceAll("/", "-")} {strings.To} {initValue.endDate.replaceAll("/", "-")}
											</div>
										</div>
										<div className='mr-3'>
										</div>
									</div>
									{loading ? (
										<Loader />
									) : (
										<>
										<ReportTables
											reportDataList={expenseSummaryModelModelList}
											reportName={'Expense Details'}
											id={3}
											rowHeight={50}

										/>
									</>
									)}
									<div style={{ textAlignLast: 'center' }}> {strings.PoweredBy}<b>SimpleAccounts</b></div>
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
)(ExpenseDetailsReport);
