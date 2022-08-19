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

let roominfo = []; // 유저 정보 저장 배열
let rooms = []; //방 입장 인원 체크 배열
let roomCode = []; //방의 입장 코드 배열
for (let i = 0; i < 11; i++) {
  rooms[i] = 0;
  //roominfo[i] = [null, null];
  roominfo[i] = {
    room: `room_${i}`,
    id: {
      one: null,
      two: null
    }
  }
  //roomCode[i] = [`room_${i}`];
}
/* 사이트 접속 시 실행 메소드 */
io.on('connection', (socket) => {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  function info() { //1. 룸인포 인덱스랑 유저 아이디 인덱스를 가져와야한다
    // const roomIndex = roominfo.findIndex(id => {
    //   if (id[0] == socket.id || id[1] == socket.id) return id;
    // });
    // try {
    //   let idIndex = roominfo[roomIndex].findIndex(e => e == socket.id);
    // } catch {
    //   idIndex = -1;
    // }
    let idIndex;
    let roomIndex = roominfo.findIndex((room, i) => {
      const { one, two } = room.id;
      console.log(`one : ${one} / two : ${two}`);
      if (one == socket.id || two == socket.id) {
        console.log(`들어왔음`);
        //idIndex = roominfo.id.findIndex((id) => id.one == socket.id || id.two == socket.id);
        //console.log(`유저의 방 배열1 : ${roomIndex}  /  유저의 자리 배열1 : ${idIndex}`);
        return room;
      } //else idIndex = -1;
    })
    //console.log(`roominfo : ${Object.Value(roominfo)}`);
    console.log(`유저의 방 배열 : ${roomIndex}  /  유저의 자리 배열 : ${idIndex}`);
    return [roomIndex, idIndex];
  }

  //사이트 접속 해제
  socket.on('disconnect', (reason) => { // 1.roominfo 배열 index 2.roominfo 안에 id 객체에 비교 3. 비교 후 해당 객체의 index와 roominfo의 
    const Index = info();

    console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다.`)
  })

  socket.emit('userid', socket.id);

  socket.emit('init', rooms);

  //방입장 메시지
  socket.on('joinroom', (data) => {
    const { id, cIndex } = data;
    const full = Object.values(roominfo[cIndex]).filter((user, index) => { if (user == null) return index; }); //1. 해당 방 인원 수 확인
    const { one } = roominfo[cIndex];
    if (full.length == 2) socket.emit('fail'); //1-1. 꽉찼다면 실패 메시지
    else { //1-2. 덜찼다면 덜찬 인덱스 확인
      try {
        const Index = info();    //2. 방을 옮기는 것인지 처음 방에 입장하는 것인지 확인
        console.log(`유저의 방 배열2 : ${Index[0]}  /  유저의 자리 배열2 : ${Index[1]}  /  null아이디 인덱스 : ${idIndex}`);
        if (Index[1] !== -1) {
          //roominfo[Index[0]].id[Index[1]] = null;
          socket.leave(roominfo[Index[0]].room); //    1. 유저가 있었던 방의 인덱스에서 일치하는 아이디를 삭제, leave
          rooms[Index[0]] -= 1;
          console.log(`방 옮길 경우 roomIndex : ${Index[0]} / idIndex : ${Index[1]}`);
          console.log('방옮김');
        }
      } catch (e) {
        console.log(e);
      } finally {
        socket.join(roominfo[cIndex].room);
        console.log(`들어갈 방 Index : ${cIndex}`);
        console.log(`해당 방의 빈 자리 : ${idIndex}`);
        if (one === null) roominfo[cIndex].id.one = id;
        else roominfo[cIndex].id.two = id;
        rooms[cIndex] += 1;
        console.log(`해당 방의 현황 : ${roominfo[cIndex].id}`);
        console.log(`전체 인원 배열 : ${rooms}`);
        socket.emit('init', rooms);
        console.log('방처음입장');
      }
    }
  })

  //채팅 메시지 받아서 해당 방에 전송
  socket.on('message', (message) => {
    const Index = info();
    if (Index[1] !== -1) sockets.to(roominfo[Index[0]].room).emit('update', message);
  })

  //그림판 메시지 받아서 해당 방에 전송
  socket.on('emitDraw', (data) => {
    const Index = info();
    if (Index[1] !== -1) io.sockets.to(roominfo[Index[0]].room).emit('onDraw', data);
  })

  //그림판 삭제 메시지
  socket.on('emitClear', () => {
    const Index = info();
    if (Index[1] !== -1) io.sockets.to(roominfo[Index[0]].room).emit('onDraw', data);
  })
})