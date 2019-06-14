import '../../stencil.core';
export declare class HeartButton {
    /**
     * Print log messages?
     */
    private debug;
    /**
     * Logger instance
     */
    private console;
    /**
     * Contentful config
     */
    private config;
    /**
     * Cache key for localStorage
     */
    private key;
    /**
     * Unique identifier for likeable resource
     */
    private id;
    /**
     * Total number of hearts
     */
    private count;
    /**
     * Boolean indicating whether likeable resource has been liked
     */
    private isLiked;
    /**
     * Emphemeral array object for managing updates to localStorage
     */
    private _likes;
    /**
     * Fires before render...
     */
    componentWillLoad(): void;
    /**
     * Returns total number of likes from Contentful
     */
    getCount(): Promise<any>;
    /**
     * Return count value, abbreviated for large numbers
     */
    private abbrevCount;
    /**
     * Returns array of all liked ids from localStorage
     */
    private likes;
    /**
     * Handle storage addition/removal of likeable resource ID
     * @param e Event
     */
    private toggle;
    /**
     * Removes current ID from localStorage
     */
    private remove;
    /**
     * Add current ID to localStorage
     */
    private add;
    removeDuplicates(arr: any): {}[];
    /**
     * Persist array of IDs to localStorage
     * @param arr Array of likeable resource IDs
     */
    private save;
    /**
     * Returns service endpoint
     */
    private endpoint;
    /**
     * HTML
     */
    render(): JSX.Element;
}
