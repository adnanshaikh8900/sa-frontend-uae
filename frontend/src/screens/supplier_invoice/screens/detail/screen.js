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
import * as Yup from 'yup'
import * as SupplierInvoiceDetailActions from './actions';
import * as  SupplierInvoiceActions from "../../actions";

import { SupplierModal } from '../../sections'
import { Loader } from 'components'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import {
  CommonActions
} from 'services/global'
import {
  selectOptionsFactory,
  filterFactory
} from 'utils'

import './style.scss'
import moment from 'moment'

const mapStateToProps = (state) => {
  return ({
    project_list: state.supplier_invoice.project_list,
    contact_list: state.supplier_invoice.contact_list,
    currency_list: state.supplier_invoice.currency_list,
    vat_list: state.supplier_invoice.vat_list,
    supplier_list: state.supplier_invoice.supplier_list,

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    supplierInvoiceActions: bindActionCreators(SupplierInvoiceActions, dispatch),
    supplierInvoiceDetailActions: bindActionCreators(SupplierInvoiceDetailActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}

class DetailSupplierInvoice extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dialog: false,
      discountOptions: [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Percentage', label: 'Percentage' }
      ],
      discount_option: '',
      id: props.location.state.id,
      data: [],
      initValue: {},
      contactType: 1,
      openSupplierModal: false,
      selectedContact: ''
    }

    // this.options = {
    //   paginationPosition: 'top'
    // }

    this.initializeData = this.initializeData.bind(this)
    this.renderActions = this.renderActions.bind(this)
    this.renderDescription = this.renderDescription.bind(this)
    this.renderQuantity = this.renderQuantity.bind(this)
    this.renderUnitPrice = this.renderUnitPrice.bind(this)
    this.renderVat = this.renderVat.bind(this)
    this.renderSubTotal = this.renderSubTotal.bind(this)
    this.updateAmount = this.updateAmount.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.calTotalNet = this.calTotalNet.bind(this)

    this.closeSupplierModal = this.closeSupplierModal.bind(this)
    this.openSupplierModal = this.openSupplierModal.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
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

  componentDidMount() {
    this.initializeData();
  }

  initializeData() {
    const { id } = this.state;
    if (id) {
      this.props.supplierInvoiceDetailActions.getInvoiceById(id).then(res => {
        if (res.status === 200) {
          this.props.supplierInvoiceActions.getVatList()
          this.props.supplierInvoiceActions.getProjectList();
          this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
          this.props.supplierInvoiceActions.getCurrencyList();
          this.setState({
            initValue: {
              receiptAttachmentDescription: res.data.receiptAttachmentDescription ? res.data.receiptAttachmentDescription : '',
              receiptNumber: res.data.receiptNumber ? res.data.receiptNumber : '',
              contact_po_number: res.data.contactPoNumber ? res.data.contactPoNumber : '',
              currency: res.data.currencyCode ? res.data.currencyCode : '',
              invoiceDueDate: res.data.invoiceDueDate ? res.data.invoiceDueDate : '',
              invoiceDate: res.data.invoiceDate ? res.data.invoiceDate : '',
              contactId: res.data.contactId ? res.data.contactId : '',
              project: res.data.projectId ? res.data.projectId : '',
              invoice_reference_number: res.data.referenceNumber ? res.data.referenceNumber : '',
              total_net: 0,
              invoiceVATAmount: res.data.totalVatAmount ? res.data.totalVatAmount : '',
              totalAmount: res.data.totalAmount ? res.data.totalAmount : '',
              notes: res.data.notes ? res.data.notes : '',
              invoiceLineItems: res.data.invoiceLineItems ? res.data.invoiceLineItems : []
            },
            data: res.data.invoiceLineItems ? res.data.invoiceLineItems : [],
            selectedContact: res.data.contactId ? res.data.contactId : '',
            loading: false
          }, () => {
            this.calTotalNet(this.state.data);
            const { data } = this.state
            const idCount = data.length > 0 ? Math.max.apply(Math, data.map((item) => { return item.id; })) : 0
            this.setState({
              idCount: idCount
            })
          }
          )
        }
      })

    }
  }
  calTotalNet(data) {
    let total_net = 0
    data.map(obj => {
      total_net = +(total_net + (+obj.unitPrice) * obj.quantity);
    })
    this.setState({
      initValue: Object.assign(this.state.initValue, { total_net: total_net })
    })
  }


  renderDescription(cell, row) {
    return (
      <Input
        type="text"
        value={row['description'] !== '' ? row['description'] : ''}
        // defaultValue={row['description']}
        onChange={(e) => { this.selectItem(e, row, 'description') }}

      />
    )
  }

  renderQuantity(cell, row) {
    return (
      <Input
        type="number"
        value={row['quantity']}
        min="0"
        // defaultValue={row['quantity']}
        onChange={(e) => { this.selectItem(e, row, 'quantity') }}
      />
    )
  }

  renderUnitPrice(cell, row) {
    return (
      <Input
        type="number"
        value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
        // defaultValue={row['unitPrice']}
        onChange={(e) => { this.selectItem(e, row, 'unitPrice') }}
      />
    )
  }



  renderSubTotal(cell, row) {
    return (
      <label className="mb-0">{row.subTotal}</label>
    )
  }


  addRow() {
    const data = [...this.state.data]
    this.setState({
      data: data.concat({
        id: this.state.idCount + 1,
        description: '',
        quantity: 0,
        unitPrice: 0,
        vatCategoryId: '',
        subTotal: 0
      }), idCount: this.state.idCount + 1
    }, () => {
      console.log(this.state.data)
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
        {vat_list ? vat_list.map((obj, index) => {
          // obj.name = obj.name === 'default' ? '0' : obj.name
          return <option value={obj.id} key={obj.id}>{obj.name}</option>
        }) : []}
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
    console.log(vat_list)
    let total_net = 0;
    let total = 0;
    let total_vat = 0;
    data.map(obj => {
      const index = obj.vatCategoryId !== '' ? vat_list.findIndex(item => item.id === (+obj.vatCategoryId)) : -1;
      let vat = 0;
      let val = 0;
      console.log(typeof index)
      if (index !== '' && index !== -1) {
        vat = vat_list[index].vat
        val = ((((+obj.unitPrice) * vat) * obj.quantity) / 100)
        obj.subTotal = (obj.unitPrice && obj.vatCategoryId) ? (((+obj.unitPrice) * obj.quantity) + val) : '-';
      } else {
        console.log(index)
      }


      console.log(data)

      // console.log(index)

      total_net = +(total_net + (+obj.unitPrice) * obj.quantity);
      total_vat = +((total_vat + val)).toFixed(2);
      total = (total_vat + total_net).toFixed(2);

    })
    this.setState({
      data: data,
      initValue: {
        total_net: total_net,
        invoiceVATAmount: total_vat,
        totalAmount: total
      }
    })
  }

  handleSubmit(data) {
    const { id } = this.state;
    const {
      receiptAttachmentDescription,
      receiptNumber,
      contact_po_number,
      currency,
      invoiceDueDate,
      invoiceDate,
      contactId,
      project,
      invoice_reference_number,
      invoiceVATAmount,
      totalAmount,
      notes
    } = data

    let formData = new FormData();
    formData.append("type", 1);
    formData.append("invoiceId", id);
    formData.append("referenceNumber", invoice_reference_number !== null ? invoice_reference_number : "");
    formData.append("invoiceDate", typeof invoiceDate === "date" ? invoiceDate : moment(invoiceDate).toDate());
    formData.append("invoiceDueDate", typeof invoiceDueDate === "date" ? invoiceDueDate : moment(invoiceDueDate).toDate())
    formData.append("receiptNumber", receiptNumber !== null ? receiptNumber : "");
    formData.append("contactPoNumber", contact_po_number !== null ? contact_po_number : "");
    formData.append("receiptAttachmentDescription", receiptAttachmentDescription !== null ? receiptAttachmentDescription : "");
    formData.append("notes", notes !== null ? notes : "");
    formData.append('lineItemsString', JSON.stringify(this.state.data));
    formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
    formData.append('totalAmount', this.state.initValue.totalAmount);
    if (contactId !== null && contactId.value) {
      formData.append("contactId", contactId.value);
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
    this.props.supplierInvoiceDetailActions.updateInvoice(formData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Invoice Updated Successfully.')
      this.props.history.push('/admin/expense/supplier-invoice')

    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
  }

  openSupplierModal(e) {
    e.preventDefault()
    this.setState({ openSupplierModal: true })
  }

  getCurrentUser(data) {
    let option
    if (data.label || data.value) {
      option = data
    } else {
      option = {
        label: `${data.firstName} ${data.middleName} ${data.lastName}`,
        value: data.contactId,
      }
    }
    this.setState({
      selectedContact: option
    })
  }

  closeSupplierModal(res) {
    if (res) {
      this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
    }
    this.setState({ openSupplierModal: false })
  }

  render() {

    const {
      data,
      discountOptions,
      discount_option,
      initValue,
      selectedContact,
      loading
    } = this.state

    const { project_list, contact_list, currency_list, supplier_list } = this.props
    return (
      <div className="detail-supplier-invoice-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fas fa-address-book" />
                        <span className="ml-2">Update Invoice</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {loading ?
                    (
                      <Loader />
                    )
                    :
                    (
                      <Row>
                        <Col lg={12}>
                          <Formik
                            initialValues={this.state.initValue}
                            onSubmit={(values, { resetForm }) => {

                              this.handleSubmit(values)
                              // resetForm(initValue)

                              // this.setState({
                              //   selectedCurrency: null,
                              //   selectedProject: null,
                              //   selectedBankAccount: null,
                              //   selectedCustomer: null

                              // })
                            }}
                            validationSchema={
                              Yup.object().shape({
                                invoice_number: Yup.string()
                                  .required("Invoice Number is Required"),
                                contactId: Yup.string()
                                  .required("Supplier is Required"),
                                invoiceDate: Yup.date()
                                  .required('Invoice Date is Required'),
                              })}
                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit}>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="invoice_reference_number">Invoice Number</Label>
                                      <Input
                                        type="text"
                                        id="invoice_reference_number"
                                        name="invoice_reference_number"
                                        placeholder=""
                                        value={props.values.invoice_reference_number}
                                        onChange={(value) => {
                                          props.handleChange("invoice_reference_number")(value)
                                        }}
                                        className={
                                          props.errors.invoice_number && props.touched.invoice_number
                                            ? 'is-invalid'
                                            : ''
                                        }
                                      />
                                      {props.errors.invoice_number && props.touched.invoice_number && (
                                        <div className="invalid-feedback">{props.errors.invoice_number}</div>
                                      )}
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
                                      <Label htmlFor="contactId">Supplier Name</Label>
                                      <Select

                                        id="contactId"
                                        name="contactId"
                                        options={supplier_list ? selectOptionsFactory.renderOptions('label', 'value', supplier_list) : []}
                                        value={selectedContact}
                                        onChange={option => {
                                          props.handleChange('contactId')(option)
                                          this.getCurrentUser(option)
                                        }}
                                        className={
                                          props.errors.contactId && props.touched.contactId
                                            ? 'is-invalid'
                                            : ''
                                        }
                                      />
                                      {props.errors.contactId && props.touched.contactId && (
                                        <div className="invalid-feedback">{props.errors.contactId}</div>
                                      )}
                                    </FormGroup>
                                    <Button type="button" color="primary" className="btn-square mr-3 mb-3"
                                      onClick={this.openSupplierModal}
                                    >
                                      <i className="fa fa-plus"></i> Add a Supplier
                                    </Button>
                                  </Col>
                                </Row>
                                <hr />
                                {/* <Row>
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
                                  id="shippingContact"
                                  name="shippingContact"
                                  value={props.values.shippingContact}
                                  onChange={option => props.handleChange('shippingContact')(option)}                                
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <hr/> */}
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="date">Invoice Date</Label>
                                      <DatePicker
                                        id="invoiceDate"
                                        name="invoiceDate"
                                        placeholderText=""
                                        value={moment(props.values.invoiceDate).format('DD-MM-YYYY')}

                                        onChange={(value) => {
                                          props.handleChange("invoiceDate")(value)
                                        }}
                                        className={`form-control ${props.errors.invoiceDate && props.touched.invoiceDate ? "is-invalid" : ""}`}
                                      />
                                      {props.errors.invoiceDate && props.touched.invoiceDate && (
                                        <div className="invalid-feedback">{props.errors.invoiceDate}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="due_date">Invoice Due Date</Label>
                                      <div>
                                        <DatePicker
                                          className="form-control"
                                          id="invoiceDueDate"
                                          name="invoiceDueDate"
                                          placeholderText=""
                                          value={moment(props.values.invoiceDueDate).format('DD-MM-YYYY')}
                                          onChange={(value) => {
                                            props.handleChange("invoiceDueDate")(value)
                                          }}
                                        />
                                      </div>
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
                                        value={props.values.contact_po_number}
                                        onChange={(value) => { props.handleChange("contact_po_number")(value) }}
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
                                            defaultValue={props.values.receiptAttachmentDescription}

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
                                      keyField="id"
                                      className="invoice-detail-table"
                                    >
                                      <TableHeaderColumn
                                        width="55"
                                        dataAlign="center"
                                        dataFormat={this.renderActions}
                                      >
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
                                        dataField="unitPrice"
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
                                {data.length > 0 ?
                                  (
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
                                                <label className="mb-0">{initValue.invoiceVATAmount}</label>
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
                                  )
                                  :
                                  null
                                }
                                <Row>
                                  <Col lg={12} className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
                                    <FormGroup>
                                      <Button type="button" color="danger" className="btn-square" onClick={this.deleteInvoice}>
                                        <i className="fa fa-trash"></i> Delete
                                  </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                  </Button>
                                      <Button color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push('/admin/expense/supplier-invoice') }}>
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
                    )
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <SupplierModal
          openSupplierModal={this.state.openSupplierModal}
          closeSupplierModal={(e) => { this.closeSupplierModal(e) }}
          getCurrentUser={e => this.getCurrentUser(e)}
          createSupplier={this.props.supplierInvoiceActions.createSupplier}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailSupplierInvoice)