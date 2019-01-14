import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';

export class SeriesManager {
  storeCurrentSeries(response) {
    const itemList = response.items;
    const assetList = response.includes.Asset;//TODO trickle down and add ot other models

    //Get series most recently started
    const currentSeriesResponse = itemList.find(s => {
      return (Date.now() >= new Date(s.fields.published_at));
    });

    this._current_series = new SeriesModel(currentSeriesResponse.fields, assetList);
  }

  get currentSeries() {
    return this._current_series;
  }
}

export class SeriesModel {
  constructor (responseItem, assetList) {
    this._title = new TextField(responseItem.title);
    this._title.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._description = new TextField(responseItem.description);
    //this._description.required = true;

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