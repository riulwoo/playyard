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
    room: null,
    id: { one: null, two: null }
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

  //사이트 접속 해제
  socket.on('disconnect', (reason) => { // 1.roominfo 배열 index 2.roominfo 안에 id 객체에 비교 3. 비교 후 해당 객체의 index와 roominfo의 
    const id = roominfo.filter((info, infoindex) => {
      const idarray = Object.values(info.id);
      const result = idarray.filter((id, index) => {
        if (id == socket.id)
          return { infoindex: infoindex, index: index };
      })
      return result;
    })
    console.log(id);
    roominfo[id[0]].id[id[1]] = null;
    console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다.`)
  })

  socket.emit('userid', socket.id)

  socket.emit('init', rooms)

  //방입장 메시지
  socket.on('joinroom', (info) => {
    const { id, cIndex, pIndex } = info;
    
    //1. 해당 방 인원 확인
    
    //1-1. 꽉찼다면 실패 메시지
    //1-2. 덜찼다면 덜찬 인덱스 확인
    //2. 방을 옮기는 것인지 처음 방에 입장하는 것인지 확인
    //2-1.방을 옮길 경우
    //    1. 유저가 있었던 방의 인덱스에서 일치하는 아이디를 삭제
    //    2. 유저가 들어갈 방에 아이디 삽입
    //    3. room배열의 인덱스 값 수정
    //    4. init 메시지로 room배열 전송
    //처음 방에 입장할 경우
    //    1. 유저가 들어갈 방에 아이디 삽입
    //    2. room 배열의 인덱스 값 수정
    //    3. init 메시지로 room배열 전송
  })

  //채팅 메시지 받아서 해당 방에 전송
  socket.on('message', (message) => {
    for (let i = 0; i < Object.keys(roominfo).length; i++) {
      if (roominfo[i].id == socket.id)
        io.sockets.to(roominfo[i].room).emit('update', message);
    }
  })


})