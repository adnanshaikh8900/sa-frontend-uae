import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Button,
	Col,
	FormGroup,
	Card,
	CardHeader,
	CardBody,
	Row,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Form,
	Label,
	Table,
	Input
} from 'reactstrap';
import Select from 'react-select';
import { AuthActions, CommonActions } from 'services/global';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import './style.scss';
import * as MigrationAction from './actions';
import { selectOptionsFactory } from 'utils';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { isDate, upperFirst } from 'lodash-es';

import styled from 'styled-components';
import { ChartOfAccountsModal } from './modal';

import moment from 'moment';

const mapStateToProps = (state) => {
	return {
		version: state.common.version,
	};
};

// const eye = require('assets/images/settings/eye.png');
// const noteye = require('assets/images/settings/noteye.png')
const mapDispatchToProps = (dispatch) => {
	return {
		authActions: bindActionCreators(AuthActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		migrationActions: bindActionCreators(MigrationAction, dispatch),
	};
};

const TabList = styled.ul`
  height: 48px;
  display: flex;

  padding: 0;
  margin: 0;
`;
const Tab = styled.li`
  list-style: none;
  text-align: center;
  font-family: sans-serif;
  line-height: 48px;
  flex: 0.008 0 auto;
  height: inherit;

`;

class Import extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initValue: {},
			loading: false,
			fileName: '',
			disabled: false,
			product_list: [],
			version_list: [],
			productName: '',
			version: '',
			type: '',
			upload: false,
			migration: false,
			migration_list: [],
			activeTab: new Array(6).fill('1'),
			nestedActiveDefaultTab: false,
			date: '',
			tabs: [],
			file_data_list: [],
			openModal: false,
			listOfExist: [],
			dummylistOfExist: [],
			selectedRows: [],
			effectiveDate:new Date(),
			openingBalance:0,
			dummylistOfNotExist: [],
		};
		this.selectRowProp = {
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll,
		};
	}

	componentDidMount = () => {
		this.getInitialData();
		this.props.migrationActions.migrationProduct()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ product_list: res.data });
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({ loading: false });
			});
	};
	DeleteFile = () => {

		
		// const formData = new FormData();
		// formData.append('fileNames', this.state.selectedRows ? this.state.selectedRows :'');

		const formData = { 'fileNames': this.state.selectedRows ? this.state.selectedRows : '' }
		console.log(formData)
		this.props.migrationActions
			.deleteFiles(formData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						disabled: false,
						migration_list: res.data
					});
					this.props.commonActions.tostifyAlert(
						'success',
						'Files Deleted Successfully.',
					);

				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	}

	onRowSelect = (row, isSelected, e) => {
		let tempList = [];
		if (isSelected) {
			
			tempList = Object.assign([], this.state.selectedRows);
			tempList.push(row.fileName);
		} else {
			this.state.selectedRows.map((item) => {
				
				if (item !== row.fileName) {
					tempList.push(item);
				}
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
		});
	};

	onSelectAll = (isSelected, rows) => {
		let tempList = [];
		if (isSelected) {
			rows.map((item) => {
				tempList.push(item.fileName);
				return item;
			});
		}
		this.setState({
			selectedRows: tempList,
		});
	};
	getInitialData = () => {
	};


	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		this.setState({
			activeTab: newArray,
		});
	};

	handleChange = (key, val) => {
		this.setState({
			[key]: val,
		});
	};

	// togglePasswordVisiblity = () => {
	// 	this.setState({
	// 		passwordShown: !this.state.passwordShown,
	// 	});
	// };

	togglePasswordVisiblity = () => {
		const { isPasswordShown } = this.state;
		this.setState({ isPasswordShown: !isPasswordShown });
	};

	saveAccountStartDate = (data, resetForm) => {
		const date = data.date;

		if (isDate(date)) {
			this.props.migrationActions
				.saveAccountStartDate(date)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							disabled: false,
							upload: true,
							migration: true,
						});
						this.props.commonActions.tostifyAlert(
							'success',
							'Date saved Successfully.',
						);
						this.toggle(0, '2')
					}
				})
				.catch((err) => {
					this.setState({ disabled: false });
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
				});
		} else {
			alert("please select Date")
		}

	}

	handleSubmitForOpeningBalances = () => {
		debugger
		const formData = new FormData()

		formData.append('persistmodel',JSON.stringify(this.state.listOfExist4))
		this.props.migrationActions
				.addOpeningBalance(formData)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							disabled: false,
							
						
						});
						this.props.commonActions.tostifyAlert(
							'success',
							'Date saved Successfully.',
						);
						this.props.history.push('/admin/settings/migrate')
					
					}
				})
				.catch((err) => {
					this.setState({ disabled: false });
					this.props.commonActions.tostifyAlert(
						'error',
						err && err.data ? err.data.message : 'Something Went Wrong',
					);
				});
	}
	Upload = (data) => {
		this.setState({ loading: true, disabled: true });

		let formData = new FormData();

		for (const file of this.uploadFile.files) {
			formData.append('files', file);
		}

		this.props.migrationActions
			.uploadFolder(formData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						disabled: false,
						upload: true,
						migration: true,
						migration_list: res.data
					});
					this.props.commonActions.tostifyAlert(
						'success',
						'Files Uploaded Successfully.',
					);

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

	listOfTransactionCategory = (data) => {

		this.props.migrationActions
			.listOfTransactionCategory()
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						disabled: false,
						file_data: res.data,
						listOfExist: res.data.listOfExist,
						listOfExist4: res.data.listOfExist,
						dummylistOfExist: res.data.listOfExist,
						dummylistOfNotExist: res.data.listOfNotExist,
					});
					let newData = [...this.state.listOfExist4]
					newData = newData.map((data) => {
						data.effectiveDate = this.state.effectiveDate
						data.openingBalance = this.state.openingBalance
						return data
					})
					console.log(newData)
					this.setState({
						listOfExist4: newData
					})
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

	listOfFiles = (data) => {
		this.props.migrationActions
			.getListOfAllFiles()
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						disabled: false,
						tabs: res.data
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
	getFileData = (value) => {
		const data = {
			fileName: value
		};

		this.props.migrationActions
			.getFileData(data)
			.then((res) => {
				if (res.status === 200) {

					this.setState({
						disabled: false,
						file_data_list: res.data

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

	versionlist = (productName) => {
		this.props.migrationActions.getVersionListByPrioductName(productName)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ version_list: res.data });
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
				this.setState({ loading: false });
			});;

	}


	closeModal = (res) => {
		this.setState({ openModal: false });
		this.listOfTransactionCategory()
	};

	showHeader = (s) => {

		return upperFirst(s.replace(/([a-z])([A-Z])/g, '$1 $2'));

	}
	showTD = (s) => {
		return (s !== "" ? s : "-")
	}
	showTable = (file_data_list) => {

		if (Array.isArray(file_data_list) && file_data_list.length !== 0) {
			let colDataObject = file_data_list[0] ? file_data_list[0] : {};
			const cols = colDataObject ? Object.keys(colDataObject) : [];
			// this.setState({cols:cols})
			console.log(cols, "cols")
			console.log(file_data_list, "file_data_list")
			return (
				file_data_list.length > 0 ? (
					<Table >
						<thead>
							<tr className="header-row">
								{cols.map((column, index) => {
									return (
										<th
											key={index}
											className="table-header-color"
										>
											<span>{this.showHeader(column)}</span>
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody className="data-column">
							{
								file_data_list.length > 0 ? (
									file_data_list.map(
										(item, index) => {

											return (
												<>
													<tr
														style={{ background: '#f7f7f7' }}
														key={index}
													>

														{
															// JSON.stringify(item)
															cols.map((column, index) => {
																return (
																	<td
																		key={index}
																		style={{ fontWeight: '600', textAlign: 'center' }}
																		className={column.align ? 'text-center' : ''}
																	>
																		<span>{this.showTD(item[column])}</span>
																	</td>
																);
															})

														}

													</tr>
												</>
											);
										}
									)

								) : (
									<tr style={{ borderBottom: '2px solid lightgray' }}>
										<td style={{ textAlign: 'center' }} colSpan="9">
											There is no data to display
										</td>
									</tr>
								)
							}
						</tbody>

					</Table>
				) : (
					<tr style={{ borderBottom: '2px solid lightgray' }}>
						<td style={{ textAlign: 'center' }} colSpan="9">
							There is no data to display
						</td>
					</tr>
				)
			);

		}
	}

	showNotExistList = () => {
		if (this.state && this.state.dummylistOfNotExist) {
			let listObject = []
			// let listObject = this.state.dummylistOfExist ? this.state.dummylistOfExist : []

			
			let list = this.state.dummylistOfNotExist ? this.state.dummylistOfNotExist : []
			let listOfNotExist1 = list.map((data, i) => {
				listObject.push({ transactionName: data })
				return data;
			});
			let temp = [...this.state.dummylistOfExist]
			const listOfExist1 = [...temp, ...listObject]
			let val = listOfExist1
			// this.setState({merged:val})
			console.log(listOfExist1)
			return (
				<Row className="text-center">
					<Col><Row>
						<div style={{ width: "100%" }}><b>Simple-Accounts</b></div>
						<div>
							<BootstrapTable
								data={this.state && this.state.listOfExist ? this.state.listOfExist : []}
								version="4"
								hover
								keyField="id"
								remote
								//   fetchInfo={{ dataTotalSize: salaryRole_list.count ? salaryRole_list.count : 0 }}
								ref={(node) => this.table = node}
								className="text-center"
							>
								<TableHeaderColumn
									dataField="transactionId"
									dataFormat={this.renderCode}
									className="table-header-bg text-center"
								>
									Account Code
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="transactionName"
									dateFormat={this.renderAccountName}
									className="table-header-bg text-center"
								>
									Account Name
								</TableHeaderColumn>

							</BootstrapTable>
						</div>



					</Row></Col>
					<div style={{ width: "20%" }}>.
						<BootstrapTable
							data={listOfExist1 && listOfExist1 ? listOfExist1 : []}
							// data={this.state && this.state.merged ? this.state.merged : []}
							version="4"
							hover
							keyField="id"
							remote
							//   fetchInfo={{ dataTotalSize: salaryRole_list.count ? salaryRole_list.count : 0 }}
							ref={(node) => this.table = node}
							className="lockSideBorder"
						>
							<TableHeaderColumn
								dataField="transactionId"
								dataFormat={this.renderLocks}
								className=" text-center"
							>
								.
							</TableHeaderColumn>
						</BootstrapTable>
					</div>
					<Col><Row>
						<div style={{ width: "100%" }}><b>Zoho-Books</b></div>
						<div>
							{/* {this.showNotExistList()} */}

							<BootstrapTable
								data={listOfExist1 && listOfExist1 ? listOfExist1 : []}
								version="4"
								hover
								keyField="id"
								remote

								//   fetchInfo={{ dataTotalSize: salaryRole_list.count ? salaryRole_list.count : 0 }}
								ref={(node) => this.table = node}
								className="text-center"
							>
								<TableHeaderColumn
									dataField="transactionId"
									dataFormat={this.renderCode1}
									className="table-header-bg text-center"
								>
									Account Code
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="transactionName"
									dateFormat={this.renderAccountName1}
									className="table-header-bg text-center"
								>
									Account Name
								</TableHeaderColumn>
							</BootstrapTable>
						</div>
					</Row></Col>
				</Row>

			);
		}


		// console.log(list, "list")
		// this.setState({ mergedList: list })


	}
	openForgotPasswordModal = () => {
		this.setState({ openForgotPasswordModal: true });
	};

	closeForgotPasswordModal = (res) => {
		this.setState({ openForgotPasswordModal: false });
	};
	renderLocks = (cell, row) => {

		if (row.transactionId) {
			return (<div className=" text-center"><i class="fas fa-lock"></i> </div>);
		}
		else {
			return (<div className=" text-center"> 	<span style={{ color: "white", backgroundColor: "#2266d8" }} onClick={() => {
				this.setState({
					openModal: true
				})
			}}>Create</span> </div>);
		}
	}
	renderCode = (cell, rows) => {
		return (<div className="text-center">{rows.accountCode ? rows.accountCode : '-'} </div>);
	};
	renderAccountName = (cell, rows) => {
		return (<div className=" text-center !important" style={{ textAlign: "center" }}>{rows.transactionName ? rows.transactionName : '-'} </div>);
	};
	renderCode1 = (cell, rows) => {
		return (<div className="text-center">{rows.accountCode ? rows.accountCode : '-'} </div>);
	};
	renderAccountName1 = (cell, rows) => {
		return (<div className=" text-center !important" style={{ textAlign: "center" }}>{rows.transactionName ? rows.transactionName : '-'} </div>);
	};


	setDate = (row, value) => {
		
		let newData = [...this.state.listOfExist4]
		 newData.map((data) => {
			if (row.transactionId === data.transactionId) {
				data.effectiveDate =value
				return data
			}
		})
		
		this.setState({
			listOfExist4: newData
		})
	}


	setOpeningBalances = () => {
		
		const cols = [
			{
				label: 'transaction Name',
				key: 'transactionName'
			},
			{
				label: 'chart Of AccountName',
				key: 'chartOfAccountName'

			},
			{
				label: 'Effective date',
				key: 'effectiveDate'
			},

			{
				label: 'Opening balance',
				key: 'openingBalance'
			},


		]
		return (
			<React.Fragment>
				<div >
					<BootstrapTable
						search={false}
						options={this.options}
						data={this.state.listOfExist4 || []}
						version="4"
						hover
						keyField="id"
						remote
						trClassName="cursor-pointer"
						ref={(node) => this.table = node}
					>
						{
							cols.map((col, index) => {
								
								const format = (cell, row) => {
									if (col.key === 'effectiveDate') {
										return (
											<DatePicker
											id="effectiveDate"
											name="effectiveDate"
											showMonthDropdown
											showYearDropdown
											dateFormat="dd/MM/yyyy"
											dropdownMode="select"
											value={cell}
											 selected={cell}
											onChange={(value) => {
												this.setDate(row, value)
											}}
										/>
										);
									} if (col.key === 'openingBalance') {
										return (
											<Input
												type="number"
												id="openingBalance"
												name="openingBalance"
												value={cell || 0}
												onChange={(evt) => {
													let value = parseInt(evt.target.value);
													let newData = [...this.state.listOfExist4]
													newData.map((data) =>{
														if (row.transactionId === data.transactionId) {
															data.openingBalance = value
															return data
														}
													})
													this.setState({
														listOfExist4: newData
													})
												}}
											/>
										);
									}
									else {
										return (  
											<div>{cell}</div>
										)
									}

								}
								return (
									<TableHeaderColumn
										key={index}
										dataFormat={format}
										dataField={col.key}
										dataAlign="center"
										className="table-header-bg"
									>
										{col.label}
									</TableHeaderColumn>

								)
							})
						}


					</BootstrapTable>
				</div>
			</React.Fragment>

		)
	}


	render() {
		const { isPasswordShown, product_list, version_list, tabs, file_data_list,listOfExist4 } = this.state;
		const { initValue, migration_list } = this.state;
		console.log(listOfExist4)
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
		return (
			<div className="import-bank-statement-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fa glyphicon glyphicon-export fa-upload" />
												<span className="ml-2">Migration</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody className="log-in-screen">
									<Nav className="justify-content-center" tabs pills  >
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '1'}
												onClick={() => {
													this.toggle(0, '1');
												}}
											>
												<h4 style={{ margin: "4px 2px 4px 2px" }}>1</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '2'}
												onClick={() => {
													this.toggle(0, '2');
												}}
											>
												<h4 style={{ margin: "4px 0px 4px 0px" }}>2</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '3'}
												onClick={() => {
													this.toggle(0, '3');
												}}
											>
												<h4 style={{ margin: "4px 0px 4px 0px" }}>3</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '4'}
												onClick={() => {
													this.toggle(0, '4');
												}}
											>
												<h4 style={{ margin: "4px 0px 4px 0px" }}>4</h4>
											</NavLink>
										</NavItem>
									</Nav>
									<TabContent activeTab={this.state.activeTab[0]}>
										<TabPane tabId="1">

											<div className="create-employee-screen">
												<div className="animated fadeIn">
													<div className="text-center mb-5"><h3>Pick Migration Beginning Date</h3></div>
													<Formik
														initialValues={this.state}
														onSubmit={(values, { resetForm }) => {
															this.saveAccountStartDate(values, resetForm)
														}}
														validate={(values) => {
															let errors = {};

															if (values.date === '') {
																errors.date = 'Date is required';
															}
															if (values.date === undefined) {
																errors.date = 'Date is required';
															}

															return errors;
														}}

														validationSchema={Yup.object().shape({
															date: Yup.string().required(
																'Date is required',
															),
														})}

													>
														{(props) => (

															<Form className="mt-3" onSubmit={props.handleSubmit}>
																<div className="text-center" style={{ display: "flex", marginLeft: "40%" }}>
																	<div style={{ width: "10%" }}>	<span className="text-danger">*</span>Date	</div>
																	<DatePicker
																		className={`form-control ${props.errors.date && props.touched.date ? "is-invalid" : ""}`}
																		id="date"
																		name="date"
																		placeholderText={"Select Date"}
																		showMonthDropdown
																		showYearDropdown
																		dateFormat="dd/MM/yyyy"
																		dropdownMode="select"
																		style={{ textAlign: "center" }}
																		selected={props.values.date}
																		value={props.values.date}
																		onChange={(value) => {
																			props.handleChange("date")(value)
																			this.setState({ date: value })
																		}}
																	/>


																</div>
																<div className="text-center" >
																	{props.errors.date && props.touched.date && (
																		<div className="text-danger">{props.errors.date}</div>
																	)}<br></br>
																	<b>Note : </b><i> Please select date from which you need to migrate into SimpleAccounts.<br /> Please note all data prior to above date will be ignored.</i>



																</div>

																<Row>
																	<Col lg={12} className="mt-5">
																		<div className="table-wrapper">
																			<FormGroup className="text-center">


																				<Button name="button" color="primary" className="btn-square pull-right mr-3"
																					onClick={() => {
																						this.setState({ createMore: false }, () => {
																							props.handleSubmit()
																						})
																					}}>
																					Next	<i class="far fa-arrow-alt-circle-right mr-1"></i>
																				</Button>

																			</FormGroup>
																		</div>

																	</Col>
																</Row>
															</Form>
														)
														}
													</Formik>
												</div>

											</div>
										</TabPane>
										<TabPane tabId="2">
											<Row>
												<Col lg={12}>
													<div>
														<div className="text-center mb-5"><h3>Upload Files</h3></div>
														<Formik
															initialValues={initValue}
															ref={this.formRef}
															onSubmit={(values, { resetForm }) => {
																this.handleSubmit(values);
															}}

														>
															{(props) => (
																<Form onSubmit={props.handleSubmit}>
																	<Row>
																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="productName">
																					{/* {strings.PlaceofSupply} */}Application Name
																				</Label>
																				<Select
																					styles={customStyles}
																					id="productName"
																					name="productName"
																					placeholder="Select Product"
																					options={
																						product_list
																							? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								product_list,
																								'Products list',

																							)
																							: []
																					}
																					value={
																						product_list &&
																						selectOptionsFactory
																							.renderOptions(
																								'label',
																								'value',
																								product_list,
																								'Products list',
																							)
																							.find(
																								(option) =>
																									option.value ===
																									+props.values.productName,
																							)
																					}
																					className={
																						props.errors.productName &&
																							props.touched.productName
																							? 'is-invalid'
																							: ''
																					}
																					onChange={(option) => {
																						if (option && option.value) {
																							props.handleChange('productName')(
																								option.label,
																								this.versionlist(option.label)
																							);
																						} else {
																							props.handleChange('productName')('');
																						}
																					}}
																				/>
																				{props.errors.productName &&
																					props.touched.productName && (
																						<div className="invalid-feedback">
																							{props.errors.productName}
																						</div>
																					)}
																			</FormGroup>
																		</Col>

																		<Col lg={3}>
																			<FormGroup className="mb-3">
																				<Label htmlFor="version">
																					{/* {strings.PlaceofSupply} */}Version
																				</Label>
																				<Select

																					id="version"
																					name="version"
																					placeholder="Select Version"
																					options={
																						version_list
																							? selectOptionsFactory.renderOptions(
																								'label',
																								'value',
																								version_list,
																								'version list',

																							)
																							: []
																					}
																					value={
																						version_list &&
																						selectOptionsFactory
																							.renderOptions(
																								'label',
																								'value',
																								version_list,
																								'version',
																							)
																							.find(
																								(option) =>
																									option.value ===
																									+props.values.version,
																							)
																					}
																					className={
																						props.errors.version &&
																							props.touched.version
																							? 'is-invalid'
																							: ''
																					}
																					onChange={(option) =>
																						props.handleChange('version')(
																							option.label,
																						)
																					}
																				/>
																				{props.errors.version &&
																					props.touched.version && (
																						<div className="invalid-feedback">
																							{props.errors.version}
																						</div>
																					)}
																			</FormGroup>
																		</Col>
																	</Row>
																	<div className="mt-4" >
																		<Row>
																			<Col lg={4}></Col>
																			<Col lg={4}>
																				<div
																					style={{
																						border: '1px solid grey',

																					}}>
																					<div className="text-center mb-3 mt-4">
																						<i class="fas fa-upload  fa-5x"></i>

																					</div>
																					<div className="text-center mb-3" style={{
																						fontSize: '22px',
																					}}>
																						Drag file to upload ,or
																					</div>
																					<div className="text-center mb-3">
																						<input
																							id="file"
																							ref={(ref) => {
																								this.uploadFile = ref;
																							}}
																							multiple
																							// directory="" 
																							// webkitdirectory=""
																							type="file"
																							accept=".csv"
																							onChange={(e) => {
																								this.setState({
																									fileName: e.target.value
																										.split('\\')
																										.pop(),
																								});
																								this.Upload();
																							}}
																						/>
																					</div>


																				</div>
																			</Col>
																			<Col lg={4}></Col>
																		</Row>

																	</div>

																	<Row>
																		<div>
																			<BootstrapTable
																				selectRow={this.selectRowProp}
																				search={false}
																				options={this.options}
																				data={
																					migration_list && migration_list
																						? migration_list
																						: []
																				}
																				version="4"
																				hover
																				remote
																				// tableStyle={{ width: '800px' }}
																				className="m-4"
																				trClassName="cursor-pointer"
																				csvFileName="summary_list.csv"
																				ref={(node) => (this.table = node)}
																			>
																				<TableHeaderColumn isKey dataField="fileName" dataSort className="table-header-bg">
																					File name
																				</TableHeaderColumn >
																				<TableHeaderColumn dataField="recordCount" dataSort className="table-header-bg">
																					Record Uploaded
																				</TableHeaderColumn>
																			</BootstrapTable>
																		</div>

																	</Row>
																	<Row>
																		<Button color="primary" className="btn-square pull-left"
																			onClick={() => { this.DeleteFile() }}>
																			<i className="far fa-arrow-alt-circle-left"></i> DELETE
																		</Button>
																	</Row>

																</Form>
															)}
														</Formik>
													</div>
												</Col>
											</Row>
											<Row>
												<Col lg={12} className="mt-5">
													<div className="table-wrapper">
														<FormGroup className="text-center">
															<Button color="secondary" className="btn-square pull-left"
																onClick={() => { this.toggle(0, '1') }}>
																<i className="far fa-arrow-alt-circle-left"></i> Back
															</Button>

															<Button name="button" color="primary" className="btn-square pull-right mr-3"
																onClick={() => {
																	this.toggle(0, '3')
																	this.listOfFiles()
																	this.listOfTransactionCategory()

																}}>
																Next	<i class="far fa-arrow-alt-circle-right mr-1"></i>
															</Button>
														</FormGroup>
													</div>
												</Col>
											</Row>


										</TabPane>
										<TabPane tabId="3">
											<div className="create-employee-screen">
												<div className="animated fadeIn">
													<div className="text-center mb-5"><h3>Preview Files</h3></div>

													<Formik
														initialValues={this.state.initValue}
														onSubmit={(values, { resetForm }) => {
															// this.handleSubmitForSalary(values, resetForm)
														}}
														validationSchema={Yup.object().shape({

														})}
													>
														{(props) => (

															<Form onSubmit={props.handleSubmit}>
																<Row>
																	<TabList>
																		<Tab
																			id='chartOfAccounts'
																			onClick={() => {
																				this.setState({ nestedActiveDefaultTab: false })
																			}}
																		// isSelected={true}
																		>

																			<Button className="rounded-left" >Chart Of Accounts</Button>
																		</Tab>
																		{tabs.map((tab, idx) => (

																			<Tab
																				key={tab}
																				//  isSelected={this.showTable(file_data_list)}
																				onClick={() => {
																					this.getFileData(tab);
																					this.setState({ nestedActiveDefaultTab: true })
																				}}

																			>
																				<Button className="rounded-left">{tab}</Button>
																			</Tab>
																		))}
																	</TabList>
																	<TabContent>
																		<hr />
																		{this.state.nestedActiveDefaultTab ?
																			(
																				<TabPane>
																					<div style={{ width: "50%" }} >{this.showTable(file_data_list)}	</div>

																				</TabPane>
																			) : (
																				<TabPane>
																					{/* Default start */}
																					{/* <Button onClick={() => {
																						this.setState({
																							openModal: true
																						})
																					}}>Create Chart Of Account</Button> */}
																					{this.showNotExistList()}
																					{/* Default end */}
																				</TabPane>
																			)}
																	</TabContent>
																</Row>
																<Row>
																	<Col lg={12} className="mt-5">

																		<div className="table-wrapper">
																			<FormGroup className="text-center">
																				<Button color="secondary" className="btn-square pull-left"
																					onClick={() => { this.toggle(0, '2') }}>
																					<i className="far fa-arrow-alt-circle-left"></i> Back
																				</Button>

																				<Button name="button" color="primary" className="btn-square pull-right mr-3"
																					onClick={() => {
																						this.toggle(0, '4')
																						this.listOfTransactionCategory()
																					}}>
																					Next	<i class="far fa-arrow-alt-circle-right mr-1"></i>
																				</Button>
																			</FormGroup>
																		</div>


																	</Col>
																</Row>
															</Form>
														)
														}
													</Formik>
												</div>
											</div>
										</TabPane>
										<TabPane tabId="4">
											<div className="text-center mb-5"><h3>Set Opening Balances</h3></div>
											<Formik
												initialValues={this.state.initValue}
												onSubmit={(values, { resetForm }) => {
													//  this.handleSubmitForOpeningBalances(values, resetForm)
												}}
												validationSchema={Yup.object().shape({


												})}
											>
												{(props) => (

													<Form onSubmit={props.handleSubmit}>

														<Row>
															<Col lg={12} className="mt-5">

																{this.setOpeningBalances()}


																<div className="table-wrapper">
																	<FormGroup className="text-center">
																		<Button color="secondary" className="btn-square pull-left"
																			onClick={() => { this.toggle(0, '3') }}>
																			<i className="far fa-arrow-alt-circle-left"></i> Back
																		</Button>

																		<Button name="button" color="primary" className="btn-square pull-right mr-3"
																			onClick={() => {
																				this.handleSubmitForOpeningBalances();
																			}}>
																			Migrate	<i class="far fa-arrow-alt-circle-right mr-1"></i>
																		</Button>
																	</FormGroup>
																</div>


															</Col>
														</Row>
													</Form>
												)
												}
											</Formik>

										</TabPane>

									</TabContent>
									{/* added by suraj */}

								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
				<ChartOfAccountsModal
					openModal={this.state.openModal}
					closeModal={(e) => {
						this.closeModal(e);
					}}

				// employee_list={employee_list.data}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Import);
