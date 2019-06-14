import '../../../stencil.core';
export declare class ProfileMenu {
    config: any;
    currentUser: any;
    onSignOut: Function;
    profileNavIsShowing: boolean;
    envUrl(path: any): string;
    handleClick(event: any): void;
    render(): JSX.Element;
}
