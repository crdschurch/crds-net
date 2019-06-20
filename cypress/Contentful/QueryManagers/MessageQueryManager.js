import { ContentfulLibrary } from 'crds-cypress-tools';
import { SeriesQueryManager } from './SeriesQueryManager';
import { ExtendedMessageEntry } from '../Entries/ExtendedMessageEntry';

export class MessageQueryManager {
  /**
   * Warning! Published series are only displayed if their published_at date has passed
   */
  fetchLatestMessage() {
    return this._genericFetchSingleMessage(`${this._requiredQueryParameters}&order=-fields.published_at&limit=1`, ExtendedMessageEntry);
  }

  fetchRecentMessages(count) {
    const messageList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&order=-fields.published_at&limit=${count}`);
    return cy.wrap({ messageList }).its('messageList.responseReady').should('be.true').then(() => {
      const messages = messageList.responseBody.items;
      const mEntries = [];
      const sqm = new SeriesQueryManager();
      for (let i = 0; i < messages.length; i++) {
        sqm.fetchSeriesByMessageId(messages[i].sys.id).then((results) => {
          mEntries.push(new ContentfulLibrary.entry.message(messages[i], results));
        });
      }
      return cy.wrap(mEntries);
    });
  }

  get _requiredQueryParameters() {
    const now = Cypress.moment(Date.now()).utc().format();
    return `content_type=message&fields.published_at[lte]=${now}`;
  }

  _genericFetchSingleMessage(entryListQuery, messageClass = ContentfulLibrary.entry.message) {
    const list = ContentfulLibrary.query.entryList(entryListQuery);
    return cy.wrap({ list }).its('list.responseReady').should('be.true').then(() => {
      const firstEntry = list.responseBody.items[0];
      const sqm = new SeriesQueryManager();
      return sqm.fetchSeriesByMessageId(firstEntry.sys.id).then(series => {
        return new messageClass(firstEntry, series);
      });
    });
  }
}