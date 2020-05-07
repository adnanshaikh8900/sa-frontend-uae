import React from 'react';
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
  NavLink,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as TransactionsActions from '../actions';
import * as transactionDetailActions from '../screens/detail/actions';
import { CommonActions } from 'services/global';
import './style.scss';
import { Loader } from 'components';
import moment from 'moment';

const mapDispatchToProps = (dispatch) => {
  return {
    transactionsActions: bindActionCreators(TransactionsActions, dispatch),
    transactionDetailActions: bindActionCreators(
      transactionDetailActions,
      dispatch,
    ),
    commonActions: bindActionCreators(CommonActions, dispatch),
  };
};

class ExplainTrasactionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createMore: false,
      loading: false,
      fileName: '',
      initValue: {},
      view: false,
      chartOfAccountCategoryList: [],
      transactionCategoryList: [],
      id: '',
    };

    this.file_size = 1024000;
    this.supported_format = [
      '',
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;

    this.formRef = React.createRef();
  }

  componentDidMount = () => {
    if (this.props.selectedData) {
      this.initializeData();
    }
  };

  initializeData = () => {
    const { selectedData } = this.props;
    const { bankId } = this.props;
    this.setState({ loading: true, id: selectedData.id });
    this.props.transactionDetailActions
      .getTransactionDetail(selectedData.id)
      .then((res) => {
        this.getChartOfAccountCategoryList(selectedData.debitCreditFlag);
        this.setState(
          {
            loading: false,
            initValue: {
              bankId: bankId,
              amount: res.data.amount ? res.data.amount : '',
              date: res.data.date ? res.data.date : '',
              description: res.data.description ? res.data.description : '',
              transactionCategoryId: res.data.transactionCategoryId
                ? res.data.transactionCategoryId
                : '',
              transactionId: selectedData.id,
              vatId: 2,
              vendorId: 1505,
              customerId: 1001,
              explinationStatusEnum: 'FULL',
              reference: res.data.reference ? res.data.reference : '',
              coaCategoryId: res.data.coaCategoryId
                ? res.data.coaCategoryId
                : '',
              invoiceId: 1002,
            },
          },
          () => {
            //console.log(this.state.initValue);
          },
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getChartOfAccountCategoryList = (type) => {
    this.setState({ loading: true });
    this.props.transactionsActions.getChartOfCategoryList(type).then((res) => {
      if (res.status === 200) {
        this.setState(
          {
            chartOfAccountCategoryList: res.data,
            loading: false,
          },
          () => {
            //console.log(this.state.chartOfAccountCategoryList);
            const id = this.state.chartOfAccountCategoryList[0].options.find(
              (option) => option.value === this.state.initValue.coaCategoryId,
            );
            this.getTransactionCategoryList(id.value);
          },
        );
      }
    });
  };

  getTransactionCategoryList = (type) => {
    this.props.transactionsActions
      .getTransactionCategoryListForExplain(type)
      .then((res) => {
        if (res.status === 200) {
          this.setState(
            {
              transactionCategoryList: res.data,
            },
            () => {},
          );
        }
      });
  };

  handleSubmit = (data, resetForm) => {
    const {
      bankId,
      date,
      reference,
      description,
      amount,
      coaCategoryId,
      transactionCategoryId,
      vendorId,
      employeeId,
      invoiceIdList,
      customerId,
      vatId,
      transactionId,
    } = data;
    console.log(transactionCategoryId);
    console.log(data);
    //const { transaction_id } = this.state;
    let formData = new FormData();
    formData.append('transactionId', transactionId ? transactionId : '');
    formData.append('bankId ', bankId ? bankId : '');
    formData.append('date', date ? moment(date).format('DD/MM/YYYY') : '');
    formData.append('description', description ? description : '');
    formData.append('amount', amount ? amount : '');
    formData.append('coaCategoryId', coaCategoryId ? coaCategoryId : '');
    if (transactionCategoryId) {
      formData.append(
        'transactionCategoryId',
        transactionCategoryId ? transactionCategoryId : '',
      );
    }
    if (
      (customerId &&
        coaCategoryId.value &&
        coaCategoryId.label == 'Expenses') ||
      (customerId && coaCategoryId.value && coaCategoryId.label == 'Sales')
    ) {
      formData.append('customerId', customerId ? customerId.value : '');
    }
    if (vendorId && coaCategoryId.value && coaCategoryId.label == 'Expenses') {
      formData.append('vendorId', vendorId ? vendorId.value : '');
    }
    if (vendorId && coaCategoryId.value && coaCategoryId.label == 'Expenses') {
      formData.append('vatId', vatId ? vatId.value : '');
    }
    if (employeeId) {
      formData.append('employeeId', employeeId ? employeeId.value : '');
    }
    if (
      invoiceIdList &&
      coaCategoryId.value &&
      coaCategoryId.label == 'Sales'
    ) {
      console.log('ss');
      formData.append(
        'invoiceIdList',
        invoiceIdList ? JSON.stringify(invoiceIdList) : '',
      );
    }
    formData.append('reference', reference ? reference : '');
    if (this.uploadFile.files[0]) {
      formData.append('attachment', this.uploadFile.files[0]);
    }

    this.props.transactionDetailActions
      .updateTransaction(formData)
      .then((res) => {
        if (res.status === 200) {
          console.log(bankId);
          resetForm();
          this.props.commonActions.tostifyAlert(
            'success',
            'Transaction Detail Updated Successfully.',
          );
          this.props.closeExplainTransactionModal(this.state.id);
          //this.initializeData();
          // this.props.history.push('/admin/banking/bank-account/transaction', {
          //   bankId,
          // });
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.commonActions.tostifyAlert(
          'error',
          err && err.data ? err.data.message : 'Something Went Wrong',
        );
      });
  };

  render() {
    const {
      initValue,
      loading,
      chartOfAccountCategoryList,
      transactionCategoryList,
    } = this.state;
    // if (transactionCategoryList.dataList) {
    //   const result = transactionCategoryList.dataList[1].options.find(
    //     (option) => option.value === parseInt(this.state.initValue.customerId),
    //   );
    //   console.log(transactionCategoryList.dataList[1].options);
    //   // transactionCategoryList.dataList[1].options.find(
    //   //   (option) => option.value === +this.state.initValue.customerId,
    //   // );
    //   console.log(result);
    //   console.log(typeof this.state.initValue.customerId.toString());
    // }
    return (
      <div className="detail-bank-transaction-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              {loading ? (
                <Loader />
              ) : (
                <Card>
                  <CardHeader>
                    <Row>
                      <Col lg={12}>
                        <div className="h4 mb-0 d-flex align-items-center">
                          <i className="icon-doc" />
                          <span className="ml-2">
                            Explain AED {this.state.id}
                          </span>
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
                            this.handleSubmit(values, resetForm);
                          }}
                          validationSchema={Yup.object().shape({
                            date: Yup.date().required(
                              'Transaction Date is Required',
                            ),
                            amount: Yup.string().required(
                              'Transaction Amount is Required',
                            ),
                            coaCategoryId: Yup.string().required(
                              'Transaction Type is Required',
                            ),
                            attachment: Yup.mixed()
                              .test(
                                'fileType',
                                '*Unsupported File Format',
                                (value) => {
                                  value &&
                                    this.setState({
                                      fileName: value.name,
                                    });
                                  if (
                                    !value ||
                                    (value &&
                                      this.supported_format.includes(
                                        value.type,
                                      )) ||
                                    !value
                                  ) {
                                    return true;
                                  } else {
                                    return false;
                                  }
                                },
                              )
                              .test(
                                'fileSize',
                                '*File Size is too large',
                                (value) => {
                                  if (
                                    !value ||
                                    (value && value.size <= this.file_size) ||
                                    !value
                                  ) {
                                    return true;
                                  } else {
                                    return false;
                                  }
                                },
                              ),
                          })}
                        >
                          {(props) => (
                            <Form onSubmit={props.handleSubmit}>
                              <Row>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="chartOfAccountId">
                                      <span className="text-danger">*</span>
                                      Transaction Type
                                    </Label>
                                    <Select
                                      options={
                                        chartOfAccountCategoryList
                                          ? chartOfAccountCategoryList
                                          : []
                                      }
                                      value={
                                        chartOfAccountCategoryList[0] &&
                                        chartOfAccountCategoryList[0].options.find(
                                          (option) =>
                                            option.value ===
                                            +props.values.coaCategoryId,
                                        )
                                      }
                                      onChange={(option) => {
                                        if (option && option.value) {
                                          props.handleChange('coaCategoryId')(
                                            option,
                                          );
                                        } else {
                                          props.handleChange('coaCategoryId')(
                                            '',
                                          );
                                        }
                                      }}
                                      placeholder="Select Type"
                                      id="coaCategoryId"
                                      name="coaCategoryId"
                                      className={
                                        props.errors.coaCategoryId &&
                                        props.touched.coaCategoryId
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                    {props.errors.coaCategoryId &&
                                      props.touched.coaCategoryId && (
                                        <div className="invalid-feedback">
                                          {props.errors.coaCategoryId}
                                        </div>
                                      )}
                                  </FormGroup>
                                </Col>

                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="amount">
                                      <span className="text-danger">*</span>
                                      Total Amount
                                    </Label>
                                    <Input
                                      type="text"
                                      id="amount"
                                      name="amount"
                                      placeholder="Amount"
                                      onChange={(option) => {
                                        if (
                                          option.target.value === '' ||
                                          this.regEx.test(option.target.value)
                                        ) {
                                          props.handleChange('amount')(option);
                                        }
                                      }}
                                      value={props.values.amount}
                                      className={
                                        props.errors.amount &&
                                        props.touched.amount
                                          ? 'is-invalid'
                                          : ''
                                      }
                                    />
                                    {props.errors.amount &&
                                      props.touched.amount && (
                                        <div className="invalid-feedback">
                                          {props.errors.amount}
                                        </div>
                                      )}
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                {transactionCategoryList.dataList &&
                                  props.values.coaCategoryId === 2 && (
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="customerId">
                                          Customer
                                        </Label>
                                        <Select
                                          options={
                                            transactionCategoryList.dataList[0]
                                              ? transactionCategoryList
                                                  .dataList[0].options
                                              : []
                                          }
                                          value={
                                            transactionCategoryList.dataList &&
                                            transactionCategoryList.dataList[0].options.find(
                                              (option) =>
                                                option.value ===
                                                +props.values.customerId,
                                            )
                                          }
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('customerId')(
                                                option,
                                              );
                                            } else {
                                              props.handleChange('customerId')(
                                                '',
                                              );
                                            }
                                          }}
                                          placeholder="Select Type"
                                          id="customerId"
                                          name="customerId"
                                          className={
                                            props.errors.customerId &&
                                            props.touched.customerId
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                {transactionCategoryList.dataList &&
                                  props.values.coaCategoryId === 2 && (
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="invoiceId">
                                          Invoice
                                        </Label>
                                        <Select
                                          isMulti
                                          options={
                                            transactionCategoryList
                                              ? transactionCategoryList
                                                  .dataList[1].options
                                              : []
                                          }
                                          value={
                                            transactionCategoryList.dataList &&
                                            transactionCategoryList.dataList[1].options.find(
                                              (option) =>
                                                option.value ===
                                                +props.values.invoiceId,
                                            )
                                          }
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('invoiceId')(
                                                option,
                                              );
                                            } else {
                                              props.handleChange('invoiceId')(
                                                '',
                                              );
                                            }
                                          }}
                                          placeholder="Select Type"
                                          id="invoiceId"
                                          name="invoiceId"
                                          className={
                                            props.errors.invoiceId &&
                                            props.touched.invoiceId
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                {transactionCategoryList.categoriesList &&
                                  props.values.coaCategoryId === 10 && (
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="vatId">Vat</Label>
                                        <Select
                                          options={
                                            transactionCategoryList.dataList[0]
                                              ? transactionCategoryList
                                                  .dataList[0].options
                                              : []
                                          }
                                          value={
                                            transactionCategoryList.dataList &&
                                            transactionCategoryList.dataList[0].options.find(
                                              (option) =>
                                                option.value ===
                                                +props.values.vatId,
                                            )
                                          }
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('vatId')(
                                                option,
                                              );
                                            } else {
                                              props.handleChange('vatId')('');
                                            }
                                          }}
                                          placeholder="Select Type"
                                          id="vatId"
                                          name="vatId"
                                          className={
                                            props.errors.vatId &&
                                            props.touched.vatId
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                {transactionCategoryList.categoriesList && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="transactionCategoryId">
                                        Category
                                      </Label>
                                      <Select
                                        options={
                                          transactionCategoryList
                                            ? transactionCategoryList.categoriesList
                                            : []
                                        }
                                        value={
                                          transactionCategoryList.categoriesList &&
                                          transactionCategoryList.categoriesList[0].options.find(
                                            (option) =>
                                              option.value ===
                                              +props.values
                                                .transactionCategoryId,
                                          )
                                        }
                                        onChange={(option) => {
                                          if (option && option.value) {
                                            props.handleChange(
                                              'transactionCategoryId',
                                            )(option);
                                          } else {
                                            props.handleChange(
                                              'transactionCategoryId',
                                            )('');
                                          }
                                        }}
                                        placeholder="Select Type"
                                        id="transactionCategoryId"
                                        name="transactionCategoryId"
                                        className={
                                          props.errors.transactionCategoryId &&
                                          props.touched.transactionCategoryId
                                            ? 'is-invalid'
                                            : ''
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
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
                                      onChange={(option) =>
                                        props.handleChange('description')(
                                          option,
                                        )
                                      }
                                      value={props.values.description}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={4}>
                                  <Row>
                                    <Col lg={12}>
                                      <FormGroup className="mb-3">
                                        <Field
                                          name="attachment"
                                          render={({ field, form }) => (
                                            <div>
                                              <Label>Reciept Attachment</Label>{' '}
                                              <br />
                                              <Button
                                                color="primary"
                                                onClick={() => {
                                                  document
                                                    .getElementById('fileInput')
                                                    .click();
                                                }}
                                                className="btn-square mr-3"
                                              >
                                                <i className="fa fa-upload"></i>{' '}
                                                Upload
                                              </Button>
                                              <input
                                                id="fileInput"
                                                ref={(ref) => {
                                                  this.uploadFile = ref;
                                                }}
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                  this.handleFileChange(
                                                    e,
                                                    props,
                                                  );
                                                }}
                                              />
                                              {this.state.fileName}
                                            </div>
                                          )}
                                        />
                                        {props.errors.attachment &&
                                          props.touched.attachment && (
                                            <div className="invalid-file">
                                              {props.errors.attachment}
                                            </div>
                                          )}
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="date">
                                          <span className="text-danger">*</span>
                                          Transaction Date
                                        </Label>
                                        <DatePicker
                                          id="date"
                                          name="date"
                                          placeholderText="Transaction Date"
                                          showMonthDropdown
                                          showYearDropdown
                                          dateFormat="dd/MM/yyyy"
                                          dropdownMode="select"
                                          value={
                                            props.values.date
                                              ? moment(
                                                  props.values.date,
                                                  'DD/MM/YYYY',
                                                ).format('DD/MM/YYYY')
                                              : ''
                                          }
                                          //selected={props.values.date}
                                          onChange={(value) =>
                                            props.handleChange('date')(value)
                                          }
                                          className={`form-control ${
                                            props.errors.date &&
                                            props.touched.date
                                              ? 'is-invalid'
                                              : ''
                                          }`}
                                        />
                                        {props.errors.date &&
                                          props.touched.date && (
                                            <div className="invalid-feedback">
                                              {props.errors.date}
                                            </div>
                                          )}
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={4}>
                                  <Row>
                                    <Col lg={12}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="reference">
                                          Reference Number
                                        </Label>
                                        <Input
                                          type="text"
                                          id="reference"
                                          name="reference"
                                          placeholder="Reference Number"
                                          onChange={(option) => {
                                            if (
                                              option.target.value === '' ||
                                              this.regExBoth.test(
                                                option.target.value,
                                              )
                                            ) {
                                              props.handleChange('reference')(
                                                option,
                                              );
                                            }
                                          }}
                                          value={props.values.reference}
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              {transactionCategoryList.dataList && (
                                <Row>
                                  {props.values.coaCategoryId === 10 && (
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="customerId">
                                          Customer
                                        </Label>
                                        <Select
                                          options={
                                            transactionCategoryList.dataList[0]
                                              ? transactionCategoryList
                                                  .dataList[1].options
                                              : []
                                          }
                                          value={
                                            transactionCategoryList.dataList &&
                                            transactionCategoryList.dataList[1].options.find(
                                              (option) =>
                                                option.value ===
                                                +props.values.customerId,
                                            )
                                          }
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('customerId')(
                                                option,
                                              );
                                            } else {
                                              props.handleChange('customerId')(
                                                '',
                                              );
                                            }
                                          }}
                                          placeholder="Select Type"
                                          id="customerId"
                                          name="customerId"
                                          className={
                                            props.errors.customerId &&
                                            props.touched.customerId
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                  {props.values.coaCategoryId === 10 && (
                                    <Col lg={4}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="vendorId">Vendor</Label>
                                        <Select
                                          options={
                                            transactionCategoryList.dataList[0]
                                              ? transactionCategoryList
                                                  .dataList[2].options
                                              : []
                                          }
                                          value={
                                            transactionCategoryList.dataList &&
                                            transactionCategoryList.dataList[2].options.find(
                                              (option) =>
                                                option.value ===
                                                +props.values.vendorId,
                                            )
                                          }
                                          onChange={(option) => {
                                            if (option && option.value) {
                                              props.handleChange('vendorId')(
                                                option,
                                              );
                                            } else {
                                              props.handleChange('vendorId')(
                                                '',
                                              );
                                            }
                                          }}
                                          placeholder="Select Type"
                                          id="vendorId"
                                          name="vendorId"
                                          className={
                                            props.errors.vendorId &&
                                            props.touched.vendorId
                                              ? 'is-invalid'
                                              : ''
                                          }
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                </Row>
                              )}

                              <Row>
                                <Col lg={12} className="mt-5">
                                  <FormGroup className="text-left">
                                    <Button
                                      type="button"
                                      color="primary"
                                      className="btn-square mr-3"
                                      onClick={props.handleSubmit}
                                    >
                                      <i className="fa fa-dot-circle-o"></i>{' '}
                                      Explain
                                    </Button>
                                    {/* <Button
                                      color="secondary"
                                      className="btn-square"
                                      onClick={() =>
                                        this.props.history.push(
                                          '/admin/banking/bank-account/transaction',
                                          {
                                            bankAccountId:
                                              initValue.bankAccountId,
                                          },
                                        )
                                      }
                                    >
                                      <i className="fa fa-ban"></i> Cancel
                                    </Button> */}
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
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect('', mapDispatchToProps)(ExplainTrasactionDetail);
