import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
	Card,
	CardBody,
} from 'reactstrap';

import './style.scss';

const backOption = {
	tooltips: {
		enabled: false,
		custom: CustomTooltips,
	},
	legend: {
		display: false,
		position: 'bottom',
	},
	elements: {
		line: {
			tension: 0, // disables bezier curves,
		},
	},
};

const bankIcon = require('assets/images/dashboard/bank.png');

class BankAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: new Array(4).fill('1'),
			totalBalance: 0,
		};
		this.bankAccountSelect = React.createRef();
		this.dateRangeSelect = React.createRef();
	}

	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		this.setState({
			activeTab: newArray,
		});
	};

	componentDidMount = () => {
		console.log(this.props);
		this.props.DashboardActions.getBankAccountTypes().then((res) => {
			if (res.status === 200) {
				let val =
					res.data && res.data.data && res.data.data[0]
						? res.data.data[0].bankAccountId
						: '';
				this.getBankAccountGraphData(val, 12);
				this.props.DashboardActions.getTotalBalance().then((res) => {
					if (res.status === 200) {
						this.setState({ totalBalance: res.data }, () => {});
					}
				});
			}
		});
	};

	getBankAccountGraphData = (account, dateRange) => {
		this.props.DashboardActions.getBankAccountGraphData(account, dateRange);
	};

	// componentWillReceiveProps(newProps) {
	//   if (this.props.bank_account_type !== newProps.bank_account_type) {

	//   }
	// }

	handleChange = (e) => {
		e.preventDefault();
		this.getBankAccountGraphData(
			this.bankAccountSelect.current.value,
			this.dateRangeSelect.current.value,
		);
	};

	render() {
		const line = {
			labels: this.props.bank_account_graph.labels,
			datasets: [
				{
					label: this.props.bank_account_graph.account_name,
					fill: true,
					lineTension: 0.1,
					backgroundColor: 'rgba(75,192,192,0.4)',
					borderColor: 'rgba(75,192,192,1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 2,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 4,
					pointHitRadius: 20,
					data: this.props.bank_account_graph.data,
				},
			],
		};

		return (
			<div className="animated fadeIn">
				<Card className="bank-card">
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
										Banking
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
											<img
												alt="bankIcon"
												className="d-none d-lg-block"
												src={bankIcon}
												style={{ width: 40, marginRight: 10 }}
											/>
											<div>
												<select
													className="form-control bank-type-select"
													ref={this.bankAccountSelect}
													onChange={(e) => this.handleChange(e)}
												>
													{this.props.bank_account_type.map(
														(account, index) => (
															<option key={index} value={account.bankAccountId}>
																{account.name}
															</option>
														),
													)}
												</select>
												<p style={{ fontWeight: 500, textIndent: 5 }}>
													Last updated on{' '}
													{this.props.bank_account_graph.updatedDate}
												</p>
											</div>
										</div>
									</div>

									<div className="data-info">
										<div className="data-item">
											<div>
												<h3>${this.props.bank_account_graph.balance}</h3>
												<p>BALANCE</p>
											</div>
										</div>
										<div className="data-item">
											<div>
												<h3>${this.state.totalBalance}</h3>
												<p>ALL ACCOUNTS</p>
											</div>
										</div>
									</div>
								</div>
								<div className="chart-wrapper">
									<Line
										data={line}
										options={backOption}
										datasetKeyProvider={() => {
											return Math.random();
										}}
									/>
								</div>
							</TabPane>
						</TabContent>
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default BankAccount;
