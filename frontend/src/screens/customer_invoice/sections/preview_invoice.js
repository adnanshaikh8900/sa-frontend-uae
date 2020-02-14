import React from 'react'
import {
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Card,
    CardHeader,
    CardBody,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import * as jsPDF from 'jspdf'
import * as html2canvas from 'html2canvas'
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';

class PreviewInvoiceModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    exportPDFWithComponent = () => {
        this.pdfExportComponent.save();
    }

    render() {
        const { openInvoicePreviewModal, closeInvoicePreviewModal } = this.props
        const { initValue } = this.state
        return (
            <div className="contact-modal-screen">
                <Modal isOpen={openInvoicePreviewModal}
                    className="modal-success contact-modal"
                >
                    {/* <ModalHeader toggle={this.toggleDanger}>Preview Invoice</ModalHeader> */}
                    <ModalBody>
                        <PDFExport ref={(component) => this.pdfExportComponent = component}>
                            <Card id="singlePage">
                                <CardHeader>
                                    Invoice <strong>#000002</strong>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ width: '60%' }}>
                                            <h6 className="mb-3">VAT Department:</h6>
                                            <h6>1</h6>
                                            <div></div>
                                            <div>Peshawar KPK 25000</div>
                                            <div>UNITED ARAB EMIRATES</div>
                                        </div>
                                        <div style={{ width: '40%', textAlign: 'right' }}>
                                            <h1 style={{ fontSize: '2.5rem' }}>Invoice</h1>
                                            <p># invoice-000002 </p>
                                            <p>Balance Due<br />
                                                <b style={{ fontWeight: '600' }}>AED 20000</b>
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
                                            <h6 style={{ fontWeight: '600' }}>Bill To<br />
                                                #
          </h6>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ width: '100%' }}>
                                                <div style={{ display: 'flex',justifyContent: 'flex-end' }}>
                                                    <label style={{  marginBottom: '1rem', textAlign: 'right' }}>Invoice Date : </label>
                                                    <p style={{  textAlign: 'right',width: '20%' }}>24 Jan 2020</p>
                                                </div>
                                                <div style={{ display: 'flex',justifyContent: 'flex-end' }}>
                                                    <label style={{ marginBottom: '1rem', textAlign: 'right' }}>Term : </label>
                                                    <p style={{  textAlign: 'right',width: '20%' }}>Due on Receipt</p>
                                                </div>
                                                <div style={{ display: 'flex',justifyContent: 'flex-end' }}>
                                                    <label style={{  marginBottom: '1rem', textAlign: 'right' }}>Due Date : </label>
                                                    <p style={{  textAlign: 'right',width: '20%' }}>24 Jan 2020</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Table striped responsive>
                                        <thead style={{ background: 'black' }}>
                                            <tr style={{ color: 'white' }}>
                                                <th className="center" style={{ padding: '0.5rem' }}>#</th>
                                                <th style={{ padding: '0.5rem' }}>Item</th>
                                                <th style={{ padding: '0.5rem' }}>Description</th>
                                                <th className="center" style={{ padding: '0.5rem' }}>Quantity</th>
                                                <th className="right" style={{ padding: '0.5rem' }}>Unit Cost</th>
                                                <th className="right" style={{ padding: '0.5rem' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="center">1</td>
                                                <td className="left">Origin License</td>
                                                <td className="left">Extended License</td>
                                                <td className="center">1</td>
                                                <td className="right">$999,00</td>
                                                <td className="right">$999,00</td>
                                            </tr>
                                            <tr>
                                                <td className="center">2</td>
                                                <td className="left">Custom Services</td>
                                                <td className="left">Instalation and Customization (cost per hour)</td>
                                                <td className="center">20</td>
                                                <td className="right">$150,00</td>
                                                <td className="right">$3.000,00</td>
                                            </tr>
                                            <tr>
                                                <td className="center">3</td>
                                                <td className="left">Hosting</td>
                                                <td className="left">1 year subcription</td>
                                                <td className="center">1</td>
                                                <td className="right">$499,00</td>
                                                <td className="right">$499,00</td>
                                            </tr>
                                            <tr>
                                                <td className="center">4</td>
                                                <td className="left">Platinum Support</td>
                                                <td className="left">1 year subcription 24/7</td>
                                                <td className="center">1</td>
                                                <td className="right">$3.999,00</td>
                                                <td className="right">$3.999,00</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Row>
                                        <Col lg="4" sm="5">
                                        </Col>
                                        <Col lg="4" sm="5" className="ml-auto">
                                            <Table className="table-clear">
                                                <tbody>
                                                    <tr style={{ textAlign: 'right' }}>
                                                        <td className="left"><strong>Subtotal</strong></td>
                                                        <td className="right">$8.497,00</td>
                                                    </tr>
                                                    <tr style={{ textAlign: 'right' }}>
                                                        <td className="left"><strong>Discount (20%)</strong></td>
                                                        <td className="right">$1,699,40</td>
                                                    </tr>
                                                    <tr style={{ textAlign: 'right' }}>
                                                        <td className="left"><strong>VAT (10%)</strong></td>
                                                        <td className="right">$679,76</td>
                                                    </tr>
                                                    <tr style={{ textAlign: 'right' }}>
                                                        <td className="left"><strong>Total</strong></td>
                                                        <td className="right"><strong>$7.477,36</strong></td>
                                                    </tr>
                                                    <tr style={{ textAlign: 'right' }}>
                                                        <td className="left"><strong>Balance Due</strong></td>
                                                        <td className="right"><strong>AED 20000</strong></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </PDFExport>
                    </ModalBody>
                    <ModalFooter>
                        <Button href="#" className="btn btn-sm btn-info mr-1 float-right" onClick={() => { this.exportPDFWithComponent() }}><i className="fa fa-save"></i> Save</Button>
                        <Button type="button" className="btn btn-sm btn-secondary mr-1 float-right" onClick={() => window.print()}><i className="fa fa-print"></i> Print</Button>
                        <Button color="secondary" className=" btn-sm btn-secondary" onClick={() => { closeInvoicePreviewModal(false) }}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div >
        )
    }
}

export default PreviewInvoiceModal