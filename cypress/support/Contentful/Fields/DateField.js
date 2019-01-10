import { ContentfulField } from './ContentfulField';

export class DateField extends ContentfulField {
    constructor(dateString){
        super(dateString);
    }

    compareNoTimeZone(dateField){
        return dateField.dateIgnoreTimeZone - this.dateIgnoreTimeZone;
    }

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

    get formattedDateNoTimeZone(){
        return Cypress.moment(this.dateIgnoreTimeZone).format('MM.DD.YYYY');
    }
}