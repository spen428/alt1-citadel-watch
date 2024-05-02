export function isTimeString(str: string): boolean {
  return /\d{2}:\d{2}:\d{2}/.test(str);
}

export function timeStringToUnixTimestampSeconds(timeString: string) {
  const date = new Date();
  const timeParts = timeString.split(":").map((x) => parseInt(x));
  date.setHours(timeParts[0], timeParts[1], timeParts[2]);
  return Math.floor(date.valueOf() / 1000);
}
