import '../../stencil.core';
export declare class SharedFooter {
    src: string;
    env: string;
    data: Array<any>;
    componentWillLoad(): void;
    private renderElement;
    private renderGroups;
    private renderColumns;
    render(): JSX.Element;
}
