import { ContentfulLibrary } from 'crds-cypress-tools';

export class LocationQueryManager {
  fetchLocationsSortedByNameThenSlug() {
    this._query_result = [];
    const locationList = ContentfulLibrary.query.entryList('content_type=location&select=fields.name,fields.slug,fields.image,fields.address,fields.service_times,fields.map_url&order=fields.name,fields.slug&include=0');
    return cy.wrap({ locationList }).its('locationList.responseReady').should('be.true').then(() => {
      const responseList = locationList.responseBody.items;
      for (let i = 0; i < responseList.length; i++) {
        let loc = new ContentfulLibrary.entry.location(responseList[i]);
        this._query_result.push(loc);
      }
    });
  }
  get queryResult() {
    return this._query_result;
  }
}