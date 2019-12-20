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
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'

import { Loader, ConfirmDeleteModal } from 'components'


import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as ContactActions from './actions'
import {
  CommonActions
} from 'services/global'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    contact_list: state.contact.contact_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    contactActions: bindActionCreators(ContactActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}

class Contact extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      clickedRow: {},
      selected_id_list: [],
      dialog: null,
    }

    this.initializeData = this.initializeData.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.typeFormatter = this.typeFormatter.bind(this);
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

  componentDidMount() {
    this.initializeData()
  }

  componentWillUnmount() {
    this.setState({
      selected_id_list: []
    })
  }

  initializeData() {
    this.props.contactActions.getContactList().then(res => {
      console.log(res)
      if (res.status === 200) {
        this.setState({ loading: false });
        console.log(this.props)
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null);
      this.setState({ loading: false })
    })
  }

  typeFormatter(cell, row) {
    return row['contactType'].name;
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selected_id_list)
      temp_list.push(row.contactId);
    } else {
      this.state.selected_id_list.map(item => {
        if (item !== row.contactId) {
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
        temp_list.push(item.contactId)
      })
    }
    this.setState({
      selected_id_list: temp_list
    })
  }

  goToDetail(row) {
    this.props.history.push('/admin/master/contact/detail',{id: row.contactId})
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
    const { contact_list } = this.props
    let obj = {
      ids: selected_id_list
    }
    this.props.contactActions.removeBulk(obj).then(() => {
      this.props.contactActions.getContactList()
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (contact_list && contact_list.length > 0) {
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


  render() {

    const { loading,dialog } = this.state
    const { contact_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="contact-screen">
        <div className="animated fadeIn">
          {dialog}
          <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon fas fa-id-card-alt" />
                    <span className="ml-2">Contact</span>
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
                            onClick={()=>this.table.handleExportCSV()}

                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />
                            Export to CSV
                          </Button>
                          <Button
                            color="primary"
                            className="btn-square"
                            onClick={() => this.props.history.push(`/admin/master/contact/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Contact
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
                            <Input type="text" placeholder="User Name" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Input type="text" placeholder="Email" />
                          </Col>
                          <Col lg={2} className="mb-1">
                            <Select
                              className=""
                              options={[]}
                              placeholder="User Type"
                            />
                          </Col>
                        </Row>
                      </div>
                      <div>
                        <Row>
                          <Col xs="12" lg="8">
                            <BootstrapTable
                              selectRow={this.selectRowProp}
                              search={false}
                              options={this.options}
                              data={contact_list ? contact_list : ''}
                              version="4"
                              hover
                              pagination
                              totalSize={contact_list ? contact_list.length : 0}
                              className="product-table"
                              trClassName="cursor-pointer"
                              csvFileName="Contact.csv"
                              ref={node => this.table = node}
                            >
                              <TableHeaderColumn
                                isKey
                                dataField="firstName"
                                dataSort
                              >
                                Name
                              </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="email"
                                dataSort
                              >
                                email
                              </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="contactType"
                                dataSort
                                dataFormat={this.typeFormatter}
                              >
                                Type
                              </TableHeaderColumn>
                            </BootstrapTable>
                          </Col>
                          <Col xs="12" lg="4">
                            <div className="contact-info p-4">
                              <h4>Mr. Admin Admin</h4>
                              <hr />
                              <div className="d-flex">
                                <div className="contact-name mr-4">AA</div>
                                <div className="info">
                                  <p><strong>Company: </strong> admin </p>
                                  <p><strong>Email: </strong> admin@admin.com </p>
                                  <p><strong>Tel No: </strong> 1231 </p>
                                  <p><strong>Next Due Date: </strong> 11/01/2019 </p>
                                  <p><strong>Due Amount: </strong> Lek 400 </p>
                                  <p><strong>Contact Type: </strong>Customer </p>
                                </div>

                              </div>
                              <div className="text-right mt-3">
                                <Button
                                  color="primary"
                                  className="btn-square "
                                  onClick={() => this.props.history.push(`/admin/invoice/create`)}
                                >
                                  <i className="fas fa-plus mr-1" />
                                  New Invoice
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact)
