import { ContentfulField } from './ContentfulField';

export class ImageField extends ContentfulField {
  constructor (image, assetList) {
    super(image);

    //Compensate for unpublished assets
    this._content = this._getImageId(image, assetList);
    this._has_content = this._content === undefined ? false : true;
  }

  get id() {
    return this.hasContent ? this._content : '';
  }

  _getImageId(image, assetList){
    let imageId;
    if(image === undefined)
      imageId = undefined;
    else {
      imageId = image.sys.id;

      //If asset can't be served, treat image as non-existent
      const assetExists = this._doesAssetExist(imageId, assetList);
      if(!assetExists){
        imageId = undefined;
      }
    }

    return imageId;
  }

  //If the image asset was unpublished, it will still have an id but will not be displayed on crds.net
  _doesAssetExist(imageId, assetList){
    const assetFound = assetList.find(asset =>{
      return asset.sys.id === imageId;
    });
    return assetFound;
  }
}