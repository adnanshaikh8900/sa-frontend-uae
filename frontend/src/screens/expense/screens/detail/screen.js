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

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { Loader, ConfirmDeleteModal } from 'components'

import { selectOptionsFactory } from 'utils'

import * as ExpenseDetailsAction from './actions';
import * as ExpenseActions from '../../actions';

import moment from 'moment'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    expense_detail: state.expense.expense_detail,
    currency_list: state.expense.currency_list,
    project_list: state.expense.project_list,
    bank_account_list: state.expense.bank_account_list,
    vat_list: state.expense.vat_list,
    chart_of_account_list: state.expense.chart_of_account_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    expenseDetailActions: bindActionCreators(ExpenseDetailsAction, dispatch),
    expenseActions: bindActionCreators(ExpenseActions, dispatch)

  })
}

class DetailExpense extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      idCount: 0,
      initValue: null,
    }


    this.options = {
      paginationPosition: 'top'
    }

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
    let { vat_list } = this.props;
    // vat_list = vat_list ? vat_list : []
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
      total = (total_vat + total_net).toFixed(2);
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
        value={row['unitPrice'] !== 0 ? row['unitPrice'] : 0}
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

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const { expenseId } = this.props.location.state;
    if (this.props.location.state && expenseId) {
      this.props.expenseActions.getVatList();
      this.props.expenseDetailActions.getExpenseDetail(expenseId).then(res => {
        if (res.status === 200) {
          this.props.expenseActions.getCurrencyList();
          this.props.expenseActions.getProjectList();
          this.props.expenseActions.getBankAccountList();
          this.props.expenseActions.getChartOfAccountList();
          this.setState({
            loading: false,
            data: res.data.expenseItems ? res.data.expenseItems : [],
            initValue: {
              payee: res.data.payee,
              expenseDate: res.data.expenseDate ? moment(res.data.expenseDate).format('DD-MM-YYYY'): '',
              currencyCode: res.data.currencyCode ? res.data.currencyCode : '',
              projectId: res.data.projectId ? res.data.projectId : '',
              // paymentDate: res.data.paymentDate? moment(res.data.paymentDate).format('DD-MM-YYYY'): '',
              expenseAmount: res.data.expenseAmount,
              expenseDescription: res.data.expenseDescription,
              receiptNumber: res.data.receiptNumber,
              attachmentFile: res.data.attachmentFile,
              receiptAttachmentDescription: res.data.receiptAttachmentDescription,
              bank: res.data.bankAccountId ? res.data.bankAccountId : '',
              total_net: 0,
              expenseVATAmount: res.data.expenseVATAmount,
              totalAmount: res.data.expenseAmount,
            },
          },()=>{this.updateAmount(this.state.data)})
        }
      }).catch(err => {
        this.setState({ loading: false })
      })
    }
  }

  handleSubmit() {

  }

  handleChange() {

  }

  render() {

    const { expense_detail, currency_list, project_list, payment_list, bank_account_list, customer_list } = this.props
    const { data, initValue, loading } = this.state

    return (
      <div className="detail-expense-screen">
        <div className="animated fadeIn">
          {loading ? (
            <Loader />
          )
            :
            (
              <Row>
                <Col lg={12} className="mx-auto">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col lg={12}>
                          <div className="h4 mb-0 d-flex align-items-center">
                            <i className="fab fa-stack-exchange" />
                            <span className="ml-2">Update Expense</span>
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
                                      <Label htmlFor="payee">Payee</Label>
                                      <Input
                                        type="text"
                                        name="payee"
                                        id="payee"
                                        rows="5"
                                        placeholder="Payee"
                                        onChange={(value) => { props.handleChange("payee")(value) }}
                                        defaultValue={props.values.payee}
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
                                          value={props.values.expenseDate}
                                          // selected={props.values.expenseDate}
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
                                        value={props.values.currencyCode}
                                        onChange={option => props.handleChange('currencyCode')(option.value)}

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
                                        value={props.values.projectId}
                                        onChange={option => props.handleChange('projectId')(option.value)}
                                      />
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
                                        options={bank_account_list ? selectOptionsFactory.renderOptions('bankAccountName', 'bankAccountId', bank_account_list) : ''}
                                        value={props.values.bank}
                                        onChange={option => props.handleChange('bank')(option.value)}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="paymentDate">Payment Date (TBD)</Label>
                                      <div>
                                        <DatePicker
                                          className="form-control"
                                          id="paymentDate"
                                          name="paymentDate"
                                          placeholderText=""
                                          defaultValue={props.values.paymentDate}
                                          value={props.values.paymentDate}
                                          onChange={option => props.handleChange('paymentDate')(option)}
                                        />
                                      </div>
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
                                        defaultValue={props.values.expenseDescription}

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
                                            defaultValue={props.values.receiptNumber}

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
                                </Row>
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
            )
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailExpense)
