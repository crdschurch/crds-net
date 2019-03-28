import { ContentfulLibrary } from 'crds-cypress-tools';
import { SeriesQueryManager } from './SeriesQueryManager';

export class MessageQueryManager {
  /**
   * Warning! Published series are only displayed if their published_at date has passed
   */
  fetchLatestMessage() {
    this._query_result = undefined;
    const messageList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&order=-fields.published_at&limit=1`);
    return cy.wrap({ messageList }).its('messageList.responseReady').should('be.true').then(() => {
      const latestMessage = messageList.responseBody.items[0];
      const sqm = new SeriesQueryManager();
      return sqm.fetchSeriesForMessage(latestMessage.sys.id).then(() => {
        const series = sqm.queryResult;
        this._query_result = new ContentfulLibrary.entry.message(latestMessage, series);
      });
    });
  }

  fetchRecentMessages(count) {
    this._query_result = [];
    const messageList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&order=-fields.published_at&limit=${count}`);
    return cy.wrap({ messageList }).its('messageList.responseReady').should('be.true').then(() => {
      const messages = messageList.responseBody.items;
      const sqm = new SeriesQueryManager();
      for (let i = 0; i < messages.length; i++) {
        sqm.fetchSeriesForMessage(messages[i].sys.id).then(() => {
          let series = sqm.queryResult;
          this._query_result.push(new ContentfulLibrary.entry.message(messages[i], series));
        });
      }
    });
  }
  get queryResult() {
    return this._query_result;
  }
  get _requiredQueryParameters() {
    const now = Cypress.moment(Date.now()).format();
    return `content_type=message&fields.published_at[lte]=${now}`;
  }
}