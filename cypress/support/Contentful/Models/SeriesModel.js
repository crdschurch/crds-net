import { ParseAndSaveJSON } from '../ParseAndSaveJSON'

export class SeriesModel {
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

    get imageName(){
        return this._imageName;
    }

    get backgroundImageName(){
        return this._backgroundImageName;
    }

    get startDate(){
        return this.starts_at.split("T")[0]; //Remove time zone
    }

    get endDate(){
        return this.ends_at.split("T")[0]; //Remove time zone
    }

    get youtubeURL(){
        return this.youtube_url;
    }
}