import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'

import {
  Message
} from 'components'

import {
  AuthActions
} from 'services/global'

import './style.scss'
import logo from 'assets/images/brand/logo.png'

const mapStateToProps = (state) => {
  return ({
    version: state.common.version
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    authActions: bindActionCreators(AuthActions, dispatch)
  })
}

class LogIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: 'admin123@gmail.com',
      password: 'admin',
      alert: null,
      openForgotPasswordModal: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.logInHandler = this.logInHandler.bind(this)
  }

  handleChange(key, val) {
    this.setState({
      [key]: val
    })
  }

  logInHandler(e) {
    e.preventDefault()
    const { username, password } = this.state
    let obj = {
      username,
      password
    }
    this.props.authActions.logIn(obj).then(res => {
      this.setState({
        alert: null
      })
      this.props.history.push('/admin')
    }).catch(err => {
      this.setState({
        alert: <Message
          type="danger"
          title={err ? err.data.error : ''}
          content="Log in failed. Please try again later"
        />
      })
    })
  }

  openForgotPasswordModal = () => {
    this.setState({ openForgotPasswordModal: true })
  }

  closeForgotPasswordModal = (res) => {
    this.setState({ openForgotPasswordModal: false })
  }

  render() {
    return (
      <div className="log-in-screen">
        <div className="animated fadeIn">
          <div className="app flex-row align-items-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="8">
                  {this.state.alert}
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="6">
                  <CardGroup>
                    <Card className="p-4">
                      <CardBody>
                        <div className="logo-container">
                          <img src={logo} alt="logo" />
                        </div>
                        <Form onSubmit={this.logInHandler}>
                          {/* <h1>Log In</h1> */}
                          <p className="text-muted">Log In to your account</p>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-user"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Username"
                              name="username"
                              value={this.state.username}
                              onChange={e => this.handleChange('username', e.target.value)}
                              autoComplete="username"
                              required
                            />
                          </InputGroup>
                          <InputGroup className="mb-4">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-lock"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="password"
                              placeholder="Password"
                              name="password"
                              value={this.state.password}
                              onChange={e => this.handleChange('password', e.target.value)}
                              autoComplete="current-password"
                              required
                            />
                          </InputGroup>
                          <Row>
                            <Col xs="12" lg="5">
                              <Button
                                color="primary"
                                type="submit"
                                className="px-4 btn-square w-100"
                              >
                                <i className="fa fa-sign-in" /> Log In
                              </Button>
                            </Col>
                            <Col xs="12" lg="7" className="text-right">
                              <Button type="button" color="link" className="px-0" onClick={()=>{this.props.history.push('/reset-password')}}>Forgot password?</Button>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)
