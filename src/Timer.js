import { useEffect, useState } from "react";
import { UI_UPDATE_PERIOD_MS } from "./Constants";

export default function Timer( {startTime} ) {
  const [millisecondsSinceStart, setmillisecondsSinceStart] = useState(null);
  const isRunning = startTime !== null;
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(
        () => setmillisecondsSinceStart(Date.now() - startTime),
        UI_UPDATE_PERIOD_MS);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, millisecondsSinceStart]);

  const minutes = Math.floor((millisecondsSinceStart % 3.6e6) / 6e4);
  const seconds = Math.floor((millisecondsSinceStart % 6e4) / 1000);
  const centiseconds = Math.floor(millisecondsSinceStart % 100);

  const timeAsString =
    millisecondsSinceStart !== null ?
      (`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`)
    :
      "00:00.00";

  return (
    <div className="timer">
      {timeAsString}
    </div>
  );
}
