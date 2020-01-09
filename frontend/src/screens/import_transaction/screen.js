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
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import Stepper from 'react-stepper-horizontal'


import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import './style.scss'
import { Formik } from 'formik';
import * as Yup from "yup";

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({

  })
}

class ImportTransaction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }

    this.options = {
      paginationPosition: 'top'
    }

    this.initializeData = this.initializeData.bind(this)

  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
  }


  render() {


    return (
      <div className="import-transaction-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fa glyphicon glyphicon-export fa-upload" />
                        <span className="ml-2">Import Transaction</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <div>
                        <Formik >
                          {
                            props => (
                              <Form>
                                <Row>
                                  <Col lg={3}>
                                    <Label>Name</Label>
                                  </Col>
                                  <Col lg={3}>
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter Name"
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={3}>
                                    <Label>Copy Saved Configuration</Label>
                                  </Col>
                                  <Col lg={3}>
                                    <FormGroup>
                                      <Select
                                        className="select-default-width"
                                        options={[]}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12}>
                                    <fieldset>
                                      <legend>Parameters</legend>
                                      <Row>
                                        <Col lg={3}>
                                          <div class="control">
                                            <input id="Tab" type="checkbox" /><label for="Tab">Tab</label>
                                          </div>
                                          <div class="control">
                                            <input id="Semicolon" type="checkbox" /><label for="Semicolon">Semicolon</label>
                                          </div>
                                          <div class="control">
                                            <input id="Comma" type="checkbox" /><label for="Comma">Comma</label>
                                          </div>
                                          <div class="control">
                                            <input id="Space" type="checkbox" /><label for="Space">Space</label>
                                          </div>
                                          <div class="control">
                                            <input id="Other" type="checkbox" /><label for="Other">Other</label>

                                          </div>
                                        </Col>
                                        <Col lg={8} className="table_option">
                                          {/* <Row>
                                            <Col lg={8}> */}
                                          <FormGroup className="">
                                            <Label htmlFor="skip_rows">Skip Rows</Label>
                                            <Input
                                              type="text"
                                              name=""
                                              id=""
                                              rows="6"
                                              placeholder="Enter No of Rows"
                                            />
                                          </FormGroup>
                                          {/* </Col>
                                          </Row>
                                          <Row> */}
                                          {/* <Col lg={8}> */}
                                          <FormGroup className="">
                                            <Label htmlFor="description">Header Rows Number</Label>
                                            <Input
                                              type="text"
                                              name=""
                                              id=""
                                              rows="6"
                                              placeholder="Enter Header Row Number"
                                            />
                                          </FormGroup>
                                          {/* </Col>
                                          </Row>
                                          <Row> */}
                                          {/* <Col lg={8}> */}
                                          <FormGroup className="">
                                            <Label htmlFor="description">Text Qualifier</Label>
                                            <Input
                                              type="text"
                                              name=""
                                              id=""
                                              rows="6"
                                              placeholder="Text Qualifier"
                                            />
                                          </FormGroup>
                                          {/* </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={8}> */}
                                          <FormGroup className="">
                                            <Label htmlFor="description">Date Format</Label>
                                            <Select
                                              type=""
                                              name=""
                                              id=""
                                              rows="6"
                                              placeholder="Date Format"
                                            />
                                          </FormGroup>
                                          {/* </Col>
                                          </Row> */}
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col lg={12} className="mt-2">
                                          <FormGroup className="text-right">
                                            <Button type="button" color="primary" className="btn-square mr-3">
                                              <i className="fa fa-dot-circle-o"></i> Apply
                                    </Button>
                                            <Button type="button" color="primary" className="btn-square mr-3">
                                              <i className="fa fa-repeat"></i> Cancel
                                    </Button>
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                    </fieldset>
                                  </Col>
                                </Row>

                              </Form>
                            )
                          }
                        </Formik>
                        <Row className="mt-5">
                          <Col lg={3}>
                            <FormGroup className="">                             
                              <Select
                                type=""
                                name=""
                                id=""
                                rows="6"
                                placeholder="Transaction Date"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={3}>
                            <FormGroup className="">
                              
                              <Select
                                type=""
                                name=""
                                id=""
                                rows="6"
                                placeholder="Transaction Date"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={3}>
                            <FormGroup className="">
                              
                              <Select
                                type=""
                                name=""
                                id=""
                                rows="6"
                                placeholder="Transaction Date"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={3}>
                            <FormGroup className="">
                              
                              <Select
                                type=""
                                name=""
                                id=""
                                rows="6"
                                placeholder="Transaction Date"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <div>
                          <BootstrapTable
                            selectRow={this.selectRowProp}
                            search={false}
                            options={this.options}
                            data={[]}
                            version="4"
                            hover
                            totalSize={0}
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
                            {/* <TableHeaderColumn
                              dataField="unitPrice"
                              dataSort
                            // dataFormat={this.vatCategoryFormatter}
                            >
                              Unit Price
                          </TableHeaderColumn> */}
                          </BootstrapTable>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTransaction)
