import { TestPlatform } from "../configuration/test-platform";
import { TestLog } from "aft-core";

export class SessionOptions {
    driver: any;
    resolution: string = '1024x768';
    platform: TestPlatform;
    logger: TestLog;
    provider: string;
    useVpn: boolean;
    additionalCapabilities: {};

    constructor(driver?: any) {
        this.driver = driver;
    }
}