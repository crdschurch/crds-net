import { Formatter } from '../../Formatter'
//promosByLocation class

export class PromosByLocation{
    storePromosByLocation(response){
        const itemList = response.items;

        //create a promo for each
        for (let i = 0; i < itemList.length; i++){
            let promo = new PromoModel(itemList[i]);
            //add TAs to list
            promo.target_audience().forEach(ta => {
                this[ta].push(promo);
            });
        }

        //for each location, create property in PBL with location name and add PM to that list
    }
    //
}

//promos model

export class PromoModel {
    constructor(responseItem){
        this._name = responseItem.fields.name;
        this._link = responseItem.fields.link_url;
        this._target_audience = responseItem.fields.target_audience;
    }

    get name(){
        return this._name;
    }

    get link(){
        return this._link;
    }

    get target_audience(){
        return this._target_audience;
    }
}
