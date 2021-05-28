import React from 'react';
import { connect } from 'react-redux';
import logo from 'assets/images/brand/logo.png';
import {
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	CardHeader,
	ModalBody,
	ModalFooter,
	UncontrolledTooltip,
	CardBody,
	Table,
	Card,
} from 'reactstrap';
import { toInteger, upperCase, upperFirst } from 'lodash';
import { Formik, Field } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { selectOptionsFactory } from 'utils';
import DatePicker from 'react-datepicker';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { CommonActions } from 'services/global';

import { toast } from 'react-toastify';
import { data } from '../../../../Language/index'
import LocalizedStrings from 'react-localization';

import '../style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';
import ReactToPrint from 'react-to-print';

var converter = require('number-to-words');

const mapStateToProps = (state) => {

	return {

		contact_list: state.request_for_quotation.contact_list,

	};

};


const mapDispatchToProps = (dispatch) => {
	return {

	};
};
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		},
	}),
};

let strings = new LocalizedStrings(data);
class PaySlipModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: false,

		};



	}



	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.selectedData !== nextProps.selectedData) {
			console.log('getDerivedStateFromProps state changed', nextProps.selectedData);
			return {
				prefixData: nextProps.prefixData,
				selectedData: nextProps.selectedData,
				Fixed:nextProps.Fixed,
				FixedAllowance:nextProps.FixedAllowance,
				Deduction:nextProps.Deduction,
				Variable:nextProps.Variable,

			};
		}
		// else if(prevState.totalAmount !== nextProps.totalAmount)
		// {
		// 	console.log('+++++++++++++++++',nextProps.totalAmount)
		// 	return { prefixData : nextProps.prefixData,
		// 		totalAmount :nextProps.totalAmount };
		// }
		// else if(prevState.totalVatAmount != nextProps.totalVatAmount)
		// {
		// 	console.log('---------',nextProps.totalVatAmount)
		// 	return{
		// 		prefixData : nextProps.prefixData,
		// 		totalVatAmount :nextProps.totalVatAmount
		// 	};
		// }
	}


	// Create

	displayMsg = (err) => {
		toast.error(`${err.data}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};
	_showDetails = (bool) => {
		this.setState({
			showDetails: bool
		});
	}

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};

	render() {
		strings.setLanguage(this.state.language);
		const { openModal, closeModal, id, companyData } = this.props;
		const { initValue, contentState, data, supplierId } = this.state;

		let tmpSupplier_list = []
console.log(this.state.Variable,"Variable")

		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<ModalBody>
						<div className="view-invoice-screen">
							<div className="animated fadeIn">
								<Row>
									<Col lg={12} className="mx-auto">
										<div className="pull-right" style={{ display: "inline-flex" }}>

											<Button
												className="mr-2 print-btn-cont"
												onClick={() => {
													this.exportPDFWithComponent();
												}}
											>
												<i className="fa fa-file-pdf-o"></i>
											</Button>
											{/* <ReactToPrint
												trigger={() => (
													<Button type="button" className=" print-btn-cont">
														<i className="fa fa-print"></i>
													</Button>
												)}
												content={() => this.componentRef}
											/> */}
											<div
												className="mr-2 print-btn-cont"
												onClick={() => window.print()}
												style={{
													cursor: 'pointer',
												}}
											>
												<i className="fa fa-print"></i>
											</div>
											<Button
												type="button"
												className=" print-btn-cont"
												style={{ color: "black" }}
												onClick={() => {
													closeModal(false);
												}}
											>
												X
										</Button>
										</div>
										<div>
											<PDFExport
												ref={(component) => (this.pdfExportComponent = component)}
												scale={0.8}
												paperSize="A4"

											>
											
												<CardBody  id="section-to-print" style={{}}>
													<div
														style={{
															width: '100%',
															display: 'flex',
															border: '1px solid',
															padding: '7px', borderColor: '#c8ced3'
														}}
													>
														<div style={{ width: '70%' }}>
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
																	style={{ width: ' 100px' }}
																/>
															</div>
														</div>
														<div style={{ width: '130%', justifyContent: 'center' }}>

															<div
																style={{
																	width: '130%',
																	fontSize: '1rem',
																	fontWeight: '700',
																	textTransform: 'uppercase',
																	color: 'black',
																}}
															>
																Payslip for the month of {this.state.selectedData.salaryMonth}
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

														</div>
													</div>


													<div
														style={{
															width: '100%',
															display: 'flex',
															justifyContent: 'space-between',
															marginBottom: '1rem',
															borderLeft: '1px solid',
															borderRight: '1px solid',
															borderBottom: '1px solid', borderColor: '#c8ced3'
														}}
													>
														<div style={{ width: '185%' }}>
															<div
																style={{
																	width: '95%',
																	margin: '0.5rem',
																	border: '1px solid', borderColor: '#c8ced3'
																}}
															>
																<div className="mb-1 mt-1 ml-2">
																	<b>Employee Pay Summary,</b>
																</div>
																<div className="m-2" style={{ fontSize: '10px' }}>
																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Employee Name </Col>
																		<Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.employeename !== '' ? this.state.selectedData.employeename : ('-')}</Col></Row>

																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Designation </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.designation !== '' ? this.state.selectedData.designation : ('-')}</Col></Row>

																	{/* <Row> <Col className='mt-2 mb-2'>Personal Email  </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.email ? this.state.EmployeeDetails.email : ('-')}</Col></Row>				 */}

																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Date of Joining</Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.dateOfJoining !== '' ? this.state.selectedData.dateOfJoining : ('-')}</Col></Row>

																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Pay Period </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.salaryMonth !== '' ? this.state.selectedData.salaryMonth : ('-')}</Col></Row>
																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Pay Date </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.payDate !== '' ? this.state.selectedData.payDate : ('-')}</Col></Row>
																</div>


																{/* <div className="mb-1 ml-2"><b>Name:</b> {invoiceData.name}</div>
																<div className="mb-1 ml-2"><b>Company:</b> {invoiceData.organisationName}</div>
																<div className="mb-1 ml-2"><b>Email:</b> {invoiceData.email}</div>
																<div className="mb-3 ml-2"><b>Address:</b> {invoiceData.address}</div> */}
															</div>
														</div>
														<div
															style={{
																width: '100%',
																display: 'flex',
																justifyContent: 'space-between',
																padding:"22px"
															}}
														>
															<Card className="" style={{ width: '80%',margin:"1.5rem" ,fontSize:"10px" }}>
																<div className="text-center pt-4">Employee Net Pay</div>
																<div className="mb-1 ml-2 text-center"><h1 style={{ color: "#2064d8" }}><b>{this.state.selectedData.netPay}</b></h1></div>
																<div className="mb-1 ml-2 text-center">Paid Days : {this.state.selectedData.noOfDays} <b>|</b>  LOP Days : {this.state.selectedData.lopDays}</div>
															</Card>
														</div>
													</div>
													<div
														style={{
															width: '100%',
															display: "flex",
															border: 'solid 1px', borderColor: '#c8ced3',
															fontSize: "12px",

														}}
													>

														<div className="pr-2" style={{ width: "50%" }}>
															<Table >
																<thead className="table-header-bg">
																	<tr>
																		{/* <th className="center" style={{ padding: '0.5rem', width: "40px" }}>																			#									</th> */}
																		{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
																		<th style={{ padding: '0.5rem' }}>Earnings</th>
																		<th style={{ padding: '0.5rem' }}>Amount</th>

																	</tr>
																</thead>
																<tbody className=" table-bordered table-hover">
															{this.state.Fixed &&
															this.state.Fixed &&
															this.state.Fixed.map((item, index) => {
																	return (
																		<tr key={index}>
																			{/* <td className="center">{index + 1}</td> */}
																			<td>{item.componentName}</td>
																			<td>{item.componentValue}</td>
																			
																		</tr>
																	);
																})}
																{this.state.FixedAllowance &&
															this.state.FixedAllowance &&
															this.state.FixedAllowance.map((item, index) => {
																	return (
																		<tr key={index}>
																			{/* <td className="center">{index + 1}</td> */}
																			<td>{item.componentName}</td>
																			<td>{item.componentValue}</td>
																			
																		</tr>
																	);
																})}
																
																{this.state.Variable &&
															this.state.Variable &&
															this.state.Variable.map((item, index) => {
																	return (
																		<tr key={index}>
																			{/* <td className="center">{index + 1}</td> */}
																			<td>{item.componentName}</td>
																			<td>{item.componentValue}</td>
																			
																		</tr>
																	);
																})}
														</tbody>
														<tfoot  className=" table-bordered table-hover">
															<tr>
																{/* <td></td> */}
																<td><b>Gross Earnings</b></td>
																<td>{this.state.selectedData.earnings}</td>
															</tr>
														</tfoot>
															</Table>
														</div>
														<div className="pl-2"  style={{ width: "50%" }}>
															<Table  >
																<thead className="table-header-bg">
																	<tr>
																		<th className="center" style={{ padding: '0.5rem', width: "40px" }}>
																			#
									</th>
																		{/* <th style={{ padding: '0.5rem' }}>Item</th> */}
																		<th style={{ padding: '0.5rem' }}>Deductions</th>
																		<th style={{ padding: '0.5rem' }}>Amount</th>

																	</tr>
																</thead>
														<tbody className=" table-bordered table-hover">
															{this.state.Deduction &&
															this.state.Deduction &&
															this.state.Deduction.map((item, index) => {
																	return (
																		<tr key={index}>
																			{/* <td className="center">{index + 1}</td> */}
																			<td>{item.componentName}</td>
																			<td>{item.componentValue}</td>
																			
																		</tr>
																	);
																})}
														</tbody>
														<tfoot  className=" table-bordered table-hover">
															<tr>
																{/* <td></td> */}
																<td><b>Total Deductions</b></td>
																<td>{this.state.selectedData.deductions}</td>
															</tr>
														</tfoot>
															</Table>

														</div>

													</div>
													<div
														style={{
															width: '100%',

															border: 'solid 1px', borderColor: '#c8ced3',
															fontSize: "12px",
															backgroundColor: "#e4f8ff"
														}}
													>
														<h5>	<span style={{ color: "blue" }}>|</span> Total Net Payable <b>{this.state.selectedData.netPay}</b>  &nbsp; ( {upperFirst(converter.toWords(toInteger(this.state.selectedData.netPay)))} )
														</h5>
													</div>
												</CardBody>
											</PDFExport>
										</div>
									</Col>
								</Row>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="secondary"
							className="btn-square"
							onClick={() => {
								closeModal(false);
							}}
						>
							<i className="fa fa-ban"></i> {strings.Cancel}
						</Button>
					</ModalFooter>
				</Modal>

			</div>
		);
	}
}


export default connect(
	mapStateToProps

)(PaySlipModal);