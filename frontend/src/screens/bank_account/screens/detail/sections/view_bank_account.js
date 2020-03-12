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
  Label
} from 'reactstrap'
import Select from 'react-select'
import _ from 'lodash'
import { Formik } from 'formik'
import * as Yup from 'yup'

import {
  Loader,
  ConfirmDeleteModal
} from 'components'
import {
  selectOptionsFactory
} from 'utils'
import {
  CommonActions
} from 'services/global'
import * as detailBankAccountActions from './actions'

import './style.scss'

const mapStateToProps = (state) => {
  return ({

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({

  })
}

class ViewBankAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }


  }

  render() {

    const {
    } = this.props

    const {
      initialVals,
      current_bank_account,
      dialog
    } = this.state

    return (
      <div className="detail-bank-account-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="h4 mb-0 d-flex align-items-center">
                    <i className="fas fa-university" />
                    <span className="ml-2">View Bank Account Details {
                      current_bank_account ? ` - ${current_bank_account.bankAccountName}` : ''
                    }
                    </span>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={12}>

                  <Form onSubmit={props.handleSubmit}>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="account_name">Account Name</Label>
                          <p>{account_name}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="currency">Currency</Label>
                          <p>{currency}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="opening_balance">Opening Balance</Label>
                          <p>{opening_balance}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="">
                          <Label htmlFor="account_type">

                            Account Type
                                    </Label>
                          <p>{account_type}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="bank_name">Bank Name</Label>
                          <p>{bank_name}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="account_number">Account Number</Label>
                          <p>{bank_name}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="iban_number">IBAN Number</Label>
                          <p>{iban_number}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="swift_code">Swift Code</Label>
                          <p>{swift_code}</p>
                        </FormGroup>
                      </Col>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="country">Country</Label>
                          <p>{country}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <FormGroup className="mb-3">
                          <Label htmlFor="account_is_for">Account is for</Label>
                          {account_is_for}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>

                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBankAccount)
