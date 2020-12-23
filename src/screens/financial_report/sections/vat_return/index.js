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

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
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


class VatReturnsReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			dropdownOpen: false,
			view: false,
			// initValue: {
			// 	startDate: moment().startOf('month').format('DD/MM/YYYY'),
			// 	endDate: moment().endOf('month').format('DD/MM/YYYY'),
			// 	reportBasis: 'ACCRUAL',
			// 	chartOfAccountId: '',
			// },
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			data: [
				{
					Box: '1a',
					Description: 'Standard rated supplies in Abu Dhabi',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: '1b',
					Description: 'Standard rated supplies in Dubai',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: '1c',
					Description: 'Standard rated supplies in Sharjah',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				 {
					Box: '1d',
					Description: 'Standard rated supplies in Ajman',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: '1e',
					Description: 'Standard rated supplies in Umm Al Quwain',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: '1f',
					Description: 'Standard rated supplies in Ras Al Khaimah',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				 {
					Box: "1g",
					Description: 'Standard rated supplies in Fujairah',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: 2,
					Description: 'Tax Refunds provided to Tourists under the Tax Refundsfor Tourists Scheme',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: 3,
					Description: 'Supplies subject to the reverse charge provisions',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				 {
					Box: 4,
					Description: 'Zero rated supplies',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				 {
					Box: 5,
					Description: 'Exempt supplies',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: 6,
					Description: 'Goods imported into the UAE',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: 7,
					Description: 'Adjustments and additions to goods imported into theUAE',
					Amount: 0.0,
					VATAmount: 0.0,
					Adjustment: 0.0,
				 },
				 {
					Box: 8,
					Description: 'TOTAL',
					Amount:'',
					VATAmount: 0.0,
					Adjustment: 0.0,
				 }
			],
			data1: [
				{
					Box: 9,
					Description: 'Standard rated expenses',
					Amount: 0.0,
					RecoverableVATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: 10,
					Description: 'Supplies subject to the reverse charge provisions',
					Amount: 0.0,
					RecoverableVATAmount: 0.0,
					Adjustment: 0.0,
				 },
				{
					Box: 11,
					Description: 'Totals',
					Amount: 0.0,
					RecoverableVATAmount: 0.0,
					Adjustment: 0.0,
				 }
				
			],

			data2: [
				{
					Box: 12,
					Description: 'Total value of due tax for the period',
					VATAmount: 0.0,
				
				 },
				{
					Box: 13,
					Description: 'Total value of recoverable tax for the period',
					VATAmount: 0.0,
					
				 },
				{
					Box: 14,
					Description: 'Net VAT payable (or reclaimable) for the period',
					VATAmount: 0.0,
					
				 },
				 {
					Box: 15,
					Description: 'Do you wish to request a refund for the above amount of reclaimable VAT?',
					VATAmount: '',
					
				 }
				
			],
				
		};
		this.columnHeader1 = [
			{ label: 'Box#', value: 'Box#', sort: false },
			{ label: 'Description', value: 'Description', sort: false },
			{ label: 'Amount', value: 'Amount', sort: false },
			{ label: 'VAT Amount', value: 'VATAmount', sort: false },
			{ label: 'Adjustment', value: 'Adjustment', sort: false },
		];
		this.columnHeader2 = [
			{ label: 'Box#', value: 'Box#', sort: false },
			{ label: 'Description', value: 'Description', sort: false },
			{ label: 'Amount', value: 'Amount', sort: false },
			{ label: 'Recoverable VAT Amount', value: 'RecoverableVATAmount', sort: false },
			{ label: 'Adjustment', value: 'Adjustment', sort: false },
		];
		this.columnHeader3 = [
			{ label: 'Box#cd froncd ', value: 'Box#', sort: false },
			{ label: 'Description', value: 'Description', sort: false },
			{ label: 'VAT Amount', value: 'VAT Amount', sort: false },
		];
	}

	generateReport = (value) => {
		this.setState(
			{
				// initValue: {
				// 	endDate: moment(value.endDate).format('DD/MM/YYYY'),
				// },
				loading: true,
				view: !this.state.view,
			},
			() => {
				this.initializeData();
			},
		);
	};

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		const { initValue } = this.state;
		// const postData = {
		// 	startDate: initValue.startDate,
		// 	endDate: initValue.endDate,
		// };
		
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

	render() {
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list } = this.props;
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
												>
													<i className="fa fa-print"></i>
												</div>
												<Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
													<DropdownToggle caret>Export As</DropdownToggle>
													<DropdownMenu>
														<DropdownItem onClick={this.exportPDFWithComponent}>
															Pdf
														</DropdownItem>
														<DropdownItem>
															<CSVLink
																data={csvData}
																className="csv-btn"
																filename={'balancesheet.csv'}
															>
																CSV (Comma Separated Value)
															</CSVLink>
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(csvData, 'balancesheet', 'xls');
															}}
														>
															XLS (Microsoft Excel 1997-2004 Compatible)
														</DropdownItem>
														<DropdownItem
															onClick={() => {
																this.exportFile(
																	csvData,
																	'balancesheet',
																	'xlsx',
																);
															}}
														>
															XLSX (Microsoft Excel)
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
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
								>
									<div style={{ textAlign: 'center', margin: '3rem 0' }}>
										<p>
											{profile &&
											profile.company &&
											profile.company['companyName']
												? profile.company['companyName']
												: ''}
											<br style={{ marginBottom: '5px' }} />
											Vat Returns
											<br style={{ marginBottom: '5px' }} />
											{/* From {initValue.startDate} to {initValue.endDate} */}
										</p>
									</div>
									{loading ? (
										<Loader />
									) : (
										<div className="table-wrapper">
											<p><b>VAT on Sales and all other Outputs</b></p>
											<Table responsive className="table-bordered">
												<thead className="thead-dark table-custom-head">
													<tr className="header-row">
														{this.columnHeader1.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' }}
																	className={column.align ? 'text-right' : ''}
																>
																	{column.label}
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
												
													{(this.state.data).map(
																(item) => (
																	<tr className="mainLable">
																		<td className="mainLable">{item.Box}</td>
																		<td className="pt-0 pb-0">{item.Description}</td>
																		<td className="pt-0 pb-0">{item.Amount}</td>
																		<td className="pt-0 pb-0">{item.VATAmount}</td>
																		<td className="pt-0 pb-0">{item.Adjustment}</td>
																	</tr>
																),
															)}
															
															
												</tbody>
											</Table>
												<p><b>VAT on Expenses and all other Inputs</b></p>
												<Table responsive className="table-bordered">
													<thead className="thead-dark table-custom-head">
													<tr className="header-row">
														{this.columnHeader2.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' }}
																	className={column.align ? 'text-right' : ''}
																>
																	{column.label}
																</th>
															);
														})}
													</tr>
													</thead>
													<tbody className="data-column">
													{(this.state.data1).map(
																(item) => (
																	<tr className="mainLable">
																		<td className="mainLable">{item.Box}</td>
																		<td className="pt-0 pb-0">{item.Description}</td>
																		<td className="pt-0 pb-0">{item.Amount}</td>
																		<td className="pt-0 pb-0">{item.RecoverableVATAmount}</td>
																		<td className="pt-0 pb-0">{item.Adjustment}</td>
																	</tr>
																),
															)}
													</tbody>
												</Table>
											
											<div >
												<p><b>Net VAT due</b></p>
												<Table responsive className="table-bordered">
												<thead className="thead-dark table-custom-head">
													<tr className="header-row">
														{this.columnHeader3.map((column, index) => {
															return (
																<th
																	key={index}
																	style={{ fontWeight: '600' }}
																	className={column.align ? 'text-right' : ''}
																>
																	{column.label}
																</th>
															);
														})}
													</tr>
												</thead>
												<tbody className="data-column">
													{(this.state.data2).map(
																(item) => (
																	<tr className="mainLable">
																		<td className="mainLable">{item.Box}</td>
																		<td className="pt-0 pb-0">{item.Description}</td>
																		<td className="pt-0 pb-0">{item.VATAmount}</td>
																	</tr>
																),
															)}
													</tbody>
												</Table>
											</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VatReturnsReport);
