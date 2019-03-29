import { ContentfulLibrary } from 'crds-cypress-tools';

export class SeriesQueryManager {
  /**
  * Warning! Published series are only displayed if their published_at date has passed
  */
  fetchCurrentSeries() {
    this._query_result = undefined;
    const seriesList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&order=-fields.starts_at&limit=1`);
    return cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      this._query_result = new ContentfulLibrary.entry.series(seriesList.responseBody.items[0]);
    });
  }

  //If there are multiple series with the same message, series with the oldest published_at date will be used in the message's url.
  fetchSeriesForMessage(messageId) {
    this._query_result = undefined;
    const seriesList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&links_to_entry=${messageId}&order=-fields.published_at&limit=1`, false);
    return cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      const series = seriesList.responseBody.items[0];
      if (series !== undefined)
        this._query_result = new ContentfulLibrary.entry.series(series);
    });
  }
  get queryResult() {
    return this._query_result;
  }

  get _requiredQueryParameters() {
    const now = Cypress.moment(Date.now()).format();
    return `content_type=series&fields.published_at[lte]=${now}`;
  }
}