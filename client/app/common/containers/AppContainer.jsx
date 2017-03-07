import React, { Component } from 'react'
import { connect } from 'react-redux'

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showChild: true
    }
  }

  componentWillMount() {
  }

  render() {
    if (!this.props.children) {
      return <div></div>
    }
    return (
      <div>
        <div className="jice-main-content">
          {React.cloneElement(this.props.children, { btnChangeRouter: {} })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(AppContainer)
