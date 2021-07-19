import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import { toInteger, upperCase } from 'lodash';
import {data}  from '../../../../Language/index'
import LocalizedStrings from 'react-localization';

var converter = require('number-to-words');
let strings = new LocalizedStrings(data);
class InvoiceTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language'),};
	}

	
	renderInvoiceStatus = (status) => {
		let classname = '';
		if (status === 'Paid') {
			classname = 'label-success';
		} else if (status === 'Draft') {
			classname = 'label-currency';
		} else if (status === 'Partially Paid') {
			classname = 'label-PartiallyPaid';
		} else if (status === 'Due Today') {
			classname = 'label-due';
		} else {
			classname = 'label-overdue';
		}
		return (
			<span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
				{status}
			</span>
		);
	};

	render() {
		strings.setLanguage(this.state.language);
		const { invoiceData, currencyData, totalNet, companyData,status } = this.props;
		return (
			<div>
				<Card id="singlePage" className="box">
					{/* <div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							invoiceData,
						)}`}
					>
						<span>{invoiceData.status}</span>
					</div> */}

					<CardBody style={{ marginTop: '1rem' }}>
						<div
							style={{
								width: '100%',
								display: 'flex',
								border:'1px solid',
								padding:'7px',borderColor:'#c8ced3'
							}}
						>
							<div style={{ width: '150%' }}>
								<div className="companyDetails">
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
										style={{ width: ' 100px' }}
									/>
								
									{/* <h3 style={{ fontWeight: '600' }} className="mb-0">
										{companyData && companyData.company
											? companyData.company.companyName
											: ''}
									</h3> */}
									{/* <h6 className="mb-0">
										<span>
											{companyData &&
												companyData.company &&
												companyData.company.invoicingAddressLine1 &&
												`${companyData.company.invoicingAddressLine1},`}
										</span>
										<br />
										<span>
											{companyData &&
												companyData.company &&
												companyData.company.invoicingAddressLine2 &&
												`${companyData.company.invoicingAddressLine2},`}
										</span>
										<span>
											{companyData &&
												companyData.company &&
												companyData.company.invoicingAddressLine3 &&
												`${companyData.company.invoicingAddressLine3}.`}
										</span>
									</h6>
									<h6>
										{companyData &&
										companyData.company &&
										companyData.company.companyCountryCode
											? companyData.company.companyCountryCode
													.countryDescription
											: ''}
									</h6> */}
								</div>
							</div>
							<div style={{ width: '130%',justifyContent:'center' }}>
								<table>
									<tbody>
									<tr style={{
										width: '50%',
										margin:'0.5rem',
										marginTop:'2.5rem',
										marginLeft:'6rem'
									}}>
												<td
													style={{
														width: '130%',
														fontSize: '2rem',
														fontWeight: '700',
														textTransform: 'uppercase',
														color: 'black',
													}}
												>
													{strings.Invoice }
												</td>
											</tr>
									</tbody>
								</table>
							</div>
							<div
								style={{
									width: '70%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'right',
								}}
							>
								{/* <div style={{ width: '70%' }}></div> */}
								{/* <div 	style={{
									alignContent:'left',
									justifyContent: 'right',
								}}> */}
								{/* <Table className="table-clear mr-3 ">
									<tbody>
										<tr  style={{ textAlign: 'left' }}><h4>
											
										{companyData && companyData.company
											? companyData.company.companyName
											: ''}
								</h4></tr>
										<tr style={{ textAlign: 'left' }}>
											<td style={{ width: '75%' }} className="p-0">
												# {invoiceData.referenceNumber}
											</td>
										</tr>
										<tr style={{ textAlign: 'left', }}>
											<td style={{ width: '75%' }} className="p-0">
												{' '}
												Balance Due
											
												<b
													style={{
														fontWeight: '600',
													}}
												>
													<span
														style={{
															unicodeBidi: 'embed',
															paddingRight: '5px',
														}}
													></span>
													{invoiceData.dueAmount ? (
														<Currency
															value={invoiceData.dueAmount}
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
												</b>
											</td>
										</tr>
									</tbody>
								</Table> */}
								<div 	style={{
									width: '62%',
									margin:'0.5rem 4.5rem 0.5rem 6rem',
									// border:'1px solid',
									
								}}>
								<h4 className="mb-1 ml-2"><b>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</b></h4>
								<h6 className="mb-1 ml-2">{strings.Invoice }  # {invoiceData.referenceNumber}</h6>
								<h6 className="mb-1 ml-2"><b>{strings.BalanceDue }:{invoiceData.dueAmount ? (
														<Currency
															value={invoiceData.dueAmount}
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
													)}</b></h6>
														<span className="mb-1 ml-2">{strings.Status } :  {this.renderInvoiceStatus(invoiceData.status)}</span>
								</div>
								</div>
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
							<div style={{
									width: '444%',
									// borderRight:'1px solid',
									// borderBottom:'1px solid',
								}}>
							<div
								style={{
									width: '41%',
									margin:'0.5rem',
									border:'1px solid',borderColor:'#c8ced3'
								}}
							>
								<h6 style={{ fontWeight: '600' }} className="mb-1 mt-1 ml-2">
									<b>{strings.BillTo },</b>
								</h6>
								<h6 className="mb-1 ml-2"><b>{strings.Name }:</b> {invoiceData.name}</h6>
								<div className="mb-1 ml-2"><b>TRN:</b> {invoiceData.taxRegistrationNo}</div>
								<h6 className="mb-1 ml-2"><b>{strings.Company }:</b> {invoiceData.organisationName}</h6>
								<h6 className="mb-1 ml-2"><b>{strings.Email }:</b> {invoiceData.email}</h6>
								<h6 className="mb-3 ml-2"><b>{strings.Address }:</b> {invoiceData.address}</h6>
							</div>
							</div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div style={{ width: '80%' }}>
									<Table className="table table-bordered" style={{width: '90%',margin:'0.5rem',border:'1px solid',width:'250px', textAlign: 'center' ,border:'1px solid',borderColor:'#c8ced3'}}>
										<tbody>
											<tr style={{ textAlign: 'right' }}>
												<td  style={{backgroundColor:'#e3e3e3' ,width:'104px'  }}>{strings.InvoiceDate }</td>
												<td style={{ width:'143px'  }}>
													{' '}
													{moment(invoiceData.invoiceDate).format(
														'DD MMM YYYY',
													)}
												</td>
											</tr>
											<tr style={{ textAlign: 'right',width:'143px' }}>
												<td style={{width:'109px' ,backgroundColor:'#e3e3e3' }}>{strings.Terms }</td>
												<td style={{width:'143px'}}>{invoiceData.term}</td>
											</tr>
											<tr style={{ textAlign: 'right' }}>
												<td style={{width:'104px' ,backgroundColor:'#e3e3e3' }}>{strings.DueDate }</td>
												<td style={{ width:'143px'  }}>
													{moment(invoiceData.invoiceDueDate).format(
														'DD MMM YYYY',
													)}
												</td>
											</tr>
										</tbody>
									</Table>
								</div>
							</div>
						</div>
						<Table  >
							<thead className="header-row">
								<tr>
								    <th className="center" style={{ padding: '0.5rem',    width: "40px" }}>
										#
									</th>
									{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
									<th style={{ padding: '0.5rem' }}>{strings.ProductName }</th>
									<th style={{ padding: '0.5rem' }}>{strings.Description }</th>
									<th className="center" style={{ padding: '0.5rem' }}>
										{strings.Quantity }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.UnitCost }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' ,   width: "60px" }}>{strings.Vat }</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.Total }
									</th>
								</tr>
							</thead>
							<tbody className=" table-bordered table-hover">
								{invoiceData.invoiceLineItems &&
									invoiceData.invoiceLineItems.length &&
									invoiceData.invoiceLineItems.map((item, index) => {
										return (
											<tr key={index}>
												<td className="center">{index + 1}</td>
												<td>{item.productName}</td>
												<td>{item.description}</td>
												<td>{item.quantity}</td>
												<td style={{ textAlign: 'right', width: '20%' }}>
													<Currency
														value={item.unitPrice}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/>
												</td>
												<td
													style={{ textAlign: 'right' }}
												>{`${item.vatPercentage}%`}</td>
												<td style={{ textAlign: 'right' }}>
													<Currency
														value={item.subTotal}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/>
												</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
						<div 
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '1rem',border:'solid 1px',borderColor:'#c8ced3',
								fontSize: "14px"
							}}
						>
								<div
								style={{
									width: '200%',
									display: 'flex',
									flexDirection: 'column',
									
								}}
							>
								<div className="pl-5 pb-2">{strings.AmountInWords }:<br/>
									<b> {upperCase(converter.toWords(toInteger(invoiceData.totalAmount)))+" ONLY"}
									{/* <b> {parseInt(invoiceData.dueAmount)} */}
									</b></div>
								<div className="pl-5 pb-2">{strings.Vat+" "+strings.AmountInWords }:
										<br/>
									<b> {upperCase(converter.toWords(toInteger(invoiceData.totalVatAmount)))+" ONLY"}</b>
									{/* <b> {invoiceData.totalVatAmount}</b> */}
								</div>
							<div className="pl-5" style={{borderTop:'1px solid',borderColor:'#c8ced3'}}>

								<h6 className="mb-0 pt-2">
									<b>{strings.Notes }:</b>
								</h6>
								<h6 className="mb-0">{invoiceData.notes}</h6>
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
											<td style={{ width: '40%' }}>
												<strong>{strings.SubTotal }</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{totalNet ? (
														<Currency
															value={totalNet.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
											</td>
										</tr>
										<tr >
											<td style={{ width: '40%' }}>
												<strong>
													{strings.Discount }
													{invoiceData.discountPercentage
														? `(${invoiceData.discountPercentage}%)`
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
													{invoiceData.discount ? (
														<Currency
															value={invoiceData.discount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
											</td>
										</tr>
										<tr >
											<td style={{ width: '40%' }}>
												<strong>{strings.Vat }</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{invoiceData.totalVatAmount ? (
														<Currency
															value={invoiceData.totalVatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
											</td>
										</tr>
										<tr >
											<td style={{ width: '40%' }}>
												<strong>{strings.Total }</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{invoiceData.totalAmount ? (
														<Currency
															value={invoiceData.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
											</td>
										</tr>
										<tr style={{ background: '#f2f2f2' }}>
											<td style={{ width: '40%' }}>
												<strong>{strings.BalanceDue }</strong>
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
														{invoiceData.dueAmount ? (
															<Currency
																value={invoiceData.dueAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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

export default InvoiceTemplate;
