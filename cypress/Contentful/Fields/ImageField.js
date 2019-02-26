import { ContentfulField } from './ContentfulField';
import { ContentfulApiV2 } from '../ContentfulApi';

//TODO unpublish an asset
//TODO run where has no image
export class ImageField extends ContentfulField {
  constructor (image, assetList='remove') { //todo remove assetList
    super(image);

    //Compensate for unpublished assets
    this._setContentToImageId(image);
  }

  get id() {
    return this.hasContent ? this._content : '';
  }

  _setContentToImageId(image) {
    if (image === undefined)
      this._content = undefined;
    else {
      //If the image asset was unpublished, it will still have an id but will not be displayed on crds.net
      const imageAsset = ContentfulApiV2.getSingleAsset(image.sys.id);
      cy.wrap({ imageAsset }).its('imageAsset.responseReady').should('be.true').then(() => {
        const responseType = imageAsset.responseBody.sys.type;
        if (responseType != 'Error') {
          this._content = image.sys.id;
        }
        else {
          this._content = undefined;
        }
      });
    }
  }
}