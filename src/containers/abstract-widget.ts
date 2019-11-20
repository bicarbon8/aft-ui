import { ContainerOptions } from './container-options'
import { Wait } from 'aft-core';
import { ISession } from '../sessions/isession';
import { IFacet } from './ifacet';
import { FacetLocator } from './facet-locator';

export abstract class AbstractWidget {
    parent: IFacet | ISession;
    index: number;
    maxWaitMs: number;
    
    abstract locator: FacetLocator;
    abstract async isDoneLoading(): Promise<boolean>;

    private cachedRoot: IFacet;

    constructor(options?: ContainerOptions) {
        if (!options) {
            options = new ContainerOptions();
        }
        this.parent = options.parent;
        this.index = options.index;
        this.maxWaitMs = options.maxWaitMs;
    }

    async getRoot(): Promise<IFacet> {
        if (this.cachedRoot) {
            return this.cachedRoot;
        }

        await Wait.forCondition(async () => {
            let possibleRoots: IFacet[] = await this.parent.find(this.locator);
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

        return this.cachedRoot;
    }

    async getWidget<T extends AbstractWidget>(c: new (options: ContainerOptions) => T, options?: ContainerOptions): Promise<T> {
        if (!options) {
            options = new ContainerOptions(this.parent);
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
        if (facets.length > 0) {
            return facets[0];
        }
        throw new Error(`unable to find IFacet using FacetLocator ${locator}`);
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