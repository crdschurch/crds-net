import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { ContentfulApi } from '../ContentfulApi';

export class LocationManager {
  saveLocationList() {
    this._location_list = [];
    const locationList = ContentfulApi.getEntryCollection('content_type=location&select=fields.name,fields.slug,fields.image,fields.address,fields.service_times,fields.map_url&include=3');
    cy.wrap({ locationList }).its('locationList.responseReady').should('be.true').then(() => {
      const responseList = locationList.responseBody.items;

      for (let i = 0; i < responseList.length; i++) {
        let loc = new LocationModel(responseList[i].fields);
        this._location_list.push(loc);
      }
    });
  }

  sortByNameAndSlug() {
    assert.isAbove(this._location_list.length, 0, 'Sanity check: Location list must be populated before being sorted');
    this._location_list.sort(function (a, b) {
      let diff = a.name.compare(b.name);
      return diff === 0 ? a.slug.compare(b.slug) : diff;
    });
  }

  get locationList() {
    return this._location_list;
  }
}

export class LocationModel {
  constructor (responseItem) {
    this._name = new TextField(responseItem.name);
    this._name.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._image = new ImageField(responseItem.image);
    this._image.required = true;

    this._address = new TextField(responseItem.address);
    this._service_times = new TextField(responseItem.service_times);
    this._map_url = new TextField(responseItem.map_url);
  }

  get name() {
    return this._name;
  }

  get slug() {
    return this._slug;
  }

  get image() {
    return this._image;
  }

  get address() {
    return this._address;
  }

  get serviceTimes() {
    return this._service_times;
  }

  get mapUrl() {
    return this._map_url;
  }
}