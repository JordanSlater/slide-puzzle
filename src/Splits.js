import { useEffect, useState } from "react";
import { WIDTH } from "./Constants";

export default function Splits({ squares }) {
  const complete = numComplete(squares);
  const [splits, setSplits] = useState(Array(WIDTH * WIDTH - 1).fill(null));
  return <table className="splits">
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
          <td>{splits[index]}</td>
          <td>{splits[index]}</td>
        </tr>
      })}
    </tbody>
  </table>
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
