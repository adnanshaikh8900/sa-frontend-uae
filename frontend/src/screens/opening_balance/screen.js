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
  Input,
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
  CommonActions
} from 'services/global'
import * as OpeningBalanceActions from './actions'


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
      data: [{
        id: 0,
        description: '',
        quantity: '',
        unitPrice: '',
        vatCategoryId: '',
        subTotal: 0
      }],
      idCount: 0,
    }
    this.regEx = /^[0-9\d]+$/;

  }

  componentDidMount = () => {
    this.props.openingBalanceActions.getCurrencyList()
    this.props.openingBalanceActions.getBankList()
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

  renderAccount = (cell, row) => {
    let { bank_account_list } = this.props
    // let idx = ''
    bank_account_list = [...bank_account_list,...[{bankAccountId: '',accounName: 'Select Account'}]]
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        // idx = index
      }
      return obj
    });
    return (
      <Input type="select" onChange={(e) => {
        // this.selectItem(e, row, 'bankAccountId')
        // this.formRef.current.props.handleChange(field.name)(e.value)
      }} value={row.bankAccountId}
        className={`form-control `}
      >
        {bank_account_list ? bank_account_list.map((obj) => {
          // obj.name = obj.name === 'default' ? '0' : obj.name
          return <option value={obj.bankAccountId} key={obj.bankAccountId}>{obj.accounName}</option>
        }) : []}
      </Input>
    )
  }

  renderOpeningBalance = (cell, row, props) => {
    // let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        // idx = index
      }
      return obj
    });

    return (

      <Input
        type="text"
        value={row['openingBalance'] !== 0 ? row['openingBalance'] : 0}
        // onChange={(e) => { if (e.target.value === '' || this.regEx.test(e.target.value)) this.selectItem(e, row, 'openingBalance') }}
        placeholder="Opening Balance"
        className={`form-control`}
      />
    )
  }

  renderCurrency = (cell, row, props) => {
    // let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        // idx = index
      }
      return obj
    });

    return 'AED'

      // <Input
      //   type="text"
      //   value={row['currency'] !== 0 ? row['currency'] : 0}
      //   // onChange={(e) => { if (e.target.value === '' || this.regEx.test(e.target.value)) this.selectItem(e, row, 'currency') }}
      //   placeholder="Currency"
      //   className={`form-control`}
      // />
    // )
  }

  addRow = () => {
		const data = [...this.state.data]
		this.setState({
			data: data.concat({
				id: this.state.idCount + 1,
				description: '',
				quantity: '',
				unitPrice: '',
				vatCategoryId: '',
				subTotal: 0
			}), idCount: this.state.idCount + 1
		})
	}

  render() {
    const { data } = this.state
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
                    data={data ? data : []}
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
                      dataField="description"
                      dataFormat={(cell, rows) => this.renderAccount(cell, rows)}
                    >
                      Account
                              </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="quantity"
                      dataFormat={(cell, rows) => this.renderOpeningBalance(cell, rows)}
                    >
                      Opening Balance
                              </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="unitPrice"
                      dataFormat={(cell, rows) => this.renderCurrency(cell, rows)}

                    >
                      Currency
                              </TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
              <Row>
                <Col lg={12} className="mb-3">
                  <Button color="primary" className={`btn-square mr-3 `} onClick={this.addRow} disabled
                  >
                    <i className="fa fa-plus"></i> Add More
                            </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpeningBalance)
