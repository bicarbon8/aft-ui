import { FakeSession } from "./fake-session";
import { FakeDriver } from "./fake-driver";
import { ISessionOptions, IElementOptions } from "../../src";
import { FakeWebElement } from "../facets/fake-web-element";
import { FakeLocator } from "../facets/fake-locator";
import { Wait } from "aft-core";

describe('ISession', () => {
    it('can return specified type of elements from the contained driver', async () => {
        let fd: FakeDriver = new FakeDriver();
        let findElementsSpy = spyOn(fd, 'findElements').and.returnValue(Promise.resolve([new FakeWebElement()]));
        let fs: FakeSession = new FakeSession();
        fs.initialise({
            driver: fd
        } as ISessionOptions);
        let getDriverSpy = spyOn(fs, 'getDriver').and.callThrough();

        let actualEls: FakeWebElement[] = await fs.getElements(FakeLocator.css('div.fake'));

        expect(actualEls).not.toBeNull();
        expect(actualEls).not.toBeUndefined();
        expect(actualEls.length).toBe(1);
        expect(getDriverSpy).toHaveBeenCalledTimes(1);
        expect(findElementsSpy).toHaveBeenCalledTimes(1);
    });

    it('can handle additional options on the call to get elements', async () => {
        let fd: FakeDriver = new FakeDriver();
        let findElementsSpy = spyOn(fd, 'findElements').and.callFake(returnElementsAfterThreeTries);
        let fs: FakeSession = new FakeSession();
        fs.initialise({
            driver: fd
        } as ISessionOptions);
        let getDriverSpy = spyOn(fs, 'getDriver').and.callThrough();

        let actualEls: FakeWebElement[] = await fs.getElements(FakeLocator.css('div.fake'), {maxWaitMs: 10000} as IElementOptions);

        expect(actualEls).not.toBeNull();
        expect(actualEls).not.toBeUndefined();
        expect(actualEls.length).toBe(2);
        expect(getDriverSpy).toHaveBeenCalledTimes(3);
        expect(findElementsSpy).toHaveBeenCalledTimes(3);
    });
});

var attempt: number = 0;
async function returnElementsAfterThreeTries(one: any, two?: any): Promise<FakeWebElement[]> {
    if (attempt++ >= 2) {
        attempt = 0;
        return [new FakeWebElement(), new FakeWebElement()];
    }
    await Wait.forDuration(1000);
    throw new Error(`will throw error until attempts is 3 or more: ${attempt}`);
}