const removeMarkdown = require('remove-markdown');

/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
class ContentfulApi {
    // currentSeries = {};
    // messages = []; //shortcut: latestMessage property = messages[0]

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
                seriesModel.storeCurrentSeries(jsonResponse);//populateModelFromJSON(jsonResponse);
            });
    }

    //Note: The order messages are retrieved here and what's displayed on the site are not guaranteed to be the same if the "published at" date is the same (time is ignored)
    retrieveMessages(messageModel, numToStore) {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                messageModel.populateModelFromJSON(jsonResponse, numToStore);
            })
    }
//TODO will this work given an empty list?
    retrieveListOfMessages(messageList, numToStore) {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                //messageModel.populateModelFromJSON(jsonResponse, numToStore);
            })
    }
}

// class GenericModel {
//     //Stores title, slug, description and imageFileName (if content has image)
//     _storeStandardProperties(jsonObject, assetList, saveObject){
//         saveObject._title = jsonObject.fields.title;
//         saveObject._slug = jsonObject.fields.slug;
//         saveObject._description = removeMarkdown(jsonObject.fields.description);

//         if(jsonObject.fields.image){
//             this._storeImageData(jsonObject.fields.image.sys.id, assetList, saveObject);
//         }
//     }

//     _storeImageData(imageId, assetList, saveObject) {
//         const imageAsset = assetList.find(img => {
//             return img.sys.id === imageId;
//         })

//         saveObject._imageFileName = imageAsset.fields.file.fileName;
//     }

//     get title(){
//         return this._title;
//     }

//     get slug(){
//         return this._slug;
//     }

//     get description(){
//         return this._description;
//     }

//     get imageFileName(){
//         return this._imageFileName;
//     }
// }

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
    //currentSeries = {};

    // populateModelFromJSON(response) {
    //     const seriesList = response.items;
    //     const assetList = response.includes.Asset;
    //     this._storeCurrentSeries(seriesList, assetList);
    // }

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

//TODO create methods to populate current model or create new instance and add to list (with content)
class MessageModel {
    messages = []; //shortcut: latestMessage property = messages[0]

    storeLatestMessage(response) {
        //TODO
    }

    static storeListOfMessages(response, messageList, numToStore) {
//expects a list, will create new MessageModels for eacn numToStore
    }

    populateModelFromJSON(response, numToStore) {
        const messageList = response.items;
        const assetList = response.includes.Asset;

        numToStore = messageList.length < numToStore ? messageList.length : numToStore;

        for(let i = 0; i < numToStore; i++){
            this.messages[i] = {}; //TODO this isn't a MessageModel instance
            ParseAndSaveJSON.storeStandardProperties(messageList[i], assetList, this.messages[i]);
            this.messages[i].published_at = messageList[i].fields.published_at;
        }

        //this.latestMessage = this.messages[0];
    }

    get latestMessage(){
        return this.messages[0];
    }
}

export { ContentfulApi, MessageModel, SeriesModel };