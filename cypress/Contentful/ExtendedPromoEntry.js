import { PromoEntry, TextField, LinkField, Asset } from 'crds-cypress-contentful';

export class ExtendedPromoEntry extends PromoEntry {
  constructor (entryObject) {
    super(entryObject);

    this._link_url = new TextField(this._fields.link_url);
    this._image_link = new LinkField(this._fields.image, Asset);
    this._description = new TextField(this._fields.description);
  }

  get linkURL() {
    return this._link_url;
  }

  get imageLink() {
    return this._image_link;
  }

  get description() {
    return this._description;
  }
}