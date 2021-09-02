import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	selectCurrencyFactory,
} from 'utils';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Input,
	FormGroup,
	Label,
	Row,
	Col,
	UncontrolledTooltip,
} from 'reactstrap';
import Select from 'react-select';
import _ from 'lodash';
import { Loader } from 'components';

import { AuthActions,CommonActions } from 'services/global';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss';

import * as CreateCurrencyConvertActions from './actions';
import * as CurrencyConvertActions from '../../actions';

import { Formik } from 'formik';
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';
import * as Yup from 'yup';

const mapStateToProps = (state) => {
	return {
		
		currency_list: state.common.currency_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		currencyConvertActions: bindActionCreators(CurrencyConvertActions, dispatch),
		createCurrencyConvertActions: bindActionCreators(CreateCurrencyConvertActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		authActions: bindActionCreators(AuthActions, dispatch),
	}
};

let strings = new LocalizedStrings(data);
class CreateCurrencyConvert extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			initValue: {
				currencyCode: '',
				exchangeRate:'',
			},
			exist: false,
			createDisabled: false,
			data: '',
			basecurrency:[],
			loading: false,
			createMore: false,
			currency_list : [],
			
		};
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.formRef = React.createRef();
	}
	componentWillMount = () => {
		this.props.authActions.getCurrencylist() 
		.then((res) => {
			if (res.status === 200) {
				this.setState({ currency_list: res.data });
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
	componentDidMount = () => {
	
		this.getCompanyCurrency();
	};

	getCompanyCurrency = (basecurrency) => {
		this.props.currencyConvertActions
			.getCompanyCurrency()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ basecurrency: res.data });
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
	// Save Updated Field's Value to State	
	handleChange = (e, name) => {
		this.setState({
			vatData: _.set(
				{ ...this.state.vatData },
				e.target.name && e.target.name !== '' ? e.target.name : name,
				e.target.type === 'checkbox' ? e.target.checked : e.target.value,
			),
		});
	};

	// Show Success Toast
	// success() {
	//   toast.success('Product Category Created successfully... ', {
	//     position: toast.POSITION.TOP_RIGHT
	//   })
	// }

	// Create or Edit Currency conversion
	handleSubmit = (data, resetForm) => {
		this.setState({
			createDisabled: true,
		})
		this.props.createCurrencyConvertActions
			.createCurrencyConvert(data)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ createDisabled: false });
					this.props.commonActions.tostifyAlert(
						'success',
						'New Currency Conversion is Created Successfully!',
					);

					if (this.state.createMore) {
						resetForm(this.state.initValue);
						this.setState({
							createMore: false,
						});
					} else {
						this.props.history.push('/admin/master/CurrencyConvert');
					}
				}
			})
			.catch((err) => {
				this.setState({ createDisabled: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
			
	};

	validationCheck = (value) => {
		console.log(value)
		const data = {
			moduleType: 10,
			currencyCode: value,
		};
		this.props.createCurrencyConvertActions.checkValidation(data).then((response) => {
			if (response.data === 'Currency Conversions already exists') {
				this.setState({
					exist: true,
					createDisabled: false,
				})
				this.props.commonActions.tostifyAlert(
					'error',
				 'Currency Already exists',
				);
			} else {
				this.setState({
					exist: false,
				});
			}
		});
	};

	render() {
		strings.setLanguage(this.state.language);
		const { loading, initValue,currency_list} = this.state;
		
		const{currencyList} =this.props;
		return (
			<div className="vat-code-create-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12}>
							<Card>
								<CardHeader>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="nav-icon icon-briefcase" />
										<span className="ml-2"> {strings.NewCurrencyConversion}</span>
									</div>
								</CardHeader>
								<CardBody>
									<Row>
										<Col lg={10}>
											<Formik
												initialValues={initValue}
												ref={this.formRef}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmit(values, resetForm);
												}}
												validate={(values) => {
													let errors = {};
													if (this.state.exist === true) {
														errors.currencyCode =
															'Currency already exists';
													}
													return errors;
												}}
												validationSchema={Yup.object().shape({
													currencyCode: Yup.string().required(
														'Currency is required',
													),
													exchangeRate: Yup.string().required(
														'Exchange Rate is Required',
													),
												
												
												})}
											>
												{(props) => {
													const {
														values,
														touched,
														errors,
														handleChange,
														handleSubmit,
														handleBlur,
													} = props;
													return (
														<form onSubmit={handleSubmit}>
																<Row>
																	<Col lg={1}>
																	<FormGroup className="mt-2">
																	<Label>
																						{strings.Value}
																						</Label>
																	<Input
																			disabled
																				id="1"
																				name="1"
																				value=	{
																					1 }
																				
																	/>
																	</FormGroup>
																	</Col>
																					<Col lg={4}>
																						<FormGroup className="mt-2">
																						<Label htmlFor="currencyCode">
																							{strings.ExchangeCurrency}
																						</Label>
																						<Select
																							options={
																								currency_list
																									? selectCurrencyFactory.renderOptions(
																											'currencyName',
																											'currencyCode',
																											currency_list,
																											'Currency',
																									  )
																									: []
																							}
																							value={
																								currency_list &&
																								selectCurrencyFactory
																									.renderOptions(
																										'currencyName',
																										'currencyCode',
																										currency_list,
																										'Currency',
																									)
																									.find(
																										(option) =>
																											option.value ===
																											+props.values
																												.currencyCode,
																									)
																							}
																							onChange={(options) => {
																								if (options && options.value) {
																									props.handleChange(
																										'currencyCode',
																									)(options.value);
																								} else {
																									props.handleChange(
																										'currencyCode',
																									)('');
																								}
																								this.validationCheck(
																									options.value,
																								);
																							}}
																							placeholder={strings.Select+strings.Currency}
																							id="currencyCode"
																							name="currencyCode"
																							className={
																								props.errors.currencyCode &&
																								props.touched.currencyCode
																									? 'is-invalid'
																									: ''
																							}
																						/>
																						{props.errors.exchangecurrencyCode &&
																							props.touched.exchangecurrencyCode && (
																								<div className="invalid-feedback">
																									{props.errors.exchangecurrencyCode}
																								</div>
																							)}
																			</FormGroup>
																				</Col>
																				<FormGroup className="mt-5"><label><b>=</b></label>	</FormGroup>
																	<Col lg={3}>
																	<FormGroup className="mt-2">
																	<Label htmlFor="Exchange rate">
																	{strings.Exchangerate}
																	{/* <i
																		id="ProductcatcodeTooltip"
																		className="fa fa-question-circle ml-1"
																	></i>
																	<UncontrolledTooltip
																		placement="right"
																		target="ProductcatcodeTooltip"
																	>
																		Product Category Code - Unique identifier code of the product 
																	</UncontrolledTooltip> */}
																	</Label>
																	<Input
																	type="number"
																	maxLength='20'
																	id="exchangeRate"
																	name="exchangeRate"
																	placeholder={strings.Enter+strings.Exchangerate}
																	onChange={(option) => {
																		if (
																			option.target.value === '' ||
																			this.regDecimal.test(option.target.value)
																		) {
																			handleChange('exchangeRate')(
																				option,
																			);
																		}
																	}}
																	onBlur={handleBlur}
																	value={values.exchangeRate}
																	className={
																		errors.exchangeRate &&
																		touched.exchangeRate
																			? 'is-invalid'
																			: ''
																	}
																	/>
															
																	{errors.exchangeRate &&
																	touched.exchangeRate && (
																		<div className="invalid-feedback">
																			{errors.exchangeRate}
																		</div>
																	)}
																	</FormGroup >
																	</Col>
																	<Col lg={3}>
																		<FormGroup className="mt-2">
																		<Label htmlFor="currencyName">
																		 {strings.BaseCurrency}
																		</Label>
																		<Input
																		disabled
																				type="text"
																				id="currencyName"
																				name="currencyName"
																				value=	{
																					this.state.basecurrency.currencyName }
																			/>
																		</FormGroup>
																			</Col>
															</Row>
														
																<FormGroup className="text-right mt-5">
																<Button
																	type="submit"
																	name="submit"
																	color="primary"
																	className="btn-square mr-3"
																	disabled={this.state.createDisabled}
																>
																	<i className="fa fa-dot-circle-o"></i>{this.state.createDisabled
																			? 'Creating...'
																			: strings.Create }
																</Button>

																<Button
																	name="button"
																	color="primary"
																	className="btn-square mr-3"
																	createDisabled={this.state.createDisabled}
																	onClick={() => {
																		this.setState({ createMore: true }, () => {
																			props.handleSubmit();
																		});
																	}}
																>
																	<i className="fa fa-refresh"></i> {this.state.createDisabled
																			? 'Creating...'
																			: strings.CreateandMore }
																</Button>

																<Button
																	type="button"
																	color="secondary"
																	className="btn-square"
																	onClick={() => {
																		this.props.history.push(
																			'/admin/master/CurrencyConvert',
																		);
																	}}
																>
																	<i className="fa fa-ban"></i> {strings.Cancel}
																</Button>
																</FormGroup>
																</form>
													);
												}}
											</Formik>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
					{loading ? <Loader></Loader> : ''}
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateCurrencyConvert);
