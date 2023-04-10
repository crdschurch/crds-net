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

const isEasterLive = () => {
  let easterIsLive = false;

  // Fri 4/7 starting at 7:00pm
  if (isDayOfTheWeek(5)) {
    easterIsLive = getEstTime() >= 1900;
  }
  // Sat 4/8 all day, except between 2:00pm and 3:15pm
  if (isDayOfTheWeek(6)) {
    easterIsLive =
      (getEstTime() >= 0 && getEstTime() < 1400) || (getEstTime() >= 1515 && getEstTime() <= 2359);
  }
  // Sun 4/9 until 11:59pm
  if (isDayOfTheWeek(0)) {
    easterIsLive = getEstTime() <= 2359;
  }

  return easterIsLive;
};

let easterIsLive = isEasterLive();

const isNotCtaRenderTime = () => {
  return easterIsLive;
};

const isServiceTime = () => {
  return easterIsLive;
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

if (easterIsLive) {
  // Refresh Friday at 7:01:01pm
  if (isDayOfTheWeek(5)) {
    refreshPageForServiceStart(19, 1, 1);
  }

  // Refresh Saturday 2:01:01pm and again at 3:15:01pm
  if (isDayOfTheWeek(6)) {
    refreshPageForServiceStart(14, 1, 1);
    refreshPageForServiceStart(15, 15, 1);
  }

  // Refresh Sunday at 11:59:59pm
  if (isDayOfTheWeek(0)) {
    refreshPageForServiceStart(23, 59, 59);
  }
}
