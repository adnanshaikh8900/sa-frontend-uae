import React, { Component } from 'react';
// import { HorizontalBar } from 'react-chartjs-2'
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import {
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
	Card,
	CardBody,
	Progress,
} from 'reactstrap';
import { DateRangePicker2 } from 'components';
import moment from 'moment';
import './style.scss';

const ranges = {
	// 'Today': [moment(), moment()],
	// 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	'This Month': [moment().startOf('month'), moment().endOf('month')],
	'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	'Last Month': [
		moment().subtract(1, 'month').startOf('month'),
		moment().subtract(1, 'month').endOf('month'),
	],
};

const minusIcon = require('assets/images/dashboard/minus.png');
const equalIcon = require('assets/images/dashboard/equal.png');

class ProfitAndLoss extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: new Array(4).fill('1'),
		};
	}

	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		this.setState({
			activeTab: newArray,
		});
	};

	componentDidMount = () => {
		this.props.DashboardActions.getProfitAndLossData('12');
		this.props.DashboardActions.getTaxes('12');
		console.log(this.props.taxes);
	};

	handleChange = (e) => {
		e.preventDefault();
		this.props.DashboardActions.getTaxes(e.currentTarget.value);
	};

	render() {
		return (
			<div className="animated fadeIn">
				<Card className="profit-card">
					<CardBody className="tab-card">
						<div className="flex-wrapper">
							<Nav tabs>
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
										Taxes
									</NavLink>
								</NavItem>
							</Nav>
							<div className="card-header-actions">
								<select
									className="form-control"
									ref={this.dateRangeSelect}
									onChange={(e) => this.handleChange(e)}
								>
									<option value="12">Last 12 Months</option>
									<option value="6">Last 6 Months</option>
									<option value="3">Last 3 Months</option>
								</select>
							</div>
						</div>
						<TabContent activeTab={this.state.activeTab[0]}>
							<TabPane tabId="1">
								<div className="flex-wrapper">
									<div className="data-info">
										<div className="data-item">
											<div>
												<h3>{this.props.profit_loss['Income']}</h3>
												<p>INCOME</p>
											</div>
										</div>
										<img alt="minus" src={minusIcon} />
										<div className="data-item">
											<div>
												<h3> {this.props.profit_loss['Expense']}</h3>
												<p>EXPENSES</p>
											</div>
										</div>
										<img alt="sum" src={equalIcon} />
										<div className="data-item total">
											<div>
												<h3>{this.props.profit_loss['NetProfit']}</h3>
												<p>PROFIT</p>
											</div>
										</div>
									</div>
								</div>
								<div style={{ marginTop: 20 }}>
									<div className="data-info progress">
										<Progress
											className="income"
											color="success"
											value="90"
										></Progress>
										<div className="data-item small">
											<div>
												<h3>$ 180, 40</h3>
												<p>INCOME</p>
											</div>
										</div>
									</div>
									<div className="data-info progress">
										<Progress
											className="expense"
											color="warning"
											value="20"
										></Progress>
										<div className="data-item small">
											<div>
												<h3>$ 180, 40</h3>
												<p>EXPENSES</p>
											</div>
										</div>
									</div>
								</div>
							</TabPane>
							<TabPane tabId="2">
								{this.props.taxes ? (
									<div className="flex-wrapper">
										<div className="data-info">
											<div className="data-item">
												<div>
													<h3>{this.props.taxes['Tax payable']}</h3>
													<p>Tax Payable</p>
												</div>
											</div>
											<div className="data-item">
												<div>
													<h3>{this.props.taxes['InputVat']}</h3>
													<p>Input Vat</p>
												</div>
											</div>
											<div className="data-item total">
												<div>
													<h3>{this.props.taxes['OutputVat']}</h3>
													<p>Output Vat</p>
												</div>
											</div>
										</div>
									</div>
								) : (
									''
								)}
							</TabPane>
						</TabContent>
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default ProfitAndLoss;
