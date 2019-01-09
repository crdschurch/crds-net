import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';

export class LocationList {
    createListOfLocations(response){
        const itemList = response.items;
        this._location_list = [];

        for (let i = 0; i < itemList.length; i++){
            let loc = new LocationModel(itemList[i].fields);
            this._location_list.push(loc);
        }
    }

    getLocationBySlug(slug){
        return this._location_list.find(l => l.slug.text == slug);
    }

    get sortedByNameAndSlug(){
        return this._location_list.sort(function(a, b) {
            let diff = a.name.text.localeCompare(b.name.text);
            if(diff === 0)
                diff = a.slug.text.localeCompare(b.slug.text);
            return diff;
        });
    }

    get locationCount(){
        return this._location_list != undefined ? this._location_list.length : undefined;
    }
}

export class LocationModel {
    constructor(responseItem){
        this._name = new TextField(responseItem.name);
        this._name.required = true;

        this._slug = new TextField(responseItem.slug);
        this._slug.required = true;

        this._image = new ImageField(responseItem.image);
        this._image.required = true;
    }

    get name(){
        return this._name;
    }

    get slug(){
        return this._slug;
    }

    get image(){
        return this._image;
    }
}