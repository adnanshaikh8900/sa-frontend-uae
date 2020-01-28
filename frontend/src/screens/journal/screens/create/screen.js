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

import { Formik,Field} from 'formik';
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
        temp: false,
        journalLineItems: [{
          id: 0,
          description: '',
          transactionCategoryId: '',
          vatCategoryId: '',
          contactId: '',
          debitAmount: 0,
          creditAmount: 0,
          // error: []
        }]
      }
    }

    // this.options = {
    //   paginationPosition: 'top'
    // }
    this.formRef = React.createRef()

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
    this.checkedRow = this.checkedRow.bind(this)

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
    let length = this.state.data.length - 1
    let temp = Object.values(this.state.data[length]).indexOf('');
    if (temp > -1) {
      return true
    } else {
      return false
    }
  }


  renderAccount(cell, row, props) {
    const { transaction_category_list } = this.props;
    let transactionCategoryList = transaction_category_list.length ? [{ transactionCategoryId: '', transactionCategoryName: 'Select Account' }, ...transaction_category_list] : transaction_category_list
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
        if (Object.keys(props.touched).length && props.touched.journalLineItems && props.touched.journalLineItems[idx]) {
          console.log(props.touched.journalLineItems[idx].transactionCategoryId)
        }
      }
    });

    return (

      <Field name={`journalLineItems.${idx}.transactionCategoryId`}
        render={({ field, form }) => (

          <Input type="select" onChange={(e) => {
            this.selectItem(e, row, 'transactionCategoryId', form, field)
          }} value={row.transactionCategoryId}
            className={`form-control 
            ${props.errors.journalLineItems && props.errors.journalLineItems[idx] &&
                props.errors.journalLineItems[idx].transactionCategoryId &&
                Object.keys(props.touched).length > 0 && props.touched.journalLineItems &&
                props.touched.journalLineItems[idx] &&
                props.touched.journalLineItems[idx].transactionCategoryId ? "is-invalid" : ""}`}
          >
           {transactionCategoryList ? transactionCategoryList.map(obj => {
          return <option value={obj.transactionCategoryId} key={obj.transactionCategoryId}>{obj.transactionCategoryName}</option>
         }) : ''}
          </Input>

        )}
      />
    )
    // const { transaction_category_list } = this.props;
    // let transactionCategoryList = transaction_category_list.length ? [{ transactionCategoryId: '', transactionCategoryName: 'Select Account' }, ...transaction_category_list] : transaction_category_list
    // return (
    //   <Input type="select" required onChange={(e) => { this.selectItem(e, row, 'transactionCategoryId') }} value={row.transactionCategoryId}
    //     className={row.error && row.error.transactionCategoryId ? "is-invalid" : ""}

    //   >
    //     {transactionCategoryList ? transactionCategoryList.map(obj => {
    //       return <option value={obj.transactionCategoryId} key={obj.transactionCategoryId}>{obj.transactionCategoryName}</option>
    //     }) : ''}
    //   </Input>
    // )
  }

  renderDescription(cell, row, props) {
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
    });

    return (
      <Field name={`journalLineItems.${idx}.description`}
        render={({ field, form }) => (
          <Input

            type="text"
            value={row['description'] !== '' ? row['description'] : ''}
            onChange={(e) => {
              this.selectItem(e, row, 'description', form, field)
            }}
            placeholder="Description"
            className={`form-control 
            ${props.errors.journalLineItems && props.errors.journalLineItems[idx] &&
                props.errors.journalLineItems[idx].description &&
                Object.keys(props.touched).length > 0 && props.touched.journalLineItems &&
                props.touched.journalLineItems[idx] &&
                props.touched.journalLineItems[idx].description ? "is-invalid" : ""}`}
          />
        )}
      />
    )
  }

  renderContact(cell, row, props) {
    const { contact_list } = this.props;
    let contactList = contact_list.length ? [{ value: '', label: 'Select Contact' }, ...contact_list] : contact_list
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
        if (Object.keys(props.touched).length && props.touched.journalLineItems && props.touched.journalLineItems[idx]) {
          console.log(props.touched.journalLineItems[idx].contactId)
        }
      }
    });

    return (

      <Field name={`journalLineItems.${idx}.contactId`}
        render={({ field, form }) => (

          <Input type="select" onChange={(e) => {
            this.selectItem(e, row, 'contactId', form, field)
            // this.formRef.current.props.handleChange(field.name)(e.value)
          }} value={row.contactId}
            className={`form-control 
            ${props.errors.journalLineItems && props.errors.journalLineItems[idx] &&
                props.errors.journalLineItems[idx].contactId &&
                Object.keys(props.touched).length > 0 && props.touched.journalLineItems &&
                props.touched.journalLineItems[idx] &&
                props.touched.journalLineItems[idx].contactId ? "is-invalid" : ""}`}
          >
            {contactList ? contactList.map(obj => {
              // obj.name = obj.name === 'default' ? '0' : obj.name
              return <option value={obj.value} key={obj.value}>{obj.label}</option>
            }) : ''}
          </Input>

        )}
      />
    )
    // const { contact_list } = this.props;
    // let contactList = contact_list.length ? [{ value: '', label: 'Select Contact' }, ...contact_list] : contact_list

    // return (
    //   <Input type="select" required onChange={(e) => { this.selectItem(e, row, 'contactId') }} value={row.value}
    //     className={row.error && row.error.contactId ? "is-invalid" : ""}
    //   >
    //     {contactList ? contactList.map(obj => {
    //       return <option value={obj.value} key={obj.value}>{obj.label}</option>
    //     }) : ''}
    //   </Input>
    // )
  }

  renderVatCode(cell, row, props) {
    const { vat_list } = this.props;
    let vatList = vat_list.length ? [{ id: '', vat: 'Select Vat' }, ...vat_list] : vat_list
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
        if (Object.keys(props.touched).length && props.touched.journalLineItems && props.touched.journalLineItems[idx]) {
          console.log(props.touched.journalLineItems[idx].vatCategoryId)
        }
      }
    });

    return (

      <Field name={`journalLineItems.${idx}.vatCategoryId`}
        render={({ field, form }) => (

          <Input type="select" onChange={(e) => {
            this.selectItem(e, row, 'vatCategoryId', form, field)
            // this.formRef.current.props.handleChange(field.name)(e.value)
          }} value={row.vatCategoryId}
            className={`form-control 
            ${props.errors.journalLineItems && props.errors.journalLineItems[idx] &&
                props.errors.journalLineItems[idx].vatCategoryId &&
                Object.keys(props.touched).length > 0 && props.touched.journalLineItems &&
                props.touched.journalLineItems[idx] &&
                props.touched.journalLineItems[idx].vatCategoryId ? "is-invalid" : ""}`}
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

  renderDebits(cell, row, props) {
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
    });

    return (
      <Field name={`journalLineItems.${idx}.debitAmount`}
        render={({ field, form }) => (
          <Input
            type="number"
            value={row['debitAmount'] !== 0 ? row['debitAmount'] : 0}
            onChange={(e) => { this.selectItem(e, row, 'debitAmount', form, field) }}
            placeholder="Debit Amount"
            className={`form-control 
            ${props.errors.journalLineItems && props.errors.journalLineItems[idx] &&
                props.errors.journalLineItems[idx].debitAmount &&
                Object.keys(props.touched).length > 0 && props.touched.journalLineItems &&
                props.touched.journalLineItems[idx] &&
                props.touched.journalLineItems[idx].debitAmount ? "is-invalid" : ""}`}
          />
        )}
      />
    )
  }

  renderCredits(cell, row, props) {
    let idx
    this.state.data.map((obj, index) => {
      if (obj.id === row.id) {
        idx = index
      }
    });

    return (
      <Field name={`journalLineItems.${idx}.creditAmount`}
        render={({ field, form }) => (
          <Input
            type="number"
            value={row['creditAmount'] !== 0 ? row['creditAmount'] : 0}
            onChange={(e) => { this.selectItem(e, row, 'creditAmount', form, field) }}
            placeholder="Credit Amount"
            className={`form-control 
            ${props.errors.journalLineItems && props.errors.journalLineItems[idx] &&
                props.errors.journalLineItems[idx].creditAmount &&
                Object.keys(props.touched).length > 0 && props.touched.journalLineItems &&
                props.touched.journalLineItems[idx] &&
                props.touched.journalLineItems[idx].creditAmount ? "is-invalid" : ""}`}
          />
        )}
      />
    )
  }

  checkedRow() {
    let length = this.state.data.length - 1
    let temp = Object.values(this.state.data[length]).indexOf('');
    if (temp > -1) {
      return true
    } else {
      return false
    }
  }

  addRow() {
    const data = [...this.state.data]
    this.setState({
      data: data.concat({
        id: this.state.idCount + 1,
        description: '',
        vatCategoryId: '',
        transactionCategoryId: '',
        contactId: '',
        debitAmount: 0,
        creditAmount: 0,
      }), idCount: this.state.idCount + 1
    }, () => {
      this.formRef.current.setFieldValue('journalLineItems', this.state.data, false)
    })
  }

  selectItem(e, row, name, form, field) {
    e.preventDefault();
    let idx;
    const data = this.state.data
    data.map((obj, index) => {
      if (obj.id === row.id) {
        obj[name] = e.target.value
        idx = index
      }
    });
    if (name === 'debitAmount' || name === 'creditAmount' || name === 'vatCategoryId') {
      form.setFieldValue(field.name, this.state.data[idx][name], true)
      this.updateAmount(data);
    } else {
      this.setState({ data: data }, () => {
        this.formRef.current.setFieldValue(field.name, this.state.data[idx][name], true)
      });
    }

  }


  deleteRow(e, row, props) {
    console.log(row)
    const id = row['id'];
    let newData = []
    e.preventDefault();
    const data = this.state.data
    newData = data.filter(obj => obj.id !== id);
    // console.log(newData)
    props.setFieldValue('journalLineItems', newData, true)
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

      if (vat !== '' && obj.debitAmount || vat !== '' && obj.creditAmount) {
        // const val = (+obj.debitAmount) + (((+obj.debitAmount)*vat)/100)
        subTotalDebitAmount = subTotalDebitAmount + (+obj.debitAmount) + (((+obj.debitAmount) * vat) / 100);
        subTotalCreditAmount = subTotalCreditAmount + (+obj.creditAmount) + (((+obj.creditAmount) * vat) / 100);
      }
    })


    this.setState({
      data: data,
      initValue: {
        ...this.state.initValue, ...{
          subTotalDebitAmount: subTotalDebitAmount,
          totalDebitAmount: subTotalDebitAmount,
          totalCreditAmount: subTotalCreditAmount,
          subTotalCreditAmount: subTotalCreditAmount,
        }
      }
    }, () => {
      // this.formRef.current.setFieldValue('journalLineItems', this.state.data, true)
    })
  }

  handleSubmit(values, resetForm) {

    const { data, initValue } = this.state
    data.map(item => {
      delete item.id
      item.transactionCategoryId = item.transactionCategoryId ? item.transactionCategoryId : ''
      item.vatCategoryId = item.vatCategoryId ? item.vatCategoryId : ''
      item.contactId = item.contactId ? item.contactId : ''
    })
    const postData = {
      journalDate: values.journalDate ? values.journalDate : '',
      referenceCode: values.referenceCode ? values.referenceCode : '',
      description: values.description ? values.description : '',
      currencyCode: values.currencyCode ? values.currencyCode : '',
      subTotalCreditAmount: initValue.subTotalCreditAmount,
      subTotalDebitAmount: initValue.subTotalDebitAmount,
      totalCreditAmount: initValue.totalCreditAmount,
      totalDebitAmount: initValue.totalDebitAmount,
      journalLineItems: data
    }
    // const postData = {...initValue,...values,...{journalLineItems: this.state.data}}
    this.props.journalCreateActions.createJournal(postData).then(res => {
      if (res.status === 200) {
        // resetForm({});
        this.props.commonActions.tostifyAlert('success', 'New Journal Created Successfully')
        if (this.state.createMore) {
          this.setState({
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
            initValue: {
              ...this.state.initValue, ...{
                journalLineItems: [{
                  id: 0,
                  description: '',
                  transactionCategoryId: '',
                  vatCategoryId: '',
                  contactId: '',
                  debitAmount: 0,
                  creditAmount: 0,
                }],
                subTotalDebitAmount: 0,
                totalDebitAmount: 0,
                totalCreditAmount: 0,
                subTotalCreditAmount: 0,
              }
            }
          });
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
                        ref={this.formRef}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values, resetForm)
                          resetForm(initValue)
                        }}
                        validationSchema={
                          Yup.object().shape({
                            journalDate: Yup.date()
                              .required('Journal Date is Required'),
                            journalLineItems: Yup.array()
                              .of(
                                Yup.object().shape({
                                  description: Yup.string().required('Description is Required'),
                                  vatCategoryId: Yup.string().required('Vat is required'),
                                  transactionCategoryId: Yup.string().required('Account is required'),
                                  contactId: Yup.string().required('Contact is required'),
                                  debitAmount: Yup.number().required(),
                                  creditAmount: Yup.number().required(),
                                })
                              )
                              // .required('*Atleast One Journal Debit and Credit Details is mandatory')
                          })
                        }
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
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    onChange={(value) => {
                                      props.handleChange("journalDate")(value)
                                    }}
                                    className={`form-control ${props.errors.journalDate && props.touched.journalDate ? "is-invalid" : ""}`}
                                  />
                                  {props.errors.journalDate && props.touched.journalDate && (
                                    <div className="invalid-feedback">{props.errors.journalDate}</div>
                                  )}
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
                                    value={props.values.referenceCode || ''}
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
                                    value={props.values.description || ''}
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
                                    onChange={option => {
                                      if (option && option.value) {
                                        props.handleChange('currencyCode')(option.value)
                                      } else {
                                        props.handleChange('currencyCode')('')
                                      }
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col lg={12} className="mb-3">
                                <Button color="primary" className="btn-square mr-3" onClick={this.addRow}
                                  disabled={this.checkedRow() ? true : false}
                                >
                                  <i className="fa fa-plus"></i> Add More
                            </Button>
                              </Col>
                            </Row>
                            {/* {props.errors.journalLineItems && typeof props.errors.journalLineItems === 'string' && (
                              <div className={props.errors.journalLineItems ? "is-invalid" : ""}>
                                <div className="invalid-feedback">{props.errors.journalLineItems}</div>
                              </div>
                            )} */}

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
                                    dataFormat={(cell, rows) => this.renderActions(cell, rows, props)}

                                  >
                                  </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="transactionCategoryId"
                                    dataFormat={(cell, rows) => this.renderAccount(cell, rows, props)}

                                  >
                                    Account
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="description"
                                    dataFormat={(cell, rows) => this.renderDescription(cell, rows, props)}

                                  >
                                    Description
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="contactId"
                                    dataFormat={(cell, rows) => this.renderContact(cell, rows, props)}
                                  >
                                    Contact
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="vatCategoryId"
                                    dataFormat={(cell, rows) => this.renderVatCode(cell, rows, props)}

                                  >
                                    Tax Code
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="debitAmount"
                                    dataFormat={(cell, rows) => this.renderDebits(cell, rows, props)}
                                  >
                                    Debits
                              </TableHeaderColumn>
                                  <TableHeaderColumn
                                    dataField="creditAmount"
                                    dataFormat={(cell, rows) => this.renderCredits(cell, rows, props)}
                                  >
                                    Credits
                              </TableHeaderColumn>
                                </BootstrapTable>
                              </Col>
                            </Row>

                            {this.state.data.length > 0 ? (
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
                                        <label className="mb-0"> {(this.state.initValue.subTotalDebitAmount).toFixed(2)}  </label>
                                      </Col>
                                      <Col xs={4} className="text-right">
                                        <label className="mb-0">{(this.state.initValue.subTotalCreditAmount).toFixed(2)}</label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="total-item p-2">
                                    <Row>
                                      <Col xs={4}>
                                        <h5 className="mb-0 text-right">Total</h5>
                                      </Col>
                                      <Col xs={4} className="text-right">
                                        <label className="mb-0">{(this.state.initValue.subTotalDebitAmount).toFixed(2)}</label>
                                      </Col>
                                      <Col xs={4} className="text-right">
                                        <label className="mb-0">{(this.state.initValue.subTotalCreditAmount).toFixed(2)}</label>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            ) :
                              null
                            }
                            <Row>

                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button type="button" color="primary" className="btn-square mr-3" onClick={() => {
                                    // () => {
                                    this.setState({ createMore: false }, () => {
                                      props.handleSubmit()
                                    })
                                    // }
                                  }}
                                  >
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
