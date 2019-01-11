import { Formatter } from '../support/Formatter';

//handles required/not required when verifying content elements
export class ContentfulElementValidator{
    static shouldContainText(element, textFieldObject){
        if(textFieldObject.isRequiredOrHasContent){
            element.should('have.prop', 'textContent').then($elementText => {
                expect(Formatter.normalizeText($elementText)).to.contain(textFieldObject.normalized);
            });
        }
    }

    static shouldMatchSubsetOfText(element, textFieldObject){
        if(textFieldObject.isRequiredOrHasContent){
            element.should('have.prop', 'textContent').then($elementText => {
                expect(textFieldObject.normalized).to.contain(Formatter.normalizeText($elementText));
            });
        }
    }

    static shouldHaveImgixImage(alias, imageFieldObject){
        cy.get(`@${alias}`).scrollIntoView();
        cy.get(`@${alias}`).should('have.attr', 'srcset');

        if(imageFieldObject.isRequiredOrHasContent){
            cy.get(`@${alias}`).should('have.attr', 'src').and('contain', imageFieldObject.id);
        }
    }

    static shouldHaveImgixImageFindImg(alias, imageFieldObject){
        cy.get(`@${alias}`).scrollIntoView();
        cy.get(`@${alias}`).find('img').should('have.attr', 'srcset');

        if(imageFieldObject.isRequiredOrHasContent){
            cy.get(`@${alias}`).find('img').should('have.attr', 'src').and('contain', imageFieldObject.id);
        }
    }
}