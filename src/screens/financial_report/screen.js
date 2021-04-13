import React from 'react';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
} from 'reactstrap';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {};
};

class FinancialReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: new Array(4).fill('3'),
		};
	}

	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		console.log(tab);
		this.setState({
			activeTab: newArray,
		});
	};

	render() {
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="nav-icon fas fa-usd" />
										<span className="ml-2">Financial Report</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							{/* <Nav tabs>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '1'}
										onClick={() => {
											this.toggle(0, '1');
										}}
									>
										Profit and Loss
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '2'}
										onClick={() => {
											this.toggle(0, '2');
										}}
									>
										Balance Sheet
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '3'}
										onClick={() => {
											this.toggle(0, '3');
										}}
									>
										Trial Balance
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '4'}
										onClick={() => {
											this.toggle(0, '4');
										}}
									>
										Vat Returns Report
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>
								<TabPane tabId="1">
									<div className="table-wrapper">
										<ProfitAndLoss />
									</div>
								</TabPane>
								<TabPane tabId="2">
									<div className="table-wrapper">
										<BalanceSheet />
									</div>
								</TabPane>
								<TabPane tabId="3">
									<div className="table-wrapper">
										<TrailBalances />
									</div>
								</TabPane>
								<TabPane tabId="4">
									<div className="table-wrapper">
										<VatReturnsReport />
									</div>
								</TabPane>
							</TabContent> */}
							<Card className="report-card">
								<CardHeader>Financial</CardHeader>
								<CardBody>
									<Row xs="4">
										<Col  className="report-section">
											<h5><a href ="#"
											onClick={() =>
									this.props.history.push('/admin/report/financial/profitandloss')}
								>
									Profit & Loss</a></h5>
										</Col>
										<Col className="report-section">
											<h5><a href="#" onClick={() =>
									this.props.history.push('/admin/report/financial/balancesheet')}>Balance Sheet</a></h5>
										</Col>
										<Col className="report-section">
											<h5><a href="#" onClick={() =>
									this.props.history.push('/admin/report/financial/horizontalbalancesheet')}>Horizontal Balance Sheet</a></h5>
										</Col>
										<Col className="report-section">
											<h5><a href="#" onClick={() =>
									this.props.history.push('/admin/report/financial/trailbalances')}>Trail Balances</a></h5>
										</Col>

									</Row>
								</CardBody>
							</Card>
							<Card className="report-card">
								<CardHeader>Vat Report</CardHeader>
								<CardBody>
									<Row>
									<Col className="report-section">
											<h5><a href="#" onClick={() =>
									this.props.history.push('/admin/report/financial/vatreturns')}>Vat Returns Report</a></h5>
										</Col>
										<Col className="report-section">
											<h5><a href="#" onClick={() =>
									this.props.history.push('/admin/taxes/vat-transactions')}>Vat Transaction Report</a></h5>
										</Col>
										{/* <Col className="report-section">
											<h5><a href="#">Capital Assets</a></h5>
											<p>A list of the capital assets owned by your business and how they depreciate over time.</p>
										</Col>
										<Col className="report-section">
											<h5><a href="#">Customer Sales</a></h5>
											<p>A breakdown of your sales by customer over different time periods.</p>
										</Col>
										<Col className="report-section">
											<h5><a href="#">Spending Categories</a></h5>
											<p>A breakdown of your expenditure by category over time.</p>
										</Col>
										 */}
									</Row>
								</CardBody>
							</Card>
							<Card className="report-card">
								<CardHeader>Detailed</CardHeader>
								<CardBody>
									<Row>
										<Col className="report-section">
											<h5><a href="#"
												onClick={() =>
													this.props.history.push('/admin/report/detailed-general-ledger')}
													>
														Detailed Journal ledger</a></h5>
										</Col>
										{/* <Col className="report-section">
											<h5><a href="#">Trial Balance</a></h5>
											<p>A list of the total amounts in all of your FreeAgent categories at a given point in time. You can also export this report</p>
										</Col>
										<Col className="report-section">
											<h5><a href="#">Audit Trail</a></h5>
											<p>A record of the changes that have been made to your FreeAgent data, including who made them and when they were made.</p>
										</Col> */}
										<Col></Col>									
										<Col></Col>									
									</Row>
								</CardBody>
							</Card>
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FinancialReport);
