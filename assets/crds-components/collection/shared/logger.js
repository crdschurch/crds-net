export class Logger {
    constructor(output = false) {
        this.debug = output;
    }
    log(ns, msg = '') {
        if (this.debug) {
            console.log(ns, msg);
        }
    }
}
