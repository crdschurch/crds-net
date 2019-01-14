import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';

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