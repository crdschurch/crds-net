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

    static removeNewlineSymbol(stringWithHTML){
        return stringWithHTML !== undefined ? stringWithHTML.replace(/\n/g, '') : undefined;
    }

    static removeLineBreaksAndNewlines(stringWithHTML){
        return stringWithHTML !== undefined ? stringWithHTML.replace(/\n\n/g, ' ').replace(/\n/g, '') : undefined;
    }

    static normalizeText(rawString){
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