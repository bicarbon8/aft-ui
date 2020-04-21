import { TestLog } from 'aft-core';
import { ISession } from '../sessions/isession';
import { IFacet } from './ifacet';

export interface IFacetOptions {
    logger: TestLog;
    locator: any;
    index: number;
    maxWaitMs: number;
    root: Promise<any>;
    parent: Promise<ISession<any, any, any> | IFacet<any, any, any>>;
}