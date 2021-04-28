import { nameof } from "ts-simple-nameof";
import { ISession, AbstractSessionGeneratorPlugin, ISessionGeneratorPluginOptions } from "../../src";
import { FakeLocator } from "../facets/fake-locator";
import { FakeWebElement } from "../facets/fake-web-element";
import { FakeDriver } from "./fake-driver";
import { FakeSession, FakeSessionOptions } from "./fake-session";

export interface FakeSessionGeneratorPluginOptions extends ISessionGeneratorPluginOptions {

}

export class FakeSessionGeneratorPlugin extends AbstractSessionGeneratorPlugin<FakeDriver, FakeWebElement, FakeLocator> {
    onLoadCount: number;
    
    constructor(options?: FakeSessionGeneratorPluginOptions) {
        super(nameof(FakeSessionGeneratorPlugin).toLowerCase(), options);
        this.onLoadCount++;
    }

    async onLoad(): Promise<void> {
        /* do nothing */
    }

    async newSession<T extends ISession<FakeDriver, FakeWebElement, FakeLocator>>(options?: FakeSessionOptions): Promise<T> {
        if (await this.enabled()) {
            let session: FakeSession = new FakeSession({
                driver: options?.driver || new FakeDriver(),
                logMgr: options?.logMgr || this.logMgr
            });
            return session as unknown as T;
        }
        return null;
    }

    async dispose(error?: Error): Promise<void> {
        /* do nothing */
    }
}