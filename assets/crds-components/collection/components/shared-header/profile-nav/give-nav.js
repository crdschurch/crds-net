export class GiveMenu {
    constructor() {
        this.giveNavIsShowing = true;
        this.renderSections = payload => {
            let top_level = false;
            return (h("div", null,
                h("h2", null,
                    " ",
                    payload.title,
                    " "),
                payload.children.map(child => {
                    top_level = top_level || typeof child == 'string';
                    return (h("div", { style: { padding: '0' } },
                        typeof child == 'string' && h("h4", null, child),
                        typeof child != 'string' && (h("ul", null, child.map(el => {
                            if (typeof el != 'string')
                                return (h("li", { class: top_level ? 'top-level' : '' },
                                    h("a", { href: el.path, "automation-id": el['automation-id'] },
                                        " ",
                                        el.title)));
                        })))));
                })));
        };
    }
    handleClick(event) {
        event.stopPropagation();
    }
    render() {
        if (!this.giveNavIsShowing)
            return null;
        return (h("div", { class: "give-nav", style: { backgroundImage: `url(${this.data.background_img})` } }, this.renderSections(this.data)));
    }
    static get is() { return "give-nav"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data"
        },
        "giveNavIsShowing": {
            "type": Boolean,
            "attr": "give-nav-is-showing"
        }
    }; }
    static get listeners() { return [{
            "name": "click",
            "method": "handleClick"
        }]; }
    static get style() { return "/**style-placeholder:give-nav:**/"; }
}
