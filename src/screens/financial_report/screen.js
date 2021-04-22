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
const Financial = require('assets/images/reports/Out line.png');
const Vat = require('assets/images/reports/vat.png');
const Journal = require('assets/images/reports/journal.png');
const Sales = require('assets/images/reports/sales.png');
const Purchase = require('assets/images/reports/pay.png');
const Receivables = require('assets/images/reports/inbox.png');

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
									<div className="h6 mb-0 d-flex align-items-center">
										<i className="nav-icon fas fa-usd" />
										<span className="ml-2"> Reports</span>
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

									<Row xs="3">


										<Col  className="report-section ml-4">
										<div className="d-flex" style={{ backgroundColor: "#e8effb", height: "35px",width:"350px" }}>
											<img
											className="ml-2 mr-2 mt-2 mb-2 "
											src={Financial}
											style={{height:'25px'}}
											></img>	<h5 className="mb-3 mt-2">Financial Reports</h5></div>
											<div className="mt-2 ml-4">
											<h6><a style={{fontWeight:'400'}} href ="#" onClick={() => 
											this.props.history.push('/admin/report/financial/profitandloss')}> Profit & Loss</a></h6>
											<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
											this.props.history.push('/admin/report/financial/balancesheet')}>Balance Sheet</a></h6>
											<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
											this.props.history.push('/admin/report/financial/horizontalbalancesheet')}>Horizontal Balance Sheet</a></h6>
											<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
											this.props.history.push('/admin/report/financial/trailbalances')}>Trail Balances</a></h6>

									</div>
										</Col>

										<Col className="report-section">
										<div className="d-flex" style={{ backgroundColor: "#e8effb", height: "35px",width:"350px" }}>
											<img
											className="ml-2 mr-2 mt-2 mb-2 "
											src={Vat}
											style={{height:'25px'}}
											></img>	<h5  className="mb-3 mt-2">Vat Reports</h5></div>
										<div className="mt-2 ml-4">
										<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
									this.props.history.push('/admin/report/financial/vatreturns')}>Vat Returns Report</a></h6>
										<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
									this.props.history.push('/admin/taxes/vat-transactions')}>Vat Transaction Report</a></h6>
									</div>
										</Col>
										<Col className="report-section">
										<div className="d-flex" style={{ backgroundColor: "#e8effb", height: "35px",width:"350px" }}>
											<img
											className="ml-2 mr-2 mt-2 mb-2 "
											src={Journal}
											style={{height:'25px'}}
											></img>	<h5 className="mb-3 mt-2">Detailed</h5></div>
										<div className="mt-2 ml-4">
										<h6><a   style={{fontWeight:'400'}} href="#"
										onClick={() =>
											this.props.history.push('/admin/report/detailed-general-ledger')}
											>
										Detailed Journal ledger</a></h6>
										</div>
										</Col>

									</Row>
									<Row xs="3" className="mt-4">
									
									<Col  className="report-section ml-4">
									<div className="d-flex" style={{ backgroundColor: "#e8effb", height: "35px",width:"350px" }}>
											<img
												className="ml-2 mr-2 mt-2 mb-2 "
											src={Sales}
											style={{height:'25px'}}
											></img>	<h5 className="mb-3 mt-2">Sales</h5></div>
											<div className="mt-2 ml-4">
											<h6><a  style={{fontWeight:'400'}} href ="#" onClick={() => 
											this.props.history.push('/admin/report/financial/salesbycustomer')}> Sales By Customer</a></h6>
											<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
											this.props.history.push('/admin/report/financial/salesbyproduct')}>Sales By Product</a></h6>
									
									</div>
										</Col>

										<Col  className="report-section ml-4">
										<div className="d-flex" style={{ backgroundColor: "#e8effb", height: "35px",width:"350px" }}>
											<img
												className="ml-2 mr-2 mt-2 mb-2 "
											src={Purchase}
											style={{height:'25px'}}
											></img>	<h5 className="mb-3 mt-2">Purchase</h5></div>
											<div className="mt-2 ml-4">
											<h6><a  style={{fontWeight:'400'}} href ="#" onClick={() => 
											this.props.history.push('/admin/report/financial/purchasebyvendor')}> Purhase By Vendor</a></h6>
											<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
											this.props.history.push('/admin/report/financial/purchasebyitem')}>Purhase By Product</a></h6>
									
									</div>
										</Col>
										<Col  className="report-section ml-4">
										<div className="d-flex" style={{ backgroundColor: "#e8effb", height: "35px",width:"350px" }}>
											<img
												className="ml-2 mr-2 mt-2 mb-2 "
											src={Receivables}
											style={{height:'25px'}}
											></img>	<h5 className="mb-3 mt-2">Receivables</h5></div>
											<div className="mt-2 ml-4">
											<h6><a  style={{fontWeight:'400'}} href="#" onClick={() =>
											this.props.history.push('/admin/report/receivable-invoice-summary')}>Receivable Invoice Summary</a></h6>
											<h6><a  style={{fontWeight:'400'}} href ="#" onClick={() => 
											this.props.history.push('/admin/report/receivable-invoice-details')}> Receivable Invoice Detail</a></h6>
										
									
									</div>
									</Col>
									</Row>
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FinancialReport);
