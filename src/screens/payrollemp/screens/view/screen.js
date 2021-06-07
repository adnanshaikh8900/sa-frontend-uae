import React from 'react';
import { connect } from 'react-redux';
import {
	Card,
	FormGroup,
	CardBody,
	Row,
	Col,
	NavItem,
	Nav,
	TabContent,
	NavLink,
	TabPane,
	CardGroup,
	Table,
	Button,
} from 'reactstrap';
import * as EmployeeViewActions from "./actions"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';
import { bindActionCreators } from 'redux';
import { upperFirst } from 'lodash-es';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { ViewPaySlip } from './sections';
import {
	CommonActions
} from 'services/global'
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';
const mapStateToProps = (state) => {
	return {
		profile: state.auth.profile,
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		employeeViewActions: bindActionCreators(EmployeeViewActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

const avatar = require('assets/images/avatars/default-avatar.jpg');
let strings = new LocalizedStrings(data);
class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			openModal: false,
			selectedData:{},
			activeTab: new Array(4).fill('1'),
			EmployeeDetails: '',
			userPhoto: [],
			salarySlipList: [],
			Fixed: [],
			Deduction: [],
			Variable: [],
			FixedAllowance: [],
			CTC: '',
			current_employee_id: '',
		};


		this.columnHeader1 = [
			{ label: 'Component Name', value: 'Component Name', sort: false },
			{ label: 'Monthly', value: 'Monthly', sort: false },
			{ label: 'Annualy', value: 'Annualy', sort: false },
		];
	}

	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		console.log(tab);
		this.setState({
			activeTab: newArray,
		});
	};
	componentDidMount = () => {
		this.initializeData();
	};
	renderActionsForTds = (cell, row) => {
		return (
			<div>
				<Button
					onClick={() =>
						this.props.history.push(
							'/admin/payroll/employee/salarySlip',
							{ id: row.id },
						)
					}
				>
					<i className="fas fa-eye" /> {strings.View}
						</Button>

			</div>
		);
	};
	viewPaySlip = (data) => {
		//getSalarySlip
		// this.props.employeeViewActions
		// 	.getSalarySlip(data)
		// 	.then((res) => {
		//         if (res.status === 200) {
		// 		// this.initializeData();


		// 			this.setState({

		// 			});

		//     }})
		// 	.catch((err) => {
		// 		this.props.commonActions.tostifyAlert(
		// 			'error',
		// 			err && err.data ? err.data.message : 'Something Went Wrong',
		// 		);
		// 	});
		this.setState({
			openModal: true
		})

	}
	renderActions = (cell, row) => {
		return (
			<div>
				<Button
				className="btn-sm"
				style={{padding:'0px'}}
				 color="link"
					onClick={() => {
						
						this.props.employeeViewActions
							.getSalarySlip({id: this.props.location.state.id, salaryDate: moment(row.salaryDate).format('DD/MM/YYYY') })
							.then((res) => {
								if (res.status === 200) {
									// this.initializeData();
									let v ="Fixed Allowance"
									this.setState({
										
										employeename:res.data.employeename,
										selectedData:res.data,
										Fixed:res.data.salarySlipResult.Fixed,
										FixedAllowance:res.data.salarySlipResult.Fixed_Allowance ,
										Variable: res.data.salarySlipResult.Variable,
										Deduction:res.data.salarySlipResult.Deduction,
									});

								}
							})
							.catch((err) => {
								this.props.commonActions.tostifyAlert(
									'error',

									err && err.data ? err.data.message : 'Something Went Wrong',
								);
							});
							debugger
						this.viewPaySlip({ id: this.props.location.state.id, salaryDate: moment(Date(row.salaryDate)).format('DD/MM/YYYY') });
					}

					}
				>
					<i className="fas fa-eye" />  {strings.View}
						</Button>

			</div>
		);
	};

	closeModal = (res) => {
		this.setState({ openModal: false });
	};

	initializeData = () => {
		if (this.props.location.state && this.props.location.state.id) {
			this.props.employeeViewActions
				.getEmployeeById(this.props.location.state.id)
				.then((res) => {
					if (res.status === 200) {
						this.setState(
							{
								current_employee_id: this.props.location.state.id,
								EmployeeDetails: res.data,
								userPhoto: res.data.profileImageBinary
									? this.state.userPhoto.concat(res.data.profileImageBinary)
									: [],
								loading: false,
							},
							() => {

							},
						);
					}
				})

			this.props.employeeViewActions
				.getSalarySlipList(this.props.location.state.id)
				.then((res) => {

					if (res.status === 200) {
						this.setState(
							{
								current_employee_id: this.props.location.state.id,
								salarySlipList: res.data.resultSalarySlipList,
								loading: false,
							},
							() => {

							},
						);
					}
				})

			this.props.employeeViewActions
				.getSalaryComponentByEmployeeId(this.props.location.state.id)
				.then((res) => {

					if (res.status === 200) {
						this.setState(
							{
								current_employee_id: this.props.location.state.id,
								Fixed: res.data.salaryComponentResult.Fixed,
								Variable: res.data.salaryComponentResult.Variable,
								Deduction: res.data.salaryComponentResult.Deduction,
								FixedAllowance: res.data.salaryComponentResult.Fixed_Allowance,
								CTC: res.data.ctc,
								loading: false,
							},
							() => {

							},
						);
					}
				})


		} else {
			this.props.history.push('/admin/income/customer-invoice');
		}
	};

	render() {
		strings.setLanguage(this.state.language);
		console.log(this.state.Fixed)
		const {profile} = this.props;
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>

						<CardBody>
							<Row>
								<Col lg={12}>
									<div className="h6 mb-4 d-flex align-items-center">

										<h3>{upperFirst(this.state.EmployeeDetails.fullName)}</h3>
									</div>
								</Col>
							</Row>
							<Nav tabs pills>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '1'}
										onClick={() => {
											this.toggle(0, '1');
										}}
									>
										 {strings.OverView}
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '2'}
										onClick={() => {
											this.toggle(0, '2');
										}}
									>
										 {strings.SalaryDetails}
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '3'}
										onClick={() => {
											this.toggle(0, '3');
										}}
									>
										 {strings.Payslips}
									</NavLink>
								</NavItem>

							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>
								<TabPane tabId="1">
									<div className="table-wrapper">
										<CardGroup>
											<Card style={{ height: '621px' }}>
												<div >
													<CardBody className='m-4'>
														<div>
															<Row className='pull-right'>

																<Button
																	color="primary"
																	className="btn-square pull-right mb-2"
																	style={{ marginBottom: '10px' }}
																	onClick={() => this.props.history.push(`/admin/payroll/employee/updateEmployeeEmployement`,
																		{ id: this.state.current_employee_id })}
																>
																	<i class="far fa-edit"></i>
																</Button>

															</Row>
														</div>
														<div className='text-center'>

															<img
																src={this.state.userPhoto !== '' ? avatar : this.state.userPhoto}
																className="img-avatar mr-2"
																style={{ width: '200px', height: '200px' }}
																alt=""
															/>


														</div>
														<div className='text-center' >
															<h3>{upperFirst(this.state.EmployeeDetails.fullName)} {' '}
															({this.state.EmployeeDetails.employeeCode  ?  this.state.EmployeeDetails.employeeCode :'-' }{ })</h3>

															<h4>
																{upperFirst(this.state.EmployeeDetails.employeeDsignationName)}
															</h4>
														</div>
														<hr style={{ width: '90%' }}></hr>

														<div>
															<label > {strings. BasicInformation}</label>
															<hr style={{ width: '50%' }}></hr>
															<div style={{ fontSize: '16px' }}>
																<div className='mt-2 mb-2'><i class="far fa-envelope"></i> &nbsp;{this.state.EmployeeDetails.email ? this.state.EmployeeDetails.email : '-'}</div>
																<div className='mt-2 mb-2'><i class="far fa-user"></i> &nbsp;{this.state.EmployeeDetails.gender ? this.state.EmployeeDetails.gender :'-'}</div>
																<div className='mt-2 mb-2'><i class="far fa-calendar-minus"></i> &nbsp;{this.state.EmployeeDetails.dateOfJoining ? this.state.EmployeeDetails.dateOfJoining :'-'}</div>
																<div className='mt-2 mb-2'><i class="fas fa-network-wired"></i> &nbsp;{this.state.EmployeeDetails.department ? this.state.EmployeeDetails.department : '-'}</div>
															</div>
														</div>
														<hr></hr>
														<div>

														</div>
													</CardBody>
												</div>
											</Card>
											<div style={{ width: '60%' }} className='ml-4'>
												<Card style={{ width: '650px' }}>
													<div>
														<CardBody className='m-4' style={{ height: '250px', width: '600px' }}>
															<div>
																<Row>
																	<Col>
																		<label> <b>{strings.PersonalInformation} </b></label>
																	</Col>
																	<Col>
																		<Button
																			color="primary"
																			className="btn-square pull-right mb-2"
																			style={{ marginBottom: '10px' }}
																			onClick={() => this.props.history.push(`/admin/payroll/employee/updateEmployeePersonal`,
																				{ id: this.state.current_employee_id })}
																		>
																			<i class="far fa-edit"></i>
																		</Button>
																	</Col>
																</Row>
																<Row> <Col className='mt-2 mb-2'>{strings.FathersName} </Col>
																	<Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.middleName  && this.state.EmployeeDetails.lastName  ?
																		this.state.EmployeeDetails.middleName + " " + this.state.EmployeeDetails.lastName : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>{strings.DateOfBirth} </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.dob  ? moment(this.state.EmployeeDetails.dob).format('DD-MM-YYYY') : ('-')}</Col></Row>

																{/* <Row> <Col className='mt-2 mb-2'>Personal Email  </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.email ? this.state.EmployeeDetails.email : ('-')}</Col></Row>				 */}

																<Row> <Col className='mt-2 mb-2'>{strings.MobileNumber} </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.mobileNumber  ? this.state.EmployeeDetails.mobileNumber : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>{strings.Address} </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.presentAddress || this.state.EmployeeDetails.city || this.state.EmployeeDetails.pincode || this.state.EmployeeDetails.stateName || this.state.EmployeeDetails.countryName ? this.state.EmployeeDetails.presentAddress + ' ' + this.state.EmployeeDetails.city + ' ' + this.state.EmployeeDetails.pincode + ' ' + this.state.EmployeeDetails.stateName + ' ' + this.state.EmployeeDetails.countryName :'-'}</Col></Row>

															</div>
														</CardBody>
													</div>
												</Card>

												<Card style={{ width: '650px' }}>
													<div>
														<CardBody className='m-4' style={{ height: '250px', width: '600px' }}>
															<div>
																<Row>
																	<Col>
																		<label><b> {strings.BankInformation} </b></label>
																	</Col>
																	<Col>
																		<Button
																			color="primary"
																			className="btn-square pull-right mb-2"
																			style={{ marginBottom: '10px' }}
																			onClick={() => this.props.history.push(`/admin/payroll/employee/updateEmployeeBank`,
																				{ id: this.state.current_employee_id })}
																		>
																			<i class="far fa-edit"></i>
																		</Button>
																	</Col>
																</Row>
																<Row> <Col className='mt-2 mb-2'>{strings.BankHolderName} </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.accountHolderName ?
																	this.state.EmployeeDetails.accountHolderName : ('-')}</Col></Row>


																<Row> <Col className='mt-2 mb-2'>{strings.AccountNumber} </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.accountNumber  ? this.state.EmployeeDetails.accountNumber : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>{strings.BankName}</Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.bankName ? this.state.EmployeeDetails.bankName : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>{strings.Branch}</Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.branch ? this.state.EmployeeDetails.branch : ('-')}</Col></Row>

																<Row> <Col className='mt-2 mb-2'>{strings.IBAN} </Col><Col className='mt-2 mb-2'>: &nbsp;{this.state.EmployeeDetails.iban ? this.state.EmployeeDetails.iban : ('-')}</Col></Row>

															</div>
														</CardBody>
													</div>
												</Card>
											</div>
										</CardGroup>			</div>
								</TabPane>



								<TabPane tabId="2">
									<div className="table-wrapper">
										<Row>
											<Col>
												<div className='m-4'>
													<Row style={{ width: '63%' }}>
														<Col><h5> {strings.AnnualCTC} </h5>
															<div><h3>  {this.state.CTC  ? (this.state.CTC).toFixed(2) : ''}</h3></div></Col>
														<Col><h5> {strings.MonthlyIncome} </h5>
															<div> <h3>{this.state.CTC ? (this.state.CTC /12).toFixed(2) : ''}</h3></div></Col>
															<Col>
																		<Button
																			color="primary"
																			className="btn-square pull-right mb-2"
																			style={{ marginBottom: '10px' }}
																			onClick={() => this.props.history.push(`/admin/payroll/employee/updateSalaryComponent`,
																				{ id: this.state.current_employee_id })}
																		>
																			<i class="far fa-edit">{strings.Edit}</i>
																		</Button>
																	</Col>
													</Row>
												</div>
												<Card style={{ height: 'auto', width: '65%' }} >
													<div>
														<CardBody>
															<Table className="text-center">
																<thead style={{border:"3px solid #c8ced3"}}>
																	<tr style={{border:"3px solid #c8ced3",    background: '#dfe9f7',color:"Black"}}>
																		{this.columnHeader1.map((column, index) => {
																			return (
																				<th>
																					{column.label}
																				</th>
																			);
																		})}
																	</tr>
																</thead>
																<tbody>
																	{this.state.Fixed ? (
																		Object.values(
																			this.state.Fixed
																		).map((item) => (
																			<tr className="p-1">
																					<td  className="text-left" style={{border:"3px solid #dfe9f7"}} >{item.description}<div className=''>{item.description === 'Basic SALARY' ? '% of CTC' : '% of Baisc'}</div></td>
																				<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.monthlyAmount ? item.monthlyAmount.toFixed(2) : '' }</td>
																				<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.yearlyAmount ? item.yearlyAmount.toFixed(2) :''}</td>
																			</tr>

																		))) : (<tr></tr>)}


																	{this.state.Variable ? (
																		Object.values(
																			this.state.Variable
																		).map((item) => (
																			<tr>
																							<td  className="text-left" style={{border:"3px solid #dfe9f7"}} >{item.description}</td>
																							<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.monthlyAmount ? item.monthlyAmount.toFixed(2) : '' }</td>
																							<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.yearlyAmount ? item.yearlyAmount.toFixed(2) :''}</td>
																			</tr>
																		))) : (<tr></tr>)}


																	{this.state.Deduction ? (
																		Object.values(
																			this.state.Deduction
																		).map((item) => (
																			<tr>
																						<td  className="text-left" style={{border:"3px solid #dfe9f7"}} >{item.description}</td>
																						<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.monthlyAmount ? item.monthlyAmount.toFixed(2) : '' }</td>
																						<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.yearlyAmount ? item.yearlyAmount.toFixed(2) :''}</td>
																			</tr>
																		))) : (<tr></tr>)}
																</tbody>
																<tfoot>
																	{this.state.FixedAllowance ? (
																		Object.values(
																			this.state.FixedAllowance
																		).map((item) => (
																			<tr>
																				<td  className="text-left" style={{border:"3px solid #dfe9f7"}} >{item.description}</td>
																				<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.monthlyAmount ? item.monthlyAmount.toFixed(2) : '' }</td>
																				<td className="text-right" style={{border:"3px solid #dfe9f7"}} >{item.yearlyAmount ? item.yearlyAmount.toFixed(2) :''}</td>
																			</tr>
																		))) : (<tr></tr>)}
																	<tr style={{border:"3px solid #dfe9f7"}}>
																		<td className="text-left"><h5><b> {strings.CosttoCompany}</b></h5></td>
																		<td className="text-right"><h5>{this.state.CTC ? (this.state.CTC / 12).toFixed(2) : ''}</h5></td>
																		<td className="text-right"><h5>{this.state.CTC  ? (this.state.CTC).toFixed(2) : ''}</h5></td>
																	</tr>
																</tfoot>
															</Table>
														</CardBody>
													</div>
												</Card>
											</Col>

										</Row>
									</div>
								</TabPane>


								<TabPane tabId="3">
									<div style={{    width: "50%"}} className="table-wrapper">
										
											<BootstrapTable
												selectRow={this.selectRowProp}
												search={false}
												options={this.options}
												data={this.state.salarySlipList &&
													this.state.salarySlipList ? this.state.salarySlipList : []}
												version="4"
												hover
												// pagination={salarySlipList && salarySlipList.data
												//     && salarySlipList.data.length > 0 ? true : false}
												keyField="id"
												remote
												// fetchInfo={{ dataTotalSize: salarySlipList.count ? salarySlipList.count : 0 }}
												className="employee-table"
												trClassName="cursor-pointer"
												// csvFileName="payroll_employee_list.csv"
												ref={(node) => this.table = node}
											>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="salaryDate"
													width="15%"
													dataSort


												>
													 {strings.SalaryDate}
													</TableHeaderColumn>
												<TableHeaderColumn
													width="15%"
													className="table-header-bg"
													dataField="monthYear"
													dataSort

												>
													{strings.MonthYear}
													</TableHeaderColumn>
												<TableHeaderColumn
													width="15%"
													className="table-header-bg"

													dataFormat={this.renderActions}
													dataSort


												>
													 {strings.Payslips}
													</TableHeaderColumn>
												{/* <TableHeaderColumn
                                                        className="table-header-bg"
														dataFormat={this.renderActions}
                                                        dataSort

                                                    >
                                                      TDS SHEET
                       						   </TableHeaderColumn> */}
											</BootstrapTable>


									

									</div>
								</TabPane>

							</TabContent>

						</CardBody>
					</Card>
				</div>
				<ViewPaySlip
					openModal={this.state.openModal}
					closeModal={(e) => {
						this.closeModal(e);
					}}
					employeename={this.state.employeename}
				// id={this.state.rowId}
				Fixed={this.state.Fixed}
				 FixedAllowance={this.state.FixedAllowance}
				 selectedData={this.state.selectedData}
				 Deduction={this.state.Deduction}
				 Variable={this.state.Variable}
				 companyData={profile}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEmployee);
