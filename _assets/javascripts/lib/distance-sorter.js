/* eslist no-plusplus: 0 */
/* global CRDS */
/* jshint esversion: 6 */

window.CRDS = window.CRDS || {};

CRDS.DistanceSorter = class DistanceSorter {
  constructor() {
    this.locationDistances = [];
    this.searchForm = undefined;
    this.searchInput = undefined;
    this.formSubmitButton = undefined;
    this.geoSubmit = undefined;
    this.cards = undefined;
    this.locationFinder = undefined;
    this.init();
  }

  init() {
    this.searchForm = document.getElementById('locations-address-input');
    this.searchInput = document.getElementById('search-input');
    this.formSubmit = document.getElementById('input-search');
    this.geoSubmit = document.getElementById('geo-search');
    this.geoSubmit.disabled = false;
    this.formSubmit.disabled = false;
    this.geoSubmit.addEventListener('click', this.handleGeoSubmit.bind(this));
    this.searchForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    this.locationsCarousel = DistanceSorter.getLocationsCarousel();
    this.cards = this.locationsCarousel.cards;
    this.locationFinder = new CRDS.LocationFinder();
    this.getGeoPermissions();
  }

  static getLocationsCarousel() {
    return Object.values(CRDS._instances).find(
      (instance) => DistanceSorter._isSectionLocationsCarousel(instance)
    );
  }

  static _isSectionLocationsCarousel(instance) {
    return instance.carousel !== undefined && instance.carousel !== null && instance.carousel.id === 'section-locations';
  }

  getGeoPermissions() {
    if(navigator.permissions){
      this.isGeoAllowed().then(permission => {
        if(permission === true) this.showGeoButton();
        else if(permission !== false) permission.onchange = this.getGeoPermissions();
      });
    } else { // if navigator.persmissions is not supported
      navigator.geolocation.getCurrentPosition(position => {
          this.showGeoButton();
      });
    }
  }

  isGeoAllowed() {
    return navigator.permissions.query({name: 'geolocation'})
      .then(permission => {
        if(permission.state === 'granted') return true;
        else if(permission.state === 'prompt') return permission;
        return false;
      })
  }

  showGeoButton() {
    this.geoSubmit.style.display = 'block';
  }

  handleFormSubmit(event) {
    this._disableForm();
    this.getDistance()
      .done((locationDistances) => { this._updateDomWithSortedCards(locationDistances); })
      .fail((xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
        this.showError();
        this.formSubmit.disabled = false;
        this.removeLabels();
      });
  }

  handleGeoSubmit(event) {
    this._disableGeoButton();
    navigator.geolocation.getCurrentPosition(position => {
      this.getDistance(position)
        .done((locationDistances) => { this._updateDomWithSortedCards(locationDistances); })
        .fail((xhr, ajaxOptions, thrownError) => {
          console.log(thrownError);
          this.showError();
          this.geoSubmit.disabled = false;
          this.removeLabels();
        });
    });
  }

  _disableForm() {
    event.preventDefault();
    this.formSubmit.disabled = true;
  }

  _disableGeoButton() {
    event.preventDefault();
    this.geoSubmit.disabled = true;
  }

  getDistance(data) {
    this.locationDistances = [];
    return this.locationFinder.getLocationDistances(data ? `${data.coords.latitude}, ${data.coords.longitude}` : this.searchInput.value);
  }

  _updateDomWithSortedCards(locationDistances) {
    this._updateLocationDistancesArray(locationDistances);
    this._displaySortedLocationsCarousel();
    this._resetFormOnSuccess();
  }

  _updateLocationDistancesArray(locationDistances) {
    locationDistances.forEach(
      locationObject => this._addToLocationDistancesArray(locationObject)
    );
  }

  _addToLocationDistancesArray(locationObject) {
    const locationDistance = this._createLocationDistanceObject(locationObject);
    this.locationDistances.push(locationDistance);
  }

  _createLocationDistanceObject(locationObject) {
    return {
      location: locationObject.location.location,
      distance: locationObject.distance
    };
  }

  _displaySortedLocationsCarousel() {
    this.createDataAttributes();
    this.appendDistances();
    this.locationsCarousel.sortBy('distance');
    this.anywhereCheck();
  }

  createDataAttributes() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const location = this.cards[i].getElementsByClassName('card-title')[0].children[0].textContent;
      this.cards[i].dataset.location = location;
    }
  }

  appendDistances() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const locationMatch = this.locationDistances.find(obj => obj.location === this.cards[i].dataset.location);
      if (locationMatch !== undefined) {
        this.cards[i].dataset.distance = locationMatch.distance;
        const span = document.createElement('span');
        span.classList.add('distance', 'label', 'soft-half', 'push-half');
        span.textContent = `${locationMatch.distance} miles`;
        const oldSpan = this.cards[i].getElementsByClassName('distance');
        if (oldSpan.length === 0) {
          this.cards[i].insertBefore(span, this.cards[i].children[0]);
        } else {
          this.cards[i].replaceChild(span, oldSpan[0]);
        }
      }
    }
  }

  anywhereCheck() {
    const cardsArray = Array.from(this.cards);
    const anywhere = cardsArray.find(card => card.dataset.location === 'Anywhere');

    if (this.locationDistances[0].distance > 30) {
      anywhere.parentNode.insertBefore(anywhere, anywhere.parentNode.firstElementChild);
    } else {
      anywhere.parentNode.appendChild(anywhere);
    }
    this.locationsCarousel.reload();
  }

  _resetFormOnSuccess() {
    this.clearError();
    this.geoSubmit.disabled = false;
    this.formSubmit.disabled = false;
  }

  showError() {
    const errorText = 'We couldn\'t find what you were looking for. Try searching again.';
    const errorElement = document.createElement('div');
    const parent = this.locationsCarousel.carousel.parentElement;
    this.searchInput.classList.add('error');
    errorElement.classList.add('error-text', 'alert', 'alert-danger');
    errorElement.textContent = errorText;
    const oldError = parent.getElementsByClassName('error-text');
    if (oldError.length === 0) {
      parent.insertBefore(errorElement, this.locationsCarousel.carousel);
    } else {
      parent.replaceChild(errorElement, oldError[0]);
    }
  }

  clearError() {
    const errors = this.locationsCarousel.carousel.parentNode.getElementsByClassName('error-text');
    if (errors !== null && errors.length > 0) {
      errors[0].parentElement.removeChild(errors[0]);
      this.searchInput.classList.remove('error');
    }
  }

  removeLabels() {
    const distanceLabels = this.locationsCarousel.carousel.getElementsByClassName('distance', 'label');
    while (distanceLabels[0]) {
      distanceLabels[0].parentNode.removeChild(distanceLabels[0]);
    }
  }
};
