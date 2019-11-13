import { ISessionGenerator } from "../../src/sessions/isession-generator";
import { FakeSession } from "./fake-session";
import { SessionOptions } from "../../src/sessions/session-options";
import { ISession } from "../../src/sessions/isession";

@ISessionGenerator.register
export class FakeSessionGenerator implements ISessionGenerator {
    provides: string = FakeSession.name;
    
    async generate(options: SessionOptions): Promise<ISession> {
        let c: FakeSession = new FakeSession();
        await c.initialise(options);
        return c;
    }
}