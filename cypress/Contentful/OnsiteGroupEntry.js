import { Resource, TextField } from 'crds-cypress-contentful';


export class OnsiteGroupEntry extends Resource {
  constructor (entryObject) {
    super(entryObject);

    this._title = new TextField(this._fields.title)
    this._slug = new TextField(this._fields.slug, true);
    this._description = new TextField(this._fields.description);
    this._detail = new TextField(this._fields.detail);

    this._meetings = new TextField(this._fields.meetings);
 
  //  this._image_link = new LinkField(this._fields.image, Asset);
  
  this._category = new TextField(this._fields.category);
    
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

  get detail() {
    return this._detail;
  }

  get meetings() {
   return this._meetings;
  }
  
  get category() {
    return this._category;
  }

 
}