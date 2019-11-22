import { FakeWebElement } from "../containers/fake-web-element";
import { FakeDriver } from "./fake-driver";
import { FakeSession } from "./fake-session";
import { SessionOptions } from "../../src/sessions/session-options";
import { IFacet } from "../../src/containers/ifacet";
import { FacetLocator } from "../../src/containers/facet-locator";
import { FakeLocator } from "../containers/fake-locator";

describe('ISession', () => {
    it('can implement auto-refresh from Driver on cached element exception', async () => {
        let element: FakeWebElement = new FakeWebElement();
        element.locator = FakeLocator.css('div.fake');
        element.displayed = true;
        element.enabled = true;
        spyOn(element, "findElements").and.callThrough();
        let driver: FakeDriver = new FakeDriver();
        driver.elements.push(element);
        spyOn(driver, "findElements").and.callThrough();
        let session: FakeSession = new FakeSession();
        let sOpts: SessionOptions = new SessionOptions(driver);
        session.initialise(sOpts);
        spyOn(session, "find").and.callThrough();

        let facets: IFacet[] = await session.find(FacetLocator.css('div.fake'));
        let facet: IFacet = facets[0];

        expect(await facet.displayed()).toBe(true);

        spyOn(element, 'isDisplayed').and.throwError('fake stale element error');

        expect(await facet.enabled()).toBe(true);
        expect(driver.findElements).toHaveBeenCalledTimes(3);
    });
});