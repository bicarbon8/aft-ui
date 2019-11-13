import { WidgetOptions } from './widget-options'
import { Wait } from 'aft-core';
import { ISession } from '../sessions/isession';
import { IFacet } from './ifacet';
import { FacetLocator } from './facet-locator';

export abstract class Widget {
    container: ISession;
    index: number;
    maxWaitMs: number;
    cacheRootElement: boolean;
    
    abstract locator: FacetLocator;
    abstract async isDoneLoading(): Promise<boolean>;

    private cachedRoot: IFacet;

    constructor(options?: WidgetOptions) {
        if (!options) {
            options = new WidgetOptions();
        }
        this.container = options.sessionManager;
        this.index = options.index;
        this.maxWaitMs = options.maxWaitMs;
        this.cacheRootElement = options.cacheRootElement;
    }

    async getRoot(): Promise<IFacet> {
        if (this.cacheRootElement && this.cachedRoot) {
            return Promise.resolve(this.cachedRoot);
        }

        await Wait.forCondition(async () => {
            let possibleRoots: IFacet[] = await this.container.find(this.locator);
            if (possibleRoots.length > this.index) {
                let el: IFacet = possibleRoots[this.index];
                if (el) {
                    this.cachedRoot = el;
                    return true;
                }
                    
                throw "unable to locate root element using: '" + this.locator.toString() + "'";
            }
            return false;
        }, this.maxWaitMs);

        return Promise.resolve(this.cachedRoot);
    }

    async getWidget<T extends Widget>(c: new (options: WidgetOptions) => T, options?: WidgetOptions): Promise<T> {
        if (!options) {
            options = new WidgetOptions(this.container);
        }
        let widget: T = new c(options);
        await widget.waitUntilDoneLoading();

        return widget;
    }

    async find(locator: FacetLocator): Promise<IFacet[]> {
        try {
            let root: IFacet = await this.getRoot();
            return await root.find(locator);
        } catch (e) {
            return [];
        }
    }

    async findFirst(locator: FacetLocator): Promise<IFacet> {
        let facets: IFacet[] = await this.find(locator);
        return facets[0];
    }

    async waitUntilDoneLoading(msDuration?: number): Promise<void> {
        if (!msDuration) {
            msDuration = 10000;
        }
        await Wait.forCondition(async () => {
            let done: boolean = await this.isDoneLoading();
            return done;
        }, msDuration);
    }
}