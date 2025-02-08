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
  // const winner = isDone(squares);

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
    {
      Array.from({length: WIDTH}).map((_, row_index) => {
        return (
          <div key={row_index + 100} className="board-row">
            {Array.from({length: WIDTH}).map((_, col_index) => {
              return <Square key={row_index * WIDTH + col_index}
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
  const [currentSquares, setCurrentSquares] = useState(generateStartingSquares);

  function handlePlay(nextSquares) {
    setCurrentSquares(nextSquares);
  }

  const status = 'TODO';
  return (
    <>
      <div className="status">{status}</div>
      <div className="game">
        <div className="game-board">
          <Board squares={currentSquares} onPlay={handlePlay} />
        </div>
      </div>
    </>
  );
}

function isDone(squares) {
  if (squares[squares.length - 1] !== null) {
    return false;
  }
  for (let i = 0; i < squares.length - 2; i++) {
    if (squares[i] !== i + 1) {
      return false;
    }
  }
  return true;
}

function generateStartingSquares() {
  const squares = Array
    .from({length: WIDTH * WIDTH})
    .map((_, i) => i + 1);
  squares[squares.length - 1] = null;

  function getRandomUpToMaxExclusive(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let swaps = 0;
  const lastPossibleIndexToSwap = squares.length - 1;
  for (let i = 0; i < squares.length; i++) {
    const swapIndex = getRandomUpToMaxExclusive(i, lastPossibleIndexToSwap);
    if (i !== swapIndex) {
      swap(squares, i, swapIndex);
      swaps++;
    }
  }
  /*
  If you've made an even number of swaps you then have to move the 16 to a even position
    (i.e. 2 away or a multiple of 2 away)
  Otherwise you have to move it to an odd position
  */
  const currentlySolvable = swaps % 2 === 0;
  if (!currentlySolvable) {
    swap(squares, 0, 1);
  }
  // TODO Make it so that the last one could be in any position

  if (isDone(squares)) {
    return generateStartingSquares();
  }
  return squares;
}

function swap(squares, i, j) {
  const temp = squares[i];
  squares[i] = squares[j];
  squares[j] = temp;
  return squares;
}
