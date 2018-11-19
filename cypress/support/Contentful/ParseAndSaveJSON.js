const removeMarkdown = require('remove-markdown');

export class ParseAndSaveJSON {
    //Stores title, slug, description and imageFileName (if content has image)
    static storeStandardProperties(jsonObject, assetList, saveObject){
        saveObject._title = jsonObject.fields.title;
        saveObject._slug = jsonObject.fields.slug;
        saveObject._description = removeMarkdown(jsonObject.fields.description);

        if(jsonObject.fields.image){
            this.storeImageData(jsonObject.fields.image.sys.id, assetList, saveObject);
        }
    }

    static storeImageData(imageId, assetList, saveObject) {
        const imageAsset = assetList.find(img => {
            return img.sys.id === imageId;
        })

        saveObject._imageFileName = imageAsset.fields.file.fileName;
    }
}