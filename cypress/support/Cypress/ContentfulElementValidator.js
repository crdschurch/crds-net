import { Formatter } from '../Formatter';
//handles required/not required when verifying content elements

export class ContentfulElementValidator{
    static shouldContainText(element, textFieldObject){
        if(textFieldObject.required || textFieldObject.hasContent){
            element.should('have.prop', 'textContent').then($elementText => {
                expect(Formatter.normalizeText($elementText)).to.contain(textFieldObject.normalized);
            });
        }
    }

    static shouldHaveImgixImage(element, imageFieldObject){
        element.then($img => {
            expect($img).to.have.attr('srcset'); //If this fails, Imgix was not run

            if(imageFieldObject.required || imageFieldObject.hasContent){
                expect($img).to.have.attr('src').contains(imageFieldObject.id);
            }
        });
    }
}