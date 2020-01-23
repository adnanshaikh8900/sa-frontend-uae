import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  UncontrolledDropdown,
  Badge
} from 'reactstrap'
import PropTypes from 'prop-types'

import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler
} from '@coreui/react'

import './style.scss'

import logo from 'assets/images/brand/logo.png'
import sygnet from 'assets/images/brand/sygnet.png'
import avatar from 'assets/images/avatars/6.jpg'

import {
  AuthActions
} from 'services/global'

const propTypes = {
  children: PropTypes.node
}

const defaultProps = {}

const mapStateToProps = (state) => {
  return ({
    profile: state.auth.profile
  })
}

// mapDispatchToProps = (dispatch) => {(
//   authAction: BindActionCreators(AuthAction,dispatch)
// )}

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profilePic: []
    }

    this.signOut = this.signOut.bind(this)
  }

  componentDidMount(){
  }

  signOut () {
    this.props.authActions.logOut()
    this.props.history.push('/login')
  }

  render() {
    const { children, profile,...attributes} = this.props
    const { profilePic } = this.state
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          className="p-2"
          full={{ src: logo, width: '100%', height: 'auto', alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: '100%', height: 'auto', alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg">
          <i className="fa fa-list-ul header-sidebar-icon"></i>
        </AppSidebarToggler>
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/admin/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/admin/settings/user" className="nav-link">Users</Link>
          </NavItem>
          {/* <NavItem className="px-3">
            <NavLink to="/admin/settings" className="nav-link">Settings</NavLink>
          </NavItem> */}
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <AppAsideToggler className="d-md-down-none">
              <i className="fa fa-bell header-icon"></i>
            </AppAsideToggler>
          </NavItem>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
            {/* {profilePic ?  'data:image/jpg;base64,'+avatar : ''} */}
              <img src={profile ? 'data:image/jpg;base64,'+profile.profileImageBinary : ''} className="img-avatar" alt="" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => this.props.history.push('/admin/profile')}>
                <i className="fas fa-user"></i> Profile
              </DropdownItem>
              <DropdownItem onClick={() => this.props.history.push('/admin/settings/general')}>
                <i className="icon-wrench"></i> General Settings
              </DropdownItem>
              {/* <DropdownItem onClick={() => this.props.history.push('/admin/settings/transaction-category')}>
                <i className="icon-graph"></i> Transaction Category
              </DropdownItem> */}
              <DropdownItem onClick={() => this.props.history.push('/admin/settings/user')}>
                <i className="fas fa-users"></i> Users & Roles
              </DropdownItem>
              <DropdownItem onClick={() => this.props.history.push('/admin/settings/notification')}>
                <i className="fas fa-bell"></i> Notifications
              </DropdownItem>
              <DropdownItem onClick={() => this.props.history.push('/admin/settings/data-backup')}>
                <i className="fas fa-hdd-o"></i> Data Backup
              </DropdownItem>
              <DropdownItem onClick={() => this.props.history.push('/admin/settings/help')}>
                <i className="fas fa-info-circle"></i> Help
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className="px-3">
            <a className="nav-link d-flex align-items-center my-link" onClick={this.signOut}>
              <i className="fa fa-sign-out header-icon mr-1"></i> Log Out
            </a>
          </NavItem>
        </Nav>
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes
Header.defaultProps = defaultProps

export default connect(mapStateToProps, null)(Header)
