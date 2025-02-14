import { useEffect, useState } from "react";


export default function Timer( {startTime} ) {
  const [millisecondsSinceStart, setmillisecondsSinceStart] = useState(Date.now);
  const isRunning = startTime !== null;
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      const RepeatPeriodInMilliseconds = 1;
      intervalId = setInterval(
        () => setmillisecondsSinceStart(Date.now() - startTime),
        RepeatPeriodInMilliseconds);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, millisecondsSinceStart]);
  const id = "timer";

  const hours   = Math.floor(millisecondsSinceStart / 3.6e6);
  const minutes = Math.floor((millisecondsSinceStart % 3.6e6) / 6e4);
  const seconds = Math.floor((millisecondsSinceStart % 6e4) / 1000);
  const milliseconds = Math.floor(millisecondsSinceStart % 1000);

  const timeAsString = isRunning ?
      ((hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "") +
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`
      )
    :
      "00:00.000";

  return (
    <div id={id}>
      {timeAsString}
    </div>
  );
}
