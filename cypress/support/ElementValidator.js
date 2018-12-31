import { Formatter } from './Formatter'

export class ElementValidator {
    static elementHasText(element, text){
        element.should('be.visible')
        .then($elm =>{
            expect($elm).to.have.text(text);
        })
    }

    static elementHasTextAndLink(element, text, link){
        element.should('be.visible')
        .then($elm =>{
            expect($elm).to.have.text(text);
            expect($elm).to.have.attr('href', link);
        })
    }

    static hiddenElementHasTextAndLink(element, text, link){
        element.should('not.be.visible')
        .then($elm =>{
            expect($elm).to.have.text(text);
            expect($elm).to.have.attr('href', link);
        })
    }

    static elementContainsSubstringOfText(element, text){
        element.should('be.visible')
        .should('have.prop', 'textContent').then($text => {
            expect(text).to.contain(Formatter.normalizeText($text));
        })
    }

    static elementHasImgixImage(element, imageId){
        element.should('be.visible')
        .then($img =>{
            expect($img).to.have.attr('srcset'); //If this fails, Imgix was not run

            if (imageId !== undefined){
                expect($img).to.have.attr('src').contains(imageId);
            }
        })
    }

    static elementHasImgixImageAndLink(element, imageId, link){
        element.then($elm => {
            expect($elm).to.have.attr('href', link);
        })

        this.elementHasImgixImage(element.find('img'), imageId);
    }
}