const isDST = (d) => {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) != d.getTimezoneOffset();
};

const getEstTime = () => {
  let today = new Date();
  let offset = isDST(today) ? -4.0 : -5.0;
  let utc = today.getTime() + (today.getTimezoneOffset() * 60000);
  let et = new Date(utc + (3600000 * offset));
  let hour = et.getHours().toString();
  let min = (et.getMinutes() <10 ? '0' : '') + et.getMinutes().toString();

  let time = ''.concat(hour, min);
  return parseInt(time);
};

const isDayOfTheWeek = (day) => {
  if (new Date().getDay() == day) {
    return true;
  }
};

const isSundayServiceTime = () => {
  let isSunday = isDayOfTheWeek(0);
  let sundayServiceTimes = (
    (getEstTime() >= 825 && getEstTime() <= 940) || 
    (getEstTime() >= 955 && getEstTime() <= 1110) ||
    (getEstTime() >= 1140 && getEstTime() <= 1255)
  );
  
  return isSunday && sundayServiceTimes;
};

const refreshPageForSundayServiceStart = (hours, minutes, seconds) => {
  let isSunday = isDayOfTheWeek(0);

  if (!isSunday || !document.getElementById('location-page')) {
    return;
  }

  const startDate = new Date();
  startDate.setSeconds(seconds);
  startDate.setMinutes(minutes);
  startDate.setHours(hours);
  const timeout = startDate.getTime() - new Date().getTime() + 1000;

  if (timeout <= 0) {
    return;
  }

  setTimeout(() => {
    window.location.reload(true);
  }, timeout);
};

if (!isSundayServiceTime() && document.getElementById('resi-player')) {
  document.getElementById('resi-player').remove();
}

if (isDayOfTheWeek(0)) {
  refreshPageForSundayServiceStart(8,25,1);
  refreshPageForSundayServiceStart(9,55,1);
  refreshPageForSundayServiceStart(11,40,1);
}