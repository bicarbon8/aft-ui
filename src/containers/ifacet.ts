import { FacetLocator } from "./facet-locator";
import { Func } from "aft-core";

export interface IFacet {
    deferredRoot: Func<void, any>
    cachedRoot: any;
    find(locator: FacetLocator): Promise<IFacet[]>;
    enabled(): Promise<boolean>;
    displayed(): Promise<boolean>;
    click(): Promise<void>;
    text(input?: string): Promise<string>;
    attribute(key: string): Promise<string>;
}