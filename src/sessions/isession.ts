import { IDisposable, LoggingPluginManager } from "aft-core";
import { IFacet, IFacetOptions } from "../facets/ifacet";

export interface ISessionOptions<Td> {
    /**
     * required to instantiate a valid {ISession<any, any, any>}
     */
    driver?: Td;
    /**
     * required to keep continuity between {ISession<any, any, any>} 
     * and {IFacet<any, any, any>} logging
     */
    logMgr?: LoggingPluginManager;
}

export interface ISession<Td, Te, Tl> extends IDisposable {
    readonly driver: Td;
    readonly logMgr: LoggingPluginManager;
    getFacet<T extends IFacet<Td, Te, Tl>>(facetType: new (options: IFacetOptions<Td, Te, Tl>) => T, options?: IFacetOptions<Td, Te, Tl>): Promise<T>;
    goTo(url: string): Promise<void>;
    refresh(): Promise<void>;
    resize(width: number, height: number): Promise<void>;
}