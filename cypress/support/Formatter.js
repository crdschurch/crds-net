const removeMarkdown = require('remove-markdown');

export class Formatter {
  static normalizeText(rawString){
    if (rawString === undefined)
      return '';

    const fakeTextArea = document.createElement('textarea');
    fakeTextArea.innerHTML = removeMarkdown(rawString);
    const encodedHTML = fakeTextArea.value.replace(/\W+/g, ' ').trim();
    return encodedHTML;
  }
}