import { Formatter } from '../Formatter';

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

    static shouldHaveImgixImage(element, imageFieldObject){
        element.then($img => {
            expect($img).to.have.attr('srcset'); //If this fails, Imgix was not run

            if(imageFieldObject.isRequiredOrHasContent){
                expect($img).to.have.attr('src').contains(imageFieldObject.id);
            }
        });
    }
}