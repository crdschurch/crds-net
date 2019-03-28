export class ImageDisplayValidator {
  constructor (alias, usesPlaceholderIfUndefined = true) {
    this._alias = alias;
    this._if_unpublished_display_placeholder_image = usesPlaceholderIfUndefined;
  }
  shouldHaveImage(imageAsset) {
    cy.get(`@${this._alias}`).first().scrollIntoView();
    if (imageAsset === undefined)
      return; //Asset doesn't exist
    if (imageAsset.isPublished) {
      cy.get(`@${this._alias}`).should('have.attr', 'src').and('contain', imageAsset.id);
    }
    else if (this._if_unpublished_display_placeholder_image) {
      //TODO - No way to test this scenario yet.
    }
  }
  shouldHaveImgixImage(imageAsset) {
    cy.get(`@${this._alias}`).first().scrollIntoView();
    if (imageAsset === undefined)
      return; //Asset doesn't exist
    if (imageAsset.isPublished) {
      cy.get(`@${this._alias}`).should('have.attr', 'srcset');
      cy.get(`@${this._alias}`).should('have.attr', 'src').and('contain', imageAsset.id);
    }
    else if (this._if_unpublished_display_placeholder_image) {
      cy.get(`@${this._alias}`).should('have.attr', 'srcset');
    }
  }
}
