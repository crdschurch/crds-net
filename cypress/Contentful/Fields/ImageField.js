import { ContentfulField } from './ContentfulField';
import { ContentfulApi } from '../ContentfulApi';

export class ImageField extends ContentfulField {
  constructor (image) {
    super(image);

    //Compensate for unpublished assets
    this._setContentToImageId(image);
  }

  get id() {
    return this.hasContent ? this._content : '';
  }

  //Known defect in Contentful where an unpublished asset can still be linked to a required field
  get isUnpublished(){
    return this._is_unpublished === undefined ? false : this._is_unpublished;
  }

  _setContentToImageId(image) {
    if (image === undefined)
      this._content = undefined;
    else {
      //If the image asset was unpublished, it will still have an id but will not be displayed on crds.net
      const imageAsset = ContentfulApi.getSingleAsset(image.sys.id, false);
      cy.wrap({ imageAsset }).its('imageAsset.responseReady').should('be.true').then(() => {
        const responseType = imageAsset.responseBody.sys.type;
        if (responseType != 'Error') {
          this._content = image.sys.id;
        }
        else {
          //An unpublished asset will still have an id, but may be displayed differently than a missing asset
          this._content = undefined;
          this._is_unpublished = true;
        }
      });
    }
  }
}
