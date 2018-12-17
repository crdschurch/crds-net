import { Formatter } from '../../Formatter'
//import { callbackify } from 'util';
//promosByLocation class

export class PromosByLocation{
    storePromosByLocation(response){
        const itemList = response.items;

        for (let i = 0; i < itemList.length; i++){
            let promo = new PromoModel(itemList[i]);

            if(promo.target_audience !== undefined){
                this._addPromoToAudienceLists(promo.target_audience, promo);
            }
        }
    }

    getPromosSortedByDate(promoName){
        const list = this[promoName];
        if(list === undefined){
            return;
        }

        const sortedPromos = list.sort((a,b) => {
            return (new Date(b.publishedAt) - new Date(a.publishedAt));
        })
        return sortedPromos;
    }

    _addPromoToAudienceLists(audienceList, promo){
        for(let i = 0; i < audienceList.length; i++){
            let curAudience = audienceList[i];

            if(this[curAudience] === undefined){
                this[curAudience] = [];
            }
            this[curAudience].push(promo);
        }
    }
}

export class PromoModel {
    constructor(responseItem){
        this._title = responseItem.fields.title;
        this._link = responseItem.fields.link_url;
        this._target_audience = responseItem.fields.target_audience;
        this._published_at = responseItem.fields.published_at;
    }

    get title(){
        return this._title;
    }

    get link(){
        return this._link;
    }

    get publishedAt(){
        return this._published_at;
    }

    get target_audience(){
        return this._target_audience;
    }
}
