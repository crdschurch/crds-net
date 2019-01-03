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
        this._starts_at = rawCurSeries.fields.starts_at;
        this._ends_at = rawCurSeries.fields.ends_at;
        this._youtube_url = rawCurSeries.fields.youtube_url;
        this._published_at = rawCurSeries.fields.published_at;
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
        return this._starts_at;
    }

    get endDate(){
        return this._ends_at;
    }

    get publishedAt(){
        return this._published_at;
    }

    get youtubeURL(){
        return this._youtube_url;
    }
}