// server.js

/* 설치한 express 모듈 불러오기 */
const express = require('express')
/* 설치한 socket.io 모듈 불러오기 */
const socket = require('socket.io')
/* Node.js 기본 내장 모듈 불러오기 */
const http = require('http')
/* Node.js 기본 내장 모듈 불러오기 */
const fs = require('fs')
const { SocketAddress } = require('net')
const { Socket } = require('dgram')
/* express 객체 생성 */
const app = express()
/* express http 서버 생성 */
const server = http.createServer(app)
/* 생성된 서버를 socket.io에 바인딩 */
const io = socket(server)
app.use(express.static('drawing-app'))
/* 서버 켜짐 */
server.listen(process.env.PORT || 7070, () => {
  console.log("서버가 대기중입니다.");
})
/* 사이트 접속 시 화면 전환 */
app.get('/', function(req, res) {
  fs.readFile('drawing-app/index.html', function(err, data) {
    if (err) {
      res.send('에러')
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(data)
      res.end()
    }
  })
})

/* 유저 접속 정보 저장 변수 선언 */
let roominfo = [];
for (let i = 0; i < 11; i++) {
  roominfo[i] = {
    room: `Room ${i}`,
    id: [null, null]
  }
}

/* 유저 접속 현황 체크 변수 */
let rooms = [];
for (let i = 0; i < 11; i++) {
  rooms[i] = 0;
}

/* 사이트 접속 시 실행 메소드 */
io.on('connection', (socket) => {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  function info() { //1. 룸인포 인덱스랑 유저 아이디 인덱스를 가져와야한다
    //    const roomIndex = roominfo.findIndex(i => i.id == socket.id);
    const idIndex = roominfo.indexOf(socket.id, (e, i) => {
      return e.id;
    });
    console.log(idIndex);
    return idIndex;
  }

  //사이트 접속 해제
  socket.on('disconnect', (reason) => { // 1.roominfo 배열 index 2.roominfo 안에 id 객체에 비교 3. 비교 후 해당 객체의 index와 roominfo의 
    const index = info();
    if (index[1] !== -1)
      roominfo[index[0]].id[index[1]] = null;
    console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다.`)
  })

  socket.emit('userid', socket.id)

  socket.emit('init', rooms)

  //방입장 메시지
  socket.on('joinroom', (data) => {
    const { id, cIndex, pIndex } = data;
    const full = Object.values(roominfo[cIndex].id).filter((user, index) => { if (user == null) return index; }); //1. 해당 방 인원 확인
    const idIndex = roominfo.findIndex(i => i.id == null);
    if (full.length == 2) socket.emit('fail'); //1-1. 꽉찼다면 실패 메시지
    else { //1-2. 덜찼다면 덜찬 인덱스 확인
      try {
        const index = info();    //2. 방을 옮기는 것인지 처음 방에 입장하는 것인지 확인
        if (index == -1) {
          roominfo[pIndex].id[index] = null;
          socket.leave(roominfo[pIndex].room); //    1. 유저가 있었던 방의 인덱스에서 일치하는 아이디를 삭제, leave
          rooms[pIndex] = rooms[pIndex] - 1;
        }
        console.log('방옮김');
        console.log(rooms);
      } catch (e) { console.log(e) } finally {
        socket.join(roominfo[cIndex].room);
        roominfo[cIndex].id[idIndex] = id;  // 
        rooms[cIndex] = rooms[cIndex] + 1;
        console.log(roominfo[cIndex]);
        console.log(rooms);
        io.emit('init', rooms);
        console.log('방처음입장');
      }
    }
  })
  //채팅 메시지 받아서 해당 방에 전송
  socket.on('message', (message) => {
    for (let i = 0; i < Object.keys(roominfo).length; i++) {
      if (roominfo[i].id == socket.id)
        io.sockets.to(roominfo[i].room).emit('update', message);
    }
  })


})