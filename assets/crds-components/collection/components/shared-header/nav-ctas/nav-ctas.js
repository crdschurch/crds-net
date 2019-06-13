export class NavCtas {
    render() {
        if (this.active)
            return null;
        return (h("div", { class: "ctas" },
            h("h3", null, "Happening at Crossroads"),
            h("a", { href: "#", "data-automation-id": "sh-undivided", class: "cta" },
                h("div", { class: "cta-image" },
                    h("img", { src: "https://via.placeholder.com/300x225.png?text=placeholder" })),
                h("div", { class: "cta-content" },
                    h("h4", null, "Undivided"),
                    h("p", null, "A journey on race, relationship, and reconciliation."))),
            h("a", { href: "#", "data-automation-id": "sh-sheets", class: "cta" },
                h("div", { class: "cta-image" },
                    h("img", { src: "https://via.placeholder.com/300x225.png?text=placeholder" })),
                h("div", { class: "cta-content" },
                    h("h4", null, "Wash the Sheets, Skip the Advice"),
                    h("p", null, "Kim Botto"))),
            h("a", { href: "#", "data-automation-id": "sh-lead", class: "cta" },
                h("div", { class: "cta-image" },
                    h("img", { src: "https://via.placeholder.com/300x225.png?text=placeholder" })),
                h("div", { class: "cta-content" },
                    h("h4", null, "LEAD A GO LOCAL PROJECT"),
                    h("p", null, "Sign up before Monday, March 4"))),
            h("a", { href: "", "data-automation-id": "sh-more-updates", class: "more-updates" }, "more updates")));
    }
    static get is() { return "nav-ctas"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "active": {
            "type": String,
            "attr": "active"
        },
        "href": {
            "type": String,
            "attr": "href"
        }
    }; }
    static get style() { return "/**style-placeholder:nav-ctas:**/"; }
}
