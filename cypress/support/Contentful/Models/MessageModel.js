import { ParseAndSaveJSON } from '../ParseAndSaveJSON'

export class MessageModel {
    storeLatestMessage(response) {
        const itemList = response.items;
        const assetList = response.includes.Asset;

        ParseAndSaveJSON.storeStandardProperties(itemList[0], assetList, this);
        this._published_at = itemList[0].fields.published_at
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
        return this._published_at
    }

    static createListOfMessages(response, numToStore, messageList) {
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