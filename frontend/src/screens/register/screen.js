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
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
} from 'reactstrap';
import Select from 'react-select';
import { Message } from 'components';

import { AuthActions } from 'services/global';

import './style.scss';
import logo from 'assets/images/brand/logo.png';

const mapStateToProps = (state) => {
	return {
		version: state.common.version,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		authActions: bindActionCreators(AuthActions, dispatch),
	};
};
const options = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' },
];
class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			companyName: '',
			currencyCode: 62,
			companyTypeCode: '',
			industryTypeCode: '',
			firstName: '',
			lastName: '',
			email: '',
		};
	}

	handleChange = (key, val) => {
		this.setState({
			[key]: val,
		});
	};

	registerHandler = (e) => {
		e.preventDefault();
		const {
			companyName,
			currencyCode,
			companyTypeCode,
			industryTypeCode,
			firstName,
			lastName,
			email,
			password,
		} = this.state;
		let obj = {
			companyName,
			currencyCode,
			companyTypeCode,
			industryTypeCode,
			firstName,
			lastName,
			email,
			password,
		};
		this.props.authActions
			.register(obj)
			.then((res) => {
				console.log(res);
				// this.setState({
				//   alert: null,
				// });
				// this.props.history.push('/admin');
			})
			.catch((err) => {
				this.setState({
					alert: (
						<Message
							type="danger"
							title={err ? err.data.error : ''}
							content="Log in failed. Please try again later"
						/>
					),
				});
			});
	};

	render() {
		const customStyles = {
			control: (base, state) => ({
				...base,
				flex: '1 1 auto',
				width: '267px',
			}),
		};
		return (
			<div className="log-in-screen">
				<div className="animated fadeIn">
					<div className="app flex-row align-items-center">
						<Container>
							<Row className="justify-content-center">
								<Col md="6">{this.state.alert}</Col>
							</Row>
							<Row className="justify-content-center">
								<Col md="8">
									<CardGroup>
										<Card className="p-4">
											<CardBody>
												<div className="logo-container">
													<img
														src={logo}
														alt="logo"
														style={{ width: '226px' }}
													/>
												</div>
												<Form onSubmit={this.registerHandler}>
													{/* <h1>Log In</h1> */}
													<p className="text-muted">Create your account</p>
													<Row>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Input
																	type="text"
																	placeholder="Company Name"
																	name="companyName"
																	value={this.state.companyName}
																	onChange={(e) =>
																		this.handleChange(
																			'companyName',
																			e.target.value,
																		)
																	}
																	autoComplete="companyName"
																	required
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Select
																	styles={customStyles}
																	options={options}
																	placeholder="Company Type Code"
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Select
																	styles={customStyles}
																	options={options}
																	placeholder="Currency Code"
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Select
																	styles={customStyles}
																	options={options}
																	placeholder="Industry Type Code"
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Input
																	type="text"
																	placeholder="First Name"
																	name="firstName"
																	value={this.state.firstName}
																	onChange={(e) =>
																		this.handleChange(
																			'firstName',
																			e.target.value,
																		)
																	}
																	autoComplete="firstName"
																	required
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Input
																	type="text"
																	placeholder="Last Name"
																	name="lastName"
																	value={this.state.lastName}
																	onChange={(e) =>
																		this.handleChange(
																			'lastName',
																			e.target.value,
																		)
																	}
																	autoComplete="lastName"
																	required
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-3">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-user"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Input
																	type="text"
																	placeholder="Email Address"
																	name="email"
																	value={this.state.email}
																	onChange={(e) =>
																		this.handleChange('email', e.target.value)
																	}
																	autoComplete="email"
																	required
																/>
															</InputGroup>
														</Col>
														<Col lg={6}>
															<InputGroup className="mb-4">
																<InputGroupAddon addonType="prepend">
																	<InputGroupText>
																		<i className="icon-lock"></i>
																	</InputGroupText>
																</InputGroupAddon>
																<Input
																	type="password"
																	placeholder="Password"
																	name="password"
																	value={this.state.password}
																	onChange={(e) =>
																		this.handleChange(
																			'password',
																			e.target.value,
																		)
																	}
																	autoComplete="current-password"
																	required
																/>
															</InputGroup>
														</Col>
													</Row>
													<Row>
														<Col xs="12" lg="5">
															<Button
																color="primary"
																type="submit"
																className="px-4 btn-square w-100"
															>
																<i className="fa fa-sign-in" /> Register
															</Button>
														</Col>
													</Row>
												</Form>
											</CardBody>
										</Card>
									</CardGroup>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
