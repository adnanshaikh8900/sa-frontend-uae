import React from 'react'
import { connect } from 'react-redux'
import 'react-datepicker/dist/react-datepicker.css'
import { ScreenComponent } from '../../sections';
import './style.scss'

const mapStateToProps = (state) => {
  return ({})
}
const mapDispatchToProps = (dispatch) => {
  return ({})
}
class DetailSalaryComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount = () => { }
  render() {
    return (
      <ScreenComponent
        props={this.props}
        history={this.props.history}
        isCreated={false}
        componentID= {this.props.location.state.id}
      >
      </ScreenComponent>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailSalaryComponent)

