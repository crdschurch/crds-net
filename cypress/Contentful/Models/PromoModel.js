import { TextField } from '../Fields/TextField';
import { DateField } from '../Fields/DateField';

export class PromoList {
  storePromosByAudience(response) {
    const itemList = response.items;

    this._promos_in_audience = {};
    this._promos_in_audience.audience_list = [];

    for (let i = 0; i < itemList.length; i++) {
      let promo = new PromoModel(itemList[i].fields);

      if (promo.target_audiences !== undefined) {
        this._addPromoToAudienceLists(promo);
      }
    }

    this._sortAndDedupeAudienceList();
  }

  get audienceList() {
    return this._promos_in_audience.audience_list !== undefined ? this._promos_in_audience.audience_list : [];
  }

  getPromoList(audience) {
    return this._promos_in_audience[audience] !== undefined ? this._promos_in_audience[audience] : [];
  }

  sortedByDateAndTitle(audience) {
    const sortedPromos = this.getPromoList(audience).sort((a, b) => {
      let diff = a.publishedAt.ignoreTimeZone().compare(b.publishedAt.ignoreTimeZone());// compareNoTimeZone(b.publishedAt);
      return diff === 0 ? a.title.compare(b.title) : diff;
    });
    return sortedPromos;
  }

  _addPromoToAudienceLists(promo) {
    const promoAudiences = promo.target_audiences;

    for (let i = 0; i < promoAudiences.length; i++) {
      let audience = promoAudiences[i];

      //Add audience to list of audiences
      this._promos_in_audience.audience_list.push(audience);

      //Add promo to list of promos with audience
      if (this._promos_in_audience[audience] === undefined) {
        this._promos_in_audience[audience] = [];
      }
      this._promos_in_audience[audience].push(promo);
    }
  }

  _sortAndDedupeAudienceList() {
    this._promos_in_audience.audience_list = this._promos_in_audience.audience_list.sort().filter((audience, i, ary) => {
      return !i || audience != ary[i - 1];
    });
  }
}

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
