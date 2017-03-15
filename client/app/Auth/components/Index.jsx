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
    this.createRoom = this.createRoom.bind(this)
    this.roomChange = this.onTxtChange.bind(this, 'roomName')
    this.nickChange = this.onTxtChange.bind(this, 'nickName')
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

  mockRoomData() {
    const data = [
      { roomName: '快来加入吧', count: 2, owner: '李四' },
      { roomName: '就差预言家了', count: 3, owner: '王五' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
      { roomName: '一起击杀狼王', count: 2, owner: '窦娥' },
    ]
    return data
  }

  render() {
    const list = this.mockRoomData()
    const _list = list.map((item, index) => <li key={index} className="list-item">
      <p>房间名：{item.roomName}</p>
      <hr className="split-line-dash" />
      <p><span>房主：{item.owner}</span><span className="item-count">房间人数：{item.count}</span></p>
    </li>)

    return (
      <div className="list-body">
        <div className="list-box">
          <Input className="room-name" placeholder="请输入房间名" value={this.state.roomName} onChange={this.roomChange} />
          <Input className="nick-name" placeholder="请输入昵称" value={this.state.nickName} onChange={this.nickChange} />
          <Button onClick={this.createRoom} type="primary">创建房间</Button>&nbsp;
          <Button onClick={this.createRoom}>加入房间</Button>
        </div>
        <div className="room-list">
          <ul>
            {_list}
          </ul>
        </div>
      </div>
    )
  }
}
