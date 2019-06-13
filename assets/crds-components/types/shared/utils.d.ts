export declare class Utils {
    /**
     * Returns content metatag who's property matches "prop"
     * @param prop Value of metatags prop attribute
     */
    static getMeta(prop: any): string;
    /**
     * Returns a parameterized string
     * @param {String} str
     */
    static parameterize(str: any): any;
    /**
     * Returns the value of a cookie after looking up by name
     * @param {String} name
     */
    static getCookie(name: any): string;
}
