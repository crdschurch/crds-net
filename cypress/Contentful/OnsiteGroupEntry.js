import { Resource, TextField } from 'crds-cypress-contentful';


export class OnsiteGroupEntry extends Resource {
  constructor (entryObject) {
    super(entryObject);
    this._title = new TextField(this._fields.title);
    this._category = new TextField(this._fields.category)
  }
  get title() {
    return this._title;
  }

  get category() {
    return this._category;
  }

}