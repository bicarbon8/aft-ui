import { ISessionGenerator } from "../../src/sessions/isession-generator";
import { SessionOptions } from "../../src/sessions/session-options";
import { UiConfig } from "../../src/configuration/ui-config";
import { FakeSession } from "./fake-session";
import './fake-session-generator';
import { ISession } from "../../src/sessions/isession";

describe('ISessionGenerator', () => {
    beforeEach(() => {
        TestHelper.reset();
    });
    
    it('can get session by name', async () => {
        let opts: SessionOptions = new SessionOptions();
        opts.provider = FakeSession.name;

        let tc: FakeSession = await ISessionGenerator.get(opts) as FakeSession;

        expect(tc).not.toBeNull();
        expect(tc).not.toBeUndefined();
        expect(tc.options).not.toBeUndefined();
        expect(tc.options.provider).toEqual(opts.provider);
    });

    it('can get session by configuration', async () => {
        let provider: string = FakeSession.name;
        UiConfig.provider(provider);

        let tc: FakeSession = await ISessionGenerator.get() as FakeSession;

        expect(tc).not.toBeNull();
        expect(tc).not.toBeUndefined();
        expect(tc.options).not.toBeUndefined();
        expect(tc.options.provider).toEqual(provider);
    });

    it('Promise rejected if named session provider not found', async () => {
        let opts: SessionOptions = new SessionOptions();
        opts.provider = 'nonexisting';

        try {
            await ISessionGenerator.get(opts);
            /* not expected */
            expect(true).toEqual(false);
        } catch (e) {
            /* expected because no matching generator could be found */
            expect(e).not.toBeUndefined();
            expect(e).toEqual(`no ISessionGenerator named '${opts.provider}' could be found`);
        }
    });

    it('handles exceptions thrown by ISessionGenerator implementations', async () => {
        let opts: SessionOptions = new SessionOptions();
        opts.provider = 'DummySession';

        try {
            await ISessionGenerator.get(opts);
            /* not expected */
            expect(true).toEqual(false);
        } catch (e) {
            /* expected because matching generator threw exception on call to 'generate' */
            expect(e).not.toBeUndefined();
            expect(e).toEqual(`no ISessionGenerator named '${opts.provider}' could be found`);
            expect(TestHelper.options[0]).toEqual(opts);
        }
    });
});

@ISessionGenerator.register
class FakeSessionGeneratorThrows implements ISessionGenerator {
    provides: string = 'DummySession';
    
    generate(options: SessionOptions): Promise<ISession> {
        TestHelper.generateCalledWith(options);
        throw new Error("Method not implemented.");
    }
}

module TestHelper {
    export var options: SessionOptions[] = [];

    export function generateCalledWith(opts: SessionOptions): void {
        options.push(opts);
    }

    export function reset(): void {
        options = [];
    }
}