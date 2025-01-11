export function redBorderMarker(elem) {
  elem.classList.add("animated-border");
  elem.classList.add("red-border");
  setTimeout(() => {
    elem.classList.remove("red-border");
  }, 3000);
}

export function formatMMMDDYYYY(dateString) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatReadableDate(dateString) {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[date.getUTCMonth()]; // getUTCMonth() returns 0-indexed month
  const day = date.getUTCDate(); // getUTCDate() returns the day of the month
  const year = date.getUTCFullYear(); // getUTCFullYear() returns the year
  return `${monthName} ${day}, ${year}`;
}

export function numberToCurrencyString(num) {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
