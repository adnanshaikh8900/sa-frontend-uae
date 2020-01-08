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


import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    
  })
}

class ImportTransaction extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      
    }

    this.options = {
      paginationPosition: 'top'
    }

    this.initializeData = this.initializeData.bind(this)

  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData () {
  }


  render() {


    return (
      <div className="import-bank-statement-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="fa glyphicon glyphicon-export fa-upload" />
                        <span className="ml-2">Transaction</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportTransaction)
