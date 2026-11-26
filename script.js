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
const history = [];

function saver() {
    history.push(brush.getImageData(0, 0, board.width, board.height));
}

function undoLastAction() {
    if (history.length === 0) return;
    const laststep = history.pop();
    brush.putImageData(laststep, 0, 0);
}

function drawStar(cx, cy, radius) {
    const points = 5;
    const biggeerr = radius * 2.5;
    const smallerr = biggeerr * 0.45;
    let rotation = (Math.PI / 2) * 3;
    const step = Math.PI / points;

    brush.beginPath();
    brush.moveTo(cx, cy - biggeerr);

    for (let i = 0; i < points; i++) {
        brush.lineTo(
            cx + Math.cos(rotation) * biggeerr,
            cy + Math.sin(rotation) * biggeerr
        );
        rotation += step;

        brush.lineTo(
            cx + Math.cos(rotation) * smallerr,
            cy + Math.sin(rotation) * smallerr
        );
        rotation += step;
    }

    brush.closePath();
    brush.fillStyle = lineColor;
    brush.fill();
}

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
        } else if (label === '★') {
            activeTool = '★';
            setActiveButton(btn);
        } else if (label === 'C') {
            saver();
            brush.clearRect(0, 0, board.width, board.height);
        } else {
            undoLastAction();
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

    const pos = findcursor(event);
    saver();

    if (activeTool === '★') {
        drawStar(pos.x, pos.y, lineThickness);
        return;
    }

    paint = true;
    brush.beginPath();
    brush.moveTo(pos.x, pos.y);
    brush.lineWidth = lineThickness;
    brush.lineCap = 'round';
    brush.strokeStyle = activeTool === 'E' ? '#ffffff' : lineColor;

    brush.lineTo(pos.x, pos.y);
    brush.stroke();
});

window.addEventListener('mousemove', (event) => {
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

window.addEventListener('mouseup', stopdraw);
