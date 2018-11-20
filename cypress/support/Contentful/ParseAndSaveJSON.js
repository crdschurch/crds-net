const removeMarkdown = require('remove-markdown');

export class ParseAndSaveJSON {
    //Stores title, slug, description and imageName (if content has image)
    static storeStandardProperties(jsonObject, assetList, saveObject){
        saveObject._title = jsonObject.fields.title;
        saveObject._slug = jsonObject.fields.slug;

        this.storeCleanedText(jsonObject.fields.description, saveObject, '_description')
        //saveObject._description = removeMarkdown(jsonObject.fields.description);

        if(jsonObject.fields.image){

            this.storeImageData(jsonObject.fields.image.sys.id, assetList, saveObject, '_imageName');
        }

        if(jsonObject.fields.background_image) {
            this.storeImageData(jsonObject.fields.background_image.sys.id, assetList, saveObject, '_backgroundImageName');
        }
    }

    static storeImageData(imageId, assetList, saveObject, savePropertyName) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        saveObject[savePropertyName] = imageAsset.fields.file.fileName.replace(/ /g, "_"); //TODO test this
    }

    static storeCleanedText(jsonText, saveObject, savePropertyName){
        let cleanedText = removeMarkdown(jsonText);

        saveObject[savePropertyName] = cleanedText;
    }
}