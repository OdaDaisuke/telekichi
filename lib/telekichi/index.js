export const timestampToCron = (unixTimestamp) => {
  const d = new Date(unixTimestamp)
  const minutes = d.getMinutes();
  const hours = d.getHours();
  const days = d.getDate();
  const months = d.getMonth() + 1;

  return `${minutes} ${hours} ${days} ${months} *`;
}

