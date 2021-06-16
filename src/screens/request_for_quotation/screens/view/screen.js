import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col } from 'reactstrap';
import * as SupplierInvoiceDetailActions from './actions';
import * as SupplierInvoiceActions from '../../actions';
import * as RequestForQuotationDetailsAction from '../detail/actions'
import * as RequestForQuotationViewAction from '../view/actions'
import ReactToPrint from 'react-to-print';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';

import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';

import './style.scss';
import { RFQTemplate } from './sections';
import { Card, CardBody, Table } from 'reactstrap';
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
		requestForQuotationDetailsAction: bindActionCreators(
			RequestForQuotationDetailsAction,
			dispatch,
		),
		requestForQuotationViewAction: bindActionCreators(
			RequestForQuotationViewAction,
			dispatch,
		),
		//commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class ViewRequestForQuotation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			RFQData: {},
			PoDataList: {},
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
		if (this.props.location.state && this.props.location.state.id) {
			this.props.requestForQuotationDetailsAction
				.getRFQeById(this.props.location.state.id)
				.then((res) => {
					let val = 0;
					if (res.status === 200) {
						res.data.poQuatationLineItemRequestModelList.map((item) => {
							val = val + item.subTotal;
							return item;
						});
						this.setState(
							{
								RFQData: res.data,
								totalNet: val,
								id: this.props.location.state.id,
							},
							() => {
								// if (this.state.RFQData.currencyCode) {
								// 	this.props.supplierInvoiceActions
								// 		.getCurrencyList()
								// 		.then((res) => {
								// 			if (res.status === 200) {
								// 				const temp = res.data.filter(
								// 					(item) =>
								// 						item.currencyCode ===
								// 						this.state.invoiceData.currencyCode,
								// 				);
								// 				this.setState({
								// 					currencyData: temp,
								// 				});
								// 			}
								// 		});
								// }
							},
						);
					}
				});
				this.props.requestForQuotationViewAction
				.getPoGrnById(this.props.location.state.id)
				.then((res) => {
					
					if (res.status === 200) {
						this.setState(
							{
								PoDataList: res.data,
								
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
		const { RFQData, PoDataList,currencyData, id } = this.state;

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
											style={{color: "black"}}
											onClick={() => {
												this.props.history.push('/admin/expense/request-for-quotation');
											}}
										>
										X
										</Button>
							</div>
							<div>
								<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A3"
								>
									<RFQTemplate
										RFQData={RFQData}
										currencyData={currencyData}
									
										status={this.props.location.state.status}
										ref={(el) => (this.componentRef = el)}
										totalNet={this.state.totalNet}
										companyData={profile}
									/>
								</PDFExport>
							</div>
						</Col>
					</Row>
				<Card>

						
					<div style={{display: this.state.PoDataList.length === 0 ? 'none' : ''}} >
							<Table  >
							<thead style={{backgroundColor:'#2064d8',color:'white'}}>
								<tr>
									<th className="center" style={{ padding: '0.5rem' }}>
										#
									</th>
									{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
									<th style={{ padding: '0.5rem' }}>Po Number</th>
									<th style={{ padding: '0.5rem' }}>Supplier Name</th>
									<th style={{ padding: '0.5rem' }}>Status</th>
									<th className="center" style={{ padding: '0.5rem' }}>
										Po Date
									</th>
									<th className="center" style={{ padding: '0.5rem' }}>
										Po Expiry Date
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'left' }}>
									TOTAL Amount
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'left' }}>
									TOTAL Vat Amount
									</th>
								
								</tr>
							</thead>
							<tbody className=" table-bordered table-hover">
								{PoDataList &&
									PoDataList.length &&
									PoDataList.map((item, index) => {
										return (
											<tr key={index}>
												<td className="center">{index + 1}</td>
												<td>{item.poNumber}</td>
												<td>{item.supplierName}</td>
												<td>{item.status}</td>
												<td>{moment(item.poApproveDate).format(
									'DD MMM YYYY',
								)}</td>
									<td>{moment(item.poReceiveDate).format(
									'DD MMM YYYY',
								)}</td>
												<td>{item.totalAmount}</td>
												<td>{item.totalVatAmount}</td>
											
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequestForQuotation);
