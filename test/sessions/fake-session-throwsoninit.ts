import { ISession } from "../../src/sessions/isession";
import { SessionOptions } from "../../src/sessions/session-options";
import { FacetLocator } from "../../src/containers/facet-locator";
import { IFacet } from "../../src/containers/ifacet";
import { SessionTestHelper } from "./session-test-helper";

export class FakeSessionThrowsOnInit implements ISession {
    initialise(options: SessionOptions): Promise<void> {
        SessionTestHelper.options.push(options);
        throw new Error("Method not implemented.");
    }
    find(locator: FacetLocator): Promise<IFacet[]> {
        throw new Error("Method not implemented.");
    }
    goTo(location: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    refresh(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    resize(width: number, height: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    dispose(error?: Error): Promise<void> {
        throw new Error("Method not implemented.");
    }
}