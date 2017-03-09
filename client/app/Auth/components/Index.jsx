import React, { Component } from 'react'
import './Index.css'
import { initConnect, createRoom } from '../../utils/SocketHelper'
import { Button, Input } from 'antd'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domains: '',
      roomName: '',
      nickName: ''
    }
  }

  componentWillMount() {
    initConnect()
  }

  componentDidMount() {
  }

  onTxtChange(type, e) {
    this.setState({
      [type]: e.target.value
    })
  }

  createRoom() {
    createRoom(this.state.roomName, this.state.nickName)
  }
  render() {
    return (
      <div>
        <h1>hello world</h1>
        <Input className="room-name" placeholder="请输入房间名" value={this.state.roomName} onChange={this.onTxtChange.bind(this, 'roomName')} />
        <Input className="nick-name" placeholder="请输入昵称" value={this.state.nickName} onChange={this.onTxtChange.bind(this, 'nickName')} />
        <Button onClick={this.createRoom.bind(this)}>创建房间</Button>
      </div>
    )
  }
}
