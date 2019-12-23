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
} from 'reactstrap'
import Select from 'react-select'

import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'

import { Loader, ConfirmDeleteModal } from 'components'


import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { selectOptionsFactory } from 'utils'

import * as ProductActions from './actions'
import {
  CommonActions
} from 'services/global'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    product_list: state.product.product_list,
    vat_list: state.product.vat_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    productActions: bindActionCreators(ProductActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class Product extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      selected_id_list: [],
      dialog: null,
      filterData: {
        name: '',
        productCode: '',
        vatPercentage: ''
      },
      selectedVat: ''
    }

    this.initializeData = this.initializeData.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.vatCategoryFormatter = this.vatCategoryFormatter.bind(this);
    this.bulkDelete = this.bulkDelete.bind(this);
    this.removeBulk = this.removeBulk.bind(this);
    this.removeDialog = this.removeDialog.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

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
    this.props.productActions.getProductVatCategoryList();
    const { filterData } = this.state;
    this.props.productActions.getProductList(filterData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch(() => {
      this.setState({
        loading: false
      })
    })
  }

  goToDetail(row) {
    console.log(row)
    this.props.history.push('/admin/master/product/detail', { id: row.id })
  }

  onRowSelect(row, isSelected, e) {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selected_id_list)
      temp_list.push(row.productID);
    } else {
      this.state.selected_id_list.map(item => {
        if (item !== row.productID) {
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
        temp_list.push(item.productID)
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
    const { product_list } = this.props
    let obj = {
      ids: selected_id_list
    }
    this.props.productActions.removeBulk(obj).then(() => {
      this.props.productActions.getProductList()
      this.props.commonActions.tostifyAlert('success', 'Removed Successfully')
      if (product_list && product_list.length > 0) {
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

  vatCategoryFormatter(cell, row) {
    return row['vatCategory'] !== null ? row['vatCategory']['name'] : ''
  }

  handleChange(val, name) {
    this.setState({
     filterData: Object.assign(this.state.filterData,{
      [name]: val
     })
    })
  }

  handleSearch() {
    this.initializeData();
    // this.setState({})
  }

  render() {

    const { loading, dialog } = this.state
    const { product_list, vat_list } = this.props
    const containerStyle = {
      zIndex: 1999
    }

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          {dialog}
          <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="fas fa-object-group" />
                    <span className="ml-2">Products</span>
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
                            onClick={() => this.props.history.push(`/admin/master/product/create`)}
                          >
                            <i className="fas fa-plus mr-1" />
                            New Product
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
                        <form>
                          <Row>
                            <Col lg={3} className="mb-1">
                              <Input type="text" placeholder="Name" onChange={(e) => { this.handleChange(e.target.value, 'name') }} />
                            </Col>
                            <Col lg={3} className="mb-2">
                              <Input type="text" placeholder="Product Code" onChange={(e) => { this.handleChange(e.target.value, 'productCode') }} />
                            </Col>
                            <Col lg={3} className="mb-1">
                              <FormGroup className="mb-3">

                                <Select
                                  options={vat_list ? selectOptionsFactory.renderOptions('name', 'id', vat_list) : []}
                                  onChange={(val) => { 
                                    this.handleChange(val['value'], 'vatPercentage') 
                                    this.setState({'selectedVat': val['value']})
                                  }}
                                  className="select-default-width"
                                  placeholder="Vat Percentage"
                                  value={this.state.selectedVat}
                                />
                              </FormGroup>

                            </Col>
                            <Col lg={2} className="mb-1">
                              <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch}>
                                <i className="fa fa-search"></i> Search
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
                          data={product_list ? product_list : []}
                          version="4"
                          hover
                          pagination
                          totalSize={product_list ? product_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                          csvFileName="product_list.csv"
                          ref={node => this.table = node}
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="name"
                            dataSort
                          >
                            Name
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="productCode"
                            dataSort
                          >
                            Product Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="description"
                            dataSort
                          >
                            Description
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="vatPercentage"
                            dataSort
                            // dataFormat={this.vatCategoryFormatter}
                          >
                            Vat Percentage
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="unitPrice"
                            dataSort
                            // dataFormat={this.vatCategoryFormatter}
                          >
                            Unit Price
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

export default connect(mapStateToProps, mapDispatchToProps)(Product)
