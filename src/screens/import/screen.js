import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Button,
	Card,
	CardBody,
	CardGroup,
	Col,
	Container,
	Form,
	Input,
	FormGroup,
	Label,
	Row,
	CardHeader,
} from 'reactstrap';
import Select from 'react-select';
import { AuthActions, CommonActions } from 'services/global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Formik } from 'formik';
import * as Yup from 'yup';
import './style.scss';
import * as MigrationAction from './actions';
import { selectOptionsFactory } from 'utils';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';



const mapStateToProps = (state) => {
	return {
		version: state.common.version,
	};
};

const eye = require('assets/images/settings/eye.png');
const noteye = require('assets/images/settings/noteye.png')
const mapDispatchToProps = (dispatch) => {
	return {
		authActions: bindActionCreators(AuthActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		migrationActions: bindActionCreators(MigrationAction,dispatch),
	};
};

class Import extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initValue: {},
			loading: false,
			fileName:'',
			disabled: false,
			product_list:[],
			version_list:[],
			productName:'',
			version:'',
			type:'',
			upload: false,
			migration: false,
			
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

	handleSubmit = (data) => {
		this.setState({ loading: true, disabled: true});
		if(this.state.type==="upload"){
		let formData = new FormData();
		
		for (const file of this.uploadFile.files) {
			formData.append('files', file);
		  }
		
		this.props.migrationActions
			.uploadFolder(formData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ disabled: false,
						upload: true,
						migration: true });
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
			else{
				const {
					productName,
					version
				} = data;

				let formData = new FormData();
				formData.append('name',productName ? productName : '');
				formData.append('version', version ? version : '');
				debugger
				this.props.migrationActions
					.migrate(formData)
					.then((res) => {
						this.setState({ disabled: false });
						if (res.status === 200) {
							this.props.commonActions.tostifyAlert(
								'success',
								'Migration Completed.',
							);
							 this.props.history.push('/admin/dashboard');
						
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
		const { isPasswordShown,product_list,version_list } = this.state;
		const { initValue } = this.state;
console.log(initValue.productName)
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
								<CardBody>
									<Row>
										<Col lg={12}>
											<div>
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
																		{/* {strings.PlaceofSupply} */}Version
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
																			directory="" 
																			webkitdirectory=""
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
												// data={
												// 	summary_list && summary_list.data
												// 		? summary_list.data
												// 		: []
												// }
												version="4"
												hover
												// pagination={
												// 	summary_list &&
												// 	summary_list.data &&
												// 	summary_list.data.length > 0
												// 		? true
												// 		: false
												// }
												remote
												// fetchInfo={{
												// 	dataTotalSize: summary_list.count
												// 		? summary_list.count
												// 		: 0,
												// }}
												className="product-table"
												trClassName="cursor-pointer"
												csvFileName="summary_list.csv"
												ref={(node) => (this.table = node)}
											>
												<TableHeaderColumn isKey dataField="productName" dataSort className="table-header-bg">
												PRODUCTNAME
												</TableHeaderColumn >
												<TableHeaderColumn dataField="productCode" dataSort className="table-header-bg">
												PRODUCTCODE
												</TableHeaderColumn>
												<TableHeaderColumn  dataField="purchaseOrder" dataSort className="table-header-bg">
											ORDERQUANTITY
												</TableHeaderColumn >
											</BootstrapTable>
											</div>
																	<Col lg={3}>
																	<FormGroup>
																	<Button
																		color="primary"
																		type="button"
																		className="btn-square mt-4"
																		onClick={() => {
																			this.setState({type:"migrate"})
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
															</Col>
															
															</Row>
															
														</Form>
													)}
												</Formik>
											</div>
										</Col>
									</Row>
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
