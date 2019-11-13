import { IFacetProvider } from "../../src/containers/ifacet-provider";
import { IFacet } from "../../src/containers/ifacet";
import { WebElement, By } from "selenium-webdriver";
import './fake-facet-provider';
import { FacetLocator } from "../../src/containers/facet-locator";

describe('IFacetProvider', () => {
    it('can convert element using provider supporting supplied type', async () => {
        let element: WebElement = jasmine.createSpyObj('WebElement', {
            'findElements': new Promise<WebElement[]>((resolve, reject) => {
                resolve([]);
            }), 
            'isDisplayed': new Promise((resolve, reject) => {
                resolve(true);
            }), 
            'isEnabled': new Promise((resolve, reject) => {
                resolve(true);
            }), 
            'click': new Promise((resolve, reject) => {
                resolve();
            })
        });

        let facets: IFacet[] = await IFacetProvider.process(element);

        expect(facets.length).toBe(1);
        expect(facets[0].root).toBe(element);
    });

    it('can call methods on IFacet.root indirectly', async () => {
        let found: WebElement = jasmine.createSpyObj('WebElement', {
            'findElements': new Promise<WebElement[]>((resolve, reject) => {
                resolve([]);
            }), 
            'isDisplayed': new Promise((resolve, reject) => {
                resolve(true);
            }), 
            'isEnabled': new Promise((resolve, reject) => {
                resolve(true);
            }), 
            'click': new Promise((resolve, reject) => {
                resolve();
            })
        });
        let element: WebElement = jasmine.createSpyObj('WebElement', {
            'findElements': new Promise<WebElement[]>((resolve, reject) => {
                resolve([found]);
            }), 
            'isDisplayed': new Promise((resolve, reject) => {
                resolve(true);
            }), 
            'isEnabled': new Promise((resolve, reject) => {
                resolve(false);
            }), 
            'click': new Promise((resolve, reject) => {
                resolve();
            })
        });

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