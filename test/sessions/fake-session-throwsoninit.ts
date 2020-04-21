import { ISession } from "../../src/sessions/isession";
import { ISessionOptions } from "../../src/sessions/isession-options";
import { FacetLocator } from "../../src/facets/facet-locator";
import { IFacet } from "../../src/facets/ifacet";
import { SessionTestHelper } from "./session-test-helper";
import { FakeWebElement } from "../facets/fake-web-element";
import { IFacetOptions, TestPlatform } from "../../src";
import { TestLog } from "aft-core";
import { FakeLocator } from "../facets/fake-locator";
import { FakeDriver } from "./fake-driver";
import { IElementOptions } from "../../src/sessions/ielement-options";

export class FakeSessionThrowsOnInit implements ISession<FakeDriver, FakeWebElement, FakeLocator> {
    initialise(options: ISessionOptions): Promise<void> {
        SessionTestHelper.options.push(options);
        throw new Error("Method not implemented.");
    }
    getDriver(): Promise<FakeDriver> {
        throw new Error("Method not implemented");
    }
    getPlatform(): Promise<TestPlatform> {
        throw new Error("Method not implemented");
    }
    getLogger(): Promise<TestLog> {
        throw new Error("Method not implemented");
    }
    getElements(locator: FakeLocator, options?: IElementOptions): Promise<FakeWebElement[]> {
        throw new Error("Method not implemented");
    }
    dispose(error?: Error): Promise<void> {
        throw new Error("Method not implemented.");
    }
}