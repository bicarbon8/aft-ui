import { LoggingPluginManager, rand } from '../../../aft-core/src';
import { IFacet, IFacetOptions } from './ifacet';
import { IElementOptions } from '../sessions/ielement-options';
import { ISession } from '../sessions/isession';

export abstract class AbstractFacet<Td, Te, Tl> implements IFacet<Td, Te, Tl> {
    readonly session: ISession<Td, Te, Tl>;
    readonly logMgr: LoggingPluginManager;
    readonly maxWaitMs: number;
    readonly index: number;
    readonly parent: IFacet<Td, Te, Tl>;
    readonly locator: Tl;
    
    constructor(options: IFacetOptions<Td, Te, Tl>) {
        this.locator = this.locator || options.locator;
        this.session = options.session;
        this.logMgr = options.logMgr || new LoggingPluginManager({ logName: `${this.constructor.name}_${rand.guid}` });
        this.parent = options.parent;
        this.maxWaitMs = (options.maxWaitMs === undefined) ? 10000 : options.maxWaitMs;
        this.index = (options.index === undefined) ? 0 : options.index;
    }

    abstract getElements(options?: IElementOptions<Tl>): Promise<Te[]>;
    abstract getElement(options?: IElementOptions<Tl>): Promise<Te>;
    abstract getFacet<T extends IFacet<Td, Te, Tl>>(facetType: new () => T, options?: IFacetOptions<Td, Te, Tl>): Promise<T>;
    abstract getRoot(): Promise<Te>;
}