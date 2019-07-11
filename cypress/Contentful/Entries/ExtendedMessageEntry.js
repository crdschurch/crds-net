import { ContentfulLibrary } from 'crds-cypress-tools';

export class ExtendedMessageEntry extends ContentfulLibrary.entry.message {
  constructor (entryObject, seriesEntry) {
    super(entryObject, seriesEntry);
    this._transcription = new ContentfulLibrary.resourceField.contentfulField(this._fields.transcription);
  }

  get autoplayURL() {
    const queryParam = this.bitmovinURL.hasValue ? '?autoPlay=true&sound=11' : '';
    return {
      relative: `${this.URL.relative}${queryParam}`,
      absolute: `${this.URL.absolute}${queryParam}`
    };
  }

  get hasSubtitles() {
    return this._transcription.hasValue;
  }
}