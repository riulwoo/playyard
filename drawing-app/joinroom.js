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
  console.log('초기화 완료 데스')
    room = document.querySelectorAll('#r');
    num = room.length;
    for(i=0; i < num; i++)
    {
        room[i].value = `( ${data[i]} / 2 접속중 )`;
    }
})

// 방 입장 버튼 클릭시 방 입장
function joinroom(cIndex){
    privroomnum = roomnum;
    roomnum = cIndex;

    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
        
    socket.emit('joinroom', 
    {
        id : myId,
        cIndex : roomnum,
        pIndex : privroomnum,
    })
}

socket.on('joinfail',()=>{
    alert('빈 자리가 없습니다!!');
})
