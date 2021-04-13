import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import { toInteger, upperCase } from 'lodash';
var converter = require('number-to-words');

class RFQTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	getRibbonColor = (RFQData) => {
		if (RFQData.status == 'Draft') {
			return 'pending-color';
		} else if (RFQData.status == 'Sent') {
			return 'saved-color';
		} else {
			return 'saved-color';
		}
	};

	render() {
		const { RFQData, currencyData, totalNet, companyData } = this.props;
		return (
			<div>
				<Card id="singlePage" className="box">
					<div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							RFQData,
						)}`}
					>
						<span>{RFQData.status}</span>
					</div>

					<CardBody style={{ marginTop: '7rem' }}>
						<div 
							style={{
								width: '100%',
								height:"270px",
								border:'1px solid',
								padding:'7px',borderColor:'#c8ced3'
							}}
						>
							<div className="text-center mt-1 "><h4><b> Goods Received Note Details</b></h4></div>
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
											<div className="text-center"><h4>{RFQData.grnNumber}</h4></div>		
						<div className="text-center mt-1">{RFQData.supplierName}</div>	
						<div className="text-center mt-1"><u>Receive Date :	{moment(RFQData.grnReceiveDate).format(
									'DD MMM YYYY',
								)}</u></div>		
							</div>
							

						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '1rem',
								borderLeft:'1px solid',
									borderRight:'1px solid',
									borderBottom:'1px solid',borderColor:'#c8ced3'
							}}
						>
							
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
								{RFQData.poQuatationLineItemRequestModelList &&
									RFQData.poQuatationLineItemRequestModelList.length &&
									RFQData.poQuatationLineItemRequestModelList.map((item, index) => {
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
									<b> {upperCase(converter.toWords(toInteger(RFQData.totalVatAmount)))}
									{/* <b> {parseInt(RFQData.dueAmount)} */}
									</b></div>
								<div className="pb-2">VAT Amount In Words:
										<br/>
									<b> {upperCase(converter.toWords(toInteger(RFQData.totalVatAmount)))}</b>
									{/* <b> {RFQData.totalVatAmount}</b> */}
								</div>
							<div style={{borderTop:'1px solid',borderColor:'#c8ced3'}}>

								<h6 className="mb-0 pt-2">
									<b>Notes:</b>
								</h6>
								<h6 className="mb-0">{RFQData.notes}</h6>
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
												<span>{totalNet }
													{/* {totalNet ? (
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
											{/* <td style={{ width: '60%' }}>
												<strong>
													Discount
													{RFQData.discountPercentage
														? `(${RFQData.discountPercentage}%)`
														: ''}
												</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{RFQData.discount ? (
														<Currency
															value={RFQData.discount.toFixed(2)}
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
													)}
												</span>
											</td> */}
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
												{RFQData.totalVatAmount}
													{/* {RFQData.totalVatAmount ? (
														<Currency
															value={RFQData.totalVatAmount.toFixed(2)}
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
												{RFQData.totalAmount }
													{/* {RFQData.totalAmount ? (
														<Currency
															value={RFQData.totalAmount.toFixed(2)}
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
										<tr style={{ background: '#f2f2f2' }}>
											{/* <td style={{ width: '60%' }}>
												<strong>Balance Due</strong>
											</td>
											<td>
												<b
													style={{
														fontWeight: '600',
														display: 'flex',
														justifyContent: 'space-between',
													}}
												>
													<span style={{ marginLeft: '2rem' }}></span>
													<span>
														{RFQData.dueAmount ? (
															<Currency
																value={RFQData.dueAmount.toFixed(2)}
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
														)}
													</span>
												</b>
											</td> */}
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
