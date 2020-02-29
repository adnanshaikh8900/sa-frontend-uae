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
  FormGroup,
  Label,
  Form,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'

import _ from "lodash"
import Select from 'react-select'
import { DateRangePicker2 } from 'components'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'



import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-select/dist/react-select.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
  })
}


class DetailedGeneralLedgerReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }

    this.toggle = this.toggle.bind(this)
    this.tempdata = [{
      status: 'paid',
      transactionCategoryId: 2,
      transactionCategoryCode: 2,
      referenceNumber: 'temp',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }, {
      status: 'paid',
      transactionCategoryId: 1,
      transactionCategoryCode: 4,
      referenceNumber: 'temp',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }, {
      status: 'paid',
      transactionCategoryId: 1,
      transactionCategoryCode: 4,
      referenceNumber: 'temp',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }, {
      status: 'unpaid',
      transactionCategoryId: 1,
      transactionCategoryCode: 4,
      referenceNumber: '101',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }, {
      status: 'unpaid',
      transactionCategoryId: 1,
      transactionCategoryCode: 4,
      referenceNumber: '102',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }, {
      status: 'paid',
      transactionCategoryId: 1,
      transactionCategoryCode: 4,
      referenceNumber: '103',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }, {
      status: 'unpaid',
      transactionCategoryId: 1,
      transactionCategoryCode: 4,
      transactionCategoryName: '104',
      transactionCategoryDescription: 'temp',
      contactName: 'Loream Ipsume',
      transactionType: 'TEMP'
    }]
  }


  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray
    })
  }

  render() {
    return (
      <div className="transactions-report-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-exchange-alt" />
                    <span className="ml-2">Detailed General Ledger Report</span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <p>SimpleVat Solutions Pvt Ltd<br style={{marginBottom: '5px'}}/>
                Detailed General Ledger<br style={{marginBottom: '5px'}}/>
                Basis: Accrual<br style={{marginBottom: '5px'}}/>
                From 01/02/2020 To 29/02/2020
                </p>
              </div>
              <div className="table-wrapper">
                <BootstrapTable
                  data={this.tempdata}
                  hover
                  pagination
                  version="4"
                >
                  <TableHeaderColumn
                    width="130"
                    dataField="status"
                    dataFormat={this.getInvoiceStatus}
                    row="0"
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
                  {/* <TableHeaderColumn
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
                  </TableHeaderColumn> */}
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
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedGeneralLedgerReport)
