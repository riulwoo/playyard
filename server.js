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

/* 전역변수 선언 */
let userinfo = {};
for(let i = 0; i < 22; i++) {
  userinfo[i] = {
    id : null,
    room : null
  }
}


/* 사이트 접속 시 실행 메소드 */
io.on('connection', (socket)=>{
  console.log(`${socket.id}님이 입장하셨습니다.`);

  console.log(userinfo[1].id + " , " + userinfo[1].room);

  //사이트 접속 해제
  socket.on('disconnect', (reason)=>{
    for(let i = 0; i < userinfo.length; i++){
      if(userinfo[i].id == socket.id) {
        userinfo[i].id == null;
        userinfo[i].room == null;
        userinfo[i].name == null;
        break;
      }
    }
    console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다.`)
  })

  socket.emit('userid', socket.id)

  //방입장 메시지
  socket.on('joinroom',(info)=> {
    let roomcnt = 0; //접속한 방 번호에 유저가 꽉 차있는지 체크하는 변수

      //서버 데이터 객체에 유저 정보와 방 번호 저장
      for(let i = 0; i < userinfo.length; i++) { 

        //방 인원이 꽉찼는지 확인
        if(userinfo[i].room == info.room)
          roomcnt++;
        if(roomcnt < 2){
          if(userinfo[i].id == info.id) { //방을 옮길 경우
            socket.leave(userinfo[i].room);
            socket.join(info.room);
            userinfo[i].room = info.room;
            roomcnt++;
            console.log("방옮김");
            io.emit('roomcnt', function() {
            console.log("값보냄");
            });
            break;
          } else if(userinfo[i].id == null || userinfo[i].room == null) { //처음 방에 입장할 경우
              socket.join(info.room);
              userinfo[i].id = info.id;
              userinfo[i].room = info.room;
              roomcnt++;
              console.log("방입장함");
              io.emit('roomcnt',function() {
                console.log("값보냄");
              });
            break;
          }
        }  
      }
    })

  //채팅 메시지 받아서 해당 방에 전송
  socket.on('message', (message)=> {
    
  })


})