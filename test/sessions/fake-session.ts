import { ISession } from "../../src/sessions/isession";
import { SessionOptions } from "../../src/sessions/session-options";
import { FakeDriver } from "./fake-driver";
import { FakeWebElement } from "../containers/fake-web-element";
import { IFacet, FacetLocator } from "../../src";
import { FakeLocatorConverter } from "../containers/fake-locator-converter";
import { FakeFacet } from "../containers/fake-facet";
import { Func } from "aft-core";
import { FakeLocator } from "../containers/fake-locator";

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
            let index: number = i;
            let deferred: Func<void, Promise<FakeWebElement>> = async () => {
                let driver: FakeDriver = await this.getDriver();
                let loc: FakeLocator = FakeLocatorConverter.fromFacetLocator(locator);
                let elements: FakeWebElement[] = await driver.findElements(loc);
                return elements[index];
            };
            let facet: FakeFacet = new FakeFacet(deferred);
            facet.cachedRoot = await Promise.resolve(deferred());
            facets.push(facet);
        }
        return facets;
    }
    
    async goTo(location: any): Promise<any> {
        this.location = location;
    }

    async refresh(): Promise<void> {
        await this.getDriver().then((d) => d.refresh());
    }

    async resize(width: number, height: number): Promise<void> {
        await this.getDriver().then((d) => d.resize(width, height));
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