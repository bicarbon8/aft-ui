import { ISession } from "./isession";
import { SessionOptions } from "./session-options";
import { UiConfig } from "../configuration/ui-config";

export interface ISessionGenerator {
    /**
     * the name of the ISession implementation this Generator
     * generates
     */
    provides: string;
    generate(options: SessionOptions): Promise<ISession>;
}

export namespace ISessionGenerator {
    type Constructor<T> = {
        new (...args: any[]): T;
        readonly prototype: T;
    }
    
    const generators: ISessionGenerator[] = [];

    export async function get(options?: SessionOptions): Promise<ISession> {
        if (!options) {
            options = new SessionOptions();
            options.platform = await UiConfig.platform();
            options.provider = await UiConfig.provider();
        }
        for (var i=0; i<generators.length; i++) {
            if (generators[i] && generators[i].provides == options.provider) {
                return await generators[i].generate(options);
            }
            return Promise.reject(`no ISessionGenerator named '${options.provider}' could be found`);
        }
    }
    
    export function register<T extends Constructor<ISessionGenerator>>(ctor: T) {
        generators.push(new ctor());
    }
}