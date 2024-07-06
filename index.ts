enum Cell {
    Dead,
    Alive,
};

interface Game {
    board: Cell[][];
    cellNeighNumber(x: number, y: number): number;
    cellNextState(x: number, y: number): Cell;
    nextGame(): Game
    iterateBoard(): Generator<{ cell: Cell, x: number, y: number }>;
};

class GameImpl implements Game {
    board: Cell[][];
    constructor(size: number) {
        this.board = Array.from({ length: size }, () => Array(size).fill(Cell.Dead))
    };
    cellNeighNumber(x: number, y: number): number {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        return directions
            .map(([dx, dy]) => [x + dx, y + dy])
            .filter(([nx, ny]) => nx >= 0 && nx < this.board.length && ny >= 0 && ny < this.board[0].length)
            .reduce((count, [nx, ny]) => count + (this.board[nx][ny] === Cell.Alive ? 1 : 0), 0);
    }
    cellNextState(x: number, y: number): Cell {
        const neighs = this.cellNeighNumber(x, y);
        let res: Cell;
        switch (this.board[x][y]) {
            case Cell.Dead:
                res = neighs === 3 ? Cell.Alive : Cell.Dead;
                break;
            case Cell.Alive:
                res = (neighs === 2) || (neighs === 3) ? Cell.Alive : Cell.Dead;
                break;
        }
        return res;
    }
    nextGame(): GameImpl {
        let res = new GameImpl(100)
        for (const { x, y } of this.iterateBoard()) {
            res.board[x][y] = this.cellNextState(x, y);
        }
        return res;
    }
    *iterateBoard(): Generator<{ cell: Cell, x: number, y: number }> {
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                yield { cell: this.board[x][y], x, y };
            }
        }
    }
}

let game1 = new GameImpl(100);

game1.board[2][1] = Cell.Alive;
game1.board[2][2] = Cell.Alive;
game1.board[2][3] = Cell.Alive;
game1.board[0][2] = Cell.Alive;
game1.board[1][3] = Cell.Alive;


const rootDOM = document.getElementById('root')
const ncButton = document.getElementById('newCycleButton')

const renderGame = () => {
    rootDOM.innerHTML = "";
    for (let x = 0; x < 100; x++) {
        for (let y = 0; y < 100; y++) {
            let square = document.createElement('div');
            square.id = `square${x}${y}`;
            square.style.width = "20px";
            square.style.height = "20px";
            square.style.display = "inline-block";
            square.style.textAlign = "center";
            square.style.verticalAlign = "top";
            square.style.border = "1px solid black";
            square.style.backgroundColor = game1.board[x][y] === Cell.Alive ? "black" : "white";
            rootDOM.appendChild(square);
        }
        rootDOM.appendChild(document.createElement('br'));
    }
}

const renderNextFrame = () => {
    for (let x = 0; x < 100; x++) {
        for (let y = 0; y < 100; y++) {
            const square = document.getElementById(`square${x}${y}`);
            square.style.backgroundColor = game1.board[x][y] === Cell.Alive ? "black" : "white";
        }
    }
}

ncButton.addEventListener('click', () => {
    renderNextFrame();
    game1 = game1.nextGame();
})

renderGame();