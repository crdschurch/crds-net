//TODO make these commands? can have separate command file???
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
      cy.get(`@${this._alias}`).should('have.attr', 'src').and('contain', imageAsset.sys_id);
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
      cy.get(`@${this._alias}`).should('have.attr', 'src').and('contain', imageAsset.sys_id);
    }
    else if (this._if_unpublished_display_placeholder_image) {
      cy.get(`@${this._alias}`).should('have.attr', 'srcset');
    }
  }
  jumbotronShouldHaveImages(foregroundImageAsset, backgroundImageAsset) {
    cy.get(`@${this._alias}`).first().scrollIntoView();

    if (backgroundImageAsset !== undefined && backgroundImageAsset.isPublished) {
      cy.get(`@${this._alias}`).should('have.attr', 'style').and('contain', backgroundImageAsset.sys_id);
    } else if (foregroundImageAsset !== undefined && foregroundImageAsset.isPublished) {
      cy.get(`@${this._alias}`).find('div').should('have.attr', 'style').and('contain', foregroundImageAsset.sys_id);
    }
  }
}