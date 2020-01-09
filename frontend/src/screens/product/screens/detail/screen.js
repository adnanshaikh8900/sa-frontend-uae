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

import { Loader , ConfirmDeleteModal} from 'components'
import { selectOptionsFactory } from 'utils'
import * as DetailProductActions from './actions'
import {
  CommonActions
} from 'services/global'

const mapStateToProps = (state) => {
  return ({
    vat_list: state.product.vat_list,
    product_warehouse_list: state.product.product_warehouse_list,
    product_category_list: state.product.product_category_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    productActions: bindActionCreators(ProductActions, dispatch),
    detailProductActions: bindActionCreators(DetailProductActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
    
  })
}

class DetailProduct extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      initValue: {},
      currentData: {},
      openWarehouseModal:false,
      dialog: null
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showWarehouseModal = this.showWarehouseModal.bind(this)
    this.closeWarehouseModal = this.closeWarehouseModal.bind(this)
    this.deleteProduct = this.deleteProduct.bind(this)
    this.removeProduct = this.removeProduct.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const id = this.props.location.state.id
    if (this.props.location.state && id) {
      // this.props.productActions.getVatList();
      this.props.productActions.getProductCategoryList();
      this.props.productActions.getProductVatCategoryList();
      this.props.productActions.getProductWareHouseList()
      // this.setState({
      // }, () => {
      this.props.detailProductActions.getProductById(id).then(res => {
        if (res.status === 200) {
          this.setState({
            loading: false,
            initValue: {
              productName: res.data.productName ? res.data.productName : '',
              productDescription: res.data.productDescription,
              productCode: res.data.productCode,
              vatCategoryId: res.data.vatCategoryId ? res.data.vatCategoryId : '',
              //   label: res.data.vatCategory.name,
              //   value: res.data.vatCategory.id
              // } : '',
              unitPrice: res.data.unitPrice,
              productCategoryId: res.data.productCategoryId ? res.data.productCategoryId : '',
              productWarehouseId: res.data.productWarehouseId ? res.data.productWarehouseId : '',
              //   label: res.data.productWarehouse.warehouseName,
              //   value: res.data.productWarehouse.warehouseId
              // } : '',
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
      productCategoryId,
      productWarehouseId,
      vatIncluded,
    } = data
    const postData = {
      productID : id,
      productName : productName,
      productDescription: productDescription, 
      productCode: productCode,
      vatCategoryId: vatCategoryId,
      unitPrice: unitPrice,
      productCategoryId: productCategoryId,
      productWarehouseId: productWarehouseId,
      vatIncluded: vatIncluded,
    }
    this.props.detailProductActions.updateProduct(postData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('sucess','Product Updated Successfully');
        this.props.history.push('/admin/master/product')
      }
    }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null);
    })
  }

  showWarehouseModal() {
    this.setState({ openWarehouseModal: true })
  }
  // Cloase Confirm Modal
  closeWarehouseModal() {
    this.setState({ openWarehouseModal: false });
    this.props.productActions.getProductWareHouseList()
  }

  deleteProduct() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeProduct}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeProduct() {
    const id= this.props.location.state.id;
    this.props.detailProductActions.deleteProduct(id).then(res=>{
      if(res.status === 200) {
        // this.success('Product Deleted Successfully');
        this.props.history.push('/admin/master/product')
      }
    }).catch(err=> {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }

  render() {

    const { vat_list, product_category_list, product_warehouse_list } = this.props
    const { loading , dialog} = this.state

    return (
      <div className="detail-product-screen">
        <div className="animated fadeIn">
          {dialog}
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

                          // this.setState({
                          //   selectedWareHouse: null,
                          //   selectedParentProduct: null,
                          //   selectedVatCategory: null,
                          // })
                        }}
                        validationSchema={Yup.object().shape({
                          productName: Yup.string()
                            .required("Product Name is Required"),
                          vatCategoryId: Yup.string()
                            .required("Vat Category is Required")
                            .nullable()
                        })}
                        >
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
                                    <Label htmlFor="productCategoryId">Product Category</Label>
                                    <Select
                                      className="select-default-width"
                                      options={product_category_list ? selectOptionsFactory.renderOptions('productCategoryName', 'productCategoryCode', product_category_list,'Product Category') : []}
                                      id="productCategoryId"
                                      name="productCategoryId"
                                      value={props.values.productCategoryId}
                                      onChange={(option) => {
                                        // this.setState({
                                        //   selectedParentProduct: option.value
                                        // })
                                        if(option.value) {
                                          props.handleChange("productCategoryId")(option.value)
                                        } else {
                                          props.handleChange("productCategoryId")('')
                                        }
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
                                    options={vat_list ? selectOptionsFactory.renderOptions('name', 'id', vat_list,'Vat') : []}
                                    id="vatCategoryId"
                                    name="vatCategoryId"
                                    value={props.values.vatCategoryId}
                                    onChange={(option) => {
                                      this.setState({
                                        selectedVatCategory: option.value
                                      })

                                        if(option.value) {
                                          props.handleChange("vatCategoryId")(option.value)
                                        } else {
                                          props.handleChange("vatCategoryId")('')
                                        }

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
                                    options={product_warehouse_list ? selectOptionsFactory.renderOptions('warehouseName', 'warehouseId', product_warehouse_list,'WareHouse') : []}
                                    id="productWarehouseId"
                                    name="productWarehouseId"
                                    value={props.values.productWarehouseId}
                                    onChange={(option) => {
                                      // this.setState({
                                      //   selectedWareHouse: option.value
                                      // })
                                      if(option.value) {
                                        props.handleChange("productWarehouseId")(option.value)
                                      } else {
                                        props.handleChange("productWarehouseId")('')
                                      }
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
                                <Col lg={12} className="d-flex align-items-center justify-content-between flex-wrap mt-5">
                                  <FormGroup>
                                    <Button type="button" name="button" color="danger" className="btn-square"
                                      onClick={this.deleteProduct}
                                    >
                                      <i className="fa fa-trash"></i> Delete
                                    </Button>
                                  </FormGroup>
                                  <FormGroup className="text-right">
                                    <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                      <i className="fa fa-dot-circle-o"></i> Update
                                    </Button>
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
        <WareHouseModal openModal={this.state.openWarehouseModal} closeWarehouseModal={this.closeWarehouseModal}/>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
