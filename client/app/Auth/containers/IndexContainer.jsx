import React, { Component } from 'react'
import Index from '../components/Index'
import { connect } from 'react-redux'
import './IndexContainer.css'

class IndexContainer extends Component {
  render() {
    const props = this.props
    return (
      <div>
        <Index {...props} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(IndexContainer)
