import { IInitialiseOptions } from 'aft-core';
import { ISession } from '../sessions/isession';

export class ContainerOptions implements IInitialiseOptions {
    session: ISession;
    index: number = 0;
    maxWaitMs: number = 10000;
    cacheRootElement: boolean = false;
    
    constructor(session?: ISession) {
        this.session = session;
    }
}