import '../../../stencil.core';
export declare class NavigationSection {
    id: string;
    activeSection: any;
    isActive: boolean;
    private onActivate;
    /**
     * Print log messages?
     */
    private debug;
    private console;
    private config;
    componentWillLoad(): void;
    render(): JSX.Element;
}
