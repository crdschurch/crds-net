import { ContentfulField } from './ContentfulField';

export class DateField extends ContentfulField {
    constructor(dateString){
        super(dateString);
    }

    //do the thing
    get dateIgnoreTimeZone(){
        if(this._date_no_zone === undefined){
            if(this.hasContent) {
                const dateOnly = this._content.split("T")[0];
                const dateFormat = Cypress.moment(dateOnly).format('MM.DD.YYYY');
                this._date_no_zone = new Date(dateFormat);
            }
        }

        return this._date_no_zone;
    }
}