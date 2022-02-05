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
class RFQTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language'),};
	}

	renderRFQStatus = (status) => {
		let classname = '';
		if (status === 'Posted') {
			classname = 'label-posted';
		} else if (status === 'Draft') {
			classname = 'label-draft';
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

	render() {
		strings.setLanguage(this.state.language);
		const { RFQData, currencyData, totalNet, companyData,status,contactData } = this.props;
		console.log(contactData,"contactData")
		return (
			<div>
				<Card id="singlePage" className="box">
					{/* <div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							RFQData,
						)}`}
					>
						<span>{RFQData.status}</span>
					</div> */}

					<CardBody >
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
										style={{ width: ' 240px' }}
									/>
									</div>
									<div style={{ marginTop: '3.5rem' }}>
									<div className="mb-1 ml-2"><b>{strings.CompanyName} : </b> {companyData.companyName}</div>
									<div className="mb-1 ml-2"><b>{strings.CompanyAddress} : </b>{companyData.companyAddressLine1+","+companyData.companyAddressLine2}</div>
									<div className="mb-1 ml-2"><b>{strings.PinCode} : </b> {companyData.companyPostZipCode}</div>
									<div className="mb-1 ml-2"><b>{strings.StateRegion} : </b>{companyData.companyStateName}</div>
									<div className="mb-1 ml-2"><b>{strings.Country} : </b>{companyData.companyCountryName}</div>
									<div className="mb-1 ml-2"><b>{strings.VATRegistrationNo} : </b> {companyData.vatRegistrationNumber}</div>
									
<div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b> {this.companyMobileNumber(companyData.phoneNumber?"+"+companyData.phoneNumber:'')}</div>
								</div>
							</div>
							<div style={{ width: '200%',justifyContent:'center',marginTop:'5rem' }}>

									<div
										style={{
											width: '130%',
											fontSize: '1.5rem',
											fontWeight: '700',
											textTransform: 'uppercase',
											color: 'black',
										}}
									>
									{strings.GoodsReceivedNotes
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
									marginTop:'6.6rem',
								    marginLeft:'6.5rem'
								}}>
								<h4 className="mb-1 ml-2"><b>{companyData && companyData.company
											? companyData.company.companyName
											: ''}</b></h4>
								<h4 className="mb-1 ml-2">{RFQData.grnNumber} </h4><br/>
								<h6 className="mb-1 ml-2"><b>Received From,</b></h6>
								<h6 className="mb-1 ml-2"><b>Name : </b>{RFQData.organisationName ? RFQData.organisationName : RFQData.supplierName}</h6>
								{contactData && contactData.addressLine1 &&(<div className="mb-1 ml-2"><b>{strings.BillingAddress} : </b> {contactData.addressLine1}</div>)}
								{contactData && contactData.postZipCode &&(	<div className="mb-1 ml-2"><b>{strings.PinCode} : </b> {contactData.postZipCode}</div>)}
								{contactData&&contactData.billingStateName&&(<div className="mb-1 ml-2"><b>{strings.StateRegion} : </b> {contactData.billingStateName}</div>)}
								{contactData && contactData.billingCountryName &&(<div className="mb-1 ml-2"><b>{strings.Country} : </b> {contactData.billingCountryName}</div>)}
								<h6 className="mb-1 ml-2"><b>TRN : </b>{RFQData.vatRegistrationNumber}</h6>
								{contactData&&contactData.mobileNumber&&(<div className="mb-1 ml-2"><b>{strings.MobileNumber} : </b>+{contactData.mobileNumber}</div>)}
								
													<span className="mb-1 ml-2"><b>{strings.Status} :  </b>{this.renderRFQStatus(status)}</span>

													{/* <div
														className={`ribbon ${this.getRibbonColor(
															RFQData,
														)}`}
													>
															<span className="mb-1 ml-2">{RFQData.status}</span>
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
									display: 'flex',
									justifyContent: 'space-between',
									
								}}>
								<h6 style={{textAlign: 'center',marginLeft:'15px'}} className={'mt-3 mb-2'}><b>{strings.ReceiveDate } : </b>{moment(RFQData.grnReceiveDate).format(
									'DD MMM YYYY',
								)}</h6>

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
									{/* <th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.UnitCost }
									</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>{strings.Vat}</th>
									<th style={{ padding: '0.5rem', textAlign: 'right' }}>
										{strings.Total }
									</th> */}
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
												<td>{item.grnReceivedQuantity}</td>
												{/* <td style={{ textAlign: 'right', width: '20%' }}>
													
													{RFQData.currencyIsoCode + " " +item.unitPrice}
												</td>
												<td
													style={{ textAlign: 'right' }}
												>{`${item.vatPercentage}%`}</td>
												<td style={{ textAlign: 'right' }}>
												
													{RFQData.currencyIsoCode + " " +item.subTotal}
												</td> */}
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
									height:'70px',
									
								}}
							>
								{/* <div className="pb-2">{strings.AmountInWords }:<br/>
									<b><u> {RFQData.totalAmount ? upperCase(RFQData.currencyName + " " +(toWords.convert(RFQData.totalAmount))+" ONLY") : " -" }
								
									</u></b></div>
								<div className="pb-2">{strings.Vat+" "+strings.AmountInWords }:
										<br/>
									<b> {RFQData.totalVatAmount ? (upperCase(RFQData.currencyName + " " +(toWords.convert(RFQData.totalVatAmount))+" ONLY")) : " -" }</b>
								
								</div> */}
						

								<h6 className="mb-0 pt-2">
									<b>{strings.GRNREMARKS }:</b>
								</h6>
								<h6 className="mb-0">{RFQData.notes}</h6>
						
							
							</div>
						
						</div>												
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default RFQTemplate;
