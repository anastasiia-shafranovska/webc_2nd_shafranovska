const board = document.getElementById('DrawingCanvas');
const brush = board.getContext('2d');

let paint = false;


function findcursor(event) {
    const rect = board.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}


board.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;

    paint = true;
    const pos = findcursor(event);

    brush.beginPath();
    brush.moveTo(pos.x, pos.y);
    brush.lineWidth = 5;
    brush.lineCap = 'round';
    brush.strokeStyle ='#000000';


    brush.lineTo(pos.x, pos.y);
    brush.stroke();
});


board.addEventListener('mousemove', (event) => {
    if (!paint) return;

    const pos = findcursor(event);
    brush.lineTo(pos.x, pos.y);
    brush.stroke();
});


function stopdraw() {
    if (!paint) return;
    paint = false;
    brush.closePath();
}

board.addEventListener('mouseup', stopdraw);
board.addEventListener('mouseleave', stopdraw);
