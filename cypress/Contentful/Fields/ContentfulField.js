
export class ContentfulField {
  constructor (content) {
    this._content = content;
    this._has_content = content === undefined ? false : true;
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
    return this._has_content;
  }

  get isRequiredOrHasContent() {
    return this.required || this._has_content;
  }
}