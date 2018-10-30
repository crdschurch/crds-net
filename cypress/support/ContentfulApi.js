/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
class ContentfulApi {
    currentSeries = {};
    messages = []; //shortcut: latestMessage property = messages[0]

    retrieveLocations() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=location&select=fields.name,fields.slug`)
            .then((response) => {
                this.locationList = JSON.parse(response.body).items;
            })
    }

    retrieveCurrentSeries() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=series&select=fields.title,fields.slug,fields.starts_at,fields.ends_at,fields.youtube_url,fields.image,fields.description&order=-fields.starts_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                const seriesList = jsonResponse.items;
                const assetList = jsonResponse.includes.Asset;

                this._storeCurrentSeries(seriesList, assetList);
            });
    }

    retrieveMessages() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&order=-fields.published_at`)
            .then((response) => {
                const jsonResponse = JSON.parse(response.body);
                const messageList = jsonResponse.items;
                const assetList = jsonResponse.includes.Asset;

                this._storeRecentMessages(messageList, assetList, 5);
                this.latestMessage = this.messages[0];
            })
    }

    _storeCurrentSeries(seriesListDescending, assetList) {
        //Get series most recently started
        const rawCurSeries = seriesListDescending.find(s => {
            return (Date.now() > new Date(s.fields.starts_at));
        })

        this._storeStandardProperties(rawCurSeries, assetList, this.currentSeries);
        this.currentSeries.starts_at = rawCurSeries.fields.starts_at;
        this.currentSeries.ends_at = rawCurSeries.fields.ends_at;
        this.currentSeries.youtube_url = rawCurSeries.fields.youtube_url;
    }

    _storeRecentMessages(messageListDescending, assetList, numToStore) {
        numToStore = messageListDescending.length < numToStore ? messageListDescending.length : numToStore;

        for(let i = 0; i < numToStore; i++){
            this.messages[i] = {};
            this._storeStandardProperties(messageListDescending[i], assetList, this.messages[i]);
            this.messages[i].published_at = messageListDescending[i].fields.published_at;
        }
    }

    //Stores title, slug, description and imageFileName (if content has image)
    _storeStandardProperties(jsonObject, assetList, saveObject){
        saveObject.title = jsonObject.fields.title;
        saveObject.slug = jsonObject.fields.slug;
        saveObject.description = jsonObject.fields.description;

        if(jsonObject.fields.image){
            this._storeImageData(jsonObject.fields.image.sys.id, assetList, saveObject);
        }
    }

    _storeImageData(imageId, assetList, saveObject) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        saveObject.imageFileName = imageAsset.fields.file.fileName;
    }

    //TODO need a way to remove the markdown from the descriptions - is there already a library installed that can do that?
}

export { ContentfulApi };