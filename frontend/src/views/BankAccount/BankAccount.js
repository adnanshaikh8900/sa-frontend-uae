import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import sendRequest from '../../xhrRequest';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Loader";
class BankAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bankAccountList: [],
      loading: true
    }

    // this.table = data.rows;
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
      sizePerPageList: [{
        text: '10', value: 10
      }, {
        text: '25', value: 25
      }, {
        text: 'All', value: this.state.bankAccountList ? this.state.bankAccountList.length : 0
      }]
    }

  }

  componentDidMount() {
    this.getBankListData();
  }

  getBankListData = () => {
    const res = sendRequest(`rest/bank/getbanklist`, "get", "");
    res.then((res) => {
      if (res.status === 200) {
        this.setState({ loading: false });
        return res.json();
      }
    }).then(data => {
      this.setState({ bankAccountList: data });
    })
  }

  success = () => {
    return toast.success('Bank Account Deleted Successfully... ', {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  deleteBank = (data) => {
    this.setState({ loading: true })
    this.setState({ openDeleteModal: false });
    const res = sendRequest(`rest/bank/deletebank?id=${this.state.selectedData.bankAccountId}`, "delete", "");
    res.then(res => {
      if (res.status === 200) {
        this.setState({ loading: false });
        this.success();
        this.getBankListData();
      }
    })
  }

  bankAccounttActions = (cell, row) => {
    return (
      <div className="d-flex">
        <Button block color="primary" className="btn-pill vat-actions" title="Edit Vat Category" onClick={() => this.props.history.push(`/create-bank-account?id=${row.bankAccountId}`)}><i className="far fa-edit"></i></Button>
        <Button block color="primary" className="btn-pill vat-actions" title="Transaction" onClick={() => this.props.history.push(`/create-bank-account?id=${row.id}`)}><i className="fas fa-university"></i></Button>
        <Button block color="primary" className="btn-pill vat-actions" title="Delete Vat Ctegory" onClick={() => this.setState({ selectedData: row }, () => this.setState({ openDeleteModal: true }))}><i className="fas fa-trash-alt"></i></Button>
      </div>
    );
  };

  setStatus = (cell, row) => row.bankAccountStatus.bankAccountStatusName;

  setCurrentBal = (cell, row) => `${row.bankAccountCurrency.currencySymbol} ${this.formatNumber(row.openingBalance)}`

  formatNumber(num) {
    let n = num ? num : 0;
    return Number.parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  render() {
    const { bankAccountList, loading } = this.state;
    const containerStyle = {
      zIndex: 1999
    };
    return (
      <div className="animated">
        <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Bank Account
                    </CardHeader>
          <CardBody>
            <Button className="mb-3" onClick={() => this.props.history.push(`/create-bank-account`)}>New</Button>
            <BootstrapTable
              keyField="bankAccountId"
              data={bankAccountList}
              filter={filterFactory()}
              columns={[
                {
                  dataField: 'bankAccountName',
                  text: 'Account Name',
                  filter: textFilter(),
                  sort: true
                },
                {
                  dataField: 'accountNumber',
                  text: 'Account Number',
                  filter: textFilter(),
                  sort: true
                },
                {
                  dataField: 'swiftCode',
                  text: 'Swift Code',
                  filter: textFilter(),
                  sort: true
                },
                {
                  dataField: '',
                  text: 'Status',
                  formatter: this.setStatus,
                  filter: textFilter(),
                  sort: true
                },
                {
                  dataField: 'openingBalance',
                  text: 'Current Balance',
                  formatter: this.setCurrentBal,
                  filter: textFilter(),
                  sort: true
                },
                {
                  dataField: '',
                  text: 'Action',
                  formatter: this.bankAccounttActions
                },
              ]}
              filter={filterFactory()}
              pagination={paginationFactory(this.options)}
            />
          </CardBody>
        </Card>
        <Modal isOpen={this.state.openDeleteModal}
          className={'modal-danger ' + this.props.className}>
          <ModalHeader toggle={this.toggleDanger}>Delete</ModalHeader>
          <ModalBody>
            Are you sure want to delete this record?
                  </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteBank}>Yes</Button>{' '}
            <Button color="secondary" onClick={() => this.setState({ openDeleteModal: false })}>No</Button>
          </ModalFooter>
        </Modal>
        {
          loading ?
            <Loader></Loader>
            : ""
        }
      </div>
    );
  }
}

export default BankAccount;
