// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');


server.listen(process.env.PORT || 3000, ()=> {
  console.log("서버가 대기중입니다.");
})
