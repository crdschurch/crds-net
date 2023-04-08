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
  let live = false;

  let inRangeFri = getEstTime() >= 1900 && getEstTime() <= 2020;
  let inRangeSat = getEstTime() >= 1500 && getEstTime() <= 1830;
  let inRangeSun = getEstTime() >= 830 && getEstTime() <= 1400;

  // Fri 4/7
  // 7:00pm - 8:20pm
  if (isDayOfTheWeek(5) && inRangeFri) {
    live = true;
  }

  // Sat 4/8
  // 3:00pm - 6:30pm
  if (isDayOfTheWeek(6) && inRangeSat) {
    live = true;
  }

  // Sun 4/9
  // 8:30am - 2:00pm
  if (isDayOfTheWeek(0) && inRangeSun) {
    live = true;
  }

  return live;
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
  // Refresh Friday at 7:01:01pm (start) and again at 8:20:01pm (end)
  if (isDayOfTheWeek(5)) {
    refreshPageForServiceStart(19, 1, 1);
    refreshPageForServiceStart(20, 20, 1);
  }

  // Refresh Saturday 3:01:01pm (start) and again at 6:30:01pm (end)
  if (isDayOfTheWeek(6)) {
    refreshPageForServiceStart(14, 1, 1);
    refreshPageForServiceStart(18, 30, 1);
  }

  // Refresh Sunday at 8:30:01am (start) and 2:01:01pm (end)
  if (isDayOfTheWeek(0)) {
    refreshPageForServiceStart(8, 30, 1);
    refreshPageForServiceStart(14, 1, 1);
  }
}
