import { useState } from 'react';
import InputListener from './InputListener';
import { WIDTH } from './Constants';
import Splits from './Splits';
import { useCookies } from "react-cookie";

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

function getAdjacentEmpty(squares, i) {
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

function getSwapPairsInDirection(emptyIndex, directionToSwapIn) {
  const colOffset = [1, 0, -1, 0][directionToSwapIn];
  const rowOffset = [0, -1, 0, 1][directionToSwapIn];
  const otherSwapIndex = emptyIndex + rowOffset * WIDTH + colOffset;
  if ((colOffset === -1 && emptyIndex % WIDTH === 0)
    || (colOffset === 1 && emptyIndex % WIDTH === WIDTH - 1)
    || (rowOffset === -1 && otherSwapIndex < 0)
    || (rowOffset === 1 && otherSwapIndex >= WIDTH * WIDTH)) {
    return null;
  }
  if (rowOffset !== 0 && (otherSwapIndex < 0 || otherSwapIndex >= WIDTH * WIDTH)) {
    return null;
  }
  return [emptyIndex, otherSwapIndex];
}

export function Board({ squares, onPlay }) {
  function handleClick(i) {
    const adjacentEmpty = getAdjacentEmpty(squares, i);
    if (adjacentEmpty === null) {
      return;
    }
    onPlay([i, adjacentEmpty]);
  }

  return <>
    {
      Array.from({length: WIDTH}).map((_, row_index) => {
        return (
          <div key={row_index} className="board-row">
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

export function GameAwareInputListener({ squares, onPlay }) {
  function onDirectionPressed(direction) {
    const emptyIndex = squares.indexOf(null);
    const swapPair = getSwapPairsInDirection(emptyIndex, direction);
    onPlay(swapPair);
  }
  return <InputListener onDirectionPressed={onDirectionPressed} dependencies={[squares]} />;
}

export default function Game() {
  const [currentSquares, setCurrentSquares] = useState(generateStartingSquares);
  const [moves, setMoves] = useState(0);
  // The following would benefit from a class structure
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const isRunning = startTime !== null && stopTime === null;
  const [cookies, setCookie] = useCookies(['bestSplits']);

  function recordNewSplits(newSplits) {
    const time = newSplits[newSplits.length - 1] - newSplits[0];
    if (typeof cookies.bestSplits === 'undefined') {
      setCookie('bestSplits', newSplits);
      return;
    }
    const bestTime = cookies.bestSplits[cookies.bestSplits.length - 1] - cookies.bestSplits[0];
    if (time < bestTime) {
      setCookie('bestSplits', newSplits);
    }
  }

  function start() {
    setStartTime(Date.now());
    setStopTime(null);
  }

  function stop() {
    setStopTime(Date.now());
  }

  function reset() {
    setStopTime(null);
    setStartTime(null);
    setCurrentSquares(generateStartingSquares());
    setMoves(0);
  }

  function handlePlay(swapPair) {
    if (swapPair === null || isDone(currentSquares)) {
      return;
    }

    // Copilot recommended I use a function to update the currentSquares state here. I could not find a functional difference.
    setCurrentSquares((prevSquares) => {
      const nextSquares = prevSquares.slice();
      swap(nextSquares, swapPair[0], swapPair[1]);
      if (isDone(nextSquares)) {
        stop();
      }
      return nextSquares;
    });
    setMoves((prevMoves) => {
      if (prevMoves === 0) {
        start();
      }
      return prevMoves + 1;
    });
  }

  const done = isDone(currentSquares);
  let status = "Click a square near the empty one to move it, or use the arrow keys.";
  if (moves > 0) {
    status = 'Moves: ' + moves;
    if (done) {
      status = 'You won in ' + moves + ' moves!';
    }
  }

  return (
    <>
      <div className="game">
        <GameAwareInputListener squares={currentSquares} onPlay={handlePlay} />
          <div className="game-board">
            <Board squares={currentSquares} onPlay={handlePlay} />
          </div>
        <div className="status">{status}</div>
        <button className="reset" onClick={reset}>Reset</button>
        <Splits
          startTime={startTime}
          stopTime={stopTime}
          isRunning={isRunning}
          squares={currentSquares}
          bestSplits={cookies.bestSplits}
          recordNewSplits={recordNewSplits}
        />
      </div>
    </>
  );
}

function isDone(squares) {
  if (squares[squares.length - 1] !== null) {
    return false;
  }
  const lastNonEmptyIndex = squares.length - 2;
  for (let i = 0; i <= lastNonEmptyIndex; i++) {
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
  if (i < 0 || i >= squares.length || j < 0 || j >= squares.length) {
    console.error('Invalid swap indicies', i, j);
    return squares;
  }
  const temp = squares[i];
  squares[i] = squares[j];
  squares[j] = temp;
  return squares;
}
