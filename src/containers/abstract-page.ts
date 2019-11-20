import {AbstractWidget} from './abstract-widget'
import { FacetLocator } from './facet-locator';

export abstract class AbstractPage extends AbstractWidget {
    abstract async navigateTo(): Promise<void>;

    locator: FacetLocator = FacetLocator.css("html");
}