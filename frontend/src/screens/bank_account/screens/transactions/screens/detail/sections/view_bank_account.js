import React from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  NavLink
} from 'reactstrap'


// import './style.scss'
import  moment  from 'moment'
import API_ROOT_URL from '../../../../../../../constants/config'


const mapStateToProps = (state) => {
  return ({

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({

  })
}

class ViewBankAccount extends React.Component {
  render() {

    const {
      initialVals
    } = this.props
    console.log(this.props.initialVals)
    return (
          <Card>
            <CardHeader>
              <Row>
                <Col lg={11}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="fas fa-university" />
                    <span className="ml-2">View Bank Account Details {
                      // current_bank_account ? ` - ${current_bank_account.bankAccountName}` : ''
                    }
                    </span>
                  </div>
                </Col>
                <Col lg={1} style={{textAlign: 'right'}}>
                    <i className="fas fa-edit" onClick={()=>{this.props.editDetails()}}/>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={12}>
                  <div>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="account_name"><strong>Transaction Type</strong> : {initialVals.chartOfAccountId}</Label>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="currency"><strong>Transaction Date</strong> : {moment(initialVals.transactionDate).format('DD/MM/YYYY')}</Label>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="opening_balance">Total Amount</Label>
                          <p>{initialVals.transactionAmount}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="">
                          <Label htmlFor="account_type">

                          Category
                                    </Label>
                          <p>{initialVals.transactionCategoryId}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="bank_name">Description</Label>
                          <p>{initialVals.description}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="account_number">Project</Label>
                          <p>{initialVals.projectId}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="iban_number">Reciept Number</Label>
                          <p>{initialVals.receiptNumber}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="swift_code">Attachment Description</Label>
                          <p>{initialVals.attachementDescription}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="country">Reciept Attachment</Label>
                          <NavLink download={initialVals.fileName} href={`${API_ROOT_URL.API_ROOT_URL}${initialVals.filePath}`} style={{ fontSize: '0.875rem' }} target="_blank" >{initialVals.fileName}</NavLink>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBankAccount)
