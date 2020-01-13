import React, { Component } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Col,
  FormGroup,
  Label,
  Input,
  Form
} from "reactstrap";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import sendRequest from "../../../../xhrRequest";
import _ from "lodash";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autosuggest from "react-autosuggest";
import Loader from "../../../../Loader";
class CreateOrEditTransactionCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      suggestions: [],
      parentValue: "",
      parentSuggestions: [],
      transactionCategoryList: [],
      parentCategoryCodeList: [],
      vatCategoryList: [],
      transactionData: {
        defaltFlag: "N",
        transactionTypeName: ""
      },
      loading: false
    };
  }

  componentDidMount() {
    this.getTransactionListData();
    this.getvatListData();
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    if (id) {
      this.setState({ loading: true });
      const res = sendRequest(
        `rest/transaction/edittransactioncategory?id=${id}`,
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
          const {
            transactionCategoryId,
            transactionCategoryName,
            transactionCategoryCode,
            transactionCategoryDescription,
            parentTransactionCategory,
            defaltFlag,
            transactionType
          } = data;
          this.setState({
            transactionData: {
              transactionCategoryId,
              categoryName: transactionCategoryName,
              categoryCode: transactionCategoryCode,
              defaltFlag,
              categoryDiscription: transactionCategoryDescription,
              transactionTypeCode: transactionType.transactionTypeCode,
              parentTransactionCategory: parentTransactionCategory.transactionCategoryName,
              transactionTypeName: transactionType.transactionTypeName
            },
            selectedParentCategory: parentTransactionCategory,
            selectedTransactionCategory: transactionType
          });
        });
    }
  }
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : this.state.transactionCategoryList.filter(
        transaction =>
          transaction.transactionTypeName
            .toLowerCase()
            .slice(0, inputLength) === inputValue
      );
  };
  getSuggestionValue = suggestion => suggestion.transactionTypeName;

  // Use your imagination to render suggestions.
  renderSuggestion = suggestion => <div>{suggestion.transactionTypeName}</div>;

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  getParentCategoryCodeListData = (val) => {
    const code = this.state.selectedTransactionCategory.transactionTypeCode;
    const res = sendRequest(`rest/transaction/getparenttransaction?TransactionTypeCode=${code}&transcationTxt=${val}`, "get", "", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ parentCategoryCodeList: data });
        return data;
      });
  };

  getParentSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    this.getParentCategoryCodeListData(inputValue);
    return inputLength === 0
      ? []
      : this.state.parentCategoryCodeList.filter(
        transaction =>
          transaction.transactionCategoryName
            .toLowerCase()
            .slice(0, inputLength) === inputValue
      );
  };

  getParentSuggestionValue = suggestion => suggestion.transactionCategoryName;

  renderParentSuggestion = suggestion => <div>{suggestion.transactionCategoryName}</div>

  onParentChange = (event, { newValue }) => {
    this.setState({
      parentValue: newValue
    });
  };
  onParentSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      parentSuggestions: this.getParentSuggestions(value)
    });
  };

  onParentSuggestionsClearRequested = () => {
    this.setState({
      parentSuggestions: []
    });
  };

  getTransactionListData = () => {
    const res = sendRequest(`rest/transaction/gettransactiontype`, "get", "", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ transactionCategoryList: data });
      });
  };

  getvatListData = () => {
    const res = sendRequest(`rest/transaction/getvatcategories`, "get", "", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ vatCategoryList: data });
      });
  };

  handleChange = (e, name) => {
    this.setState({
      transactionData: _.set(
        { ...this.state.transactionData },
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

  handleSubmit = (e, status) => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.setState({ loading: true });
    e.preventDefault();
    const {
      categoryName,
      categoryCode,
      categoryDiscription,
      selectVatCategoryCode,
      defaltFlag
    } = this.state.transactionData;
    const { selectedParentCategory } = this.state;
    let postObj;
    postObj = {
      transactionCategoryId: id ? id : "0",
      transactionCategoryName: categoryName,
      transactionCategoryCode: categoryCode,
      defaltFlag: defaltFlag,
      parentTransactionCategory: selectedParentCategory.transactionCategoryId,
      transactionCategoryDescription: categoryDiscription,
      vatCategory: selectVatCategoryCode,
      transactionType: this.state.selectedTransactionCategory
        ? this.state.selectedTransactionCategory.transactionTypeCode
        : ""
    };
    //  else {
    //   postObj = { ...this.state.transactionData };
    // }
    const res = sendRequest(
      `rest/transaction/savetransaction?id=1`,
      "post",
      postObj
    );
    res.then(res => {
      if (res.status === 200) {
        this.success();
        if (status === "addMore") {
          this.setState({ transaction: {} })
          this.props.history.push("create-transaction-category");
        } else {
          this.props.history.push("settings/transaction-category");
        }
      }
    });
  };

  onSuggestionSelected = (e, val) => {
    this.setState({ selectedTransactionCategory: val.suggestion });
  };

  onParentSuggestionSelected = (e, val) => {
    this.setState({ selectedParentCategory: val.suggestion });
  };

  render() {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    const { loading, selectedTransactionCategory, transactionData } = this.state;
    const {
      transactionTypeName,
      categoryName,
      categoryCode,
      defaltFlag,
      categoryDiscription,
      parentTransactionCategory,
    } = transactionData;
    const { value, suggestions, parentValue, parentSuggestions } = this.state;

    const inputProps = {
      placeholder: "Type Transaction CategoryType",
      value: transactionTypeName ? transactionTypeName : value,
      onChange: this.onChange
    };
    const parentInputProps = {
      placeholder: "Type Prent Category Code",
      value: parentTransactionCategory ? parentTransactionCategory : parentValue,
      onChange: this.onParentChange
    };
    return (
      <div className="animated">
        <Card>
          <CardHeader>
            {id ? "Edit Vat Category" : "New Transaction Category"}
          </CardHeader>
          <CardBody>
            <Form onSubmit={this.handleSubmit} name="simpleForm">
              {/* <Row> */}
              <FormGroup>
                <Col xs="4">
                  <FormGroup>
                    <Label htmlFor="categoryName" className="required">Category Name</Label>
                    <Input
                      type="text"
                      id="categoryName"
                      name="categoryName"
                      placeholder="Enter Category Name"
                      value={categoryName}
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs="4">
                  <FormGroup>
                    <Label htmlFor="categoryCode" className="required">Category Code</Label>
                    <Input
                      type="text"
                      id="categoryCode"
                      name="categoryCode"
                      placeholder="Enter Category Code"
                      value={categoryCode}
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs="4">
                  <FormGroup>
                    <Label htmlFor="categoryDiscription">
                      Category Description
                    </Label>
                    <Input
                      type="textarea"
                      id="categoryDiscription"
                      name="categoryDiscription"
                      value={categoryDiscription}
                      placeholder="Enter  Category Description"
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col md="3">
                  <Label>Default Flag</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio1"
                      name="defaltFlag"
                      value="Y"
                      checked={defaltFlag === "Y"}
                      onChange={this.handleChange}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio1"
                    >
                      Yes
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio2"
                      name="defaltFlag"
                      value="N"
                      checked={defaltFlag === "N"}
                      onChange={this.handleChange}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio2"
                    >
                      No
                    </Label>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs="4">
                  <FormGroup>
                    <Label htmlFor="selectCategoryCode">
                      Vat Category Code
                    </Label>
                    <Input
                      type="select"
                      name="selectVatCategoryCode"
                      value={transactionTypeName}
                      id="selectCategoryCode"
                      onChange={this.handleChange}
                      required
                    >
                      {this.state.vatCategoryList.map((item, index) => (
                        <option key={index} value={item.id}>
                          {" "}
                          {item.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col xs="4">
                  <FormGroup>
                    <Label htmlFor="selectTransactionType">
                      Transaction Type
                    </Label>
                    <Autosuggest
                      className="autoSuggest"
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={
                        this.onSuggestionsFetchRequested
                      }
                      onSuggestionsClearRequested={
                        this.onSuggestionsClearRequested
                      }
                      getSuggestionValue={this.getSuggestionValue}
                      onSuggestionSelected={this.onSuggestionSelected}
                      renderSuggestion={this.renderSuggestion}
                      inputProps={inputProps}
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
              {selectedTransactionCategory ? (
                <FormGroup>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="selectTransactionType">
                        Parent Transaction Type
                      </Label>
                      <Autosuggest
                        className="autoSuggest"
                        suggestions={parentSuggestions}
                        onSuggestionsFetchRequested={
                          this.onParentSuggestionsFetchRequested
                        }
                        onSuggestionsClearRequested={
                          this.onParentSuggestionsClearRequested
                        }
                        getSuggestionValue={this.getParentSuggestionValue}
                        onSuggestionSelected={this.onParentSuggestionSelected}
                        renderSuggestion={this.renderParentSuggestion}
                        inputProps={parentInputProps}
                      />
                    </FormGroup>
                  </Col>
                </FormGroup>
              ) : (
                  ""
                )}
              <FormGroup>
                <Col>
                  <Button type="submit" size="sm" color="primary">
                    <i className="fa fa-dot-circle-o"></i> {id ? "Update" : "Save"}
                  </Button>
                  <Button size="sm" color="primary" onSubmit={(e) => this.handleSubmit(e, "addMore")}>
                    <i className="fa fa-dot-circle-o"></i> {id ? "Update & Add More" : "Save & Add More"}
                  </Button>
                </Col>
              </FormGroup>
              {/* </Row> */}
            </Form>
          </CardBody>
        </Card>
        {loading ? (
          <Loader></Loader>
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default CreateOrEditTransactionCategory;
