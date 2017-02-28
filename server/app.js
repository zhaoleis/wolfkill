var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use('/', express.static(__dirname + "/www"));
server.listen(8080);
console.log("Server has started.");

var rooms = []
var users = []
io.on('connection', function (socket) {
	var currentUser = ''
	var currentRoom = ''
	socket.on('create', function (roomName, nickName) {
		var isExist = rooms.find(item => item.name == roomName)
		if (isExist) {
			socket.emit('createFailed')
		} else {

			var room = {}
			room.name = roomName
			room.owner = nickName
			room.users = [nickName]
			rooms.push(room)
			users.push(nickName)
			currentUser = nickName
			currentRoom = roomName
			socket.join(roomName)
			socket.emit('createSuccess', room)
			io.sockets.emit('system', roomName, rooms, 'create')
		}
	})

	socket.on('getRooms', function () {
		console.log(currentRoom)
		socket.emit('roomList', rooms)
	})
	socket.on('join', function (roomName, nickName) {
		var myRoom = []
		rooms.forEach((item, index) => {
			if (item.name == roomName) {
				myRoom = [index, item]
			}
		})
		if (myRoom.length > 0) {
			myRoom[1].users.push(nickName)
			rooms[myRoom[0]] = myRoom[1]
			currentUser = nickName
			currentRoom = roomName
			socket.join(roomName)
			socket.emit('joinSuccess', myRoom[1])
			io.to(currentRoom).emit('system', myRoom[1].name, myRoom[1], 'join')
		}
	})

	socket.on('begin', function () {
		 var roles = shuffle(['狼人','狼人','村民','村民','预言家','女巫','猎人','法官'])
		 io.to(currentRoom).emit('system', myRoom[1].name, roles, 'getRole')
	})
	//洗牌算法
	function shuffle(input) {
		for (var i = input.length - 1; i >= 0; i--) {
			var randomIndex = Math.floor(Math.random() * (i + 1));
			var itemAtIndex = input[randomIndex];
			input[randomIndex] = input[i];
			input[i] = itemAtIndex;
		}
		return input
	}
	

	socket.on('disconnect', function () {
		var myRoom = []
		rooms.forEach((item, index) => {
			if (item.owner == currentUser) {
				myRoom = [index, item]
			} else {
				myRoom = []
			}
		})
		if (myRoom.length > 0) {
			rooms.splice(myRoom[0], 1)
			io.sockets.emit('system', myRoom[1].name, rooms, 'close')
		}
	})

	socket.on('msgSend', function (msg) {
		socket.broadcast.emit('newMsg', socket.nickname, msg);
	});
});

function bb(){
	var arr = Array.prototype.call(arguments) 
	arr.forEach(item=>console.log(item))
}