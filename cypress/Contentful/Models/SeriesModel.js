import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';
import { ContentfulApi } from '../ContentfulApi';
import { get } from 'http';
import { AssertionError } from 'assert';

export class SeriesManager {
  saveCurrentSeries() {
    const seriesList = ContentfulApi.getEntryCollection('content_type=series&select=sys.id,fields.published_at&order=-fields.starts_at');
    cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      const responseList = seriesList.responseBody.items;

      const now = Date.now();
      const currentSeries = responseList.find(s => {
        return (now >= new Date(s.fields.published_at));
      });
      const seriesEntryId = currentSeries.sys.id;

      const seriesFullEntry = ContentfulApi.getSingleEntry(seriesEntryId);
      cy.wrap({ seriesFullEntry }).its('seriesFullEntry.responseReady').should('be.true').then(() => {
        this._current_series = new SeriesModelV2(seriesFullEntry.responseBody.fields);
      });
    });
  }

  saveCurrentMessageSeries(messageId) {
    const seriesList = ContentfulApi.getEntryCollection('content_type=series&select=sys.id,fields.published_at,fields.videos&order=-fields.starts_at');
    cy.wrap({ seriesList }).its('seriesList.responseReady').should('be.true').then(() => {
      const responseList = seriesList.responseBody.items;

      const seriesWithMessage = responseList.find(s => {
        let videoList = s.fields.videos;
        if(videoList !== undefined)
          return videoList.find(v => v.sys.id === messageId) !== undefined;
        return false;
      });
      //TODO assert seriesWithMessage is not empty

      const seriesFullEntry = ContentfulApi.getSingleEntry(seriesWithMessage.sys.id);
      cy.wrap({ seriesFullEntry }).its('seriesFullEntry.responseReady').should('be.true').then(() => {
        this._current_message_series = new SeriesModelV2(seriesFullEntry.responseBody.fields);
      });
    });
  }

  get currentSeries() {
    return this._current_series;
  }

  get currentMessageSeries() {
    return this._current_message_series;
  }
}

export class SeriesModelV2 {
  constructor (responseItem) {
    this._title = new TextField(responseItem.title);
    this._title.required = true;

    this._slug = new TextField(responseItem.slug);
    this._slug.required = true;

    this._description = new TextField(responseItem.description);

    this._published_at = new DateField(responseItem.published_at);
    this._published_at.required = true;

    this._image = new ImageField(responseItem.image);
    this._background_image = new ImageField(responseItem.background_image);
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