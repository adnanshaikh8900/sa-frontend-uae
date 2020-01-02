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
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import _ from 'lodash'
import { CustomerModal } from '../../sections'
import * as createInvoiceActions from './actions';
import * as  CustomerActions from "../../actions";
import {
  CommonActions
} from 'services/global'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import {
  selectOptionsFactory,
  filterFactory
} from 'utils'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    customer_list: state.customer_invoice.customer_list,
    project_list: state.customer_invoice.project_list,
    currency_list: state.customer_invoice.currency_list,
    vat_list: state.customer_invoice.vat_list,

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    customerActions: bindActionCreators(CustomerActions, dispatch),
    createInvoiceActions: bindActionCreators(createInvoiceActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class CreateCustomerInvoice extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      discountOptions: [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Percentage', label: 'Percentage' }
      ],
      discount_option: '',
      openCustomerModal: false,

      data: [{
        id: 0,
        productId: null,
        description: '',
        quantity: 0,
        unitPrice: 0,
        vatCategoryId: null,
        subTotal: 0
      }],
      idCount: 0,
      initValue: {
        // expenseId: null,
        reference_number: null,
        project: null,
        customerContact: null,
        invoiceDate: null,
        invoiceDueDate: null,
        tax_identification_number: null,
        currency: null,
        contact_po_number: null,
        receiptNumber: null,
        receiptAttachmentDescription: null,
        total_net: 0,
        customerVATAmount: 0,
        totalAmount: 0,
        notes: null
      },
      currentData: {},
      contactCode: "2"
    }

    this.options = {
      paginationPosition: 'top'
    }

    this.renderActions = this.renderActions.bind(this)
    this.renderProductName = this.renderProductName.bind(this)
    this.renderDescription = this.renderDescription.bind(this)
    this.renderQuantity = this.renderQuantity.bind(this)
    this.renderUnitPrice = this.renderUnitPrice.bind(this)
    this.renderVat = this.renderVat.bind(this)
    this.renderSubTotal = this.renderSubTotal.bind(this)
    this.openCustomerModal = this.openCustomerModal.bind(this)
    this.closeCustomerModal = this.closeCustomerModal.bind(this)

  }

  // renderActions (cell, row) {
  //   return (
  //     <Button
  //       size="sm"
  //       color="primary"
  //       className="btn-brand icon"
  //     >
  //       <i className="fas fa-trash"></i>
  //     </Button>
  //   )
  // }

  renderProductName(cell, row) {
    return (
      <div className="d-flex align-items-center">
        <Input type="hidden" className="mr-1" />
      </div>
    )
  }

  renderDescription(cell, row) {
    return (
      <Input
        type="text"
        value={row['description'] !== '' ? row['description'] : ''}
        defaultValue={row['description']}
        onChange={(e) => { this.selectItem(e, row, 'description') }}
      />
    )
  }

  renderQuantity(cell, row) {
    return (
      <Input
        type="number"
        value={row['quantity'] !== 0 ? row['quantity'] : 0}
        defaultValue={row['quantity']}
        onChange={(e) => { this.selectItem(e, row, 'quantity') }}
      />
    )
  }

  renderUnitPrice(cell, row) {
    return (
      <Input
        type="number"
        value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
        defaultValue={row['unitPrice']}
        onChange={(e) => { this.selectItem(e, row, 'unitPrice') }}
      />
    )
  }



  renderSubTotal(cell, row) {
    return (
      <label className="mb-0">{row.subTotal}</label>
    )
  }

  componentDidMount() {
    this.getInitialData();
  }

  getInitialData = () => {
    this.props.customerActions.getProjectList();
    this.props.customerActions.getCustomerList(this.state.contactCode);
    // this.props.customerActions.getVendorList();
    this.props.customerActions.getCurrencyList();
    this.props.customerActions.getVatList();
  }


  handleChange = (e, name) => {
    this.setState({
      currentData: _.set(
        { ...this.state.currentData },
        e.target.name && e.target.name !== '' ? e.target.name : name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      )
    })
  }


  addRow = () => {
    const data = [...this.state.data]
    this.setState({
      data: data.concat({
        id: this.state.idCount + 1,
        productId: null,
        description: '',
        quantity: 0,
        unitPrice: 0,
        vatCategoryId: null,
        subTotal: 0
      }), idCount: this.state.idCount + 1
    })
  }

  selectItem(e, row, name) {
    e.preventDefault();
    const data = this.state.data

    data.map((obj, index) => {
      if (obj.id === row.id) {
        obj[name] = e.target.value
      }
    });
    if (name === 'unitPrice' || name === 'vatCategoryId' || name === 'quantity') {
      this.updateAmount(data);
    } else {
      this.setState({ data: data });
    }

  }

  renderVat(cell, row) {
    const { vat_list } = this.props;
    return (
      <Input type="select" onChange={(e) => { this.selectItem(e, row, 'vatCategoryId') }} value={row.vatCategoryId}>
        {vat_list ? vat_list.map(obj => {
          obj.name = obj.name === 'default' ? '0' : obj.name
          return <option value={obj.id}>{obj.name}</option>
        }) : ''}
      </Input>
    )
  }


  deleteRow(e, row) {

    const id = row['id'];
    let newData = []
    e.preventDefault();
    const data = this.state.data
    newData = data.filter(obj => obj.id !== id);
    this.updateAmount(newData)
  }

  renderActions(cell, row) {
    return (
      <Button
        size="sm"
        className="btn-twitter btn-brand icon"
        onClick={(e) => { this.deleteRow(e, row) }}
      >
        <i className="fas fa-trash"></i>
      </Button>
    )
  }


  updateAmount(data) {
    const { vat_list } = this.props;
    let total_net = 0;
    let total = 0;
    let total_vat = 0;
    data.map(obj => {
      const index = obj.vatCategoryId !== null ? vat_list.findIndex(item => item.id === (+obj.vatCategoryId)) : '';
      const vat = index !== '' ? vat_list[index].vat : 0
      let val = ((((+obj.unitPrice) * vat) * obj.quantity) / 100)
      obj.subTotal = (obj.unitPrice && obj.vatCategoryId) ? (((+obj.unitPrice) * obj.quantity) + val) : 0;
      total_net = +(total_net + ((+obj.unitPrice) * obj.quantity));
      total_vat = +((total_vat + val)).toFixed(2);
      total = (total_vat + total_net).toFixed(2);

    })
    this.setState({
      data: data,
      initValue: {
        total_net: total_net,
        customerVATAmount: total_vat,
        totalAmount: total
      }
    })
  }

  openCustomerModal() {
    this.setState({ openCustomerModal: true })
  }

  closeCustomerModal() {
    this.setState({ openCustomerModal: false })
  }



  handleSubmit(data) {
    const {
      receiptAttachmentDescription,
      receiptNumber,
      contact_po_number,
      currency,
      invoiceDueDate,
      invoiceDate,
      tax_identification_number,
      customerContact,
      project,
      reference_number,
      customerVATAmount,
      totalAmount,
      notes
    } = data
    let formData = new FormData();
    formData.append("type", 2);
    formData.append("taxIdentificationNumber", tax_identification_number !== null ? tax_identification_number : "");
    formData.append("referenceNumber", reference_number !== null ? reference_number : "");
    formData.append("invoiceDate", invoiceDate !== null ? invoiceDate : "");
    formData.append("invoiceDueDate", invoiceDueDate !== null ? invoiceDueDate : "");
    formData.append("receiptNumber", receiptNumber !== null ? receiptNumber : "");
    formData.append("contactPoNumber", contact_po_number !== null ? contact_po_number : "");
    formData.append("receiptAttachmentDescription", receiptAttachmentDescription !== null ? receiptAttachmentDescription : "");
    formData.append("notes", notes !== null ? notes : "");
    formData.append('lineItemsString', JSON.stringify(this.state.data));
    formData.append('totalVatAmount', this.state.initValue.customerVATAmount);
    formData.append('totalAmount', this.state.initValue.totalAmount);
    if (customerContact !== null && customerContact.value) {
      formData.append("contactId", customerContact.value);
    }
    if (currency !== null && currency.value) {
      formData.append("currencyCode", currency.value);
    }
    if (project !== null && project.value) {
      formData.append("projectId", project.value);
    }
    if (this.uploadFile.files[0]) {
      formData.append("attchmentFile", this.uploadFile.files[0]);
    }
    this.props.createInvoiceActions.createInvoice(formData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'New Invoice Created Successfully.')
      if (this.state.createMore) {
        this.setState({
          createMore: false
        })
      } else {
        this.props.history.push('/admin/revenue/customer-invoice')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  render() {

    const {
      data,
      discountOptions,
      discount_option,
      initValue,
      openCustomerModal
    } = this.state
    const { project_list, customer_list, vendor_list, currency_list } = this.props


    return (
      <div className="create-customer-invoice-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fas fa-address-book" />
                        <span className="ml-2">Create Invoice</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={initValue}
                        onSubmit={(values, { resetForm }) => {

                          this.handleSubmit(values)
                          resetForm(initValue)

                          // this.setState({
                          //   selectedCurrency: null,
                          //   selectedProject: null,
                          //   selectedBankAccount: null,
                          //   selectedCustomer: null

                          // })
                        }}

                      >
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="reference_number">Invoice Number</Label>
                                  <Input
                                    type="text"
                                    id="reference_number"
                                    name="reference_number"
                                    placeholder=""
                                    onChange={(value) => { props.handleChange("reference_number")(value) }}
                                    required
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="project">Project</Label>
                                  <Select
                                    className="select-default-width"
                                    options={project_list ? selectOptionsFactory.renderOptions('label', 'value', project_list) : []}
                                    id="project"
                                    name="project"
                                    value={props.values.project}
                                    onChange={option => props.handleChange('project')(option)}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="contact">Customer</Label>
                                  <Select
                                    className="select-default-width"
                                    options={customer_list ? selectOptionsFactory.renderOptions('label', 'value', customer_list) : []}
                                    id="customerContact"
                                    name="customerContact"
                                    value={props.values.customerContact}
                                    onChange={option => props.handleChange('customerContact')(option)}
                                  />

                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Button color="primary" className="btn-square" onClick={this.openCustomerModal}>
                                    <i className="fa fa-plus"></i> Add a Customer
                              </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                            {/* <hr/>
                        <Row>
                          <Col lg={4}>
                            <FormGroup check inline className="mb-3">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                id="is_same_address"
                                name="is_same_address"
                              />
                              <Label className="form-check-label" check htmlFor="is_same_address">
                                Shipping Address is same as above address.
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4}>
                            <FormGroup className="mb-3">
                              <Label htmlFor="contact">Shipping Contact</Label>
                              <Select
                                className="select-default-width"
                                options={selectOptionsFactory.renderOptions('firstName', 'contactId', vendor_list)}
                                id="customerContact"
                                name="customerContact"
                                value={props.values.customerContact}
                                onChange={option => props.handleChange('customerContact')(option)}                                
                              />
                            </FormGroup>
                          </Col>
                        </Row> */}
                            <hr />
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="date">Invoice Date</Label>
                                  <div>
                                    <DatePicker
                                      className="form-control"
                                      id="invoiceDate"
                                      name="invoiceDate"
                                      placeholderText=""
                                      selected={props.values.invoiceDate}
                                      onChange={(value) => {
                                        props.handleChange("invoiceDate")(value)
                                      }}
                                    />
                                    {/* <DatePicker
                                  className="form-control"
                                  id="date"
                                  name="date"
                                  placeholderText=""
                                /> */}
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="due_date">Invoice Due Date</Label>
                                  <div>
                                    <DatePicker
                                      className="form-control"
                                      id="invoiceDueDate"
                                      name="invoiceDate"
                                      placeholderText=""
                                      selected={props.values.invoiceDueDate}
                                      onChange={(value) => {
                                        props.handleChange("invoiceDueDate")(value)
                                      }}
                                    />
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="tax_identification_number">Tax Identification Number (TIN)</Label>
                                  <Input
                                    type="text"
                                    id="tax_identification_number"
                                    name="tax_identification_number"
                                    placeholder=""
                                    onChange={(value) => { props.handleChange("tax_identification_number")(value) }}
                                    required
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="currency">Currency</Label>
                                  <Select
                                    className="select-default-width"
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list) : []}
                                    id="currency"
                                    name="currency"
                                    value={props.values.currency}
                                    onChange={option => props.handleChange('currency')(option)}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="contact_po_number">Contact PO Number</Label>
                                  <Input
                                    type="text"
                                    id="contact_po_number"
                                    name="contact_po_number"
                                    placeholder=""
                                    onChange={(value) => { props.handleChange("contact_po_number")(value) }}
                                    required
                                  />
                                </FormGroup>
                              </Col>
                            </Row>


                            <hr />
                            <Row>
                              <Col lg={8}>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="receiptNumber">Reciept Number</Label>
                                      <Input
                                        type="text"
                                        id="receiptNumber"
                                        name="receiptNumber"
                                        placeholder="Enter Reciept Number"
                                        required
                                        onChange={option => props.handleChange('receiptNumber')(option)}
                                        value={props.values.receiptNumber}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="receiptAttachmentDescription">Attachment Description</Label>
                                      <Input
                                        type="textarea"
                                        name="receiptAttachmentDescription"
                                        id="receiptAttachmentDescription"
                                        rows="5"
                                        placeholder="1024 characters..."
                                        onChange={option => props.handleChange('receiptAttachmentDescription')(option)}
                                        value={props.values.receiptAttachmentDescription}

                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Label>Reciept Attachment</Label><br />
                                      <Button color="primary" onClick={() => { document.getElementById('fileInput').click() }} className="btn-square mr-3">
                                        <i className="fa fa-upload"></i> Upload
                                  </Button>
                                      <input id="fileInput" ref={ref => {
                                        this.uploadFile = ref;
                                      }}
                                        type="file" type="file" style={{ display: 'none' }} />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>


                            <hr />
                            <Row>
                              <Col lg={12} className="mb-3">
                                <Button color="primary" className="btn-square mr-3" onClick={this.addRow}>
                                  <i className="fa fa-plus"></i> Add More
                            </Button>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12}>
                                <BootstrapTable
                                  options={this.options}
                                  data={data}
                                  version="4"
                                  hover
                                  className="invoice-create-table"
                                >
                                  <TableHeaderColumn
                                    width="55"
                                    dataAlign="center"
                                    dataFormat={this.renderActions}
                                  >
                                  </TableHeaderColumn>
                                  <TableHeaderColumn
                                    isKey
                                    width="0"
                                    dataField="product_name"
                                    dataFormat={this.renderProductName}
                                  >
                                    Product
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="description"
                                    dataFormat={this.renderDescription}
                                  >
                                    Description
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="quantity"
                                    dataFormat={this.renderQuantity}
                                  >
                                    Quantity
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="unit_price"
                                    dataFormat={this.renderUnitPrice}
                                  >
                                    Unit Price (All)
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="vat"
                                    dataFormat={this.renderVat}
                                  >
                                    Vat (%)
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="sub_total"
                                    dataFormat={this.renderSubTotal}
                                    className="text-right"
                                    columnClassName="text-right"
                                  >
                                    Sub Total (All)
                              </TableHeaderColumn>
                                </BootstrapTable>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <FormGroup className="py-2">
                                  <Label htmlFor="notes">Notes</Label>
                                  <Input
                                    type="textarea"
                                    name="notes"
                                    id="notes"
                                    rows="6"
                                    placeholder="notes..."
                                    onChange={option => props.handleChange('notes')(option)}
                                    value={props.values.notes}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <div className="">
                                  <div className="total-item p-2">
                                    <Row>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="discount_type">Discount Type</Label>
                                          <Select
                                            className="select-default-width"
                                            options={discountOptions}
                                            id="discount_type"
                                            name="discount_type"
                                            value={{ value: discount_option, label: discount_option }}
                                            onChange={(item) => this.setState({
                                              discount_option: item.value
                                            })}
                                          />
                                        </FormGroup>
                                      </Col>
                                      {
                                        discount_option === 'Percentage' ?
                                          <Col lg={6}>
                                            <FormGroup>
                                              <Label htmlFor="discount_percentage">Percentage</Label>
                                              <Input
                                                id="discount_percentage"
                                                name="discount_percentage"
                                              />
                                            </FormGroup>
                                          </Col>
                                          :
                                          null
                                      }
                                    </Row>
                                    <Row>
                                      <Col lg={6} className="mt-4">
                                        <FormGroup>
                                          <Label htmlFor="discount_amount">Discount Amount</Label>
                                          <Input
                                            id="discount_amount"
                                            name="discount_amount"
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="total-item p-2">
                                    <Row>
                                      <Col lg={6}>
                                        <h5 className="mb-0 text-right">Total Net</h5>
                                      </Col>
                                      <Col lg={6} className="text-right">
                                        <label className="mb-0">{initValue.total_net}</label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="total-item p-2">
                                    <Row>
                                      <Col lg={6}>
                                        <h5 className="mb-0 text-right">Total Vat</h5>
                                      </Col>
                                      <Col lg={6} className="text-right">
                                        <label className="mb-0">{initValue.customerVATAmount}</label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="total-item p-2">
                                    <Row>
                                      <Col lg={6}>
                                        <h5 className="mb-0 text-right">Total</h5>
                                      </Col>
                                      <Col lg={6} className="text-right">
                                        <label className="mb-0">{initValue.totalAmount}</label>
                                      </Col>
                                    </Row>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Create
                              </Button>
                                  <Button type="submit" color="primary" className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState({ createMore: true })
                                      props.handleSubmit()
                                    }}>
                                    <i className="fa fa-repeat"></i> Create and More
                              </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/expense/customer-invoice') }}>
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

        <CustomerModal openCustomerModal={openCustomerModal} closeCustomerModal={this.closeCustomerModal} />

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCustomerInvoice)
