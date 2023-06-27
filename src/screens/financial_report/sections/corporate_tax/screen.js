import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Button,
  Col,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Row,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  DropdownToggle,
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { AuthActions, CommonActions } from "services/global";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";
import * as Vatreport from "./actions";
import { upperFirst } from "lodash-es";
// import { AgGridReact, AgGridColumn } from 'ag-grid-react/lib/agGridReact';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import moment from "moment";
// import download from "downloadjs";
// import {
//   DeleteModal,
//   FileTaxReturnModal,
//   GenerateVatReportModal,
//   VatSettingModal,
// } from "../vat_reports/sections";
import { ConfirmDeleteModal, Currency, Loader } from "components";
import { data } from "../../../Language/index";
import LocalizedStrings from "react-localization";

const mapStateToProps = (state) => {
  return {
    version: state.common.version,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
    vatreport: bindActionCreators(Vatreport, dispatch),
  };
};

let strings = new LocalizedStrings(data);
class CorporateTax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: {},
      loading: false,
      fileName: "",
      actionButtons: {},
      disabled: false,
      file_data_list: [],
      openModal: false,
      openVatSettingModal: false,
      openFileTaxRetrunModal: false,
      coaName: "",
      vatReportDataList: [],
      options: [
        { label: "Montly", value: 0 },
        { label: "Quarterly", value: 2 },
      ],
      enbaleReportGeneration: false,
      monthOption: { label: "Montly", value: 0 },
      paginationPageSize: 10,
      dialog: false,
      current_report_id: "",
      deleteModal: false,
      loadingMsg: "Loading...",
    };

    this.options = {
      // onRowClick: this.goToDetail,
      page: 1,
      sizePerPage: 10,
      onSizePerPageList: this.onSizePerPageList,
      onPageChange: this.onPageChange,
      sortName: "",
      sortOrder: "",
      onSortChange: this.sortColumn,
    };
  }

  onPageSizeChanged = (newPageSize) => {
    var value = document.getElementById("page-size").value;
    this.gridApi.paginationSetPageSize(Number(value));
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  // onSizePerPageList = (sizePerPage) => {
  //   if (this.options.sizePerPage !== sizePerPage) {
  //     this.options.sizePerPage = sizePerPage;
  //     this.getInitialData();
  //   }
  // };

  // onPageChange = (page, sizePerPage) => {
  //   if (this.options.page !== page) {
  //     this.options.page = page;
  //     this.getInitialData();
  //   }
  // };

  onBtnExport = () => {
    this.gridApi.exportDataAsCsv();
  };

  onBtnExportexcel = () => {
    this.gridApi.exportDataAsExcel();
  };

  // componentDidMount = () => {
  //   this.getInitialData();
  // };
  
  handleChange = (key, val) => {
    this.setState({
      [key]: val,
    });
  };

  closeModal = (res) => {
    this.setState({ openModal: false });
  };

  closeVatSettingModal = (res) => {
    this.setState({ openVatSettingModal: false });
  };

  closeFileTaxRetrunModal = (res) => {
    this.setState({ openFileTaxRetrunModal: false });
  };

  closeDeleteModal = (res) => {
    this.setState({ deleteModal: false });
  };

  showHeader = (s) => {
    return upperFirst(s.replace(/([a-z])([A-Z])/g, "$1 $2"));
  };

  toggleActionButton = (index) => {
    let temp = Object.assign({}, this.state.actionButtons);
    if (temp[parseInt(index, 10)]) {
      temp[parseInt(index, 10)] = false;
    } else {
      temp[parseInt(index, 10)] = true;
    }
    this.setState({
      actionButtons: temp,
    });
  };

  getActionButtons = (cell, params) => {
    return (
      // DROPDOWN ACTIONS

      <ButtonDropdown
        isOpen={this.state.actionButtons[params.id]}
        toggle={() => this.toggleActionButton(params.id)}
      >
        <DropdownToggle size="sm" color="primary" className="btn-brand icon">
          {this.state.actionButtons[params.id] === true ? (
            <i className="fas fa-chevron-up" />
          ) : (
            <i className="fas fa-chevron-down" />
          )}
        </DropdownToggle>

        {/* Menu start */}
        <DropdownMenu right>
          {/* View */}

          <DropdownItem
            // onClick={() => {
            // 			this.setState({current_report_id:params.id})
            // 			let dateArr = params.taxReturns ? params.taxReturns.split("-") : [];
            // 			this.props.history.push('/admin/report/vatreports/view',{startDate:dateArr[0] ?dateArr[0] :'',endDate:dateArr[1] ?dateArr[1] :''})
            // }}
            onClick={() => {
              this.setState({ current_report_id: params.id });
              let dateArr = params.taxReturns
                ? params.taxReturns.split("-")
                : [];
              this.props.history.push(
                `/admin/report/vatreports/view?id=${params.id}`,
                {
                  startDate: dateArr[0] ? dateArr[0] : "",
                  endDate: dateArr[1] ? dateArr[1] : "",
                }
              );
            }}
          >
            <i className="fas fa-eye" /> View
          </DropdownItem>

          {/* delete */}

          {params.status === "UnFiled" ? (
            <DropdownItem
              onClick={() => {
                // this.delete(params.id)
                this.setState({
                  current_report_id: params.id,
                  deleteModal: true,
                });
              }}
            >
              <i className="fas fa-trash" /> Delete
            </DropdownItem>
          ) : (
            ""
          )}

          {/* Record Payment */}

          {params.status === "Filed" || params.status === "Partially Paid" ? (
            <DropdownItem
              onClick={() => {
                this.setState({ current_report_id: params.id });
                if (params.totalTaxReclaimable != 0)
                  this.props.history.push(
                    "/admin/report/vatreports/recordclaimtax",
                    {
                      id: params.id,
                      totalTaxReclaimable: params.totalTaxReclaimable,
                      taxReturns: params.taxReturns,
                    }
                  );
                else
                  this.props.history.push(
                    "/admin/report/vatreports/recordtaxpayment",
                    {
                      id: params.id,
                      taxReturns: params.taxReturns,
                      totalTaxPayable: params.totalTaxPayable,
                      balanceDue: params.balanceDue,
                    }
                  );
              }}
            >
              {" "}
              <i className="fas fa-university" /> Record Payment
            </DropdownItem>
          ) : (
            ""
          )}

          {/* Mark It Unfiled  */}

          {params.status === "Filed" ? (
            <DropdownItem
              onClick={() => {
                this.setState({ current_report_id: params.id });
                this.markItUnfiled(params);
              }}
            >
              {" "}
              <i class="fas fa-unlink" /> Mark It Unfiled
            </DropdownItem>
          ) : (
            ""
          )}

          {/* File The Report */}

          {params.status === "UnFiled" ? (
            <DropdownItem
              onClick={() => {
                this.setState({
                  openFileTaxRetrunModal: true,
                  current_report_id: params.id,
                  taxReturns: params.taxReturns,
                });
              }}
            >
              {" "}
              <i class="fas fa-link" /> File The Report
            </DropdownItem>
          ) : (
            ""
          )}
        </DropdownMenu>
      </ButtonDropdown>
    );
  };

  renderStatus = (params) => {
    return (
      <>
        {params === "UnFiled" ? (
          <label className="badge label-draft"> {params}</label>
        ) : (
          ""
        )}
        {params === "Filed" ? (
          <label className="badge label-due"> {params}</label>
        ) : (
          ""
        )}
        {params === "Partially Paid" ? (
          <label className="badge label-PartiallyPaid"> {params}</label>
        ) : (
          ""
        )}
        {params === "Paid" ? (
          <label className="badge label-paid">{params}</label>
        ) : (
          ""
        )}
        {params === "claimed" ? (
          <label className="badge label-paid text-capitalize">{params}</label>
        ) : (
          ""
        )}
        {params === "Reclaimed" ? (
          <label className="badge label-sent"> {params}</label>
        ) : (
          ""
        )}
      </>
    );
  };

  renderAmount = (amount, params) => {
    if (amount != null && amount != 0)
      return (
        <>
          <Currency value={amount} currencySymbol={params.currency} />
        </>
      );
    else return "---";
  };
  renderBalanceAmount = (amount, params) => {
    if (amount != null) {
      return (
        <label className="badge label-due">
          <Currency value={amount} currencySymbol={params.data.currency} />
        </label>
      );
    } else return "---";
  };

  delete = (id) => {
    const message1 = (
      <text>
        <b>Delete VAT Report File ?</b>
      </text>
    );
    const message =
      "This VAT report file will be deleted permanently and cannot be recovered. ";

    this.setState({
      dialog: (
        <ConfirmDeleteModal
          isOpen={true}
          okHandler={this.remove(id)}
          cancelHandler={this.removeDialog}
          message={message}
          message1={message1}
        />
      ),
    });
  };

  // remove = (current_report_id) => {
  //   this.props.vatreport
  //     .deleteReportById(current_report_id)
  //     .then((res) => {
  //       if (res.status === 200) {
  //         this.props.commonActions.tostifyAlert(
  //           "success",
  //           res.data && res.data.message
  //             ? res.data.message
  //             : "VAT Report File Deleted Successfully"
  //         );
  //         this.setState({
  //           dialog: null,
  //         });
  //         this.getInitialData();
  //       }
  //     })
  //     .catch((err) => {
  //       this.props.commonActions.tostifyAlert(
  //         "error",
  //         err.data ? err.data.message : "VAT Report File Deleted Unsuccessfully"
  //       );
  //       this.setState({
  //         dialog: null,
  //       });
  //     });
  // };

  removeDialog = () => {
    this.setState({
      dialog: null,
    });
  };

  renderDate = (cell, row) => {
    return cell
      ? moment(cell).format("DD-MM-YYYY")
      : // .format('LL')
        "-";
  };

  renderVATNumber = (cell, row) => {
    return <>{row.vatNumber}</>;
  };
  renderTaxReturns = (cell, row) => {
    let dateArr = cell ? cell.split("-") : [];

    let startDate = moment(dateArr[0]).format("DD-MM-YYYY");
    let endDate = moment(dateArr[1]).format("DD-MM-YYYY");

    return <>{dateArr[0].replaceAll("/", "-")}</>;
  };

  render() {
    const {
      vatReportDataList,
      csvFileNamesData,
      dialog,
      options,
      loading,
      loadingMsg,
    } = this.state;
    return loading == true ? (
      <Loader loadingMsg={loadingMsg} />
    ) : (
      <div className="import-bank-statement-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              {dialog}
              {loading && (
                <Row>
                  <Col lg={12} className="rounded-loader">
                    <div>
                      <Loader />
                    </div>
                  </Col>
                </Row>
              )}
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
                          fontSize: "1.3rem",
                          paddingLeft: "15px",
                        }}
                        onClick={this.viewFilter}
                      >
                        {strings.CorporateTax}
                      </p>
                    </div>
                    <div>
                      <Button
                        className="mr-2 btn btn-danger"
                        onClick={() => {
                          this.props.history.push("/admin/report/reports-page");
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <span>X</span>
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            {dialog}

            <CardBody>
              {/* <div 	className="text-center mb-4 mt-2 " > <h1>VAT Report</h1></div> */}
              <Row>
                <Col lg={12} className="mb-5">
                  <div className="table-wrapper">
                    <FormGroup className="text-center">
                      <Button
                        color="primary"
                        className="btn-square  pull-right"
                        onClick={() => {
                          this.props.history.push(
                            "/admin/report/vatreports/vatpaymentrecordhistory"
                          );
                        }}
                      >
                        <i className="fas fa-history"></i> {strings.CTPaymentHistory}
                      </Button>

                      <Button
                        name="button"
                        color="primary"
                        className="btn-square pull-right "
                        // disabled={!this.state.enbaleReportGeneration}
                        // title={!this.state.enbaleReportGeneration?"Select VAT Reporting Period":""}
                        onClick={() => {
                          this.setState({ openModal: true });
                        }}
                      >
                        <i class="fas fa-plus"></i> Generate CT Report
                      </Button>

                      <Button
                        name="button"
                        color="primary"
                        className="btn-square pull-right "
                        // disabled={!this.state.enbaleReportGeneration}
                        // title={!this.state.enbaleReportGeneration?"Select VAT Reporting Period":""}
                        onClick={() => {
                          this.setState({ openModal: true });
                        }}
                      >
                        <i class="fas fa-cog"></i> Corporate Tax Settings
                      </Button>

                      {/* <Button color="primary" className="btn-square  pull-right"
												onClick={() => {
													this.setState({ openVatSettingModal: true })
												}}>
												<i className="fa"></i>Company Details
											</Button>  */}
                    </FormGroup>
                  </div>
                </Col>
              </Row>

              <div>
                <BootstrapTable
                  selectRow={this.selectRowProp}
                  options={this.options}
                  version="4"
                  hover
                  responsive
                  remote
                  data={
                    vatReportDataList && vatReportDataList.data
                      ? vatReportDataList.data
                      : []
                  }
                  // data={vatReportDataList.data ? vatReportDataList.data : []}
                  // rowData={vatReportDataList.data ? vatReportDataList.data : []}
                  pagination={
                    vatReportDataList &&
                    vatReportDataList.data &&
                    vatReportDataList.data.length
                      ? true
                      : false
                  }
                  fetchInfo={{
                    dataTotalSize: vatReportDataList.count
                      ? vatReportDataList.count
                      : 0,
                    }}
                >
                  <TableHeaderColumn
                    tdStyle={{ whiteSpace: "normal" }}
                    isKey
                    dataField="taxPeriod"
                    dataSort
                    className="table-header-bg"
                  >
                    Tax Period
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="dueDate"
                    // columnTitle={this.customEmail}
                    dataSort
                    dataFormat={this.renderDate}
                    className="table-header-bg"
                  >
                    Due Date
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="10%"
                    dataField="netIncome"
                    dataAlign="right"
                    dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    Net Income
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="taxableAmount"
                    // columnTitle={this.customEmail}
                    dataAlign="right"
                    dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    Taxable Amount
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="taxAmount"
                    // columnTitle={this.customEmail}
                    dataAlign="right"
                    dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                    >
                    Tax Amount
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="filedOn"
                    // columnTitle={this.customEmail}
                    dataSort
                    dataFormat={this.renderDate}
                    className="table-header-bg"
                    >
                    Filed On
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="status"
                    dataAlign="center"
                    // columnTitle={this.customEmail}
                    dataSort
                    dataFormat={this.renderStatus}
                    className="table-header-bg"
                  >
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="balanceDue"
                    // columnTitle={this.customEmail}
                    dataAlign="right"
                    dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    Balance Due
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    className="text-right table-header-bg"
                    columnClassName="text-right"
                    width="5%"
                    dataFormat={this.getActionButtons}
                  ></TableHeaderColumn>
                </BootstrapTable>
              </div>
            </CardBody>
          </Card>
        </div>
        {/* <GenerateVatReportModal
          openModal={this.state.openModal}
          setState={(e) => this.setState(e)}
          vatReportDataList={vatReportDataList}
          state={this.state}
          monthOption={this.state.monthOption}
          closeModal={(e) => {
            this.closeModal(e);
            this.getInitialData();
          }}
        />
        <VatSettingModal
          openModal={this.state.openVatSettingModal}
          closeModal={(e) => {
            this.closeVatSettingModal(e);
            this.getInitialData();
          }}
        />
        <FileTaxReturnModal
          openModal={this.state.openFileTaxRetrunModal}
          current_report_id={this.state.current_report_id}
          endDate={this.state.endDate}
          taxReturns={this.state.taxReturns}
          closeModal={(e) => {
            this.closeFileTaxRetrunModal(e);
            this.getInitialData();
          }}
        />
        <DeleteModal
          openModal={this.state.deleteModal}
          current_report_id={this.state.current_report_id}
          closeModal={(e) => {
            this.closeDeleteModal(e);
            this.getInitialData();
          }}
        /> */}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CorporateTax);
