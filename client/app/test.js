window.onload = function () {
  this.initConnect()
  this.socket.emit('getRooms')
}

function joinRoom() {
  const _roomName = document.querySelector('.roomName')
  const _nickName = document.querySelector('.nickName')
  const _btn = document.querySelector('.begin')
  if (_nickName.value && _roomName.value) {
    _btn.textContent = '准备游戏'
    this.socket.emit('join', _roomName.value, _nickName.value)
  }
}

function createRoom() {
  const _roomName = document.querySelector('.roomName')
  const _nickName = document.querySelector('.nickName')
  const _btn = document.querySelector('.begin')
  if (_nickName.value && _roomName.value) {
    _btn.textContent = '开始游戏'
    this.socket.emit('create', _roomName.value, _nickName.value)
  }
}

function getRooms() {
  this.socket.emit('getRooms')
}

function initConnect() {
  this.socket = io.connect('ws://localhost:8001');
  this.socket.on('connect', function () {
    console.log('建立连接')
  });
  this.socket.on('createFailed', function () {
    console.log('创建房间失败')
  });
  this.socket.on('createSuccess', function (room) {
    console.log('创建房间成功')
    initRoom(room)
  });
  this.socket.on('joinSuccess', function (room) {
    console.log('加入房间成功')
    initRoom(room)
  });
  this.socket.on('roomList', function (rooms) {
    console.log('获取房间信息:', rooms)
    addRooms(rooms)
  });
  this.socket.on('system', function (roomName, data, type) {
    console.log('接收系统消息:' + roomName, data, type)
    if (type == 'join') {
      initRoom(data)
    }else if(type == 'create' || type == 'close'){
      addRooms(data)
    }
  });
  this.socket.on('newMsg', function (nickname, msg) {
    console.log('接收用户消息', nickname, msg)
  });
}

function addRooms(rooms) {
  var list = document.querySelector('.roomList')
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild)
  }
  rooms.forEach(item => {
    if (item != null && typeof (item) == 'object') {
      var _li = document.createElement('li')
      _li.textContent = '房间名：' + item.name + '----房主：' + item.owner
      list.appendChild(_li)
    }
  })
}
function initRoom(room) {
  document.querySelector('.detail').className = 'detail show'
  var count = document.querySelector('.count')
  count.textContent = '当前房间人数：' + room.users.length
  var owner = document.querySelector('.owner')
  owner.textContent = '房主：' + room.owner
  if (room.users.length > 0) {
    var _player = document.querySelector('.players')
    while (_player.hasChildNodes()) {
      _player.removeChild(_player.firstChild)
    }
    room.users.forEach(item => {
      addPlayer(item)
    })
  }
}
function addPlayer(player) {
  var _player = document.querySelector('.players')
  var _div = document.createElement('div')
  _div.setAttribute('class', 'player')
  var _span1 = document.createElement('span')
  _span1.textContent = player
  _div.appendChild(_span1)
  var _span2 = document.createElement('span')
  _span2.setAttribute('class', 'role')
  _span2.textContent = '角色'
  _div.appendChild(_span2)
  _player.appendChild(_div)
}