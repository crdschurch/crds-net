export class NavSectionSubnav {
    render() {
        let chevronLeftLight = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" class="svg-inline--fa fa-chevron-left fa-w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"></path></svg>';
        return (h("div", { class: this.active == this.id ? '' : ' hidden' },
            h("a", { href: "", "data-automation-id": `sh-section-subnav-${this.id}`, class: "back", onClick: event => this.onBack(event) },
                h("span", { innerHTML: chevronLeftLight }),
                "Back"),
            h("slot", null)));
    }
    static get is() { return "nav-section-subnav"; }
    static get properties() { return {
        "active": {
            "type": String,
            "attr": "active",
            "mutable": true
        },
        "id": {
            "type": String,
            "attr": "id"
        },
        "onBack": {
            "type": "Any",
            "attr": "on-back"
        }
    }; }
    static get style() { return "/**style-placeholder:nav-section-subnav:**/"; }
}
