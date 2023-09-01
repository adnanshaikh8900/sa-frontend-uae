import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Card, Table } from 'reactstrap';
import * as SupplierInvoiceDetailActions from './actions';
import * as SupplierInvoiceActions from '../../actions';
import ReactToPrint from 'react-to-print';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';
import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';
import './style.scss';
import { InvoiceTemplate } from './sections';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import { Currency } from 'components';
import moment from 'moment';
const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		supplierInvoiceActions: bindActionCreators(
			SupplierInvoiceActions,
			dispatch,
		),
		supplierInvoiceDetailActions: bindActionCreators(
			SupplierInvoiceDetailActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};
let strings = new LocalizedStrings(data);

class ViewCustomerInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			invoiceData: {},
			isBillingAndShippingAddressSame: false,
			totalNet: 0,
			currencyData: {},
			id: '',
			creditNoteDataList: [],
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

		this.props.supplierInvoiceDetailActions
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

			this.props.supplierInvoiceDetailActions
				.getInvoiceById(this.props.location.state.id)
				.then((res) => {
					let val = 0;
					if (!this.props.location.state.contactId)
						this.props.supplierInvoiceDetailActions
							.getContactById(res.data.contactId)
							.then((res) => {
								if (res.status === 200) {
									this.setState({
										contactData: res.data,
										isBillingAndShippingAddressSame: res.data.isBillingAndShippingAddressSame
									});
								}
							});
					if (res.status === 200) {
						res.data.invoiceLineItems &&
							res.data.invoiceLineItems.map((item) => {
								val = val + item.subTotal;
								return item;
							});
						this.setState(
							{
								invoiceData: res.data,
								totalNet: val,
								id: this.props.location.state.id,
							},
							() => {
								if (this.state.invoiceData.currencyCode) {
									this.props.supplierInvoiceActions
										.getCurrencyList()
										.then((res) => {
											if (res.status === 200) {
												const temp = res.data.filter(
													(item) =>
														item.currencyCode ===
														this.state.invoiceData.currencyCode,
												);
												this.setState({
													currencyData: temp,
												});
											}
										});
								}
								if (this.state.invoiceData.contactId) {

								}
							},
						);
					}
				});
			if (this.props.location.state.contactId)
				this.props.supplierInvoiceDetailActions
					.getContactById(this.props.location.state.contactId)
					.then((res) => {
						if (res.status === 200) {
							this.setState({
								contactData: res.data,
								isBillingAndShippingAddressSame: res.data.isBillingAndShippingAddressSame
							});
						}
					});
			this.props.commonActions
				.getByNoteListByInvoiceId(this.props.location.state.id)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							creditNoteDataList: res.data,
						},);
					}
				})
		}
	};

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};
	redirectToCreditNote = (creditNote) => {
		this.props.history.push('/admin/income/credit-notes/view', {
			CI_id: this.props.location.state.id,
			CI_status: this.props.location.state.status,
			CI_contactId: this.props.location.state.contactId,
			id: creditNote.creditNoteId,
			isCNWithoutProduct: creditNote.isCreatedWithoutInvoice,
			status: creditNote.status,
		});
	}
	render() {
		strings.setLanguage(this.state.language);
		const { invoiceData, currencyData, id, contactData, isBillingAndShippingAddressSame, creditNoteDataList } = this.state;
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

										if (this.props.location.state && this.props.location.state.crossLinked &&
											this.props.location.state.crossLinked == true)
											this.props.history.push('/admin/report/vatreports/vatreturnsubreports', {
												boxNo: this.props.location.state.description,
												description: this.props.location.state.description,
												startDate: this.props.location.state.startDate,
												endDate: this.props.location.state.endDate,
												placeOfSupplyId: this.props.location.state.placeOfSupplyId
											});
										if (this.props.location.state.TCN_Id)
											this.props.history.push('/admin/income/credit-notes/view', {
												id: this.props.location.state.TCN_Id,
												status: this.props.location.state.TCN_Status,
												isCNWithoutProduct: this.props.location.state.TCN_WithoutPRoduct
											})
										else
											this.props.history.push('/admin/income/customer-invoice');

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
									fileName={invoiceData.referenceNumber + ".pdf"}
								>
									<InvoiceTemplate
										invoiceData={invoiceData}
										contactData={contactData}
										isBillingAndShippingAddressSame={isBillingAndShippingAddressSame}
										status={this.props.location.state.status}
										currencyData={currencyData}
										ref={(el) => (this.componentRef = el)}
										totalNet={this.state.totalNet}
										companyData={this.state && this.state.companyData ? this.state.companyData : ''}

									/>
								</PDFExport>
							</div>
						</Col>
					</Row>
					<div style={{ display: this.state.creditNoteDataList.creditNoteId ? '' : 'none' }}><strong>{strings.CreditNoteIssuedonCustomerInvoice}</strong></div>
					<Card>

						<div style={{ display: this.state.creditNoteDataList.creditNoteId ? '' : 'none' }} >
							<Table  >
								<thead style={{ backgroundColor: '#2064d8', color: 'white' }}>
									<tr>
										<th className="center" style={{ padding: '0.5rem' }}>#</th>
										<th style={{ padding: '0.5rem' }}>{strings.CreditNoteNumber}</th>
										<th style={{ padding: '0.5rem' }}>{strings.CreditNoteDate}</th>
										<th style={{ padding: '0.5rem' }}>{strings.Status}</th>
										<th style={{ padding: '0.5rem', textAlign: 'right' }}>{strings.CreditAmount}</th>
									</tr>
								</thead>
								<tbody className=" table-bordered table-hover">
									<tr onClick={() => {
										this.redirectToCreditNote(creditNoteDataList);
									}}>
										<td className="center">{1}</td>
										<td>{creditNoteDataList.creditNoteNumber}</td>
										<td>{creditNoteDataList.creditNoteDate ? moment(creditNoteDataList.creditNoteDate).format('DD-MM-YYYY') : ''}</td>
										<td align="right">{creditNoteDataList?.status}</td>
										<td align="right">
											{creditNoteDataList.totalAmount ? <Currency
												value={creditNoteDataList.totalAmount}
												currencySymbol={
													currencyData[0]
														? currencyData[0].currencyIsoCode
														: 'AED'
												}
											/> : '0.00'}
										</td>
									</tr>

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
)(ViewCustomerInvoice);
