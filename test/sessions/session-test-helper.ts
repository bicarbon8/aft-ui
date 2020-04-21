import { ISessionOptions } from "../../src/sessions/isession-options";

export module SessionTestHelper {
    export var options: ISessionOptions[] = [];

    export function generateCalledWith(opts: ISessionOptions): void {
        options.push(opts);
    }

    export function reset(): void {
        options = [];
    }
}