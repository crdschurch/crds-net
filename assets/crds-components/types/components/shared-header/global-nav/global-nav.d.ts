import '../../../stencil.core';
export declare class GlobalNav {
    config: Object;
    env: string;
    giveNavIsShowing: boolean;
    href: string;
    mainNavIsShowing: boolean;
    navClickHandler: Function;
    profileNavIsShowing: boolean;
    authenticated: boolean;
    auth: any;
    subdomainMap: {
        prod: string;
    };
    initAuth(): void;
    authChangeCallback(): void;
    handleSignOut(): void;
    handleProfileClick(event: any): any;
    menuClasses(): string;
    profileClasses(): string;
    giveClasses(): string;
    render(): JSX.Element;
}
