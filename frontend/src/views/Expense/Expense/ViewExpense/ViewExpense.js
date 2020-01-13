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
  Form,
  Collapse,
} from "reactstrap";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import "react-toastify/dist/ReactToastify.css";
import sendRequest from "../../../../xhrRequest";
import Loader from "../../../../Loader";

class ViewExpense extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapseReceipt: true,
      collapseitemDetails: true,
      collapseExchangeDetails: true,
      loading: false,
      large: false,
      expenseData: {},
      expenseItem: []
    };
    this.toggleLarge = this.toggleLarge.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("id");
    this.getExpenseData(id);
  }

  getExpenseData = (id) => {
    const res = sendRequest(`rest/expense/vieworedit?expenseId=${id}`, "get", "");
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        return res.json();
      }
    }).then(data => {
      this.setState({ expenseData: data, expenseItem: data.expenseItem });
    })
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large
    });
  }

  formatNumber(num) {
    let n = num ? num : 0;
    return Number.parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  render() {
    // console.log("state --> ", this.state)
    const { expenseData, loading, expenseItem } = this.state;
    const { expenseDate, project, expenseDescription, expenseContact, receiptNumber, expenseSubtotal, expenseVATAmount, totalAmount } = expenseData;
    const { firstName, currency } = expenseContact ? expenseContact : {};
    const { currencySymbol } = currency ? currency : {};
    let date = expenseData ? new Date(expenseDate) : "";
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>New Expense</CardHeader>
          <div className="create-bank-wrapper">
            <Row>
              <Col xs="12">
                <Form
                  action=""
                  onSubmit={this.handleSubmit}
                  className="form-horizontal"
                >
                  <Card>
                    <CardHeader>Expense Details</CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label className="expense-headers" htmlFor="text-input">Cliement : </Label>
                            <Label className="expense-labels">{firstName}</Label>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label className="expense-headers" htmlFor="select">Category : </Label>
                            <Label className="expense-labels">{}</Label>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label className="expense-headers" htmlFor="select">Expense Date :  </Label>
                            <Label className="expense-labels">{date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : ""}</Label>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label className="expense-headers" htmlFor="select">Currency : </Label>
                            <Label className="expense-labels">{currency ? currency.description : ""}</Label>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label className="expense-headers" htmlFor="select">Project : </Label>
                            <Label className="expense-labels">{project}</Label>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      Receipt
                      <div className="card-header-actions">
                        <Button
                          color="link"
                          className="card-header-action btn-minimize"
                          data-target="#collapseExample"
                          onClick={() => { this.setState({ collapseReceipt: !this.state.collapseReceipt }) }}
                        >
                          <i className="icon-arrow-up"></i>
                        </Button>
                      </div>
                    </CardHeader>
                    <Collapse isOpen={this.state.collapseReceipt} id="collapseExample">
                      <CardBody>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <Label className="expense-headers" htmlFor="text-input">Reciept Number : </Label>
                              <Label className="expense-labels">{receiptNumber}</Label>
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <Label className="expense-headers" htmlFor="text-input">Attachment Description : </Label>
                              <Label className="expense-labels">{expenseDescription}</Label>
                            </FormGroup>
                          </Col>
                          <Col md="12">

                          </Col>
                        </Row>
                        {/* <Input ref={ref => this.uploadInput = ref} type="file" id="file-input" name="file-input" /> */}
                      </CardBody>
                    </Collapse>
                  </Card>
                  <Card>
                    <CardHeader>
                      Expense Item Details
                    </CardHeader>
                    <Collapse isOpen={this.state.collapseitemDetails} id="collapseExample">
                      <CardBody>
                        <table className="expense-items-table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Product/Service</th>
                              <th>Quantity</th>
                              <th>Unit Price ({currencySymbol})</th>
                              <th>VAT (%)</th>
                              <th>Subtotal ({currencySymbol})</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              expenseItem.map((item, ind) => <tr key={ind}>
                                <td width="3%">
                                  {/* {
                                    ind > 0 ?
                                      <Button
                                        block
                                        color="primary"
                                        className="btn-pill vat-actions"
                                        title="Delete Expense"
                                        onClick={e => this.deleteExpense(e, ind, item)}
                                      >
                                        <i className="fas fa-trash-alt"></i>
                                      </Button> : ""
                                  } */}
                                </td>
                                <td width="20%">
                                  <Label>{item.productName}</Label>
                                </td>
                                <td width="7%">
                                  <Label>{item.quatity}</Label>
                                </td>
                                <td width="25%">
                                  <Label>{this.formatNumber(item.unitPrice)}</Label>
                                </td>
                                <td width="25%">
                                  <Label>{}</Label>
                                </td>
                                <td width="20%">
                                  <label>{item.subTotal ? `${this.formatNumber(item.subTotal)} ${currencySymbol}` : ""}</label>
                                </td>
                              </tr>)
                            }
                          </tbody>
                          <tfoot>
                            <tr>
                              <td rowSpan="3" colSpan="4" className="expense-table-footer"></td>
                              <td className="expense-table-border"><b>Total</b></td>
                              <td className="expense-table-border">{`${this.formatNumber(totalAmount)} ${currencySymbol}`}</td>
                            </tr>
                          </tfoot>
                          <tfoot>
                            <tr>
                              <td rowSpan="3" colSpan="4" className="expense-table-footer"></td>
                              <td className="expense-table-border">Total Net</td>
                              <td className="expense-table-border">{`${this.formatNumber(expenseSubtotal)} ${currencySymbol}`}</td>
                            </tr>
                          </tfoot>
                          <tfoot>
                            <tr>
                              <td rowSpan="3" colSpan="4" className="expense-table-footer"></td>
                              <td className="expense-table-border">Total VAT</td>
                              <td className="expense-table-border">{`${this.formatNumber(expenseVATAmount)} ${currencySymbol}`}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </CardBody>
                    </Collapse>
                  </Card>
                  <Card>
                    <CardHeader>
                      Currency Exchange Details
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label htmlFor="text-input">Exchange Rate : </Label>
                            <Label className="expense-labels">{}</Label>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label htmlFor="text-input">Total Value : </Label>
                            <Label className="expense-labels">{}</Label>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  {/* <Row className="bank-btn-wrapper">
                    <FormGroup>
                      <Button type="submit" className="submit-invoice" size="sm" color="primary">
                        <i className="fa fa-dot-circle-o "></i> Submit
                      </Button>
                      <Button type="submit" size="sm" color="primary">
                        <i className="fa fa-dot-circle-o"></i> Submit
                      </Button>
                    </FormGroup>
                  </Row> */}
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

export default ViewExpense;
