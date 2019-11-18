export class FakeLocator {
    using: string;
    value: string;
    constructor(using: string, value: string) {
        this.using = using;
        this.value = value;
    }
}

export module FakeLocator {
    export function css(value: string): FakeLocator {
        return new FakeLocator('css', value);
    }
}