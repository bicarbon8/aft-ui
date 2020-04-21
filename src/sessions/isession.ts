import { ISessionOptions } from "./isession-options";
import { IDisposable, TestLog } from "aft-core";
import { TestPlatform } from "../configuration/test-platform";
import { IElementOptions } from "./ielement-options";

export interface ISession<Td, Te, Tl> extends IDisposable {
    initialise(options: ISessionOptions): Promise<void>;
    getDriver(): Promise<Td>;
    getElements(locator: Tl, options?: IElementOptions): Promise<Te[]>;
    getPlatform(): Promise<TestPlatform>;
    getLogger(): Promise<TestLog>;
}