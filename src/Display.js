export function displayMillisecondsInMinutesToCentiseconds(timeInMilliseconds) {
  const allCentiseconds = timeInMilliseconds / 10;
  const centiseconds = Math.floor(allCentiseconds % 100);
  const allSeconds = Math.floor(allCentiseconds / 100);
  const seconds = Math.floor(allSeconds % 60);
  const allMinutes = Math.floor(allSeconds / 60);
  if (allMinutes >= 60) {
    return "60:++:++";
  }
  // TODO deal with a player taking too long.
  return `${allMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`
}
