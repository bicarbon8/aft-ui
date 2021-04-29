import { AbstractPluginManager, IPluginManagerOptions } from "aft-core";
import { AbstractSessionGeneratorPlugin, ISessionGeneratorPluginOptions } from "./abstract-session-generator-plugin";
import { ISession, ISessionOptions } from "./isession";
import { nameof } from "ts-simple-nameof";

export interface ISessionGeneratorPluginManagerOptions extends ISessionGeneratorPluginOptions, IPluginManagerOptions {
    
}

/**
 * provides configuration values under a `sessiongeneratorpluginmanager` section containing:
 * * `platform` - _[optional]_ an object containing any, none or all of the following string values: _os_, _osVersion_, _browser_, _browserVersion_, _deviceName_
 * * `loadWaitDuration` - _[optional]_ a number representing the max milliseconds to wait for a UI element (defaults to 10000 ms)
 * * `pluginNames` - an array containing any {ISessionPlugin<any, any, any>} implementations to load (NOTE: only the first enabled will be used)
 * ```
 * {
 *   ...
 *   "sessiongeneratorpluginmanager": {
 *     "platform": {
 *       "os": "windows",
 *       "osVersion": "10",
 *       "browser": "chrome",
 *       "browserVersion": "87",
 *       "deviceName": "Google Pixel XL"
 *     },
 *     "loadWaitDuration": 30000,
 *     "pluginNames": ["some-custom-session-plugin"]
 *   }
 *   ...
 * }
 * ```
 */
export class SessionGeneratorPluginManager extends AbstractPluginManager<AbstractSessionGeneratorPlugin<any, any, any>, ISessionGeneratorPluginOptions> {
    constructor(options?: ISessionGeneratorPluginManagerOptions) {
        super(nameof(SessionGeneratorPluginManager).toLowerCase(), options);
    }
    
    /**
     * instantiates a new Session using the 'provider' specified in 
     * configuration or the passed in {ISessionPluginOptions}
     * @param options optional set of configuration used when generating the session.
     * if not specified, the values from {UiConfig} will be used instead
     */
    async newSession<T extends ISession<any, any, any>>(options?: ISessionOptions<any>): Promise<T> {
        let plugin: AbstractSessionGeneratorPlugin<any, any, any> = await this.getFirstEnabledPlugin();
        if (plugin) {
            try {
                return await plugin.newSession<T>(options);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(`no enabled ISessionPlugin implementation could be found in: [${(await this.optionsMgr.getOption<string[]>(nameof<IPluginManagerOptions>(p => p.pluginNames), [])).join(',')}]`);
    }
}

export module SessionGeneratorPluginManager {
    var _inst: SessionGeneratorPluginManager;
    export function instance(): SessionGeneratorPluginManager {
        if (!_inst) {
            _inst = new SessionGeneratorPluginManager();
        }
        return _inst;
    }
}