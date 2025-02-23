import { useEffect, useState } from "react";
import { UI_UPDATE_PERIOD_MS } from "./Constants";

export default function Timer( {startTime, stopTime, isRunning} ) {
  const [millisecondsSinceStart, setmillisecondsSinceStart] = useState(null);
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(
        () => {
          if (stopTime === null) {
            setmillisecondsSinceStart(Date.now() - startTime);
          }
        },
        UI_UPDATE_PERIOD_MS);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    setmillisecondsSinceStart(stopTime - startTime);
  }, [stopTime]);

  const minutes = Math.floor((millisecondsSinceStart % 3.6e6) / 6e4);
  const seconds = Math.floor((millisecondsSinceStart % 6e4) / 1000);
  const centiseconds = Math.floor(millisecondsSinceStart / 10);

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
