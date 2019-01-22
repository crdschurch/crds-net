import { Formatter } from '../../support/Formatter';
import { ContentfulField } from './ContentfulField';

export class TextField extends ContentfulField {
  constructor (text) {
    super(text);
  }

  compare(textField) {
    return this.text.localeCompare(textField.text);
  }

  get text() {
    return this.hasContent ? this._content : '';
  }

  get normalized() {
    if (this._normalized === undefined) {
      this._normalized = Formatter.normalizeText(this._content);
    }

    return this._normalized;
  }
}