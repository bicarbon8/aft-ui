export interface TestPlatform {
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    deviceName?: string;
}

export class TestPlatform {
    constructor(options?: TestPlatform) {
        this.os = options?.os;
        this.osVersion = options?.osVersion;
        this.browser = options?.browser;
        this.browserVersion = options?.browserVersion;
        this.deviceName = options?.deviceName;
    }

    toString(): string {
        let str: string = '';
        str += (this.os) ? this.os : TestPlatform.ANY;
        str += '_';
        str += (this.osVersion) ? this.osVersion : TestPlatform.ANY;
        str += '_';
        str += (this.browser) ? this.browser : TestPlatform.ANY;
        str += '_';
        str += (this.browserVersion) ? this.browserVersion : TestPlatform.ANY;
        str += '_';
        str += (this.deviceName) ? this.deviceName : TestPlatform.ANY;
        return str;
    }
}

export module TestPlatform {
    export var ANY = '+';

    export function parse(input: string): TestPlatform {
        let tp: TestPlatform = new TestPlatform();

        if (input) {
            let parts: string[] = input.split('_');
            if (parts.length > 0) {
                tp.os = (parts[0] != TestPlatform.ANY) ? parts[0] : null;
            }
            if (parts.length > 1) {
                tp.osVersion = (parts[1] != TestPlatform.ANY) ? parts[1] : null;
            }
            if (parts.length > 2) {
                tp.browser = (parts[2] != TestPlatform.ANY) ? parts[2] : null;
            }
            if (parts.length > 3) {
                tp.browserVersion = (parts[3] != TestPlatform.ANY) ? parts[3] : null;
            }
            if (parts.length > 4) {
                tp.deviceName = (parts[4] != TestPlatform.ANY) ? parts[4] : null;
            }
        }

        return tp;
    }
}