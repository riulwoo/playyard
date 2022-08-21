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

socket.on('test',(data)=>{
    console.log(data);
})

// 클라이언트 처음 접속 시 서버의 현재 인원 초기화
socket.on('init', (data)=>{
    btn = document.querySelectorAll('#b');
    room = document.querySelectorAll('#r');
    num = room.length;
    for(i=0; i < num; i++)
    {
        room[i].innerText = `( ${data[i]} / 2 접속중 )`;
        const item = btn.item(i);
        if(data[i] >= 2){
            item.style.visibility = "hidden";
        } 
        else item.style.visibility = "visible";
    }
})

// 방 입장 버튼 클릭시 방 입장
function joinroom(cIndex){
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
        
    socket.emit('joinroom', 
    {
        id : myId,
        cIndex : cIndex
    })
}

socket.on('joinfail',()=>{
    alert('빈 자리가 없습니다!!');
})
