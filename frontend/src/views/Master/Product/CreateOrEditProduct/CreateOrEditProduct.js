import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Alert
} from "reactstrap";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import _ from "lodash";
import "react-toastify/dist/ReactToastify.css";
import sendRequest from '../../../../xhrRequest';
import { toast } from "react-toastify";

class CreateOrEditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentProductList: [],
      vatPercentageList: [],
      warehouseList: [],
      productData: { productName: "", productCode: "", parentProduct: "", vatCategory: "", productWarehouse: "", productDescription: "", vatIncluded: false, unitPrice: "" },
      collapse: true,
      loading: false,
      large: false,
      warehouseName: "",
      btnstatus: ""
    };
    this.toggleLarge = this.toggleLarge.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.getParentProductList();
    this.getVatPercentage();
    this.getwarehouse();
    if (id) {
      this.getProductDetails(id);
    }
  }

  getProductDetails = (id) => {
    const res = sendRequest(`rest/product/editproduct?id=${id}`, "get", "");
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        return res.json();
      }
    }).then(data => {
      this.setState({ productData: { ...this.state.productData, ...data } });
    })
  }

  getParentProductList = () => {
    const res = sendRequest(`rest/product/getproduct`, "get", "");
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        return res.json();
      }
    }).then(data => {
      this.setState({ parentProductList: data });
    })
  }

  getwarehouse = () => {
    const res = sendRequest(`rest/product/getwarehouse`, "get", "");
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        return res.json();
      }
    }).then(data => {
      this.setState({ warehouseList: data });
    })
  }

  getVatPercentage = () => {
    const res = sendRequest(`rest/product/getvatpercentage`, "get", "");
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        return res.json();
      }
    }).then(data => {
      this.setState({ vatPercentageList: data });
    })
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large
    });
  }

  handleChange = (e, name) => {
    this.setState({ alertMsg: "" })
    this.setState({
      productData: _.set(
        { ...this.state.productData },
        e.target.name && e.target.name !== "" ? e.target.name : name,
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
    });
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  saveWareHouse = () => {
    this.setState({ large: !this.state.large });
    let postObj = {
      warehouseName: this.state.warehouseName
    }
    const res = sendRequest(`rest/product/savewarehouse`, "post", postObj);
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        let productWarehouse = { warehouseName: this.state.warehouseName }
        this.setState({ productData: { ...this.state.productData, productWarehouse } })
        this.getwarehouse();
      }
    })
  }

  handleSubmit = (e) => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.setState({ loading: true });
    e.preventDefault();
    let postObj = {
      ...this.state.productData,
      productId: id ? id : 0,
      vatCategory: typeof this.state.productData.vatCategory === "object" ? this.state.productData.vatCategory.id : this.state.productData.vatCategory,
      productWarehouse: typeof this.state.productData.productWarehouse === "object" ? this.state.productData.productWarehouse.warehouseId : this.state.productData.productWarehouse,
      parentProduct: typeof this.state.productData.parentProduct === "object" ? this.state.productData.parentProduct.productID : this.state.productData.parentProduct,
    }
    if (this.state.productData.vatCategory) {
      const res = sendRequest(
        `rest/product/saveproduct?id=1`,
        "post",
        postObj
      );
      res.then(res => {
        if (res.status === 200) {
          this.success();
          if (this.state.btnstatus === "addMore") {
            this.setState({ bankData: {} })
            this.props.history.push("Master/Product/create-Product");
          } else {
            this.props.history.push("/Master/Product");
          }
        }
      });
    } else {
      this.setState({ alertMsg: "Please add all mandatory fields" })
    }
  };

  success = () => {
    return toast.success("Transaction Category Updated successfully... ", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  formatNumber(num) {
    let n = num ? num : 0;
    return Number.parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  render() {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    const { parentProductList, vatPercentageList, warehouseList, productData, warehouseName, alertMsg } = this.state;
    const { productName, productCode, parentProduct, vatCategory, productWarehouse, productDescription, vatIncluded, unitPrice } = productData;
    return (
      <div className="animated fadeIn">
        {
          alertMsg ?
            <Alert color="danger">
              {alertMsg}
            </Alert>
            : ""
        }
        <Card>
          <CardHeader>{id ? "Edit Product And Service" : "New Product And Service</CardHeader"}</CardHeader>
          <div className="create-bank-wrapper">
            <Row>
              <Col xs="12">
                <Form onSubmit={this.handleSubmit} class="bank-form" name="simpleForm" >
                  <Card>
                    <CardHeader>Product And Service Details</CardHeader>
                    <CardBody>
                      <Row className="row-wrapper">
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="productName" className="required">Name</Label>
                            <Input
                              type="text"
                              id="productName"
                              name="productName"
                              onChange={e => this.handleChange(e, "productName")}
                              value={productName}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="productCode">Product Code</Label>
                            <Input
                              type="text"
                              id="productCode"
                              name="productCode"
                              value={productCode}
                              onChange={e => this.handleChange(e, "productCode")}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="parentProduct">Parent Product</Label>
                            <Input
                              type="select"
                              name="parentProduct"
                              id="parentProduct"
                              value={id ? parentProduct.productID : parentProduct}
                              onChange={e => this.handleChange(e, "parentProduct")}
                            >
                              <option value="0">Please select Prent product</option>
                              {
                                parentProductList.length ? parentProductList.map((item, ind) => <option key={ind} value={item.productID} >{item.productName}</option>) : ""
                              }
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="unitPrice">Product Price</Label>
                            <Input
                              type="text"
                              id="unitPrice"
                              name="unitPrice"
                              value={this.formatNumber(unitPrice)}
                              onChange={e => this.handleChange(e, "unitPrice")}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Input
                              className="form-check-input vat-includeLable"
                              type="checkbox"
                              id="vatIncluded"
                              name="vatIncluded"
                              checked={vatIncluded}
                              onChange={e => this.handleChange(e, "unitPrice")}
                            />
                            <Label
                              check
                              className="form-check-label vat-includeLable"
                              htmlFor="vatIncluded"
                            >
                              Vat Include
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="vatCategory" className="required">Vat Percentage</Label>
                            <Input
                              type="select"
                              name="vatCategory"
                              id="vatCategory"
                              value={id ? vatCategory.id : vatCategory}
                              onChange={e => this.handleChange(e, "vatCategory")}
                            >
                              <option value="0">Please Select Vat Percentage</option>
                              {
                                vatPercentageList.length ? vatPercentageList.map((item, ind) => <option key={ind} value={item.id}>{item.name}</option>) : ""
                              }
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="productWarehouse">Contact</Label>
                            <div className="d-flex product-cotact-input">
                              <Input
                                type="select"
                                name="productWarehouse"
                                id="productWarehouse"
                                value={id ? productWarehouse.warehouseId : productWarehouse}
                                onChange={e => this.handleChange(e, "productWarehouse")}
                              >
                                <option value="0">Please Select Contact</option>
                                {
                                  warehouseList.length ? warehouseList.map((item, ind) => <option key={ind} value={item.warehouseId}>{item.warehouseName}</option>) : ""
                                }
                              </Input>
                              <Button
                                size="sm"
                                color="primary"
                                onClick={this.toggleLarge}
                                className="mr-1 add-btn"
                              >
                                <i className="fas fa-plus"></i> Add
                            </Button>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="productDescription">Description</Label>
                            <Input
                              type="textarea"
                              id="productDescription"
                              name="productDescription"
                              value={productDescription}
                              onChange={e => this.handleChange(e, "productDescription")}
                            />
                            <span>{`${255 - (!productDescription ? 0 : productDescription.split('').length)} characters remaining.`}</span>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Modal
                        isOpen={this.state.large}
                        toggle={this.toggleLarge}
                        className={"modal-lg " + this.props.className}
                      >
                        <ModalHeader toggle={this.toggleLarge}>
                          New warehouse
                        </ModalHeader>
                        <ModalBody>
                          <Row className="row-wrapper">
                            <Col md="12">
                              <FormGroup>
                                <Label htmlFor="warehouseName">
                                  warehouse Name
                                </Label>
                                <Input
                                  type="text"
                                  id="warehouseName"
                                  name="warehouseName"
                                  value={warehouseName}
                                  onChange={e => this.setState({ warehouseName: e.target.value })}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.saveWareHouse}>
                            Save
                          </Button>{" "}
                          <Button color="secondary" onClick={() => this.setState({ large: !this.state.large })}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </CardBody>
                  </Card>
                  <Row className="bank-btn-wrapper">
                    <FormGroup>
                      <Button type="submit" size="sm" color="primary" style={{ marginRight: "1rem" }}>
                        <i className="fa fa-dot-circle-o"></i> {id ? "Update" : "Save"}
                      </Button>
                      <Button size="sm" color="primary" onSubmit={() => this.setState({ btnstatus: "addMore" }, e => this.handleSubmit(e))}>
                        <i className="fa fa-dot-circle-o"></i> {id ? "Update & Add More" : "Save & Add More"}
                      </Button>
                    </FormGroup>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Card>
      </div >
    );
  }
}

export default CreateOrEditProduct;
