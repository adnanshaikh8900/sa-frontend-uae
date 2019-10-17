
import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import sendRequest from '../../../xhrRequest';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../Loader';

class Expense extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expenseList: [],
            openDeleteModal: false,
            loading: true
        }

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
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: 'All', value: this.state.expenseList ? this.state.expenseList.length : 0
            }]
        }

    }

    componentDidMount() {
        this.getExpenseListData();
    }

    getExpenseListData = () => {
        const res = sendRequest(`rest/expense/retrieveExpenseList`, "get", "");
        res.then((res) => {
            if (res.status === 200) {
                this.setState({ loading: false });
                return res.json();
            }
        }).then(data => {
            this.setState({ expenseList: data });
        })
    }

    customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            {
                console.log("----------------")
            }
            Showing {from} to {to} of {size} Results
        </span >
    );

    formatExpenseDate = (cell, row) => {
        const date = new Date(row.createdDate);
        return `${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}/${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${date.getFullYear()}`
    };

    expenseActions = (cell, row) => {
        return (
            <div className="d-flex">
                <Button block color="primary" className="btn-pill vat-actions" title="Edit Expense" onClick={() => this.props.history.push(`/Expense/create-Expense?id=${row.expenseId}`)}><i className="far fa-edit"></i></Button>
                <Button block color="primary" className="btn-pill vat-actions" title="View Expense" onClick={() => this.props.history.push(`/Expense/View-Expense?id=${row.expenseId}`)}><i className="far fa-eye"></i></Button>
                <Button block color="primary" className="btn-pill vat-actions" title="Delete Expense" onClick={() => this.setState({ selectedData: row }, () => this.setState({ openDeleteModal: true }))}><i className="fas fa-trash-alt"></i></Button>
            </div>
        );
    };

    formatAmount = (cell, row) => {
        return (
            <div>
                <div>
                    <div>{this.formatNumber(row.expenseAmountCompanyCurrency)}</div>
                </div>
                <div>
                    <label>{row.expenseContact ? row.expenseContact.currency.currencySymbol : ""}</label>
                    <label>{this.formatNumber(row.expenseAmount)}</label>
                </div>
            </div>
        )
    }

    success = () => {
        return toast.success('Expense Deleted Successfully... ', {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    deleteVat = (data) => {
        this.setState({ loading: true })
        this.setState({ openDeleteModal: false });
        const res = sendRequest(`rest/expense/delete?expenseId=${this.state.selectedData.expenseId}`, "get", "");
        res.then(res => {
            if (res.status === 200) {
                this.setState({ loading: false });
                this.success();
                this.getExpenseListData();
            }
        })
    }

    formatNumber(num) {
        let n = num ? num : 0;
        return Number.parseFloat(n).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

    render() {
        const { expenseList, loading } = this.state;
        const containerStyle = {
            zIndex: 1999
        };

        return (
            <div className="animated">
                <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
                <Card>
                    <CardHeader>
                        <i className="icon-menu"></i>Expenses
                    </CardHeader>
                    <CardBody>
                        <Button className="mb-3" onClick={() => this.props.history.push(`/Expense/create-Expense`)}>New</Button>
                        <BootstrapTable data={expenseList} version="4" striped hover pagination={paginationFactory(this.options)} totalSize={expenseList ? expenseList.length : 0} >
                            <TableHeaderColumn isKey dataField="receiptNumber">Reciept Number</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.formatAmount}>Amount</TableHeaderColumn>
                            <TableHeaderColumn dataField="expenseDescription">Description</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.formatExpenseDate}>Expense Date</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.expenseActions}>Action</TableHeaderColumn>
                        </BootstrapTable>
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.openDeleteModal}
                    className={'modal-danger ' + this.props.className}>
                    <ModalHeader toggle={this.toggleDanger}>Delete</ModalHeader>
                    <ModalBody>
                        Are you sure want to delete this record?
                  </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteVat}>Yes</Button>{' '}
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

export default Expense;
