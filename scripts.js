// Elementos HTML
const board = document.getElementById('tablero');
const scoreBoard = document.getElementById('puntuacion');
const startButton = document.getElementById('comenzar');
const gameOverSign = document.getElementById('juegoTerminado');

// Configs del Juego
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

// Variables del Juego
let snake;
let score;
let direction;
let directionQueue = []
let boardSquares;
let emptySquares;
let moveInterval;

// Funciones del Juego
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);
    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
};

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);

        });
    })
    const juegoTerminadoDiv = document.createElement('div');
    juegoTerminadoDiv.id = 'juegoTerminado';
    juegoTerminadoDiv.innerText = 'Choclaste:(';
    tablero.appendChild(juegoTerminadoDiv);
};

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = (snake.length-4);
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    directionQueue = [];
    createBoard();
};

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const setDirection = newDirection => {
    directionQueue.push(newDirection);
};

const processQueue = () => {
    if (directionQueue.length > 0) {
        direction = directionQueue.shift();
    }
};

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            if (direction !== 'ArrowDown') {
                setDirection(key.code);
            }
            break;
        case 'ArrowDown':
            if (direction !== 'ArrowUp') {
                setDirection(key.code);
            }
            break;
        case 'ArrowRight':
            if (direction !== 'ArrowLeft') {
                setDirection(key.code);
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'ArrowRight') {
                setDirection(key.code);
            }
            break;
    }
};

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, '0');
    const [row, column] = newSquare.split('');

    // Verificar que la nueva posición esté dentro de los límites del tablero
    if (newSquare < 0 || newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
};

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

const gameOver = () => {
    const juegoTerminadoDiv = document.getElementById('juegoTerminado');
    juegoTerminadoDiv.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

startButton.addEventListener('click', startGame);
setInterval(processQueue, 100);