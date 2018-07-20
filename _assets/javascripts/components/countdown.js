/* jshint esversion: 6 */
/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

Date.prototype.stdTimezoneOffset = function () {
  const jan = new Date(this.getFullYear(), 0, 1);
  const jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

CRDS.Countdown = class Countdown {
  constructor() {
    this.days = undefined;
    this.hours = undefined;
    this.minutes = undefined;
    this.seconds = undefined;
    this.intervalId = undefined;
    this.timeoutId = undefined;

    this.nextEvent = undefined;
    this.currentEvent = undefined;
    this.streamStatus = undefined;

    this.UPCOMING_DURATION = 15; // hours
    this.STREAM_OFFSET = 10; // minutes
    this.MS_PER_MINUTE = 60000; // milliseconds
    this.TIMEZONE_OFFSET = ((new Date()).dst()) ? '-0400' : '-0500';

    if ($('.crds-countdown').length) {
      this.getStreamspotStatus();
    }
  }

  static setLoadingStatus(loading) {
    if (loading) {
      $("[data-stream-status-loading='hide']").addClass('hide');
      $("[data-stream-status-loading='show']").removeClass('hide');
    } else {
      $("[data-stream-status-loading='show']").addClass('hide');
      $("[data-stream-status-loading='hide']").removeClass('hide');
    }
  }

  setStreamStatus(status) {
    if (status === 'live') {
      this.streamStatus = 'live';
      $("[data-stream-live='show']").removeClass('hide');
      $("[data-stream-live='hide']").addClass('hide');
      $("[data-stream-upcoming='show']").addClass('hide');
      $("[data-stream-upcoming='hide']").removeClass('hide');
      $("[data-stream-off='show']").addClass('hide');
      $("[data-stream-off='hide']").removeClass('hide');
    } else {
      $("[data-stream-live='show']").addClass('hide');
      $("[data-stream-live='hide']").removeClass('hide');
      if (status === 'upcoming') {
        this.streamStatus = 'upcoming';
        $("[data-stream-upcoming='show']").removeClass('hide');
        $("[data-stream-upcoming='hide']").addClass('hide');
        $("[data-stream-off='show']").addClass('hide');
        $("[data-stream-off='hide']").removeClass('hide');
      } else {
        this.streamStatus = 'off';
        $("[data-stream-off='show']").removeClass('hide');
        $("[data-stream-off='hide']").addClass('hide');
        $("[data-stream-upcoming='show']").addClass('hide');
        $("[data-stream-upcoming='hide']").removeClass('hide');

        this.appendNextStreamDate();
      }
    }
  }

  appendNextStreamDate() {
    const startDateTime = Countdown.convertDate(this.nextEvent.start, this.TIMEZONE_OFFSET);
    const offsetStartDateTime = this.addOffsetTime(startDateTime);
    const startDay = Countdown.getDayOfWeek(offsetStartDateTime);
    const startTime = Countdown.get12HourTime(offsetStartDateTime);
    const timeString = `${startDay} at ${startTime} ET`;
    $("[data-automation-id='offState']").append(
      $('<h4 class="font-size-base">').text('Next Live Stream')
    ).append(
      $('<h3>').text(timeString)
    );
  }

  addOffsetTime(time) {
    return new Date(time.getTime() + (this.STREAM_OFFSET * this.MS_PER_MINUTE));
  }

  static getDayOfWeek(date) {
    // date comes in as YYYY-mm-dd format
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  }

  static get12HourTime(date) {
    let hours = date.getHours();
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    let ampm = 'am';

    if (hours == 12) {
      ampm = 'pm';
    }
    if (hours > 12) {
      hours -= 12;
      ampm = 'pm';
    }

    return `${hours}:${minutes}${ampm}`;
  }

  getStreamspotStatus() {
    Countdown.setLoadingStatus(true);
    CRDS.Countdown.getEvents()
      .done((events) => {
        this.nextEvent = events.data.next;
        this.currentEvent = events.data.current;
        Countdown.setLoadingStatus(false);
        if (events.data.current != null) {
          this.goLive();
        } else {
          this.showCountdown();
        }
      })
      .fail((xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
      });
  }

  static getEvents() {
    const streamspotUrl = 'https://api.streamspot.com';
    const streamspotId = window.CRDS.streamspotId;
    const streamspotKey = window.CRDS.streamspotKey;

    const eventUrl = `${streamspotUrl}/broadcaster/${streamspotId}/broadcasts/upcomingPlusCurrent`;
    return $.ajax({
      url: eventUrl,
      dataType: 'json',
      crossDomain: true,
      beforeSend(request) {
        request.setRequestHeader('X-API-Key', streamspotKey);
      }
    });
  }

  static isStreamLive() {
    return new Promise((resolve, reject) => {
      CRDS.Countdown.getEvents().done((events) => {
        resolve(events.data.current != null);
      }).fail((xhr, ajaxOptions, thrownError) => {
        reject(xhr, ajaxOptions, thrownError);
      });
    });
  }

  goLive() {
    this.setStreamStatus('live');

    const currentEndDate = this.currentEvent.end;
    const secondsUntilStreamEnd = (Countdown.convertDate(currentEndDate, this.TIMEZONE_OFFSET) - (new Date())) / 1000;

    $('[data-streamspot-player]').each(function(idx) {
      let playerId = $(this).data('streamspot-player');
      let streamspotPlayerUrl = `https://player2.streamspot.com/?playerId=${playerId}`;
      $(this).attr('src', streamspotPlayerUrl);
    });

    this.timeoutId = setTimeout(() => {
      if (this.nextEvent == null) {
        this.getStreamspotStatus();
      } else {
        this.showCountdown();
      }
    }, 1000 * secondsUntilStreamEnd);
  }

  showCountdown() {
    $('.crds-countdown').show();

    const secondsUntilNextEvent = (Countdown.convertDate(this.nextEvent.start, this.TIMEZONE_OFFSET) - (new Date())) / 1000;
    if (secondsUntilNextEvent < this.UPCOMING_DURATION * 60 * 60) {
      this.setStreamStatus('upcoming');
    } else {
      this.setStreamStatus('off');
    }

    this.days = Math.floor(secondsUntilNextEvent / 86400);
    this.hours = Math.floor((secondsUntilNextEvent % 86400) / 3600);
    this.minutes = Math.floor((secondsUntilNextEvent % 3600) / 60);
    this.seconds = Math.floor(secondsUntilNextEvent % 60);
    this.setCountdownTime();

    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    if (--this.seconds < 0) {
      this.seconds = 59;
      if (--this.minutes < 0) {
        this.minutes = 59;
        if (--this.hours < 0) {
          this.hours = 23;
          if (--this.days < 0) {
            this.days = 0;
          }
        }
      }
    }
    this.setCountdownTime();
    const remainingSeconds = (this.seconds) + (this.minutes * 60) + (this.hours * 3600) + (this.days * 86400);
    if (remainingSeconds < this.UPCOMING_DURATION * 3600 && this.streamStatus !== 'upcoming') {
      this.setStreamStatus('upcoming');
    }
    if (this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 0) {
      this.currentEvent = this.nextEvent;
      this.nextEvent = null;
      this.goLive();
      clearInterval(this.intervalId);
    }
  }

  setCountdownTime() {
    $('.crds-countdown .days').html(Countdown.padZero(this.days));
    $('.crds-countdown .hours').html(Countdown.padZero(this.hours));
    $('.crds-countdown .minutes').html(Countdown.padZero(this.minutes));
    $('.crds-countdown .seconds').html(Countdown.padZero(this.seconds));
  }

  static convertDate(dateString, timeZone) {
    // Expected format of dateString: YYYY-MM-DD HH:MM:SS
    // Output of dateString.match is an array
    const date = dateString.match(/^(\d{4})-0?(\d+)-0?(\d+)[T ]0?(\d+):0?(\d+):0?(\d+)$/);
    // Here we assemble the array values to: M/D/YYYY HH:MM:SS TZ
    // We do this because this is the most commonly accepted format by our support
    // browsers
    const formattedDateString = `${date[2]}/${date[3]}/${date[1]} ${date[4]}:${date[5]}:${date[6]} ${timeZone}`;
    return new Date(formattedDateString);
  }

  // Convert Single Digit to Double Digit
  // check if value is < 10
  // if yes, then add a 0 onto the front
  // if no, then nothing
  static padZero(number) {
    if (number <= 10) {
      return (`0${number}`).slice(-2);
    }
    return number;
  }
};

new CRDS.Countdown();
