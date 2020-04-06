import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Button,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  ButtonGroup
} from 'reactstrap'

import Select from 'react-select'
import { DateRangePicker2 } from 'components'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import DateRangePicker from 'react-bootstrap-daterangepicker'

import * as accountBalanceData from '../../actions';
import {
  selectOptionsFactory,
} from 'utils' 

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
 import 'react-select/dist/react-select.css'
 import 'bootstrap-daterangepicker/daterangepicker.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    account_balance_report : state.transaction_data.account_balance_report,
    transaction_type_list :  state.transaction_data.transaction_type_list,
    transaction_category_list :  state.transaction_data.transaction_category_list,
   account_type_list :state.transaction_data.account_type_list,    

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    accountBalanceData: bindActionCreators(accountBalanceData, dispatch)
  })
}

// const colourOptions = [
//   { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
//   { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
//   { value: 'purple', label: 'Purple', color: '#5243AA' },
//   { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
//   { value: 'orange', label: 'Orange', color: '#FF8B00' },
//   { value: 'yellow', label: 'Yellow', color: '#FFC400' },
//   { value: 'green', label: 'Green', color: '#36B37E' },
//   { value: 'forest', label: 'Forestasd fsad fas fsad fsad fsa', color: '#00875A' },
//   { value: 'slate', label: 'Slate', color: '#253858' },
//   { value: 'silver', label: 'Silver', color: '#666666' },
// ]



const ranges =  {
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Week': [moment().startOf('week'), moment().endOf('week')],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
}

class AccountBalances extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedType: '',
      selectedCategory: '',
      filter_type:'',
      filter_category :'',
      filter_account : '',
      startDate : '',
      endDate : ''
    }
  }

  componentDidMount = () =>{
    this.getAccountBalanceData()
    
  }

  getAccountBalanceData = () => {
    this.props.accountBalanceData.getAccountBalanceReport();
    this.props.accountBalanceData.getTransactionTypeList();
    this.props.accountBalanceData.getTransactionCategoryList();
    this.props.accountBalanceData.getAccountTypeList();
  }


  changeType = (selectedType) => {
    this.setState({ selectedType })
  }

  changeCategory = (selectedCategory) => {
    this.setState({ selectedCategory })
  }


  getSelectedData = () => {
    const postObj = {
      filter_type : this.state.filter_type !== '' ?  this.state.filter_type : "",
      filter_category : this.state.filter_category !== '' ?  this.state.filter_category : "",
      filter_account :  this.state.filter_account !== '' ?  this.state.filter_account : "",
      startDate :  this.state.startDate !== '' ?  this.state.startDate : "",
      endDate :  this.state.endDate !== '' ?  this.state.endDate : "",
    }
    this.props.accountBalanceData.getAccountBalanceReport(postObj);
  }

  handleChange = (e,picker) => {
    let startingDate = picker ? moment(picker.startDate._d).format('L') : ''
    let endingDate = picker ? moment(picker.endDate._d).format('L') : ''
    this.setState({ startDate : startingDate ,endDate : endingDate })
  }

  render() {
    const account_balance_table = this.props.account_balance_report ?
    this.props.account_balance_report.map(account => ({
      account : account.bankAccount,
      transactionType:account.transactionType,
      transactionDescription : account.transactionDescription,
      transactionCategory : account.transactionCategory,
      transactionAmount : account.transactionAmount,
      transactionDate : moment(account.transactionDate).format('L')

    })) : ""



    const {
      transaction_type_list,
    transaction_category_list ,
    account_type_list
    } = this.props

    
    return (
      <div className="transaction-report-section">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12}>
              <div className="flex-wrap d-flex align-items-start justify-content-between">
                <div className="info-block">
                  <h4>Company Name - <small><i>Transactions</i></small></h4>
                </div>
                <Form onSubmit={this.handleSubmit} name="simpleForm">
                  <div className="flex-wrap d-flex align-items-center">
                    <FormGroup>
                      <ButtonGroup className="mr-3">
                        <Button
                          color="success"
                          className="btn-square"
                          onClick={() => this.table.handleExportCSV()}
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
                    {/* <DateRangePicker>
                      <Input type="text" placeholder="Transaction Date" />
                    </DateRangePicker> */}
                     <DateRangePicker   id="transaction_date"
                                        name="transaction_date" 
                                        // onChange={option => this.handleChange('payment_date')(option)}
                                       
                                        onApply={ this.handleChange}
                                        >
                      <Input type="text"  value={this.state.startDate }
                                        selected={this.state.startDate} placeholder="Transaction Date"/>
                                       
                    </DateRangePicker>
                  </Col>
                 
                  <Col lg={2} className="mb-1">
                    <Select
                      className=""
                      options={account_type_list ? selectOptionsFactory.renderOptions('name', 'id', account_type_list) : []}
                      // options={colourOptions}
                      value={this.state.filter_account}
                      placeholder="Account"
                      onChange={option => this.setState({
                        filter_account: option
                      })}
                    />
                  </Col>
                  <Col lg={2} className="mb-1">
                    <Select
                      className=""
                      // options={colourOptions}
                      options={transaction_type_list ? selectOptionsFactory.renderOptions('transactionTypeName', 'transactionTypeCode', transaction_type_list) : []}
                      value={this.state.filter_type}
                      placeholder="Transaction Type"
                      onChange={option => this.setState({
                        filter_type: option
                      })}
                    />
                  </Col>
                  <Col lg={2} className="mb-1">
                    <Select
                      className=""
                      options={transaction_category_list ? selectOptionsFactory.renderOptions('transactionCategoryName', 'transactionCategoryId', transaction_category_list) : []}
                      // options={colourOptions}
                      value={this.state.filter_category}
                      placeholder="Transaction Category"
                      onChange={option => this.setState({
                        filter_category: option
                      })}
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
                  data={account_balance_table} 
                  hover
                  pagination={account_balance_table && account_balance_table.length > 0 ? true : false}
                  fetchInfo={{ dataTotalSize: account_balance_table.count ? account_balance_table.count : 0 }}
                  csvFileName="account_balance_table.csv"
                  ref={node => {
                    this.table = node
                  }}
                  version="4"
                >
                  <TableHeaderColumn
                    isKey
                    dataField="transactionDate"
                    dataSort
                    tdAttr={ {'colSpan': '15' } }
                  >
                    Transaction Date
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="account"
                    dataSort
                  >
                    Account
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="transactionType"
                    dataSort
                  >
                    Transaction Type
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="transactionCategory"
                    dataSort
                  >
                    Transaction Category
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="transactionDescription"
                    dataSort
                  >
                    Transaction Description
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="transactionAmount"
                    dataSort
                  >
                    Transaction Amount
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountBalances)
