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
import { isDate } from 'lodash-es';



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
			date: ''
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
							migration_list: res.data
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

	handleSubmit = (data) => {
		this.setState({ loading: true, disabled: true });
		if (this.state.type === "upload") {
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
		}
		else {
			const {
				productName,
				version
			} = data;

			let formData = new FormData();
			formData.append('name', productName ? productName : '');
			formData.append('version', version ? version : '');

			this.props.migrationActions
				.migrate(formData)
				.then((res) => {
					this.setState({ disabled: false });
					if (res.status === 200) {
						this.setState({
							migration_list: res.data
						});
						this.props.commonActions.tostifyAlert(
							'success',
							'Migration Completed.',
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

	openForgotPasswordModal = () => {
		this.setState({ openForgotPasswordModal: true });
	};

	closeForgotPasswordModal = (res) => {
		this.setState({ openForgotPasswordModal: false });
	};

	render() {
		const { isPasswordShown, product_list, version_list } = this.state;
		const { initValue, migration_list } = this.state;
		console.log(migration_list)
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
									{/* <Row>
										<Col lg={12}>
											<div>
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
																	Application Name
																	</Label>
																	<Select
																		styles={customStyles}
																		id="productName"
																		name="productName"
																		placeholder= "Select Product" 
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
																	Version
																	</Label>
																	<Select
																		
																		id="version"
																		name="version"
																		 placeholder= "Select Version" 
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
															<Row >
																<Col lg={3}>
																	<FormGroup className="">
																	
																		<input
																			id="file"
																			ref={(ref) => {
																				this.uploadFile = ref;
																			}}
																			multiple
																		
																			type="file"
																			accept=".csv"
																			onChange={(e) => {
																				this.setState({
																					fileName: e.target.value
																						.split('\\')
																						.pop(),
																				});
																			}}
																		/>
																	
																	</FormGroup>
																</Col>
																<Col>
																	<Button
																	
																		color="primary"
																		type="button"
																		className="btn-square"
																		onClick={() => {
																			this.setState({type:"upload"})
																			props.handleSubmit();
																		}}
																		disabled={
																			this.state.fileName.length === 0
																				? true
																				: false
																		}
																	>
																		<i className="fa fa-dot-circle-o mr-1"></i>
																		Upload
																	</Button>
																</Col>
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
												tableStyle={{width:'800px'}}
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
												<TableHeaderColumn  dataField="recordsMigrated" dataSort className="table-header-bg">
												Record Migrated
												</TableHeaderColumn >
											</BootstrapTable>
											</div>
																
															</Row>
															<FormGroup>
																	<Button
																		color="primary"
																		type="button"
																		className="btn-square mt-4"
																		onClick={() => {
																			this.setState({type:"migrate"})
																			props.handleSubmit();
																		}}
																		
											
																	>
																		<i className="fa fa-dot-circle-o mr-1"></i>
																		Migrate
																	</Button>
																	</FormGroup>
														</Form>
													)}
												</Formik>
											</div>
										</Col>
									</Row> */}


									{/* added by suraj */}
									<Nav className="justify-content-center" tabs pills  >
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '1'}
												onClick={() => {
													this.toggle(0, '1');
												}}
											>
												<h4 style={{margin:"4px 2px 4px 2px"}}>1</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '2'}
												onClick={() => {
													this.toggle(0, '2');
												}}
											>
												<h4 style={{margin:"4px 0px 4px 0px"}}>2</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '3'}
												onClick={() => {
													this.toggle(0, '3');
												}}
											>
												<h4 style={{margin:"4px 0px 4px 0px"}}>3</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '4'}
												onClick={() => {
													this.toggle(0, '4');
												}}
											>
												<h4 style={{margin:"4px 0px 4px 0px"}}>4</h4>
											</NavLink>
										</NavItem>
										{/* <NavItem>
											<NavLink
												active={this.state.activeTab[0] === '5'}
												onClick={() => {
													this.toggle(0, '5');
												}}
											>
												<h4>5</h4>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												active={this.state.activeTab[0] === '6'}
												onClick={() => {
													this.toggle(0, '6');
												}}
											>
												<h4>6</h4>
											</NavLink>
										</NavItem> */}
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
															debugger
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


																		{/* <Button name="button" color="primary" className="btn-square pull-right"
																			// onClick={() => {
																			// 	// this.saveAccountStartDate(this.state.date)
																			// 	props.handleSubmit()
																			// }}
																			onClick={() => {
																				this.setState({ createMore: false }, () => {
																					props.handleSubmit()
																				})
																			}}
																		>
																			Next<i class="far fa-arrow-alt-circle-right ml-1"></i>
																		</Button> */}
																		<div className="table-wrapper">
																			<FormGroup className="text-center">
																				<Button disabled={true} color="secondary" className="btn-square pull-left"
																					onClick={() => { this.toggle(0, '1') }}>
																					<i className="far fa-arrow-alt-circle-left"></i> Back
																				</Button>

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
														// validationSchema={Yup.object().shape({
														// 	templateId: Yup.string().required(
														// 		'Select Template',
														// 	),
														// })}
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
																		<Row >
																			<Col lg={3}>
																				<FormGroup className="">

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
																						}}
																					/>

																				</FormGroup>
																			</Col>
																			<Col>
																				<Button

																					color="primary"
																					type="button"
																					className="btn-square"
																					onClick={() => {
																						this.setState({ type: "upload" })
																						props.handleSubmit();
																					}}
																					disabled={
																						this.state.fileName.length === 0
																							? true
																							: false
																					}
																				>
																					<i className="fa fa-dot-circle-o mr-1"></i>
																					Upload
																				</Button>
																			</Col>
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
																				<TableHeaderColumn dataField="recordsMigrated" dataSort className="table-header-bg">
																					Record Migrated
																				</TableHeaderColumn >
																			</BootstrapTable>
																		</div>

																	</Row>
																	<FormGroup>
																		<Button
																			color="primary"
																			type="button"
																			className="btn-square mt-4"
																			onClick={() => {
																				this.setState({ type: "migrate" })
																				props.handleSubmit();
																			}}

																		// disabled={
																		// 	this.state.fileName.length === 0
																		// 		? true
																		// 		: false
																		// }
																		>
																			<i className="fa fa-dot-circle-o mr-1"></i>
																			Migrate
																		</Button>
																	</FormGroup>
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
															this.handleSubmitForSalary(values, resetForm)
														}}
														validationSchema={Yup.object().shape({


														})}
													>
														{(props) => (

															<Form onSubmit={props.handleSubmit}>

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
													this.handleSubmitForSalary(values, resetForm)
												}}
												validationSchema={Yup.object().shape({


												})}
											>
												{(props) => (

													<Form onSubmit={props.handleSubmit}>

														<Row>
															<Col lg={12} className="mt-5">


																<div className="table-wrapper">
																	<FormGroup className="text-center">
																		<Button color="secondary" className="btn-square pull-left"
																			onClick={() => { this.toggle(0, '3') }}>
																			<i className="far fa-arrow-alt-circle-left"></i> Back
																		</Button>

																		<Button name="button" color="primary" className="btn-square pull-right mr-3"
																			onClick={() => {
																				this.toggle(0, '5')
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

										</TabPane>
										{/* <TabPane tabId="5">

											<Formik
												initialValues={this.state.initValue}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmitForSalary(values, resetForm)
												}}
												validationSchema={Yup.object().shape({

												})}
											>
												{(props) => (

													<Form onSubmit={props.handleSubmit}>

														<Row>
															<Col lg={12} className="mt-5">


																<div className="table-wrapper">
																	<FormGroup className="text-center">
																		<Button color="secondary" className="btn-square pull-left"
																			onClick={() => { this.toggle(0, '4') }}>
																			<i className="far fa-arrow-alt-circle-left"></i> Back
																		</Button>

																		<Button name="button" color="primary" className="btn-square pull-right mr-3"
																			onClick={() => {
																				this.toggle(0, '6')
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

										</TabPane>
										<TabPane tabId="6">

											<Formik
												initialValues={this.state.initValue}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmitForSalary(values, resetForm)
												}}
												validationSchema={Yup.object().shape({

												})}
											>
												{(props) => (

													<Form onSubmit={props.handleSubmit}>

														<Row>
															<Col lg={12} className="mt-5">


																<div className="table-wrapper">
																	<FormGroup className="text-center">
																		<Button color="secondary" className="btn-square pull-left"
																			onClick={() => { this.toggle(0, '5') }}>
																			<i className="far fa-arrow-alt-circle-left"></i> Back
																		</Button>

																		<Button name="button" color="primary" className="btn-square pull-right mr-3"
																			onClick={() => {
																				this.toggle(0, '1')
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

										</TabPane> */}

									</TabContent>
									{/* added by suraj */}

								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Import);
