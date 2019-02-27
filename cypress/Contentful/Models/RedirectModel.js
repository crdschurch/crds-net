import { TextField } from '../Fields/TextField';
import { ContentfulApiV2 } from '../ContentfulApi';

export class RedirectManager {
  constructor(){
    this._redirect_list = {};
  }

  saveRedirectsFromSlug(slug){
    const redirectList = ContentfulApiV2.getEntryCollection('content_type=redirect&&select=fields.from,fields.to&limit=1000');
    cy.wrap({redirectList}).its('redirectList.responseReady').should('be.true').then(()=> {
      const responseList = redirectList.responseBody.items;

      const matchingRedirect = responseList.find(r => r.fields.from === slug);
      this._redirect_list[slug] = new RedirectModel(matchingRedirect.fields);
    });
  }

  get savedRedirects(){
    return this._redirect_list;
  }

  getRedirectBySlug(slug){
    return this._redirect_list[slug];
  }
}

// export class RedirectList {
//   storeRedirectItems(response){
//     this._raw_redirect_list = response.items;
//     this._list_ready = true;
//   }

//   getRedirectFrom(link) {
//     const index = this._raw_redirect_list.findIndex(redirect => redirect.fields.from === link);
//     return new RedirectModel(this._raw_redirect_list[index].fields);
//   }

//   get listReady(){
//     return this._list_ready;
//   }
// }

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