import { ContentfulField } from './ContentfulField';

export class ImageField extends ContentfulField {
  constructor (image) {
    const content = image === undefined ? undefined : image.sys.id;
    super(content);
  }

  get id() {
    return this.hasContent ? this._content : '';
  }
}