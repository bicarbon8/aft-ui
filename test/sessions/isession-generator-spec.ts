import { ISessionGenerator } from "../../src/sessions/isession-generator";
import { SessionOptions } from "../../src/sessions/session-options";
import { UiConfig } from "../../src/configuration/ui-config";
import { FakeSession } from "./fake-session";
import './fake-session-generator';

describe('ISessionGenerator', () => {
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
});