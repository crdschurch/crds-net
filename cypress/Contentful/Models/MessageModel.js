import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';
import { ContentfulApi } from '../ContentfulApi';

export class MessageManager {
  constructor () {
    this._recent_message_list = [];
  }

  saveCurrentMessage() {
    this.saveRecentMessages(1);
  }

  saveRecentMessages(count) {
    this._recent_message_list = [];
    const sortedMessageList = ContentfulApi.getEntryCollection('content_type=message&select=sys.id,fields.published_at&order=-fields.published_at');
    cy.wrap({ messageList: sortedMessageList }).its('messageList.responseReady').should('be.true').then(() => {
      const responseList = sortedMessageList.responseBody.items;

      //Find first message with a past published_at date
      const now = Date.now();
      const pastMessageOffset = responseList.findIndex(s => now >= new Date(s.fields.published_at));
      expect(pastMessageOffset).to.be.above(-1);

      let i;
      for (i = 0; i < count; i++) {
        let entryIndex = i + pastMessageOffset;
        let messageEntry = ContentfulApi.getSingleEntry(responseList[entryIndex].sys.id);
        this._saveMessageToList(messageEntry, i);
      }
    });
  }

  get currentMessage() {
    return this._recent_message_list[0];
  }

  get recentMessageList() {
    return this._recent_message_list;
  }

  //0 = current ... n = oldest
  getRecentMessageByIndex(index) {
    return this._recent_message_list[index];
  }

  _saveMessageToList(response, saveIndex) {
    cy.wrap({ response }).its('response.responseReady').should('be.true').then(() => {
      this._recent_message_list[saveIndex] = new MessageModel(response.responseBody);
    });
  }
}

export class MessageModel {
  constructor (responseItem) {
    this._id = responseItem.sys.id;
    this._title = new TextField(responseItem.fields.title);
    this._title.required = true;

    this._slug = new TextField(responseItem.fields.slug);
    this._slug.required = true;

    this._published_at = new DateField(responseItem.fields.published_at);
    this._published_at.required = true;

    this._description = new TextField(responseItem.fields.description);
    this._image = new ImageField(responseItem.fields.image);
    this._background_image = new ImageField(responseItem.fields.background_image);
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get slug() {
    return this._slug;
  }

  //Series for this message must be stored first
  get absoluteUrl() {
    if (this.series === null) {
      return `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${this.slug.text}`;
    }
    else {
      return `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${this.series.slug.text}/${this.slug.text}`;
    }
  }

  get description() {
    return this._description;
  }

  get image() {
    return this._image;
  }

  get backgroundImage() {
    return this._background_image;
  }

  get publishedAt() {
    return this._published_at;
  }

  get series() {
    return this._series;
  }

  //Set to:
  //null if series is unpublished or does not exist in Contentful
  //SeriesModel object if series exists
  set series(seriesModel) {
    this._series = seriesModel;
  }
}