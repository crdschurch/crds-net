import { Formatter } from '../support/Formatter';

//handles required/not required when verifying content elements
export class ContentfulElementValidator {
  static shouldContainText(element, textFieldObject) {
    if (textFieldObject.isRequiredOrHasContent) {
      element.should('be.visible');
      element.should('have.prop', 'textContent').then($elementText => {
        expect(Formatter.normalizeText($elementText)).to.contain(textFieldObject.normalized);
      });
    }
  }

  static shouldMatchSubsetOfText(element, textFieldObject) {
    if (textFieldObject.isRequiredOrHasContent) {
      element.should('be.visible');
      element.should('have.prop', 'textContent').then($elementText => {
        expect(textFieldObject.normalized).to.contain(Formatter.normalizeText($elementText));
      });
    }
  }

  static shouldHaveImgixImage(element, imageFieldObject) {
    element.scrollIntoView();
    element.as('image');
    cy.get('@image').should('be.visible').and('have.attr', 'srcset');

    if (imageFieldObject.isRequiredOrHasContent) {
      cy.get('@image').should('have.attr', 'src').and('contain', imageFieldObject.id);
    }
  }

  //scrollIntoView is not always able to target the 'img' level, so this scrolls to a higher level element before testing the 'img' content
  static shouldHaveImgixImageFindImg(element, imageFieldObject) {
    element.scrollIntoView();
    element.find('img').as('image');
    cy.get('@image').should('be.visible').and('have.attr', 'srcset');

    if (imageFieldObject.isRequiredOrHasContent) {
      cy.get('@image').should('have.attr', 'src').and('contain', imageFieldObject.id);
    }
  }
}