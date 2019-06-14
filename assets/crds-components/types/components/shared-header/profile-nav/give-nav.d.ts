import '../../../stencil.core';
export declare class GiveMenu {
    giveNavIsShowing: boolean;
    data: JSON;
    handleClick(event: any): void;
    renderSections: (payload: any) => JSX.Element;
    render(): JSX.Element;
}
