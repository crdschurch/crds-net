import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';
import { ContentfulApiV2 } from '../ContentfulApi';

export class MessageManager {
  saveCurrentMessage() {
    this.saveRecentMessages(1);
    // const messageList = ContentfulApiV2.getEntryCollection('content_type=message&select=sys.id&order=-fields.published_at');
    // cy.wrap({ messageList }).its('messageList.responseReady').should('be.true').then(() => {
    //   const responseList = messageList.responseBody.items;
    //   const currentMessageId = responseList[0].sys.id;

    //   const messageFullEntry = ContentfulApiV2.getSingleEntry(currentMessageId);
    //   cy.wrap({ messageFullEntry }).its('messageFullEntry.responseReady').should('be.true').then(() => {
    //     this._current_message = new MessageModel(messageFullEntry.responseBody.fields);
    //   });
    // });
  }

  saveRecentMessages(count) {
    this._recent_message_list = [];
    const messageList = ContentfulApiV2.getEntryCollection('content_type=message&select=sys.id,fields.published_at&order=-fields.published_at');
    cy.wrap({ messageList }).its('messageList.responseReady').should('be.true').then(() => {
      const responseList = messageList.responseBody.items;

      //Find first message with a past published_at date
      const now = Date.now();
      const pastMessageOffset = responseList.findIndex(s => now >= new Date(s.fields.published_at));
      assert.isAbove(pastMessageOffset, -1, 'Message with published_at date in the past was found');

      let i;
      for (i = 0; i < count; i++) {
        let messageFullEntry = ContentfulApiV2.getSingleEntry(responseList[i+pastMessageOffset].sys.id);
        cy.wrap({ messageFullEntry }).its('messageFullEntry.responseReady').should('be.true').then(() => {
          this._recent_message_list[i] = new MessageModel(messageFullEntry.responseBody.fields);
        });
      }
    });
  }

  //0 = current ... n = oldest
  getRecentMessageByIndex(index){
    return this._recent_message_list === undefined ? undefined : this._recent_message_list[index];
    //return this._recent_message_list[index];
  }

  get currentMessage() {
    return this._recent_message_list === undefined ? undefined : this._recent_message_list[0];
  }
}

export class MessageList {
  storeListOfMessages(response, numToStore) {
    const itemList = response.items;
    const assetList = response.includes.Asset;
    numToStore = itemList.length < numToStore ? itemList.length : numToStore;
    this._message_list = [];

    for (let i = 0; i < numToStore; i++) {
      let msg = new MessageModel(itemList[i].fields, assetList);
      this._message_list.push(msg);
    }

    this._current_message = this._message_list[0]; //TODO this is dependent on the query - should it be trusted?
  }

  message(index) {
    return this._message_list[index];
  }

  get currentMessage() {
    return this._current_message;
  }
}

export class MessageModel {
  constructor (responseItem, assetList) {
    this._title = new TextField(responseItem.title);
    this._title.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._published_at = new DateField(responseItem.published_at);
    this._published_at.required = true;

    this._description = new TextField(responseItem.description);
    this._image = new ImageField(responseItem.image, assetList);
    this._background_image = new ImageField(responseItem.background_image);
  }

  get title() {
    return this._title;
  }

  get slug() {
    return this._slug;
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
}