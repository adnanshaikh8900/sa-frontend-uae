import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import { toInteger, upperCase } from 'lodash';
import {data}  from '../../../../Language/index'
import LocalizedStrings from 'react-localization';

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
class InvoiceTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language'), };
	}

	getRibbonColor = (cnData) => {
		if (cnData.status == 'Draft') {
			return 'pending-color';
		} else if (cnData.status == 'Sent') {
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

		renderAmount=(value)=>{
			const {  currencyData} = this.props;
			return(<Currency
				value={value}
				currencySymbol={
					currencyData[0]
						? currencyData[0].currencyIsoCode
						: 'INR'
				}
			/>)
		}
        
	render() {
		strings.setLanguage(this.state.language);
		const { cnData,status, currencyData, totalNet, companyData, contactData, isCNWithoutProduct } = this.props;
		let currencyName=cnData.currencyName?cnData.currencyName:'INDIAN RUPEE';
		return (
			<div>
				<Card id="singlePage" className="box">
					{/* <div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							cnData,
						)}`}
					>
						<span>{cnData.status}</span>
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
							<div style={{ width: '200%' }}>
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
										style={{ width: ' 240px' }}
									/>
									</div>
									<div style={{ marginTop: '4.2rem' }}>
										<div className="mb-1 ml-2"><b>{strings.CompanyName} : </b> {companyData.companyName}</div>
									<div className="mb-1 ml-2"><b>{strings.CompanyAddress} : </b> {companyData.companyAddressLine1+","+companyData.companyAddressLine2}</div>
									<div className="mb-1 ml-2"><b>{strings.PinCode} : </b> {companyData.companyPostZipCode}</div>
									<div className="mb-1 ml-2"><b>{strings.StateRegion} : </b> {companyData.companyStateName}</div>
									<div className="mb-1 ml-2"><b>{strings.Country} : </b> {companyData.companyCountryName}</div>
									<div className="mb-1 ml-2"><b>{strings.VATRegistrationNo} : </b> {companyData.vatRegistrationNumber}</div>
									<div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b> {this.companyMobileNumber(companyData.phoneNumber?"+"+companyData.phoneNumber:'')}</div>
								</div>
							</div>
							<div className="text-center" style={{ width: '200%',justifyContent:'center' }}>
							<div 
										style={{
											width: '100%',
											fontSize: '1.5rem',
											marginTop:'4.4rem',
											fontWeight: '700',
											textTransform: 'uppercase',
											color: 'black',
										}}
									>
										Debit Note
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
									width: '70%',
									margin:'1.5rem 9.0rem 0.5rem 4rem',
									marginTop:'6.5rem',
									marginLeft:'8rem'
								}}>
								<h4 className="mb-1 ml-2"><b>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</b></h4>
								<h5 className="mb-1 ml-2">Debite Note #{cnData.creditNoteNumber}</h5><br/>
								<h6 className="mb-1 ml-2"><b>Debit To ,</b></h6>
								{contactData  &&(<div className="mb-1 ml-2"><b>{strings.Name} : </b>{contactData.organization ? contactData.organization:( contactData.firstName+" "+contactData.lastName)}</div>)}
								{contactData && contactData.addressLine1 &&(<div className="mb-1 ml-2"><b>{strings.BillingAddress} : </b> {contactData.addressLine1}</div>)}
								{contactData && contactData.postZipCode &&(	<div className="mb-1 ml-2"><b>{strings.PinCode} : </b> {contactData.postZipCode}</div>)}
								{contactData&&contactData.billingStateName&&(<div className="mb-1 ml-2"><b>{strings.StateRegion} : </b> {contactData.billingStateName}</div>)}
								{contactData && contactData.billingCountryName &&(<div className="mb-1 ml-2"><b>{strings.Country} : </b> {contactData.billingCountryName}</div>)}
								{contactData  &&(	<div className="mb-1 ml-2"><b>{strings.VATRegistrationNo} : </b> {contactData.vatRegistrationNumber}</div>)}
								{contactData&&contactData.mobileNumber&&(   <div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b>+{contactData.mobileNumber}</div>)}
								
													<span className="mb-1 ml-2"><b>{strings.Status }&nbsp; : </b> {this.renderInvoiceStatus(status)}</span>
													
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
										width: '41%',
										margin:'0.5rem',
										border:'1px solid',borderColor:'#c8ced3'
									}}
								>
									<h6 style={{ fontWeight: '600' }} className="mb-2 mt-2 ml-1">
										<b>Debit Note Date:{' '}
													{moment(cnData.invoiceDate).format(
														'DD MMM YYYY',
													)}</b>
									</h6>
								</div>
								<div
									style={{
										width: '41%',
										margin:'0.5rem',
										border:'1px solid',borderColor:'#c8ced3'
									}}
								>
									{/* <h6 style={{ fontWeight: '600' }} className="mb-2 mt-2 ml-1">
										<b>Reason:{' '}
												</b>	{cnData.reason}
									</h6> */}
								</div>
							</div>
							
						</div>
						{isCNWithoutProduct==false&&(
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
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.Discount }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right'}}>{strings.DiscountType}</th>
									<th style={{ padding: '0.5rem', textAlign: 'center'}}>Tax Type</th>
									{companyData.companyStateCode==cnData.placeOfSupplyId ?<th style={{ padding: '0.5rem', textAlign: 'right' ,  width: "60px" }}>CGST %</th>
									:<th style={{ padding: '0.5rem', textAlign: 'right' ,  width: "60px" }}>IGST %</th>
								}
									{companyData.companyStateCode==cnData.placeOfSupplyId ?<th style={{ padding: '0.5rem', textAlign: 'right' ,  width: "60px" }}>SGST %</th>
									:""
								}
									<th style={{ padding: '0.5rem', textAlign: 'right'}}>CESS %</th>
									<th style={{ padding: '0.5rem', textAlign: 'right'}}>
										{strings.SubTotal }
									</th>
								</tr>
							</thead>
							<tbody className=" table-bordered table-hover">
								{cnData.lineItemModelList &&
									cnData.lineItemModelList.length &&
									cnData.lineItemModelList.map((item, index) => {
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
																: 'INR'
														}
													/>
												</td>
												{/* <td style={{ textAlign: 'right', width: '20%' }}>
													<Currency
														value={item.discount}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'INR'
														}
													/>
												</td> */}
												<td style={{ textAlign: 'right' }}>{item.discount}</td>
												<td style={{ textAlign: 'right' }}>{item.discountType}</td>
												<td style={{ textAlign: 'center' }}>{item.taxSlab}</td>
												{companyData.companyStateCode==cnData.placeOfSupplyId ?
												<td style={{ textAlign: 'right' }}> {this.renderAmount(item.cgst?item.cgst:0)}</td>
												:<td style={{ textAlign: 'right' }}>{this.renderAmount(item.igst?item.igst:0)}</td>}
												{companyData.companyStateCode==cnData.placeOfSupplyId ?
												<td style={{ textAlign: 'right' }}> {this.renderAmount(item.sgst?item.sgst:0)}</td>
												:""}
												
												{/* <td
													style={{ textAlign: 'right' }}
												>{`${item.igst}`}</td> */}
												<td style={{ textAlign: 'right' }}>	<Currency
														value={item.cess}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'INR'
														}
													/></td>
													{/* <td style={{ textAlign: 'right' }}>{item.cess}</td> */}
												<td style={{ textAlign: 'right' }}>
													<Currency
														value={item.subTotal}
														currencySymbol={
															currencyData[0]
																? currencyData[0].currencyIsoCode
																: 'INR'
														}
													/>
												</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
						)}
						<div 
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '1rem',border:'solid 1px',borderColor:'#c8ced3',
								fontSize: "12px"
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
								<div className="pl-5 pb-2">{strings.AmountInWords }:<br/>
									<b><u> {cnData.totalAmount ?upperCase (currencyName + " " +(toWords.convert(cnData.totalAmount))+" ONLY").replace("POINT","AND"): " -"}
									{/* <b> {parseInt(cnData.dueAmount)} */}
									</u></b></div>
									{isCNWithoutProduct==false&&(		<div className="pl-5 pb-2">{strings.Vat+" "+strings.AmountInWords  }:
										<br/>
									<b><u>{cnData.totalTaxAmount ? (upperCase(currencyName + " " +(toWords.convert(cnData.totalTaxAmount))+" ONLY")).replace("POINT","AND") : " -" }</u></b>
									{/* <b> {cnData.totalTaxAmount}</b> */}
								</div>)}
							<div className="pl-5" style={{borderTop:'1px solid',borderColor:'#c8ced3'}}>

								<h6 className="mb-0 pt-2">
									<b>{strings.Notes }:</b>
								</h6>
								<h6 className="mb-0">{cnData.notes}</h6>
							</div>
							
							</div>
							<div
								style={{
									width: '150%',
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
													 {cnData.subTotal ? (
														<Currency
															value={cnData.subTotal}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'INR'
															}
														/>
													) : (
														<Currency
															value={0}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'INR'
															} 
														/>
													)}  
												</span>
											</td>
										</tr>
										<tr >
											<td style={{ width: '40%' }}><strong>{strings.Discount}</strong></td>
											<td style={{display: 'flex',justifyContent: 'space-between',}}>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													 {this.renderAmount(cnData.discount?cnData.discount:0)}
												</span>
											</td>
										</tr>
										{companyData.companyStateCode==cnData.placeOfSupplyId ?
										<tr >
										<td style={{ width: '40%' }}><strong>Total CGST</strong></td>
										<td style={{display: 'flex',justifyContent: 'space-between',}}>
											<span style={{ marginLeft: '2rem' }}></span>
											<span>
												 {this.renderAmount(cnData.totalCgst?cnData.totalCgst:0)}
											</span>
										</td>
									</tr>:
									<tr >
									<td style={{ width: '40%' }}><strong>Total IGST</strong></td>
									<td style={{display: 'flex',justifyContent: 'space-between',}}>
										<span style={{ marginLeft: '2rem' }}></span>
										<span>
											 {this.renderAmount(cnData.totalIgst?cnData.totalIgst:0)}
										</span>
									</td>
								</tr>}
								{companyData.companyStateCode==cnData.placeOfSupplyId ?
										<tr >
										<td style={{ width: '40%' }}><strong>Total SGST</strong></td>
										<td style={{display: 'flex',justifyContent: 'space-between',}}>
											<span style={{ marginLeft: '2rem' }}></span>
											<span>
												 {this.renderAmount(cnData.totalSgst?cnData.totalSgst:0)}
											</span>
										</td>
									</tr>:
									""}
										<tr >
										<td style={{ width: '40%' }}><strong>Total CESS</strong></td>
										<td style={{display: 'flex',justifyContent: 'space-between',}}>
											<span style={{ marginLeft: '2rem' }}></span>
											<span>
												 {this.renderAmount(cnData.totalCess?cnData.totalCess:0)}
											</span>
										</td>
									</tr>
										<tr >
											<td style={{ width: '40%' }}>
												<strong>Total Tax </strong>
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'space-between',
												}}
											>
												<span style={{ marginLeft: '2rem' }}></span>
												<span>
													{cnData.totalTaxAmount ? (
														<Currency
															value={cnData.totalTaxAmount}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'INR'
															}
														/>
													) : (
														<Currency
															value={0}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'INR'
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
													{cnData.totalAmount ? (
														<Currency
															value={cnData.totalAmount}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'INR'
															}
														/>
													) : (
														<Currency
															value={0}
															currencySymbol={
																currencyData[0]
																	? currencyData[0].currencyIsoCode
																	: 'INR'
															}
														/>
													)} 
												</span>
											</td>
										</tr>
										<tr style={{ background: '#f2f2f2' }}>
											<td style={{ width: '40%' }}>
												<strong>DEBITS REMAINING</strong>
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
														{cnData.dueAmount ? (
															<Currency
																value={cnData.dueAmount}
																currencySymbol={
																	currencyData[0]
																		? currencyData[0].currencyIsoCode
																		: 'INR'
																}
															/>
														) : (
															<Currency
																value={0}
																currencySymbol={
																	currencyData[0]
																		? currencyData[0].currencyIsoCode
																		: 'INR'
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
