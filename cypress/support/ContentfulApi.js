/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
class ContentfulApi {
    currentSeries = {};
    latestMessage = {};

    retrieveLocations() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=location&select=fields.name,fields.slug`)
            .then((response) => {
                this.locationList = JSON.parse(response.body).items;
            })
    }

    retrieveCurrentSeries() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=series&select=fields.title,fields.slug,fields.starts_at,fields.ends_at,fields.youtube_url,fields.image,fields.description&order=-fields.starts_at`)
            .then((response) => {
                const rawResponse = JSON.parse(response.body);
                const seriesList = rawResponse.items;
                const assetList = rawResponse.includes.Asset;

                this._storeCurrentSeries(seriesList);
                this._storeImageData(this.currentSeries.imageId, 'currentSeries', assetList);
            });
    }

    retrieveLatestMessage() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=message&select=fields.title,fields.slug,fields.published_at,fields.image,fields.description&include=1&order=-fields.published_at`)
            .then((response) => {
                const rawResponse = JSON.parse(response.body);
                const messageList = rawResponse.items;
                const assetList = rawResponse.includes.Asset;

                this._storeLatestMessage(messageList[0]);
                this._storeImageData(this.latestMessage.imageId, 'latestMessage', assetList);
            })
    }

    _storeCurrentSeries(seriesListDescending) {
        //Get series most recently started
        const rawCurSeries = seriesListDescending.find(s => {
            return (Date.now() > new Date(s.fields.starts_at));
        })

        this.currentSeries.title = rawCurSeries.fields.title;
        this.currentSeries.slug = rawCurSeries.fields.slug;
        this.currentSeries.imageId = rawCurSeries.fields.image.sys.id;
        this.currentSeries.starts_at = rawCurSeries.fields.starts_at;
        this.currentSeries.ends_at = rawCurSeries.fields.ends_at;
        this.currentSeries.description = rawCurSeries.fields.description;
        this.currentSeries.youtube_url = rawCurSeries.fields.youtube_url;
    }

    _storeLatestMessage(firstMessage){
        this.latestMessage.title = firstMessage.fields.title;
        this.latestMessage.slug = firstMessage.fields.slug;
        this.latestMessage.published_at = firstMessage.fields.published_at;
        this.latestMessage.imageId = firstMessage.fields.image.sys.id;
        this.latestMessage.description = firstMessage.fields.description;
    }

    _storeImageData(imageId, targetObjectName, assetList) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        this[targetObjectName].imageFileName = imageAsset.fields.file.fileName;
    }
}

export { ContentfulApi };