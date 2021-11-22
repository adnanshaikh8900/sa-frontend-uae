import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import '../../../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import { toInteger, upperCase } from 'lodash';
import {data}  from '../../../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
const { ToWords } = require('to-words');
const toWords = new ToWords({
	localeCode: 'en-IN',
	converterOptions: {
  //currency: true,
	  ignoreDecimal: false,
	  ignoreZeroCurrency: false,
	  doNotAddOnly: false,
	}
  });
class InvoiceTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language') };
		this.termList = [
			{ label: 'Net 7 Days', value: 'NET_7' },
			{ label: 'Net 10 Days', value: 'NET_10' },
			{ label: 'Net 15 Days', value: 'NET_15' },
			{ label: 'Net 30 Days', value: 'NET_30' },
			{ label: 'Net 45 Days', value: 'NET_45' },
			{ label: 'Net 60 Days', value: 'NET_60' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
	}

	getRibbonColor = (invoiceData) => {
		if (invoiceData.status == 'Draft') {
			return 'pending-color';
		} else if (invoiceData.status == 'Sent') {
			return 'saved-color';
		} else {
			return 'saved-color';
		}
	};
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
	// getTerms=(termData)=>{
	// 	let term='';

	// 	switch(termData){
		
	// 					case 'NET_7':  term="Payment due in 7 days";
	// 					break;

	// 					case 'NET_10': term="Payment due in 7 days";
	// 					break;	

	// 					case 'NET_15': term="Payment due in 7 days";
	// 					break;	

	// 					case 'NET_45': term="Payment due in 7 days";
	// 					break;	
						
	// 					case 'NET_60': term="Payment due in 7 days";
	// 					break;	

	// 					case 'NET_30': term="Payment due in 7 days";
	// 					break;	

	// 					case 'DUE_ON_RECEIPT': term="Due On Receipt";
	// 					break;	
	// 	}
	// 	return(
	// 		<div>{term}</div>
	// 	);
	// }
	getTerms=(term)=>{

		let	val=	this.termList &&
			this.termList.find(
				(option) =>
					option.value === term,
			)
			return val && val.label ? val.label :''
		}
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
											companyData.companyLogoByteArray
												? 'data:image/jpg;base64,' +
												  companyData.companyLogoByteArray
												: logo
										}
										className=""
										alt=""
										style={{ width: ' 100px' }}
									/>
									 <div className="mb-1 ml-2"><b>{strings.CompanyName} : </b> {companyData.companyName}</div>
									<div className="mb-1 ml-2"><b>{strings.CompanyRegistrationNo} : </b> {companyData.companyRegistrationNumber}</div>
									<div className="mb-1 ml-2"><b>{strings.VATRegistrationNo} : </b> {companyData.vatRegistrationNumber}</div>
									<div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b> {companyData.phoneNumber}</div>

								</div>
							</div>
							<div style={{ width: '130%',justifyContent:'center' }}>
							
									<div
										style={{
											width: '130%',
											fontSize: '2rem',
											fontWeight: '700',
											textTransform: 'uppercase',
											color: 'black',
										}}
									>
									 {strings.Tax+" "+strings.Invoice}
									</div>
								
							</div>
							<div
								style={{
									width: '70%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'right',
								}}
							>
								<div 	style={{
									width: '62%',
									margin:'1.5rem 9.0rem 0.5rem 4rem',
									// // border:'1px solid',
									// marginTop:'2.5rem',
									// marginLeft:'6rem'
								}}>
								<h4 className="mb-1 ml-2"><b>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</b></h4>
								<h6 className="mb-1 ml-2">{strings.Invoice } # {invoiceData.referenceNumber}</h6>
								<h6 className="mb-1 ml-2"><b>{strings.BalanceDue}: {invoiceData.dueAmount ? (
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
													<span className="mb-1 ml-2">{strings.Status}:  {this.renderInvoiceStatus(invoiceData.status)}</span>
													{/* <div
														className={`ribbon ${this.getRibbonColor(
															invoiceData,
														)}`}
													>
															<span className="mb-1 ml-2">{invoiceData.status}</span>
														</div>  */}
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
							<div style={{width: '444%'}}>
								<div
									style={{
										width: '70%',
										margin:'0.5rem',
										border:'1px solid',borderColor:'#c8ced3'
									}}
								>
									<div style={{ fontWeight: '600' }} className="mb-1 mt-1 ml-2">
										<b>{strings.BillTo },</b>
									</div>
									<div className="mb-1 ml-2"><b>{strings.Name}:</b> {invoiceData.organisationName ? invoiceData.organisationName : invoiceData.name}</div>
									<div className="mb-1 ml-2"><b>TRN:</b> {invoiceData.taxRegistrationNo}</div>
									{/* <div className="mb-1 ml-2"><b>{strings.Company }:</b> {invoiceData.organisationName}</div> */}
									
									<div className="mb-1 ml-2"><b>{strings.Email}:</b> {invoiceData.email}</div>
									<div className="mb-3 ml-2"><b>{strings.Address}:</b> {invoiceData.address}</div>
								</div>
							</div>
							<div
								style={{
									width: '150%',
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div style={{ width: '80%' }}>
									<Table className="table table-bordered" style={{width: '90%',margin:'0.5rem',border:'1px solid',width:'284px', textAlign: 'center' ,border:'1px solid',borderColor:'#c8ced3'}}>
										<tbody>
											<tr style={{ textAlign: 'right' }}>
												<td  style={{backgroundColor:'#e3e3e3' ,width:'104px'  }}>{strings.InvoiceDate}</td>
												<td style={{ width:'143px'  }}>
													{' '}
													{moment(invoiceData.invoiceDate).format(
														'DD MMM YYYY',
													)}
												</td>
											</tr>
											<tr style={{ textAlign: 'right',width:'143px' }}>
												<td style={{width:'109px' ,backgroundColor:'#e3e3e3' }}>{strings.Terms }</td>
												<td style={{width:'143px'}}>{this.getTerms(invoiceData.term)}</td>
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
										{strings.Quantity}
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.UnitCost }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' ,   width: "60px" }}>{strings.Vat }</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.SubTotal }
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
									<b><u> {invoiceData.totalAmount ? upperCase(invoiceData.currencyName + " " +(toWords.convert(invoiceData.totalAmount))+" ONLY" ).replace("POINT","AND"): " -" }
									{/* <b> {parseInt(invoiceData.dueAmount)} */}
									</u></b></div>
								<div className="pl-5 pb-2">{strings.Vat+" "+strings.AmountInWords }:
										<br/>
									<b><u> {invoiceData.totalVatAmount ? (upperCase(invoiceData.currencyName + " " +(toWords.convert(invoiceData.totalVatAmount)))+" ONLY").replace("POINT","AND") : " -" }</u></b>
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
											<td style={{ width: '40%' }}><strong>{strings.SubTotal }</strong></td>
											<td style={{display: 'flex',justifyContent: 'space-between',}}>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													 {totalNet ? (
														<Currency
															value={totalNet}
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
															value={invoiceData.discount ? '-'+invoiceData.discount : invoiceData.discount}
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
															value={invoiceData.totalVatAmount}
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
															value={invoiceData.totalAmount}
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
