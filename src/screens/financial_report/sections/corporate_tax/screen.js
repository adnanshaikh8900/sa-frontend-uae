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
import * as CTReportAction from "./actions";
import { upperFirst } from "lodash-es";
import { CTReport, CTSettingModal, FileCtReportModal } from './sections';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import moment from "moment";
// import download from "downloadjs";
import { ConfirmDeleteModal, Currency, Loader } from "components";
import { data } from "../../../Language/index";
import LocalizedStrings from "react-localization";

const mapStateToProps = (state) => {
  console.log(state)
  return {
    version: state.common.version,
    setting_list: state.reports.setting_list,
    ctReport_list: state.reports.ctReport_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
    ctReportAction: bindActionCreators(CTReportAction, dispatch),
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
      openCTReportModal: false,
      openCTSettingModal: false,
      openFileCtReportModal: false,
      coaName: "",
      ctReport_list: [],
      options: [
        { label: "Montly", value: 0 },
        { label: "Yearly", value: 1 },
        { label: "Quarterly", value: 2 },
      ],
      monthOption: { label: "Montly", value: 0 },
      paginationPageSize: 10,
      dialog: false,
      current_report_id: "",
      deleteModal: false,
      loadingMsg: "Loading...",
      fiscalYearOptions: [],
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

  componentDidMount = () => {
    this.props.ctReportAction.getCTSettings();
    this.props.ctReportAction.getCorporateTaxList();
  };

  handleChange = (key, val) => {
    this.setState({
      [key]: val,
    });
  };

  closeModal = (res) => {
    this.setState({ openCTReportModal: false });
  };

  closeCTSettingModal = (res) => {
    this.setState({ openCTSettingModal: false });
  };

  closeFileTaxRetrunModal = (res) => {
    this.setState({ openFileCtReportModal: false });
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
                    "/admin/report/corporate-tax/payment-record",
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
                  openFileCtReportModal: true,
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
  renderTaxPeriod = (cell, row) => {
    let startDate = moment(row.startDate).format("DD-MM-YYYY");
    let endDate = moment(row.endDate).format("DD-MM-YYYY");

    return <>{startDate} To {endDate}</>;
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
    const { ctReport_list } = this.props;
    const setting = this.props.setting_list ? this.props.setting_list.find(obj => obj.selectedFlag === true) : '';
    console.log(setting,this.props.setting_list);
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
                            "/admin/report/corporate-tax/payment-history"
                          );
                        }}
                      >
                        <i className="fas fa-history"></i> {strings.CTPaymentHistory}
                      </Button>

                      <Button
                        name="button"
                        color="primary"
                        className="btn-square pull-right "
                        disabled={setting ? setting.isEligibleForCP ? false : true : true}
                        onClick={() => {
                          //const setting = this.props.setting_list ? this.props.setting_list.find(obj => obj.selectedFlag === true) : '';
                          const fiscalYearOptions = [];
                          if (setting) {
                            const startingMonth = setting.fiscalYear.split(' - ')[0];
                            const startingDate = startingMonth === 'January' ? '1-1-' : '6-1-';
                            const startingYear = startingMonth === 'January' ? moment().year() + 1 : moment().year();
                            // const startingYear = startingMonth === 'January' ? moment().month() > 1 ? moment().year()+1 : moment.year() : moment().month() > 6 ? moment().year()+1 : moment.year() ;
                            for (let i = 0; i < 4; i++) {
                              const year = parseInt(startingYear) + parseInt(i);
                              const date = startingDate + year;
                              fiscalYearOptions.push({ value: date, label: startingMonth + '-' + year })
                            }
                          }
                          this.setState({ fiscalYearOptions: fiscalYearOptions, openCTReportModal: true });
                        }}
                      >
                        <i class="fas fa-plus"></i> {strings.GenerateCTReport}
                      </Button>

                      <Button
                        name="button"
                        color="primary"
                        
                        disabled={setting ? true : false}
                        className="btn-square pull-right "
                        onClick={() => {
                          this.setState({ openCTSettingModal: true });
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
                    ctReport_list && ctReport_list.data
                      ? ctReport_list.data
                      : []
                  }
                  // data={ctReport_list.data ? ctReport_list.data : []}
                  // rowData={ctReport_list.data ? ctReport_list.data : []}
                  pagination={
                    ctReport_list &&
                      ctReport_list.data &&
                      ctReport_list.data.length
                      ? true
                      : false
                  }
                  fetchInfo={{
                    dataTotalSize: ctReport_list.count
                      ? ctReport_list.count
                      : 0,
                  }}
                >
                  <TableHeaderColumn
                    tdStyle={{ whiteSpace: "normal" }}
                    width="20%"
                    dataAlign="left"
                    // dataSort
                    dataFormat={this.renderTaxPeriod}
                    className="table-header-bg"
                  >
                    Tax Period
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    isKey = {true}
                    dataField="dueDate"
                    dataAlign="left"
                    // columnTitle={this.customEmail}
                    // dataSort
                    dataFormat={this.renderDate}
                    className="table-header-bg"
                  >
                    {strings.DueDate}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="10%"
                    dataField="netIncome"
                    dataAlign="right"
                    // dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    {strings.NetIncome}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="taxableAmount"
                    // columnTitle={this.customEmail}
                    dataAlign="right"
                    // dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    {strings.TaxableAmount}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="taxAmount"
                    // columnTitle={this.customEmail}
                    dataAlign="right"
                    // dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    {strings.TaxAmount}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="filedOn"
                    // columnTitle={this.customEmail}
                    // dataSort
                    dataFormat={this.renderDate}
                    dataAlign="left"
                    className="table-header-bg"
                  >
                    {strings.FiledOn}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="status"
                    dataAlign="center"
                    // columnTitle={this.customEmail}
                    // dataSort
                    dataFormat={this.renderStatus}
                    className="table-header-bg"
                  >
                    {strings.STATUS}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="balanceDue"
                    // columnTitle={this.customEmail}
                    dataAlign="right"
                    // dataSort
                    dataFormat={this.renderAmount}
                    className="table-header-bg"
                  >
                    {strings.BalanceDue}
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
        <CTReport
          openModal={this.state.openCTReportModal}
          setState={(e) => this.setState(e)}
          fiscalYearOptions={this.state.fiscalYearOptions}
          closeModal={(e) => {
            this.closeModal(e);
          }}
        />
        <CTSettingModal
          openModal={this.state.openCTSettingModal}
          closeModal={(e) => {
            this.closeCTSettingModal(e);
            // this.getInitialData();
          }}
        />
        <FileCtReportModal
          openModal={this.state.openFileCtReportModal}
          current_report_id={this.state.current_report_id}
          endDate={this.state.endDate}
          taxReturns={this.state.taxReturns}
          closeModal={(e) => {
            this.closeFileTaxRetrunModal(e);
            // this.getInitialData();
          }}
        />
        {/* <DeleteModal
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
