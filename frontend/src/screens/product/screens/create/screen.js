import React from 'react'
import {connect} from 'react-redux'
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

import './style.scss'

import * as ProductActions from '../../actions'
import {
  CommonActions
} from 'services/global'

import {WareHouseModal} from '../../sections'
import {selectOptionsFactory} from 'utils'

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
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}

class CreateProduct extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      openWarehouseModal:false,

      // selectedParentProduct: null,
      // selectedVatCategory: null,
      // selectedWareHouse: null,

      initValue: {
        productName: '', 
        productDescription: '',
        productCode:'',
        vatCategoryId : '',
        unitPrice : '',
        productCategoryId: '',
        productWarehouseId: '',
        vatIncluded: false,
      },
      createMore: false
    }

    this.showWarehouseModal = this.showWarehouseModal.bind(this)
    this.closeWarehouseModal = this.closeWarehouseModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount(){
    this.props.productActions.getProductVatCategoryList()
    this.props.productActions.getProductCategoryList()
    this.props.productActions.getProductWareHouseList()
  }


  // Show Invite User Modal
  showWarehouseModal() {
    this.setState({ openWarehouseModal: true })
  }
  // Cloase Confirm Modal
  closeWarehouseModal() {
    this.setState({ openWarehouseModal: false });
    this.props.productActions.getProductWareHouseList()
  }


  // Create or Edit Product
  handleSubmit(data,resetForm) {
    const {
      productName, 
      productDescription,
      productCode,
      vatCategoryId,
      unitPrice ,
      productCategoryId,
      productWarehouseId,
      vatIncluded,
    } = data


    const postData = {
      productName:  productName,
      productDescription: productDescription,
      productCode: productCode,
      vatCategoryId: vatCategoryId,
      unitPrice: unitPrice,
      productCategoryId: productCategoryId,
      productWarehouseId: productWarehouseId,
      vatIncluded: vatIncluded
    }

    this.props.productActions.createAndSaveProduct(postData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'New Product created successfully!')
        if(this.state.createMore){
          this.setState({
            createMore: false
          })
          resetForm()
          // this.props.history.push('/admin/master/product/create')
        } else this.props.history.push('/admin/master/product')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  // displayMessage(msg) {
  //   toast.success(msg, {
  //     position: toast.POSITION.TOP_RIGHT
  //   })
  // }

  render() {

    const  {vat_list, product_category_list, product_warehouse_list } = this.props
    const { initValue } = this.state;
    return (
      <div className="create-product-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fas fa-object-group" />
                        <span className="ml-2">Create Product</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={initValue}
                        onSubmit={(values, {resetForm}) => {

                          this.handleSubmit(values,resetForm)
                          // resetForm(initValue)

                          // this.setState({
                          //   selectedWareHouse: null,
                          //   selectedParentProduct: null,
                          //   selectedVatCategory: null,
                          // })
                        }}
                        validationSchema={
                          Yup.object().shape({
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
                                      onChange={(value) => {props.handleChange("productName")(value)}}
                                      value={props.values.productName}
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
                                      onChange={(value) => {props.handleChange("productCode")(value)}}

                                      // value={props.values.productCode}
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
                                      onChange={(value) => {props.handleChange("unitPrice")(value)}}

                                      value={props.values.unitPrice}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="vatCategoryId"><span className="text-danger">*</span>Vat Percentage</Label>
                                    <Select
                                      className="select-default-width"
                                      options={vat_list ? selectOptionsFactory.renderOptions('name', 'id', vat_list,'Vat'): []}
                                      id="vatCategoryId"
                                      name="vatCategoryId"
                                      value={props.values.vatCategoryId}
                                      onChange={(option) => {
                                        // this.setState({
                                        //   selectedVatCategory: option.value
                                        // })
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
                                      onChange={(value) => {props.handleChange("vatIncluded")(value)}}

                                      value={props.values.vatIncluded}
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
                                      options={product_warehouse_list ? selectOptionsFactory.renderOptions('warehouseName', 'warehouseId', product_warehouse_list, 'Warehouse') : []}
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
                                      onChange={(value) => {props.handleChange('productDescription')(value)}}

                                      value={props.values.productDescription}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} className="mt-5">
                                  <FormGroup className="text-right">
                                    <Button type="button" color="primary" className="btn-square mr-3"  onClick={
                                        () => {
                                          this.setState({createMore: false})
                                          props.handleSubmit()
                                        }
                                      }
                                    >
                                      <i className="fa fa-dot-circle-o"></i> Create
                                    </Button>
                                    <Button type="button" color="primary" className="btn-square mr-3"
                                      onClick={
                                        () => {
                                          this.setState({createMore: true})
                                          props.handleSubmit()
                                        }
                                      }
                                    >
                                      <i className="fa fa-repeat"></i> Create and More
                                    </Button>
                                    <Button color="secondary" className="btn-square" 
                                      onClick={() => {this.props.history.push('/admin/master/product')}}>
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
        </div>

        <WareHouseModal openModal={this.state.openWarehouseModal} closeWarehouseModal={this.closeWarehouseModal}/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProduct)
