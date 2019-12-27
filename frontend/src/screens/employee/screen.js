import React from 'react'
import {connect} from 'react-redux'
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
import DatePicker from 'react-datepicker'
import _ from 'lodash'

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
  })
}

class Employee extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      birthday: new Date(),
      currentData: {}
    }

    this.changeBirthday = this.changeBirthday.bind(this)
  }

  changeBirthday(date){
    this.setState({
      birthday: date
    })
  }

  handleChange = (name, e) => {
    console.log(name,e.target.value)
     this.setState({
      currentData: _.set(
        { ...this.state.currentData },
        e.target.name && e.target.name !== '' ? e.target.name : name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      )
    })
    // this.setState({
    //   currentData: _.set(
    //     { ...this.state.currentData },
    //     e.target.name && e.target.name !== '' ? e.target.name : name,
    //     e.target.type === 'checkbox' ? e.target.checked : e.target.value
    //   )
    // })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.currentData)
  }
  render() {
 
    return (
      <div className="employee-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-user-tie" />
                        <span className="ml-2">Employee</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Form onSubmit={this.handleSubmit}>
                        <h4 className="mb-4">Contact Name</h4>
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Refrence Code</Label>
                              <Input
                                type="text"
                                id="referenceCode"
                                name="referenceCode"
                                onChange={(value) => { this.handleChange("referenceCode",value) }}
                                
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Title</Label>
                              <Input
                                type="text"
                                id="title"
                                name="title"
                                onChange={(value) => { this.handleChange("title",value) }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Email</Label>
                              <Input
                                type="text"
                                id="email"
                                name="email"
                                onChange={(value) => { this.handleChange("email",value) }}                                
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="row-wrapper">
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Full Name</Label>
                              <Input
                                type="text"
                                id="fulName"
                                name="fullName"
                                onChange={(value) => { this.handleChange("fullName",value) }}                                
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Middle Name</Label>
                              <Input
                                type="text"
                                id="middleName"
                                name="middleName"
                                onChange={(value) => { this.handleChange("middleName",value) }}                                                                
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Last Name</Label>
                              <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                onChange={(value) => { this.handleChange("lastName",value) }}                                                                                                
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="row-wrapper">
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Password</Label>
                              <Input
                                type="text"
                                id="password"
                                name="password"
                                onChange={(value) => { this.handleChange("password",value) }}                                                                                                

                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Confirm Password</Label>
                              <Input
                                type="text"
                                id="confirmPassword"
                                name="confirmPassword"
                                onChange={(value) => { this.handleChange("confirmPassword",value) }}                                                                                                
                                
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Date of Birth</Label>
                              <div>
                                <DatePicker
                                  className="form-control"
                                  id="date"
                                  name="date"
                                  selected={this.state.birthday}
                                  onChange={this.changeBirthday}
                                  placeholderText=""
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <hr/>
                        <h4 className="mb-3 mt-3">Invoicing Details</h4>
                        <Row className="row-wrapper">
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Billing Email</Label>
                              <Input
                                type="text"
                                id="billingEmail"
                                name="billingEmail"
                                onChange={(value) => { this.handleChange("billingEmail",value) }}                                                                                                
                                
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Contract PO Number</Label>
                              <Input
                                type="text"
                                id="PONumber"
                                name="PONumber"
                                onChange={(value) => { this.handleChange("PONumber",value) }}                                                                                                
                                
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="row-wrapper">
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Vat Registration Number</Label>
                              <Input
                                type="text"
                                id="VATNumber"
                                name="VATNumber"
                                onChange={(value) => { this.handleChange("VATNumber",value) }}                                                                                                
                                
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="select">Currency Code</Label>
                              <Input
                                type="text"
                                id="currencyCode"
                                name="currencyCode"
                                onChange={(value) => { this.handleChange("currencyCode",value) }} 
                                selected={this.state.currency}                                                                                                                               
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} className="mt-5">
                            <FormGroup className="text-right">
                              <Button type="submit" color="primary" className="btn-square mr-3">
                                <i className="fa fa-dot-circle-o"></i> Create
                              </Button>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Employee)

