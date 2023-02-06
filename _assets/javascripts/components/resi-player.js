const isDST = (d) => {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) != d.getTimezoneOffset();
};

const getEstTime = () => {
  let today = new Date();
  let offset = isDST(today) ? -4.0 : -5.0;
  let utc = today.getTime() + today.getTimezoneOffset() * 60000;
  let et = new Date(utc + 3600000 * offset);
  let hour = et.getHours().toString();
  let min = (et.getMinutes() < 10 ? '0' : '') + et.getMinutes().toString();

  let time = ''.concat(hour, min);
  return parseInt(time);
};

const isDayOfTheWeek = (day) => {
  if (new Date().getDay() == day) {
    return true;
  }
};

const isSaturdayServiceTime = () => {
  return isDayOfTheWeek(6) && (getEstTime() >= 1455 && getEstTime() <= 1900);
};

const isNotCtaRenderTime = () => {
  return isSaturdayServiceTime();
};

const isServiceTime = () => {
  return isSaturdayServiceTime();
};

const refreshPageForServiceStart = (hours, minutes, seconds) => {
  if (!document.getElementById('has-resi-player')) {
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

  return setTimeout(() => {
    window.location.reload(true);
  }, timeout);
};

if (isNotCtaRenderTime() && document.getElementById('ondemand-cta')) {
  document.getElementById('ondemand-cta').remove();
}

if (!isServiceTime() && document.getElementById('resi-player')) {
  document.getElementById('resi-player').remove();
}

if (isDayOfTheWeek(6)) {
  refreshPageForServiceStart(14,55,1);
  refreshPageForServiceStart(19,0,1);
} 
