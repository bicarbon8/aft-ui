import { TestConfig } from "aft-core";
import { TestPlatform } from "./test-platform";

export module UiConfig {
    export const SESSION_PROVIDER_KEY = 'session_provider';
    export const TEST_PLATFORM_KEY = 'test_platform';
    
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
        let platformStr = await TestConfig.getValueOrDefault('test_platform');
        return TestPlatform.parse(platformStr);
    }
}