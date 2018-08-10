if(document.querySelector("livestream-reminder")){    
    $(document).ready(function () {
        var el = document.querySelector('livestream-reminder');

        el.addEventListener('success', function (event) {

        new CRDS.DataTracker().handleTrack('LiveStreamReminderRequested', {
            Source: 'Crossroads.net',
            UpcomingStream: event.detail.day + ' ' + event.detail.time,
            ReminderMethod: event.detail.type,
            Phone: event.detail.phone,
            Email: event.detail.email
        });
        });
    });
}