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

  static shouldHaveImgixImage(alias, imageFieldObject) {
    cy.get(`@${alias}`).scrollIntoView();
    cy.get(`@${alias}`).should('be.visible').and('have.attr', 'srcset');

    if (imageFieldObject.isRequiredOrHasContent) {
      cy.get(`@${alias}`).should('have.attr', 'src').and('contain', imageFieldObject.id);
    }
  }

  //scrollIntoView is not always able to target the 'img' level, so this scrolls to a higher level element before testing the 'img' content
  static shouldHaveImgixImageFindImg(alias, imageFieldObject) {
    cy.get(`@${alias}`).scrollIntoView();
    cy.get(`@${alias}`).find('img').should('be.visible').and('have.attr', 'srcset');

    if (imageFieldObject.isRequiredOrHasContent) {
      cy.get(`@${alias}`).find('img').should('have.attr', 'src').and('contain', imageFieldObject.id);
    }
  }
}