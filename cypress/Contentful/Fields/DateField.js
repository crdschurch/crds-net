import { ContentfulField } from './ContentfulField';

export class DateField extends ContentfulField {
  constructor(dateString){
    super(dateString);

    if(this.hasContent){
      this._content_no_time_zone = this._content.split('T')[0];
    }

    this._date = this._content;
  }

  ignoreTimeZone(){
    if(this.hasContent){
      this._date = Cypress.moment(this._content_no_time_zone).format('MM.DD.YYYY');
    }
    return this; //Allow chaining
  }

  toString(format='MM.DD.YYYY'){
    return Cypress.moment(this.date).format(format);
  }

  compare(dateField){
    return dateField.date - this.date;
  }

  get date(){
    return new Date(this._date);
  }
}