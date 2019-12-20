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
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import Select from 'react-select'

import { Formik } from 'formik';
import * as Yup from "yup";

import _ from 'lodash'

import './style.scss'

import * as ProductActions from '../../actions'

import { WareHouseModal } from '../../sections'

import { Loader } from 'components'
import { selectOptionsFactory } from 'utils'
import * as DetailProductActions from './actions'


const mapStateToProps = (state) => {
  return ({
    vat_list: state.product.vat_list,
    product_warehouse_list: state.product.product_warehouse_list,
    product_parent_list: state.product.product_parent_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    productActions: bindActionCreators(ProductActions, dispatch),
    detailProductActions: bindActionCreators(DetailProductActions, dispatch)
  })
}

class DetailProduct extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      initValue: {},
      currentData: {}
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const id = this.props.location.state.id
    if (this.props.location.state && id) {
      // this.props.productActions.getVatList();
      this.props.productActions.getParentProductList();
      this.props.productActions.getProductVatCategoryList();
      this.props.productActions.getProductWareHouseList()
      // this.setState({
      // }, () => {
      this.props.detailProductActions.getProductById(id).then(res => {
        if (res.status === 200) {
          this.setState({
            loading: false,
            initValue: {
              productName: res.data.productName,
              productDescription: res.data.productDescription,
              productCode: res.data.productCode,
              vatCategoryId: res.data.vatCategoryId ? {
                label: res.data.vatCategoryId.name,
                value: res.data.vatCategoryId.id
              } : null,
              unitPrice: res.data.unitPrice,
              parentProductId: res.data.parentProductId ? {
                label: res.data.parentProductId.productID,
                value: res.data.parentProductId.productName
              } : null,
              productWarehouseId: res.data.productWarehouseId ? {
                label: res.data.productWarehouseId.warehouseName,
                value: res.data.productWarehouseId.warehouseId
              } : null,
              vatIncluded: res.data.vatIncluded
            }
          })
        } else { this.props.history.push('/admin/master/product') }
      })
      // })
    } else {
      this.props.history.push('/admin/master/product')
    }
  }

  handleChange(e, name) {
    this.setState({
      currentData: _.set(
        { ...this.state.currentData },
        e.target.name && e.target.name !== '' ? e.target.name : name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      )
    })
  }

  handleSubmit(data) {
    const id = this.props.location.state.id
    const { 
      productName , 
      productDescription , 
      productCode ,
      vatCategoryId,
      unitPrice,
      parentProductId,
      productWarehouseId,
      vatIncluded,
    } = data
    const postData = {
      productId: id,
      productName : productName,
      productDescription: productDescription, 
      productCode: productCode,
      vatCategoryId: vatCategoryId,
      unitPrice: unitPrice,
      parentProductId: parentProductId,
      productWarehouseId: productWarehouseId,
      vatIncluded: vatIncluded,
    }
    this.props.detailProductActions.updateProduct(postData).then(res => {
      if (res.status === 200) {
        this.success()
      }
    }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null);
    })
  }

  render() {

    const { vat_list, product_parent_list, product_warehouse_list } = this.props
    const { loading } = this.state

    return (
      <div className="detail-product-screen">
        <div className="animated fadeIn">
        {loading ? (
            <Loader></Loader>
          ) : (
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fas fa-object-group" />
                        <span className="ml-2">Update Product</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={this.state.initValue}
                        onSubmit={(values, { resetForm }) => {

                          this.handleSubmit(values)
                          resetForm(this.state.initValue)

                          this.setState({
                            selectedWareHouse: null,
                            selectedParentProduct: null,
                            selectedVatCategory: null,
                          })
                        }}
                        validationSchema={Yup.object().shape({
                          productName: Yup.string()
                            .required("Product Name is Required"),
                          vatCategory: Yup.string()
                            .required("Vat Category is Required"),
                        })}>
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="productName">
                                    <span className="text-danger">*</span>Name
                                    </Label>
                                  <Input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    onChange={props.handleChange}
                                    defaultValue={props.values.productName}
                                    placeholder="Enter Product Name"
                                    className={
                                      props.errors.productName && props.touched.productName
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.productName && props.touched.productName && (
                                    <div className="invalid-feedback">{props.errors.productName}</div>
                                  )}
                                </FormGroup>
                              </Col>

                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="productCode">Product Code</Label>
                                  <Input
                                    type="text"
                                    id="productCode"
                                    name="productCode"
                                    onChange={props.handleChange}
                                    defaultValue={props.values.productCode}
                                    placeholder="Enter Product Code"
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="parentProductId">Parent Product</Label>
                                  <Select
                                    className="select-default-width"
                                    options={selectOptionsFactory.renderOptions('productName', 'productID', product_parent_list)}
                                    id="parentProductId"
                                    name="parentProductId"
                                    value={props.values.parentProductId}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedParentProduct: option.value
                                      })
                                      props.handleChange("parentProductId")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>

                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="unitPrice">Product Price</Label>
                                  <Input
                                    type="text"
                                    id="unitPrice"
                                    name="unitPrice"
                                    placeholder="Enter Product Price"
                                    onChange={props.handleChange}
                                    defaultValue={props.values.unitPrice}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="vatCategoryId"><span className="text-danger">*</span>Vat Percentage</Label>
                                  <Select
                                    className="select-default-width"
                                    options={vat_list ? selectOptionsFactory.renderOptions('name', 'id', vat_list) : []}
                                    id="vatCategoryId"
                                    name="vatCategoryId"
                                    value={props.values.vatCategoryId.value}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedVatCategory: option.value
                                      })
                                      props.handleChange("vatCategoryId")(option.value);
                                    }}
                                    className={
                                      props.errors.vatCategoryId && props.touched.vatCategoryId
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.vatCategoryId && props.touched.vatCategoryId && (
                                    <div className="invalid-feedback">{props.errors.vatCategoryId}</div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12}>
                                <FormGroup check inline className="mb-3">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="vatIncluded"
                                    name="vatIncluded"
                                    onChange={props.handleChange}
                                    defaultChecked={props.values.vatIncluded}
                                  />
                                  <Label className="form-check-label" check htmlFor="vatIncluded">Vat Include</Label>
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="productWarehouseId">Warehourse</Label>
                                  <Select
                                    className="select-default-width"
                                    options={selectOptionsFactory.renderOptions('warehouseName', 'warehouseId', product_warehouse_list)}
                                    id="productWarehouseId"
                                    name="productWarehouseId"
                                    value={props.values.productWarehouseId.value}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedWareHouse: option.value
                                      })
                                      props.handleChange("productWarehouseId")(option.value);
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="text-right">
                                  <Button color="primary" type="button" className="btn-square"
                                    onClick={this.showWarehouseModal}>
                                    <i className="fa fa-plus"></i> Add a Warehouse
                                    </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <FormGroup className="">
                                  <Label htmlFor="description">Description</Label>
                                  <Input
                                    type="textarea"
                                    name="productDescription"
                                    id="productDescription"
                                    rows="6"
                                    placeholder="Description..."
                                    onChange={props.handleChange}
                                    defaultValue={props.values.productDescription}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
                                  {/* <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-repeat"></i> Create and More
                                    </Button> */}
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/master/product') }}>
                                    <i className="fa fa-ban"></i> Cancel
                                    </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
