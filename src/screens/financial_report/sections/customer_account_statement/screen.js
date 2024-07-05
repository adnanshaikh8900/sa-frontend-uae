import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import moment from "moment";
import { PDFExport } from "@progress/kendo-react-pdf";
import * as XLSX from "xlsx";
import { Loader } from "components";
import * as FinancialReportActions from "../../actions";
import FilterComponent2 from "../filterComponet2";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { ReportTables } from "screens/financial_report/sections";
import "./style.scss";
import logo from "assets/images/brand/logo.png";
import { data } from "../../../Language/index";
import LocalizedStrings from "react-localization";

const mapStateToProps = (state) => {
  return {
    company_profile: state.reports.company_profile,
    sales_by_customer: state.reports.sales_by_customer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    financialReportActions: bindActionCreators(
      FinancialReportActions,
      dispatch
    ),
  };
};
let strings = new LocalizedStrings(data);
class CustomerAccountStatement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: window["localStorage"].getItem("language"),
      loading: true,
      dropdownOpen: false,
      view: false,
      initValue: {
        startDate: moment().startOf("month").format("DD/MM/YYYY"),
        endDate: moment().endOf("month").format("DD/MM/YYYY"),
      },
      csvData: [],
      activePage: 1,
      sizePerPage: 10,
      totalCount: 0,
      sort: {
        column: null,
        direction: "desc",
      },
      data: [],
    };
  }

  generateReport = (value) => {
    this.setState(
      {
        initValue: {
          startDate: moment(value.startDate).format("DD/MM/YYYY"),
          endDate: moment(value.endDate).format("DD/MM/YYYY"),
        },
        loading: true,
        view: !this.state.view,
      },
      () => {
        this.initializeData();
      }
    );
  };

  componentDidMount = () => {
    this.props.financialReportActions.getCompany();
    this.initializeData();
  };

  initializeData = () => {
    const { initValue } = this.state;
    const postData = {
      startDate: initValue.startDate,
      endDate: initValue.endDate,
    };
    this.props.financialReportActions
      .getCustomerAccountStatement(postData)
      .then(async (res) => {
        if (res.status === 200) {
          const message = `Balance Outstanding Amount As On ${moment(
            new Date()
          ).format("DD-MM-YYYY")}`;
          let customerAccountStatement = res.data.statementOfAccountsModels;
          customerAccountStatement.push({
            contactName: strings.Total,
            totalAmount: res.data.totalAmountTotal,
            invoiceDate: null,
            invoiceNumber: null,
            amountPaid: res.data.amountPaidTotal,
            balanceAmount: res.data.balanceAmountTotal,
            type: null,
          });
          customerAccountStatement = await customerAccountStatement.map(
            (row, i) => {
              row.id = i + 1;
              return row;
            }
          );
          customerAccountStatement.push({    
            contactName: message,
            totalAmount: null,
            invoiceDate: null,
            invoiceNumber: null,
            amountPaid: null,
            balanceAmount: res.data.balanceAmountTotal,
            type: null,
            id: 0,   // define a unique id for the last row to customize the css
          });
          this.setState({
            customerAccountStatement: customerAccountStatement,
            data: res.data,
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  exportFile = () => {
    let dl = "";
    let fn = "";
    let type = "csv";
    var elt = document.getElementById("tbl_exporttable_to_xls");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(wb, fn || "Sales By Customer Report." + (type || "csv"));
  };

  exportExcelFile = () => {
    let dl = "";
    let fn = "";
    let type = "xlsx";
    var elt = document.getElementById("tbl_exporttable_to_xls");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(
          wb,
          fn || "Sales By Customer Report." + (type || "xlsx")
        );
  };

  toggle = () =>
    this.setState((prevState) => {
      return { dropdownOpen: !prevState.dropdownOpen };
    });

  viewFilter = () =>
    this.setState((prevState) => {
      return { view: !prevState.view };
    });

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
  };

  render() {
    strings.setLanguage(this.state.language);
    const {
      loading,
      initValue,
      dropdownOpen,
      customerAccountStatement,
      data,
      view,
    } = this.state;
    const { company_profile } = this.props;
    return (
      <div className="transactions-report-screen">
        <div className="animated fadeIn">
          <Card>
            <div>
              <CardHeader>
                <Row>
                  <Col lg={12}>
                    <div
                      className="h4 mb-0 d-flex align-items-center"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div>
                        <p
                          className="mb-0"
                          style={{
                            cursor: "pointer",
                            fontSize: "1rem",
                            paddingLeft: "15px",
                          }}
                          onClick={this.viewFilter}
                        >
                          <i className="fa fa-cog mr-2"></i>
                          {strings.CustomizeReport}
                        </p>
                      </div>
                      <div className="d-flex">
                        <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                          <DropdownToggle caret>Export As</DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => {
                                this.exportFile();
                              }}
                            >
                              <span
                                style={{
                                  border: 0,
                                  padding: 0,
                                  backgroundColor: "white !important",
                                }}
                              >
                                CSV (Comma Separated Value)
                              </span>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                this.exportExcelFile();
                              }}
                            >
                              <span
                                style={{
                                  border: 0,
                                  padding: 0,
                                  backgroundColor: "white !important",
                                }}
                              >
                                Excel
                              </span>
                            </DropdownItem>
                            <DropdownItem onClick={this.exportPDFWithComponent}>
                              Pdf
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        &nbsp;&nbsp;
                        <div
                          className="mr-2 print-btn-cont"
                          onClick={() => window.print()}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <i className="fa fa-print"></i>
                        </div>
                        <div
                          className="mr-2 print-btn-cont"
                          onClick={() => {
                            this.props.history.push(
                              "/admin/report/reports-page"
                            );
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <span>X</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <div className={`panel ${view ? "view-panel" : ""}`}>
                <FilterComponent2
                  viewFilter={this.viewFilter}
                  generateReport={(value) => {
                    this.generateReport(value);
                  }}
                />{" "}
              </div>
              <CardBody id="section-to-print">
                <PDFExport
                  ref={(component) => (this.pdfExportComponent = component)}
                  scale={0.8}
                  paperSize="A3"
                  fileName="Sales By Customer.pdf"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <img
                        src={
                          company_profile &&
                          company_profile.companyLogoByteArray
                            ? "data:image/jpg;base64," +
                              company_profile.companyLogoByteArray
                            : logo
                        }
                        className=""
                        alt=""
                        style={{ width: " 150px" }}
                      ></img>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <h2>
                        {company_profile && company_profile["companyName"]
                          ? company_profile["companyName"]
                          : ""}
                      </h2>
                      <br style={{ marginBottom: "5px" }} />
                      <b style={{ fontSize: "18px" }}>
                        {strings.SalesByCustomer}
                      </b>
                      <br style={{ marginBottom: "5px" }} />
                      {strings.From} {initValue.startDate.replaceAll("/", "-")}{" "}
                      {strings.To} {initValue.endDate.replaceAll("/", "-")}
                    </div>
                    <div></div>
                  </div>
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <ReportTables
                        reportDataList={customerAccountStatement}
                        reportName={"Customer Account Statement"}
                        id={13}
                        rowHeight={50}
                      />
                    </>
                  )}
                  <div style={{ textAlignLast: "center" }}>
                    {strings.PoweredBy} <b>SimpleAccounts</b>
                  </div>
                </PDFExport>
              </CardBody>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerAccountStatement);
