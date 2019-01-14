import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';

export class LocationList {
  storeListOfLocations(response) {
    const itemList = response.items;
    const assetList = response.includes.Asset;
    this._location_list = [];

    for (let i = 0; i < itemList.length; i++) {
      let loc = new LocationModel(itemList[i].fields, assetList);
      this._location_list.push(loc);
    }
  }

  getLocationBySlug(slug) {
    return this._location_list.find(l => l.slug.text == slug);
  }

  get getSomeLocation() {
    return this._location_list[0];
  }

  get sortedByNameAndSlug() {
    return this._location_list.sort(function (a, b) {
      let diff = a.name.compare(b.name);
      return diff === 0 ? a.slug.compare(b.slug) : diff;
    });
  }

  get locationCount() {
    return this._location_list != undefined ? this._location_list.length : 0;
  }
}

export class LocationModel {
  constructor (responseItem, assetList) {
    this._name = new TextField(responseItem.name);
    this._name.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._image = new ImageField(responseItem.image, assetList);
    this._image.required = true;
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
}