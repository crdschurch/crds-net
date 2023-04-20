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

const isHorseWeek = () => {
  // Sat, 4/22 between 3pm - 6:30pm
  let inRangeSat = getEstTime() >= 1455 && getEstTime() <= 1830;
  // Sun, 4/23 between 9am - 5pm
  let inRangeSun = getEstTime() >= 855 && getEstTime() <= 1700;

  if ((isDayOfTheWeek(6) && inRangeSat) || (isDayOfTheWeek(0) && inRangeSun)) {
    return true;
  }

  return false;
};

const isHorseWeekLive = isHorseWeek();

const isNotCtaRenderTime = () => {
  return isHorseWeekLive;
};

const isServiceTime = () => {
  return isHorseWeekLive;
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

if (isHorseWeekLive) {
  // Refresh at times
  if (isDayOfTheWeek(6)) {
    // Sat, 4/22 @ 2:55pm
    refreshPageForServiceStart(14, 55, 1);
    // Sat, 4/22 @ 4:55pm
    refreshPageForServiceStart(16, 55, 1);
  } else if (isDayOfTheWeek(0)) {
    // Sun, 4/23 @ 8:55am
    refreshPageForServiceStart(8, 55, 1);
    // Sun, 4/23 @ 10:55am
    refreshPageForServiceStart(10, 55, 1);
  }
}
