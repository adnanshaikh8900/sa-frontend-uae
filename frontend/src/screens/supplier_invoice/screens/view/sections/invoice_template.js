import React, { Component } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Table
} from 'reactstrap'
import moment from 'moment'
import '../style.scss'

class InvoiceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  //   componentWillReceiveProps(nextProps) {
  //     if (nextProps.invoiceData !== this.props.hidden) {
  //         IntercomAPI("update", { hide_default_launcher: nextProps.hidden });
  //     }
  // }

  getRibbonColor = () => {
    const { invoiceData } = this.props
    if (invoiceData) {
      switch (invoiceData.status) {
        case 'Pending':
          return 'pending-color';
        case 'Post':
          return 'post-color';
        case 'Saved':
          return 'saved-color'
      }
    }
  }

  render() {
    const { invoiceData, currencyData, totalNet } = this.props
    console.log(currencyData)
    return (
      <div>
        <Card id="singlePage" className="box">
          <div className={`ribbon ribbon-top-left ${this.getRibbonColor()}`}>
            <span>{invoiceData.status}</span>
          </div>
          <CardBody style={{ marginTop: "7rem" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div style={{ width: "60%" }}>
                {/* <h6 className="mb-3">VAT Department:</h6>
                <h6>1</h6>
                <div></div>
                <div>Peshawar KPK 25000</div>
                <div>UNITED ARAB EMIRATES</div> */}
              </div>
              <div style={{ width: "40%", textAlign: "right" }}>
                <Table className="table-clear">
                  <tbody>
                    <tr style={{ textAlign: "right" }}>
                      <td style={{ width: '75%', fontSize: '1.5rem', fontWeight: '500' }}>Invoice</td>
                    </tr>
                    <tr style={{ textAlign: "right" }}>
                      <td style={{ width: '75%' }}># {invoiceData.referenceNumber}</td>
                    </tr>
                    <tr style={{ textAlign: "right" }}>
                      <td style={{ width: '75%' }}>   Balance Due
                        <br />
                        <b style={{ fontWeight: "600" }}>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.dueAmount}` : `${invoiceData.dueAmount}`}</b></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem"
              }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end"
                }}
              >
                <h6 style={{ fontWeight: "600" }}>
                  Bill To
                        <br />#
                      </h6>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ width: "100%" }}>
                  <Table className="table-clear">
                    <tbody>
                      <tr style={{ textAlign: "right" }}>
                        <td style={{ width: '75%' }}>Invoice Date :</td>
                        <td style={{ width: '25%' }}> {moment(invoiceData.invoiceDate).format(
                          "DD MMM YYYY"
                        )}</td>
                      </tr>
                      <tr style={{ textAlign: "right" }}>
                        <td style={{ width: '75%' }}>Term :</td>
                        <td style={{ width: '18%' }}>{invoiceData.term}</td>
                      </tr>
                      <tr style={{ textAlign: "right" }}>
                        <td style={{ width: '75%' }}>Due Date :</td>
                        <td style={{ width: '25%' }}>{moment(invoiceData.invoiceDueDate).format(
                          "DD MMM YYYY"
                        )}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            <Table striped responsive>
              <thead style={{ backgroundColor: "black" }}>
                <tr className="header-row">
                  <th className="center" style={{ padding: "0.5rem" }}>
                    #
                        </th>
                  {/* <th style={{ padding: '0.5rem' }}>Item</th> */}
                  <th style={{ padding: "0.5rem" }}>Description</th>
                  <th className="center" style={{ padding: "0.5rem" }}>
                    Quantity
                        </th>
                  <th style={{ padding: "0.5rem", textAlign: "right" }}>
                    Unit Cost
                        </th>
                        <th style={{ padding: "0.5rem",textAlign: 'right' }}>
                    Vat
                        </th>
                  <th style={{ padding: "0.5rem", textAlign: "right" }}>
                    Total
                        </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceLineItems &&
                  invoiceData.invoiceLineItems.length &&
                  invoiceData.invoiceLineItems.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="center">{index + 1}</td>
                        <td >{item.description}</td>
                        <td >{item.quantity}</td>
                        <td style={{ textAlign: "right",width: '20%'}}>
                          {item.unitPrice}
                        </td>
                        <td style={{ textAlign: "right" }}>{`${item.vatPercentage}%`}</td>
                        <td style={{ textAlign: "right" }}>
                          {item.subTotal}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            <Row>
              <Col lg="8" sm="5"></Col>
              <Col lg="4" sm="7">
                <Table className="table-clear cal-table">
                  <tbody>
                    <tr style={{ textAlign: "right" }}>
                      <td style={{ width: '60%' }}>
                        <strong>Subtotal</strong>
                      </td>
                      <td>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${totalNet}` : `${totalNet}`}</td>
                    </tr>
                    <tr style={{ textAlign: "right" }}>
                      <td>
                        <strong>
                          Discount
                                {invoiceData.discountPercentage
                            ? `(${invoiceData.discountPercentage}%)`
                            : ""}

                        </strong>
                      </td>
                      <td>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ` : ''}{invoiceData.discount ? invoiceData.discount : 0.00} </td>
                    </tr>
                    <tr style={{ textAlign: "right" }}>
                      <td>
                        <strong>VAT</strong>
                      </td>
                      <td>
                        {currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.totalVatAmount}` : `${invoiceData.totalVatAmount}`}
                      </td>
                    </tr>
                    <tr style={{ textAlign: "right" }}>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.totalAmount}` : `${invoiceData.totalAmount}`}</strong>
                      </td>
                    </tr>
                    <tr style={{ textAlign: "right", background: '#f2f2f2' }}>
                      <td>
                        <strong>Balance Due</strong>
                      </td>
                      <td>
                        <strong>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.dueAmount}` : `${invoiceData.dueAmount}`}</strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    )
  }
}


export default InvoiceTemplate