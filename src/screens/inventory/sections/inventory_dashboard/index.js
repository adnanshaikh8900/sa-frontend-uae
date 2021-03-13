import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row, Card, CardBody, CardGroup } from 'reactstrap';
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
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Bar, HorizontalBar,Line } from 'react-chartjs-2';



import Chart from 'react-apexcharts';
const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.common.company_profile,
		low_stock_list: state.inventory.low_stock_list,
		high_stock_list: state.inventory.high_stock_list,
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
			lowStockCount:[],

			options: {},
			
			
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
		this.props.inventoryActions.getLowStockList();
		this.props.inventoryActions.getHighStockList();
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
			this.props.inventoryActions
			.getlowStockProductCountForInventory()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ lowStockCount: res.data });
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
		const { profile, high_stock_list,low_stock_list } = this.props;
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
		const series = {
			series: [this.state.lowStockCount],
		}
		const pie2 = {
		
			datasets: [	
				{
					data: [this.state.lowStockCount],
					backgroundColor: [
						'rgba(237,67,53,1)',
					],
					hoverBackgroundColor: [
						'rgba(240,70,53,1)',
					],
				},
			],
		};
		const expenseOption = {
			
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
		const chartOptions = {
			options: {
			  dataLabels: {
				enabled: false
			  },
			 // colors: ["#C7F464", "#662E9B", "#E2C044", "#C4BBAF"],
			  fill: {
				type: "color"
			  },
			 
			  plotOptions: {
				pie: {
					startAngle: -90,
					endAngle: 90,
					offsetY: 10
				  }
			  },
			  
			  chart: {
				events: {
				  dataPointMouseEnter: null
				}
			  }
			},
			series: [44, 55, 41, 17],
			labels: ["Voice mail", "Recordings", "System", "Free"]
		  };
		  const chartOptions1 = {
			options: {
			  dataLabels: {
				enabled: false
			  },
			 // colors: ["#C7F464", "#662E9B", "#E2C044", "#C4BBAF"],
			  fill: {
				type: "color"
			  },
			 
			  plotOptions: {
			
			  },
			  
			  chart: {
				events: {
				  dataPointMouseEnter: null
				}
			  }
			},
			legend:{
				position:"bottom",
			},
			series: [44, 55, 41, 17],
			labels: ["Voice mail", "Recordings", "System", "Free"]
		  };
		  const dataHorBar = {
			labels: ['Product ', 'Product', 'Product ', 'Product ', 'Product ', 'Product ', 'Product ','Product ','Product ','Product '],
			datasets: [
			  {
				backgroundColor: '#a1b86d',
				borderColor: 'rgba(161,184,109,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(161,184,109,0.3)',
				hoverBorderColor: 'rgba(161,184,109,0.5)',
				data: [80, 75, 70, 65, 60, 55, 50, 45, 40, 35,30]
			  },
			  
			]
		  };
		  const data = {
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
			datasets: [
			  {
				label: "First dataset",
				data: [33, 53, 85, 41, 44, 65],
				fill: true,
				backgroundColor: "rgba(225,250,300,0.5)",
				borderColor: "rgba(0,120,212,1)"
			  }
			]
		  };
		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
				<div style={{marginLeft:"250px",marginRight:"250px"}}>
						<Row>
							<CardBody  className="mr-3 center mb-3 ml-3"  style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
										<h6 className="text-center font-weight-bold mb-1 text-black mt-3">
											All Products Count
										</h6>
										<h5 className="d-block mt-4 text-center" >
										{this.state.allProducts}
										</h5>
						
							</CardBody>
							<CardBody  className="mr-3 center mb-3"  style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
										<h6 className="text-center font-weight-bold mb-1 text-black mt-3">
											All Products Count
										</h6>
										<h5 className="d-block mt-4 text-center" >
										{this.state.allProducts}
										</h5>
						
							</CardBody>
							<CardBody  className="mr-3 center mb-3 ml-3"  style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
										<h6 className="text-center font-weight-bold mb-1 text-black mt-3">
											All Products Count
										</h6>
										<h5 className="d-block mt-4 text-center" >
										{this.state.allProducts}
										</h5>
						
							</CardBody>
							<CardBody  className="mr-3 center mb-3"  style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
										<h6 className="text-center font-weight-bold mb-1 text-black mt-3">
											All Products Count
										</h6>
										<h5 className="d-block mt-4 text-center" >
										{this.state.allProducts}
										</h5>
						
							</CardBody>
						
							</Row>
							</div>
		
				<Row>
				<CardGroup style={{
							width:"100%",
							
							}}>
				<Card className="mr-2" style={{
							width:"50%",
							
							}}>
						<div  style={{color:"#2064d8",backgroundColor:"#edf2f9" ,height:"9.8%"}}>
						<h6 className="text-uppercase font-weight-bold pt-3 text-black ml-4">	
									TOP SELLING PRODUCT
						</h6>
					</div>
					<CardBody>
						<div  style={{	width:"750px" }} >
						<HorizontalBar data={dataHorBar} />
							</div>
							</CardBody>
					</Card>
					<Card className="ml-2"  style={{
							width:"50%",
						}}>
					<div  style={{color:"#2064d8",backgroundColor:"#edf2f9" ,height:"9.8%"}}>
						<h6 className="text-uppercase font-weight-bold pt-3 text-black ml-4">	
									LOW SELLING PRODUCT 
										</h6>
						</div>
						<CardBody>
						<div  style={{	width:"500px" ,marginLeft:"150px"}} >
						<Chart
					  options={chartOptions1.options}
						  series={chartOptions1.series}
						  type="donut"
						/>
							</div>
							</CardBody>
					
							</Card>
						</CardGroup>
					</Row>

					<Row className="mt-3">
				<CardGroup>
				<Card className="mr-2" style={{
							width:"50%",
							
							}}>
						<div  style={{color:"#2064d8",backgroundColor:"#edf2f9" ,height:"9.8%"}}>
						<h6 className="text-uppercase font-weight-bold pt-3 text-black ml-4">	
									Total Revenue 
						</h6>
					</div>
					<CardBody>
						<div   style={{	width:"750px" }} >
						<Line data={data} />
							</div>
							</CardBody>
					</Card>
					<Card className="ml-2"  style={{
							width:"50%",
							
							
						}}>
					<div  style={{color:"#2064d8",backgroundColor:"#edf2f9" ,height:"9.8%"}}>
						<h6 className="text-uppercase font-weight-bold pt-3 text-black ml-4">	
									TOP SELLING PRODUCT 
										</h6>
						</div>
						<CardBody style={{height:"100%",display: 'flex'}}>
								<div className="column"  
									 style={{
											
											marginBlock:'-20px',
											borderRight:"1px solid #d5dae1"
											
										}} >
									<BootstrapTable
											selectRow={this.selectRowProp}
											search={false}
											options={this.options}
											data={
												high_stock_list 
													? high_stock_list
													: []
											}
											version="4"
											hover
											remote
											className="mt-2 mr-2"
											trClassName="cursor-pointer"
											ref={(node) => (this.table = node)}
											>
												<TableHeaderColumn dataField="productCode" className="table-header-bg">
													Product	Code
												</TableHeaderColumn >
												<TableHeaderColumn isKey dataField="productName" className="table-header-bg">
													Product	Name
												</TableHeaderColumn >
												<TableHeaderColumn  dataField="quantitySold" className="table-header-bg">
												Quantity Sold
												</TableHeaderColumn >
											</BootstrapTable>
									</div>
							</CardBody>
					
							</Card>
						</CardGroup>
					</Row>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(InventoryDashboard);
