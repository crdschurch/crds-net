export class LocationModel {
    static createListOfLocations(response, locationList=[]){
        const itemList = response.items;

        for (let i = 0; i < itemList.length; i++){
            let loc = new LocationModel();
            loc._name = itemList[i].fields.name;
            loc._slug = itemList[i].fields.slug;
            loc._imageId = itemList[i].fields.image.sys.id
            locationList.push(loc);
        }
    }

    get name(){
        return this._name;
    }

    get slug(){
        return this._slug;
    }

    get imageId(){
        return this._imageId;
    }
}