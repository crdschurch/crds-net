export class Utils {
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
