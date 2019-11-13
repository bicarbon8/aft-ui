import { IFacetProvider } from "../../src/containers/ifacet-provider";
import { WebElement } from "selenium-webdriver";
import { IFacet } from "../../src/containers/ifacet";
import { FakeFacet } from "./fake-facet";

@IFacetProvider.register
export class FakeFacetProvider implements IFacetProvider {
    name: string = 'fakefacetprovider';
    
    async supports(element: any): Promise<boolean> {
        if (this.isWebElement(element)) {
            return true;
        }
        return false;
    }

    async provide(element: any): Promise<IFacet> {
        if (this.isWebElement(element)) {
            return new FakeFacet(element);
        }
        return Promise.reject('unsupported element type supplied to function');
    }

    private isWebElement(element: any): boolean {
        return element instanceof WebElement || (element['isDisplayed'] && element['isEnabled'] && element['findElements'] && element['click']);
    }
}