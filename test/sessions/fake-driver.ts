import { FakeWebElement } from "../containers/fake-web-element";
import { FakeLocator } from "../containers/fake-locator";

export class FakeDriver {
    elements: FakeWebElement[] = [];

    async findElements(locator: FakeLocator): Promise<FakeWebElement[]> {
        let elements: FakeWebElement[] = [];
        for (var i=0; i<this.elements.length; i++) {
            let el: FakeWebElement = this.elements[i];
            if (el.locator.using == locator.using && el.locator.value == locator.value) {
                elements.push(el);
            }
        }
        return elements;
    }
}