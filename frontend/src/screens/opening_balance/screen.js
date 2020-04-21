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
  Input
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
  CommonActions
} from 'services/global'
import * as OpeningBalanceActions from './actions'
import './style.scss'
import DatePicker from "react-datepicker"
import moment from 'moment'
import Select from "react-select"
import { selectOptionsFactory } from "utils";


const mapStateToProps = (state) => {
  return ({
    transaction_category_list: state.opening_balance.transaction_category_list,
    profile: state.auth.profile
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
      data: [],
      create: false,
      edit: false,
      tempArr: [],
      error: [],
      submitBtnClick: false
    }
    this.regEx = /^[0-9\d]+$/;
    this.selectRowProp = {
      mode: 'checkbox',
      bgColor: 'rgba(0,0,0, 0.05)',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }
  }

  componentDidMount = () => {
    this.props.openingBalanceActions.getTransactionCategoryList()
    this.initializeData()
  }

  initializeData = () => {
    this.props.openingBalanceActions.getOpeningBalanceList().then(res => {
      if(res.status === 200) {
        let tempData = []
        if(res.data.data.length > 0) {
          tempData = res.data.data.map(item => {
            item['id'] = item.transactionCategoryBalanceId
            item['disabled'] = true
            item['transactionCategory'] = {label: item.transactionCategoryName,value: item.transactionCategoryId}
            return item
          })
        }
        this.setState({
          data: tempData
      }, () => {
        let temp = [...this.state.data]
        temp = JSON.parse(JSON.stringify(temp));
        const idCount =
          this.state.data.length > 0
            ? Math.max.apply(
              Math,
              this.state.data.map((item) => {
                return item.id;
              })
            )
            : 0;
        this.setState({
          idCount,
          tempArr: temp
        });
      })
    }
  })
  
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

  renderTransactionCategory = (cell, row) => {
    const { transaction_category_list } = this.props;
    const { submitBtnClick } = this.state
    let value = typeof row.transactionCategory === 'string' ? row.transactionCategory : row.transactionCategory.value
    return (
      <Select
      id="chart_of_account"
      name="chart_of_account_list"
      options={transaction_category_list ? selectOptionsFactory.renderOptions('transactionCategoryName', 'transactionCategoryId', transaction_category_list, 'Chart of Account') : []}
      value={row.transactionCategory}
      isDisabled={row['disabled']}
      menuPosition="fixed"
      maxMenuHeight="250px"
      className={`${value === "" && submitBtnClick ? "is-invalid" : ""} ${row.disabled ? 'selectField' : ''}`}
      isOptionDisabled={(option) => this.checkCategory(option.value)}
      onChange={(option) => {
        this.selectItem(option, row, 'transactionCategory')
      }}
      />
    )
  }

  renderOpeningBalance = (cell, row) => {
    const { submitBtnClick } = this.state
    return (
      <Input
        type="text"
        value={row['openingBalance'] !== '' ? row['openingBalance'] : ''}
        disabled={row['disabled']}
        onChange={(e) => {
          if (e.target.value === '' || this.regEx.test(e.target.value)) { this.selectItem(e, row, 'openingBalance') }
        }}
        placeholder="Opening Balance"
        className={`form-control ${row.openingBalance === "" && submitBtnClick ? "is-invalid" : ""}`}
      />
    )
  }

  renderCurrency = (cell, rows) => {
    return this.props.profile && this.props.profile.company.currencyCode.currencyIsoCode ? this.props.profile.company.currencyCode.currencyIsoCode : ''
  }

  addMore = () => {
    let tempArr = [...this.state.tempArr]
    tempArr = JSON.parse(JSON.stringify(tempArr));
    this.setState({
      data: tempArr
    }, () => {
      const datas = [...this.state.data]
      this.setState({
        data: [{
          id: 0,
          transactionCategory: '',
          openingBalance: '',
          effectiveDate: new Date(),
          create: true
        }].concat(datas)
        , idCount: 0,
        submitBtnClick: false
      })
    })
  }

  selectItem = (e, row, name) => {
    const data = [...this.state.data]
    data.map((obj, index) => {
      if (obj.id === row.id) {
        obj[`${name}`] = name === 'effectiveDate' ? e : (name === 'transactionCategory') ? e : e.target.value;
      }
      return obj
    })
    this.setState({
      data
    })
  }

  renderEdit = (cell, row) => {
    return (
      <div>
        {row['disabled'] ? <Button type="button" color="primary" className="btn-square mr-1" onClick={(e) => { this.enableEdit(row) }}>
          <i className={`fa fa-edit`}></i>
        </Button> : <Button type="button" color="primary" className="btn-square mr-1" onClick={(e) => { this.handleSave(row) }}>
            <i className={`fa fa-save`}></i>
          </Button>}
        {!row['disabled'] && !row['create'] ? (
          <Button type="button" color="secondary" className="btn-square mr-1" onClick={() => { this.refreshRow(row) }}>
            <i className="fa fa-refresh"></i>
          </Button>
        ) : null

        }
      </div>
    )
  }

  enableEdit = (row) => {
    let tempArr = [...this.state.tempArr]
    tempArr = JSON.parse(JSON.stringify(tempArr));
    this.setState({
      data: tempArr
    }, () => {
      const data = this.state.data
      data.map((obj, index) => {
        if (obj.id === row.id) {
          obj[`disabled`] = false;
        }
        return obj
      })
      this.setState({
        data
      })
    })
  }

  validateRow = (row) => {
    let temp = Object.values(row).indexOf("");
    this.setState({
      submitBtnClick: true
    })
    if (temp > -1) {
      return false;
    } else {
      return true;
    }
  }

  handleSave = (row) => {
    let save = true;
    if (this.validateRow(row)) {
      const postData = {
        transactionCategoryId: row.transactionCategory.value,
        openingBalance: row.openingBalance,
        effectiveDate: typeof row.effectiveDate === 'string' ? row.effectiveDate : moment(row.effectiveDate).format('DD/MM/YYYY')
      }
      if(row.transactionCategoryBalanceId) {
        save = false
        postData['transactionCategoryBalanceId'] = row.transactionCategoryBalanceId
      }
      this.props.openingBalanceActions.addOpeningBalance(postData,save).then(res => {
        if (res.status === 200) {
          let text = save ? 'added' : 'updated'
          this.props.commonActions.tostifyAlert("success",`Opening Balance ${text} Successfully.`);
          this.initializeData()
          this.setState({
            submitBtnClick: false
          })
        }
      })
    }
  }

  refreshRow = (row) => {
    let tempArr = [...this.state.tempArr]
    tempArr = JSON.parse(JSON.stringify(tempArr));
    let data = this.state.data
    let idx, temp;
    tempArr.map((obj, index) => {
      if (obj.id === row.id) {
        temp = obj;
        idx = index
      }
      return obj
    })
    data[`${idx}`] = temp
    this.setState({
      data
    })
  }

  renderDate = (cell, row) => {
    return (
      <DatePicker
        id={row['id']}
        name="endDate"
        className={`form-control`}
        placeholderText="Select Date"
        showMonthDropdown
        autoComplete="off"
        disabled={row['disabled']}
        showYearDropdown
        value={typeof row['effectiveDate'] === 'string' ? moment(row['effectiveDate'],'DD/MM/YYYY').format('DD/MM/YYYY') : moment(row['effectiveDate']).format('DD/MM/YYYY')}
        dropdownMode="select"
        dateFormat="dd/MM/yyyy"
        onChange={(val) => {
          this.selectItem(val, row, 'effectiveDate')
        }}
      />
    )
  }

  checkCategory = (id) => {
    const { data } = this.state
    let temp = data.filter(item => item.transactionCategory.value === id)
    if (temp.length > 0) {
      return true
    } else {
      return false
    }
  }

  render() {
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
                <Col lg={12} className="mb-3">
                  <Button color="primary" className={`btn-square mr-3 `} onClick={this.addMore}>
                    <i className="fa fa-plus"></i> Add More
                </Button>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <BootstrapTable
                    options={this.options}
                    data={this.state.data ? this.state.data : []}
                    version="4"
                    hover
                    keyField="id"
                    className="invoice-create-table"
                  >
                    <TableHeaderColumn
                      dataField="accountName"
                      dataFormat={this.renderTransactionCategory}
                      width="25%"
                    >
                      Account
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="openingBalance"
                      dataFormat={this.renderOpeningBalance}
                      width="20%"
                    >
                      Opening Balance
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="effectiveDate"
                      dataFormat={this.renderDate}
                      width="20%"
                    >
                      Effective Date
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="currency"
                      width="15%"
                      dataFormat={this.renderCurrency}
                    >
                      Currency
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataFormat={this.renderEdit}
                    >
                      Actions
                    </TableHeaderColumn>
                  </BootstrapTable>
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
