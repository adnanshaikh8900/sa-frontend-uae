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

import ForgotPasswordModal from './sections/forgot_password_modal'

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
      // this.props.history.push('/admin')

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
                            <Col xs="6">
                              <Button
                                color="primary"
                                type="submit"
                                className="px-4 btn-square"
                              >
                                <i className="fa fa-sign-in" /> Log In
                              </Button>
                            </Col>
                            <Col xs="6" className="text-right">
                              <Button type="button" color="link" className="px-0" onClick={this.openForgotPasswordModal}>Forgot password?</Button>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                    {/* <Card className="text-white bg-primary d-md-down-none">
                      <CardHeader className="bg-primary">
                        <div className="text-right">
                          {
                            version !== '' ?
                              <label className="text-white mb-0">v. {version} </label>
                              :
                              ''
                          }
                        </div>
                      </CardHeader>
                      <CardBody className="text-center">
                        <div>
                          <h2>Sign up</h2>
                          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.</p>
                          <Link to="/register">
                            <Button
                              color="primary"
                              className="mt-3 btn-square"
                              active
                              tabIndex={-1}
                            >
                              <i className="fa fa-user"/> Register Now!
                            </Button>
                          </Link> 
                        </div>
                      </CardBody>
                    </Card> */}
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <ForgotPasswordModal
          openForgotPasswordModal={this.state.openForgotPasswordModal}
          closeForgotPasswordModal={(e) => { this.closeForgotPasswordModal(e) }}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)
