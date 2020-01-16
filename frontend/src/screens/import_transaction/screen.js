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
  Form,
  FormGroup,
  Input,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import Select from 'react-select'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import Stepper from 'react-stepper-horizontal'
import * as ImportTransactionActions from './actions';
import { selectOptionsFactory } from 'utils'
import {
  CommonActions
} from 'services/global'


import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import './style.scss'
import { Formik } from 'formik';
import * as Yup from "yup";
import { Loader } from 'components'

const mapStateToProps = (state) => {
  return ({
    date_format_list: state.import_transaction.date_format_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    importTransactionActions: bindActionCreators(ImportTransactionActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),

  })
}

class ImportTransaction extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      initialloading: true,
      initValue: {
        name: '',
        // copy_saved_congiguration: '',
        skipRows: '',
        headerRowNo: '',
        textQualifier: '',
        dateFormatId: '',
        delimiter: '',
        otherDilimiterStr: ''
      },
      delimiterList: [],
      fileName: '',
      tableHeader: [],
      loading: false,
      selectedValue: [],
      selectedValueDropdown: [],
      tableDataKey: [],
      tableData: [],
      columnStatus: [],
      selectedDelimiter: '',
      selectedDateFormat: ''
    }

    this.formRef = React.createRef();

    this.options = {
      paginationPosition: 'top'
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSave = this.handleSave.bind(this)


  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    this.props.importTransactionActions.getDateFormatList()
    this.props.importTransactionActions.getConfigurationList()

    this.props.importTransactionActions.getDelimiterList().then(res => {
      this.setState({
        delimiterList: res.data,
        selectedDelimiter: res.data[0].value
      }, () => {
        this.setState({
          initialloading: false
        })
      })
    })
  }



  handleApply(value, resetForm) {
    const { initValue } = this.state
    initValue['delimiter'] = this.state.selectedDelimiter
    this.setState({ tableHeader: [], loading: true })
    let formData = new FormData();
    formData.append("delimiter", initValue.delimiter ? initValue.delimiter : '');
    formData.append("headerRowNo ", initValue.headerRowNo ? initValue.headerRowNo : '');
    formData.append("dateFormatId", initValue.dateFormatId ? initValue.dateFormatId : '');
    formData.append("skipRows", initValue.skipRows ? initValue.skipRows : '');
    formData.append("textQualifier", initValue.textQualifier ? initValue.textQualifier : '');
    formData.append("otherDilimiterStr", initValue.otherDilimiterStr ? initValue.otherDilimiterStr : '');
    if (this.uploadFile.files[0]) {
      formData.append("file", this.uploadFile.files[0]);
    }

    this.props.importTransactionActions.parseFile(formData).then(res => {
      if (res.status === 200) {
        // this.props.commonActions.tostifyAlert('success', 'New Configuration Created Successfully')
        this.props.importTransactionActions.getTableDataList(formData).then(res => {
          this.setState({
            tableData: [...res.data],
            tableDataKey: res.data[0] ? Object.keys(res.data[0]) : []
          }, () => {
            let obj = { label: 'Select', value: '' }
            let tempObj = { label: '', status: false }
            let tempStatus = [...this.state.columnStatus]
            let tempDropDown = [...this.state.selectedValueDropdown]
            this.state.tableDataKey.map((val, index) => {
              tempStatus.push(tempObj)
              tempDropDown.push(obj)
            })
            this.setState({
              loading: false,
              selectedValueDropdown: tempDropDown,
              columnStatus: tempStatus
            })
          })
        })
    
    
        this.props.importTransactionActions.getTableHeaderList(formData).then(res => {
          let temp = [...res.data];
          // temp.unshift({ label: 'Select', value: '' })
          this.setState({
            tableHeader: this.state.tableHeader.concat(res.data),
            selectedValue: this.state.tableHeader.concat(temp)
          })
        })
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })


  }

  handleChange(e, index) {
    let tempDataSelectedValueDropdown = [...this.state.selectedValueDropdown];
    let tempStatus = [...this.state.columnStatus];
    let status = tempDataSelectedValueDropdown.filter(item => item.value == e.value && e.value !== "")
    if (status.length > 0) {
      tempStatus[index] = { label: `${e.value}`, status: true }
      if (tempDataSelectedValueDropdown[index].value !== e.value) {
        this.setState({
          columnStatus: tempStatus
        })
      }
    } else {
      if (e.value === '' || e.value) {
        let val = tempDataSelectedValueDropdown[index].value;
        let indexs;
        indexs = tempStatus.map(item => item.label).indexOf(val);
        if (indexs) {
          tempStatus[indexs] = { label: '', status: false }
          this.setState({
            columnStatus: tempStatus
          })
        }
      }
      tempDataSelectedValueDropdown[index] = e
      this.setState({
        selectedValueDropdown: tempDataSelectedValueDropdown
      })
    }
  }

  handleInputChange(name, value) {
    this.setState({
      initValue: Object.assign(this.state.initValue, {
        [name]: value
      })
    })
  }

  handleSave() {
    let a = {}
    let val
    let obj = {}
    this.state.selectedValueDropdown.map((item,index)=> {
      if(item.value) {
        val=  item.value
        console.log(val)
        obj[val] = index
        a = {...a,...obj}
      }
    })
    let postData = {...this.state.initValue}
    postData.indexMap = a
    this.props.importTransactionActions.createConfiguration(postData).then(res => {
        this.props.commonActions.tostifyAlert('success', 'New Configuration Created Successfully')
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  render() {
    const { initValue, loading, tableDataKey, tableData, initialloading } = this.state;
    const { date_format_list } = this.props

    return (
      <div className="import-transaction-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fa glyphicon glyphicon-export fa-upload" />
                        <span className="ml-2">Import Transaction</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {initialloading ? (
                    <Loader />
                  )
                    :
                    (
                      <Row>
                        <Col lg={12}>
                          <div>
                            {/* <Formik
                            initialValues={initValue}
                            ref={this.formRef}
                            onSubmit={(values, { resetForm }) => {
                              this.handleApply(values, resetForm)
                            }}
                          >
                            {
                              props => ( */}
                            <Form >
                              <Row>
                                <Col lg={3}>
                                  <Label>Name</Label>
                                </Col>
                                <Col lg={3}>
                                  <FormGroup>
                                    <Input
                                      type="text"
                                      id="name"
                                      name="name"
                                      placeholder="Enter Name"
                                      onChange={e => { this.handleInputChange('name', e.target.value) }}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={3} md={5}>
                                  <Label>Copy Saved Configuration</Label>
                                </Col>
                                <Col lg={3} md={7}>
                                  <FormGroup>
                                    <Select
                                      className="select-default-width"
                                      options={[]}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={12}>
                                  <fieldset>
                                    <legend>Parameters</legend>
                                    <Row>
                                      <Col lg={3}>
                                        {this.state.delimiterList && this.state.delimiterList.map((option, index, array) => {
                                          return (
                                            <div>
                                              <FormGroup check inline className="mb-3">
                                                <Input
                                                  className="form-check-input"
                                                  type="radio"
                                                  id={option.value}
                                                  name="delimiter"
                                                  value={this.state.delimiterList[index].value}
                                                  checked={this.state.selectedDelimiter === option.value}
                                                  onChange={(e) => {
                                                    this.setState({
                                                      selectedDelimiter: e.target.value
                                                    })
                                                  }}
                                                />
                                                <Label className="form-check-label" check htmlFor="vatIncluded">{option.label}</Label>
                                                {index === array.length - 1 ? (
                                                  <Input
                                                    className="ml-3"
                                                    type="text"
                                                    placeholder="Other"
                                                    disabled={this.state.selectedDelimiter !== 'OTHER'}
                                                    onChange={(e) => { this.handleInputChange('otherDilimiterStr', e.target.value) }}
                                                  />
                                                ) : null}
                                              </FormGroup>
                                            </div>
                                          )
                                        })}

                                      </Col>
                                      <Col lg={6} className="table_option">

                                        <Row>
                                          <Col md="5">
                                            <label for="Other">Provide Sample</label>
                                          </Col>
                                          <Col md="7">
                                            <FormGroup className="">

                                              <Button color="primary" onClick={() => { document.getElementById('fileInput').click() }} className="btn-square mr-3">
                                                <i className="fa fa-upload"></i> Upload
                                                </Button>
                                              <input id="fileInput" ref={ref => {
                                                this.uploadFile = ref;
                                              }}
                                                type="file" style={{ display: 'none' }} onChange={(e) => {
                                                  this.setState({ fileName: (e.target.value).split('\\').pop() })
                                                }} />
                                              {this.state.fileName}
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md={5}>
                                            <Label htmlFor="skip_rows">Skip Rows</Label>
                                          </Col>
                                          <Col md={7}>
                                            <FormGroup className="">
                                              <Input
                                                type="text"
                                                name=""
                                                id=""
                                                rows="6"
                                                placeholder="Enter No of Rows"
                                                onChange={(e) => { this.handleInputChange("skipRows", e.target.value) }}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md={5}>  <Label htmlFor="description">Header Rows Number</Label></Col>
                                          <Col md={7}>
                                            <FormGroup className="">
                                              <Input
                                                type="text"
                                                name=""
                                                id=""
                                                rows="6"
                                                placeholder="Enter Header Row Number"
                                                onChange={(e) => { this.handleInputChange("headerRowNo", e.target.value) }}

                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md={5}>
                                            <Label htmlFor="description">Text Qualifier</Label>
                                          </Col>
                                          <Col md={7}>
                                            <FormGroup className="">
                                              <Input
                                                type="text"
                                                name=""
                                                id=""
                                                rows="6"
                                                placeholder="Text Qualifier"
                                                onChange={(e) => { this.handleInputChange("textQualifier", e.target.value) }}

                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md={5}>
                                            <Label htmlFor="description">Date Format</Label>
                                          </Col>
                                          <Col md={7}>
                                            <FormGroup className="">

                                              <Select
                                                type=""
                                                options={date_format_list ? selectOptionsFactory.renderOptions('format', 'id', date_format_list, 'Date Format') : []}
                                                value={this.state.selectedDateFormat || ''}
                                                onChange={option => {
                                                  if (option && option.value) {
                                                    this.handleInputChange('dateFormatId', option.value)
                                                    this.setState({ selectedDateFormat: option.value })
                                                  } else {
                                                    this.handleInputChange('dateFormatId', '')
                                                    this.setState({ selectedDateFormat: '' })

                                                  }
                                                }}
                                                id=""
                                                rows="6"
                                                placeholder="Date Format"

                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      </Col>

                                      <Col lg={3} className="mt-2 align-apply text-right">
                                        <FormGroup >
                                          <Button type="button" color="primary" className="btn-square"
                                            onClick={() => {
                                              this.handleApply()
                                            }}
                                          >
                                            <i className="fa fa-dot-circle-o"></i> Apply
                                             </Button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </fieldset>
                                </Col>
                              </Row>
                              {/* <Row className="mt-5"> */}

                              {/* </Row> */}
                            </Form>
                            {/* )
                            }
                          </Formik> */}
                            <Row>
                              {loading ?
                                <Loader />
                                :
                                this.state.tableDataKey.length > 0 ? this.state.tableDataKey.map((header, index) => (
                                  <Col style={{ width: `calc(100% / ${this.state.tableDataKey.length})`, margin: '20px 0' }}>
                                    <FormGroup className={`mb-0 ${this.state.columnStatus[index] ? 'is-invalid' : ''}`}
                                    >
                                      <Select
                                        type=""
                                        options={this.state.tableHeader ? selectOptionsFactory.renderOptions('label', 'value', this.state.tableHeader, this.state.tableHeader[index].label) : []}
                                        name={index}
                                        id=""
                                        rows="6"
                                        value={this.state.selectedValueDropdown[index]}
                                        onChange={(e) => {
                                          this.handleChange(e, index)
                                        }}

                                      />
                                    </FormGroup>
                                    <p className={this.state.columnStatus[index].status ? 'is-invalid' : 'valid'}>*Already Selected</p>
                                  </Col>

                                )
                                ) : null
                              }
                              {/* <div> */}
                              {
                                this.state.tableDataKey.length > 0 ? (
                                  <BootstrapTable data={tableData} keyField={this.state.tableDataKey[0]}>
                                    {this.state.tableDataKey.map(name => <TableHeaderColumn dataField={name} dataAlign="center">{name}</TableHeaderColumn>)}
                                  </BootstrapTable>
                                ) : null
                              }
                              {/* </div> */}
                              <Row style={{ width: '100%' }}>
                                <Col lg={12} className="mt-2">
                                  <FormGroup className="text-right">
                                    {
                                      this.state.tableDataKey.length > 0 ? (
                                        <Button type="button" color="primary" className="btn-square mr-4" onClick={this.handleSave}>
                                          <i className="fa fa-dot-circle-o"></i> Save
                                    </Button>
                                      ) : null
                                    }
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Row>


                          </div>
                        </Col>
                      </Row>
                    )
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTransaction)
