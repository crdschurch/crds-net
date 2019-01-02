import { Formatter } from '../../Formatter'

export class PromosByAudience{
    storePromosByAudience(response){
        const itemList = response.items;
        this._audience_list = [];

        for (let i = 0; i < itemList.length; i++){
            let promo = new PromoModel(itemList[i]);

            if(promo.target_audience !== undefined){
                this._addPromoToAudienceLists(promo.target_audience, promo);
            }
        }
    }

    getPromoList(audience){
        return this[audience];
    }

    getPromoListSortedByDateThenTitle(audience){
        const list = this[audience];
        if(list === undefined){
            return;
        }
        Formatter.formatDateIgnoringTimeZone
        const sortedPromos = list.sort((a,b) => {
            let aPublishedDate = Formatter.formatDateIgnoringTimeZone(a.publishedAt, 'MM.DD.YYYY');
            let bPublishedDate = Formatter.formatDateIgnoringTimeZone(b.publishedAt, 'MM.DD.YYYY');

            let diff = (new Date(bPublishedDate) - new Date(aPublishedDate))
            if(diff === 0)
                diff = a.title.localeCompare(b.title);
            return diff;
        })
        return sortedPromos;
    }

    _addPromoToAudienceLists(audienceList, promo){
        for(let i = 0; i < audienceList.length; i++){
            let curAudience = audienceList[i];

            if(this[curAudience] === undefined){
                this[curAudience] = [];
                this._audience_list.push(curAudience);
            }
            this[curAudience].push(promo);
        }
    }

    get audienceList(){
        return this._audience_list;
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
