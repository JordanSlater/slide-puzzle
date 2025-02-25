import { useState, useEffect } from "react";
import { WIDTH } from "./Constants";
import Timer from './Timer';
import { displayMillisecondsInMinutesToCentiseconds } from "./Display";

export default function Splits({ startTime, stopTime, isRunning, squares }) {
  // first slot is start time such that the difference to the previous is always calculable
  const [splits, setSplits] = useState(Array(WIDTH * WIDTH).fill(null));
  const [prevSplitIndex, setPrevSplitIndex] = useState(0);
  const [prevIsRunning, setPrevIsRunning] = useState(false);

  useEffect(() => {
    const currentSplitIndex = numComplete(squares);
    const starting = isRunning && !prevIsRunning;
    const stopping = !isRunning && prevIsRunning;
    const shouldUpdateSplits = (isRunning && currentSplitIndex !== prevSplitIndex) || starting || stopping;
    if (!shouldUpdateSplits) {
      return;
    }
    setSplits((prevSplits) => {
      let newSplits = prevSplits.slice();
      if (currentSplitIndex > prevSplitIndex) {
        // made progress
        let splitTime = getSplitTime();
        for (let i = prevSplitIndex + 1; i <= currentSplitIndex; i++) {
          newSplits[i] = splitTime;
        }
      } else if (currentSplitIndex < prevSplitIndex) {
        // removed progress
        for (let i = prevSplitIndex; i > currentSplitIndex; i--) {
          newSplits[i] = null;
        }
      }
      if (starting) {
        newSplits[0] = startTime;
      }
      setPrevSplitIndex(currentSplitIndex);
      setPrevIsRunning(isRunning);
      return newSplits;

      function getSplitTime() {
        if (starting) {
          return startTime;
        }
        if (stopping) {
          return stopTime;
        }
        return Date.now();
      }
    })
  }, [squares, startTime, stopTime, isRunning]);

  return <div className="splits">
    <Timer startTime={startTime} stopTime={stopTime} isRunning={isRunning} />
    <table>
      <thead>
        <tr>
          <th>Tile</th>
          <th>Diff</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {splits.map((_, index) => {
          if (index === 0) {
            return null;
          }
          let timeDiffAsString = null;
          if (splits[index] !== null) {
            const timeDiffInMilliseconds = (splits[index] - splits[index - 1]);
            timeDiffAsString = displayMillisecondsInMinutesToCentiseconds(timeDiffInMilliseconds);
          }

          return <tr key={index}>
            <td>{index}</td>
            <td id="unit-time">{0}</td>
            <td id="unit-time">{timeDiffAsString}</td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

// TODO consider combining with isDone function
function numComplete(squares) {
  let numComplete = 0;
  const lastNonEmptyIndex = squares.length - 2;
  for (let i = 0; i <= lastNonEmptyIndex; i++) {
    if (squares[i] === i + 1) {
      numComplete++;
    }
  }
  return numComplete;
}
