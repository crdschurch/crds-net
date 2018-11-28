import { ParseAndSaveJSON } from '../ParseAndSaveJSON'

export class SeriesModel {
    storeCurrentSeries(response) {
        const seriesListDescending = response.items;
        const assetList = response.includes.Asset;

        //Get series most recently started
        const rawCurSeries = seriesListDescending.find(s => {
            return (Date.now() >= new Date(s.fields.published_at));
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

    get imageId(){
        return this._imageId;
    }

    get backgroundImageId(){
        return this._backgroundImageId;
    }

    get startDate(){
        if (this.starts_at !== undefined)
            return this.starts_at.split("T")[0]; //Remove time zone
        return this.starts_at;
    }

    get endDate(){
        if (this.ends_at !== undefined)
            return this.ends_at.split("T")[0]; //Remove time zone
        return this.ends_at;
    }

    get youtubeURL(){
        return this.youtube_url;
    }
}