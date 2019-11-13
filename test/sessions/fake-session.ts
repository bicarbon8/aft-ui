import { ISession } from "../../src/sessions/isession";
import { SessionOptions } from "../../src/sessions/session-options";

export class FakeSession implements ISession {
    options: SessionOptions;
    
    async initialise(options: SessionOptions): Promise<void> {
        this.options = options;
    }
    
    async find(locator: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    
    async goTo(location: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async dispose(err?: Error): Promise<void> {
        /* do nothing */
    }
}