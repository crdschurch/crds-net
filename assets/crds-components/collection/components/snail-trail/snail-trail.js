import axios from 'axios';
export class SnailTrail {
    constructor() {
        this.env = 'prod';
        this.data = [];
    }
    componentWillLoad() {
        const url = this.src || `https://crds-data.netlify.com/snail-trails/${this.name}/${this.env}.json`;
        axios.get(url).then(response => (this.data = response.data));
    }
    listItems() {
        return this.data.map(item => {
            if (typeof item === 'string')
                return h("span", null, item);
            let attrs = { href: item.path };
            if (item['automation-id'])
                attrs['data-automation-id'] = item['automation-id'];
            return (h("li", null,
                h("a", Object.assign({}, attrs), item.title)));
        });
    }
    render() {
        if (this.data.length === 0)
            return null;
        return (h("nav", null,
            h("div", null,
                h("ul", null, this.listItems()))));
    }
    static get is() { return "snail-trail"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "state": true
        },
        "env": {
            "type": String,
            "attr": "env"
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "src": {
            "type": String,
            "attr": "src"
        }
    }; }
    static get style() { return "/**style-placeholder:snail-trail:**/"; }
}
