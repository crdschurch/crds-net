import '../../stencil.core';
export declare class SharedHeader {
    src: string;
    env: string;
    active: string;
    mainNavIsShowing: boolean;
    profileNavIsShowing: boolean;
    giveNavIsShowing: boolean;
    data: any;
    /**
     * Fires before render...
     */
    componentWillLoad(): void;
    /**
     * Section onClick event handler
     * @param e Event
     * @param id string
     */
    protected onClick(e: any, id: any): void;
    /**
     * Renders all sections from payload
     */
    private renderSections;
    handleBackClick(event: any): void;
    /**
     * Returns all subnav elements
     * @param payload
     */
    private renderSubnavs;
    /**
     * Returns header or unordered list
     * @param section
     */
    private renderChildren;
    toggleMenu(event: any, navType: any): void;
    closeMenus(event: any): void;
    navClasses(): string;
    navCloseClasses(): string;
    handleScroll(event: any): void;
    /**
     * HTML
     */
    render(): JSX.Element;
}
