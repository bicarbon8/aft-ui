import { SessionGenerator } from "../../src/sessions/session-generator";
import { ISessionOptions } from "../../src/sessions/isession-options";
import { UiConfig } from "../../src/configuration/ui-config";
import { FakeSession } from "./fake-session";
import { SessionTestHelper } from "./session-test-helper";
import { TestPlatform } from "../../src";

describe('SessionGenerator', () => {
    beforeEach(() => {
        SessionTestHelper.reset();
    });
    
    it('can get session by name', async () => {
        let opts: ISessionOptions = {
            provider: './dist/test/sessions/fake-session'
        } as ISessionOptions;

        let fs: FakeSession = await SessionGenerator.get(opts) as FakeSession;

        expect(fs).not.toBeNull();
        expect(fs).not.toBeUndefined();
        expect(await fs.getLogger()).not.toBeUndefined();
        expect(await fs.getPlatform()).not.toBeUndefined();
    });

    it('can get session by configuration when no ISessionOptions provided', async () => {
        let provider: string = './dist/test/sessions/fake-session';
        let providerSpy = spyOn(UiConfig, 'provider').and.returnValue(Promise.resolve(provider));

        let fs: FakeSession = await SessionGenerator.get() as FakeSession;

        expect(fs).not.toBeNull();
        expect(fs).not.toBeUndefined();
        expect(providerSpy).toHaveBeenCalled();
    });

    it('Promise rejected if named session provider not found', async () => {
        let opts: ISessionOptions = {
            provider: 'nonexisting'
        } as ISessionOptions;

        try {
            await SessionGenerator.get(opts);
            /* not expected */
            expect(true).toEqual(false);
        } catch (e) {
            /* expected because no mafshing generator could be found */
            expect(e).not.toBeUndefined();
            expect(e).toEqual(`no ISession implementation named '${opts.provider}' could be found`);
        }
    });

    it('handles exceptions thrown by ISession implementations', async () => {
        let opts: ISessionOptions = {
            provider: './dist/test/sessions/fake-session-throwsoninit'
        } as ISessionOptions;

        try {
            await SessionGenerator.get(opts);
            /* not expected */
            expect(true).toEqual(false);
        } catch (e) {
            /* expected because mafshing ISession threw exception on call to 'initialise' */
            expect(e).not.toBeUndefined();
            expect(e.toString()).toEqual('Error: Method not implemented.');
            expect(SessionTestHelper.options[0]).toEqual(opts);
        }
    });

    it('sets the value of ISessionOptions.provider if not set', async () => {
        let platform: TestPlatform = new TestPlatform('windows','10','chrome');
        let opts: ISessionOptions = {
            platform: platform
        } as ISessionOptions;
        let provider: string = './dist/test/sessions/fake-session';
        let providerSpy = spyOn(UiConfig, 'provider').and.returnValue(Promise.resolve(provider));

        let fs: FakeSession = await SessionGenerator.get(opts) as FakeSession;

        expect(fs).not.toBeNull();
        expect(fs).not.toBeUndefined();
        expect(await fs.getPlatform().then((p) => {return p.toString();})).toEqual(platform.toString());
        expect(providerSpy).toHaveBeenCalled();
    });

    it('sets the value of ISessionOptions.platform if not set', async () => {
        let provider: string = './dist/test/sessions/fake-session';
        let opts: ISessionOptions = {
            provider: provider
        } as ISessionOptions;
        let platform: TestPlatform = new TestPlatform('windows','10','chrome');
        let platformSpy = spyOn(UiConfig, 'platform').and.returnValue(Promise.resolve(platform));

        let fs: FakeSession = await SessionGenerator.get(opts) as FakeSession;

        expect(fs).not.toBeNull();
        expect(fs).not.toBeUndefined();
        expect(await fs.getPlatform().then((p) => {return p.toString();})).toEqual(platform.toString());
        expect(platformSpy).toHaveBeenCalled();
    });
});