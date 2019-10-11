import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import sendRequest from "../../../xhrRequest";
import paginationFactory from "react-bootstrap-table2-paginator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Loader";

class TransactionCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactionCategoryList: [],
      openDeleteModal: false,
      loading: true
    };

    this.options = {
      paginationSize: 5,
      sortIndicator: true,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
      showTotal: true,
      paginationTotalRenderer: this.customTotal,
      sizePerPageList: [
        {
          text: "5",
          value: 5
        },
        {
          text: "10",
          value: 10
        },
        {
          text: "All",
          value: this.state.transactionCategoryList
            ? this.state.transactionCategoryList.length
            : 0
        }
      ]
    };
  }

  componentDidMount() {
    this.getTransactionListData();
  }

  getTransactionListData = () => {
    this.setState({ loading: true })
    const res = sendRequest(`rest/transaction/gettransactioncategory`, "get", "");
    res
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          return res.json();
        }
      })
      .then(data => {
        this.setState({ transactionCategoryList: data });
      });
  };

  customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      {console.log("----------------")}
      Showing {from} to {to} of {size} Results
    </span>
  );

  getTransactionType = (cell, row) => row.transactionType.transactionTypeName;
  getparentTransactionCategory = (cell, row) => row.parentTransactionCategory.transactionCategoryDescription;

  transactionActions = (cell, row) => {
    return (
      <div className="d-flex">
        <Button
          block
          color="primary"
          className="btn-pill vat-actions"
          title="Edit Vat Category"
          onClick={() =>
            this.props.history.push(`/create-transaction-category?id=${row.transactionCategoryId}`)
          }
        >
          <i className="far fa-edit"></i>
        </Button>
        <Button
          block
          color="primary"
          className="btn-pill vat-actions"
          title="Delete Transaction Ctegory"
          onClick={() =>
            this.setState({ selectedData: row }, () =>
              this.setState({ openDeleteModal: true })
            )
          }
        >
          <i className="fas fa-trash-alt"></i>
        </Button>
      </div>
    );
  };

  success = () => {
    return toast.success("Transaction Category Deleted Successfully... ", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  deleteTransaction = data => {
    this.setState({ loading: true });
    this.setState({ openDeleteModal: false });
    const res = sendRequest(
      `rest/transaction/deletetransactioncategory?id=${this.state.selectedData.transactionCategoryId}`,
      "delete",
      "",
      ""
    );
    res.then(res => {
      if (res.status === 200) {
        this.setState({ loading: false });
        this.success();
        this.getTransactionListData();
      }
    });
  };

  render() {
    const { transactionCategoryList, loading } = this.state;
    const containerStyle = {
      zIndex: 1999
    };
    console.log(this.state)
    return (
      <div className="animated">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          style={containerStyle}
        />
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Vat
          </CardHeader>
          <CardBody>
            <Button
              className="mb-3"
              onClick={() =>
                this.props.history.push(`/create-transaction-category`)
              }
            >
              New
            </Button>
            <BootstrapTable
              data={transactionCategoryList}
              version="4"
              striped
              hover
              pagination={paginationFactory(this.options)}
              totalSize={
                transactionCategoryList ? transactionCategoryList.length : 0
              }
            >
              <TableHeaderColumn isKey dataField="transactionCategoryCode">
                Category Code
              </TableHeaderColumn>
              <TableHeaderColumn dataField="transactionCategoryName">
                Category Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField="transactionCategoryDescription">
                Category Description
              </TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.getparentTransactionCategory}>
                Parent Transaction Category Name
              </TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.getTransactionType}>
                Transaction Type
              </TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.transactionActions}>
                Action
              </TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
        <Modal
          isOpen={this.state.openDeleteModal}
          className={"modal-danger " + this.props.className}
        >
          <ModalHeader toggle={this.toggleDanger}>Delete</ModalHeader>
          <ModalBody>Are you sure want to delete this record?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteTransaction}>
              Yes
            </Button>{" "}
            <Button
              color="secondary"
              onClick={() => this.setState({ openDeleteModal: false })}
            >
              No
            </Button>
          </ModalFooter>
        </Modal>
        {loading ? (
          <Loader></Loader>
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default TransactionCategory;
