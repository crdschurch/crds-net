//import { ParseAndSaveJSON } from '../ParseAndSaveJSON';
import { TextField } from '../Fields/TextField';
import { ImageField } from '../Fields/ImageField';
import { DateField } from '../Fields/DateField';

export class SeriesManager {
    findCurrentSeries(response){
        const itemList = response.items;
        //Get series most recently started
        const currentSeriesResponse = itemList.find(s => {
            return (Date.now() >= new Date(s.fields.published_at));
        });

        this._current_series =  new SeriesModel(currentSeriesResponse.fields);
    }

    // createListOfSeries(response) {
    //     const itemList = response.items;
    //     this._series_list = [];

    //     for (let i = 0; i < itemList.length; i++) {
    //         cy.log(`${itemList[i].fields.title}`);
    //         let srs = new SeriesModel(itemList[i].fields);
    //         this._series_list.push(srs);

    //         cy.log(`date no zone ${this._series_list[i].publishedAt.dateIgnoreTimeZone}. now ${Date.now()}. compared ${Date.now() > this._series_list[i].publishedAt.dateIgnoreTimeZone}`);//debug
    //     }

    //This logic isn't working
    //     this._current_series = this._series_list.find(s => {
    //         return (Date.now() >= s.publishedAt.dateIgnoreTimeZone); //TODO what will this date be called?
    //     });
    // }

    get currentSeries() {
        return this._current_series;
    }
}

export class SeriesModel {
    // storeCurrentSeries(response) {
    //     const seriesListDescending = response.items;
    //     const assetList = response.includes.Asset;

    //     //Get series most recently started
    //     const rawCurSeries = seriesListDescending.find(s => {
    //         return (Date.now() >= new Date(s.fields.published_at));
    //     });

    //     ParseAndSaveJSON.storeStandardProperties(rawCurSeries, assetList, this);
    //     this._starts_at = rawCurSeries.fields.starts_at;
    //     this._ends_at = rawCurSeries.fields.ends_at;
    //     this._youtube_url = rawCurSeries.fields.youtube_url;
    //     this._published_at = rawCurSeries.fields.published_at;
    // }

    constructor (responseItem) {
//TODO add if required/not
        this._title = new TextField(responseItem.title);
        this._title.required = true;

        this._slug = new TextField(responseItem.slug);
        this._slug.required = true;

        this._description = new TextField(responseItem.description);
        this._description.required = true;

        this._published_at = new DateField(responseItem.published_at);
        this._published_at.required = true;

        this._image = new ImageField(responseItem.image);
        this._background_image = new ImageField(responseItem.background_image);
        this._starts_at = new DateField(responseItem.starts_at);
        this._ends_at = new DateField(responseItem.ends_at);
        this._youtube_url = new TextField(responseItem.youtube_url);


        //Save image information, if it should exist
        // if (jsonObject.fields.image){
        //     saveObject._imageId = jsonObject.fields.image.sys.id;
        // }

        // if (jsonObject.fields.background_image){
        //     saveObject._backgroundImageId = jsonObject.fields.background_image.sys.id;
        // }
        // this._starts_at = rawCurSeries.fields.starts_at;
        // this._ends_at = rawCurSeries.fields.ends_at;
        // this._youtube_url = rawCurSeries.fields.youtube_url;
        // this._published_at = rawCurSeries.fields.published_at;
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

    get image() {
        return this._image;
    }

    get backgroundImage() {
        return this._background_image;
    }
    // get imageId(){
    //     return this._imageId;
    // }

    // get backgroundImageId(){
    //     return this._backgroundImageId;
    // }

    get startDate() {
        return this._starts_at;
    }

    get endDate() {
        return this._ends_at;
    }

    get publishedAt() {
        return this._published_at;
    }

    get youtubeURL() {
        return this._youtube_url;
    }
}