import { Formatter } from '../../Formatter';
import { ContentfulField } from './ContentfulField';

export class TextField extends ContentfulField{
    constructor(text){
        super(text);
    }

    get text(){
        return this.hasContent ? this._content : '';
    }

    get normalized(){
        if(this._normalized === undefined){
            this._normalized = Formatter.normalizeText(this._content);
        }

        return this._normalized;
    }
}