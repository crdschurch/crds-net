
export class ImageField{
    constructor(text){
        this._content = text;
        this._has_content = text === undefined ? false : true;
    }
}