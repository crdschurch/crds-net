export class ContentfulField {
  constructor (content) {
    this._content = content;
  }

  set required(is_required) {
    this._is_required = is_required;
  }

  get required() {
    if (this._is_required === undefined)
      this._is_required = false;
    return this._is_required;
  }

  get hasContent() {
    return this._content === undefined ? false : true;
  }

  get isRequiredOrHasContent() {
    return this.required || this.hasContent;
  }
}