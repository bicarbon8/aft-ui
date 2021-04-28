import { ISessionOptions, ISessionGeneratorPluginOptions } from "../../src";

export class SessionTestHelper {
    private _options: ISessionGeneratorPluginOptions[];
    private _opts: ISessionOptions<any>[];

    constructor() {
        this._options = [];
        this._opts = [];
    }

    onLoadCalledWith(opts: ISessionGeneratorPluginOptions): void {
        this._options.push(opts);
    }

    newSessionCalledWith(opts: ISessionOptions<any>): void {
        this._opts.push(opts);
    }

    reset(): void {
        this._options = [];
    }

    get options(): ISessionGeneratorPluginOptions[] {
        return this._options;
    }
}

export const STH = new SessionTestHelper();