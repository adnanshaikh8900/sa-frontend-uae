
import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import sendRequest from '../../../xhrRequest';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Loader";
class VatCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vatCategoryList: [],
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
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: 'All', value: this.state.vatCategoryList ? this.state.vatCategoryList.length : 0
            }]
        }

    }

    componentDidMount() {
        this.getVatListData();
    }

    getVatListData = () => {
        const res = sendRequest(`rest/vat/getvat`, "get", "");
        res.then((res) => {
            if (res.status === 200) {
                this.setState({ loading: false });
                return res.json();
            }
        }).then(data => {
            this.setState({ vatCategoryList: data });
        })
    }

    customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing {from} to {to} of {size} Results
        </span >
    );

    vatPercentageFormat = (cell, row) => `${row.vat} %`;

    vatActions = (cell, row) => {
        return (
            <div className="d-flex">
                <Button block color="primary" className="btn-pill vat-actions" title="Edit Vat Category" onClick={() => this.props.history.push(`/create-vat-category?id=${row.id}`)}><i className="far fa-edit"></i></Button>
                <Button block color="primary" className="btn-pill vat-actions" title="Delete Vat Ctegory" onClick={() => this.setState({ selectedData: row }, () => this.setState({ openDeleteModal: true }))}><i className="fas fa-trash-alt"></i></Button>
            </div>
        );
    };

    success = () => {
        return toast.success('Vat Category Deleted Successfully... ', {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    deleteVat = (data) => {
        this.setState({ loading: true })
        this.setState({ openDeleteModal: false });
        const res = sendRequest(`rest/vat/deletevat?id=${this.state.selectedData.id}`, "delete", "");
        res.then(res => {
            if (res.status === 200) {
                this.setState({ loading: false });
                this.success();
                this.getVatListData();
            }
        })
    }

    render() {
        const { vatCategoryList, loading } = this.state;
        const containerStyle = {
            zIndex: 1999
        };

        return (
            <div className="animated">
                <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
                <Card>
                    <CardHeader>
                        <i className="icon-menu"></i>Vat
                    </CardHeader>
                    <CardBody>
                        <Button className="mb-3" onClick={() => this.props.history.push(`/create-vat-category`)}>New</Button>
                        <BootstrapTable
                            keyField="id"
                            data={vatCategoryList}
                            columns={[
                                {
                                    dataField: 'name',
                                    text: 'Vat Name'
                                },
                                {
                                    dataField: '',
                                    text: 'Vat Percentage',
                                    formatter: this.vatPercentageFormat
                                },
                                {
                                    dataField: '',
                                    text: 'Action',
                                    formatter: this.vatActions
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

export default VatCategory;
