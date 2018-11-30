const removeMarkdown = require('remove-markdown');

export class ParseAndSaveJSON {
    //Stores title, slug, description, image and background image ids (if content has images)
    static storeStandardProperties(jsonObject, assetList, saveObject){
        saveObject._title = jsonObject.fields.title;
        saveObject._slug = jsonObject.fields.slug;
        saveObject._description = removeMarkdown(jsonObject.fields.description);

        //this._storeCleanedText(jsonObject.fields.description, saveObject, '_description')


        //Save image information, if it should exist
        if (jsonObject.fields.image){
            saveObject._imageId = jsonObject.fields.image.sys.id;
        }

        if (jsonObject.fields.background_image) {
            saveObject._backgroundImageId = jsonObject.fields.background_image.sys.id;
        }
    }


    // static _storeCleanedText(jsonText, saveObject, savePropertyName){
    //     let cleanedText = removeMarkdown(jsonText);

    //     saveObject[savePropertyName] = cleanedText.replace(/\n\n/g, ' ').replace(/\n/g, '');
    // }
}