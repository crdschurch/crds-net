const moment = require('moment');
//place to keep all the date/time convertiong and formatting to minimize impact on tests and modules

export class DateFormatter {
    //format is moment - should be predefined?
    static format(date, format){
        return date !== undefined ? moment(date).format(format) : undefined;
    }

    static formatIgnoringTimeZone(isoDate, format){
        const dateOnly = this._stripTimeZone(isoDate);
        return this.format(dateOnly, format);
    }

    static _stripTimeZone(isoDate){
        return isoDate !== undefined ? isoDate.split("T")[0] : undefined;
    }
}