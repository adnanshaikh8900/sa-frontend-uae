import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  ButtonGroup,
  Form,
  FormGroup,
  Input
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import Select from 'react-select'

import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as ChartAccountActions from './actions'
import {
  CommonActions
} from 'services/global'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    transaction_category_list: state.chart_account.transaction_category_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    chartOfAccountActions: bindActionCreators(ChartAccountActions, dispatch)
  })
}

class ChartAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      selected_id_list: [],
      dialog: null,

    }

    this.initializeData = this.initializeData.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetailPage = this.goToDetailPage.bind(this)
    this.goToCreatePage = this.goToCreatePage.bind(this)
    this.typeFormatter = this.typeFormatter.bind(this);
    this.bulkDelete = this.bulkDelete.bind(this);
    this.removeBulk = this.removeBulk.bind(this);
    this.removeDialog = this.removeDialog.bind(this);

    this.options = {
      onRowClick: this.goToDetailPage,
      paginationPosition: 'top'
    }

    this.selectRowProp = {
      mode: 'checkbox',
      bgColor: 'rgba(0,0,0, 0.05)',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }

  }

  componentDidMount() {
    this.initializeData()
  }

  componentWillUnmount() {
    this.setState({
      selected_id_list: []
    })
  }

  initializeData() {
    this.props.chartOfAccountActions.getTransactionCategoryList().then(res => {
      if (res.status === 200) {
        this.setState({ loading: false });
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null);
      this.setState({ loading: false })
    })
  }

  goToDetailPage(row) {
    this.props.history.push(`/admin/master/chart-account/detail`, { id: row.transactionCategoryId })
  }

  goToCreatePage() {
    this.props.history.push('/admin/master/chart-account/create')
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selected_id_list)
      temp_list.push(row.transactionCategoryId);
    } else {
      this.state.selected_id_list.map(item => {
        if (item !== row.transactionCategoryId) {
          temp_list.push(item)
        }
      });
    }
    this.setState({
      selected_id_list: temp_list
    })
  }
  onSelectAll(isSelected, rows) {
    let temp_list = []
    if (isSelected) {
      rows.map(item => {
        temp_list.push(item.transactionCategoryId)
      })
    }
    this.setState({
      selected_id_list: temp_list
    })
  }

  bulkDelete() {
    const {
      selected_id_list
    } = this.state
    if (selected_id_list.length > 0) {
      this.setState({
        dialog: <ConfirmDeleteModal
          isOpen={true}
          okHandler={this.removeBulk}
          cancelHandler={this.removeDialog}
        />
      })
    } else {
      this.props.commonActions.tostifyAlert('info', 'Please select the rows of the table and try again.')
    }
  }

  removeBulk() {
    this.removeDialog()
    let { selected_id_list } = this.state;
    const { transaction_category_list } = this.props
    let obj = {
      ids: selected_id_list
    }
    this.props.chartOfAccountActions.removeBulk(obj).then(() => {
      this.props.chartOfAccountActions.getTransactionCategoryList()
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (transaction_category_list && transaction_category_list.length > 0) {
        this.setState({
          selected_id_list: []
        })
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }

  typeFormatter(cell, row) {
    return row['transactionType']['transactionTypeName'];

  }

  render() {

    const { loading, dialog } = this.state
    const { transaction_category_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="chart-account-screen">
        <div className="animated fadeIn">
          {dialog}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-area-chart" />
                    <span className="ml-2">Chart of Accounts</span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                  :
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex justify-content-end">
                        <ButtonGroup size="sm">
                          <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.table.handleExportCSV()}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={this.goToCreatePage}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Account
                          </Button>
                          <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDelete}
                          >
                            <i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
                            Bulk Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                      <div className="py-3">
                        <h5>Filter : </h5>
                        <Row>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Code" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Account" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Select
                              className=""
                              options={[]}
                              placeholder="Account Type"
                            />
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <BootstrapTable
                          selectRow={this.selectRowProp}
                          search={false}
                          options={this.options}
                          data={transaction_category_list ? transaction_category_list : []}
                          version="4"
                          hover
                          pagination
                          totalSize={transaction_category_list ? transaction_category_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                          csvFileName="Chart_Of_Account.csv"
                          ref={node => this.table = node}

                        >
                          <TableHeaderColumn
                            isKey
                            dataField="transactionCategoryCode"
                            dataSort
                          >
                            Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="transactionCategoryName"
                            dataSort
                          >
                            Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="transactionType"
                            dataSort
                            dataFormat={this.typeFormatter}
                          >
                            Type
                          </TableHeaderColumn>
                        </BootstrapTable>
                      </div>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartAccount)
