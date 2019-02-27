import { TextField } from '../Fields/TextField';
import { DateField } from '../Fields/DateField';
import { ContentfulApiV2 } from '../ContentfulApi';

export class PromoManager {
  constructor(){
    this._promos_by_audience = {};
  }

  savePromosInAudience(audience){
    this._promos_by_audience[audience] = [];
    const promoList = ContentfulApiV2.getEntryCollection('content_type=promo&select=sys.id,fields.target_audience,fields.published_at&order=-fields.published_at');
    cy.wrap({promoList}).its('promoList.responseReady').should('be.true').then(()=>{
      const responseList = promoList.responseBody.items;

      const promosWithAudience = responseList.filter(p =>{
        p.fields.target_audience = p.fields.target_audience === undefined ? [] : p.fields.target_audience;
        return (p.fields.target_audience.includes(audience));
      });

      promosWithAudience.forEach(p => this._addPromoToAudienceList(audience, p.sys.id));
    });
  }

  saveTargetAudiences(){
    const audienceList = ContentfulApiV2.getEntryCollection('content_type=promo&select=fields.target_audience');
    cy.wrap({audienceList}).its('audienceList.responseReady').should('be.true').then(()=>{
      const abc = audienceList.responseBody.items.filter(r => r.fields !== undefined);

      const audiences = [];
      abc.forEach(r => {
        let i;
        for(i = 0; i < r.fields.target_audience.length; i++){
          if(audiences.indexOf(r.fields.target_audience[i]) == -1)
            audiences.push(r.fields.target_audience[i]);
        }
      });
      this._target_audiences = audiences.sort();
    });
  }

  //Sorted by date then title
  getSortedPromosInAudience(audience){
    cy.log(`promos in audience ${this._promos_by_audience[audience].length}`);
    return this._promos_by_audience[audience].sort((a, b) => {
      let diff = a.publishedAt.ignoreTimeZone().compare(b.publishedAt.ignoreTimeZone());
      return diff === 0 ? a.title.compare(b.title) : diff;
    });
  }

  get targetAudiences(){
    return this._target_audiences;
  }

  _addPromoToAudienceList(audience, entryId){
    const promoEntry = ContentfulApiV2.getSingleEntry(entryId);
    cy.wrap({promoEntry}).its('promoEntry.responseReady').should('be.true').then(() => {
      const promoModel = new PromoModel(promoEntry.responseBody.fields);

      if(promoModel.publishedAt.date <= Date.now())
        this._promos_by_audience[audience].push(promoModel);
    });
  }
}


// export class PromoList {
//   storePromosByAudience(response) {
//     const itemList = response.items;

//     this._promos_in_audience = {};
//     this._promos_in_audience.audience_list = [];

//     for (let i = 0; i < itemList.length; i++) {
//       let promo = new PromoModel(itemList[i].fields);

//       if (promo.target_audiences !== undefined) {
//         this._addPromoToAudienceLists(promo);
//       }
//     }

//     this._sortAndDedupeAudienceList();
//   }

//   get audienceList() {
//     return this._promos_in_audience.audience_list !== undefined ? this._promos_in_audience.audience_list : [];
//   }

//   getPromoList(audience) {
//     return this._promos_in_audience[audience] !== undefined ? this._promos_in_audience[audience] : [];
//   }

//   sortedByDateAndTitle(audience) {
//     const sortedPromos = this.getPromoList(audience).sort((a, b) => {
//       let diff = a.publishedAt.ignoreTimeZone().compare(b.publishedAt.ignoreTimeZone());
//       return diff === 0 ? a.title.compare(b.title) : diff;
//     });
//     return sortedPromos;
//   }

//   _addPromoToAudienceLists(promo) {
//     const promoAudiences = promo.target_audiences;

//     for (let i = 0; i < promoAudiences.length; i++) {
//       let audience = promoAudiences[i];

//       //Add audience to list of audiences
//       this._promos_in_audience.audience_list.push(audience);

//       //Add promo to list of promos with audience
//       if (this._promos_in_audience[audience] === undefined) {
//         this._promos_in_audience[audience] = [];
//       }
//       this._promos_in_audience[audience].push(promo);
//     }
//   }

//   _sortAndDedupeAudienceList() {
//     this._promos_in_audience.audience_list = this._promos_in_audience.audience_list.sort().filter((audience, i, ary) => {
//       return !i || audience != ary[i - 1];
//     });
//   }
// }

export class PromoModel {
  constructor (responseItem) {
    this._title = new TextField(responseItem.title);
    this._title.required = true;

    this._published_at = new DateField(responseItem.published_at);
    this._published_at.required = true;

    this._target_audience = responseItem.target_audience;
  }

  get title() {
    return this._title;
  }

  get publishedAt() {
    return this._published_at;
  }

  get target_audiences() {
    return this._target_audience;
  }
}
