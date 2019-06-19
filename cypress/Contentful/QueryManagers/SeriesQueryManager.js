import { ContentfulLibrary } from 'crds-cypress-tools';

export class SeriesQueryManager {
  fetchCurrentSeries() {
    const seriesList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&order=-fields.starts_at&limit=1`);
    return cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      return new ContentfulLibrary.entry.series(seriesList.responseBody.items[0]);
    });
  }

  //If there are multiple series with the same message, series with the oldest published_at date will be used in the message's url.
  fetchSeriesByMessageId(messageId) {
    const seriesList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&links_to_entry=${messageId}&order=-fields.published_at&limit=1`, false);
    return cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      const series = seriesList.responseBody.items[0];
      return new ContentfulLibrary.entry.series(series);
    });
  }

  /**
  * Warning! Published series are only displayed if their published_at date has passed
  */
  get _requiredQueryParameters() {
    const now = Cypress.moment(Date.now()).utc().format();
    return `content_type=series&fields.published_at[lte]=${now}`;
  }
}