import { SessionOptions } from "./session-options";
import { IDisposable } from "aft-core";
import { FacetLocator } from "../containers/facet-locator";
import { IFacet } from "../containers/ifacet";

export interface ISession extends IDisposable {
    initialise(options: SessionOptions): Promise<void>;
    find(locator: FacetLocator): Promise<IFacet[]>;
    goTo(location: any): Promise<any>;
}