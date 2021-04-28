# AFT-UI
Automation Framework for Testing (AFT) package supporting UI testing using the Page Object Model (POM) to streamline UI test development and also supporting extension via plugins to support systems such as Selenium and Cypress.

## Page Object Model (POM)
the POM is a standard design pattern used in UI and layout testing. AFT-UI supports this model via a `IFacet<driver, element, locator>` class that is made up of one or more `IFacet<driver, element, locator>` classes and / or `WebElements` encapsulating logical blocks of functionality on the page. The `aft-ui` package supports development of libraries used to generate UI test sessions (via the `SessionGeneratorPluginManager`, `AbstractSessionGeneratorPlugin` classes and `ISession` interface).

### Creating a Session Generator Plugin (Selenium)
the `AbstractSessionGeneratorPlugin<driver, element, locator>` implementation is responsible for creating new UI session instances (classes extending from `ISession<driver, element, locator>`)

```typescript
export interface SeleniumSessionGeneratorPluginOptions extends ISessionGeneratorPluginOptions { 
    url?: string;
    capabilities?: {};
}

export class SeleniumSessionGeneratorPlugin extends AbstractSessionGeneratorPlugin<WebDriver, WebElement, Locator> {
    constructor(options?: SeleniumSessionGeneratorPluginOptions) {
        super('seleniumsessiongeneratorplugin', options);
    }
    async onLoad(): Promise<void> {
        /* do nothing */
    }
    async newSession<T extends ISession<FakeDriver, FakeWebElement, FakeLocator>>(options?: ISessionOptions<FakeDriver>): Promise<T> {
        if (await this.enabled()) {
            if (!options?.driver) {
                try {
                    let url: string = options?.url || 'http://127.0.0.1:4444/';
                    let caps: Capabilities = new Capabilities(options?.capabilities || {});
                    let driver: WebDriver = await new Builder()
                        .usingServer(url)
                        .withCapabilities(caps)
                        .build();
                    await driver.manage().setTimeouts({implicit: 1000});
                    await driver.manage().window().maximize();
                    return new SeleniumSession({
                        driver: driver,
                        logMgr: options?.logMgr || this.logMgr
                    }) as unknown as T;
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            return new SeleniumSession({driver: options.driver, logMgr: options.logMgr || this.logMgr}) as unknown as T;
        }
        return null;
    }
    async dispose(error?: Error): Promise<void> {
        /* do nothing */
    }
}
```

### Create an ISession implementation (Selenium)
the `ISession<driver, element, locator>` implementation is used to keep reference to the running UI session as well as to create instances of the logical UI groups (`IFacet<driver, element locator>`)

```typescript
export interface SeleniumSessionOptions extends ISessionOptions<WebDriver> {
    /* add any additional options your session requires */
}

export class SeleniumSession implements ISession<WebDriver, WebElement, Locator> {
    readonly driver: WebDriver;
    readonly logMgr: LoggingPluginManager;
    constructor(options: SeleniumSessionOptions) {
        this.driver = options.driver;
        this.logMgr = options.logMgr || new LoggingPluginManager({logName: `SeleniumSession_${this.driver.getSession().then((s) => s.getId())}`});
    }
    async getFacet<T extends IFacet<WebDriver, WebElement, Locator>>(facetType: new (options: IFacetOptions<WebDriver, WebElement, Locator>) => T, options?: IFacetOptions<WebDriver, WebElement, Locator>): Promise<T> {
        options = options || {};
        options.session = options.session || this;
        options.logMgr = options.logMgr || this.logMgr;
        let facet: T = new facetType(options);
        return facet;
    }
    async goTo(url: string): Promise<void> {
        try {
            await this.driver?.get(url);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async refresh(): Promise<void> {
        try {
            await this.driver?.navigate().refresh();
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async resize(width: number, height: number): Promise<void> {
        try {
            await this.driver?.manage().window().setSize(width, height);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async dispose(error?: Error): Promise<void> {
        if (error) {
            this.logMgr.warn(`Error: SeleniumSession - ${error.message}`);
        }
        this.logMgr.trace(`shutting down SeleniumSession: ${await this.driver?.getSession().then((s) => s.getId())}`);
        await this.driver?.quit();
    }
}
```

### Create an IFacet implementation (Selenium)
the `IFacet<driver, element, locator>` represents a logical container / section of the UI and is responsible for providing a resilient lookup mechanism for sub-facets or individual elements in the UI
```typescript
export interface SeleniumFacetOptions extends IFacetOptions<WebDriver, WebElement, Locator> {
    /* any additional options for your facets */
}

export class SeleniumFacet extends AbstractFacet<WebDriver, WebElement, Locator> {
    async getElements(options: IElementOptions<Locator>): Promise<WebElement[]> {
        let elements: WebElement[]
        await wait.untilTrue(async () => {
            elements = await this.getRoot().then(async (r) => {
                return await r.findElements(options.locator);
            });
            return elements.length > 0;
        }, options.maxWaitMs || 0);
        return elements;
    }
    async getElement(options: IElementOptions<Locator>): Promise<WebElement> {
        let element: WebElement;
        await wait.untilTrue(async () => {
            element = await this.getRoot().then(async (r) => {
                return await r.findElement(options.locator);
            });
            return !!element;
        }, options.maxWaitMs || 0);
        return element;
    }
    async getFacet<T extends IFacet<WebDriver, WebElement, Locator>>(facetType: new (options: IFacetOptions<WebDriver, WebElement, Locator>) => T, options?: IFacetOptions<WebDriver, WebElement, Locator>): Promise<T> {
        options = options || {} as IFacetOptions<WebDriver, WebElement, Locator>;
        options.parent = options?.parent || this;
        options.session = options?.session || this.session;
        options.logMgr = options?.logMgr || this.logMgr;
        options.maxWaitMs = options?.maxWaitMs || this.maxWaitMs;
        let facet: T = new facetType(options);
        return facet;
    }
    async getRoot(): Promise<WebElement>  {
        let el: WebElement;
        await wait.untilTrue(async () => {
            let parent = this.parent;
            if (parent) {
                let els: WebElement[] = await parent.getRoot()
                    .then((root) => root.findElements(this.locator));
                el = els[this.index];
            } else {
                let els: WebElement[] = await this.session.driver.findElements(this.locator);
                el = els[this.index];
            }
            if (el) {
                return true;
            }
            return false;
        }, this.maxWaitMs);
        return el;
    }
}
```