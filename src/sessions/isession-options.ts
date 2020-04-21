import { TestPlatform } from "../configuration/test-platform";
import { TestLog } from "aft-core";

export interface ISessionOptions {
    /**
     * [OPTIONAL] allows for directly supplying an existing driver
     * rather than having the ISession implementation create a new
     * instance. useful for sharing running sessions between tests.
     */
    driver: any;
    /**
     * [OPTIONAL] allows for specifying the OS, OS Version, Browser,
     * Browser Version and Device Name to be used. If not set, the
     * SessionGenerator will inject the value from UiConfig.platform()
     */
    platform: TestPlatform;
    /**
     * [OPTIONAL] allows for specifying an existing TestLog instance
     * to be used. If not specified a new instance may be created
     * inside of the ISession implementation for use
     */
    logger: TestLog;
    /**
     * [OPTIONAL] allows for specifying the file containing your
     * ISession implementation. If not specified, the SessionGenerator
     * will inject the value from UiConfig.provider()
     */
    provider: string;
}