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

class PreviewInvoiceModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    jsPdfGenerator = () => {
        const input = document.getElementById('toPdf');
        const doc = new jsPDF()
        doc.fromHTML(input,15,15)
        doc.save('output.pdf') 
      }

    render() {
        const { openInvoicePreviewModal, closeInvoicePreviewModal } = this.props
        const { initValue } = this.state
        return (
            <div className="contact-modal-screen">
                <Modal isOpen={openInvoicePreviewModal}
                    className="modal-success contact-modal"
                >
                    <ModalHeader toggle={this.toggleDanger}>Preview Invoice</ModalHeader>
                    <ModalBody>
                        <Card id="toPdf">
                            <CardHeader>
                                Invoice <strong>#90-98792</strong>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-4">
                                    <Col sm="4">
                                        <h6 className="mb-3">From:</h6>
                                        <div><strong>BootstrapMaster.com</strong></div>
                                        <div>Konopnickiej 42</div>
                                        <div>43-190 Mikolow, Poland</div>
                                        <div>Email: lukasz@bootstrapmaster.com</div>
                                        <div>Phone: +48 123 456 789</div>
                                    </Col>
                                    <Col sm="4">
                                        <h6 className="mb-3">To:</h6>
                                        <div><strong>BootstrapMaster.com</strong></div>
                                        <div>Konopnickiej 42</div>
                                        <div>43-190 Mikolow, Poland</div>
                                        <div>Email: lukasz@bootstrapmaster.com</div>
                                        <div>Phone: +48 123 456 789</div>
                                    </Col>
                                    <Col sm="4">
                                        <h6 className="mb-3">Details:</h6>
                                        <div>Invoice <strong>#90-98792</strong></div>
                                        <div>March 30, 2013</div>
                                        <div>VAT: PL9877281777</div>
                                        <div>Account Name: BootstrapMaster.com</div>
                                        <div><strong>SWIFT code: 99 8888 7777 6666 5555</strong></div>
                                    </Col>
                                </Row>
                                <Table striped responsive>
                                    <thead>
                                        <tr>
                                            <th className="center">#</th>
                                            <th>Item</th>
                                            <th>Description</th>
                                            <th className="center">Quantity</th>
                                            <th className="right">Unit Cost</th>
                                            <th className="right">Total</th>
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
                                                <tr>
                                                    <td className="left"><strong>Subtotal</strong></td>
                                                    <td className="right">$8.497,00</td>
                                                </tr>
                                                <tr>
                                                    <td className="left"><strong>Discount (20%)</strong></td>
                                                    <td className="right">$1,699,40</td>
                                                </tr>
                                                <tr>
                                                    <td className="left"><strong>VAT (10%)</strong></td>
                                                    <td className="right">$679,76</td>
                                                </tr>
                                                <tr>
                                                    <td className="left"><strong>Total</strong></td>
                                                    <td className="right"><strong>$7.477,36</strong></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <a href="#" className="btn btn-success"><i className="fa fa-usd"></i> Proceed to Payment</a>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button href="#" className="btn btn-sm btn-info mr-1 float-right"   onClick={() => { this.jsPdfGenerator() }}><i className="fa fa-save"></i> Save</Button>
                        <Button href="#" className="btn btn-sm btn-secondary mr-1 float-right"><i className="fa fa-print"></i> Print</Button>
                        <Button color="secondary" className=" btn-sm btn-secondary" onClick={() => { closeInvoicePreviewModal(false) }}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div >
        )
    }
}

export default PreviewInvoiceModal