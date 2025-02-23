import { useEffect, useState } from "react";
import { UI_UPDATE_PERIOD_MS } from "./Constants";
import { displayMillisecondsInMinutesToCentiseconds } from "./Display";

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

  const timeAsString = displayMillisecondsInMinutesToCentiseconds(millisecondsSinceStart ?? 0);

  return (
    <div className="timer">
      {timeAsString}
    </div>
  );
}
