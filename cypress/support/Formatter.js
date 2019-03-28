const removeMarkdown = require('remove-markdown');

export class Formatter {
  static normalizeText(rawString){
    if (rawString === undefined)
      return '';

    const fakeTextArea = document.createElement('textarea');
    fakeTextArea.innerHTML = removeMarkdown(rawString);
    const encodedHTML = fakeTextArea.value.replace(/\W+/g, ' ').trim();
    return encodedHTML;




    // if (rawString == undefined) {
    //   return '';
    // }

    // let cleanString = removeMarkdown(rawString);
    // cleanString = this.encodeAsHTML(cleanString);
    // cleanString = cleanString.replace(/\W+/g, ' ').trim();
    // return cleanString;
  }

  // static encodeAsHTML(rawString){
  //   if (rawString == undefined){
  //     return undefined;
  //   }

  //   let txt = document.createElement('textarea');
  //   txt.innerHTML = rawString;
  //   return txt.value;
  // }
}