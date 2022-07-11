let myId;
let usercnt = 0;
let beforebtn = null;
let currentbtn = null;
let roomnum = null;

socket.on('userid', (data)=> {
    myId = data;
})



function joinroom(room, btn){
    beforebtn = currentbtn;
    currentbtn = document.getElementById(btn);
    roomnum = document.getElementById(room)


    if(beforebtn != null)
    {
        beforebtn.style.display = 'block';
        currentbtn.style.display = 'none';
    }
    else
        currentbtn.style.display = 'none';
        
    socket.emit('joinroom', 
    {
        id : myId,
        room : room
    })

}

socket.on('roomcnt', (roomcnt)=> {
    usercnt = roomcnt;

    roomnum.innerText = `( ${usercnt} / 2명 접속중 )`;

    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)

})

