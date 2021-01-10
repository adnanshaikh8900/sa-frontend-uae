import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CardColumns } from 'reactstrap';
import { Col, Row, Card, CardBody, CardGroup } from 'reactstrap';
import Chart from 'react-apexcharts';
import { Line } from 'react-chartjs-2';

import {
	Invoice,
	BankAccount,
	CashFlow,
	RevenueAndExpense,
	ProfitAndLoss,
} from './sections';

import * as DashboardActions from './actions';

import './style.scss';

const mapStateToProps = (state) => {
	return {
		// Bank Account
		bank_account_type: state.dashboard.bank_account_type,
		bank_account_graph: state.dashboard.bank_account_graph,

		universal_currency_list: state.common.universal_currency_list,

		// Cash Flow
		cash_flow_graph: state.dashboard.cash_flow_graph,

		// Invoice
		invoice_graph: state.dashboard.invoice_graph,

		// Profit and Loss
		profit_loss: state.dashboard.proft_loss,
		taxes: state.dashboard.taxes,

		// Revenues and Expenses
		revenue_graph: state.dashboard.revenue_graph,
		expense_graph: state.dashboard.expense_graph,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		DashboardActions: bindActionCreators(DashboardActions, dispatch),
	};
};
const data4MultipleData = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [
		{
			backgroundColor: 'rgba(255, 255, 255, 0)',
			borderCapStyle: 'round',
			borderDash: [],
			borderWidth: 4,
			borderColor: '#7a7b97',
			borderDashOffset: 0.0,
			borderJoinStyle: 'round',
			pointBorderColor: '#7a7b97',
			pointBackgroundColor: '#ffffff',
			pointBorderWidth: 3,
			pointHoverRadius: 6,
			pointHoverBorderWidth: 3,
			pointRadius: 4,
			pointHoverBackgroundColor: '#ffffff',
			pointHoverBorderColor: '#7a7b97',
			data: [65, 59, 80, 81, 56, 55, 40],
			datalabels: {
				display: false,
			},
			label: "Today's Earnings",
		},
		{
			backgroundColor: 'rgba(255, 255, 255, 0)',
			borderCapStyle: 'round',
			borderDash: [],
			borderWidth: 4,
			borderColor: '#4191ff',
			borderDashOffset: 0.0,
			borderJoinStyle: 'round',
			pointBorderColor: '#4191ff',
			pointBackgroundColor: '#ffffff',
			pointBorderWidth: 3,
			pointHoverRadius: 6,
			pointHoverBorderWidth: 3,
			pointRadius: 4,
			pointHoverBackgroundColor: '#ffffff',
			pointHoverBorderColor: '#4191ff',
			data: [65, 81, 56, 59, 80, 55, 40],
			datalabels: {
				display: false,
			},
			label: 'Current Week',
		},
		{
			backgroundColor: 'rgba(255, 255, 255, 0)',
			borderCapStyle: 'round',
			borderDash: [],
			borderWidth: 4,
			borderColor: '#f4772e',
			borderDashOffset: 0.0,
			borderJoinStyle: 'round',
			pointBorderColor: '#f4772e',
			pointBackgroundColor: '#ffffff',
			pointBorderWidth: 3,
			pointHoverRadius: 6,
			pointHoverBorderWidth: 3,
			pointRadius: 4,
			pointHoverBackgroundColor: '#ffffff',
			pointHoverBorderColor: '#f4772e',
			data: [28, 48, 19, 86, 27, 40, 90],
			datalabels: {
				display: false,
			},
			label: 'Previous Week',
		},
	],
};
const data4MultipleOptions = {
	layout: {
		padding: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		},
	},
	scales: {
		yAxes: [
			{
				ticks: {
					display: true,
					beginAtZero: true,
				},
				gridLines: {
					display: true,
					color: '#eeeff8',
					drawBorder: true,
				},
			},
		],
		xAxes: [
			{
				ticks: {
					display: true,
					beginAtZero: true,
				},
				gridLines: {
					display: true,
					color: '#eeeff8',
					drawBorder: true,
				},
			},
		],
	},
	legend: {
		display: false,
	},
	responsive: true,
	maintainAspectRatio: false,
};
const chart55Options = {
	chart: {
		toolbar: {
			show: false,
		},
		sparkline: {
			enabled: true,
		},
	},
	labels: [
		'01 Jan 2001',
		'02 Jan 2001',
		'03 Jan 2001',
		'04 Jan 2001',
		'05 Jan 2001',
		'06 Jan 2001',
		'07 Jan 2001',
		'08 Jan 2001',
		'09 Jan 2001',
		'10 Jan 2001',
		'11 Jan 2001',
		'12 Jan 2001',
	],
	stroke: {
		curve: 'smooth',
		width: [0, 4],
	},
	grid: {
		strokeDashArray: '5',
		borderColor: 'rgba(125, 138, 156, 0.3)',
	},
	colors: ['#0abcce', '#060918'],
	legend: {
		show: false,
	},
	xaxis: {
		type: 'datetime',
	},
	yaxis: {
		min: 0,
	},
};
const chart55Data = [
	{
		name: 'Income',
		type: 'column',
		data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
	},
	{
		name: 'Expenses',
		type: 'line',
		data: [231, 442, 335, 227, 433, 222, 117, 316, 242, 252, 162, 176],
	},
];
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="dashboard-screen">
				<div className="animated fadeIn">
				<CardColumns className="cols-2 mb-3">
					<CashFlow {...this.props} />
					<BankAccount {...this.props} />
					</CardColumns>
					<Card className="p-4">
									<CardBody>
										<h6 className="text-uppercase font-weight-bold mb-1 text-black">
										Supplier & Customer Paid Invoices
										</h6>
										<div className="d-block p-4">
											<Line
												data={data4MultipleData}
												height={255}
												options={data4MultipleOptions}
											/>
										</div>
									</CardBody>
								</Card>
					<CardColumns className="cols-2 mb-3">
						{/* <RevenueAndExpense {...this.props} /> */}
						<Card className="cash-card">
									<CardBody>
										<h6 className="text-uppercase font-weight-bold mb-1 text-black">
											Profit & Loss
										</h6>
										<div className="d-block">
											<Chart
												options={chart55Options}
												series={chart55Data}
												type="line"
												height={300}
											/>
										</div>
									</CardBody>
								</Card>
						<Invoice {...this.props} />
						{/* <ProfitAndLoss {...this.props} /> */}
					</CardColumns>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
