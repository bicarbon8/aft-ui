import { IFacet } from "../../src/containers/ifacet";
import { FacetLocator } from "../../src/containers/facet-locator";
import { FacetLocatorType } from "../../src/containers/facet-locator-type";
import { FakeWebElement } from "./fake-web-element";
import { FakeLocator } from "./fake-locator";
import { FakeLocatorConverter } from "./fake-locator-converter";
import { Func } from "aft-core";

export class FakeFacet implements IFacet {
    deferredRoot: Func<void, Promise<FakeWebElement>>;
    cachedRoot: FakeWebElement;

    constructor(deferred: Func<void, Promise<FakeWebElement>>, element?: FakeWebElement) {
        this.deferredRoot = deferred;
        this.cachedRoot = element;
    }
    
    async find(locator: FacetLocator): Promise<IFacet[]> {
        let facets: IFacet[] = [];
        let loc: FakeLocator = this.getFakeLocatorForFacetLocator(locator);
        
        let elements: FakeWebElement[] = await this.getRootElement().then((root) => root.findElements(loc));
        for (var i=0; i<elements.length; i++) {
            let index: number = i;
            let deferred: Func<void, Promise<FakeWebElement>> = async () => {
                let root: FakeWebElement = await this.getRootElement();
                let loc: FakeLocator = FakeLocatorConverter.fromFacetLocator(locator);
                let elements: FakeWebElement[] = await root.findElements(loc);
                return elements[index];
            };
            let facet: FakeFacet = new FakeFacet(deferred);
            facet.cachedRoot = await Promise.resolve(deferred());
            facets.push(facet);
        }

        return facets;
    }

    private getFakeLocatorForFacetLocator(locator: FacetLocator): FakeLocator {
        switch(locator.type) {
            case FacetLocatorType.css:
                return FakeLocator.css(locator.value);
            default:
                throw new Error(`unknown type of '${locator.type}' provided`);
        }
    }

    async enabled(): Promise<boolean> {
        return await this.getRootElement().then((r) => r.isEnabled());
    }

    async displayed(): Promise<boolean> {
        return await this.getRootElement().then((r) => r.isDisplayed());
    }

    async click(): Promise<void> {
        await this.getRootElement().then((r) => r.click());
    }

    async text(input?: string): Promise<string> {
        if (input) {
            await this.getRootElement().then((r) => r.sendKeys(input));
        }
        return await this.getRootElement().then((r) => r.getText());
    }

    async attribute(key: string): Promise<string> {
        return await this.getRootElement().then((r) => r.getAttribute(key));
    }

    private async getRootElement(): Promise<FakeWebElement> {
        if (!this.cachedRoot) {
            this.cachedRoot = await Promise.resolve(this.deferredRoot());
        } else {
            try {
                // ensure cachedRoot is not stale
                await this.cachedRoot.isDisplayed();
            } catch (e) {
                this.cachedRoot = null;
                return await this.getRootElement();
            }
        }
        return this.cachedRoot;
    }
}