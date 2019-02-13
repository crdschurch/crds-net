import { TextField } from '../Fields/TextField';

export class RedirectList {
  storeRedirectItems(response){
    this._raw_redirect_list = response.items;
    this._list_ready = true;
  }

  getRedirectFrom(link) {
    const index = this._raw_redirect_list.findIndex(redirect => redirect.fields.from === link);
    return new RedirectModel(this._raw_redirect_list[index].fields);
  }

  get listReady(){
    return this._list_ready;
  }
}

export class RedirectModel {
  constructor(responseItem){
    this._from = new TextField(responseItem.from);
    this._from.required = true;

    this._to = new TextField(responseItem.to);
    this._to.required = true;
  }

  get from(){
    return this._from;
  }

  get to(){
    return this._to;
  }
}