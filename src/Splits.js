import { useState, useEffect } from "react";
import { WIDTH } from "./Constants";
import Timer from './Timer';

export default function Splits({ startTime, squares }) {
  // first slot is start time
  const [splits, setSplits] = useState(Array(WIDTH * WIDTH).fill(null));
  const [prevSplitIndex, setPrevSplitIndex] = useState(0);
  const [prevStartTime, setPrevStartTime] = useState(null);

  useEffect(() => {
    const currentSplitIndex = numComplete(squares);
    const stopping = startTime === null && prevStartTime !== null;
    const stopped = startTime === null && prevStartTime === null;
    if (stopped || currentSplitIndex === prevSplitIndex) {
      return;
    }
    setSplits((prevSplits) => {
      let newSplits = prevSplits.slice();
      if (currentSplitIndex > prevSplitIndex) {
        // made progress
        const splitTime = startTime === prevStartTime ? Date.now() : startTime;
        for (let i = prevSplitIndex + 1; i <= currentSplitIndex; i++) {
          newSplits[i] = splitTime;
        }
      } else if (currentSplitIndex < prevSplitIndex) {
        // removed progress
        for (let i = prevSplitIndex; i > currentSplitIndex; i--) {
          newSplits[i] = null;
        }
      }
      if (!stopping) {
        newSplits[0] = startTime;
      }
      setPrevSplitIndex(currentSplitIndex);
      setPrevStartTime(startTime);
      return newSplits;
    })
  }, [squares, startTime]);

  return <div className="splits">
    <Timer startTime={startTime}/>
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
          const timeAsString = splits[index] === null ? "" : (splits[index] - splits[index - 1]);
          return <tr key={index}>
            <td>{index}</td>
            <td id="unit-time">{0}</td>
            <td id="unit-time">{timeAsString}</td>
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
