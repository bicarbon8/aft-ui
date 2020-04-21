import { ISession } from "./isession";
import { ISessionOptions } from "./isession-options";
import { UiConfig } from "../configuration/ui-config";
import { PluginLoader } from "aft-core";

export module SessionGenerator {
    /**
     * instantiates a new Session using the 'session_provider' specified in 
     * configuration or the passed in SessionOptions
     * @param options optional set of configuration used when generating the session.
     * if not specified, the values from UiConfig will be used instead
     */
    export async function get(options?: ISessionOptions): Promise<ISession<any, any, any>> {
        if (!options) {
            options = {} as ISessionOptions;
        }
        options.platform = options.platform || await UiConfig.platform();
        options.provider = options.provider || await UiConfig.provider();
        let sessions: ISession<any, any, any>[] = await PluginLoader.load<ISession<any, any, any>>(options.provider);
        if (sessions && sessions.length > 0) {
            try {
                await sessions[0].initialise(options);
                return sessions[0];
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(`no ISession implementation named '${options.provider}' could be found`);
    }
}