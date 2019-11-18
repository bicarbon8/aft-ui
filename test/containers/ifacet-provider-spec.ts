import { IFacetProvider } from "../../src/containers/ifacet-provider";
import { IFacet } from "../../src/containers/ifacet";
import './fake-facet-provider';
import { FacetLocator } from "../../src/containers/facet-locator";
import { FakeWebElement } from "./fake-web-element";
import { FakeLocator } from "./fake-locator";

describe('IFacetProvider', () => {
    it('can convert element using provider supporting supplied type', async () => {
        let element: FakeWebElement = new FakeWebElement();

        let facets: IFacet[] = await IFacetProvider.process(element);

        expect(facets.length).toBe(1);
        expect(facets[0].root).toBe(element);
    });

    it('can call methods on IFacet.root indirectly', async () => {
        let found: FakeWebElement = new FakeWebElement();
        found.locator = FakeLocator.css('div.fake');
        let element: FakeWebElement = new FakeWebElement();
        element.elements.push(found);
        element.displayed = true;
        spyOn(element, 'findElements').and.callThrough();
        spyOn(element, 'isDisplayed').and.callThrough();
        spyOn(element, 'isEnabled').and.callThrough();
        spyOn(element, 'click').and.callThrough();

        let facets: IFacet[] = await IFacetProvider.process(element);
        let facet: IFacet = facets[0];

        let locator: FacetLocator = FacetLocator.css('div.fake');
        let foundFacet: IFacet[] = await facet.find(locator);
        let displayed: boolean = await facet.displayed();
        let enabled: boolean = await facet.enabled();
        await facet.click();

        expect(foundFacet[0].root).toEqual(found);
        expect(displayed).toBe(true);
        expect(enabled).toBe(false);

        expect(element.findElements).toHaveBeenCalledTimes(1);
        expect(element.isDisplayed).toHaveBeenCalledTimes(1);
        expect(element.isEnabled).toHaveBeenCalledTimes(1);
        expect(element.click).toHaveBeenCalledTimes(1);
    });
});