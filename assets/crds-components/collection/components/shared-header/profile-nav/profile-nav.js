export class ProfileMenu {
    constructor() {
        this.profileNavIsShowing = true;
    }
    envUrl(path) {
        return `${process.env.CRDS_BASE_URL}${path}`;
    }
    handleClick(event) {
        event.stopPropagation();
    }
    render() {
        if (!this.profileNavIsShowing)
            return null;
        return (h("div", { class: "profile-nav" },
            h("div", { class: "profile-nav-img", style: {
                    backgroundImage: `linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%),url('${this.currentUser.avatarUrl}')`
                } }),
            h("div", null,
                h("h2", null,
                    "Hello ",
                    this.currentUser.name.split(' ')[0]),
                h("ul", null,
                    h("li", { class: "top-level" },
                        h("a", { href: this.envUrl('/profile/personal'), "data-automation-id": "sh-my-accounts" }, "My account")),
                    h("li", { class: "top-level" },
                        h("a", { href: this.envUrl('/me/giving'), "data-automation-id": "sh-giving" }, "Giving")),
                    h("li", { class: "top-level" },
                        h("a", { href: "javascript:void(0)", onClick: e => this.onSignOut(e), "data-automation-id": "sh-sign-out" }, "Sign out"))),
                h("h4", null, "Get involved"),
                h("ul", null,
                    h("li", null,
                        h("a", { "data-automation-id": "sh-my-students-camps", href: this.envUrl('/mycamps') }, "My student\u2019s camps")),
                    h("li", null,
                        h("a", { "data-automation-id": "sh-sign-up-to-serve", href: this.envUrl('/serve/signup') }, "Sign up to serve")),
                    h("li", null,
                        h("a", { "data-automation-id": "sh-my-groups", href: this.envUrl('/groups/search/my') }, "My groups")),
                    h("li", null,
                        h("a", { "data-automation-id": "sh-my-trips", href: this.envUrl('/trips/mytrips') }, "My trips"))),
                h("h4", null, "Events"),
                h("ul", null,
                    h("li", null,
                        h("a", { href: this.envUrl('/events'), "data-automation-id": "sh-event-check-in" }, "Event check in")),
                    h("li", null,
                        h("a", { href: this.envUrl('/childcare'), "data-automation-id": "sh-childcare" }, "Childcare (for events)"))))));
    }
    static get is() { return "profile-nav"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "config": {
            "type": "Any",
            "attr": "config"
        },
        "currentUser": {
            "type": "Any",
            "attr": "current-user"
        },
        "onSignOut": {
            "type": "Any",
            "attr": "on-sign-out"
        },
        "profileNavIsShowing": {
            "type": Boolean,
            "attr": "profile-nav-is-showing"
        }
    }; }
    static get listeners() { return [{
            "name": "click",
            "method": "handleClick"
        }]; }
    static get style() { return "/**style-placeholder:profile-nav:**/"; }
}
