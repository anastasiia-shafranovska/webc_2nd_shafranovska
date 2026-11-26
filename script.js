const board = document.getElementById('DrawingCanvas');
const brush = board.getContext('2d');

const sizeInput = document.getElementById('brush-size');
const sizeLabel = document.getElementById('size-value');
const colorInput = document.getElementById('brush-color');
const toolButtons = document.querySelectorAll('.tlbtn');

let paint = false;
let lineThickness = Number(sizeInput.value);
let lineColor = colorInput.value;
let activeTool = 'D';

function setActiveButton(targetBtn) {
    toolButtons.forEach((btn) => btn.classList.remove('active'));
    targetBtn.classList.add('active');
}

toolButtons.forEach((btn) => {
    const label = btn.textContent.trim();

    btn.addEventListener('click', () => {
        if (label === 'D') {
            activeTool = 'D';
            setActiveButton(btn);
        } else if (label === 'E') {
            activeTool = 'E';
            setActiveButton(btn);
        } else if (label === 'C') {
            brush.clearRect(0, 0, board.width, board.height);
        }
    });
});

sizeInput.addEventListener('input', () => {
    lineThickness = Number(sizeInput.value);
    sizeLabel.textContent = `${lineThickness}px`;
});

colorInput.addEventListener('input', () => {
    lineColor = colorInput.value;
});

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
    brush.lineWidth = lineThickness;
    brush.lineCap = 'round';
    brush.strokeStyle = activeTool === 'E' ? '#ffffff' : lineColor;

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
