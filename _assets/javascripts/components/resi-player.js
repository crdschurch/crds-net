const isDST = (d) => {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) != d.getTimezoneOffset();
};

let today = new Date();
let offset = isDST(today) ? -4.0 : -5.0;
let utc = today.getTime() + (today.getTimezoneOffset() * 60000);
let et = new Date(utc + (3600000 * offset));
let hour = et.getHours().toString();
let min = (et.getMinutes() <10 ? '0' : '') + et.getMinutes().toString();

let time = '';
time = parseInt(time.concat(hour, min));

let isThursday = et.getDay() == 4;
// // let isSunday = et.getDay() == 0;

let serviceTimes = ((time >= 1130 && time <= 1150) || (time >= 1152 && time <= 1623));

const isServiceTime = () => {
  if (isThursday && serviceTimes) {
    return true;
  }
};

if (!isServiceTime()) {
  document.getElementById('resi-player').remove();
}