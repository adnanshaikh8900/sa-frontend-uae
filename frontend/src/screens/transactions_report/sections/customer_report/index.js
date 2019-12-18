import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Form,
  Badge,
  Row,
  Col,
  Input,
  Button,
  ButtonGroup
} from "reactstrap"
 
import _ from "lodash"
import Select from 'react-select'
import * as customerReportData from '../../actions';

import { DateRangePicker2 } from 'components'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DateRangePicker from 'react-bootstrap-daterangepicker'

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-select/dist/react-select.css'
import 'bootstrap-daterangepicker/daterangepicker.css'
import './style.scss'
import {
  selectOptionsFactory,
  filterFactory
} from 'utils' 


const mapStateToProps = (state) => {
      console.log(state)
  return ({
    customer_invoice_report : state.transaction_data.customer_invoice_report,
    contact_list : state.transaction_data.contact_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    customerReportData: bindActionCreators(customerReportData, dispatch)
  })
}

const tempdata = [{
  status: 'paid',
  transactionCategoryId: 2,
  transactionCategoryCode: 2,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
}, {
  status: 'paid',
  transactionCategoryId: 1,
  transactionCategoryCode: 4,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
}, {
  status: 'paid',
  transactionCategoryId: 1,
  transactionCategoryCode: 4,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
}, {
  status: 'unpaid',
  transactionCategoryId: 1,
  transactionCategoryCode: 4,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
}, {
  status: 'unpaid',
  transactionCategoryId: 1,
  transactionCategoryCode: 4,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
},{
  status: 'paid',
  transactionCategoryId: 1,
  transactionCategoryCode: 4,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
},{
  status: 'unpaid',
  transactionCategoryId: 1,
  transactionCategoryCode: 4,
  transactionCategoryName: 'temp',
  transactionCategoryDescription: 'temp',
  parentTransactionCategory: 'Loream Ipsume',
  transactionType: 'TEMP'
}]


const ranges =  {
  'This Week': [moment().startOf('week'), moment().endOf('week')],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
}

class CustomerReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '',
      filter_refNumber : '',
      filter_contactName : ''
    }

    this.handleChange = this.handleChange.bind(this)
  }



  componentDidMount(){
    this.getCustomerInvoice()
    
  }

  getCustomerInvoice = () => {
    this.props.customerReportData.getCustomerInvoiceReport();
    this.props.customerReportData.getContactNameList();
  }
  
  handleChange(selectedOption) {
    this.setState({ selectedOption })
  }

  getInvoiceStatus(cell, row) {
    return(<Badge color={cell === 'Paid'?'success':'danger'}>{cell}</Badge>)
  }


  getSelectedData = () => {
    console.log(this.state);

    
    // if(this.state.filter_transactionType !== '' || this.state.filter_transactionCategory !== '' || this.state.filter_accountType !== '' ) {
    //   const postObj = {
    //     "transactionTypeCode" : this.state.filter_transactionType !== '' ? this.state.filter_transactionType.value : "" ,
    //     "transactionCategoryId" : this.state.filter_transactionCategory !== '' ? this.state.filter_transactionCategory.value : "",
    //     "accountId" : this.state.filter_accountType !== '' ? this.state.filter_accountType.value : ""
        
    //   }
    //   this.props.accountBalanceActions.getAccountBalancesList(postObj);
    //  console.log(this.state);

    // }
    
  }

  inputHandler = (key, value) => {
    console.log(key,value)
    this.setState({
      [key]: value
    })
  }


  handleEvent = (event, picker) => {
    // alert(picker.minDate, picker.maxDate)
    console.log(picker.startDate);
  }

  render() {
  
    const customerInvoice = this.props.customer_invoice_report ? this.props.customer_invoice_report.map(customer => 
     
      ({
        status : customer.status,
        referenceNumber : customer.refNumber,
        date: moment(customer.invoiceDate).format('L'),
        dueDate: moment(customer.invoiceDueDate).format('L'),
        contactName: customer.contactName,
        numberOfItems: customer.noOfItem,
        totalCost: customer.totalCost,
      // transactionCategoryName: 'temp',
     
      // parentTransactionCategory: 'Loream Ipsume',
     
      })
    ) : ""

    const {
      contact_list
    } = this.props


    return (
      <div className="invoice-report-section">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12}>
              <div className="flex-wrap d-flex align-items-start justify-content-between">
                <div className="info-block">
                  <h4>Company Name - <small><i>Invoices</i></small></h4>
                </div>
                <Form onSubmit={this.handleSubmit} name="simpleForm">
                  <div className="flex-wrap d-flex align-items-center">
                    <FormGroup>
                      <ButtonGroup className="mr-3">
                        <Button
                          color="success"
                          className="btn-square"
                        >
                          <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                          Export to CSV
                        </Button>
                      </ButtonGroup>
                    </FormGroup>
                    <FormGroup>
                      <div className="date-range">
                        <DateRangePicker2
                          ranges={ranges}
                          opens={'left'}
                        />
                      </div>
                    </FormGroup>  
                  </div>
                </Form>
              </div>
              <div className="py-3">
                <h5>Filter : </h5>
                <Row>
                  <Col lg={2} className="mb-1">
                  <Input
                              type="text"
                              placeholder="Ref. Number" 
                              value={this.state.filter_refNumber}
                              onChange={e => this.inputHandler('filter_refNumber', e.target.value)}
                            />
                  </Col>
                  <Col lg={2} className="mb-1">

                  {/* <DatePicker
                                        className="form-control"
                                        id="payment_date"
                                        name="payment_date"
                                        placeholderText=""
                                        onChange={option => props.handleChange('payment_date')(option)}
                                        selected={props.values.payment_date}
                                      /> */}

                                      
                    <DateRangePicker  selected = "asdfg" onEvent={this.handleEvent}>
                      <Input type="text" placeholder="Date"/>
                    </DateRangePicker>
                  </Col>
                  <Col lg={2} className="mb-1">
                    <DateRangePicker>
                      <Input type="text" placeholder="Due Date" />
                    </DateRangePicker>
                  </Col>
                  <Col lg={2} className="mb-1">
                    {/* <Input type="text" placeholder="Contact Name" /> */}
                    <Select
                      className=""
                      // options={accountOptions}
                      options={selectOptionsFactory.renderOptions('firstName', 'contactId', contact_list)}
                      value={this.state.filter_accountType}
                      onChange={option => this.setState({
                        filter_accountType: option
                      })}
                      placeholder="Account"
                      // onChange={this.changeType}
                    />
                  </Col>
                  <Col lg={2} className="mb-1">
                  <Button
                          color="secondary"
                          className="btn-square"
                          type="submit"
                          name="submit"
                          onClick = {this.getSelectedData}
                        >
                          <i className="fa glyphicon glyphicon-export fa-search mr-1" />
                          Search
                        </Button>
                        </Col>
                </Row>
              </div>
              <div className="table-wrapper">
                <BootstrapTable 
                  data={customerInvoice} 
                  hover
                  pagination
                  filter = {true}
                  responsive={true}
                  version="4"
                >
                  <TableHeaderColumn
                    width="130"
                    dataField="status" 
                    dataFormat={this.getInvoiceStatus}
                  >
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    isKey
                    dataField="referenceNumber"
                    dataSort
                  >
                    Ref. Number
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="date"
                    dataSort
                  >
                    Date
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="dueDate"
                    dataSort
                  >
                    Due Date
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="contactName"
                    dataSort
                  >
                    Contact Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="numberOfItems"
                    dataSort
                  >
                    No. of Items
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="totalCost"
                    dataSort
                  >
                    Total Cost
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerReport)
