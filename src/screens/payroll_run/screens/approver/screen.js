import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  ButtonGroup,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from "yup";
import { ImageUploader, Loader } from 'components';
import {
  CommonActions
} from 'services/global'
import {selectCurrencyFactory, selectOptionsFactory} from 'utils'
import * as EmployeeActions from '../../actions';
import * as SalaryStructureCreateActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'
import PhoneInput from 'react-phone-number-input'
import {data}  from '../../../Language/index'
import LocalizedStrings from 'react-localization';

const mapStateToProps = (state) => {
  return ({
    currency_list: state.employee.currency_list,
    country_list: state.contact.country_list,
    state_list: state.contact.state_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    employeeActions: bindActionCreators(EmployeeActions, dispatch),
    salaryStructureCreateActions: bindActionCreators(SalaryStructureCreateActions, dispatch)

  })
}
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
class PayrollApproverScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: window['localStorage'].getItem('language'),
      loading: false,
      createMore: false,
      loading:true,
      initValue: {
        type:'',
        name:'',
      },
    }
    this.selectRowProp = {
			mode: 'checkbox',
			bgColor: 'rgba(0,0,0, 0.05)',
			clickToSelect: false,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		}
    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regExAlpha = /^[a-zA-Z ]+$/;


  }

  componentDidMount = () => {
    this.initializeData();
  };

  initializeData = () => {

  };

  handleSubmit = (data, resetForm) => {
    this.setState({ disabled: true });
		const {
      type,
      name
		} = data;


		const formData = new FormData();
    formData.append(
      'type',
      type != null ? type : '',
    )
    formData.append(
      'name',
      name != null ? name : '',
    )
    this.props.salaryStructureCreateActions
    .createSalaryStructure(formData)
    .then((res) => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert(
          'success',
           'New Salary Structure Created Successfully')
        if (this.state.createMore) {
          this.setState({
            createMore: false
          })
          resetForm(this.state.initValue)
        } else {
          this.props.history.push('/admin/payroll/config',{tabNo:'2'})
        }
      }
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : 'Something Went Wrong')
    })
  }


  render() {
    strings.setLanguage(this.state.language);
    const { state_list } = this.props
    
    const { loading } = this.state
    return (
      <div className="create-employee-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user-tie" />
                        <span className="ml-2">{strings.CreateSalaryStructure}</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
							{loading ? (
								<Row>
									<Col lg={12}>
										<Loader />
									</Col>
								</Row>
							) : (
								<Row>
									<Col lg={12}>
										<div className="d-flex justify-content-end">
											<ButtonGroup size="sm">
												
											</ButtonGroup>
										</div>
										<Row className="mb-4 ">
                    <Col>
												<Button
													color="primary"
													className="btn-square mt-2 "
													// onClick={}
													onClick={() =>
														this.props.history.push('/admin/payroll/createPayroll')
													}
													// disabled={selectedRows.length === 0}
												>
													<i class="  mr-1"></i>
                          Remove Employees
												</Button>
											</Col>
											<Col>
												<Button
													color="primary"
													className="btn-square mt-2 pull-right"
													// onClick={}
													onClick={() =>
														this.props.history.push('/admin/payroll/createPayroll')
													}
													// disabled={selectedRows.length === 0}
												>
													<i class="  mr-1"></i>
												
													Create New Payroll
												</Button>
											</Col>
										</Row>
										<div >
											<BootstrapTable
												selectRow={this.selectRowProp}
												search={false}
												options={this.options}
												// data={payroll_employee_list &&
												// 	payroll_employee_list ? payroll_employee_list : []}
												version="4"
												hover
												keyField="employeeId"
												remote
												// fetchInfo={{ dataTotalSize: payroll_employee_list.count ? payroll_employee_list.count : 0 }}
												// className="employee-table mt-4"
												trClassName="cursor-pointer"
												csvFileName="payroll_employee_list.csv"
												ref={(node) => this.table = node}
											>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
												Employee Number
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
												Employee Name
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
											Package
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
											Earnings
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
											Deductions
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
												Net Pay
												</TableHeaderColumn>
												<TableHeaderColumn
													className="table-header-bg"
													dataField="status"
													dataSort
													dataFormat={this.renderStatus}
												
												>
													{strings.STATUS}
												</TableHeaderColumn>
								
											</BootstrapTable>
										</div>
                  
                    <Row className="mb-4 ">                 
															<Col>											
																<Button
																	type="button"
																	color="primary"
																	className="btn-square mt-4 "
																
																>
																Reject Payroll
																</Button>
															</Col>
                  
											<Col>
												<Button
													color="primary"
													className="btn-square mt-4 pull-right"
													// onClick={}
													onClick={() =>
														this.props.history.push('/admin/payroll/createPayroll')
													}
													// disabled={selectedRows.length === 0}
												>
													<i class="  mr-1"></i>
												
                          Approve & Run Payroll
												</Button>
											</Col>
										</Row>
									</Col>

								</Row>
							)}
						</CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PayrollApproverScreen)

