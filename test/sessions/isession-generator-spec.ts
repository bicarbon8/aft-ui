import { SessionGenerator } from "../../src/sessions/session-generator";
import { SessionOptions } from "../../src/sessions/session-options";
import { UiConfig } from "../../src/configuration/ui-config";
import { FakeSession } from "./fake-session";
import { SessionTestHelper } from "./session-test-helper";

describe('SessionGenerator', () => {
    beforeEach(() => {
        SessionTestHelper.reset();
    });
    
    it('can get session by name', async () => {
        let opts: SessionOptions = new SessionOptions();
        opts.provider = './dist/test/sessions/fake-session';

        let tc: FakeSession = await SessionGenerator.get(opts) as FakeSession;

        expect(tc).not.toBeNull();
        expect(tc).not.toBeUndefined();
        expect(tc.options).not.toBeUndefined();
        expect(tc.options.provider).toEqual(opts.provider);
    });

    it('can get session by configuration', async () => {
        let provider: string = './dist/test/sessions/fake-session';
        UiConfig.provider(provider);

        let tc: FakeSession = await SessionGenerator.get() as FakeSession;

        expect(tc).not.toBeNull();
        expect(tc).not.toBeUndefined();
        expect(tc.options).not.toBeUndefined();
        expect(tc.options.provider).toEqual(provider);
    });

    it('Promise rejected if named session provider not found', async () => {
        let opts: SessionOptions = new SessionOptions();
        opts.provider = 'nonexisting';

        try {
            await SessionGenerator.get(opts);
            /* not expected */
            expect(true).toEqual(false);
        } catch (e) {
            /* expected because no matching generator could be found */
            expect(e).not.toBeUndefined();
            expect(e).toEqual(`no ISession implementation named '${opts.provider}' could be found`);
        }
    });

    it('handles exceptions thrown by ISession implementations', async () => {
        let opts: SessionOptions = new SessionOptions();
        opts.provider = './dist/test/sessions/fake-session-throwsoninit';

        try {
            await SessionGenerator.get(opts);
            /* not expected */
            expect(true).toEqual(false);
        } catch (e) {
            /* expected because matching ISession threw exception on call to 'initialise' */
            expect(e).not.toBeUndefined();
            expect(e.toString()).toEqual('Error: Method not implemented.');
            expect(SessionTestHelper.options[0]).toEqual(opts);
        }
    });
});