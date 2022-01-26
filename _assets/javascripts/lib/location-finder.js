/* jshint esversion: 6 */
/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LocationFinder = class LocationFinder {
  constructor() {
    this.gatewayAPIEndpoint = `${window.CRDS.env.gatewayServerEndpoint}`;
  }

  getLocationDistances(origin) {
    const locationDistancesURL = `${this.gatewayAPIEndpoint}location/locations/proximities`;
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
