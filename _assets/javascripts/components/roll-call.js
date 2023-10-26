(function() {
  var crdsRollCall = function(idx, el) {
    var els = {
      container: $(el),
      decreaseTotal: $(el)
        .find('[data-role="decreaseTotal"]')
        .first(),
      increaseTotal: $(el)
        .find('[data-role="increaseTotal"]')
        .first(),
      form: $(el)
        .find('[data-role="form"]')
        .first(),
      total: $(el)
        .find('[data-role="total"]')
        .first(),
      submit: $(el)
        .find('[data-role="submit"]')
        .first(),
      labelNoun: $(el)
        .find('[data-role="labelNoun"]')
        .first(),
      labelVerb: $(el)
        .find('[data-role="labelVerb"]')
        .first(),
      helpText: $(el)
        .find('[data-role="helpText"]')
        .first(),
      errorText: $(el)
        .find('[data-role="errorText"]')
        .first(),
      successText: $(el)
        .find('[data-role="successText"]')
        .first(),
    };

    var hasBeenSubmitted = false;
    var hasError = false;
    var total = 0;

    var decreaseTotal = function() {
      if (hasBeenSubmitted) return;
      if (total > 0) total--;
      updateLabels();
      return;
    };

    var increaseTotal = function() {
      if (hasBeenSubmitted) return;
      total++;
      updateLabels();
      return;
    };

    var updateLabels = function() {
      if (hasBeenSubmitted) return;
      els.total.text(total);
      if (total == 1) {
        els.labelNoun.text("person");
        els.labelVerb.text("is");
      } else {
        els.labelNoun.text("people");
        els.labelVerb.text("are");
      }
      validateForm();
    };

    var validateForm = function() {
      if (hasBeenSubmitted) return;
      hasError = false;
      if (total <= 0) hasError = true;

      if (hasError) {
        els.helpText.addClass("hidden");
        els.errorText.removeClass("hidden");
      } else {
        els.helpText.removeClass("hidden");
        els.errorText.addClass("hidden");
      }
    };

    var submitData = function() {
      if (hasBeenSubmitted) return false;

      validateForm();

      if (hasError) return false;

      var url = CRDS.rollCall.formUrl;
      var data = {};
      data[CRDS.rollCall.totalFieldId] = total;
      data[CRDS.rollCall.urlFieldId] = window.location.href;

      $.post(url, data, function() {
        return;
      });

      hasBeenSubmitted = true;

      els.form.addClass("hidden");
      els.successText.removeClass("hidden");
    };

    els.submit.on("click", submitData);
    els.decreaseTotal.on("click", decreaseTotal);
    els.increaseTotal.on("click", increaseTotal);

    els.errorText.addClass("hidden");
    els.successText.addClass("hidden");
  };

  $(document).ready(function() {
    $("[data-roll-call]").each(crdsRollCall);
  });
})();
