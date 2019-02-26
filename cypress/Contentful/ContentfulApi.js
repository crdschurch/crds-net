//import { LocationList } from './Models/LocationModel';
import { MessageList } from './Models/MessageModel';
//import { SeriesManager } from './Models/SeriesModel';
import { PromoList } from './Models/PromoModel';
import { RedirectList } from './Models/RedirectModel';

/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
export class ContentfulApi {
  // retrieveLocationList() {
  //   const locationList = new LocationList();
  //   cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=location&select=fields.name,fields.slug,fields.image,fields.address,fields.service_times,fields.map_url&include=3`)
  //     .then((response) => {
  //       const jsonResponse = JSON.parse(response.body);
  //       locationList.storeListOfLocations(jsonResponse);
  //     });
  //   return locationList;
  // }

  // retrieveSeriesManager() {
  //   const seriesManager = new SeriesManager();
  //   cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=series&select=fields.title,fields.slug,fields.published_at,fields.starts_at,fields.ends_at,fields.youtube_url,fields.image,fields.background_image,fields.description,fields.videos&order=-fields.starts_at&include=3`)
  //     .then((response) => {
  //       const jsonResponse = JSON.parse(response.body);
  //       seriesManager.storeCurrentSeries(jsonResponse);
  //     });

  //   return seriesManager;
  // }

  retrieveMessageList(numToStore) {
    const messageList = new MessageList();
    cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at&include=3`)
      .then((response) => {
        const jsonResponse = JSON.parse(response.body);
        messageList.storeListOfMessages(jsonResponse, numToStore);
      });
    return messageList;
  }

  retrievePromoList() {
    const promoList = new PromoList();
    cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=promo&select=fields.title,fields.link_url,fields.image,fields.description,fields.target_audience,fields.published_at&include=3`)
      .then((response) => {
        const jsonResponse = JSON.parse(response.body);
        promoList.storePromosByAudience(jsonResponse);
      });
    return promoList;
  }

  static retrieveRedirectList() {
    const redirectList = new RedirectList();
    cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=redirect&&select=fields.from,fields.to&limit=1000`)
      .then((response) => {
        const jsonResponse = JSON.parse(response.body);
        redirectList.storeRedirectItems(jsonResponse);
      });
    return redirectList;
  }
}


class ResponseWrapper {
  constructor () {
    this._response_ready = false;
  }

  get responseReady() {
    return this._response_ready;
  }

  set responseBody(response) {
    this._response_body = response;
    this._response_ready = true;
  }

  get responseBody() {
    return this._response_body;
  }
}

export class ContentfulApiV2 {
  static getEntryCollection(query) {
    const responseWrapper = new ResponseWrapper();
    cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&${query}`)
      .then((response) => {
        const jsonResponse = JSON.parse(response.body);
        responseWrapper.responseBody = jsonResponse;
      });
    return responseWrapper;
  }

  static getSingleEntry(id) {
    const responseWrapper = new ResponseWrapper();
    cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries/${id}?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}`)
      .then((response) => {
        const jsonResponse = JSON.parse(response.body);
        responseWrapper.responseBody = jsonResponse;
      });
    return responseWrapper;
  }

  static getSingleAsset(id) {
    const responseWrapper = new ResponseWrapper();
    cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/assets/${id}?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}`)
      .then((response) => {
        const jsonResponse = JSON.parse(response.body);
        responseWrapper.responseBody = jsonResponse;
      });
    return responseWrapper;
  }
}