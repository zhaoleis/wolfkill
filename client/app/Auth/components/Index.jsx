import React, { Component } from 'react'
import './Index.css'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domains: ''
    }
  }

  componentWillMount() {
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
       <h1>hello world</h1>
      </div>
    )
  }
}
