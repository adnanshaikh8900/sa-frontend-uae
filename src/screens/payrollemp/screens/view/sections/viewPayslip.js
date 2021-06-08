import React from 'react';
import { connect } from 'react-redux';
import logo from 'assets/images/brand/datainnLogo.png';
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
		const { openModal, closeModal, id, companyData ,bankDetails} = this.props;
		const { initValue, contentState, data, supplierId } = this.state;

		let tmpSupplier_list = []
console.log(this.state.Variable,"Variable")

		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<ModalBody style={{padding: "15px 0px 0px 0px"}}>
						<div className="view-invoice-screen" style={{padding:" 0px 1px"}}>
							<div className="animated fadeIn">
								<Row>
									<Col lg={12} className="mx-auto">
										<div className="pull-right mb-1" style={{ display: "inline-flex" ,marginRight:"20px"}}>

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
													<div className="text-center"
														style={{
															width: '100%',
															// display: 'flex',
															border: '1px solid',
															padding: '7px', borderColor: '#c8ced3'
														}}
													>
														
															<div >
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
																	style={{ width: '200px' }}
																/>
															</div>
													
														
														
														<div className="text-center"
																style={{
																
																}}
															>
														<h5>	<b>	Payslip</b> ( {this.state.selectedData.salaryMonth} )
														</h5>	</div>

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
														<Col style={{ width: '185%',border: '1px solid', borderColor: '#c8ced3' }}>
															<div
																style={{
																	width: '95%',
																	margin: '0.5rem',
																	
																}}
															>
																
															
																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Employee Name </Col>
																		<Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.employeename !== '' ? this.state.selectedData.employeename : ('-')}</Col></Row>

																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Designation </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.designation !== '' ? this.state.selectedData.designation : ('-')}</Col></Row>

																	{/* <Row> <Col className='mt-2 mb-2'>Personal Email  </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.email ? this.state.selectedData.email : ('-')}</Col></Row>				 */}

																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Date of Joining</Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.dateOfJoining !== '' ? this.state.selectedData.dateOfJoining : ('-')}</Col></Row>

																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Pay Period </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.salaryMonth !== '' ? this.state.selectedData.salaryMonth : ('-')}</Col></Row>
																	<Row> <Col className='mt-2 mb-2' style={{ fontWeight: "630" }}>Pay Date </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.selectedData.payDate !== '' ? this.state.selectedData.payDate : ('-')}</Col></Row>
															
															</div>
														</Col>
														<Col style={{ width: '185%',border: '1px solid', borderColor: '#c8ced3' }}>
															<div
																style={{
																	width: '95%',
																	margin: '0.5rem',
																	
																}}
															>
									
															<Row> <Col className='mt-2 mb-2'>Bank Holder Name </Col><Col className='mt-2 mb-2'>: &nbsp;{bankDetails.accountHolderName ?
																	bankDetails.accountHolderName : ('-')}</Col></Row>


																<Row> <Col className='mt-2 mb-2'>Account Number </Col><Col className='mt-2 mb-2'>: &nbsp;{bankDetails.accountNumber  ? bankDetails.accountNumber : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>Bank Name</Col><Col className='mt-2 mb-2'>: &nbsp;{bankDetails.bankName ? bankDetails.bankName : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>Branch</Col><Col className='mt-2 mb-2'>: &nbsp;{bankDetails.branch ? bankDetails.branch : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>IBan No </Col><Col className='mt-2 mb-2'>: &nbsp;{bankDetails.iban ? bankDetails.iban : ('-')}</Col></Row>

															</div>
														</Col>
													</div>
													<div
														style={{
															width: '100%',
															display: "flex",
															border: 'solid 1px', borderColor: '#c8ced3',
															fontSize: "15px",

														}}
													>

														<div className="" style={{ width: "50%" }}>
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
														<tfoot  className="table-header-bg table-bordered table-hover">
															<tr>
																{/* <td></td> */}
																<td><b>Gross Earnings</b></td>
																<td>{this.state.selectedData.earnings}</td>
															</tr>
														</tfoot>
															</Table>
														</div>
														<div className=""  style={{ width: "50%" }}>
															<Table  >
																<thead className="table-header-bg">
																	<tr>
																		{/* <th className="center" style={{ padding: '0.5rem', width: "40px" }}>
																			#
									</th> */}
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
														<tfoot  className="table-header-bg table-bordered table-hover">
															<tr>
																{/* <td></td> */}
																<td><b>Total Deductions</b></td>
																<td>{this.state.selectedData.deductions ? this.state.selectedData.deductions : 0}</td>
															</tr>
														</tfoot>
															</Table>

														</div>

													</div>
													
													<div className="text-center"
														style={{
															width: '100%',

															border: 'solid 1px', borderColor: '#c8ced3',
															fontSize: "12px",
															backgroundColor: "#e4f8ff"
														}}
													>
														<h5>	<span style={{ color: "blue" }}>|</span> Total Net Payable <b>{this.state.selectedData.netPay}</b>
														</h5>
														<h5>	 ( {upperFirst(converter.toWords(toInteger(this.state.selectedData.netPay)))} )
														</h5>
													</div>
												</CardBody>
												<div className="text-center" style={{color:"#979b9f",    margin: "20px"}}>This is System generated Payslip And does not require a signature</div>
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