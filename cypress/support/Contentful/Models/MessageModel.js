import { ParseAndSaveJSON } from '../ParseAndSaveJSON';
import { TextField } from '../Fields/TextField';

export class MessageModel {
    storeLatestMessage(response) {
        const itemList = response.items;
        //const assetList = response.includes.Asset; //never used

        //WAS
        //ParseAndSaveJSON.storeStandardProperties(itemList[0], assetList, this);
        this._title = new TextField(itemList[0].fields.title);
        this._title.required = true;

        this._slug = new TextField(itemList[0].fields.slug);
        this._slug.required = true;

        //NOTE description is not required
        this._description = new TextField(itemList[0].fields.description); //Formatter.normalizeText(itemList[0].fields.description);

        //Save image information, if it should exist
        if (itemList[0].fields.image){
            this._imageId = itemList[0].fields.image.sys.id;
        }

        if (itemList[0].fields.background_image){
            this._backgroundImageId = itemList[0].fields.background_image.sys.id;
        }

        this._published_at = itemList[0].fields.published_at;
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

    get imageId(){
        return this._imageId;
    }

    get backgroundImageId(){
        return this._backgroundImageId;
    }

    get publishedAt() {
        return this._published_at;
    }

    static createListOfMessages(response, numToStore, messageList=[]) {
        const itemList = response.items;
        const assetList = response.includes.Asset;

        for (let i = 0; i < numToStore; i++) {
            let msg = new MessageModel();
            ParseAndSaveJSON.storeStandardProperties(itemList[i], assetList, msg);
            msg._published_at = itemList[i].fields.published_at;
            messageList.push(msg);
        }
    }
}