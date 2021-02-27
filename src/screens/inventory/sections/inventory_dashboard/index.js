import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row, Card, CardBody, CardGroup } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import moment from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { Loader, Currency } from 'components';
import * as InventoryActions from '../../actions';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './style.scss';


const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.common.company_profile,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		inventoryActions: bindActionCreators(
			InventoryActions,
			dispatch,
		),
	};
};

class InventoryDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dropdownOpen: false,
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD/MM/YYYY'),
				endDate: moment().endOf('month').format('DD/MM/YYYY'),
				reportBasis: 'ACCRUAL',
				chartOfAccountId: '',
			},
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			allProducts:'',
			quantityAvailable:'',
		};
		this.columnHeader = [
			{ label: 'Account', value: 'Account', sort: true },
			{ label: '', value: 'Account Code', sort: false },
			{ label: 'Total', value: 'Total', sort: true },
		];
	}

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					startDate: moment(value.startDate).format('DD/MM/YYYY'),
					endDate: moment(value.endDate).format('DD/MM/YYYY'),
				},
				loading: true,
				view: !this.state.view,
			},
			() => {
				this.initializeData();
			},
		);
	};
	

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		this.props.inventoryActions
			.getAllProductCount()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ allProducts: res.data });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
			this.props.inventoryActions
			.getQuantityAvailable()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ quantityAvailable: res.data });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	exportFile = (csvData, fileName, type) => {
		const fileType =
			type === 'xls'
				? 'application/vnd.ms-excel'
				: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = `.${type}`;
		const ws = XLSX.utils.json_to_sheet(csvData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: type, type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	toggle = () =>
		this.setState((prevState) => {
			return { dropdownOpen: !prevState.dropdownOpen };
		});

	viewFilter = () =>
		this.setState((prevState) => {
			return { view: !prevState.view };
		});

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};

	render() {
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list,company_profile } = this.props;
		const cashBarOption = {
			tooltips: {
				enabled: false,
				custom: CustomTooltips,
			},
			legend: {
				display: true,
				position: 'bottom',
			},
			scales: {
				yAxes: [
					{
						ticks: {
							// Include a dollar sign in the ticks
							callback(value, index, values) {
								return value;
							},
							beginAtZero: true,
						},
					},
				],
			},
			maintainAspectRatio: false,
		};

		const cashFlowBar = {
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
			datasets: [
				{
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
					backgroundColor: 'rgba(244, 119, 46, 0.85)',
					hoverBackgroundColor: 'rgba(244, 119, 46, 0.85)',
					data:[440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
				},
				{
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
					backgroundColor: 'rgba(65, 145, 255, 0.85)',
					hoverBackgroundColor: 'rgba(65, 145, 255, 0.85',
					data: [231, 442, 335, 227, 433, 222, 117, 316, 242, 252, 162, 176],
				},
				{
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
					backgroundColor: 'rgba(244, 119, 46, 0.85)',
					hoverBackgroundColor: 'rgba(244, 119, 46, 0.85)',
					data:[440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
				},
				{
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
					backgroundColor: 'rgb(192, 184, 46)',
					hoverBackgroundColor: 'rgba(244, 119, 46, 0.85)',
					data:[440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
				},
			],
		};
		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
				
			<div className="row center ml-1 mr-1" style={{height:"175px"}}>

				<div className="column card"  style={{
							width:"50%",
						alignItems:"flex-end"
						}} >
					
						
							<CardBody  className="mr-3 center mb-3" align="right " style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",float:"right",width:"33%"}}>
										<h6 className="text-center font-weight-bold mb-1 text-black mt-3">
											All Products
										</h6>
										<h5 className="d-block mt-4 text-center" >
										{this.state.allProducts}
										</h5>
						
							</CardBody>
						
					</div>

					<div className="column card" style={{
							width:"50%",
						
						}}>
						
						
							<CardBody className="ml-3 mb-3" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", float:"left",width:"33%"}}>
										<h6 className="text-Center font-weight-bold mb-1 text-black mt-3" style={{textAlign:"center"}}>
											Quantity Available
										</h6>
										<h5 className="d-block mt-4 text-center" >
										{this.state.quantityAvailable}
										</h5>
						
							</CardBody>
				
					</div>
				</div>

				<CardGroup>
				<Card className="mr-2" style={{
							width:"50%",
							}}>
						<div  style={{color:"#2064d8",backgroundColor:"#edf2f9" ,height:"9.8%"}}>
						<h6 className="text-uppercase font-weight-bold pt-3 text-black ml-4">	
									PRODUCT LISTING
										</h6>
										</div>
							
							<CardBody style={{height:"100%",display: 'flex'}}>
								<div className="column"  
									 style={{
											width:"50%",
											marginBlock:'-20px',
											borderRight:"1px solid #d5dae1"
											
										}} >
									
										
											
													<table style={{width:'-webkit-fill-available'}}>
														<tr>
														<th><b>Product Code</b></th>
														<th><b>Product Name</b></th>
														</tr>
														<tr>
															<td></td>
														</tr>
													</table>
										
										
									</div>

									<div className="column text-center" 
											style={{
												width:"50%",
												marginBlock:'-20px',
											
												
											}}
									>
										content
											
									</div>
							</CardBody>
					
					</Card>
					<Card className="ml-2"  style={{
							width:"50%",
							height:"530px"
							
						}}>
						<div>
							<div  style={{color:"#2064d8",backgroundColor:"#edf2f9" ,height:"9%"}}>
						<h6 className="text-uppercase font-weight-bold pt-3 text-black ml-4">	
															TOP SELLING PRODUCTS
										</h6>
										</div>
							<CardBody>
							
							
									
										<div className="d-block"	style={{
									
									height:"435px"
									
								}}>
										<Bar
								data={cashFlowBar}
								options={cashBarOption}
								style={{ height: 200 }}
								datasetKeyProvider={() => {
									return Math.random();
								}}

							
							/>
								</div>
						
							</CardBody>
						</div>
					</Card>
					</CardGroup>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InventoryDashboard);
