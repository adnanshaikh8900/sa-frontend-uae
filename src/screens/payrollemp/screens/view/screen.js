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
} from 'reactstrap';
import * as EmployeeViewActions from "./actions"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';
import { bindActionCreators } from 'redux';
import { upperFirst } from 'lodash-es';
import moment from 'moment';

const mapStateToProps = (state) => {
	return {

	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		employeeViewActions: bindActionCreators(EmployeeViewActions, dispatch),
	};
};

const avatar = require('assets/images/avatars/default-avatar.jpg');

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: new Array(4).fill('1'),
			EmployeeDetails: '',
			userPhoto: [],
			SalarySlipList:[],
			Fixed:[],
			Deduction:[],
			Variable:[],
			FixedAllowance:[],
			CTC: '',
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
								salarySlipList: res.data,
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
								FixedAllowance : res.data.salaryComponentResult.Fixed_Allowance,
								CTC : res.data.CTC,
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
		console.log(this.state.Fixed)
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>

						<CardBody>
							<Row>
								<Col lg={12}>
									<div className="h6 mb-4 d-flex align-items-center">

										<h3>{this.state.EmployeeDetails.fullName}</h3>
									</div>
								</Col>
							</Row>
							<Nav tabs>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '1'}
										onClick={() => {
											this.toggle(0, '1');
										}}
									>
										OverView
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '2'}
										onClick={() => {
											this.toggle(0, '2');
										}}
									>
										Salary Details
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '3'}
										onClick={() => {
											this.toggle(0, '3');
										}}
									>
										Payslips
									</NavLink>
								</NavItem>

							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>
								<TabPane tabId="1">
									<div className="table-wrapper">
										<CardGroup>
											<Card style={{ height: '600px' }}>
												<div >
													<CardBody className='m-4'>
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
								({this.state.EmployeeDetails.employeeCode !== '' ? '-' : this.state.EmployeeDetails.employeeCode}{ })</h3>

															<h4>
																{upperFirst(this.state.EmployeeDetails.employeeDsignationName)}
															</h4>
														</div>
														<hr style={{ width: '90%' }}></hr>

														<div>
															<label >Basic Information</label>
															<hr style={{ width: '50%' }}></hr>
															<div style={{ fontSize: '16px' }}>
																<div className='mt-2 mb-2'><i class="far fa-envelope"></i> &nbsp;{this.state.EmployeeDetails.email}</div>
																<div className='mt-2 mb-2'><i class="far fa-user"></i> &nbsp;{this.state.EmployeeDetails.gender}</div>
																<div className='mt-2 mb-2'><i class="far fa-calendar-minus"></i> &nbsp;{this.state.EmployeeDetails.dateOfJoining}</div>
																<div className='mt-2 mb-2'><i class="fas fa-network-wired"></i> &nbsp;{this.state.EmployeeDetails.department}</div>
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
														<CardBody className='m-4' style={{ height: '250px', width: '450px' }}>
															<div>
															<label> Personal Information</label>
															<Row> <div className='mt-2 mb-2'>Father's Name : {this.state.EmployeeDetails.middleName !== '' && this.state.EmployeeDetails.lastName !== '' ?
																this.state.EmployeeDetails.middleName + this.state.EmployeeDetails.lastName :  ('-') }</div></Row>
															<Row> <div className='mt-2 mb-2'> Date Of Birth: {this.state.EmployeeDetails.dob !== '' ?  moment(this.state.EmployeeDetails.dob).format('DD-MM-YYYY') : ('-')}</div></Row>
															<Row> <div className='mt-2 mb-2'>Personal Email : {this.state.EmployeeDetails.email !== '' ?  this.state.EmployeeDetails.email : ('-')}</div></Row>
															<Row> <div className='mt-2 mb-2'>Mobile Number  : {this.state.EmployeeDetails.mobileNumber !== '' ? this.state.EmployeeDetails.mobileNumber : ('-')}</div></Row>
															<Row> <div className='mt-2 mb-2'>Address : {this.state.EmployeeDetails.presentAddress +' '+ this.state.EmployeeDetails.city +' '+ this.state.EmployeeDetails.pincode +' '+  this.state.EmployeeDetails.stateName +' '+  this.state.EmployeeDetails.countryName}</div></Row>
															</div>
														</CardBody>
													</div>
												</Card>

												<Card style={{ width: '650px' }}>
													<div>
														<CardBody className='m-4' style={{ height: '250px', width: '450px' }}>
															<div>
															<label> Bank Information</label>
															<Row> <div className='mt-2 mb-2'>Bank Holder Name : {this.state.EmployeeDetails.accountHolderName !== '' ?
																this.state.EmployeeDetails.accountHolderName :  ('-') }</div></Row>
															<Row> <div className='mt-2 mb-2'>Account Number : {this.state.EmployeeDetails.accountNumber !== '' ?  this.state.EmployeeDetails.accountNumber : ('-')}</div></Row>
															<Row> <div className='mt-2 mb-2'>Bank Name : {this.state.EmployeeDetails.bankName !== '' ?  this.state.EmployeeDetails.bankName : ('-')}</div></Row>
															<Row> <div className='mt-2 mb-2'>Branch  : {this.state.EmployeeDetails.branch !== '' ? this.state.EmployeeDetails.branch : ('-')}</div></Row>
															<Row> <div className='mt-2 mb-2'>iban : {this.state.EmployeeDetails.iban ? this.state.EmployeeDetails.iban  : ('-') }</div></Row>
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
												<Row style={{width:'50%'}}>
												<Col><h5>Annual CTC  </h5>
													<div> {this.state.CTC}</div></Col>
													<Col><h5>Monthly Income  </h5>
													<div> {this.state.CTC / 12}</div></Col>
												</Row>
											</div>
												<Card style={{height: '520px',width: '1000px'}} >
													<div>
														<CardBody>
														<Table className="text-center">
                                                            <thead style={{border:"3px solid #2064d8"}}>
                                                                      <tr style={{border:"3px solid #2064d8",    background: '#2266d8',color:"white"}}>
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
																		{ this.state.Fixed ? (
                                                                    Object.values(
                                                                        this.state.Fixed
                                                                    ).map((item) => (
																		<tr className="p-1">
																			<td className="text-left">{item.description}<div className=''>{item.description === 'Basic SALARY' ? '% of CTC' : '% of Baisc'}</div></td>
																			<td className="text-right">{item.monthlyAmount}</td>
																			<td className="text-right">{item.yearlyAmount}</td>
																		</tr>
																		
																	))) : ( <tr></tr>)}


																	{ this.state.Variable ? (
                                                                    Object.values(
                                                                        this.state.Variable
                                                                    ).map((item) => (
																		<tr>
																			<td className="text-left">{item.description}</td>
																			<td  className="text-right">{item.monthlyAmount}</td>
																			<td  className="text-right">{item.yearlyAmount}</td>
																		</tr>
																	))) : (<tr></tr>)}


																	{ this.state.Deduction ? (
                                                                    Object.values(
                                                                        this.state.Deduction
                                                                    ).map((item) => (
																		<tr>
																			<td className="text-left">{item.description}</td>
																			<td  className="text-right">{item.monthlyAmount}</td>
																			<td  className="text-right">{item.yearlyAmount}</td>
																		</tr>
																	))) : (<tr></tr>)}
																</tbody>
																<tfoot>
																{this.state.FixedAllowance ? (
                                                                    Object.values(
                                                                        this.state.FixedAllowance
                                                                    ).map((item) => (
																		<tr>
																			<td className="text-left">{item.description}</td>
																			<td  className="text-right">{item.monthlyAmount}</td>
																			<td  className="text-right">{item.yearlyAmount}</td>
																		</tr>
																	))) : (<tr></tr>)}
																<tr>
																			<td className="text-left"><b>Cost to Company</b></td>
																			<td  className="text-right">{this.state.CTC / 12}</td>
																			<td  className="text-right">{this.state.CTC}</td>
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
									<div className="table-wrapper">
																		

									</div>
								</TabPane>

							</TabContent>

						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEmployee);
