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
server.listen(process.env.PORT || 7070, ()=> {
  console.log("서버가 대기중입니다.");
})
/* 사이트 접속 시 화면 전환 */
app.get('/', function(req, res){
  fs.readFile('drawing-app/index.html', function(err, data){
    if(err){
      res.send('에러')
    }else{
      res.writeHead(200, {'Content-Type':'text/html'})
      res.write(data)
      res.end()
    }
  })
})

/* 유저 접속 정보 저장 변수 선언 */
let roominfo = [];
for(let i = 0; i < 11; i++) {
  roominfo[i] = {
    room : null,
    id : { one : null, two : null }
  }
}

/* 유저 접속 현황 체크 변수 */
let rooms = [];
for(let i = 0; i < 11; i++) {
  rooms[i] =  0;
}

/* 사이트 접속 시 실행 메소드 */
io.on('connection', (socket)=>{
  console.log(`${socket.id}님이 입장하셨습니다.`);

  //사이트 접속 해제
  socket.on('disconnect', (reason)=>{ // 1.roominfo 배열 index 2.roominfo 안에 id 객체에 비교 3. 비교 후 해당 객체의 index와 roominfo의 
    const id = roominfo.filter((info, infoindex)=>{
      const idarray = Object.values(info.id);
      const result = idarray.filter((id,index)=>{
          if(id == socket.id)
           return {infoindex : infoindex, index : index};
      })
      return result;
  })
  roominfo[id[0]].id[id[1]] = null;
    console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다.`)
  })

  socket.emit('userid', socket.id)

  socket.emit('init', rooms)
  //방입장 메시지
  socket.on('joinroom',(info)=> {
      let roomcnt = 0; //접속한 방 번호에 유저가 꽉 차있는지 체크하는 변수
      const {id, cIndex, pIndex, room} = info;
      //해당 방에 인원 확인
      for(let i = 0; i < Object.keys(roominfo).length; i++) {
        if(roominfo[i].room == room)
          roomcnt++;
      }
      //서버 데이터 객체에 유저 정보와 방 번호 저장
      for(let i = 0; i < Object.keys(roominfo).length; i++) {
        if(roomcnt < 2) {
          if(roominfo[i].id == id) { //방을 옮길 경우
            socket.leave(roominfo[i].room);
            socket.join(room);
            roominfo[i].room = room;
            roomcnt++;
            break;
          } else if(roominfo[i].id == null && roominfo[i].room == null) { //처음 방에 입장할 경우
              socket.join(room);
              roominfo[i].id = id;
              roominfo[i].room = room;
              roomcnt++;
            break;
          }
        }  
      }
    })

  //채팅 메시지 받아서 해당 방에 전송
  socket.on('message', (message)=> {
    for (let i =  0; i < Object.keys(roominfo).length; i++) {
      if(roominfo[i].id == socket.id)
        io.sockets.to(roominfo[i].room).emit('update', message);
    }
  })


})