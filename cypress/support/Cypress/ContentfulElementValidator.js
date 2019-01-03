import { Formatter } from '../Formatter';
//handles required/not required when verifying content elements

export class ContentfulElementValidator{
    static containsText(element, textFieldObject){
        if(textFieldObject.required || textFieldObject.hasContent){
            element.should('have.prop', 'textContent').then($elementText => {
                expect(Formatter.normalizeText($elementText)).to.contain(textFieldObject.normalized);
            });
        }

    }
}