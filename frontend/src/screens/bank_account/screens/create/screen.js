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
import Select from 'react-select';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils';
import { CommonActions } from 'services/global';
import * as createBankAccountActions from './actions';

import './style.scss';

const mapStateToProps = (state) => {
	return {
		account_type_list: state.bank_account.account_type_list,
		currency_list: state.bank_account.currency_list,
		country_list: state.bank_account.country_list,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		commonActions: bindActionCreators(CommonActions, dispatch),
		createBankAccountActions: bindActionCreators(
			createBankAccountActions,
			dispatch,
		),
	};
};

class CreateBankAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			createMore: false,
			disabled: false,
			initialVals: {
				account_name: '',
				currency: '',
				opening_balance: '',
				account_type: '',
				bank_name: '',
				account_number: '',
				ifsc_code: '',
				swift_code: '',
				country: '',
				account_is_for: { label: 'Corporate', value: 'Corporate' },
			},
			currentData: {},
		};
		this.formRef = React.createRef();
		this.regExAlpha = /^[a-zA-Z_ ]+$/;
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.ifscCode = /[A-Z0-9]+$/;
		this.swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
		this.regDecimal = /^\d*\.?\d*$/;
		this.account_for = [
			{ label: 'Personal', value: 'Personal' },
			{ label: 'Corporate', value: 'Corporate' },
		];
	}

	componentDidMount = () => {
		this.initializeData();
	};

	initializeData = () => {
		this.props.createBankAccountActions.getAccountTypeList();
		this.props.createBankAccountActions.getCurrencyList().then((response) => {
			this.setState({
				initValue: {
					...this.state.initValue,
					...{
						currency: response.data
							? parseInt(response.data[0].currencyCode)
							: '',
					},
				},
			});
			this.formRef.current.setFieldValue(
				'currency',
				response.data[0].currencyCode,
				true,
			);
		});
		this.props.createBankAccountActions.getCountryList();
	};

	handleChange = (e, name) => {
		this.setState({
			currentData: _.set(
				{ ...this.state.currentData },
				e.target.name && e.target.name !== '' ? e.target.name : name,
				e.target.type === 'checkbox' ? e.target.checked : e.target.value,
			),
		});
	};

	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const {
			account_name,
			currency,
			opening_balance,
			account_type,
			bank_name,
			account_number,
			ifsc_code,
			swift_code,
			country,
			account_is_for,
		} = data;
		let obj = {
			bankAccountName: account_name,
			bankAccountCurrency: currency ? currency : '',
			openingBalance: opening_balance,
			bankAccountType: account_type ? account_type.value : '',
			bankName: bank_name,
			accountNumber: account_number,
			ifscCode: ifsc_code,
			swiftCode: swift_code,
			bankCountry: country ? country.value : '',
			personalCorporateAccountInd: account_is_for ? account_is_for.value : '',
		};
		this.props.createBankAccountActions
			.createBankAccount(obj)
			.then((res) => {
				this.setState({ disabled: false });
				this.props.commonActions.tostifyAlert(
					'success',
					'New Bank Account Created Successfully.',
				);
				if (this.state.createMore) {
					this.setState({
						createMore: false,
					});
					resetForm(this.state.initialVals);
				} else {
					this.props.history.push('/admin/banking/bank-account');
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

	render() {
		const { account_type_list, currency_list, country_list } = this.props;

		const { initialVals } = this.state;

		return (
			<div className="create-bank-account-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg={12} className="mx-auto">
							<Card>
								<CardHeader>
									<Row>
										<Col lg={12}>
											<div className="h4 mb-0 d-flex align-items-center">
												<i className="fas fa-university" />
												<span className="ml-2">Create Bank Account</span>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<Row>
										<Col lg={12}>
											<Formik
												initialValues={initialVals}
												ref={this.formRef}
												onSubmit={(values, { resetForm }) => {
													this.handleSubmit(values, resetForm);
												}}
												validationSchema={Yup.object().shape({
													account_name: Yup.string()
														.required('Account Name is Required')
														.min(2, 'Account Name Is Too Short!')
														.max(20, 'Account Name Is Too Long!'),
													opening_balance: Yup.string().required(
														'Opening Balance is Required',
													),
													currency: Yup.string().required(
														'Currency is required',
													),
													account_type: Yup.string().required(
														'Account Type is required',
													),
													bank_name: Yup.string()
														.required('Bank Name is Required')
														.min(2, 'Bank Name Is Too Short!')
														.max(20, 'Bank Name Is Too Long!'),
													account_number: Yup.string()
														.required('Account Number is Required')
														.min(2, 'Account Number Is Too Short!')
														.max(20, 'Account Number Is Too Long!'),
													account_is_for: Yup.string().required(
														'Account for is required',
													),
													ifsc_code: Yup.string()
														.required('IFSC Code is Required')
														.min(2, 'IFSC Code Is Too Short!')
														.max(20, 'IFSC Code Is Too Long!'),
													swift_code: Yup.string().matches(this.swiftRegex, {
														message: 'Please enter valid Swift Code.',
														excludeEmptyString: false,
													}),
												})}
											>
												{(props) => (
													<Form onSubmit={props.handleSubmit}>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="account_name">
																		<span className="text-danger">*</span>
																		Account Name
																	</Label>
																	<Input
																		type="text"
																		id="account_name"
																		name="account_name"
																		placeholder="Enter Account Name"
																		value={props.values.account_name}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				props.handleChange('account_name')(
																					option,
																				);
																			}
																		}}
																		className={
																			props.errors.account_name &&
																			props.touched.account_name
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.account_name &&
																		props.touched.account_name && (
																			<div className="invalid-feedback">
																				{props.errors.account_name}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="currency">
																		<span className="text-danger">*</span>
																		Currency
																	</Label>
																	<Select
																		id="currency"
																		name="currency"
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
																						+props.values.currency,
																				)
																		}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('currency')(option);
																			} else {
																				props.handleChange('currency')('');
																			}
																		}}
																		className={
																			props.errors.currency &&
																			props.touched.currency
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.currency &&
																		props.touched.currency && (
																			<div className="invalid-feedback">
																				{props.errors.currency}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="opening_balance">
																		<span className="text-danger">*</span>
																		Opening Balance
																	</Label>
																	<Input
																		type="type"
																		id="opening_balance"
																		name="opening_balance"
																		placeholder="Your Opening Balance"
																		value={props.values.opening_balance}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regDecimal.test(
																					option.target.value,
																				)
																			) {
																				props.handleChange('opening_balance')(
																					option,
																				);
																			}
																		}}
																		className={
																			props.errors.opening_balance &&
																			props.touched.opening_balance
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.opening_balance &&
																		props.touched.opening_balance && (
																			<div className="invalid-feedback">
																				{props.errors.opening_balance}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="account_type">
																		<span className="text-danger">*</span>
																		Account Type
																	</Label>
																	<Select
																		id="account_type"
																		name="account_type"
																		options={
																			account_type_list
																				? selectOptionsFactory.renderOptions(
																						'name',
																						'id',
																						account_type_list,
																						'Account Type',
																				  )
																				: []
																		}
																		value={props.values.account_type}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('account_type')(
																					option,
																				);
																			} else {
																				props.handleChange('account_type')('');
																			}
																		}}
																		className={
																			props.errors.account_type &&
																			props.touched.account_type
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.account_type &&
																		props.touched.account_type && (
																			<div className="invalid-feedback">
																				{props.errors.account_type}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<hr />
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="bank_name">
																		<span className="text-danger">*</span>Bank
																		Name
																	</Label>
																	<Input
																		type="text"
																		id="bank_name"
																		name="bank_name"
																		placeholder="Enter Bank Name"
																		value={props.values.bank_name}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regExAlpha.test(
																					option.target.value,
																				)
																			) {
																				props.handleChange('bank_name')(option);
																			}
																		}}
																		className={
																			props.errors.bank_name &&
																			props.touched.bank_name
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.bank_name &&
																		props.touched.bank_name && (
																			<div className="invalid-feedback">
																				{props.errors.bank_name}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="account_number">
																		<span className="text-danger">*</span>
																		Account Number
																	</Label>
																	<Input
																		type="text"
																		id="account_number"
																		name="account_number"
																		placeholder="Enter Account Number"
																		value={props.values.account_number}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.regEx.test(option.target.value)
																			) {
																				props.handleChange('account_number')(
																					option,
																				);
																			}
																		}}
																		className={
																			props.errors.account_number &&
																			props.touched.account_number
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.account_number &&
																		props.touched.account_number && (
																			<div className="invalid-feedback">
																				{props.errors.account_number}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="ifsc_code">
																		<span className="text-danger">*</span>IFSC
																		Code
																		<i
																			id="IFSCcodeToolTip"
																			className="fa fa-question-circle ml-1"
																		></i>
																		<UncontrolledTooltip
																			placement="right"
																			target="IFSCcodeToolTip"
																		>
																			<p> IFSC code –  11-digit unique bank branch identifier code And Should be in capital and numbers  </p> 
																			
																		</UncontrolledTooltip>
																	</Label>
																	<Input
																		type="text"
																		id="ifsc_code"
																		name="ifsc_code"
																		placeholder="Enter IFSC Code"
																		value={props.values.ifsc_code}
																		onChange={(option) => {
																			if (
																				option.target.value === '' ||
																				this.ifscCode.test(option.target.value)
																			) {
																				props.handleChange('ifsc_code')(option);
																			}
																		}}
																		className={
																			props.errors.ifsc_code &&
																			props.touched.ifsc_code
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.ifsc_code &&
																		props.touched.ifsc_code && (
																			<div className="invalid-feedback">
																				{props.errors.ifsc_code}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="swift_code">Swift Code
																	<i
																			id="SwiftCodeToolTip"
																			className="fa fa-question-circle ml-1"
																		></i>
																		<UncontrolledTooltip
																			placement="right"
																			target="SwiftCodeToolTip"
																		>
																			<p> Swift Code - Bank identifier code  </p> 
																			
																		</UncontrolledTooltip>
																		</Label>
																	<Input
																		type="text"
																		id="swift_code"
																		name="swift_code"
																		placeholder="Enter Swift Code"
																		value={props.values.swift_code}
																		onChange={props.handleChange}
																		className={
																			props.errors.swift_code &&
																			props.touched.swift_code
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.swift_code &&
																		props.touched.swift_code && (
																			<div className="invalid-feedback">
																				{props.errors.swift_code}
																			</div>
																		)}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="country">Country</Label>
																	<Select
																		id="country"
																		name="country"
																		getOptionValue={(option) =>
																			option.countryName
																		}
																		options={
																			country_list
																				? selectOptionsFactory.renderOptions(
																						'countryName',
																						'countryCode',
																						country_list,
																						'Country',
																				  )
																				: []
																		}
																		value={props.values.country}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('country')(option);
																			} else {
																				props.handleChange('country')('');
																			}
																		}}
																		className={
																			props.errors.country &&
																			props.touched.country
																				? 'is-invalid'
																				: ''
																		}
																	/>
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="account_is_for">
																		<span className="text-danger">*</span>
																		Account is for
																	</Label>
																	<Select
																		id="account_is_for"
																		name="account_is_for"
																		options={
																			this.account_for
																				? selectOptionsFactory.renderOptions(
																						'label',
																						'value',
																						this.account_for,
																						'Account is for',
																				  )
																				: []
																		}
																		value={props.values.account_is_for}
																		onChange={(option) => {
																			if (option && option.value) {
																				props.handleChange('account_is_for')(
																					option,
																				);
																			} else {
																				props.handleChange('account_is_for')(
																					'',
																				);
																			}
																		}}
																		className={
																			props.errors.account_is_for &&
																			props.touched.account_is_for
																				? 'is-invalid'
																				: ''
																		}
																	/>
																	{props.errors.account_is_for &&
																		props.touched.account_is_for && (
																			<div className="invalid-feedback">
																				{props.errors.account_is_for}
																			</div>
																		)}
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																<FormGroup className="text-right mt-5 form-action-btn">
																	<Button
																		type="submit"
																		name="submit"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																	>
																		<i className="fa fa-dot-circle-o"></i>{' '}
																		{this.state.disabled
																			? 'Creating...'
																			: 'Create'}
																	</Button>
																	<Button
																		type="button"
																		name="button"
																		color="primary"
																		className="btn-square mr-3"
																		disabled={this.state.disabled}
																		onClick={() => {
																			this.setState(
																				{ createMore: true },
																				() => {
																					props.handleSubmit();
																				},
																			);
																		}}
																	>
																		<i className="fa fa-repeat"></i>
																		{this.state.disabled
																			? ' Creating...'
																			: ' Create and More'}
																	</Button>
																	<Button
																		type="button"
																		name="button"
																		color="secondary"
																		className="btn-square"
																		onClick={() => {
																			this.props.history.push(
																				'/admin/banking/bank-account',
																			);
																		}}
																	>
																		<i className="fa fa-ban"></i> Cancel
																	</Button>
																</FormGroup>
															</Col>
														</Row>
													</Form>
												)}
											</Formik>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateBankAccount);
