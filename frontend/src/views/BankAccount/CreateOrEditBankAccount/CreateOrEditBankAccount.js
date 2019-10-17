import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Collapse
} from "reactstrap";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import sendRequest from "../../../xhrRequest";
import _ from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autosuggest from "react-autosuggest";
import Loader from "../../../Loader";
class CreateOrEditBankAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryValue: "",
      currencyValue: "",
      selectedCountry: {},
      selectedCurrency: {},
      countryList: [],
      currencylist: [],
      accountTypeList: [],
      vatCategoryList: [],
      bankAccountStatusList: [],
      btnstatus: "",
      bankData: {
        countryName: "",
        currencyName: "",
        isprimaryAccountFlag: "true",
        personalCorporateAccountInd: "C",
        openingBalance: "",
        bankAccountType: {},
        // bankAccountType: { id: 1, name: "Saving" },
        bankAccountStatus: ""
      },
      collapse: true,
      loading: false,
    };
  }

  componentDidMount() {
    this.getAccountType();
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.getBankAccountStatus();
    if (id) {
      this.setState({ loading: true });
      const res = sendRequest(
        `rest/bank/getbyid?id=${id}`,
        "get",
        ""
      );
      res
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
            return res.json();
          }
        })
        .then(data => {
          const { bankCountry, bankAccountCurrency, openingBalance, bankAccountStatus } = data;
          this.setState({
            bankData: {
              ...data,
              countryName: bankCountry.countryFullName,
              currencyName: bankAccountCurrency.description,
              bankAccountStatus: bankAccountStatus.bankAccountStatusCode,
              openingBalance: `${bankAccountCurrency.currencySymbol} ${openingBalance}`
            },
            currencySymbol: bankAccountCurrency.currencySymbol,
          });
        });
    }
  }

  getBankAccountStatus = () => {
    this.setState({ loading: true });
    const res = sendRequest(
      `rest/bank/getbankaccountstatus`,
      "get",
      ""
    );
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ bankAccountStatusList: data })
      });
  }

  getCountryListData = (countryStr) => {
    const res = sendRequest(`rest/bank/getcountry?countryStr=${countryStr}`, "get", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ countryList: data })
        return data;
      });
  };

  getCurrencyListData = (currencyStr) => {
    const res = sendRequest(`rest/bank/getcurrenncy?currencyStr=${currencyStr}`, "get", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ currencylist: data })
        return data;
      });
  };

  getAccountType = () => {
    const res = sendRequest(`rest/bank/getaccounttype`, "get", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ accountTypeList: data });
      });
  };

  handleChange = (e, name) => {
    this.setState({
      bankData: _.set(
        { ...this.state.bankData },
        e.target.name && e.target.name !== "" ? e.target.name : name,
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
    });
  };

  success = () => {
    return toast.success("Transaction Category Updated successfully... ", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  handleSubmit = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const { bankAccountId, bankAccountName, bankName, personalCorporateAccountInd, isprimaryAccountFlag, accountNumber, ibanNumber, swiftCode,
      bankAccountStatus, bankAccountType, bankAccountCurrency, bankCountry } = this.state.bankData;
    const { selectedCountry, selectedCurrency } = this.state;
    let bal = this.state.bankData.openingBalance.split(`${this.state.currencySymbol}`);
    const postObj = {
      bankAccountId: bankAccountId ? bankAccountId : "0",
      bankAccountName,
      bankName,
      bankCountry: selectedCountry.countryCode ? selectedCountry.countryCode : bankAccountCurrency.currencyCode,
      personalCorporateAccountInd,
      isprimaryAccountFlag,
      bankAccountCurrency: selectedCurrency.currencyCode ? selectedCurrency.currencyCode : bankCountry.countryCode,
      bankAccountType: bankAccountType.id,
      bankAccountStatus,
      // bankAccountStatus: this.state.bankData.accountType instanceof Object ? this.state.bankData.accountType : JSON.parse(this.state.bankData.accountType),
      openingBalance: bal[1],
      accountNumber,
      ibanNumber,
      swiftCode
    };
    const res = sendRequest(
      `rest/bank/savebank?id=1`,
      "post",
      postObj
    );
    res.then(res => {
      if (res.status === 200) {
        this.success();
        if (this.state.btnstatus === "addMore") {
          this.setState({ bankData: {} })
          this.props.history.push("create-bank-account");
        } else {
          this.props.history.push("bankAccount");
        }
        // this.props.history.push("bankAccount");
      }
    });
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  getCountrySuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    this.getCountryListData(inputValue);
    return inputLength === 0
      ? []
      : this.state.countryList.filter(
        transaction =>
          transaction.countryName
            .toLowerCase()
            .slice(0, inputLength) === inputValue
      )
  };

  onCountrySuggestionsFetchRequested = ({ value }) => {
    this.setState({
      countryList: this.getCountrySuggestions(value)
    });
  };

  onCountrySuggestionsClearRequested = () => {
    this.setState({
      countryList: []
    });
  };

  getCountrySuggestionValue = suggestion => suggestion.countryFullName;

  onCountrySuggestionSelected = (e, val) => {
    this.setState({ selectedCountry: val.suggestion });
  };

  renderCountrySuggestion = suggestion => <div>{suggestion.countryFullName}</div>;

  onCountryChange = (event, { newValue }) => {
    this.setState({
      bankData: { ...this.state.bankData, countryName: newValue }
    });
  };

  getCurrencySuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    this.getCurrencyListData(inputValue);
    return inputLength === 0
      ? []
      : this.state.currencylist.filter(
        transaction =>
          transaction.currencyName
            .toLowerCase()
            .slice(0, inputLength) === inputValue
      )
  };

  onCurrencySuggestionsFetchRequested = ({ value }) => {
    this.setState({
      currencylist: this.getCurrencySuggestions(value)
    });
  };

  onCurrencySuggestionsClearRequested = () => {
    this.setState({
      currencylist: []
    });
  };

  getCurrencySuggestionValue = suggestion => suggestion.description;

  onCurrencySuggestionSelected = (e, val) => {
    this.setState({ selectedCurrency: val.suggestion });
    this.setState({
      currencySymbol: val.suggestion.currencySymbol,
      bankData: { ...this.state.bankData, currencyName: val.suggestion.description, openingBalance: `${val.suggestion.currencySymbol} ` }
    });
  };

  renderCurrencySuggestion = suggestion => <div>{suggestion.description}</div>;

  onCurrencyChange = (event, { newValue }) => {
    this.setState({
      bankData: { ...this.state.bankData, currencyName: newValue }
    });
  };

  render() {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    const { loading, countryList, accountTypeList, currencylist, bankAccountStatusList } = this.state;
    const { countryName, bankAccountName, currencyName, isprimaryAccountFlag, personalCorporateAccountInd, bankName, accountNumber, swiftCode, ibanNumber,
      openingBalance, bankAccountStatus, bankAccountType } = this.state.bankData
        ? this.state.bankData
        : {};

    const countryInputProps = {
      placeholder: "Type Country Name",
      value: countryName,
      onChange: this.onCountryChange
    };

    const currencyInputProps = {
      placeholder: "Type Currency Name",
      value: currencyName,
      onChange: this.onCurrencyChange
    };
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            {id ? "Edit Bank Account" : "New Bank Account"}
          </CardHeader>
          <div className="create-bank-wrapper">
            <Row >
              <Col xs="12">
                <Form onSubmit={this.handleSubmit} class="bank-form" name="simpleForm">
                  <Card>
                    <CardHeader> Bank Account</CardHeader>
                    <CardBody>
                      <Row className="row-wrapper">
                        <Col md="4">
                          <FormGroup >
                            <Label htmlFor="bankAccountName" className="required">
                              Account Name
                          </Label>
                            <Input
                              type="text"
                              id="bankAccountName"
                              name="bankAccountName"
                              placeholder="Enter Account Name"
                              required
                              value={bankAccountName}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup >
                            <Label htmlFor="select" className="required">Currency</Label>
                            <Autosuggest
                              className="autoSuggest"
                              suggestions={currencylist}
                              onSuggestionsFetchRequested={
                                this.onCurrencySuggestionsFetchRequested
                              }
                              onSuggestionsClearRequested={
                                this.onCurrencySuggestionsClearRequested
                              }
                              getSuggestionValue={this.getCurrencySuggestionValue}
                              onSuggestionSelected={this.onCurrencySuggestionSelected}
                              renderSuggestion={this.renderCurrencySuggestion}
                              inputProps={currencyInputProps}
                              required
                            />
                          </FormGroup>
                        </Col>
                        {
                          id ?
                            <Col md="4">
                              <FormGroup >
                                <Label htmlFor="select" className="required">Status</Label>
                                <Input
                                  type="select"
                                  name="bankAccountStatus"
                                  value={bankAccountStatus}
                                  id="bankAccountStatus"
                                  onChange={e => this.handleChange(e, "bankAccountStatus")}
                                  required
                                >
                                  {bankAccountStatusList.map((item, index) => (
                                    // <option key={index} value={JSON.stringify(item)}>
                                    <option key={index} value={item.bankAccountStatusCode}>
                                      {" "}
                                      {item.bankAccountStatusName}
                                    </option>
                                  ))}
                                </Input>
                              </FormGroup>
                            </Col>
                            : ""
                        }
                        <Col md="4">
                          <FormGroup >
                            <Label htmlFor="select" className="required">Opening Balance</Label>
                            <Input
                              type="text"
                              id="openingBalance"
                              name="openingBalance"
                              placeholder="Enter Openning Balance"
                              value={openingBalance}
                              required
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                        {/* </Row>
                      <Row> */}
                        <Col md="4">
                          <Label htmlFor="select" className="d-block required">Is this your primary account?</Label>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="inline-radio1" name="isprimaryAccountFlag" value="true" onChange={this.handleChange} checked={isprimaryAccountFlag} />
                            <Label className="form-check-label" check htmlFor="inline-radio1">Yes</Label>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="inline-radio2" name="isprimaryAccountFlag" value="false" onChange={this.handleChange} checked={isprimaryAccountFlag} />
                            <Label className="form-check-label" check htmlFor="inline-radio2">No</Label>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <Label htmlFor="select" className="d-block required">Is this your personal account?</Label>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="inline-radio1" name="personalCorporateAccountInd" value="P" onChange={this.handleChange} checked={personalCorporateAccountInd === "P"} />
                            <Label className="form-check-label" check htmlFor="inline-radio1">Yes</Label>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="inline-radio2" name="personalCorporateAccountInd" value="C" onChange={this.handleChange} checked={personalCorporateAccountInd === "C"} />
                            <Label className="form-check-label" check htmlFor="inline-radio2">No</Label>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup >
                            <Label htmlFor="select" className="required">Account Type</Label>
                            <Input
                              type="select"
                              name="bankAccountType"
                              value={bankAccountType}
                              id="bankAccountType"
                              onChange={e => this.handleChange(e, "bankAccountType")}
                              required
                            >
                              {accountTypeList.map((item, index) => (
                                // <option key={index} value={JSON.stringify(item)}>
                                <option key={index} value={item}>
                                  {" "}
                                  {item.name}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      Bank Account
                     <div className="card-header-actions">
                        <Button color="link" className="card-header-action btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></Button>
                      </div>
                    </CardHeader>
                    <Collapse isOpen={this.state.collapse} id="collapseExample">
                      <CardBody>

                        <Row className="row-wrapper">
                          <Col md="4">
                            <FormGroup >
                              <Label htmlFor="bankName" className="required">
                                Bank Name
                              </Label>
                              <Input
                                type="text"
                                id="bankName"
                                name="bankName"
                                placeholder="Enter Bank Name"
                                value={bankName}
                                onChange={this.handleChange}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup >
                              <Label htmlFor="accountNumber" className="required">
                                Account Number
                              </Label>
                              <Input
                                type="number"
                                id="accountNumber"
                                name="accountNumber"
                                value={accountNumber}
                                placeholder="Enter Account Number"
                                onChange={this.handleChange}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup >
                              <Label htmlFor="swiftCode">
                                Swift Code
                              </Label>
                              <Input
                                type="text"
                                id="swiftCode"
                                name="swiftCode"
                                placeholder="Enter Swift Code"
                                value={swiftCode}
                                onChange={this.handleChange}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="4">
                            <FormGroup >
                              <Label htmlFor="ibanNumber">
                                IBAN Number
                              </Label>
                              <Input
                                type="text"
                                id="ibanNumber"
                                name="ibanNumber"
                                placeholder="Enter IBAN Number"
                                value={ibanNumber}
                                onChange={this.handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup >
                              <Label htmlFor="text-input">
                                Country
                              </Label>
                              <Autosuggest
                                className="autoSuggest"
                                suggestions={countryList}
                                onSuggestionsFetchRequested={
                                  this.onCountrySuggestionsFetchRequested
                                }
                                onSuggestionsClearRequested={
                                  this.onCountrySuggestionsClearRequested
                                }
                                getSuggestionValue={this.getCountrySuggestionValue}
                                onSuggestionSelected={this.onCountrySuggestionSelected}
                                renderSuggestion={this.renderCountrySuggestion}
                                inputProps={countryInputProps}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Collapse>
                  </Card>
                  <Row className="bank-btn-wrapper">
                    {/* <FormGroup>
                      <Button type="submit" size="sm" color="primary" value="Submit" name="simpleForm">
                        <i className="fa fa-dot-circle-o "></i> Save
                      </Button>
                    </FormGroup>
                    <FormGroup>
                      <Button type="submit" size="sm" color="primary" value="SubmitAndAdd" name="simpleForm">
                        <i className="fa fa-dot-circle-o"></i> Save & Add More
                      </Button>
                    </FormGroup> */}
                    <FormGroup>
                      <Col>
                        <Button type="submit" size="sm" color="primary">
                          <i className="fa fa-dot-circle-o"></i> {id ? "Update" : "Save"}
                        </Button>
                        <Button size="sm" color="primary" onSubmit={() => this.setState({ btnstatus: "addMore" }, e => this.handleSubmit(e))}>
                          <i className="fa fa-dot-circle-o"></i> {id ? "Update & Add More" : "Save & Add More"}
                        </Button>
                      </Col>
                    </FormGroup>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Card>
        {
          loading ?
            <Loader></Loader>
            : ""
        }
      </div>
    );
  }
}

export default CreateOrEditBankAccount;
