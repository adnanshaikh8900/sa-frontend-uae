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
  Input,
  FormGroup,
  Form,
  ButtonGroup
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import moment from 'moment'
import _ from 'lodash'
import {
  selectOptionsFactory,
  filterFactory
} from 'utils'

import { Loader } from 'components'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import './style.scss'

import * as VatActions from './actions'


const mapStateToProps = (state) => {
  return ({
    vat_list: state.vat.vat_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    vatActions: bindActionCreators(VatActions, dispatch)
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

    this.deleteVat = this.deleteVat.bind(this)
    this.success = this.success.bind(this)
    this.vatPercentageFormat = this.vatPercentageFormat.bind(this)

    this.showConfirmModal = this.showConfirmModal.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.goToDetail = this.goToDetail.bind(this)

    this.onSelectAll = this.onSelectAll.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)

    // this.filterVatList = this.filterVatList.bind(this)
    this.initializeData = this.initializeData.bind(this)
    // this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.onPageChange = this.onPageChange.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this)

    this.options = {
      onRowClick: this.goToDetail,
      paginationPosition: 'top',
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
      pageNo: this.options.page ? this.options.page : 1,
      pageSize: this.options.sizePerPage ? this.options.sizePerPage : 10
    }
    filterData = { ...filterData, ...data }
    this.props.vatActions.getVatList(filterData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    })
  }

  onRowSelect(row, isSelected) {
    if(isSelected) {
      this.state.selectedRows.push(row.id)

      this.setState({
        selectedRows: this.state.selectedRows
      })
    }
    else 
      this.setState({
        selectedRows: this.state.selectedRows.filter(el => el!=row.id)
      })
  }

  onSelectAll(isSelected, rows) {
    this.setState({
      selectedRows: isSelected?rows.map(row => row.id):[]
    }) 
  }

  // -------------------------
  // Data Table Custom Fields
  //--------------------------
  
  vatPercentageFormat(cell, row) {
    return(`${row.vat} %`)
  }

  goToDetail (row) {
    this.props.history.push({
      pathname: '/admin/master/vat-code/detail',
      search: `?id=${row.id}`
    })
  }

  // Show Success Toast
  success() {
    return toast.success('Vat Code Deleted Successfully... ', {
        position: toast.POSITION.TOP_RIGHT
    })
  }

  onPageChange = (page, sizePerPage) => {
    this.options.page = page
  }

  onSizePerPageList = (sizePerPage) => {
    this.options.sizePerPage = sizePerPage
  }

  



  // -------------------------
  // Actions
  //--------------------------

  // Delete Vat By ID
  deleteVat() {
    this.setState({ loading: true })
    this.setState({ openDeleteModal: false })
    this.props.vatActions.deleteVat(this.state.selectedRows).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
        this.initializeData()
      }
    })
  }

  // Open Confirm Modal
  showConfirmModal() {
    this.setState({ openDeleteModal: true })
  }
  // Close Confirm Modal
  closeConfirmModal() {
    this.setState({ openDeleteModal: false })
  }


  // handleFilterChange(e, name) {
  //   this.setState({
  //     filters: _.set(
  //       { ...this.state.filters },
  //       e.target.name && e.target.name !== '' ? e.target.name : name,
  //       e.target.type === 'checkbox' ? e.target.checked : e.target.value
  //     )
  //   })
  // }

  // filterVatList(vat_list) {
  //   const {filters} = this.state

  //   const data = vat_list.filter(item => {
  //     for (var key in filters) {
  //       if (item[key] === undefined || !item[key].toString().includes(filters[key]))
  //         return false;
  //     }
  //     return true;
  //   })

  //   return data
  // }  // }  // }
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

  render() {
    const { loading, selectedRows, filters } = this.state
    const {vat_list} = this.props
   
    // let display_data = this.filterVatList(vatList)

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
            {
              loading ?
                <Loader></Loader>: 
                <Row>
                  <Col lg={12}>
                    <div className="d-flex justify-content-end">
                      <ButtonGroup className="toolbar" size="sm">
                        <Button
                          color="success"
                          className="btn-square"
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
                          onClick={this.showConfirmModal}
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
                        {/* <Col>
                          <Select
                            className=""
                            options={[{'value':'121', label:'11111'}, {value:'222', label:'123131'}]}
                            name="type"
                            placeholder="Account Type"
                            onChange={(val)=> {
                              this.handleFilterChange({target: { name:'type', value: val.value }})
                            }}
                          />
                        </Col> */}
                      </Row>
                    </div>
                    <BootstrapTable 
                      data={vat_list.length > 0 ? vat_list : []}
                      hover
                      version="4"
                      pagination
                      search={false}
                      selectRow={ this.selectRowProp }
                      options={ this.options }
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
          <Modal isOpen={this.state.openDeleteModal}
              className={'modal-danger ' + this.props.className}>
              <ModalHeader toggle={this.toggleDanger}>Delete</ModalHeader>
              <ModalBody>
                  Are you sure want to delete this record?
            </ModalBody>
              <ModalFooter>
                  <Button color="danger" onClick={this.deleteVat}>Yes</Button>&nbsp;
                  <Button color="secondary" onClick={this.closeConfirmModal}>No</Button>
              </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VatCode)
