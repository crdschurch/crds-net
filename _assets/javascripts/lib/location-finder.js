/* jshint esversion: 6 */
/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.LocationFinder = class LocationFinder {
  getLocationDistances(origin) {
    let prefix = '';

    if ('int' === `${window.CRDS.env.environment}`) {
      prefix = 'https://api-int';
    } else if ('demo' === `${window.CRDS.env.environment}`) {
      prefix = 'https://api-demo';
    } else {
      prefix = 'https://api';
    }

    const locationDistancesURL = `${prefix}.crossroads.net/location/locations/proximities/`;

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
