import { ISession } from "./isession";
import { SessionOptions } from "./session-options";
import { UiConfig } from "../configuration/ui-config";
import { PluginLoader } from "aft-core";

export module SessionGenerator {
    /**
     * instantiates a new Session using the 'session_provider' specified in 
     * configuration or the passed in SessionOptions
     * @param options optional set of configuration used when generating the session.
     * if not specified, the values from UiConfig will be used instead
     */
    export async function get(options?: SessionOptions): Promise<ISession> {
        if (!options) {
            options = new SessionOptions();
            options.platform = await UiConfig.platform();
            options.provider = await UiConfig.provider();
        }
        let sessions: ISession[] = await PluginLoader.load<ISession>(options.provider || await UiConfig.provider());
        if (sessions && sessions.length > 0) {
            try {
                sessions[0].initialise(options);
                return sessions[0];
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(`no ISession implementation named '${options.provider}' could be found`);
    }
}