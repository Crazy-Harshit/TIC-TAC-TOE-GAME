let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameOver = false;
let vsComputer = false;
let soundOn = true;

let xScore = 0, oScore = 0;

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");

const clickSound = new Audio("https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3");
const winSound   = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3");

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => {
    cell.onclick = () => {
        const i = cell.dataset.index;
        if (board[i] || gameOver) return;

        move(i, currentPlayer);
        if (vsComputer && !gameOver && currentPlayer === "O")
            setTimeout(bestMove, 300);
    };
});

function move(i, p) {
    board[i] = p;
    cells[i].innerText = p;
    if (soundOn) clickSound.play();

    const win = checkWin(p);
    if (win) {
        win.forEach(x => cells[x].classList.add("win"));
        statusText.innerText = `${p} Wins 🎉`;
        if (soundOn) winSound.play();
        updateScore(p);
        gameOver = true;
        return;
    }

    if (!board.includes("")) {
        statusText.innerText = "Draw 😐";
        gameOver = true;
        return;
    }

    currentPlayer = p === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer} Turn`;
}

function checkWin(p) {
    return winPatterns.find(w => w.every(i => board[i] === p));
}

function updateScore(p) {
    if (p === "X") xScoreText.innerText = ++xScore;
    else oScoreText.innerText = ++oScore;
}


function bestMove() {
    let best = -Infinity, moveIndex;
    board.forEach((v,i)=>{
        if (!v) {
            board[i]="O";
            let score=minimax(false);
            board[i]="";
            if (score>best){best=score;moveIndex=i;}
        }
    });
    move(moveIndex,"O");
}

function minimax(isMax) {
    let res = evaluate();
    if (res!==null) return res;

    let best = isMax ? -Infinity : Infinity;
    board.forEach((v,i)=>{
        if (!v){
            board[i]=isMax?"O":"X";
            let score=minimax(!isMax);
            board[i]="";
            best = isMax?Math.max(best,score):Math.min(best,score);
        }
    });
    return best;
}

function evaluate() {
    for (let w of winPatterns) {
        if (w.every(i=>board[i]==="O")) return 1;
        if (w.every(i=>board[i]==="X")) return -1;
    }
    return board.includes("")?null:0;
}


window.resetGame = () => {
    board=["","","","","","","","",""];
    gameOver=false;
    currentPlayer="X";
    statusText.innerText="Player X Turn";
    cells.forEach(c=>{c.innerText="";c.classList.remove("win");});
};

window.toggleMode = () => {
    vsComputer=!vsComputer;
    resetGame();
    alert(vsComputer?"Vs Computer ON 🤖":"2 Player Mode 👥");
};

window.resetScore = () => {
    xScore=oScore=0;
    xScoreText.innerText=oScoreText.innerText=0;
};

window.toggleTheme = () => {
    document.body.classList.toggle("dark");
};

window.toggleSound = () => {
    soundOn=!soundOn;
    alert(soundOn?"Sound ON 🔊":"Sound OFF 🔇");
};
