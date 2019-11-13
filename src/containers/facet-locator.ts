import { FacetLocatorType } from "./facet-locator-type";

export class FacetLocator {
    locatorType: FacetLocatorType;
    locatorValue: string;
    constructor(locType: FacetLocatorType, locVal: string) {
        this.locatorType = locType;
        this.locatorValue = locVal;
    }
}

export module FacetLocator {
    export function css(css: string): FacetLocator {
        return new FacetLocator(FacetLocatorType.css, css);
    }
    export function xpath(xpath: string): FacetLocator {
        return new FacetLocator(FacetLocatorType.xpath, xpath);
    }
    export function id(id: string): FacetLocator {
        return new FacetLocator(FacetLocatorType.id, id);
    }
}