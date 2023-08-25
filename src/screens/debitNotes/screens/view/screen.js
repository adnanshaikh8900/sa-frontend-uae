import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Table, Card } from 'reactstrap';

import * as CnViewActions from './actions';
import * as CnActions from '../../actions';
import ReactToPrint from 'react-to-print';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import { Currency } from 'components';
import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';

import './style.scss';
import { DebitNoteTemplate } from './sections';

import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		cnActions: bindActionCreators(
			CnActions,
			dispatch,
		),
		cnViewActions: bindActionCreators(
			CnViewActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
let strings = new LocalizedStrings(data);
class ViewDebitNote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			InvoiceDataList: [],
			cnData: {},
			totalNet: 0,
			currencyData: {},
			id: '',
		};

		this.formRef = React.createRef();
		this.termList = [
			{ label: 'Net 7', value: 'NET_7' },
			{ label: 'Net 10', value: 'NET_10' },
			{ label: 'Net 30', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		this.props.cnViewActions
			.getCompanyDetails()
			.then((res) => {

				if (res.status === 200) {

					this.setState(
						{
							companyData: res.data,
						},

					);
				}
			});
		if (this.props.location.state && this.props.location.state.id) {

			this.props.cnViewActions
				.getCreditNoteById(this.props.location.state.id, this.props.location.state.isCNWithoutProduct)
				.then((res) => {
					let val = 0;
					if (res.status === 200) {
						res.data.invoiceLineItems &&
							res.data.invoiceLineItems.map((item) => {
								val = val + item.subTotal;
								return item;
							});
						this.setState(
							{
								cnData: res.data,
								totalNet: val,
								id: this.props.location.state.id,
							},
							() => {
								if (this.state.cnData.currencyCode) {
									this.props.cnActions
										.getCurrencyList()
										.then((res) => {
											if (res.status === 200) {
												const temp = res.data.filter(
													(item) =>
														item.currencyCode ===
														this.state.cnData.currencyCode,
												);
												this.setState({
													currencyData: temp,
												});
											}
										});
								}
								if (this.state.cnData.contactId) {
									this.props.cnViewActions
										.getContactById(this.state.cnData.contactId)
										.then((res) => {
											if (res.status === 200) {
												this.setState({
													contactData: res.data,
												});
											}
										});
								}
							},
						);
					}
				});


			//
			this.props.cnViewActions
				.getInvoicesForCNById(this.props.location.state.id)
				.then((res) => {

					if (res.status === 200) {
						this.setState(
							{
								InvoiceDataList: res.data,
								id: this.props.location.state.id,
							},
							() => {

							},
						);
					}
				})

		}
	};

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};
	render() {
		strings.setLanguage(this.state.language);
		const { cnData, currencyData, InvoiceDataList, contactData } = this.state;
		const { profile } = this.props;

		return (
			<div className="view-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<div className="pull-right">
								{/* <Button
									className="btn btn-sm edit-btn"
									onClick={() => {
										this.props.history.push(
											'/admin/revenue/customer-invoice/detail',
											{ id },
										);
									}}
								>
									<i className="fa fa-pencil"></i>
								</Button> */}
								<Button
									className="btn-lg mb-1 print-btn-cont"
									onClick={() => {
										this.exportPDFWithComponent();
									}}
								>
									<i className="fa fa-file-pdf-o"></i>
								</Button>
								<ReactToPrint
									trigger={() => (
										<Button type="button" className="ml-1 mb-1 mr-1 print-btn-cont btn-lg">
											<i className="fa fa-print"></i>
										</Button>
									)}
									content={() => this.componentRef}
								/>
								<Button
									type="button"
									className="close-btn mb-1 btn-lg print-btn-cont"

									onClick={() => {
										this.props.history.push('/admin/expense/debit-notes');
									}}
								>
									<i class="fas fa-times"></i>
								</Button>
							</div>
							<div>
								<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A3"
									fileName={cnData.referenceNumber + ".pdf"}
								>
									<DebitNoteTemplate
										cnData={cnData}
										currencyData={currencyData}
										status={this.props.location.state.status}
										ref={(el) => (this.componentRef = el)}
										totalNet={this.state.totalNet}
										companyData={this.state && this.state.companyData ? this.state.companyData : ''}
										contactData={contactData}
										isCNWithoutProduct={this.props.location.state.isCNWithoutProduct && this.props.location.state.isCNWithoutProduct == true ? true : false}
									/>
								</PDFExport>
							</div>
						</Col>
					</Row>
					<Card>


						<div style={{ display: this.state.InvoiceDataList.length === 0 ? 'none' : '' }} >
							<Table  >
								<thead style={{ backgroundColor: '#2064d8', color: 'white' }}>
									<tr>
										<th className="center" style={{ padding: '0.5rem' }}>
											#
										</th>
										{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
										<th style={{ padding: '0.5rem' }}>{strings.InvoiceNumber}</th>
										<th style={{ padding: '0.5rem' }}>{strings.CustomerName}</th>

										{/* <th className="center" style={{ padding: '0.5rem' }}>
										Invoice Date
									</th>
									<th className="center" style={{ padding: '0.5rem' }}>
									Invoice Due Date
									</th> */}
										<th style={{ padding: '0.5rem', textAlign: 'right' }}>
											{strings.Total + " " + strings.Amount}
										</th>
										<th style={{ padding: '0.5rem', textAlign: 'right' }}>
											{strings.TotalVat + " " + strings.Amount}
										</th>

									</tr>
								</thead>
								<tbody className=" table-bordered table-hover">
									{InvoiceDataList &&
										InvoiceDataList.length &&
										InvoiceDataList.map((item, index) => {
											return (
												<tr key={index}>
													<td className="center">{index + 1}</td>
													<td>{item.invoiceNumber}</td>
													<td>{item.contactName}</td>
													{/* 										
												<td>{moment(item.poApproveDate).format(
									'DD MMM YYYY',
								)}</td>
									<td>{moment(item.poReceiveDate).format(
									'DD MMM YYYY',
								)}</td> */}
													<td align="right">{item.totalAmount ? <Currency
														value={item.totalAmount}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/> : 0}</td>

													<td align="right">{item.totalVatAmount ? <Currency
														value={item.totalTaxAmount}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/> : 0}</td>

												</tr>
											);
										})}
								</tbody>
							</Table>
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
)(ViewDebitNote);