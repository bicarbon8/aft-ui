import { FakeSession } from "../sessions/fake-session";
import { FakeDriver } from "../sessions/fake-driver";
import { FakeWebElement } from "./fake-web-element";
import { FakeLocator } from "./fake-locator";
import { SessionOptions } from "../../src/sessions/session-options";
import { FakeWidget } from "./fake-widget";
import { ContainerOptions } from "../../src/containers/container-options";
import { IFacet } from "../../src/containers/ifacet";

describe('Widget', () => {
    it('will lookup root from ISession', async () => {
        let element1: FakeWebElement = new FakeWebElement();
        element1.locator = FakeLocator.css('div.fake1');
        element1.displayed = true;
        spyOn(element1, "findElements").and.callThrough();
        let element2: FakeWebElement = new FakeWebElement();
        element2.locator = FakeLocator.css('div.fake2');
        element2.displayed = true;
        element1.elements.push(element2);
        element1.elements.push(element1);
        element2.elements.push(element1);
        element2.elements.push(element2);
        let driver: FakeDriver = new FakeDriver();
        driver.elements.push(element1);
        driver.elements.push(element2);
        spyOn(driver, "findElements").and.callThrough();
        let session: FakeSession = new FakeSession();
        let sOpts: SessionOptions = new SessionOptions(driver);
        session.initialise(sOpts);
        spyOn(session, "find").and.callThrough();

        let wOpts: ContainerOptions = new ContainerOptions(session);
        let widget: FakeWidget = new FakeWidget(wOpts);

        await widget.waitUntilDoneLoading();

        expect(session.find).toHaveBeenCalled();
        expect(driver.findElements).toHaveBeenCalled();
    });

    it('can get sub-elements from root', async () => {
        let element1: FakeWebElement = new FakeWebElement();
        element1.locator = FakeLocator.css('div.fake1');
        element1.displayed = true;
        spyOn(element1, "findElements").and.callThrough();
        let element2: FakeWebElement = new FakeWebElement();
        element2.locator = FakeLocator.css('div.fake2');
        element2.displayed = true;
        element1.elements.push(element2);
        element1.elements.push(element1);
        element2.elements.push(element1);
        element2.elements.push(element2);
        let driver: FakeDriver = new FakeDriver();
        driver.elements.push(element1);
        driver.elements.push(element2);
        spyOn(driver, "findElements").and.callThrough();
        let session: FakeSession = new FakeSession();
        let sOpts: SessionOptions = new SessionOptions(driver);
        session.initialise(sOpts);
        spyOn(session, "find").and.callThrough();

        let wOpts: ContainerOptions = new ContainerOptions(session);
        let widget: FakeWidget = new FakeWidget(wOpts);

        let facet: IFacet = await widget.getDivFake2();

        expect(facet).not.toBeNull();
        expect(facet.cachedRoot).toEqual(element2);
        expect(session.find).toHaveBeenCalled();
        expect(driver.findElements).toHaveBeenCalled();
    });
});