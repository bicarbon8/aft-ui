import { IFacet } from "./ifacet";

export interface IFacetProvider {
    name: string;
    supports(element: any): Promise<boolean>;
    provide(element: any): Promise<IFacet>;
}

export namespace IFacetProvider {
    type Constructor<T> = {
        new (...args: any[]): T;
        readonly prototype: T;
    }
    const providers: IFacetProvider[] = [];
    export async function process(...elements: any[]): Promise<IFacet[]> {
        if (elements && elements.length > 0) {
            let facets: IFacet[] = [];
            let element = elements[0];
            for (var i=0; i<providers.length; i++) {
                let provider: IFacetProvider = providers[i];
                if (await provider.supports(element)) {
                    for (var j=0; j<elements.length; j++) {
                        facets.push(await provider.provide(elements[j]));
                    }
                    break;
                }
            }
            if (elements.length != facets.length) {
                return Promise.reject('no provider found for supplied element type(s)');
            }
            return facets;
        }
        return Promise.reject('no elements supplied to process');
    }
    export function register<T extends Constructor<IFacetProvider>>(ctor: T) {
        providers.push(new ctor());
        return ctor;
    }
}