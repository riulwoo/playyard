// server.js
/* 설치한 express 모듈 불러오기 */
const express = require('express')
/* 설치한 socket.io 모듈 불러오기 */
const socket = require('socket.io')
/* Node.js 기본 내장 모듈 불러오기 */
const http = require('http')
/* Node.js 기본 내장 모듈 불러오기 */
const fs = require('fs')
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

let roominfo = [];             // 유저 정보 저장 배열
let rooms = [];                // 방에 입장한 유저 현황 확인 배열
let nick = [];                 // 유저가 설정한 닉네임 저장 배열 ( 초기값은 해당 유저의 id )
for (let i = 0; i < 11; i++) { // 변수 초기화
  rooms[i] = 0;   
  nick[i] = ['' , '' , '' , '' , '' , ''];
  roominfo[i] = {
    room: `room_${i}`,         // 해당 방 식별 코드 변수
    id: {                      // 방에 있는 유저 식별 객체
      one: null,
      two: null
    }
  }
}

/* 사이트 접속 시 실행 메소드 */
io.on('connection', (socket) => {
  console.log(`${socket.id}님이 입장하셨습니다.`);
  
  socket.emit('userid', socket.id);
  io.emit('init', rooms);

  /*유저 정보 변수에서 방 입장 상태 확인 시 index 반환 함수*/
  function info() {
    let idCheck;
    let roomIndex = roominfo.findIndex((room, i) => {
      const { one, two } = room.id;
      if (one === socket.id || two === socket.id) {
        idCheck = true;
        return room;
      } else idCheck = false;
    })
    return [roomIndex, idCheck];
  }

  /*사이트 접속 해제*/
  socket.on('disconnect', (reason) => {
    const Index = info();
    if (Index[1]) {
      const { one } = roominfo[Index[0]].id;
      if (one === socket.id) roominfo[Index[0]].id.one = null;
      else roominfo[Index[0]].id.two = null;
      socket.leave(roominfo[Index[0]].room);
      rooms[Index[0]] -= 1;
      io.emit('init', rooms);
    }
  })
  
  /*방 입장*/
  socket.on('joinroom', (data) => {
    const { id, cIndex, nickName } = data;
    const { one: cId } = roominfo[cIndex].id;
    const full = 0;
    const nickIndex = nick.
    if (full === 2) socket.emit('fail'); 
    else {
      try {
        const Index = info();
        if (Index[1]) {
          const { one: pId } = roominfo[Index[0]].id;
          socket.leave(roominfo[Index[0]].room);
          if (pId === id) roominfo[Index[0]].id.one = null;
          else roominfo[Index[0]].id.two = null;
          rooms[Index[0]] -= 1;
        }
      } catch (e) {
      } finally {
        if(nickName == '') {
          
        }
        socket.join(roominfo[cIndex].room);
        if (cId === null) roominfo[cIndex].id.one = id;
        else roominfo[cIndex].id.two = id;
        rooms[cIndex] += 1;
        io.emit('init', {
          nick: nick,
          rooms: rooms
        });
      }
    }
  })

  /*채팅 메시지 통신*/
  socket.on('message', (message) => {
    const Index = info();
    if (Index[1]) socket.to(roominfo[Index[0]].room).emit('update', message);
  })

  /*실시간 그림 통신*/
  socket.on('emitDraw', (data) => {
    const Index = info();
    if (Index[1]) socket.to(roominfo[Index[0]].room).emit('onDraw', data);
  })

  /*그림 삭제 메시지*/
  socket.on('emitClear', () => {
    const Index = info();
    if (Index[1]) socket.to(roominfo[Index[0]].room).emit('onClear');
  })
})