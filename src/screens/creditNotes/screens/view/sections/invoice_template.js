import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import {data}  from '../../../../Language/index'
import LocalizedStrings from 'react-localization';
import { TextareaAutosize } from '@material-ui/core';

const { ToWords } = require('to-words');
const toWords = new ToWords({
	localeCode: 'en-IN',
	converterOptions: {
	//   currency: true,
	  ignoreDecimal: false,
	  ignoreZeroCurrency: false,
	  doNotAddOnly: false,
	}
  });
let strings = new LocalizedStrings(data);
const footer = require('assets/images/invoice/invoiceFooter.png');
class InvoiceTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language'), };
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
		if (status === 'Closed') {
			classname = 'label-closed';
		} else if (status === 'Draft') {
			classname = 'label-draft';
		} else if (status === 'Partially Paid') {
			classname = 'label-PartiallyPaid';
		}else if (status === 'Open') {
			classname = 'label-posted';
		} else {
			classname = 'label-overdue';
		}
		return (
			<span className={`badge ${classname} mb-0`} style={{ color: 'white' }}>
				{status}
			</span>
		);
	};
	companyMobileNumber=(number)=>{

		let	number1=	number.split(",")

		if(number1.length!=0)
			number1=number1[0];
			return number1
		}

		renderExcise=(item)=>{
			if(item.exciseTaxId && item.exciseTaxId==1)
					{
					  return '50 %'
					}
					else
					if(item.exciseTaxId && item.exciseTaxId==2)
					{
					  return '100 %'
					}
				}
        
	render() {
		strings.setLanguage(this.state.language);
		const { invoiceData,status, currencyData, totalNet, companyData, contactData, isCNWithoutProduct } = this.props;
		let currencyName=invoiceData.currencyName?invoiceData.currencyName:'UAE DIRHAM';
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

<CardBody style={{ margin: '1rem', border: 'solid 1px', borderColor: '#c8ced3', }}>
						<div
							style={{
								width: '100%',
								display: 'flex',
								// border:'1px solid',
								// padding:'7px',borderColor:'#c8ced3'
							}}
						>
							<div style={{ width: '50%', marginTop: '4.5rem', marginLeft: '3rem' }}>
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
										style={{ width: ' 300px' }}
									/>
									</div>
									</div>
									<div
								style={{
									width: '70%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'left',
								}}
							>
								<div style={{
									width: '97%',
									textAlign: 'right',

								}}>
									<div style={{ marginTop: '0.5rem' }}>
									<h2 className="mb-1 ml-2"><b>TAX Credit Note</b></h2><br />
									<div className="mb-1 ml-2" style={{fontSize:"22px"}}><b>{companyData.companyName}</b></div>
									<div className="mb-1 ml-2">{companyData.companyAddressLine1}</div>
										<div className="mb-1 ml-2">{companyData.companyAddressLine2}</div>
										{companyData.companyCountryCode==229 ?
																	strings.POBox:
																	""} : {companyData.companyPoBoxNumber} ,&nbsp;
										{companyData &&(companyData.companyStateName ? companyData.companyStateName + " , " : "")}
										{companyData &&(companyData.companyCountryName ? companyData.companyCountryName : "")}
										{companyData.companyRegistrationNumber && (<div className="mb-1 ml-2">{strings.CompanyRegistrationNo} : {companyData.companyRegistrationNumber}</div>)}
										{companyData.isRegisteredVat==true&&(<div className="mb-1 ml-2">{strings.VATRegistrationNo} : {companyData.vatRegistrationNumber}</div>)}
									<div className="mb-1 ml-2">{strings.MobileNumber} : {this.companyMobileNumber(companyData.phoneNumber?"+"+companyData.phoneNumber:'')}</div>
									{companyData.emailAddress&&(<div className="mb-1 ml-2">Email : {companyData.emailAddress}</div>)}
								</div>
							</div>
							</div>
							</div>
							<hr/>
							
							<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '1rem',
						
							}}
						>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									marginLeft: '2rem'
								}}
							>
								<div>
								{/* <h4 className="mb-1 ml-2"><b>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</b></h4> */}
											<br/>
								<h6 className="mb-1 ml-2"><b>{strings.CreditTo} ,</b></h6><br/>
								{contactData  &&(<div className="mb-1 ml-2"><b>{contactData.organization ? contactData.organization:( contactData.firstName+" "+contactData.lastName)}</b></div>)}
								{contactData && contactData.addressLine1 && (<div className="mb-1 ml-2">{contactData.addressLine1}</div>)}

									<div className="mb-1 ml-2">
									{invoiceData && contactData && (
											contactData.countryId==229 ?
											contactData.poBoxNumber ?(strings.POBox +" : " +contactData.poBoxNumber ): ""
											:contactData.postZipCode ? contactData.postZipCode : ""
											)} ,&nbsp;
									    {invoiceData && contactData && (contactData.billingStateName ? contactData.billingStateName + " , " : "")}
										{invoiceData && contactData && (contactData.billingCountryName ? contactData.billingCountryName : "")}
									</div>
									{console.log(invoiceData.taxTreatment,"invoiceData.taxTreatment")}
									{invoiceData && invoiceData.taxTreatment&& invoiceData.taxTreatment.includes("NON")==false &&(<div className="mb-1 ml-2">{strings.VATRegistrationNo} :  {contactData &&contactData.vatRegistrationNumber&&(contactData.vatRegistrationNumber)}</div>)}
								{contactData&&contactData.mobileNumber&&(   <div className="mb-1 ml-2">{strings.MobileNumber} : +{contactData.mobileNumber}</div>)}
								{contactData && contactData.billingEmail && (<div className="mb-1 ml-2">{strings.Email} : {contactData.billingEmail}</div>)}
								</div>
								<div style={{ width: '27%' }}>
									<br/>
								<div className="mb-1 ml-2"><b>{strings.CreditNote} : </b> # {invoiceData.referenceNumber}</div>
								<div className="mb-1 ml-2"><b>{strings.TaxCreditDate} : </b>{' '}
										{moment(invoiceData.invoiceDate).format(
											'DD MMM YYYY',
										)}</div>
											<div className="mb-1 ml-2"><b>{strings.Status} : </b>{this.renderInvoiceStatus(status)}</div>
								</div>
								</div>
							</div>
					  
					  {/* <div style={{ width: '80%' }}>
									<Table className="table table-bordered" style={{width: '90%',margin:'0.5rem',border:'1px solid',width:'250px', textAlign: 'center' ,border:'1px solid',borderColor:'#c8ced3'}}>
										<tbody>
											<tr style={{ textAlign: 'right' }}>
												<td  style={{backgroundColor:'#e3e3e3' ,width:'104px'  }}>Invoice Date</td>
												<td style={{ width:'143px'  }}>
													{' '}
													{moment(invoiceData.invoiceDate).format(
														'DD MMM YYYY',
													)}
												</td>
											</tr>
											<tr style={{ textAlign: 'right',width:'143px' }}>
												<td style={{width:'109px' ,backgroundColor:'#e3e3e3' }}>Term</td>
												<td style={{width:'143px'}}>{invoiceData.term}</td>
											</tr>
											<tr style={{ textAlign: 'right' }}>
												<td style={{width:'104px' ,backgroundColor:'#e3e3e3' }}>Due Date</td>
												<td style={{ width:'143px'  }}>
													{moment(invoiceData.invoiceDueDate).format(
														'DD MMM YYYY',
													)}
												</td>
											</tr>
										</tbody>
									</Table>
								</div> */}

						{isCNWithoutProduct==false&&(<Table className='table-striped'>
							<thead className="header-row" style={{ fontSize:"12px" }}>
								<tr>
									<th className="center" style={{ padding: '0.5rem',    width: "40px" }}>
										#
									</th>
									{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
									<th style={{ padding: '0.5rem' }}>{strings.ProductNameAndDescription}</th>
									<th className="text-center" style={{ padding: '0.5rem' }}>
										{strings.Quantity }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.UnitCost }
									</th>
									{invoiceData.discount > 0 && (<>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.Discount }
									</th></>)}
									{/* <th style={{ padding: '0.5rem', textAlign: 'right'}}>{strings.DiscountType}</th> */}
									{/* <th style={{ padding: '0.5rem' }}>{strings.Excise}</th> */}
									<th style={{ padding: '0.5rem', textAlign: 'right'}}>{strings.ExciseAmount}</th>
									{/* <th style={{ padding: '0.5rem', textAlign: 'right' ,   width: "60px" }}>{strings.VAT}</th> */}
									<th style={{ padding: '0.5rem', textAlign: 'right'}}>{strings.VatAmount}</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
									{strings.SubTotal }
									</th>
								</tr>
							</thead>
							<tbody className="table-hover">
								{invoiceData.invoiceLineItems &&
									invoiceData.invoiceLineItems.length &&
									invoiceData.invoiceLineItems.map((item, index) => {
										return (
											<tr key={index}>
												<td className="center">{index + 1}</td>
												<td><b>{item.productName}</b><br/><br />{item.description}</td>
												<td  style={{ textAlign: 'center' }}>{item.quantity}<br/><br/>
											     <b style={{fontSize:"10.5px"}}>{item.unitType}</b>	
												</td>
												<td style={{ textAlign: 'right', width: '10%' }}>
													<Currency
														value={item.unitPrice}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/>
												</td>
												{invoiceData.discount > 0 && (<>	<td style={{ textAlign: 'right' }}>{item.discount}</td></>)}
												{/* <td style={{ textAlign: 'right' }}>{item.discountType}</td> */}
												{/* <td>{item.exciseTaxId ? this.renderExcise(item):"-"}</td> */}
												{ invoiceData.totalExciseAmount > 0 && (<><td style={{ textAlign: 'right' }}>
													<Currency
														value={item.exciseAmount}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'USD'
														}
													/>
												</td></>)}
												{/* <td
													style={{ textAlign: 'right' }}
												>{`${item.vatPercentage}%`}</td> */}
												<td style={{ textAlign: 'right' }}>
													<Currency
														value={item.vatAmount}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'AED'
														}
													/>
												</td>
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
						</Table>)}<hr/>
						<div 
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								// marginBottom: '1rem',border:'solid 1px',borderColor:'#c8ced3',
								fontSize: "14px"
							}}>
							<div
								style={{
									width: '40%',
									display: 'flex',
									flexDirection: 'column',
									marginLeft: '2rem'
								}}
							>				
								<br />
						
								{invoiceData.notes&& (<><h6 className="mb-0 pt-2">
									<b>{strings.TermsAndConditions }:</b>
								</h6><br/>
								<h6 className="mb-0">{invoiceData.notes}</h6>
							</>)}
							
							</div>
							<div
								style={{
									width: '40%',
									display: 'flex',
									justifyContent: 'space-between',
									marginRight: '1rem'

								}}
							>
								<div style={{ width: '100%' }}>
								<Table className="table-clear cal-table">
									<tbody>
									{/* <tr >
											<td style={{ width: '40%' }}>
												<strong>
													Discount
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
										</tr> */}
										
										{isCNWithoutProduct==false&&invoiceData.totalExciseAmount && invoiceData.totalExciseAmount > 0 ?(<tr >
											<td style={{ width: '40%' }}>
												<strong>{strings.TotalExcise}</strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{invoiceData.totalExciseAmount ? (
														<Currency
															value={invoiceData.totalExciseAmount}
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
										</tr>):""}
                                        {isCNWithoutProduct==false&&invoiceData.discount && invoiceData.discount > 0 ?(<tr >
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
															value={invoiceData.discount ? +invoiceData.discount : invoiceData.discount}
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
										</tr>):""}
										<tr >
											<td style={{ width: '40%' }}><strong>{strings.TotalNet }</strong></td>
											<td style={{display: 'flex',justifyContent: 'space-between',}}>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													 {totalNet ? (
														<Currency
															value={totalNet-invoiceData.totalVatAmount}
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
										{isCNWithoutProduct==false&&(<tr >
											<td style={{ width: '40%' }}>
												<strong>{strings.VAT}</strong>
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
										</tr>)}
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
												<strong>{strings.CREDITSREMAINING } </strong>
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
						</div><hr/>
						<TextareaAutosize
																			type="textarea"
																			disabled
																			className="textarea viewFootNote"
																			maxLength="250"
																			style={{width: "1100px"}}
																			// rows="5"
																			value={invoiceData.footNote}
																		/>
						<br /><br/><br/>											
					</CardBody>
					<img className='footer' src={footer} style={{ height: "65px", width: "100%" }}></img>
				</Card>
			</div>
		);
	}
}

export default InvoiceTemplate;
