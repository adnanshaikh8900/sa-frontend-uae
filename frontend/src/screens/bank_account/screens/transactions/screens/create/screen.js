import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
} from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { CommonActions } from 'services/global';
import { selectOptionsFactory } from 'utils';

import moment from 'moment';

import * as transactionCreateActions from './actions';
import * as transactionActions from '../../actions';

import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';

const mapStateToProps = (state) => {
  return {
    transaction_category_list: state.bank_account.transaction_category_list,
    transaction_type_list: state.bank_account.transaction_type_list,
    project_list: state.bank_account.project_list,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    transactionActions: bindActionCreators(transactionActions, dispatch),
    transactionCreateActions: bindActionCreators(
      transactionCreateActions,
      dispatch,
    ),
    commonActions: bindActionCreators(CommonActions, dispatch),
  };
};

class CreateBankTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createMore: false,
      fileName: '',
      initValue: {
        transactionId: '',
        bankAccountId: '',
        transactionDate: '',
        description: '',
        transactionAmount: '',
        coaCategoryId: '',
        transactionCategoryId: '',
        projectId: '',
        reference: '',
        attachementDescription: '',
        attachment: '',
        customerId: '',
        invoiceIdList: '',
        vatId: '',
        vendorId: '',
        employeeId: '',
      },
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
    this.initializeData();
  };

  // handleChange = (val, name, row) => {
  //   let data = [...this.state.initValue];
  //   data.map((item, index) => {
  //     if (item.id === row.id) {
  //       data[`${index}`][`${name}`] = val;
  //     }
  //     return item;
  //   });
  //   this.setState(
  //     {
  //       initValue: data,
  //     },
  //     () => {
  //       console.log(this.state.initValue);
  //       //this.calculateCurrentBalance();
  //     },
  //   );
  // };

  initializeData = () => {
    if (this.props.location.state && this.props.location.state.bankAccountId) {
      this.setState(
        {
          id: this.props.location.state.bankAccountId,
        },
        () => {
          console.log(this.state.id);
        },
      );
      this.props.transactionActions.getTransactionCategoryList();
      this.props.transactionActions.getTransactionTypeList();
      this.props.transactionActions.getProjectList();
    }
  };

  handleFileChange = (e, props) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {};
      reader.readAsDataURL(file);
      props.setFieldValue('attachment', file, true);
    }
  };

  handleSubmit = (data, resetForm) => {
    let bankAccountId =
      this.props.location.state && this.props.location.state.bankAccountId
        ? this.props.location.state.bankAccountId
        : '';
    const {
      transactionDate,
      description,
      transactionAmount,
      coaCategoryId,
      transactionCategoryId,
      invoiceIdList,
      reference,
      customerId,
      vatId,
      vendorId,
      employeeId,
    } = data;
    let formData = new FormData();
    formData.append('bankId ', bankAccountId ? bankAccountId : '');
    formData.append(
      'date',
      transactionDate ? moment(transactionDate).format('DD/MM/YYYY') : '',
    );
    formData.append('description', description ? description : '');
    formData.append('amount', transactionAmount ? transactionAmount : '');
    formData.append('coaCategoryId', coaCategoryId ? coaCategoryId.value : '');
    if (transactionCategoryId) {
      formData.append(
        'transactionCategoryId',
        transactionCategoryId ? transactionCategoryId.value : '',
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
      formData.append('attachmentFile', this.uploadFile.files[0]);
    }
    console.log(this.uploadFile.files[0]);
    this.props.transactionCreateActions
      .createTransaction(formData)
      .then((res) => {
        if (res.status === 200) {
          resetForm();
          this.props.commonActions.tostifyAlert(
            'success',
            'New Transaction Created Successfully.',
          );
          if (this.state.createMore) {
            this.setState({
              createMore: false,
            });
          } else {
            this.props.history.push('/admin/banking/bank-account/transaction', {
              bankAccountId,
            });
          }
        }
      })
      .catch((err) => {
        this.props.commonActions.tostifyAlert(
          'error',
          err && err.data ? err.data.message : 'Something Went Wrong',
        );
      });
  };
  getTransactionCategoryList = (type) => {
    try {
      this.props.transactionCreateActions
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
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    const options = {
      categoriesList: [
        {
          label: 'Money Spent',
          options: [
            {
              value: 10,
              label: 'Expenses',
            },
            {
              value: 11,
              label: 'Transfered To',
            },
            {
              value: 12,
              label: 'Money Paid To User',
            },
            {
              value: 13,
              label: 'Purchase Of Capital Asset',
            },
            {
              value: 14,
              label: 'Money Spent Others"',
            },
          ],
        },
        {
          label: 'Money Received',
          options: [
            {
              value: 2,
              label: 'Sales',
            },
            {
              value: 3,
              label: 'Transfered From',
            },
            {
              value: 4,
              label: 'Refund Received',
            },
            {
              value: 5,
              label: 'Interest Received',
            },
            {
              value: 6,
              label: 'Money Received From User',
            },
            {
              value: 7,
              label: 'Disposal Of Capital Asset',
            },
            {
              value: 8,
              label: 'Money Received Others',
            },
          ],
        },
      ],
    };
    const { initValue, id, transactionCategoryList } = this.state;
    return (
      <div className="create-bank-transaction-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="icon-doc" />
                        <span className="ml-2">Create Bank Transaction</span>
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
                          transactionDate: Yup.date().required(
                            'Transaction Date is Required',
                          ),
                          transactionAmount: Yup.string().required(
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
                                  <Label htmlFor="coaCategoryId">
                                    <span className="text-danger">*</span>
                                    Transaction Type
                                  </Label>
                                  <Select
                                    options={options.categoriesList}
                                    value={props.values.coaCategoryId}
                                    onChange={(option) => {
                                      if (option && option.value) {
                                        props.handleChange('coaCategoryId')(
                                          option,
                                        );
                                      } else {
                                        props.handleChange('coaCategoryId')('');
                                      }
                                      this.getTransactionCategoryList(
                                        option.value,
                                      );
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
                                  <Label htmlFor="date">
                                    <span className="text-danger">*</span>
                                    Transaction Date
                                  </Label>
                                  <DatePicker
                                    autoComplete="off"
                                    id="transactionDate"
                                    name="transactionDate"
                                    placeholderText="Transaction Date"
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    dropdownMode="select"
                                    value={props.values.transactionDate}
                                    selected={props.values.transactionDate}
                                    onChange={(value) => {
                                      props.handleChange('transactionDate')(
                                        value,
                                      );
                                    }}
                                    className={`form-control ${
                                      props.errors.transactionDate &&
                                      props.touched.transactionDate
                                        ? 'is-invalid'
                                        : ''
                                    }`}
                                  />
                                  {props.errors.transactionDate &&
                                    props.touched.transactionDate && (
                                      <div className="invalid-feedback">
                                        {props.errors.transactionDate}
                                      </div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col lg={4}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="transactionAmount">
                                    <span className="text-danger">*</span>Total
                                    Amount
                                  </Label>
                                  <Input
                                    type="text"
                                    id="transactionAmount"
                                    name="transactionAmount"
                                    placeholder="Amount"
                                    onChange={(option) => {
                                      if (
                                        option.target.value === '' ||
                                        this.regEx.test(option.target.value)
                                      ) {
                                        props.handleChange('transactionAmount')(
                                          option,
                                        );
                                      }
                                    }}
                                    value={props.values.transactionAmount}
                                    className={
                                      props.errors.transactionAmount &&
                                      props.touched.transactionAmount
                                        ? 'is-invalid'
                                        : ''
                                    }
                                  />
                                  {props.errors.transactionAmount &&
                                    props.touched.transactionAmount && (
                                      <div className="invalid-feedback">
                                        {props.errors.transactionAmount}
                                      </div>
                                    )}
                                </FormGroup>
                              </Col>
                            </Row>
                            {transactionCategoryList.categoriesList && (
                              <Row>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="transactionCategoryId">
                                      Category
                                    </Label>
                                    <Select
                                      className="select-default-width"
                                      options={
                                        transactionCategoryList.categoriesList
                                      }
                                      value={props.values.transactionCategoryId}
                                      id="transactionCategoryId"
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
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            )}
                            {transactionCategoryList.dataList && (
                              <Row>
                                {props.values.coaCategoryId.value === 10 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="vatId">
                                        Vat Included
                                      </Label>
                                      <Select
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[0]
                                            ? transactionCategoryList
                                                .dataList[0].options
                                            : []
                                        }
                                        id="vatId"
                                        value={props.values.vatId}
                                        onChange={(option) => {
                                          if (option && option.value) {
                                            props.handleChange('vatId')(option);
                                          } else {
                                            props.handleChange('vatId')('');
                                          }
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 10 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="vendorId">Vendor</Label>
                                      <Select
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[2]
                                            ? transactionCategoryList
                                                .dataList[2].options
                                            : []
                                        }
                                        id="vendorId"
                                        value={props.values.vendorId}
                                        onChange={(option) => {
                                          props.handleChange('vendorId')(
                                            option,
                                          );
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 10 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="customerId">
                                        customerId
                                      </Label>
                                      <Select
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[1]
                                            ? transactionCategoryList
                                                .dataList[1].options
                                            : []
                                        }
                                        id="customerId"
                                        value={props.values.customerId}
                                        onChange={(option) => {
                                          props.handleChange('customerId')(
                                            option,
                                          );
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 6 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="employeeId">User</Label>
                                      <Select
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[0]
                                            ? transactionCategoryList
                                                .dataList[0].options
                                            : []
                                        }
                                        id="employeeId"
                                        value={props.values.employeeId}
                                        onChange={(option) => {
                                          props.handleChange('employeeId')(
                                            option,
                                          );
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 12 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="employeeId">User</Label>
                                      <Select
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[0]
                                            ? transactionCategoryList
                                                .dataList[0].options
                                            : []
                                        }
                                        id="employeeId"
                                        value={props.values.employeeId}
                                        onChange={(option) => {
                                          props.handleChange('employeeId')(
                                            option,
                                          );
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 2 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="invoiceIdList">
                                        Invoice
                                      </Label>
                                      <Select
                                        isMulti
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[1]
                                            ? transactionCategoryList
                                                .dataList[1].options
                                            : []
                                        }
                                        id="invoiceIdList"
                                        value={props.values.invoiceIdList}
                                        onChange={(option) => {
                                          props.handleChange('invoiceIdList')(
                                            option,
                                          );
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 2 && (
                                  <Col lg={4}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="customerId">
                                        Customer
                                      </Label>
                                      <Select
                                        className="select-default-width"
                                        options={
                                          transactionCategoryList.dataList[1]
                                            ? transactionCategoryList
                                                .dataList[0].options
                                            : []
                                        }
                                        id="customerId"
                                        value={props.values.customerId}
                                        onChange={(option) => {
                                          props.handleChange('customerId')(
                                            option,
                                          );
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                )}
                                {/* {props.values.coaCategoryId.value === 2 && (
                                  <Col lg={4}>
                                    <Label htmlFor="transactionCategoryId">
                                      Total Amount
                                    </Label>
                                    <Input
                                      type="text"
                                      id="receiptNumber"
                                      name="receiptNumber"
                                      placeholder="Total Amount"
                                      onChange={(option) => {
                                        if (
                                          option.target.value === '' ||
                                          this.regExBoth.test(
                                            option.target.value,
                                          )
                                        ) {
                                          props.handleChange('receiptNumber')(
                                            option,
                                          );
                                        }
                                      }}
                                      value={props.values.receiptNumber}
                                    />
                                  </Col>
                                )} */}
                              </Row>
                            )}

                            {/* {initValue.chartOfAccountCategoryId.label ==
                              'Sales' && <div className="col-md-6">ss</div>} */}
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
                                      props.handleChange('description')(option)
                                    }
                                    value={props.values.description}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <Row>
                                  <Col lg={6}>
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
                              <Col lg={4}>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3">
                                      <Field
                                        name="attachment"
                                        render={({ field, form }) => (
                                          <div>
                                            <Label>Attachment</Label> <br />
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
                                                this.handleFileChange(e, props);
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
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState(
                                        { createMore: false },
                                        () => {
                                          props.handleSubmit();
                                        },
                                      );
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o"></i>{' '}
                                    Create
                                  </Button>
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn-square mr-3"
                                    onClick={() => {
                                      this.setState(
                                        { createMore: true },
                                        () => {
                                          props.handleSubmit();
                                        },
                                      );
                                    }}
                                  >
                                    <i className="fa fa-repeat"></i> Create and
                                    More
                                  </Button>
                                  <Button
                                    color="secondary"
                                    className="btn-square"
                                    onClick={() => {
                                      this.props.history.push(
                                        '/admin/banking/bank-account/transaction',
                                        { bankAccountId: id },
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
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateBankTransaction);
