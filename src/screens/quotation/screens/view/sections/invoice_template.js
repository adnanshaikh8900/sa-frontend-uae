import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import { toInteger, upperCase } from 'lodash';
import { textAlign } from '@material-ui/system';
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
class RFQTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language'),};
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

	renderQuotationStatus = (status) => {
		let classname = '';
		if (status === 'Approved') {
			classname = 'label-approved';
		} else if (status === 'Draft') {
			classname = 'label-draft';
		} else if (status === 'Closed') {
			classname = 'label-closed';
		}else if (status === 'Sent') {
			classname = 'label-sent';
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
		const { QuotationData, currencyData, totalNet, companyData,contactData } = this.props;
		console.log(contactData,"contactData")
		return (
			<div>
				<Card id="singlePage" className="box">
					{/* <div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							QuotationData,
						)}`}
					>
						<span>{QuotationData.status}</span>
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
										style={{ width: '240px' }}
									/>
									</div>
									<div style={{ marginTop: '4rem' }}>
									<div className="mb-1 ml-2"><b>{strings.CompanyName} : </b> {companyData.companyName}</div>
									<div className="mb-1 ml-2"><b>{strings.CompanyAddress} : </b> {companyData.companyAddressLine1+","+companyData.companyAddressLine2}</div>
									<div className="mb-1 ml-2"><b>{strings.PinCode} : </b> {companyData.companyPostZipCode}</div>
									<div className="mb-1 ml-2"><b>{strings.StateRegion} : </b> {companyData.companyStateName}</div>
									<div className="mb-1 ml-2"><b>{strings.Country} : </b> {companyData.companyCountryName}</div>
									<div className="mb-1 ml-2"><b>{strings.VATRegistrationNo} : </b> {companyData.vatRegistrationNumber}</div>
									<div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b> {companyData.phoneNumber}</div>
								</div>
							</div>
							<div style={{ width: '200%',justifyContent:'center',marginTop:'4.5rem',marginLeft:'9.5rem'}}>

									<div
										style={{
											width: '130%',
											fontSize: '1.5rem',
											fontWeight: '700',
											textTransform: 'uppercase',
											color: 'black',
										}}
									>
									{strings.Quotation
									+" "+
									strings.Details
									}
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
									 marginTop:'6.4rem',
									 marginLeft:'6.5rem'
								}}>
								<h4 className="mb-1 ml-2"><b>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</b></h4>
								<h4 className="mb-1 ml-2">{QuotationData.quotationNumber}</h4><br/>
								<h6 className="mb-1 ml-2"><b>Quotation For,</b></h6>
						<div className="mb-1 ml-2"><b>Name : </b>{QuotationData.organisationName ? QuotationData.organisationName : QuotationData.customerName}</div>
						{contactData && contactData.addressLine1 &&(<div className="mb-1 ml-2"><b>{strings.BillingAddress} : </b> {contactData.addressLine1}</div>)}
								{contactData && contactData.postZipCode &&(	<div className="mb-1 ml-2"><b>{strings.PinCode} : </b> {contactData.postZipCode}</div>)}
								{contactData&&contactData.billingStateName&&(<div className="mb-1 ml-2"><b>{strings.StateRegion} : </b> {contactData.billingStateName}</div>)}
								{contactData && contactData.billingCountryName &&(<div className="mb-1 ml-2"><b>{strings.Country} : </b> {contactData.billingCountryName}</div>)}
								<h6 className="mb-1 ml-2"><b>TRN : </b>{QuotationData.vatRegistrationNumber}</h6>
								{contactData&&contactData.mobileNumber&&(<div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b> {contactData.mobileNumber}</div>)}
													<span className="mb-1 ml-2"><b>{strings.Status} : </b> {this.renderQuotationStatus(QuotationData.status)}</span>

													{/* <div
														className={`ribbon ${this.getRibbonColor(
															QuotationData,
														)}`}
													>
															<span className="mb-1 ml-2">{QuotationData.status}</span>
														</div>  */}
								</div>
								</div>
							</div>
							
						
							

			
						
						{/* <div className="text-center"			>
								<h6
								style={{textAlign: 'center'}}
								className={'mt-3 mb-2'}
								>	{strings.ExpirationDate }:{' '}
								{moment(QuotationData.quotaionExpiration).format(
									'DD MMM YYYY',
								)}
								</h6>
								</div> */}
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									height: '50px'
								}}
							>
								<div
								style={{
									width: '50%',
									// display: 'flex',
									justifyContent: 'space-between',
									
								}}>
								<h6
								style={{textAlign: 'center'}}
								className={'mt-3 mb-2'}
								>	<b>Created Date : </b>{' '}
								{moment(QuotationData.createdDate).format(
									'DD MMM YYYY',
								)}
								</h6>
								</div>
								<div
								style={{
									width: '50%',
									// display: 'flex',
									justifyContent: 'space-between',
									
								}}>
								<h6
								style={{textAlign: 'center'}}
								className={'mt-3 mb-2'}
								><b>{strings.ExpirationDate } : </b>{' '}
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
									<th style={{ padding: '0.5rem' }}>{strings.ProductName }</th>
									<th style={{ padding: '0.5rem' }}>{strings.Description }</th>
									<th className="center" style={{ padding: '0.5rem' }}>
										{strings.Quantity }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.UnitCost }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>{strings.Vat }</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
									  {strings.Total }
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
												{QuotationData.currencyIsoCode + " " +item.unitPrice}
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
													{QuotationData.currencyIsoCode + " " +item.subTotal}
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
								<div className="pb-2">{strings.AmountInWords }:<br/>
									<b><u> {QuotationData.totalAmount ? upperCase(QuotationData.currencyName + " " +(toWords.convert(QuotationData.totalAmount))+" ONLY").replace("POINT","AND") : " -" }
									{/* <b> {parseInt(POData.dueAmount)} */}
									</u></b></div>
								<div className="pb-2">{strings.Vat+" "+strings.AmountInWords }:
										<br/>
									<b><u>{QuotationData.totalVatAmount ? (upperCase(QuotationData.currencyName + " " +(toWords.convert(QuotationData.totalVatAmount))+" ONLY")).replace("POINT","AND") : " -" }</u></b>
									{/* <b> {POData.totalVatAmount}</b> */}
								</div>
							<div style={{borderTop:'1px solid',borderColor:'#c8ced3'}}>

								<h6 className="mb-0 pt-2">
									<b>{strings.Notes }:</b>
								</h6>
								<h6 className="mb-0">{QuotationData.notes}</h6>
							</div>
							
							</div>
							<div
								style={{
									width: '120%',
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
													{totalNet?QuotationData.currencyIsoCode + " " +totalNet.toLocaleString(navigator.language, { minimumFractionDigits: 2 }): 0}
													 {/* ? (
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
													)} */}
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
													{QuotationData.totalVatAmount?QuotationData.currencyIsoCode+ " " +QuotationData.totalVatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }):0 }
													{/* ? (
														<Currency
															value={POData.totalVatAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
													{QuotationData.totalAmount?QuotationData.currencyIsoCode + " " +QuotationData.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 }):0}
													{/* {POData.totalAmount ? (
														<Currency
															value={POData.totalAmount.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
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
