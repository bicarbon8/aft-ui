import { SessionOptions } from "../../src/sessions/session-options";

export module SessionTestHelper {
    export var options: SessionOptions[] = [];

    export function generateCalledWith(opts: SessionOptions): void {
        options.push(opts);
    }

    export function reset(): void {
        options = [];
    }
}