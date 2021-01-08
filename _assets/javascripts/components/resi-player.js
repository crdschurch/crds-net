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
  
  let time = '';
  time = parseInt(time.concat(hour, min));

  return time;
};

const dayOfTheWeek = () => {
  return new Date().getDay();
};

const isServiceTime = () => {
  let isSunday = dayOfTheWeek() == 0;
  let serviceTimes = ((getEstTime() >= 855 && getEstTime() <= 1010) || (getEstTime() >= 1055 && getEstTime() <= 1210));

  if (isSunday && serviceTimes) {
    return true;
  }
};

const refreshPageForServiceStart = (hours, minutes, seconds) => {
  let isSunday = dayOfTheWeek() == 0;

  if (!isSunday || !document.getElementById('resi-player')) {
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

if (!isServiceTime() && document.getElementById('resi-player')) {
  document.getElementById('resi-player').remove();
}

refreshPageForServiceStart(8,55,1);
refreshPageForServiceStart(10,55,1);
