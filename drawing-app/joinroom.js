let myId;
let usercnt = 0;
let beforebtn = null;
let currentbtn = null;
let roomnum = null;
let privroomnum = null;

socket.on('userid', (data)=> {
    myId = data;
})

socket.on('init', (data)=>{
    room = document.querySelectorAll('#r');
    for(i=0; i < room.length; i++)
    console.log(room[i]);
})
function joinroom(room, btn){
    beforebtn = currentbtn;
    currentbtn = document.getElementById(btn);
    privroomnum = roomnum;
    roomnum = document.getElementById(room);

    if(beforebtn != null)
    {
        beforebtn.style.display = 'block';
        currentbtn.style.display = 'none';
    }
    else
        currentbtn.style.display = 'none';


        ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
        
    socket.emit('joinroom', 
    {
        id : myId,
        room : room,
        privroom : privroomnum
    })
}

socket.on('roomcnt', (roomcnt)=> {
    usercnt = roomcnt;
    roomnum.innerText = `( ${usercnt} / 2명 접속중 )`;
    privroomnum.innerText = `( ${usercnt-1} / 2명 접속중 )`;
})

socket.on('userdisconnect', (roomcnt)=> {})
socket.on('userdisconnect', (roomcnt)=> {})