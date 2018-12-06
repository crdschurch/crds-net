const moment = require('moment');
const removeMarkdown = require('remove-markdown');

export class Formatter {
    static formatDateIgnoringTimeZone(isoDate, format){
        if (isoDate == undefined){
            return undefined;
        }

        const dateOnly = isoDate.split("T")[0];
        return moment(dateOnly).format(format);
    }

    static normalizeText(rawString){
        if (rawString == undefined) {
            return undefined;
        }

        let cleanString = removeMarkdown(rawString);
        cleanString = this.encodeAsHTML(cleanString);
        cleanString = cleanString.replace(/\W+/g, ' ').trim();
        return cleanString;
    }

    static encodeAsHTML(rawString){
        if (rawString == undefined){
            return undefined;
        }

        let txt = document.createElement('textarea');
        txt.innerHTML = rawString;
        return txt.value;
    }
}