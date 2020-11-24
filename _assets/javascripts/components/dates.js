$(document).ready(function () {
  $("time[is='time-ago']").each(function () {
    var date = $(this).attr('datetime');
    var timePassed = moment(date, moment.ISO_8601).fromNow();
    $(this).append(timePassed);
  })
});