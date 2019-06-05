import { ContentfulLibrary } from 'crds-cypress-tools';

export class SeriesQueryManager {
  /**
  * Warning! Published series are only displayed if their published_at date has passed
  */
  fetchCurrentSeries() {
    const list = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&order=-fields.starts_at&limit=1`);
    return cy.wrap({ list }).its('list.responseReady').should('be.true').then(() => {
      return new ContentfulLibrary.entry.series(list.responseBody.items[0]);
    });
  }

  fetchSeriesByMessageId(messageId) {
    const seriesList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&links_to_entry=${messageId}&order=-fields.published_at&limit=1`, false);
    return cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      const series = seriesList.responseBody.items[0];
      return new ContentfulLibrary.entry.series(series);
    });
  }

  get _requiredQueryParameters() {
    const now = Cypress.moment(Date.now()).utc().format();
    return `content_type=series&fields.published_at[lte]=${now}`;
  }
}