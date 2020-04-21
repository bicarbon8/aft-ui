import { ISession } from "../../src/sessions/isession";
import { ISessionOptions } from "../../src/sessions/isession-options";
import { FakeDriver } from "./fake-driver";
import { TestLog, TestLogOptions, Wait } from "aft-core";
import { FakeWebElement } from "../facets/fake-web-element";
import { FakeLocator } from "../facets/fake-locator";
import { TestPlatform } from "../../src/configuration/test-platform";
import { UiConfig } from "../../src/configuration/ui-config";
import { IFacet } from "../../src/facets/ifacet";
import { IElementOptions } from "../../src/sessions/ielement-options";

export class FakeSession implements ISession<FakeDriver, FakeWebElement, FakeLocator> {
    location: string;
    disposeCount: number = 0;
    disposeErrors: Error[] = [];

    private options: ISessionOptions;
    private driver: FakeDriver;
    private platform: TestPlatform;
    private logger: TestLog;
    
    async initialise(options: ISessionOptions): Promise<void> {
        this.options = options;
    }

    async getDriver(): Promise<FakeDriver> {
        if (!this.driver) {
            this.driver = this.options.driver || new FakeDriver();
        }
        return this.driver;
    }

    async getElements(locator: FakeLocator, options?: IElementOptions): Promise<FakeWebElement[]> {
        let elements: FakeWebElement[];
        let duration: number = options?.maxWaitMs || await UiConfig.loadWaitDuration();
        await Wait.forCondition(async () => {
            elements = await this.getDriver()
                .then(async (d) => {return await d.findElements(locator);});
            return true;
        }, duration);
        return elements;
    }

    async getPlatform(): Promise<TestPlatform> {
        if (!this.platform) {
            this.platform = this.options.platform || await UiConfig.platform();
        }
        return this.platform;
    }

    async getLogger(): Promise<TestLog> {
        if (!this.logger) {
            this.logger = this.options.logger || new TestLog(new TestLogOptions(FakeSession.name));
        }
        return this.logger;
    }

    async dispose(err?: Error): Promise<void> {
        this.disposeCount++;
        this.disposeErrors.push(err);
    }
}