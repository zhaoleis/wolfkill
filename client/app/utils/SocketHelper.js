import io from 'socket.io-client'

const socket = io('ws://localhost:8001')
export function joinRoom() {
  const _roomName = document.querySelector('.roomName')
  const _nickName = document.querySelector('.nickName')
  const _btn = document.querySelector('.begin')
  if (_nickName.value && _roomName.value) {
    _btn.textContent = '准备游戏'
    this.socket.emit('join', _roomName.value, _nickName.value)
  }
}

export function createRoom(roomName, nickName) {
  if (roomName && nickName) {
    socket.emit('create', roomName.value, nickName.value)
  }
}

export function getRooms() {
  this.socket.emit('getRooms')
}

export function addPlayer(player) {
  const _player = document.querySelector('.players')
  const _div = document.createElement('div')
  _div.setAttribute('class', 'player')
  const _span1 = document.createElement('span')
  _span1.textContent = player
  _div.appendChild(_span1)
  const _span2 = document.createElement('span')
  _span2.setAttribute('class', 'role')
  _span2.textContent = '角色'
  _div.appendChild(_span2)
  _player.appendChild(_div)
}

export function initRoom(room) {
  document.querySelector('.detail').className = 'detail show'
  const count = document.querySelector('.count')
  count.textContent = `当前房间人数：${room.users.length}`
  const owner = document.querySelector('.owner')
  owner.textContent = `房主：${room.owner}`
  if (room.users.length > 0) {
    const _player = document.querySelector('.players')
    while (_player.hasChildNodes()) {
      _player.removeChild(_player.firstChild)
    }
    room.users.forEach(item => {
      addPlayer(item)
    })
  }
}

export function addRooms(rooms) {
  const list = document.querySelector('.roomList')
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild)
  }
  rooms.forEach(item => {
    if (item !== null && typeof (item) === 'object') {
      const _li = document.createElement('li')
      _li.textContent = `房间名：${item.name}----房主：${item.owner}`
      list.appendChild(_li)
    }
  })
}

export function initConnect() {
  // this.socket = io.connect('ws://localhost:8001');
  socket.on('connect', () => console.log('建立连接'));
  socket.on('createFailed', () => console.log('创建房间失败'));
  socket.on('createSuccess', (room) => {
    console.log('创建房间成功')
    initRoom(room)
  });
  socket.on('joinSuccess', (room) => {
    console.log('加入房间成功')
    initRoom(room)
  });
  socket.on('roomList', (rooms) => {
    console.log('获取房间信息:', rooms)
    addRooms(rooms)
  });
  socket.on('system', (roomName, data, type) => {
    console.log(`接收系统消息:${roomName + data + type}`)
    if (type === 'join') {
      initRoom(data)
    } else if (type === 'create' || type === 'close') {
      addRooms(data)
    }
  });
  socket.on('newMsg', (nickname, msg) => {
    console.log('接收用户消息', nickname, msg)
  });
}
