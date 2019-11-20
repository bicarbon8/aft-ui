import { AbstractWidget } from "../../src/containers/abstract-widget";
import { FacetLocator } from "../../src/containers/facet-locator";
import { IFacet } from "../../src";

export class FakeWidget extends AbstractWidget {
    locator: FacetLocator = FacetLocator.css('div.fake1');
    done: boolean = true;

    async getDivFake2(): Promise<IFacet> {
        return await this.findFirst(FacetLocator.css('div.fake2'));
    }

    async getSubWidget(): Promise<FakeWidget> {
        return await this.getWidget(FakeWidget);
    }

    async isDoneLoading(): Promise<boolean> {
        return this.done && await this.getRoot().then((r) => r.displayed());
    }
}