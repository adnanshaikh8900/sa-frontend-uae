import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';

class InvoiceTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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

	render() {
		const { invoiceData, currencyData, totalNet, companyData } = this.props;
		return (
			<div>
				<Card id="singlePage" className="box">
					<div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							invoiceData,
						)}`}
					>
						<span>{invoiceData.status}</span>
					</div>

					<CardBody style={{ marginTop: '7rem' }}>
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div style={{ width: '60%' }}>
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
										style={{ width: ' 150px' }}
									/>
									<br></br><br></br>
									<h3 style={{ fontWeight: '600' }} className="mb-0">
										{companyData && companyData.company
											? companyData.company.companyName
											: ''}
									</h3>
									<h6 className="mb-0">
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
									</h6>
								</div>
							</div>
							<div
								style={{
									width: '40%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
								}}
							>
								<Table className="table-clear">
									<tbody>
										<tr style={{ textAlign: 'right' }}>
											<td
												style={{
													width: '75%',
													fontSize: '2rem',
													fontWeight: '700',
													textTransform: 'uppercase',
													color: '#2165d8',
												}}
											>
												Invoice
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '75%' }} className="p-0">
												# {invoiceData.referenceNumber}
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '75%' }} className="p-0">
												{' '}
												Balance Due
												<br />
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
								</Table>
							</div>
						</div>

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
									width: '50%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
								}}
							>
								<h6 style={{ fontWeight: '600' }} className="mb-0">
									Bill To,
								</h6>
								<h6 className="mb-0">{invoiceData.name}</h6>
								<h6 className="mb-0">{invoiceData.organisationName}</h6>
								<h6 className="mb-0">{invoiceData.email}</h6>
								<h6 className="mb-0">{invoiceData.address}</h6>
							</div>
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div style={{ width: '100%' }}>
									<Table className="table-clear">
										<tbody>
											<tr style={{ textAlign: 'right' }}>
												<td style={{ width: '75%' }}>Invoice Date :</td>
												<td style={{ width: '25%' }}>
													{' '}
													{moment(invoiceData.invoiceDate).format(
														'DD MMM YYYY',
													)}
												</td>
											</tr>
											<tr style={{ textAlign: 'right' }}>
												<td style={{ width: '75%' }}>Term :</td>
												<td style={{ width: '18%' }}>{invoiceData.term}</td>
											</tr>
											<tr style={{ textAlign: 'right' }}>
												<td style={{ width: '75%' }}>Due Date :</td>
												<td style={{ width: '25%' }}>
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
						<Table striped responsive>
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
							<tbody>
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
								marginBottom: '1rem',
							}}
						>
								<div
								style={{
									width: '50%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
								}}
							>
								<h6 className="mb-0">
									Notes:
								</h6>
								<h6 className="mb-0">{invoiceData.notes}</h6>
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
										<tr style={{ textAlign: 'right' }}>
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
													{totalNet ? (
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
													)}
												</span>
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '60%' }}>
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
															value={invoiceData.discount.toFixed(2)}
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
										<tr style={{ textAlign: 'right' }}>
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
													{invoiceData.totalVatAmount ? (
														<Currency
															value={invoiceData.totalVatAmount.toFixed(2)}
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
										<tr style={{ textAlign: 'right' }}>
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
													{invoiceData.totalAmount ? (
														<Currency
															value={invoiceData.totalAmount.toFixed(2)}
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
										<tr style={{ textAlign: 'right', background: '#f2f2f2' }}>
											<td style={{ width: '60%' }}>
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
														{invoiceData.dueAmount ? (
															<Currency
																value={invoiceData.dueAmount.toFixed(2)}
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
