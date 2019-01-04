//import { ParseAndSaveJSON } from '../ParseAndSaveJSON';
import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';

export class MessageList {
    createListOfMessages(response, numToStore) {
        const itemList = response.items;
        numToStore = itemList.length < numToStore ? itemList.length : numToStore;
        //const assetList = response.includes.Asset;
        this._message_list = [];

        for (let i = 0; i < numToStore; i++) {
            let msg = new MessageModel(itemList[i]);
            //ParseAndSaveJSON.storeStandardProperties(itemList[i], assetList, msg);
            //msg._published_at = itemList[i].fields.published_at;
            this._message_list.push(msg);
        }

        this._latest_message = this._message_list[0]; //TODO this is dependent on the query - should it be trusted?
    }

    message(index){
        return this._message_list[index];
    }

    get latestMessage() {
        return this._latest_message;
    }
}

export class MessageModel {
    constructor(responseItem) {
        //const itemList = responseItem.items;
        //const assetList = response.includes.Asset; //never used

        //WAS
        //ParseAndSaveJSON.storeStandardProperties(itemList[0], assetList, this);
        this._title = new TextField(responseItem.fields.title);
        this._title.required = true;

        this._slug = new TextField(responseItem.fields.slug);
        this._slug.required = true;

        //NOTE description is not required
        this._description = new TextField(responseItem.fields.description); //Formatter.normalizeText(itemList[0].fields.description);

        //Save image information, if it should exist
        this._image = new ImageField(responseItem.fields.image);
        this._background_image = new ImageField(responseItem.fields.background_image);

        // if (itemList[0].fields.image){
        //     this._imageId = itemList[0].fields.image.sys.id;
        // }

        // if (itemList[0].fields.background_image){
        //     this._backgroundImageId = itemList[0].fields.background_image.sys.id;
        // }

        this._published_at = new DateField(responseItem.fields.published_at);
        this._published_at.required = true;
    }

    get title() {
        return this._title;
    }

    get slug() {
        return this._slug;
    }

    get description() {
        return this._description;
    }

    get image(){
        return this._image;
    }

    get backgroundImage(){
        return this._background_image;
    }

    // get imageId(){
    //     return this._imageId;
    // }

    // get backgroundImageId(){
    //     return this._backgroundImageId;
    // }

    get publishedAt() {
        return this._published_at;
    }

    // static createListOfMessages(response, numToStore, messageList=[]) {
    //     const itemList = response.items;
    //     const assetList = response.includes.Asset;

    //     for (let i = 0; i < numToStore; i++) {
    //         let msg = new MessageModel();
    //         ParseAndSaveJSON.storeStandardProperties(itemList[i], assetList, msg);
    //         msg._published_at = itemList[i].fields.published_at;
    //         messageList.push(msg);
    //     }
    // }
}