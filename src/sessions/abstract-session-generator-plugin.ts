import { nameof } from "ts-simple-nameof";
import { AbstractPlugin, IPluginOptions, LoggingPluginManager } from "../../../aft-core/src";
import { TestPlatform } from "../configuration/test-platform";
import { ISession, ISessionOptions } from "./isession";

export interface ISessionGeneratorPluginOptions extends IPluginOptions {
    /**
     * [OPTIONAL] allows for specifying the OS, OS Version, Browser,
     * Browser Version and Device Name to be used. If not set, the
     * SessionGenerator will inject the value from UiConfig.platform()
     */
    platform?: TestPlatform;

    /**
     * [OPTIONAL] if not specified a new {LoggingPluginManager} will be created using
     * the Class name as the {logName}
     */
    _logMgr?: LoggingPluginManager;
}

export abstract class AbstractSessionGeneratorPlugin<Td, Te, Tl> extends AbstractPlugin<ISessionGeneratorPluginOptions> {
    readonly logMgr: LoggingPluginManager;
    private _platform: TestPlatform;
    constructor(key: string, options?: ISessionGeneratorPluginOptions) {
        super(key, options);
        this.logMgr = options?._logMgr || new LoggingPluginManager({logName: this.constructor.name});
    }
    async getPlatform(): Promise<TestPlatform> {
        if (!this._platform) {
            this._platform = await this.optionsMgr.getOption(nameof<ISessionGeneratorPluginOptions>(o => o.platform), new TestPlatform());
        }
        return this._platform;
    }
    abstract newSession<T extends ISession<Td, Te, Tl>>(options?: ISessionOptions<Td>): Promise<T>;
}