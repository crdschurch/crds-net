import { Logger } from '../../../shared/logger';
import { Config } from '../../../shared/config';
export class NavigationSection {
    constructor() {
        this.isActive = false;
        this.debug = true;
    }
    componentWillLoad() {
        this.console = new Logger(this.debug);
        this.config = new Config();
    }
    render() {
        return (h("li", null,
            h("a", { onClick: e => this.onActivate(e, this.id), "data-automation-id": `sh-section-${this.id}`, class: this.isActive ? 'is-active' : '' },
                h("slot", null))));
    }
    static get is() { return "nav-section"; }
    static get properties() { return {
        "activeSection": {
            "type": "Any",
            "attr": "active-section",
            "mutable": true
        },
        "id": {
            "type": String,
            "attr": "id"
        },
        "isActive": {
            "type": Boolean,
            "attr": "is-active"
        },
        "onActivate": {
            "type": "Any",
            "attr": "on-activate"
        }
    }; }
    static get style() { return "/**style-placeholder:nav-section:**/"; }
}
