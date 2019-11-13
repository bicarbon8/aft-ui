import { IFacet } from "../../src/containers/ifacet";
import { WebElement, By } from "selenium-webdriver";
import { FacetLocator } from "../../src/containers/facet-locator";
import { Wait } from "aft-core";
import { IFacetProvider } from "../../src/containers/ifacet-provider";
import { FacetLocatorType } from "../../src/containers/facet-locator-type";

export class FakeFacet implements IFacet {
    root: WebElement;

    constructor(element: WebElement) {
        this.root = element;
    }
    
    async find(locator: FacetLocator, searchDuration?: number): Promise<IFacet[]> {
        let facets: IFacet[] = [];
        let loc: By = this.getByForFacetLocator(locator);
        if (!searchDuration) {
            searchDuration = 1000; // TODO: set from configuration
        }
        
        await Wait.forCondition(async (): Promise<boolean> => {
            let elements: WebElement[] = await this.root.findElements(loc);
            facets = await IFacetProvider.process(...elements);
            return elements.length > 0 && facets.length == elements.length;
        }, searchDuration);

        return facets;
    }

    private getByForFacetLocator(locator: FacetLocator): By {
        switch(locator.locatorType) {
            case FacetLocatorType.css:
                return By.css(locator.locatorValue);
            case FacetLocatorType.id:
                return By.id(locator.locatorValue);
            case FacetLocatorType.xpath:
                return By.xpath(locator.locatorValue);
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

    async text(): Promise<string> {
        return await this.root.getText();
    }

    async attribute(key: string): Promise<string> {
        return await this.root.getAttribute(key);
    }
}