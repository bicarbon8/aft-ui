import { IInitialiseOptions } from 'aft-core';
import { ISession } from '../sessions/isession';
import { IFacet } from './ifacet';

export class ContainerOptions implements IInitialiseOptions {
    parent: IFacet | ISession;
    index: number = 0;
    maxWaitMs: number = 10000;
    cacheRootElement: boolean = false;
    
    constructor(parent?: IFacet | ISession) {
        this.parent = parent;
    }
}