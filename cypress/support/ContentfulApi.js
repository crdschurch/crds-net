/*
* Note: Due to Cypress's async nature, methods requesting data from Contentful may return before the properties within the cy.request blocks have been assigned.
* Therefore, it is recommended that these methods are called in a before/beforeEach clause to allow more time for data retrieval.
*/
class ContentfulApi {
    currentSeries = {};

    retrieveLocations() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=location&select=fields.name,fields.slug`)
            .then((response) => {
                this.locationList = JSON.parse(response.body).items;
            })
    }

    retrieveCurrentSeries() {
        cy.request('GET', `https://cdn.contentful.com/spaces/${Cypress.env('CONTENTFUL_SPACE_ID')}/environments/${Cypress.env('CONTENTFUL_ENV')}/entries?access_token=${Cypress.env('CONTENTFUL_ACCESS_TOKEN')}&content_type=series&select=fields.title,fields.slug,fields.starts_at,fields.ends_at,fields.image&order=-fields.starts_at`)
            .then((response) => {
                const rawResponse = JSON.parse(response.body);
                const seriesList = rawResponse.items;
                const assetList = rawResponse.includes.Asset;

                this._storeCurrentSeries(seriesList);
                this._storeImageData(this.currentSeries.imageId, assetList);
            });
    }

    _storeCurrentSeries(seriesListDescending) {
        //Get series most recently started
        const rawCurSeries = seriesListDescending.find(s => {
            return (Date.now() > new Date(s.fields.starts_at));
        })

        this.currentSeries.title = rawCurSeries.fields.title;
        this.currentSeries.slug = rawCurSeries.fields.slug;
        this.currentSeries.imageId = rawCurSeries.fields.image.sys.id;
    }

    _storeImageData(imageId, assetList) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        this.currentSeries.imageFileName = imageAsset.fields.file.fileName;
    }
}

export { ContentfulApi };