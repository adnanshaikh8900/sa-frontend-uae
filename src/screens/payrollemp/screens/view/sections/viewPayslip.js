import React from 'react';
import { connect } from 'react-redux';

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
} from 'reactstrap';
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
        if (prevState.selectedData !== nextProps.selectedData || prevState.totalAmount !== nextProps.totalAmount ||
			prevState.totalVatAmount != nextProps.totalVatAmount  ) {
			console.log('getDerivedStateFromProps state changed',nextProps.selectedData.poQuatationLineItemRequestModelList);

		 return { prefixData : nextProps.prefixData,
		 	selectedData :nextProps.selectedData,
			 totalAmount :nextProps.totalAmount,
			 totalVatAmount :nextProps.totalVatAmount,
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
		const { openModal, closeModal, id } = this.props;
		const { initValue, contentState, data, supplierId } = this.state;

		let tmpSupplier_list = []


		return (
			<div className="contact-modal-screen">
				<Modal isOpen={openModal} className="modal-success contact-modal">
					<ModalBody>
						<div className="view-invoice-screen">
							<div className="animated fadeIn">
								<Row>
									<Col lg={12} className="mx-auto">
										<div className="pull-right" style={{display:"inline-flex"}}>
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
												<CardBody id="section-to-print"><div> helooww </div></CardBody>	
												{/* <InvoiceTemplate
										invoiceData={invoiceData}
										currencyData={currencyData}
										ref={(el) => (this.componentRef = el)}
										totalNet={this.state.totalNet}
										companyData={profile}
									/> */}
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