import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col } from 'reactstrap';

import * as SalarySlipActions from './actions';
import * as EmployeeActions from '../../actions';
import ReactToPrint from 'react-to-print';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { CommonActions } from 'services/global';

import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';

import './style.scss';
import { SalarySlipTemplate } from './sections';

const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		employeeActions: bindActionCreators(
			EmployeeActions,
			dispatch,
		),
		salarySlipActions: bindActionCreators(
			SalarySlipActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class SalarySlip extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			DeductionData: {},
			FixedData: {},
			VariableData: {},
			totalNet: 0,
			currencyData: {},
			id: '',
		};

		this.formRef = React.createRef();
		this.termList = [
			{ label: 'Net 7', value: 'NET_7' },
			{ label: 'Net 10', value: 'NET_10' },
			{ label: 'Net 30', value: 'NET_30' },
			{ label: 'Due on Receipt', value: 'DUE_ON_RECEIPT' },
		];
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		if (this.props.location.state && this.props.location.state.id) {
			this.props.salarySlipActions
				.getSalariesByEmployeeId(this.props.location.state.id)
				.then((res) => {
					let val = 0;
					if (res.status === 200) {
						// res.data.invoiceLineItems &&
							// res.data.invoiceLineItems.map((item) => {
							// 	val = val + item.subTotal;
							// 	return item;
							// });
						this.setState(
							{
								DeductionData: res.data.salarySlipMap.Deduction,
								FixedData: res.data.salarySlipMap.Fixed,
								VariableData: res.data.salarySlipMap.Variable,
								id: this.props.location.state.id,
							}
						
						);
					}
				});
		}

		console.log(this.state.VariableData,"VariableData")
		console.log(this.state.DeductionData,"DeductionData")
		console.log(this.state.FixedData,"FixedData")
	};

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};	
	render() {
		const { invoiceData,DeductionData,FixedData,VariableData, currencyData, id } = this.state;
		const { profile } = this.props;

		return (
			<div className="view-invoice-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<div className="action-btn-container">
								{/* <Button
									className="btn btn-sm edit-btn"
									onClick={() => {
										this.props.history.push(
											'/admin/revenue/customer-invoice/detail',
											{ id },
										);
									}}
								>
									<i className="fa fa-pencil"></i>
								</Button> */}
								<Button
									className="btn btn-sm pdf-btn"
									onClick={() => {
										this.exportPDFWithComponent();
									}}
								>
									<i className="fa fa-file-pdf-o"></i>
								</Button>
								<ReactToPrint
									trigger={() => (
										<Button type="button" className="btn btn-sm print-btn">
											<i className="fa fa-print"></i>
										</Button>
									)}
									content={() => this.componentRef}
								/>

								<p
									className="close"
									onClick={() => {
										this.props.history.push('/admin/income/customer-invoice');
									}}
								>
									X
								</p>
							</div>
							<div>
							<PDFExport
									ref={(component) => (this.pdfExportComponent = component)}
									scale={0.8}
									paperSize="A4"
									landscape
								>
									<SalarySlipTemplate
										DeductionData={DeductionData}
										FixedData={FixedData}
										VariableData={VariableData}
									
										currencyData={currencyData}
										ref={(el) => (this.componentRef = el)}
									
										companyData={profile}
									/>
								</PDFExport>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SalarySlip);
