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
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'

import { Loader, ConfirmDeleteModal } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'bootstrap-daterangepicker/daterangepicker.css'

import * as JournalActions from './actions'
import {
  CommonActions
} from 'services/global'

import moment from 'moment'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    journal_list: state.journal.journal_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    journalActions: bindActionCreators(JournalActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
 
  })
}

class Journal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      actionButtons: {},
      dialog: null,
      selectedRows: [],
      filterData: {
        journalDate: '',
        referenceCode: '',
        description: ''
      }
    }

    this.initializeData = this.initializeData.bind(this)
    this.renderDate = this.renderDate.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.bulkDeleteJournal = this.bulkDeleteJournal.bind(this);
    this.removeBulkJournal = this.removeBulkJournal.bind(this);
    this.removeDialog = this.removeDialog.bind(this);

    // this.renderActions = this.renderActions.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this);

    this.toggleActionButton = this.toggleActionButton.bind(this)

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

  componentDidMount() {
    this.initializeData()
  }

  componentWillUnmount() {
    this.setState({
      selectedRows: []
    })
  }

  initializeData() {
    const { filterData } = this.state
    const paginationData = {
      pageNo: this.options.page ? this.options.page : 1,
      pageSize: this.options.sizePerPage ? this.options.sizePerPage : 10
    }
    const postData = { ...filterData, ...paginationData }
    this.props.journalActions.getJournalList(postData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch(err => {
      this.setState({ loading: false })
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  // renderStatus (cell, row) {
  //   let label = ''
  //   let class_name = ''
  //   if (row.transactionCategoryCode === 4) {
  //     label = 'New'
  //     class_name = 'badge-danger'
  //   } else {
  //     label = 'Posted'
  //     class_name = 'badge-success'
  //   }
  //   return (
  //     <span className={`badge ${class_name} mb-0`}>{ label }</span>
  //   )
  // }

  // renderJournalNumber (cell, row) {
  //   return (
  //     <label
  //       className="mb-0 my-link"
  //       onClick={() => this.props.history.push('/admin/accountant/journal/detail')}
  //     >
  //       { row.transactionCategoryCode }3443543
  //     </label>
  //   )
  // }

  // renderActions (cell, row) {
  //   return (
  //     <div>
  //       <ButtonDropdown
  //         isOpen={this.state.actionButtons[row.transactionCategoryCode]}
  //         toggle={() => this.toggleActionButton(row.transactionCategoryCode)}
  //       >
  //         <DropdownToggle size="sm" color="primary" className="btn-brand icon">
  //           {
  //             this.state.actionButtons[row.transactionCategoryCode] === true ?
  //               <i className="fas fa-chevron-up" />
  //             :
  //               <i className="fas fa-chevron-down" />
  //           }
  //         </DropdownToggle>
  //         <DropdownMenu right>
  //           <DropdownItem onClick={() => this.props.history.push('/admin/accountant/journal/detail')}>
  //             <i className="fas fa-edit" /> Edit
  //           </DropdownItem>
  //           <DropdownItem>
  //             <i className="fas fa-file" /> Post
  //           </DropdownItem>
  //           <DropdownItem>
  //             <i className="fa fa-trash" /> Cancel
  //           </DropdownItem>
  //         </DropdownMenu>
  //       </ButtonDropdown>
  //     </div>
  //   )
  // }

  toggleActionButton(index) {
    let temp = Object.assign({}, this.state.actionButtons)
    if (temp[index]) {
      temp[index] = false
    } else {
      temp[index] = true
    }
    this.setState({
      actionButtons: temp
    })
  }


  goToDetail(row) {
    this.props.history.push('/admin/accountant/journal/detail', { id: row['id'] })
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selectedRows)
      temp_list.push(row.journalId);
    } else {
      this.state.selectedRows.map(item => {
        if (item !== row.journalId) {
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
        temp_list.push(item.journalId)
      })
    }
    this.setState({
      selectedRows: temp_list
    })
  }

  renderDate(cell, rows) {
    return moment(rows.journalDate).format('DD-MM-YYYY')
  }

  handleChange(val, name) {
    this.setState({
      filterData: Object.assign(this.state.filterData, {
        [name]: val
      })
    })
  }

  handleSearch() {
    this.initializeData()
  }

  bulkDeleteJournal() {
    const {
      selectedRows
    } = this.state
    if (selectedRows.length > 0) {
      this.setState({
        dialog: <ConfirmDeleteModal
          isOpen={true}
          okHandler={this.removeBulkJournal}
          cancelHandler={this.removeDialog}
        />
      })
    } else {
      this.props.commonActions.tostifyAlert('info', 'Please select the rows of the table and try again.')
    }
  }

  removeBulkJournal() {
    this.removeDialog()
    let { selectedRows } = this.state;
    const { journal_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.journalActions.removeBulkJournal(obj).then((res) => {
      if(res.status == 200) {
        this.initializeData()
        this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
        if (journal_list && journal_list.length > 0) {
          this.setState({
            selectedRows: []
          })
        }
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

  render() {

    const { loading,
      dialog,
      filterData ,
      selectedRows
    } = this.state
    const { journal_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="journal-screen">
        <div className="animated fadeIn">
          <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
          {dialog}
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="fa fa-diamond" />
                    <span className="ml-2">Journal</span>
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
                            disabled={journal_list.length === 0}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/accountant/journal/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Journal
                          </Button>
                          <Button
                            color="warning"
                            className="btn-square"
                            onClick={this.bulkDeleteJournal}
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
                          <Col lg={2} className="mb-1">
                            <DatePicker
                              className="form-control"
                              id="date"
                              name="journalDate"
                              placeholderText="Post Date"
                              selected={filterData.journalDate}
                              onChange={(value) => {
                                this.handleChange(value, "journalDate")
                              }}
                            />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder=" Reference Number" onChange={(e) => { this.handleChange(e.target.value, 'referenceCode') }} />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Description" onChange={(e) => { this.handleChange(e.target.value, 'description') }} />
                          </Col>
                          <Col lg={1} className="mb-1">
                            <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch} disabled={journal_list.length === 0}>
                              <i className="fa fa-search"></i>
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <BootstrapTable
                          selectRow={this.selectRowProp}
                          search={false}
                          options={this.options}
                          data={journal_list}
                          version="4"
                          hover
                          keyField="journalId"
                          pagination
                          totalSize={journal_list ? journal_list.length : 0}
                          className="journal-table"
                        >
                          <TableHeaderColumn
                            dataField="journalDate"
                            dataSort
                            dataFormat={this.renderDate}
                          >
                            POST DATE
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="referenceCode"
                            dataSort
                          >
                            JOURNAL NO.
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="description"
                            dataSort
                          >
                            DESCRIPTION
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="createdByName"
                            dataSort
                          >
                            CREATED BY
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="totalCreditAmount"
                            dataSort
                          >
                            TOTAL CREDIT AMOUNT
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="totalDebitAmount"
                            dataSort
                          >
                            TOTAL DEBIT AMOUNT
                          </TableHeaderColumn>
                          {/* <TableHeaderColumn
                            className="text-right"
                            columnClassName="text-right"
                            width="55"
                            dataFormat={this.renderActions}
                          >
                          </TableHeaderColumn> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Journal)
