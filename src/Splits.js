import { useState } from "react";
import { WIDTH } from "./Constants";
import Timer from './Timer';

export default function Splits({ startTime, squares }) {
  const complete = numComplete(squares);
  const [splits, setSplits] = useState(Array(WIDTH * WIDTH - 1).fill(null));
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
          return <tr key={index}>
            <td>{index + 1}</td>
            <td id="unit-time">{0}</td>
            <td id="unit-time">{splits[index]}</td>
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
