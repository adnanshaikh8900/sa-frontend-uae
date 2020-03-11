import React from "react";
import {
  Button,
  Row,
  Col,

  Card,

  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import _ from "lodash";

import { PDFExport } from "@progress/kendo-react-pdf";
import "./style.scss";

import moment from "moment";

class PreviewInvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      invoiceData: {},
      totalNet: 0,
      currencyData: {}
    };
  }

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
  };

  componentDidMount() {
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.id !== this.props.id && nextProps.id) {
      nextProps.getInvoiceById(nextProps.id).then(res => {
        let val = 0;
        if (res.status === 200) {
          res.data.invoiceLineItems.map(item => {
            val = val + item.subTotal;
          });
          this.setState({
            invoiceData: res.data,
            totalNet: val
          },()=>{
            if(this.state.invoiceData.currencyCode) {
              const temp = nextProps.currency_list.filter(item => item.currencyCode === this.state.invoiceData.currencyCode)
              this.setState({
                 currencyData : temp
              })
            }
          });
        }
      }).catch(err => {
        if(err) {
          this.props.closeInvoicePreviewModal()
        }
      });
    }
  }

  render() {
    const { openInvoicePreviewModal, closeInvoicePreviewModal } = this.props;
    const { invoiceData,currencyData } = this.state;
    return (
      <div className="contact-modal-screen">
        <Modal
          isOpen={openInvoicePreviewModal}
          className="modal-success contact-modal"
        >
          <ModalHeader>
          <Button
              className="btn btn-sm edit-btn"
              onClick={() => {
                this.props.history.push('/admin/expense/supplier-invoice/detail', { id: this.props.id })}
              }
            >
              <i className="fa fa-pencil"></i>
            </Button>
            <Button
              className="btn btn-sm pdf-btn"
              onClick={() => {
                this.exportPDFWithComponent();
              }}
            >
              <i className="fa fa-file-pdf-o"></i>
            </Button>
            <Button
              type="button"
              className="btn btn-sm print-btn"
              onClick={() => window.print()}
            >
              <i className="fa fa-print"></i>
            </Button>
            <Button
              color="secondary"
              className=" btn-sm ml-3"
              onClick={() => {
                closeInvoicePreviewModal(false);
              }}
            >
              X
            </Button>
          </ModalHeader>
          <ModalBody>
            <PDFExport
              ref={component => (this.pdfExportComponent = component)}
              scale={0.8}
              paperSize="A4"
            //   margin="2cm"
            >
              <Card id="singlePage" className="box">
                <div className="ribbon ribbon-top-left">
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
                      <h6 className="mb-3">VAT Department:</h6>
                      <h6>1</h6>
                      <div></div>
                      <div>Peshawar KPK 25000</div>
                      <div>UNITED ARAB EMIRATES</div>
                    </div>
                    <div style={{ width: "40%", textAlign: "right" }}>
                      <Table className="table-clear">
                        <tbody>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left" style={{ width: '75%',fontSize: '1.5rem',fontWeight:'500' }}>Invoice</td>
                          </tr>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left" style={{ width: '75%' }}># {invoiceData.referenceNumber}</td>
                          </tr>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left" style={{ width: '75%' }}>   Balance Due
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
                              <td className="left" style={{ width: '75%' }}>Invoice Date :</td>
                              <td className="right" style={{ width: '25%' }}> {moment(invoiceData.invoiceDate).format(
                                "DD MMM YYYY"
                              )}</td>
                            </tr>
                            <tr style={{ textAlign: "right" }}>
                              <td className="left" style={{ width: '75%' }}>Term :</td>
                              <td className="right" style={{ width: '18%' }}>{invoiceData.term}</td>
                            </tr>
                            <tr style={{ textAlign: "right" }}>
                              <td className="left" style={{ width: '75%' }}>Due Date :</td>
                              <td className="right" style={{ width: '25%' }}>{moment(invoiceData.invoiceDueDate).format(
                                "DD MMM YYYY"
                              )}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <Table striped responsive>
                    <thead style={{ background: "black" }}>
                      <tr style={{ color: "white" }}>
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
                              <td className="left">{item.description}</td>
                              <td className="left">{item.quantity}</td>
                              <td style={{ textAlign: "right" }}>
                                {item.unitPrice}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.subTotal}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                  <Row>
                    <Col lg="4" sm="5"></Col>
                    <Col lg="4" sm="5" className="ml-auto">
                      <Table className="table-clear">
                        <tbody>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left">
                              <strong>Subtotal</strong>
                            </td>
                            <td className="right">{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${this.state.totalNet}`: `${this.state.totalNet}`}</td>
                          </tr>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left">
                              <strong>
                                Discount 
                                {invoiceData.discountPercentage
                                  ? `(${invoiceData.discountPercentage}%)`
                                  : ""}
                                
                              </strong>
                            </td>
                            <td className="right">{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} `:''}{invoiceData.discount ? invoiceData.discount : 0.00} </td>
                          </tr>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left">
                              <strong>VAT</strong>
                            </td>
                            <td className="right">
                            {currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.totalVatAmount}`: `${invoiceData.totalVatAmount}`}
                            </td>
                          </tr>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left">
                              <strong>Total</strong>
                            </td>
                            <td className="right">
                              <strong>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.totalAmount}`:`${invoiceData.totalAmount}`}</strong>
                            </td>
                          </tr>
                          <tr style={{ textAlign: "right" }}>
                            <td className="left">
                              <strong>Balance Due</strong>
                            </td>
                            <td className="right">
                                <strong>{currencyData[0] && currencyData[0].currencySymbol ? `${currencyData[0].currencySymbol} ${invoiceData.dueAmount}`:`${invoiceData.dueAmount}`}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </PDFExport>
          </ModalBody>

        </Modal>
      </div>
    );
  }
}

export default PreviewInvoiceModal;
