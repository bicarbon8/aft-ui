import { FakeSession } from "./fake-session";
import { testdata } from "./test-data-helper";
import { AbstractSessionGeneratorPlugin, ISession, SessionGeneratorPluginManager, TestPlatform } from "../../src";
import { FakeDriver } from "./fake-driver";
import { aftconfigMgr, IPluginManagerOptions, OptionsManager, rand } from "aft-core";
import { nameof } from "ts-simple-nameof";

describe('SessionGeneratorPluginManager', () => {
    beforeEach(() => {
        testdata.reset();
    });
    
    it('can load session plugin by name', async () => {
        let mgr: SessionGeneratorPluginManager = new SessionGeneratorPluginManager({pluginNames: ['fake-session-generator-plugin']});
        let fs: ISession = await mgr.newSession();

        expect(fs).toBeDefined();
        expect(fs.driver).toBeDefined();
        expect(fs.driver instanceof FakeDriver).toBeTruthy();
    });

    it('Promise rejected if named session provider not found', async () => {
        let provider: string = 'nonexisting';
        let mgr: SessionGeneratorPluginManager = new SessionGeneratorPluginManager({pluginNames: [provider]});
        await mgr.newSession()
            .then((session) => {
                /* not expected */
                expect(true).toEqual(false);
            }).catch((reason) => {
                expect(reason).toEqual(`no enabled AbstractSessionGeneratorPlugin implementation could be found in: [${provider}]`);
            });
    });

    it('handles exceptions thrown by ISession implementations', async () => {
        let provider: string = 'fake-session-generator-plugin-throws';
        let mgr: SessionGeneratorPluginManager = new SessionGeneratorPluginManager({pluginNames: [provider]});
        await mgr.newSession()
            .then((session) => {
                /* not expected */
                expect(true).toEqual(false);
            }).catch((reason: Error) => {
                expect(reason.message).toEqual('Method not implemented.');
                expect(testdata.get('constructor')).toBeDefined();
                expect(testdata.get<IPluginManagerOptions>('constructor').pluginNames).toContain(provider);
            });
    });

    it('sets the provider from aftconfig.json if not sent in options', async () => {
        let platform: TestPlatform = new TestPlatform({os: 'windows', osVersion: '10', browser: 'chrome'});
        let provider: string = 'fake-session-generator-plugin';
        let configKey: string = rand.getString(15);
        await aftconfigMgr.aftConfig().then((config) => {
            config[configKey] = {
                "pluginNames": [provider]
            }
        });
        let customOptMgr: OptionsManager = new OptionsManager(configKey);

        let mgr: SessionGeneratorPluginManager = new SessionGeneratorPluginManager({platform: platform, _optMgr: customOptMgr});
        let fs: ISession = await mgr.newSession();

        expect(fs).toBeDefined();
        expect(fs instanceof FakeSession).toBeTruthy();
    });
});