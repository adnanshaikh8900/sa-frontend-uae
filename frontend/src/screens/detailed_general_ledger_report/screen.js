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
  FormGroup,
  Label,
  Form,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'

import _ from "lodash"
import Select from 'react-select'
import { DateRangePicker2 } from 'components'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { CSVLink, CSVDownload } from "react-csv";
import FilterComponent from './sections/filterComponent'




import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-select/dist/react-select.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
  })
}


class DetailedGeneralLedgerReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
      view: false,
      initValue : {
        from_date: moment().startOf('month').format('DD/MM/YYYY'),
				to_date: moment().endOf('month').format('DD/MM/YYYY'),
      }
    }
    this.columnHeader = [
      'Date',
      'Account',
      'Transaction Details',
      'Transaction Type',
      'Transaction#',
      'Reference#',
      'Debit',
      'Credit',
      'Amount'
    ]

    this.toggle = this.toggle.bind(this)
    this.tempdata = [[
      { 'Date': '10/02/2020', 'Account': 'Accounts Receivable', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' },
      { 'Date': '10/02/2020', 'Account': 'Accounts Receivable', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' }
    ],
    [
      { 'Date': '10/02/2020', 'Account': 'Sales', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' },
      { 'Date': '10/02/2020', 'Account': 'Sales', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' }
    ]
    ]

    this.csvData = [
      { 'Date': '10/02/2020', 'Account': 'Accounts Receivable', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' },
      { 'Date': '10/02/2020', 'Account': 'Accounts Receivable', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' },
      { 'Date': '10/02/2020', 'Account': 'Sales', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' },
      { 'Date': '10/02/2020', 'Account': 'Sales', 'Transaction Details': 'Scott Johnson', 'Transaction Type': 'Customer Payment', 'Reference#': '', 'Transaction#': 'INV- 000001', 'Debit': '10, 757.31', 'Credit': '', 'Amount': '10, 757.31' }
    ]
  }


  exportToXlxs = (csvData, fileName) => {
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    exportToXls = (csvData, fileName) => {
      const fileType = 'application/vnd.ms-excel';
      const fileExtension = '.xls';
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xls', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

  toggle = () => this.setState(prevState => {
    return { dropdownOpen: !prevState.dropdownOpen }
  });

  viewFilter = () =>this.setState(prevState => {
    return { view: !prevState.view }
  });

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
  };

  generateReport = (value) => {
    
  }
  render() {
    return (
      <div className="transactions-report-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                    <div><p className="mb-0" style={{cursor: 'pointer',fontSize: '1rem',paddingLeft: '15px'}} onClick={this.viewFilter}><i className="fa fa-cog mr-2"></i>Customize Report</p></div>
                    <div className="d-flex">
                      <div className="mr-2 print-btn-cont" onClick={() => window.print()}><i className="fa fa-print"></i></div>
                      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                          Export As
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={this.exportPDFWithComponent}>Pdf</DropdownItem>
                          <DropdownItem><CSVLink data={this.csvData} className="csv-btn" filename={"detailGeneralLedger.csv"}>CSV (Comma Separated Value)</CSVLink></DropdownItem>
                          <DropdownItem onClick={()=>{this.exportToXls(this.csvData,'detailGeneralLedger')}}>XLS (Microsoft Excel 1997-2004 Compatible)</DropdownItem>
                          <DropdownItem onClick={()=>{this.exportToXlxs(this.csvData,'detailGeneralLedger')}}>XLSX (Microsoft Excel)</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <div className={`panel ${this.state.view ? 'view-panel' : ''}`}><FilterComponent viewFilter={this.viewFilter} generateReport={(value)=>{this.generateReport(value)}}/></div>
            <PDFExport
              ref={component => (this.pdfExportComponent = component)}
              scale={0.8}
              paperSize="A3"
            //   margin="2cm"
            >
              <CardBody id="section-to-print">
                <div style={{ textAlign: 'center',margin: '3rem 0' }}>
                  <p>SimpleVat Solutions Pvt Ltd<br style={{ marginBottom: '5px' }} />
                    Detailed General Ledger<br style={{ marginBottom: '5px' }} />
                    Basis: Accrual<br style={{ marginBottom: '5px' }} />
                    From {this.state.initValue.from_date} To {this.state.initValue.to_date}
                </p>
                </div>
                <div className="table-wrapper">
                  <Table>
                    <thead>
                      {this.columnHeader.map(column => {
                        return <th style={{ fontWeight: '600'}}>{column}</th>
                      })}
                    </thead>
                    <tbody>
                      {this.tempdata.map((item, index) => {
                        return (
                          <>
                            <tr style={{ background: '#f7f7f7' }}><td colSpan="9"><b style={{ fontWeight: '600' }}>{item[index].Account}</b></td></tr>
                            <tr>
                              <td>As On 01/01/2020 </td>
                              <td colSpan="5">Opening Balance</td>
                              <td></td>
                              <td>0.00</td>
                              <td></td>
                            </tr>
                            {item.map(row => {
                              return (
                                <tr>
                                  <td style={{ width: '15%' }}>{row.Date}</td>
                                  <td>{row.Account}</td>
                                  <td>{row['Transaction Details']}</td>
                                  <td>{row["Transaction Type"]}</td>
                                  <td>{row["Reference#"]}</td>
                                  <td>{row["Transaction#"]}</td>
                                  <td>{row.Debit}</td>
                                  <td>{row.Credit}</td>
                                  <td>{row.Amount}</td>
                                </tr>
                              )
                            })}
                            <tr>
                              <td>As On 31/01/2020 </td>
                              <td colSpan="5">Closing Balance</td>
                              <td>0.00</td>
                              <td></td>
                              <td></td>
                            </tr>
                          </>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </PDFExport>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedGeneralLedgerReport)
