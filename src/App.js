import { useState } from 'react';

const WIDTH = 4;

function Square({ value, onSquareClick }) {

  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export function Board({ squares, onPlay }) {
  const winner = isDone(squares);
  let status;

  function handleClick(i) {
    function getAdjacentEmpty(i) {
      const row = Math.floor(i / WIDTH);
      const col = i % WIDTH;
      if (row > 0 && squares[i - WIDTH] === null) {
        return i - WIDTH;
      }
      if (row < WIDTH - 1 && squares[i + WIDTH] === null) {
        return i + WIDTH;
      }
      if (col > 0 && squares[i - 1] === null) {
        return i - 1;
      }
      if (col < WIDTH - 1 && squares[i + 1] === null) {
        return i + 1;
      }
      return null;
    }

    const adjacentEmpty = getAdjacentEmpty(i);
    if (adjacentEmpty === null) {
      return;
    }

    const nextSquares = squares.slice();
    swap(nextSquares, i, adjacentEmpty);
    onPlay(nextSquares);
  }

  return <>
    <div className="status">{status}</div>
    {
      Array.from({length: WIDTH}).map((_, row_index) => {
        return (
          <div className="board-row">
            {Array.from({length: WIDTH}).map((_, col_index) => {
              return <Square
                value={squares[row_index * WIDTH + col_index]}
                onSquareClick={() => handleClick(row_index * WIDTH + col_index)}
              />
            })}
          </div>
        )
      })
    }
  </>;
}

export default function Game() {

  const [currentSquares, setCurrentSquares] = useState(
    generateStartingSquares()
  );

  function handlePlay(nextSquares) {
    setCurrentSquares(nextSquares);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} />
      </div>
    </div>
  );
}

function isDone(squares) {
  return null;
}

function generateStartingSquares() {
  let squares = Array
    .from({length: WIDTH * WIDTH})
    .map((_, i) => i + 1);
  squares[squares.length - 1] = null;

  function getRandomUpToMaxExclusive(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < squares.length - 1; i++) {
    const swapIndex = getRandomUpToMaxExclusive(i, squares.length);
    swap(squares, i, swapIndex);
  }

  return squares;
}

function swap(squares, i, j) {
  const temp = squares[i];
  squares[i] = squares[j];
  squares[j] = temp;
  return squares;
}
