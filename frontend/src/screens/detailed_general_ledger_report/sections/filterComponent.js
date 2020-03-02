import React, { Component } from 'react'
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	FormGroup,
	Label,
	Form,
} from 'reactstrap'
import DatePicker from "react-datepicker"

import { Formik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import moment from 'moment'

import { selectOptionsFactory } from "utils";


class FilterComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			initValue: {
				from_date: moment().startOf('month').format('YYYY-MM-DD hh:mm'),
				to_date: moment().endOf('month').format('YYYY-MM-DD hh:mm'),
				report_basis: ''
			}
		}

		this.report_basis = [
			{ label: 'cash', value: 'cash' },
			{ label: 'accrual', value: 'accrual' }
		]
	}

	handleSubmit = (values) => {
		console.log(values)
	}

	render() {
		const { initValue } = this.state
		console.log(this.props)
		return (
			<div>
				<Card>
					<CardHeader className="d-flex" style={{ justifyContent: 'space-between' }}>
						<div style={{ fontSize: '1.3rem', paddingLeft: '15px' }}>Customize Report</div>
						<div><i className="fa fa-close" style={{ cursor: 'pointer' }} onClick={this.props.viewFilter}></i></div>
					</CardHeader>
					<CardBody>
						<Formik
							initialValues={initValue}
							onSubmit={(values, { resetForm }) => {
								this.handleSubmit(values, resetForm);
							}}
						>
							{props => (
								<Form>
									<Row>
										<Col lg={4}>
											<FormGroup className="mb-3">
												<Label htmlFor="from_date">
													From
                                  </Label>
												<DatePicker
													id="date"
													name="from_date"
													className={`form-control`}
													placeholderText="From"
													showMonthDropdown
													showYearDropdown
													value={moment(props.values.from_date).format('DD/MM/YYYY')}
													dropdownMode="select"
													dateFormat="dd/MM/yyyy"
													onChange={value => {
														props.handleChange("from_date")(value);
													}}
												/>
											</FormGroup>
										</Col>

										<Col lg={4}>
											<FormGroup className="mb-3">
												<Label htmlFor="to_date">
													To
                                  </Label>
												<DatePicker
													id="date"
													name="to_date"
													className={`form-control`}
													placeholderText="From"
													showMonthDropdown
													showYearDropdown
													value={moment(props.values.to_date).format('DD/MM/YYYY')}
													dropdownMode="select"
													dateFormat="dd/MM/yyyy"
													onChange={value => {
														props.handleChange("to_date")(value);
													}}
												/>
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col lg={4}>
											<FormGroup className="mb-3">
												<Label htmlFor="report_basis">Report Basis</Label>
												<Select
													className="select-default-width"
													id="report_basis"
													name="report_basis"
													options={
														this.report_basis
															? selectOptionsFactory.renderOptions(
																"label",
																"value",
																this.report_basis,
																""
															)
															: []
													}
													value={props.values.report_basis}
													onChange={option =>
														props.handleChange("report_basis")(option)
													}
												/>
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col lg={12} className="mt-5">
											<FormGroup className="text-right">
												<Button type="button" color="primary" className="btn-square mr-3" onClick={() => {this.props.generateReport(props.values)}
												}>
													<i className="fa fa-dot-circle-o"></i> Run Report
                        </Button>

												<Button color="secondary" className="btn-square"
													onClick={this.props.viewFilter}>
													<i className="fa fa-ban"></i> Cancel
                        </Button>
											</FormGroup>
										</Col>
									</Row>
								</Form>
							)}
						</Formik>
					</CardBody>
				</Card>
			</div>
		)
	}
}



export default FilterComponent