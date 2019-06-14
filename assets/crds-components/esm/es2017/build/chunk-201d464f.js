import { h } from '../crds-components.core.js';

class Logger {
    constructor(output = false) {
        this.debug = output;
    }
    log(ns, msg = '') {
        if (this.debug) {
            console.log(ns, msg);
        }
    }
}

class Utils {
    static getMeta(prop) {
        let el = document.querySelector(`meta[property*="${prop}"]`);
        if (el) {
            return el.getAttribute('content');
        }
    }
    static parameterize(str) {
        return str
            .toLowerCase()
            .replace(/[^a-z]/g, '-')
            .replace(/-{2,}/g, '-');
    }
    static getCookie(name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length == 2)
            return parts
                .pop()
                .split(';')
                .shift();
    }
}

class Config {
    space_id() {
        return Utils.getMeta('cfl:space_id') || "";
    }
    env() {
        return Utils.getMeta('cfl:env') || "" || 'master';
    }
    token() {
        return Utils.getMeta('cfl:token') || "";
    }
    endpoint() {
        return `https://cdn.contentful.com/spaces/${this.space_id()}/environments/${this.env()}`;
    }
}

export { Logger as a, Config as b, Utils as c };
