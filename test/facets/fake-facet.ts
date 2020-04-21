import { FakeWebElement } from "./fake-web-element";
import { AbstractFacet } from "../../src/facets/abstract-facet";
import { FakeDriver } from "../sessions/fake-driver";
import { Wait } from "aft-core";
import { FakeLocator } from "./fake-locator";
import { IElementOptions } from "../../src/sessions/ielement-options";

export class FakeFacet extends AbstractFacet<FakeDriver, FakeWebElement, FakeLocator> {
    locator: FakeLocator = FakeLocator.css('div.fake');

    async isDoneLoading(): Promise<boolean> {
        return await this.getRoot().then(async (r) => {return await r.isDisplayed();});
    }

    async getRoot(): Promise<FakeWebElement> {
        let r: FakeWebElement = await super.getRoot();
        if (!r) {
            Wait.forCondition(async () => {
                let els: FakeWebElement[] = await this.getParent()
                    .then(async (p) => {return await p.getElements(this.locator);});
                r = els[await this.getIndex()];
                return true;
            }, await this.getMaxWaitMs());
        }
        return r;
    }

    async getElements(locator: FakeLocator, options?: IElementOptions): Promise<FakeWebElement[]> {
        let elements: FakeWebElement[];
        let duration: number = options?.maxWaitMs || await this.getMaxWaitMs();
        await Wait.forCondition(async () => {
            elements = await this.getRoot()
                .then(async (r) => {return r.findElements(locator);});
            return true;
        }, duration);
        return elements;
    }
}