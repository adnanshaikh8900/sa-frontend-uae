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
import * as ImportTransactionActions from './actions';
import { selectOptionsFactory } from 'utils'


import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import './style.scss'
import { Formik } from 'formik';
import * as Yup from "yup";

const mapStateToProps = (state) => {
  return ({
    date_format_list: state.import_transaction.date_format_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    importTransactionActions: bindActionCreators(ImportTransactionActions, dispatch),
  })
}

class ImportTransaction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      initialValue: {
        name: '',
        copy_saved_congiguration: '',
        tab: false,
        semicolon: false,
        comma: false,
        space: false,
        otherInput: '',
        skip_rows: '',
        header_row_number: '',
        text_qualifer: '',
        dateFormat: '',
      },
      fileName: ''
    }

    this.options = {
      paginationPosition: 'top'
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.importTransactionActions.getDateFormatList()
  }

  handleSubmit(value, resetForm) {
    console.log(value)
  }


  render() {
    const { initValue } = this.state;
    const { date_format_list } = this.props

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
                        <Formik
                          initialValues={initValue}
                          onSubmit={(values, { resetForm }) => {
                            this.handleSubmit(values, resetForm)
                          }}
                        >
                          {
                            props => (
                              <Form >
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
                                        onChange={option => props.handleChange('name')(option)}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={3} md={5}>
                                    <Label>Copy Saved Configuration</Label>
                                  </Col>
                                  <Col lg={3} md={7}>
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
                                        <Col lg={4}>
                                          <div >
                                            <FormGroup check inline className="mb-3">
                                              <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="tab"
                                                name="tab"
                                                onChange={(value) => { props.handleChange("tab")(value) }}
                                                value={props.values.tab || false}
                                              />
                                              <Label className="form-check-label" check htmlFor="vatIncluded">tab</Label>
                                            </FormGroup>
                                          </div>
                                          <div >
                                            <FormGroup check inline className="mb-3">
                                              <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="semicolon"
                                                name="semicolon"
                                                onChange={(value) => { props.handleChange("semicolon")(value) }}
                                                value={props.values.semicolon || false}
                                              />
                                              <Label className="form-check-label" check htmlFor="semicolon">SemiColon</Label>
                                            </FormGroup>
                                          </div>
                                          <div >
                                            <FormGroup check inline className="mb-3">
                                              <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="comma"
                                                name="comma"
                                                onChange={(value) => { props.handleChange("comma")(value) }}
                                                value={props.values.comma || false}
                                              />
                                              <Label className="form-check-label" check htmlFor="comma">Comma</Label>
                                            </FormGroup>
                                          </div>
                                          <div >
                                            <FormGroup check inline className="mb-3">
                                              <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="space"
                                                name="space"
                                                onChange={(value) => { props.handleChange("space")(value) }}
                                                value={props.values.space || false}
                                              />
                                              <Label className="form-check-label" check htmlFor="space">Space</Label>
                                            </FormGroup>
                                          </div>
                                          <div class="other-field">
                                            <FormGroup check inline className="mb-3">
                                              <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="other"
                                                name="other"
                                                onChange={(value) => { props.handleChange("other")(value) }}
                                                value={props.values.other || false}
                                              />
                                              <Label className="form-check-label" check htmlFor="other">Others</Label>
                                            </FormGroup>
                                            <Input
                                              type="text"
                                              placeholder="Other"
                                              // value={filter_account_number}
                                              onChange={(value) => { props.handleChange("otherInput")(value) }}
                                            />
                                          </div>
                                        </Col>
                                        <Col lg={6} className="table_option">

                                          <Row>
                                            <Col md="5">
                                              <label for="Other">Provide Sample</label>
                                            </Col>
                                            <Col md="7">
                                              <FormGroup className="">

                                                <Button color="primary" onClick={() => { document.getElementById('fileInput').click() }} className="btn-square mr-3">
                                                  <i className="fa fa-upload"></i> Upload
                                              </Button>
                                                <input id="fileInput" ref={ref => {
                                                  this.uploadFile = ref;
                                                }}
                                                  type="file" style={{ display: 'none' }} onChange={(e) => {
                                                    this.setState({ fileName: (e.target.value).split('\\').pop() })
                                                  }} />
                                                {this.state.fileName}
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md={5}>
                                              <Label htmlFor="skip_rows">Skip Rows</Label>
                                            </Col>
                                            <Col md={7}>
                                              <FormGroup className="">
                                                <Input
                                                  type="text"
                                                  name=""
                                                  id=""
                                                  rows="6"
                                                  placeholder="Enter No of Rows"
                                                  onChange={(value) => { props.handleChange("skip_rows")(value) }}
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md={5}>  <Label htmlFor="description">Header Rows Number</Label></Col>
                                            <Col md={7}>
                                              <FormGroup className="">
                                                <Input
                                                  type="text"
                                                  name=""
                                                  id=""
                                                  rows="6"
                                                  placeholder="Enter Header Row Number"
                                                  onChange={(value) => { props.handleChange("header_rows_number")(value) }}

                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md={5}>
                                              <Label htmlFor="description">Text Qualifier</Label>
                                            </Col>
                                            <Col md={7}>
                                              <FormGroup className="">
                                                <Input
                                                  type="text"
                                                  name=""
                                                  id=""
                                                  rows="6"
                                                  placeholder="Text Qualifier"
                                                  onChange={(value) => { props.handleChange("text_qualifier")(value) }}

                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md={5}>
                                              <Label htmlFor="description">Date Format</Label>
                                            </Col>
                                            <Col md={7}>
                                              <FormGroup className="">

                                                <Select
                                                  type=""
                                                  options={date_format_list ? selectOptionsFactory.renderOptions('format', 'id', date_format_list, 'Date Format') : []}
                                                  value={props.values.dateFormat}
                                                  onChange={option => {
                                                    if (option && option.value) {
                                                      props.handleChange('dateFormat')(option.value)
                                                    } else {
                                                      props.handleChange('dateFormat')('')
                                                    }
                                                  }}
                                                  id=""
                                                  rows="6"
                                                  placeholder="Date Format"
                                          
                                                />
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </Col>

                                        <Col lg={2} className="mt-2 align-apply text-right">
                                          <FormGroup >
                                            <Button type="button" color="primary" className="btn-square"
                                              onClick={() => {
                                                props.handleSubmit()
                                              }}
                                            >
                                              <i className="fa fa-dot-circle-o"></i> Apply
                                           </Button>
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                    </fieldset>
                                  </Col>
                                </Row>
                                <Row className="mt-5">
                                  <Col lg={3}>
                                    <FormGroup className="">
                                      <Select
                                        type=""
                                        name=""
                                        id=""
                                        rows="6"
                                        placeholder="Transaction Name"
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
                                        placeholder="Transaction Number"
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
                                        placeholder="Transaction Code"
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
                              </Form>
                            )
                          }
                        </Formik>

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
                              Transaction Number
                          </TableHeaderColumn>
                            <TableHeaderColumn
                              dataField="Transaction Code"
                              dataSort
                            >
                              Transaction Code
                          </TableHeaderColumn>
                            <TableHeaderColumn
                              dataField="vatPercentage"
                              dataSort
                            // dataFormat={this.vatCategoryFormatter}
                            >
                              Transaction Date
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
                        <Row>
                          <Col lg={12} className="mt-2">
                            <FormGroup className="text-right">
                              <Button type="button" color="primary" className="btn-square mr-4">
                                <i className="fa fa-dot-circle-o"></i> Save
                                    </Button>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTransaction)
