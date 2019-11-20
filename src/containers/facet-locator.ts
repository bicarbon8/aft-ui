import { FacetLocatorType } from "./facet-locator-type";

export class FacetLocator {
    type: FacetLocatorType;
    value: string;
    constructor(locType: FacetLocatorType, locVal: string) {
        this.type = locType;
        this.value = locVal;
    }

    toString() {
        return `type: '${FacetLocatorType[this.type]}', value: '${this.value}'`;
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