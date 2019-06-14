export declare class Logger {
    private debug;
    /**
     * @param output Boolean
     */
    constructor(output?: boolean);
    /**
     * Log a message to the console if debug=true
     * @param ns String
     * @param msg String (optional)
     */
    log(ns: any, msg?: string): void;
}
