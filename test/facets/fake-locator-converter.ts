import { FakeLocator } from "./fake-locator";
import { FacetLocator, FacetLocatorType } from "../../src";

export module FakeLocatorConverter {
    export function toFacetLocator(loc: FakeLocator): FacetLocator {
        switch (loc.using) {
            case 'css':
                return FacetLocator.css(loc.value);
            default:
                throw new Error(`unhandled FakeLocator.using of ${loc.using} supplied`);
        }
    }
    
    export function fromFacetLocator(loc: FacetLocator): FakeLocator {
        switch (loc.type) {
            case FacetLocatorType.css:
                return FakeLocator.css(loc.value);
            default:
                throw new Error(`unhandled FacetLocator.type of ${FacetLocatorType[loc.type]} supplied`);
        }
    }
}