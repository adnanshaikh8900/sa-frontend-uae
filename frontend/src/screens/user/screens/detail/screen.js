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
  FormText,
  Input,
  Label
} from 'reactstrap'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { Loader, ConfirmDeleteModal, ImageUploader } from 'components'
import * as UserActions from '../../actions'
import * as UserDetailActions from './actions'

import {
  CommonActions
} from 'services/global'
import { selectOptionsFactory } from 'utils'
import moment from 'moment'
import { Formik } from 'formik';
import * as Yup from "yup";
// import 'react-images-uploader/styles.css'
// import 'react-images-uploader/font.css'
import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    role_list: state.user.role_list,

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    userDetailActions: bindActionCreators(UserDetailActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class DetailUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dialog: null,
      initValue: {},
      selectedStatus: false,
      userPhoto: [],
      showIcon: false,
      userPhotoFile: {},
      imageState: true,
      current_user_id: null
    }

    this.initializeData = this.initializeData.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.removeDialog = this.removeDialog.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.uploadImage = this.uploadImage.bind(this);
  }

  componentDidMount() {
    this.initializeData()
  }

  initializeData() {
    // this.setState({
    //   loading: false,
    //   userPhoto: this.state.userPhoto.concat(`https://i.picsum.photos/id/1/5616/3744.jpg`),
    // });
    if (this.props.location.state && this.props.location.state.id) {
      this.props.userDetailActions.getUserById(this.props.location.state.id).then(res => {
        this.props.userActions.getRoleList();
        if (res.status === 200) {
          this.setState({
            initValue: {
              firstName: res.data.firstName ? res.data.firstName : '',
              lastName: res.data.lastName ? res.data.lastName : '',
              email: res.data.email ? res.data.email : '',
              password: '',
              dob: res.data.dob ? moment(res.data.dob, 'DD-MM-YYYY').toDate() : '',
              active: res.data.active ? res.data.active : '',
              confirmPassword: '',
              roleId: res.data.roleId ? res.data.roleId : '',
              companyId: res.data.companyId ? res.data.companyId : '',
            },
            loading: false,
            selectedStatus: res.data.active ? true : false,
            userPhoto: res.data.profilePicByteArray ? this.state.userPhoto.concat(res.data.profilePicByteArray) : [],
          })
        }
      }).catch(err => {
        this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
        this.props.history.push('/admin/settings/user')
      })
    } else {
      this.props.history.push('/admin/settings/user')
    }
  }

  uploadImage(picture, file) {
    if (this.state.userPhoto[0] && this.state.userPhoto[0].indexOf('data') < 0) {
      this.setState({ imageState: true })
    } else {
      this.setState({ imageState: false })
    }
    this.setState({
      userPhoto: picture,
      userPhotoFile: file
    });
  }

  deleteUser() {
    this.setState({
      dialog: <ConfirmDeleteModal
        isOpen={true}
        okHandler={this.removeUser}
        cancelHandler={this.removeDialog}
      />
    })
  }

  removeUser() {
    const { current_user_id } = this.state;
    this.props.userDetailActions.deleteUser(current_user_id).then(res => {
      if (res.status === 200) {
        // this.success('Chart Account Deleted Successfully');
        this.props.commonActions.tostifyAlert('success', 'User Deleted Successfully')
        this.props.history.push('/admin/settings/user')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data ? err.data.message : null)
    })
  }

  removeDialog() {
    this.setState({
      dialog: null
    })
  }

  handleSubmit(data) {
    const {
      firstName,
      lastName,
      email,
      dob,
      password,
      roleId,
      companyId,
    } = data;
    const { current_user_id } = this.state;
    const { userPhotoFile } = this.state;
    let formData = new FormData();
    formData.append("id", current_user_id);

    formData.append("firstName", firstName ? firstName : '');
    formData.append("lastName", lastName ? lastName : '');
    formData.append("email", email ? email : '');
    formData.append("dob", dob ? moment(dob).format('DD-MM-YYYY') : (''));
    formData.append("roleId", roleId ? roleId : '');
    formData.append("active", this.state.selectedStatus);
    formData.append("password", password ? password : '');
    formData.append("companyId", companyId ? companyId : '');
    if (this.state.userPhotoFile.length > 0) {
      formData.append("profilePic", userPhotoFile[0]);
    }

    this.props.userDetailActions.updateUser(formData).then(res => {
      if (res.status === 200) {
        this.props.commonActions.tostifyAlert('success', 'User Updated Successfully')
        this.props.history.push('/admin/settings/user')
      }
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err && err.data !== undefined ? err.data.message : 'Internal Server Error')
    })
  }

  render() {
    const { loading, dialog } = this.state
    const { role_list } = this.props

    return (
      <div className="create-user-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="nav-icon fas fa-users" />
                        <span className="ml-2">Update User</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {dialog}
                  {loading ?
                    (
                      <Loader />
                    )
                    :
                    (
                      <Row>
                        <Col lg={12}>
                          <Formik
                            initialValues={this.state.initValue}
                            onSubmit={(values, { resetForm }) => {
                              this.handleSubmit(values)
                              // resetForm(this.state.initValue)


                              // this.setState({
                              //   selectedContactCurrency: null,
                              //   selectedCurrency: null,
                              //   selectedInvoiceLanguage: null
                              // })
                            }}
                            validationSchema={Yup.object().shape({
                              firstName: Yup.string()
                                .required("First Name is Required"),
                              lastName: Yup.string()
                                .required("Last Name is Required"),
                              password: Yup.string()
                                // .required("Password is Required")
                                // .min(8, "Password Too Short")
                                .matches(
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                  "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                                ),
                              confirmPassword: Yup.string()
                                // .required('Confirm Password is Required')
                                .oneOf([Yup.ref("password"), null], "Passwords must match"),
                              dob: Yup.string()
                                .required('DOB is Required')
                            })}
                          >
                            {props => (
                              <Form onSubmit={props.handleSubmit}>
                                <Row>
                                  <Col xs="4" md="4" lg={2}>
                                    <FormGroup className="mb-3 text-center">
                                      {/* <ImagesUploader
                                    // url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    optimisticPreviews
                                    multiple={false}
                                    onLoadEnd={(err) => {
                                      if (err) {
                                        console.error(err);
                                      }
                                    }}
                                    onChange={(e)=>{}}
                                  /> */}
                                      <ImageUploader
                                        // withIcon={true}
                                        buttonText='Choose images'
                                        onChange={this.uploadImage}
                                        imgExtension={['.jpg', '.gif', '.png', '.gif','.jpeg']}
                                        maxFileSize={1048576}
                                        withPreview={true}
                                        singleImage={true}
                                        withIcon={this.state.showIcon}
                                        // buttonText="Choose Profile Image"
                                        flipHeight={this.state.userPhoto.length > 0 ? { height: "inherit" } : {}}
                                        label="'Max file size: 1mb"
                                        labelClass={this.state.userPhoto.length > 0 ? 'hideLabel' : 'showLabel'}
                                        buttonClassName={this.state.userPhoto.length > 0 ? 'hideButton' : 'showButton'}
                                        defaultImages={this.state.userPhoto}
                                        imageState={this.state.imageState}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={10}>
                                    <Row>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="select">First Name</Label>
                                          <Input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            onChange={(value) => { props.handleChange('firstName')(value) }}
                                            value={props.values.firstName}
                                            className={props.errors.firstName && props.touched.firstName ? "is-invalid" : ""}
                                          />
                                          {props.errors.firstName && props.touched.firstName && (
                                            <div className="invalid-feedback">{props.errors.firstName}</div>
                                          )}
                                        </FormGroup>
                                      </Col>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="select">Last Name</Label>
                                          <Input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            onChange={(value) => { props.handleChange('lastName')(value) }}
                                            value={props.values.lastName}
                                            className={props.errors.lastName && props.touched.lastName ? "is-invalid" : ""}
                                          />
                                          {props.errors.lastName && props.touched.lastName && (
                                            <div className="invalid-feedback">{props.errors.lastName}</div>
                                          )}
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={6}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="email">Email ID</Label>
                                          <Input
                                            type="text"
                                            id="email"
                                            name="email"
                                            placeholder="Enter Email ID"
                                            value={props.values.email}

                                            onChange={(value) => {
                                              props.handleChange("email")(value)
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg={6}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="date">Date Of Birth</Label>
                                          <DatePicker
                                            className={`form-control ${props.errors.dob && props.touched.dob ? "is-invalid" : ""}`}
                                            id="dob "
                                            name="dob "
                                            showMonthDropdown
                                            showYearDropdown
                                            dateFormat="dd/MM/yyyy"
                                            dropdownMode="select"
                                            placeholderText="Enter Birth Date"
                                            // selected={props.values.dob}
                                            value={props.values.dob ? moment(props.values.dob).format('DD-MM-YYYY') : ''}

                                            onChange={(value) => {
                                              props.handleChange("dob")(value)
                                            }}
                                          />
                                          {props.errors.dob && props.touched.dob && (
                                            <div className="invalid-feedback">{props.errors.dob}</div>
                                          )}
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="roleId">Role</Label>
                                          <Select
                                            className="select-default-width"
                                            options={role_list ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list, 'Role') : []}
                                            value={props.values.roleId}
                                            onChange={option => {
                                              if (option && option.value) {
                                                props.handleChange('roleId')(option.value)
                                              } else {
                                                props.handleChange('roleId')('')
                                              }
                                            }}
                                            placeholder="Select Role"
                                            id="roleId"
                                            name="roleId"
                                            className={
                                              props.errors.roleId && props.touched.roleId
                                                ? "is-invalid"
                                                : ""
                                            }
                                          />
                                          {props.errors.roleId && props.touched.roleId && (
                                            <div className="invalid-feedback">{props.errors.roleId}</div>
                                          )}

                                        </FormGroup>
                                      </Col>
                                      {/* <Col lg={6}>
                                  <FormGroup>
                                    <Label htmlFor="companyId">Company</Label>
                                    <Select
                                      className="select-default-width"
                                      options={role_list ? selectOptionsFactory.renderOptions('roleName', 'roleCode', role_list , 'Role') : []}
                                      value={props.values.companyId}
                                      onChange={option => props.handleChange('companyId')(option.value)}
                                      placeholder="Select Company"
                                      id="companyId"
                                      name="companyId"
                                      className={
                                        props.errors.companyId && props.touched.companyId
                                          ? "is-invalid"
                                          : ""
                                      }
                                    />
                                    {props.errors.companyId && props.touched.companyId && (
                                      <div className="invalid-feedback">{props.errors.companyId}</div>
                                    )}

                                  </FormGroup>
                                </Col> */}
                                      <Col lg={6}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="active">Status</Label>
                                          <div>
                                            <FormGroup check inline>
                                              <div className="custom-radio custom-control">
                                                <input
                                                  className="custom-control-input"
                                                  type="radio"
                                                  id="inline-radio1"
                                                  name="active"
                                                  checked={this.state.selectedStatus}
                                                  value={true}
                                                  onChange={e => {
                                                    if (e.target.value) {
                                                      this.setState({ selectedStatus: true }, () => {
                                                      })
                                                    }
                                                  }}
                                                />
                                                <label className="custom-control-label" htmlFor="inline-radio1">Active</label>
                                              </div>
                                            </FormGroup>
                                            <FormGroup check inline>
                                              <div className="custom-radio custom-control">
                                                <input
                                                  className="custom-control-input"
                                                  type="radio"
                                                  id="inline-radio2"
                                                  name="active"
                                                  value={false}
                                                  checked={!this.state.selectedStatus}
                                                  onChange={e => {
                                                    if (e.target.value === 'false') {
                                                      this.setState({ selectedStatus: false })
                                                    }
                                                  }}
                                                />
                                                <label className="custom-control-label" htmlFor="inline-radio2">Inactive</label>
                                              </div>
                                            </FormGroup>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>

                                    </Row>
                                    <Row>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="select">Password</Label>
                                          <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            onChange={(value) => { props.handleChange('password')(value) }}
                                            className={props.errors.password && props.touched.password ? "is-invalid" : ""}
                                          />
                                          {!props.errors.password ?
                                            (
                                              <FormText style={{ color: '#20a8d8', fontSize: '14px' }}>hint: Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character</FormText>
                                            ) : null}
                                          {props.errors.password && props.touched.password && (
                                            <div className="invalid-feedback">{props.errors.password}</div>
                                          )}
                                        </FormGroup>
                                      </Col>
                                      <Col lg={6}>
                                        <FormGroup>
                                          <Label htmlFor="select">Confirm Password</Label>
                                          <Input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            onChange={(value) => { props.handleChange('confirmPassword')(value) }}
                                            className={props.errors.confirmPassword && props.touched.confirmPassword ? "is-invalid" : ""}
                                          />
                                          {props.errors.confirmPassword && props.touched.confirmPassword && (
                                            <div className="invalid-feedback">{props.errors.confirmPassword}</div>
                                          )}
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
                                    <FormGroup>
                                      <Button type="button" color="danger" className="btn-square" onClick={this.deleteUser}>
                                        <i className="fa fa-trash"></i> Delete
                                </Button>
                                    </FormGroup>
                                    <FormGroup className="text-right">
                                      <Button type="submit" color="primary" className="btn-square mr-3">
                                        <i className="fa fa-dot-circle-o"></i> Update
                                </Button>
                                      <Button color="secondary" className="btn-square"
                                        onClick={() => { this.props.history.push('/admin/settings/user') }}>
                                        <i className="fa fa-ban"></i> Cancel
                                </Button>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Form>
                            )}
                          </Formik>
                        </Col>
                      </Row>
                    )
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailUser)

