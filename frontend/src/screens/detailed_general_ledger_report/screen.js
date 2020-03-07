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
import { BootstrapTable, TableHeaderColumn, SearchField, SizePerPageDropDown } from 'react-bootstrap-table'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { CSVLink, CSVDownload } from "react-csv";
import FilterComponent from './sections/filterComponent'
import { Loader } from 'components'

import * as DetailGeneralLedgerActions from './actions'
import Pagination from "react-js-pagination";


import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-select/dist/react-select.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    profile: state.auth.profile
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    detailGeneralLedgerActions: bindActionCreators(DetailGeneralLedgerActions, dispatch),

  })
}


class DetailedGeneralLedgerReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dropdownOpen: false,
      detailedGeneralLedgerList: [],
      view: false,
      initValue: {
        startDate: moment().startOf('month').format('DD/MM/YYYY'),
        endDate: moment().endOf('month').format('DD/MM/YYYY'),
        report_basis: 'Accrual'
      },
      csvData: [],
      activePage: 1,
      sizePerPage: 10,
      totalCount: 0
    }
    this.columnHeader = [
      'Date',
      'Transaction Type',
      'Account',
      'Transaction Details',
      'Transaction#',
      'Reference#',
      'Debit',
      'Credit',
      'Amount'
    ]

    this.toggle = this.toggle.bind(this)
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    const { initValue } = this.state
    const postData = {
      startDate: initValue.startDate,
      endDate: initValue.endDate
    }
    this.props.detailGeneralLedgerActions.getDetailedGeneralLedgerList(postData).then(res => {
      const tempData = []
      if (res.status === 200) {
        res.data.map(item => {
          item.map(val => {
            tempData.push(val)
          })
        })
        this.setState({ detailedGeneralLedgerList: res.data, csvData: tempData }, () => {
          this.setState({
            loading: false
          })
        })
      }
    }).catch(err => {
      this.setState({ loading: false })
      // this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }


  exportToXlxs = (csvData, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToXls = (csvData, fileName) => {
    const fileType = 'application/vnd.ms-excel';
    const fileExtension = '.xls';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xls', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  toggle = () => this.setState(prevState => {
    return { dropdownOpen: !prevState.dropdownOpen }
  });

  viewFilter = () => this.setState(prevState => {
    return { view: !prevState.view }
  });

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
  };

  generateReport = (value) => {
    this.setState(prevState => {
      return {
        initValue: {
          startDate: moment(value.startDate).format('DD/MM/YYYY'),
          endDate: moment(value.endDate).format('DD/MM/YYYY'),
          report_basis: value.report_basis.value,
        },
        loading: true,
        view: !this.state.view
      }
    }, () => {
      this.initializeData()
    });
  }

  handlePageChange = () => {

  }

  getInvoice = (type) => {
    // switch (type) {
    //   case 'INVOICE':
    //     this.props.history.push('/admin/revenue/customer-invoice')
    //     break;
    //   case 'EXPENSE':
    //     this.props.history.push('/admin/revenue/customer-invoice');
    //     break;
    //   case 'BANK_ACCOUNT':
    //     this.props.history.push('/admin/revenue/customer-invoice');
    //     break;
    //   case 'MANUAL':
    //     this.props.history.push('/admin/revenue/customer-invoice');
    //     break;
    // }
  }

  render() {

    const { loading } = this.state
    const { profile } = this.props
    return (
      <div className="transactions-report-screen">
        <div className="animated fadeIn">
          <Card>
            {loading ? <Loader /> : (
              <div>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center" style={{ justifyContent: 'space-between' }}>
                        <div><p className="mb-0" style={{ cursor: 'pointer', fontSize: '1rem', paddingLeft: '15px' }} onClick={this.viewFilter}><i className="fa fa-cog mr-2"></i>Customize Report</p></div>
                        <div className="d-flex">
                          <div className="mr-2 print-btn-cont" onClick={() => window.print()}><i className="fa fa-print"></i></div>
                          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                              Export As
                        </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={this.exportPDFWithComponent}>Pdf</DropdownItem>
                              <DropdownItem><CSVLink data={this.state.csvData} className="csv-btn" filename={"detailGeneralLedger.csv"}>CSV (Comma Separated Value)</CSVLink></DropdownItem>
                              <DropdownItem onClick={() => { this.exportToXls(this.state.csvData, 'detailGeneralLedger') }}>XLS (Microsoft Excel 1997-2004 Compatible)</DropdownItem>
                              <DropdownItem onClick={() => { this.exportToXlxs(this.state.csvData, 'detailGeneralLedger') }}>XLSX (Microsoft Excel)</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <div className={`panel ${this.state.view ? 'view-panel' : ''}`}><FilterComponent viewFilter={this.viewFilter} generateReport={(value) => { this.generateReport(value) }} /></div>
                <PDFExport
                  ref={component => (this.pdfExportComponent = component)}
                  scale={0.8}
                  paperSize="A3"
                //   margin="2cm"
                >
                  <CardBody id="section-to-print">
                    <div style={{ textAlign: 'center', margin: '3rem 0' }}>
                      <p>{this.props.profile && this.props.profile.company && this.props.profile.company['companyName'] ? this.props.profile.company['companyName'] : ''}<br style={{ marginBottom: '5px' }} />
                        Detailed General Ledger<br style={{ marginBottom: '5px' }} />
                        {/* Basis: {this.state.initValue.report_basis}<br style={{ marginBottom: '5px' }} /> */}
                        From {this.state.initValue.startDate} To {this.state.initValue.endDate}
                      </p>
                    </div>
                    <div className="table-wrapper">
                      <Table>
                        <thead>
                          <tr>
                            {this.columnHeader.map((column, index) => {
                              return <th key={index} style={{ fontWeight: '600' }}>{column}</th>
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.detailedGeneralLedgerList && this.state.detailedGeneralLedgerList.length > 0 ? this.state.detailedGeneralLedgerList.map((item, index) => {
                            // console.log(item[index]['transactionTypeName'])
                            return (
                              <>
                                <tr style={{ background: '#f7f7f7' }}><td colSpan="9"><b style={{ fontWeight: '600' }}>{item[0]['transactionTypeName']}</b></td></tr>
                                {/* <tr>
                              <td>As On 01/01/2020 </td>
                              <td colSpan="5">Opening Balance</td>
                              <td></td>
                              <td>0.00</td>
                              <td></td>
                            </tr> */}
                                {item.map((row, index) => {
                                  return (
                                    <tr key={index}>
                                      <td style={{ width: '15%' }}>{row.date}</td>
                                      <td style={{ width: '20%' }}>{row.transactionTypeName}</td>
                                      <td>{row['name']}</td>
                                      <td>{row["postingReferenceTypeEnum"]}</td>
                                      <td>{row["transactonRefNo"]}</td>
                                      <td>{row["referenceNo"]}</td>
                                      <td>{row.debitAmount > 0 ? <p onClick={this.getInvoice(row['postingReferenceType'])}>{row.debitAmount}</p> : ''}</td>
                                      <td>{row.creditAmount > 0 ? <p onClick={this.getInvoice(row['postingReferenceType'])}>{row.creditAmount}</p> : ''}</td>
                                      <td>{row.amount}</td>
                                    </tr>
                                  )
                                })}
                                {/* <tr>
                              <td>As On 31/01/2020 </td>
                              <td colSpan="5">Closing Balance</td>
                              <td>0.00</td>
                              <td></td>
                              <td></td>
                            </tr> */}
                              </>
                            ) 
                          }) : (
                            <tr style={{borderBottom: '2px solid lightgray'}}>
                              <td style={{textAlign: 'center'}} colSpan="9">There is no data to display</td>
                              </tr>
                          ) }
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </PDFExport>
                {/* <div>
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.sizePerPage}
                    totalItemsCount={this.state.totalCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div> */}
              </div>
            )
            }
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedGeneralLedgerReport)
