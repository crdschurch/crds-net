import { Formatter } from '../../Formatter';

//TODO start with descriptions
export class TextField {
    constructor(text){
        this._content = text;
        this._has_content = text === undefined ? false : true;
    }

    //Can make put these in a parent?
    set required(is_required){
        this._is_required = is_required;
    }

    get required(){
        if(this._is_required === undefined)
            this._is_required = false;
        return this._is_required;
    }

    get hasContent(){
        return this._has_content;
    }

    //Unique to this field
    get text(){
        return this.hasContent ? this._content : '';
    }

    get normalized(){
        if(this._normalized === undefined){
            this._normalized = Formatter.normalizeText(this._content);
        }

        return this._normalized;
    }
    //is required
    //has content?
    // if is required and does not have content - issue is with Contentful, but if element doesn't have content when contentful does, is issue
    // if is not required and does not have content, see if empty?
}

/*
what if undefined?
what if empty string?
*/