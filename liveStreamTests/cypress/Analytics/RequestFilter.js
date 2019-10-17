/**
 * Stores a matching request given a callback to filter
 */
export class RequestFilter {
  constructor (cb) {
    this._matches = [];
    this._filter = cb;
  }

  get matches() {
    return this._matches;
  }

  keepMatch(request) {
    if (this._filter(request)) {
      this._matches.push(request);
    }
  }
}
