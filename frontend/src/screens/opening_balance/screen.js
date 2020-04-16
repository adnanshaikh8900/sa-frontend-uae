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
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
  CommonActions
} from 'services/global'
import * as OpeningBalanceActions from './actions'
import OpeningBalanceModal from './sections/opening_balance_modal'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    bank_account_list: state.opening_balance.bank_account_list,
    currency_list: state.opening_balance.currency_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    openingBalanceActions: bindActionCreators(OpeningBalanceActions, dispatch)
  })
}

class OpeningBalance extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      idCount: 0,
      showOpeningBalanceModal: false,
      selectedRowData: ""
    }
    this.regEx = /^[0-9\d]+$/;

  }

  renderActions = (cell, rows, props) => {
    return (
      <Button
        size="sm"
        className="btn-twitter btn-brand icon"
        disabled={this.state.data.length === 1 ? true : false}
        onClick={(e) => { this.deleteRow(e, rows, props) }}
      >
        <i className="fas fa-trash"></i>
      </Button>
    )
  }

  showOpeningBalanceModal = () => {
    if (this.props.bank_account_list && this.props.currency_list) {
      this.props.openingBalanceActions.getCurrencyList()
      this.props.openingBalanceActions.getBankList()
    }
    this.setState({ showOpeningBalanceModal: true })
  }
  // Cloase Confirm Modal
  closeOpeningBalanceModal = () => {
    this.setState({ showOpeningBalanceModal: false })
  }

  goToDetail = (row) => {
    this.setState({
      selectedRowData: row
    }, () => {
      this.showOpeningBalanceModal()
    })
  }

  resetData = () => {
    if (this.state.selectedRowData) {
      this.setState({
        selectedRowData: ''
      }, () => { this.showOpeningBalanceModal() })
    } else {
      this.showOpeningBalanceModal()
    }
  }

  renderEdit = (cell, row) => {
    return (
      <i className="fas fa-edit" onClick={() => { this.goToDetail(row) }}></i>
    )
  }

  render() {
    const { bank_account_list } = this.props;
    return (
      <div className="opening-balance-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-area-chart" />
                    <span className="ml-2">Opening Balance</span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={12}>
                  <BootstrapTable
                    options={this.options}
                    data={[]}
                    version="4"
                    hover
                    keyField="id"
                    className="invoice-create-table"
                  >
                    {/* <TableHeaderColumn
                      width="55"
                      dataAlign="center"
                      dataFormat={(cell, rows) => this.renderActions(cell, rows)}
                    >
                    </TableHeaderColumn> */}
                    <TableHeaderColumn
                      dataField="accountName"
                    >
                      Account
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="openingBalance"
                    >
                      Opening Balance
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="currency"
                    >
                      Currency
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataFormat={this.renderEdit}
                    >
                    </TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
              <Row>
                <Col lg={12} className="mb-3">
                  <Button color="primary" className={`btn-square mr-3 `} onClick={this.resetData}>
                    <i className="fa fa-plus"></i> Add More
                </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <OpeningBalanceModal
            showOpeningBalanceModal={this.state.showOpeningBalanceModal}
            closeOpeningBalanceModal={this.closeOpeningBalanceModal}
            bankAccountList={bank_account_list}
            createOpeningBalance={this.props.openingBalanceActions.createOpeningBalance}
            selectedRowData={this.state.selectedRowData}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpeningBalance)
