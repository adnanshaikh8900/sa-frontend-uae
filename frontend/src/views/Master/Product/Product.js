
import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import sendRequest from '../../../xhrRequest';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productList: [],
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
        this.getProductListData();
    }

    getProductListData = () => {
        const res = sendRequest(`rest/product/getproduct`, "get", "");
        res.then((res) => {
            if (res.status === 200) {
                this.setState({ loading: false });
                return res.json();
            }
        }).then(data => {
            this.setState({ productList: data });
        })
    }

    customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing {from} to {to} of {size} Results
        </span >
    );

    productPercentageFormat = (cell, row) => row.vatCategory ? row.vatCategory.name : ""

    tableActions = (cell, row) => {
        return (
            <div className="d-flex">
                <Button block color="primary" className="btn-pill vat-actions" title="Edit Product/Service" onClick={() => this.props.history.push(`/Master/Product/create-Product?id=${row.productID}`)}><i className="far fa-edit"></i></Button>
                <Button block color="primary" className="btn-pill vat-actions" title="Delete Product/Service" onClick={() => this.setState({ selectedData: row }, () => this.setState({ openDeleteModal: true }))}><i className="fas fa-trash-alt"></i></Button>
            </div>
        );
    };

    success = () => {
        return toast.success('Product/Service Deleted Successfully... ', {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    deleteProduct = (data) => {
        this.setState({ loading: true })
        this.setState({ openDeleteModal: false });
        const res = sendRequest(`rest/product/deleteproduct?id=${this.state.selectedData.productID}`, "delete", "");
        res.then(res => {
            if (res.status === 200) {
                this.setState({ loading: false });
                this.success();
                this.getProductListData();
            }
        })
    }

    render() {
        const { productList, loading } = this.state;
        const containerStyle = {
            zIndex: 1999
        };

        return (
            <div className="animated">
                <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
                <Card>
                    <CardHeader>
                        <i className="icon-menu"></i>Product And Service
                    </CardHeader>
                    <CardBody>
                        <Button className="mb-3" onClick={() => this.props.history.push(`/Master/Product/create-Product`)}>New</Button>
                        <BootstrapTable
                            keyField="productID"
                            data={productList}
                            filter={filterFactory()}
                            pagination={paginationFactory(this.options)}
                            columns={[
                                {
                                    dataField: 'productName',
                                    text: 'Name',
                                    filter: textFilter(),
                                    sort: true
                                },
                                {
                                    dataField: 'productCode',
                                    text: 'Product Code',
                                    sort: true,
                                },
                                {
                                    dataField: 'productDescription',
                                    text: 'Description',
                                    sort: true,
                                },
                                {
                                    dataField: '',
                                    text: 'Vat Percentage',
                                    sort: true,
                                    formatter: this.productPercentageFormat
                                },
                                {
                                    dataField: '',
                                    text: 'Action',
                                    formatter: this.tableActions
                                },
                            ]}
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
                        <Button color="danger" onClick={this.deleteProduct}>Yes</Button>{' '}
                        <Button color="secondary" onClick={() => this.setState({ openDeleteModal: false })}>No</Button>
                    </ModalFooter>
                </Modal>
                {
                    loading ?
                        <div className="sk-double-bounce loader">
                            <div className="sk-child sk-double-bounce1"></div>
                            <div className="sk-child sk-double-bounce2"></div>
                        </div>
                        : ""
                }
            </div>
        );
    }
}

export default Product;
