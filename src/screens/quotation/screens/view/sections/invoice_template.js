import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import { toInteger, upperCase } from 'lodash';
import { textAlign } from '@material-ui/system';
var converter = require('number-to-words');

class RFQTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	getRibbonColor = (QuotationData) => {
		if (QuotationData.status == 'Draft') {
			return 'pending-color';
		} else if (QuotationData.status == 'Sent') {
			return 'saved-color';
		} else {
			return 'saved-color';
		}
	};

	render() {
		const { QuotationData, currencyData, totalNet, companyData } = this.props;
		return (
			<div>
				<Card id="singlePage" className="box">
					<div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							QuotationData,
						)}`}
					>
						<span>{QuotationData.status}</span>
					</div>

					<CardBody style={{ marginTop: '7rem' }}>
					<div 
							style={{
								width: '100%',
								height:"210px",
								border:'1px solid',
								padding:'7px',borderColor:'#c8ced3'
							}}
						>
							<div className="text-center mt-1 "><h4><b> Quotation Details</b></h4></div>
							<div className="text-center">
									<img
										src={
											companyData &&
											companyData.company &&
											companyData.company.companyLogo
												? 'data:image/jpg;base64,' +
												companyData.company.companyLogo
												: logo
										}
										className=""
										alt=""
										style={{ width: ' 250px' }}
						/>
					</div>
					
						<div className="text-center mt-1"><h5>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</h5>
											</div>	
						<div className="text-center"><h4>{QuotationData.poNumber}</h4></div>		
						<div className="text-center mt-1">{QuotationData.customerName}</div>		
					</div>
							
						
							

						<div className="text-center">
						
						<div className="text-center"			>
								<h6
								style={{textAlign: 'center'}}
								className={'mt-3 mb-2'}
								>	Expiration date:{' '}
								{moment(QuotationData.quotaionExpiration).format(
									'DD MMM YYYY',
								)}
								</h6>
								</div>
						
							
						</div>
						<Table  >
							<thead className="header-row">
								<tr>
									<th className="center" style={{ padding: '0.5rem' }}>
										#
									</th>
									{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
									<th style={{ padding: '0.5rem' }}>Product Name</th>
									<th style={{ padding: '0.5rem' }}>Description</th>
									<th className="center" style={{ padding: '0.5rem' }}>
										Quantity
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										Unit Cost
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>Vat</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										Total
									</th>
								</tr>
							</thead>
							<tbody className=" table-bordered table-hover">
								{QuotationData.poQuatationLineItemRequestModelList &&
									QuotationData.poQuatationLineItemRequestModelList.length &&
									QuotationData.poQuatationLineItemRequestModelList.map((item, index) => {
										return (
											<tr key={index}>
												<td className="center">{index + 1}</td>
												<td>{item.productName}</td>
												<td>{item.description}</td>
												<td>{item.quantity}</td>
												<td style={{ textAlign: 'right', width: '20%' }}>
													{/* <Currency
														value={item.unitPrice}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/> */}
												{item.unitPrice}
												</td>
												<td
													style={{ textAlign: 'right' }}
												>{`${item.vatPercentage}%`}</td>
												<td style={{ textAlign: 'right' }}>
													{/* <Currency
														value={item.subTotal}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/> */}
													{item.subTotal}
												</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
						<div className="pl-5"
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '1rem',border:'solid 1px',borderColor:'#c8ced3'
							}}
						>
								<div
								style={{
									width: '200%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
								}}
							>
								<div className="pb-2">Amount In Words:<br/>
									<b> {upperCase(converter.toWords(toInteger(QuotationData.totalAmount)))+" ONLY"}
									{/* <b> {parseInt(QuotationData.dueAmount)} */}
									</b></div>
								<div className="pb-2">VAT Amount In Words:
										<br/>
									<b> {upperCase(converter.toWords(toInteger(QuotationData.totalVatAmount)))+" ONLY"}</b>
									{/* <b> {QuotationData.totalVatAmount}</b> */}
								</div>
							<div style={{borderTop:'1px solid',borderColor:'#c8ced3'}}>

								<h6 className="mb-0 pt-2">
									<b>Notes:</b>
								</h6>
								<h6 className="mb-0">{QuotationData.notes}</h6>
							</div>
							
							</div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div style={{ width: '100%' }}>
								<Table className="table-clear cal-table">
									<tbody>
										<tr >
											<td style={{ width: '60%' }}>
												<strong>Subtotal</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{totalNet}
													 {/* ? (
														<Currency
															value={totalNet.toFixed(2)}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'USD'
															}
														/>
													) : (
														<Currency
															value={0}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'USD'
															}
														/>
													)} */}
												</span>
											</td>
										</tr>
										<tr >
											<td style={{ width: '60%' }}>
												<strong>VAT</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{QuotationData.totalVatAmount }
													{/* ? (
														<Currency
															value={QuotationData.totalVatAmount.toFixed(2)}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'USD'
															}
														/>
													) : (
														<Currency
															value={0}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'USD'
															}
														/>
													)} */}
												</span>
											</td>
										</tr>
										<tr >
											<td style={{ width: '60%' }}>
												<strong>Total</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{QuotationData.totalAmount}
													 {/* ? (
														<Currency
															value={QuotationData.totalAmount.toFixed(2)}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'USD'
															}
														/>
													) : (
														<Currency
															value={0}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'USD'
															}
														/>
													)} */}
												</span>
											</td>
										</tr>
									</tbody>
								</Table>
								</div>		
							</div>
						</div>												
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default RFQTemplate;
