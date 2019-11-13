import { FacetLocator } from "./facet-locator";

export interface IFacet {
    root: any;
    find(locator: FacetLocator, searchDuration?: number): Promise<IFacet[]>;
    enabled(): Promise<boolean>;
    displayed(): Promise<boolean>;
    click(): Promise<void>;
    text(input?: string): Promise<string>;
    attribute(key: string): Promise<string>;
}