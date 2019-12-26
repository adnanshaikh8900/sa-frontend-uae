import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Row,
  Col
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import _ from "lodash"
import { Loader } from 'components'
import {
  selectOptionsFactory
} from 'utils'
import {
  CommonActions
} from 'services/global'

import 'react-toastify/dist/ReactToastify.css'
import './style.scss'

import * as DetailProductCategoryAction from './actions'

import { Formik } from 'formik';
import * as Yup from "yup";


const mapStateToProps = (state) => {
  return ({

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    detailProductCategoryAction: bindActionCreators(DetailProductCategoryAction, dispatch)
  })
}

class DetailProductCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vatData: {},
      loading: false
    }

    this.saveAndContinue = false;

    this.handleSubmit = this.handleSubmit.bind(this)

    this.id = props.location.state.id;
  }

  componentDidMount() {
    console.log(this.id)
    if (this.id) {
      this.setState({ loading: true });
      this.props.detailProductCategoryAction.getProductCategoryById(this.id).then(res => {
        if (res.status === 200)
          this.setState({ 
            loading: false,
            vatData: res.data
          })
      })
    }
  }

  // Create or Edit Vat
  handleSubmit(data){
    const {id,productCategoryName,productCategoryDescription} = data;
    this.props.detailProductCategoryAction.updateProductCategory(data).then(res => {
      console.log(res)
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Product Category is updated successfully!')
        this.props.history.push('/admin/master/product-category')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data.message)
    })
  }

  render() {
    const { loading } = this.state

    return (
      <div className="detail-vat-code-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="nav-icon icon-briefcase" />
                    <span className="ml-2">Update Product Category</span>
                  </div>
                </CardHeader>
                <CardBody>
                  {loading ? (
                    <Loader></Loader>
                  ) : (
                    <Row>
                      <Col lg={6}>
                      <Formik
                          initialValues={this.state.vatData}
                          onSubmit={values => {
                            this.handleSubmit(values)
                          }}
                          // validationSchema={Yup.object().shape({
                          //   name: Yup.string()
                          //     .required("Product Category Name is Required"),
                          //   code: Yup.string()
                          //     .required("Code is Required")
                          // })}
                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit} name="simpleForm">
                                <FormGroup>
                                  <Label htmlFor="productCategoryCode ">Product Category Code</Label>
                                  <Input
                                    type="text"
                                    id="productCategoryCode "
                                    name="productCategoryCode "
                                    placeholder="Enter Product Category Code"
                                    onChange={props.handleChange}
                                    defaultValue={props.values.productCategoryCode}
                                    className={
                                      props.errors.productCategoryCode  && props.touched.productCategoryCode 
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.productCategoryCode  && props.touched.productCategoryCode  && (
                                    <div className="invalid-feedback">{props.errors.productCategoryCode }</div>
                                  )}
                                </FormGroup>
                                <FormGroup>
                                  <Label htmlFor="name">Product Category Name</Label>
                                  <Input
                                    type="text"
                                    id="productCategoryName"
                                    name="productCategoryName"
                                    placeholder="Enter Product Category Name"
                                    onChange={props.handleChange}
                                    defaultValue={props.values.productCategoryName }
                                    className={
                                      props.errors.productCategoryName  && props.touched.productCategoryName 
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.productCategoryName  && props.touched.productCategoryName  && (
                                    <div className="invalid-feedback">{props.errors.productCategoryName }</div>
                                  )}
                                </FormGroup>
                                <Row>
                                  <Col lg={12} className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
                                    <FormGroup>
                                      <Button type="button" color="danger" className="btn-square">
                                        <i className="fa fa-trash"></i> Delete
                                      </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" name="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                      </Button>
                                      <Button type="submit" color="secondary" className="btn-square"
                                        onClick={() => {this.props.history.push('/admin/master/product-category')}}>
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
                    )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProductCategory)
