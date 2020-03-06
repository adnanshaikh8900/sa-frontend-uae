import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
} from "reactstrap";
import Select from "react-select";
import _ from "lodash";
import { selectOptionsFactory } from "utils";
import { Formik } from "formik";
import {
  BootstrapTable,
  TableHeaderColumn,
  SearchField
} from "react-bootstrap-table";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import { Loader, ConfirmDeleteModal } from "components";
import { SupplierModal } from "../../sections";

import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

import "./style.scss";
import * as PaymentActions from "../../actions";
import * as DetailPaymentActions from "./actions";
import { CommonActions } from "services/global";

const mapStateToProps = state => {
  return {
    bank_list: state.payment.bank_list,
    currency_list: state.payment.currency_list,
    supplier_list: state.payment.supplier_list,
    project_list: state.payment.project_list,
    invoice_list: state.payment.invoice_list
  };
};
const mapDispatchToProps = dispatch => {
  return {
    commonActions: bindActionCreators(CommonActions, dispatch),
    detailPaymentActions: bindActionCreators(DetailPaymentActions, dispatch),
    paymentActions: bindActionCreators(PaymentActions, dispatch)
  };
};

class DetailPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dialog: null,
      initValue: {},
      openSupplierModal: false,
      selectedSupplier: "",
      contactType: 1,
      current_payment_id: null
    };

    this.regEx = /^[0-9\d]+$/;


    this.initializeData = this.initializeData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleChange = this.handleChange.bind(this)
    this.deletePayment = this.deletePayment.bind(this);
    this.removePayment = this.removePayment.bind(this);
    this.removeDialog = this.removeDialog.bind(this);
    this.closeSupplierModal = this.closeSupplierModal.bind(this);
    this.openSupplierModal = this.openSupplierModal.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  componentDidMount() {
    this.initializeData();
  }

  initializeData() {
    if (this.props.location.state && this.props.location.state.id) {
      this.props.detailPaymentActions
        .getPaymentById(this.props.location.state.id)
        .then(res => {
          if (res.status === 200) {
            this.getCurrentUser({ value: res.data.supplierId });
            this.props.paymentActions.getCurrencyList();
            this.props.paymentActions.getBankList();
            this.props.paymentActions.getSupplierContactList(
              this.state.contactType
            );
            this.props.paymentActions.getProjectList();
            this.props.paymentActions.getSupplierInvoiceList();
            this.setState({
              current_payment_id: this.props.location.state.id,
              initValue: {
                paymentId: res.data.paymentId,
                supplier: res.data.contactId ? res.data.contactId : "",
                invoiceId: res.data.invoiceId ? res.data.invoiceId : "",
                invoiceAmount: res.data.invoiceAmount
                  ? res.data.invoiceAmount
                  : "",
                currency: res.data.currencyCode ? res.data.currencyCode : "",
                project: res.data.projectId ? res.data.projectId : "",
                payment_date: res.data.paymentDate ? res.data.paymentDate : "",
                description: res.data.description ? res.data.description : "",
                bank: res.data.bankAccountId ? res.data.bankAccountId : ""
              },
              selectedSupplier: res.data.contactId,
              loading: false
            });
          }
        })
        .catch(err => {
          this.props.history.push("/admin/expense/payment");
        });
    } else {
      this.props.history.push("/admin/expense/payment");
    }
  }

  handleSubmit(data) {
    const {
      bank,
      supplier,
      invoiceId,
      invoiceAmount,
      payment_date,
      currency,
      project,
      description
    } = data;

    const postData = {
      paymentId: this.state.initValue.paymentId,
      paymentDate: payment_date !== null ? payment_date : "",
      description: description,
      invoiceId: invoiceId && invoiceId.value ? invoiceId.value : "",
      invoiceAmount: invoiceAmount,
      bankAccountId: bank && bank.value ? bank.value : "",
      contactId: this.state.selectedSupplier.value
        ? this.state.selectedSupplier.value
        : supplier && supplier.value
          ? supplier.value
          : "",
      currencyCode: currency && currency.value ? currency.value : "",
      projectId: project && project.value ? project.value : ""
    };
    this.props.detailPaymentActions
      .updatePayment(postData)
      .then(res => {
        this.props.commonActions.tostifyAlert(
          "success",
          "Payment Update Successfully."
        );
        this.props.history.push("/admin/expense/payment");
      })
      .catch(err => {
        this.props.commonActions.tostifyAlert(
          "error",
          err && err.data ? err.data.message : null
        );
      });
  }

  openSupplierModal(e) {
    e.preventDefault();
    this.setState({ openSupplierModal: true });
  }

  getCurrentUser(data) {
    let option;
    if (data.label || data.value) {
      option = data;
    } else {
      option = {
        label: `${data.firstName} ${data.middleName} ${data.lastName}`,
        value: data.contactId
      };
    }
    this.setState({
      selectedSupplier: option
    });
  }

  closeSupplierModal(res) {
    if (res) {
      this.props.paymentActions.getSupplierContactList(this.state.contactType);
    }
    this.setState({ openSupplierModal: false });
  }

  deletePayment() {
    this.setState({
      dialog: (
        <ConfirmDeleteModal
          isOpen={true}
          okHandler={this.removePayment}
          cancelHandler={this.removeDialog}
        />
      )
    });
  }

  removePayment() {
    const { current_payment_id } = this.state;
    this.props.detailPaymentActions
      .deletePayment(current_payment_id)
      .then(res => {
        if (res.status === 200) {
          this.props.commonActions.tostifyAlert(
            "success",
            "Payment Deleted Successfully"
          );
          this.props.history.push("/admin/expense/payment");
        }
      })
      .catch(err => {
        this.props.commonActions.tostifyAlert(
          "error",
          err && err.data ? err.data.message : null
        );
      });
  }

  removeDialog() {
    this.setState({
      dialog: null
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.supplier_list !== this.props.supplier_list) {
      const { selectedSupplier } = this.state;
      prevProps.supplier_list.map(item =>
        item.value === selectedSupplier.value ? this.getCurrentUser(item) : ""
      );
    }
  }

  render() {
    const { data, loading, initValue, dialog, selectedSupplier } = this.state;
    const {
      currency_list,
      bank_list,
      supplier_list,
      invoice_list,
      project_list
    } = this.props;

    return (
      <div className="detail-payment-screen">
        <div className="animated fadeIn">
          {dialog}
          {loading ? (
            <Loader />
          ) : (
              <Row>
                <Col lg={12} className="mx-auto">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col lg={12}>
                          <div className="h4 mb-0 d-flex align-items-center">
                            <i className="fas fa-money-check" />
                            <span className="ml-2">Update Payment</span>
                          </div>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Formik
                        initialValues={initValue}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values);
                          resetForm(initValue);
                        }}
                        // validationSchema={Yup.object().shape({
                        //   currency: Yup.object().shape({
                        //     label: Yup.string().required(),
                        //     value: Yup.string().required(),
                        //   }),
                        //   invoiceReferenceNo: Yup.string()
                        //   .required('Reference is Required'),
                        //   amount: Yup.string()
                        //   .required('Amount is Required'),
                        //   payment_date: Yup.string()
                        //     .required('Payment Date is Required'),
                        //   payment_due_date: Yup.string()
                        //     .required('Payment Due Date is Required'),
                        //   receiptNo: Yup.string()
                        //     .required('Receipt Number is Required'),
                        //   supplier: Yup.object().shape({
                        //     label: Yup.string().required(),
                        //     value: Yup.string().required(),
                        //   }),
                        //   project: Yup.object().shape({
                        //     label: Yup.string().required(),
                        //     value: Yup.string().required()
                        //   })
                        // })
                        // }
                        validationSchema={Yup.object().shape({
                          supplier: Yup.string().required("Supplier is required"),
                          invoiceId: Yup.string().required("Invoice Number is required"),
                          payment_date: Yup.date().required("Payment Date is Required"),
                          currency: Yup.string().required("Currency is Required"),
                          invoiceAmount: Yup.string()
                            .required("Invoice Amount is Required")
                            .matches(/^[0-9]*$/, "Enter a Valid Amount")
                        })}
                      >
                        {props => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={12}>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="supplier">
                                      <span className="text-danger">*</span>
                                        Supplier Name
                                    </Label>
                                      <Select
                                        className="select-default-width"
                                        id="supplier"
                                        name="supplier"
                                        options={
                                          supplier_list
                                            ? selectOptionsFactory.renderOptions(
                                              "label",
                                              "value",
                                              supplier_list,
                                              "Supplier Name"
                                            )
                                            : []
                                        }
                                        value={selectedSupplier}
                                        onChange={option => {
                                          props.handleChange("supplier")(option);
                                          this.getCurrentUser(option);
                                        }}
                                        className={
                                          props.errors.supplier &&
                                            props.touched.supplier
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.supplier && props.touched.supplier && (
                                        <div className="invalid-feedback">{props.errors.supplier}</div>
                                      )}
                                    </FormGroup>
                                    <Button
                                      type="button"
                                      color="primary"
                                      className="btn-square mr-3 mb-3"
                                      onClick={this.openSupplierModal}
                                    >
                                      <i className="fa fa-dot-circle-o"></i>{" "}
                                      Supplier
                                  </Button>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="invoiceId"><span className="text-danger">*</span>Invoice #</Label>
                                      <Select
                                        className="select-default-width"
                                        id="invoiceId"
                                        name="invoiceId"
                                        options={
                                          invoice_list
                                            ? selectOptionsFactory.renderOptions(
                                              "label",
                                              "value",
                                              invoice_list,
                                              "Invoice Number"
                                            )
                                            : []
                                        }
                                        value={props.values.invoiceId}
                                        onChange={option => {
                                          let data;
                                          // data = invoice_list.filter(item => item.invoiceId === option.value);
                                          // props.handleChange('amount')(data[0]['invoiceAmount'])
                                          props.handleChange("invoiceId")(option);
                                        }}
                                        className={
                                          props.errors.invoiceId &&
                                            props.touched.invoiceId
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.invoiceId && props.touched.invoiceId && (
                                        <div className="invalid-feedback">{props.errors.invoiceId}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="invoiceAmount">
                                      <span className="text-danger">*</span>
                                        Invoice Amount
                                    </Label>
                                      <Input
                                        // className="form-control"
                                        type="text"
                                        id="invoiceAmount"
                                        name="invoiceAmount"
                                        placeholder="Enter Amount"
                                        value={props.values.invoiceAmount ? props.values.invoiceAmount : ''}
                                        className={props.errors.invoiceAmount && props.touched.invoiceAmount ? "is-invalid" : ""}
                                        onChange={option => {
                                          if (
                                            option.target.value === "" ||
                                            this.regEx.test(option.target.value)
                                          )
                                            props.handleChange("invoiceAmount")(
                                              option
                                            );
                                        }}
                                      />
                                      {props.errors.invoiceAmount && props.touched.invoiceAmount && (
                                        <div className="invalid-feedback">{props.errors.invoiceAmount}</div>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="currency"><span className="text-danger">*</span>Currency</Label>
                                      <Select
                                        className="select-default-width"
                                        id="currency"
                                        name="currency"
                                        options={
                                          currency_list
                                            ? selectOptionsFactory.renderOptions(
                                              "currencyName",
                                              "currencyCode",
                                              currency_list,
                                              "Currency"
                                            )
                                            : []
                                        }
                                        value={props.values.currency}
                                        onChange={option =>
                                          props.handleChange("currency")(option)
                                        }
                                        className={
                                          props.errors.currency &&
                                            props.touched.currency
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.currency &&
                                        props.touched.currency && (
                                          <div className="invalid-feedback">
                                            {props.errors.currency}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="project">Project</Label>
                                      <Select
                                        className="select-default-width"
                                        id="project"
                                        name="project"
                                        options={
                                          project_list
                                            ? selectOptionsFactory.renderOptions(
                                              "label",
                                              "value",
                                              project_list,
                                              "Project"
                                            )
                                            : []
                                        }
                                        value={props.values.project}
                                        onChange={option =>
                                          props.handleChange("project")(option)
                                        }
                                        className={
                                          props.errors.project &&
                                            props.touched.project
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="payment_date">
                                      <span className="text-danger">*</span>
                                        Payment Date
                                    </Label>
                                      <div>
                                        <DatePicker
                                          className="form-control"
                                          id="payment_date"
                                          name="payment_date"
                                          placeholderText=""
                                          showMonthDropdown
                                          showYearDropdown
                                          dateFormat="dd/MM/yyyy"
                                          dropdownMode="select"
                                          onChange={option =>
                                            props.handleChange("payment_date")(
                                              option
                                            )
                                          }
                                          value={moment(
                                            props.values.payment_date
                                          ).format("DD-MM-YYYY")}
                                        // selected={props.values.payment_date}
                                        />
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="bank">Bank</Label>
                                      <Select
                                        className="select-default-width"
                                        id="bank"
                                        name="bank"
                                        options={
                                          bank_list && bank_list.data
                                            ? selectOptionsFactory.renderOptions(
                                              "name",
                                              "bankAccountId",
                                              bank_list.data,
                                              "Bank"
                                            )
                                            : []
                                        }
                                        value={props.values.bank}
                                        onChange={option =>
                                          props.handleChange("bank")(option)
                                        }
                                        className={
                                          props.errors.bank && props.touched.bank
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={8}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="description">
                                        Description
                                    </Label>
                                      <Input
                                        type="textarea"
                                        name="description"
                                        id="description"
                                        rows="6"
                                        placeholder="Description..."
                                        onChange={option =>
                                          props.handleChange("description")(
                                            option
                                          )
                                        }
                                        defaultValue={props.values.description}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                className="d-flex align-items-center justify-content-between flex-wrap mt-5"
                              >
                                <FormGroup>
                                  <Button
                                    type="button"
                                    name="button"
                                    color="danger"
                                    className="btn-square"
                                    onClick={this.deletePayment}
                                  >
                                    <i className="fa fa-trash"></i> Delete
                                </Button>
                                </FormGroup>
                                <FormGroup className="text-right">
                                  <Button
                                    type="button"
                                    name="submit"
                                    color="primary"
                                    className="btn-square mr-3"
                                    onClick={props.handleSubmit}
                                  >
                                    <i className="fa fa-dot-circle-o"></i> Update
                                </Button>
                                  <Button
                                    type="button"
                                    name="button"
                                    color="secondary"
                                    className="btn-square"
                                    onClick={() => {
                                      this.props.history.push(
                                        "/admin/expense/payment"
                                      );
                                    }}
                                  >
                                    <i className="fa fa-ban"></i> Cancel
                                </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
        </div>
        <SupplierModal
          openSupplierModal={this.state.openSupplierModal}
          closeSupplierModal={e => {
            this.closeSupplierModal(e);
          }}
          getCurrentUser={e => this.getCurrentUser(e)}
          createSupplier={this.props.paymentActions.createSupplier}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailPayment);
