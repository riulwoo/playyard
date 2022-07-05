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

server.listen(process.env.PORT || 8080, ()=> {
  console.log("서버가 대기중입니다.");
})

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