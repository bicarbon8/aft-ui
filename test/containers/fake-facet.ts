import { IFacet } from "../../src/containers/ifacet";
import { FacetLocator } from "../../src/containers/facet-locator";
import { Wait, Func } from "aft-core";
import { FacetLocatorType } from "../../src/containers/facet-locator-type";
import { FakeWebElement } from "./fake-web-element";
import { FakeLocator } from "./fake-locator";
import { FakeLocatorConverter } from "./fake-locator-converter";

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
            let el: FakeWebElement = elements[i];
            let index: number = i;
            let f: FakeFacet = new FakeFacet(async (): Promise<FakeWebElement> => {
                return await this.getRootElement().then((root) => root.findElements(FakeLocatorConverter.fromFacetLocator(locator)))[index];
            });
            f.cachedRoot = el;
            facets.push(f);
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
        return await this.cachedRoot.isEnabled();
    }

    async displayed(): Promise<boolean> {
        return await this.cachedRoot.isDisplayed();
    }

    async click(): Promise<void> {
        await this.cachedRoot.click();
    }

    async text(input?: string): Promise<string> {
        if (input) {
            this.cachedRoot.sendKeys(input);
        }
        return await this.cachedRoot.getText();
    }

    async attribute(key: string): Promise<string> {
        return await this.cachedRoot.getAttribute(key);
    }

    private async getRootElement(): Promise<FakeWebElement> {
        if (!this.cachedRoot) {
            this.cachedRoot = await Promise.resolve(this.deferredRoot());
        }
        return this.cachedRoot;
    }
}