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
import * as Yup from "yup";
import _ from 'lodash'

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as ExpenseActions from '../../actions';
import * as ExpenseCreateActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    currency_list: state.expense.currency_list,
    project_list: state.expense.project_list,
    bank_account_list: state.expense.bank_account_list,
    customer_list: state.expense.customer_list,
    payment_list: state.expense.payment_list,
    vat_list: state.expense.vat_list,
    chart_of_account_list: state.expense.chart_of_account_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    expenseActions: bindActionCreators(ExpenseActions, dispatch),
    expenseCreateActions: bindActionCreators(ExpenseCreateActions, dispatch)
  })
}

class CreateExpense extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [{
        id: 0,
        transactionCategoryId: null,
        unitPrice: 0,
        vatCategoryId: null,
        subTotal: 0
      }
      ],
      idCount: 0,
      selectedCurrency: null,
      selectedProject: null,
      selectedBankAccount: null,
      selectedCustomer: null,
      selectedPayment: null,

      initValue: {
        expenseId: null,
        payee: '',
        expenseDate: null,
        currency: null,
        project: null,
        paymentDate: null,
        expenseAmount: null,
        expenseDescription: null,
        receiptNumber: null,
        attachmentFile: null,
        receiptAttachmentDescription: null,
        bank: null,
        total_net: 0,
        expenseVATAmount: 0,
        totalAmount: 0,
      },
      currentData: {}

    }


    this.initializeData = this.initializeData.bind(this)

    this.renderActions = this.renderActions.bind(this)
    this.renderProductName = this.renderProductName.bind(this)
    this.renderAmount = this.renderAmount.bind(this)
    this.renderVat = this.renderVat.bind(this)
    this.renderSubTotal = this.renderSubTotal.bind(this);
    this.addRow = this.addRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this)

    this.options = {
      paginationPosition: 'top'
    }
  }


  componentDidMount() {
    this.initializeData()
  }

  // addData() {
  //   this.setState({
  //     data: [{
  //       id: this.state.idCount + 1
  //     },
  //     ], idCount: this.state.idCount + 1
  //   })
  // }

  initializeData() {
    this.props.expenseActions.getBankAccountList();
    this.props.expenseActions.getVatList();
    this.props.expenseActions.getChartOfAccountList();
    this.props.expenseActions.getCurrencyList();
    this.props.expenseActions.getProjectList();
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

  selectItem(e, row, name) {
    e.preventDefault();
    const data = this.state.data
    data.map((obj, index) => {
      if (obj.id === row.id) {
        obj[name] = e.target.value
      }
    });
    if (name === 'unitPrice' || name === 'vatCategoryId') {
      this.updateAmount(data);
    } else {
      this.setState({ data: data });
    }

  }

  updateAmount(data) {
    const {vat_list} = this.props;
    let total_net = 0;
    let total = 0;
    let total_vat = 0;
    data.map(obj => {
      const index = obj.vatCategoryId !== null ? vat_list.findIndex(item => item.id === (+obj.vatCategoryId)) : '';
      const vat = index !== '' ? vat_list[index].vat : 0
      let val = (((+obj.unitPrice) * vat) / 100)
      obj.subTotal = (obj.unitPrice && obj.vatCategoryId) ? (+obj.unitPrice) + val : 0;
      total_net = +(total_net + (+obj.unitPrice));
      total_vat = +(total_vat + val).toFixed(2);
      total =  (total_vat + total_net).toFixed(2);

    })
    this.setState({
      data: data,
      initValue: {
        total_net: total_net,
        expenseVATAmount: total_vat,
        totalAmount: total
      }
    })
  }

  renderProductName(cell, row) {
    const { chart_of_account_list } = this.props;
    return (
      <div className="d-flex align-items-center">
        <Input type="select"
          onChange={(e) => { this.selectItem(e, row, 'transactionCategoryId') }}
          value={row.transactionCategoryId}
        >
          {chart_of_account_list ? chart_of_account_list.map(obj => {
            return <option value={obj.transactionCategoryId}>{obj.transactionCategoryDescription}</option>
          }) : ''}
        </Input>
        <Button
          size="sm"
          color="primary"
          className="btn-brand icon"
          onClick={() => { }}
        >
          <i className="fas fa-plus"></i>
        </Button>
      </div>
    )
  }

  renderAmount(cell, row) {
    return (
      <Input
        type="number"
        value={row['unitPrice'] !== 0? row['unitPrice'] : 0}
        defaultValue={row['unitPrice']}
        onChange={(e) => { this.selectItem(e, row, 'unitPrice') }}
      />
    )
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
        transactionCategoryId: null,
        unitPrice: 0,
        vatCategoryId: null,
        subTotal: 0
      }), idCount: this.state.idCount + 1
    })
  }

  handleSubmit(data) {
    const {
      expenseId,
      payee,
      expenseDate,
      currency,
      project,
      paymentDate,
      expenseAmount,
      expenseDescription,
      receiptNumber,
      attachmentFile,
      receiptAttachmentDescription,
      bank,
      expenseVATAmount,
      totalAmount,
    } = data
    let formData = new FormData();
    // const userId = window.localStorage.getItem('userId');
    // formData.append("user",userId)
    formData.append("payee", payee);
    formData.append("expenseDate", expenseDate !== null ? expenseDate : "");
    formData.append("paymentDate", paymentDate !== null ? paymentDate : "");
    formData.append("expenseDescription", expenseDescription);
    formData.append("receiptNumber", receiptNumber);
    formData.append("receiptAttachmentDescription", receiptAttachmentDescription);
    formData.append('expenseItemsString',JSON.stringify(this.state.data));
    formData.append('expenseVATAmount',this.state.initValue.expenseVATAmount);
    formData.append('expenseAmount',this.state.initValue.totalAmount);
    if (bank && bank.value) {
      formData.append("bankAccountId", bank.value);
    }
    if (currency && currency.value) {
      formData.append("currencyCode", currency.value);
    }
    if (project && project.value) {
      formData.append("projectId", project.value);
    }
    if (this.uploadFile.files[0]) {
      formData.append("attachmentFile", this.uploadFile.files[0]);
    }
    this.props.expenseCreateActions.createExpense(formData).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Creted Successfully.')
      if (this.state.createMore) {
        this.setState({
          createMore: false
        })
      } else {
        this.props.history.push('/admin/expense/expense')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.data ? err.data.message : null)
    })
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

  render() {

    const { data } = this.state
    const { initValue } = this.state
    const { currency_list, project_list, bank_account_list} = this.props

    return (
      <div className="create-expense-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fab fa-stack-exchange" />
                        <span className="ml-2">Create Expense</span>
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
                            {/* <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="currency">Expanse Name</Label>
                                  <Select
                                    className="select-default-width"
                                    id="currencyCode"
                                    name="currencyCode"
                                    options={selectOptionsFactory.renderOptions('transactionCategoryDescription', 'transactionCategoryId', chart_of_account_list)}
                                    value={props.values.currency}
                                    onChange={option => props.handleChange('currency')(option)}

                                  />
                                </FormGroup>
                              </Col> */}
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="payee">Payee</Label>
                                  <Input
                                    type="text"
                                    name="payee"
                                    id="payee"
                                    rows="5"
                                    placeholder="Payee"
                                    onChange={(value) => { props.handleChange("payee")(value) }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expense_date">Expense Date</Label>
                                  <div>
                                    <DatePicker
                                      className="form-control"
                                      id="date"
                                      name="expenseDate"
                                      placeholderText=""
                                      selected={props.values.expenseDate}
                                      onChange={(value) => {
                                        props.handleChange("expenseDate")(value)
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
                                    id="currencyCode"
                                    name="currencyCode"
                                    options={selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list)}
                                    value={props.values.currency}
                                    onChange={option => props.handleChange('currency')(option)}

                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="project">Project</Label>
                                  <Select
                                    className="select-default-width"
                                    id="project"
                                    name="project"
                                    options={selectOptionsFactory.renderOptions('projectName', 'projectId', project_list)}
                                    value={props.values.project}
                                    onChange={option => props.handleChange('project')(option)}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="expenseDescription">Description</Label>
                                  <Input
                                    type="textarea"
                                    name="expenseDescription"
                                    id="expenseDescription"
                                    rows="5"
                                    placeholder="1024 characters..."
                                    onChange={option => props.handleChange('expenseDescription')(option)}
                                    value={props.values.expenseDescription}

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
                            {/* <hr /> */}
                            {/* <Row>
                              <Col lg={12} className="mb-3">
                                <Button color="primary" className="btn-square mr-3" onClick={this.addRow}>
                                  <i className="fa fa-plus"></i> Add More
                            </Button>
                              </Col>
                            </Row> */}
                            {/* <Row>
                              <Col lg={12}>
                                <BootstrapTable
                                  options={this.options}
                                  data={data}
                                  version="4"
                                  hover
                                  className="expense-create-table"
                                >
                                  <TableHeaderColumn
                                    width="55"
                                    dataAlign="center"
                                    dataFormat={this.renderActions}
                                  >
                                  </TableHeaderColumn>
                                  <TableHeaderColumn
                                    isKey
                                    dataField="product_name"
                                    dataFormat={this.renderProductName}
                                  >
                                    Account Code
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="quantity"
                                    dataFormat={this.renderAmount}
                                  >
                                    Amount
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
                              <Col lg={4} className="ml-auto">
                                <div className="">
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
                                        <label className="mb-0">{initValue.expenseVATAmount}</label>
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
                            </Row> */}
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Create
                        </Button>
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-repeat"></i> Create and More
                        </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/expense/expense') }}>
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateExpense)
