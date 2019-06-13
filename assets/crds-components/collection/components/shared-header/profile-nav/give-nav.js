export class GiveMenu {
    constructor() {
        this.giveNavIsShowing = true;
    }
    handleClick(event) {
        event.stopPropagation();
    }
    render() {
        if (!this.giveNavIsShowing)
            return null;
        return (h("div", { class: "give-nav" },
            h("div", null,
                h("h2", null, "Give"),
                h("ul", null,
                    h("li", { class: "top-level" },
                        h("a", { href: "#", "data-automation-id": "sh-give-now" }, "Give now")),
                    h("li", { class: "top-level" },
                        h("a", { href: "#", "data-automation-id": "sh-my-giving" }, "My giving"))),
                h("h4", null, "About giving"),
                h("ul", null,
                    h("li", null,
                        h("a", { href: "#", "data-automation-id": "sh-why-give" }, "Why give?")),
                    h("li", null,
                        h("a", { href: "#", "data-automation-id": "sh-other-ways" }, "Other ways to give"))))));
    }
    static get is() { return "give-nav"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
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
