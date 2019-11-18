import { IFacet } from "../../src/containers/ifacet";
import { FacetLocator } from "../../src/containers/facet-locator";
import { Wait } from "aft-core";
import { IFacetProvider } from "../../src/containers/ifacet-provider";
import { FacetLocatorType } from "../../src/containers/facet-locator-type";
import { FakeWebElement } from "./fake-web-element";
import { FakeLocator } from "./fake-locator";

export class FakeFacet implements IFacet {
    root: FakeWebElement;

    constructor(element: FakeWebElement) {
        this.root = element;
    }
    
    async find(locator: FacetLocator, searchDuration?: number): Promise<IFacet[]> {
        let facets: IFacet[] = [];
        let loc: FakeLocator = this.getFakeLocatorForFacetLocator(locator);
        if (!searchDuration) {
            searchDuration = 1000;
        }
        
        await Wait.forCondition(async (): Promise<boolean> => {
            let elements: FakeWebElement[] = await this.root.findElements(loc);
            facets = await IFacetProvider.process(...elements);
            return elements.length > 0 && facets.length == elements.length;
        }, searchDuration);

        return facets;
    }

    private getFakeLocatorForFacetLocator(locator: FacetLocator): FakeLocator {
        switch(locator.locatorType) {
            case FacetLocatorType.css:
                return FakeLocator.css(locator.locatorValue);
            default:
                throw new Error(`unknown type of '${locator.locatorType}' provided`);
        }
    }

    async enabled(): Promise<boolean> {
        return await this.root.isEnabled();
    }

    async displayed(): Promise<boolean> {
        return await this.root.isDisplayed();
    }

    async click(): Promise<void> {
        await this.root.click();
    }

    async text(input?: string): Promise<string> {
        if (input) {
            this.root.sendKeys(input);
        }
        return await this.root.getText();
    }

    async attribute(key: string): Promise<string> {
        return await this.root.getAttribute(key);
    }
}