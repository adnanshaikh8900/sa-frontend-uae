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
  NavLink
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'
import { Formik, Field } from 'formik';
import * as Yup from 'yup'
import * as SupplierInvoiceDetailActions from './actions';
import * as  SupplierInvoiceActions from "../../actions";

import { SupplierModal } from '../../sections'
import { Loader, ConfirmDeleteModal } from 'components'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import {
  CommonActions
} from 'services/global'
import {
  selectOptionsFactory
} from 'utils'

import './style.scss'
import moment from 'moment'
import API_ROOT_URL from '../../../../constants/config'


const mapStateToProps = (state) => {
  return ({
    project_list: state.supplier_invoice.project_list,
    contact_list: state.supplier_invoice.contact_list,
    currency_list: state.supplier_invoice.currency_list,
    vat_list: state.supplier_invoice.vat_list,
    supplier_list: state.supplier_invoice.supplier_list,
    country_list: state.supplier_invoice.country_list

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
        { value: 'FIXED', label: 'Fixed' },
        { value: 'PERCENTAGE', label: 'Percentage' }
      ],
      discount_option: '',
      data: [],
      initValue: {},
      contactType: 1,
      openSupplierModal: false,
      selectedContact: '',
      current_supplier_id: null,
      term: '',
      selectedType: '',
      discountPercentage: '',
      discountAmount: 0,
      fileName: ''
    }

    // this.options = {
    //   paginationPosition: 'top'
    // }
    this.formRef = React.createRef()
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
    this.deleteInvoice = this.deleteInvoice.bind(this)
    this.removeInvoice = this.removeInvoice.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
    this.checkedRow = this.checkedRow.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)


    this.termList = [
      { label: "Net 7", value: "NET_7" },
      { label: "Net 10", value: "NET_10" },
      { label: "Net 30", value: "NET_30" },
      { label: "Due on Receipt", value: "DUE_ON_RECEIPT" },
    ]

    this.file_size = 1024000;
    this.supported_format = [
      "",
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    this.regEx = /^[0-9\b]+$/;

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
    if (this.props.location.state && this.props.location.state.id) {
      this.props.supplierInvoiceDetailActions.getInvoiceById(this.props.location.state.id).then(res => {
        if (res.status === 200) {
          this.props.supplierInvoiceActions.getVatList()
          this.props.supplierInvoiceActions.getProjectList();
          this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
          this.props.supplierInvoiceActions.getCurrencyList();
          this.props.supplierInvoiceActions.getCountryList();

          this.setState({
            current_supplier_id: this.props.location.state.id,
            initValue: {
              receiptAttachmentDescription: res.data.receiptAttachmentDescription ? res.data.receiptAttachmentDescription : '',
              receiptNumber: res.data.receiptNumber ? res.data.receiptNumber : '',
              contact_po_number: res.data.contactPoNumber ? res.data.contactPoNumber : '',
              currency: res.data.currencyCode ? res.data.currencyCode : '',
              invoiceDueDate: res.data.invoiceDueDate ? moment(res.data.invoiceDueDate).format('DD/MM/YYYY') : '',
              invoiceDate: res.data.invoiceDate ? moment(res.data.invoiceDate).format('DD/MM/YYYY') : '',
              contactId: res.data.contactId ? res.data.contactId : '',
              project: res.data.projectId ? res.data.projectId : '',
              invoice_number: res.data.referenceNumber ? res.data.referenceNumber : '',
              total_net: 0,
              invoiceVATAmount: res.data.totalVatAmount ? res.data.totalVatAmount : 0,
              totalAmount: res.data.totalAmount ? res.data.totalAmount : 0,
              notes: res.data.notes ? res.data.notes : '',
              lineItemsString: res.data.invoiceLineItems ? res.data.invoiceLineItems : [],
              discount: res.data.discount ? res.data.discount : 0,
              discountPercentage: res.data.discountPercentage ? res.data.discountPercentage : 0,
              discountType: res.data.discountType ? res.data.discountType : '',
              term: res.data.term ? res.data.term : '',
              fileName: res.data.fileName ? res.data.fileName : '',
              filePath: res.data.filePath ? res.data.filePath : '',
            },
            discountAmount: res.data.discount ? res.data.discount : 0,
            discountPercentage: res.data.discountPercentage ? res.data.discountPercentage : 0,
            data: res.data.invoiceLineItems ? res.data.invoiceLineItems : [],
            selectedContact: res.data.contactId ? res.data.contactId : '',
            term: res.data.term ? res.data.term : '',

            loading: false
          }, () => {
            if (this.state.data.length > 0) {
              this.calTotalNet(this.state.data);
              const { data } = this.state
              const idCount = data.length > 0 ? Math.max.apply(Math, data.map((item) => { return item.id; })) : 0
              this.setState({
                idCount: idCount
              })
            } else {
              this.setState({
                idCount: 0
              })
            }
          }
          )
        }
      })
    } else {
      this.props.history.push('/admin/expense/supplier-invoice')
    }
  }

  calTotalNet(data) {
    let total_net = 0
    data.map(obj => {
      total_net = +(total_net + (+obj.unitPrice) * obj.quantity);
      return obj
    })
    this.setState({
      initValue: Object.assign(this.state.initValue, { total_net: total_net })
    })
  }


  renderDescription(cell, row, props) {
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
      return obj
    });

    return (
      <Field name={`lineItemsString.${idx}.description`}
        render={({ field, form }) => (
          <Input

            type="text"
            value={row['description'] !== '' ? row['description'] : ''}
            onChange={(e) => {
              this.selectItem(e, row, 'description', form, field, props)
            }}
            placeholder="Description"
            className={`form-control 
            ${props.errors.lineItemsString && props.errors.lineItemsString[idx] &&
                props.errors.lineItemsString[idx].description &&
                Object.keys(props.touched).length > 0 && props.touched.lineItemsString &&
                props.touched.lineItemsString[idx] &&
                props.touched.lineItemsString[idx].description ? "is-invalid" : ""}`}
          />
        )}
      />
    )
  }

  renderQuantity(cell, row, props) {
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
      return obj
    });

    return (
      <Field name={`lineItemsString.${idx}.quantity`}
        render={({ field, form }) => (
          <Input
            type="text"
            value={row['quantity'] !== 0 ? row['quantity'] : 0}
            onChange={(e) => {
              if (e.target.value === '' || this.regEx.test(e.target.value)) this.selectItem(e, row, 'quantity', form, field, props)
            }
            }
            placeholder="Quantity"
            className={`form-control 
           						${props.errors.lineItemsString && props.errors.lineItemsString[idx] &&
                props.errors.lineItemsString[idx].quantity &&
                Object.keys(props.touched).length > 0 && props.touched.lineItemsString &&
                props.touched.lineItemsString[idx] &&
                props.touched.lineItemsString[idx].quantity ? "is-invalid" : ""}`}
          />
        )}
      />
    )
  }

  renderUnitPrice(cell, row, props) {
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
      return obj
    });

    return (
      <Field name={`lineItemsString.${idx}.unitPrice`}
        render={({ field, form }) => (
          <Input
            type="text"
            value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
            onChange={(e) => { if (e.target.value === '' || this.regEx.test(e.target.value)) this.selectItem(e, row, 'unitPrice', form, field, props) }}
            placeholder="Unit Price"
            className={`form-control 
                       ${props.errors.lineItemsString && props.errors.lineItemsString[idx] &&
                props.errors.lineItemsString[idx].unitPrice &&
                Object.keys(props.touched).length > 0 && props.touched.lineItemsString &&
                props.touched.lineItemsString[idx] &&
                props.touched.lineItemsString[idx].unitPrice ? "is-invalid" : ""}`}
          />
        )}
      />
    )
  }


  renderSubTotal(cell, row) {
    return (
      <label className="mb-0">{row.subTotal.toFixed(2)}</label>
    )
  }


  addRow() {
    const data = [...this.state.data]
    this.setState({
      data: data.concat({
        id: this.state.idCount + 1,
        description: '',
        quantity: '',
        unitPrice: '',
        vatCategoryId: '',
        subTotal: 0
      }), idCount: this.state.idCount + 1
    }, () => {
      this.formRef.current.setFieldValue('lineItemsString', this.state.data, true)
    })
  }

  selectItem(e, row, name, form, field, props) {
    e.preventDefault();
    let data = this.state.data
    let idx
    data.map((obj, index) => {
      if (obj.id === row.id) {
        obj[name] = e.target.value
        idx = index
      }
      return obj
    });
    if (name === 'unitPrice' || name === 'vatCategoryId' || name === 'quantity') {
      form.setFieldValue(field.name, this.state.data[idx][name], true)
      this.updateAmount(data, props);
    } else {
      this.setState({ data: data }, () => {
        form.setFieldValue(field.name, this.state.data[idx][name], true)
      });
    }

  }

  renderVat(cell, row, props) {
    const { vat_list } = this.props;
    let vatList = vat_list.length ? [{ id: '', vat: 'Select Vat' }, ...vat_list] : vat_list
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
      return obj
    });

    return (

      <Field name={`lineItemsString.${idx}.vatCategoryId`}
        render={({ field, form }) => (

          <Input type="select" onChange={(e) => {
            this.selectItem(e, row, 'vatCategoryId', form, field, props)
            // this.formRef.current.props.handleChange(field.name)(e.value)
          }} value={row.vatCategoryId}
            className={`form-control 
            ${props.errors.lineItemsString && props.errors.lineItemsString[idx] &&
                props.errors.lineItemsString[idx].vatCategoryId &&
                Object.keys(props.touched).length > 0 && props.touched.lineItemsString &&
                props.touched.lineItemsString[idx] &&
                props.touched.lineItemsString[idx].vatCategoryId ? "is-invalid" : ""}`}
          >
            {vatList ? vatList.map(obj => {
              // obj.name = obj.name === 'default' ? '0' : obj.name
              return <option value={obj.id} key={obj.id}>{obj.vat}</option>
            }) : ''}
          </Input>

        )}
      />
    )
  }


  deleteRow(e, row, props) {
    const id = row['id'];
    let newData = []
    e.preventDefault();
    const data = this.state.data
    newData = data.filter(obj => obj.id !== id);
    props.setFieldValue('lineItemsString', newData, true)
    this.updateAmount(newData, props)
  }

  renderActions(cell, rows, props) {
    return (
      <Button
        size="sm"
        className="btn-twitter btn-brand icon"
        disabled={this.state.data.length === 1 ? true : false}
        onClick={(e) => { this.deleteRow(e, rows, props) }}
      >
        <i className="fas fa-trash"></i>
      </Button>
    )
  }

  checkedRow() {
    if (this.state.data.length > 0) {
      let length = this.state.data.length - 1
      let temp = Object.values(this.state.data[length]).indexOf('');
      if (temp > -1) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }


  updateAmount(data, props) {
    const { vat_list } = this.props;
    let total_net = 0;
    let total = 0;
    let total_vat = 0;
    const { discountPercentage, discountAmount } = this.state

    data.map(obj => {
      const index = obj.vatCategoryId !== '' ? vat_list.findIndex(item => item.id === (+obj.vatCategoryId)) : '';
      const vat = index !== '' ? vat_list[index].vat : 0
      // let val = (((+obj.unitPrice) * vat) / 100)
      let val = ((((+obj.unitPrice) * vat) * obj.quantity) / 100)
      obj.subTotal = (obj.unitPrice && obj.vatCategoryId) ? (((+obj.unitPrice) * obj.quantity) + val) : 0;
      total_net = +(total_net + (+obj.unitPrice) * obj.quantity);
      total_vat = +((total_vat + val));
      total = (total_vat + total_net);

      return obj
    })
    const discount = props.values.discountType === 'PERCENTAGE' ? (total_net * discountPercentage) / 100 : discountAmount

    this.setState({
      data: data,
      initValue: {
        ...this.state.initValue, ...{
          total_net: total_net,
          invoiceVATAmount: total_vat,
          discount: total_net > discount ? discount : 0,
          totalAmount: total_net > discount ? total - discount : total
        }
      }
    }, () => {
      if (props.values.discountType === 'PERCENTAGE') {
        this.formRef.current.setFieldValue('discount', discount)
      }
    })
  }

  handleSubmit(data) {
    const { current_supplier_id, term } = this.state;
    const {
      receiptAttachmentDescription,
      receiptNumber,
      contact_po_number,
      currency,
      invoiceDueDate,
      invoiceDate,
      contactId,
      project,
      invoice_number,
      notes,
      discount,
      discountType,
      discountPercentage,
    } = data

    let formData = new FormData();
    formData.append("type", 1);
    formData.append("invoiceId", current_supplier_id);
    formData.append("referenceNumber", invoice_number ? invoice_number : "");
    formData.append("invoiceDate", typeof invoiceDate === "string" ? moment(invoiceDate, 'DD/MM/YYYY').toDate() : invoiceDate)
		formData.append("invoiceDueDate", typeof invoiceDueDate === "string" ? moment(invoiceDueDate, 'DD/MM/YYYY').toDate() : invoiceDueDate)
    formData.append("receiptNumber", receiptNumber ? receiptNumber : "");
    formData.append("contactPoNumber", contact_po_number ? contact_po_number : "");
    formData.append("receiptAttachmentDescription", receiptAttachmentDescription ? receiptAttachmentDescription : "");
    formData.append("notes", notes ? notes : "");
    formData.append('lineItemsString', JSON.stringify(this.state.data));
    formData.append('totalVatAmount', this.state.initValue.invoiceVATAmount);
    formData.append('totalAmount', this.state.initValue.totalAmount);
    formData.append('discount', discount);
    formData.append('discountType', discountType);
    formData.append('term', term);

    if (discountType === 'PERCENTAGE') {
      formData.append('discountPercentage', discountPercentage);
    }
    if (contactId) {
      formData.append("contactId", contactId);
    }
    if (currency !== null && currency.value) {
      formData.append("currencyCode", currency.value);
    }
    if (project !== null && project.value) {
      formData.append("projectId", project.value);
    }
    if (this.uploadFile.files[0]) {
      formData.append("attachmentFile", this.uploadFile.files[0]);
    }
    this.props.supplierInvoiceDetailActions.updateInvoice(formData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Invoice Updated Successfully.')
      this.props.history.push('/admin/expense/supplier-invoice')

    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  deleteInvoice() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeInvoice}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeInvoice() {
    const { current_supplier_id } = this.state;
    this.props.supplierInvoiceDetailActions.deleteInvoice(current_supplier_id).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'Invoice Deleted Successfully')
        this.props.history.push('/admin/expense/supplier-invoice')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }


  openSupplierModal(e) {
    e.preventDefault()
    this.setState({ openSupplierModal: true })
  }

  setDate = (props, value) => {
    const { term } = this.state
    const val = term.split('_')
    const temp = val[val.length - 1] === 'Receipt' ? 1 : val[val.length - 1]
    const values = value ? value : moment(props.values.invoiceDate, 'DD/MM/YYYY').toDate()
    if (temp && values) {
      const date = (moment(values).add(temp - 1, 'days').format('DD/MM/YYYY'))
      props.setFieldValue('invoiceDueDate', date, true)
    }
  }

  getCurrentUser(data) {
    let option
    if (data && (data.label || data.value)) {
      option = data
    } else {
      option = {
        label: `${data.firstName} ${data.middleName} ${data.lastName}`,
        value: data.contactId,
      }
    }
    this.formRef.current.setFieldValue('contactId', option.value, true)

  }

  closeSupplierModal(res) {
    if (res) {
      this.props.supplierInvoiceActions.getSupplierList(this.state.contactType);
    }
    this.setState({ openSupplierModal: false })
  }

  handleFileChange(e, props) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
      };
      reader.readAsDataURL(file);
      props.setFieldValue('attachmentFile', file, true);
    }
  }

  render() {

    const {
      data,
      discountOptions,
      initValue,
      loading,
      dialog
    } = this.state

    const { project_list, currency_list, supplier_list } = this.props
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
                  {dialog}
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
                            ref={this.formRef}

                            onSubmit={(values, { resetForm }) => {
                              this.handleSubmit(values)
                            }}
                            validationSchema={
                              Yup.object().shape({
                                invoice_number: Yup.string()
                                  .required("Invoice Number is Required"),
                                contactId: Yup.string()
                                  .required("Supplier is Required"),
                                term: Yup.string()
                                  .required("Term is Required"),
                                invoiceDate: Yup.string()
                                  .required('Invoice Date is Required'),
                                invoiceDueDate: Yup.string()
                                  .required('Invoice Due Date is Required'),
                                  currency: Yup.string()
                                  .required('Currency is Requsired'),
                                lineItemsString: Yup.array()
                                  .required('Atleast one invoice sub detail is mandatory')
                                  .of(Yup.object().shape({
                                    description: Yup.string().required("Value is Required"),
                                    quantity: Yup.number().required("Value is Required"),
                                    unitPrice: Yup.number().required("Value is Required"),
                                    vatCategoryId: Yup.string().required("Value is Required"),
                                  })),
                                attachmentFile: Yup.mixed()
                                  .test(
                                    "fileType",
                                    "*Unsupported File Format",
                                    value => {
                                      value && this.setState({
                                        fileName: value.name
                                      });
                                      if (
                                        !value || (value &&
                                          this.supported_format.includes(value.type))
                                      ) {
                                        return true;
                                      } else {
                                        return false;
                                      }
                                    }
                                  )
                                  .test(
                                    "fileSize",
                                    "*File Size is too large",
                                    value => {
                                      if (!value || (value && value.size <= this.file_size)) {
                                        return true;
                                      } else {
                                        return false;
                                      }
                                    }
                                  )
                              })}
                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit}>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="invoice_number"><span className="text-danger">*</span>Invoice Number</Label>
                                      <Input
                                        type="text"
                                        id="invoice_number"
                                        name="invoice_number"
                                        placeholder=""
                                        disabled
                                        value={props.values.invoice_number}
                                        onChange={(value) => {
                                          props.handleChange("invoice_number")(value)
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
                                        options={project_list ? selectOptionsFactory.renderOptions('label', 'value', project_list, 'Project') : []}
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
                                      <Label htmlFor="contactId"><span className="text-danger">*</span>Supplier Name</Label>
                                      <Select
                                        id="contactId"
                                        name="contactId"
                                        onBlur={props.handlerBlur}
                                        options={supplier_list ? selectOptionsFactory.renderOptions('label', 'value', supplier_list, 'Supplier Name') : []}
                                        value={props.values.contactId}
                                        onChange={(option) => {
                                          if (option && option.value) {
                                            props.handleChange('contactId')(option.value)
                                          } else {
                                            props.handleChange('contactId')('')
                                          }
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
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="term"><span className="text-danger">*</span>Terms <i className="fa fa-question-circle"></i></Label>
                                      <Select
                                        options={this.termList ? selectOptionsFactory.renderOptions('label', 'value', this.termList, 'Terms') : []}
                                        id="term"
                                        name="term"
                                        value={this.state.term}
                                        onChange={option => {
                                          props.handleChange('term')(option)
                                          if (option.value === '') {
                                            this.setState({
                                              term: option.value
                                            })
                                            props.setFieldValue('invoiceDueDate', '');
                                          } else {
                                            this.setState({
                                              term: option.value
                                            }, () => {
                                              this.setDate(props, '')
                                            })
                                          }
                                        }}
                                        className={
                                          props.errors.term && props.touched.term
                                            ? 'is-invalid'
                                            : ''
                                        }
                                      />
                                      {props.errors.term && props.touched.term && (
                                        <div className="invalid-feedback">{props.errors.term}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="date"><span className="text-danger">*</span>Invoice Date</Label>
                                      <DatePicker
                                        id="invoiceDate"
                                        name="invoiceDate"
                                        placeholderText="Invoice Date"
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        dropdownMode="select"
                                        value={props.values.invoiceDate}
                                        onChange={(value) => {
                                          props.handleChange("invoiceDate")(moment(value).format('DD/MM/YYYY'))
                                          this.setDate(props, value)
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
                                          id="invoiceDueDate"
                                          name="invoiceDueDate"
                                          placeholderText="Invoice Due Date"
                                          value={props.values.invoiceDueDate}
                                          showMonthDropdown
                                          showYearDropdown
                                          disabled
                                          dateFormat="dd/MM/yyyy"
                                          dropdownMode="select"
                                          onChange={(value) => {
                                            props.handleChange("invoiceDueDate")(value)
                                          }}
                                          className={`form-control ${props.errors.invoiceDueDate && props.touched.invoiceDueDate ? "is-invalid" : ""}`}
                                        />
                                        {props.errors.invoiceDueDate && props.touched.invoiceDueDate && (
                                          <div className="invalid-feedback">{props.errors.invoiceDueDate}</div>
                                        )}
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="currency"><span className="text-danger">*</span>Currency</Label>
                                      <Select
                                        options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                        id="currency"
                                        name="currency"
                                        value={props.values.currency}
                                        onChange={option => props.handleChange('currency')(option)}
                                        className={`${props.errors.currency && props.touched.currency ? "is-invalid" : ""}`}
                                        />
                                        {props.errors.currency && props.touched.currency && (
                                          <div className="invalid-feedback">{props.errors.currency}</div>
                                        )}
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
                                          <Field name="attachmentFile"
                                            render={({ field, form }) => (
                                              <div>
                                                <Label>Reciept Attachment</Label> <br />
                                                <div className="file-upload-cont">
                                                  <Button color="primary" onClick={() => { document.getElementById('fileInput').click() }} className="btn-square mr-3">
                                                    <i className="fa fa-upload"></i> Upload
                                         		   </Button>
                                                  <input id="fileInput" ref={ref => {
                                                    this.uploadFile = ref;
                                                  }} type="file" style={{ display: 'none' }} onChange={(e) => {
                                                    this.handleFileChange(e, props)
                                                  }} />
                                                  {this.state.fileName ? this.state.fileName : (
                                                    <NavLink href={`${API_ROOT_URL.API_ROOT_URL}${initValue.filePath}`} download={this.state.initValue.fileName} style={{ fontSize: '0.875rem' }} target="_blank">{this.state.initValue.fileName}</NavLink>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          />
                                          {props.errors.attachmentFile && (
                                            <div className="invalid-file">{props.errors.attachmentFile}</div>
                                          )}
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>

                                <hr />
                                <Row>
                                  <Col lg={12} className="mb-3">
                                    <Button color="primary" className={`btn-square mr-3 ${this.checkedRow() ? `disabled-cursor` : ``} `} onClick={this.addRow}
                                      title={this.checkedRow() ? `Please add detail to add more` : ''}
                                      disabled={this.checkedRow() ? true : false}
                                    >
                                      <i className="fa fa-plus"></i> Add More
                            </Button>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12}>
                                    {props.errors.lineItemsString && props.touched.lineItemsString && typeof props.errors.lineItemsString === 'string' && (
                                      <div className={props.errors.lineItemsString ? "is-invalid" : ""}>
                                        <div className="invalid-feedback">{props.errors.lineItemsString}</div>
                                      </div>
                                    )}
                                    <BootstrapTable
                                      options={this.options}
                                      data={data}
                                      version="4"
                                      hover
                                      keyField="id"
                                      className="invoice-create-table"
                                    >
                                      <TableHeaderColumn
                                        width="55"
                                        dataAlign="center"
                                        dataFormat={(cell, rows) => this.renderActions(cell, rows, props)}
                                      >
                                      </TableHeaderColumn>
                                      <TableHeaderColumn

                                        width="0"
                                        dataField="product_name"
                                        dataFormat={this.renderProductName}
                                      >
                                        Product
                              </TableHeaderColumn>
                                      <TableHeaderColumn

                                        dataField="description"
                                        dataFormat={(cell, rows) => this.renderDescription(cell, rows, props)}
                                      >
                                        Description
                              </TableHeaderColumn>
                                      <TableHeaderColumn
                                        dataField="quantity"
                                        dataFormat={(cell, rows) => this.renderQuantity(cell, rows, props)}

                                      >
                                        Quantity
                              </TableHeaderColumn>
                                      <TableHeaderColumn
                                        dataField="unitPrice"
                                        dataFormat={(cell, rows) => this.renderUnitPrice(cell, rows, props)}

                                      >
                                        Unit Price (All)
                              </TableHeaderColumn>
                                      <TableHeaderColumn
                                        dataField="vat"
                                        dataFormat={(cell, rows) => this.renderVat(cell, rows, props)}
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
                                {data.length > 0 &&
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
                                                  <Label htmlFor="discountType">Discount Type</Label>
                                                  <Select
                                                    className="select-default-width"
                                                    options={discountOptions}
                                                    id="discountType"
                                                    name="discountType"
                                                    value={props.values.discountType}
                                                    onChange={(item) => {
                                                      props.handleChange('discountPercentage')('')
                                                      props.handleChange('discountType')(item.value)
                                                      props.setFieldValue('discount', 0)

                                                      this.setState({
                                                        discountPercentage: 0,
                                                        discountAmount: 0
                                                      }, () => {
                                                        this.updateAmount(this.state.data, props)
                                                      })
                                                    }}
                                                  />
                                                </FormGroup>
                                              </Col>
                                              {
                                                props.values.discountType === 'PERCENTAGE' && (
                                                  <Col lg={6}>
                                                    <FormGroup>
                                                      <Label htmlFor="discountPercentage">Percentage</Label>
                                                      <Input
                                                        id="discountPercentage"
                                                        name="discountPercentage"
                                                        placeholder="Discount Percentage"
                                                        type="text"
                                                        value={props.values.discountPercentage}
                                                        onChange={(e) => {
                                                          if (e.target.value === '' || this.regEx.test(e.target.value)) {
                                                            props.handleChange('discountPercentage')(e)
                                                            this.setState({
                                                              discountPercentage: e.target.value,
                                                            }, () => { this.updateAmount(this.state.data, props) })
                                                          }
                                                        }}
                                                      />
                                                    </FormGroup>
                                                  </Col>
                                                )
                                              }
                                            </Row>
                                            <Row>
                                              <Col lg={6} className="mt-4">
                                                <FormGroup>
                                                  <Label htmlFor="discount">Discount Amount</Label>
                                                  <Input
                                                    id="discount"
                                                    name="discount"
                                                    type="text"
                                                    disabled={props.values.discountType && props.values.discountType === 'Percentage' ? true : false}
                                                    placeholder="Discount Amounts"
                                                    value={props.values.discount}
                                                    onChange={option => {
                                                      if (option.target.value === '' || this.regEx.test(option.target.value)) {
                                                        props.handleChange('discount')(option)
                                                        this.setState({
                                                          discountAmount: +option.target.value
                                                        }, () => {
                                                          this.updateAmount(this.state.data, props)
                                                        })
                                                      }
                                                    }}
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
                                                <label className="mb-0">{(initValue.total_net).toFixed(2)}</label>
                                              </Col>
                                            </Row>
                                          </div>
                                          <div className="total-item p-2">
                                            <Row>
                                              <Col lg={6}>
                                                <h5 className="mb-0 text-right">Total Vat</h5>
                                              </Col>
                                              <Col lg={6} className="text-right">
                                                <label className="mb-0">{(initValue.invoiceVATAmount).toFixed(2)}</label>
                                              </Col>
                                            </Row>
                                          </div>
                                          <div className="total-item p-2">
                                            <Row>
                                              <Col lg={6}>
                                                <h5 className="mb-0 text-right">Discount</h5>
                                              </Col>
                                              <Col lg={6} className="text-right">
                                                <label className="mb-0">{(this.state.initValue.discount).toFixed(2)}</label>
                                              </Col>
                                            </Row>
                                          </div>
                                          <div className="total-item p-2">
                                            <Row>
                                              <Col lg={6}>
                                                <h5 className="mb-0 text-right">Total</h5>
                                              </Col>
                                              <Col lg={6} className="text-right">
                                                <label className="mb-0">{(initValue.totalAmount).toFixed(2)}</label>
                                              </Col>
                                            </Row>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                  )
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
          currency_list={this.props.currency_list}
          country_list={this.props.country_list}
					getStateList={this.props.supplierInvoiceActions.getStateList}

        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailSupplierInvoice)