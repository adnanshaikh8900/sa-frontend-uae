import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	UncontrolledTooltip,
} from 'reactstrap';


import './style.scss';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

import * as ProductActions from '../../actions';
import * as ImportActions from '../../actions';
import { CommonActions } from 'services/global';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';



const mapStateToProps = (state) => {
	return {
		vat_list: state.product.vat_list,
		product_warehouse_list: state.product.product_warehouse_list,
		product_category_list: state.product.product_category_list,
		supplier_list: state.supplier_invoice.supplier_list,
		inventory_account_list:state.product.inventory_account_list,

	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		importActions: bindActionCreators(
			ImportActions,
			dispatch,
		),
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
class MigarteHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			openWarehouseModal: false,
			contactType:1,
		
			createMore: false,
			exist: false,
			ProductExist: false,
			disabled: false,
			productActive: true,
			isActive:true,
			selectedStatus:true,
			summaryList:[ { "migrationBeginningDate": "2021-10-04T13:21:24", "executionDate": "2021-10-14T13:06:24.267", "fileName": "Contacts.csv", "recordCount": 4, "recordsMigrated": 4, "recordsRemoved": 0 }, { "migrationBeginningDate": "2021-10-04T13:21:24", "executionDate": "2021-10-14T13:06:26.103", "fileName": "Vendors.csv", "recordCount": 3, "recordsMigrated": 3, "recordsRemoved": 0 }, { "migrationBeginningDate": "2021-10-04T13:21:24", "executionDate": "2021-10-14T13:06:26.489", "fileName": "Item.csv", "recordCount": 4, "recordsMigrated": 4, "recordsRemoved": 0 }, { "migrationBeginningDate": "2021-10-04T13:21:24", "executionDate": "2021-10-14T13:06:29.360", "fileName": "Invoice.csv", "recordCount": 4, "recordsMigrated": 0, "recordsRemoved": 4 }, { "migrationBeginningDate": "2021-10-04T13:21:24", "executionDate": "2021-10-14T13:06:34.291", "fileName": "Bill.csv", "recordCount": 6, "recordsMigrated": 0, "recordsRemoved": 6 } ],
		};
		this.formRef = React.createRef();       
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[ +a-zA-Z0-9-./\\|]+$/;
		this.regExAlpha = /^[0-9!@#$&()-\\`.+,/\"]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regDecimal5 =/^\d{1,5}$/;
	}

	componentDidMount = () => {
		this.props.importActions
		.getMigrationSummary()
		.then((res) => {
			if (res.status === 200) {
				this.setState({
					disabled: false,
					summaryList: res.data,
					
					// listOfNotExist: res.data.listOfNotExist,
				});

			}
		})
		.catch((err) => {
			this.setState({ disabled: false });
			this.props.commonActions.tostifyAlert(
				'error',
				err && err.data ? err.data.message : 'Something Went Wrong',
			);
		});
	};
	initializeData = () => {

	};

	render() {
		strings.setLanguage(this.state.language);
		const { vat_list, product_category_list,supplier_list,inventory_account_list} = this.props;
		const { initValue, purchaseCategory, salesCategory,inventoryAccount } = this.state;

		
				let data=this.state.summaryList && this.state.summaryList[0] ?this.state.summaryList[0] :[];


		const migrationBeginningDate =data && data.migrationBeginningDate ? data.migrationBeginningDate :"-"
		const sourceApplication ="Zoho Books xxx.xx.xxx"
		const executionDate=data &&  data.executionDate ? data.executionDate :"-"
		return (
			<div className="transactions-report-screen">
			<div className="animated fadeIn">
			<Card>
<CardHeader>	<h5>Migarte History</h5> </CardHeader>
<CardBody style={{margin:"0px 176px 0px 176px"}}><h1 className="text-center">Migration Summary</h1>
<br></br>
<Row className="mb-2 mt-2">
<Col> <b>Migration Beginning Date:</b>{moment(migrationBeginningDate).format('MM/DD/YYYY')}</Col>
<Col><b>Source Application:</b>{sourceApplication} </Col>
<Col><b>Execution Date:</b> {moment(executionDate).format('MM/DD/YYYY')}</Col>
</Row>				
				
						<div>
						
							<BootstrapTable
								data={this.state && this.state.summaryList ? this.state.summaryList : []}
								version="4"
								hover
								keyField="id"
								remote
								//   fetchInfo={{ dataTotalSize: salaryRole_list.count ? salaryRole_list.count : 0 }}
								ref={(node) => this.table = node}
								className="text-center"
							>
								{/* <TableHeaderColumn
									dataField="srNo"
									// dataFormat={this.renderCode}
									className="table-header-bg text-center"
								>
									Sr No
								</TableHeaderColumn> */}
								<TableHeaderColumn
									dataField="fileName"
									// dateFormat={this.renderAccountName}
									className="table-header-bg text-center"
								>
								File Name
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="recordCount"
									// dateFormat={this.renderAccountName}
									className="table-header-bg text-center"
								>
								Number of Record
								</TableHeaderColumn>
								{/* <TableHeaderColumn
									dataField="status"
									// dateFormat={this.renderAccountName}
									className="table-header-bg text-center"
								>
								Status
								</TableHeaderColumn> */}
								<TableHeaderColumn
									dataField="recordsMigrated"
									// dateFormat={this.renderAccountName}
									className="table-header-bg text-center"
								>
								Migrated Records
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="recordsRemoved"
									// dateFormat={this.renderAccountName}
									className="table-header-bg text-center"
								>
								 Rejected Records
								</TableHeaderColumn>

							</BootstrapTable>
						</div>
							{/* <Row>
								<Col lg={12} className="mt-5">
									<div className="table-wrapper">
										<FormGroup className="text-center">
											<Button color="secondary" className="btn-square pull-left"
												onClick={() => { this.toggle(0, '1') }}>
												<i className="far fa-arrow-alt-circle-left"></i> RollBack Migration
											</Button>

											<Button name="button" color="primary" className="btn-square pull-right mr-3"
												onClick={() => {
													this.props.history.push('/admin/settings/migrateHistory');
												}}>
												Finish Migration	<i class="far fa-arrow-alt-circle-right mr-1"></i>
											</Button>
										</FormGroup>
									</div>
								</Col>
							</Row> */}


						</CardBody>
						</Card>
			</div>
		</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MigarteHistory);
