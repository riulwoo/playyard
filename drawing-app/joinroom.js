let myId;
let usercnt = 0;
let beforebtn = null;
let currentbtn = null;
let roomnum = null;
let privroomnum = null;

// 현재 접속중인 클라이언트의 소켓 ID값
socket.on('userid', (data)=> {
    myId = data;
})

// 클라이언트 처음 접속 시 서버의 현재 인원 초기화
socket.on('init', (data)=>{
    room = document.querySelectorAll('#r');
    num = room.length;
    for(i=0; i < num; i++)
    console.log(room[i]);
})

// 방 입장 버튼 클릭시 방 입장
function joinroom(iroom, croom, btn){
    beforebtn = currentbtn;
    currentbtn = document.getElementById(btn);
    privroomnum = roomnum;
    roomnum = document.getElementsByName(croom);

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
        room : croom,
        privroom : privroomnum,
        index : iroom
    })
}

// 이전의 방 인원 수와 입장한 방 인원 수 변경
socket.on('roomcnt', (data)=> {
    const {roomcnt, room, privroom} = data;
    usercnt = roomcnt;
    roomnum = document.getElementsByName(room);
    privroomnum = document.getElementsByName(privroom);
    roomnum.innerText = `( ${usercnt} / 2명 접속중 )`;
    privroomnum.innerText = `( ${usercnt-1} / 2명 접속중 )`;
})
