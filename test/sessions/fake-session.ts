import { FakeDriver } from "./fake-driver";
import { LoggingPluginManager } from "../../../aft-core/src";
import { FakeWebElement } from "../facets/fake-web-element";
import { FakeLocator } from "../facets/fake-locator";
import { IFacet } from "../../src/facets/ifacet";
import { IFacetOptions, ISession, ISessionOptions } from "../../src";

export interface FakeSessionOptions extends ISessionOptions<FakeDriver> {

}

export class FakeSession implements ISession<FakeDriver, FakeWebElement, FakeLocator> {
    disposeCount: number;
    disposeErrors: Error[];
    goToStrings: string[];
    refreshCount: number;
    resizeValues: object[];

    readonly driver: FakeDriver;
    readonly logMgr: LoggingPluginManager;
    
    constructor(options: FakeSessionOptions) {
        this.driver = options.driver;
        this.logMgr = options.logMgr;
        this.disposeCount = 0;
        this.disposeErrors = [];
        this.goToStrings = [];
        this.refreshCount = 0;
        this.resizeValues = [];
    }

    async getFacet<T extends IFacet<FakeDriver, FakeWebElement, FakeLocator>>(facetType: new (options: IFacetOptions<FakeDriver, FakeWebElement, FakeLocator>) => T, options?: IFacetOptions<FakeDriver, FakeWebElement, FakeLocator>): Promise<T> {
        if (!options) {
            options = {};
        }
        if (!options.session) {
            options.session = this;
        }
        let facet: T = new facetType(options);
        return facet;
    }

    async goTo(url: string): Promise<void> {
        this.goToStrings.push(url);
    }

    async refresh(): Promise<void> {
        this.refreshCount++;
    }

    async resize(width: number, height: number): Promise<void> {
        this.resizeValues.push({w: width, h: height});
    }

    async dispose(err?: Error): Promise<void> {
        this.disposeCount++;
        this.disposeErrors.push(err);
    }
}