import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';

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
			return 'pending';
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
										className="img-avatar"
										alt=""
									/>
									<h6 className="mb-0">
										{companyData && companyData.company
											? companyData.company.emailAddress
											: ''}
									</h6>

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
										{companyData && companyData.company
											? companyData.company.companyCountryCode
													.countryDescription
											: ''}
									</h6>
								</div>
							</div>
							<div style={{ width: '40%', textAlign: 'right' }}>
								<Table className="table-clear">
									<tbody>
										<tr style={{ textAlign: 'right' }}>
											<td
												style={{
													width: '75%',
													fontSize: '2rem',
													fontWeight: '700',
													color: '#6a4bc4',
												}}
											>
												Invoice
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '75%' }}>
												# {invoiceData.referenceNumber}
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '75%' }}>
												{' '}
												Balance Due
												<br />
												<b style={{ fontWeight: '600', fontFamily: 'Arial' }}>
													{currencyData[0] && currencyData[0].currencySymbol
														? `${currencyData[0].currencySymbol}`
														: ''}
													{invoiceData.dueAmount ? invoiceData.dueAmount : 0.0}
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
												<td>{item.description}</td>
												<td>{item.quantity}</td>
												<td style={{ textAlign: 'right', width: '20%' }}>
													{item.unitPrice}
												</td>
												<td
													style={{ textAlign: 'right' }}
												>{`${item.vatPercentage}%`}</td>
												<td style={{ textAlign: 'right' }}>{item.subTotal}</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
						<Row>
							<Col lg="8" sm="5"></Col>
							<Col lg="4" sm="7">
								<Table className="table-clear cal-table">
									<tbody>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '60%' }}>
												<strong>Subtotal</strong>
											</td>
											<td>
												{currencyData[0] && currencyData[0].currencySymbol
													? `${currencyData[0].currencySymbol}`
													: ''}
												{totalNet ? totalNet : 0.0}{' '}
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
											<td>
												{currencyData[0] && currencyData[0].currencySymbol
													? `${currencyData[0].currencySymbol}`
													: ''}
												{invoiceData.discount ? invoiceData.discount : 0.0}{' '}
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '60%' }}>
												<strong>VAT</strong>
											</td>
											<td>
												{currencyData[0] && currencyData[0].currencySymbol
													? `${currencyData[0].currencySymbol}`
													: ''}
												{invoiceData.totalVatAmount
													? invoiceData.totalVatAmount
													: 0.0}{' '}
											</td>
										</tr>
										<tr style={{ textAlign: 'right' }}>
											<td style={{ width: '60%' }}>
												<strong>Total</strong>
											</td>
											<td>
												{currencyData[0] && currencyData[0].currencySymbol
													? `${currencyData[0].currencySymbol}`
													: ''}
												{invoiceData.totalAmount
													? invoiceData.totalAmount
													: 0.0}{' '}
											</td>
										</tr>
										<tr style={{ textAlign: 'right', background: '#f2f2f2' }}>
											<td style={{ width: '60%' }}>
												<strong>Balance Due</strong>
											</td>
											<td>
												<strong>
													{currencyData[0] && currencyData[0].currencySymbol
														? `${currencyData[0].currencySymbol}`
														: ''}
													{invoiceData.dueAmount ? invoiceData.dueAmount : 0.0}
												</strong>
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default InvoiceTemplate;
