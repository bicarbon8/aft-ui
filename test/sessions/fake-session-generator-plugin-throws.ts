import { AbstractSessionGeneratorPlugin } from "../../src/sessions/abstract-session-generator-plugin";
import { FakeWebElement } from "../facets/fake-web-element";
import { FakeLocator } from "../facets/fake-locator";
import { FakeDriver } from "./fake-driver";
import { ISessionOptions, ISession } from "../../src";
import { STH } from "./session-test-helper";
import { FakeSessionGeneratorPluginOptions } from "./fake-session-generator-plugin";
import { nameof } from "ts-simple-nameof";

export class FakeSessionGeneratorPluginThrows extends AbstractSessionGeneratorPlugin<FakeDriver, FakeWebElement, FakeLocator> {
    constructor(options?: FakeSessionGeneratorPluginOptions) {
        STH.onLoadCalledWith(options);
        super(nameof(FakeSessionGeneratorPluginThrows).toLowerCase(), options);
    }
    async onLoad(): Promise<void> {
        /* do nothing */
    }
    newSession<T extends ISession<FakeDriver, FakeWebElement, FakeLocator>>(options?: ISessionOptions<FakeDriver>): Promise<T> {
        throw new Error("Method not implemented.");
    }
    async dispose(error?: Error): Promise<void> {
        /* do nothing */
    }
}