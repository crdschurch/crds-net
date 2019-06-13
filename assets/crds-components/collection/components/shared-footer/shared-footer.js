import Fragment from 'stencil-fragment';
import axios from 'axios';
export class SharedFooter {
    constructor() {
        this.env = 'prod';
        this.data = [];
    }
    componentWillLoad() {
        const url = this.src || `https://crds-data.netlify.com/shared-footer/${this.env}.json`;
        axios.get(url).then(response => (this.data = response.data));
    }
    renderElement(el) {
        if (!el.path)
            return el.title;
        let attrs = {
            target: el.path.match(/:\/\//) ? '_blank' : '',
            href: el.path
        };
        if (el['automation-id'])
            attrs['data-automation-id'] = el['automation-id'];
        return h("a", Object.assign({}, attrs), el.img ? h("img", { src: el.img, alt: el.title, title: el.title }) : el.title);
    }
    renderGroups(groups) {
        const groupMarkup = groups.map(group => {
            if (!group.children)
                return h("li", null, this.renderElement(group));
            return (h(Fragment, null,
                h("p", null, group.title),
                h("ul", null, group.children.map(el => (h("li", null, this.renderElement(el)))))));
        });
        const Tag = groups.filter(g => g.children).length > 0 ? 'Fragment' : 'ul';
        return h(Tag, null, groupMarkup);
    }
    renderColumns() {
        return this.data.map(column => (h("div", { class: column.class },
            h("h5", null, this.renderElement(column)),
            this.renderGroups(column.children))));
    }
    render() {
        if (this.data.length === 0)
            return null;
        return (h("footer", null,
            h("div", { class: "container" }, this.renderColumns())));
    }
    static get is() { return "shared-footer"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "state": true
        },
        "env": {
            "type": String,
            "attr": "env"
        },
        "src": {
            "type": String,
            "attr": "src"
        }
    }; }
    static get style() { return "/**style-placeholder:shared-footer:**/"; }
}
