const removeMarkdown = require('remove-markdown');

export class ParseAndSaveJSON {
    //Stores title, slug, description and imageName (if content has image)
    static storeStandardProperties(jsonObject, assetList, saveObject){
        saveObject._title = jsonObject.fields.title;
        saveObject._slug = jsonObject.fields.slug;
        saveObject._description = removeMarkdown(jsonObject.fields.description);

        if(jsonObject.fields.image){
            this.storeImageData(jsonObject.fields.image.sys.id, assetList, saveObject, '_imageName');
        }

        if(jsonObject.fields.background_image) {
            this.storeImageData(jsonObject.fields.background_image.sys.id, assetList, saveObject, '_backgroundImageName');
        }
    }

    static storeImageData(imageId, assetList, saveObject, propertyName) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        saveObject[propertyName] = imageAsset.fields.file.fileName;
    }
}