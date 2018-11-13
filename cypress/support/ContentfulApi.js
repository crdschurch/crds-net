const removeMarkdown = require('remove-markdown');

/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
class ContentfulApi {
    //TODO create locations class too
    retrieveLocations() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=location&select=fields.name,fields.slug`)
            .then((response) => {
                this.locationList = JSON.parse(response.body).items;
            })
    }

    retrieveCurrentSeries(seriesModel) {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=series&select=fields.title,fields.slug,fields.starts_at,fields.ends_at,fields.youtube_url,fields.image,fields.description&order=-fields.starts_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                seriesModel.storeCurrentSeries(jsonResponse);
            });
    }

    //Note: The order messages are retrieved here and what's displayed on the site are not guaranteed to be the same if the "published at" date is the same (time is ignored)
    retrieveLatestMessage(messageModel) {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                messageModel.storeLatestMessage(jsonResponse);
            })
    }

    retrieveListOfMessages(messageList, numToStore) {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                MessageModel.createListOfMessages(jsonResponse, numToStore, messageList);
            })
    }
}

class ParseAndSaveJSON {
    //Stores title, slug, description and imageFileName (if content has image)
    static storeStandardProperties(jsonObject, assetList, saveObject){
        saveObject._title = jsonObject.fields.title;
        saveObject._slug = jsonObject.fields.slug;
        saveObject._description = removeMarkdown(jsonObject.fields.description);

        if(jsonObject.fields.image){
            this.storeImageData(jsonObject.fields.image.sys.id, assetList, saveObject);
        }
    }

    static storeImageData(imageId, assetList, saveObject) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        saveObject._imageFileName = imageAsset.fields.file.fileName;
    }
}

class SeriesModel {
    storeCurrentSeries(response) {
        const seriesListDescending = response.items;
        const assetList = response.includes.Asset;

        //Get series most recently started
        const rawCurSeries = seriesListDescending.find(s => {
            return (Date.now() > new Date(s.fields.starts_at));
        })

        ParseAndSaveJSON.storeStandardProperties(rawCurSeries, assetList, this);
        this.starts_at = rawCurSeries.fields.starts_at;
        this.ends_at = rawCurSeries.fields.ends_at;
        this.youtube_url = rawCurSeries.fields.youtube_url;
    }

    get title(){
        return this._title;
    }

    get slug(){
        return this._slug;
    }

    get description(){
        return this._description;
    }

    get imageFilename(){
        return this._imageFileName;
    }

    get startDate(){
        return this.starts_at;
    }

    get endDate(){
        return this.ends_at;
    }

    get youtubeURL(){
        return this.youtube_url;
    }
}

class MessageModel {
    storeLatestMessage(response) {
        const itemList = response.items;
        const assetList = response.includes.Asset;

        ParseAndSaveJSON.storeStandardProperties(itemList[0], assetList, this);
        this._published_at = itemList[0].fields.published_at
    }

    get title(){
        return this._title;
    }

    get slug(){
        return this._slug;
    }

    get description(){
        return this._description;
    }

    get imageFilename(){
        return this._imageFileName;
    }

    get publishedAt(){
        return this._published_at
    }

    static createListOfMessages(response, numToStore, messageList) {
        const itemList = response.items;
        const assetList = response.includes.Asset;

        for(let i = 0; i < numToStore; i++){
            let msg = new MessageModel();
            ParseAndSaveJSON.storeStandardProperties(itemList[i], assetList, msg);
            msg._published_at = itemList[i].fields.published_at;
            messageList.push(msg);
        }
    }
}

export { ContentfulApi, MessageModel, SeriesModel };