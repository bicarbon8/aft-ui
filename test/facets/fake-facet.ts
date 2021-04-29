import { FakeWebElement } from "./fake-web-element";
import { AbstractFacet } from "../../src/facets/abstract-facet";
import { FakeDriver } from "../sessions/fake-driver";
import { wait } from "aft-core";
import { FakeLocator } from "./fake-locator";
import { IElementOptions } from "../../src/sessions/ielement-options";
import { IFacet, IFacetOptions } from "../../src";

export class FakeFacet extends AbstractFacet<FakeDriver, FakeWebElement, FakeLocator> {
    async isDoneLoading(): Promise<boolean> {
        return await this.getRoot().then(async (r) => {return await r.isDisplayed();});
    }

    async getRoot(): Promise<FakeWebElement> {
        let r: FakeWebElement;
        await wait.untilTrue(async () => {
            if (this.parent) {
                r = await this.parent.getRoot().then(async (p) => {
                    return await p.findElements(this.locator)[this.index];
                });
            } else {
                r = await this.session.driver.findElements(this.locator)[this.index];
            }
            return true;
        }, this.maxWaitMs);
        return r;
    }

    async getElements(options: IElementOptions<FakeLocator>): Promise<FakeWebElement[]> {
        let elements: FakeWebElement[];
        let duration: number = (options.maxWaitMs === undefined) ? this.maxWaitMs : options.maxWaitMs;
        await wait.untilTrue(async () => {
            elements = await this.getRoot().then(async (r) => {
                return await r.findElements(options.locator);
            });
            return elements.length > 0;
        }, duration);
        return elements;
    }

    async getElement(options: IElementOptions<FakeLocator>): Promise<FakeWebElement> {
        let element: FakeWebElement;
        let duration: number = (options.maxWaitMs === undefined) ? this.maxWaitMs : options.maxWaitMs;
        await wait.untilTrue(async () => {
            element = await this.getRoot().then(async (r) => {
                return await r.findElement(options.locator);
            });
            return !!element;
        }, duration);
        return element;
    }

    async getFacet<T extends IFacet<FakeDriver, FakeWebElement, FakeLocator>>(facetType: new (options: IFacetOptions<FakeDriver, FakeWebElement, FakeLocator>) => T, options?: IFacetOptions<FakeDriver, FakeWebElement, FakeLocator>): Promise<T> {
        if (!options) {
            options = {};
        }
        if (!options.parent) {
            options.parent = this;
        }
        if (!options.session) {
            options.session = this.session;
        }
        let facet: T = new facetType(options);
        return facet;
    }
}