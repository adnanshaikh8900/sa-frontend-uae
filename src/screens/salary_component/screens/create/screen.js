import React from 'react'
import { connect } from 'react-redux'
import { ScreenComponent } from '../../sections';
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
class CreateSalaryComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
  };

  render() {
    return (
      <ScreenComponent
        props={this.props}
        history={this.props.history}
        isCreated={true}
      >
      </ScreenComponent>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateSalaryComponent)

