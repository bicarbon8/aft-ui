import {Widget} from './widget'
import { FacetLocator } from './facet-locator';

export abstract class Page extends Widget {
    abstract async navigateTo(): Promise<void>;

    locator: FacetLocator = FacetLocator.css("html");
}