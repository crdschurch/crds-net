import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { ContentfulApiV2 } from '../ContentfulApi';

export class LocationManager {
  //need list of locations sorted by name and slug
  saveLocationList() {
    this._location_list = [];
    const locationList = ContentfulApiV2.getEntryCollection('content_type=location&select=fields.name,fields.slug,fields.image,fields.address,fields.service_times,fields.map_url&include=3');
    cy.wrap({ locationList }).its('locationList.responseReady').should('be.true').then(() => {
      const responseList = locationList.responseBody.items;

      for (let i = 0; i < responseList.length; i++) {
        let loc = new LocationModel(responseList[i].fields);
        this._location_list.push(loc);
      }
    });
  }

  // saveLocationBySlug(slug){
  //   //get entries with slug and id
  //   //find id
  //   //get entry
  //   const locationList = ContentfulApiV2.getEntryCollection('content_type=location&select=sys.id,fields.slug'); //TODO was ordered by starts_at
  //   cy.wrap({ locationList }).its('locationList.responseReady').should('be.true').then(() => {
  //     const responseList = locationList.responseBody.items;

  //     const location = responseList.find(l => l.fields.slug == slug);
  //     assert.isDefined(location, `Location with slug ${slug} should be found`);
  //     const locationEntryId = location.sys.id;

  //     const locationFullEntry = ContentfulApiV2.getSingleEntry(locationEntryId);
  //     cy.wrap({seriesFullEntry: locationFullEntry}).its('seriesFullEntry.responseReady').should('be.true').then(() =>{
  //       this[slug] = new LocationModel(locationFullEntry.responseBody.fields);
  //     });
  //   });
  // }

  sortByNameAndSlug() {
    assert.isAbove(this._location_list.length, 0, 'Sanity check: Location list must be populated before being sorted');
    this._location_list.sort(function (a, b) {
      let diff = a.name.compare(b.name);
      return diff === 0 ? a.slug.compare(b.slug) : diff;
    });
  }

  get locationList(){
    return this._location_list;
  }


  // get locationCount() {
  //   return this._location_list != undefined ? this._location_list.length : 0;
  // }
}


// export class LocationList {
//   storeListOfLocations(response) {
//     const itemList = response.items;
//     const assetList = response.includes.Asset;
//     this._location_list = [];

//     for (let i = 0; i < itemList.length; i++) {
//       let loc = new LocationModel(itemList[i].fields, assetList);
//       this._location_list.push(loc);
//     }
//   }

//   getLocationBySlug(slug) {
//     return this._location_list.find(l => l.slug.text == slug);
//   }

//   get getSomeLocation() {
//     return this._location_list[0];
//   }

//   get sortedByNameAndSlug() {
//     return this._location_list.sort(function (a, b) {
//       let diff = a.name.compare(b.name);
//       return diff === 0 ? a.slug.compare(b.slug) : diff;
//     });
//   }

//   get locationCount() {
//     return this._location_list != undefined ? this._location_list.length : 0;
//   }
// }

export class LocationModel {
  constructor (responseItem, assetList) {
    this._name = new TextField(responseItem.name);
    this._name.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._image = new ImageField(responseItem.image, assetList);
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