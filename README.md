# AFT-UI
Automation Framework for Testing (AFT) package supporting UI testing using the Page Object Model (POM) to streamline UI test development and also supporting extension via plugins to support systems such as Selenium and Cypress.

*NOTE: support for Selenium, Cypress and any other frameworks are provided via their respective AFT packages*

## Page Object Model (POM)
![aft-ui-pom](aft-ui-pom.png)

the POM is a standard design pattern used in UI and layout testing. AFT-UI supports this model via a `Page` class that is made up of one or more `Widget` classes encapsulating logical blocks of functionality on the page. the `Widget` is then made up of one or more `IFacet` implementations. Take the following as an example of how one could interact with the following page https://the-internet.herokuapp.com/login

### Step 1: create the Page model class

```typescript
export class HerokuLoginPage extends Page {
    private content(): Promise<HerokuContentWidget> {
        return this.getWidget(HerokuContentWidget);
    }
    private messages(): Promise<HerokuMessagesWidget> {
        let wo: WidgetOptions = new WidgetOptions(this.session);
        wo.maxWaitMs = 20000;
        return this.getWidget(HerokuMessagesWidget, wo);
    }
    async navigateTo(): Promise<void> {
        await this.session.goTo('https://the-internet.herokuapp.com/login');
        return this.waitUntilDoneLoading();
    }
    async isDoneLoading(): Promise<boolean> {
        let hc: HerokuContentWidget = await this.content();
        return hc.isDoneLoading();
    }
    async login(username: string, password: string): Promise<void> {
        let hc: HerokuContentWidget = await this.content();
        return hc.login(username, password);
    }
    async hasMessage(): Promise<boolean> {
        let hm: HerokuMessagesWidget = await this.messages();
        return hm.hasMessage();
    }
    async getMessage(): Promise<string> {
        let hm: HerokuMessagesWidget = await this.messages();
        return hm.getMessage();
    }
}
```

### Step 2: create the Widgets

```typescript
export class HerokuContentWidget extends Widget {
    locator: FacetLocator = FacetLocator.id("content");

    private async usernameInput(): Promise<IFacet> {
        return this.findFirst(FacetLocator.id("username"));
    }
    private async passwordInput(): Promise<IFacet> {
        return this.findFirst(FacetLocator.id("password"));
    }
    private async loginButton(): Promise<IFacet> {
        return this.findFirst(FacetLocator.css("button.radius"));
    }
    async isDoneLoading(): Promise<boolean> {
        let ui: IFacet = await this.usernameInput();
        let pi: IFacet = await this.passwordInput();
        let lb: IFacet = await this.loginButton();
        let uiDisplayed: boolean = await ui.displayed();
        let piDisplayed: boolean = await pi.displayed();
        let lbDisplayed: boolean = await lb.displayed();
        return uiDisplayed && piDisplayed && lbDisplayed;
    }
    async login(username: string, password: string): Promise<void> {
        let ui: IFacet = await this.usernameInput();
        await ui.text(username);
        let pi: IFacet = await this.passwordInput();
        await pi.text(password);
        return this.clickSearchButton();
    }
    async clickSearchButton(): Promise<void> {
        let lb: IFacet = await this.loginButton();
        return lb.click();
    }
}
```
```typescript
export class HerokuMessagesWidget extends Widget {
    locator: FacetLocator = FacetLocator.id("flash-messages");
    private async message(): Promise<WebElement> {
        return this.findFirst(FacetLocator.id("flash"));
    }
    async isDoneLoading(): Promise<boolean> {
        return this.hasMessage();
    }
    async hasMessage(): Promise<boolean> {
        try {
            let el: IFacet = await this.message();
            return el !== undefined;
        } catch (e) {
            return false;
        }
    }
    async getMessage(): Promise<string> {
        let exists: boolean = await this.hasMessage();
        if (exists) {
            let el: IFacet = await this.message();
            return el.text();
        }
        return Promise.reject("no message could be found");
    }
}
```
### Step 3: use them to interact with the web application

```typescript
let session: ISession = await ISessionGenerator.get(); // creates new Browser session
let opts: WidgetOptions = new WidgetOptions(session);
let loginPage: HerokuLoginPage = new HerokuLoginBasePage(opts);
await loginPage.navigateTo(); // navigates to Heroku Login
await loginPage.login("tomsmith", "SuperSecretPassword!");
await Wait.forCondition(() => loginPage.hasMessage(), 20000);
let message: string = await loginPage.getMessage();
expect(message).toContain("You logged into a secure area!");
```

## Adding Plugins
plugins can be added to support frameworks such as Selenium and Cypress. Doing so involves a small amount of work to create the adapter layer, but afterwards should work identially between these different systems.

### Step 1: create an `ISessionGenerator` Plugin
the `ISession` is the system providing your UI session interface. In Selenium, this is the _WebDriver_. To create a new `ISession` implementation, first create the `ISessionGenerator` implementation which will return a new `ISession` implementation after calling the `ISession.initialise` method. See the below example on how to add support for using BrowserStack sessions:

```typescript
@ISessionGenerator.register
export class BrowserStackSessionGenerator implements ISessionGenerator {
    name: string = 'browserstack-session';
    async generate(options: SessionOptions): Promise<ISession> {
        let c: BrowserStackSession = new BrowserStackSession();
        await c.initialise(options);
        return c;
    }
}
```

### Step 2: create an `ISession` Implementation
the above `BrowserStackSessionGenerator` returns a `BrowserStackSession` referencing an active browser session. The code for this looks like:

```typescript
export class BrowserStackSession implements ISession, IDisposable {
    driver: WebDriver;
    async initialise(options: SessionOptions): Promise<void> {
        if (options.driver) {
            this.driver = options.driver as selenium.WebDriver;
        } else {
            let caps: selenium.Capabilities = new selenium.Capabilities();
            caps.set('browserName', options.platform.browser);
            caps.set('browser_version', options.platform.browserVersion);
            caps.set('os', options.platform.os);
            caps.set('os_version', options.platform.osVersion);
            caps.set('resolution', options.resolution);
            caps.set('browserstack.user', '[get_from_configuration]');
            caps.set('browserstack.key', '[get_from_configuration]'); 
            let driver: selenium.WebDriver;
            try {
                driver = await new selenium.Builder()
                .usingServer(await BrowserStackConfig.hubUrl())
                .withCapabilities(caps)
                .build();
                let options: selenium.Options = await driver.manage();
                options.setTimeouts({implicit: 1000});
                await options.window().maximize();
            } catch (e) {
                return Promise.reject(e);
            }
            this.driver = driver;
        }
    }
    async dispose(e?: Error) {
        try {
            await this.driver.close();
            await this.driver.quit();
        } catch (e) {
            console.log(e);
        }
    }
    async find(locator: FacetLocator): Promise<IFacet[]> {
        try {
            let loc: selenium.By = this.getByForFacetLocator(locator);
            let elements: selenium.WebElement[] = await this.driver.findElements(loc);
            let facets: IFacet[] = [];
            let elements: selenium.WebElement[] = await this.driver.findElements(loc);
            for (var i=0; i<elements.length; i++) {
                let el: selenium.WebElement = elements[i];
                let index: number = i;
                let f: SeleniumFacet = new SeleniumFacet(async (): Promise<selenium.WebElement> => {
                    return await this.driver.findElements(loc)[index];
                });
                f.cachedRoot = el;
                facets.push(f);
            }
            return facets;
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async goTo(url: string): Promise<void> {
        try {
            await this.driver.get(url);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
```

### Step 3: create an `IFacet` implementation
the last step is to provide the `IFacet` implementation adapter for interacting with the elements on the page. This will look like the below:

```typescript
export class SeleniumFacet implements IFacet {
    deferredRoot: Func<void, Promise<selenium.WebElement>>;
    cachedRoot: selenium.WebElement;
    constructor(deferredRoot: Func<void, Promise<selenium.WebElement>>) {
        this.deferredRoot = deferredRoot;
    }
    async find(locator: FacetLocator): Promise<IFacet[]> {
        try {
            let loc: selenium.By = this.getByForFacetLocator(locator);
            let elements: selenium.WebElement[] = await this.getRootElement().then((r) => r.findElements(loc));
            let facets: IFacet[] = [];
            for (var i=0; i<elements.length; i++) {
                let el: selenium.WebElement = elements[i];
                let index: number = i;
                let f: SeleniumFacet = new SeleniumFacet(async (): Promise<selenium.WebElement> => {
                    return await this.getRootElement().then((r) => r.findElements(loc)[index]);
                });
                f.cachedRoot = el;
                facets.push(f);
            }
            return facets;
        } catch (e) {
            return Promise.reject(e);
        }
    }
    async enabled(): Promise<boolean> {
        return await this.getRootElement().then((r) => r.isEnabled());
    }
    async displayed(): Promise<boolean> {
        return await this.getRootElement().then((r) => r.isDisplayed());
    }
    async click(): Promise<void> {
        await this.getRootElement().then((r) => r.click());
    }
    async text(input?: string): Promise<string> {
        if (input) {
            this.getRootElement().then((r) => r.sendKeys(input));
            return this.getRootElement().then((r) => r.getAttribute('value'));
        }
        return await this.getRootElement().then((r) => r.getText());
    }
    async attribute(key: string): Promise<string> {
        return await this.getRootElement().then((r) => r.getAttribute(key));
    }
    private async getRootElement(): Promise<selenium.WebElement> {
        if (!this.cachedRoot) {
            this.cachedRoot = await Promise.resolve(this.deferredRoot());
        } else {
            try {
                // ensure cachedRoot is not stale
                await this.cachedRoot.isDisplayed();
            } catch (e) {
                this.cachedRoot = null;
                return await this.getRootElement();
            }
        }
        return this.cachedRoot;
    }
}
```