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
  ButtonGroup
} from 'reactstrap'
import { toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import './style.scss'

import * as VatActions from './actions'
import {
  CommonActions
} from 'services/global'

const mapStateToProps = (state) => {
  return ({
    vat_list: state.vat.vat_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    vatActions: bindActionCreators(VatActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class VatCode extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openDeleteModal: false,
      loading: true,
      selectedRows: [],
      filterData: {
        name: '',
        vatPercentage: ''
      }
    }

    this.options = {
      onRowClick: this.goToDetail,
      paginationPosition: 'top',
      page: 1,
      sizePerPage: 10,
      onSizePerPageList: this.onSizePerPageList,
      onPageChange: this.onPageChange,
    }

    this.selectRowProp = {
      mode: 'checkbox',
      bgColor: 'rgba(0,0,0, 0.05)',
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }
  }

  componentDidMount() {
    this.initializeData();
  }

  initializeData() {
    let { filterData } = this.state
    const data = {
      pageNo: this.options.page ? this.options.page - 1 : 0,
      pageSize: this.options.sizePerPage ? this.options.sizePerPage : 10
    }
    filterData = { ...filterData, ...data }
    this.props.vatActions.getVatList(filterData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch((err) => {
      this.setState({
        loading: false
      })
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  onRowSelect = (row, isSelected) => {
    if (isSelected) {
      this.state.selectedRows.push(row.id)
      this.setState({
        selectedRows: this.state.selectedRows
      })
    }
    else
      this.setState({
        selectedRows: this.state.selectedRows.filter(el => el !== row.id)
      })
  }

  onSelectAll = (isSelected, rows) => {
    this.setState({
      selectedRows: isSelected ? rows.map(row => row.id) : []
    })
  }

  // -------------------------
  // Data Table Custom Fields
  //--------------------------

  vatPercentageFormat = (cell, row) => {
    return (`${row.vat} %`)
  }

  goToDetail = (row) => {
    this.props.history.push('/admin/master/vat-code/detail', { id: row.id })
  }

  // Show Success Toast
  success = () => {
    return toast.success('Vat Code Deleted Successfully... ', {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  onSizePerPageList = (sizePerPage) => {
    if (this.options.sizePerPage !== sizePerPage) {
      this.options.sizePerPage = sizePerPage
      this.initializeData()
    }
  }

  onPageChange = (page) => {
    if (this.options.page !== page) {
      this.options.page = page
      this.initializeData()
    }
  }

  // -------------------------
  // Actions
  //--------------------------

  // Delete Vat By ID
  bulkDelete = () => {
    const {
      selectedRows
    } = this.state
    if (selectedRows.length > 0) {
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

  removeBulk = () => {
    let { selectedRows } = this.state;
    const { vat_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.removeDialog()
    this.props.vatActions.deleteVat(obj).then((res) => {
      this.initializeData();
      this.props.commonActions.tostifyAlert('success', 'Vat Deleted Successfully')
      if (vat_list && vat_list.data && vat_list.data.length > 0) {
        this.setState({
          selectedRows: []
        })
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog = () => {
    this.setState({
      dialog: null
    })
  }

  handleChange = (val, name) => {
    this.setState({
      filterData: Object.assign(this.state.filterData, {
        [name]: val
      })
    })
  }

  handleSearch = () => {
    this.initializeData();
  }

  render() {
    const { loading, selectedRows, dialog } = this.state
    const { vat_list } = this.props

    return (
      <div className="vat-code-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <div className="h4 mb-0 d-flex align-items-center">
                <i className="nav-icon icon-briefcase" />
                <span className="ml-2">Vat Code</span>
              </div>
            </CardHeader>
            <CardBody>
              {dialog}
              {
                loading ?
                  <Loader></Loader> :
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex justify-content-end">
                        <ButtonGroup className="toolbar" size="sm">
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
                            onClick={() => this.props.history.push(`/admin/master/vat-code/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                          New Code
                        </Button>
                          <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDelete}
                            disabled={selectedRows.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-trash fa-trash mr-1" />
                          Bulk Delete
                        </Button>
                        </ButtonGroup>
                      </div>
                      <div className="py-3">
                        <h5>Filter : </h5>
                        <Row>
                          <Col lg={4} className="mb-1">
                            <Input type="text" placeholder="Name" onChange={(e) => {
                              e.preventDefault()
                              this.handleChange(e.target.value, 'name')
                            }} />
                          </Col>
                          <Col lg={4} className="mb-1">
                            <Input type="number" placeholder="Vat Percentage" onChange={(e) => {
                              e.preventDefault()
                              this.handleChange(e.target.value, 'vatPercentage')
                            }} />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch}>
                              <i className="fa fa-search"></i>
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <BootstrapTable
                        data={vat_list && vat_list.data && vat_list.data.length > 0 ? vat_list.data : []}
                        hover
                        version="4"
                        pagination={vat_list && vat_list.data && vat_list.data.length > 0 ? true : false}
                        search={false}
                        selectRow={this.selectRowProp}
                        options={this.options}
                        remote
                        fetchInfo={{ dataTotalSize: vat_list.count ? vat_list.count : 0 }}
                        trClassName="cursor-pointer"
                        csvFileName="vat_code.csv"
                        ref={node => {
                          this.table = node
                        }}
                      >
                        <TableHeaderColumn
                          isKey
                          dataField="name"
                          dataSort
                        >
                          Vat Name
                      </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="vat"
                          dataFormat={this.vatPercentageFormat}
                          dataSort
                        >
                          Vat Percentage
                      </TableHeaderColumn>
                      </BootstrapTable>
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

export default connect(mapStateToProps, mapDispatchToProps)(VatCode)
