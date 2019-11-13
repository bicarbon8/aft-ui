import { IInitialiseOptions } from 'aft-core';
import { ISession } from '../sessions/isession';

export class WidgetOptions implements IInitialiseOptions {
    sessionManager: ISession;
    index: number = 0;
    maxWaitMs: number = 10000;
    cacheRootElement: boolean = false;
    
    constructor(sessionManager?: ISession) {
        this.sessionManager = sessionManager;
    }
}