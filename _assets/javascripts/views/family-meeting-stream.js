document.addEventListener("deferred-js-ready", familyMeetingStreamInit);

// if app-deferred loads first
if (window.deferredJSReady) {
  familyMeetingStreamInit();
}

function familyMeetingStreamInit() {
  var passwordModule = {
    password: "familytime",
    errorCount: 0,
    container: $(".container").first(),
    inputWrapper: $(".inputWrapper"),
    inputBox: $(".passwordInput"),
    submitButton: $(".passwordSubmit"),
    errorBox: $(".passwordError"),
    videoDiv: '<div class="embed-responsive embed-responsive-16by9"><iframe width="640" height="360" src="https://player2.streamspot.com/?playerId=f4c6e1c5" frameborder="0" allowfullscreen>',
    lockedOutDiv: "<h1>You have been locked out!" +
      "<p>Please try again later",
    init: function () {
      var self = this;
      //if they have been locked out, dont let them try again
      //idk for sure if this will work IRL, but it should
      if (this.getCookie("LockedOut") === "true") {
        this.container.html("").append(this.lockedOutDiv);
      }
      //submit click watcher
      this.submitButton.click(function () {
        self.passwordValidator(self.inputBox.val());
      });
      //input enter watcher
      this.inputBox.keypress(function (e) {
        if (e.which == 13) {
          self.passwordValidator(self.inputBox.val());
        }
      });
    },
    //password validator funciton
    passwordValidator: function (sentPassword) {
      if (sentPassword === this.password) {
        this.inputWrapper.hide();
        this.container.append(this.videoDiv);
      } else {
        this.errorHandler(sentPassword);
      }
    },
    //error handler function
    errorHandler: function (sentPassword) {
      this.inputBox.val("");
      this.errorCount++;
      if (this.errorCount >= 5) {
        this.container.html("").append(this.lockedOutDiv);
        this.setCookie("lockedOut", "true");
        console.log(document.cookie);
        return;
      }
      if (sentPassword === "undefined" || sentPassword === "") {
        this.errorBox.text("Please enter a password").show();
      } else {
        this.errorBox.text("Incorrect password").show();
      }
    },
    //setCookie, str8 from w3schools (ew, i know)
    setCookie: function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    //getCookie, str8 from w3schools (ew, i know)
    getCookie: function (cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  };

  $(function() {
    passwordModule.init();
  })
}
