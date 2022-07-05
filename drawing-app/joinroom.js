let myId;
let usercnt = 0;

socket.on('userid', (data)=> {
    myId = data;
})

function joinroom(room){
    let roomnum = document.getElementById(room)
    socket.emit('joinroom', 
    {
        id : myId,
        room : room
    })

roomnum.innerText = `( ${usercnt} / 2명 접속중 )`;

    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
}