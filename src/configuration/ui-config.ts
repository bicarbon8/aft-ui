import { TestConfig } from "aft-core";
import { TestPlatform } from "./test-platform";

export module UiConfig {
    export const SESSION_PROVIDER_KEY = 'session_provider';
    export const TEST_PLATFORM_KEY = 'test_platform';
    export const LOAD_WAIT_DURATION_KEY = 'load_wait_duration';
    export const DISABLE_ROOT_CACHING_KEY = 'disable_root_caching';
    
    export async function provider(provider?: string): Promise<string> {
        if (provider) {
            TestConfig.setGlobalValue(SESSION_PROVIDER_KEY, provider);
        }
        return await TestConfig.getValueOrDefault(SESSION_PROVIDER_KEY);
    }

    export async function platform(plt?: TestPlatform): Promise<TestPlatform> {
        if (plt) {
            TestConfig.setGlobalValue(TEST_PLATFORM_KEY, plt.toString());
        }
        let platformStr = await TestConfig.getValueOrDefault(TEST_PLATFORM_KEY);
        return TestPlatform.parse(platformStr);
    }

    export async function loadWaitDuration(durationMs?: number): Promise<number> {
        if (durationMs) {
            TestConfig.setGlobalValue(LOAD_WAIT_DURATION_KEY, durationMs.toString());
        }
        let durationStr: string = await TestConfig.getValueOrDefault(LOAD_WAIT_DURATION_KEY, '10000');
        return +durationStr;
    }
}