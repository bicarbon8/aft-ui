import { ISession } from "../../src/sessions/isession";
import { SessionOptions } from "../../src/sessions/session-options";
import { FakeDriver } from "./fake-driver";
import { FakeWebElement } from "../containers/fake-web-element";
import { IFacet, FacetLocator } from "../../src";
import { FakeLocatorConverter } from "../containers/fake-locator-converter";
import { FakeFacet } from "../containers/fake-facet";

export class FakeSession implements ISession {
    options: SessionOptions;
    location: any;
    disposeCount: number = 0;
    disposeErrors: Error[] = [];
    
    async initialise(options: SessionOptions): Promise<void> {
        this.options = options;
    }
    
    async find(locator: FacetLocator): Promise<IFacet[]> {
        let facets: IFacet[] = [];
        let elements: FakeWebElement[] = await this.getDriver().then((d) => d.findElements(FakeLocatorConverter.fromFacetLocator(locator)));
        for (var i=0; i<elements.length; i++) {
            let el: FakeWebElement = elements[i];
            let index: number = i;
            let f: FakeFacet = new FakeFacet(async (): Promise<FakeWebElement> => {
                return await this.getDriver().then((d) => d.findElements(FakeLocatorConverter.fromFacetLocator(locator)))[index];
            });
            f.cachedRoot = el;
            facets.push(f);
        }
        return facets;
    }
    
    async goTo(location: any): Promise<any> {
        this.location = location;
    }

    async dispose(err?: Error): Promise<void> {
        this.disposeCount++;
        if (err) {
            this.disposeErrors.push(err);
        }
    }

    private async getDriver(): Promise<FakeDriver> {
        return this.options.driver;
    }
}