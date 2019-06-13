import '../../stencil.core';
export declare class SnailTrail {
    src: string;
    env: string;
    name: string;
    data: Array<any>;
    componentWillLoad(): void;
    listItems(): JSX.Element[];
    render(): JSX.Element;
}
