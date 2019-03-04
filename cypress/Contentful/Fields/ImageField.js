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

  _setContentToImageId(image) {
    if (image === undefined)
      this._content = undefined;
    else {
      cy.log(`image id ${image.sys.id}`);
      //If the image asset was unpublished, it will still have an id but will not be displayed on crds.net
      const imageAsset = ContentfulApi.getSingleAsset(image.sys.id, false);
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
