import { IElementOptions } from "../sessions/ielement-options";
import { LoggingPluginManager } from "../../../aft-core/src";
import { ISession } from "../sessions/isession";

export interface IFacetOptions<Td, Te, Tl> {
    /**
     * [OPTIONAL] defaults to 0 if not set
     */
    index?: number;
    /**
     * required to keep continuity between {ISession<any, any, any>} 
     * and {IFacet<any, any, any>} logging
     */
    logMgr?: LoggingPluginManager;
    /**
     * [OPTIONAL] only if explicitly assigned in the {IFacet<any, any, any>}
     * implementation; otherwise required
     */
    locator?: Tl;
    /**
     * [OPTIONAL] will default to 5000 ms if not set
     */
    maxWaitMs?: number;
    /**
     * [OPTIONAL] if not set it is assumed this is a top-level
     * facet and the {getRoot} call will use the {session} for
     * element lookups
     */
    parent?: IFacet<Td, Te, Tl>
    /**
     * required to instantiate a valid {IFacet<any, any, any>}
     */
    session?: ISession<Td, Te, Tl>;
}

export interface IFacet<Td, Te, Tl> {
    readonly session: ISession<Td, Te, Tl>;
    readonly logMgr: LoggingPluginManager;
    readonly maxWaitMs: number;
    readonly index: number;
    readonly parent: IFacet<Td, Te, Tl>;
    readonly locator: Tl;
    
    /**
     * the underlying UI element that this IFacet represents
     */
    getRoot(): Promise<Te>;

    /**
     * returns an array of elements found within this facet's root and
     * based on the passed in locator
     * @param options the options to use in identifying one or more element
     */
    getElements(options: IElementOptions<Tl>): Promise<Te[]>;

    /**
     * returns the first element found within this facet's root and
     * based on the passed in locator
     * @param options the options to use in identifying an element
     */
    getElement(options: IElementOptions<Tl>): Promise<Te>;

    /**
     * returns a new IFacet based on the passed in options with a parent
     * of this facet
     * @param options the options to use in setting up this facet
     */
    getFacet<T extends IFacet<Td, Te, Tl>>(facetType: new () => T, options?: IFacetOptions<Td, Te, Tl>): Promise<T>;
}