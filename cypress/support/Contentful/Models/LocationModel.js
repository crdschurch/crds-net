export class LocationModel {
    static createListOfLocations(response, locationList){
        const itemList = response.items;

        for (let i = 0; i < itemList.length; i++){
            let loc = new LocationModel();
            loc._slug = itemList[i].fields.slug;
            locationList.push(loc);
        }
    }

    get slug(){
        return this._slug;
    }
}