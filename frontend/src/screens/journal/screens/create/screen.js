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
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import { Formik } from 'formik';
import * as Yup from "yup";
import _ from 'lodash'

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import * as JournalActions from '../../actions';
import * as JournalCreateActions from './actions';

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    transaction_category_list: state.journal.transaction_category_list,
    currency_list: state.journal.currency_list,
    contact_list: state.journal.contact_list,
    vat_list: state.journal.vat_list,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    journalActions: bindActionCreators(JournalActions, dispatch),
    journalCreateActions: bindActionCreators(JournalCreateActions, dispatch)
  })
}

class CreateJournal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      createMore: false,
      data: [{
        id: 0,
        description: '',
        transactionCategoryId: '',
        vatCategoryId: '',
        contactId: '',
        debitAmount: 0,
        creditAmount: 0,
      }],
      idCount: 0,
      initValue: {
        journalDate: '',
        referenceCode: '',
        description: '',
        currencyCode: '',
        subTotalDebitAmount: 0,
        totalDebitAmount: 0,
        totalCreditAmount: 0,
        subTotalCreditAmount: 0,
        journalLineItems: [],
      }
    }

    // this.options = {
    //   paginationPosition: 'top'
    // }

    this.initializeData = this.initializeData.bind(this)
    this.renderActions = this.renderActions.bind(this)
    this.renderAccount = this.renderAccount.bind(this)
    this.renderDescription = this.renderDescription.bind(this)
    this.renderContact = this.renderContact.bind(this)
    this.renderVatCode = this.renderVatCode.bind(this)
    this.renderDebits = this.renderDebits.bind(this)
    this.renderCredits = this.renderCredits.bind(this)

    this.updateAmount = this.updateAmount.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.journalActions.getContactList();
    this.props.journalActions.getCurrencyList()
    this.props.journalActions.getTransactionCategoryList()
    this.props.journalActions.getVatList()
  }

  renderActions(cell, row) {
    return (
      <Button
        type="button"
        size="sm"
        className="btn-twitter btn-brand icon"
        onClick={(e) => { this.deleteRow(e, row) }}
      >
        <i className="fas fa-trash"></i>
      </Button>
    )
  }


  renderAccount(cell, row) {
    const { transaction_category_list } = this.props;
    let transactionCategoryList = transaction_category_list.length ? [{ transactionCategoryId: '', transactionCategoryName: 'Select Account' }, ...transaction_category_list] : transaction_category_list
    return (
      <Input type="select" onChange={(e) => { this.selectItem(e, row, 'transactionCategoryId') }} value={row.transactionCategoryId}>
        {transactionCategoryList ? transactionCategoryList.map(obj => {
          return <option value={obj.transactionCategoryId} key={obj.transactionCategoryId}>{obj.transactionCategoryName}</option>
        }) : ''}
      </Input>
    )
  }

  renderDescription(cell, row) {
    return (
      <Input
        type="text"
        value={row['description'] !== '' ? row['description'] : ''}
        onChange={(e) => { this.selectItem(e, row, 'description') }}
        placeholder="Description"
      />
    )
  }

  renderContact(cell, row) {
    const { contact_list } = this.props;
    let contactList = contact_list.length ? [{ value: '', label: 'Select Contact' }, ...contact_list] : contact_list

    return (
      <Input type="select" onChange={(e) => { this.selectItem(e, row, 'contactId') }} value={row.value}>
        {contactList ? contactList.map(obj => {
          // obj.name = obj.name === 'default' ? '0' : obj.name
          return <option value={obj.value} key={obj.value}>{obj.label}</option>
        }) : ''}
      </Input>
    )
  }

  renderVatCode(cell, row) {
    const { vat_list } = this.props;
    let vatList = vat_list.length ? [{ id: '', name: 'Select Vat' }, ...vat_list] : vat_list

    return (
      <Input type="select" onChange={(e) => { this.selectItem(e, row, 'vatCategoryId') }} value={row.vatCategoryId}>
        {vatList ? vatList.map(obj => {
          // obj.name = obj.name === 'default' ? '0' : obj.name
          return <option value={obj.id} key={obj.id}>{obj.name}</option>
        }) : ''}
      </Input>
    )
  }

  renderDebits(cell, row) {
    return (
      <Input
        type="number"
        value={row['debitAmount']}
        onChange={(e) => { this.selectItem(e, row, 'debitAmount') }}
      />
    )
  }

  renderCredits(cell, row) {
    return (
      <Input
        type="number"
        value={row['creditAmount']}
        // defaultValue={row['quantity']}
        onChange={(e) => { this.selectItem(e, row, 'creditAmount') }}
      />
    )
  }

  addRow() {
    const data = [...this.state.data]
    this.setState({
      data: data.concat({
        id: this.state.idCount + 1,
        description: '',
        transactionCategoryId: '',
        contactId: '',
        debitAmount: 0,
        creditAmount: 0,
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
    if (name === 'debitAmount' || name === 'creditAmount' || name === 'vatCategoryId') {
      this.updateAmount(data);
    } else {
      this.setState({ data: data });
    }

  }


  deleteRow(e, row) {

    const id = row['id'];
    let newData = []
    e.preventDefault();
    const data = this.state.data
    newData = data.filter(obj => obj.id !== id);
    this.updateAmount(newData)
  }


  updateAmount(data) {
    const { vat_list } = this.props;
    let subTotalDebitAmount = 0;
    let subTotalCreditAmount = 0;
    let totalDebitAmount = 0;
    let totalCreditAmount = 0;

    data.map(obj => {
      const index = obj.vatCategoryId !== '' ? vat_list.findIndex(item => item.id === (+obj.vatCategoryId)) : '';
      const vat = index !== '' ? vat_list[index].vat : ''

      if(vat !== '' && obj.debitAmount || vat !== '' && obj.creditAmount ) {
        // const val = (+obj.debitAmount) + (((+obj.debitAmount)*vat)/100)
        subTotalDebitAmount = subTotalDebitAmount + (+obj.debitAmount) + (((+obj.debitAmount)*vat)/100);
        subTotalCreditAmount = subTotalCreditAmount + (+obj.creditAmount) + (((+obj.creditAmount)*vat)/100);
      }
    })


    this.setState({
      data: data,
      initValue: {
        subTotalDebitAmount: subTotalDebitAmount,
        totalDebitAmount: subTotalDebitAmount,
        totalCreditAmount: subTotalCreditAmount,
        subTotalCreditAmount: subTotalCreditAmount,
      }
    })
  }

  handleSubmit(values, resetForm) {
    const {data,initValue} = this.state
    data.map(item => {
      delete item.id
      item.transactionCategoryId = item.transactionCategoryId ? item.transactionCategoryId :  ''
      item.vatCategoryId = item.vatCategoryId ? item.vatCategoryId : ''
      item.contactId = item.contactId ? item.contactId : ''
    })
    const postData = {...values,...initValue,...{journalLineItems: this.state.data}}
    this.props.journalCreateActions.createJournal(postData).then(res => {
      if (res.status === 200) {
        // resetForm();
        this.props.commonActions.tostifyAlert('success', 'New Journal Created Successfully')
        if (this.state.createMore) {
          this.setState({ createMore: false });
        } else {
          this.props.history.push('/admin/accountant/journal');
        }
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }


  render() {
    const {
      data,
      initValue
    } = this.state
    const { currency_list } = this.props;

    return (
      <div className="create-journal-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fa fa-diamond" />
                        <span className="ml-2">Create Journal</span>
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
                                  <Label htmlFor="date">Journal Date</Label>
                                  <DatePicker
                                    className="form-control"
                                    id="journalDate"
                                    name="journalDate"
                                    placeholderText="Journal Date"
                                    selected={props.values.journalDate}
                                    onChange={(value) => {
                                      props.handleChange("journalDate")(value)
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="referenceCode">Reference #</Label>
                                  <Input
                                    type="text"
                                    id="referenceCode"
                                    name="referenceCode"
                                    placeholder="Reference Number"
                                    onChange={(value) => { props.handleChange("referenceCode")(value) }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="description">Description</Label>
                                  <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    rows="5"
                                    placeholder="1024 characters..."
                                    onChange={(value) => { props.handleChange("description")(value) }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="currencyCode">Currency</Label>
                                  <Select
                                    className="select-default-width"
                                    options={currency_list ? selectOptionsFactory.renderOptions('currencyName', 'currencyCode', currency_list, 'Currency') : []}
                                    id="currencyCode"
                                    name="currencyCode"
                                    value={props.values.currencyCode}
                                    onChange={option => props.handleChange('currencyCode')(option.value)}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col lg={12} className="mb-3">
                                <Button type="button" color="primary" className="btn-square mr-3" onClick={this.addRow}>
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
                                  className="journal-create-table"
                                >
                                  <TableHeaderColumn
                                    width="55"
                                    dataAlign="center"
                                    dataFormat={this.renderActions}
                                  >
                                  </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="transactionCategoryId"
                                    dataFormat={this.renderAccount}
                                  >
                                    Account
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="description"
                                    dataFormat={this.renderDescription}
                                  >
                                    Description
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="contactId"
                                    dataFormat={this.renderContact}
                                  >
                                    Contact
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="vatCategoryId"
                                    dataFormat={this.renderVatCode}
                                  >
                                    Tax Code
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="debitAmount"
                                    dataFormat={this.renderDebits}
                                  >
                                    Debits
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="creditAmount"
                                    dataFormat={this.renderCredits}
                                  >
                                    Credits
                              </TableHeaderColumn>
                                </BootstrapTable>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4} className="ml-auto">
                                <div className="total-item p-2">
                                  <Row>
                                    <Col xs={4}></Col>
                                    <Col xs={4}>
                                      <h5 className="mb-0 text-right">Debits</h5>
                                    </Col>
                                    <Col xs={4}>
                                      <h5 className="mb-0 text-right">Credits</h5>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="total-item p-2">
                                  <Row>
                                    <Col xs={4}>
                                      <h5 className="mb-0 text-right">Sub Total</h5>
                                    </Col>
                                    <Col xs={4} className="text-right">
                                      <label className="mb-0"> {this.state.initValue.subTotalDebitAmount }  </label>
                                    </Col>
                                    <Col xs={4} className="text-right">
                                      <label className="mb-0">{this.state.initValue.subTotalCreditAmount }</label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="total-item p-2">
                                  <Row>
                                    <Col xs={4}>
                                      <h5 className="mb-0 text-right">Total</h5>
                                    </Col>
                                    <Col xs={4} className="text-right">
                                      <label className="mb-0">{this.state.initValue.subTotalDebitAmount }</label>
                                    </Col>
                                    <Col xs={4} className="text-right">
                                      <label className="mb-0">{this.state.initValue.subTotalCreditAmount }</label>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="submit" color="primary" className="btn-square mr-3">
                                    <i className="fa fa-dot-circle-o"></i> Create
                              </Button>
                                  <Button type="button" color="primary" className="btn-square mr-3"
                                    onClick={
                                      () => {
                                        this.setState({ createMore: true }, () => {
                                          props.handleSubmit()
                                        })
                                      }
                                    }
                                  >
                                    <i className="fa fa-repeat"></i> Create and More
                              </Button>
                                  <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/accountant/journal') }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateJournal)
