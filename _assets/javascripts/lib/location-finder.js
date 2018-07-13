/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LocationFinder = class LocationFinder {
  constructor() {
    this.gatewayAPIEndpoint = 'https://gatewayint.crossroads.net/gateway/api/v1.0.0';
  }

  getLocationDistances(origin) {
    const locationDistancesURL = `${this.gatewayAPIEndpoint}/locations/proximities`;
    return $.ajax({
      url: locationDistancesURL,
      dataType: 'json',
      crossDomain: true,
      data: {
        origin
      }
    });
  }
};
