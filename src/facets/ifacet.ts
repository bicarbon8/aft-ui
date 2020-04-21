import { IFacetOptions } from "./ifacet-options";
import { ISession } from "../sessions/isession";
import { IElementOptions } from "../sessions/ielement-options";

export interface IFacet<Td, Te, Tl> {
    getParent(): Promise<ISession<Td, Te, Tl> | IFacet<Td, Te, Tl>>
    /**
     * this number represents the specific element, out of all 
     * elements returned for the specified locator, that is
     * stored as the root property
     */
    getIndex(): Promise<number>;
    /**
     * the maximum amount of time to attempt to get elements using
     * the specified locator
     */
    getMaxWaitMs(): Promise<number>;
    /**
     * sets up this instance of an IFacet based on the passed in
     * options
     * @param options a set of configuration for initialisation
     */
    initialise(options: IFacetOptions): Promise<void>;
    /**
     * the underlying UI element that this IFacet represents
     */
    getRoot(): Promise<Te>;
    /**
     * returns an array of elements found within this facet's root and
     * based on the passed in locator
     * @param locator the locator to use in identifying one or more element
     */
    getElements(locator: Tl, options?: IElementOptions): Promise<Te[]>;
    /**
     * should immediately return a boolean indicating if the IContainer
     * has finished rendering. NOTE: do NOT add waits within this method
     * implementation as they will interfere with timing calculations
     */
    isDoneLoading(): Promise<boolean>;
    /**
     * will call the isDoneLoading method until it either returns true or the msDuration
     * has elapsed
     * @param msDuration the maximum number of milliseconds to wait
     */
    waitUntilDoneLoading(msDuration?: number): Promise<void>;
}