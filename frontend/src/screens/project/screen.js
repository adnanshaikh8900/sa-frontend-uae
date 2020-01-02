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

import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as ProjectActions from './actions'
import {
  CommonActions
} from 'services/global'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    project_list: state.project.project_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    projectActions: bindActionCreators(ProjectActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)

  })
}

class Project extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      selectedRows: [],
      dialog: false,
      filterData: {
        projectName: '',
        vatRegistrationNumber: '',
        expenseBudget: '',
        revenueBudget: '',
      }
    }

    this.initializeData = this.initializeData.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.currencyFormatter = this.currencyFormatter.bind(this)
    this.contactFormatter = this.contactFormatter.bind(this)
    this.bulkDelete = this.bulkDelete.bind(this)
    this.removeBulk = this.removeBulk.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.onPageChange = this.onPageChange.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this)

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
      clickToSelect: false,
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
      pageNo: this.options.page,
      pageSize: this.options.sizePerPage
    }
    filterData = { ...filterData, ...data }
    console.log(data)
    this.props.projectActions.getProjectList(filterData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch((err) => {
      this.setState({
        loading: false
      })
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  goToDetail(row) {
    this.props.history.push(`/admin/master/project/detail`, { id: row.projectId })
  }

  onPageChange = (page, sizePerPage) => {
    this.options.page = page
  }

  onSizePerPageList = (sizePerPage) => {
    this.options.sizePerPage = sizePerPage
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selectedRows)
      temp_list.push(row.projectId);
    } else {
      this.state.selectedRows.map(item => {
        if (item !== row.projectId) {
          temp_list.push(item)
        }
      });
    }
    this.setState({
      selectedRows: temp_list
    })
  }
  onSelectAll(isSelected, rows) {
    let temp_list = []
    if (isSelected) {
      rows.map(item => {
        temp_list.push(item.projectId)
      })
    }
    this.setState({
      selectedRows: temp_list
    })
  }

  bulkDelete() {
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

  removeBulk() {
    const { filterData } = this.state;
    let { selectedRows } = this.state;
    const { project_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.removeDialog()
    this.props.projectActions.removeBulk(obj).then((res) => {
      this.initializeData();
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (project_list && project_list.length > 0) {
        this.setState({
          selectedRows: []
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

  handleChange(val, name) {
    this.setState({
      filterData: Object.assign(this.state.filterData, {
        [name]: val
      })
    })
  }

  handleSearch() {
    this.initializeData();
  }

  contactFormatter(cell, row) {
    return row['contact'] ? row['contact']['firstName'] : '';
  }

  currencyFormatter(cell, row) {
    return row['currency'] ? row['currency']['currencyName'] : '';
  }


  render() {
    const { loading, dialog,selectedRows} = this.state
    const { project_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
          {dialog}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-project-diagram" />
                    <span className="ml-2">Projects</span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {
                loading ?
                  <Loader></Loader> :
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex justify-content-end">
                        <ButtonGroup size="sm">
                          <Button
                            color="success"
                            className="btn-square"
                            onClick={() => this.table.handleExportCSV()}
                            disabled={project_list.length === 0}

                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/master/project/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Project
                          </Button>
                          <Button
                            type="button"
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
                        <form>
                          <Row>
                            <Col lg={2} className="mb-1">
                              <Input type="text" placeholder="Project Name" onChange={(e) => { this.handleChange(e.target.value, 'projectName') }} />
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Input type="text" placeholder="Expense Budget" onChange={(e) => { this.handleChange(e.target.value, 'expenseBudget') }} />
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Input type="text" placeholder="Revenue Budget" onChange={(e) => { this.handleChange(e.target.value, 'revenueBudget') }} />
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Input type="text" placeholder="VAT Number" onChange={(e) => { this.handleChange(e.target.value, 'vatRegistrationNumber') }} />
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch} disabled={project_list.length === 0}>
                                <i className="fa fa-search"></i>
                            </Button>
                            </Col>
                          </Row>
                        </form>
                      </div>
                      <div>
                        <BootstrapTable
                          selectRow={this.selectRowProp}
                          search={false}
                          options={this.options}
                          data={project_list ? project_list : []}
                          version="4"
                          hover
                          keyField="projectId"
                          pagination
                          totalSize={project_list ? project_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                          csvFileName="project.csv"
                          ref={node => {
                            this.table = node
                          }}
                        >
                          <TableHeaderColumn
                            dataField="projectName"
                            dataSort
                          >
                            Project Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="expenseBudget"
                            dataSort
                          >
                            Expense Budget
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="revenueBudget"
                            dataSort
                          >
                            Revenue Budget
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="vatRegistrationNumber"
                            dataSort
                          >
                            Vat Registration Number
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

export default connect(mapStateToProps, mapDispatchToProps)(Project)
