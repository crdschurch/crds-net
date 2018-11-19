import { LocationModel } from './Models/LocationModel';
import { MessageModel } from './Models/MessageModel';
import { SeriesModel } from './Models/SeriesModel';

/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
export class ContentfulApi {
    retrieveLocations() {
        const locationList = [];
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=location&select=fields.name,fields.slug`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                LocationModel.createListOfLocations(jsonResponse, locationList);
            })
        return locationList;
    }

    retrieveCurrentSeries() {
        let currentSeries = new SeriesModel();
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=series&select=fields.title,fields.slug,fields.published_at,fields.starts_at,fields.ends_at,fields.youtube_url,fields.image,fields.description&order=-fields.starts_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                currentSeries.storeCurrentSeries(jsonResponse);
            });
        return currentSeries;
    }

    //Note: The order messages are retrieved here and what's displayed on the site are not guaranteed to be the same if the "published at" date is the same (time is ignored)
    retrieveLatestMessage() {
        let messageModel = new MessageModel();
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                messageModel.storeLatestMessage(jsonResponse);
            })
        return messageModel;
    }

    retrieveListOfMessages(numToStore) {
        const messageList = [];
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                MessageModel.createListOfMessages(jsonResponse, numToStore, messageList);
            })
        return messageList;
    }
}
