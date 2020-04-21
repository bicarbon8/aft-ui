import { Wait } from 'aft-core';
import { IFacet } from './ifacet';
import { UiConfig } from '../configuration/ui-config';
import { IFacetOptions } from './ifacet-options';
import { ISession } from '../sessions/isession';
import { IElementOptions } from '../sessions/ielement-options';

export abstract class AbstractFacet<Td, Te, Tl> implements IFacet<Td, Te, Tl> {
    abstract isDoneLoading(): Promise<boolean>;
    abstract getElements(locator: Tl, options?: IElementOptions): Promise<Te[]>;

    protected options: IFacetOptions;

    async initialise(options: IFacetOptions): Promise<void> {
        this.options = options;
    }

    async getParent(): Promise<ISession<Td, Te, Tl> | IFacet<Td, Te, Tl>> {
        return await Promise.resolve(this.options.parent);
    }

    async getRoot(): Promise<Te> {
        return await Promise.resolve(this.options.root) as unknown as Te;
    }

    async getIndex(): Promise<number> {
        return this.options.index || 0;
    }

    async getMaxWaitMs(): Promise<number> {
        return this.options.maxWaitMs || await UiConfig.loadWaitDuration();
    }

    async waitUntilDoneLoading(msDuration?: number): Promise<void> {
        if (!msDuration) {
            msDuration = await UiConfig.loadWaitDuration();
        }
        await Wait.forCondition(async () => {
            let done: boolean = await this.isDoneLoading();
            return done;
        }, msDuration);
    }
}