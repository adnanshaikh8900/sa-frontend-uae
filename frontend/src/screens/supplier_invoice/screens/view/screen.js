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
  Table
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import DatePicker from 'react-datepicker'
import { Formik, Field } from 'formik';
import _ from 'lodash'
import * as Yup from 'yup'
import * as SupplierInvoiceDetailActions from './actions';
import * as  SupplierInvoiceActions from "../../actions";
import ReactToPrint from "react-to-print";

import { SupplierModal } from '../../sections'
import { Loader, ConfirmDeleteModal } from 'components'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import {
  CommonActions
} from 'services/global'
import {
  selectOptionsFactory,
  filterFactory
} from 'utils'

import './style.scss'
import moment from 'moment'
import API_ROOT_URL from '../../../../constants/config'
import { PDFExport } from "@progress/kendo-react-pdf";

import './style.scss'
import { InvoiceTemplate } from './sections'


const mapStateToProps = (state) => {
  return ({
    profile: state.auth.profile
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    supplierInvoiceActions: bindActionCreators(SupplierInvoiceActions, dispatch),
    supplierInvoiceDetailActions: bindActionCreators(SupplierInvoiceDetailActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}

class ViewInvoice extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      invoiceData: {},
      totalNet: 0,
      currencyData: {},
      id: ''
    }

    this.formRef = React.createRef()
    this.initializeData = this.initializeData.bind(this)



    this.termList = [
      { label: "Net 7", value: "NET_7" },
      { label: "Net 10", value: "NET_10" },
      { label: "Net 30", value: "NET_30" },
      { label: "Due on Receipt", value: "DUE_ON_RECEIPT" },
    ]


  }

  componentDidMount() {
    this.initializeData();
  }

  initializeData() {
    if (this.props.location.state && this.props.location.state.id) {
      this.props.supplierInvoiceDetailActions.getInvoiceById(this.props.location.state.id).then(res => {
        let val = 0;
        if (res.status === 200) {
          res.data.invoiceLineItems.map(item => {
            val = val + item.subTotal;
          });
          this.setState({
            invoiceData: res.data,
            totalNet: val,
            id: this.props.location.state.id
          }, () => {
            if (this.state.invoiceData.currencyCode) {
              this.props.supplierInvoiceActions.getCurrencyList().then(res => {
                if (res.status === 200) {
                  const temp = res.data.filter(item => item.currencyCode === this.state.invoiceData.currencyCode)
                  this.setState({
                    currencyData: temp
                  }, () => {
                  })
                }
              })

            }
          });
        }
      })
    }
  }

  exportPDFWithComponent = () => {
    this.pdfExportComponent.save();
  };

  render() {
    const { invoiceData, currencyData, id } = this.state;

    const { profile} = this.props
    return (
      <div className="view-invoice-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">

              <div className="action-btn-container">
                <Button
                  className="btn btn-sm edit-btn"
                  onClick={() => {
                    this.props.history.push('/admin/expense/supplier-invoice/detail', { id: id })
                  }
                  }
                >
                  <i className="fa fa-pencil"></i>
                </Button>
                <Button
                  className="btn btn-sm pdf-btn"
                  onClick={() => {
                    this.exportPDFWithComponent();
                  }}
                >
                  <i className="fa fa-file-pdf-o"></i>
                </Button>
                <ReactToPrint
                  trigger={() => <Button
                    type="button"
                    className="btn btn-sm print-btn"
                    onClick={() => window.print()}
                  >
                    <i className="fa fa-print"></i>
                  </Button>}
                  content={() => this.componentRef}
                />

                <p className="close" onClick={() => { this.props.history.push('/admin/expense/supplier-invoice') }}>X</p>
              </div>
              <div>
                <PDFExport
                  ref={component => (this.pdfExportComponent = component)}
                  scale={0.8}
                  paperSize="A3"
                //   margin="2cm"
                >
                  <InvoiceTemplate invoiceData={invoiceData} currencyData={currencyData} ref={el => (this.componentRef = el)} totalNet={this.state.totalNet} companyData={profile} />

                </PDFExport>
              </div>

            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewInvoice)