import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';

export class SeriesManager {
  // storeCurrentSeries2(response) {
  //   const itemList = response.items;
  //   const assetList = response.includes.Asset;//TODO trickle down and add to other models

  //   const currentSeries = itemList.find(s => {
  //     return (Date.now() >= new Date(s.fields.published_at));
  //   });

  //   this._current_series = new SeriesModel(currentSeries.fields, assetList);
  // }

  // //This is the series for the current message (messages are in the videos property)
  // storeRecentSeriesWithMessage(response) {
  //   const itemList = response.items;
  //   const assetList = response.includes.Asset;//TODO trickle down and add to other models

  //   const publishedSeries = itemList.find(s => {
  //     let isPublished = (Date.now() >= new Date(s.fields.published_at));
  //     let hasVideoMessage = s.fields.videos === undefined ? false : true;
  //     return isPublished && hasVideoMessage;
  //   });

  //   this._current_series = new SeriesModel(publishedSeries.fields, assetList);
  // }

  //Stores the current series and the most recent series with a message
  storeCurrentSeries(response) {
    const itemList = response.items;
    const assetList = response.includes.Asset;//TODO trickle down and add to other models

    const currentSeries = itemList.find(s => {
      return (Date.now() >= new Date(s.fields.published_at));
    });

    const messageSeries = itemList.find(s => {
      let isPublished = (Date.now() >= new Date(s.fields.published_at));
      let hasVideoMessage = s.fields.videos === undefined ? false : true;
      return isPublished && hasVideoMessage;
    });

    this._current_series = new SeriesModel(currentSeries.fields, assetList);
    this._current_message_series = new SeriesModel(messageSeries.fields, assetList);
  }

  get currentSeries() {
    return this._current_series;
  }

  get currentMessageSeries(){
    return this._current_message_series;
  }
}

export class SeriesModel {
  constructor (responseItem, assetList) {
    this._title = new TextField(responseItem.title);
    this._title.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._description = new TextField(responseItem.description);

    this._published_at = new DateField(responseItem.published_at);
    this._published_at.required = true;

    this._image = new ImageField(responseItem.image, assetList);
    this._background_image = new ImageField(responseItem.background_image, assetList);
    this._starts_at = new DateField(responseItem.starts_at);
    this._ends_at = new DateField(responseItem.ends_at);
    this._youtube_url = new TextField(responseItem.youtube_url);
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

  get startDate() {
    return this._starts_at;
  }

  get endDate() {
    return this._ends_at;
  }

  get publishedAt() {
    return this._published_at;
  }

  get youtubeURL() {
    return this._youtube_url;
  }
}