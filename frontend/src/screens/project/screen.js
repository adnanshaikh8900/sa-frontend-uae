import React from 'react'
import {connect} from 'react-redux'
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

import { Loader , ConfirmDeleteModal } from 'components'

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
      selected_id_list: [],
      dialog: false
    }

    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.currencyFormatter = this.currencyFormatter.bind(this)
    this.contactFormatter = this.contactFormatter.bind(this)
    this.bulkDelete = this.bulkDelete.bind(this);
    this.removeBulk = this.removeBulk.bind(this);
    this.removeDialog = this.removeDialog.bind(this);


    this.options = {
      onRowClick: this.goToDetail,
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

  componentDidMount () {
    this.props.projectActions.getProjectList().then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  goToDetail (row) {
    this.props.history.push(`/admin/master/project/detail`,{id: row.projectId })
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selected_id_list)
      temp_list.push(row.projectId);
    } else {
      this.state.selected_id_list.map(item => {
        if (item !== row.projectId) {
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
        temp_list.push(item.projectId)
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
    const { project_list } = this.props
    let obj = {
      ids: selected_id_list
    }
    this.props.projectActions.removeBulk(obj).then(() => {
      this.props.projectActions.getProjectList()
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if(project_list && project_list.length > 0) {
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

  contactFormatter(cell , row) {
    return row['contact']['firstName'];
  }

  currencyFormatter(cell , row) {
    return row['currency']['currencyName'];
  }

  render() {
    const { loading ,dialog} = this.state
    const { project_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
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
                <Loader></Loader>: 
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex justify-content-end">
                        <ButtonGroup size="sm">
                          <Button
                            color="success"
                            className="btn-square"
                            onClick={()=>this.table.handleExportCSV()}
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
                            <Input type="text" placeholder="Project Name" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Expense Budget" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Revenue Budget" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="VAT Number" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Currency Code" />
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <BootstrapTable
                          selectRow={ this.selectRowProp }
                          search={false}
                          options={ this.options }
                          data={project_list? project_list : []}
                          version="4"
                          hover
                          pagination
                          totalSize={project_list ? project_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="projectName"
                            dataSort
                          >
                            Project Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="projectExpenseBudget"
                            dataSort
                          >
                            Expense Budget
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="projectRevenueBudget"
                            dataSort
                          >
                            Revenue Budget
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="vatRegistrationNumber"
                            dataSort
                          >
                            VAT Number
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="currency"
                            dataSort
                            dataFormat={this.currencyFormatter}
                          >
                            Currency Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="contact"
                            dataSort
                            dataFormat={this.contactFormatter}

                          >
                            Contact Name
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
