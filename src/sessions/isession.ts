import { SessionOptions } from "./session-options";
import { IDisposable } from "aft-core";
import { IFacet } from "../containers/ifacet";
import { FacetLocator } from "../containers/facet-locator";

export interface ISession extends IDisposable {
    initialise(options: SessionOptions): Promise<void>;
    find(locator: FacetLocator): Promise<IFacet[]>;
    goTo(location: any): Promise<any>;
}