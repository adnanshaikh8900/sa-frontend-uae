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
  ButtonGroup,
  FormGroup,
  Input,
} from 'reactstrap'
import Select from 'react-select'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Loader, ConfirmDeleteModal } from 'components'


import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { selectOptionsFactory } from 'utils'

import * as ProductActions from './actions'
import {
  CommonActions
} from 'services/global'
import { CSVLink } from "react-csv";


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
      selectedRows: [],
      dialog: null,
      filterData: {
        name: '',
        productCode: '',
        vatPercentage: ''
      },
      selectedVat: '',
      csvData: [],
      view: false
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
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }
    this.csvLink = React.createRef()
  }

  componentDidMount = () => {
    this.props.productActions.getProductVatCategoryList();
    this.initializeData()
  }

  componentWillUnmount = () => {
    this.setState({
      selectedRows: []
    })
  }

  initializeData = () => {
    const { filterData } = this.state
    const paginationData = {
      pageNo: this.options.page ? this.options.page - 1 : 0,
      pageSize: this.options.sizePerPage
    }
    const postData = { ...filterData, ...paginationData }
    this.props.productActions.getProductList(postData).then(res => {
      if (res.status === 200) {
        this.setState({ loading: false })
      }
    }).catch(err => {
      this.setState({ loading: false })
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  goToDetail = (row) => {
    this.props.history.push('/admin/master/product/detail', { id: row.id })
  }

  onRowSelect = (row, isSelected, e) => {
    let temp_list = []
    if (isSelected) {
      temp_list = Object.assign([], this.state.selectedRows)
      temp_list.push(row.id);
    } else {
      this.state.selectedRows.map(item => {
        if (item !== row.id) {
          temp_list.push(item)
        }
        return item
      });
    }
    this.setState({
      selectedRows: temp_list
    })
  }

  onSelectAll = (isSelected, rows) => {
    let temp_list = []
    if (isSelected) {
      rows.map(item => temp_list.push(item.id))
    }
    this.setState({
      selectedRows: temp_list
    })
  }

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
    this.removeDialog()
    let { selectedRows } = this.state;
    const { product_list } = this.props
    let obj = {
      ids: selectedRows
    }
    this.props.productActions.removeBulk(obj).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Product Deleted Successfully')
        this.initializeData();
        if (product_list && product_list.data && product_list.data.length > 0) {
          this.setState({
            selectedRows: []
          })
        }
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

  vatCategoryFormatter = (cell, row) => {
    return row['vatCategory'] !== null ? row['vatCategory']['name'] : ''
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
    // this.setState({})
  }

  onSizePerPageList = (sizePerPage) => {
    if (this.options.sizePerPage !== sizePerPage) {
      this.options.sizePerPage = sizePerPage
      this.initializeData()
    }
  }

  onPageChange = (page, sizePerPage) => {
    if (this.options.page !== page) {
      this.options.page = page
      this.initializeData()
    }
  }
  getCsvData = () => {
       if(this.state.csvData.length === 0) {
      let obj = {
        paginationDisable: true
      }
      this.props.productActions.getProductList(obj).then(res => {
        if (res.status === 200) {
          this.setState({ csvData: res.data.data, view: true }, () => {
            setTimeout(() => {
              this.csvLink.current.link.click()
            }, 0)
          });
        }
      })
    } else {
      this.csvLink.current.link.click()
    }
  }
  render() {

    const { loading, dialog , filterData , selectedRows,csvData,view} = this.state
    const { product_list, vat_list } = this.props


    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          {dialog}
          {/* <ToastContainer position="top-right" autoClose={5000} style={containerStyle} /> */}
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
                            onClick={() => this.getCsvData()}
                          >
                            <i className="fa glyphicon glyphicon-export fa-download mr-1" />Export To CSV
                          </Button>
                           {view && <CSVLink
                            data={csvData}
                            filename={'product.csv'}
                            className="hidden"
                            ref={this.csvLink}
                            target="_blank"
                          />}
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
                            <Col lg={3} className="mb-1">
                              <Input type="text" placeholder="Name" onChange={(e) => { this.handleChange(e.target.value, 'name') }} />
                            </Col>
                            <Col lg={3} className="mb-2">
                              <Input type="text" placeholder="Product Code" onChange={(e) => { this.handleChange(e.target.value, 'productCode') }} />
                            </Col>
                            <Col lg={3} className="mb-1">
                              <FormGroup className="mb-3">
                                <Select
                                  options={vat_list ? selectOptionsFactory.renderOptions('name', 'id', vat_list,'Vat') : []}
                                  className="select-default-width"
                                  placeholder="Vat Percentage"
                                  value={filterData.vatPercentage}
                                  onChange={(option) => {
                                    if(option && option.value) {
                                      this.handleChange(option.value, 'vatPercentage')
                                    } else {
                                      this.handleChange('', 'vatPercentage')
                                    }
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg={2} className="mb-1">
                              <Button type="button" color="primary" className="btn-square" onClick={this.handleSearch}>
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
                          data={product_list && product_list.data ? product_list.data : []}
                          version="4"
                          hover
                          pagination = {product_list && product_list.data && product_list.data.length > 0 ? true : false}    
                          remote
                          fetchInfo={{ dataTotalSize: product_list.count ? product_list.count : 0 }}
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
