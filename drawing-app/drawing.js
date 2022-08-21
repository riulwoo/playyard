const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const eraserEl = document.getElementById('eraser');
const ctx = canvas.getContext('2d');

let size = 10;
let isPressed = false;
let color = 'black';
let x = undefined;
let y = undefined;

// drawing 시작
canvas.addEventListener('mousedown', (e) => {
    isPressed = true;

    x = e.offsetX;
    y = e.offsetY;
})

// drawing 종료
canvas.addEventListener('mouseup' , (e) => {
    isPressed = false;

    x = undefined;
    y = undefined;
})

// 실제 drawing 부분
canvas.addEventListener('mousemove', (e) => {
    if(isPressed)
    {
        const x2 = e.offsetX;
        const y2 = e.offsetY;

        drawCircle(x2,y2);
        drawline(x,y, x2, y2);
        x= x2;
        y= y2;
        socket.emit('emitDraw', {x : x, y : y, x2 : x2, y2 : y2, size : size})
    }
});

// 현재 속한 방의 캔버스에 x,y,x2,y2 전달
// 속한 방의 캔버스에서 x,y,x2,y2 받아 drawCircle과 drawline 실행

socket.on('onDraw', (data)=>{
  const {_x,_y,_x2,_y2,_size} = data;
  let you_size = _size;
  drawCircle(_x2, _y2, you_size);
  drawline(_x,_y,_x2,_y2,you_size);
  _x = _x2;
  _y = _y2;
})

function drawCircle(x,y,you_size) {
  if(you_size == undefined) you_size = size;
    ctx.beginPath();
    ctx.arc(x,y,you_size, 0 , Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawline(x1, y1, x2, y2, you_size){
  if(you_size == undefined) you_size = size;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = you_size * 2;
    ctx.stroke();
}

// brush 크기 조절
increaseBtn.addEventListener('click', () => {
    size += 5;
    if(size > 30)
    {
        size = 30;
    }
    updateSizeOnScreen();
})
decreaseBtn.addEventListener('click', () => {
    size -= 5;
    if(size < 5)
    {
        size = 5;
    }

    updateSizeOnScreen();
})

colorEl.addEventListener('change', (e) => {
    color = e.target.value;
})

function updateSizeOnScreen(){
    sizeEl.innerText = size;
}

clearEl.addEventListener('click', () => {
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
    socket.emit('emitClear');
})

socket.on('onClear', ()=>ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight))
// function draw(){
//     ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
//     drawCircle(x,y);

//     requestAnimationFrame(draw);
// }

// draw();