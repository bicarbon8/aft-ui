import { IFacetProvider } from "../../src/containers/ifacet-provider";
import { IFacet } from "../../src/containers/ifacet";
import { FakeFacet } from "./fake-facet";
import { FakeWebElement } from "./fake-web-element";

@IFacetProvider.register
export class FakeFacetProvider implements IFacetProvider {
    name: string = FakeFacet.name;
    
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
        return element instanceof FakeWebElement;
    }
}