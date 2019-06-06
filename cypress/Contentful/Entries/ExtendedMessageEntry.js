import { ContentfulLibrary } from 'crds-cypress-tools';

export class ExtendedMessageEntry extends ContentfulLibrary.entry.message {
  constructor (entryObject, seriesEntry) {
    super(entryObject, seriesEntry);
    this._youtube_url = new ContentfulLibrary.resourceField.plainTextField(this._fields.source_url, false);
    this._bitmovin_url = new ContentfulLibrary.resourceField.plainTextField(this._fields.bitmovin_url, false);
    this._published_at = new ContentfulLibrary.resourceField.dateField(this._fields.published_at, true);
  }

  get publishedAt() {
    return this._published_at;
  }

  get youtubeURL(){
    return this._youtube_url;
  }

  get bitmovinURL(){
    return this._bitmovin_url;
  }
}