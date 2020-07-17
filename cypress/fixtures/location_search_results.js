export function oakleyLocationResponse() {
  return {
    'origin': '45209',
    'location': {
      'locationId': 3,
      'location': 'Oakley',
      'imageUrl': null,
      'address': {
        'addressId': null,
        'addressLine1': '3500 Madison Road',
        'addressLine2': null,
        'city': 'Cincinnati',
        'state': 'OH',
        'zip': '45209',
        'foreignCountry': null,
        'county': null,
        'longitude': -84.4233392,
        'latitude': 39.1594075
      }
    },
    'distance': 0
  };
}

export function florenceLocationResponse() {
  return {
    'origin': '45209',
    'location': {
      'locationId': 8,
      'location': 'Uptown',
      'imageUrl': null,
      'address': {
        'addressId': null,
        'addressLine1': '42 Calhoun Street',
        'addressLine2': null,
        'city': 'Cincinnati',
        'state': 'OH',
        'zip': '45219',
        'foreignCountry': null,
        'county': null,
        'longitude': -84.5125924,
        'latitude': 39.1284211
      }
    },
    'distance': 1
  };
}

export function searchErrorResponse() {
  return {
    'message': 'LocationController: GET locations proximities -- ',
    'errors': [
      'Exception of type \'crds_angular.Exceptions.InvalidAddressException\' was thrown.'
    ]
  };
}
