const moment = require('moment');
//place to keep all the date/time convertiong and formatting to minimize impact on tests and modules

export class Formatter {
    static formatDateIgnoringTimeZone(isoDate, format){
        if (isoDate == undefined){
            return undefined;
        }

        const dateOnly = isoDate.split("T")[0];
        return moment(dateOnly).format(format);
    }

    static removeNewlineSymbol(stringWithHTML){
        return stringWithHTML !== undefined ? stringWithHTML.replace(/\n/g, '') : undefined;
    }

    static removeLineBreaksAndNewlines(stringWithHTML){
        return stringWithHTML !== undefined ? stringWithHTML.replace(/\n\n/g, ' ').replace(/\n/g, '') : undefined;
    }
}